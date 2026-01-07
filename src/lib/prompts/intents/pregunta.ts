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

export const PREGUNTA_BIG_TYPE_PROMPT = `
COMPOSITION: Typographic impact layout.
ZONING:
- Hero Text: The question text is the absolute visual dominant (70%+).
- Background: Solid vibrant color or subtle abstract pattern.
- CTA: Small, anchored button or text "Reply below".
STYLE: Bold, loud, impossible to ignore.
TYPOGRAPHY: Massive sans-serif or slab-serif.
`.trim()

export const PREGUNTA_POLL_PROMPT = `
COMPOSITION: Visual comparison or "This vs That".
ZONING:
- Split: Vertical or diagonal split dividing two options.
- Visuals: Use widely different colors or icons for Option A vs Option B.
- Center/Overlay: "VS" badge or "Choose One" graphic.
STYLE: Gamified, competitive, high contrast.
TYPOGRAPHY: Clear labels for options.
`.trim()

export const PREGUNTA_CONVERSATION_PROMPT = `
COMPOSITION: Chat or digital conversation aesthetic.
ZONING:
- Bubbles: Graphic elements mimicking message bubbles or quote containers.
- Avatar: Optional placeholder for the "asker" identity.
- Input: Visual cue resembling a text input field or "Type here" anchor.
STYLE: Social media native, relatable, modern.
TYPOGRAPHY: UI-style fonts (San Francisco, Inter, Roboto).
`.trim()

export const PREGUNTA_QUIZ_PROMPT = `
COMPOSITION: Multiple choice game show interface.
ZONING:
- Header: The challenge/question at the top.
- Grid: 3 or 4 distinct cards or blocks representing potential answers.
- Highlights: One option visually highlighted (hover state) or all equal.
STYLE: Playful, educational, structured.
TYPOGRAPHY: Clear, easy to read options.
`.trim()

export const PREGUNTA_DEBATE_PROMPT = `
COMPOSITION: Serious discussion or thought-provoking layout.
ZONING:
- Image: Provocative or thematic imagery on one side/background.
- Overlays: Semi-transparent layer for text legibility.
- Footer: "What do you think?" prompt area.
STYLE: Editorial opinion piece. Deeper colors.
TYPOGRAPHY: Serif or sophisticated sans.
`.trim()

export const PREGUNTA_THOUGHT_PROMPT = `
COMPOSITION: Introspective or theoretical question.
ZONING:
- Visual: Illustration of a head, lightbulb, or abstract "thinking" shapes.
- Space: Open area representing "space for thought".
- Text: Floating or integrated into the airspace.
STYLE: Abstract, soft, intellectual.
TYPOGRAPHY: Light, airy, spaced out.
`.trim()

export const PREGUNTA_DESCRIPTION = 'Diseño para fomentar la participación mediante preguntas, encuestas y debates.'
