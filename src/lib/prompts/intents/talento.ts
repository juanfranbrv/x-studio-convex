/**
 * TALENTO - El Talento (Hiring / Únete)
 * Grupo: Conectar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const TALENTO_EXTENDED_DESCRIPTION = `
Diseño para captación de talento y ofertas de empleo. "Estamos contratando" 
o "Únete al equipo". Debe reflejar el ambiente laboral y los valores.
`.trim()

export const TALENTO_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'position',
        label: 'Posición / Puesto',
        placeholder: 'Ej: Diseñador UI Senior',
        type: 'text',
        required: true,
        aiContext: 'Job position title'
    },
    {
        id: 'cta_hiring',
        label: 'Llamada a la Acción',
        placeholder: 'Ej: ¡Te buscamos! / We are Hiring',
        type: 'text',
        required: true,
        aiContext: 'Hiring headline'
    },
    {
        id: 'perk',
        label: 'Beneficio Clave (Opcional)',
        placeholder: 'Ej: Remoto 100%',
        type: 'text',
        required: false,
        aiContext: 'Key benefit or requirement'
    }
]

export const TALENTO_PROMPT = `
COMPOSITION: Recruitment poster style. Eye-catching headline.
ZONING:
- Headline (40%): Big "WE ARE HIRING" or "JOIN US" typography.
- Role/Detail (30%): Specific job title and 1-2 key benefits.
- Visual/Vibe (30%): Office culture photo or abstract team graphic.
STYLE: Dynamic, inviting, aspirational.
PHOTOGRAPHY: Bright office environment, team collaborating, or minimalist desk setup.
PRIORITY: Catch the attention of candidates. Clear role.
`.trim()

export const TALENTO_DESCRIPTION = 'Diseño para captación de talento. "We are Hiring". Foco en la posición y cultura.'
