/**
 * DATO - El Dato (Estadística, infografía)
 * Grupo: Educar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const DATO_EXTENDED_DESCRIPTION = `
Para compartir estadísticas, datos curiosos o información numérica 
relevante para tu audiencia. El número es protagonista, acompañado 
de contexto visual que refuerza el mensaje.
`.trim()

export const DATO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'main_stat',
        label: 'Dato Principal',
        placeholder: 'Ej: 73%',
        type: 'text',
        required: true,
        aiContext: 'The main statistic or number to highlight'
    },
    {
        id: 'stat_context',
        label: 'Contexto del Dato',
        placeholder: 'Ej: de los consumidores prefieren marcas sostenibles',
        type: 'text',
        required: true,
        aiContext: 'What the statistic means or refers to'
    },
    {
        id: 'source',
        label: 'Fuente (opcional)',
        placeholder: 'Ej: Estudio Nielsen 2024',
        type: 'text',
        required: false,
        aiContext: 'Source or reference for the data'
    }
]

export const DATO_BIG_STAT_PROMPT = `
COMPOSITION: Main number hero layout.
ZONING:
- Hero: The data point (number %) uses 60% of the space.
- Context: Short explanatory text anchored below or beside.
- Background: Clean, high contrast to make the number pop.
STYLE: Bold, authoritative, direct.
TYPOGRAPHY: Massive scale numbers.
`.trim()

export const DATO_COMPARISON_PROMPT = `
COMPOSITION: Comparative data visualization.
ZONING:
- Split: Side-by-side or top-bottom comparison zones.
- Graphics: Bar chart bars (A vs B) or size-contrast circles.
- Labels: Clear labeling for the two entities being compared.
STYLE: Analytical, precise.
TYPOGRAPHY: Label style.
`.trim()

export const DATO_PROCESS_PROMPT = `
COMPOSITION: Sequential or flow layout.
ZONING:
- Flow: Linear positioning (left-to-right or vertical) of 3-4 steps/points.
- Graphics: Connecting lines, arrows, or step numbers (1, 2, 3).
- Icons: Illustrative icons for each step.
STYLE: Instructional, logical.
TYPOGRAPHY: Step headers and short descriptions.
`.trim()

export const DATO_INFOGRAPHIC_PROMPT = `
COMPOSITION: Structured grid infographic.
ZONING:
- Grid: 2x2 or 3x1 arrangement of data points.
- Icons: Icon-heavy layout with supporting numbers.
- Header: Summary title spanning the top.
STYLE: Rich, informative, dense but organized.
TYPOGRAPHY: Information density hierarchy.
`.trim()

export const DATO_KEY_METRIC_PROMPT = `
COMPOSITION: Performance dashboard aesthetic.
ZONING:
- Card: The data sits within a stylized "card" or UI element.
- Indicators: "Up arrow", "Growth trend", or "Checkmark" visual cues.
- Brand: Subtle brand watermarking.
STYLE: Tech, SaaS, dashboard.
TYPOGRAPHY: Clean UI sans-serif.
`.trim()

export const DATO_PIE_PROMPT = `
COMPOSITION: Circular visualization focus.
ZONING:
- Visual: Large ring, donut, or pie chart graphic loop.
- Center: Key total or summary text inside/around the ring.
- Legend: Floating labels pointing to segments.
STYLE: Geometric, modern abstract.
TYPOGRAPHY: Floating data labels.
`.trim()

export const DATO_DESCRIPTION = 'Infografía para destacar números, estadísticas o procesos.'
