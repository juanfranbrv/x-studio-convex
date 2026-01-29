import { BrandDNA } from '../../brand-types'

const LANGUAGE_NAMES: Record<string, string> = {
  'es': 'SPANISH (Espanol)',
  'en': 'ENGLISH',
  'fr': 'FRENCH (Francais)',
  'de': 'GERMAN (Deutsch)',
  'pt': 'PORTUGUESE (Portugues)',
  'it': 'ITALIAN (Italiano)',
  'ca': 'CATALAN (Catala)'
}

const SYSTEM_INSTRUCTIONS = (brandName: string) =>
  `ACTUA COMO: Social Media Manager experto para la marca "${brandName}".`

const BRAND_CONTEXT = (values: string, tone: string, audience: string) => `
CONTEXTO DE MARCA:
- Valores: ${values}
- Tono de voz: ${tone}
- Publico objetivo: ${audience}
`

const LANGUAGE_REQUERIMENT = (languageName: string) => `
IDIOMA OBLIGATORIO: ${languageName}
TODO el texto del post (copy y hashtags) DEBE estar en ${languageName}.
El idioma debe seguir el idioma del usuario, sin imponer preferencias del kit de marca.
`

const TASK_INSTRUCTIONS = `
TU TAREA:
Analiza la imagen proporcionada (si la hay) y escribe un post para redes sociales (Instagram/LinkedIn/Twitter) que sea perfecto para esta marca.
`

const OUTPUT_REQUIREMENTS = `
REQUISITOS DEL OUTPUT (Formato JSON estricto):
Debes devolver UNICAMENTE un objeto JSON con esta estructura:
{
  "copy": "El texto del post aqui, usando emojis si encaja con el tono.",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}
REGLAS DE HASHTAGS:
- Devuelve SIEMPRE una lista no vacia.
- Minimo 5 y maximo 12 hashtags.
- Relevantes al tema, a la marca y a la imagen.
- Sin espacios internos (usa guion o CamelCase si hace falta).
- Incluye el nombre de la marca como hashtag si existe.
`

const COPYWRITING_RULES = (languageName: string) => `
REGLAS DE COPYWRITING:
1. Conecta visualmente: Menciona o alude a lo que se ve en la imagen.
2. Manten el tono: Si es "Divertido", se chistoso. Si es "Serio", se formal.
3. Longitud: Entre 150 y 300 caracteres (conciso pero impactante).
4. Llamada a la accion (CTA): Incluye una pregunta o invitacion sutil al final.
5. IDIOMA: Todo el contenido debe estar en ${languageName}.
`

export const buildSocialManagerPrompt = (brand: BrandDNA, topic?: string, languageOverride?: string) => {
  const preferredLanguage = languageOverride || brand.preferred_language || 'es'
  const languageName = LANGUAGE_NAMES[preferredLanguage] || preferredLanguage.toUpperCase()

  const sections = [
    SYSTEM_INSTRUCTIONS(brand.brand_name || 'Brand'),
    BRAND_CONTEXT(
      brand.brand_values?.join(', ') || 'No definidos',
      brand.tone_of_voice?.join(', ') || 'Profesional',
      Array.isArray(brand.target_audience) ? brand.target_audience.join(', ') : (brand.target_audience || 'General')
    ),
    topic ? `TEMA/INTENCION DEL POST: "${topic}"` : '',
    LANGUAGE_REQUERIMENT(languageName),
    TASK_INSTRUCTIONS,
    OUTPUT_REQUIREMENTS,
    COPYWRITING_RULES(languageName)
  ]

  return sections.filter(Boolean).join('\n')
}
