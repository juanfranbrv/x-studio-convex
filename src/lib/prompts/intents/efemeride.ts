/**
 * EFEMERIDE - La Efeméride (Día internacional o Cita)
 * Grupo: Informar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const EFEMERIDE_EXTENDED_DESCRIPTION = `
Diseño conmemorativo para días mundiales, citas célebres o fechas 
históricas. Centrado en la emoción y la empatía con la audiencia. 
Perfecto para "Día de la Madre" o "Frase del lunes".
`.trim()

export const EFEMERIDE_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'occasion',
        label: 'Ocasión / Día',
        placeholder: 'Ej: Día Mundial del Diseño',
        type: 'text',
        required: true,
        aiContext: 'Occasion or Holiday being celebrated'
    },
    {
        id: 'quote',
        label: 'Frase o Mensaje (Opcional)',
        placeholder: 'Ej: "El diseño es inteligencia visible"',
        type: 'text',
        required: false,
        aiContext: 'Quote or main message'
    },
    {
        id: 'date_display',
        label: 'Fecha Visible (Opcional)',
        placeholder: 'Ej: 27 Abril',
        type: 'text',
        required: false,
        aiContext: 'Date to display graphically'
    }
]

export const EFEMERIDE_PROMPT = `
COMPOSITION: Emotional, atmospheric layout. Center-weighted.
ZONING:
- Hero Visual (60%): Evocative imagery related to the date or theme.
- Text Overlay (30%): Elegant typography for the quote or "Happy X Day".
- Footer (10%): Subtle branding.
STYLE: Inspirational, warm, human.
PHOTOGRAPHY: High-quality stock feel, sentimental, or abstract celebratory graphics (confetti, calendar page).
PRIORITY: Emotion and connection.
`.trim()

export const EFEMERIDE_DESCRIPTION = 'Diseño conmemorativo para fechas especiales o citas. Centrado en la emoción y la celebración.'
