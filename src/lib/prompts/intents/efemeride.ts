export const EFEMERIDE_DESCRIPTION = 'Holidays, anniversaries, special dates, and seasonal greetings.'
export const EFEMERIDE_EXTENDED_DESCRIPTION = 'Celebrate special occasions, holidays, and historical dates.'

export const EFEMERIDE_REQUIRED_FIELDS = ['date', 'occasion', 'message']

// 1. CALENDAR LEAF - Classic
export const EFEMERIDE_CALENDAR_PROMPT = `
<structural_instruction>
    <composition_type>Calendar Leaf</composition_type>
    <visual_hierarchy>
        <primary>A single realistic [TEAR_OFF_CALENDAR] page showing the date</primary>
        <secondary>The month name in classic red bold font</secondary>
        <tertiary>Background surface (wood desk or wall)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>The Calendar Page</zone_center>
        <zone_background>Blurred context</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper texture, torn edges at top</texture>
        <lighting>Morning sunlight casting shadows</lighting>
        <palette>White paper, Red and Black ink</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Digital calendar UI, abstract shapes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. HERO DATE - Typography
export const EFEMERIDE_HERO_DATE_PROMPT = `
<structural_instruction>
    <composition_type>Date Typography</composition_type>
    <visual_hierarchy>
        <primary>The [DATE_NUMBERS] filling the entire screen (e.g. 25)</primary>
        <secondary>The occasion name intertwined with the numbers</secondary>
        <tertiary>Confetti or decorative elements floating around</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Giant Numbers</zone_center>
        <zone_overlap>Occasion Text</zone_overlap>
    </zoning_guide>
    <style_modifiers>
        <texture>3D glossy lettering, gold foil or balloons</texture>
        <lighting>Studio lighting, reflections</lighting>
        <palette>Festive gold, silver, or brand colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small text, standard fonts, boring lists</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. BIRTHDAY / PARTY - Fun
export const EFEMERIDE_PARTY_PROMPT = `
<structural_instruction>
    <composition_type>Celebration</composition_type>
    <visual_hierarchy>
        <primary>Explosion of [CONFETTI_AND_BALLOONS] framing the center</primary>
        <secondary>Central white space for the greeting text</secondary>
        <tertiary>Gift box or cake element at the bottom</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_frame>Festive elements</zone_frame>
        <zone_center>Clear text area</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Shiny plastic balloons, matte paper confetti</texture>
        <lighting>Bright high-key party lighting</lighting>
        <palette>Rainbow, vibrant, pastel party</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Dark spooky lighting, sad colors</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. HISTORICAL - Vintage
export const EFEMERIDE_HISTORY_PROMPT = `
<structural_instruction>
    <composition_type>Historical Memory</composition_type>
    <visual_hierarchy>
        <primary>An [ANTIQUE_FRAME] holding a relevant historical image or year</primary>
        <secondary>Elegant script text for the anniversary name</secondary>
        <tertiary>Vintage ornaments or flowers</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Framed Image</zone_center>
        <zone_bottom>Label Text</zone_bottom>
    </zoning_guide>
    <style_modifiers>
        <texture>Aged paper, sepia tones, dust and scratches</texture>
        <lighting>Candlelight or museum spot</lighting>
        <palette>Sepia, gold, black, burgundy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Modern tech, neon, bright white paper</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. NEON NIGHT - New Year
export const EFEMERIDE_NEON_PROMPT = `
<structural_instruction>
    <composition_type>Neon Celebration</composition_type>
    <visual_hierarchy>
        <primary>Glowing [NEON_SIGN] spelling the Year or Occasion</primary>
        <secondary>Dark brick wall or night sky background</secondary>
        <tertiary>Sparklers or fireworks effects</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Neon Light</zone_center>
        <zone_background>Dark ambience</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Glass tubes, light bloom, brick texture</texture>
        <lighting>Emissive light source in dark environment</lighting>
        <palette>Cyberpunk pink, blue, purple on black</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Daylight, flat colors, print aesthetics</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. SEASONAL - Nature
export const EFEMERIDE_SEASONAL_PROMPT = `
<structural_instruction>
    <composition_type>Seasonal Greeting</composition_type>
    <visual_hierarchy>
        <primary>Natural border of [SEASONAL_FLORA] (flowers, leaves, or snow)</primary>
        <secondary>Central elegant card for the message</secondary>
        <tertiary>Soft background texture/pattern</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_border>Flora elements</zone_border>
        <zone_center>Message Card</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Organic textures, watercolor style</texture>
        <lighting>Soft diffuse natural light</lighting>
        <palette>Seasonal colors (Spring pastel, Autumn orange, etc)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Industrial materials, sharp geometry, plastic</avoid>
    </negative_constraints>
</structural_instruction>
`
