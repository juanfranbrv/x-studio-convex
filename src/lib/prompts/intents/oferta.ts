/**
 * OFERTA - Promoción o Descuento (Flash Sales)
 * Grupo: Vender
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const OFERTA_EXTENDED_DESCRIPTION = `
Diseño de alto impacto visual enfocado en generar urgencia y destacar descuentos.
Prioriza la tipografía grande para porcentajes (%) o precios tachados.
Ideal para Rebajas, Black Friday o Promociones Flash.
`.trim()

export const OFERTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'offer_title',
        label: 'Título de la Oferta',
        placeholder: 'Ej: REBAJAS DE VERANO',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main headline of the sale event'
    },
    {
        id: 'discount_value',
        label: 'Valor del Descuento',
        placeholder: 'Ej: -50%, 2x1, Desde 19€',
        type: 'text',
        required: true,
        aiContext: 'The numerical value or main deal hook (BIG TEXT)'
    },
    {
        id: 'urgency_text',
        label: 'Texto de Urgencia',
        placeholder: 'Ej: Solo 24 horas',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Secondary text creating urgency or valid dates'
    }
]

export const OFERTA_PROMPT = `
COMPOSITION: High-impact sale creative. Bold, energetic, and attention-grabbing.
ZONING:
- Text Focus: Reserve a dominant central or top area for the discount value.
- Visuals: Supporting imagery (products or lifestyle) integrated dynamically.
- Layout: Flexible. Asymmetrical, split, or centered compositions are all valid.
STYLE: Retail promotion aesthetic. Bright colors or high contrast (adhering to brand palette).
TYPOGRAPHY: visual hierarchy preparing space for massive fonts.
PRIORITY: The "Deal" is the hero. The composition must highlight the discount area.
`.trim()

export const OFERTA_FLASH_PROMPT = `
COMPOSITION: Kinetic energy layout. Prioritize a sense of speed and movement.
ZONING:
- Dynamic Background: Speed lines, burst shapes, gradients, or bright solid color.
- Product: Integrated dynamically, could be floating, moving, or interacting with elements.
- Overlay: Lightning bolt iconography or dynamic abstract shapes as visual anchors.
STYLE: Urgent, fast-paced, high energy.
TYPOGRAPHY: Italicized or dynamic text placeholders.
`.trim()

export const OFERTA_ELEGANT_PROMPT = `
COMPOSITION: Minimalist luxury layout. Prioritize breathing room and clean lines.
ZONING:
- Negative Space: Significant area (approx 50-70%) dedicated to clean background.
- Product: Artfully placed with high-quality lighting/shadows. Focal point.
- Data: Discrete visual zone in corner for pricing details, balanced with negative space.
STYLE: Sophisticated, quiet luxury, soft lighting. Less is more.
TYPOGRAPHY: Refined, elegant spacing.
`.trim()

export const OFERTA_BUNDLE_PROMPT = `
COMPOSITION: Layout showcasing multiple items or a collection.
ZONING:
- Arrangement: Flexible grid, cluster, or collage of products (2x2, 3x3, or organic).
- Badge: Graphic badge, sticker, or circular element overlapping the center or corner.
STYLE: Abundant but organized. Can range from structured grid to dynamic collage.
TYPOGRAPHY: Functional and clear areas.
`.trim()

export const OFERTA_URGENCY_PROMPT = `
COMPOSITION: Time-sensitive layout focusing on scarcity or deadlines.
ZONING:
- Anchor: Visual element representing time/limit (header banner, footer, or floating badge).
- Center: Product with dramatic "spotlight" or high-contrast lighting.
- Graphics: Progress bars, clock icons, or hourglass imagery.
STYLE: Alarming but professional. High contrast, using alert colors (Red/Orange) if on brand.
TYPOGRAPHY: Condensed areas for urgent info.
`.trim()

export const OFERTA_SEASONAL_PROMPT = `
COMPOSITION: Themed seasonal atmosphere surrounding the product.
ZONING:
- Atmosphere: Seasonal elements (framing, background patterns, or environmental interaction).
- Center: Product integrated naturally into the seasonal scene.
- Message: Dedicated clear area for seasonal greeting blending with the theme.
STYLE: Emotive, decorative. Warm (Summer/Autumn) or Cool (Winter) depending on season.
TYPOGRAPHY: Playful or decorative font placeholders.
`.trim()

export const OFERTA_DESCRIPTION = 'Diseño de alto impacto para promociones, rebajas y descuentos. Prioriza el texto del descuento grande.'
