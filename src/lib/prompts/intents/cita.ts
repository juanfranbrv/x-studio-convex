/**
 * CITA - La Cita (Agenda y Reserva)
 * Grupo: Conectar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const CITA_EXTENDED_DESCRIPTION = `
Diseño orientado a la conversión para agendar reuniones, llamadas de 
descubrimiento o visitas. Claro y directo, con un Call to Action 
(CTA) muy visible para "Reservar" o "Agendar".
`.trim()

export const CITA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'action',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: Agenda tu Demo',
        type: 'text',
        required: true,
        aiContext: 'Main Call to Action (Book now, Schedule Call)'
    },
    {
        id: 'value_prop',
        label: 'Propuesta de Valor',
        placeholder: 'Ej: 30 min de consultoría gratis',
        type: 'text',
        required: true,
        aiContext: 'Value proposition or incentive'
    },
    {
        id: 'availability',
        label: 'Disponibilidad (Opcional)',
        placeholder: 'Ej: Plazas Limitadas',
        type: 'text',
        required: false,
        aiContext: 'Scarcity or timing info'
    }
]

export const CITA_PROMPT = `
COMPOSITION: Conversion-focused layout. High contrast CTA.
ZONING:
- Hero Visual (50%): Abstract reliable imagery (calendar, phone, handshake) or professional portrait welcoming action.
- Text Area (30%): Clear Heading + Subtext explaining the value.
- CTA Button (20%): Graphical representation of a button or clear instruction "Link in Bio".
STYLE: Functional, clear, inviting.
PHOTOGRAPHY: Clean workspace, hands typing, or friendly professional pointing to CTA.
PRIORITY: The Call to Action. Make it obvious what to do next.
`.trim()

export const CITA_DESCRIPTION = 'Diseño orientado a la conversión para agendar reuniones o visitas. CTA destacado.'
