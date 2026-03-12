'use client'

import { Loader2 } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { LogOut, ShieldCheck, UserRound } from 'lucide-react'

type Props = {
    t: (key: string, options?: Record<string, unknown>) => string
    user?: {
        fullName?: string | null
        firstName?: string | null
        imageUrl?: string
        primaryEmailAddress?: { emailAddress?: string | null } | null
    } | null
    isLoggingOut: boolean
    onLogout: () => Promise<void>
}

export function SettingsProfileSection({ t, user, isLoggingOut, onLogout }: Props) {
    return (
        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-background/85 shadow-sm">
            <div className="border-b border-border/60 px-6 py-6 md:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {t('sections.profile.eyebrow')}
                </p>
                <div className="mt-3 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            {t('sections.profile.title')}
                        </h2>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            {t('sections.profile.description')}
                        </p>
                    </div>
                    <div className="hidden rounded-full border border-border/70 bg-muted/50 p-3 text-muted-foreground md:flex">
                        <UserRound className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-border/70 bg-muted/15 p-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background/80">
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={user?.fullName || user?.firstName || t('common:labels.user')}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-semibold text-muted-foreground">
                                    {(user?.firstName || user?.primaryEmailAddress?.emailAddress || t('common:labels.user')).charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-semibold text-foreground">
                                {user?.fullName || user?.firstName || t('common:labels.user')}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                                {user?.primaryEmailAddress?.emailAddress || t('common:labels.noEmail')}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <InfoRow label={t('sections.profile.fields.account')} value={t('sections.profile.values.private')} />
                        <InfoRow label={t('sections.profile.fields.access')} value={t('sections.profile.values.google')} />
                    </div>
                </div>

                <div className="rounded-[1.75rem] border border-border/70 bg-muted/15 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        {t('session.title')}
                    </div>
                    <div className="mt-4 space-y-3">
                        <p className="text-sm leading-6 text-muted-foreground">
                            {t('session.logoutDescription')}
                        </p>
                        <Button
                            variant="destructive"
                            className="h-11 rounded-full px-5"
                            onClick={() => void onLogout()}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className="h-4 w-4" />
                                    {t('common:actions.loggingOut')}
                                </>
                            ) : (
                                <>
                                    <LogOut className="h-4 w-4" />
                                    {t('common:actions.logout')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[1.25rem] border border-border/70 bg-background/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
        </div>
    )
}
