/**
 * CATALOGO - El Catálogo (Colecciones y grids)
 * Grupo: Productos
 * 
 * Para colecciones de productos, lookbooks y grids organizados.
 * Muestra múltiples ítems en layouts estructurados.
 */

import type { LayoutOption, IntentRequiredField } from '@/lib/creation-flow-types'

export const CATALOGO_DESCRIPTION = 'Catálogos y colecciones de producto. 12 composiciones para mostrar múltiples ítems.'
export const CATALOGO_EXTENDED_DESCRIPTION = `
Para colecciones de productos, lookbooks y grids organizados.
Muestra múltiples ítems en layouts estructurados.
`.trim()

export const CATALOGO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'collection_name',
        label: 'Nombre de la Colección',
        placeholder: 'Ej: Colección Primavera 2024',
        type: 'text',
        required: true,
        aiContext: 'Collection or catalog name'
    },
    {
        id: 'items',
        label: 'Número de Productos',
        placeholder: 'Ej: 4',
        type: 'text',
        required: false,
        aiContext: 'How many items in the catalog'
    },
    {
        id: 'style',
        label: 'Estilo',
        placeholder: 'Ej: Minimalista, Editorial',
        type: 'text',
        required: false,
        aiContext: 'Visual style of the catalog'
    }
]

// 1. REJILLA - Classic Product Grid
export const CATALOGO_REJILLA_PROMPT = `
# Composition Type
Classic Product Grid

# Visual Hierarchy
- **Primary**: Clean, symmetrical 2x2 or 3x3 grid of products
- **Secondary**: Uniform background color for all items
- **Tertiary**: Minimal text labels under each item

# Zoning Guide
- **Zone Grid**: Evenly distributed product array
- **Zone Labels**: Optional price or name under each
- **Zone Title**: Collection title above grid

# Style Modifiers
- **Texture**: Studio photography, seamless backgrounds
- **Lighting**: Uniform softbox lighting across all items
- **Palette**: Neutral white or pastel background, products pop

# Negative Constraints
- **Avoid**: Random angles, mismatched lighting, visual clutter
`

// 2. EDITORIAL - Lookbook Spread
export const CATALOGO_EDITORIAL_PROMPT = `
# Composition Type
Editorial Lookbook Spread

# Visual Hierarchy
- **Primary**: One large hero lifestyle image (dominant)
- **Secondary**: Two-three smaller product detail shots on side
- **Tertiary**: Elegant serif title "Collection Name"

# Zoning Guide
- **Zone Hero**: Large lifestyle/context image (60-70%)
- **Zone Details**: Column of smaller detail shots
- **Zone Title**: Collection branding

# Style Modifiers
- **Texture**: Magazine glossy paper, high fashion
- **Lighting**: Natural sunlight with studio fill
- **Palette**: Sophisticated, tonal, cohesive color story

# Negative Constraints
- **Avoid**: Boring grid only, low quality, cheap catalog feel
`

// 3. MOSAICO - Dynamic Masonry
export const CATALOGO_MOSAICO_PROMPT = `
# Composition Type
Dynamic Masonry Collage

# Visual Hierarchy
- **Primary**: Interlocking masonry layout with varied aspect ratios
- **Secondary**: Mix of portrait and landscape images tightly packed
- **Tertiary**: Small badges or tags on select featured images

# Zoning Guide
- **Zone Mosaic**: Pinterest-style tightly packed images
- **Zone Featured**: Larger cells for hero products
- **Zone Tags**: Optional "New" or "Sale" badges

# Style Modifiers
- **Texture**: Pinterest aesthetic, vibrant, lifestyle
- **Lighting**: Mixed but high quality sources
- **Palette**: Colorful, energetic, varied

# Negative Constraints
- **Avoid**: Gaps between images, overlapping chaos, low resolution
`

// 4. ESTANTERÍA - Retail Shelf Display
export const CATALOGO_ESTANTERIA_PROMPT = `
# Composition Type
Retail Shelf Display

# Visual Hierarchy
- **Primary**: Products arranged neatly on floating shelves
- **Secondary**: Soft shadows cast on the wall behind
- **Tertiary**: Decor elements (plants, books) styling the display

# Zoning Guide
- **Zone Shelves**: Horizontal shelf lines across composition
- **Zone Products**: Products arranged on each shelf
- **Zone Decor**: Lifestyle styling elements

# Style Modifiers
- **Texture**: Interior design, wood or metal shelves
- **Lighting**: Warm interior spot lighting
- **Palette**: Neutral wall, colorful products as focus

# Negative Constraints
- **Avoid**: Grocery store metal racks, bad perspective, cluttered
`

