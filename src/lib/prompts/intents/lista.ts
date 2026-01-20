/**
 * LISTA - La Lista (Tips y enumeraciones)
 * Grupo: Informar
 * 
 * Diseño estructurado para enumeraciones, check-lists o rankings.
 * Facilita la lectura rápida de varios puntos.
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

// 1. CHECKLIST - Productivity UI
export const LISTA_CHECKLIST_PROMPT = `
<structural_instruction>
    <composition_type>Interactive Checklist UI</composition_type>
    <visual_hierarchy>
        <primary>Vertical stack of items with checkbox icons (circles/squares) on left</primary>
        <secondary>Mixed check states showing progress (some checked, some pending)</secondary>
        <tertiary>Motivational header title at top</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>Title and context at top</zone_header>
        <zone_list>Vertical stack of checklist items</zone_list>
        <zone_progress>Optional progress indicator at bottom</zone_progress>
    </zoning_guide>
    <style_modifiers>
        <texture>Productivity app, task manager aesthetic</texture>
        <lighting>Clean UI lighting, no drama</lighting>
        <palette>Clean whites, greens for completion, brand accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cramped items, inconsistent spacing, unclear states</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. RANKING - Leaderboard
export const LISTA_RANKING_PROMPT = `
<structural_instruction>
    <composition_type>Top Ranking Leaderboard</composition_type>
    <visual_hierarchy>
        <primary>#1 item large and highlighted with crown/gold treatment</primary>
        <secondary>#2-#5 items progressively smaller below</secondary>
        <tertiary>Prominent rank numbers (1, 2, 3) as visual anchors</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_winner>Top/center for #1 with maximum emphasis</zone_winner>
        <zone_runner_ups>Stacked list for remaining ranks</zone_runner_ups>
        <zone_badges>Medal or ranking badge indicators</zone_badges>
    </zoning_guide>
    <style_modifiers>
        <texture>Leaderboard, competition, trophy shelf aesthetic</texture>
        <lighting>Spotlight on #1, progressive dimming below</lighting>
        <palette>Gold #1, Silver #2, Bronze #3, then neutral</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Equal sizing for all ranks, buried winner, no hierarchy</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. PASOS - Step by Step Path
export const LISTA_PASOS_PROMPT = `
<structural_instruction>
    <composition_type>Step-by-Step Journey Path</composition_type>
    <visual_hierarchy>
        <primary>Winding path or connected line between numbered steps</primary>
        <secondary>Numbered nodes (1 → 2 → 3) along the path</secondary>
        <tertiary>Icons or brief text at each waypoint</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_path>Visual journey line connecting all steps</zone_path>
        <zone_nodes>Step markers at each junction</zone_nodes>
        <zone_labels>Brief text or icons at each step</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Roadmap, journey map, game board aesthetic</texture>
        <lighting>Clear, instructional clarity</lighting>
        <palette>Progressive color scheme along the path</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear direction, disconnected steps, crowded text</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. REJILLA - Grid Collection
export const LISTA_REJILLA_PROMPT = `
<structural_instruction>
    <composition_type>Grid Card Collection</composition_type>
    <visual_hierarchy>
        <primary>2x2 or 2x3 grid of uniform cards</primary>
        <secondary>Each card contains icon/image and short text key</secondary>
        <tertiary>Consistent shape repetition creating visual rhythm</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Evenly distributed card matrix</zone_grid>
        <zone_cards>Individual cells with icon + text</zone_cards>
        <zone_header>Optional title spanning the grid top</zone_header>
    </zoning_guide>
    <style_modifiers>
        <texture>Collection catalog, resource library aesthetic</texture>
        <lighting>Even, consistent across all cards</lighting>
        <palette>Unified color system across all cards</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Inconsistent card sizes, broken grid, varying styles</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. TIMELINE - Vertical History
export const LISTA_TIMELINE_PROMPT = `
<structural_instruction>
    <composition_type>Vertical Timeline</composition_type>
    <visual_hierarchy>
        <primary>Central or left-aligned vertical line spine</primary>
        <secondary>Nodes/dots on the line for each event or item</secondary>
        <tertiary>Text blocks alternating or aligned to one side</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_spine>Vertical timeline line</zone_spine>
        <zone_nodes>Event markers along the spine</zone_nodes>
        <zone_content>Text blocks at each node</zone_content>
    </zoning_guide>
    <style_modifiers>
        <texture>History, schedule, progression visualization</texture>
        <lighting>Clean, chronological clarity</lighting>
        <palette>Progressive colors or consistent themed palette</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Confusing chronology, disconnected nodes, crowded labels</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. NOTA - Handwritten Note
export const LISTA_NOTA_PROMPT = `
<structural_instruction>
    <composition_type>Handwritten Note Style</composition_type>
    <visual_hierarchy>
        <primary>Paper texture background with notebook lines or sticky note shape</primary>
        <secondary>Handwritten-style list with organic alignment</secondary>
        <tertiary>Doodles, arrows, or underlines as personal touches</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_paper>Textured paper or sticky note surface</zone_paper>
        <zone_list>Items in list form with handwritten feel</zone_list>
        <zone_doodles>Organic arrows, circles, underlines</zone_doodles>
    </zoning_guide>
    <style_modifiers>
        <texture>Handdrawn, organic, personal, sketch feel</texture>
        <lighting>Soft, paper-like, natural</lighting>
        <palette>Paper tones, pen/marker colors (blue, black, red)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Digital perfection, clinical alignment, cold typography</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. BULLETS - Clean Bullet Points
export const LISTA_BULLETS_PROMPT = `
<structural_instruction>
    <composition_type>Clean Bullet Point List</composition_type>
    <visual_hierarchy>
        <primary>Clear bullet markers (dots, dashes, or icons) preceding each item</primary>
        <secondary>Well-spaced text entries in readable hierarchy</secondary>
        <tertiary>Headline title establishing the list topic</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_title>Header or headline at top</zone_title>
        <zone_bullets>Left-aligned bullet column</zone_bullets>
        <zone_text>Text content for each bullet</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean, professional, presentation-ready</texture>
        <lighting>Even, document-style clarity</lighting>
        <palette>Minimal colors, high contrast text</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Crowded text, inconsistent spacing, hard to scan</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. ICONS - Icon-Led List
export const LISTA_ICONOS_PROMPT = `
<structural_instruction>
    <composition_type>Icon-Led Visual List</composition_type>
    <visual_hierarchy>
        <primary>Large, expressive icons representing each list item</primary>
        <secondary>Brief text labels beside or below each icon</secondary>
        <tertiary>Consistent icon style creating visual unity</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_icons>Prominent icon display (horizontal or vertical)</zone_icons>
        <zone_labels>Text identifiers for each icon</zone_labels>
        <zone_header>Title or category at top</zone_header>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold iconography, visual shorthand</texture>
        <lighting>Clean, flat icon rendering</lighting>
        <palette>Colorful icons or monochrome with brand accent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Text-heavy, small icons, inconsistent icon styles</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. CAROUSEL - Swipeable Cards
export const LISTA_CAROUSEL_PROMPT = `
<structural_instruction>
    <composition_type>Carousel Swipe Preview</composition_type>
    <visual_hierarchy>
        <primary>Main card in focus with peeking cards on sides</primary>
        <secondary>Page indicator dots at bottom</secondary>
        <tertiary>"Swipe" or slide count indicator</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_main>Central visible card (current item)</zone_main>
        <zone_peek>Partial edges of adjacent cards</zone_peek>
        <zone_nav>Pagination dots or slide counter</zone_nav>
    </zoning_guide>
    <style_modifiers>
        <texture>Mobile-native, swipeable, Stories/carousel aesthetic</texture>
        <lighting>Spotlight on main, dimmed on sides</lighting>
        <palette>Consistent card design, varying content</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static single card, no carousel suggestion, equal visibility</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. NUMERADO - Number-Led List
export const LISTA_NUMERADO_PROMPT = `
<structural_instruction>
    <composition_type>Bold Numbered List</composition_type>
    <visual_hierarchy>
        <primary>Large circled or stylized numbers (1, 2, 3, 4, 5) as visual anchors</primary>
        <secondary>Item text aligned to each number</secondary>
        <tertiary>Headline establishing what's being listed</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_numbers>Prominent number column or circles</zone_numbers>
        <zone_items>Text content for each numbered item</zone_items>
        <zone_title>Header explaining the list</zone_title>
    </zoning_guide>
    <style_modifiers>
        <texture>Bold, magazine, listicle aesthetic</texture>
        <lighting>High contrast on numbers</lighting>
        <palette>Brand colors on numbers, neutral on text</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small numbers, lost hierarchy, buried ranking</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. PROS_CONS - Split Comparison
export const LISTA_PROS_CONS_PROMPT = `
<structural_instruction>
    <composition_type>Pros and Cons Split List</composition_type>
    <visual_hierarchy>
        <primary>Two-column split: green pros/benefits vs red cons/drawbacks</primary>
        <secondary>Checkmarks and X marks as visual indicators</secondary>
        <tertiary>Central dividing line or "VS" element</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_pros>Left column with positive items (green/check)</zone_pros>
        <zone_cons>Right column with negative items (red/X)</zone_cons>
        <zone_divider>Central separator element</zone_divider>
    </zoning_guide>
    <style_modifiers>
        <texture>Decision-making, comparison chart aesthetic</texture>
        <lighting>Even across both columns</lighting>
        <palette>Green for pros, red for cons, neutral divider</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unbalanced columns, unclear which is positive/negative, missing icons</avoid>
    </negative_constraints>
</structural_instruction>
`

export const LISTA_DESCRIPTION = 'Diseño para enumeraciones, rankings, tips y notas. 11 composiciones estructuradas.'
