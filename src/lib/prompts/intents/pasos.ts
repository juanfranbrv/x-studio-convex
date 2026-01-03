/**
 * PASOS - Los Pasos (Tutorial o How-To)
 * Grupo: Educar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const PASOS_EXTENDED_DESCRIPTION = `
Diseño secuencial para explicar un proceso. Perfecto para tutoriales, 
recetas o guías rápidas. Divide la información en bocados digeribles 
para facilitar el aprendizaje.
`.trim()

export const PASOS_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'tutorial_title',
        label: 'Título del Tutorial',
        placeholder: 'Ej: Cómo crear una cuenta',
        type: 'text',
        required: true,
        aiContext: 'Title of the tutorial'
    },
    {
        id: 'step_count',
        label: 'Número de Pasos',
        placeholder: 'Ej: 3 Pasos',
        type: 'text',
        required: true,
        aiContext: 'Number of steps'
    },
    {
        id: 'goal',
        label: 'Objetivo / Resultado',
        placeholder: 'Ej: Empieza a vender hoy',
        type: 'text',
        required: false,
        aiContext: 'Goal or final result'
    }
]

export const PASOS_PROMPT = `
COMPOSITION: Carousel or infographic step-by-step layout.
ZONING:
- Header (20%): "How to X in Y steps". Clear premise.
- Steps Visuals (60%): Numbered sequence (1, 2, 3) or directional flow arrows.
- Outcome (20%): Small visual of the final result or benefit.
STYLE: Instructional, clear, schematic.
PHOTOGRAPHY: Hands doing things, screenshots, or simplified 3D icons representing actions.
PRIORITY: Clarity of sequence. Easy to follow.
`.trim()

export const PASOS_DESCRIPTION = 'Diseño secuencial para explicar procesos, recetas o tutoriales paso a paso.'
