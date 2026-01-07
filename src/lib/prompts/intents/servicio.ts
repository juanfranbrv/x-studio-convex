export const SERVICIO_DESCRIPTION = 'Features, benefits, pricing tables, and service lists.'
export const SERVICIO_EXTENDED_DESCRIPTION = 'Showcase services, features, pricing options, and value propositions clearly.'

export const SERVICIO_REQUIRED_FIELDS = ['headline', 'service_list', 'cta']

// 1. FEATURE GRID - 2x2 or 3x3
export const SERVICIO_GRID_PROMPT = `
<structural_instruction>
    <composition_type>Feature Grid</composition_type>
    <visual_hierarchy>
        <primary>A structured [BENTO_GRID] layout displaying core features</primary>
        <secondary>Isometric icons floating above each grid cell</secondary>
        <tertiary>Unified background connecting the cells</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>2x2 or 3x2 grid of cards</zone_grid>
        <zone_header>Top centered headline "What we do"</zone_header>
    </zoning_guide>
    <style_modifiers>
        <texture>Glassmorphism, frosted acrylic, soft gradients</texture>
        <lighting>Top-down soft lighting, diffuse shadows</lighting>
        <palette>Clean corporate blues, teals, or white/grey tech</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Chaotic clutter, overlapping text, messy alignment</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. BENEFIT HERO - Outcome focus
export const SERVICIO_BENEFIT_PROMPT = `
<structural_instruction>
    <composition_type>Benefit Visualization</composition_type>
    <visual_hierarchy>
        <primary>Visual metaphor of the [KEY_BENEFIT] (e.g., speed, peace of mind)</primary>
        <secondary>Abstract shapes representing transformation/improvement</secondary>
        <tertiary>Text stating the value proposition</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_right>Illustration of the result/benefit</zone_right>
        <zone_left>Copywriting space</zone_left>
    </zoning_guide>
    <style_modifiers>
        <texture>Smooth vector 3D, buttery gradients</texture>
        <lighting>Warm, positive, golden hour feel</lighting>
        <palette>Optimistic colors (greens, oranges, yellows)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Negative imagery, complex technical diagrams</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. PRICING TABLE - Clean comparison
export const SERVICIO_PRICING_PROMPT = `
<structural_instruction>
    <composition_type>Pricing Tiers</composition_type>
    <visual_hierarchy>
        <primary>Three vertical [PRICING_CARDS], center one larger/highlighted</primary>
        <secondary>"Best Value" ribbon or badge on center card</secondary>
        <tertiary>Checkmarks and list items clearly visible</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>The Pro/Premium plan (Hero)</zone_center>
        <zone_sides>Basic and Enterprise plans (Receded)</zone_sides>
    </zoning_guide>
    <style_modifiers>
        <texture>Flat UI, clean lines, subtle drop shadows</texture>
        <lighting>Even UI lighting</lighting>
        <palette>Brand primary highlight, neutral greys for others</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Hard to read text, low contrast, dark sinister mood</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. STEP FLOW - 1-2-3 Process
export const SERVICIO_PROCESS_PROMPT = `
<structural_instruction>
    <composition_type>How It Works</composition_type>
    <visual_hierarchy>
        <primary>Horizontal flow line connecting 3 key steps</primary>
        <secondary>Floating 3D numbers (1, 2, 3) marking the path</secondary>
        <tertiary>Simple icons illustrating each stage</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_flow>Left to right visual path</zone_flow>
        <zone_bottom>Caption area for each step</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Matte 3D shapes, connecting pipes or lines</texture>
        <lighting>Global illumination, soft shadows</lighting>
        <palette>Monochromatic or analogous color harmony</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Vertical listing, cluttered detailed illustrations</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. SERVICE LIST - Iconography
export const SERVICIO_LIST_PROMPT = `
<structural_instruction>
    <composition_type>Service Catalogue</composition_type>
    <visual_hierarchy>
        <primary>Vertical list of [SERVICE_ITEMS] with prominent icons</primary>
        <secondary>Alternating background stripes or subtle dividers</secondary>
        <tertiary>Header image or banner at the top</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_top>Introduction/Header</zone_top>
        <zone_body>Repeated pattern of Icon + Text rows</zone_body>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean corporate UI, white space</texture>
        <lighting>Bright office lighting</lighting>
        <palette>Trustworthy blue/navy, professional tones</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Neon colors, grunge, chaotic layout</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. TRUST / GUARANTEE - Badge focus
export const SERVICIO_TRUST_PROMPT = `
<structural_instruction>
    <composition_type>Trust Seal</composition_type>
    <visual_hierarchy>
        <primary>Massive 3D [TRUST_BADGE] or Shield (e.g. 100% Guarantee)</primary>
        <secondary>Laurel wreath or ribbon wrapping the badge</secondary>
        <tertiary>Handshake or signature in background</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>The Badge/Shield</zone_center>
        <zone_background>Subtle pattern of security locks or checks</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Metallic gold/silver, shiny surfaces, embossing</texture>
        <lighting>Reflective highlights, premium feel</lighting>
        <palette>Metallics, deep royal blue, white</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cheap clipart look, distressed textures</avoid>
    </negative_constraints>
</structural_instruction>
`
