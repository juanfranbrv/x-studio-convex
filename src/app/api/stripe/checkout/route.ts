import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureConvexUser, ensureDefaultBillingCatalog, ensureStripeCustomerForUser, ensureStripePriceForPack, serverConvex } from "@/lib/billing-server";
import { resolveBaseUrl, getStripe } from "@/lib/stripe";
import { api } from "@/../convex/_generated/api";

const stripeAccessKey = process.env.STRIPE_INTERNAL_SECRET?.trim() || "";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { packSlug?: string };
    const packSlug = String(body.packSlug || "").trim();
    if (!packSlug) {
      return NextResponse.json({ error: "Pack missing" }, { status: 400 });
    }

    await ensureDefaultBillingCatalog();
    const user = await ensureConvexUser(userId);
    const stripeCustomerId = await ensureStripeCustomerForUser(user);
    const pack = await ensureStripePriceForPack(packSlug);
    if (!pack.active || !pack.stripe_price_id) {
      return NextResponse.json({ error: "Pack unavailable" }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = resolveBaseUrl(request.headers.get("origin"));
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      line_items: [{ price: pack.stripe_price_id, quantity: 1 }],
      success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
      invoice_creation: { enabled: true },
      payment_intent_data: {
        metadata: {
          pack_slug: pack.slug,
          clerk_id: user.clerk_id,
          convex_user_id: user._id,
          credits: String(pack.credits),
        },
      },
      metadata: {
        pack_slug: pack.slug,
        clerk_id: user.clerk_id,
        convex_user_id: user._id,
        credits: String(pack.credits),
      },
      allow_promotion_codes: false,
      customer_update: {
        address: "auto",
        name: "auto",
      },
    });

    await serverConvex.mutation(api.billing.recordCheckoutSessionSecure, {
      access_key: stripeAccessKey,
      user_id: user._id,
      pack_slug: pack.slug,
      credits: pack.credits,
      amount_cents: pack.price_cents,
      currency: pack.currency,
      stripe_customer_id: stripeCustomerId,
      stripe_checkout_session_id: session.id,
      metadata: {
        stripe_price_id: pack.stripe_price_id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
