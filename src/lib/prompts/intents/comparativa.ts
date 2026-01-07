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

export const COMPARATIVA_SPLIT_PROMPT = `
COMPOSITION: Classic vertical split screen.
ZONING:
- Left (50%): "Before" or "Problem" state. Desaturated or chaotic.
- Right (50%): "After" or "Solution" state. Vibrant, organized, clean.
- Divider: Distinct vertical separator line.
STYLE: Direct comparison, high contrast between states.
TYPOGRAPHY: Minimal labels (Before/After) at the top.
`.trim()

export const COMPARATIVA_VS_PROMPT = `
COMPOSITION: Aggressive "Versus" battle layout.
ZONING:
- Diagonal Split: Dynamic diagonal cut separating the two sides.
- Center: Large "VS" badge or lightning bolt icon overlapping the split.
- Sides: Two contenders facing off.
STYLE: Sports, gaming, high energy.
TYPOGRAPHY: Bold player/product names.
`.trim()

export const COMPARATIVA_BEFORE_AFTER_PROMPT = `
COMPOSITION: Transformation showcase.
ZONING:
- Main Image: Single large image showing the result (After).
- Inset: Small "Before" snapshot in a corner with a white border (polypile style) or "peeling" effect.
- Arrow: Curved arrow pointing from before to after.
STYLE: Testimonial, proof-of-concept, realistic.
TYPOGRAPHY: "Result" focus.
`.trim()

export const COMPARATIVA_GRID_PROMPT = `
COMPOSITION: Side-by-side feature grid.
ZONING:
- Columns: Two distinct columns.
- Rows: Checkmarks (Green) on one side vs X's (Red) on the other.
- Header: Product A vs Product B.
STYLE: Informational, review site aesthetic.
TYPOGRAPHY: List/Feature based.
`.trim()

export const COMPARATIVA_SLIDER_PROMPT = `
COMPOSITION: Interactive slider illusion.
ZONING:
- Image: Full width image split in middle.
- Control: "Slider" handle graphic in the center suggested user interaction.
- Left/Right: Two states of the same subject blending at the slider.
STYLE: UI/UX demo, interactive feel.
TYPOGRAPHY: "Drag to compare" hint.
`.trim()

export const COMPARATIVA_EVOLUTION_PROMPT = `
COMPOSITION: Timeline evolution.
ZONING:
- Layout: Horizontal progression left to right.
- Steps: Old version -> Transition -> New version.
- Connector: Arrow or timeline bar running through.
STYLE: Growth, history, progress.
TYPOGRAPHY: Years or version numbers.
`.trim()

export const COMPARATIVA_DESCRIPTION = 'Diseño comparativo: Antes/Después, VS, Evolución.'
