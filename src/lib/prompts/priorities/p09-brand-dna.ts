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

export const TEXT_TYPOGRAPHY_LOCK = `TEXT TYPOGRAPHY LOCK (NON-NEGOTIABLE):
- Apply ONE consistent upright sans-serif family for all non-logo text blocks (headline, body, CTA and URL).
- Do not mix decorative display fonts with body copy.
- Prioritize legibility and hierarchy using size/weight/spacing, not ornamental letterforms.`

export const CONTACT_INFO_LAYOUT_RULES = `CONTACT INFO SEPARATION RULE (NON-NEGOTIABLE):
- Phone numbers, emails, URLs and social handles are CONTACT DATA, not feature bullets.
- Render contact data in a dedicated CONTACT BLOCK separated from benefit/feature lists.
- Keep contact data visually grouped together and clearly detached from enumerations.
- Never mix contact entries inside the same bullet stack used for course/service characteristics.`
