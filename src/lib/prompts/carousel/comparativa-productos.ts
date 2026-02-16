import { CarouselComposition } from '../../carousel-structures'

export const COMPARATIVA_PRODUCTOS_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'comparativa-productos::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to compare two items. Side-by-side or table format.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. VERSUS ARENA
    {
        id: 'comparativa-productos::versus',
        name: 'Versus Arena',
        description: 'Enfrentamiento directo.',
        layoutPrompt: 'Split Screen: Left Item vs Right Item. A large "VS" graphic in the center. High energy.',
        iconPrompt: 'Square with VS in center.'
    },
    // 3. TABLE MATRIX
    {
        id: 'comparativa-productos::table',
        name: 'Feature Table',
        description: 'Tabla de características.',
        layoutPrompt: 'Grid Layout: Rows of features. Checkmarks for the "Winner" product, X for the "Loser". Clean comparison.',
        iconPrompt: 'Grid/Table icon.'
    },
    // 4. SLIDER REVEAL
    {
        id: 'comparativa-productos::slider',
        name: 'Slider Reveal',
        description: 'Deslizar para comparar.',
        layoutPrompt: 'Interactive Slider Metaphor: A vertical divider that suggests dragging to see Product A vs Product B.',
        iconPrompt: 'Slider control icon.'
    },
    // 5. BALANCE SCALE
    {
        id: 'comparativa-productos::balance',
        name: 'The Weigh-in',
        description: 'Pesando opciones.',
        layoutPrompt: 'Scale Visual: Product A on one side, Product B on the other. One is weighed down (better value/heavier).',
        iconPrompt: 'Balance scale.'
    },
    // 6. WINNER PODIUM
    {
        id: 'comparativa-productos::winner',
        name: 'Winner Circle',
        description: 'El ganador claro.',
        layoutPrompt: 'Hierarchy: The "Winner" takes up 70% of the space or is in the foreground. The "Loser" is small/greyed out in back.',
        iconPrompt: 'Large circle vs small circle.'
    },
    // 7. CARD FLIP
    {
        id: 'comparativa-productos::flip',
        name: 'Card Flip',
        description: 'Cara y cruz.',
        layoutPrompt: 'Two-Sided: Visual metaphor of a card flipping. Front is Product A, Back is Product B.',
        iconPrompt: 'Rotating card icon.'
    },
    // 8. OVERLAY SPECS
    {
        id: 'comparativa-productos::specs',
        name: 'Tech Specs',
        description: 'Especificaciones técnicas.',
        layoutPrompt: 'Blueprint: Wireframe or technical drawing style comparing dimensions/stats of two items.',
        iconPrompt: 'Ruler and pencil icon.'
    },
    // 9. MIRROR REFLECTION
    {
        id: 'comparativa-productos::mirror',
        name: 'Dark Mirror',
        description: 'Reflejo opuesto.',
        layoutPrompt: 'Reflection: Product A stands on a surface, reflecting Product B (the inferior copy/alternative).',
        iconPrompt: 'Reflected shape.'
    },
    // 10. GHOST OUTLINE
    {
        id: 'comparativa-productos::ghost',
        name: 'Ghost Alternative',
        description: 'La alternativa invisible.',
        layoutPrompt: 'Transparency: The Main Product is solid and vibrant. The Competitor is a ghostly wireframe outline.',
        iconPrompt: 'Solid square vs dotted square.'
    },
    // 11. PRICE TAG
    {
        id: 'comparativa-productos::price',
        name: 'Price Tag War',
        description: 'Guerra de precios.',
        layoutPrompt: 'Tag Focus: Giant price tags hanging from the products. Visual emphasis on the savings value.',
        iconPrompt: 'Price tag icon.'
    },
    // 12. SWAP ARROWS
    {
        id: 'comparativa-productos::swap',
        name: 'Swap It',
        description: 'Cambia esto por aquello.',
        layoutPrompt: 'Exchange: Curved arrow suggesting "Swap This (Old)" -> "For That (New)".',
        iconPrompt: 'Exchange arrows.'
    }
]
