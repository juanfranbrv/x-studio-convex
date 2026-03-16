'use client'

import { useState } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { IconArrowDownRight, IconSettings } from '@/components/ui/icons'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useUI } from '@/contexts/UIContext'
import { SettingsManagementSection } from '@/components/settings/SettingsManagementSection'
import { SettingsBillingSection } from '@/components/settings/SettingsBillingSection'
import { SettingsProfileSection } from '@/components/settings/SettingsProfileSection'

export default function SettingsPage() {
    const { t } = useTranslation(['settings', 'common', 'billing'])
    const { brandKits, activeBrandKit, setActiveBrandKit } = useBrandKit()
    const { assistanceEnabled, setAssistanceEnabled, panelPosition, setPanelPosition } = useUI()
    const { signOut } = useClerk()
    const { user } = useUser()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await signOut({ redirectUrl: '/' })
        } catch (error) {
            console.error('Error closing session:', error)
            setIsLoggingOut(false)
        }
    }

    return (
        <DashboardLayout brands={brandKits} currentBrand={activeBrandKit} onBrandChange={setActiveBrandKit}>
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 md:px-8 md:py-8">
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/70">
                                {t('hero.eyebrow')}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                        <IconSettings className="h-5 w-5" />
                                    </div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                                        {t('headerTitle')}
                                    </h1>
                                </div>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                    {t('headerDescription')}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <AnchorChip href="#management" title={t('sections.management.title')} description={t('sections.management.short')} />
                            <AnchorChip href="#credits" title={t('sections.credits.title')} description={t('sections.credits.short')} />
                            <AnchorChip href="#profile" title={t('sections.profile.title')} description={t('sections.profile.short')} />
                        </div>
                    </div>
                </section>

                <div id="management">
                    <SettingsManagementSection
                        t={t}
                        panelPosition={panelPosition}
                        setPanelPosition={setPanelPosition}
                        assistanceEnabled={assistanceEnabled}
                        setAssistanceEnabled={setAssistanceEnabled}
                    />
                </div>

                <SettingsBillingSection />

                <div id="profile">
                    <SettingsProfileSection
                        t={t}
                        user={user}
                        isLoggingOut={isLoggingOut}
                        onLogout={handleLogout}
                    />
                </div>
            </main>
        </DashboardLayout>
    )
}

function AnchorChip({ href, title, description }: { href: string; title: string; description: string }) {
    return (
        <a
            href={href}
            className="group flex min-h-28 cursor-pointer flex-col justify-between rounded-xl bg-muted/20 p-4 transition-colors hover:bg-primary/5"
        >
            <IconArrowDownRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            <div className="space-y-1">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm leading-5 text-muted-foreground">{description}</p>
            </div>
        </a>
    )
}
