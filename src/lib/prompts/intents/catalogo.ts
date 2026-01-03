/**
 * CATÁLOGO - El Catálogo (Colección de productos)
 * Grupo: Vender
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const CATALOGO_EXTENDED_DESCRIPTION = `
Diseño tipo grid o composición equilibrada para mostrar varios productos 
de una misma colección. Ideal para rebajas de temporada, nuevas colecciones 
o packs de productos complementarios.
`.trim()

export const CATALOGO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'collection_name',
        label: 'Nombre de la Colección',
        placeholder: 'Ej: Verano 2024',
        type: 'text',
        required: true,
        aiContext: 'Name of the product collection'
    },
    {
        id: 'product_types',
        label: 'Tipos de Productos',
        placeholder: 'Ej: Camisetas, Gorras y Zapatillas',
        type: 'text',
        required: true,
        aiContext: 'Comma-separated list of product types to visualize in a grid'
    },
    {
        id: 'promo_text',
        label: 'Texto Promocional (Opcional)',
        placeholder: 'Ej: Hasta 50% Dto.',
        type: 'text',
        required: false,
        aiContext: 'Promotional text or discount offer'
    }
]

export const CATALOGO_PROMPT = `
COMPOSITION: Grid or balanced composition showcasing multiple products (3-4 items).
ZONING:
- Product Grid (75%): Multiple products arranged neatly (grid or dynamic cluster). Uniform lighting.
- Header/Text (20%): Brief space for collection name or "Sale" text. Clean typography.
- Brand (5%): Discrete logo placement.
STYLE: Organized, clean, editorial catalog style.
PHOTOGRAPHY: Flat lay or consistent studio angles for all items.
PRIORITY: Variety and cohesion. Show that it's a collection.
`.trim()

export const CATALOGO_DESCRIPTION = 'Composición tipo grid para mostrar colección o variedad de productos. Ideal para sales o lanzamientos de temporada.'
