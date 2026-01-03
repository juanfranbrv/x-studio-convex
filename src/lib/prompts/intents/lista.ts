/**
 * LISTA - La Lista (Tips y enumeraciones)
 * Grupo: Informar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const LISTA_EXTENDED_DESCRIPTION = `
Diseño estructurado para enumeraciones, check-lists o rankings. 
Facilita la lectura rápida de varios puntos. Ideal para "Top 5", 
"Pasos a seguir" o "Cosas que no sabías".
`.trim()

export const LISTA_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'list_title',
        label: 'Título de la Lista',
        placeholder: 'Ej: 5 Tips para...',
        type: 'text',
        required: true,
        aiContext: 'Title of the listicle'
    },
    {
        id: 'items_context',
        label: 'Contexto de los ítems',
        placeholder: 'Ej: Herramientas de IA, Libros...',
        type: 'text',
        required: true,
        aiContext: 'Topic of the items in the list'
    },
    {
        id: 'item_count',
        label: 'Número de ítems',
        placeholder: 'Ej: 5',
        type: 'text',
        required: false,
        aiContext: 'Number of items to visualize graphically'
    }
]

export const LISTA_PROMPT = `
COMPOSITION: Listicle layout. Structured vertical or grid flow.
ZONING:
- Header (20%): Catchy title "Top 5...", "Checklist...".
- List Body (70%): Numbered list or bullet points with icons/text placeholders. Clean alignment.
- Footer (10%): Branding and "Save this post" reminder.
STYLE: Infographic, organized, education-focused. visual rhythm.
PHOTOGRAPHY: Minimalist icons or small thumbnails next to list items. Solid or textured background.
PRIORITY: Readability and structure. It must look like a useful resource.
`.trim()

export const LISTA_DESCRIPTION = 'Diseño estructurado para enumeraciones, tops o checklists. Facilita la lectura rápida.'
