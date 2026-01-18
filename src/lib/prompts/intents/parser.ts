import { IntentMeta, LayoutOption } from '@/lib/creation-flow-types'
import { BrandDNA } from '@/lib/brand-types'
import { INTENT_PARSER_SYSTEM_PROMPT } from './parser-system-prompt'
import {
  INTENT_PARSER_AUTO_TASK,
  INTENT_PARSER_MANUAL_HEADER,
  INTENT_PARSER_CUSTOM_FIELDS_HEADER,
  INTENT_PARSER_FOOTER,
  BRAND_WEBSITE_CONTEXT
} from './parser-templates'
import { buildBrandContextBlock } from './brand-context-template'

export function buildIntentParserPrompt(
  userRequest: string,
  brandWebsite?: string,
  brandDNA?: BrandDNA | null,
  intent?: IntentMeta,
  layout?: LayoutOption,
  includeSystemPrompt: boolean = true
): string {
  const websiteContext = brandWebsite ? BRAND_WEBSITE_CONTEXT(brandWebsite) : ''
  const brandContext = buildBrandContextBlock(brandDNA)

  // AUTO-DETECTION MODE: No intent provided
  if (!intent) {
    const body = `
${brandContext}

${websiteContext}

${INTENT_PARSER_AUTO_TASK.replace('{{userRequest}}', userRequest)}
`
    return includeSystemPrompt ? `${INTENT_PARSER_SYSTEM_PROMPT}\n\n${body}` : body
  }

  // ... (MANUAL MODE schema description build)
  let schemaDescription = INTENT_PARSER_MANUAL_HEADER
    .replace('{{intentName}}', intent.name)
    .replace('{{intentDescription}}', intent.description)

  schemaDescription += '\n'

  // Custom fields from Intent or Layout
  const textFields = layout?.textFields || intent.requiredFields || []

  if (textFields.length > 0) {
    schemaDescription += `${INTENT_PARSER_CUSTOM_FIELDS_HEADER}\n`
    textFields.forEach(field => {
      schemaDescription += `- "${field.id}": ${field.label} (Context: ${field.aiContext || 'No context'})\n`
    })
  }

  // 2. Build Prompt
  const body = `
${brandContext}

${websiteContext}

${schemaDescription}

${INTENT_PARSER_FOOTER.replace('{{userRequest}}', userRequest)}
`
  return includeSystemPrompt ? `${INTENT_PARSER_SYSTEM_PROMPT}\n\n${body}` : body
}


