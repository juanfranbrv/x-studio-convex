import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildPreviewTextLayout } from '../previewTextLayout'

const textLayersEditorSource = fs.readFileSync(
    path.resolve(__dirname, '../TextLayersEditor.tsx'),
    'utf8'
)
const globalsSource = fs.readFileSync(
    path.resolve(__dirname, '../../../app/globals.css'),
    'utf8'
)

describe('Preview text layout', () => {
    it('clasifica los textos en zonas semanticas reutilizables', () => {
        const layout = buildPreviewTextLayout({
            headline: 'Reto: Programa tu propio Semaforo',
            customTexts: {
                benefit_1: 'Desafio Semaforo Arduino',
                benefit_2: 'Orden de conexion de pines',
                contact_phone: '96 149 39 01',
            },
            textAssets: [
                { id: 'tagline-1', type: 'tagline', label: 'Tagline', value: 'Tu centro de aprendizaje integral' },
                { id: 'hook-1', type: 'hook', label: 'Hook', value: 'Logica de control de tiempos' },
                { id: 'url-1', type: 'url', label: 'URL', value: 'bauset.es' },
            ],
            cta: 'Inscribete al curso',
            ctaUrl: 'bauset.es/semaforo',
            ctaUrlEnabled: true,
        })

        expect(layout.headline.value).toBe('Reto: Programa tu propio Semaforo')
        expect(layout.support.map((item) => item.value)).toEqual([
            'Desafio Semaforo Arduino',
            'Orden de conexion de pines',
            'Tu centro de aprendizaje integral',
            'Logica de control de tiempos',
        ])
        expect(layout.meta.map((item) => item.value)).toEqual([
            '96 149 39 01',
            'bauset.es',
        ])
        expect(layout.cta?.value).toBe('Inscribete al curso')
        expect(layout.url?.value).toBe('bauset.es/semaforo')
    })

    it('usa zonas explicitas en lugar de una pila generica de texto', () => {
        expect(textLayersEditorSource).toContain('data-zone="headline"')
        expect(textLayersEditorSource).toContain('data-zone="support"')
        expect(textLayersEditorSource).toContain('data-zone="meta"')
        expect(textLayersEditorSource).toContain('data-zone="cta"')
        expect(textLayersEditorSource).toContain('buildPreviewTextLayout')
        expect(textLayersEditorSource).toContain('const PREVIEW_TEXT_FRAME_CLASS =')
        expect(textLayersEditorSource).toContain('const PREVIEW_TEXT_INLINE_ACTION_CLASS =')
        expect(textLayersEditorSource).toContain('const PREVIEW_TEXT_CHIP_REMOVE_SPACER_CLASS =')
        expect(textLayersEditorSource).toContain('usePreviewComposition')
        expect(textLayersEditorSource).toContain("data-layout-mode={compositionPlan.mode}")
        expect(textLayersEditorSource).toContain('PreviewEditableTextBlock')
        expect(textLayersEditorSource).toContain('group-hover:border-border/70')
        expect(textLayersEditorSource).toContain('group-focus-within:border-primary/35')
        expect(globalsSource).toContain('field-sizing: content;')
        expect(textLayersEditorSource).not.toContain('w-[min(64%,38ch)]')
        expect(textLayersEditorSource).not.toContain('max-w-2xl')
        expect(textLayersEditorSource).not.toContain('maxWidthCh={52}')
        expect(textLayersEditorSource).not.toContain('maxWidthCh={74}')
    })

    it('gobierna la escala con tokens fluidos de contenedor y no con breakpoints desktop rigidos', () => {
        expect(globalsSource).toContain('--tl-head-size: clamp(')
        expect(globalsSource).toContain('--tl-support-size: clamp(')
        expect(globalsSource).toContain('--tl-meta-size: clamp(')
        expect(globalsSource).toContain('--tl-zone-headline-max: min(94cqi, 36ch);')
        expect(globalsSource).toContain('--tl-zone-support-max: min(82cqi, 54ch);')
        expect(globalsSource).toContain('--tl-zone-meta-max: min(68cqi, 34ch);')
        expect(globalsSource).toContain('.text-layer-editor [data-zone="support"]')
        expect(globalsSource).toContain('.text-layer-editor [data-zone="meta"]')
        expect(globalsSource).not.toContain('--tl-gap: -3px;')
        expect(globalsSource).not.toContain('--tl-middle-top: -34px;')
        expect(globalsSource).not.toContain('@media (min-width: 1440px)')
        expect(globalsSource).not.toContain('margin-bottom: -25px;')
    })
})
