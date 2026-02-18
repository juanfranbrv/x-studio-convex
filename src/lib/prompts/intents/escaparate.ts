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

// 1. ZEN - Minimalismo de Alta Gama (Espacio Negativo)
export const ESCAPARATE_ZEN_PROMPT = `
# Composition Type
High-End Zen Minimalism (Negative Space)

# Visual Hierarchy
- **Primary**: The [PRODUCT] placed at the lower-right rule-of-thirds intersection.
- **Secondary**: A vast, clean background occupying 85% of the frame.
- **Tertiary**: Subtle, hard-edged light shadow cast by an unseen source.

# Zoning Guide
- **Zone Product**: Small footprint (15-20% of canvas) in the bottom-right quadrant.
- **Zone Repose**: Complete negative space in top and left sections.
- **Zone Floor**: Shadow anchoring the product to the bottom edge.

# Style Modifiers
- **Atmosphere**: Quiet luxury, expensive, breathable.
- **Lighting**: Single source, sharp shadows, high-end commercial feel.
- **Palette**: Monochromatic or extremely muted tones.

# Negative Constraints
- **Avoid**: Centered placement, cluttered backgrounds, soft diffused lighting.
`

// 2. MARCO - Arquitectónico (Framing)
export const ESCAPARATE_MARCO_PROMPT = `
# Composition Type
Architectural Framing (U-Composition)

# Visual Hierarchy
- **Primary**: The [PRODUCT] centered in a luminous "window" of light.
- **Secondary**: Structural or architectural elements framing the sides and top.
- **Tertiary**: Deep shadows in the framing elements for contrast.

# Zoning Guide
- **Zone Frame**: Borders (left, top, right) occupied by dark architectural structures.
- **Zone Portal**: Bright, detailed center where the product resides.
- **Zone Floor**: Mirrored or high-quality material floor.

# Style Modifiers
- **Atmosphere**: Brutalist, structured, high-fashion urbanity.
- **Lighting**: Dramatic rim-lighting on the frame, volumetric light in center.
- **Palette**: Dark grays and blacks with a single vibrant brand light source.

# Negative Constraints
- **Avoid**: Natural/forest framing, irregular shapes, soft edges.
`

// 3. ESPIRAL - Flujo Áureo (Fibonacci)
export const ESCAPARATE_ESPIRAL_PROMPT = `
# Composition Type
Organic Fibonacci Spiral

# Visual Hierarchy
- **Primary**: The [PRODUCT] located at the focal point of a spiral.
- **Secondary**: Flowing elements (smoke, liquid, fabric) tracing a Golden Ratio curve.
- **Tertiary**: Soft particle highlights following the flow.

# Zoning Guide
- **Zone Focal**: Golden ratio intersection (top-right or bottom-left).
- **Zone Flow**: Circular movement covering the entire diagonal.
- **Zone Depth**: Background elements blurred along the spiral path.

# Style Modifiers
- **Atmosphere**: Elegant, liquid, ethereal, sophisticated.
- **Lighting**: Dreamy diffused light, glowing particles following the curve.
- **Palette**: Soft gradients, transition between two brand colors.

# Negative Constraints
- **Avoid**: Rigid lines, geometric grids, static poses.
`

// 4. DIAGONAL - Cine (Triángulo Dorado)
export const ESCAPARATE_DIAGONAL_PROMPT = `
# Composition Type
Cinematic Diagonal (Golden Triangle)

# Visual Hierarchy
- **Primary**: The [PRODUCT] oriented along a strong diagonal axis.
- **Secondary**: Action lines or light streaks crossing perpendicularly.
- **Tertiary**: Speed blur in the background indicates motion.

# Zoning Guide
- **Zone Axis**: Main diagonal from bottom-left to top-right.
- **Zone Counter**: Sub-elements in the opposing corners for balance.
- **Zone Focus**: Sharpest focus at the diagonal's center.

# Style Modifiers
- **Atmosphere**: Cinematic action, high-tech, energetic.
- **Lighting**: Lens flares, strong side-lighting, anamorphic bokeh.
- **Palette**: Contrast-heavy, teal and orange or high-saturation brand colors.

# Negative Constraints
- **Avoid**: Vertical/Horizontal lines, static studio background.
`

