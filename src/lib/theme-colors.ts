export type ThemeColors = {
    primary: string
    accent: string
    surface: string
    surfaceAlt: string
    muted: string
    border: string
    ring: string
    primaryForeground: string
}

export type ThemePaletteDraft = Partial<{
    primary: string
    secondary: string
    surface: string
    surfaceAlt: string
    muted: string
    border: string
    ring: string
}>

export const THEME_PALETTE_FIELDS = [
    { key: 'primary', label: 'Primario', settingKey: 'theme_primary' },
    { key: 'secondary', label: 'Secundario', settingKey: 'theme_secondary' },
    { key: 'surface', label: 'Superficie base', settingKey: 'theme_surface' },
    { key: 'surfaceAlt', label: 'Superficie alternativa', settingKey: 'theme_surface_alt' },
    { key: 'muted', label: 'Texto/muted', settingKey: 'theme_muted' },
    { key: 'border', label: 'Borde', settingKey: 'theme_border' },
    { key: 'ring', label: 'Ring/foco', settingKey: 'theme_ring' },
] as const

export type ThemePaletteFieldKey = (typeof THEME_PALETTE_FIELDS)[number]['key']
export type ThemePaletteSettingKey = (typeof THEME_PALETTE_FIELDS)[number]['settingKey']

export const DEFAULT_THEME_COLORS: ThemeColors = {
    primary: '#7B61FF',
    accent: '#00C4CC',
    surface: '252 40% 97%',
    surfaceAlt: '252 24% 99%',
    muted: '252 12% 46%',
    border: '252 18% 88%',
    ring: '#7B61FF',
    primaryForeground: '#FFFFFF',
}

export const DEFAULT_THEME_DRAFT: ThemePaletteDraft = {
    primary: DEFAULT_THEME_COLORS.primary,
    secondary: DEFAULT_THEME_COLORS.accent,
    surface: DEFAULT_THEME_COLORS.surface,
    surfaceAlt: DEFAULT_THEME_COLORS.surfaceAlt,
    muted: DEFAULT_THEME_COLORS.muted,
    border: DEFAULT_THEME_COLORS.border,
    ring: DEFAULT_THEME_COLORS.ring,
}

export function deriveSchemeFromColors(primary: string, accent: string): ThemeColors {
    const primaryHsl = getRawHsl(primary)
    const accentHsl = getRawHsl(accent)
    const primaryHue = extractHue(primaryHsl, 252)
    const accentHue = extractHue(accentHsl, primaryHue)

    return {
        primary,
        accent,
        surface: `${primaryHue.toFixed(1)} 40% 97%`,
        surfaceAlt: `${accentHue.toFixed(1)} 24% 99%`,
        muted: `${primaryHue.toFixed(1)} 12% 46%`,
        border: `${primaryHue.toFixed(1)} 18% 88%`,
        ring: primary,
        primaryForeground: '#FFFFFF',
    }
}

export function buildThemeColors(theme?: ThemePaletteDraft): ThemeColors {
    const primary = theme?.primary || DEFAULT_THEME_COLORS.primary
    const secondary = theme?.secondary || DEFAULT_THEME_COLORS.accent
    const derived = deriveSchemeFromColors(primary, secondary)

    return {
        ...derived,
        surface: theme?.surface || derived.surface,
        surfaceAlt: theme?.surfaceAlt || derived.surfaceAlt,
        muted: theme?.muted || derived.muted,
        border: theme?.border || derived.border,
        ring: theme?.ring || derived.ring,
    }
}

const hexToHslString = (hex: string): string | null => {
    const normalized = hex.replace(/^#/, '')
    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) return null

    const r = parseInt(normalized.slice(0, 2), 16) / 255
    const g = parseInt(normalized.slice(2, 4), 16) / 255
    const b = parseInt(normalized.slice(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6
                break
            case g:
                h = ((b - r) / d + 2) / 6
                break
            case b:
                h = ((r - g) / d + 4) / 6
                break
        }
    }

    return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`
}

const formatColor = (value: string) => {
    if (!value) return value
    if (value.includes(' ') && !value.includes('(')) return `hsl(${value})`
    if (/^[0-9A-F]{6}$/i.test(value)) return `#${value}`
    return value
}

