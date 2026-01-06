import { IntentMeta, LayoutOption } from '@/lib/creation-flow-types'
import { INTENT_PARSER_SYSTEM_PROMPT } from './parser-system-prompt'

export function buildIntentParserPrompt(
  userRequest: string,
  intent?: IntentMeta,
  layout?: LayoutOption
): string {
  let schemaDescription = ''

  // AUTO-DETECTION MODE: No intent provided
  if (!intent) {
    return `
${INTENT_PARSER_SYSTEM_PROMPT}

USER REQUEST:
"${userRequest}"

TASK:
Analyze the request above and determine the best matching intent from the 20 categories, then extract the relevant fields.

JSON OUTPUT:
`
  }

  // MANUAL MODE: Intent already selected
  schemaDescription = `TARGET INTENT: "${intent.name}" (${intent.description})\n\nREQUIRED FIELDS:\n`

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
