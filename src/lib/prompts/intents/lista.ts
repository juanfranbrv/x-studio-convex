/**
 * LISTA - La Lista (Tips y enumeraciones)
 * Grupo: Informar
 * 
 * Diseño estructurado para enumeraciones, check-lists o rankings.
 * Facilita la lectura rápida de varios puntos.
 */

import type { IntentRequiredField, LayoutOption } from '@/lib/creation-flow-types'

export const LISTA_EXTENDED_DESCRIPTION = `
Diseño estructurado para enumeraciones, check-lists o rankings. 
Facilita la lectura rápida de varios puntos. Ideal para "Top 5", 
"Pasos a seguir" o "Cosas que no sabías".
`.trim()

export const LISTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'list_title',
        label: 'Título de la Lista',
        placeholder: 'Ej: 5 Tips para...',
        type: 'text',
        required: true,
        aiContext: 'Title of the listicle'
    },
    {
        id: 'items_context',
        label: 'Contexto de los ítems',
        placeholder: 'Ej: Herramientas de IA, Libros...',
        type: 'text',
        required: true,
        aiContext: 'Topic of the items in the list'
    },
    {
        id: 'item_count',
        label: 'Número de ítems',
        placeholder: 'Ej: 5',
        type: 'text',
        required: false,
        aiContext: 'Number of items to visualize graphically'
    }
]

// 1. CHECKLIST - Productivity UI
export const LISTA_CHECKLIST_PROMPT = `
# Composition Type
Interactive Checklist UI

# Visual Hierarchy
- **Primary**: Vertical stack of items with checkbox icons (circles/squares) on left
- **Secondary**: Mixed check states showing progress (some checked, some pending)
- **Tertiary**: Motivational header title at top

# Zoning Guide
- **Zone Header**: Title and context at top
- **Zone List**: Vertical stack of checklist items
- **Zone Progress**: Optional progress indicator at bottom

# Style Modifiers
- **Texture**: Productivity app, task manager aesthetic
- **Lighting**: Clean UI lighting, no drama
- **Palette**: Clean whites, greens for completion, brand accents

# Negative Constraints
- **Avoid**: Cramped items, inconsistent spacing, unclear states
`.trim()

// 2. RANKING - Leaderboard
export const LISTA_RANKING_PROMPT = `
# Composition Type
Top Ranking Leaderboard

# Visual Hierarchy
- **Primary**: #1 item large and highlighted with crown/gold treatment
- **Secondary**: #2-#5 items progressively smaller below
- **Tertiary**: Prominent rank numbers (1, 2, 3) as visual anchors

# Zoning Guide
- **Zone Winner**: Top/center for #1 with maximum emphasis
- **Zone Runner Ups**: Stacked list for remaining ranks
- **Zone Badges**: Medal or ranking badge indicators

# Style Modifiers
- **Texture**: Leaderboard, competition, trophy shelf aesthetic
- **Lighting**: Spotlight on #1, progressive dimming below
- **Palette**: Gold #1, Silver #2, Bronze #3, then neutral

# Negative Constraints
- **Avoid**: Equal sizing for all ranks, buried winner, no hierarchy
`.trim()

// 3. PASOS - Step by Step Path
export const LISTA_PASOS_PROMPT = `
# Composition Type
Step-by-Step Journey Path

# Visual Hierarchy
- **Primary**: Winding path or connected line between numbered steps
- **Secondary**: Numbered nodes (1 → 2 → 3) along the path
- **Tertiary**: Icons or brief text at each waypoint

# Zoning Guide
- **Zone Path**: Visual journey line connecting all steps
- **Zone Nodes**: Step markers at each junction
- **Zone Labels**: Brief text or icons at each step

# Style Modifiers
- **Texture**: Roadmap, journey map, game board aesthetic
- **Lighting**: Clear, instructional clarity
- **Palette**: Progressive color scheme along the path

# Negative Constraints
- **Avoid**: Unclear direction, disconnected steps, crowded text
`.trim()

// 4. REJILLA - Grid Collection
export const LISTA_REJILLA_PROMPT = `
# Composition Type
Grid Card Collection

# Visual Hierarchy
- **Primary**: 2x2 or 2x3 grid of uniform cards
- **Secondary**: Each card contains icon/image and short text key
- **Tertiary**: Consistent shape repetition creating visual rhythm

# Zoning Guide
- **Zone Grid**: Evenly distributed card matrix
- **Zone Cards**: Individual cells with icon + text
- **Zone Header**: Optional title spanning the grid top

# Style Modifiers
- **Texture**: Collection catalog, resource library aesthetic
- **Lighting**: Even, consistent across all cards
- **Palette**: Unified color system across all cards

# Negative Constraints
- **Avoid**: Inconsistent card sizes, broken grid, varying styles
`.trim()

