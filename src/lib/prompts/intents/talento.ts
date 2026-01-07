export const TALENTO_DESCRIPTION = 'Hiring announcements, company culture, employee spotlights, and values.'
export const TALENTO_EXTENDED_DESCRIPTION = 'Attract top talent and showcase company culture, values, and team life.'

export const TALENTO_REQUIRED_FIELDS = ['headline', 'role_title', 'cta']

// 1. WE ARE HIRING - Classic recruit
export const TALENTO_HIRING_PROMPT = `
<structural_instruction>
    <composition_type>Hiring Poster</composition_type>
    <visual_hierarchy>
        <primary>Big bold text "[WE_ARE_HIRING]" or "JOIN US"</primary>
        <secondary>Dynamic office background or abstract geometric shapes</secondary>
        <tertiary>Role title and "Apply Now" button</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_top>Eyebrow text "Career Opportunity"</zone_top>
        <zone_center>Main Headline (Hero)</zone_center>
        <zone_bottom>Details and CTA</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean corporate geometric patterns, Memphis design</texture>
        <lighting>Bright, optimistic high-key lighting</lighting>
        <palette>Energetic brand colors, primary colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Boring stock photo of shaking hands, dark gloomy vibes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. CULTURE GRID - Life at company
export const TALENTO_CULTURE_PROMPT = `
<structural_instruction>
    <composition_type>Team Culture Grid</composition_type>
    <visual_hierarchy>
        <primary>A mosaic or [MASONRY_GRID] of candid team photos</primary>
        <secondary>Overlay text badge "Life at [Company]"</secondary>
        <tertiary>Colorful borders or tape separating images</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>The photos</zone_grid>
        <zone_center>Text overlay badge</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Polaroid frames, washi tape, scrapbook feel</texture>
        <lighting>Natural sunlight, warm filters</lighting>
        <palette>Multicolor, vibrant, fun</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Stiff corporate headshots, rigid perfect alignment</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. VALUE STATEMENT - Core values
export const TALENTO_VALUE_PROMPT = `
<structural_instruction>
    <composition_type>Core Value</composition_type>
    <visual_hierarchy>
        <primary>One single powerful word (e.g. INTEGRITY) in [GIANT_TYPOGRAPHY]</primary>
        <secondary>Abstract background representing the concept</secondary>
        <tertiary>Small definition text below</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>The Word</zone_center>
        <zone_background>Conceptual art</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>3D lettering, architectural materials (concrete, glass)</texture>
        <lighting>Dramatic side lighting, long shadows</lighting>
        <palette>Monochrome with one strong accent</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered text, weak fonts, literal interpretations</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. PERKS / BENEFITS - Icons
export const TALENTO_PERKS_PROMPT = `
<structural_instruction>
    <composition_type>Perks List</composition_type>
    <visual_hierarchy>
        <primary>Set of 3-4 [3D_ICONS] representing benefits (Remote, Health, Equity)</primary>
        <secondary>Floating platforms or bubbles holding the icons</secondary>
        <tertiary>Header "Why join us?"</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_row>Horizontal arrangement of icons</zone_row>
        <zone_top>Header text</zone_top>
    </zoning_guide>
    <style_modifiers>
        <texture>Soft clay 3D, pastel colors, rounded shapes</texture>
        <lighting>Soft playful lighting</lighting>
        <palette>Pastels, friendly and accessible</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Sharp edges, aggressive colors, flat line icons</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. EMPLOYEE SPOTLIGHT - Story focus
export const TALENTO_SPOTLIGHT_PROMPT = `
<structural_instruction>
    <composition_type>Talent Spotlight</composition_type>
    <visual_hierarchy>
        <primary>Large portrait of employee on one side</primary>
        <secondary>Large quote mark and their personal story text</secondary>
        <tertiary>Name and role tag</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_image>Photo area (half width)</zone_image>
        <zone_text>Quote area (half width)</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Editorial magazine layout, serif fonts</texture>
        <lighting>Studio portrait lighting</lighting>
        <palette>Elegant, sophisticated, brand colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Busy background, small text, low quality photo</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. OFFICE VIBES - Space
export const TALENTO_OFFICE_PROMPT = `
<structural_instruction>
    <composition_type>Workspace Vibes</composition_type>
    <visual_hierarchy>
        <primary>Atmospheric shot of a [MODERN_WORKSPACE] or desk setup</primary>
        <secondary>Blurry background (bokeh) depth of field</secondary>
        <tertiary>Overlay text "Your new desk awaits"</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_full>The image</zone_full>
        <zone_overlay>Minimal centered text</zone_overlay>
    </zoning_guide>
    <style_modifiers>
        <texture>Interior design photography, clean lines, plants</texture>
        <lighting>Natural window light, warm interior glow</lighting>
        <palette>Neutral tones, wood, greenery</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy cables, empty dark rooms, sterile hospital vibes</avoid>
    </negative_constraints>
</structural_instruction>
`
