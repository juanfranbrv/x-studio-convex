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

export const EVENTO_CONFERENCE_PROMPT = `
COMPOSITION: Professional conference poster. Authority and clarity.
ZONING:
- Hero: Large area for speaker portrait or event branding.
- Info Stack: Cleanly aligned block for text details (Who, Where, When).
- Footer: Sponsor logo area or registration URL.
STYLE: Corporate, clean, trustworthy. Blue/Grey/White or Brand Primary.
TYPOGRAPHY: Modern sans-serif headers. Structured information hierarchy.
`.trim()

export const EVENTO_PARTY_PROMPT = `
COMPOSITION: Nightlife or concert flyer. High energy and movement.
ZONING:
- Visuals: Dynamic abstract shapes, lights, or crowd imagery blending with text.
- Center: Event name in massive or stylized typography.
- Anchors: Date and lineup anchored in corners or along edges.
STYLE: Electric, neon, dark mode, glossy.
TYPOGRAPHY: Display fonts, distorted or glow effects.
`.trim()

export const EVENTO_WORKSHOP_PROMPT = `
COMPOSITION: Educational or workshop layout. Structured and inviting.
ZONING:
- Grid: Clear division between "What you will learn" visual cues and logistics.
- Header: Inviting title with friendly imagery (illustration or photo).
- Details: Boxed or highlighted area for date/time/location.
STYLE: Clean, bright, approachable.
TYPOGRAPHY: Readable, friendly sans-serif.
`.trim()

export const EVENTO_FESTIVAL_PROMPT = `
COMPOSITION: Artistic festival or cultural event. Expressive.
ZONING:
- Canvas: Full artistic background (collage, painting, or abstract).
- Text: Integrated into the artwork, perhaps following shapes or paths.
- Logo: Prominent event identity.
STYLE: Bohemic, artistic, colorful, texture-rich.
TYPOGRAPHY: Expressive, custom-feel, eclectic.
`.trim()

export const EVENTO_NETWORKING_PROMPT = `
COMPOSITION: Community meetup or networking. Connection focused.
ZONING:
- Pattern: Background with connecting lines, dots, or avatars.
- Center: Clear central hub with event title.
- Periphery: Space for topic keywords or sub-groups.
STYLE: Tech, network, modern.
TYPOGRAPHY: Clean, digital aesthetic.
`.trim()

export const EVENTO_MINIMAL_PROMPT = `
COMPOSITION: "Save the Date" elegance. Minimalist announcement.
ZONING:
- Negative Space: Vast open area.
- Focus: Centralized date or single iconic element.
- Text: Small, refined text content balanced by whitespace.
STYLE: High-end, premium, exclusive.
TYPOGRAPHY: Thin, elegant, widely spaced.
`.trim()

export const EVENTO_DESCRIPTION = 'Diseño tipo cartel/flyer con jerarquía para destacar fecha, hora y lugar.'
