'use server'

import { generateContentImageUnified } from '@/lib/gemini'
import { generateTextUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'

export interface SlideContent {
    index: number
    title: string
    description: string
    visualPrompt: string
}

export interface CarouselSlide {
    index: number
    imageUrl?: string
    title: string
    description: string
    status: 'pending' | 'generating' | 'done' | 'error'
    error?: string
}

export interface GenerateCarouselInput {
    prompt: string
    slideCount: number
    aspectRatio?: '1:1' | '4:5'
    style?: string
    brandDNA: BrandDNA
    // Optional per-slide overrides
    slideOverrides?: { index: number; text: string }[]
    // Brand Kit Selections
    selectedLogoUrl?: string
    selectedColors?: string[]
    selectedImageUrls?: string[]
    includeLogoOnSlides?: boolean
}

export interface GenerateCarouselResult {
    success: boolean
    slides: CarouselSlide[]
    error?: string
}

/**
 * Build brand context string for prompts
 */
function buildBrandContext(brand: BrandDNA, selectedColors?: string[], includeLogoUrl?: string): string {
    const parts: string[] = []

    // Brand identity
    parts.push(`MARCA: ${brand.brand_name}`)
    if (brand.tagline) parts.push(`TAGLINE: ${brand.tagline}`)
    if (brand.business_overview) parts.push(`CONTEXTO: ${brand.business_overview}`)

    // Colors
    const colors = selectedColors && selectedColors.length > 0
        ? selectedColors
        : brand.colors?.slice(0, 4).map(c => c.color) || []
    if (colors.length > 0) {
        parts.push(`PALETA DE COLORES: ${colors.join(', ')}`)
    }

    // Tone
    if (brand.tone_of_voice?.length) {
        parts.push(`TONO DE VOZ: ${brand.tone_of_voice.join(', ')}`)
    }

    // Visual aesthetic
    if (brand.visual_aesthetic?.length) {
        parts.push(`ESTÉTICA VISUAL: ${brand.visual_aesthetic.join(', ')}`)
    }

    // Fonts
    if (brand.fonts?.length) {
        const fontNames = brand.fonts.map(f => f.family).join(', ')
        parts.push(`TIPOGRAFÍAS: ${fontNames}`)
    }

    // Logo instruction
    if (includeLogoUrl) {
        parts.push(`INCLUIR LOGO: Sí, integrar sutilmente el logo de la marca`)
    }

    return parts.join('\n')
}

/**
 * Decompose a prompt into N slide concepts using AI
 */
async function decomposeIntoSlides(
    prompt: string,
    slideCount: number,
    brand: BrandDNA,
    model: string
): Promise<SlideContent[]> {
    const brandContext = buildBrandContext(brand)

    const decompositionPrompt = `
Eres un experto en contenido para Instagram para la marca "${brand.brand_name}".
Tu tarea es descomponer el tema en exactamente ${slideCount} slides para un carrusel.

${brandContext}

TEMA DEL CARRUSEL: "${prompt}"

Para cada slide, proporciona:
1. Título corto (máximo 6 palabras)
2. Descripción breve (1-2 oraciones)
3. Prompt visual detallado que refleje la identidad de la marca

REGLAS:
- Slide 1: Portada llamativa con el título principal
- Slides intermedios: Desarrollan el contenido punto por punto
- Último slide: CTA o conclusión
- COHERENCIA: Todos los slides deben usar la misma paleta de colores y estilo
- MARCA: Reflejar los valores y tono de ${brand.brand_name}

Responde SOLO con JSON válido:
{
  "slides": [
    {
      "index": 0,
      "title": "Título",
      "description": "Descripción",
      "visualPrompt": "Prompt visual detallado..."
    }
  ]
}
`

    const brandWrapper = { name: brand.brand_name, brand_dna: brand }

    try {
        const response = await generateTextUnified(
            brandWrapper,
            decompositionPrompt,
            model,
            undefined,
            ''
        )

        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error('No valid JSON')

        const parsed = JSON.parse(jsonMatch[0])
        return parsed.slides || []

    } catch (error) {
        console.error('Decomposition error:', error)
        return Array.from({ length: slideCount }, (_, i) => ({
            index: i,
            title: i === 0 ? 'Portada' : i === slideCount - 1 ? 'Conclusión' : `Punto ${i}`,
            description: prompt,
            visualPrompt: `${prompt} - Slide ${i + 1} of ${slideCount} for ${brand.brand_name}`
        }))
    }
}

/**
 * Generate a single slide image with brand context
 */
async function generateSlideImage(
    slideContent: SlideContent,
    totalSlides: number,
    style: string,
    aspectRatio: string,
    brand: BrandDNA,
    model: string,
    selectedColors?: string[],
    selectedLogoUrl?: string,
    selectedImageUrls?: string[]
): Promise<string> {
    const brandContext = buildBrandContext(brand, selectedColors, selectedLogoUrl)

    const fullPrompt = `
CARRUSEL INSTAGRAM - Slide ${slideContent.index + 1} de ${totalSlides}
MARCA: ${brand.brand_name}

${brandContext}

---
CONTENIDO DEL SLIDE:
TÍTULO: ${slideContent.title}
DESCRIPCIÓN: ${slideContent.description}

ESTILO VISUAL: ${style}
INSTRUCCIONES: ${slideContent.visualPrompt}

REQUISITOS TÉCNICOS:
- Diseño limpio y profesional para Instagram
- Colores de la paleta de marca
- Tipografía legible en móvil
- ${selectedLogoUrl ? 'Incluir logo de forma sutil' : 'Sin logo'}
- Coherencia con otros slides del carrusel
`

    const brandWrapper = { name: brand.brand_name, brand_dna: brand }

    // Build context array for reference images
    const context: Array<{ type: string; value: string; label?: string }> = []
    if (selectedImageUrls && selectedImageUrls.length > 0) {
        selectedImageUrls.slice(0, 2).forEach((url, idx) => {
            context.push({ type: 'image', value: url, label: `Referencia ${idx + 1}` })
        })
    }
    if (selectedLogoUrl) {
        context.push({ type: 'logo', value: selectedLogoUrl, label: 'Logo' })
    }

    const imageUrl = await generateContentImageUnified(brandWrapper, fullPrompt, {
        aspectRatio,
        model,
        context
    })

    return imageUrl
}

/**
 * Main carousel generation action
 */
export async function generateCarouselAction(
    input: GenerateCarouselInput
): Promise<GenerateCarouselResult> {
    const {
        prompt,
        slideCount,
        aspectRatio = '1:1',
        style = 'Moderno y minimalista',
        brandDNA,
        slideOverrides = [],
        selectedLogoUrl,
        selectedColors,
        selectedImageUrls,
        includeLogoOnSlides
    } = input

    const model = 'gemini-3-pro-image-preview'

    try {
        console.log(`\n🎠 Starting carousel for ${brandDNA.brand_name}: ${slideCount} slides`)

        // Step 1: Decompose prompt
        console.log('📝 Decomposing with brand context...')
        let slideContents = await decomposeIntoSlides(prompt, slideCount, brandDNA, 'gemini-3-flash')

        // Apply overrides
        slideOverrides.forEach(override => {
            if (slideContents[override.index]) {
                slideContents[override.index].visualPrompt = override.text
                slideContents[override.index].description = override.text
            }
        })

        // Step 2: Generate images
        const slides: CarouselSlide[] = slideContents.map(sc => ({
            index: sc.index,
            title: sc.title,
            description: sc.description,
            status: 'pending' as const
        }))

        for (let i = 0; i < slideContents.length; i++) {
            console.log(`🖼️ Generating slide ${i + 1}/${slideCount} with brand context...`)
            slides[i].status = 'generating'

            try {
                const imageUrl = await generateSlideImage(
                    slideContents[i],
                    slideCount,
                    style,
                    aspectRatio,
                    brandDNA,
                    model,
                    selectedColors,
                    includeLogoOnSlides ? selectedLogoUrl : undefined,
                    selectedImageUrls
                )

                slides[i].imageUrl = imageUrl
                slides[i].status = 'done'

            } catch (error) {
                console.error(`Error slide ${i + 1}:`, error)
                slides[i].status = 'error'
                slides[i].error = error instanceof Error ? error.message : 'Error'
            }
        }

        console.log('✅ Carousel complete!')
        return { success: true, slides }

    } catch (error) {
        console.error('Carousel error:', error)
        return {
            success: false,
            slides: [],
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}

/**
 * Regenerate a single slide with brand context
 */
export async function regenerateSlideAction(
    slideIndex: number,
    slideContent: SlideContent,
    totalSlides: number,
    style: string,
    aspectRatio: string,
    brandDNA: BrandDNA,
    selectedLogoUrl?: string,
    selectedColors?: string[],
    model: string = 'gemini-3-pro-image-preview'
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    try {
        console.log(`🔄 Regenerating slide ${slideIndex + 1} for ${brandDNA.brand_name}...`)

        const imageUrl = await generateSlideImage(
            slideContent,
            totalSlides,
            style,
            aspectRatio,
            brandDNA,
            model,
            selectedColors,
            selectedLogoUrl
        )

        return { success: true, imageUrl }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}
