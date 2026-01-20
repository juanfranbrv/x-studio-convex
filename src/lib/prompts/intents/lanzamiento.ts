/**
 * LANZAMIENTO - El Lanzamiento (Countdown, teaser, reveal)
 * Grupo: Promociones
 * 
 * Para teasers, countdowns, reveals y product drops.
 * Genera anticipación y misterio antes del lanzamiento.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const LANZAMIENTO_EXTENDED_DESCRIPTION = `
Para teasers, countdowns, reveals y product drops.
Genera anticipación y misterio antes del lanzamiento.
`.trim()

export const LANZAMIENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'headline',
        label: 'Título',
        placeholder: 'Ej: Algo grande viene...',
        type: 'text',
        required: true,
        aiContext: 'Teaser headline or announcement'
    },
    {
        id: 'date',
        label: 'Fecha de Lanzamiento',
        placeholder: 'Ej: 15 de Enero',
        type: 'text',
        required: false,
        aiContext: 'Launch date'
    },
    {
        id: 'cta',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: Únete a la lista de espera',
        type: 'text',
        required: false,
        aiContext: 'Call to action'
    }
]

// 1. COUNTDOWN - Timer Display
export const LANZAMIENTO_COUNTDOWN_PROMPT = `
<structural_instruction>
    <composition_type>Countdown Timer</composition_type>
    <visual_hierarchy>
        <primary>Massive countdown numbers (03:00, 10 DAYS) dominating center</primary>
        <secondary>Product silhouette or teaser glimpse in mysterious background</secondary>
        <tertiary>Release date and "Notify Me" CTA at bottom</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_header>"Coming Soon" teaser text at top</zone_header>
        <zone_timer>THE NUMBERS as hero element in center</zone_timer>
        <zone_cta>Date and notification button at bottom</zone_cta>
    </zoning_guide>
    <style_modifiers>
        <texture>Digital glitch, neon glow, or metallic 3D render</texture>
        <lighting>Cinematic backlighting, rim light on numbers</lighting>
        <palette>Dark mode with neon accents (cyan, magenta) or gold/black</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cluttered background, small numbers, fully visible product</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. CORTINA - Reveal with Cloth/Smoke
export const LANZAMIENTO_CORTINA_PROMPT = `
<structural_instruction>
    <composition_type>Product Reveal Curtain</composition_type>
    <visual_hierarchy>
        <primary>Object partially covered by silk cloth or emerging from dense smoke</primary>
        <secondary>Dramatic shaft of light revealing a specific detail</secondary>
        <tertiary>Minimal "Unveiling..." text floating in negative space</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_mystery>Center-weighted mysterious covered object</zone_mystery>
        <zone_reveal>Partially visible product detail</zone_reveal>
        <zone_text>Subtle text overlay</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Velvet, silk, smoke, shadows</texture>
        <lighting>Spotlight, chiaroscuro, high contrast drama</lighting>
        <palette>Monochrome with one accent color, luxury darks</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Full product visibility, flat lighting, bright cheerful colors</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. SILUETA - Backlit Silhouette
export const LANZAMIENTO_SILUETA_PROMPT = `
<structural_instruction>
    <composition_type>Silhouette Teaser</composition_type>
    <visual_hierarchy>
        <primary>Strong backlit silhouette of the new product/feature</primary>
        <secondary>Glowing rim light defining the shape</secondary>
        <tertiary>Bold headline text overlay centered</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_silhouette>Central dark shape with glowing edge</zone_silhouette>
        <zone_text>Typography interweaving with the shape</zone_text>
        <zone_glow>Atmospheric light behind</zone_glow>
    </zoning_guide>
    <style_modifiers>
        <texture>Atmospheric fog, gradients, sleek mystery</texture>
        <lighting>Strong backlighting, volumetric light rays</lighting>
        <palette>Deep blues, purples, or stark black and white</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Frontal flat lighting, visible details, plain white background</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. GLITCH - Tech Digital
export const LANZAMIENTO_GLITCH_PROMPT = `
<structural_instruction>
    <composition_type>Tech Glitch Reveal</composition_type>
    <visual_hierarchy>
        <primary>Product image with digital glitch effect or pixel sorting</primary>
        <secondary>Cyberpunk UI elements, loading bars, data streams</secondary>
        <tertiary>Monospaced typography "LOADING..." or "System Update"</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_distortion>Glitched visual field</zone_distortion>
        <zone_ui>Loading bar or progress indicator</zone_ui>
        <zone_text>Clear tech text layer</zone_text>
    </zoning_guide>
    <style_modifiers>
        <texture>Scanlines, pixels, chromatic aberration</texture>
        <lighting>Neon screens, HUD glow</lighting>
        <palette>Cyberpunk, matrix green, synthetic digital colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Organic shapes, vintage style, soft lighting</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. RASGADO - Torn Paper Reveal
export const LANZAMIENTO_RASGADO_PROMPT = `
<structural_instruction>
    <composition_type>Torn Paper Reveal</composition_type>
    <visual_hierarchy>
        <primary>Layer of paper/texture ripped open in the center</primary>
        <secondary>New product visible INSIDE the tear</secondary>
        <tertiary>"Secret" or old version text on outer paper layer</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_outer>Textured paper surface as mask</zone_outer>
        <zone_tear>The ripped opening hole</zone_tear>
        <zone_inner>The reveal inside the tear</zone_inner>
    </zoning_guide>
    <style_modifiers>
        <texture>Paper fiber, cardboard, realistic shadows on edges</texture>
        <lighting>Hard shadows from paper edge depth</lighting>
        <palette>Neutral outer paper, vibrant inner reveal</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat digital look, fake-looking shadows, no depth</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. CALENDARIO - Save the Date
export const LANZAMIENTO_CALENDARIO_PROMPT = `
<structural_instruction>
    <composition_type>Save The Date Calendar</composition_type>
    <visual_hierarchy>
        <primary>Stylized 3D calendar page or date block floating</primary>
        <secondary>Confetti or particles frozen around it</secondary>
        <tertiary>Event name or product title below the date</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_date>Floating date element as hero</zone_date>
        <zone_celebration>Particles and atmosphere around</zone_celebration>
        <zone_title>Event or product name below</zone_title>
    </zoning_guide>
    <style_modifiers>
        <texture>Matte plastic, soft shadows, airy feeling</texture>
        <lighting>Softbox studio lighting, pastel tones</lighting>
        <palette>Brand colors, high key brightness</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Traditional grid calendar, office vibes, boring</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. APERTURA - Box Opening
export const LANZAMIENTO_APERTURA_PROMPT = `
<structural_instruction>
    <composition_type>Mystery Box Opening</composition_type>
    <visual_hierarchy>
        <primary>Partially open box with light glowing from inside</primary>
        <secondary>Hands lifting the lid or box in mid-open state</secondary>
        <tertiary>"What's Inside?" or reveal teaser text</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_box>Premium packaging, partially open</zone_box>
        <zone_glow>Light source emanating from within</zone_glow>
        <zone_mystery>Hidden contents, not yet visible</zone_mystery>
    </zoning_guide>
    <style_modifiers>
        <texture>Premium packaging, unboxing experience</texture>
        <lighting>Dramatic inner glow, spotlight on box</lighting>
        <palette>Dark background, golden light from box</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Visible contents, cheap packaging, flat lighting</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. BLUR - Gradual Focus
export const LANZAMIENTO_BLUR_PROMPT = `
<structural_instruction>
    <composition_type>Blurred Mystery Reveal</composition_type>
    <visual_hierarchy>
        <primary>Heavily blurred product image suggesting shape but hiding detail</primary>
        <secondary>"Coming into focus soon" or sharpness metaphor</secondary>
        <tertiary>Date or countdown when full clarity arrives</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_blur>Central blurred product form</zone_blur>
        <zone_hint>Slight hints of color or shape</zone_hint>
        <zone_date>When clarity/reveal happens</zone_date>
    </zoning_guide>
    <style_modifiers>
        <texture>Heavy gaussian blur, depth of field effect</texture>
        <lighting>Suggests studio lighting through blur</lighting>
        <palette>Muted by blur, hints of product colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Recognizable product, too much clarity, no mystery</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. FRAGMENTADO - Puzzle Pieces
export const LANZAMIENTO_FRAGMENTADO_PROMPT = `
<structural_instruction>
    <composition_type>Puzzle Piece Reveal</composition_type>
    <visual_hierarchy>
        <primary>Product image fragmented into jigsaw or shattered pieces</primary>
        <secondary>Some pieces assembled, others floating into place</secondary>
        <tertiary>"Piece by piece" or assembly teaser messaging</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_assembled>Partially visible completed sections</zone_assembled>
        <zone_floating>Missing pieces moving toward center</zone_floating>
        <zone_message>Coming together teaser text</zone_message>
    </zoning_guide>
    <style_modifiers>
        <texture>3D puzzle pieces, shattered fragments</texture>
        <lighting>Studio lighting on complete sections</lighting>
        <palette>Product colors emerging from neutral fragments</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Complete image visible, flat 2D puzzle, no motion feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. ESPIRAL - Vortex Energy
export const LANZAMIENTO_ESPIRAL_PROMPT = `
<structural_instruction>
    <composition_type>Energy Vortex Emergence</composition_type>
    <visual_hierarchy>
        <primary>Spiral or vortex of energy converging on center</primary>
        <secondary>Product or logo emerging from the energy center</secondary>
        <tertiary>"Something powerful is coming" messaging</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_vortex>Spinning energy spiral filling frame</zone_vortex>
        <zone_center>Emergence point for product/reveal</zone_center>
        <zone_energy>Particles and light trails</zone_energy>
    </zoning_guide>
    <style_modifiers>
        <texture>Particle effects, energy streams, cosmic</texture>
        <lighting>Self-luminous energy, core glow</lighting>
        <palette>Electric blues, purples, energy colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static composition, no movement feel, boring center</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. MISTERIO - Question Mark Focus
export const LANZAMIENTO_MISTERIO_PROMPT = `
<structural_instruction>
    <composition_type>Mystery Question</composition_type>
    <visual_hierarchy>
        <primary>Large stylized question mark (?) as main visual</primary>
        <secondary>Teaser text hints about what's coming</secondary>
        <tertiary>Date or "Find out soon" call to action</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_question>Large ? symbol as hero</zone_question>
        <zone_hints>Subtle clues or teaser text</zone_hints>
        <zone_date>Reveal date or CTA</zone_date>
    </zoning_guide>
    <style_modifiers>
        <texture>Premium 3D ? mark, or neon typography</texture>
        <lighting>Dramatic spotlight on the question mark</lighting>
        <palette>Dark mystery backdrop, glowing question</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Revealed answers, too many clues, boring typography</avoid>
    </negative_constraints>
</structural_instruction>
`

export const LANZAMIENTO_DESCRIPTION = 'Teasers, countdowns y reveals. 11 composiciones para generar anticipación.'
