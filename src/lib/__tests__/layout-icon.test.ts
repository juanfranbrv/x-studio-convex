import { describe, expect, it } from 'vitest'

import { getLucideLayoutIcon } from '../layout-icon'

describe('getLucideLayoutIcon', () => {
    it('resuelve el alias legacy Layout a un icono de lucide', () => {
        expect(getLucideLayoutIcon('Layout')).not.toBeNull()
    })

    it('resuelve el alias legacy Frame a un icono de lucide', () => {
        expect(getLucideLayoutIcon('Frame')).not.toBeNull()
    })
})
