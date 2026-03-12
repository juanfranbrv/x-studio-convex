"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { CreditCard, ExternalLink, Receipt, Wallet } from "lucide-react";
import { api } from "@/../convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBrandKit } from "@/contexts/BrandKitContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/billing";
import { useToast } from "@/hooks/use-toast";

export function BillingPageClient() {
  const { t, i18n } = useTranslation("billing");
  const { brandKits, activeBrandKit, setActiveBrandKit } = useBrandKit();
  const { user } = useUser();
  const { toast } = useToast();
  const [openingPortal, setOpeningPortal] = useState(false);

  const clerkId = user?.id;
  const billing = useQuery(api.billing.getUserBillingOverview, clerkId ? { clerk_id: clerkId } : "skip");
  const packs = useQuery(api.billing.listActivePacks, {});
  const locale = i18n.language || "es-ES";

  const handlePortal = async () => {
    setOpeningPortal(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || t("checkout.portalErrorTitle"));
      }
      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : t("checkout.portalErrorTitle");
      toast({ title: t("checkout.portalErrorTitle"), description: message, variant: "destructive" });
      setOpeningPortal(false);
    }
  };

  return (
    <DashboardLayout brands={brandKits} currentBrand={activeBrandKit} onBrandChange={setActiveBrandKit}>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 md:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="glass-panel border-0 shadow-aero">
            <CardHeader>
              <CardTitle className="text-3xl tracking-tight">{t("account.title")}</CardTitle>
              <CardDescription>{t("account.description")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Wallet} label={t("account.summary.credits")} value={String(billing?.user?.credits ?? 0)} />
              <MetricCard
                icon={CreditCard}
                label={t("account.summary.latestPack")}
                value={billing?.latestPurchase ? t(`packs.${billing.latestPurchase.pack_slug}.name`) : t("account.summary.noPack")}
              />
              <MetricCard icon={Receipt} label={t("account.summary.totalPurchased")} value={String(billing?.totalPurchased ?? 0)} />
              <MetricCard icon={Receipt} label={t("account.summary.totalSpent")} value={String(billing?.totalSpent ?? 0)} />
            </CardContent>
          </Card>

          <Card className="glass-panel border-0 shadow-aero">
            <CardHeader>
              <CardTitle>{t("account.actions.buyCredits")}</CardTitle>
              <CardDescription>{t("account.actions.openPortalHelp")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {packs?.map((pack: any) => (
                  <Link key={pack.slug} href="/pricing" className="rounded-2xl border border-border/70 p-4 transition-colors hover:border-primary/40">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{t(`packs.${pack.slug}.name`)}</p>
                  <p className="text-sm text-muted-foreground">{t("labels.creditsIncluded", { count: pack.credits })}</p>
                      </div>
                      <Badge variant={pack.featured ? "default" : "secondary"}>
                        {formatPrice(pack.price_cents, locale, String(pack.currency).toUpperCase())}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/pricing">
                  <Button className="h-11 rounded-full px-5">{t("account.actions.buyCredits")}</Button>
                </Link>
                <Button variant="outline" className="h-11 rounded-full px-5" onClick={() => void handlePortal()} disabled={openingPortal}>
                  {openingPortal ? <Loader2 className="h-4 w-4" /> : t("account.actions.openPortal")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="glass-panel border-0 shadow-aero">
            <CardHeader>
              <CardTitle>{t("account.history.purchasesTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("account.history.headers.pack")}</TableHead>
                    <TableHead>{t("account.history.headers.status")}</TableHead>
                    <TableHead>{t("account.history.headers.credits")}</TableHead>
                    <TableHead>{t("account.history.headers.amount")}</TableHead>
                    <TableHead>{t("account.history.headers.links")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billing?.purchases?.length ? (
                    billing.purchases.map((purchase: any) => (
                      <TableRow key={purchase._id}>
                        <TableCell>{t(`packs.${purchase.pack_slug}.name`)}</TableCell>
                        <TableCell>
                          <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                            {t(`account.history.status.${purchase.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>{purchase.credits}</TableCell>
                        <TableCell>{formatPrice(purchase.amount_cents, locale, String(purchase.currency).toUpperCase())}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {purchase.receipt_url ? (
                              <a href={purchase.receipt_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                {t("account.history.receipt")} <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : null}
                            {purchase.invoice_url ? (
                              <a href={purchase.invoice_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                {t("account.history.invoice")} <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        {t("account.history.emptyPurchases")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass-panel border-0 shadow-aero">
            <CardHeader>
              <CardTitle>{t("account.history.ledgerTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("account.history.headers.type")}</TableHead>
                    <TableHead>{t("account.history.headers.amount")}</TableHead>
                    <TableHead>{t("account.history.headers.balance")}</TableHead>
                    <TableHead>{t("account.history.headers.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billing?.ledger?.length ? (
                    billing.ledger.map((row: any) => (
                      <TableRow key={row._id}>
                        <TableCell className="capitalize">{row.type}</TableCell>
                        <TableCell>{row.amount > 0 ? `+${row.amount}` : row.amount}</TableCell>
                        <TableCell>{row.balance_after}</TableCell>
                        <TableCell>{new Date(row.created_at).toLocaleString(locale)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        {t("account.history.emptyLedger")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
