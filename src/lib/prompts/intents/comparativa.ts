/**
 * COMPARATIVA - La Comparativa (Antes/Después o Vs)
 * Grupo: Informar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const COMPARATIVA_EXTENDED_DESCRIPTION = `
Diseño partido (split screen) para enfrentar dos conceptos: Antes/Después, 
Mito/Realidad o Producto A/B. Muy efectivo para educar o mostrar resultados 
tangibles.
`.trim()

export const COMPARATIVA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'item_a',
        label: 'Elemento A',
        placeholder: 'Ej: Antes',
        type: 'text',
        required: true,
        aiContext: 'First item of comparison/Left side'
    },
    {
        id: 'item_b',
        label: 'Elemento B',
        placeholder: 'Ej: Después',
        type: 'text',
        required: true,
        aiContext: 'Second item of comparison/Right side'
    },
    {
        id: 'topic',
        label: 'Tema',
        placeholder: 'Ej: Resultados del tratamiento',
        type: 'text',
        required: false,
        aiContext: 'Subject of the comparison'
    }
]

export const COMPARATIVA_PROMPT = `
COMPOSITION: Split screen or side-by-side comparison layout. Symmetry is key.
ZONING:
- Side A (45%): Visual for the first concept (Before, Myth, Competitor).
- Side B (45%): Visual for the second concept (After, Reality, Us).
- Divider/Label (10%): Clear division line or "VS" badge, or "Before/After" labels.
STYLE: Analytical, direct, contrasting.
PHOTOGRAPHY: Two contrasting images or styles. Usually desaturated/problematic for A and vibrant/solved for B.
PRIORITY: Clear distinction and obvious transformation or advantage.
`.trim()

export const COMPARATIVA_DESCRIPTION = 'Diseño partido (split screen) para enfrentar dos conceptos: Antes/Después, Mito/Realidad.'
