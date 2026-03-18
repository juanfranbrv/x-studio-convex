import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
    deriveSchemeFromColors,
    buildThemeColors,
    deriveSchemeAsHex,
    applyThemeColors,
    DEFAULT_THEME_COLORS,
    type ThemeColors,
    type ThemePaletteDraft,
} from '../lib/theme-colors'

describe('deriveSchemeFromColors', () => {
    it('returns all populated fields with valid hex inputs', () => {
        const result = deriveSchemeFromColors('#FF0000', '#00FF00')

        expect(result.primary).toBe('#FF0000')
        expect(result.accent).toBe('#00FF00')
        expect(result.surface).toBeTruthy()
        expect(result.surfaceAlt).toBeTruthy()
        expect(result.muted).toBeTruthy()
        expect(result.border).toBeTruthy()
        expect(result.ring).toBe('#FF0000')
        expect(result.primaryForeground).toBe('#FFFFFF')
    })

    it('produces hue ~0 for #FF0000 (red)', () => {
        const result = deriveSchemeFromColors('#FF0000', '#00FF00')
        const hueMatch = result.surface.match(/^(\d+\.?\d*)\s/)
        expect(hueMatch).not.toBeNull()
        const hue = parseFloat(hueMatch![1])
        expect(hue).toBeCloseTo(0, 0)
    })

    it('produces hue ~120 for #00FF00 (green)', () => {
        const result = deriveSchemeFromColors('#7B61FF', '#00FF00')
        const hueMatch = result.surfaceAlt.match(/^(\d+\.?\d*)\s/)
        expect(hueMatch).not.toBeNull()
        const hue = parseFloat(hueMatch![1])
        expect(hue).toBeCloseTo(120, 0)
    })

    it('produces hue ~240 for #0000FF (blue)', () => {
        const result = deriveSchemeFromColors('#7B61FF', '#0000FF')
        const hueMatch = result.surfaceAlt.match(/^(\d+\.?\d*)\s/)
        expect(hueMatch).not.toBeNull()
        const hue = parseFloat(hueMatch![1])
        expect(hue).toBeCloseTo(240, 0)
    })

    it('handles lowercase hex inputs', () => {
        const result = deriveSchemeFromColors('#ff0000', '#00ff00')
        expect(result.primary).toBe('#ff0000')
        expect(result.accent).toBe('#00ff00')
    })

    it('handles invalid hex by using fallback hue', () => {
        const result = deriveSchemeFromColors('invalid', '#00FF00')
        expect(result.primary).toBe('invalid')
        expect(result.surface).toBeTruthy()
        expect(result.muted).toBeTruthy()
    })
})

describe('buildThemeColors', () => {
    it('returns default colors when called with no args', () => {
        const result = buildThemeColors()
        expect(result.primary).toBe(DEFAULT_THEME_COLORS.primary)
        expect(result.accent).toBe(DEFAULT_THEME_COLORS.accent)
    })

    it('returns default colors when called with undefined', () => {
        const result = buildThemeColors(undefined)
        expect(result.primary).toBe(DEFAULT_THEME_COLORS.primary)
    })

    it('returns default colors when called with empty object', () => {
        const result = buildThemeColors({})
        expect(result.primary).toBe(DEFAULT_THEME_COLORS.primary)
    })

    it('merges partial theme with derived colors', () => {
        const partialTheme: ThemePaletteDraft = {
            primary: '#FF0000',
            surface: '0 50% 50%',
        }
        const result = buildThemeColors(partialTheme)
        expect(result.primary).toBe('#FF0000')
        expect(result.surface).toBe('0 50% 50%')
    })

    it('uses provided secondary as accent in derivation', () => {
        const partialTheme: ThemePaletteDraft = {
            primary: '#FF0000',
            secondary: '#0000FF',
        }
        const result = buildThemeColors(partialTheme)
        expect(result.primary).toBe('#FF0000')
        expect(result.accent).toBe('#0000FF')
    })

    it('allows overriding all fields with full theme', () => {
        const fullTheme: ThemePaletteDraft = {
            primary: '#111111',
            secondary: '#222222',
            surface: '0 10% 20%',
            surfaceAlt: '0 20% 30%',
            muted: '0 30% 40%',
            border: '0 40% 50%',
            ring: '#333333',
        }
        const result = buildThemeColors(fullTheme)
        expect(result.surface).toBe('0 10% 20%')
        expect(result.surfaceAlt).toBe('0 20% 30%')
        expect(result.muted).toBe('0 30% 40%')
        expect(result.border).toBe('0 40% 50%')
        expect(result.ring).toBe('#333333')
    })
})

