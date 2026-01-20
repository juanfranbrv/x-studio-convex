/**
 * COMPARATIVA - La Comparativa (Antes/Después o Vs)
 * Grupo: Informar
 * 
 * Diseño partido para enfrentar dos conceptos: Antes/Después, 
 * Mito/Realidad o Producto A/B.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const COMPARATIVA_EXTENDED_DESCRIPTION = `
Diseño partido (split screen) para enfrentar dos conceptos: Antes/Después, 
Mito/Realidad o Producto A/B. Muy efectivo para educar o mostrar resultados 
tangibles.
`.trim()

export const COMPARATIVA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'item_a',
        label: 'Elemento A',
        placeholder: 'Ej: Antes',
        type: 'text',
        required: true,
        aiContext: 'First item of comparison/Left side'
    },
    {
        id: 'item_b',
        label: 'Elemento B',
        placeholder: 'Ej: Después',
        type: 'text',
        required: true,
        aiContext: 'Second item of comparison/Right side'
    },
    {
        id: 'topic',
        label: 'Tema',
        placeholder: 'Ej: Resultados del tratamiento',
        type: 'text',
        required: false,
        aiContext: 'Subject of the comparison'
    }
]

// 1. DIVIDIDO - Classic Vertical Split
export const COMPARATIVA_DIVIDIDO_PROMPT = `
<structural_instruction>
    <composition_type>Classic Vertical Split Screen</composition_type>
    <visual_hierarchy>
        <primary>50/50 vertical split between two states or options</primary>
        <secondary>Distinct visual separator line down the center</secondary>
        <tertiary>Minimal labels ("Before"/"After") at top of each side</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>50% "Before" or "Problem" state (can be desaturated)</zone_left>
        <zone_right>50% "After" or "Solution" state (vibrant, resolved)</zone_right>
        <zone_divider>Clear vertical separator line</zone_divider>
    </zoning_guide>
    <style_modifiers>
        <texture>High contrast between the two states</texture>
        <lighting>Different mood lighting per side to emphasize change</lighting>
        <palette>Desaturated vs vibrant, chaos vs order</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear division, similar appearance on both sides</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. VERSUS - Battle Layout
export const COMPARATIVA_VERSUS_PROMPT = `
<structural_instruction>
    <composition_type>Aggressive Versus Battle</composition_type>
    <visual_hierarchy>
        <primary>Dynamic diagonal split separating two contenders</primary>
        <secondary>Large "VS" badge or lightning bolt at center intersection</secondary>
        <tertiary>Contender names or labels on each side</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>Contender A with one color theme (cool tones)</zone_left>
        <zone_right>Contender B with opposing color (warm tones)</zone_right>
        <zone_center>Explosive "VS" typography element</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Sports, gaming, high energy competition</texture>
        <lighting>Clashing colored rim lights (Blue vs Red)</lighting>
        <palette>High contrast complementary colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Peaceful static layout, monochrome, equal treatment</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. TRANSFORMACIÓN - Before/After Hero
export const COMPARATIVA_TRANSFORMACION_PROMPT = `
<structural_instruction>
    <composition_type>Transformation Showcase</composition_type>
    <visual_hierarchy>
        <primary>Large "After" result image as main hero</primary>
        <secondary>Small "Before" snapshot inset in corner with frame</secondary>
        <tertiary>Curved arrow pointing from before to after</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_main>Full canvas showing impressive result</zone_main>
        <zone_inset>Small corner showing starting point</zone_inset>
        <zone_arrow>Visual connector between states</zone_arrow>
    </zoning_guide>
    <style_modifiers>
        <texture>Testimonial, proof-of-concept, realistic results</texture>
        <lighting>Professional lighting on the result</lighting>
        <palette>Aspirational, impressive, achievement-focused</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Equal sizing, no clear improvement visible</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. CHECKLIST - Feature Grid
export const COMPARATIVA_CHECKLIST_PROMPT = `
<structural_instruction>
    <composition_type>Side-by-Side Feature Comparison</composition_type>
    <visual_hierarchy>
        <primary>Two columns: Option A vs Option B</primary>
        <secondary>Rows with checkmarks (green) vs X marks (red) per feature</secondary>
        <tertiary>Product/option names as headers</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_headers>Option headers at top of each column</zone_headers>
        <zone_features>Feature rows spanning both columns</zone_features>
        <zone_marks>Check/X indicators in each cell</zone_marks>
    </zoning_guide>
    <style_modifiers>
        <texture>Review site, comparison table, informational</texture>
        <lighting>Even, readable, no drama</lighting>
        <palette>Green for yes, red for no, neutral base</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Ambiguous marks, unclear winner, crowded rows</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. SLIDER - Interactive Reveal
export const COMPARATIVA_SLIDER_PROMPT = `
<structural_instruction>
    <composition_type>Interactive Slider Comparison</composition_type>
    <visual_hierarchy>
        <primary>Full-width image split in the middle</primary>
        <secondary>Slider handle graphic suggesting drag interaction</secondary>
        <tertiary>Two states of the same subject blending at slider</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>One state visible on left of slider</zone_left>
        <zone_right>Alternate state visible on right of slider</zone_right>
        <zone_handle>Draggable slider indicator at center</zone_handle>
    </zoning_guide>
    <style_modifiers>
        <texture>UI/UX demo, interactive feel, app interface</texture>
        <lighting>Consistent across both sides for fair comparison</lighting>
        <palette>Same subject, different treatments</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static non-interactive feel, missing slider UI element</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. EVOLUCIÓN - Timeline Progress
export const COMPARATIVA_EVOLUCION_PROMPT = `
<structural_instruction>
    <composition_type>Evolution Timeline</composition_type>
    <visual_hierarchy>
        <primary>Horizontal progression from old to new (left to right)</primary>
        <secondary>Connecting arrow or timeline bar running through</secondary>
        <tertiary>Year labels or version numbers at each stage</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_start>Old/original version on left</zone_start>
        <zone_middle>Transition states (optional)</zone_middle>
        <zone_end>New/current version on right</zone_end>
    </zoning_guide>
    <style_modifiers>
        <texture>Growth story, history, progress documentation</texture>
        <lighting>Consistent across timeline for fair comparison</lighting>
        <palette>Progressive improvement in quality/vibrancy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear timeline direction, random ordering</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. MITO_REALIDAD - Myth vs Reality
export const COMPARATIVA_MITO_PROMPT = `
<structural_instruction>
    <composition_type>Myth vs Reality Debunk</composition_type>
    <visual_hierarchy>
        <primary>Split showing "MYTH" crossed out vs "REALITY" highlighted</primary>
        <secondary>X mark over myth, checkmark on reality</secondary>
        <tertiary>Brief text explaining each side</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_myth>Left/top with red X and struck-through text</zone_myth>
        <zone_reality>Right/bottom with green check and validated text</zone_reality>
        <zone_education>Brief explanatory text for each</zone_education>
    </zoning_guide>
    <style_modifiers>
        <texture>Educational, fact-checking, debunking aesthetic</texture>
        <lighting>Dramatic contrast between wrong and right</lighting>
        <palette>Red for myth (wrong), green for reality (correct)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear which is correct, missing verdict indicators</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. EXPECTATIVA - Expectation vs Reality
export const COMPARATIVA_EXPECTATIVA_PROMPT = `
<structural_instruction>
    <composition_type>Expectation vs Reality Humor</composition_type>
    <visual_hierarchy>
        <primary>Split showing idealized "Expectation" vs honest "Reality"</primary>
        <secondary>"What I imagined" vs "What happened" labels</secondary>
        <tertiary>Humorous contrast between the two states</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_expectation>Polished, perfect, idealized vision</zone_expectation>
        <zone_reality>Honest, funny, real-life outcome</zone_reality>
        <zone_labels>Clear labels for each side</zone_labels>
    </zoning_guide>
    <style_modifiers>
        <texture>Meme format, relatable humor, social media native</texture>
        <lighting>Perfect lighting on expectation, real on reality</lighting>
        <palette>Dreamy for expectation, realistic for reality</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Both looking similar, missing humor, unclear contrast</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. PRECIO - Price Comparison
export const COMPARATIVA_PRECIO_PROMPT = `
<structural_instruction>
    <composition_type>Price Tier Comparison</composition_type>
    <visual_hierarchy>
        <primary>2-3 pricing columns/cards showing different tiers</primary>
        <secondary>Feature lists in each tier</secondary>
        <tertiary>Highlighted "Best Value" or recommended option</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_basic>Entry-level tier with basic features</zone_basic>
        <zone_recommended>Middle or premium tier highlighted</zone_recommended>
        <zone_premium>Top tier with all features</zone_premium>
    </zoning_guide>
    <style_modifiers>
        <texture>SaaS pricing page, subscription comparison</texture>
        <lighting>Spotlight on recommended option</lighting>
        <palette>Highlight color on best value, neutral on others</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unclear pricing, hard to compare features, no recommendation</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. HORIZONTAL - Top/Bottom Split
export const COMPARATIVA_HORIZONTAL_PROMPT = `
<structural_instruction>
    <composition_type>Horizontal Split Comparison</composition_type>
    <visual_hierarchy>
        <primary>Top half showing one state, bottom half showing the other</primary>
        <secondary>Horizontal divider line between states</secondary>
        <tertiary>Labels identifying each section</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_top>50% for first comparison element</zone_top>
        <zone_bottom>50% for second comparison element</zone_bottom>
        <zone_divider>Horizontal separator</zone_divider>
    </zoning_guide>
    <style_modifiers>
        <texture>Before/after, option comparison, clean layout</texture>
        <lighting>Consistent across both halves</lighting>
        <palette>Contrasting treatments to show difference</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Vertical confusion, unequal zone sizes, unclear comparison</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. ZOOM - Detail Comparison
export const COMPARATIVA_ZOOM_PROMPT = `
<structural_instruction>
    <composition_type>Zoomed Detail Comparison</composition_type>
    <visual_hierarchy>
        <primary>Two magnified detail shots side by side</primary>
        <secondary>Magnifying glass or zoom UI elements</secondary>
        <tertiary>Labels identifying what's being compared</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_detail_a>Zoomed view of option A</zone_detail_a>
        <zone_detail_b>Zoomed view of option B</zone_detail_b>
        <zone_context>Optional context showing full items</zone_context>
    </zoning_guide>
    <style_modifiers>
        <texture>Quality comparison, texture detail, macro focus</texture>
        <lighting>Clinical, revealing, honest lighting</lighting>
        <palette>Neutral to not bias either option</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Low resolution, different zoom levels, biased framing</avoid>
    </negative_constraints>
</structural_instruction>
`

export const COMPARATIVA_DESCRIPTION = 'Diseño comparativo: Antes/Después, VS, Evolución. 11 composiciones para contrastar.'
