export type ThemeColors = {
    primary: string
    secondary: string
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
    primary: '243.4 75.4% 58.6%',
    secondary: '330 81% 60%',
}

export function getThemeStorageKey(userId?: string | null): string {
    const base = 'x-studio-theme-colors'
    return userId ? `${base}:${userId}` : `${base}:anon`
}

export function readThemeColors(userId?: string | null): ThemeColors | null {
    if (typeof window === 'undefined') return null
    const key = getThemeStorageKey(userId)
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw) as ThemeColors
        if (!parsed?.primary || !parsed?.secondary) return null
        return parsed
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

export function applyThemeColors(theme: ThemeColors) {
    if (typeof window === 'undefined') return
    const root = document.documentElement

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
        if (val.includes(' ') && !val.includes('(')) {
            return `hsl(${val})`
        }
        if (/^[0-9A-F]{6}$/i.test(val)) {
            return `#${val}`
        }
        return val
    }

    const getRawHsl = (val: string): string => {
        if (!val) return val
        if (val.includes(' ') && !val.includes('(')) {
            return val
        }
        const hex = val.replace(/^#/, '')
        if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
            const hsl = hexToHslString(hex)
            if (hsl) return hsl
        }
        return val
    }

    root.style.setProperty('--color-brand-primary', formatColor(theme.primary))
    root.style.setProperty('--color-brand-secondary', formatColor(theme.secondary))

    root.style.setProperty('--theme-primary', formatColor(theme.primary))
    root.style.setProperty('--theme-secondary', formatColor(theme.secondary))

    const primaryHsl = getRawHsl(theme.primary)
    const secondaryHsl = getRawHsl(theme.secondary)
    const primaryFormatted = formatColor(theme.primary)
    const secondaryFormatted = formatColor(theme.secondary)

    root.style.setProperty('--primary', primaryHsl, 'important')
    root.style.setProperty('--ring', primaryHsl, 'important')
    root.style.setProperty('--secondary', secondaryHsl, 'important')

    root.style.setProperty('--color-primary', primaryFormatted, 'important')
    root.style.setProperty('--color-secondary', secondaryFormatted, 'important')
    root.style.setProperty('--color-ring', primaryFormatted, 'important')

    root.style.setProperty('--sidebar-primary', primaryHsl, 'important')
    root.style.setProperty('--sidebar-ring', primaryHsl, 'important')
    root.style.setProperty('--color-sidebar-primary', primaryFormatted, 'important')
    root.style.setProperty('--color-sidebar-ring', primaryFormatted, 'important')
}
