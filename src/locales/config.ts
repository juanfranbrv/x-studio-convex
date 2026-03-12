export const DEFAULT_LOCALE = 'es-ES' as const

export const SUPPORTED_LOCALES = ['es-ES', 'en-US'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_STORAGE_KEY = 'xstudio.locale'

export const LOCALE_LABELS: Record<AppLocale, string> = {
    'es-ES': 'Espanol',
    'en-US': 'English',
}

export function isSupportedLocale(value: string | null | undefined): value is AppLocale {
    return Boolean(value && SUPPORTED_LOCALES.includes(value as AppLocale))
}

export function normalizeLocale(value?: string | null): AppLocale {
    if (!value) return DEFAULT_LOCALE
    if (isSupportedLocale(value)) return value

    const lower = value.toLowerCase()
    if (lower.startsWith('es')) return 'es-ES'
    if (lower.startsWith('en')) return 'en-US'
    return DEFAULT_LOCALE
}
