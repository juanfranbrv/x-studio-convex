/**
 * BTS - Behind The Scenes (Proceso y Realidad)
 * Grupo: Conectar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const BTS_EXTENDED_DESCRIPTION = `
Diseño para mostrar el "cómo se hizo", el estudio, el proceso de fabricación 
o el día a día. Genera cercanía mostrando la realidad sin filtros (o con 
filtros estéticos).
`.trim()

export const BTS_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'process_name',
        label: 'Actividad / Proceso',
        placeholder: 'Ej: Fabricando el prototipo',
        type: 'text',
        required: true,
        aiContext: 'The process or activity being shown'
    },
    {
        id: 'context_bts',
        label: 'Contexto',
        placeholder: 'Ej: Nuestro Taller / Backstage',
        type: 'text',
        required: false,
        aiContext: 'Location or context of the BTS'
    }
]

export const BTS_PROMPT = `
COMPOSITION: Candid, documentary style. "Fly on the wall" perspective.
ZONING:
- Main Action (80%): Close-up of hands working, messy desk, or manufacturing process.
- Caption/Label (20%): Small tag "Work in Progress", "Behind the Scenes", or location.
STYLE: Authentic, gritty or warm (depending on brand), less polished/corporate.
PHOTOGRAPHY: Shallow depth of field, focus on tools or hands. Natural light or workshop vibe.
PRIORITY: Authenticity and showing the craft.
`.trim()

export const BTS_DESCRIPTION = 'Diseño "Behind The Scenes" para mostrar procesos de trabajo, talleres o el día a día.'
