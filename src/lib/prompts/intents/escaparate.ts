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
COMPOSITION: Hero product showcase with clean, premium aesthetics.
ZONING:
- Center Focus (70%): The product takes absolute center stage, well-lit and sharp.
- Background: Clean, solid or subtle gradient using brand colors. NO distracting elements.
- Text Zone Bottom (15%): Space for product name, price, or tagline.
- Brand Zone (5%): Small logo placement in corner.
STYLE: Commercial product photography aesthetic. Premium feel. Sharp focus on product details.
PHOTOGRAPHY: Studio lighting, product floating or on minimal surface.
PRIORITY: Product clarity and appeal over text. Let the product sell itself.
`.trim()

export const ESCAPARATE_DESCRIPTION = 'Diseño limpio con producto centrado como absoluto protagonista. Fondo minimalista con espacio inferior para nombre/precio.'
