import type { BrandDNA } from '@/lib/brand-types'

export function buildCarouselBrandContext(
    brand: BrandDNA,
    selectedColors?: string[],
    includeLogoUrl?: string
): string {
    const parts: string[] = []

    // Brand identity
    parts.push(`MARCA: ${brand.brand_name}`)
    if (brand.tagline) parts.push(`TAGLINE: ${brand.tagline}`)
    if (brand.business_overview) parts.push(`CONTEXTO: ${brand.business_overview}`)
    if (brand.preferred_language) parts.push(`IDIOMA_PREFERIDO: ${brand.preferred_language}`)
    if (brand.target_audience?.length) parts.push(`PUBLICO_OBJETIVO: ${brand.target_audience.join(', ')}`)
    if (brand.brand_values?.length) parts.push(`VALORES: ${brand.brand_values.join(', ')}`)
    if (brand.text_assets?.brand_context) parts.push(`VISION_CONTEXTO: ${brand.text_assets.brand_context}`)

    // Colors
    const colors = selectedColors && selectedColors.length > 0
        ? selectedColors
        : brand.colors?.slice(0, 4).map(c => c.color) || []
    if (colors.length > 0) {
        parts.push(`PALETA DE COLORES: ${colors.join(', ')}`)
    }

    // Tone
    if (brand.tone_of_voice?.length) {
        parts.push(`TONO_DE_VOZ: ${brand.tone_of_voice.join(', ')}`)
    }

    // Visual aesthetic
    if (brand.visual_aesthetic?.length) {
        parts.push(`ESTETICA VISUAL: ${brand.visual_aesthetic.join(', ')}`)
    }

    // Fonts
    if (brand.fonts?.length) {
        const fontNames = brand.fonts.map(f => f.family).join(', ')
        parts.push(`TIPOGRAFIAS: ${fontNames}`)
    }

    // Logo instruction
    if (includeLogoUrl) {
        parts.push('INCLUIR LOGO: Si, integrar sutilmente el logo de la marca')
    }

    return parts.join('\n')
}
