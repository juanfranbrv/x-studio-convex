/**
 * LISTA - La Lista (Tips y enumeraciones)
 * Grupo: Informar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

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

export const LISTA_CHECKLIST_PROMPT = `
COMPOSITION: Interactive checklist UI.
ZONING:
- List: Vertical stack of items with checkbox icons (circles/squares) on left.
- State: Some checked, some unchecked (to show progress).
- Header: Motivation title.
STYLE: Productivity app, clean UI.
TYPOGRAPHY: Sans-serif legibility.
`.trim()

export const LISTA_RANKING_PROMPT = `
COMPOSITION: Top ranking leaderboard.
ZONING:
- Hero: #1 item large and highlighted (gold/crown).
- List: #2 to #5 smaller below.
- Badges: Rank numbers (1, 2, 3) prominent.
STYLE: Leaderboard, competition, premium.
TYPOGRAPHY: Impact numbers.
`.trim()

export const LISTA_STEPS_PROMPT = `
COMPOSITION: Methodical step-by-step guide.
ZONING:
- Path: Winding path or connected line between steps.
- Steps: Numbered nodes (1 -> 2 -> 3).
- Direction: Clear visual flow.
STYLE: Roadmap, journey map.
TYPOGRAPHY: Instructional.
`.trim()

export const LISTA_GRID_KEY_PROMPT = `
COMPOSITION: Masonry or Grid collection.
ZONING:
- Grid: 2x2 or 2x3 cards.
- Content: Each card has an icon/image and short text key.
- Uniformity: Consistent shape repetition.
STYLE: Collection, catalog, resource library.
TYPOGRAPHY: Label priority.
`.trim()

export const LISTA_TIMELINE_PROMPT = `
COMPOSITION: Vertical timeline.
ZONING:
- Line: Central or left-aligned vertical line.
- Nodes: Dots on the line for each event/item.
- Text: Alternating left/right or aligned to one side.
STYLE: History, schedule.
`.trim()

export const LISTA_NOTE_PROMPT = `
COMPOSITION: Handwritten note or sticky note style.
ZONING:
- Background: Paper texture, notebook lines, or sticky note shape.
- Text: Handwritten-style alignment (slightly imperfect).
- Doodles: Organic arrows or underlines.
STYLE: Personal, organic, helpful.
TYPOGRAPHY: Handwritten script vibe.
`.trim()

export const LISTA_DESCRIPTION = 'Diseño para enumeraciones, rankings, pasos a seguir o notas.'
