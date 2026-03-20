import { describe, expect, it } from 'vitest'

import {
    DEFAULT_SOCIAL_FORMAT_ID,
    DEFAULT_SOCIAL_PLATFORM,
    getDefaultSocialFormatId,
    INITIAL_GENERATION_STATE,
} from '../creation-flow-types'

describe('social format defaults', () => {
    it('usa Instagram como plataforma por defecto', () => {
        expect(DEFAULT_SOCIAL_PLATFORM).toBe('instagram')
        expect(INITIAL_GENERATION_STATE.selectedPlatform).toBe('instagram')
    })

    it('usa el formato vertical 4:5 por defecto', () => {
        expect(DEFAULT_SOCIAL_FORMAT_ID).toBe('ig-portrait-feed')
        expect(getDefaultSocialFormatId('instagram')).toBe('ig-portrait-feed')
        expect(INITIAL_GENERATION_STATE.selectedFormat).toBe('ig-portrait-feed')
    })

    it('mantiene un fallback estable para otras redes', () => {
        expect(getDefaultSocialFormatId('facebook')).toBe('fb-square')
        expect(getDefaultSocialFormatId('linkedin')).toBe('li-square')
    })
})