// 5. CAPAS - Profundidad (Layering)
export const ESCAPARATE_CAPAS_PROMPT = `
# Composition Type
Deep Layered Depth (Foreground-Midground-Background)

# Visual Hierarchy
- **Primary**: The [PRODUCT] in sharp focus in the middle plane.
- **Secondary**: Out-of-focus elements in the immediate foreground creating "peek" effect.
- **Tertiary**: Distant background elements providing context and scale.

# Zoning Guide
- **Zone Peek**: Extreme edges (foreground) heavily blurred.
- **Zone Hero**: Center focal plane (sharp).
- **Zone Infinity**: Deep background with progressive blur.

# Style Modifiers
- **Atmosphere**: Immersive, mysterious, high-end macro photography.
- **Lighting**: Zonal lighting, hero layer is the brightest.
- **Palette**: Layered tonal depth, subtle color shifts across planes.

# Negative Constraints
- **Avoid**: Flat flat-lay look, uniform sharpness, lack of depth.
`

// 6. RADIAL - Explosión (Radial Symmetry)
export const ESCAPARATE_RADIAL_PROMPT = `
# Composition Type
Explosive Radial Symmetry

# Visual Hierarchy
- **Primary**: [PRODUCT] as the absolute center of a visual explosion.
- **Secondary**: Rays of light, debris, or brand elements radiating outwards.
- **Tertiary**: Concentric rings of light or energy.

# Zoning Guide
- **Zone Core**: Central product focused and detailed.
- **Zone Blast**: Radial motion outward from center to edges.
- **Zone Glow**: Intense light source centered directly behind the product.

# Style Modifiers
- **Atmosphere**: Epic, heroic, high-impact product launch.
- **Lighting**: Intense backlighting (halo effect), starburst effects.
- **Palette**: High contrast, vibrant energy, glowing materials.

# Negative Constraints
- **Avoid**: Offset placement, subtle lighting, static feeling.
`

// 7. SIMETRÍA - Monolito (Symmetrical)
export const ESCAPARATE_SIMETRÍA_PROMPT = `
# Composition Type
Monolithic Symmetry

# Visual Hierarchy
- **Primary**: [PRODUCT] placed in perfect vertical and horizontal center.
- **Secondary**: Symmetrical supporting elements on both sides.
- **Tertiary**: Centered horizon or grounding plane.

# Zoning Guide
- **Zone Hero**: Dead center.
- **Zone Balance**: Equal weight on left and right halves.
- **Zone Void**: Clean, symmetrical side gutters.

# Style Modifiers
- **Atmosphere**: Established, powerful, authoritative, divine.
- **Lighting**: Perfectly balanced bilateral lighting.
- **Palette**: Split-tone background, perfectly centered.

# Negative Constraints
- **Avoid**: Rule of thirds, tilted angles, any form of imbalance.
`

// 8. CONTRASTE - Pop (Dynamic Asymmetry)
export const ESCAPARATE_CONTRASTE_PROMPT = `
# Composition Type
Dynamic Asymmetric Contrast (Pop)

# Visual Hierarchy
- **Primary**: [PRODUCT] detailed and realistic.
- **Secondary**: A huge, bold geometric color block behind half the product.
- **Tertiary**: Clean typography-ready areas with heavy "visual weight" on one side.

# Zoning Guide
- **Zone Bio**: 60% of frame is a bold color block.
- **Zone Detail**: 40% is clean, showing product in high detail.
- **Zone Interaction**: Where the product breaks the line between the two zones.

# Style Modifiers
- **Atmosphere**: Modern, graphic, editorial, eye-catching.
- **Lighting**: Flat graphic lighting mixed with 3D product rendering.
- **Palette**: Complementary colors, bold saturation.

# Negative Constraints
- **Avoid**: Soft gradients, realistic shadows, traditional photography look.
`

// 9. GOBO - Sombras Proyectadas (Shadow Play)
export const ESCAPARATE_GOBO_PROMPT = `
# Composition Type
Cinematic Shadow Play (Gobo Lighting)

# Visual Hierarchy
- **Primary**: The [PRODUCT] partially obscured by complex, rhythmic shadows.
- **Secondary**: Intricate patterns (palm leaves, window blinds, organic textures) projected on the background.
- **Tertiary**: High-contrast light patches highlighting product features.

# Zoning Guide
- **Zone Light**: Strategic highlights on the main product logo or feature.
- **Zone Texture**: Background completely covered by the projected shadow pattern.
- **Zone Floor**: Sharp intersection where shadow meets the ground.

# Style Modifiers
- **Atmosphere**: Mysterious, tropical, high-end editorial, evocative.
- **Lighting**: Hard directional light through a stencil (Gobo), high contrast.
- **Palette**: Deep earth tones or warm sunset highlights against dark shadows.

# Negative Constraints
- **Avoid**: Flat lighting, soft shadows, uniform background colors.
`

