import { BrandDNA } from '../../brand-types'
import { BRAND_DIRECTOR_TEMPLATE } from './brand-director-template'

export function buildBrandDirectorPrompt(brand: { name: string; brand_dna: BrandDNA }): string {
    const { name, brand_dna } = brand
    const { colors, tone_of_voice, fonts } = brand_dna

    const tone = tone_of_voice?.join(', ') || 'Sin definir'
    const headingFont = fonts?.[0]?.family || 'Sin definir'
    const bodyFont = fonts?.[1]?.family || 'Sin definir'
    const colorList = colors?.map(c => c.color).join(', ') || 'Sin definir'

    return BRAND_DIRECTOR_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{colors}}', colorList)
        .replace('{{tone}}', tone)
        .replace('{{headingFont}}', headingFont)
        .replace('{{bodyFont}}', bodyFont)
}

