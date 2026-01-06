/**
 * LOGRO - El Logro (Milestone, celebración)
 * Grupo: Conectar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const LOGRO_EXTENDED_DESCRIPTION = `
Para celebrar hitos importantes: aniversarios, seguidores alcanzados, 
premios o reconocimientos. Diseño festivo que transmite gratitud y 
orgullo sin perder la identidad de marca.
`.trim()

export const LOGRO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'milestone_number',
        label: 'Cifra o Logro Principal',
        placeholder: 'Ej: 10.000 seguidores / 5 años',
        type: 'text',
        required: true,
        mapsTo: 'headline',
        aiContext: 'The main milestone number or achievement'
    },
    {
        id: 'gratitude_message',
        label: 'Mensaje de Agradecimiento',
        placeholder: 'Ej: ¡Gracias por formar parte de esto!',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Thank you message to the community'
    },
    {
        id: 'celebration_context',
        label: 'Contexto Adicional',
        placeholder: 'Ej: Desde 2019 creciendo juntos',
        type: 'text',
        required: false,
        optional: true,
        aiContext: 'Additional context about the achievement'
    }
]

export const LOGRO_PROMPT = `
COMPOSITION: Celebratory milestone design with visual impact.
ZONING:
- Center Focus (60%): The milestone number/achievement HUGE and prominent
- Celebration Elements: Confetti, stars, sparkles, or subtle party elements
- Gratitude Zone (25%): Space for thank you message
- Brand Zone (15%): Logo integrated tastefully
STYLE: Festive but on-brand. Joyful without being childish.
COLORS: Use brand colors as primary, add gold/silver accents for celebration.
MOOD: Pride, gratitude, community celebration.
ANIMATION HINT: Elements that suggest movement and celebration.
`.trim()

export const LOGRO_DESCRIPTION = 'Diseño celebratorio con cifra/logro protagonista. Elementos festivos (confetti, estrellas) integrados con la marca.'
