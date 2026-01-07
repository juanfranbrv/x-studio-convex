export const PASOS_DESCRIPTION = 'Tutorials, how-to guides, recipes, and step-by-step instructions.'
export const PASOS_EXTENDED_DESCRIPTION = 'Break down complex processes into easy-to-follow steps.'

export const PASOS_REQUIRED_FIELDS = ['title', 'steps', 'duration']

// 1. ZIG ZAG - Flow
export const PASOS_ZIGZAG_PROMPT = `
<structural_instruction>
    <composition_type>Zig Zag Path</composition_type>
    <visual_hierarchy>
        <primary>A winding path connecting 3-4 distinct step points</primary>
        <secondary>Large numbers (1, 2, 3) at each turn</secondary>
        <tertiary>Icons or small visuals at each step</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_path>S-shaped curve layout</zone_path>
        <zone_steps>Points along the path</zone_steps>
    </zoning_guide>
    <style_modifiers>
        <texture>Vector game map style, flat design</texture>
        <lighting>Top-down uniform lighting</lighting>
        <palette>Bright, playful, high contrast path</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy tangled lines, unreadable small text</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. CARDS CAROUSEL - Horizontal
export const PASOS_CAROUSEL_PROMPT = `
<structural_instruction>
    <composition_type>Step Cards</composition_type>
    <visual_hierarchy>
        <primary>A horizontal row of [CARD_UI] elements</primary>
        <secondary>Each card shows a number and a simple icon/image</secondary>
        <tertiary>Arrow indicators between cards</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_row>Horizontal sequence of cards</zone_row>
        <zone_bottom>Progress bar or dots</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Glassmorphism or clean material design</texture>
        <lighting>Soft shadows, floating cards</lighting>
        <palette>White cards, colored backgrounds</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Vertical lists, clutter, long paragraphs</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. SPLIT SCREEN - Image + List
export const PASOS_SPLIT_PROMPT = `
<structural_instruction>
    <composition_type>Split Guide</composition_type>
    <visual_hierarchy>
        <primary>One large hero image of the finished result (left/top)</primary>
        <secondary>Numbered checklist of steps (right/bottom)</secondary>
        <tertiary>Title "How To..."</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_visual>Hero Result Image</zone_visual>
        <zone_list>Step text area</zone_list>
    </zoning_guide>
    <style_modifiers>
        <texture>Editorial lifestyle photography + clean typography</texture>
        <lighting>Natural light for photo</lighting>
        <palette>Neutral text background, vibrant photo</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Tiny unreadable text, text over busy photo</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. FLOATING NUMBERS - 3D
export const PASOS_FLOATING_PROMPT = `
<structural_instruction>
    <composition_type>Floating Steps</composition_type>
    <visual_hierarchy>
        <primary>Giant 3D [NUMBERS] (1, 2, 3) floating in space</primary>
        <secondary>Small objects or props associated with each number</secondary>
        <tertiary>Connecting lines or arrows</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_space>3D composition depth</zone_space>
        <zone_foreground>The numbers</zone_foreground>
    </zoning_guide>
    <style_modifiers>
        <texture>Plastic, matte clay, or metal 3D</texture>
        <lighting>Studio softbox lighting, ambient occlusion</lighting>
        <palette>Pastel 3D aesthetics</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat 2D text, boring list format</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. BLUEPRINT - Technical
export const PASOS_BLUEPRINT_PROMPT = `
<structural_instruction>
    <composition_type>Technical Schematic</composition_type>
    <visual_hierarchy>
        <primary>Technical line drawing or [EXPLODED_VIEW]_diagram</primary>
        <secondary>Annotations with leader lines pointing to parts</secondary>
        <tertiary>Grid background</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Technical Drawing</zone_center>
        <zone_peripheral>Notes and labels</zone_peripheral>
    </zoning_guide>
    <style_modifiers>
        <texture>Blueprint blue paper or white CAD style</texture>
        <lighting>Flat technical illustration</lighting>
        <palette>Blue and White, or Black and White</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Photorealistic shadows, organic blurry shapes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. TIMELINE - Vertical
export const PASOS_TIMELINE_PROMPT = `
<structural_instruction>
    <composition_type>Vertical Phase Line</composition_type>
    <visual_hierarchy>
        <primary>Vertical line connecting circular nodes</primary>
        <secondary>Step title and icon at each node</secondary>
        <tertiary>Gradient background indicating progress</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_line>Central vertical axis</zone_line>
        <zone_content>Alternating content boxes</zone_content>
    </zoning_guide>
    <style_modifiers>
        <texture>Infographic style, clean vector</texture>
        <lighting>Subtle gradients</lighting>
        <palette>Progressive color gradient (e.g. blue to green)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Horizontal scrolling, disconnected elements</avoid>
    </negative_constraints>
</structural_instruction>
`
