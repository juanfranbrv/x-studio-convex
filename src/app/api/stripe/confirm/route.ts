import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { serverConvex } from "@/lib/billing-server";
import { api } from "@/../convex/_generated/api";
import { buildCreditsPurchaseEmailJob, resolvePackDisplayName } from "@/lib/email/purchase-confirmation";
import { sendTransactionalEmail } from "@/lib/email/smtp2go";
import { log } from "@/lib/logger";

const stripeAccessKey = process.env.STRIPE_INTERNAL_SECRET?.trim() || "";

async function extractReceiptDetails(stripe: ReturnType<typeof getStripe>, paymentIntentId?: string | null) {
  if (!paymentIntentId) {
    return {
      paymentIntentId: undefined,
      chargeId: undefined,
      receiptUrl: undefined,
      invoiceId: undefined,
      invoiceUrl: undefined,
      invoicePdfUrl: undefined,
    };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge", "invoice"],
  });

  const latestCharge = typeof paymentIntent.latest_charge === "object" && paymentIntent.latest_charge ? paymentIntent.latest_charge : null;
  const invoiceValue = (paymentIntent as unknown as { invoice?: Stripe.Invoice | string | null }).invoice;
  const invoice = typeof invoiceValue === "object" && invoiceValue ? invoiceValue : null;

  return {
    paymentIntentId: paymentIntent.id,
    chargeId: latestCharge?.id,
    receiptUrl: latestCharge?.receipt_url || undefined,
    invoiceId: invoice?.id,
    invoiceUrl: invoice?.hosted_invoice_url || undefined,
    invoicePdfUrl: invoice?.invoice_pdf || undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = (await request.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: "Session missing" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Session not paid yet" }, { status: 409 });
    }

    const receipt = await extractReceiptDetails(stripe, typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id);
    const finalized = await serverConvex.mutation(api.billing.finalizeCheckoutSecure, {
      access_key: stripeAccessKey,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
      stripe_payment_intent_id: receipt.paymentIntentId,
      stripe_charge_id: receipt.chargeId,
      stripe_invoice_id: receipt.invoiceId,
      receipt_url: receipt.receiptUrl,
      invoice_url: receipt.invoiceUrl,
      invoice_pdf_url: receipt.invoicePdfUrl,
      amount_cents: session.amount_total || 0,
      currency: session.currency || "eur",
      metadata: {
        checkout_status: session.status,
      },
    });
    const baseUrl = request.nextUrl.origin || "http://127.0.0.1:3000";
    const emailJob = buildCreditsPurchaseEmailJob({
      alreadyCompleted: finalized.alreadyCompleted,
      userEmail: finalized.userEmail,
      credits: finalized.credits,
      packName: resolvePackDisplayName(finalized.packSlug),
      actionUrl: `${baseUrl}/settings#credits`,
    });

    if (emailJob) {
      try {
        await sendTransactionalEmail(emailJob);
      } catch (error) {
        log.warn("API", "[STRIPE_CONFIRM] Compra finalizada pero correo no enviado", {
          error: error instanceof Error ? error.message : String(error),
          sessionId,
        });
      }
    }

    return NextResponse.json({ success: true, finalized });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Confirm error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
