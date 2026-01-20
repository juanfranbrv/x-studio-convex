/**
 * ESCAPARATE - El Escaparate (Producto protagonista)
 * Grupo: Vender
 * 
 * Intent para showcase de productos. Diseñado para e-commerce, catálogos
 * y publicaciones donde el producto es el absoluto protagonista visual.
 */

import type { LayoutOption, IntentRequiredField } from '@/lib/creation-flow-types'

export const ESCAPARATE_DESCRIPTION = 'Diseño centrado en producto. 12 composiciones profesionales desde estudio clásico hasta lifestyle.'
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
# Composition Type
Classic Studio Hero Shot

# Visual Hierarchy
- **Primary**: The [PRODUCT] perfectly lit on an infinite sweep background
- **Secondary**: Reflection on glossy floor surface creating depth
- **Tertiary**: Subtle gradient lighting from one side

# Zoning Guide
- **Zone Product**: Center-weighted, product occupies 50-70% of frame
- **Zone Info**: Clean lower third reserved for text
- **Zone Negative**: Ample breathing room on sides

# Style Modifiers
- **Texture**: Flawless product surface, no dust
- **Lighting**: Three-point studio lighting (key, fill, rim)
- **Palette**: Neutral background (white, gray, black)

# Negative Constraints
- **Avoid**: Harsh shadows, color casts, cluttered props
`

// 2. PODIO - Elevated Pedestal Display
export const ESCAPARATE_PODIO_PROMPT = `
# Composition Type
Elevated Pedestal Display

# Visual Hierarchy
- **Primary**: The [PRODUCT] elevated on a geometric podium
- **Secondary**: Dramatic lighting casting long shadows
- **Tertiary**: Thematic props floating or arranged at base

# Zoning Guide
- **Zone Stage**: Product on elevated platform
- **Zone Props**: Supporting elements arranged around base
- **Zone Backdrop**: Gradient or solid color background

# Style Modifiers
- **Texture**: Matte or glossy podium, raw materials props
- **Lighting**: Single dramatic spotlight
- **Palette**: Monochromatic base with brand accent highlights

# Negative Constraints
- **Avoid**: Cheap plastic look, cluttered stage
`

// 3. FLOTANTE - Levitating Product
export const ESCAPARATE_FLOTANTE_PROMPT = `
# Composition Type
Levitating Product Hero

# Visual Hierarchy
- **Primary**: The [PRODUCT] suspended in mid-air
- **Secondary**: Soft shadow cast below indicating levitation
- **Tertiary**: Subtle particles or light rays

# Zoning Guide
- **Zone Float**: Product centered vertically with negative space
- **Zone Shadow**: Drop shadow or reflection offset below
- **Zone Atmosphere**: Volumetric light or particles

# Style Modifiers
- **Texture**: Ultra-clean product surfaces, magical atmosphere
- **Lighting**: Rim lighting emphasizing silhouette
- **Palette**: Deep dark backgrounds or gradient voids

# Negative Constraints
- **Avoid**: Visible supports, unnatural angles
`

// 4. CONTEXTO - Lifestyle In-Use
export const ESCAPARATE_CONTEXTO_PROMPT = `
# Composition Type
Contextual Lifestyle Shot

# Visual Hierarchy
- **Primary**: The [PRODUCT] naturally integrated into real world
- **Secondary**: Environmental elements telling a story
- **Tertiary**: Atmospheric lighting matching context

# Zoning Guide
- **Zone Product**: Product in natural use position
- **Zone Context**: Environmental details
- **Zone Depth**: Background blur (bokeh)

# Style Modifiers
- **Texture**: Authentic materials, lived-in feel
- **Lighting**: Natural or practical lights (window, sun)
- **Palette**: Earth tones, lifestyle color grading

# Negative Constraints
- **Avoid**: Sterile studio feel, forced placement
`

// 5. MACRO - Close-Up Detail
export const ESCAPARATE_MACRO_PROMPT = `
# Composition Type
Extreme Close-Up Detail Shot

# Visual Hierarchy
- **Primary**: Macro view of most impressive detail/texture
- **Secondary**: Shallow depth of field bokeh
- **Tertiary**: Subtle context hints

# Zoning Guide
- **Zone Focus**: Ultra-sharp focal plane on hero detail
- **Zone Transition**: Gradual focus fall-off
- **Zone Context**: Edge of frame hints at full object

