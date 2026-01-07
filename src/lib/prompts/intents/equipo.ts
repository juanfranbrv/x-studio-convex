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

export const EQUIPO_PORTRAIT_PROMPT = `
COMPOSITION: Professional Hero Portrait.
ZONING:
- Hero: Large high-quality portrait of one person (left or center).
- Text: Name and Role aligned to clear space (right or bottom).
- Accent: Brand color thin line or geometric shape.
STYLE: Magazine profile, clean, trustworthy.
TYPOGRAPHY: Modern Sans-serif, bold name.
`.trim()

export const EQUIPO_GROUP_PROMPT = `
COMPOSITION: Dynamic Group Shot.
ZONING:
- Photo: Wide group shot, people interacting or smiling at cam.
- Overlay: Gradient fadearound bottom for text legibility.
- Text: "Meet the Team" or Department Name at bottom center.
STYLE: Community, culture, warmth.
`.trim()

export const EQUIPO_COLLAGE_PROMPT = `
COMPOSITION: Grid or Collage of faces.
ZONING:
- Grid: 2x2 or 3x1 layout of portraits.
- Label: Small name tags over each photo or below.
- Header: Unifying title "Our Experts" or "Dream Team".
STYLE: Diversity, capability, collective strength.
`.trim()

export const EQUIPO_QUOTE_PROMPT = `
COMPOSITION: Employee Spotlight with Quote.
ZONING:
- Visual: Portrait of employee (circle or cutout) on side.
- Text: Large pull-quote relative to their work/passion.
- Footer: Name and Role.
STYLE: Interview, insight, personal connection.
TYPOGRAPHY: Editorial quote style.
`.trim()

export const EQUIPO_ACTION_PROMPT = `
COMPOSITION: Candid Action Shot.
ZONING:
- Photo: Person working, presenting, or creating (in action).
- Overlay: Slight blur or darkening on one side.
- Caption: Description of the activity or achievement.
STYLE: Behind the scenes, authentic, hard work.
`.trim()

export const EQUIPO_MINIMAL_PROMPT = `
COMPOSITION: Minimalist Card profile.
ZONING:
- Background: Solid brand color or neutral card.
- Avatar: Small/Medium circular photo.
- Details: Name, Role, and Email/Social handle in center list.
STYLE: Digital business card, ID style, very clean.
TYPOGRAPHY: High legibility.
`.trim()

export const EQUIPO_DESCRIPTION = 'Diseño para mostrar a las personas del equipo. Humaniza la marca y genera confianza.'
