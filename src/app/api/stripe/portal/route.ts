import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureConvexUser, ensureStripeCustomerForUser } from "@/lib/billing-server";
import { getStripe, resolveBaseUrl } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await ensureConvexUser(userId);
    const stripeCustomerId = await ensureStripeCustomerForUser(user);
    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${resolveBaseUrl(request.headers.get("origin"))}/billing`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Portal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

