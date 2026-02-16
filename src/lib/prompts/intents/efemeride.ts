/**
 * EFEMERIDE - La Efeméride (Fechas especiales y celebraciones)
 * Grupo: Conectar
 */

import type { LayoutOption, IntentRequiredField } from '@/lib/creation-flow-types'

export const EFEMERIDE_DESCRIPTION = 'Fechas especiales y celebraciones. 12 composiciones para conmemoraciones.'
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
# Composition Type
Calendar Leaf Page

# Visual Hierarchy
- **Primary**: Realistic tear-off calendar page showing the date prominently
- **Secondary**: Month name in classic red bold font
- **Tertiary**: Textured background surface (wood desk or wall)

# Zoning Guide
- **Zone Calendar**: The calendar page as hero element
- **Zone Date**: Large date numbers
- **Zone Background**: Blurred context surface

# Style Modifiers
- **Texture**: Paper texture, torn edges at top
- **Lighting**: Morning sunlight casting soft shadows
- **Palette**: White paper, red and black ink

# Negative Constraints
- **Avoid**: Digital calendar UI, abstract shapes, flat design
`

// 2. TIPOGRAFÍA - Giant Date Numbers
export const EFEMERIDE_TIPOGRAFIA_PROMPT = `
# Composition Type
Date Typography Hero

# Visual Hierarchy
- **Primary**: Date numbers filling the entire screen (e.g. "25")
- **Secondary**: Occasion name intertwined with the numbers
- **Tertiary**: Confetti or decorative elements floating around

# Zoning Guide
- **Zone Numbers**: Giant date numerals as hero
- **Zone Occasion**: Overlapping occasion text
- **Zone Decoration**: Festive elements surrounding

# Style Modifiers
- **Texture**: 3D glossy lettering, gold foil, or balloon style
- **Lighting**: Studio lighting with reflections
- **Palette**: Festive gold, silver, or brand celebration colors

# Negative Constraints
- **Avoid**: Small text, standard fonts, boring layouts
`

// 3. FIESTA - Party Celebration
export const EFEMERIDE_FIESTA_PROMPT = `
# Composition Type
Party Celebration Frame

# Visual Hierarchy
- **Primary**: Explosion of confetti and balloons framing the center
- **Secondary**: Central white/clear space for greeting text
- **Tertiary**: Gift box, cake, or celebration element at bottom

# Zoning Guide
- **Zone Frame**: Festive elements creating border
- **Zone Message**: Clear center for text
- **Zone Props**: Celebration objects at edges

# Style Modifiers
- **Texture**: Shiny plastic balloons, matte paper confetti
- **Lighting**: Bright high-key party lighting
- **Palette**: Rainbow, vibrant pastels, party colors

# Negative Constraints
- **Avoid**: Dark spooky lighting, sad muted colors
`

// 4. HISTÓRICO - Vintage Memory
export const EFEMERIDE_HISTORICO_PROMPT = `
# Composition Type
Historical Memory Frame

# Visual Hierarchy
- **Primary**: Antique frame holding a relevant historical image or year
- **Secondary**: Elegant script text for the anniversary name
- **Tertiary**: Vintage ornaments, laurels, or flowers

# Zoning Guide
- **Zone Frame**: Ornate frame containing image
- **Zone Image**: Historical or commemorative visual
- **Zone Text**: Anniversary label below

# Style Modifiers
- **Texture**: Aged paper, sepia tones, dust and scratches
- **Lighting**: Candlelight or museum spot lighting
- **Palette**: Sepia, gold, black, burgundy

# Negative Constraints
- **Avoid**: Modern tech, neon, bright white paper
`

// 5. NEON - New Year Night Style
export const EFEMERIDE_NEON_PROMPT = `
# Composition Type
Neon Sign Celebration

# Visual Hierarchy
- **Primary**: Glowing neon sign spelling the year or occasion
- **Secondary**: Dark brick wall or night sky background
- **Tertiary**: Sparklers or fireworks effects around

# Zoning Guide
- **Zone Neon**: Glowing text as hero
- **Zone Dark**: Dark atmospheric backdrop
- **Zone Effects**: Sparkle and light effects

# Style Modifiers
- **Texture**: Glass tubes, light bloom, brick texture
- **Lighting**: Emissive light source in dark environment
- **Palette**: Cyberpunk pink, blue, purple on black

# Negative Constraints
- **Avoid**: Daylight, flat colors, print aesthetics
`

// 6. ESTACIONAL - Seasonal Natural Frame
export const EFEMERIDE_ESTACIONAL_PROMPT = `
# Composition Type
Seasonal Flora Frame

