export const CATALOGO_DESCRIPTION = 'Product collections, lookbooks, and organized grids.'
export const CATALOGO_EXTENDED_DESCRIPTION = 'Showcase multiple items or a collection in a structured layout.'

export const CATALOGO_REQUIRED_FIELDS = ['collection_name', 'items', 'style']

// 1. CLASSIC GRID - E-commerce
export const CATALOGO_GRID_PROMPT = `
<structural_instruction>
    <composition_type>Product Grid</composition_type>
    <visual_hierarchy>
        <primary>A clean, symmetrical [GRID_2x2] or 3x3 of products</primary>
        <secondary>Uniform background color for all items</secondary>
        <tertiary>Minimal text labels under each item</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>The product array</zone_grid>
    </zoning_guide>
    <style_modifiers>
        <texture>Studio photography, seamless background</texture>
        <lighting>Uniform softbox lighting</lighting>
        <palette>Neutral, white, or pastel background</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Random angles, mismatched lighting, clutter</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. LOOKBOOK SPREAD - Editorial
export const CATALOGO_LOOKBOOK_PROMPT = `
<structural_instruction>
    <composition_type>Editorial Lookbook</composition_type>
    <visual_hierarchy>
        <primary>One large [HERO_IMAGE] (lifestyle shot)</primary>
        <secondary>Two smaller product detail shots on the side</secondary>
        <tertiary>Elegant serif title "Fall Collection"</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_major>Lifestyle Image</zone_major>
        <zone_minor>Detail shots column</zone_minor>
    </zoning_guide>
    <style_modifiers>
        <texture>Magazine glossy paper, high fashion</texture>
        <lighting>Natural sunlight + studio fill</lighting>
        <palette>Sophisticated, tonal, cohesive</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Boring grid, low resolution, cheap catalog feel</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. MASONRY - Dynamic
export const CATALOGO_MASONRY_PROMPT = `
<structural_instruction>
    <composition_type>Dynamic Collage</composition_type>
    <visual_hierarchy>
        <primary>Interlocking [MASONRY_LAYOUT] of images</primary>
        <secondary>Varied aspect ratios (portrait, landscape)</secondary>
        <tertiary>Small text badges on select images</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_mosaic>Tightly packed images</zone_mosaic>
    </zoning_guide>
    <style_modifiers>
        <texture>Pinterest aesthetic, vibrant</texture>
        <lighting>mixed high quality sources</lighting>
        <palette>Colorful, energetic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Gaps, overlapping chaotic images</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. SHELF DISPLAY - Retail
export const CATALOGO_SHELF_PROMPT = `
<structural_instruction>
    <composition_type>Retail Shelf</composition_type>
    <visual_hierarchy>
        <primary>Products arranged neatly on [FLOATING_SHELVES]</primary>
        <secondary>Soft shadows cast on the wall</secondary>
        <tertiary>Decor elements (plants, books) styling the shelf</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_shelves>Horizontal lines</zone_shelves>
        <zone_products>Items on shelves</zone_products>
    </zoning_guide>
    <style_modifiers>
        <texture>Interior design, wood or metal shelves</texture>
        <lighting>Warm interior spot lighting</lighting>
        <palette>Neutral wall, colorful products</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Grocery store metal racks, bad perspective</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. COLOR VARIATIONS - Pop Art
export const CATALOGO_VARIANTS_PROMPT = `
<structural_instruction>
    <composition_type>Color Series</composition_type>
    <visual_hierarchy>
        <primary>The same object repeated in [DIFFERENT_COLORS]</primary>
        <secondary>Pop art repetition layout (Andy Warhol style)</secondary>
        <tertiary>Bold color backgrounds matching the object</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_grid>Repeated object matrix</zone_grid>
    </zoning_guide>
    <style_modifiers>
        <texture>Plastic, glossy, vibrant</texture>
        <lighting>Hard high-contrast studio flash</lighting>
        <palette>Monochrome per cell, rainbow overall</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Subtle hues, boring grey background</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. ZOOM DETAIL - Focus
export const CATALOGO_DETAIL_PROMPT = `
<structural_instruction>
    <composition_type>Macro Details</composition_type>
    <visual_hierarchy>
        <primary>Main full product shot in center</primary>
        <secondary>Circular [MAGNIFYING_GLASS] overlays showing texture details</secondary>
        <tertiary>Dotted lines connecting zoom bubbles to source</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>Main Object</zone_center>
        <zone_corners>Detail bubbles</zone_corners>
    </zoning_guide>
    <style_modifiers>
        <texture>High resolution macro photography</texture>
        <lighting>Clean crisp scientific lighting</lighting>
        <palette>Clean white background, focus on texture</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Blurry textures, fake looking loupes</avoid>
    </negative_constraints>
</structural_instruction>
`
