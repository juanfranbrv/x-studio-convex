// CITA - Frase / Testimonio / Cita Célebre
// Grupo: Conectar / Educar

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const CITA_EXTENDED_DESCRIPTION = `
Diseño centrado en el texto para citas inspiradoras, testimonios de clientes
o frases célebres. Maximiza la legibilidad y el impacto tipográfico.
`.trim()

export const CITA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'quote',
        label: 'Frase o Cita',
        placeholder: 'Ej: La creatividad es la inteligencia divirtiéndose.',
        type: 'textarea',
        required: true,
        aiContext: 'The main quote text'
    },
    {
        id: 'author',
        label: 'Autor (Opcional)',
        placeholder: 'Ej: Albert Einstein',
        type: 'text',
        required: false,
        aiContext: 'Author of the quote'
    }
]

export const CITA_MINIMAL_PROMPT = `
COMPOSITION: Ultra-minimalist text focus.
ZONING:
- Background: Solid color, subtle gradient, or soft grain texture.
- Text: Center-aligned, plenty of breathing room (padding).
- Graphic: Tiny accent symbol (quote mark or line) above/below.
STYLE: Sophisticated, quiet, museum-like.
TYPOGRAPHY: Elegant Serif or Modern Sans.
`.trim()

export const CITA_PORTRAIT_PROMPT = `
COMPOSITION: Testimonial style with person.
ZONING:
- Visual: Photo of a person (circle avatar or cutout) on one side or bottom.
- Text: Bubble or adjacent space for the quote.
- Name: Bold name tag near the photo.
STYLE: Trustworthy, social proof, interview.
TYPOGRAPHY: Clear and readable.
`.trim()

export const CITA_TYPO_PROMPT = `
COMPOSITION: Typography as image.
ZONING:
- Text: Fills the entire canvas. Giant letters.
- Color: High contrast (Black/White or Neon/Dark).
- Layout: Word stacking or dynamic justification.
STYLE: Poster, bold, shouty.
TYPOGRAPHY: Display font, heavy weight.
`.trim()

export const CITA_FRAME_PROMPT = `
COMPOSITION: Framed quote.
ZONING:
- Border: Ornamental or geometric frame around the edge.
- Center: Clean space for text.
- Footer: Author name small at bottom.
STYLE: Classic, award certificate, art gallery.
TYPOGRAPHY: Traditional.
`.trim()

export const CITA_TEXTURE_PROMPT = `
COMPOSITION: Textured background.
ZONING:
- Background: Crumpled paper, watercolor, concrete, or fabric texture.
- Text: Overlay with slight shadow or "ink" effect blending.
- Alignment: Center or slightly off-center organic feel.
STYLE: Organic, human, tactile.
TYPOGRAPHY: Typewriter or hand-drawn feel.
`.trim()

export const CITA_SPLIT_PROMPT = `
COMPOSITION: Half text, half mood image.
ZONING:
- Split: Vertical, Horizontal, or Diagonal split.
- Image Side: Atmospheric photo (nature, office, abstract).
- Text Side: Solid color header with the quote.
STYLE: Magazine spread, duality.
TYPOGRAPHY: Editorial.
`.trim()

export const CITA_DESCRIPTION = 'Diseño para frases, citas célebres o testimonios. Foco en tipografía.'
