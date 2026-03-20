import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const imagePageSource = fs.readFileSync(path.resolve(__dirname, '../page.tsx'), 'utf8')

describe('ImagePage last visited hydration effect', () => {
    it('no se vuelve a disparar al cambiar la identidad de setActiveBrandKit y respeta el brand persistido', () => {
        expect(imagePageSource).toContain('}, [user?.id, userRecord?.current_brand_id])')
        expect(imagePageSource).not.toContain('}, [user?.id, setActiveBrandKit])')
        expect(imagePageSource).toContain('setActiveBrandKitRef.current(targetBrandId, true, true)')
        expect(imagePageSource).toContain('persistedActiveBrandId: userRecord?.current_brand_id ? String(userRecord.current_brand_id) : null')
    })
})
