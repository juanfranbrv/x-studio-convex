/**
 * BTS - Behind the Scenes (Proceso creativo)
 * Grupo: Conectar
 * 
 * Comparte el proceso auténtico detrás del trabajo.
 * Humaniza la marca mostrando el lado real de la creación.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const BTS_EXTENDED_DESCRIPTION = `
Comparte el proceso auténtico detrás del trabajo.
Humaniza la marca mostrando el lado real de la creación.
`.trim()

export const BTS_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'description',
        label: 'Descripción',
        placeholder: 'Ej: Preparando el nuevo lanzamiento',
        type: 'text',
        required: true,
        aiContext: 'What is being shown behind the scenes'
    },
    {
        id: 'context',
        label: 'Contexto',
        placeholder: 'Ej: En el estudio',
        type: 'text',
        required: false,
        aiContext: 'Setting or context for the behind the scenes'
    }
]

// 1. PROCESO - Work in Progress Macro
export const BTS_PROCESO_PROMPT = `
<structural_instruction>
    <composition_type>Work in Progress Close-up</composition_type>
    <visual_hierarchy>
        <primary>Macro shot of hands working or tools in action (pen, brush, keyboard)</primary>
        <secondary>The unfinished project visible in the frame</secondary>
        <tertiary>Depth of field blur hiding background clutter</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_focus>Tools and action at center</zone_focus>
        <zone_work>Visible in-progress project</zone_work>
        <zone_blur>Blurred background for focus</zone_blur>
    </zoning_guide>
    <style_modifiers>
        <texture>Raw, authentic, film grain</texture>
        <lighting>Task lamp lighting, warm and focused</lighting>
        <palette>Natural materials, unfinished surfaces, real colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Perfectly polished final product, staged stock photo feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. ESCRITORIO - Creative Workspace
export const BTS_ESCRITORIO_PROMPT = `
<structural_instruction>
    <composition_type>Creative Desk Layout</composition_type>
    <visual_hierarchy>
        <primary>Top-down or wide shot of messy creative desk</primary>
        <secondary>Scattered sketches, coffee cup, tools, references</secondary>
        <tertiary>Screen or notebook showing the main project</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_desk>Full desk surface as canvas</zone_desk>
        <zone_tools>Scattered creative tools and materials</zone_tools>
        <zone_project>Visible work in progress on screen/paper</zone_project>
    </zoning_guide>
    <style_modifiers>
        <texture>Knolling photography or organized chaos</texture>
        <lighting>Natural window light, warm ambiance</lighting>
        <palette>Wood, paper, coffee, ink - real workspace colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Empty clean desk, sterile office, fake mess</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. MOODBOARD - Inspiration Wall
export const BTS_MOODBOARD_PROMPT = `
<structural_instruction>
    <composition_type>Inspiration Wall Collage</composition_type>
    <visual_hierarchy>
        <primary>Wall covered in prints, sketches, and reference images</primary>
        <secondary>Tape, pushpins, color swatches as decorative elements</secondary>
        <tertiary>Hand pointing or adjusting a piece (optional)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_wall>Covered surface with mixed media</zone_wall>
        <zone_details>Tape, pins, notes visible</zone_details>
        <zone_interaction>Optional human interaction element</zone_interaction>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper collage, mixed media, physical materials</texture>
        <lighting>Gallery or studio track lighting</lighting>
        <palette>Eclectic mix reflecting the inspiration</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Digital screenshot, single image, Pinterest screenshot</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. BOCETO - Sketch vs Final
export const BTS_BOCETO_PROMPT = `
<structural_instruction>
    <composition_type>Sketch to Final Comparison</composition_type>
    <visual_hierarchy>
        <primary>Split screen comparison between stages</primary>
        <secondary>Left: Rough pencil sketch or wireframe</secondary>
        <tertiary>Right: Polished final render or result</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_sketch>Left side showing rough work</zone_sketch>
        <zone_final>Right side showing polished result</zone_final>
        <zone_divider>Vertical line, tear, or blend between</zone_divider>
    </zoning_guide>
    <style_modifiers>
        <texture>Graphite pencil vs glossy pixel perfect</texture>
        <lighting>Flat scan on sketch, 3D lighting on final</lighting>
        <palette>Black/white sketch vs full color final</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Bad alignment between halves, unclear evolution</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. EVOLUCIÓN - Before/After Progress
export const BTS_EVOLUCION_PROMPT = `
<structural_instruction>
    <composition_type>Project Evolution Timeline</composition_type>
    <visual_hierarchy>
        <primary>Two or more stages of the same project</primary>
        <secondary>Progress arrows or timeline connecting states</secondary>
        <tertiary>"Start" and "Now" or stage labels</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_before>Earlier stage of the work</zone_before>
        <zone_after>Current or final stage</zone_after>
        <zone_progress>Visual progress indicator</zone_progress>
    </zoning_guide>
    <style_modifiers>
        <texture>Process documentation, progress story</texture>
        <lighting>Consistent to show true change</lighting>
        <palette>Desaturated early vs saturated final</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Confusing timeline, random unrelated images</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. PALETA - Color Extraction
export const BTS_PALETA_PROMPT = `
<structural_instruction>
    <composition_type>Color Palette Extraction</composition_type>
    <visual_hierarchy>
        <primary>Beautiful source photo or design as base</primary>
        <secondary>Row of 5 color swatches extracted from the image</secondary>
        <tertiary>Hex codes or color names as labels</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_source>Main visual from which colors are extracted</zone_source>
        <zone_swatches>Floating color cards or bar</zone_swatches>
        <zone_codes>Color identification text</zone_codes>
    </zoning_guide>
    <style_modifiers>
        <texture>Design tool UI overlay aesthetic</texture>
        <lighting>Clean, color-accurate presentation</lighting>
        <palette>Harmonious matching extracted colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Clashing colors, tiny swatches, missing source connection</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. EQUIPO - Team at Work
export const BTS_EQUIPO_PROMPT = `
<structural_instruction>
    <composition_type>Team Collaboration Candid</composition_type>
    <visual_hierarchy>
        <primary>Team members collaborating, brainstorming, or creating together</primary>
        <secondary>Work environment and tools visible in frame</secondary>
        <tertiary>Subtle text overlay with team/project context</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_people>Team interaction as main focus</zone_people>
        <zone_environment>Authentic workspace setting</zone_environment>
        <zone_context>Optional text or caption area</zone_context>
    </zoning_guide>
    <style_modifiers>
        <texture>Candid documentary, real moments</texture>
        <lighting>Natural office or studio lighting</lighting>
        <palette>True-to-life workplace colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Posed stock photos, empty offices, solo focus</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. HERRAMIENTAS - Tools of the Trade
export const BTS_HERRAMIENTAS_PROMPT = `
<structural_instruction>
    <composition_type>Tools Flat Lay</composition_type>
    <visual_hierarchy>
        <primary>Top-down arrangement of professional tools/equipment</primary>
        <secondary>Knolling style organization on clean surface</secondary>
        <tertiary>Logo or handle badge visible on featured tool</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_main>Central featured tool or kit</zone_main>
        <zone_supporting>Surrounding accessories and items</zone_supporting>
        <zone_surface>Clean background surface</zone_surface>
    </zoning_guide>
    <style_modifiers>
        <texture>Product photography, knolling aesthetic</texture>
        <lighting>Even overhead softbox lighting</lighting>
        <palette>Tool colors against neutral background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy random arrangement, dirty tools, unclear items</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. ESTUDIO - Studio Space
export const BTS_ESTUDIO_PROMPT = `
<structural_instruction>
    <composition_type>Studio Environment Shot</composition_type>
    <visual_hierarchy>
        <primary>Wide shot of the creative studio or workspace</primary>
        <secondary>Equipment, materials, and ongoing projects visible</secondary>
        <tertiary>Brand elements or signage in the space</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_space>Full studio environment</zone_space>
        <zone_work>Active work areas and projects</zone_work>
        <zone_identity>Brand presence in the space</zone_identity>
    </zoning_guide>
    <style_modifiers>
        <texture>Architectural photography, interior design</texture>
        <lighting>Natural and artificial studio mix</lighting>
        <palette>True studio colors with brand accents</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cramped closet, purely residential, no creative feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. MAKING_OF - Production Shot
export const BTS_MAKING_OF_PROMPT = `
<structural_instruction>
    <composition_type>Making-Of Production Shot</composition_type>
    <visual_hierarchy>
        <primary>The production setup visible (camera, lights, set)</primary>
        <secondary>The subject being photographed/filmed in context</secondary>
        <tertiary>Crew or equipment silhouettes adding scale</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_set>The scene/subject being captured</zone_set>
        <zone_equipment>Visible production gear</zone_equipment>
        <zone_crew>Human element working the equipment</zone_crew>
    </zoning_guide>
    <style_modifiers>
        <texture>Behind the camera, production documentary</texture>
        <lighting>Mixed: set lighting visible plus practical</lighting>
        <palette>Darker production tones with set lighting contrast</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Only final result, hidden process, no equipment visible</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. DETALLE - Macro Detail Focus
export const BTS_DETALLE_PROMPT = `
<structural_instruction>
    <composition_type>Extreme Detail Macro</composition_type>
    <visual_hierarchy>
        <primary>Extreme close-up of texture, material, or craftsmanship</primary>
        <secondary>Context clues about what the detail belongs to</secondary>
        <tertiary>Subtle brand watermark or caption</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_macro>Extreme detail filling frame</zone_macro>
        <zone_context>Hints of the larger object</zone_context>
        <zone_brand>Minimal brand presence</zone_brand>
    </zoning_guide>
    <style_modifiers>
        <texture>Macro photography, material exploration</texture>
        <lighting>Raking light to reveal texture</lighting>
        <palette>Natural material colors in detail</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Full product shots, unclear detail, blurry focus</avoid>
    </negative_constraints>
</structural_instruction>
`

export const BTS_DESCRIPTION = 'Behind-the-scenes y proceso creativo. 11 composiciones para mostrar el lado auténtico.'
