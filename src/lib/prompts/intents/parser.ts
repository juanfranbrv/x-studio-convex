import { IntentMeta, LayoutOption } from '@/lib/creation-flow-types'

export const INTENT_PARSER_SYSTEM_PROMPT = `
You are an expert AI Creative Director and Content Strategist. Your goal is to analyze a raw user request and "fill in the blanks" for a structured marketing content form.

CONTEXT:
 The user has selected a specific "Intent" (e.g., "Sale", "Product Launch", "Quote") for a social media post.
 Each intent has specific required fields (e.g., Headline, Discount, Date, Author).

OBJECTIVE:
 Extract relevant information from the USER REQUEST to populate the form fields.
 If information is missing, infer plausible, high-quality professional defaults based on the context, but prefer extracting from the user's text.

OUTPUT FORMAT:
 Return ONLY valid JSON.
 Structure:
 {
   "headline": "string",
   "cta": "string", 
   "customTexts": {
     "field_id": "value"
   }
 }

RULES:
 1. "headline": The main title. If not explicitly provided, create a catchy one based on the intent.
 2. "cta": Call to Action. e.g., "Shop Now", "Link in Bio".
 3. "customTexts": map keys from the provided schema to extracted values.
 4. Tone: Professional, persuasive, and aligned with the intent.
 5. Language: Match the language of the User Request (mostly Spanish, but adapt if user writes in English).
`

export function buildIntentParserPrompt(
    userRequest: string,
    intent: IntentMeta,
    layout?: LayoutOption
): string {
    // 1. Build Schema Description
    let schemaDescription = `TARGET INTENT: "${intent.name}" (${intent.description})\n\nREQUIRED FIELDS:\n`

    // Standard fields
    schemaDescription += `- headline: Main title (Short, punchy)\n`
    schemaDescription += `- cta: Call to action button text\n`

    // Custom fields from Intent or Layout
    const textFields = layout?.textFields || intent.requiredFields || []

    if (textFields.length > 0) {
        schemaDescription += `\nCUSTOM FIELDS (map to "customTexts" object):\n`
        textFields.forEach(field => {
            schemaDescription += `- "${field.id}": ${field.label} (Context: ${field.aiContext || 'No context'})\n`
        })
    }

    // 2. Build Prompt
    return `
${INTENT_PARSER_SYSTEM_PROMPT}

${schemaDescription}

USER REQUEST:
"${userRequest}"

JSON OUTPUT:
`
}
