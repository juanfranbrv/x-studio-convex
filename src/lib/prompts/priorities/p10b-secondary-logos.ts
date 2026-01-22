/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - SECONDARY LOGOS HIERARCHY (P10b)
 * 
 * Instructions for handling additional logos (collaborators, sponsors, official organisms)
 * that accompany the main brand logo. These must be visually subordinate.
 * 
 * @priority 10b - Subpriority of Logo Integrity
 * @section Secondary Logos
 */

export const P10B = {
    PRIORITY_HEADER: `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 10b - SECONDARY LOGOS HIERARCHY                       ║
╚═════════════════════════════════════════════════════════════════╝`,

    ANALYSIS_INSTRUCTION: `REFERENCE IMAGE ANALYSIS:
Analyze all provided reference images. Some may contain LOGOS from collaborators, 
sponsors, or official organisms (government agencies, certifications, partners).

DETECTION CRITERIA:
- Institutional/corporate emblems or symbols
- Text-based logos or wordmarks
- Official seals, badges, or certifications
- Partner/sponsor brand marks`,

    HIERARCHY_RULES: `LOGO HIERARCHY (STRICT ORDER):

1. PRIMARY LOGO (Brand Kit Logo):
   - LARGEST and most prominent
   - Premium position: top corner or integrated into design
   - Full color, maximum visibility
   - This is the USER'S BRAND - always the star

2. SECONDARY LOGOS (Detected from reference images):
   - SUBORDINATE positioning: grouped in a footer strip or small corner cluster
   - SMALLER scale: 30-50% of primary logo size
   - Visual treatment: "With the support of..." or "In collaboration with..." aesthetic
   - Monochrome or reduced saturation if needed to avoid competing
   - Aligned horizontally in a dedicated "partners zone"

3. PLACEMENT ZONES FOR SECONDARY LOGOS:
   - Bottom strip (preferred): horizontal row, evenly spaced
   - Lower corners: small cluster if only 1-2 logos
   - Side margin: vertical stack if design allows
   - NEVER: center stage, larger than primary, or competing for attention`,

    VISUAL_TREATMENT: `SECONDARY LOGO VISUAL TREATMENT:
- Maintain legibility but reduce prominence
- Consider subtle transparency (80-90% opacity) if needed
- Match overall composition lighting/color temperature
- Preserve logo integrity (no distortion) but allow tonal adjustments
- Group together to create a unified "collaborators block"`,

    AVOID_INSTRUCTION: `AVOID:
- Secondary logos competing with or overshadowing the primary brand logo
- Scattered placement that creates visual chaos
- Making secondary logos the focal point of the composition
- Ignoring detected logos entirely (they should be included, just subordinate)`
}
