'use server'

import { generateContentImageUnified } from '@/lib/gemini'
import { generateTextUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'
import { buildCarouselDecompositionPrompt, buildCarouselImagePrompt } from '@/lib/prompts/carousel'
import { buildCarouselBrandContext } from '@/lib/carousel-brand-context'
import { getNarrativeComposition, getNarrativeStructure } from '@/lib/carousel-structures'
import { buildCarouselPrompt } from '@/lib/prompts/carousel/builder'
import { getMoodForSlide } from '@/lib/prompts/carousel/mood'
import { buildFinalPrompt, generateCarouselSeed, extractLogoPosition } from '@/lib/prompts/carousel/builder/final-prompt'
import { detectLanguage } from '@/lib/language-detection'

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
    structureId?: string
    brandDNA: BrandDNA
    intelligenceModel?: string
    imageModel?: string
    aiImageDescription?: string
    language?: string
    // Optional per-slide overrides
    slideOverrides?: { index: number; text: string }[]
    slideScript?: SlideContent[]
    // Brand Kit Selections
    selectedLogoUrl?: string
    selectedColors?: { color: string; role: string }[]
    selectedImageUrls?: string[]
    includeLogoOnSlides?: boolean
}

export interface AnalyzeCarouselInput {
    prompt: string
    slideCount: number
    brandDNA: BrandDNA
    intelligenceModel: string
    structureId?: string
    selectedColors?: { color: string; role: string }[]
    includeLogoOnSlides?: boolean
    selectedLogoUrl?: string
    aiImageDescription?: string
    language?: string
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
    selectedColors?: { color: string; role: string }[],
    includeLogoUrl?: string,
    options?: {
        captionOnly?: boolean
        structureId?: string
        compositionId?: string
        visualDescription?: string
        language?: string
    }
): Promise<{
    slides: SlideContent[]
    hook?: string
    structure?: { id?: string; name?: string }
    optimalSlideCount?: number
    detectedIntent?: string
    caption?: string
}> {
    // Auto-detect language from user prompt (like image module does)
    const detectedLanguage = detectLanguage(prompt) || 'es'
    console.log(`🌐 Carousel: Detected language from prompt: ${detectedLanguage}`)

    const selectedColorsList = selectedColors?.map(c => c.color) || []
    const brandContext = buildCarouselBrandContext(brand, selectedColorsList, includeLogoUrl)

    // NEW: Use Modular Prompt Builder if structure is defined
    let decompositionPrompt = ''

    if (options?.structureId && options?.compositionId) {
        const structure = getNarrativeStructure(options.structureId)
        const composition = getNarrativeComposition(options.structureId, options.compositionId)

        if (structure && composition) {
            console.log(`Using Modular Prompt for ${structure.id} / ${composition.id}`)
            decompositionPrompt = buildCarouselPrompt(
                {
                    brandName: brand.brand_name,
                    brandTone: brand.tone_of_voice?.join(', ') || 'Professional',
                    targetAudience: brand.target_audience?.join(', ') || 'Professionals',
                    intent: prompt,
                    slidesCount: slideCount,
                    visualAnalysis: options.visualDescription,
                    includeLogo: !!includeLogoUrl,
                    language: detectedLanguage, // Use auto-detected language
                    brandColors: selectedColorsList
                },
                structure,
                composition
            )
        }
    }

    if (!decompositionPrompt) {
        const selectedColorsList = selectedColors?.map(c => c.color) || []
        decompositionPrompt = buildCarouselDecompositionPrompt({
            brandContext: buildCarouselBrandContext(brand, selectedColorsList, includeLogoUrl),
            topic: prompt,
            brandWebsite: brand.url,
            requestedSlideCount: slideCount,
            visualAnalysis: options?.visualDescription,
            language: detectedLanguage // Use auto-detected language
        })
    }

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

    const normalizeTextForMatching = (text: string) =>
        text
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim()

    const hookForbiddenRegex = /(\\b(truco|tip|atajo|paso|punto)\\b\\s*#?\\s*\\d+)|(#\\s*\\d+)/i
    const ctaRequiredRegex =
        /(cta|llamada a la accion|call to action|inscrib|matricul|apunt|visita|visit|mas info|escriben|contact|registr|sigu|comparte|compra|reserva|solicita|pide|descarga|entra|unete|mandan|envian|aplica|agenda|agend|descubre|prueba|pruebalo|explora|cotiza|demo|demos|llama|llamanos|haz clic|haz click|clic|click|swipe|desliza|link en bio|comprar|shop|get started|learn more|join|suscrib)/i
    const contactRegex = /(wa\.me|whatsapp|dm|mensaje|correo|email|@|tel\.?|llama)/i
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

        // For single slide, any role is acceptable
        if (requested === 1) {
            // Single slide - no hook/cta enforcement
        } else {
            // Multi-slide: first must be hook, last must be cta
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
        }

        // Hook and CTA validations only for multi-slide carousels
        if (requested > 1) {
            const hookText = `${slides[0].title} ${slides[0].description}`
            if (hookForbiddenRegex.test(hookText)) {
                throw new Error('Hook slide contains content numbering; it must be a pure hook')
            }
            const ctaText = `${slides[lastIndex].title} ${slides[lastIndex].description}`
            const ctaTextNormalized = normalizeTextForMatching(ctaText)
            const hasCTAKeyword = ctaRequiredRegex.test(ctaTextNormalized)
            const hasUrl = urlRegex.test(ctaText)
            const hasContactHint = contactRegex.test(ctaTextNormalized)

            if (!hasCTAKeyword && !hasUrl && !hasContactHint) {
                const fallbackUrl = brand.url?.trim()
                const fallbackCTA = fallbackUrl
                    ? `Visita ${fallbackUrl} y empieza hoy.`
                    : 'Escríbenos y empecemos hoy mismo.'

                slides[lastIndex] = {
                    ...slides[lastIndex],
                    description: `${slides[lastIndex].description} ${fallbackCTA}`.trim()
                }
                console.warn('CTA slide missing explicit call-to-action; fallback CTA appended.')
            }
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

            // Extract JSON with robust parsing
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                if (attempt === 1) throw new Error('No valid JSON found in response')
                continue
            }

            let jsonString = jsonMatch[0]
            let parsed: any

            try {
                // First try: direct parse
                parsed = JSON.parse(jsonString)
            } catch (firstError) {
                // Fallback: try to find the first complete JSON object
                // This handles cases where AI appends extra text after the JSON
                let braceCount = 0
                let startIdx = jsonString.indexOf('{')
                if (startIdx === -1) {
                    if (attempt === 1) throw new Error('No valid JSON structure found')
                    continue
                }

                let endIdx = startIdx
                for (let i = startIdx; i < jsonString.length; i++) {
                    if (jsonString[i] === '{') braceCount++
                    else if (jsonString[i] === '}') braceCount--

                    if (braceCount === 0) {
                        endIdx = i + 1
                        break
                    }
                }

                const cleanJson = jsonString.substring(startIdx, endIdx)
                try {
                    parsed = JSON.parse(cleanJson)
                } catch (secondError) {
                    console.error('JSON parse failed. Raw response snippet:', jsonString.substring(0, 200))
                    if (attempt === 1) throw new Error(`Invalid JSON from AI: ${(secondError as Error).message}`)
                    continue
                }
            }
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
    selectedColors?: string[] | { color: string; role: string }[],
    selectedLogoUrl?: string,
    selectedImageUrls?: string[],
    aiImageDescription?: string,
    compositionId?: string,
    structureId?: string,
    consistencyRefUrls?: string[]
): Promise<string> {
    const brandContext = buildCarouselBrandContext(brand, selectedColors, selectedLogoUrl)
    const compositionPreset = (structureId && compositionId)
        ? getNarrativeComposition(structureId, compositionId)
        : undefined
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
    if (consistencyRefUrls && consistencyRefUrls.length > 0) {
        consistencyRefUrls.forEach((url, idx) => {
            context.push({ type: 'image', value: url, label: `Continuidad Visual ${idx + 1}` })
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
        structureId,
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
                includeLogoOnSlides ? selectedLogoUrl : undefined,
                {
                    structureId,
                    compositionId,
                    visualDescription: aiImageDescription,
                    language: input.language
                }
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

        // CHAIN OF THOUGHT & IMAGE GENERATION LOOP (5-RULE SYSTEM)
        const generatedImageUrls: string[] = []

        // Rule 4: Generate a consistent seed for this carousel
        const carouselSeed = generateCarouselSeed()
        console.log(`Carousel Seed: ${carouselSeed}`)

        for (let i = 0; i < slides.length; i++) {
            const currentSlide = slides[i]
            console.log(`Generating slide ${i + 1}/${effectiveSlideCount} [Sequential Flow - Seed: ${carouselSeed}]`)
            currentSlide.status = 'generating'

            try {
                // Rule 2: Determine Dynamic Mood from MOOD_MAP
                const moodCurve = 'problem-solution' // Could be mapped from structureId in future
                const currentMood = getMoodForSlide(i, effectiveSlideCount, slideContents[i].role, moodCurve)

                // Resolve Composition (Specific or Default/Free)
                const specificCompId = compositionId || slideContents[i].composition
                const composition = (input.structureId && specificCompId)
                    ? getNarrativeComposition(input.structureId, specificCompId)
                    : {
                        layoutPrompt: "Standard clean social media composition with clear text area.",
                        name: "Free Layout"
                    }

                // Rule 3: Build Brand Colors object from user selection accurately by Role
                const findColorByRole = (role: string, fallback: string) => {
                    const match = selectedColors?.find(c => (c as any).role === role)
                    return (match as any)?.color || fallback
                }

                const brandColors = {
                    background: findColorByRole('Fondo', '#141210'),
                    accent: findColorByRole('Acento', '#F0E500'),
                    text: findColorByRole('Texto', '#FFFFFF')
                }

                // Rule 1 + 2 + 3: Build Final Prompt (Token Cleanup, Mood, Color Injection)
                // Extract CTA text/URL for final slide
                const isLastSlide = i === effectiveSlideCount - 1
                const slideContent = slideContents[i]

                // Try to extract a URL pattern from the slide description (e.g., "bauset.es" or "https://...")
                const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|es|org|net|io|co)[^\s]*)/i
                const urlMatch = slideContent.description?.match(urlPattern)
                const extractedUrl = urlMatch ? urlMatch[0] : undefined

                const promptToUse = buildFinalPrompt({
                    composition: composition as any,
                    brandColors,
                    slideData: slideContents[i],
                    currentMood,
                    currentSlide: i + 1,
                    totalSlides: effectiveSlideCount,
                    logoPosition: extractLogoPosition(composition?.layoutPrompt || ''),
                    includeLogo: !!(includeLogoOnSlides && selectedLogoUrl),
                    isSequentialSlide: i > 0, // true for slides 2-5
                    // CTA for final slide only
                    ctaText: (isLastSlide && slideContent.role === 'cta') ? slideContent.title : undefined,
                    ctaUrl: isLastSlide ? extractedUrl : undefined,
                    visualAnalysis: aiImageDescription
                })

                // Rule 4: Reference Chain Logic
                const contextReferences: Array<{ type: string; value: string; label?: string; weight?: number }> = []

                // A. Master Template (High weight 0.8 for Structure)
                // If a master layout image exists in brand kit, use it
                if (selectedImageUrls && selectedImageUrls.length > 0) {
                    contextReferences.push({
                        type: 'image',
                        value: selectedImageUrls[0],
                        label: 'Master Layout Structure',
                        weight: 0.8
                    })
                }

                // B. Sequential Continuity (Slide 1 as reference for slides 2-5)
                if (i > 0 && generatedImageUrls[0]) {
                    contextReferences.push({
                        type: 'image',
                        value: generatedImageUrls[0], // Always reference Slide 1 (Hero)
                        label: 'Slide 1 Style Reference',
                        weight: 0.4
                    })
                }

                // C. Logo (MAXIMUM priority - weight 1.0)
                if (includeLogoOnSlides && selectedLogoUrl) {
                    contextReferences.push({ type: 'logo', value: selectedLogoUrl, weight: 1.0 })
                }

                // ═══════════════════════════════════════════════════════════════
                // 🔍 DEBUG: EXACT API CALL FOR SLIDE ${i + 1}
                // ═══════════════════════════════════════════════════════════════
                console.log(`\n${'═'.repeat(70)}`)
                console.log(`🎨 SLIDE ${i + 1}/${effectiveSlideCount} - API CALL DEBUG`)
                console.log(`${'═'.repeat(70)}`)
                console.log(`📐 Composition: ${composition?.name || 'Free Layout'}`)
                console.log(`🎭 Mood: ${currentMood}`)
                console.log(`🎲 Seed: ${carouselSeed}`)
                console.log(`🖼️  Aspect Ratio: ${aspectRatio}`)
                console.log(`🤖 Model: ${imageModel}`)
                console.log(`\n--- 🖼️ IMAGE REFERENCES (${contextReferences.length}) ---`)
                contextReferences.forEach((ref, idx) => {
                    const shortUrl = ref.value.length > 60
                        ? `${ref.value.substring(0, 30)}...${ref.value.substring(ref.value.length - 25)}`
                        : ref.value
                    console.log(`  [${idx + 1}] ${ref.type.toUpperCase()} | Weight: ${ref.weight} | ${ref.label || 'No label'}`)
                    console.log(`      URL: ${shortUrl}`)
                })
                console.log(`\n--- 📝 PROMPT TO SEND ---`)
                console.log(promptToUse)
                console.log(`${'─'.repeat(70)}\n`)

                // 5. Generate with seed
                const imageUrl = await generateContentImageUnified(
                    { name: brandDNA.brand_name, brand_dna: brandDNA },
                    promptToUse,
                    {
                        aspectRatio,
                        model: imageModel,
                        context: contextReferences,
                        seed: carouselSeed, // Same seed for all slides
                        selectedColors
                    }
                )

                currentSlide.imageUrl = imageUrl
                currentSlide.status = 'done'
                generatedImageUrls.push(imageUrl)
                console.log(`✅ Slide ${i + 1} generated successfully: ${imageUrl.substring(0, 50)}...`)

            } catch (error) {
                console.error(`Error slide ${i + 1}:`, error)
                currentSlide.status = 'error'
                currentSlide.error = error instanceof Error ? error.message : 'Error'
                generatedImageUrls.push('') // Push empty to keep index alignment
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
        console.log(`[Carousel] aiImageDescription received:`, input.aiImageDescription ? input.aiImageDescription.substring(0, 100) + '...' : 'EMPTY/UNDEFINED')
        const decomposition = await decomposeIntoSlides(
            prompt,
            slideCount,
            brandDNA,
            intelligenceModel,
            selectedColors,
            includeLogoOnSlides ? selectedLogoUrl : undefined,
            {
                structureId: input.structureId,
                visualDescription: input.aiImageDescription,
                language: input.language
            }
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
            {
                captionOnly: true,
                structureId: input.structureId,
                visualDescription: input.aiImageDescription,
                language: input.language
            }
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
    selectedColors?: { color: string; role: string }[],
    compositionId?: string,
    structureId?: string
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
            compositionId,
            structureId,
            undefined // consistencyRefUrls
        )

        return { success: true, imageUrl }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}
