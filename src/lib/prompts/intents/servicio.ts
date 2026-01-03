/**
 * SERVICIO - El Servicio (Intangible o Solución)
 * Grupo: Vender
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const SERVICIO_EXTENDED_DESCRIPTION = `
Diseño enfocado en beneficios y soluciones. Usa iconografía, fotografía 
de personas disfrutando el servicio o metáforas visuales. Ideal para 
consultoría, software, agencias o servicios locales.
`.trim()

export const SERVICIO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'service_name',
        label: 'Nombre del Servicio',
        placeholder: 'Ej: Consultoría Financiera',
        type: 'text',
        required: true,
        aiContext: 'The name of the service offered'
    },
    {
        id: 'benefit',
        label: 'Beneficio Principal',
        placeholder: 'Ej: Ahorra tiempo y dinero',
        type: 'text',
        required: true,
        aiContext: 'The main benefit or problem solved'
    },
    {
        id: 'audience',
        label: 'Público Objetivo (Opcional)',
        placeholder: 'Ej: Para Pymes',
        type: 'text',
        required: false,
        aiContext: 'Target audience reference'
    }
]

export const SERVICIO_PROMPT = `
COMPOSITION: professional, trustworthy layout. Balanced text and visual.
ZONING:
- Visual Metaphor/Action (50%): Photo of service in action, happy client, or abstract 3D icon representing the solution.
- Value Prop Area (35%): Clear space for headline and benefit text.
- Trust Elements (15%): Space for "Certified", rating stars, or clear CTA.
STYLE: Corporate, clean, approachable, trustworthy. Blue/Green tones often work well (depending on brand).
PHOTOGRAPHY: Lifestyle business shots, or high-quality 3D abstract shapes. High-key lighting.
PRIORITY: Clarity of offer and trust.
`.trim()

export const SERVICIO_DESCRIPTION = 'Diseño enfocado en beneficios y confianza para vender intangibles. Uso de personas o metáforas visuales.'
