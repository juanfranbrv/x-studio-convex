import { CarouselComposition } from '../../carousel-structures'

export const FRASE_CELEBRE_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'frase-celebre::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to showcase a quote elegantly. Focus on typography and whitespace.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. MINIMALIST CENTER
    {
        id: 'frase-celebre::minimal',
        name: 'Clean Center',
        description: 'Minimalista centrado.',
        layoutPrompt: 'Typography: Small, elegant serif font centered in a vast negative space. Pure class.',
        iconPrompt: 'Small centered lines.'
    },
    // 3. BIG BOLD
    {
        id: 'frase-celebre::bold',
        name: 'Big & Bold',
        description: 'Grande y negrita.',
        layoutPrompt: 'Typography: Huge sans-serif font filling the entire canvas. Impactful. White text on dark.',
        iconPrompt: 'Large "Aa" icon.'
    },
    // 4. AUTHOR PORTRAIT
    {
        id: 'frase-celebre::author',
        name: 'The Author',
        description: 'Con retrato.',
        layoutPrompt: 'Split: One side is the quote, other side is a high-contrast portrait of the author.',
        iconPrompt: 'Portrait and lines.'
    },
    // 5. QUOTE MARKS
    {
        id: 'frase-celebre::marks',
        name: 'Giant Marks',
        description: 'Comillas gigantes.',
        layoutPrompt: 'Graphic: Massive quotation marks define the layout boundaries. Text sits inside.',
        iconPrompt: 'Large quotation marks.'
    },
    // 6. TYPEWRITER
    {
        id: 'frase-celebre::typewriter',
        name: 'Typewriter',
        description: 'Estilo mecanografiado.',
        layoutPrompt: 'Retro: Courier font, left aligned. Looks like a page from a book or typed manuscript.',
        iconPrompt: 'Typewriter key.'
    },
    // 7. HANDWRITTEN
    {
        id: 'frase-celebre::hand',
        name: 'Note Style',
        description: 'Nota manual.',
        layoutPrompt: 'Organic: Script or handwritten font style. Looks like a note on a napkin or journal.',
        iconPrompt: 'Pen writing icon.'
    },
    // 8. CARD OVERLAY
    {
        id: 'frase-celebre::card',
        name: 'Card Overlay',
        description: 'Tarjeta sobre fondo.',
        layoutPrompt: 'Layering: Background is a blurred mood image. Foreground is a crisp white card with the text.',
        iconPrompt: 'Rectangle card.'
    },
    // 9. NEON SIGN
    {
        id: 'frase-celebre::neon',
        name: 'Neon Lights',
        description: 'Luces de neón.',
        layoutPrompt: 'Lighting: Text appears to be glowing neon tubes against a brick or dark wall.',
        iconPrompt: 'Glowing text lines.'
    },
    // 10. SPLIT COLOR
    {
        id: 'frase-celebre::split-color',
        name: 'Dual Tone',
        description: 'Dos tonos.',
        layoutPrompt: 'Design: Background split diagonally into two contrasting colors. Text changes color across the split.',
        iconPrompt: 'Diagonal split colors.'
    },
    // 11. LETTERPRESS
    {
        id: 'frase-celebre::press',
        name: 'Letterpress',
        description: 'Bajorrelieve.',
        layoutPrompt: 'Texture: Text looks debossed or pressed into high-quality paper texture.',
        iconPrompt: 'Debossed text.'
    },
    // 12. SPEECH BUBBLE
    {
        id: 'frase-celebre::bubble',
        name: 'Said It',
        description: 'Burbuja de diálogo.',
        layoutPrompt: 'Comic: Clean speech bubble tail pointing to an avatar or off-screen speaker.',
        iconPrompt: 'Speech bubble.'
    }
]
