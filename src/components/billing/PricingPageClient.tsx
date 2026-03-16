"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, CreditCard, Receipt, ShieldCheck } from "lucide-react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/billing";
import { useToast } from "@/hooks/use-toast";

export function PricingPageClient() {
  const { t, i18n } = useTranslation("billing");
  const { isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const packs = useQuery(api.billing.listActivePacks, {});
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  const locale = i18n.language || "es-ES";

  const trustCards = useMemo(
    () => [
      { icon: ShieldCheck, title: t("pricing.trust.title1"), body: t("pricing.trust.body1") },
      { icon: CreditCard, title: t("pricing.trust.title2"), body: t("pricing.trust.body2") },
      { icon: Receipt, title: t("pricing.trust.title3"), body: t("pricing.trust.body3") },
    ],
    [t]
  );

  const handleCheckout = async (packSlug: string) => {
    setPendingSlug(packSlug);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packSlug }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || t("checkout.errorTitle"));
      }
      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : t("checkout.errorTitle");
      toast({ title: t("checkout.errorTitle"), description: message, variant: "destructive" });
      setPendingSlug(null);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,80,200,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,80,200,0.10),transparent_30%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-20 pt-12 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div className="max-w-3xl space-y-6">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.24em]">
              {t("pricing.eyebrow")}
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-foreground md:text-7xl">
                {t("pricing.title")}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                {t("pricing.body")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isSignedIn ? (
                <Link href="/billing">
                  <Button size="lg" className="h-12 rounded-full px-6">
                    {t("pricing.ctaSecondary")}
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button size="lg" className="h-12 rounded-full px-6">
                    {t("pricing.ctaPrimary")}
                  </Button>
                </Link>
              )}
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-12 rounded-full px-6">
                  {t("pricing.contact")}
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-border bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{t("pricing.faqTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {["1", "2", "3"].map((index) => (
                <div key={index} className="space-y-1 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
                  <p className="text-sm font-semibold text-foreground">{t(`pricing.faq.q${index}`)}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{t(`pricing.faq.a${index}`)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {packs?.map((pack: any) => {
            const slug = String(pack.slug);
            const isPending = pendingSlug === slug;
            return (
              <Card
                key={slug}
                className={`relative overflow-hidden border-border bg-white shadow-md ${
                  pack.featured ? "ring-1 ring-primary/40" : ""
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                <CardHeader className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl tracking-tight">{t(`packs.${slug}.name`)}</CardTitle>
                      <CardDescription className="mt-2 text-sm leading-6">
                        {t(`packs.${slug}.description`)}
                      </CardDescription>
                    </div>
                    <Badge variant={pack.featured ? "default" : "secondary"} className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                      {t(`packs.${slug}.badge`)}
                    </Badge>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-semibold tracking-tight">{formatPrice(pack.price_cents, locale, String(pack.currency).toUpperCase())}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/{pack.credits} credits</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm leading-6 text-muted-foreground">{t(`packs.${slug}.tagline`)}</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{t("labels.creditsIncluded", { count: pack.credits })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{t("pricing.trust.body2")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{t("pricing.trust.body3")}</span>
                    </div>
                  </div>

                  {isLoaded && isSignedIn ? (
                    <Button
                      className="h-12 w-full rounded-full text-sm font-semibold"
                      onClick={() => void handleCheckout(slug)}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="h-4 w-4" /> : t(`packs.${slug}.cta`)}
                    </Button>
                  ) : (
                    <Link href="/sign-in" className="block">
                      <Button className="h-12 w-full rounded-full text-sm font-semibold">
                        {t("pricing.ctaPrimary")}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {trustCards.map((item) => (
            <Card key={item.title} className="border-border bg-white">
              <CardContent className="flex gap-4 p-6">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-medium text-foreground">{item.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("pricing.backHome")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
