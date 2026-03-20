import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const controlsPanelSource = fs.readFileSync(
    path.resolve(__dirname, '../ControlsPanel.tsx'),
    'utf8'
)

describe('Brand kit reload UI', () => {
    it('mueve la recarga del brand kit a la cabecera de la tarjeta y la unifica para logos y colores', () => {
        expect(controlsPanelSource).toContain('const handleReloadBrandKit = async () => {')
        expect(controlsPanelSource).toContain("title: t('ui.brandKitReloadedTitle'")
        expect(controlsPanelSource).toContain("description: t('ui.brandKitReloadedDescription'")
        expect(controlsPanelSource).toContain("onClick={handleReloadBrandKit}")
        expect(controlsPanelSource).toContain("t('ui.reloadBrandKit', { defaultValue: 'Recargar kit' })")
        expect(controlsPanelSource).not.toContain('onClick={handleReloadBrandColors}')
    })
})
