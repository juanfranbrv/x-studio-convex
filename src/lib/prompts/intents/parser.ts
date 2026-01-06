import { IntentMeta, LayoutOption } from '@/lib/creation-flow-types'

export const INTENT_PARSER_SYSTEM_PROMPT = `
You are an expert AI Creative Director and Content Strategist. Your goal is to analyze a raw user request and extract structured information for marketing content creation.

PHASE 1: INTENT DETECTION
First, analyze the user's message and determine which of the 20 available intents best matches their goal:

VENDER (Sales):
- oferta: Discount/price focused promotions
- escaparate: Product showcase/hero
- catalogo: Product collection/grid
- lanzamiento: Coming soon/new arrival
- servicio: Intangible services

INFORMAR (Information):
- comunicado: Notice/announcement
- evento: Save the date/event
- lista: Checklist/steps
- comparativa: Before/after, versus
- efemeride: Seasonal/special dates

CONECTAR (Connection):
- equipo: Meet the team
- cita: Quote/testimonial
- talento: Hiring/recruiting
- logro: Milestone/celebration
- bts: Behind the scenes

EDUCAR (Education):
- dato: Stat/infographic
- pasos: How-to/tutorial
- definicion: Term definition

ENGAGEMENT (Interaction):
- pregunta: Q&A/poll
- reto: Quiz/challenge

PHASE 2: FIELD EXTRACTION
Once intent is detected, extract relevant information to populate the form fields for that specific intent.

OUTPUT FORMAT:
Return ONLY valid JSON with this structure:
{
  "detectedIntent": "intent_id",  // One of the 20 intent IDs above
  "confidence": 0.95,              // 0-1 confidence score
  "headline": "string",
  "cta": "string", 
  "customTexts": {
    "field_id": "value"
  }
}

RULES:
1. "detectedIntent": MUST be one of the 20 intent IDs listed above
2. "confidence": How confident you are in the intent detection (0-1)
3. "headline": The main title extracted or inferred
4. "cta": Call to Action (e.g., "Shop Now", "Link in Bio")
5. "customTexts": Map intent-specific fields to extracted values
6. Tone: Professional, persuasive, aligned with detected intent
7. Language: Match the user's language (mostly Spanish)
`

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
