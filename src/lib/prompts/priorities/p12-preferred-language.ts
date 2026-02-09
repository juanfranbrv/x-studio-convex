/**
 * PRIORITY-BASED PROMPT CONSTRUCTION - PREFERRED LANGUAGE (P12)
 *
 * Enforces the use of the user's input language for all generated content.
 * This ensures the output follows the language the user actually requested.
 *
 * @priority 12 - Language Enforcement (Highest Priority after System Persona)
 * @section Preferred Language
 */

import { COPY_LANGUAGE_NOTE_TEMPLATE, LANGUAGE_ENFORCEMENT_TEMPLATE } from './p12-preferred-language.prompt'

export const PRIORITY_HEADER = `╔═════════════════════════════════════════════════════════════════╗
║  PRIORITY 12 - PREFERRED LANGUAGE ENFORCEMENT                   ║
╚═════════════════════════════════════════════════════════════════╝`

export const LANGUAGE_ENFORCEMENT_INSTRUCTION = (language: string) => {
    const languageNames: Record<string, string> = {
        'es': 'SPANISH (Espanol)',
        'en': 'ENGLISH',
        'fr': 'FRENCH (Francais)',
        'de': 'GERMAN (Deutsch)',
        'pt': 'PORTUGUESE (Portugues)',
        'it': 'ITALIAN (Italiano)',
        'ca': 'CATALAN (Catala)'
    }

    const languageName = languageNames[language] || language.toUpperCase()

    return LANGUAGE_ENFORCEMENT_TEMPLATE.replaceAll('{{languageName}}', languageName)
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

    const languageName = languageNames[language] || language
    return COPY_LANGUAGE_NOTE_TEMPLATE.replaceAll('{{languageName}}', languageName)
}
