import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const headerSource = fs.readFileSync(path.resolve(__dirname, '../Header.tsx'), 'utf8')

describe('Header brand switcher', () => {
    it('usa onSelect en los items del dropdown para cambiar de brand kit', () => {
        expect(headerSource).toContain('onSelect={() => onBrandChange?.(brand.id)}')
        expect(headerSource).not.toContain('onClick={() => onBrandChange?.(brand.id)}')
    })
})
