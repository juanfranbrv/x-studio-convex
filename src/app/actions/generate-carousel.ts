'use server'

import { generateContentImageUnified } from '@/lib/gemini'
import { generateTextUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'
import { buildCarouselDecompositionPrompt, buildCarouselImagePrompt } from '@/lib/prompts/carousel'

export interface SlideContent {
    index: number
    title: string
    description: string
    visualPrompt: string
    focus?: string
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
    intelligenceModel?: string
    imageModel?: string
    // Optional per-slide overrides
    slideOverrides?: { index: number; text: string }[]
    slideScript?: SlideContent[]
    // Brand Kit Selections
    selectedLogoUrl?: string
    selectedColors?: string[]
    selectedImageUrls?: string[]
    includeLogoOnSlides?: boolean
}

export interface AnalyzeCarouselInput {
    prompt: string
    slideCount: number
    brandDNA: BrandDNA
    intelligenceModel: string
    selectedColors?: string[]
    includeLogoOnSlides?: boolean
    selectedLogoUrl?: string
}

export interface AnalyzeCarouselResult {
    success: boolean
    slides: SlideContent[]
    error?: string
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

/**
 * Decompose a prompt into N slide concepts using AI
 */
async function decomposeIntoSlides(
    prompt: string,
    slideCount: number,
    brand: BrandDNA,
    model: string,
    selectedColors?: string[],
    includeLogoUrl?: string
): Promise<SlideContent[]> {
    const brandContext = buildBrandContext(brand, selectedColors, includeLogoUrl)
    const decompositionPrompt = buildCarouselDecompositionPrompt({
        brandName: brand.brand_name,
        slideCount,
        brandContext,
        topic: prompt
    })

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
            title: i === 0 ? 'Portada' : i === slideCount - 1 ? 'Conclusion' : `Punto ${i}`,
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
    const fullPrompt = buildCarouselImagePrompt({
        slideIndex: slideContent.index,
        totalSlides,
        brandName: brand.brand_name,
        brandContext,
        title: slideContent.title,
        description: slideContent.description,
        visualPrompt: slideContent.visualPrompt,
        focus: slideContent.focus,
        style,
        aspectRatio,
        includeLogo: Boolean(selectedLogoUrl)
    })

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
        intelligenceModel,
        imageModel,
        slideOverrides = [],
        slideScript,
        selectedLogoUrl,
        selectedColors,
        selectedImageUrls,
        includeLogoOnSlides
    } = input

    try {
        console.log(`Starting carousel for ${brandDNA.brand_name}: ${slideCount} slides`)

        // Step 1: Decompose prompt (or reuse script)
        console.log('Decomposing with brand context...')
        const canUseScript = Array.isArray(slideScript) && slideScript.length === slideCount
        if (!canUseScript && !intelligenceModel) {
            throw new Error('Missing intelligence model configuration')
        }
        if (!imageModel) {
            throw new Error('Missing image model configuration')
        }

        let slideContents = canUseScript
            ? slideScript
            : await decomposeIntoSlides(
                prompt,
                slideCount,
                brandDNA,
                intelligenceModel as string,
                selectedColors,
                includeLogoOnSlides ? selectedLogoUrl : undefined
            )

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
            console.log(`Generating slide ${i + 1}/${slideCount} with brand context...`)
            slides[i].status = 'generating'

            try {
                const imageUrl = await generateSlideImage(
                    slideContents[i],
                    slideCount,
                    style,
                    aspectRatio,
                    brandDNA,
                    imageModel,
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

        console.log('Carousel complete.')
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
 * Analyze prompt and return the slide script (no images)
 */
export async function analyzeCarouselAction(
    input: AnalyzeCarouselInput
): Promise<AnalyzeCarouselResult> {
    const {
        prompt,
        slideCount,
        brandDNA,
        intelligenceModel,
        selectedColors,
        includeLogoOnSlides,
        selectedLogoUrl
    } = input

    try {
        console.log(`[Carousel] Analyzing script for ${brandDNA.brand_name}: ${slideCount} slides`)
        const slides = await decomposeIntoSlides(
            prompt,
            slideCount,
            brandDNA,
            intelligenceModel,
            selectedColors,
            includeLogoOnSlides ? selectedLogoUrl : undefined
        )
        return { success: true, slides }
    } catch (error) {
        console.error('Carousel analysis error:', error)
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
    imageModel: string,
    selectedLogoUrl?: string,
    selectedColors?: string[]
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    try {
        console.log(`Regenerating slide ${slideIndex + 1} for ${brandDNA.brand_name}...`)

        const imageUrl = await generateSlideImage(
            slideContent,
            totalSlides,
            style,
            aspectRatio,
            brandDNA,
            imageModel,
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