# Visual Hierarchy
- **Primary**: Natural border of seasonal flora (flowers, leaves, snow)
- **Secondary**: Central elegant card for the message
- **Tertiary**: Soft background texture or pattern

# Zoning Guide
- **Zone Border**: Organic flora frame elements
- **Zone Card**: Central message area
- **Zone Texture**: Subtle background pattern

# Style Modifiers
- **Texture**: Organic natural textures, watercolor style
- **Lighting**: Soft diffuse natural light
- **Palette**: Seasonal colors (Spring pastel, Autumn orange, Winter white)

# Negative Constraints
- **Avoid**: Industrial materials, sharp geometry, plastic feel
`

// 7. BANDERA - Patriotic Flag
export const EFEMERIDE_BANDERA_PROMPT = `
# Composition Type
Patriotic Flag Display

# Visual Hierarchy
- **Primary**: National or regional flag as dominant visual element
- **Secondary**: Holiday or commemoration name overlaid
- **Tertiary**: Patriotic symbols (eagles, shields, stars)

# Zoning Guide
- **Zone Flag**: Waving or draped flag as backdrop
- **Zone Text**: Commemorative text overlay
- **Zone Symbols**: National symbols integrated

# Style Modifiers
- **Texture**: Fabric flag texture, waving motion
- **Lighting**: Heroic, patriotic lighting
- **Palette**: National colors in full saturation

# Negative Constraints
- **Avoid**: Disrespectful treatment, faded colors, torn flags
`

// 8. RELIGIOSO - Sacred Celebration
export const EFEMERIDE_RELIGIOSO_PROMPT = `
# Composition Type
Sacred Holiday Design

# Visual Hierarchy
- **Primary**: Religious iconography appropriate to the holiday
- **Secondary**: Blessing or traditional greeting text
- **Tertiary**: Candles, light rays, or spiritual elements

# Zoning Guide
- **Zone Icon**: Religious symbol or imagery
- **Zone Blessing**: Traditional greeting text
- **Zone Atmosphere**: Spiritual atmosphere elements

# Style Modifiers
- **Texture**: Traditional art styles, stained glass, iconography
- **Lighting**: Reverent, warm candlelight or divine rays
- **Palette**: Traditional religious colors (gold, white, purple)

# Negative Constraints
- **Avoid**: Commercial feel, inappropriate imagery, disrespect
`

// 9. COUNTDOWN - Days Until
export const EFEMERIDE_COUNTDOWN_PROMPT = `
# Composition Type
Countdown to Event

# Visual Hierarchy
- **Primary**: Large countdown number (X days/hours until...)
- **Secondary**: Event or holiday name being counted down to
- **Tertiary**: Excitement building visual elements (arrows, energy)

# Zoning Guide
- **Zone Countdown**: Large countdown number
- **Zone Event**: Event name and date
- **Zone Energy**: Anticipation elements

# Style Modifiers
- **Texture**: Digital display, flip clock, or calendar style
- **Lighting**: Anticipation glow, building excitement
- **Palette**: Event-appropriate celebration colors

# Negative Constraints
- **Avoid**: Past-tense messaging, boring static feel
`

// 10. COLLAGE - Multi-Moment Memory
export const EFEMERIDE_COLLAGE_PROMPT = `
# Composition Type
Memory Collage

# Visual Hierarchy
- **Primary**: Multiple photos from past celebrations of this event
- **Secondary**: Central title or logo for the occasion
- **Tertiary**: Decorative tape, stickers, or scrapbook elements

# Zoning Guide
- **Zone Photos**: Scattered overlapping photos
- **Zone Title**: Central occasion branding
- **Zone Decoration**: Scrapbook styling elements

# Style Modifiers
- **Texture**: Polaroid frames, washi tape, scrapbook aesthetic
- **Lighting**: Mixed natural lighting from photos
- **Palette**: Warm nostalgic tones, celebration colors

# Negative Constraints
- **Avoid**: Single image, clinical grid, cold feel
`

// 11. MENSAJE - Simple Greeting
export const EFEMERIDE_MENSAJE_PROMPT = `
# Composition Type
Simple Greeting Card

# Visual Hierarchy
- **Primary**: Large, elegant greeting text ("¡Feliz Navidad!")
- **Secondary**: Subtle decorative backdrop or pattern
- **Tertiary**: Brand signature or from line

