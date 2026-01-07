/**
 * COMUNICADO - El Comunicado (Aviso, información densa)
 * Grupo: Informar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const COMUNICADO_EXTENDED_DESCRIPTION = `
Ideal para anuncios oficiales, cambios de horario, nuevas políticas o 
información importante. El diseño prioriza la legibilidad del texto 
sobre elementos visuales decorativos.
`.trim()

export const COMUNICADO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'announcement_title',
        label: 'Título del Comunicado',
        placeholder: 'Ej: Cambio de Horario',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'Main announcement headline'
    },
    {
        id: 'announcement_body',
        label: 'Texto del Comunicado',
        placeholder: 'Detalla aquí el mensaje completo...',
        type: 'textarea',
        required: true,
        aiContext: 'Full announcement text body'
    },
    {
        id: 'effective_date',
        label: 'Fecha Efectiva (opcional)',
        placeholder: 'A partir del 15 de enero',
        type: 'text',
        required: false,
        aiContext: 'When the announcement takes effect'
    }
]

export const COMUNICADO_OFFICIAL_PROMPT = `
COMPOSITION: Trusted authority layout. Structured and hierarchical.
ZONING:
- Header: Reserved space for official seal, logo, or crest at top or center.
- Body: Clean, single-column text area with generous margin.
- Footer: Distinct separator for contact info or validity dates.
STYLE: Institutional, clean, trustworthy. White or neutral subtle backgrounds.
TYPOGRAPHY: Highly legible sans-serif or authoritative serif main text.
PRIORITY: Clarity and Trust.
`.trim()

export const COMUNICADO_URGENT_PROMPT = `
COMPOSITION: High-visibility alert layout.
ZONING:
- Anchor: Large warning icon, exclamation mark, or diagonal stripes as attention grabber.
- Content: Centralized message block with high contrast against the background.
- Frame: Solid borders or distinct color bands at top/bottom.
STYLE: Alert aesthetic. High contrast (Yellow/Black, Brand/White, Red/White).
TYPOGRAPHY: Bold, impact headers. Condensed body text.
`.trim()

export const COMUNICADO_MODERN_PROMPT = `
COMPOSITION: Asymmetric dynamic split. Tech-forward.
ZONING:
- Visual: Geometric masks, abstract shapes, or large content blocks on one side.
- Content: Clean whitespace balancing the heavy visual side.
- Accents: Small tech-inspired elements (lines, dots, data points).
STYLE: Editorial, sharp angles, vibrant color blocking.
TYPOGRAPHY: Modern, high hierarchy contrast.
`.trim()

export const COMUNICADO_EDITORIAL_PROMPT = `
COMPOSITION: Centered typographical focus. High-end magazine feel.
ZONING:
- Background: Abstract brand patterns, blurred photography, or solid rich color.
- Center: Massive typographical element or quote marks acting as graphics.
- Caption: Discrete area for attribution or secondary details.
STYLE: Minimalist, "Quiet Luxury", sophisticated.
TYPOGRAPHY: Elegant serif or ultra-light sans-serif benchmarks.
`.trim()

export const COMUNICADO_COMMUNITY_PROMPT = `
COMPOSITION: Warm, approachable, human-centric layout.
ZONING:
- Organic Shapes: Curved lines, circles, or soft framing elements.
- Image Integration: Space for lifestyle imagery or community interaction placeholders.
- Text Flow: Wrapped or balanced text that feels conversational.
STYLE: Friendly, inviting, soft color palette.
TYPOGRAPHY: Rounder sans-serifs or approachable styles.
`.trim()

export const COMUNICADO_MINIMAL_PROMPT = `
COMPOSITION: Stark, pure utility layout. Ultra-modern Swiss style.
ZONING:
- Grid: Strict grid alignment (left-aligned or rigid center axis).
- Negative Space: Vast amounts of whitespace.
- Divider: Single bold distinct line or geometric anchor.
STYLE: Brutalist or Swiss Design. Monochrome or Duo-tone.
TYPOGRAPHY: Monospaced or Grotesque fonts to emphasize raw data feel.
`.trim()

export const COMUNICADO_DESCRIPTION = 'Layouts oficiales para anuncios, noticias importantes y actualizaciones.'

