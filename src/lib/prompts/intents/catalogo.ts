/**
 * CATALOGO - El Catálogo (Colecciones y grids)
 * Grupo: Productos
 * 
 * Para colecciones de productos, lookbooks y grids organizados.
 * Muestra múltiples ítems en layouts estructurados.
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

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
<structural_instruction>
    <composition_type>Classic Product Grid</composition_type>
    <visual_hierarchy>
        <primary>Clean, symmetrical 2x2 or 3x3 grid of products</primary>
        <secondary>Uniform background color for all items</secondary>
        <tertiary>Minimal text labels under each item</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Evenly distributed product array</zone_grid>
        <zone_labels>Optional price or name under each</zone_labels>
        <zone_title>Collection title above grid</zone_title>
    </zoning_guide>
    <style_modifiers>
        <texture>Studio photography, seamless backgrounds</texture>
        <lighting>Uniform softbox lighting across all items</lighting>
        <palette>Neutral white or pastel background, products pop</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Random angles, mismatched lighting, visual clutter</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. EDITORIAL - Lookbook Spread
export const CATALOGO_EDITORIAL_PROMPT = `
<structural_instruction>
    <composition_type>Editorial Lookbook Spread</composition_type>
    <visual_hierarchy>
        <primary>One large hero lifestyle image (dominant)</primary>
        <secondary>Two-three smaller product detail shots on side</secondary>
        <tertiary>Elegant serif title "Collection Name"</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_hero>Large lifestyle/context image (60-70%)</zone_hero>
        <zone_details>Column of smaller detail shots</zone_details>
        <zone_title>Collection branding</zone_title>
    </zoning_guide>
    <style_modifiers>
        <texture>Magazine glossy paper, high fashion</texture>
        <lighting>Natural sunlight with studio fill</lighting>
        <palette>Sophisticated, tonal, cohesive color story</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Boring grid only, low quality, cheap catalog feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. MOSAICO - Dynamic Masonry
export const CATALOGO_MOSAICO_PROMPT = `
<structural_instruction>
    <composition_type>Dynamic Masonry Collage</composition_type>
    <visual_hierarchy>
        <primary>Interlocking masonry layout with varied aspect ratios</primary>
        <secondary>Mix of portrait and landscape images tightly packed</secondary>
        <tertiary>Small badges or tags on select featured images</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_mosaic>Pinterest-style tightly packed images</zone_mosaic>
        <zone_featured>Larger cells for hero products</zone_featured>
        <zone_tags>Optional "New" or "Sale" badges</zone_tags>
    </zoning_guide>
    <style_modifiers>
        <texture>Pinterest aesthetic, vibrant, lifestyle</texture>
        <lighting>Mixed but high quality sources</lighting>
        <palette>Colorful, energetic, varied</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Gaps between images, overlapping chaos, low resolution</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. ESTANTERÍA - Retail Shelf Display
export const CATALOGO_ESTANTERIA_PROMPT = `
<structural_instruction>
    <composition_type>Retail Shelf Display</composition_type>
    <visual_hierarchy>
        <primary>Products arranged neatly on floating shelves</primary>
        <secondary>Soft shadows cast on the wall behind</secondary>
        <tertiary>Decor elements (plants, books) styling the display</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_shelves>Horizontal shelf lines across composition</zone_shelves>
        <zone_products>Products arranged on each shelf</zone_products>
        <zone_decor>Lifestyle styling elements</zone_decor>
    </zoning_guide>
    <style_modifiers>
        <texture>Interior design, wood or metal shelves</texture>
        <lighting>Warm interior spot lighting</lighting>
        <palette>Neutral wall, colorful products as focus</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Grocery store metal racks, bad perspective, cluttered</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. COLORES - Color Variant Series
export const CATALOGO_COLORES_PROMPT = `
<structural_instruction>
    <composition_type>Color Variation Series</composition_type>
    <visual_hierarchy>
        <primary>Same product repeated in multiple color options</primary>
        <secondary>Pop art repetition layout (Andy Warhol style)</secondary>
        <tertiary>Bold color backgrounds matching each variant</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Repeated product matrix</zone_grid>
        <zone_colors>Distinct background per color variant</zone_colors>
        <zone_message>"Available in X colors" optional text</zone_message>
    </zoning_guide>
    <style_modifiers>
        <texture>Plastic, glossy, vibrant color explosion</texture>
        <lighting>Hard high-contrast studio flash</lighting>
        <palette>Rainbow matrix, monochrome per cell</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Subtle hues, boring grey, inconsistent angles</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. DETALLE - Zoom Detail Focus
export const CATALOGO_DETALLE_PROMPT = `
<structural_instruction>
    <composition_type>Macro Detail Focus</composition_type>
    <visual_hierarchy>
        <primary>Main full product shot in center</primary>
        <secondary>Circular magnifying glass overlays showing texture details</secondary>
        <tertiary>Dotted lines connecting zoom bubbles to source</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_product>Main product in center</zone_product>
        <zone_zooms>Detail bubble callouts in corners</zone_zooms>
        <zone_lines>Connection indicators</zone_lines>
    </zoning_guide>
    <style_modifiers>
        <texture>High resolution macro photography</texture>
        <lighting>Clean crisp scientific lighting</lighting>
        <palette>Clean white background, focus on textures</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Blurry textures, fake-looking loupes, low res</avoid>
    </negative_constraints>
</structural_instruction>
`

// 7. FLAT_LAY - Top Down Arrangement
export const CATALOGO_FLATLAY_PROMPT = `
<structural_instruction>
    <composition_type>Flat Lay Top-Down Collection</composition_type>
    <visual_hierarchy>
        <primary>Top-down view of multiple products artfully arranged</primary>
        <secondary>Props and styling elements (leaves, fabric, accessories)</secondary>
        <tertiary>Subtle brand elements or collection tag</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_products>Multiple items spread across surface</zone_products>
        <zone_props>Lifestyle styling elements</zone_props>
        <zone_negative>Strategic breathing room between items</zone_negative>
    </zoning_guide>
    <style_modifiers>
        <texture>Instagram flat lay, lifestyle photography</texture>
        <lighting>Soft overhead natural or studio</lighting>
        <palette>Cohesive color story across all items</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Random chaotic pile, bad shadows, crowded</avoid>
    </negative_constraints>
</structural_instruction>
`

// 8. COMPARATIVO - Side by Side
export const CATALOGO_COMPARATIVO_PROMPT = `
<structural_instruction>
    <composition_type>Side-by-Side Product Comparison</composition_type>
    <visual_hierarchy>
        <primary>Two or three products aligned for direct comparison</primary>
        <secondary>Feature callouts or labels for each</secondary>
        <tertiary>"Compare" or size/spec indicators</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_products>Aligned products in a row</zone_products>
        <zone_specs>Feature labels per product</zone_specs>
        <zone_comparison>Connecting or distinguishing elements</zone_comparison>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean product photography, comparison layout</texture>
        <lighting>Consistent across all products for fair comparison</lighting>
        <palette>Neutral background, products differentiated by their colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Unequal treatment, biased sizes, unclear comparison</avoid>
    </negative_constraints>
</structural_instruction>
`

// 9. CARRUSEL - Carousel Preview
export const CATALOGO_CARRUSEL_PROMPT = `
<structural_instruction>
    <composition_type>Carousel Swipe Collection</composition_type>
    <visual_hierarchy>
        <primary>Central product card with peeking edges of adjacent items</primary>
        <secondary>Swipe or slide indicators (dots, arrows)</secondary>
        <tertiary>Collection title and "Swipe to see more"</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_main>Central visible product card</zone_main>
        <zone_peek>Partial edges of next/previous cards</zone_peek>
        <zone_nav>Pagination dots or swipe indicator</zone_nav>
    </zoning_guide>
    <style_modifiers>
        <texture>Mobile-native, Stories/carousel aesthetic</texture>
        <lighting>Spotlight on main, dimmed on sides</lighting>
        <palette>Consistent card design, varied products</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Static single product, no carousel feel, equal visibility</avoid>
    </negative_constraints>
</structural_instruction>
`

// 10. LIFESTYLE - Products in Context
export const CATALOGO_LIFESTYLE_PROMPT = `
<structural_instruction>
    <composition_type>Lifestyle Context Collection</composition_type>
    <visual_hierarchy>
        <primary>Products shown in natural use environment/scene</primary>
        <secondary>Human interaction or lifestyle context</secondary>
        <tertiary>Brand or collection watermark</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_scene>Lifestyle environment as backdrop</zone_scene>
        <zone_products>Products integrated naturally in scene</zone_products>
        <zone_context>Human element or usage demonstration</zone_context>
    </zoning_guide>
    <style_modifiers>
        <texture>Editorial lifestyle photography</texture>
        <lighting>Natural environment lighting</lighting>
        <palette>Real-world colors, brand-coordinated</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>White background isolation, stock photo feel, products hidden</avoid>
    </negative_constraints>
</structural_instruction>
`

// 11. HERO - Single Product Hero
export const CATALOGO_HERO_PROMPT = `
<structural_instruction>
    <composition_type>Hero Product Spotlight</composition_type>
    <visual_hierarchy>
        <primary>Single featured product as absolute hero center stage</primary>
        <secondary>Dramatic lighting and shadow play</secondary>
        <tertiary>Collection name or "Star of the collection" badge</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_product>Center stage single product hero</zone_product>
        <zone_lighting>Dramatic shadow and highlight areas</zone_lighting>
        <zone_badge>Featured or star product indicator</zone_badge>
    </zoning_guide>
    <style_modifiers>
        <texture>Premium product photography</texture>
        <lighting>Dramatic studio lighting, hero treatment</lighting>
        <palette>Dark backdrop, spotlight on product</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Multiple products competing, flat lighting, lost focus</avoid>
    </negative_constraints>
</structural_instruction>
`

export const CATALOGO_DESCRIPTION = 'Catálogos y colecciones de producto. 11 composiciones para mostrar múltiples ítems.'
