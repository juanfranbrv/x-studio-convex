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
    brandName: string
    brandDNA: BrandDNA
    model?: string
    // Optional per-slide overrides
    slideOverrides?: { index: number; text: string }[]
}

export interface GenerateCarouselResult {
    success: boolean
    slides: CarouselSlide[]
    error?: string
}

/**
 * Decompose a prompt into N slide concepts using AI
 */
async function decomposeIntoSlides(
    prompt: string,
    slideCount: number,
    brand: { name: string; brand_dna: BrandDNA },
    model: string
): Promise<SlideContent[]> {
    const decompositionPrompt = `
Eres un experto en contenido para Instagram. Tu tarea es descomponer el siguiente tema en exactamente ${slideCount} slides para un carrusel.

TEMA: "${prompt}"

Para cada slide, proporciona:
1. Un título corto (máximo 6 palabras)
2. Una descripción breve (1-2 oraciones)
3. Un prompt visual detallado para generar la imagen

REGLAS:
- Slide 1 debe ser una portada llamativa que enganche
- Los slides intermedios desarrollan el contenido
- El último slide debe tener un CTA o conclusión
- Mantén coherencia visual y narrativa
- Usa el tono de la marca: ${brand.brand_dna?.tone_of_voice?.join(', ') || 'profesional'}

Responde SOLO con JSON válido en este formato:
{
  "slides": [
    {
      "index": 0,
      "title": "Título del slide",
      "description": "Descripción breve",
      "visualPrompt": "Prompt detallado para la imagen"
    }
  ]
}
`

    try {
        const response = await generateTextUnified(
            brand,
            decompositionPrompt,
            model,
            undefined,
            '' // No system prompt override, use brand context
        )

        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('No valid JSON in response')
        }

        const parsed = JSON.parse(jsonMatch[0])
        return parsed.slides || []

    } catch (error) {
        console.error('Decomposition error:', error)
        // Fallback: create simple slides
        return Array.from({ length: slideCount }, (_, i) => ({
            index: i,
            title: i === 0 ? 'Portada' : i === slideCount - 1 ? 'Conclusión' : `Punto ${i}`,
            description: prompt,
            visualPrompt: `${prompt} - Slide ${i + 1} of ${slideCount}`
        }))
    }
}

/**
 * Generate a single slide image
 */
async function generateSlideImage(
    slideContent: SlideContent,
    totalSlides: number,
    style: string,
    aspectRatio: string,
    brand: { name: string; brand_dna: BrandDNA },
    model: string,
    previousSlideUrl?: string
): Promise<string> {
    // Build coherent prompt
    const coherenceContext = previousSlideUrl
        ? 'Mantén coherencia visual con los slides anteriores del carrusel.'
        : 'Este es el primer slide del carrusel, establece el estilo visual.'

    const fullPrompt = `
CARRUSEL DE INSTAGRAM - Slide ${slideContent.index + 1} de ${totalSlides}

TÍTULO: ${slideContent.title}
DESCRIPCIÓN: ${slideContent.description}

INSTRUCCIONES VISUALES:
${slideContent.visualPrompt}

ESTILO: ${style || 'Moderno y profesional'}
COHERENCIA: ${coherenceContext}

REQUISITOS:
- Diseño limpio optimizado para Instagram
- Tipografía legible incluso en móvil
- Colores de marca consistentes
- Espacio para texto superpuesto si es necesario
`

    const imageUrl = await generateContentImageUnified(brand, fullPrompt, {
        aspectRatio,
        model
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
        brandName,
        brandDNA,
        model = 'gemini-3-pro-image-preview',
        slideOverrides = []
    } = input

    const brand = { name: brandName, brand_dna: brandDNA }

    try {
        console.log(`\n🎠 Starting carousel generation: ${slideCount} slides`)

        // Step 1: Decompose prompt into slides
        console.log('📝 Decomposing prompt into slide concepts...')
        let slideContents = await decomposeIntoSlides(
            prompt,
            slideCount,
            brand,
            'gemini-3-flash'
        )

        // Apply any manual overrides
        slideOverrides.forEach(override => {
            if (slideContents[override.index]) {
                slideContents[override.index].visualPrompt = override.text
                slideContents[override.index].description = override.text
            }
        })

        // Step 2: Generate images for each slide
        const slides: CarouselSlide[] = slideContents.map(sc => ({
            index: sc.index,
            title: sc.title,
            description: sc.description,
            status: 'pending' as const
        }))

        let previousUrl: string | undefined

        for (let i = 0; i < slideContents.length; i++) {
            console.log(`🖼️ Generating slide ${i + 1}/${slideCount}...`)
            slides[i].status = 'generating'

            try {
                const imageUrl = await generateSlideImage(
                    slideContents[i],
                    slideCount,
                    style,
                    aspectRatio,
                    brand,
                    model,
                    previousUrl
                )

                slides[i].imageUrl = imageUrl
                slides[i].status = 'done'
                previousUrl = imageUrl

            } catch (error) {
                console.error(`Error generating slide ${i + 1}:`, error)
                slides[i].status = 'error'
                slides[i].error = error instanceof Error ? error.message : 'Unknown error'
            }
        }

        console.log('✅ Carousel generation complete!')

        return {
            success: true,
            slides
        }

    } catch (error) {
        console.error('Carousel generation error:', error)
        return {
            success: false,
            slides: [],
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Regenerate a single slide
 */
export async function regenerateSlideAction(
    slideIndex: number,
    slideContent: SlideContent,
    totalSlides: number,
    style: string,
    aspectRatio: string,
    brandName: string,
    brandDNA: BrandDNA,
    model: string = 'gemini-3-pro-image-preview'
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    const brand = { name: brandName, brand_dna: brandDNA }

    try {
        console.log(`🔄 Regenerating slide ${slideIndex + 1}...`)

        const imageUrl = await generateSlideImage(
            slideContent,
            totalSlides,
            style,
            aspectRatio,
            brand,
            model
        )

        return { success: true, imageUrl }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}
