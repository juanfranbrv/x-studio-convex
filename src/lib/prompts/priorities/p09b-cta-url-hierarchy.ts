/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - CTA & URL HIERARCHY (P09b)
 * 
 * Instructions for visual hierarchy between CTA text and URL.
 * The URL should be the PROMINENT element, with the CTA label as secondary.
 * 
 * @priority 9b - Subpriority of Brand DNA / Mandatory Text
 * @section CTA & URL Visual Hierarchy
 */

import {
    CTA_ONLY_TEMPLATE,
    CTA_SECONDARY_TEMPLATE,
    CRITICAL_HIERARCHY_TEMPLATE,
    FINAL_URL_VISIBILITY_TEMPLATE,
    URL_HERO_TEMPLATE,
} from './p09b-cta-url-hierarchy.prompt'

export const P09B = {
    /**
     * When both CTA text and URL are present, this defines their visual relationship.
     * The URL is the HERO (prominent, framed) and CTA label is secondary (smaller, above).
     */
    URL_HERO_INSTRUCTION: (url: string) =>
        URL_HERO_TEMPLATE.replaceAll('{{url}}', url),

    CTA_SECONDARY_INSTRUCTION: (ctaLabel: string) =>
        CTA_SECONDARY_TEMPLATE.replaceAll('{{ctaLabel}}', ctaLabel),

    /**
     * Critical instruction reinforcing the visual hierarchy when URL is present.
     */
    CRITICAL_HIERARCHY_INSTRUCTION: (url: string) =>
        CRITICAL_HIERARCHY_TEMPLATE.replaceAll('{{url}}', url),

    /**
     * Final layout check to keep URL hierarchy consistent.
     */
    FINAL_URL_VISIBILITY_INSTRUCTION: (url: string) =>
        FINAL_URL_VISIBILITY_TEMPLATE.replaceAll('{{url}}', url),

    /**
     * Fallback when only CTA text exists (no URL).
     */
    CTA_ONLY_INSTRUCTION: (ctaLabel: string) =>
        CTA_ONLY_TEMPLATE.replaceAll('{{ctaLabel}}', ctaLabel),
}
