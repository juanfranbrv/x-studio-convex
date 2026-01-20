/**
 * PASOS - El Tutorial (How-to, recetas, instrucciones)
 * Grupo: Educar
 * 
 * Diseño para tutoriales, guías paso a paso, recetas e instrucciones.
 * Desglosa procesos complejos en pasos fáciles de seguir.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const PASOS_EXTENDED_DESCRIPTION = `
Para tutoriales, guías paso a paso, recetas e instrucciones.
Desglosa procesos complejos en pasos fáciles de seguir.
`.trim()

export const PASOS_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'title',
        label: 'Título del Tutorial',
        placeholder: 'Ej: Cómo preparar un café perfecto',
        type: 'text',
        required: true,
        aiContext: 'Title of the how-to guide'
    },
    {
        id: 'steps',
        label: 'Número de Pasos',
        placeholder: 'Ej: 5',
        type: 'text',
        required: false,
        aiContext: 'Number of steps in the process'
    },
    {
        id: 'duration',
        label: 'Duración (opcional)',
        placeholder: 'Ej: 10 minutos',
        type: 'text',
        required: false,
        aiContext: 'Time required to complete'
    }
]

// 1. ZIGZAG - Winding Path
export const PASOS_ZIGZAG_PROMPT = `
<structural_instruction>
    <composition_type>Winding Zig-Zag Path</composition_type>
    <visual_hierarchy>
        <primary>S-shaped winding path connecting 3-4 distinct step points</primary>
        <secondary>Large numbers (1, 2, 3) at each turn of the path</secondary>
        <tertiary>Icons or small visuals at each step waypoint</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_path>S-curve or winding road connecting steps</zone_path>
        <zone_numbers>Large numerals at path junctions</zone_numbers>
        <zone_icons>Visual representations at each stop</zone_icons>
    </zoning_guide>
    <style_modifiers>
        <texture>Game map, board game, flat vector style</texture>
        <lighting>Top-down uniform, no shadows</lighting>
        <palette>Bright, playful, high contrast path against background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Tangled confusing lines, unreadable small text, lost direction</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. TARJETAS - Step Cards Carousel
export const PASOS_TARJETAS_PROMPT = `
<structural_instruction>
    <composition_type>Horizontal Step Cards</composition_type>
    <visual_hierarchy>
        <primary>Horizontal row of floating card UI elements</primary>
        <secondary>Each card shows step number and simple icon/image</secondary>
        <tertiary>Arrow indicators or connectors between cards</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_cards>Horizontal sequence of step cards</zone_cards>
        <zone_arrows>Flow indicators between cards</zone_arrows>
        <zone_progress>Optional progress bar or dots at bottom</zone_progress>
    </zoning_guide>
    <style_modifiers>
        <texture>Glassmorphism, material design, floating cards</texture>
        <lighting>Soft shadows, elevated card feel</lighting>
        <palette>White/light cards on colored background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cramped cards, missing flow indicators, vertical lists</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. DIVIDIDO - Split Image + List
export const PASOS_DIVIDIDO_PROMPT = `
<structural_instruction>
    <composition_type>Split Visual Guide</composition_type>
    <visual_hierarchy>
        <primary>Large hero image of the finished result (left or top 50%)</primary>
        <secondary>Numbered checklist of steps (right or bottom 50%)</secondary>
        <tertiary>"How To..." title bridging both sections</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_result>Hero image showing end result</zone_result>
        <zone_steps>Numbered step list in clean format</zone_steps>
        <zone_title>Title spanning or bridging sections</zone_title>
    </zoning_guide>
    <style_modifiers>
        <texture>Editorial lifestyle photography + clean typography</texture>
        <lighting>Natural light for aspirational result image</lighting>
        <palette>Neutral text area, vibrant result photo</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Text over busy photo, tiny unreadable steps, imbalanced split</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. FLOTANTE - 3D Floating Numbers
export const PASOS_FLOTANTE_PROMPT = `
<structural_instruction>
    <composition_type>3D Floating Step Numbers</composition_type>
    <visual_hierarchy>
        <primary>Giant 3D rendered numbers (1, 2, 3) floating in space</primary>
        <secondary>Small props or objects associated with each number</secondary>
        <tertiary>Connecting lines or arrows showing progression</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_numbers>3D numbers arranged in spatial depth</zone_numbers>
        <zone_props>Objects near each number representing the step</zone_props>
        <zone_connections>Visual flow between numbers</zone_connections>
    </zoning_guide>
    <style_modifiers>
        <texture>Plastic, matte clay, or metallic 3D rendering</texture>
        <lighting>Studio softbox lighting, ambient occlusion</lighting>
        <palette>Pastel 3D aesthetics, soft gradients</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat 2D text, boring list format, no depth</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. PLANO - Technical Blueprint
export const PASOS_PLANO_PROMPT = `
<structural_instruction>
    <composition_type>Technical Blueprint Schematic</composition_type>
    <visual_hierarchy>
        <primary>Technical line drawing or exploded view diagram</primary>
        <secondary>Annotations with leader lines pointing to parts/steps</secondary>
        <tertiary>Grid background suggesting precision</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_diagram>Central technical drawing</zone_diagram>
        <zone_annotations>Labels and callouts around edges</zone_annotations>
        <zone_grid>Background grid pattern</zone_grid>
    </zoning_guide>
    <style_modifiers>
        <texture>Blueprint paper, CAD style, technical illustration</texture>
        <lighting>Flat, no shadows, pure diagram</lighting>
        <palette>Blue and white (classic blueprint) or black and white</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Photorealistic elements, organic shapes, casual feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. VERTICAL - Timeline Progression
export const PASOS_VERTICAL_PROMPT = `
<structural_instruction>
    <composition_type>Vertical Phase Timeline</composition_type>
    <visual_hierarchy>
        <primary>Vertical line connecting circular nodes</primary>
        <secondary>Step title and icon at each node</secondary>
        <tertiary>Gradient background indicating progression from start to finish</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_line>Central vertical axis spine</zone_line>
        <zone_nodes>Step markers along the line</zone_nodes>
        <zone_content>Alternating content blocks left/right of line</zone_content>
    </zoning_guide>
    <style_modifiers>
        <texture>Infographic, clean vector, progression visualization</texture>
        <lighting>Subtle gradients, soft progression</lighting>
        <palette>Progressive color gradient (e.g., light to dark, cool to warm)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Horizontal confusion, disconnected elements, unclear flow</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. RECETA - Recipe Format
export const PASOS_RECETA_PROMPT = `
<structural_instruction>
    <composition_type>Recipe Card Format</composition_type>
    <visual_hierarchy>
        <primary>Appetizing hero photo of finished dish</primary>
        <secondary>Ingredient list and step-by-step instructions</secondary>
        <tertiary>Time, servings, and difficulty indicators</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hero>Mouth-watering food photography</zone_hero>
        <zone_ingredients>Bulleted ingredient list</zone_ingredients>
        <zone_steps>Numbered instruction steps</zone_steps>
        <zone_meta>Time/servings/difficulty badges</zone_meta>
    </zoning_guide>
    <style_modifiers>
        <texture>Cookbook, food blog, rustic kitchen aesthetic</texture>
        <lighting>Natural food photography lighting</lighting>
        <palette>Warm appetizing colors, cookbook whites</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unappetizing photos, cramped text, missing hero image</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. BEFORE_AFTER - Transformation
export const PASOS_ANTES_DESPUES_PROMPT = `
<structural_instruction>
    <composition_type>Before/After Transformation</composition_type>
    <visual_hierarchy>
        <primary>Split showing BEFORE state and AFTER result</primary>
        <secondary>Arrow or process indicator between states</secondary>
        <tertiary>Step count or "X Easy Steps" label</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_before>Left/top showing initial state</zone_before>
        <zone_after>Right/bottom showing result</zone_after>
        <zone_process>Arrow or transformation indicator between</zone_process>
    </zoning_guide>
    <style_modifiers>
        <texture>Makeover, transformation, dramatic reveal</texture>
        <lighting>Similar lighting in both for fair comparison</lighting>
        <palette>Muted before, vibrant after to emphasize improvement</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear comparison, reversed order, no transformation visible</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. CÍRCULOS - Circular Steps
export const PASOS_CIRCULOS_PROMPT = `
<structural_instruction>
    <composition_type>Circular Step Diagram</composition_type>
    <visual_hierarchy>
        <primary>Steps arranged in a circle or cycle formation</primary>
        <secondary>Arrows connecting each step to the next</secondary>
        <tertiary>Central hub with process name or goal</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_ring>Circular arrangement of step nodes</zone_ring>
        <zone_arrows>Clockwise flow indicators</zone_arrows>
        <zone_center>Process title or goal in the middle</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Cycle diagram, process wheel, infographic</texture>
        <lighting>Even, balanced across all steps</lighting>
        <palette>Gradient around the wheel or consistent step colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Linear layout, unclear cycle, crowded center</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. MANOS - Hand Demonstration
export const PASOS_MANOS_PROMPT = `
<structural_instruction>
    <composition_type>Hands-On Demonstration</composition_type>
    <visual_hierarchy>
        <primary>Hands performing the action as visual focus</primary>
        <secondary>Step number overlaid or beside each action shot</secondary>
        <tertiary>Brief text instructions accompanying each image</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hands>Close-up hands performing each step</zone_hands>
        <zone_numbers>Step indicators with each action</zone_numbers>
        <zone_text>Brief instruction labels</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Tutorial video screenshot, craft demonstration</texture>
        <lighting>Overhead craft table lighting</lighting>
        <palette>Natural tones, focus on the work/materials</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Abstract graphics, no human element, unclear actions</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. RÁPIDO - Quick Tips Format
export const PASOS_RAPIDO_PROMPT = `
<structural_instruction>
    <composition_type>Quick Tips Condensed Format</composition_type>
    <visual_hierarchy>
        <primary>Bold numbers or icons for 3-5 quick tips</primary>
        <secondary>One-line summaries for each tip</secondary>
        <tertiary>"Quick Guide" or time-saving indicator at top</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>Quick guide title with time/effort badge</zone_header>
        <zone_tips>Compact grid or list of essential tips</zone_tips>
        <zone_cta>Action prompt at bottom</zone_cta>
    </zoning_guide>
    <style_modifiers>
        <texture>Cheat sheet, quick reference, pocket guide</texture>
        <lighting>Clean, easy-scan clarity</lighting>
        <palette>High contrast for rapid scanning</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Long detailed steps, overwhelming information, slow reading</avoid>
    </negative_constraints>
</structural_instruction>
`

export const PASOS_DESCRIPTION = 'Diseño para tutoriales, guías y procesos paso a paso. 11 composiciones instructivas.'
