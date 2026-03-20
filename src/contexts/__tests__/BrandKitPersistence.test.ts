import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const brandKitContextSource = fs.readFileSync(
    path.resolve(__dirname, '../BrandKitContext.tsx'),
    'utf8'
)

describe('BrandKit persistence', () => {
    it('espera a persistir current_brand_id antes de dar por aplicado el cambio de kit', () => {
        expect(brandKitContextSource).toContain('const persistCurrentBrandSelection = useCallback(async (brandId: string) => {')
        expect(brandKitContextSource).toContain('const result = await updateLastBrand({ clerk_id: user.id, brandId })')
        expect(brandKitContextSource).toContain('await persistCurrentBrandSelection(id)')
        expect(brandKitContextSource).not.toContain("updateLastBrand({ clerk_id: user.id, brandId: id })\n                            .catch")
    })

    it('corrige un brand activo valido pero distinto al current_brand_id persistido', () => {
        expect(brandKitContextSource).toContain("if (typeof userRecord === 'undefined') {")
        expect(brandKitContextSource).toContain("const hasPersistedMismatch = Boolean(persistedPreferredId && activeId && activeId !== persistedPreferredId)")
        expect(brandKitContextSource).toContain('if (hasValidActive && !hasPersistedMismatch) return')
        expect(brandKitContextSource).toContain('const preferredId = persistedPreferredId || brandKits[0].id')
    })

    it('protege temporalmente el kit recien elegido frente a un current_brand_id desfasado', () => {
        expect(brandKitContextSource).toContain('const pendingPersistedBrandIdRef = useRef<string | null>(null)')
        expect(brandKitContextSource).toContain('pendingPersistedBrandIdRef.current = brandId')
        expect(brandKitContextSource).toContain('const resolvedPersistedBrandId = pendingPersistedBrandIdRef.current ?? lastBrandId')
        expect(brandKitContextSource).toContain('if (userRecord?.current_brand_id === pendingPersistedBrandIdRef.current) {')
    })
})
