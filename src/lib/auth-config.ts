const PROD_DOMAIN = "adstudio.click";

function normalizeBaseUrl(input?: string | null): string {
  const raw = (input || "").trim();
  if (!raw) return `https://${PROD_DOMAIN}`;
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw.replace(/\/+$/, "")
    : `https://${raw.replace(/\/+$/, "")}`;
}

export const authConfig = {
  appBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL),
  signInPath: "/sign-in",
  signUpPath: "/sign-up",
  onboardingPath: "/onboarding",
  signedInDefaultPath: "/image",
  afterSignOutPath: "/",
  clerkWebhookPath: "/api/webhooks/clerk",
  domain: PROD_DOMAIN,
} as const;

export const ADMIN_EMAILS = ["juanfranbrv@gmail.com"] as const;

export type AppRole = "user" | "beta" | "admin";
export type AppStatus = "waitlist" | "active" | "suspended";

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim() as (typeof ADMIN_EMAILS)[number]);
}

