import { CarouselComposition } from '../../carousel-structures'

export const MEME_HUMOR_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'meme-humor::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to a recognizable meme format or humorous visual.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. TOP BOTTOM
    {
        id: 'meme-humor::top-bottom',
        name: 'Classic Text',
        description: 'Texto arriba y abajo.',
        layoutPrompt: 'Meme Format: Impact font. White text with black outline. One line at top, one at bottom. Image in center.',
        iconPrompt: 'Square with top/bottom lines.'
    },
    // 3. TWO BUTTONS
    {
        id: 'meme-humor::buttons',
        name: 'Hard Choice',
        description: 'La decisión difícil.',
        layoutPrompt: 'Meme Format: Visual of a character sweating between two red buttons labeled with conflicting options.',
        iconPrompt: 'Two buttons icon.'
    },
    // 4. DRAKE
    {
        id: 'meme-humor::drake',
        name: 'Nah / Yeah',
        description: 'Rechazo vs Aprobación.',
        layoutPrompt: 'Meme Format: Split vertical. Top: Disapproving gesture to option A. Bottom: Approving gesture to option B.',
        iconPrompt: 'Hand stop / Hand point.'
    },
    // 5. DISTRACTED
    {
        id: 'meme-humor::distracted',
        name: 'The Distraction',
        description: 'Mirada distraída.',
        layoutPrompt: 'Meme Format: 3 Labels. "Me", "Current Thing", "New Shiny Thing". Character looking back.',
        iconPrompt: 'Three labeled dots.'
    },
    // 6. EXPECTATION REALITY
    {
        id: 'meme-humor::expectation',
        name: 'Expect vs Reality',
        description: 'Expectativa vs Realidad.',
        layoutPrompt: 'Split: Left side picturesque/perfect (Expectation). Right side messy/fail (Reality).',
        iconPrompt: 'Sparkle vs Blob.'
    },
    // 7. BRAIN EXPAND
    {
        id: 'meme-humor::brain',
        name: 'Galaxy Brain',
        description: 'Cerebro galaxia.',
        layoutPrompt: 'Sequence: 4 vertical panels. Small brain -> Normal brain -> Light brain -> Galaxy brain.',
        iconPrompt: 'Four vertical stack.'
    },
    // 8. CHANGE MY MIND
    {
        id: 'meme-humor::mind',
        name: 'Change Mind',
        description: 'Convénceme.',
        layoutPrompt: 'Scene: Person sitting at a table with a sign. Sign has the controversial statement.',
        iconPrompt: 'Table and sign.'
    },
    // 9. CLOWN MAKEUP
    {
        id: 'meme-humor::clown',
        name: 'The Clown',
        description: 'Payaso progresivo.',
        layoutPrompt: 'Sequence: Steps of putting on clown makeup. Getting increasingly ridiculous.',
        iconPrompt: 'Clown face.'
    },
    // 10. LABELING
    {
        id: 'meme-humor::label',
        name: 'Object Labeling',
        description: 'Etiquetado de objetos.',
        layoutPrompt: 'Scene: An action scene where characters/objects are leveled with text (e.g. "My anxiety", "Me", "Coffee").',
        iconPrompt: 'Tags on items.'
    },
    // 11. NPC
    {
        id: 'meme-humor::npc',
        name: 'NPC Face',
        description: 'Cara inexpresiva.',
        layoutPrompt: 'Portrait: A grey, expressionless face or "Wojak" style minimalist drawing expressing a mood.',
        iconPrompt: 'Blank face.'
    },
    // 12. TIER LIST
    {
        id: 'meme-humor::tier',
        name: 'Tier List',
        description: 'Lista de niveles.',
        layoutPrompt: 'Grid: S-Tier, A-Tier, B-Tier, F-Tier rows with items placed in them.',
        iconPrompt: 'S A B C rows.'
    }
]
