/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - LOGO INTEGRITY (P10)
 * 
 * Critical rules for logo rendering that take ABSOLUTE PRECEDENCE over all other instructions.
 * These rules are injected FIRST in the prompt hierarchy to ensure maximum model attention.
 * 
 * @priority 10 - Highest possible priority
 * @section Logo Integrity
 */

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 10 - ABSOLUTE OVERRIDE (LOGO INTEGRITY)              ║
╚═════════════════════════════════════════════════════════════════╝`

export const LOGO_INTEGRITY_INTRO = `CRITICAL: The following rules take ABSOLUTE PRECEDENCE over ALL other instructions.`

export const LOGO_INTEGRITY_RULES = `LOGO INTEGRITY REQUIREMENTS:
1. SACRED ELEMENT: Logo must be rendered as an immutable, crystal-clear overlay
2. ZERO STYLIZATION: NO grain, blur, texture, lighting effects, or artistic filters
3. GEOMETRIC FIDELITY: Maintain 1:1 original proportions. NO 3D, skewing, or warping
4. But you can change colors or invert them to match the background`
