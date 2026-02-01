import { CarouselComposition } from '../../carousel-structures'

export const CHECKLIST_DIAGNOSTICO_COMPOSITIONS: CarouselComposition[] = [
    {
        id: 'checklist-diagnostico::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptacion.',
        layoutPrompt: 'Freeform: Adapt the layout to a diagnostic checklist with clear yes/no cues and a self-assessment feel.',
        iconPrompt: 'Monochromatic schematic icon with thick rounded shapes: a simple checklist card with two bold checkboxes.'
    },
    {
        id: 'checklist-diagnostico::board',
        name: 'Checklist Board',
        description: 'Tablero de criterios con checks.',
        layoutPrompt: `--- ARCHITECTURE: DIAGNOSTIC CHECK GRID ---
1. CANVAS GRID: 3-column grid with a header band and a 2x3 matrix of checklist tiles.
2. TEXT SAFETY ZONE: Top 22% reserved as a clean matte surface for headline and brief instructions.
3. VISUAL FRAMING: Flat lay of tiles with bold check or cross marks; central tile slightly larger.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Even, clinical lighting and orderly rhythm. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a rectangle with three bold check marks aligned.'
    },
    {
        id: 'checklist-diagnostico::yes-no-split',
        name: 'Yes / No Split',
        description: 'Division binaria para decidir.',
        layoutPrompt: `--- ARCHITECTURE: YES NO SPLIT ---
1. CANVAS GRID: Vertical split 50/50 with two equal columns for yes and no criteria.
2. TEXT SAFETY ZONE: Top 18% reserved as clean negative space for the diagnostic question.
3. VISUAL FRAMING: Two opposing blocks with oversized yes/no markers and short criteria lines.
4. LOGO ANCHOR: Top-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Strong contrast between columns, structured clarity. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a square split in two with a check on one side and an X on the other.'
    },
    {
        id: 'checklist-diagnostico::scorecard',
        name: 'Scorecard',
        description: 'Puntuacion y resultado.',
        layoutPrompt: `--- ARCHITECTURE: SCORECARD DIAGNOSTIC ---
1. CANVAS GRID: 2-column layout with a tall score panel on the right and checklist items on the left.
2. TEXT SAFETY ZONE: Top 20% reserved as a clean matte band for title and score label.
3. VISUAL FRAMING: Checklist on left, large numeric score on right with a small outcome tag.
4. LOGO ANCHOR: Bottom-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Clear hierarchy and measurable outcome. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a tall rectangle with a big number and short bars.'
    },
    {
        id: 'checklist-diagnostico::radar',
        name: 'Radar Wheel',
        description: 'Autoevaluacion por ejes.',
        layoutPrompt: `--- ARCHITECTURE: RADAR CHECK ---
1. CANVAS GRID: Central radial grid with four axes and short labels around.
2. TEXT SAFETY ZONE: Top 18% reserved as a clean matte strip for headline.
3. VISUAL FRAMING: Radial wheel in center with short tick labels and small checks.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Balanced radial order and analytical feel. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a circle with crosshair axes and a bold point.'
    },
    {
        id: 'checklist-diagnostico::progress-meter',
        name: 'Progress Meter',
        description: 'Medidor de nivel.',
        layoutPrompt: `--- ARCHITECTURE: DIAGNOSTIC METER ---
1. CANVAS GRID: Vertical stack with a large horizontal meter centered and short criteria lines below.
2. TEXT SAFETY ZONE: Top 20% reserved as clean negative space for the diagnostic prompt.
3. VISUAL FRAMING: Bold progress bar with milestone ticks; checklist items aligned below.
4. LOGO ANCHOR: Bottom-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Clear progression and measurable outcome. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a bold horizontal bar with three ticks.'
    },
    {
        id: 'checklist-diagnostico::decision-tree',
        name: 'Decision Tree',
        description: 'Ruta de decision rapida.',
        layoutPrompt: `--- ARCHITECTURE: DECISION TREE ---
1. CANVAS GRID: Top-down flow with one root node and 2-3 branching nodes beneath.
2. TEXT SAFETY ZONE: Top 16% reserved as clean matte space for the main question.
3. VISUAL FRAMING: Rounded nodes connected by thick lines; each node contains a short criterion.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Structured logic with clear branching. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a root node branching into two nodes.'
    },
    {
        id: 'checklist-diagnostico::traffic-lights',
        name: 'Traffic Lights',
        description: 'Semaforo de diagnostico.',
        layoutPrompt: `--- ARCHITECTURE: TRAFFIC LIGHT DIAGNOSTIC ---
1. CANVAS GRID: Vertical column with three stacked circular slots and text labels to the right.
2. TEXT SAFETY ZONE: Top 18% reserved as a clean matte header.
3. VISUAL FRAMING: Three bold circles representing levels; checklist notes aligned.
4. LOGO ANCHOR: Bottom-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Clear tiering and quick scan. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: three stacked circles inside a rounded rectangle.'
    },
    {
        id: 'checklist-diagnostico::tile-grid',
        name: 'Tile Grid',
        description: 'Criterios en mosaico.',
        layoutPrompt: `--- ARCHITECTURE: DIAGNOSTIC TILE GRID ---
1. CANVAS GRID: 2x3 tiles with equal spacing and a slim header band.
2. TEXT SAFETY ZONE: Top 18% reserved as clean negative space for the title.
3. VISUAL FRAMING: Each tile contains a check or cross and a short criterion line.
4. LOGO ANCHOR: Top-left corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Repetitive rhythm and scan-friendly order. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a 2x2 grid of bold squares.'
    },
    {
        id: 'checklist-diagnostico::badge-levels',
        name: 'Badge Levels',
        description: 'Nivel recomendado.',
        layoutPrompt: `--- ARCHITECTURE: LEVEL BADGE ---
1. CANVAS GRID: Centered badge or shield with supporting checklist on the left column.
2. TEXT SAFETY ZONE: Top 20% reserved as a clean matte band for headline.
3. VISUAL FRAMING: Large badge for result and a short list of criteria beside it.
4. LOGO ANCHOR: Bottom-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Achievement feel and decisive outcome. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a bold badge shape with a small check.'
    },
    {
        id: 'checklist-diagnostico::audit-columns',
        name: 'Audit Columns',
        description: 'Columnas de criterios.',
        layoutPrompt: `--- ARCHITECTURE: AUDIT COLUMNS ---
1. CANVAS GRID: Three vertical columns with equal width and short criteria blocks in each.
2. TEXT SAFETY ZONE: Top 18% reserved as clean matte space for the diagnostic headline.
3. VISUAL FRAMING: Column headers with bold check markers aligned beneath.
4. LOGO ANCHOR: Top-right corner with 5-7% margin.
5. ATMOSPHERE STRUCTURE: Ordered columns and analytic rhythm. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: three vertical bars with small check dots.'
    },
    {
        id: 'checklist-diagnostico::stamp-result',
        name: 'Stamp Result',
        description: 'Sello de veredicto.',
        layoutPrompt: `--- ARCHITECTURE: DIAGNOSTIC STAMP ---
1. CANVAS GRID: Centered result stamp with supporting checklist on the left.
2. TEXT SAFETY ZONE: Top 18% reserved as clean matte band for the question.
3. VISUAL FRAMING: Large circular stamp for result, short checklist lines nearby.
4. LOGO ANCHOR: Bottom-right corner with 6-8% margin.
5. ATMOSPHERE STRUCTURE: Decisive outcome and clear authority. Mood: {DYNAMIC_MOOD}.`,
        iconPrompt: 'Monochromatic schematic icon with thick shapes: a bold circle stamp with a check inside.'
    }
]
