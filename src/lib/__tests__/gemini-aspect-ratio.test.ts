import { describe, expect, it } from 'vitest'

import { mapGeminiAspectRatio } from '../gemini-aspect-ratio'

describe('mapGeminiAspectRatio', () => {
    it('mantiene ratios exactos soportados por Gemini 3 Pro Image', () => {
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview', '21:9')).toBe('21:9')
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview', '4:5')).toBe('4:5')
    })

    it('mantiene ratios panoramicos extra en Gemini 3.1 Flash Image', () => {
        expect(mapGeminiAspectRatio('gemini-3.1-flash-image-preview', '4:1')).toBe('4:1')
        expect(mapGeminiAspectRatio('gemini-3.1-flash-image-preview', '1:4')).toBe('1:4')
    })

    it('aproxima 4:1 a 21:9 cuando el modelo no lo soporta', () => {
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview', '4:1')).toBe('21:9')
        expect(mapGeminiAspectRatio('gemini-2.5-flash-image', '4:1')).toBe('21:9')
    })

    it('aproxima formatos sociales legacy a su ratio oficial mas cercano', () => {
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview', '1.91:1')).toBe('16:9')
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview', '2:1')).toBe('16:9')
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview', '1.2:1')).toBe('5:4')
    })

    it('cae en 1:1 cuando recibe un valor invalido', () => {
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview', 'foo')).toBe('1:1')
        expect(mapGeminiAspectRatio('gemini-3-pro-image-preview')).toBe('1:1')
    })
})
