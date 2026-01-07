/**
 * ESCAPARATE - El Escaparate (Producto protagonista)
 * Grupo: Vender
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

export const ESCAPARATE_PROMPT = `
COMPOSITION: Hero product showcase. Focus on clarity and desire.
ZONING:
- Focal Point: The product is the absolute hero, taking center stage with ample breathing room.
- Background: Clean, solid, or subtle gradient. No visual clutter.
- Info Zone: Reserved clear space (bottom or side) for product details, kept separate from the visual.
STYLE: High-end commercial photography. Studio lighting.
TYPOGRAPHY: Clean sans-serif placeholders.
PRIORITY: Product clarity is paramount.
`.trim()

export const ESCAPARATE_LIFESTYLE_PROMPT = `
COMPOSITION: Contextual product placement. Show the product "in action" or in its natural habitat.
ZONING:
- Environment: Realistic background setting (e.g., table, outdoors, living room) customized to the product type.
- Product: Integrated naturally into the scene, interacting with light and shadow.
- atmosphere: Moody or sunny lighting depending on brand vibe.
STYLE: Organic, relatable, authentic.
TYPOGRAPHY: Minimal unobtrusive zones.
`.trim()

export const ESCAPARATE_MINIMAL_PROMPT = `
COMPOSITION: Ultra-clean "Museum" or "Gallery" aesthetic.
ZONING:
- Negative Space: Dominated by empty space (white, black, or soft gray).
- Object: Small to medium scale, centered or off-center for artistic tension.
- Shadows: Long, realistic shadows or reflection to ground the object.
STYLE: Sophisticated, architectural, high-art.
TYPOGRAPHY: Tiny, technical specification stye placeholders.
`.trim()

export const ESCAPARATE_DYNAMIC_PROMPT = `
COMPOSITION: Product in motion. High energy.
ZONING:
- Action: The product appears suspended, falling, or splashing.
- Elements: Floating particles, liquid splashes, or motion blur trails.
- Flow: Diagonal or spiral composition guiding the eye.
STYLE: Energetic, sports/performance vibe. High contrast.
TYPOGRAPHY: Dynamic, slanted placeholder zones.
`.trim()

export const ESCAPARATE_DETAIL_PROMPT = `
COMPOSITION: Multi-view or macro focus layout.
ZONING:
- Hero: One main shot of the full product.
- Insets: Circular or square "zoom" bubbles highlighting textures or features.
- Connectors: Thin lines or visual guides pointing to specific details.
STYLE: Technical, informative, trustworthy.
TYPOGRAPHY: Label-style placeholders near details.
`.trim()

export const ESCAPARATE_THEMED_PROMPT = `
COMPOSITION: Product elevated on a podium or scenic stage.
ZONING:
- Stage: A cylinder, block, or rock podium holding the product.
- Props: Thematic decorative elements (leaves, geometric shapes, raw materials) surrounding the base.
- Lighting: Dramatic spotlighting from above or side.
STYLE: Editorial, set design, stylized.
TYPOGRAPHY: Elegant space reserved on the podium or above.
`.trim()

export const ESCAPARATE_DESCRIPTION = 'Diseño centrado en producto. Variedad desde estudio minimalista hasta lifestyle y composición artística.'
