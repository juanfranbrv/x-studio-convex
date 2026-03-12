/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock3, Copy, CreditCard, ExternalLink, Gift, ReceiptText, Share2, WalletCards } from 'lucide-react'
import { api } from '@/../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from '@/components/ui/spinner'
import { formatPrice } from '@/lib/billing'
import { useToast } from '@/hooks/use-toast'

type CheckoutState = {
    pendingSlug: string | null
    openingPortal: boolean
}

export function SettingsBillingSection() {
    const { t, i18n } = useTranslation(['settings', 'billing'])
    const { user } = useUser()
    const { toast } = useToast()
    const [state, setState] = useState<CheckoutState>({ pendingSlug: null, openingPortal: false })

    const clerkId = user?.id
    const locale = i18n.language || 'es-ES'
    const billing = useQuery(api.billing.getUserBillingOverview, clerkId ? { clerk_id: clerkId } : 'skip')
    const referral = useQuery(api.referrals.getMyReferralOverview, clerkId ? { clerk_id: clerkId } : 'skip')
    const packs = useQuery(api.billing.listActivePacks, {})
    const ensureReferralProfile = useMutation(api.referrals.ensureReferralProfile)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const email = user?.emailAddresses?.[0]?.emailAddress
        if (!clerkId || !email || referral?.referralCode) return

        void ensureReferralProfile({
            clerk_id: clerkId,
            email,
        })
    }, [clerkId, ensureReferralProfile, referral?.referralCode, user?.emailAddresses])

    const referralLink = useMemo(() => {
        if (!referral?.referralCode || typeof window === 'undefined') return ''
        return `${window.location.origin}/sign-in?ref=${referral.referralCode}`
    }, [referral?.referralCode])

    const handleCheckout = async (packSlug: string) => {
        setState((current) => ({ ...current, pendingSlug: packSlug }))
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packSlug }),
            })
            const data = await response.json()

            if (!response.ok || !data.url) {
                throw new Error(data.error || t('billing:checkout.errorTitle'))
            }

            window.location.href = data.url
        } catch (error) {
            toast({
                title: t('billing:checkout.errorTitle'),
                description: error instanceof Error ? error.message : t('billing:checkout.packMissing'),
                variant: 'destructive',
            })
            setState((current) => ({ ...current, pendingSlug: null }))
        }
    }

    const handlePortal = async () => {
        setState((current) => ({ ...current, openingPortal: true }))
        try {
            const response = await fetch('/api/stripe/portal', { method: 'POST' })
            const data = await response.json()
            if (!response.ok || !data.url) {
                throw new Error(data.error || t('billing:checkout.portalErrorTitle'))
            }
            window.location.href = data.url
        } catch (error) {
            toast({
                title: t('billing:checkout.portalErrorTitle'),
                description: error instanceof Error ? error.message : t('billing:checkout.portalErrorTitle'),
                variant: 'destructive',
            })
            setState((current) => ({ ...current, openingPortal: false }))
        }
    }

    const summaryItems = [
        { key: 'credits', label: t('billing:account.summary.credits'), value: String(billing?.user?.credits ?? 0) },
        {
            key: 'latestPack',
            label: t('billing:account.summary.latestPack'),
            value: billing?.latestPurchase ? t(`billing:packs.${billing.latestPurchase.pack_slug}.name`) : t('billing:account.summary.noPack'),
        },
        { key: 'purchased', label: t('billing:account.summary.totalPurchased'), value: String(billing?.totalPurchased ?? 0) },
        { key: 'spent', label: t('billing:account.summary.totalSpent'), value: String(billing?.totalSpent ?? 0) },
    ]

    const handleCopyReferralLink = async () => {
        if (!referralLink) return

        try {
            await navigator.clipboard.writeText(referralLink)
            setCopied(true)
            toast({
                title: t('billing:referrals.copySuccessTitle'),
                description: t('billing:referrals.copySuccessBody'),
            })
            window.setTimeout(() => setCopied(false), 2200)
        } catch (error) {
            toast({
                title: t('billing:referrals.copyErrorTitle'),
                description: error instanceof Error ? error.message : t('billing:referrals.copyErrorBody'),
                variant: 'destructive',
            })
        }
    }

    return (
        <section id="credits" className="overflow-hidden rounded-[2rem] border border-border/70 bg-background/85 shadow-sm">
            <div className="border-b border-border/60 px-6 py-6 md:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {t('sections.credits.eyebrow')}
                </p>
                <div className="mt-3 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            {t('sections.credits.title')}
                        </h2>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            {t('sections.credits.description')}
                        </p>
                    </div>
                    <div className="hidden rounded-full border border-border/70 bg-muted/50 p-3 text-muted-foreground md:flex">
                        <WalletCards className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="space-y-8 px-6 py-6 md:px-8">
                <div className="grid overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted/15 md:grid-cols-4">
                    {summaryItems.map((item, index) => (
                        <div
                            key={item.key}
                            className={`px-5 py-5 ${index < summaryItems.length - 1 ? 'border-b border-border/60 md:border-b-0 md:border-r' : ''}`}
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {t('sections.credits.quickBuyTitle')}
                            </h3>
                            <p className="text-sm text-muted-foreground">{t('sections.credits.quickBuyDescription')}</p>
                        </div>

                        <div className="grid gap-3">
                            {packs?.map((pack: any) => {
                                const pending = state.pendingSlug === pack.slug
                                return (
                                    <button
                                        key={pack.slug}
                                        onClick={() => void handleCheckout(pack.slug)}
                                        className="group flex items-center justify-between rounded-[1.5rem] border border-border/70 bg-background/80 px-4 py-4 text-left transition-colors hover:bg-muted/25"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-foreground">{t(`billing:packs.${pack.slug}.name`)}</p>
                                                {pack.featured ? (
                                                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em]">
                                                        {t(`billing:packs.${pack.slug}.badge`)}
                                                    </Badge>
                                                ) : null}
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {t('billing:labels.creditsIncluded', { count: pack.credits })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-foreground">
                                                {formatPrice(pack.price_cents, locale, String(pack.currency).toUpperCase())}
                                            </span>
                                            {pending ? <Loader2 className="h-4 w-4 text-muted-foreground" /> : <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href="/pricing">
                                <Button variant="outline" className="rounded-full px-5">
                                    {t('billing:account.actions.buyCredits')}
                                </Button>
                            </Link>
                            <Button
                                className="rounded-full px-5"
                                onClick={() => void handlePortal()}
                                disabled={state.openingPortal}
                            >
                                {state.openingPortal ? (
                                    <>
                                    <Loader2 className="h-4 w-4" />
                                        {t('billing:account.actions.openingPortal')}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        {t('billing:account.actions.openPortal')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {t('sections.credits.historyTitle')}
                            </h3>
                            <p className="text-sm text-muted-foreground">{t('sections.credits.historyDescription')}</p>
                        </div>

                        <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted/15">
                            {billing?.purchases?.length ? (
                                <div className="divide-y divide-border/60">
                                    {billing.purchases.map((purchase: any) => (
                                        <div key={purchase._id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.3fr_0.7fr_0.8fr_1fr] md:items-center">
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground">
                                                    {t(`billing:packs.${purchase.pack_slug}.name`)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(purchase.created_at).toLocaleDateString(locale, {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <ReceiptText className="h-4 w-4" />
                                                {purchase.credits}
                                            </div>
                                            <p className="text-sm font-medium text-foreground">
                                                {formatPrice(purchase.amount_cents, locale, String(purchase.currency).toUpperCase())}
                                            </p>
                                            <div className="flex gap-2 md:justify-end">
                                                {purchase.receipt_url ? (
                                                    <a
                                                        href={purchase.receipt_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                    >
                                                        {t('billing:account.history.receipt')}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ) : null}
                                                {purchase.invoice_url ? (
                                                    <a
                                                        href={purchase.invoice_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                    >
                                                        {t('billing:account.history.invoice')}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                                    <div className="rounded-full border border-border/70 bg-background/80 p-3 text-muted-foreground">
                                        <Clock3 className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">{t('sections.credits.historyEmptyTitle')}</p>
                                        <p className="max-w-sm text-sm text-muted-foreground">
                                            {t('billing:account.history.emptyPurchases')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted/15">
                        <div className="border-b border-border/60 px-5 py-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                        {t('billing:referrals.title')}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{t('billing:referrals.description')}</p>
                                </div>
                                <div className="rounded-full border border-border/70 bg-background/80 p-3 text-muted-foreground">
                                    <Share2 className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 px-5 py-5">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <ReferralStat label={t('billing:referrals.stats.totalReferrals')} value={String(referral?.stats?.totalReferrals ?? 0)} />
                                <ReferralStat label={t('billing:referrals.stats.signupCredits')} value={String(referral?.stats?.signupCredits ?? 0)} />
                                <ReferralStat label={t('billing:referrals.stats.totalCreditsEarned')} value={String(referral?.stats?.totalCreditsEarned ?? 0)} />
                            </div>

                            <div className="space-y-3 rounded-[1.4rem] border border-border/70 bg-background/75 p-4">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <Gift className="h-4 w-4 text-primary" />
                                    <span>
                                        {t('billing:referrals.rewardRule', {
                                            signup: referral?.config?.signupRewardCredits ?? 5,
                                            percentage: referral?.config?.purchaseRewardPercentage ?? 50,
                                        })}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                        {t('billing:referrals.linkLabel')}
                                    </p>
                                    <div className="flex flex-col gap-3 md:flex-row">
                                        <div className="min-w-0 flex-1 rounded-[1.15rem] border border-border/70 bg-muted/25 px-4 py-3 text-sm text-foreground">
                                            <span className="block truncate">{referralLink || t('billing:referrals.linkPending')}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            className="rounded-full px-5"
                                            variant={copied ? 'secondary' : 'default'}
                                            disabled={!referralLink}
                                            onClick={() => void handleCopyReferralLink()}
                                        >
                                            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            {copied ? t('billing:referrals.copied') : t('billing:referrals.copy')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-muted/15">
                        <div className="border-b border-border/60 px-5 py-5">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {t('billing:referrals.activityTitle')}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">{t('billing:referrals.activityDescription')}</p>
                        </div>

                        {referral?.recentReferrals?.length ? (
                            <div className="divide-y divide-border/60">
                                {referral.recentReferrals.map((item: any) => (
                                    <div key={item._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-foreground">{item.referred_email}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString(locale, {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 sm:justify-end">
                                            <Badge variant="secondary" className="rounded-full px-3 py-1">
                                                +{item.signup_reward_credits} {t('billing:referrals.badges.signup')}
                                            </Badge>
                                            <Badge variant="outline" className="rounded-full px-3 py-1">
                                                +{item.total_purchase_reward_credits} {t('billing:referrals.badges.purchase')}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                                <div className="rounded-full border border-border/70 bg-background/80 p-3 text-muted-foreground">
                                    <Clock3 className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium text-foreground">{t('billing:referrals.emptyTitle')}</p>
                                    <p className="max-w-sm text-sm text-muted-foreground">
                                        {t('billing:referrals.emptyBody')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

function ReferralStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[1.15rem] border border-border/60 bg-background/70 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
    )
}
