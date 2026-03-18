const DEFAULT_MAX_DISPLAY_LENGTH = 48
const DEFAULT_AUTO_TITLE_WORDS = 5
const DEFAULT_AUTO_TITLE_CHARS = 34

function collapseWhitespace(value?: string | null) {
    return (value || '').replace(/\s+/g, ' ').trim()
}

function truncateTitle(value: string, maxLength = DEFAULT_MAX_DISPLAY_LENGTH) {
    if (value.length <= maxLength) return value
    return `${value.slice(0, maxLength).trim()}...`
}

export function normalizeCustomSessionTitle(value?: string | null, fallback = 'New session') {
    const cleaned = collapseWhitespace(value)
    if (!cleaned) return fallback
    return truncateTitle(cleaned)
}

export function buildAutomaticSessionTitle(value?: string | null, fallback = 'New session') {
    const cleaned = collapseWhitespace(value)
    if (!cleaned) return fallback

    const firstSegment = cleaned
        .split(/[|:;,.!?()[\]{}]+/)
        .map((segment) => collapseWhitespace(segment))
        .find(Boolean) || cleaned

    const normalized = firstSegment
        .replace(/https?:\/\/\S+/gi, '')
        .replace(/[^\p{L}\p{N}\s'-]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    if (!normalized) return fallback

    const words = normalized.split(' ').filter(Boolean)
    const shortTitle = words.slice(0, DEFAULT_AUTO_TITLE_WORDS).join(' ')

    return truncateTitle(shortTitle || normalized, DEFAULT_AUTO_TITLE_CHARS)
}

export function getSessionDisplayTitle(
    value: string | null | undefined,
    options?: {
        fallback?: string
        customized?: boolean
    }
) {
    const fallback = options?.fallback || 'New session'
    if (options?.customized) {
        return normalizeCustomSessionTitle(value, fallback)
    }
    return buildAutomaticSessionTitle(value, fallback)
}