describe('deriveSchemeAsHex', () => {
    it('returns surface/muted/border as hex strings', () => {
        const result = deriveSchemeAsHex('#FF0000', '#00FF00')
        expect(result.surface).toMatch(/^#[0-9a-fA-F]{6}$/)
        expect(result.surfaceAlt).toMatch(/^#[0-9a-fA-F]{6}$/)
        expect(result.muted).toMatch(/^#[0-9a-fA-F]{6}$/)
        expect(result.border).toMatch(/^#[0-9a-fA-F]{6}$/)
    })

    it('preserves primary and accent as-is', () => {
        const result = deriveSchemeAsHex('#FF0000', '#00FF00')
        expect(result.primary).toBe('#FF0000')
        expect(result.accent).toBe('#00FF00')
    })

    it('returns ring as primary value', () => {
        const result = deriveSchemeAsHex('#FF0000', '#00FF00')
        expect(result.ring).toBe('#FF0000')
    })
})

describe('applyThemeColors', () => {
    let setPropertyMock: ReturnType<typeof vi.fn>

    let originalWindow: typeof global.window | undefined

    beforeEach(() => {
        setPropertyMock = vi.fn()
        originalWindow = global.window
        // Ensure window is defined so applyThemeColors doesn't bail early
        if (typeof global.window === 'undefined') {
            // @ts-expect-error minimal window mock
            global.window = {}
        }
        Object.defineProperty(global, 'document', {
            value: {
                documentElement: {
                    style: { setProperty: setPropertyMock },
                },
            },
            writable: true,
            configurable: true,
        })
    })

    afterEach(() => {
        // @ts-expect-error cleaning up
        delete global.document
        if (originalWindow === undefined) {
            // @ts-expect-error cleaning up
            delete global.window
        } else {
            global.window = originalWindow
        }
        vi.restoreAllMocks()
    })

    const testTheme: ThemeColors = {
        primary: '#FF0000',
        accent: '#00FF00',
        surface: '0 40% 97%',
        surfaceAlt: '120 24% 99%',
        muted: '0 12% 46%',
        border: '0 18% 88%',
        ring: '#FF0000',
        primaryForeground: '#FFFFFF',
    }

    it('sets primary CSS custom properties', () => {
        applyThemeColors(testTheme)
        expect(setPropertyMock).toHaveBeenCalledWith('--color-primary', '#FF0000', 'important')
        expect(setPropertyMock).toHaveBeenCalledWith('--color-accent', '#00FF00', 'important')
    })

    it('sets surface properties', () => {
        applyThemeColors(testTheme)
        expect(setPropertyMock).toHaveBeenCalledWith('--surface', '0 40% 97%', 'important')
        expect(setPropertyMock).toHaveBeenCalledWith('--color-surface', 'hsl(0 40% 97%)', 'important')
    })

    it('sets sidebar-related properties', () => {
        applyThemeColors(testTheme)
        expect(setPropertyMock).toHaveBeenCalledWith('--sidebar-background', expect.any(String), 'important')
        expect(setPropertyMock).toHaveBeenCalledWith('--sidebar-primary', expect.any(String), 'important')
    })

    it('sets brand color properties without important flag', () => {
        applyThemeColors(testTheme)
        expect(setPropertyMock).toHaveBeenCalledWith('--color-brand-primary', '#FF0000')
        expect(setPropertyMock).toHaveBeenCalledWith('--color-brand-secondary', '#00FF00')
    })

    it('does nothing when window is undefined', () => {
        const originalWindow = global.window
        // @ts-expect-error simulating SSR
        delete global.window
        applyThemeColors(testTheme)
        expect(setPropertyMock).not.toHaveBeenCalled()
        global.window = originalWindow
    })
})

describe('DEFAULT_THEME_COLORS', () => {
    it('has primary and accent as hex colors', () => {
        expect(DEFAULT_THEME_COLORS.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
        expect(DEFAULT_THEME_COLORS.accent).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has surface colors in HSL format', () => {
        const hslPattern = /^\d+\.?\d*\s+\d+%?\s+\d+%?$/
        expect(DEFAULT_THEME_COLORS.surface).toMatch(hslPattern)
        expect(DEFAULT_THEME_COLORS.surfaceAlt).toMatch(hslPattern)
        expect(DEFAULT_THEME_COLORS.muted).toMatch(hslPattern)
        expect(DEFAULT_THEME_COLORS.border).toMatch(hslPattern)
    })
})
