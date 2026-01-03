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

export const DATO_PROMPT = `
COMPOSITION: Data-driven infographic layout with visual hierarchy.
ZONING:
- Hero Number Zone (50%): The statistic displayed LARGE and bold
- Context Zone (30%): Explanatory text that gives meaning to the number
- Visual Support (15%): Icons, graphs, or abstract elements that reinforce the data
- Source/Footer (5%): Small attribution or source reference
STYLE: Clean, modern, data visualization aesthetic. Professional credibility.
TYPOGRAPHY: Oversized numbers with contrasting context text.
COLORS: Use brand primary for the main stat, secondary for support elements.
INFOGRAPHIC ELEMENTS: Subtle charts, progress bars, or icons that support the narrative.
`.trim()

export const DATO_DESCRIPTION = 'Infografía con número protagonista. Contexto explicativo claro, elementos visuales de apoyo (iconos, gráficos sutiles).'
