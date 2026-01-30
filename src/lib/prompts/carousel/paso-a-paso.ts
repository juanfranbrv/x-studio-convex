import { CarouselComposition } from '../../carousel-structures'

export const PASO_A_PASO_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'paso-a-paso::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to show progression. Visual sequencing or movement from start to finish.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. SNAKE PATH
    {
        id: 'paso-a-paso::snake',
        name: 'Snake Path',
        description: 'Camino serpenteante.',
        layoutPrompt: 'S-Curve Path: winding road or path visual guiding the eye through 3-4 distinct steps marked by icons or numbers.',
        iconPrompt: 'S-shaped curved line.'
    },
    // 3. STAIRCASE
    {
        id: 'paso-a-paso::stairs',
        name: 'Staircase',
        description: 'Escalera de progreso.',
        layoutPrompt: 'Ascending Stairs: Visual steps going up from left to right. Each step represents a stage of the process.',
        iconPrompt: 'Icon of steps ascending.'
    },
    // 4. HORIZONTAL TIMELINE
    {
        id: 'paso-a-paso::timeline-h',
        name: 'H-Timeline',
        description: 'Línea de tiempo horizontal.',
        layoutPrompt: 'Linear Horizontal: Straight horizontal line with nodes/dots indicating stops. Left-to-right flow.',
        iconPrompt: 'Horizontal line with 3 dots.'
    },
    // 5. VERTICAL TRACK
    {
        id: 'paso-a-paso::track-v',
        name: 'V-Track',
        description: 'Seguimiento vertical.',
        layoutPrompt: 'Linear Vertical: Vertical line on left or center with nodes connecting stacked sections of text/visuals.',
        iconPrompt: 'Vertical line with 3 dots.'
    },
    // 6. NUMBERED CARDS
    {
        id: 'paso-a-paso::cards',
        name: 'Numbered Cards',
        description: 'Tarjetas numeradas.',
        layoutPrompt: 'Card Deck: 3 overlapping or spread-out cards, each clearly featuring a large number (1, 2, 3).',
        iconPrompt: 'Three overlapping rectangles.'
    },
    // 7. CIRCULAR CYCLE
    {
        id: 'paso-a-paso::cycle',
        name: 'Cycle Loop',
        description: 'Ciclo continuo.',
        layoutPrompt: 'Circular Flow: Arrows arranging in a circle to imply a repeating process or cycle. Center can text or final outcome.',
        iconPrompt: 'Circular arrows icon.'
    },
    // 8. CONNECTED DOTS
    {
        id: 'paso-a-paso::dots',
        name: 'Connected Dots',
        description: 'Puntos conectados.',
        layoutPrompt: 'Constellation: Abstract nodes connected by thin lines. Less linear, more network-like but ordered.',
        iconPrompt: 'Nodes connected by lines.'
    },
    // 9. FILMSTRIP
    {
        id: 'paso-a-paso::film',
        name: 'Filmstrip',
        description: 'Tira de película.',
        layoutPrompt: 'Cinematic Strip: Horizontal sequence of frames looking like a movie reel or filmstrip.',
        iconPrompt: 'Film strip iconography.'
    },
    // 10. ZIGZAG
    {
        id: 'paso-a-paso::zigzag',
        name: 'ZigZag',
        description: 'Lectura en Z.',
        layoutPrompt: 'Z-Pattern: Step 1 Top-Left, Step 2 Center, Step 3 Bottom-Right. Connectors between them.',
        iconPrompt: 'Z-shaped line connecting points.'
    },
    // 11. PIPELINE
    {
        id: 'paso-a-paso::pipeline',
        name: 'Pipeline',
        description: 'Tubería de proceso.',
        layoutPrompt: 'Pipeline Tube: a thick textual/visual 3D pipe/tube connecting stages, industrial or clean aesthetic.',
        iconPrompt: 'Cylindrical tube segments.'
    },
    // 12. HOP SCOTCH
    {
        id: 'paso-a-paso::hop',
        name: 'Hopscotch',
        description: 'Saltos de etapa.',
        layoutPrompt: 'Playful Path: Scattered islands or stones in a stream leading from foreground to horizon.',
        iconPrompt: 'Irregular stones path.'
    }
]
