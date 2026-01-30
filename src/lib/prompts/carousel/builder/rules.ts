
export const LOGO_PROTECTION_RULE = `
## LOGO PROTECTION (CRITICAL)
- **Logos are SACRED**: NEVER alter, distort, recreate, or simplify a logo.
- **Placement**: The logo is a TOP LAYER overlay.
- **No Effects**: DO NOT apply visual effects (blur, glow, shadows) to the logo.
- **Fidelity**: It must appear EXACTLY as in the provided context (same shape, proportion, colors).
`

export const LANGUAGE_ENFORCEMENT_RULE = `
## LANGUAGE ENFORCEMENT (CRITICAL)
- **Language Detection**: Detect the language used in the "Intent" section.
- **Strict Output**: Generate ALL slide content (titles, descriptions, body text) in that EXACT same language.
- **No Translation**: Do NOT translate the content into English unless the user explicitly asks for it in the Intent.
- **Consistency**: Ensure cultural nuances and tone match the detected language.
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
