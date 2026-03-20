import { describe, expect, it } from 'vitest'
import { shouldApplyLastVisitedImageBrand } from '../lastVisitedScope'

describe('shouldApplyLastVisitedImageBrand', () => {
    it('solo aplica el ultimo brand visitado cuando todavia no existe ningun brand activo', () => {
        expect(
            shouldApplyLastVisitedImageBrand({
                targetBrandId: 'brand-b',
                requestedActiveBrandId: null,
                currentActiveBrandId: null,
                persistedActiveBrandId: null,
            })
        ).toBe(true)
    })

    it('no pisa el brand activo global al entrar en imagen desde otro modulo', () => {
        expect(
            shouldApplyLastVisitedImageBrand({
                targetBrandId: 'brand-a',
                requestedActiveBrandId: 'brand-b',
                currentActiveBrandId: 'brand-b',
                persistedActiveBrandId: null,
            })
        ).toBe(false)
    })

    it('ignora respuestas tardias aunque el brand activo haya aparecido durante la espera', () => {
        expect(
            shouldApplyLastVisitedImageBrand({
                targetBrandId: 'brand-a',
                requestedActiveBrandId: null,
                currentActiveBrandId: 'brand-b',
                persistedActiveBrandId: null,
            })
        ).toBe(false)
    })

    it('no hace nada si no hay ultimo brand valido', () => {
        expect(
            shouldApplyLastVisitedImageBrand({
                targetBrandId: null,
                requestedActiveBrandId: 'brand-a',
                currentActiveBrandId: 'brand-a',
                persistedActiveBrandId: null,
            })
        ).toBe(false)
    })

    it('no pisa el brand global persistido aunque la pagina entre sin brand activo resuelto todavia', () => {
        expect(
            shouldApplyLastVisitedImageBrand({
                targetBrandId: 'brand-a',
                requestedActiveBrandId: null,
                currentActiveBrandId: null,
                persistedActiveBrandId: 'brand-b',
            })
        ).toBe(false)
    })
})
