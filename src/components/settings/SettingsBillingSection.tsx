/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { useTranslation } from 'react-i18next'
import { IconCheck, IconClock, IconCopy, IconCreditCard, IconLink, IconGift, IconReceipt, IconShare, IconWallet } from '@/components/ui/icons'
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
        <section id="credits" className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* Section header */}
            <div className="px-6 py-6 md:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                    {t('sections.credits.eyebrow')}
                </p>
                <div className="mt-2 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            {t('sections.credits.title')}
                        </h2>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            {t('sections.credits.description')}
                        </p>
                    </div>
                    <div className="hidden rounded-full bg-primary/10 p-3 text-primary md:flex">
                        <IconWallet className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="space-y-8 px-6 pb-8 md:px-8">
                {/* Summary stats — flat row, no card wrapper */}
                <div className="grid divide-x divide-border/40 overflow-hidden rounded-xl bg-muted/20 md:grid-cols-4">
                    {summaryItems.map((item) => (
                        <div key={item.key} className="px-5 py-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    {/* Quick buy */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {t('sections.credits.quickBuyTitle')}
                        </h3>
                        <p className="text-sm text-muted-foreground">{t('sections.credits.quickBuyDescription')}</p>

                        <div className="space-y-2">
                            {packs?.map((pack: any) => {
                                const pending = state.pendingSlug === pack.slug
                                return (
                                    <button
                                        key={pack.slug}
                                        onClick={() => void handleCheckout(pack.slug)}
                                        className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-muted/20 px-4 py-4 text-left transition-colors hover:bg-primary/5"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-foreground">{t(`billing:packs.${pack.slug}.name`)}</p>
                                                {pack.featured ? (
                                                    <Badge variant="secondary" className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-primary">
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
                                            {pending ? <Loader2 className="h-4 w-4 text-muted-foreground" /> : <IconLink className="h-4 w-4 text-muted-foreground" />}
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
                                        <IconCreditCard className="h-4 w-4" />
                                        {t('billing:account.actions.openPortal')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Purchase history */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {t('sections.credits.historyTitle')}
                        </h3>
                        <p className="text-sm text-muted-foreground">{t('sections.credits.historyDescription')}</p>

                        <div className="overflow-hidden rounded-xl bg-muted/20">
                            {billing?.purchases?.length ? (
                                <div className="divide-y divide-border/40">
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
                                                <IconReceipt className="h-4 w-4" />
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
                                                        <IconLink className="h-3 w-3" />
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
                                                        <IconLink className="h-3 w-3" />
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                                        <IconClock className="h-5 w-5" />
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

                {/* Referrals + Activity */}
                <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                    {/* Referrals */}
                    <div className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    <span className="h-1 w-1 rounded-full bg-primary" />
                                    {t('billing:referrals.title')}
                                </h3>
                                <p className="text-sm text-muted-foreground">{t('billing:referrals.description')}</p>
                            </div>
                            <div className="rounded-full bg-primary/10 p-3 text-primary">
                                <IconShare className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="grid gap-px overflow-hidden rounded-xl bg-border/30 sm:grid-cols-3">
                            <ReferralStat label={t('billing:referrals.stats.totalReferrals')} value={String(referral?.stats?.totalReferrals ?? 0)} />
                            <ReferralStat label={t('billing:referrals.stats.signupCredits')} value={String(referral?.stats?.signupCredits ?? 0)} />
                            <ReferralStat label={t('billing:referrals.stats.totalCreditsEarned')} value={String(referral?.stats?.totalCreditsEarned ?? 0)} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <IconGift className="h-4 w-4 text-primary" />
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
                                    <div className="min-w-0 flex-1 rounded-xl bg-muted/30 px-4 py-3 text-sm text-foreground">
                                        <span className="block truncate">{referralLink || t('billing:referrals.linkPending')}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        className="rounded-full px-5"
                                        variant={copied ? 'secondary' : 'default'}
                                        disabled={!referralLink}
                                        onClick={() => void handleCopyReferralLink()}
                                    >
                                        {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
                                        {copied ? t('billing:referrals.copied') : t('billing:referrals.copy')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Referral activity */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                <span className="h-1 w-1 rounded-full bg-primary" />
                                {t('billing:referrals.activityTitle')}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">{t('billing:referrals.activityDescription')}</p>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-muted/20">
                            {referral?.recentReferrals?.length ? (
                                <div className="divide-y divide-border/40">
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
                                                <Badge variant="secondary" className="rounded-full bg-primary/10 px-3 py-1 text-primary">
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
                                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                                        <IconClock className="h-5 w-5" />
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
            </div>
        </section>
    )
}

function ReferralStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-muted/20 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
    )
}