// 5. TIMELINE - Vertical History
export const LISTA_TIMELINE_PROMPT = `
# Composition Type
Vertical Timeline

# Visual Hierarchy
- **Primary**: Central or left-aligned vertical line spine
- **Secondary**: Nodes/dots on the line for each event or item
- **Tertiary**: Text blocks alternating or aligned to one side

# Zoning Guide
- **Zone Spine**: Vertical timeline line
- **Zone Nodes**: Event markers along the spine
- **Zone Content**: Text blocks at each node

# Style Modifiers
- **Texture**: History, schedule, progression visualization
- **Lighting**: Clean, chronological clarity
- **Palette**: Progressive colors or consistent themed palette

# Negative Constraints
- **Avoid**: Confusing chronology, disconnected nodes, crowded labels
`.trim()

// 6. NOTA - Handwritten Note
export const LISTA_NOTA_PROMPT = `
# Composition Type
Handwritten Note Style

# Visual Hierarchy
- **Primary**: Paper texture background with notebook lines or sticky note shape
- **Secondary**: Handwritten-style list with organic alignment
- **Tertiary**: Doodles, arrows, or underlines as personal touches

# Zoning Guide
- **Zone Paper**: Textured paper or sticky note surface
- **Zone List**: Items in list form with handwritten feel
- **Zone Doodles**: Organic arrows, circles, underlines

# Style Modifiers
- **Texture**: Handdrawn, organic, personal, sketch feel
- **Lighting**: Soft, paper-like, natural
- **Palette**: Paper tones, pen/marker colors (blue, black, red)

# Negative Constraints
- **Avoid**: Digital perfection, clinical alignment, cold typography
`.trim()

// 7. BULLETS - Clean Bullet Points
export const LISTA_BULLETS_PROMPT = `
# Composition Type
Clean Bullet Point List

# Visual Hierarchy
- **Primary**: Clear bullet markers (dots, dashes, or icons) preceding each item
- **Secondary**: Well-spaced text entries in readable hierarchy
- **Tertiary**: Headline title establishing the list topic

# Zoning Guide
- **Zone Title**: Header or headline at top
- **Zone Bullets**: Left-aligned bullet column
- **Zone Text**: Text content for each bullet

# Style Modifiers
- **Texture**: Clean, professional, presentation-ready
- **Lighting**: Even, document-style clarity
- **Palette**: Minimal colors, high contrast text

# Negative Constraints
- **Avoid**: Crowded text, inconsistent spacing, hard to scan
`.trim()

// 8. ICONS - Icon-Led List
export const LISTA_ICONOS_PROMPT = `
# Composition Type
Icon-Led Visual List

# Visual Hierarchy
- **Primary**: Large, expressive icons representing each list item
- **Secondary**: Brief text labels beside or below each icon
- **Tertiary**: Consistent icon style creating visual unity

# Zoning Guide
- **Zone Icons**: Prominent icon display (horizontal or vertical)
- **Zone Labels**: Text identifiers for each icon
- **Zone Header**: Title or category at top

# Style Modifiers
- **Texture**: Bold iconography, visual shorthand
- **Lighting**: Clean, flat icon rendering
- **Palette**: Colorful icons or monochrome with brand accent

# Negative Constraints
- **Avoid**: Text-heavy, small icons, inconsistent icon styles
`.trim()

// 9. CAROUSEL - Swipeable Cards
export const LISTA_CAROUSEL_PROMPT = `
# Composition Type
Carousel Swipe Preview

# Visual Hierarchy
- **Primary**: Main card in focus with peeking cards on sides
- **Secondary**: Page indicator dots at bottom
- **Tertiary**: "Swipe" or slide count indicator

# Zoning Guide
- **Zone Main**: Central visible card (current item)
- **Zone Peek**: Partial edges of adjacent cards
- **Zone Nav**: Pagination dots or slide counter

# Style Modifiers
- **Texture**: Mobile-native, swipeable, Stories/carousel aesthetic
- **Lighting**: Spotlight on main, dimmed on sides
- **Palette**: Consistent card design, varying content

# Negative Constraints
- **Avoid**: Static single card, no carousel suggestion, equal visibility
`.trim()

// 10. NUMERADO - Number-Led List
export const LISTA_NUMERADO_PROMPT = `
# Composition Type
Bold Numbered List

# Visual Hierarchy
- **Primary**: Large circled or stylized numbers (1, 2, 3, 4, 5) as visual anchors
- **Secondary**: Item text aligned to each number
- **Tertiary**: Headline establishing what's being listed

# Zoning Guide
- **Zone Numbers**: Prominent number column or circles
- **Zone Items**: Text content for each numbered item
- **Zone Title**: Header explaining the list

# Style Modifiers
- **Texture**: Bold, magazine, listicle aesthetic
- **Lighting**: High contrast on numbers
- **Palette**: Brand colors on numbers, neutral on text

# Negative Constraints
- **Avoid**: Small numbers, lost hierarchy, buried ranking
`.trim()

// 11. PROS_CONS - Split Comparison
export const LISTA_PROS_CONS_PROMPT = `
# Composition Type
Pros and Cons Split List

# Visual Hierarchy
- **Primary**: Two-column split: green pros/benefits vs red cons/drawbacks
- **Secondary**: Checkmarks and X marks as visual indicators
- **Tertiary**: Central dividing line or "VS" element

# Zoning Guide
- **Zone Pros**: Left column with positive items (green/check)
- **Zone Cons**: Right column with negative items (red/X)
- **Zone Divider**: Central separator element

# Style Modifiers
- **Texture**: Decision-making, comparison chart aesthetic
- **Lighting**: Even across both columns
- **Palette**: Green for pros, red for cons, neutral divider

# Negative Constraints
- **Avoid**: Unbalanced columns, unclear which is positive/negative, missing icons
`.trim()

