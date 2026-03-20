import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const creationFlowSource = fs.readFileSync(
    path.resolve(__dirname, '../../../hooks/useCreationFlow.ts'),
    'utf8'
)

describe('Brand kit session refresh', () => {
    it('prioriza colores y logo del brand kit actual al cargar un snapshot', () => {
        expect(creationFlowSource).toContain('const brandKitColors = buildBrandColorsFromKit()')
        expect(creationFlowSource).toContain('const primaryBrandKitLogoId = getPrimaryBrandKitLogoId(activeBrandKit)')
        expect(creationFlowSource).toContain('selectedLogoId: primaryBrandKitLogoId ?? presetState.selectedLogoId ?? null')
        expect(creationFlowSource).toContain('selectedBrandColors: brandKitColors.length > 0')
    })

    it('expone una resincronizacion explicita de branding desde el kit activo', () => {
        expect(creationFlowSource).toContain('const syncBrandingFromActiveKit = useCallback(() => {')
        expect(creationFlowSource).toContain('selectedBrandColors: resolvedColors')
        expect(creationFlowSource).toContain('selectedLogoId: resolvedLogoId')
    })
})
