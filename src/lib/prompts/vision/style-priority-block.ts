import type { VisionAnalysis } from '@/lib/creation-flow-types'

function normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim()
}

function ensureTrailingPeriod(value: string): string {
    if (!value) return value
    return /[.!?]$/.test(value) ? value : `${value}.`
}

export function buildPriority5StyleBlockFromAnalysis(analysis?: VisionAnalysis | null): string {
    const rawKeywords = Array.isArray(analysis?.keywords)
        ? analysis!.keywords.find((entry) => typeof entry === 'string' && entry.trim().length > 0) || ''
        : ''
    const styleDescription = ensureTrailingPeriod(normalizeWhitespace(rawKeywords))
    if (!styleDescription) return ''

    return [
        `STYLE DIRECTIVES: Render the image in this exact aesthetic direction based on ${styleDescription} Match the reference medium faithfully (photographic, illustrative, painterly, or hybrid) and preserve coherent visual construction, controlled contrast, clean finishing, and readable layering while respecting the detected stylistic language.`,
        'COLOR DOMINANCE RULE: Style cues define form, line quality, texture and composition. PRIORITY 06 brand palette controls final hue decisions. Do not override brand colors with fixed external color schemes.',
        '',
        'STYLE SOURCE RULE: The style reference was analyzed as text-only guidance. DO NOT reproduce its exact subject/object unless explicitly requested in the mandatory text.',
        '',
        'Every pixel must embody this aesthetic mood.',
    ].join('\n')
}

function normalizeDirectiveFragment(value: string): string {
    return value
        .replace(/\s+/g, ' ')
        .replace(/^[\s,.;:!-]+|[\s,.;:!-]+$/g, '')
        .trim()
}

function extractCustomStyleOnly(value: string): string {
    if (!value) return ''
    const trimmed = value.trim()

    // If a full style block was passed by mistake, keep only the STYLE DIRECTIVES payload.
    const styleDirectivesMatch = trimmed.match(/STYLE DIRECTIVES:\s*([\s\S]*)/i)
    const base = styleDirectivesMatch ? styleDirectivesMatch[1] : trimmed

    const withoutRuleBlocks = base
        .replace(/PRIORITY\s*\d+\s*-\s*[^\n]+/gi, ' ')
        .replace(/COLOR DOMINANCE RULE:[\s\S]*/gi, ' ')
        .replace(/STYLE SOURCE RULE:[\s\S]*/gi, ' ')
        .replace(/EVERY PIXEL MUST EMBODY THIS AESTHETIC MOOD\.?/gi, ' ')

    return normalizeDirectiveFragment(withoutRuleBlocks)
}

export function mergeCustomStyleIntoStyleDirectives(
    visualAnalysis: string | undefined,
    customStyle: string | undefined
): string {
    const base = (visualAnalysis || '').trim()
    const custom = extractCustomStyleOnly(customStyle || '')
    if (!custom) return base

    if (!base) {
        return `STYLE DIRECTIVES: ${ensureTrailingPeriod(custom)}`
    }

    const lines = base.split('\n')
    const idx = lines.findIndex((line) => line.trim().startsWith('STYLE DIRECTIVES:'))
    if (idx === -1) {
        return `${base}\n\nSTYLE DIRECTIVES: ${ensureTrailingPeriod(custom)}`
    }

    const current = lines[idx].replace(/^\s*STYLE DIRECTIVES:\s*/i, '').trim()
    if (current.toLowerCase().startsWith(custom.toLowerCase())) {
        return lines.join('\n')
    }
    const merged = `${ensureTrailingPeriod(custom)} ${current}`.replace(/\s+/g, ' ').trim()
    lines[idx] = `STYLE DIRECTIVES: ${merged}`
    return lines.join('\n')
}
