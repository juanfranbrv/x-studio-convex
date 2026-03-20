'use client'

import Link from 'next/link'
import { IconArrowLeft, IconArrowUpRight, IconMail, IconShieldCheck } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { ProtectedContactEmail } from './ProtectedContactEmail'

type LegalPageProps = {
    page: 'privacy' | 'terms' | 'cookies' | 'contact'
    sectionIds: string[]
}

const PAGE_LINKS: Array<{ href: '/privacy' | '/terms' | '/cookies' | '/contact'; key: LegalPageProps['page'] }> = [
    { href: '/privacy', key: 'privacy' },
    { href: '/terms', key: 'terms' },
    { href: '/cookies', key: 'cookies' },
    { href: '/contact', key: 'contact' },
]

export function LegalPage({ page, sectionIds }: LegalPageProps) {
    const { t } = useTranslation('legal')

    return (
        <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_28%)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <IconArrowLeft className="h-3.5 w-3.5" />
                        {t('common.backHome')}
                    </Link>
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        <IconShieldCheck className="h-3.5 w-3.5" />
                        {t('common.trustCenter')}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <main className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.25)] backdrop-blur-xl">
                        <section className="border-b border-border/60 px-6 py-8 sm:px-8 lg:px-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                                {t(`${page}.eyebrow`)}
                            </p>
                            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-3xl space-y-4">
                                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                        {t(`${page}.title`)}
                                    </h1>
                                    <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
                                        {t(`${page}.intro`)}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-muted/35 px-4 py-3 text-sm text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                                    <div className="font-semibold text-foreground">{t('common.lastUpdated')}</div>
                                    <div className="mt-1">{t(`${page}.updatedAt`)}</div>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_15rem]">
                            <div className="divide-y divide-border/60">
                                {sectionIds.map((sectionId) => (
                                    <section key={sectionId} className="px-6 py-6 sm:px-8 lg:px-10">
                                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/75">
                                            {t(`${page}.sections.${sectionId}.label`)}
                                        </div>
                                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                            {t(`${page}.sections.${sectionId}.title`)}
                                        </h2>
                                        <p className="mt-3 max-w-[65ch] text-sm leading-7 text-muted-foreground sm:text-base">
                                            {t(`${page}.sections.${sectionId}.body`)}
                                        </p>
                                    </section>
                                ))}
                            </div>

                            <aside className="border-t border-border/60 bg-muted/20 px-6 py-6 lg:border-l lg:border-t-0">
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                            {t('common.relatedTitle')}
                                        </p>
                                        <div className="mt-3 space-y-2">
                                            {PAGE_LINKS.filter((item) => item.key !== page).map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/35 hover:bg-primary/5"
                                                >
                                                    <span>{t(`${item.key}.title`)}</span>
                                                    <IconArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <IconMail className="h-4 w-4 text-primary" />
                                            {t('common.contactTitle')}
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {t('common.contactDescription')}
                                        </p>
                                        {page === 'contact' ? (
                                            <ProtectedContactEmail
                                                revealLabel={t('common.revealEmail')}
                                                copiedLabel={t('common.emailCopied')}
                                                helperText={t('common.protectedEmailHint')}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </aside>
                        </section>
                    </main>

                    <aside className="rounded-2xl border border-border/60 bg-white p-5 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.22)] backdrop-blur-xl lg:sticky lg:top-6 lg:h-fit">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {t('common.onThisPage')}
                        </p>
                        <div className="mt-4 space-y-2">
                            {sectionIds.map((sectionId) => (
                                <div
                                    key={sectionId}
                                    className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium text-foreground"
                                >
                                    {t(`${page}.sections.${sectionId}.title`)}
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
