/**
 * EVENTO - El Evento (Fecha y Lugar)
 * Grupo: Informar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const EVENTO_EXTENDED_DESCRIPTION = `
Diseño tipo cartel o flyer digital. Jerarquía visual clara para fecha, 
hora y lugar. Perfecto para webinars, inauguraciones, directos o 
fiestas.
`.trim()

export const EVENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'event_name',
        label: 'Nombre del Evento',
        placeholder: 'Ej: Webinar de SEO',
        type: 'text',
        required: true,
        aiContext: 'Name of the event'
    },
    {
        id: 'date_time',
        label: 'Fecha y Hora',
        placeholder: 'Ej: 24 Oct, 18:00h',
        type: 'text',
        required: true,
        aiContext: 'Date and time details'
    },
    {
        id: 'location',
        label: 'Lugar / Link',
        placeholder: 'Ej: Zoom / Madrid',
        type: 'text',
        required: false,
        aiContext: 'Location or platform'
    }
]

export const EVENTO_PROMPT = `
COMPOSITION: Event poster style. Vertical hierarchy typical of flyers.
ZONING:
- Title/Hero (40%): Big, attractive title or thematic illustration.
- Details Block (40%): Clear, separated info for Date, Time, Location. Icons often used here.
- CTA/Brand (20%): "Register Now" button area and branding.
STYLE: Engaging, informative, poster-like. High readability for numbers and dates.
PHOTOGRAPHY: Thematic background or speaker portrait if applicable, otherwise abstract event graphics.
PRIORITY: The "When" and "Where" must be instantly readable.
`.trim()

export const EVENTO_DESCRIPTION = 'Diseño tipo cartel/flyer con jerarquía para destacar fecha, hora y lugar. Ideal para webinars y eventos físicos.'
