'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'convex/react'
import { ArrowDownRight, Settings2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useUI } from '@/contexts/UIContext'
import { api } from '../../../convex/_generated/api'
import {
    COLOR_SCHEMES,
    DEFAULT_THEME_COLORS,
    deriveSchemeFromColors,
    readThemeColors,
    type SchemeId,
} from '@/lib/theme-colors'
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
    const themeDefaults = useQuery(api.settings.getThemeSettings)

    const userId = useMemo(() => user?.id ?? null, [user?.id])

    const resolveHex = (value: string | undefined): string => {
        if (!value) return '#7B61FF'
        if (value.startsWith('#')) return value
        if (/^[0-9A-Fa-f]{6}$/.test(value)) return `#${value}`
        // HSL string — convert
        const parts = value.replace(/^hsl\(/, '').replace(/\)$/, '').trim().split(/\s+/g)
        if (parts.length < 3) return '#7B61FF'
        const h = Number(parts[0])
        const s = Number(parts[1].replace('%', '')) / 100
        const l = Number(parts[2].replace('%', '')) / 100
        if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) return '#7B61FF'
        const hueToRgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1; if (t > 1) t -= 1
            if (t < 1/6) return p + (q - p) * 6 * t
            if (t < 1/2) return q
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
            return p
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        const r = Math.round(hueToRgb(p, q, h/360 + 1/3) * 255)
        const g = Math.round(hueToRgb(p, q, h/360) * 255)
        const b = Math.round(hueToRgb(p, q, h/360 - 1/3) * 255)
        const toHex = (n: number) => n.toString(16).padStart(2, '0')
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const [primaryColor, setPrimaryColor] = useState(DEFAULT_THEME_COLORS.primary)
    const [accentColor, setAccentColor] = useState(DEFAULT_THEME_COLORS.accent)
    const [activeSchemeId, setActiveSchemeId] = useState<SchemeId | 'custom' | null>(null)

    // Detect which scheme matches current colors
    const detectScheme = (primary: string, accent: string): SchemeId | 'custom' => {
        for (const [id, scheme] of Object.entries(COLOR_SCHEMES) as [SchemeId, typeof COLOR_SCHEMES[SchemeId]][]) {
            if (scheme.primary.toLowerCase() === primary.toLowerCase() && scheme.accent.toLowerCase() === accent.toLowerCase()) {
                return id
            }
        }
        return 'custom'
    }

    useEffect(() => {
        const stored = readThemeColors(userId)
        if (stored?.primary && stored?.accent) {
            const p = resolveHex(stored.primary)
            const a = resolveHex(stored.accent)
            setPrimaryColor(p)
            setAccentColor(a)
            setActiveSchemeId(detectScheme(p, a))
            return
        }

        // Legacy migration: stored has secondary instead of accent
        if (stored?.primary && (stored as Record<string, string>).secondary) {
            const p = resolveHex(stored.primary)
            const a = resolveHex((stored as Record<string, string>).secondary)
            setPrimaryColor(p)
            setAccentColor(a)
            setActiveSchemeId(detectScheme(p, a))
            return
        }

        if (themeDefaults?.primary && themeDefaults?.secondary) {
            const p = resolveHex(themeDefaults.primary)
            const a = resolveHex(themeDefaults.secondary)
            setPrimaryColor(p)
            setAccentColor(a)
            setActiveSchemeId(detectScheme(p, a))
            return
        }

        setPrimaryColor(DEFAULT_THEME_COLORS.primary)
        setAccentColor(DEFAULT_THEME_COLORS.accent)
        setActiveSchemeId('violeta-canva')
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
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/70">
                                {t('hero.eyebrow')}
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
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
                        primaryColor={primaryColor}
                        accentColor={accentColor}
                        setPrimaryColor={setPrimaryColor}
                        setAccentColor={setAccentColor}
                        userId={userId}
                        activeSchemeId={activeSchemeId}
                        setActiveSchemeId={setActiveSchemeId}
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
            <ArrowDownRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            <div className="space-y-1">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm leading-5 text-muted-foreground">{description}</p>
            </div>
        </a>
    )
}
