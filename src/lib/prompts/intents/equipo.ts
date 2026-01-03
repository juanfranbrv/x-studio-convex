/**
 * EQUIPO - El Equipo (Personas y Cultura)
 * Grupo: Conectar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const EQUIPO_EXTENDED_DESCRIPTION = `
Diseño para humanizar la marca mostrando a las personas detrás. 
Ideal para presentar nuevos miembros, mostrar cultura de empresa 
o celebrar aniversarios de empleados.
`.trim()

export const EQUIPO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'member_name',
        label: 'Nombre(s)',
        placeholder: 'Ej: Ana y Carlos',
        type: 'text',
        required: true,
        aiContext: 'Names of team members'
    },
    {
        id: 'role',
        label: 'Rol / Cargo',
        placeholder: 'Ej: Equipo de Diseño',
        type: 'text',
        required: true,
        aiContext: 'Role or department'
    },
    {
        id: 'context',
        label: 'Contexto (Opcional)',
        placeholder: 'Ej: Bienvenidos',
        type: 'text',
        required: false,
        aiContext: 'Reason for the post (Welcome, Anniversary)'
    }
]

export const EQUIPO_PROMPT = `
COMPOSITION: Portrait or group photo layout. Warm and approachable.
ZONING:
- Hero Photo (70%): High-quality portrait of person or group. Friendly expressions.
- Lower Third (20%): Name and Role clearly legible.
- Brand (10%): Subtle logo placement.
STYLE: Human, warm, professional but relaxed.
PHOTOGRAPHY: Office setting, natural light, or clean studio portrait.
PRIORITY: The people. Trust and humanity.
`.trim()

export const EQUIPO_DESCRIPTION = 'Diseño para mostrar a las personas del equipo. Humaniza la marca y genera confianza.'
