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

export const LOGRO_NUMBER_PROMPT = `
COMPOSITION: Big Data / Metric Hero.
ZONING:
- Hero: The milestone number occupies 80% of the visual weight.
- Subtext: "Followers", "Years", or "Sales" small below the number.
- Background: Clean, high contrast to make the number pop.
STYLE: Bold, impact, statistical pride.
TYPOGRAPHY: Massive scale, geometric sans-serif.
`.trim()

export const LOGRO_TROPHY_PROMPT = `
COMPOSITION: Achievement Object Focus.
ZONING:
- Object: 3D Trophy, Medal, or Plaque in center spotlight.
- Lighting: Dramatic rim lighting, golden/silver reflections.
- Text: "Award Winner" or Achievement Title below object.
STYLE: Premium, prestigious, cinematic.
`.trim()

export const LOGRO_CONFETTI_PROMPT = `
COMPOSITION: Festive Explosion.
ZONING:
- Atmosphere: Falling confetti, streamers, floating elements.
- Center: Clear zone for the main message "Thank You" or "We Did It".
- Energy: Dynamic movement radiating from center.
STYLE: Joyful, energetic, party mood. 
COLORS: Brand colors + Gold/Silver accents.
`.trim()

export const LOGRO_TEAM_PROMPT = `
COMPOSITION: Collective Success.
ZONING:
- Background: Team cheering or raising hands (blurred or filtered).
- Overlay: Big bold text "TEAMWORK" or "GOAL REACHED".
- Footer: "Thanks to everyone" message.
STYLE: Human, inclusive, emotional.
`.trim()

export const LOGRO_PREMIUM_PROMPT = `
COMPOSITION: Luxury Certification / Badge.
ZONING:
- Border: Elegant gold/metallic frame or seal.
- Badge: Central seal style layout with "Certified" or "Winner" text.
- Texture: High-quality paper or matte finish background.
STYLE: Official, high-trust, luxury.
`.trim()

export const LOGRO_JOURNEY_PROMPT = `
COMPOSITION: Timeline Milestone.
ZONING:
- Path: A visual line or road showing progress.
- Marker: A flag or waypoint marking "You Are Here" or "Goal".
- Context: Previous small dots implies history.
STYLE: Growth, progress, forward momentum.
`.trim()

export const LOGRO_DESCRIPTION = 'Diseño celebratorio con cifra/logro protagonista. Elementos festivos (confetti, estrellas) integrados con la marca.'
