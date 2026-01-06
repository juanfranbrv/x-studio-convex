/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - BRAND COLORS (P4)
 * 
 * Brand color palette constraints.
 * 
 * @priority 4
 * @section Brand Color Palette
 */

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 4 - BRAND COLOR PALETTE                             ║
╚═════════════════════════════════════════════════════════════════╝`

// Role-based color labels
export const ROLE_LABELS = {
    Principal: '🎨 PRIMARY (backgrounds, hero sections)',
    Secundario: '✨ SECONDARY (CTAs, highlights, accents)',
    Texto: '📝 TEXT (body text, ensure readable contrast)',
    Fondo: '🖼️ BACKGROUND (large areas)',
    Acento: '💥 ACCENT (focal points, small details)',
    Neutral: '⚪ NEUTRAL (supporting elements)'
} as const

// Usage guidelines
export const COLOR_USAGE_GUIDELINES = `⚠️  COLOR USAGE GUIDELINES:
- Use PRIMARY colors for dominant areas (backgrounds, hero sections)
- Use SECONDARY colors for CTAs and key highlights
- Use TEXT colors with minimum 4.5:1 contrast ratio (WCAG AA)
- ACCENT colors for small focal points only
- Ensure readability takes priority over aesthetics`
