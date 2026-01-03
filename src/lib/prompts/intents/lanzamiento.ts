/**
 * LANZAMIENTO - El Lanzamiento (Novedad impactante)
 * Grupo: Vender
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const LANZAMIENTO_EXTENDED_DESCRIPTION = `
Diseño dinámico y energético para anunciar algo nuevo. Usa diagonales, 
efectos de movimiento o "bursts" visuales para generar excitación. 
Perfecto para "New Arrival", "Ya disponible" o "Coming Soon".
`.trim()

export const LANZAMIENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'new_item',
        label: '¿Qué se lanza?',
        placeholder: 'Ej: Nueva App Móvil',
        type: 'text',
        required: true,
        aiContext: 'The new product or service being launched'
    },
    {
        id: 'action_verb',
        label: 'Acción / Verbo',
        placeholder: 'Ej: Descúbrela, Ya disponible, Coming Soon',
        type: 'text',
        required: true,
        aiContext: 'The call to action or status (Available Now, Coming Soon)'
    },
    {
        id: 'date',
        label: 'Fecha (Opcional)',
        placeholder: 'Ej: 12 de Octubre',
        type: 'text',
        required: false,
        aiContext: 'Launch date if applicable'
    }
]

export const LANZAMIENTO_PROMPT = `
COMPOSITION: Dynamic, high-energy layout. Diagonals or explosive composition.
ZONING:
- Central Burst (60%): The new item breaking through or center stage with motion lines.
- Text Overlay (30%): Large, bold typography "NEW", "ARRIVED", "LAUNCH".
- Brand (10%): Solid branding to endorse the launch.
STYLE: High contrast, bold colors, exciting. "Tech reveal" or "Unboxing" vibe.
PHOTOGRAPHY: Dramatic lighting, rim light, or motion blur effects.
PRIORITY: Excitement and novelty. Make it pop.
`.trim()

export const LANZAMIENTO_DESCRIPTION = 'Diseño de alto impacto, dinámico y energético para anunciar novedades ("New Arrival", "Coming Soon").'
