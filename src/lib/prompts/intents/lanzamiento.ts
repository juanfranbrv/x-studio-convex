export const LANZAMIENTO_DESCRIPTION = 'Countdown, reveal, teaser, product drop.'
export const LANZAMIENTO_EXTENDED_DESCRIPTION = 'Coming soon teasers, countdowns, mysterious reveals, and product drops.'

export const LANZAMIENTO_REQUIRED_FIELDS = ['headline', 'date', 'cta']

// 1. COUNTDOWN / TIMER - Big numbers, urgency
export const LANZAMIENTO_COUNTDOWN_PROMPT = `
<structural_instruction>
    <composition_type>Countdown Timer</composition_type>
    <visual_hierarchy>
        <primary>Massive countdown numbers (03:00, 10, etc.) in center/hero position using [LARGE_DISPLAY_TYPOGRAPHY]</primary>
        <secondary>Product silhouette or teaser glimpse in background with [MYSTERY_FOG_EFFECT]</secondary>
        <tertiary>Release date and call to action at bottom</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_top>Teaser text "Coming Soon"</zone_top>
        <zone_center>THE NUMBERS (Hero element)</zone_center>
        <zone_bottom>Date and "Notify Me" button</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Digital glich, neon glow, or metallic cinema 4d render</texture>
        <lighting>Cinematic backlighting, rim light on numbers</lighting>
        <palette>Dark mode, neon accents (cyan, magenta, lime) or gold/black</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered background, small numbers, fully visible product</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. REVEAL / CURTAIN - Cloth, smoke, hidden object
export const LANZAMIENTO_REVEAL_PROMPT = `
<structural_instruction>
    <composition_type>Product Reveal</composition_type>
    <visual_hierarchy>
        <primary>Object partially covered by [SILK_CLOTH_DRAPE] or emerging from [DENSE_SMOKE]</primary>
        <secondary>Dramatic shaft of light revealing a specific detail</secondary>
        <tertiary>Minimal text floating in negative space</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_main>Center-weighted mysterious object</zone_main>
        <zone_overlay>Subtle text "Unveiling..."</zone_overlay>
    </zoning_guide>
    <style_modifiers>
        <texture>Velvet, silk, smoke, shadows</texture>
        <lighting>Spotlight, chiaroscuro, high contrast</lighting>
        <palette>Monochrome with one accent color, luxury darks</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Full product visibility, flat lighting, bright cheerful colors</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. TEASER / SILHOUETTE - Backlit profile
export const LANZAMIENTO_SILHOUETTE_PROMPT = `
<structural_instruction>
    <composition_type>Silhouette Teaser</composition_type>
    <visual_hierarchy>
        <primary>Strong [BACKLIT_SILHOUETTE] of the new product/feature</primary>
        <secondary>Glowing edges (rim light) defining the shape</secondary>
        <tertiary>Bold headline text overlay in center</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Silhouette shape</zone_center>
        <zone_text_overlay>Intertwined typography with the shape</zone_text_overlay>
    </zoning_guide>
    <style_modifiers>
        <texture>Atmospheric fog, gradients, sleek surfaces</texture>
        <lighting>Strong backlighting, volumetric light rays</lighting>
        <palette>Deep blues, purples, or stark black & white</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Frontal flat lighting, detailed features, plain white background</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. GLITCH / TECH - Digital distortion, modern
export const LANZAMIENTO_GLITCH_PROMPT = `
<structural_instruction>
    <composition_type>Tech Reveal</composition_type>
    <visual_hierarchy>
        <primary>Product image with [DIGITAL_GLITCH_EFFECT] or pixel sorting</primary>
        <secondary>Cyberpunk UI elements, loading bars, data streams</secondary>
        <tertiary>Monospaced typography for details</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_full>Distorted visual field</zone_full>
        <zone_foreground>Clear text layer "System Update" or "Loading"</zone_foreground>
    </zoning_guide>
    <style_modifiers>
        <texture>Scanlines, pixels, chromatic aberration</texture>
        <lighting>Neon screens, HUD glow</lighting>
        <palette>Cyberpunk, matrix green, synthetic colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Organic shapes, vintage style, soft lighting</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. RIP / TORN PAPER - Pecking through
export const LANZAMIENTO_TORN_PROMPT = `
<structural_instruction>
    <composition_type>Torn Paper Reveal</composition_type>
    <visual_hierarchy>
        <primary>A layer of paper/texture [RIPPED_OPEN] in the center</primary>
        <secondary>New product visible *inside* the tear</secondary>
        <tertiary>Old version or "Secret" text on the outer paper layer</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_outer>Texture paper surface (mask)</zone_outer>
        <zone_inner>The reveal inside the hole</zone_inner>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper fiber, cardboard, realistic shadows</texture>
        <lighting>Hard shadows from the paper edge</lighting>
        <palette>Contrast between outer (neutral) and inner (vibrant)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Digital flatness, fake looking shadows</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. DATE / CALENDAR - Calendar focus
export const LANZAMIENTO_CALENDAR_PROMPT = `
<structural_instruction>
    <composition_type>Save The Date</composition_type>
    <visual_hierarchy>
        <primary>A stylized [3D_CALENDAR_PAGE] or date block floating</primary>
        <secondary>Confetti or particles frozen in air around it</secondary>
        <tertiary>Event name or product title below</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Floating date element</zone_center>
        <zone_background>Blurred abstract depth</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Matte plastic, soft shadows, airy feeling</texture>
        <lighting>Softbox studio lighting, pastel tones</lighting>
        <palette>Brand colors, high key brightness</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Traditional grid calendar, office vibes, boring text</avoid>
    </negative_constraints>
</structural_instruction>
`
