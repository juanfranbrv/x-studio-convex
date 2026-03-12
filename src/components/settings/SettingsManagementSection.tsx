'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { applyThemeColors, DEFAULT_THEME_COLORS, writeThemeColors } from '@/lib/theme-colors'
import { Layout, Moon, Palette, Sparkles, Sun } from 'lucide-react'

type Props = {
    t: (key: string, options?: Record<string, unknown>) => string
    panelPosition: 'left' | 'right'
    setPanelPosition: (value: 'left' | 'right') => void
    assistanceEnabled: boolean
    setAssistanceEnabled: (value: boolean) => void
    resolvedTheme?: string
    setTheme: (theme: string) => void
    primaryColor: string
    secondaryColor: string
    setPrimaryColor: (value: string) => void
    setSecondaryColor: (value: string) => void
    userId: string | null
}

const presetColors = [
    { primary: '#22c55e', secondary: '#38bdf8', title: 'Green & Blue' },
    { primary: '#a855f7', secondary: '#fb923c', title: 'Purple & Orange' },
    { primary: '#6366f1', secondary: '#ec4899', title: 'Indigo & Pink' },
    { primary: '#ef4444', secondary: '#f97316', title: 'Red & Amber' },
    { primary: '#0ea5e9', secondary: '#14b8a6', title: 'Ocean Breeze' },
]

export function SettingsManagementSection({
    t,
    panelPosition,
    setPanelPosition,
    assistanceEnabled,
    setAssistanceEnabled,
    resolvedTheme,
    setTheme,
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
    userId,
}: Props) {
    const saveThemeColors = (nextPrimary: string, nextSecondary: string) => {
        const payload = { primary: nextPrimary, secondary: nextSecondary }
        writeThemeColors(userId, payload)
        applyThemeColors(payload)
    }

    const resetThemeColors = () => {
        setPrimaryColor(DEFAULT_THEME_COLORS.primary)
        setSecondaryColor(DEFAULT_THEME_COLORS.secondary)
        saveThemeColors(DEFAULT_THEME_COLORS.primary, DEFAULT_THEME_COLORS.secondary)
    }

    return (
        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-background/85 shadow-sm">
            <div className="border-b border-border/60 px-6 py-6 md:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {t('sections.management.eyebrow')}
                </p>
                <div className="mt-3 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            {t('sections.management.title')}
                        </h2>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            {t('sections.management.description')}
                        </p>
                    </div>
                    <div className="hidden rounded-full border border-border/70 bg-muted/50 p-3 text-muted-foreground md:flex">
                        <Layout className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="grid gap-8 px-6 py-6 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {t('management.workspace.title')}
                            </h3>
                            <p className="text-sm text-muted-foreground">{t('management.workspace.description')}</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="rounded-[1.5rem] border border-border/70 bg-muted/20 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-foreground">
                                            {t('interface.panelTitle')}
                                        </Label>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {t('interface.panelDescription')}
                                        </p>
                                    </div>
                                    <div className="rounded-full border border-border/70 bg-background p-1">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant={panelPosition === 'right' ? 'secondary' : 'ghost'}
                                                className="rounded-full px-4"
                                                onClick={() => setPanelPosition('right')}
                                            >
                                                {t('interface.right')}
                                            </Button>
                                            <Button
                                                variant={panelPosition === 'left' ? 'secondary' : 'ghost'}
                                                className="rounded-full px-4"
                                                onClick={() => setPanelPosition('left')}
                                            >
                                                {t('interface.left')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-border/70 bg-muted/20 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="guided-assistance" className="text-sm font-medium text-foreground">
                                            {t('interface.guidedTitle')}
                                        </Label>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {t('interface.guidedDescription')}
                                        </p>
                                    </div>
                                    <Switch
                                        id="guided-assistance"
                                        checked={assistanceEnabled}
                                        onCheckedChange={setAssistanceEnabled}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {t('management.colors.title')}
                            </h3>
                            <p className="text-sm text-muted-foreground">{t('management.colors.description')}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {presetColors.map((preset) => (
                                <button
                                    key={preset.title}
                                    onClick={() => {
                                        setPrimaryColor(preset.primary)
                                        setSecondaryColor(preset.secondary)
                                        saveThemeColors(preset.primary, preset.secondary)
                                    }}
                                    className="relative h-11 w-11 rounded-full border border-border/70 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                                    title={preset.title}
                                >
                                    <span className="sr-only">{preset.title}</span>
                                </button>
                            ))}
                            <Button variant="outline" className="rounded-full px-4" onClick={resetThemeColors}>
                                {t('management.colors.reset')}
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <ColorControl
                                label={t('colors.primary')}
                                value={primaryColor}
                                onChange={(hex) => {
                                    setPrimaryColor(hex)
                                    saveThemeColors(hex, secondaryColor)
                                }}
                            />
                            <ColorControl
                                label={t('colors.secondary')}
                                value={secondaryColor}
                                onChange={(hex) => {
                                    setSecondaryColor(hex)
                                    saveThemeColors(primaryColor, hex)
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-[1.75rem] border border-border/70 bg-muted/15 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        {t('management.preview.title')}
                    </div>
                    <div className="mt-5 space-y-5">
                        <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        {t('appearance.title')}
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-foreground">
                                        {resolvedTheme === 'dark' ? t('appearance.dark') : t('appearance.light')}
                                    </p>
                                </div>
                                <div className="rounded-full border border-border/70 bg-muted/40 p-3 text-muted-foreground">
                                    {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <Button
                                    variant={resolvedTheme === 'light' ? 'secondary' : 'outline'}
                                    className="justify-start gap-2 rounded-2xl"
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-4 w-4" />
                                    {t('appearance.light')}
                                </Button>
                                <Button
                                    variant={resolvedTheme === 'dark' ? 'secondary' : 'outline'}
                                    className="justify-start gap-2 rounded-2xl"
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-4 w-4" />
                                    {t('appearance.dark')}
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-11 w-11 rounded-2xl border border-border/60"
                                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                                />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('management.preview.palette')}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {primaryColor.toUpperCase()} · {secondaryColor.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <Button className="rounded-full px-4">{t('management.preview.primaryCta')}</Button>
                                <Button variant="outline" className="rounded-full px-4">
                                    {t('management.preview.secondaryCta')}
                                </Button>
                                <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                                    <Palette className="mr-2 h-3.5 w-3.5" />
                                    {t('management.preview.helper')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ColorControl({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="rounded-[1.5rem] border border-border/70 bg-muted/20 p-4">
            <Label className="text-sm font-medium text-foreground">{label}</Label>
            <div className="mt-3 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-border/70">
                    <input
                        type="color"
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] cursor-pointer border-none p-0"
                    />
                </div>
                <span className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {value}
                </span>
            </div>
        </div>
    )
}
