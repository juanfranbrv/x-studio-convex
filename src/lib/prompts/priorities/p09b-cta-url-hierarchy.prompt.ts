/**
 * P09b - CTA & URL hierarchy prompt templates.
 * Keep this file free of logic so prompts can be reviewed/edited easily.
 */

export const URL_HERO_TEMPLATE = `URL VISUAL ELEMENT (HERO): "{{url}}" - Render the URL EXACTLY as provided (no prefix/suffix, no labels). Emphasize it clearly (e.g., framed box, highlighted pill, banner, underline, bold typography, or contrast treatment). NEVER render labels like "CTA" or "URL" as visible text.`

export const CTA_SECONDARY_TEMPLATE = `CTA TEXT (Secondary): "{{ctaLabel}}" - Render the CTA text EXACTLY as provided (no prefix/suffix, no labels). Smaller text ABOVE the URL emphasis, acting as a subtle call-to-action indicator. NEVER render labels like "CTA" or "URL" as visible text.`

export const CRITICAL_HIERARCHY_TEMPLATE = `CRITICAL VISUAL HIERARCHY: The URL "{{url}}" must be the PROMINENT visual element. Emphasize it using ONE of these treatments: framed box, highlighted container, banner, underline, badge/pill, bold typography, or strong contrast. The CTA text goes ABOVE it in smaller/lighter typography as a secondary indicator. NEVER render labels like "CTA", "URL", "LABEL" or similar as visible text.`

export const FINAL_URL_VISIBILITY_TEMPLATE = `FINAL LAYOUT CHECK: The URL "{{url}}" must be clearly visible and PROMINENT, emphasized with one of the allowed treatments (framed box, highlighted container, banner, underline, badge/pill, bold typography, or strong contrast), positioned BELOW the CTA text (CTA text is smaller and above). NEVER render labels like "CTA" or "URL" as visible text.`

export const CTA_ONLY_TEMPLATE = `CTA TEXT: "{{ctaLabel}}" - Render the CTA text EXACTLY as provided (no prefix/suffix, no labels). NEVER render labels like "CTA" or "URL" as visible text.`
