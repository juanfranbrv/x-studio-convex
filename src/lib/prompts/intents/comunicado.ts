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
COMPOSITION: Official announcement/notice layout with maximum readability.
ZONING:
- Header (15%): Brand logo or "COMUNICADO" badge
- Title Zone (20%): Large, bold announcement headline with high contrast
- Body Zone (50%): Clean, well-spaced text area for detailed message
- Footer (15%): Contact info, effective date, or call to action
STYLE: Professional, clean, high contrast. Serious but not alarming.
TYPOGRAPHY: Large, legible fonts. Generous line spacing.
PRIORITY: Text legibility is ABSOLUTE priority. Minimal decorative elements.
`.trim()

export const COMUNICADO_BANNER_PROMPT = `
COMPOSITION: Horizontal alert banner layout designed for quick reading.
ZONING:
- Layout: Horizontal split or wide format.
- Left Zone (30%): Large Warning/Info Icon or Brand Symbol as visual anchor.
- Right Zone (70%): Text area with Headline on top, Body text below.
STYLE: Urgent, eye-catching, high contrast (Yellow/Black, Red/White, or Brand/White).
TYPOGRAPHY: Bold, impact headers. Concise body text.
`.trim()

export const COMUNICADO_MODERN_PROMPT = `
COMPOSITION: Asymmetric dynamic split.
ZONING:
- Visual (40%): Geometric masks or large brand imagery on one side (left/right).
- Content (60%): Clean whitespace with bold typography blocks.
STYLE: Editorial, sharp angles, vibrant color blocking, tech-forward.
TYPOGRAPHY: Modern sans-serif, high hierarchy contrast.
PRIORITY: Balance between visual impact and text clarity.
`.trim()

export const COMUNICADO_QUOTE_PROMPT = `
COMPOSITION: Centered typographical focus. High-end editorial feel.
ZONING:
- Background: Abstract brand patterns or blurred photography.
- Center (80%): Massive typographical element.
- Quote/Headline: Dominates the visual space.
STYLE: Minimalist, "Quiet Luxury", sophisticated.
TYPOGRAPHY: Elegant serif or ultra-light sans-serif. Very large scale.
`.trim()

export const COMUNICADO_DESCRIPTION = 'Layout oficial con máxima legibilidad. Cabecera de marca, título destacado, cuerpo de texto amplio y pie informativo.'
