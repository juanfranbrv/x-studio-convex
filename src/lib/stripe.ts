import Stripe from "stripe";
import { brand } from "@/lib/brand";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

export function getStripe() {
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
    appInfo: {
      name: brand.name,
      version: "0.1.0",
    },
  });
}

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";
}

export function resolveBaseUrl(origin?: string | null) {
  const direct = origin?.trim();
  if (direct) return direct.replace(/\/+$/, "");

  const envBase =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "http://127.0.0.1:3000";

  if (envBase.startsWith("http://") || envBase.startsWith("https://")) {
    return envBase.replace(/\/+$/, "");
  }

  return `https://${envBase.replace(/\/+$/, "")}`;
}
