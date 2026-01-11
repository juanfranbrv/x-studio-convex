import { BrandDNA } from '../../brand-types'

const LANGUAGE_NAMES: Record<string, string> = {
  'es': 'SPANISH (Español)',
  'en': 'ENGLISH',
  'fr': 'FRENCH (Français)',
  'de': 'GERMAN (Deutsch)',
  'pt': 'PORTUGUESE (Português)',
  'it': 'ITALIAN (Italiano)',
  'ca': 'CATALAN (Català)'
}

const SYSTEM_INSTRUCTIONS = (brandName: string) =>
  `ACTÚA COMO: Social Media Manager experto para la marca "${brandName}".`

const BRAND_CONTEXT = (values: string, tone: string, audience: string) => `
CONTEXTO DE MARCA:
- Valores: ${values}
- Tono de voz: ${tone}
- Público objetivo: ${audience}
`

const LANGUAGE_REQUERIMENT = (languageName: string) => `
⚠️ IDIOMA OBLIGATORIO: ${languageName}
TODO el texto del post (copy y hashtags) DEBE estar en ${languageName}.
Esto es un requisito de marca que prevalece sobre cualquier otro idioma usado en las instrucciones.
`

const TASK_INSTRUCTIONS = `
TU TAREA:
Analiza la imagen proporcionada (si la hay) y escribe un post para redes sociales (Instagram/LinkedIn/Twitter) que sea perfecto para esta marca.
`

const OUTPUT_REQUIREMENTS = `
REQUISITOS DEL OUTPUT (Formato JSON estricto):
Debes devolver UNICAMENTE un objeto JSON con esta estructura:
{
  "copy": "El texto del post aquí, usando emojis si encaja con el tono.",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}
`

const COPYWRITING_RULES = (languageName: string) => `
REGLAS DE COPYWRITING:
1. Conecta visualmente: Menciona o alude a lo que se ve en la imagen.
2. Mantén el tono: Si es "Divertido", sé chistoso. Si es "Serio", sé formal.
3. Longitud: Entre 150 y 300 caracteres (conciso pero impactante).
4. Llamada a la acción (CTA): Incluye una pregunta o invitación sutil al final.
5. IDIOMA: Todo el contenido debe estar en ${languageName}.
`

export const buildSocialManagerPrompt = (brand: BrandDNA, topic?: string) => {
  const preferredLanguage = brand.preferred_language || 'es'
  const languageName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage.toUpperCase()

  const sections = [
    SYSTEM_INSTRUCTIONS(brand.brand_name || 'Brand'),
    BRAND_CONTEXT(
      brand.brand_values?.join(', ') || 'No definidos',
      brand.tone_of_voice?.join(', ') || 'Profesional',
      brand.target_audience || 'General'
    ),
    topic ? `TEMA/INTENCIÓN DEL POST: "${topic}"` : '',
    LANGUAGE_REQUERIMENT(languageName),
    TASK_INSTRUCTIONS,
    OUTPUT_REQUIREMENTS,
    COPYWRITING_RULES(languageName)
  ]

  return sections.filter(Boolean).join('\n')
}
