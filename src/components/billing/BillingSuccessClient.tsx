"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "@/components/ui/spinner";

export function BillingSuccessClient() {
  const searchParams = useSearchParams();
  const { t } = useTranslation("billing");
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setMessage(t("account.success.error"));
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/stripe/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || t("account.success.error"));
        }
        if (!cancelled) setStatus("done");
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : t("account.success.error"));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, t]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 py-16">
      <Card className="w-full max-w-xl border-border bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">{t("account.success.title")}</CardTitle>
          <CardDescription>
            {status === "error" ? message : t("account.success.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "loading" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4" />
              {t("account.success.loading")}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Link href="/settings#credits">
              <Button className="rounded-full px-5">{t("account.success.goBilling")}</Button>
            </Link>
            <Link href="/image">
              <Button variant="outline" className="rounded-full px-5">{t("account.success.goImage")}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

