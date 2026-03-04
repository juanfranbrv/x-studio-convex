import { buildTypographyContract } from '@/lib/prompts/priorities/p09-brand-dna'

/**
 * TYPOGRAPHY INSTRUCTIONS BUILDER
 *
 * Reuses the strict typography contract shared across modules.
 */
type FontInput = string | { family?: string; role?: 'heading' | 'body' | string } | null | undefined

export function buildTypographyInstructions(fonts: FontInput[]): string {
    if (!fonts || fonts.length === 0) {
        return ''
    }

    const normalized = fonts
        .map((font) => {
            if (typeof font === 'string') {
                const family = font.trim()
                return family ? { family } : null
            }

            if (!font || typeof font !== 'object') return null

            const family = (font.family || '').trim()
            if (!family) return null

            const role = font.role === 'heading' || font.role === 'body' ? font.role : undefined
            return { family, role }
        })
        .filter((font): font is { family: string; role?: 'heading' | 'body' } => Boolean(font))

    return `\n${buildTypographyContract(normalized)}\n`
}