// 5. COLORES - Color Variant Series
export const CATALOGO_COLORES_PROMPT = `
# Composition Type
Color Variation Series

# Visual Hierarchy
- **Primary**: Same product repeated in multiple color options
- **Secondary**: Pop art repetition layout (Andy Warhol style)
- **Tertiary**: Bold color backgrounds matching each variant

# Zoning Guide
- **Zone Grid**: Repeated product matrix
- **Zone Colors**: Distinct background per color variant
- **Zone Message**: "Available in X colors" optional text

# Style Modifiers
- **Texture**: Plastic, glossy, vibrant color explosion
- **Lighting**: Hard high-contrast studio flash
- **Palette**: Rainbow matrix, monochrome per cell

# Negative Constraints
- **Avoid**: Subtle hues, boring grey, inconsistent angles
`

// 6. DETALLE - Zoom Detail Focus
export const CATALOGO_DETALLE_PROMPT = `
# Composition Type
Macro Detail Focus

# Visual Hierarchy
- **Primary**: Main full product shot in center
- **Secondary**: Circular magnifying glass overlays showing texture details
- **Tertiary**: Dotted lines connecting zoom bubbles to source

# Zoning Guide
- **Zone Product**: Main product in center
- **Zone Zooms**: Detail bubble callouts in corners
- **Zone Lines**: Connection indicators

# Style Modifiers
- **Texture**: High resolution macro photography
- **Lighting**: Clean crisp scientific lighting
- **Palette**: Clean white background, focus on textures

# Negative Constraints
- **Avoid**: Blurry textures, fake-looking loupes, low res
`

// 7. FLAT_LAY - Top Down Arrangement
export const CATALOGO_FLATLAY_PROMPT = `
# Composition Type
Flat Lay Top-Down Collection

# Visual Hierarchy
- **Primary**: Top-down view of multiple products artfully arranged
- **Secondary**: Props and styling elements (leaves, fabric, accessories)
- **Tertiary**: Subtle brand elements or collection tag

# Zoning Guide
- **Zone Products**: Multiple items spread across surface
- **Zone Props**: Lifestyle styling elements
- **Zone Negative**: Strategic breathing room between items

# Style Modifiers
- **Texture**: Instagram flat lay, lifestyle photography
- **Lighting**: Soft overhead natural or studio
- **Palette**: Cohesive color story across all items

# Negative Constraints
- **Avoid**: Random chaotic pile, bad shadows, crowded
`

// 8. COMPARATIVO - Side by Side
export const CATALOGO_COMPARATIVO_PROMPT = `
# Composition Type
Side-by-Side Product Comparison

# Visual Hierarchy
- **Primary**: Two or three products aligned for direct comparison
- **Secondary**: Feature callouts or labels for each
- **Tertiary**: "Compare" or size/spec indicators

# Zoning Guide
- **Zone Products**: Aligned products in a row
- **Zone Specs**: Feature labels per product
- **Zone Comparison**: Connecting or distinguishing elements

# Style Modifiers
- **Texture**: Clean product photography, comparison layout
- **Lighting**: Consistent across all products for fair comparison
- **Palette**: Neutral background, products differentiated by their colors

# Negative Constraints
- **Avoid**: Unequal treatment, biased sizes, unclear comparison
`

// 9. CARRUSEL - Carousel Preview
export const CATALOGO_CARRUSEL_PROMPT = `
# Composition Type
Carousel Swipe Collection

# Visual Hierarchy
- **Primary**: Central product card with peeking edges of adjacent items
- **Secondary**: Swipe or slide indicators (dots, arrows)
- **Tertiary**: Collection title and "Swipe to see more"

# Zoning Guide
- **Zone Main**: Central visible product card
- **Zone Peek**: Partial edges of next/previous cards
- **Zone Nav**: Pagination dots or swipe indicator

# Style Modifiers
- **Texture**: Mobile-native, Stories/carousel aesthetic
- **Lighting**: Spotlight on main, dimmed on sides
- **Palette**: Consistent card design, varied products

# Negative Constraints
- **Avoid**: Static single product, no carousel feel, equal visibility
`

