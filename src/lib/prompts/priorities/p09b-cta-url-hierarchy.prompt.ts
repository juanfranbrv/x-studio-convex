/**
 * P09b - CTA & URL hierarchy prompt templates.
 * Keep this file free of logic so prompts can be reviewed/edited easily.
 */

export const URL_HERO_TEMPLATE = `URL VISUAL ELEMENT (HERO): "{{url}}" - Render the URL EXACTLY as provided (no prefix/suffix, no labels). Apply your creative freedom to make it stand out beautifully and cohesively.`

export const CTA_SECONDARY_TEMPLATE = `CTA TEXT (Secondary): "{{ctaLabel}}" - Render the CTA text EXACTLY as provided (no prefix/suffix, no labels). Smaller text ABOVE the URL emphasis. NEVER render labels.`

export const CRITICAL_HIERARCHY_TEMPLATE = `CRITICAL VISUAL HIERARCHY: The URL "{{url}}" must be the PROMINENT visual element. Emphasize it through a HIGHLY CREATIVE, bespoke visual treatment that natively integrates with the specific art direction, lighting, and textures of the current generation.
DIVERSITY & INTEGRATION RULE: To ensure diverse and unique results every time, do not rely on a single static CTA style. Innovate! Depending on the image's aesthetic, seamlessly integrate the URL using methods like: a bold solid shape (like a dynamic pill or geometric badge), ultra-thick typographic weight, a striking ACENTO color shift, an organic graphic element, or a clever use of negative space. The CTA must feel like a natural, high-end design element born from the scene itself, not a cheap stamped-on graphic. ABSOLUTELY NO thin outlined boxes or generic borders.
The CTA text goes ABOVE it in smaller/lighter typography as a secondary indicator. NEVER render labels like "CTA", "URL", "LABEL" or similar as visible text.`

export const FINAL_URL_VISIBILITY_TEMPLATE = `FINAL LAYOUT CHECK: The URL "{{url}}" is clearly visible, PROMINENT, and creatively embedded into the artwork's native style, positioned BELOW the smaller CTA text. NEVER render labels.`

export const CTA_ONLY_TEMPLATE = `CTA TEXT: "{{ctaLabel}}" - Render the CTA text EXACTLY as provided (no prefix/suffix, no labels). NEVER render labels like "CTA" or "URL" as visible text.`