const getRawHsl = (value: string): string => {
    if (!value) return value
    if (value.includes(' ') && !value.includes('(')) return value

    const normalized = value.replace(/^#/, '')
    if (/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        const hsl = hexToHslString(normalized)
        if (hsl) return hsl
    }

    return value
}

const extractHue = (value: string, fallback: number) => {
    const match = String(value || '').trim().match(/^(-?\d+(?:\.\d+)?)\s+/)
    if (!match) return fallback

    const parsed = Number(match[1])
    if (!Number.isFinite(parsed)) return fallback

    const normalized = ((parsed % 360) + 360) % 360
    return normalized
}

export function applyThemeColors(theme: ThemeColors) {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const primaryHsl = getRawHsl(theme.primary)
    const accentHsl = getRawHsl(theme.accent)
    const surfaceHsl = getRawHsl(theme.surface)
    const surfaceAltHsl = getRawHsl(theme.surfaceAlt)
    const mutedHsl = getRawHsl(theme.muted)
    const borderHsl = getRawHsl(theme.border)
    const ringHsl = getRawHsl(theme.ring)
    const primaryFormatted = formatColor(theme.primary)
    const accentFormatted = formatColor(theme.accent)
    const secondaryHsl = surfaceHsl
    const secondaryForegroundHsl = mutedHsl
    const mutedSurfaceHsl = surfaceAltHsl
    const softAccentHsl = surfaceAltHsl
    const softAccentForegroundHsl = mutedHsl

    root.style.setProperty('--primary', primaryHsl, 'important')
    root.style.setProperty('--color-primary', primaryFormatted, 'important')
    root.style.setProperty('--ring', ringHsl, 'important')
    root.style.setProperty('--color-ring', formatColor(theme.ring), 'important')

    root.style.setProperty('--accent', accentHsl, 'important')
    root.style.setProperty('--color-accent', accentFormatted, 'important')

    root.style.setProperty('--surface', surfaceHsl, 'important')
    root.style.setProperty('--color-surface', formatColor(theme.surface), 'important')
    root.style.setProperty('--surface-alt', surfaceAltHsl, 'important')
    root.style.setProperty('--color-surface-alt', formatColor(theme.surfaceAlt), 'important')
    root.style.setProperty('--sidebar-background', surfaceHsl, 'important')
    root.style.setProperty('--color-sidebar', formatColor(theme.surface), 'important')
    root.style.setProperty('--secondary', secondaryHsl, 'important')
    root.style.setProperty('--secondary-foreground', secondaryForegroundHsl, 'important')
    root.style.setProperty('--muted', mutedSurfaceHsl, 'important')
    root.style.setProperty('--border', borderHsl, 'important')
    root.style.setProperty('--input', borderHsl, 'important')

    root.style.setProperty('--muted-foreground', mutedHsl, 'important')
    root.style.setProperty('--color-muted-foreground', formatColor(theme.muted), 'important')

    root.style.setProperty('--color-brand-primary', primaryFormatted)
    root.style.setProperty('--color-brand-secondary', accentFormatted)
    root.style.setProperty('--theme-primary', primaryFormatted)
    root.style.setProperty('--theme-secondary', accentFormatted)

    root.style.setProperty('--sidebar-primary', primaryHsl, 'important')
    root.style.setProperty('--sidebar-ring', ringHsl, 'important')
    root.style.setProperty('--sidebar-accent', softAccentHsl, 'important')
    root.style.setProperty('--sidebar-accent-foreground', softAccentForegroundHsl, 'important')
    root.style.setProperty('--color-sidebar-primary', primaryFormatted, 'important')
    root.style.setProperty('--color-sidebar-ring', formatColor(theme.ring), 'important')
}
