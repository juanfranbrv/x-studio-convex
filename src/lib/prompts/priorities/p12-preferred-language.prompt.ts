/**
 * P12 - Preferred Language prompt templates.
 * Keep this file free of logic so prompts can be reviewed/edited easily.
 */

export const LANGUAGE_ENFORCEMENT_TEMPLATE = `CRITICAL LANGUAGE REQUIREMENT
LANGUAGE: {{languageName}}.
All visible text must be in {{languageName}}.
Translate any provided text to {{languageName}} and preserve meaning and tone.
Do not override the user's language with brand preferences.
Keep brand/product names and proper nouns unchanged. Use idiomatic {{languageName}}.`

export const COPY_LANGUAGE_NOTE_TEMPLATE = `Generate all copy and hashtags in {{languageName}}.`