# Zoning Guide
- **Zone Greeting**: Central message as hero
- **Zone Pattern**: Background subtle decoration
- **Zone Signature**: Brand or sender identification

# Style Modifiers
- **Texture**: Elegant card stock, subtle texture
- **Lighting**: Soft, warm, inviting
- **Palette**: Occasion-appropriate colors with elegance

# Negative Constraints
- **Avoid**: Busy overwhelming design, hard to read text
`

export const EFEMERIDE_LAYOUTS: LayoutOption[] = [
    {
        id: 'efemeride-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    {
        id: 'efemeride-calendar',
        name: 'Calendario',
        description: 'Hoja Clásica',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="48" width="16" height="22" rx="6" fill="currentColor" fill-opacity="0.45" /><rect x="38" y="40" width="16" height="30" rx="6" fill="currentColor" fill-opacity="0.55" /><rect x="60" y="30" width="16" height="40" rx="6" fill="currentColor" fill-opacity="0.65" /><rect x="82" y="22" width="16" height="48" rx="6" fill="currentColor" fill-opacity="0.75" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Classic tear-off calendar page.',
        structuralPrompt: EFEMERIDE_CALENDARIO_PROMPT,
    },
    {
        id: 'efemeride-hero',
        name: 'Fecha',
        description: 'Tipografía',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Giant date numbers 3D typography.',
        structuralPrompt: EFEMERIDE_TIPOGRAFIA_PROMPT,
    },
    {
        id: 'efemeride-party',
        name: 'Fiesta',
        description: 'Confetti',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Explosion of confetti and balloons.',
        structuralPrompt: EFEMERIDE_FIESTA_PROMPT,
    },
    {
        id: 'efemeride-history',
        name: 'Historia',
        description: 'Vintage',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Antique frame with historical feel.',
        structuralPrompt: EFEMERIDE_HISTORICO_PROMPT,
    },
    {
        id: 'efemeride-neon',
        name: 'Neon',
        description: 'Noche',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="12" width="100" height="56" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="14" y="48" width="92" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /><rect x="14" y="26" width="60" height="10" rx="6" fill="currentColor" fill-opacity="0.5" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Glowing neon sign date.',
        structuralPrompt: EFEMERIDE_NEON_PROMPT,
    },
    {
        id: 'efemeride-seasonal',
        name: 'Estación',
        description: 'Naturaleza',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="104" height="64" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="18" y="18" width="84" height="44" rx="8" fill="currentColor" fill-opacity="0.15" /><rect x="24" y="24" width="60" height="14" rx="7" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Floral or seasonal border frame.',
        structuralPrompt: EFEMERIDE_ESTACIONAL_PROMPT,
    },
    {
        id: 'efemeride-bandera',
        name: 'Bandera',
        description: 'Patriótico',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="58" height="28" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="70" y="8" width="42" height="28" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="8" y="40" width="42" height="32" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="54" y="40" width="58" height="32" rx="8" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'National flag waving background.',
        structuralPrompt: EFEMERIDE_BANDERA_PROMPT,
    },
    {
        id: 'efemeride-religioso',
        name: 'Religioso',
        description: 'Solemne',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="40" height="64" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="52" y="8" width="60" height="30" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="52" y="42" width="28" height="30" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="84" y="42" width="28" height="30" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Sacred or religious iconography.',
        structuralPrompt: EFEMERIDE_RELIGIOSO_PROMPT,
    },
    {
        id: 'efemeride-countdown',
        name: 'Cuenta',
        description: 'Días Para...',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="12" y="14" width="96" height="16" rx="8" fill="currentColor" fill-opacity="0.6" /><rect x="22" y="34" width="86" height="16" rx="8" fill="currentColor" fill-opacity="0.45" /><rect x="32" y="54" width="76" height="16" rx="8" fill="currentColor" fill-opacity="0.3" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Days remaining countdown.',
        structuralPrompt: EFEMERIDE_COUNTDOWN_PROMPT,
    },
    {
        id: 'efemeride-collage',
        name: 'Collage',
        description: 'Recuerdos',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="14" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="30" y="20" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Photo collage of past events.',
        structuralPrompt: EFEMERIDE_COLLAGE_PROMPT,
    },
    {
        id: 'efemeride-mensaje',
        name: 'Carta',
        description: 'Saludo',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="12" y="14" width="96" height="52" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="18" y="18" width="84" height="44" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Simple elegant greeting card.',
        structuralPrompt: EFEMERIDE_MENSAJE_PROMPT,
    },
]