// 10. LEVITACIÓN - Gravedad Cero (Suspended)
export const ESCAPARATE_LEVITACION_PROMPT = `
# Composition Type
Zero-Gravity levitation

# Visual Hierarchy
- **Primary**: The [PRODUCT] tilted at a dynamic angle as if weightless.
- **Secondary**: Exploded view or accompanying components floating nearby.
- **Tertiary**: Subtle "invisible" force lines or light particles.

# Zoning Guide
- **Zone Suspension**: Product occupies the central vertical axis but avoids the floor.
- **Zone Orbit**: Smaller elements or particles floating in a spiral around the hero.
- **Zone Void**: Deep, dark, or extremely clean background to emphasize flight.

# Style Modifiers
- **Atmosphere**: Futuristic, magical, high-tech, clean.
- **Lighting**: Rim-lighting to separate product from background, blue or cyan accents.
- **Palette**: Cool tones, metallic finishes, dark void backgrounds.

# Negative Constraints
- **Avoid**: Ground planes, visible wires, heavy shadows on the floor.
`

// 11. BODEGÓN - Curaduría (Modern Still Life)
export const ESCAPARATE_BODEGON_PROMPT = `
# Composition Type
Modern Still Life (Rule of Odds)

# Visual Hierarchy
- **Primary**: The [PRODUCT] as the anchor of a group of 3 or 5 objects.
- **Secondary**: Carefully selected props (textures, raw materials) arranged in a triangle.
- **Tertiary**: Overlapping shapes creating a sense of "arranged reality".

# Zoning Guide
- **Zone Cluster**: Objects grouped tightly in one section (e.g., center-left).
- **Zone Breathing**: Empty space on the opposite side (e.g., right).
- **Zone Surface**: Tactile material floor (marble, wood, rough concrete).

# Style Modifiers
- **Atmosphere**: Curated, artisanal, sophisticated, balanced.
- **Lighting**: Soft side-lighting (Rembrandt style), gentle focus fall-off.
- **Palette**: Harmonious color story, tone-on-tone textures.

# Negative Constraints
- **Avoid**: Chaotic placement, even numbers of objects, generic backgrounds.
`