// 12. AGENDA - Schedule List
export const LISTA_AGENDA_PROMPT = `
# Composition Type
Daily Agenda Schedule

# Visual Hierarchy
- **Primary**: Time slots on the left (e.g., 09:00, 10:00)
- **Secondary**: Event details aligned with time slots
- **Tertiary**: Current time marker or active slot highlight

# Zoning Guide
- **Zone Time**: Column for time indicators
- **Zone Event**: Column for event descriptions and locations
- **Zone Current**: Visual indicator for "now" or next event

# Style Modifiers
- **Texture**: Calendar app, digital planner, organizational
- **Lighting**: Clean, functional, high legibility
- **Palette**: Professional neutrals, color-coded categories

# Negative Constraints
- **Avoid**: Cluttered text, unclear time alignment, missing hierarchy
`.trim()

export const LISTA_DESCRIPTION = 'Diseño para enumeraciones, rankings, tips y notas. 12 composiciones estructuradas.'

export const LISTA_LAYOUTS: LayoutOption[] = [
    {
        id: 'checklist',
        name: 'Checklist Interactivo',
        description: 'Lista de tareas con estados',
        svgIcon: 'List',
        textZone: 'left',
        promptInstruction: LISTA_CHECKLIST_PROMPT,
        structuralPrompt: LISTA_CHECKLIST_PROMPT
    },
    {
        id: 'ranking',
        name: 'Ranking Top',
        description: 'Liderazgo y ganadores',
        svgIcon: 'Trophy',
        textZone: 'center',
        promptInstruction: LISTA_RANKING_PROMPT,
        structuralPrompt: LISTA_RANKING_PROMPT
    },
    {
        id: 'pasos',
        name: 'Pasos a Seguir',
        description: 'Camino paso a paso',
        svgIcon: 'Footprints',
        textZone: 'center',
        promptInstruction: LISTA_PASOS_PROMPT,
        structuralPrompt: LISTA_PASOS_PROMPT
    },
    {
        id: 'rejilla',
        name: 'Colección Rejilla',
        description: 'Tarjetas organizadas',
        svgIcon: 'LayoutGrid',
        textZone: 'center',
        promptInstruction: LISTA_REJILLA_PROMPT,
        structuralPrompt: LISTA_REJILLA_PROMPT
    },
    {
        id: 'timeline',
        name: 'Línea Temporal',
        description: 'Eventos en el tiempo',
        svgIcon: 'History',
        textZone: 'left',
        promptInstruction: LISTA_TIMELINE_PROMPT,
        structuralPrompt: LISTA_TIMELINE_PROMPT
    },
    {
        id: 'nota',
        name: 'Nota a Mano',
        description: 'Estilo post-it personal',
        svgIcon: 'StickyNote',
        textZone: 'center',
        promptInstruction: LISTA_NOTA_PROMPT,
        structuralPrompt: LISTA_NOTA_PROMPT
    },
    {
        id: 'bullets',
        name: 'Puntos Clave',
        description: 'Lista limpia y clara',
        svgIcon: 'ListOrdered',
        textZone: 'left',
        promptInstruction: LISTA_BULLETS_PROMPT,
        structuralPrompt: LISTA_BULLETS_PROMPT
    },
    {
        id: 'iconos',
        name: 'Lista Visual',
        description: 'Iconos expresivos',
        svgIcon: 'Image',
        textZone: 'center',
        promptInstruction: LISTA_ICONOS_PROMPT,
        structuralPrompt: LISTA_ICONOS_PROMPT
    },
    {
        id: 'carousel',
        name: 'Carrusel Swipe',
        description: 'Tarjetas deslizables',
        svgIcon: 'GalleryHorizontal',
        textZone: 'center',
        promptInstruction: LISTA_CAROUSEL_PROMPT,
        structuralPrompt: LISTA_CAROUSEL_PROMPT
    },
    {
        id: 'numerado',
        name: 'Lista Numerada',
        description: 'Números grandes',
        svgIcon: 'ListOrdered',
        textZone: 'left',
        promptInstruction: LISTA_NUMERADO_PROMPT,
        structuralPrompt: LISTA_NUMERADO_PROMPT
    },
    {
        id: 'pros_cons',
        name: 'Pros y Contras',
        description: 'Comparativa positiva/negativa',
        svgIcon: 'Scale',
        textZone: 'center',
        promptInstruction: LISTA_PROS_CONS_PROMPT,
        structuralPrompt: LISTA_PROS_CONS_PROMPT
    },
    {
        id: 'agenda',
        name: 'Agenda Diaria',
        description: 'Horarios y eventos',
        svgIcon: 'Calendar',
        textZone: 'left',
        promptInstruction: LISTA_AGENDA_PROMPT,
        structuralPrompt: LISTA_AGENDA_PROMPT
    }
]

