
export const LOGO_PROTECTION_RULE = `
## LOGO PROTECTION (CRITICAL)
- **Logos are SACRED**: NEVER alter, distort, recreate, or simplify a logo.
- **Placement**: The logo is a TOP LAYER overlay.
- **No Effects**: DO NOT apply visual effects (blur, glow, shadows) to the logo.
- **Fidelity**: It must appear EXACTLY as in the provided context (same shape, proportion, colors).
`

export const LANGUAGE_ENFORCEMENT_RULE = `
## ⚠️ LANGUAGE ENFORCEMENT (CRITICAL - MAXIMUM PRIORITY)
**DETECT the language used in the "Intent" section below.**
- If the user writes in SPANISH → ALL content (titles, descriptions, body text, hook, caption) MUST be in SPANISH.
- If the user writes in ENGLISH → ALL content MUST be in ENGLISH.
- If the user writes in GERMAN → ALL content MUST be in GERMAN.
- **NEVER translate to another language. NEVER use a different language than the user's prompt.**
- This rule has ABSOLUTE PRIORITY over any other consideration.
- If you generate content in a language different from the user's prompt, you have FAILED.
`


export const BRAND_DNA_RULE = `
╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 9 - BRAND DNA & IDENTITY                             ║
╚═════════════════════════════════════════════════════════════════╝
⚠️  REQUIREMENT: Final content and visuals MUST feel authentically aligned with this brand universe.
`

export const BRAND_COLORS_RULE = `
╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 4 - BRAND COLOR PALETTE                             ║
╚═════════════════════════════════════════════════════════════════╝
⚠️  COLOR USAGE GUIDELINES:
- Use PRIMARY colors for dominant areas (backgrounds, hero sections)
- Use SECONDARY colors for CTAs and key highlights
- Use TEXT colors with minimum 4.5:1 contrast ratio (WCAG AA)
- ACCENT colors for small focal points only
- Ensure readability takes priority over aesthetics
`
