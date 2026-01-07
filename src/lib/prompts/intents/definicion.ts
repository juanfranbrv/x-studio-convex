export const DEFINICION_DESCRIPTION = 'Dictionary entries, concept explanations, and terminology.'
export const DEFINICION_EXTENDED_DESCRIPTION = 'Define terms, concepts, or jargon with clarity and style.'

export const DEFINICION_REQUIRED_FIELDS = ['word', 'definition', 'phonetic']

// 1. CLASSIC DICTIONARY - Serif beauty
export const DEFINICION_CLASSIC_PROMPT = `
<structural_instruction>
    <composition_type>Classic Dictionary Entry</composition_type>
    <visual_hierarchy>
        <primary>The [WORD] in elegant bold serif typography</primary>
        <secondary>Phonetic pronunciation guide /kənˈtɛkst/</secondary>
        <tertiary>Definition text block with part of speech (n.)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_top_left>Word and Phonetic</zone_top_left>
        <zone_bottom>Definition text</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Old paper grain, letterpress print effect</texture>
        <lighting>Even flat lighting, scanned page feel</lighting>
        <palette>Black ink on off-white or cream paper</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Modern sans-serifs, neon colors, busy backgrounds</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. MINIMAL WORD - Huge Typography
export const DEFINICION_MINIMAL_PROMPT = `
<structural_instruction>
    <composition_type>Minimalist Word</composition_type>
    <visual_hierarchy>
        <primary>The [WORD] filling the canvas edge-to-edge</primary>
        <secondary>Tiny definition text tucked in a corner</secondary>
        <tertiary>One small geometric accent shape</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Massive Typography</zone_center>
        <zone_corner>Micro definition txt</zone_corner>
    </zoning_guide>
    <style_modifiers>
        <texture>Smooth vector matte, swiss design</texture>
        <lighting>None (Flat design)</lighting>
        <palette>High contrast B&W or Single bright color background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Clutter, gradients, photos, skeuomorphism</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. CONCEPT MAP - Connections
export const DEFINICION_MAP_PROMPT = `
<structural_instruction>
    <composition_type>Concept Mind Map</composition_type>
    <visual_hierarchy>
        <primary>Central node with the [WORD]</primary>
        <secondary>Branching lines connecting to related keywords</secondary>
        <tertiary>Definition text on the side</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Central Hub</zone_center>
        <zone_surround>Orbiting related terms</zone_surround>
    </zoning_guide>
    <style_modifiers>
        <texture>Whiteboard marker, digital diagram, flow chart</texture>
        <lighting>Clean even screen lighting</lighting>
        <palette>Tech colors (blue, grey, white)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy handwriting, overly complex tangled lines</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. ENCYCLOPEDIA - Academic
export const DEFINICION_ENCYCLOPEDIA_PROMPT = `
<structural_instruction>
    <composition_type>Encyclopedia Layout</composition_type>
    <visual_hierarchy>
        <primary>Two-column text layout</primary>
        <secondary>A vintage engraving or scientific illustration of the concept</secondary>
        <tertiary>Caption text under illustration</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>Illustration</zone_left>
        <zone_right>Text Columns</zone_right>
    </zoning_guide>
    <style_modifiers>
        <texture>Vintage book, academic journal</texture>
        <lighting>Library atmosphere</lighting>
        <palette>Sepia, muted tones, scholarly</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cartoons, web 2.0 gloss, modern stock photos</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. SLANG STICKER - Street style
export const DEFINICION_URBAN_PROMPT = `
<structural_instruction>
    <composition_type>Urban Dictionary / Sticker</composition_type>
    <visual_hierarchy>
        <primary>[WORD] designed as a die-cut sticker</primary>
        <secondary>Graffiti tag background or concrete wall</secondary>
        <tertiary>Definition in typewriter font on a taped paper note</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Sticker Art</zone_center>
        <zone_bottom>Note definition</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Street wear aesthetic, concrete, sticker gloss</texture>
        <lighting>Hard flash photography</lighting>
        <palette>Neon green, hot pink, black asphalt</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Elegant serif fonts, corporate feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. TECH TERMY - Code block
export const DEFINICION_TECH_PROMPT = `
<structural_instruction>
    <composition_type>Code Definition</composition_type>
    <visual_hierarchy>
        <primary>IDE / Code Editor window frame</primary>
        <secondary>The [WORD] defined as a const or variable assignment</secondary>
        <tertiary>Syntax highlighting colors</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Code block content</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Dark mode UI, monospaced font</texture>
        <lighting>Screen glow</lighting>
        <palette>Dark grey background, pastel code colors (Dracula theme)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>White backgrounds, variable width fonts</avoid>
    </negative_constraints>
</structural_instruction>
`
