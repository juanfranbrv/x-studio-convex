import { CarouselComposition } from '../../carousel-structures'

export const TOP_RANKING_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'top-ranking::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to showcase a ranking or top list. Hierarchical arrangement emphasizing the #1 spot.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. THE PODIUM
    {
        id: 'top-ranking::podium',
        name: 'The Podium',
        description: 'Podio clásico 1-2-3.',
        layoutPrompt: 'Classic Podium: Visual arrangement of items on stepping blocks. Center block is highest (#1), flanking blocks lower (#2, #3). Clear vertical hierarchy.',
        iconPrompt: 'Three vertical bars of different heights, center one highest.'
    },
    // 3. NUMBERED LADDER
    {
        id: 'top-ranking::ladder',
        name: 'Ladder Climb',
        description: 'Escalera de valor.',
        layoutPrompt: 'Vertical Ladder: List items stacked vertically. The top item is largest/brightest (The Goal), bottom items are smaller. Upward progression.',
        iconPrompt: 'Ladder icon.'
    },
    // 4. MEDAL SHOWCASE
    {
        id: 'top-ranking::medals',
        name: 'Medal Row',
        description: 'Ganadores con medalla.',
        layoutPrompt: 'Medal Display: Horizontal row of items behaving like badges. First one is Gold/Highlighted, others Silver/Bronze style (monochrome variants).',
        iconPrompt: 'Three circles hanging like medals.'
    },
    // 5. KING OF THE HILL
    {
        id: 'top-ranking::king',
        name: 'King of Hill',
        description: 'Líder en la cima.',
        layoutPrompt: 'Pyramid Peak: Triangular composition. The #1 Ranked item sits alone at the apex, supported by lower tiers of other items.',
        iconPrompt: 'Triangle divided horizontally with tip highlighted.'
    },
    // 6. COUNTDOWN CARDS
    {
        id: 'top-ranking::countdown',
        name: 'Countdown',
        description: 'Cuenta regresiva.',
        layoutPrompt: 'Overlap Stack: Large numbering (10, 9... or 3, 2, 1). Visuals staggered from back to front, building anticipation to the #1 card.',
        iconPrompt: 'Stacked rectangles with numbers.'
    },
    // 7. GOLDEN TICKET
    {
        id: 'top-ranking::ticket',
        name: 'Golden Ticket',
        description: 'El elegido especial.',
        layoutPrompt: 'Singular Focus: The Top 1 choice is presented as a "Golden Ticket" or exclusive pass, separated from a background list of "others".',
        iconPrompt: 'Ticket stub icon.'
    },
    // 8. VERTICAL CHART
    {
        id: 'top-ranking::bar-chart',
        name: 'Performance Bar',
        description: 'Gráfico de rendimiento.',
        layoutPrompt: 'Bar Graph: Visualizing the ranking through bar lengths. The "Top" item has the longest bar extending across the canvas.',
        iconPrompt: 'Horizontal bar chart.'
    },
    // 9. ELITE CIRCLE
    {
        id: 'top-ranking::circle',
        name: 'Elite Circle',
        description: 'Círculo de élite.',
        layoutPrompt: 'Radial Hierarchy: The #1 Item is in the absolute center, larger. Secondary ranked items orbit around it in smaller bubbles.',
        iconPrompt: 'Center large circle with smaller satellite circles.'
    },
    // 10. TROPHY SHELF
    {
        id: 'top-ranking::trophy',
        name: 'Trophy Shelf',
        description: 'Estante de premios.',
        layoutPrompt: 'Shelf Display: Visual metaphor of a display case. The Top item is physically placed "higher" or "under a spotlight" on a shelf.',
        iconPrompt: 'Trophy cup shape.'
    },
    // 11. BATTLE BRACKET
    {
        id: 'top-ranking::bracket',
        name: 'Tournament',
        description: 'Llave de torneo.',
        layoutPrompt: 'Tournament Bracket: Visual lines connecting pairs, converging to a single winner on the right or top.',
        iconPrompt: 'Tournament bracket lines.'
    },
    // 12. STAR RATING
    {
        id: 'top-ranking::stars',
        name: '5-Star Review',
        description: 'Valoración máxima.',
        layoutPrompt: 'Review Style: Emphasis on "5 Stars". The ranked items are shown with rating indicators. The Best one glows.',
        iconPrompt: 'Row of 5 stars.'
    }
]
