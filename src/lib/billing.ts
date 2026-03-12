export type BillingPackSlug = "trail-10" | "studio-30" | "orbit-100";

export type BillingPackDefinition = {
  slug: BillingPackSlug;
  credits: number;
  priceCents: number;
  currency: "eur";
  sortOrder: number;
  badgeTone: "muted" | "default" | "accent";
  featured?: boolean;
};

export const BILLING_PACKS: BillingPackDefinition[] = [
  {
    slug: "trail-10",
    credits: 10,
    priceCents: 500,
    currency: "eur",
    sortOrder: 1,
    badgeTone: "muted",
  },
  {
    slug: "studio-30",
    credits: 30,
    priceCents: 1500,
    currency: "eur",
    sortOrder: 2,
    badgeTone: "default",
    featured: true,
  },
  {
    slug: "orbit-100",
    credits: 100,
    priceCents: 3000,
    currency: "eur",
    sortOrder: 3,
    badgeTone: "accent",
  },
];

export function getBillingPackDefinition(slug: string) {
  return BILLING_PACKS.find((pack) => pack.slug === slug);
}

export function formatPrice(priceCents: number, locale = "es-ES", currency = "EUR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}

export function buildPackMetadata(pack: BillingPackDefinition) {
  return {
    pack_slug: pack.slug,
    credits: String(pack.credits),
    price_cents: String(pack.priceCents),
    currency: pack.currency,
  };
}

