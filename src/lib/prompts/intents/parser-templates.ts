/**
 * INTENT PARSER TEMPLATES
 */

export const INTENT_PARSER_AUTO_TASK = `
USER REQUEST:
"{{userRequest}}"

TASK:
Analyze the request above and determine the best matching intent from the 20 categories, then extract the relevant fields.

JSON OUTPUT:
`.trim();

export const INTENT_PARSER_MANUAL_HEADER = `
TARGET INTENT: "{{intentName}}" ({{intentDescription}})

REQUIRED FIELDS:
- headline: Main title (Short, punchy)
- cta: Call to action button text
`.trim();

export const INTENT_PARSER_CUSTOM_FIELDS_HEADER = `
CUSTOM FIELDS (map to "customTexts" object):
`.trim();

export const BRAND_WEBSITE_CONTEXT = (website: string) => `
### BRAND WEBSITE (FOR CTA URLS):
${website}
`;

export const INTENT_PARSER_FOOTER = `
USER REQUEST:
"{{userRequest}}"

JSON OUTPUT:
`.trim();
