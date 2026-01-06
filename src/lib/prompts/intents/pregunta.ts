/**
 * PREGUNTA - La Pregunta (Q&A, genera comentarios)
 * Grupo: Engagement
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const PREGUNTA_EXTENDED_DESCRIPTION = `
Diseñado para provocar interacción y comentarios. La pregunta domina 
el diseño, invitando a la audiencia a participar. Perfecto para 
encuestas informales, opiniones o conversación.
`.trim()

export const PREGUNTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'question_text',
        label: 'La Pregunta',
        placeholder: 'Ej: ¿Qué prefieres: café o té?',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main question to ask the audience'
    },
    {
        id: 'options',
        label: 'Opciones de Respuesta',
        placeholder: 'Ej: A) Café  B) Té  C) Ambos',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Answer options if its a poll-style question'
    },
    {
        id: 'call_to_action',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: ¡Cuéntanos en comentarios!',
        type: 'text',
        required: false,
        optional: true,
        mapsTo: 'cta',
        aiContext: 'Instruction for how to respond'
    }
]

export const PREGUNTA_PROMPT = `
COMPOSITION: Engagement-focused question layout that demands response.
ZONING:
- Question Zone (60%): The question displayed LARGE and centered, impossible to ignore
- Visual Hook: Relevant imagery or graphic that relates to the question topic
- Options Zone (20%): If poll-style, show options clearly
- CTA Zone (10%): "Comenta", "Vota", or similar engagement prompt
- Brand Zone (10%): Subtle logo presence
STYLE: Bold, conversational, approachable. NOT corporate.
TYPOGRAPHY: Large question mark energy. Friendly, casual fonts work well.
COLORS: Vibrant, attention-grabbing. Consider speech bubble or interactive elements.
MOOD: Curious, inviting, community-oriented. Make people WANT to answer.
`.trim()

export const PREGUNTA_DESCRIPTION = 'Pregunta grande y centrada que invita a responder. Estilo conversacional con elementos visuales relacionados.'
