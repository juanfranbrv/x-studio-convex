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
    Fondo: '🎨 FONDO (backgrounds, large areas, base blocks)',
    Acento: '✨ ACENTO (CTAs, highlights, focal points)',
    Texto: '📝 TEXTO (body text, ensuring readable contrast)',
    Neutral: '⚪ NEUTRAL (supporting elements)'
} as const

// Usage guidelines
export const COLOR_USAGE_GUIDELINES = `⚠️  COLOR USAGE GUIDELINES:
- Use FONDO colors for dominant areas (backgrounds, hero sections)
- Use ACENTO colors for CTAs and key highlights
- Use TEXTO colors with minimum 4.5:1 contrast ratio (WCAG AA)
- ACENTO colors for small focal points only
- Ensure readability takes priority over aesthetics`
