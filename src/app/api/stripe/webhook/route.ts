import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { serverConvex } from "@/lib/billing-server";
import { api } from "@/../convex/_generated/api";
import { buildCreditsPurchaseEmailJob, resolvePackDisplayName } from "@/lib/email/purchase-confirmation";
import { sendTransactionalEmail } from "@/lib/email/smtp2go";
import { brand } from "@/lib/brand";
import { log } from "@/lib/logger";

const stripeAccessKey = process.env.STRIPE_INTERNAL_SECRET?.trim() || "";

async function finalizeFromSession(session: Stripe.Checkout.Session) {
  const stripe = getStripe();
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  const paymentIntent = paymentIntentId
    ? await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge", "invoice"] })
    : null;
  const latestCharge = paymentIntent && typeof paymentIntent.latest_charge === "object" ? paymentIntent.latest_charge : null;
  const invoiceValue = paymentIntent ? (paymentIntent as unknown as { invoice?: Stripe.Invoice | string | null }).invoice : null;
  const invoice = invoiceValue && typeof invoiceValue === "object" ? invoiceValue : null;

  return await serverConvex.mutation(api.billing.finalizeCheckoutSecure, {
    access_key: stripeAccessKey,
    stripe_checkout_session_id: session.id,
    stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripe_payment_intent_id: paymentIntent?.id,
    stripe_charge_id: latestCharge?.id,
    stripe_invoice_id: invoice?.id,
    receipt_url: latestCharge?.receipt_url || undefined,
    invoice_url: invoice?.hosted_invoice_url || undefined,
    invoice_pdf_url: invoice?.invoice_pdf || undefined,
    amount_cents: session.amount_total || 0,
    currency: session.currency || "eur",
    metadata: { source: "webhook" },
  });
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = getStripeWebhookSecret();

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook signature missing" }, { status: 400 });
  }

  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      const result = await finalizeFromSession(session);
      const emailJob = buildCreditsPurchaseEmailJob({
        alreadyCompleted: result.alreadyCompleted,
        userEmail: result.userEmail,
        credits: result.credits,
        packName: resolvePackDisplayName(result.packSlug),
        actionUrl: `${brand.appUrl}/settings#credits`,
      });

      if (emailJob) {
        try {
          await sendTransactionalEmail(emailJob);
        } catch (error) {
          log.warn("API", "[STRIPE_WEBHOOK] Compra procesada pero correo no enviado", {
            error: error instanceof Error ? error.message : String(error),
            sessionId: session.id,
          });
        }
      }

      await serverConvex.mutation(api.billing.recordStripeEventSecure, {
        access_key: stripeAccessKey,
        stripe_event_id: event.id,
        type: event.type,
        status: "processed",
        stripe_object_id: session.id,
        related_purchase_id: result.purchaseId,
        payload: { session_id: session.id },
      });
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await serverConvex.mutation(api.billing.markPurchaseStatusSecure, {
        access_key: stripeAccessKey,
        stripe_checkout_session_id: session.id,
        status: "expired",
        metadata: { source: "webhook" },
      });
      await serverConvex.mutation(api.billing.recordStripeEventSecure, {
        access_key: stripeAccessKey,
        stripe_event_id: event.id,
        type: event.type,
        status: "processed",
        stripe_object_id: session.id,
        payload: { session_id: session.id },
      });
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await serverConvex.mutation(api.billing.markPurchaseStatusSecure, {
        access_key: stripeAccessKey,
        stripe_payment_intent_id: paymentIntent.id,
        status: "failed",
        error_message: paymentIntent.last_payment_error?.message,
        metadata: { source: "webhook" },
      });
      await serverConvex.mutation(api.billing.recordStripeEventSecure, {
        access_key: stripeAccessKey,
        stripe_event_id: event.id,
        type: event.type,
        status: "processed",
        stripe_object_id: paymentIntent.id,
        payload: { payment_intent_id: paymentIntent.id },
      });
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const purchaseId = await serverConvex.mutation(api.billing.markPurchaseRefundedSecure, {
        access_key: stripeAccessKey,
        stripe_charge_id: charge.id,
        metadata: { source: "webhook", amount_refunded: charge.amount_refunded },
      });
      await serverConvex.mutation(api.billing.recordStripeEventSecure, {
        access_key: stripeAccessKey,
        stripe_event_id: event.id,
        type: event.type,
        status: "processed",
        stripe_object_id: charge.id,
        related_purchase_id: purchaseId || undefined,
        payload: { charge_id: charge.id },
      });
    } else {
      await serverConvex.mutation(api.billing.recordStripeEventSecure, {
        access_key: stripeAccessKey,
        stripe_event_id: event.id,
        type: event.type,
        status: "ignored",
        stripe_object_id: typeof event.data.object === "object" && event.data.object && "id" in event.data.object ? String((event.data.object as { id?: string }).id || "") : undefined,
        payload: {},
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing error";
    await serverConvex.mutation(api.billing.recordStripeEventSecure, {
      access_key: stripeAccessKey,
      stripe_event_id: event.id,
      type: event.type,
      status: "failed",
      stripe_object_id: typeof event.data.object === "object" && event.data.object && "id" in event.data.object ? String((event.data.object as { id?: string }).id || "") : undefined,
      payload: {},
      error_message: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
