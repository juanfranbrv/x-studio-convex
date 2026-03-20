import { getBillingPackDefinition } from "../billing";
import type { TransactionalEmailTemplate } from "./smtp2go";

type BuildCreditsPurchaseEmailJobInput = {
  alreadyCompleted: boolean;
  userEmail?: string | null;
  credits: number;
  packName?: string | null;
  actionUrl: string;
};

type CreditsPurchaseEmailJob = {
  to: string;
  template: TransactionalEmailTemplate;
  locale: "es";
  props: {
    credits: number;
    packName: string;
    actionUrl: string;
  };
};

export function buildCreditsPurchaseEmailJob(
  input: BuildCreditsPurchaseEmailJobInput,
): CreditsPurchaseEmailJob | null {
  const email = String(input.userEmail || "").trim();
  if (input.alreadyCompleted || !email) return null;

  return {
    to: email,
    template: "creditsPurchased",
    locale: "es",
    props: {
      credits: input.credits,
      packName: String(input.packName || "").trim() || "tu pack",
      actionUrl: input.actionUrl,
    },
  };
}

export function resolvePackDisplayName(packSlug: string) {
  const pack = getBillingPackDefinition(packSlug);
  if (!pack) return packSlug;

  if (pack.slug === "trail-10") return "Trail Pack";
  if (pack.slug === "studio-30") return "Studio Pack";
  if (pack.slug === "orbit-100") return "Orbit Pack";
  return pack.slug;
}