// 10. LIFESTYLE - Products in Context
export const CATALOGO_LIFESTYLE_PROMPT = `
# Composition Type
Lifestyle Context Collection

# Visual Hierarchy
- **Primary**: Products shown in natural use environment/scene
- **Secondary**: Human interaction or lifestyle context
- **Tertiary**: Brand or collection watermark

# Zoning Guide
- **Zone Scene**: Lifestyle environment as backdrop
- **Zone Products**: Products integrated naturally in scene
- **Zone Context**: Human element or usage demonstration

# Style Modifiers
- **Texture**: Editorial lifestyle photography
- **Lighting**: Natural environment lighting
- **Palette**: Real-world colors, brand-coordinated

# Negative Constraints
- **Avoid**: White background isolation, stock photo feel, products hidden
`

// 11. HERO - Single Product Hero
export const CATALOGO_HERO_PROMPT = `
# Composition Type
Hero Product Spotlight

# Visual Hierarchy
- **Primary**: Single featured product as absolute hero center stage
- **Secondary**: Dramatic lighting and shadow play
- **Tertiary**: Collection name or "Star of the collection" badge

# Zoning Guide
- **Zone Product**: Center stage single product hero
- **Zone Lighting**: Dramatic shadow and highlight areas
- **Zone Badge**: Featured or star product indicator

# Style Modifiers
- **Texture**: Premium product photography
- **Lighting**: Dramatic studio lighting, hero treatment
- **Palette**: Dark backdrop, spotlight on product

# Negative Constraints
- **Avoid**: Multiple products competing, flat lighting, lost focus
`

export const CATALOGO_LAYOUTS: LayoutOption[] = [
    {
        id: 'catalogo-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'help_center',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    {
        id: 'catalogo-grid',
        name: 'Grid',
        description: 'Producto 2x2',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Structured 2x2 product grid.',
        structuralPrompt: CATALOGO_REJILLA_PROMPT,
    },
    {
        id: 'catalogo-lookbook',
        name: 'Lookbook',
        description: 'Editorial',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Editorial lookbook spread.',
        structuralPrompt: CATALOGO_EDITORIAL_PROMPT,
    },
    {
        id: 'catalogo-masonry',
        name: 'Mosaico',
        description: 'Collage',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="14" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.35" /><rect x="30" y="20" width="70" height="50" rx="10" fill="currentColor" fill-opacity="0.55" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Dynamic masonry collage.',
        structuralPrompt: CATALOGO_MOSAICO_PROMPT,
    },
    {
        id: 'catalogo-shelf',
        name: 'Estante',
        description: 'Retail',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Products on floating shelves.',
        structuralPrompt: CATALOGO_ESTANTERIA_PROMPT,
    },
    {
        id: 'catalogo-variants',
        name: 'Colores',
        description: 'Variantes',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="10" width="100" height="60" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="18" y="20" width="84" height="40" rx="8" fill="currentColor" fill-opacity="0.2" /><rect x="18" y="14" width="50" height="6" rx="3" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Same product in multiple colors.',
        structuralPrompt: CATALOGO_COLORES_PROMPT,
    },
    {
        id: 'catalogo-detail',
        name: 'Detalle',
        description: 'Zoom',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Zoom bubbles showing texture.',
        structuralPrompt: CATALOGO_DETALLE_PROMPT,
    },
    {
        id: 'catalogo-flatlay',
        name: 'Flat Lay',
        description: 'Cenital',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Top-down organized arrangement.',
        structuralPrompt: CATALOGO_FLATLAY_PROMPT,
    },
    {
        id: 'catalogo-comparativo',
        name: 'Vs',
        description: 'Comparativo',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Side-by-side comparison.',
        structuralPrompt: CATALOGO_COMPARATIVO_PROMPT,
    },
    {
        id: 'catalogo-carrusel',
        name: 'Carrusel',
        description: 'Preview',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Swipeable carousel preview.',
        structuralPrompt: CATALOGO_CARRUSEL_PROMPT,
    },
    {
        id: 'catalogo-lifestyle',
        name: 'Uso',
        description: 'En Contexto',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Products in real use context.',
        structuralPrompt: CATALOGO_LIFESTYLE_PROMPT,
    },
    {
        id: 'catalogo-hero',
        name: 'Hero',
        description: 'Destacado',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="38" cy="40" r="22" fill="currentColor" fill-opacity="0.6" /><rect x="70" y="18" width="34" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="36" width="28" height="10" rx="5" fill="currentColor" fill-opacity="0.35" /><rect x="70" y="52" width="24" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Single hero product spotlight.',
        structuralPrompt: CATALOGO_HERO_PROMPT,
    },
]
