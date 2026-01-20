/**
 * ESCAPARATE - El Escaparate (Producto protagonista)
 * Grupo: Vender
 * 
 * Intent para showcase de productos. Diseñado para e-commerce, catálogos
 * y publicaciones donde el producto es el absoluto protagonista visual.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const ESCAPARATE_EXTENDED_DESCRIPTION = `
Perfecto para destacar un producto estrella o novedad. El diseño coloca 
el producto como absoluto protagonista con fondo limpio y espacio para 
precio o claim breve. Ideal para e-commerce y catálogos.
`.trim()

export const ESCAPARATE_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'product_name',
        label: 'Nombre del Producto',
        placeholder: 'Ej: Zapatillas Air Max Pro',
        type: 'text',
        required: true,
        aiContext: 'The main product name to feature'
    },
    {
        id: 'price',
        label: 'Precio (opcional)',
        placeholder: 'Ej: 149€',
        type: 'text',
        required: false,
        aiContext: 'Product price if applicable'
    },
    {
        id: 'tagline',
        label: 'Tagline / Claim',
        placeholder: 'Ej: Comodidad sin límites',
        type: 'text',
        required: false,
        aiContext: 'Short product tagline or benefit'
    }
]

// 1. ESTUDIO - Classic Studio Photography
export const ESCAPARATE_ESTUDIO_PROMPT = `
<structural_instruction>
    <composition_type>Classic Studio Hero Shot</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] perfectly lit on an infinite sweep background (cyclorama)</primary>
        <secondary>Reflection on glossy floor surface creating depth</secondary>
        <tertiary>Subtle gradient lighting from one side creating dimensional modeling</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_product>Center-weighted, product occupies 50-70% of the frame height</zone_product>
        <zone_info>Clean lower third reserved for product name and price</zone_info>
        <zone_negative>Ample breathing room on sides for premium feel</zone_negative>
    </zoning_guide>
    <style_modifiers>
        <texture>Flawless product surface, no dust or imperfections</texture>
        <lighting>Three-point studio lighting: key, fill, and rim/hair light</lighting>
        <palette>Neutral background (white, light gray, or black) letting product colors pop</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Harsh shadows, color casts, cluttered props, busy backgrounds</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. PODIO - Elevated Pedestal Display
export const ESCAPARATE_PODIO_PROMPT = `
<structural_instruction>
    <composition_type>Elevated Pedestal Display</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] elevated on a geometric podium (cylinder, hexagon, or marble block)</primary>
        <secondary>Dramatic lighting casting long shadows from the pedestal</secondary>
        <tertiary>Thematic props floating or arranged at the base (leaves, stones, abstract shapes)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_stage>Product on elevated platform in the golden ratio intersection</zone_stage>
        <zone_props>Supporting elements arranged in triangular composition around base</zone_props>
        <zone_backdrop>Gradient or solid color background with subtle depth cues</zone_backdrop>
    </zoning_guide>
    <style_modifiers>
        <texture>Matte or glossy podium, raw natural materials as props</texture>
        <lighting>Single dramatic spotlight from above or side, theatrical feel</lighting>
        <palette>Monochromatic base with brand accent color highlights</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Cheap plastic look, cluttered stage, competing focal points</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. FLOTANTE - Levitating Product
export const ESCAPARATE_FLOTANTE_PROMPT = `
<structural_instruction>
    <composition_type>Levitating Product Hero</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] suspended in mid-air, defying gravity</primary>
        <secondary>Soft shadow cast below indicating true levitation</secondary>
        <tertiary>Subtle particles, dust motes, or light rays around the floating object</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_float>Product centered vertically with equal negative space above and below</zone_float>
        <zone_shadow>Drop shadow or reflection directly beneath, slightly offset</zone_shadow>
        <zone_atmosphere>Volumetric light or particles in the background adding depth</zone_atmosphere>
    </zoning_guide>
    <style_modifiers>
        <texture>Ultra-clean product surfaces, magical ethereal atmosphere</texture>
        <lighting>Rim lighting emphasizing the floating silhouette</lighting>
        <palette>Deep dark backgrounds or gradient voids for dramatic contrast</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Visible supports, unnatural angles, flat 2D cutout appearance</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. CONTEXTO - Lifestyle In-Use
export const ESCAPARATE_CONTEXTO_PROMPT = `
<structural_instruction>
    <composition_type>Contextual Lifestyle Shot</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] naturally integrated into a real-world setting</primary>
        <secondary>Environmental elements that tell a story (hands, surfaces, ambient objects)</secondary>
        <tertiary>Atmospheric lighting matching the context (morning light, cozy evening, outdoor)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_product>Product in natural use position, rule of thirds placement</zone_product>
        <zone_context>Environmental details filling 40-50% of frame</zone_context>
        <zone_depth>Background blur (bokeh) creating focus on product area</zone_depth>
    </zoning_guide>
    <style_modifiers>
        <texture>Authentic materials (wood, fabric, skin textures), lived-in feel</texture>
        <lighting>Natural or practical lighting, golden hour warmth or soft window light</lighting>
        <palette>Earth tones, lifestyle color grading, Instagram-worthy aesthetic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Sterile studio feel, forced product placement, busy distracting backgrounds</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. MACRO - Close-Up Detail
export const ESCAPARATE_MACRO_PROMPT = `
<structural_instruction>
    <composition_type>Extreme Close-Up Detail Shot</composition_type>
    <visual_hierarchy>
        <primary>Macro view of the [PRODUCT]'s most impressive detail, texture, or craftsmanship</primary>
        <secondary>Shallow depth of field with beautiful bokeh transition</secondary>
        <tertiary>Subtle context showing what part of the product we're viewing</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_focus>Ultra-sharp focal plane on the hero detail (stitching, logo, material grain)</zone_focus>
        <zone_transition>Gradual focus fall-off creating depth layers</zone_transition>
        <zone_context>Edge of frame hints at the full product silhouette</zone_context>
    </zoning_guide>
    <style_modifiers>
        <texture>Hyper-detailed surface rendering, tactile quality you can almost feel</texture>
        <lighting>Side lighting to emphasize surface texture and micro-details</lighting>
        <palette>True-to-material colors, enhanced clarity and micro-contrast</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Too abstract (unidentifiable), noisy/grainy texture, flat lighting</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. SPLASH - Dynamic Motion
export const ESCAPARATE_SPLASH_PROMPT = `
<structural_instruction>
    <composition_type>Dynamic Splash/Motion Freeze</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] caught mid-action: falling, splashing, or exploding outward</primary>
        <secondary>Frozen droplets, particles, or fragments suspended in time</secondary>
        <tertiary>Motion trails or speed lines indicating the direction of movement</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_impact>Point of action at visual center or golden intersection</zone_impact>
        <zone_particles>Splash elements radiating outward in natural physics pattern</zone_particles>
        <zone_direction>Diagonal or spiral flow guiding the eye through the chaos</zone_direction>
    </zoning_guide>
    <style_modifiers>
        <texture>Crystal-clear water/liquid, high-speed photography aesthetics</texture>
        <lighting>High-speed flash freeze, dramatic rim lighting, high contrast</lighting>
        <palette>High saturation, energetic colors, sports/energy drink vibes</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static boring composition, unclear product visibility, messy non-directional chaos</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. ESPEJO - Mirror/Reflection
export const ESCAPARATE_ESPEJO_PROMPT = `
<structural_instruction>
    <composition_type>Mirror Reflection Composition</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] with its perfect reflection on a mirror-like surface</primary>
        <secondary>Subtle infinity effect or gradient fade in the reflection</secondary>
        <tertiary>Clean horizon line separating product from reflection</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_real>Upper 60% contains the actual product, sharply focused</zone_real>
        <zone_reflection>Lower 40% shows the mirrored image with slight blur or fade</zone_reflection>
        <zone_horizon>Diagonal or perfectly horizontal separation line</zone_horizon>
    </zoning_guide>
    <style_modifiers>
        <texture>Ultra-glossy reflective surface (black acrylic, water, glass)</texture>
        <lighting>Minimal, focused on product with reflection catching highlights</lighting>
        <palette>Dark, luxurious backgrounds emphasizing the mirror effect</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Distorted reflections, visible surface imperfections, competing reflections</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. CAPAS - Layered Arrangement
export const ESCAPARATE_CAPAS_PROMPT = `
<structural_instruction>
    <composition_type>Layered Depth Arrangement</composition_type>
    <visual_hierarchy>
        <primary>Multiple instances or components of the [PRODUCT] arranged in depth layers</primary>
        <secondary>Foreground blur element framing the sharp hero product</secondary>
        <tertiary>Background products or elements creating depth and variety</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_foreground>Blurred partial product or element creating frame (15% frame)</zone_foreground>
        <zone_hero>Main sharp product in the middle ground (rule of thirds)</zone_hero>
        <zone_background>Supporting products or context with progressive blur</zone_background>
    </zoning_guide>
    <style_modifiers>
        <texture>Consistent product finish across all layers</texture>
        <lighting>Graduated lighting with hero brightest, layers progressively dimmer</lighting>
        <palette>Color variations showing product range, or monochrome elegance</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Confusing which is the hero, equal focus across layers, flat arrangement</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. FLAT - Flat Lay Knolling
export const ESCAPARATE_FLAT_PROMPT = `
<structural_instruction>
    <composition_type>Top-Down Flat Lay (Knolling)</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] viewed from directly above, perfectly organized</primary>
        <secondary>Complementary accessories or components arranged with geometric precision</secondary>
        <tertiary>Textured background surface (marble, wood, fabric, concrete)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hero>Main product centered or offset following golden ratio</zone_hero>
        <zone_accessories>Supporting items arranged in 90-degree grid alignment</zone_accessories>
        <zone_negative>Precise spacing between elements for breathing room</zone_negative>
    </zoning_guide>
    <style_modifiers>
        <texture>Tactile materials, surface textures visible from bird's eye view</texture>
        <lighting>Soft diffused top-down lighting, minimal shadows</lighting>
        <palette>Curated color palette, editorial organization aesthetic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Messy random placement, tilted angles, overlapping items, cluttered look</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. SILUETA - Dramatic Silhouette
export const ESCAPARATE_SILUETA_PROMPT = `
<structural_instruction>
    <composition_type>Dramatic Backlit Silhouette</composition_type>
    <visual_hierarchy>
        <primary>The [PRODUCT] as a bold silhouette against a bright or colorful backdrop</primary>
        <secondary>Rim lighting or halo effect outlining the product edges</secondary>
        <tertiary>Gradient or atmospheric background adding mood and color</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_silhouette>Product centered, recognizable iconic shape taking focus</zone_silhouette>
        <zone_glow>Intense light source directly behind creating the rim effect</zone_glow>
        <zone_atmosphere>Color gradient or texture filling the bright background</zone_atmosphere>
    </zoning_guide>
    <style_modifiers>
        <texture>Sharp defined edges, iconic product shape recognition</texture>
        <lighting>Strong backlight, dramatic rim/edge lighting, high contrast</lighting>
        <palette>Bold gradient backgrounds (sunset, neon, brand colors)</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unrecognizable shape, washed-out silhouette, flat boring background</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. PACK - Product Family/Collection
export const ESCAPARATE_PACK_PROMPT = `
<structural_instruction>
    <composition_type>Product Family Collection Display</composition_type>
    <visual_hierarchy>
        <primary>Hero [PRODUCT] centrally positioned, slightly larger or elevated</primary>
        <secondary>Family variants or collection items flanking the hero in hierarchy</secondary>
        <tertiary>Unifying visual element connecting the collection (line, shadow, surface)</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hero>Central product with dominant scale (1.2x larger)</zone_hero>
        <zone_family>Supporting products in decreasing hierarchy left and right</zone_family>
        <zone_unity>Shared ground plane or visual connector establishing collection</zone_unity>
    </zoning_guide>
    <style_modifiers>
        <texture>Consistent finish and quality across all products</texture>
        <lighting>Even lighting with hero slightly brighter, cohesive look</lighting>
        <palette>Color range showing variety within the unified brand aesthetic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Chaotic arrangement, equal sizing (no hero), disconnected grouping</avoid>
    </negative_constraints>
</structural_instruction>
`

export const ESCAPARATE_DESCRIPTION = 'Diseño centrado en producto. 11 composiciones profesionales desde estudio clásico hasta lifestyle y arte conceptual.'
