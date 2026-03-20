import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const onboardingSource = fs.readFileSync(
    path.resolve(__dirname, '../page.tsx'),
    'utf8'
)

describe('Onboarding brand precedence', () => {
    it('usa la ultima sesion solo para decidir el modulo, no para sustituir el brand activo', () => {
        expect(onboardingSource).toContain("const targetPath = lastVisitedModule.module === 'carousel' ? '/carousel' : '/image'")
        expect(onboardingSource).not.toContain("const targetBrandId = typeof lastVisitedModule.brand_id === 'string' ? lastVisitedModule.brand_id : null")
        expect(onboardingSource).not.toContain('setActiveBrandKit(targetBrandId, true, true)')
    })
})
