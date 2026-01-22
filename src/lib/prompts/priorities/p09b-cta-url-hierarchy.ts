/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - CTA & URL HIERARCHY (P09b)
 * 
 * Instructions for visual hierarchy between CTA text and URL.
 * The URL should be the PROMINENT element, with the CTA label as secondary.
 * 
 * @priority 9b - Subpriority of Brand DNA / Mandatory Text
 * @section CTA & URL Visual Hierarchy
 */

export const P09B = {
    /**
     * When both CTA text and URL are present, this defines their visual relationship.
     * The URL is the HERO (prominent, framed) and CTA label is secondary (smaller, above).
     */
    URL_HERO_INSTRUCTION: (url: string) =>
        `• URL VISUAL ELEMENT (HERO): "${url}" - This is the PROMINENT element, rendered in a FRAMED BOX or HIGHLIGHTED CONTAINER. Make it stand out.`,

    CTA_SECONDARY_INSTRUCTION: (ctaLabel: string) =>
        `• CTA LABEL (Secondary): "${ctaLabel}" - Smaller text ABOVE the URL box, acting as a subtle call-to-action indicator.`,

    /**
     * Critical instruction reinforcing the visual hierarchy when URL is present.
     */
    CRITICAL_HIERARCHY_INSTRUCTION: (url: string) =>
        `⚠️ CRITICAL VISUAL HIERARCHY: The URL "${url}" must be the PROMINENT visual element - render it in a framed box, button-style container, or highlighted area. The CTA label text goes ABOVE it in smaller/lighter typography as a secondary indicator.`,

    /**
     * Fallback when only CTA text exists (no URL).
     */
    CTA_ONLY_INSTRUCTION: (ctaLabel: string) =>
        `• CTA BUTTON TEXT: "${ctaLabel}"`,
}
