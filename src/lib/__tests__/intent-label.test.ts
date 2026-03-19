import { describe, expect, it } from 'vitest'

import { getDetectedIntentLabel } from '../intent-label'

describe('getDetectedIntentLabel', () => {
    it('devuelve el nombre visible del intent cuando recibe un id valido', () => {
        expect(getDetectedIntentLabel('oferta')).toBe('La Oferta')
    })

    it('acepta ids en mayusculas y con espacios laterales', () => {
        expect(getDetectedIntentLabel('  OFERTA  ')).toBe('La Oferta')
    })

    it('devuelve fallback legible cuando no reconoce el intent', () => {
        expect(getDetectedIntentLabel(undefined, 'Selecciona intención')).toBe('Selecciona intención')
        expect(getDetectedIntentLabel('desconocido')).toBe('desconocido')
    })
})