# Style Modifiers
- **Texture**: Hyper-detailed surface rendering
- **Lighting**: Side lighting strictly for texture
- **Palette**: True-to-material colors

# Negative Constraints
- **Avoid**: Too abstract, noisy/grainy, flat lighting
`

// 6. SPLASH - Dynamic Motion
export const ESCAPARATE_SPLASH_PROMPT = `
# Composition Type
Dynamic Splash/Motion Freeze

# Visual Hierarchy
- **Primary**: The [PRODUCT] caught mid-action (splash/explode)
- **Secondary**: Frozen droplets or particles suspended
- **Tertiary**: Motion trails or speed lines

# Zoning Guide
- **Zone Impact**: Point of action at visual center
- **Zone Particles**: Splash radiating outward
- **Zone Direction**: Diagonal or spiral flow

# Style Modifiers
- **Texture**: Crystal-clear liquid/particles
- **Lighting**: High-speed flash freeze, high contrast
- **Palette**: High saturation, energetic colors

# Negative Constraints
- **Avoid**: Static boring composition, messy chaos
`

// 7. ESPEJO - Mirror/Reflection
export const ESCAPARATE_ESPEJO_PROMPT = `
# Composition Type
Mirror Reflection Composition

# Visual Hierarchy
- **Primary**: The [PRODUCT] and its perfect reflection
- **Secondary**: Subtle infinity effect or gradient fade
- **Tertiary**: Clean horizon line separating them

# Zoning Guide
- **Zone Real**: Upper 60% contains actual product
- **Zone Reflection**: Lower 40% mirrored image
- **Zone Horizon**: Seperation line

# Style Modifiers
- **Texture**:  Ultra-glossy reflective surface
- **Lighting**: Minimal, focus on reflection highlights
- **Palette**: Dark, luxurious backgrounds

# Negative Constraints
- **Avoid**: Distorted reflections, surface imperfections
`

// 8. CAPAS - Layered Arrangement
export const ESCAPARATE_CAPAS_PROMPT = `
# Composition Type
Layered Depth Arrangement

# Visual Hierarchy
- **Primary**: Multiple components/instances in depth layers
- **Secondary**: Foreground blur framing hero
- **Tertiary**: Background elements creating variety

# Zoning Guide
- **Zone Foreground**: Blurred partial product framing
- **Zone Hero**: Main sharp product in middle ground
- **Zone Background**: Supporting progressive blur

# Style Modifiers
- **Texture**: Consistent finish across layers
- **Lighting**: Graduated lighting, hero brightest
- **Palette**: Color variations or monochrome

# Negative Constraints
- **Avoid**: Confusing focus, flat arrangement
`

// 9. FLAT - Flat Lay Knolling
export const ESCAPARATE_FLAT_PROMPT = `
# Composition Type
Top-Down Flat Lay (Knolling)

# Visual Hierarchy
- **Primary**: The [PRODUCT] from above, perfectly organized
- **Secondary**: Accessories arranged with geometric precision
- **Tertiary**: Textured background surface

# Zoning Guide
- **Zone Hero**: Main product centered or offset
- **Zone Accessories**: Items in 90-degree grid
- **Zone Negative**: Precise spacing between elements

# Style Modifiers
- **Texture**: Tactile materials, patterns visible
- **Lighting**: Soft diffused overhead light
- **Palette**: Curated color palette, organized

# Negative Constraints
- **Avoid**: Messy, tilted angles, overlapping
`

// 10. SILUETA - Dramatic Silhouette
export const ESCAPARATE_SILUETA_PROMPT = `
# Composition Type
Dramatic Backlit Silhouette

# Visual Hierarchy
- **Primary**: Bold silhouette against bright backdrop
- **Secondary**: Rim lighting outlining edges
- **Tertiary**: Gradient atmosphere background

# Zoning Guide
- **Zone Silhouette**: Product recognizable iconic shape
- **Zone Glow**: Intense light behind
- **Zone Atmosphere**: Color gradient filling background

# Style Modifiers
- **Texture**: Sharp defined edges, iconic shape
- **Lighting**: Strong backlight, high contrast
- **Palette**: Bold gradient backgrounds (sunset, neon)

# Negative Constraints
- **Avoid**: Unrecognizable shape, washed out
`

// 11. PACK - Product Family/Collection
export const ESCAPARATE_PACK_PROMPT = `
# Composition Type
Product Family Collection Display

