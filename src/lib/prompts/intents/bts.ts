export const BTS_DESCRIPTION = 'Behind the scenes, work in progress, studio life, and creative process.'
export const BTS_EXTENDED_DESCRIPTION = 'Share the authentic journey behind your work and studio culture.'

export const BTS_REQUIRED_FIELDS = ['description', 'context']

// 1. WORK IN PROGRESS - Close up
export const BTS_WIP_PROMPT = `
<structural_instruction>
    <composition_type>Work in Progress Macro</composition_type>
    <visual_hierarchy>
        <primary>Macro shot of [HANDS_WORKING] or tools (pen, brush, keyboard)</primary>
        <secondary>The unfinished project visible in the frame</secondary>
        <tertiary>Depth of field blur hiding the background</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_focus>Tools/Action center</zone_focus>
        <zone_blur>Background clutter</zone_blur>
    </zoning_guide>
    <style_modifiers>
        <texture>Raw, authentic, grain</texture>
        <lighting>Task lamp lighting, warm and focused</lighting>
        <palette>Natural materials, unfinished surfaces</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Perfectly polished final product, staged stock photo</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. STUDIO DESK - Wide
export const BTS_DESK_PROMPT = `
<structural_instruction>
    <composition_type>Creative Workspace</composition_type>
    <visual_hierarchy>
        <primary>Top-down or wide shot of a [MESSY_DESK]</primary>
        <secondary>Scattered sketches, coffee cup, tools</secondary>
        <tertiary>Screen or notebook showing the main project</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_full>The layout of objects</zone_full>
    </zoning_guide>
    <style_modifiers>
        <texture>Knolling photography or organized chaos</texture>
        <lighting>Natural window light</lighting>
        <palette>Wood, paper, coffee, ink</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Empty clean desk, sterile office</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. MOODBOARD WALL - Inspiration
export const BTS_MOODBOARD_PROMPT = `
<structural_instruction>
    <composition_type>Inspiration Wall</composition_type>
    <visual_hierarchy>
        <primary>A wall covered in [PRINTS_AND_SKETCHES]</primary>
        <secondary>Tape, pushpins, and color swatches</secondary>
        <tertiary>Hand pointing or adjusting a piece</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_wall>Grid of images</zone_wall>
        <zone_action>Hand interaction</zone_action>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper collage, mixed media</texture>
        <lighting>Gallery track lighting</lighting>
        <palette>Eclectic mix of colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Digital screen screenshot, single image</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. SKETCH VS REAL - Split
export const BTS_SKETCH_REAL_PROMPT = `
<structural_instruction>
    <composition_type>Sketch vs Final</composition_type>
    <visual_hierarchy>
        <primary>Split screen comparison</primary>
        <secondary>Left side: Rough pencil sketch [WIREFRAME]</secondary>
        <tertiary>Right side: Polished final render</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>Sketch</zone_left>
        <zone_right>Final</zone_right>
        <zone_divider>Vertical line or tear</zone_divider>
    </zoning_guide>
    <style_modifiers>
        <texture>Graphite vs Glossy pixel perfect</texture>
        <lighting>Contrast between flat scan and 3D lighting</lighting>
        <palette>Black/White vs Full Color</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Bad alignment between halves</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. BEFORE / AFTER - Transformation
export const BTS_BEFORE_AFTER_PROMPT = `
<structural_instruction>
    <composition_type>Before and After</composition_type>
    <visual_hierarchy>
        <primary>Two contrasting states of a project</primary>
        <secondary>Arrows or "progress bar" connecting them</secondary>
        <tertiary>Labels "Start" and "Now"</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_top>Before state</zone_top>
        <zone_bottom>After state</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Process evolution</texture>
        <lighting>Consistent lighting to show change</lighting>
        <palette>Desaturated vs Saturated</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Confusing timeline, random unrelated images</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. PALETTE - Color extraction
export const BTS_PALETTE_PROMPT = `
<structural_instruction>
    <composition_type>Color Palette Extraction</composition_type>
    <visual_hierarchy>
        <primary>Beautiful source photo (landscape or design)</primary>
        <secondary>Row of 5 [COLOR_SWATCHES] extracted from image</secondary>
        <tertiary>Hex codes or color names</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_image>Main visual</zone_image>
        <zone_swatches>Floating color cards</zone_swatches>
    </zoning_guide>
    <style_modifiers>
        <texture>Design tool UI overlay</texture>
        <lighting>Clean presentation</lighting>
        <palette>Harmonious matching colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Clashing colors, tiny imperceptible swatches</avoid>
    </negative_constraints>
</structural_instruction>
`
