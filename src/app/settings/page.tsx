'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useEffect, useMemo, useState } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'convex/react'
import { CreditCard, Layout, LogOut, Moon, Palette, Settings, Sun } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useUI } from '@/contexts/UIContext'
import { applyThemeColors, DEFAULT_THEME_COLORS, readThemeColors, writeThemeColors } from '@/lib/theme-colors'
import { api } from '../../../convex/_generated/api'

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

    const saveThemeColors = (nextPrimary: string, nextSecondary: string) => {
        const payload = { primary: nextPrimary, secondary: nextSecondary }
        writeThemeColors(userId, payload)
        applyThemeColors(payload)
    }

    const presetColors = [
        { primary: '#22c55e', secondary: '#38bdf8', title: 'Green & Blue' },
        { primary: '#a855f7', secondary: '#fb923c', title: 'Purple & Orange' },
        { primary: '#6366f1', secondary: '#ec4899', title: 'Indigo & Pink' },
        { primary: '#ef4444', secondary: '#f97316', title: 'Red & Amber' },
        { primary: '#0ea5e9', secondary: '#14b8a6', title: 'Ocean Breeze' },
    ]

    return (
        <DashboardLayout brands={brandKits} currentBrand={activeBrandKit} onBrandChange={setActiveBrandKit}>
            <main className="mx-auto max-w-5xl p-6 md:p-12">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-2xl bg-brand-gradient p-3 shadow-aero-glow">
                            <Settings className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{t('headerTitle')}</h1>
                            <p className="text-muted-foreground">{t('headerDescription')}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="glass-panel border-0 border-primary/20 bg-primary/5 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Layout className="h-5 w-5 text-primary" />
                                {t('interface.title')}
                            </CardTitle>
                            <CardDescription>{t('interface.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Separator />
                            <div className="space-y-2">
                                <div className="space-y-0.5">
                                    <Label>{t('interface.panelTitle')}</Label>
                                    <p className="text-sm text-muted-foreground">{t('interface.panelDescription')}</p>
                                </div>
                                <div className="flex w-full items-center rounded-full bg-muted/60 p-1">
                                    <Button
                                        variant={panelPosition === 'right' ? 'secondary' : 'ghost'}
                                        className="h-10 flex-1 rounded-full text-sm font-medium"
                                        onClick={() => setPanelPosition('right')}
                                    >
                                        {t('interface.right')}
                                    </Button>
                                    <Button
                                        variant={panelPosition === 'left' ? 'secondary' : 'ghost'}
                                        className="h-10 flex-1 rounded-full text-sm font-medium"
                                        onClick={() => setPanelPosition('left')}
                                    >
                                        {t('interface.left')}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="guided-assistance">{t('interface.guidedTitle')}</Label>
                                    <p className="text-sm text-muted-foreground">{t('interface.guidedDescription')}</p>
                                </div>
                                <Switch id="guided-assistance" checked={assistanceEnabled} onCheckedChange={setAssistanceEnabled} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Palette className="h-5 w-5 text-primary" />
                                {t('colors.title')}
                            </CardTitle>
                            <CardDescription>{t('colors.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Separator />
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm text-muted-foreground">{t('colors.presets')}</Label>
                                <div className="flex gap-3">
                                    {presetColors.map((preset) => (
                                        <button
                                            key={preset.title}
                                            onClick={() => {
                                                setPrimaryColor(preset.primary)
                                                setSecondaryColor(preset.secondary)
                                                saveThemeColors(preset.primary, preset.secondary)
                                            }}
                                            className="group relative h-10 w-10 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                            style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                                            title={preset.title}
                                        >
                                            <span className="sr-only">{preset.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid max-w-md grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label>{t('colors.primary')}</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 overflow-hidden rounded-lg border shadow-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => {
                                                    const hex = e.target.value
                                                    setPrimaryColor(hex)
                                                    saveThemeColors(hex, secondaryColor)
                                                }}
                                                className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] cursor-pointer border-none p-0"
                                            />
                                        </div>
                                        <span className="font-mono text-sm uppercase text-muted-foreground">{primaryColor}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>{t('colors.secondary')}</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 overflow-hidden rounded-lg border shadow-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                            <input
                                                type="color"
                                                value={secondaryColor}
                                                onChange={(e) => {
                                                    const hex = e.target.value
                                                    setSecondaryColor(hex)
                                                    saveThemeColors(primaryColor, hex)
                                                }}
                                                className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] cursor-pointer border-none p-0"
                                            />
                                        </div>
                                        <span className="font-mono text-sm uppercase text-muted-foreground">{secondaryColor}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <CreditCard className="h-5 w-5 text-primary" />
                                {t('billing:account.title')}
                            </CardTitle>
                            <CardDescription>{t('billing:account.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <Link href="/billing">
                                    <Button className="h-10 rounded-full px-5">
                                        {t('billing:account.actions.openPortal')}
                                    </Button>
                                </Link>
                                <Link href="/pricing">
                                    <Button variant="outline" className="h-10 rounded-full px-5">
                                        {t('billing:account.actions.viewPricing')}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Palette className="h-5 w-5 text-primary" />
                                {t('appearance.title')}
                            </CardTitle>
                            <CardDescription>{t('appearance.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>{t('appearance.theme')}</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={resolvedTheme === 'light' ? 'secondary' : 'outline'}
                                        className="h-10 justify-start gap-2 transition-all"
                                        onClick={() => setTheme('light')}
                                    >
                                        <Sun className="h-4 w-4" />
                                        {t('appearance.light')}
                                    </Button>
                                    <Button
                                        variant={resolvedTheme === 'dark' ? 'secondary' : 'outline'}
                                        className="h-10 justify-start gap-2 transition-all"
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Moon className="h-4 w-4" />
                                        {t('appearance.dark')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <LogOut className="h-5 w-5 text-primary" />
                                {t('session.title')}
                            </CardTitle>
                            <CardDescription>{t('session.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted shadow-sm">
                                    {user?.imageUrl ? (
                                        <img src={user.imageUrl} alt={user.firstName || t('common:labels.user')} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                                            {user?.firstName?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">{user?.fullName || user?.firstName || t('common:labels.user')}</p>
                                    <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || t('common:labels.noEmail')}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium text-foreground">{t('session.logoutTitle')}</p>
                                    <p className="text-sm text-muted-foreground">{t('session.logoutDescription')}</p>
                                </div>
                                <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut} className="h-10 gap-2">
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
                        </CardContent>
                    </Card>
                </div>
            </main>
        </DashboardLayout>
    )
}


