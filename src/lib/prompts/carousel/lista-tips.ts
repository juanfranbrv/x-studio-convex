import { CarouselComposition } from '../../carousel-structures'

export const LISTA_TIPS_COMPOSITIONS: CarouselComposition[] = [
    // 1. COMPO LIBRE
    {
        id: 'lista-tips::free',
        name: 'Libre (IA)',
        description: 'La IA decide la mejor adaptación.',
        layoutPrompt: 'Freeform: Adapts layout to list multiple items. Clean, organized, scannable.',
        iconPrompt: 'Minimalist abstract icon of a 5-dot dice face, monochrome in primary color.'
    },
    // 2. CHECKLIST BOARD
    {
        id: 'lista-tips::clipboard',
        name: 'Clipboard',
        description: 'Tablero de checklist.',
        layoutPrompt: 'Clipboard Style: Visual of a clipboard or paper sheet with checkmarks next to short list items.',
        iconPrompt: 'Rectangle with checkmarks.'
    },
    // 3. STICKY NOTES
    {
        id: 'lista-tips::postits',
        name: 'Sticky Notes',
        description: 'Notas adhesivas.',
        layoutPrompt: 'Bulletin Board: Multiple square "sticky notes" arranged loosely on a surface. Each note has a tip.',
        iconPrompt: 'Several small squares slightly rotated.'
    },
    // 4. GRID CARDS
    {
        id: 'lista-tips::grid-cards',
        name: 'Grid Cards',
        description: 'Mosaico de tarjetas.',
        layoutPrompt: 'Masonry Grid: Tight grid of cards, each containing an icon and a short tip.',
        iconPrompt: 'Grid of small rectangles.'
    },
    // 5. VERTICAL STACK
    {
        id: 'lista-tips::stack-list',
        name: 'Vertical Stack',
        description: 'Pila vertical limpia.',
        layoutPrompt: 'Clean List: Vertical stack of pill-shaped or rectangular containers. Uniform spacing. Very UI-like.',
        iconPrompt: 'Stacked horizontal bars.'
    },
    // 6. FLOATING BUBBLES
    {
        id: 'lista-tips::bubbles',
        name: 'Tips Bubbles',
        description: 'Burbujas de consejos.',
        layoutPrompt: 'Chat Bubbles: Tips presented inside speech bubble shapes floating in the composition.',
        iconPrompt: 'Speech bubbles icon.'
    },
    // 7. SIDEBAR LAYOUT
    {
        id: 'lista-tips::sidebar',
        name: 'Sidebar',
        description: 'Barra lateral de items.',
        layoutPrompt: 'Split Sidebar: Left 1/3 is a dark sidebar with the list, Right 2/3 is a hero image reflecting the active tip.',
        iconPrompt: 'Rectangle split 1/3 and 2/3.'
    },
    // 8. NOTEBOOK
    {
        id: 'lista-tips::notebook',
        name: 'Notebook',
        description: 'Página de cuaderno.',
        layoutPrompt: 'Open Notebook: Lined paper texture background, "handwritten" style font for tips, doodle icons.',
        iconPrompt: 'Open book or notebook icon.'
    },
    // 9. ICONS ROW
    {
        id: 'lista-tips::icons-row',
        name: 'Icon Row',
        description: 'Fila de iconos.',
        layoutPrompt: 'Horizontal Banner: Row of 3-4 distinct icons, each with a caption below. Minimalist.',
        iconPrompt: 'Row of 4 small icons.'
    },
    // 10. HONEYCOMB
    {
        id: 'lista-tips::honeycomb',
        name: 'Honeycomb',
        description: 'Panal hexagonal.',
        layoutPrompt: 'Hexagonal Grid: Tips arranged inside interlocking hexagon shapes.',
        iconPrompt: 'Hexagon cluster.'
    },
    // 11. TAG CLOUD
    {
        id: 'lista-tips::tags',
        name: 'Tag Cloud',
        description: 'Nube de etiquetas.',
        layoutPrompt: 'Floating Tags: Pill-shaped tags of different sizes floating, each with a keyword tip.',
        iconPrompt: 'Cluster of oval shapes.'
    },
    // 12. BOOKMARKS
    {
        id: 'lista-tips::bookmarks',
        name: 'Bookmarks',
        description: 'Marcadores colgantes.',
        layoutPrompt: 'Hanging Bookmarks: Vertical strips hanging from the top edge, each with a tip number and text.',
        iconPrompt: 'Vertical banners hanging from top.'
    }
]
