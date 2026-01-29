'use server'

import { generateContentImageUnified } from '@/lib/gemini'
import { generateTextUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'
import { buildCarouselDecompositionPrompt, buildCarouselImagePrompt } from '@/lib/prompts/carousel'
import { buildCarouselBrandContext } from '@/lib/carousel-brand-context'
import { getCarouselComposition } from '@/lib/carousel-compositions'

export interface SlideContent {
    index: number
    title: string
    description: string
    visualPrompt: string
    composition?: string
    focus?: string
    role?: 'hook' | 'content' | 'cta'
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
    aspectRatio?: '1:1' | '4:5' | '3:4'
    style?: string
    compositionId?: string
    brandDNA: BrandDNA
    intelligenceModel?: string
    imageModel?: string
    aiImageDescription?: string
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
    hook?: string
    structure?: { id?: string; name?: string }
    optimalSlideCount?: number
    detectedIntent?: string
    caption?: string
    error?: string
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
    brand: BrandDNA,
    model: string,
    selectedColors?: string[],
    includeLogoUrl?: string,
    options?: { captionOnly?: boolean }
): Promise<{
    slides: SlideContent[]
    hook?: string
    structure?: { id?: string; name?: string }
    optimalSlideCount?: number
    detectedIntent?: string
    caption?: string
}> {
    const brandContext = buildCarouselBrandContext(brand, selectedColors, includeLogoUrl)
    const decompositionPrompt = buildCarouselDecompositionPrompt({
        brandContext,
        topic: prompt,
        brandWebsite: brand.url,
        requestedSlideCount: slideCount
    })

    const brandWrapper = { name: brand.brand_name, brand_dna: brand }
    const requested = Math.max(1, Math.min(15, slideCount || 5))

    const normalizeRole = (value: any): 'hook' | 'content' | 'cta' | undefined => {
        if (typeof value !== 'string') return undefined
        const normalized = value.toLowerCase().trim()
        if (['hook', 'gancho', 'portada', 'inicio'].includes(normalized)) return 'hook'
        if (['cta', 'cierre', 'accion', 'acción', 'conclusion', 'conclusión'].includes(normalized)) return 'cta'
        if (['content', 'contenido', 'desarrollo', 'medio'].includes(normalized)) return 'content'
        return undefined
    }

    const hookForbiddenRegex = /(\\b(truco|tip|atajo|paso|punto)\\b\\s*#?\\s*\\d+)|(#\\s*\\d+)/i
    const ctaRequiredRegex = /(cta|llamada a la acci[oó]n|call to action|inscr[ií]b|matricul|apúnt|apunt|visita|vis[ií]tanos|descubr|aprende|más info|mas info|escr[ií]benos|cont[aá]ct|reg[íi]strate|sígu|sigu|comparte|compra|reserva|solicita|pide|descarga|entra|únete|mandanos|env[ií]anos|aplica)/i
    const urlRegex = /(https?:\/\/|www\.)/i

    const normalizeParsed = (parsed: any) => {
        const caption = typeof parsed.caption === 'string' ? parsed.caption.trim() : ''
        if (!caption) {
            throw new Error('Missing caption')
        }
        if (options?.captionOnly) {
            return {
                slides: [],
                hook: typeof parsed.hook === 'string' ? parsed.hook : undefined,
                structure: parsed.structure && typeof parsed.structure === 'object'
                    ? { id: parsed.structure.id, name: parsed.structure.name }
                    : undefined,
                optimalSlideCount: requested,
                detectedIntent: typeof parsed.detectedIntent === 'string' ? parsed.detectedIntent : undefined,
                caption
            }
        }

        const rawSlides = Array.isArray(parsed.slides) ? parsed.slides : null
        if (!rawSlides || rawSlides.length !== requested) {
            throw new Error(`Slide count mismatch: expected ${requested}, got ${rawSlides?.length ?? 0}`)
        }

        let slides: SlideContent[] = rawSlides.map((raw: any, i: number) => ({
            index: typeof raw?.index === 'number' ? raw.index : i,
            title: typeof raw?.title === 'string' ? raw.title.trim() : '',
            description: typeof raw?.description === 'string' ? raw.description.trim() : '',
            visualPrompt: typeof raw?.visualPrompt === 'string' ? raw.visualPrompt.trim() : '',
            composition: typeof raw?.composition === 'string' ? raw.composition.trim() : undefined,
            focus: typeof raw?.focus === 'string' ? raw.focus.trim() : undefined,
            role: normalizeRole(raw?.role)
        }))

        // Validate required fields
        const hasMissing = slides.some((s: SlideContent) => !s.title || !s.description || !s.visualPrompt || !s.role)
        if (hasMissing) {
            throw new Error('Missing required fields in one or more slides')
        }

        // Normalize indexes (allow 1-based indices)
        const indexes = slides.map(s => s.index)
        const isOneBased = indexes.every(idx => Number.isFinite(idx) && idx >= 1 && idx <= requested) && !indexes.includes(0)
        if (isOneBased) {
            slides = slides.map(s => ({ ...s, index: s.index - 1 }))
        }

        const indexSet = new Set(slides.map(s => s.index))
        if (indexSet.size !== requested) {
            throw new Error('Duplicate or missing slide indexes')
        }
        const inRange = slides.every(s => s.index >= 0 && s.index < requested)
        if (!inRange) {
            throw new Error('Slide indexes out of range')
        }

        // Sort by index
        slides.sort((a, b) => a.index - b.index)

        const lastIndex = requested - 1
        if (slides[0]?.role !== 'hook') {
            throw new Error('Slide 0 must be role hook')
        }
        if (slides[lastIndex]?.role !== 'cta') {
            throw new Error('Last slide must be role cta')
        }
        const middleRolesOk = slides.slice(1, lastIndex).every(s => s.role === 'content')
        if (!middleRolesOk) {
            throw new Error('Middle slides must be role content')
        }

        const hookText = `${slides[0].title} ${slides[0].description}`
        if (hookForbiddenRegex.test(hookText)) {
            throw new Error('Hook slide contains content numbering; it must be a pure hook')
        }
        const ctaText = `${slides[lastIndex].title} ${slides[lastIndex].description}`
        if (!ctaRequiredRegex.test(ctaText) && !urlRegex.test(ctaText)) {
            throw new Error('CTA slide missing a clear call-to-action')
        }

        return {
            slides,
            hook: typeof parsed.hook === 'string' ? parsed.hook : undefined,
            structure: parsed.structure && typeof parsed.structure === 'object'
                ? { id: parsed.structure.id, name: parsed.structure.name }
                : undefined,
            optimalSlideCount: requested,
            detectedIntent: typeof parsed.detectedIntent === 'string' ? parsed.detectedIntent : undefined,
            caption
        }
    }

    try {
        for (let attempt = 0; attempt < 2; attempt++) {
            const promptToUse = attempt === 0
                ? decompositionPrompt
                : `${decompositionPrompt}\n\nREINTENTO: Devuelve EXACTAMENTE ${requested} slides válidos. La slide final debe contener un CTA con verbo de acción claro (ej: inscríbete, visita, escríbenos) y URL si existe. Si fallas, responde con ERROR.`

            const response = await generateTextUnified(
                brandWrapper,
                promptToUse,
                model,
                undefined,
                ''
            )

            if (/^\s*ERROR\b/i.test(response)) {
                throw new Error(response.trim())
            }

            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                if (attempt === 1) throw new Error('No valid JSON')
                continue
            }

            const parsed = JSON.parse(jsonMatch[0])
            try {
                return normalizeParsed(parsed)
            } catch (err) {
                if (attempt === 1) throw err
                continue
            }
        }

        throw new Error('Failed to generate a valid slide script')

    } catch (error) {
        console.error('Decomposition error:', error)
        throw error
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
    selectedImageUrls?: string[],
    aiImageDescription?: string,
    compositionId?: string
): Promise<string> {
    const brandContext = buildCarouselBrandContext(brand, selectedColors, selectedLogoUrl)
    const compositionPreset = getCarouselComposition(compositionId)
    const fullPrompt = buildCarouselImagePrompt({
        slideIndex: slideContent.index,
        totalSlides,
        brandName: brand.brand_name,
        brandContext,
        title: slideContent.title,
        description: slideContent.description,
        visualPrompt: slideContent.visualPrompt,
        composition: slideContent.composition,
        focus: slideContent.focus,
        role: slideContent.role,
        style,
        aspectRatio,
        includeLogo: Boolean(selectedLogoUrl),
        aiImageDescription,
        compositionPreset: compositionPreset?.layoutPrompt
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
        aspectRatio = '3:4',
        style = 'Moderno y minimalista',
        compositionId,
        brandDNA,
        intelligenceModel,
        imageModel,
        aiImageDescription,
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

        const decomposition = canUseScript
            ? { slides: slideScript }
            : await decomposeIntoSlides(
                prompt,
                slideCount,
                brandDNA,
                intelligenceModel as string,
                selectedColors,
                includeLogoOnSlides ? selectedLogoUrl : undefined
            )
        const slideContents = decomposition.slides
        const effectiveSlideCount = Math.max(1, Math.min(15, slideCount || 5))

        // Apply overrides
        slideOverrides.forEach(override => {
            if (slideContents[override.index]) {
                slideContents[override.index].visualPrompt = override.text
                slideContents[override.index].description = override.text
            }
        })

        // Step 2: Generate images
        const slides: CarouselSlide[] = slideContents.slice(0, effectiveSlideCount).map(sc => ({
            index: sc.index,
            title: sc.title,
            description: sc.description,
            status: 'pending' as const
        }))

        for (let i = 0; i < slides.length; i++) {
            console.log(`Generating slide ${i + 1}/${effectiveSlideCount} with brand context...`)
            slides[i].status = 'generating'

            try {
                const imageUrl = await generateSlideImage(
                    slideContents[i],
                    effectiveSlideCount,
                    style,
                    aspectRatio,
                    brandDNA,
                    imageModel,
                    selectedColors,
                    includeLogoOnSlides ? selectedLogoUrl : undefined,
                    selectedImageUrls,
                    aiImageDescription,
                    compositionId
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
        const decomposition = await decomposeIntoSlides(
            prompt,
            slideCount,
            brandDNA,
            intelligenceModel,
            selectedColors,
            includeLogoOnSlides ? selectedLogoUrl : undefined
        )
        return {
            success: true,
            slides: decomposition.slides,
            hook: decomposition.hook,
            structure: decomposition.structure,
            optimalSlideCount: decomposition.optimalSlideCount,
            detectedIntent: decomposition.detectedIntent,
            caption: decomposition.caption
        }
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
 * Regenerate caption only (uses same lazy prompt but skips slide validation)
 */
export async function regenerateCarouselCaptionAction(
    input: AnalyzeCarouselInput
): Promise<{ success: boolean; caption?: string; error?: string }> {
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
        const decomposition = await decomposeIntoSlides(
            prompt,
            slideCount,
            brandDNA,
            intelligenceModel,
            selectedColors,
            includeLogoOnSlides ? selectedLogoUrl : undefined,
            { captionOnly: true }
        )
        return { success: true, caption: decomposition.caption }
    } catch (error) {
        console.error('Carousel caption error:', error)
        return {
            success: false,
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
    selectedColors?: string[],
    compositionId?: string
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
            selectedLogoUrl,
            undefined,
            undefined,
            compositionId
        )

        return { success: true, imageUrl }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}
