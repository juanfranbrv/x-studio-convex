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
- Text Focus (50%): The discount/offer value must be HUGE and dominant.
- Visuals (30%): Supporting imagery (products or lifestyle) integrated dynamically.
- Layout: Asymmetrical or split-composition works well.
STYLE: Retail promotion aesthetic. Bright colors (but strictly adhering to brand palette). High contrast.
TYPOGRAPHY: Massive fonts for the offer. Clear hierarchy.
PRIORITY: The "Deal" is the hero. The user must see the discount immediately.
`.trim()

export const OFERTA_DESCRIPTION = 'Diseño de alto impacto para promociones, rebajas y descuentos. Prioriza el texto del descuento grande.'
