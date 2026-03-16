/** Full color scheme with 6 tokens */
export type ThemeColors = {
    primary: string
    accent: string
    surface: string
    surfaceAlt: string
    muted: string
    primaryForeground: string
}

/** Legacy format (2 colors) for migration */
type LegacyThemeColors = { primary: string; secondary: string }

/** Predefined color schemes — Canva-style */
export const COLOR_SCHEMES = {
    'violeta-canva': {
        name: 'Violeta Canva',
        primary: '#7B61FF',
        accent: '#00C4CC',
        surface: '#F7F7F8',
        surfaceAlt: '#FFFFFF',
        muted: '#6B7280',
        primaryForeground: '#FFFFFF',
    },
    ocean: {
        name: 'Ocean',
        primary: '#0B8AE0',
        accent: '#14B8A6',
        surface: '#F5F8FA',
        surfaceAlt: '#FFFFFF',
        muted: '#64748B',
        primaryForeground: '#FFFFFF',
    },
    sunset: {
        name: 'Sunset',
        primary: '#F56040',
        accent: '#FCAF45',
        surface: '#FFF9F5',
        surfaceAlt: '#FFFFFF',
        muted: '#78716C',
        primaryForeground: '#FFFFFF',
    },
    forest: {
        name: 'Forest',
        primary: '#16A34A',
        accent: '#84CC16',
        surface: '#F5FAF5',
        surfaceAlt: '#FFFFFF',
        muted: '#6B7280',
        primaryForeground: '#FFFFFF',
    },
    berry: {
        name: 'Berry',
        primary: '#A855F7',
        accent: '#EC4899',
        surface: '#FAF5FF',
        surfaceAlt: '#FFFFFF',
        muted: '#7C7C8A',
        primaryForeground: '#FFFFFF',
    },
    'slate-pro': {
        name: 'Slate Pro',
        primary: '#475569',
        accent: '#6366F1',
        surface: '#F8FAFC',
        surfaceAlt: '#FFFFFF',
        muted: '#94A3B8',
        primaryForeground: '#FFFFFF',
    },
} as const satisfies Record<string, ThemeColors & { name: string }>

export type SchemeId = keyof typeof COLOR_SCHEMES

export const DEFAULT_THEME_COLORS: ThemeColors = COLOR_SCHEMES['violeta-canva']

export function getThemeStorageKey(userId?: string | null): string {
    const base = 'x-studio-theme-colors'
    return userId ? `${base}:${userId}` : `${base}:anon`
}

/** Derive a full scheme from just primary + accent (for custom picker) */
export function deriveSchemeFromColors(primary: string, accent: string): ThemeColors {
    return {
        primary,
        accent,
        surface: '#F7F7F8',
        surfaceAlt: '#FFFFFF',
        muted: '#6B7280',
        primaryForeground: '#FFFFFF',
    }
}

/** Migrate legacy 2-color format to new 6-token format */
function migrateLegacy(legacy: LegacyThemeColors): ThemeColors {
    return deriveSchemeFromColors(legacy.primary, legacy.secondary)
}

export function readThemeColors(userId?: string | null): ThemeColors | null {
    if (typeof window === 'undefined') return null
    const key = getThemeStorageKey(userId)
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        // New format
        if (parsed?.primary && parsed?.accent) return parsed as ThemeColors
        // Legacy format migration
        if (parsed?.primary && parsed?.secondary) return migrateLegacy(parsed as LegacyThemeColors)
        return null
    } catch {
        return null
    }
}

export function writeThemeColors(userId: string | null | undefined, colors: ThemeColors) {
    if (typeof window === 'undefined') return
    const key = getThemeStorageKey(userId)
    window.localStorage.setItem(key, JSON.stringify(colors))
    window.dispatchEvent(new CustomEvent('x-studio-theme-colors-updated'))
}

const hexToHslString = (hex: string): string | null => {
    hex = hex.replace(/^#/, '')
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null

    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
    }

    return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`
}

const formatColor = (val: string) => {
    if (!val) return val
    if (val.includes(' ') && !val.includes('(')) return `hsl(${val})`
    if (/^[0-9A-F]{6}$/i.test(val)) return `#${val}`
    return val
}

const getRawHsl = (val: string): string => {
    if (!val) return val
    if (val.includes(' ') && !val.includes('(')) return val
    const hex = val.replace(/^#/, '')
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
        const hsl = hexToHslString(hex)
        if (hsl) return hsl
    }
    return val
}

export function applyThemeColors(theme: ThemeColors) {
    if (typeof window === 'undefined') return
    const root = document.documentElement

    const primaryHsl = getRawHsl(theme.primary)
    const accentHsl = getRawHsl(theme.accent)
    const surfaceHsl = getRawHsl(theme.surface)
    const surfaceAltHsl = getRawHsl(theme.surfaceAlt)
    const mutedHsl = getRawHsl(theme.muted)

    const primaryFormatted = formatColor(theme.primary)
    const accentFormatted = formatColor(theme.accent)

    // Primary color → buttons, links, active states
    root.style.setProperty('--primary', primaryHsl, 'important')
    root.style.setProperty('--color-primary', primaryFormatted, 'important')
    root.style.setProperty('--ring', primaryHsl, 'important')
    root.style.setProperty('--color-ring', primaryFormatted, 'important')

    // Accent color → secondary actions, hover states, chips
    root.style.setProperty('--accent', accentHsl, 'important')
    root.style.setProperty('--color-accent', accentFormatted, 'important')

    // Surface colors → backgrounds
    root.style.setProperty('--surface', surfaceHsl, 'important')
    root.style.setProperty('--color-surface', formatColor(theme.surface), 'important')
    root.style.setProperty('--surface-alt', surfaceAltHsl, 'important')
    root.style.setProperty('--color-surface-alt', formatColor(theme.surfaceAlt), 'important')
    root.style.setProperty('--sidebar-background', surfaceHsl, 'important')
    root.style.setProperty('--color-sidebar', formatColor(theme.surface), 'important')

    // Muted → secondary text
    root.style.setProperty('--muted-foreground', mutedHsl, 'important')
    root.style.setProperty('--color-muted-foreground', formatColor(theme.muted), 'important')

    // Brand colors (for gradient etc)
    root.style.setProperty('--color-brand-primary', primaryFormatted)
    root.style.setProperty('--color-brand-secondary', accentFormatted)
    root.style.setProperty('--theme-primary', primaryFormatted)
    root.style.setProperty('--theme-secondary', accentFormatted)

    // Sidebar
    root.style.setProperty('--sidebar-primary', primaryHsl, 'important')
    root.style.setProperty('--sidebar-ring', primaryHsl, 'important')
    root.style.setProperty('--color-sidebar-primary', primaryFormatted, 'important')
    root.style.setProperty('--color-sidebar-ring', primaryFormatted, 'important')
}
