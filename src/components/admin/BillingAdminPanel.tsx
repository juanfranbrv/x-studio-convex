"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { Coins, CreditCard, RefreshCw, Wallet } from "lucide-react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/billing";
import { useToast } from "@/hooks/use-toast";

export function BillingAdminPanel({ adminEmail }: { adminEmail: string }) {
  const { t, i18n } = useTranslation("billing");
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const data = useQuery(api.billing.getAdminBillingSummary, adminEmail ? { admin_email: adminEmail } : "skip");
  const locale = i18n.language || "es-ES";

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/stripe/sync", { method: "POST" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || t("admin.sync"));
      }
      toast({ title: t("admin.synced"), description: `${result.synced?.length ?? 0} packs` });
    } catch (error) {
      toast({
        title: t("admin.sync"),
        description: error instanceof Error ? error.message : "Stripe sync error",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">{t("admin.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("admin.description")}</p>
        </div>
        <Button onClick={() => void handleSync()} disabled={syncing} className="gap-2">
          {syncing ? <Loader2 className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          {syncing ? t("admin.syncing") : t("admin.sync")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <AdminMetric icon={Wallet} label={t("admin.stats.revenue")} value={formatPrice(data?.stats?.revenueCents ?? 0, locale)} />
        <AdminMetric icon={CreditCard} label={t("admin.stats.purchases")} value={String(data?.stats?.purchaseCount ?? 0)} />
        <AdminMetric icon={Coins} label={t("admin.stats.customers")} value={String(data?.stats?.payingCustomers ?? 0)} />
        <AdminMetric icon={Coins} label={t("admin.stats.creditsSold")} value={String(data?.stats?.creditsSold ?? 0)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.packsTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {data?.packs?.map((pack: any) => (
            <div key={pack._id} className="rounded-2xl border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{t(`packs.${pack.slug}.name`)}</p>
                  <p className="text-sm text-muted-foreground">{pack.credits} credits</p>
                </div>
                        <Badge variant={pack.active ? "default" : "secondary"}>{pack.active ? t("admin.active") : t("admin.inactive")}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPrice(pack.price_cents, locale, String(pack.currency).toUpperCase())}
              </p>
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {pack.stripe_price_id || t("admin.stripePending")}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.purchasesTitle")}</CardTitle>
          <CardDescription>{t("admin.empty")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.headers.pack")}</TableHead>
                <TableHead>{t("admin.headers.status")}</TableHead>
                <TableHead>{t("admin.headers.credits")}</TableHead>
                <TableHead>{t("admin.headers.amount")}</TableHead>
                <TableHead>{t("admin.headers.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.purchases?.length ? (
                data.purchases.map((purchase: any) => (
                  <TableRow key={purchase._id}>
                    <TableCell>{t(`packs.${purchase.pack_slug}.name`)}</TableCell>
                    <TableCell>
                      <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                        {t(`account.history.status.${purchase.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>{purchase.credits}</TableCell>
                    <TableCell>{formatPrice(purchase.amount_cents, locale, String(purchase.currency).toUpperCase())}</TableCell>
                    <TableCell>{new Date(purchase.created_at).toLocaleString(locale)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    {t("admin.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminMetric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
