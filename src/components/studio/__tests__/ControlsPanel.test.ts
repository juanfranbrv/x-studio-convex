import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const controlsPanelSource = fs.readFileSync(
    path.resolve(__dirname, '../ControlsPanel.tsx'),
    'utf8'
)

describe('ControlsPanel bottom spacing', () => {
    it('reserva solo un margen corto antes de la barra de generar', () => {
        expect(controlsPanelSource).toContain('space-y-4 pr-4 pb-10 md:pr-5 md:pb-12')
        expect(controlsPanelSource).not.toContain('space-y-4 pr-4 pb-28 md:pr-5 md:pb-32')
    })
})
