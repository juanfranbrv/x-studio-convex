import { describe, expect, it } from 'vitest'
import { buildPreviewCompositionMetrics } from '../previewCompositionMetrics'
import { buildPreviewCompositionPlan, resolvePreviewCompositionForCanvas } from '../previewCompositionPlan'

describe('Preview composition plan', () => {
    it('calcula presion textual y bucket de viewport a partir del canvas y los textos visibles', () => {
        const metrics = buildPreviewCompositionMetrics({
            canvasWidth: 420,
            canvasHeight: 560,
            headlineLength: 34,
            supportLengths: [24, 27, 26, 38],
            metaLengths: [11, 16],
            hasCta: true,
            hasUrl: true,
        })

        expect(metrics.viewportBucket).toBe('medium')
        expect(metrics.aspectBucket).toBe('portrait')
        expect(metrics.textPressure).toBe('high')
        expect(metrics.totalVisibleBlocks).toBe(9)
    })

    it('resuelve layout compact para canvas estrecho con alta carga textual', () => {
        const plan = buildPreviewCompositionPlan(buildPreviewCompositionMetrics({
            canvasWidth: 420,
            canvasHeight: 560,
            headlineLength: 34,
            supportLengths: [24, 27, 26, 38],
            metaLengths: [11, 16],
            hasCta: true,
            hasUrl: true,
        }))

        expect(plan.mode).toBe('compact')
        expect(plan.zoneSupportMaxCh).toBeGreaterThan(plan.zoneMetaMaxCh)
        expect(plan.stackGap).toBeLessThan(1.02)
    })

    it('usa el tamano real del canvas para devolver un plan reactivo', () => {
        const result = resolvePreviewCompositionForCanvas({
            canvasWidth: 320,
            canvasHeight: 520,
            headline: 'Reto: Programa tu propio Semaforo',
            support: ['A', 'B', 'C'],
            meta: ['96 149 39 01'],
            hasCta: true,
            hasUrl: false,
        })

        expect(result.mode).toBe('compact')
        expect(result.metrics.viewportBucket).toBe('narrow')
    })

    it('ensancha y airea la composicion cuando el canvas es amplio y el texto lo permite', () => {
        const plan = buildPreviewCompositionPlan(buildPreviewCompositionMetrics({
            canvasWidth: 760,
            canvasHeight: 820,
            headlineLength: 30,
            supportLengths: [20, 24, 22],
            metaLengths: [11],
            hasCta: true,
            hasUrl: false,
        }))

        expect(plan.mode).toBe('airy')
        expect(plan.zoneHeadlineMaxCh).toBeGreaterThanOrEqual(34)
        expect(plan.zoneSupportMaxCh).toBeGreaterThanOrEqual(52)
        expect(plan.stackGap).toBeGreaterThan(1)
    })

    it('prioriza compactacion controlada en mobile sin caer en microtipografia', () => {
        const plan = buildPreviewCompositionPlan(buildPreviewCompositionMetrics({
            canvasWidth: 320,
            canvasHeight: 568,
            headlineLength: 28,
            supportLengths: [22, 24, 27],
            metaLengths: [11],
            hasCta: true,
            hasUrl: false,
        }))

        expect(plan.mode).toBe('compact')
        expect(plan.supportScale).toBeGreaterThanOrEqual(0.92)
        expect(plan.stackGap).toBeGreaterThan(0)
    })

    it('desplaza el bloque editorial hacia abajo en canvas retrato para evitar apelotonamiento superior', () => {
        const portraitPlan = buildPreviewCompositionPlan(buildPreviewCompositionMetrics({
            canvasWidth: 420,
            canvasHeight: 560,
            headlineLength: 34,
            supportLengths: [24, 27, 26, 38],
            metaLengths: [11],
            hasCta: true,
            hasUrl: false,
        }))

        const landscapePlan = buildPreviewCompositionPlan(buildPreviewCompositionMetrics({
            canvasWidth: 760,
            canvasHeight: 520,
            headlineLength: 34,
            supportLengths: [24, 27, 26, 38],
            metaLengths: [11],
            hasCta: true,
            hasUrl: false,
        }))

        expect(portraitPlan.titleTop).toBeGreaterThan(landscapePlan.titleTop)
        expect(portraitPlan.middleTop).toBeGreaterThan(landscapePlan.middleTop)
        expect(portraitPlan.brandTop).toBeGreaterThanOrEqual(landscapePlan.brandTop)
        expect(portraitPlan.flowTopInset).toBeGreaterThan(landscapePlan.flowTopInset)
    })
})