# Visual Hierarchy
- **Primary**: Hero [PRODUCT] centrally positioned
- **Secondary**: Family variants flanking hero
- **Tertiary**: Unifying visual connection

# Zoning Guide
- **Zone Hero**: Central product dominant scale
- **Zone Family**: Supporting products left/right
- **Zone Unity**: Shared ground plane

# Style Modifiers
- **Texture**: Consistent quality across products
- **Lighting**: Even lighting, hero slightly brighter
- **Palette**: Variety within unified brand aesthetic

# Negative Constraints
- **Avoid**: Chaotic, no hierarchy, disconnected
`

export const ESCAPARATE_LAYOUTS: LayoutOption[] = [
    {
        id: 'escaparate-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'Sparkles',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    {
        id: 'escaparate-estudio',
        name: 'Estudio',
        description: 'Fotografía clásica',
        svgIcon: 'Target',
        textZone: 'bottom',
        promptInstruction: 'Classic studio hero shot with infinite sweep background.',
        structuralPrompt: ESCAPARATE_ESTUDIO_PROMPT,
    },
    {
        id: 'escaparate-podio',
        name: 'Podio',
        description: 'Pedestal elegante',
        svgIcon: 'Box',
        textZone: 'bottom',
        promptInstruction: 'Product elevated on geometric podium with thematic props.',
        structuralPrompt: ESCAPARATE_PODIO_PROMPT,
    },
    {
        id: 'escaparate-flotante',
        name: 'Flotante',
        description: 'Levitación',
        svgIcon: 'Wind',
        textZone: 'bottom',
        promptInstruction: 'Product suspended in mid-air with soft shadow below.',
        structuralPrompt: ESCAPARATE_FLOTANTE_PROMPT,
    },
    {
        id: 'escaparate-contexto',
        name: 'Contexto',
        description: 'Lifestyle',
        svgIcon: 'Sun',
        textZone: 'center',
        promptInstruction: 'Product integrated naturally into a real-world setting.',
        structuralPrompt: ESCAPARATE_CONTEXTO_PROMPT,
    },
    {
        id: 'escaparate-macro',
        name: 'Macro',
        description: 'Primerísimo plano',
        svgIcon: 'ZoomIn',
        textZone: 'bottom',
        promptInstruction: 'Extreme macro close-up of product details.',
        structuralPrompt: ESCAPARATE_MACRO_PROMPT,
    },
    {
        id: 'escaparate-splash',
        name: 'Splash',
        description: 'Dinámico',
        svgIcon: 'Droplets',
        textZone: 'center',
        promptInstruction: 'Dynamic splash or motion freeze mid-action.',
        structuralPrompt: ESCAPARATE_SPLASH_PROMPT,
    },
    {
        id: 'escaparate-espejo',
        name: 'Espejo',
        description: 'Reflejo',
        svgIcon: 'Copy',
        textZone: 'bottom',
        promptInstruction: 'Product with perfect reflection on glossy surface.',
        structuralPrompt: ESCAPARATE_ESPEJO_PROMPT,
    },
    {
        id: 'escaparate-capas',
        name: 'Capas',
        description: 'Profundidad',
        svgIcon: 'Layers',
        textZone: 'center',
        promptInstruction: 'Layered arrangement with foreground blur.',
        structuralPrompt: ESCAPARATE_CAPAS_PROMPT,
    },
    {
        id: 'escaparate-flat',
        name: 'Flat Lay',
        description: 'Cenital',
        svgIcon: 'Grid',
        textZone: 'center',
        promptInstruction: 'Top-down organized knolling layout.',
        structuralPrompt: ESCAPARATE_FLAT_PROMPT,
    },
    {
        id: 'escaparate-silueta',
        name: 'Silueta',
        description: 'Contraluz',
        svgIcon: 'Moon',
        textZone: 'center',
        promptInstruction: 'Dramatic backlit silhouette against bright background.',
        structuralPrompt: ESCAPARATE_SILUETA_PROMPT,
    },
    {
        id: 'escaparate-pack',
        name: 'Pack',
        description: 'Colección',
        svgIcon: 'Package', // Changed from Packages (assuming Lucide Package)
        textZone: 'bottom',
        promptInstruction: 'Product family collection with hero centered.',
        structuralPrompt: ESCAPARATE_PACK_PROMPT,
    },
]