export const ESCAPARATE_LAYOUTS: LayoutOption[] = [
    {
        id: 'escaparate-free',
        name: 'Libre',
        description: 'Sin indicación',
        svgIcon: 'help_center',
        textZone: 'center',
        promptInstruction: 'Natural composition without structural constraints.',
        structuralPrompt: '',
    },
    {
        id: 'escaparate-zen',
        name: 'Zen',
        description: 'Minimalismo de lujo',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="48" height="30" rx="8" fill="currentColor" fill-opacity="0.5" /><rect x="64" y="8" width="48" height="30" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="8" y="42" width="48" height="30" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="64" y="42" width="48" height="30" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Zen-like minimalist composition with heavy negative space.',
        structuralPrompt: ESCAPARATE_ZEN_PROMPT,
    },
    {
        id: 'escaparate-marco',
        name: 'Marco',
        description: 'Enmarcado arquitectónico',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="18" width="100" height="20" rx="10" fill="currentColor" fill-opacity="0.7" /><rect x="20" y="44" width="80" height="12" rx="6" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Architectural framing with structural shadows.',
        structuralPrompt: ESCAPARATE_MARCO_PROMPT,
    },
    {
        id: 'escaparate-espiral',
        name: 'Espiral',
        description: 'Flujo Áureo Fibonacci',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="12" width="100" height="56" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="14" y="48" width="92" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /><rect x="14" y="26" width="60" height="10" rx="6" fill="currentColor" fill-opacity="0.5" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Organic movement following a Fibonacci spiral flow.',
        structuralPrompt: ESCAPARATE_ESPIRAL_PROMPT,
    },
    {
        id: 'escaparate-diagonal',
        name: 'Diagonal',
        description: 'Perspectiva dinámica',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="10" y="12" width="100" height="56" rx="10" fill="currentColor" fill-opacity="0.3" /><rect x="14" y="48" width="92" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /><rect x="14" y="26" width="60" height="10" rx="6" fill="currentColor" fill-opacity="0.5" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Dynamic cinematic diagonal axis composition.',
        structuralPrompt: ESCAPARATE_DIAGONAL_PROMPT,
    },
    {
        id: 'escaparate-capas',
        name: 'Profundidad',
        description: 'Capas desenfocadas',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="14" y="18" width="76" height="44" rx="12" fill="currentColor" fill-opacity="0.6" /><circle cx="26" cy="40" r="6" fill="currentColor" fill-opacity="0.8" /><rect x="40" y="28" width="44" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="40" y="44" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Immersive layered composition with foreground and background blur.',
        structuralPrompt: ESCAPARATE_CAPAS_PROMPT,
    },
    {
        id: 'escaparate-radial',
        name: 'Radial',
        description: 'Explosión de luz',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="40" r="22" fill="currentColor" fill-opacity="0.55" /><rect x="58" y="8" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="58" y="56" width="4" height="16" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="16" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="88" y="38" width="16" height="4" rx="2" fill="currentColor" fill-opacity="0.6" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'High-impact radial symmetry explosion effect.',
        structuralPrompt: ESCAPARATE_RADIAL_PROMPT,
    },
    {
        id: 'escaparate-simetria',
        name: 'Monolito',
        description: 'Simetría perfecta',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="12" width="26" height="56" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="38" y="12" width="44" height="56" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="86" y="12" width="26" height="56" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Perfectly centered monolithic symmetry.',
        structuralPrompt: ESCAPARATE_SIMETRÍA_PROMPT,
    },
    {
        id: 'escaparate-contraste',
        name: 'Contraste',
        description: 'Estilo Pop/Editorial',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="16" y="48" width="16" height="22" rx="6" fill="currentColor" fill-opacity="0.45" /><rect x="38" y="40" width="16" height="30" rx="6" fill="currentColor" fill-opacity="0.55" /><rect x="60" y="30" width="16" height="40" rx="6" fill="currentColor" fill-opacity="0.65" /><rect x="82" y="22" width="16" height="48" rx="6" fill="currentColor" fill-opacity="0.75" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Graphic asymmetric color blocking pop-art contrast.',
        structuralPrompt: ESCAPARATE_CONTRASTE_PROMPT,
    },
    {
        id: 'escaparate-gobo',
        name: 'Sombras',
        description: 'Juego de luces Proyectadas',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="70" height="30" rx="8" fill="currentColor" fill-opacity="0.6" /><rect x="82" y="8" width="30" height="30" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="8" y="42" width="40" height="30" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="52" y="42" width="60" height="30" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Cinematic shadow play with intricate Gobo lighting patterns.',
        structuralPrompt: ESCAPARATE_GOBO_PROMPT,
    },
    {
        id: 'escaparate-levitacion',
        name: 'Levitación',
        description: 'Gravedad Cero',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><rect x="8" y="8" width="58" height="28" rx="8" fill="currentColor" fill-opacity="0.55" /><rect x="70" y="8" width="42" height="28" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="8" y="40" width="42" height="32" rx="8" fill="currentColor" fill-opacity="0.35" /><rect x="54" y="40" width="58" height="32" rx="8" fill="currentColor" fill-opacity="0.6" /><rect x="10" y="60" width="100" height="12" rx="6" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'bottom',
        promptInstruction: 'Futuristic zero-gravity suspension with floating elements.',
        structuralPrompt: ESCAPARATE_LEVITACION_PROMPT,
    },
    {
        id: 'escaparate-bodegon',
        name: 'Bodegón',
        description: 'Curaduría moderna',
        svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none"><circle cx="60" cy="38" r="22" fill="currentColor" fill-opacity="0.6" /><circle cx="22" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><circle cx="98" cy="38" r="6" fill="currentColor" fill-opacity="0.4" /><rect x="44" y="18" width="32" height="8" rx="4" fill="currentColor" fill-opacity="0.35" /><rect x="32" y="30" width="56" height="20" rx="10" fill="currentColor" fill-opacity="0.6" /></svg>',
        textZone: 'center',
        promptInstruction: 'Sophisticated modern still life with curated props.',
        structuralPrompt: ESCAPARATE_BODEGON_PROMPT,
    },
]
