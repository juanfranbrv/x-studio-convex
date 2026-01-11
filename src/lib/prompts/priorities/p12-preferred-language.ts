/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - PREFERRED LANGUAGE (P12)
 * 
 * Enforces the use of the brand's preferred language for all generated content.
 * This ensures consistency across all brand communications regardless of user input language.
 * 
 * @priority 12 - Language Enforcement (Highest Priority after System Persona)
 * @section Preferred Language
 */

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 12 - PREFERRED LANGUAGE ENFORCEMENT                   ║
╚═════════════════════════════════════════════════════════════════╝`

export const LANGUAGE_ENFORCEMENT_INSTRUCTION = (language: string) => {
    const languageNames: Record<string, string> = {
        'es': 'SPANISH (Español)',
        'en': 'ENGLISH',
        'fr': 'FRENCH (Français)',
        'de': 'GERMAN (Deutsch)',
        'pt': 'PORTUGUESE (Português)',
        'it': 'ITALIAN (Italiano)',
        'ca': 'CATALAN (Català)'
    }

    const languageName = languageNames[language] || language.toUpperCase()

    return `⚠️ CRITICAL LANGUAGE REQUIREMENT ⚠️

ALL TEXT CONTENT IN THIS IMAGE MUST BE GENERATED IN: ${languageName}

This includes:
• Headlines and titles
• Call-to-action (CTA) buttons
• Body text and descriptions
• Labels and captions
• Any other visible text elements

IMPORTANT NOTES:
1. Even if the user's input or instructions are in a different language, ALL generated text must be in ${languageName}.
2. This is a BRAND REQUIREMENT and takes precedence over the input language.
3. Translate any provided text to ${languageName} if necessary while preserving the intent and tone.
4. Maintain cultural appropriateness and idiomatic expressions for ${languageName}.

EXCEPTION: Brand names, product names, and proper nouns should remain in their original form.`
}

export const COPY_LANGUAGE_NOTE = (language: string) => {
    const languageNames: Record<string, string> = {
        'es': 'Spanish',
        'en': 'English',
        'fr': 'French',
        'de': 'German',
        'pt': 'Portuguese',
        'it': 'Italian',
        'ca': 'Catalan'
    }

    return `Generate all copy and hashtags in ${languageNames[language] || language}.`
}
