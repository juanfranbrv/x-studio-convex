/**
 * EFEMERIDE - La Efeméride (Fechas especiales y celebraciones)
 * Grupo: Conectar
 * 
 * Para celebrar ocasiones especiales, festivos y fechas históricas.
 * Saludos estacionales y conmemoraciones.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const EFEMERIDE_EXTENDED_DESCRIPTION = `
Para celebrar ocasiones especiales, festivos y fechas históricas.
Saludos estacionales y conmemoraciones.
`.trim()

export const EFEMERIDE_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'date',
        label: 'Fecha',
        placeholder: 'Ej: 25 de Diciembre',
        type: 'text',
        required: true,
        aiContext: 'The date being celebrated'
    },
    {
        id: 'occasion',
        label: 'Ocasión',
        placeholder: 'Ej: Navidad',
        type: 'text',
        required: true,
        aiContext: 'The name of the occasion'
    },
    {
        id: 'message',
        label: 'Mensaje',
        placeholder: 'Ej: ¡Felices Fiestas!',
        type: 'text',
        required: false,
        aiContext: 'The greeting or celebration message'
    }
]

// 1. CALENDARIO - Classic Tear-Off
export const EFEMERIDE_CALENDARIO_PROMPT = `
<structural_instruction>
    <composition_type>Calendar Leaf Page</composition_type>
    <visual_hierarchy>
        <primary>Realistic tear-off calendar page showing the date prominently</primary>
        <secondary>Month name in classic red bold font</secondary>
        <tertiary>Textured background surface (wood desk or wall)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_calendar>The calendar page as hero element</zone_calendar>
        <zone_date>Large date numbers</zone_date>
        <zone_background>Blurred context surface</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper texture, torn edges at top</texture>
        <lighting>Morning sunlight casting soft shadows</lighting>
        <palette>White paper, red and black ink</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Digital calendar UI, abstract shapes, flat design</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. TIPOGRAFÍA - Giant Date Numbers
export const EFEMERIDE_TIPOGRAFIA_PROMPT = `
<structural_instruction>
    <composition_type>Date Typography Hero</composition_type>
    <visual_hierarchy>
        <primary>Date numbers filling the entire screen (e.g. "25")</primary>
        <secondary>Occasion name intertwined with the numbers</secondary>
        <tertiary>Confetti or decorative elements floating around</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_numbers>Giant date numerals as hero</zone_numbers>
        <zone_occasion>Overlapping occasion text</zone_occasion>
        <zone_decoration>Festive elements surrounding</zone_decoration>
    </zoning_guide>
    <style_modifiers>
        <texture>3D glossy lettering, gold foil, or balloon style</texture>
        <lighting>Studio lighting with reflections</lighting>
        <palette>Festive gold, silver, or brand celebration colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Small text, standard fonts, boring layouts</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. FIESTA - Party Celebration
export const EFEMERIDE_FIESTA_PROMPT = `
<structural_instruction>
    <composition_type>Party Celebration Frame</composition_type>
    <visual_hierarchy>
        <primary>Explosion of confetti and balloons framing the center</primary>
        <secondary>Central white/clear space for greeting text</secondary>
        <tertiary>Gift box, cake, or celebration element at bottom</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_frame>Festive elements creating border</zone_frame>
        <zone_message>Clear center for text</zone_message>
        <zone_props>Celebration objects at edges</zone_props>
    </zoning_guide>
    <style_modifiers>
        <texture>Shiny plastic balloons, matte paper confetti</texture>
        <lighting>Bright high-key party lighting</lighting>
        <palette>Rainbow, vibrant pastels, party colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Dark spooky lighting, sad muted colors</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. HISTÓRICO - Vintage Memory
export const EFEMERIDE_HISTORICO_PROMPT = `
<structural_instruction>
    <composition_type>Historical Memory Frame</composition_type>
    <visual_hierarchy>
        <primary>Antique frame holding a relevant historical image or year</primary>
        <secondary>Elegant script text for the anniversary name</secondary>
        <tertiary>Vintage ornaments, laurels, or flowers</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_frame>Ornate frame containing image</zone_frame>
        <zone_image>Historical or commemorative visual</zone_image>
        <zone_text>Anniversary label below</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Aged paper, sepia tones, dust and scratches</texture>
        <lighting>Candlelight or museum spot lighting</lighting>
        <palette>Sepia, gold, black, burgundy</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Modern tech, neon, bright white paper</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. NEON - New Year Night Style
export const EFEMERIDE_NEON_PROMPT = `
<structural_instruction>
    <composition_type>Neon Sign Celebration</composition_type>
    <visual_hierarchy>
        <primary>Glowing neon sign spelling the year or occasion</primary>
        <secondary>Dark brick wall or night sky background</secondary>
        <tertiary>Sparklers or fireworks effects around</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_neon>Glowing text as hero</zone_neon>
        <zone_dark>Dark atmospheric backdrop</zone_dark>
        <zone_effects>Sparkle and light effects</zone_effects>
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

// 6. ESTACIONAL - Seasonal Natural Frame
export const EFEMERIDE_ESTACIONAL_PROMPT = `
<structural_instruction>
    <composition_type>Seasonal Flora Frame</composition_type>
    <visual_hierarchy>
        <primary>Natural border of seasonal flora (flowers, leaves, snow)</primary>
        <secondary>Central elegant card for the message</secondary>
        <tertiary>Soft background texture or pattern</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_border>Organic flora frame elements</zone_border>
        <zone_card>Central message area</zone_card>
        <zone_texture>Subtle background pattern</zone_texture>
    </zoning_guide>
    <style_modifiers>
        <texture>Organic natural textures, watercolor style</texture>
        <lighting>Soft diffuse natural light</lighting>
        <palette>Seasonal colors (Spring pastel, Autumn orange, Winter white)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Industrial materials, sharp geometry, plastic feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. BANDERA - Patriotic Flag
export const EFEMERIDE_BANDERA_PROMPT = `
<structural_instruction>
    <composition_type>Patriotic Flag Display</composition_type>
    <visual_hierarchy>
        <primary>National or regional flag as dominant visual element</primary>
        <secondary>Holiday or commemoration name overlaid</secondary>
        <tertiary>Patriotic symbols (eagles, shields, stars)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_flag>Waving or draped flag as backdrop</zone_flag>
        <zone_text>Commemorative text overlay</zone_text>
        <zone_symbols>National symbols integrated</zone_symbols>
    </zoning_guide>
    <style_modifiers>
        <texture>Fabric flag texture, waving motion</texture>
        <lighting>Heroic, patriotic lighting</lighting>
        <palette>National colors in full saturation</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Disrespectful treatment, faded colors, torn flags</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. RELIGIOSO - Sacred Celebration
export const EFEMERIDE_RELIGIOSO_PROMPT = `
<structural_instruction>
    <composition_type>Sacred Holiday Design</composition_type>
    <visual_hierarchy>
        <primary>Religious iconography appropriate to the holiday</primary>
        <secondary>Blessing or traditional greeting text</secondary>
        <tertiary>Candles, light rays, or spiritual elements</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_icon>Religious symbol or imagery</zone_icon>
        <zone_blessing>Traditional greeting text</zone_blessing>
        <zone_atmosphere>Spiritual atmosphere elements</zone_atmosphere>
    </zoning_guide>
    <style_modifiers>
        <texture>Traditional art styles, stained glass, iconography</texture>
        <lighting>Reverent, warm candlelight or divine rays</lighting>
        <palette>Traditional religious colors (gold, white, purple)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Commercial feel, inappropriate imagery, disrespect</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. COUNTDOWN - Days Until
export const EFEMERIDE_COUNTDOWN_PROMPT = `
<structural_instruction>
    <composition_type>Countdown to Event</composition_type>
    <visual_hierarchy>
        <primary>Large countdown number (X days/hours until...)</primary>
        <secondary>Event or holiday name being counted down to</secondary>
        <tertiary>Excitement building visual elements (arrows, energy)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_countdown>Large countdown number</zone_countdown>
        <zone_event>Event name and date</zone_event>
        <zone_energy>Anticipation elements</zone_energy>
    </zoning_guide>
    <style_modifiers>
        <texture>Digital display, flip clock, or calendar style</texture>
        <lighting>Anticipation glow, building excitement</lighting>
        <palette>Event-appropriate celebration colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Past-tense messaging, boring static feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. COLLAGE - Multi-Moment Memory
export const EFEMERIDE_COLLAGE_PROMPT = `
<structural_instruction>
    <composition_type>Memory Collage</composition_type>
    <visual_hierarchy>
        <primary>Multiple photos from past celebrations of this event</primary>
        <secondary>Central title or logo for the occasion</secondary>
        <tertiary>Decorative tape, stickers, or scrapbook elements</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_photos>Scattered overlapping photos</zone_photos>
        <zone_title>Central occasion branding</zone_title>
        <zone_decoration>Scrapbook styling elements</zone_decoration>
    </zoning_guide>
    <style_modifiers>
        <texture>Polaroid frames, washi tape, scrapbook aesthetic</texture>
        <lighting>Mixed natural lighting from photos</lighting>
        <palette>Warm nostalgic tones, celebration colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Single image, clinical grid, cold feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. MENSAJE - Simple Greeting
export const EFEMERIDE_MENSAJE_PROMPT = `
<structural_instruction>
    <composition_type>Simple Greeting Card</composition_type>
    <visual_hierarchy>
        <primary>Large, elegant greeting text ("¡Feliz Navidad!")</primary>
        <secondary>Subtle decorative backdrop or pattern</secondary>
        <tertiary>Brand signature or from line</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_greeting>Central message as hero</zone_greeting>
        <zone_pattern>Background subtle decoration</zone_pattern>
        <zone_signature>Brand or sender identification</zone_signature>
    </zoning_guide>
    <style_modifiers>
        <texture>Elegant card stock, subtle texture</texture>
        <lighting>Soft, warm, inviting</lighting>
        <palette>Occasion-appropriate colors with elegance</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Busy overwhelming design, hard to read text</avoid>
    </negative_constraints>
</structural_instruction>
`

export const EFEMERIDE_DESCRIPTION = 'Fechas especiales y celebraciones. 11 composiciones para conmemoraciones.'
