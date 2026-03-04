/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - BRAND DNA (P9)
 * 
 * Core brand identity elements including tone, aesthetic, and mandatory text content.
 * These define the essential character and messaging of the brand.
 * 
 * @priority 9
 * @section Brand DNA & Identity
 */

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 9 - BRAND DNA & IDENTITY                             ║
╚═════════════════════════════════════════════════════════════════╝`

export const BRAND_DNA_REQUIREMENT = `⚠️  REQUIREMENT: Final image MUST feel authentically aligned with this brand universe.`

export const MANDATORY_TEXT_HEADER = `MANDATORY TEXT CONTENT (NOTHING ELSE). Render EXACTLY as provided. DO NOT add labels or prefixes like "CTA:" or "URL:".`

export const NO_TEXT_WARNING = `⚠️  NO TEXT PROVIDED: Image must be completely text-free.`

export const TEXT_FIT_SAFETY_RULES = `TEXT FIT SAFETY (NON-NEGOTIABLE):
- NEVER crop, truncate, mask, or hide any character of mandatory text.
- Use strict GEOMETRIC SANS-SERIF typography. Font style must be BLOCKY, INDUSTRIAL, and STRUCTURAL. Resembles fonts like Roboto, Helvetica Bold, or Futura.
- Allow multi-line wrapping for headlines instead of clipping.
- Keep a safety margin around text blocks (at least 8% from canvas edges).
- Keep full ascenders/descenders visible (no top/bottom cut-off).
- If needed, expand the text container area before reducing legibility.
- Final check before render: every mandatory text string must be 100% visible and readable.`

export const TYPOGRAPHY_PRECEDENCE_RULE = `Typography compliance is mandatory and has precedence over aesthetic freedom.`
export const TYPOGRAPHY_LOCK_REFERENCE = `Typography lock already defined above. Do not override.`

type BrandFontInput = { family: string; role?: 'heading' | 'body' } | string

function normalizeFonts(fonts?: BrandFontInput[]): { family: string; role?: 'heading' | 'body' }[] {
    if (!fonts || fonts.length === 0) return []

    return fonts
        .map((font) => {
            if (typeof font === 'string') {
                const family = font.trim()
                return family ? { family } : null
            }
            const family = (font?.family || '').trim()
            if (!family) return null
            return { family, role: font.role }
        })
        .filter((font): font is { family: string; role?: 'heading' | 'body' } => Boolean(font))
}

export function buildTypographyContract(fonts?: BrandFontInput[]): string {
    const normalized = normalizeFonts(fonts)
    const headingFont = normalized.find((font) => font.role === 'heading')?.family
    const bodyFont = normalized.find((font) => font.role === 'body')?.family
    const fallbackFont = normalized[0]?.family

    const headlineValue = headingFont || fallbackFont
    const bodyValue = bodyFont || fallbackFont

    const lines = ['TYPOGRAPHY CONTRACT (NON-NEGOTIABLE):']

    if (headlineValue) lines.push(`- HEADLINE_FONT = "${headlineValue}"`)
    if (bodyValue) lines.push(`- BODY_FONT = "${bodyValue}"`)
    if (!headlineValue && !bodyValue) {
        lines.push('- HEADLINE_FONT = "brand-heading-font"')
        lines.push('- BODY_FONT = "brand-body-font"')
    }

    lines.push('- APPLY RULE: headline MUST use HEADLINE_FONT; body/support text MUST use BODY_FONT.')
    lines.push('- FORBIDDEN: swapping fonts, mixing roles, or collapsing all text into one font style.')
    lines.push('- INTERNAL TOKENS: font names are instructions only; never render them as visible text.')
    lines.push('- FALLBACK: if a font is unavailable, use the closest stylistic equivalent without changing role mapping.')

    return lines.join('\n')
}

export const TEXT_TYPOGRAPHY_LOCK = buildTypographyContract()

export const CONTACT_INFO_LAYOUT_RULES = `CONTACT INFO SEPARATION RULE (NON-NEGOTIABLE):
- Phone numbers, emails, physical addresses, URLs and social handles are CONTACT DATA, not feature bullets.
- Render contact data in a dedicated CONTACT BLOCK separated from benefit/feature lists.
- Keep contact data visually grouped together and clearly detached from enumerations.
- Never mix contact entries inside the same bullet stack used for course/service characteristics.`
