/**
 * DEFINICION - La Definición (Diccionario)
 * Grupo: Educar
 */

import type { IntentRequiredField } from '@/lib/creation-flow-types'

export const DEFINICION_EXTENDED_DESCRIPTION = `
Diseño estilo diccionario o enciclopedia para explicar un término técnico, 
concepto o jerga del sector. Posiciona a la marca como experta y autoridad 
en la materia.
`.trim()

export const DEFINICION_REQUIRED_FIELDS: IntentRequiredField[] = [
    {
        id: 'term',
        label: 'Término / Concepto',
        placeholder: 'Ej: ROI',
        type: 'text',
        required: true,
        aiContext: 'The term to be defined'
    },
    {
        id: 'phonetic',
        label: 'Pronunciación (Opcional)',
        placeholder: 'Ej: /roi/',
        type: 'text',
        required: false,
        aiContext: 'Phonetic spelling or subtitle'
    },
    {
        id: 'meaning',
        label: 'Significado Breve',
        placeholder: 'Ej: Retorno de Inversión...',
        type: 'text',
        required: true,
        aiContext: 'Definition of the term'
    }
]

export const DEFINICION_PROMPT = `
COMPOSITION: Minimalist dictionary card layout. Serif typography often used for the term.
ZONING:
- Term (30%): Big, bold serif text for the word being defined. 
- Phonetics/Type (10%): Small italic text underneath (noun. /adj.).
- Definition (50%): Clean paragraph text explaining the concept.
- Background: Very clean, paper texture or solid brand color.
STYLE: Academic, sophisticated, clean. "Knowledge card".
PHOTOGRAPHY: Minimal or none. Maybe a small abstract symbol or texture. Text is the hero.
PRIORITY: Legibility of the definition. Authority.
`.trim()

export const DEFINICION_DESCRIPTION = 'Diseño estilo diccionario para explicar términos técnicos o conceptos. Autoridad y minimalismo.'
