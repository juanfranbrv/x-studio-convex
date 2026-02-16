import { CarouselComposition } from '../../carousel-structures'

export const CRONOLOGIA_HISTORIA_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'cronologia-historia::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to a timeline or historical progression. Flow from left to right or top to bottom.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. HORIZONTAL TIMELINE
    {
        id: 'cronologia-historia::timeline-h',
        name: 'Classic Timeline',
        description: 'Línea de tiempo horizontal.',
        layoutPrompt: 'Linear Flow: A central horizontal line with dots marking key years/events. Chronological order L->R.',
        iconPrompt: 'Line with dots (horizontal).'
    },
    // 3. VERTICAL PATH
    {
        id: 'cronologia-historia::path-v',
        name: 'Vertical Journey',
        description: 'Camino vertical.',
        layoutPrompt: 'Winding Path: A vertical road or line winding down the canvas. Events placed at curves.',
        iconPrompt: 'S-shaped vertical line.'
    },
    // 4. MILESTONE STONES
    {
        id: 'cronologia-historia::stones',
        name: 'Stepping Stones',
        description: 'Pasos de piedra.',
        layoutPrompt: 'Steps: Visual of stones across a river or path. Each stone is a date/event.',
        iconPrompt: 'Footsteps icon.'
    },
    // 5. SPIRAL EVOLUTION
    {
        id: 'cronologia-historia::spiral',
        name: 'Evolution Spiral',
        description: 'Espiral evolutiva.',
        layoutPrompt: 'Helix: A DNA-like or spiral structure showing growth/evolution over time.',
        iconPrompt: 'Spiral shape.'
    },
    // 6. FILM STRIP
    {
        id: 'cronologia-historia::film',
        name: 'Film Strip',
        description: 'Tira de película.',
        layoutPrompt: 'Cinematic: Layout looks like a roll of film or negatives. Each frame is a moment in history.',
        iconPrompt: 'Film strip icon.'
    },
    // 7. CLOCK FACE
    {
        id: 'cronologia-historia::clock',
        name: 'Clock Wise',
        description: 'Sentido horario.',
        layoutPrompt: 'Circular: Events arranged around a clock face or circle. 12:00 is start, moving clockwise.',
        iconPrompt: 'Clock icon.'
    },
    // 8. TREE GROWTH
    {
        id: 'cronologia-historia::tree',
        name: 'Growth Tree',
        description: 'Árbol de crecimiento.',
        layoutPrompt: 'Organic: Roots (Past) -> Trunk (Present) -> Branches (Future). Visualizing organic growth.',
        iconPrompt: 'Tree shape.'
    },
    // 9. CALENDAR GRID
    {
        id: 'cronologia-historia::calendar',
        name: 'Calendar',
        description: 'Calendario marcado.',
        layoutPrompt: 'Grid Date: Aesthetic of a calendar page with specific dates circled in red.',
        iconPrompt: 'Calendar page icon.'
    },
    // 10. CONNECTING DOTS
    {
        id: 'cronologia-historia::dots',
        name: 'Constellation',
        description: 'Conectando puntos.',
        layoutPrompt: 'Star Map: Abstract dots connected by thin lines, forming a "constellation" of events.',
        iconPrompt: 'Connected dots network.'
    },
    // 11. ROADMAP SCROLL
    {
        id: 'cronologia-historia::scroll',
        name: 'Ancient Scroll',
        description: 'Pergamino antiguo.',
        layoutPrompt: 'Paper Scroll: A long unrolled paper scroll layout listing historical decrees or events.',
        iconPrompt: 'Scroll icon.'
    },
    // 12. ERA BLOCKS
    {
        id: 'cronologia-historia::eras',
        name: 'Era Blocks',
        description: 'Bloques de era.',
        layoutPrompt: 'Zoning: Distinct color blocks separating "The 80s", "The 90s", "Now".',
        iconPrompt: 'Three colored squares in a row.'
    }
]
