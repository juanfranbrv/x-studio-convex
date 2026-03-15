'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'convex/react'
import { ArrowDownRight, Settings2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useUI } from '@/contexts/UIContext'
import { api } from '../../../convex/_generated/api'
import { DEFAULT_THEME_COLORS, readThemeColors } from '@/lib/theme-colors'
import { SettingsManagementSection } from '@/components/settings/SettingsManagementSection'
import { SettingsBillingSection } from '@/components/settings/SettingsBillingSection'
import { SettingsProfileSection } from '@/components/settings/SettingsProfileSection'

export default function SettingsPage() {
    const { t } = useTranslation(['settings', 'common', 'billing'])
    const { brandKits, activeBrandKit, setActiveBrandKit } = useBrandKit()
    const { assistanceEnabled, setAssistanceEnabled, panelPosition, setPanelPosition } = useUI()
    const { signOut } = useClerk()
    const { user } = useUser()
    const { resolvedTheme, setTheme } = useTheme()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const themeDefaults = useQuery(api.settings.getThemeSettings)

    const userId = useMemo(() => user?.id ?? null, [user?.id])

    const hslToHex = (raw: string): string | null => {
        if (!raw) return null
        const trimmed = raw.replace(/^hsl\(/, '').replace(/\)$/, '').trim()
        if (/^#?[0-9A-Fa-f]{6}$/.test(trimmed)) {
            return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
        }

        const parts = trimmed.split(/\s+/g)
        if (parts.length < 3) return null
        const h = Number(parts[0])
        const s = Number(parts[1].replace('%', '')) / 100
        const l = Number(parts[2].replace('%', '')) / 100
        if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) return null

        const hueToRgb = (p: number, q: number, value: number) => {
            let tValue = value
            if (tValue < 0) tValue += 1
            if (tValue > 1) tValue -= 1
            if (tValue < 1 / 6) return p + (q - p) * 6 * tValue
            if (tValue < 1 / 2) return q
            if (tValue < 2 / 3) return p + (q - p) * (2 / 3 - tValue) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        const r = Math.round(hueToRgb(p, q, h / 360 + 1 / 3) * 255)
        const g = Math.round(hueToRgb(p, q, h / 360) * 255)
        const b = Math.round(hueToRgb(p, q, h / 360 - 1 / 3) * 255)
        const toHex = (value: number) => value.toString(16).padStart(2, '0')

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const resolveHex = (value: string | undefined): string => {
        if (!value) return '#6366f1'
        return hslToHex(value) || (value.startsWith('#') ? value : `#${value}`)
    }

    const [primaryColor, setPrimaryColor] = useState('#6366f1')
    const [secondaryColor, setSecondaryColor] = useState('#ec4899')

    useEffect(() => {
        const stored = readThemeColors(userId)
        if (stored?.primary && stored?.secondary) {
            setPrimaryColor(resolveHex(stored.primary))
            setSecondaryColor(resolveHex(stored.secondary))
            return
        }

        if (themeDefaults?.primary && themeDefaults?.secondary) {
            setPrimaryColor(resolveHex(themeDefaults.primary))
            setSecondaryColor(resolveHex(themeDefaults.secondary))
            return
        }

        setPrimaryColor(resolveHex(DEFAULT_THEME_COLORS.primary))
        setSecondaryColor(resolveHex(DEFAULT_THEME_COLORS.secondary))
    }, [themeDefaults?.primary, themeDefaults?.secondary, userId])

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
                <section className="overflow-hidden rounded-[2.25rem] border border-border/70 bg-background/90 shadow-sm">
                    <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                                {t('hero.eyebrow')}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full border border-border/70 bg-muted/40 p-3 text-muted-foreground">
                                        <Settings2 className="h-5 w-5" />
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
                        resolvedTheme={resolvedTheme}
                        setTheme={setTheme}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        setPrimaryColor={setPrimaryColor}
                        setSecondaryColor={setSecondaryColor}
                        userId={userId}
                        adminThemeDefaults={themeDefaults ?? undefined}
                        resolveHex={resolveHex}
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
            className="group flex min-h-28 flex-col justify-between rounded-[1.75rem] border border-border/70 bg-muted/20 p-4 transition-colors hover:bg-muted/35"
        >
            <ArrowDownRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            <div className="space-y-1">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm leading-5 text-muted-foreground">{description}</p>
            </div>
        </a>
    )
}
