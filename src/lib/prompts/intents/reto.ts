/**
 * RETO - El Reto (Challenge o Concurso)
 * Grupo: Engagement
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const RETO_EXTENDED_DESCRIPTION = `
Diseño altamente interactivo para invitar a la audiencia a participar en 
un desafío, concurso o dinámica. Visualmente llamativo para detener el 
scroll.
`.trim()

export const RETO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'challenge_name',
        label: 'Nombre del Reto',
        placeholder: 'Ej: 30 Días de Yoga',
        type: 'text',
        required: true,
        aiContext: 'Name of the challenge'
    },
    {
        id: 'prize',
        label: 'Premio / Gancho (Opcional)',
        placeholder: 'Ej: Gana un iPhone',
        type: 'text',
        required: false,
        aiContext: 'Prize or incentive'
    },
    {
        id: 'instruction',
        label: 'Instrucción Clave',
        placeholder: 'Ej: Etiqueta a un amigo',
        type: 'text',
        required: true,
        aiContext: 'Key participation instruction'
    }
]

export const RETO_PROMPT = `
COMPOSITION: Game-like or exciting layout. High contrast.
ZONING:
- Title (30%): "CHALLENGE" or "CONTEST" in big bold letters.
- Visual Hook (40%): Image of the prize or a "VS" graphic or dynamic action shot.
- Instructions (30%): "1. Follow, 2. Tag, 3. Win". Clear steps.
STYLE: Fun, gamified, loud, energetic.
PHOTOGRAPHY: Product photo of the prize or happy people cheering.
PRIORITY: Participation. Make it irresistible to join.
`.trim()

export const RETO_DESCRIPTION = 'Diseño interactivo para retos, concursos o dinámicas. Foco en la participación y el premio.'
