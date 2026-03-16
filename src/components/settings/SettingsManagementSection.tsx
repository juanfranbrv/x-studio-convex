'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { IconCheck, IconPalette, IconSparkles } from '@/components/ui/icons'
import {
    applyThemeColors,
    COLOR_SCHEMES,
    DEFAULT_THEME_COLORS,
    deriveSchemeFromColors,
    type ThemeColors,
    type SchemeId,
    writeThemeColors,
} from '@/lib/theme-colors'

type Props = {
    t: (key: string, options?: Record<string, unknown>) => string
    panelPosition: 'left' | 'right'
    setPanelPosition: (value: 'left' | 'right') => void
    assistanceEnabled: boolean
    setAssistanceEnabled: (value: boolean) => void
    primaryColor: string
    accentColor: string
    setPrimaryColor: (value: string) => void
    setAccentColor: (value: string) => void
    userId: string | null
    activeSchemeId: SchemeId | 'custom' | null
    setActiveSchemeId: (id: SchemeId | 'custom') => void
}

export function SettingsManagementSection({
    t,
    panelPosition,
    setPanelPosition,
    assistanceEnabled,
    setAssistanceEnabled,
    primaryColor,
    accentColor,
    setPrimaryColor,
    setAccentColor,
    userId,
    activeSchemeId,
    setActiveSchemeId,
}: Props) {
    const applyScheme = (schemeId: SchemeId) => {
        const scheme = COLOR_SCHEMES[schemeId]
        setPrimaryColor(scheme.primary)
        setAccentColor(scheme.accent)
        setActiveSchemeId(schemeId)
        writeThemeColors(userId, scheme)
        applyThemeColors(scheme)
    }

    const applyCustomColors = (primary: string, accent: string) => {
        const scheme = deriveSchemeFromColors(primary, accent)
        setActiveSchemeId('custom')
        writeThemeColors(userId, scheme)
        applyThemeColors(scheme)
    }

    const resetThemeColors = () => {
        setPrimaryColor(DEFAULT_THEME_COLORS.primary)
        setAccentColor(DEFAULT_THEME_COLORS.accent)
        setActiveSchemeId('violeta-canva')
        writeThemeColors(userId, DEFAULT_THEME_COLORS)
        applyThemeColors(DEFAULT_THEME_COLORS)
    }

    return (
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* Section header */}
            <div className="px-6 py-6 md:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                    {t('sections.management.eyebrow')}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {t('sections.management.title')}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {t('sections.management.description')}
                </p>
            </div>

            <div className="grid gap-8 px-6 pb-8 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-8">
                    {/* Workspace settings */}
                    <div className="space-y-5">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {t('management.workspace.title')}
                        </h3>

                        <div className="space-y-4">
                            {/* Panel position */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-foreground">
                                        {t('interface.panelTitle')}
                                    </Label>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {t('interface.panelDescription')}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-border/60 bg-muted/30 p-1">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant={panelPosition === 'right' ? 'secondary' : 'ghost'}
                                            className="rounded-md px-4"
                                            onClick={() => setPanelPosition('right')}
                                        >
                                            {t('interface.right')}
                                        </Button>
                                        <Button
                                            variant={panelPosition === 'left' ? 'secondary' : 'ghost'}
                                            className="rounded-md px-4"
                                            onClick={() => setPanelPosition('left')}
                                        >
                                            {t('interface.left')}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border/40" />

                            {/* Guided assistance */}
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

                    {/* Color schemes */}
                    <div className="space-y-5">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {t('management.colors.title')}
                        </h3>

                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                            {(Object.entries(COLOR_SCHEMES) as [SchemeId, typeof COLOR_SCHEMES[SchemeId]][]).map(([id, scheme]) => (
                                <button
                                    key={id}
                                    onClick={() => applyScheme(id)}
                                    className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl p-3 transition-all hover:shadow-md ${
                                        activeSchemeId === id
                                            ? 'bg-primary/5 shadow-sm ring-2 ring-primary/30'
                                            : 'bg-muted/20 hover:bg-muted/40'
                                    }`}
                                    title={scheme.name}
                                >
                                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: `linear-gradient(135deg, ${scheme.primary} 50%, ${scheme.accent} 50%)` }}
                                        />
                                        {activeSchemeId === id && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <IconCheck className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground">{scheme.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Custom color pickers */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <ColorControl
                                label={t('colors.primary')}
                                value={primaryColor}
                                onChange={(hex) => {
                                    setPrimaryColor(hex)
                                    applyCustomColors(hex, accentColor)
                                }}
                            />
                            <ColorControl
                                label="Accent"
                                value={accentColor}
                                onChange={(hex) => {
                                    setAccentColor(hex)
                                    applyCustomColors(primaryColor, hex)
                                }}
                            />
                        </div>

                        <Button variant="outline" className="rounded-lg" onClick={resetThemeColors}>
                            {t('management.colors.reset')}
                        </Button>
                    </div>
                </div>

                {/* Live preview */}
                <div className="rounded-2xl bg-muted/20 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <IconSparkles className="h-4 w-4 text-primary" />
                        {t('management.preview.title')}
                    </div>
                    <div className="mt-5 space-y-5">
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-11 w-11 rounded-xl"
                                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
                                />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t('management.preview.palette')}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {primaryColor.toUpperCase()} · {accentColor.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <Button className="rounded-lg px-4">{t('management.preview.primaryCta')}</Button>
                                <Button variant="outline" className="rounded-lg px-4">
                                    {t('management.preview.secondaryCta')}
                                </Button>
                                <span className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    <IconPalette className="mr-2 h-3.5 w-3.5" />
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
        <div>
            <Label className="text-sm font-medium text-foreground">{label}</Label>
            <div className="mt-2 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-border/50">
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
