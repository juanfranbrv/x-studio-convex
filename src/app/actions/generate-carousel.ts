'use server'

import { generateContentImageUnified } from '@/lib/gemini'
import { generateTextUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'
import { buildCarouselDecompositionPrompt } from '@/lib/prompts/carousel'
import { buildCarouselBrandContext } from '@/lib/carousel-brand-context'
import { CAROUSEL_STRUCTURES, getNarrativeComposition, getNarrativeStructure } from '@/lib/carousel-structures'
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
    debugPrompt?: string
    debugReferences?: DebugImageReference[]
}

export interface DebugImageReference {
    type: string
    label?: string
    url: string
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
    suggestions?: CarouselSuggestion[]
    error?: string
}

export interface GenerateCarouselResult {
    success: boolean
    slides: CarouselSlide[]
    error?: string
}

export interface CarouselSuggestion {
    title: string
    subtitle: string
    slides: SlideContent[]
    hook?: string
    structure?: { id?: string; name?: string }
    optimalSlideCount?: number
    detectedIntent?: string
    caption?: string
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
    suggestions?: CarouselSuggestion[]
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

    const normalizeStructureKey = (value: string) =>
        value
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

    const STRUCTURE_ALIASES: Record<string, string> = {
        'framework-aida': 'framework-pas',
        'caso-estudio': 'estudio-caso',
        'case-study': 'estudio-caso',
        'comparativa-dual': 'comparativa-productos',
        'checklist': 'checklist-diagnostico',
        'faq': 'preguntas-respuestas',
        'storytelling-3-actos': 'cronologia-historia',
        'datos-estadisticas': 'cifras-dato',
        'oferta-cta': 'promocion-oferta',
        'q-and-a': 'preguntas-respuestas',
        'q-a': 'preguntas-respuestas',
        'comunicado': 'comunicado-operativo',
        'operational-notice': 'comunicado-operativo'
    }

    const STRUCTURE_NAME_ALIASES: Record<string, string> = {
        'data-stats': 'cifras-dato',
        'data-stats-': 'cifras-dato',
        'case-study': 'estudio-caso',
        'problem-solution': 'problema-solucion',
        'before-after': 'antes-despues',
        'step-by-step': 'paso-a-paso',
        'tips-list': 'lista-tips',
        'top-ranking': 'top-ranking',
        'myths-vs-reality': 'mitos-vs-realidad',
        'common-mistakes': 'errores-comunes',
        'pas-framework': 'framework-pas',
        'promotion-offer': 'promocion-oferta',
        'timeline-history': 'cronologia-historia',
        'tutorial-how-to': 'tutorial-how-to',
        'quote': 'frase-celebre',
        'meme-humor': 'meme-humor',
        'questions-answers': 'preguntas-respuestas',
        'q-and-a': 'preguntas-respuestas',
        'diagnostic-checklist': 'checklist-diagnostico',
        'operational-notice': 'comunicado-operativo'
    }

    const intentStructureMap: Record<string, string> = {
        oferta: 'promocion-oferta',
        escaparate: 'paso-a-paso',
        catalogo: 'comparativa-productos',
        lanzamiento: 'framework-pas',
        servicio: 'preguntas-respuestas',
        comunicado: 'comunicado-operativo',
        lista: 'lista-tips',
        comparativa: 'comparativa-productos',
        evento: 'cronologia-historia',
        efemeride: 'cronologia-historia',
        equipo: 'top-ranking',
        logro: 'antes-despues',
        cita: 'frase-celebre',
        talento: 'lista-tips',
        bts: 'paso-a-paso',
        dato: 'cifras-dato',
        pasos: 'tutorial-how-to',
        definicion: 'cifras-dato',
        pregunta: 'preguntas-respuestas',
        reto: 'paso-a-paso'
    }

    const hasQuoteLikeSignal = (text: string) => {
        const hasQuotePunctuation = /["\u201C\u201D\u00AB\u00BB]/.test(text)
        const hasAttributionLine = /(?:^|\n)\s*(?:\u2014|-)\s*[\p{L}][\p{L} .,'\u2019-]{1,}$/u.test(text)
        return hasQuotePunctuation || hasAttributionLine
    }

    const inferStructureFromPrompt = (text: string, detectedIntent?: string) => {
        const mappedIntent = detectedIntent ? intentStructureMap[detectedIntent] : undefined
        if (mappedIntent && !(mappedIntent === 'frase-celebre' && !hasQuoteLikeSignal(text))) {
            const mapped = getNarrativeStructure(mappedIntent)
            if (mapped) return mapped
        }

        if (hasQuoteLikeSignal(text)) {
            return getNarrativeStructure('frase-celebre')
        }

        return CAROUSEL_STRUCTURES[0]
    }

    const resolveStructureFromParsed = (parsedStructure: any, detectedIntent?: string) => {
        const rawId = typeof parsedStructure?.id === 'string' ? parsedStructure.id : ''
        const rawName = typeof parsedStructure?.name === 'string' ? parsedStructure.name : ''
        const normalizedId = rawId ? normalizeStructureKey(rawId) : ''
        const normalizedName = rawName ? normalizeStructureKey(rawName) : ''
        const mappedIntent = detectedIntent ? intentStructureMap[detectedIntent] : undefined
        const hasQuoteSignal = hasQuoteLikeSignal(prompt)
        const mappedFromIntent =
            mappedIntent && !(mappedIntent === 'frase-celebre' && !hasQuoteSignal)
                ? getNarrativeStructure(mappedIntent)
                : undefined

        if (normalizedId) {
            const direct = getNarrativeStructure(normalizedId)
            if (direct) {
                if (direct.id === 'frase-celebre' && !hasQuoteSignal) {
                    return mappedFromIntent ?? inferStructureFromPrompt(prompt, detectedIntent)
                }
                return direct
            }
            const alias = STRUCTURE_ALIASES[normalizedId]
            if (alias) {
                const mapped = getNarrativeStructure(alias)
                if (mapped) {
                    if (mapped.id === 'frase-celebre' && !hasQuoteSignal) {
                        return mappedFromIntent ?? inferStructureFromPrompt(prompt, detectedIntent)
                    }
                    return mapped
                }
            }
        }

        if (normalizedName) {
            const nameAlias = STRUCTURE_NAME_ALIASES[normalizedName]
            if (nameAlias) {
                const mapped = getNarrativeStructure(nameAlias)
                if (mapped) {
                    if (mapped.id === 'frase-celebre' && !hasQuoteSignal) {
                        return mappedFromIntent ?? inferStructureFromPrompt(prompt, detectedIntent)
                    }
                    return mapped
                }
            }
        }

        if (mappedFromIntent) return mappedFromIntent
        if (hasQuoteSignal) return getNarrativeStructure('frase-celebre')
        return CAROUSEL_STRUCTURES[0]
    }

    const hookForbiddenRegex = /(\\b(truco|tip|atajo|paso|punto)\\b\\s*#?\\s*\\d+)|(#\\s*\\d+)/i
    const ctaRequiredRegex =
        /(cta|llamada a la accion|call to action|inscrib|matricul|apunt|visita|visit|mas info|escriben|contact|registr|sigu|comparte|compra|reserva|solicita|pide|descarga|entra|unete|mandan|envian|aplica|agenda|agend|descubre|prueba|pruebalo|explora|cotiza|demo|demos|llama|llamanos|haz clic|haz click|clic|click|swipe|desliza|link en bio|comprar|shop|get started|learn more|join|suscrib)/i
    const contactRegex = /(wa\.me|whatsapp|dm|mensaje|correo|email|@|tel\.?|llama)/i
    const urlRegex = /(https?:\/\/|www\.)/i

    /**
 * Removes Markdown links from a text, keeping only the URL part.
 * E.g. "Visit [Bauset](https://bauset.es) now" -> "Visit https://bauset.es now"
 */
    function sanitizeTextFromMarkdownLinks(text?: string): string {
        if (!text) return ''
        return text.replace(/\[.*?\]\((https?:\/\/.*?)\)/g, '$1')
    }

    function replaceUrlsWithBrand(text: string, brandUrl?: string): string {
        if (!brandUrl) return text
        const trimmed = brandUrl.trim()
        if (!trimmed) return text
        return text.replace(/https?:\/\/[^\s)]+|www\.[^\s)]+/gi, trimmed)
    }

    function normalizeSmartQuotes(raw: string): string {
        return raw
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/\u00A0/g, ' ')
    }

    function stripTrailingCommas(raw: string): string {
        return raw.replace(/,\s*([}\]])/g, '$1')
    }

    function normalizeSingleQuotedStrings(raw: string): string {
        let result = ''
        let inDouble = false
        let inSingle = false
        let escape = false

        for (let i = 0; i < raw.length; i++) {
            const ch = raw[i]

            if (inSingle) {
                if (escape) {
                    escape = false
                    result += ch
                    continue
                }
                if (ch === '\\') {
                    escape = true
                    result += ch
                    continue
                }
                if (ch === "'") {
                    inSingle = false
                    result += '"'
                    continue
                }
                result += ch
                continue
            }

            if (inDouble) {
                result += ch
                if (escape) {
                    escape = false
                } else if (ch === '\\') {
                    escape = true
                } else if (ch === '"') {
                    inDouble = false
                }
                continue
            }

            if (ch === "'") {
                inSingle = true
                result += '"'
                continue
            }

            if (ch === '"') {
                inDouble = true
                result += ch
                continue
            }

            result += ch
        }

        return result
    }

    function escapeNewlinesInStrings(raw: string): string {
        let result = ''
        let inString = false
        let escape = false

        for (let i = 0; i < raw.length; i++) {
            const ch = raw[i]

            if (inString) {
                if (ch === '\n') {
                    result += '\\n'
                    continue
                }
                if (ch === '\r') {
                    continue
                }
                result += ch
                if (escape) {
                    escape = false
                } else if (ch === '\\') {
                    escape = true
                } else if (ch === '"') {
                    inString = false
                }
                continue
            }

            if (ch === '"') {
                inString = true
                result += ch
                continue
            }

            result += ch
        }

        return result
    }

    /**
     * Best-effort JSON repair for common LLM formatting failures.
     * Only quotes plain unquoted values after ":" while preserving valid JSON tokens.
     */
    function repairJsonString(raw: string): string {
        let normalized = normalizeSmartQuotes(raw)
        normalized = normalizeSingleQuotedStrings(normalized)
        normalized = escapeNewlinesInStrings(normalized)
        normalized = stripTrailingCommas(normalized)

        let result = ''
        let inString = false
        let escape = false
        let expectingValue = false

        for (let i = 0; i < normalized.length; i++) {
            const ch = normalized[i]

            if (inString) {
                result += ch
                if (escape) {
                    escape = false
                } else if (ch === '\\') {
                    escape = true
                } else if (ch === '"') {
                    inString = false
                }
                continue
            }

            if (ch === '"') {
                inString = true
                result += ch
                continue
            }

            if (expectingValue) {
                if (/\s/.test(ch)) {
                    result += ch
                    continue
                }

                if (ch === '{' || ch === '[' || ch === '-' || /[0-9]/.test(ch)) {
                    expectingValue = false
                    result += ch
                    continue
                }

                if (ch === 't' || ch === 'f' || ch === 'n') {
                    expectingValue = false
                    result += ch
                    continue
                }

                const start = i
                let end = i
                for (; end < normalized.length; end++) {
                    const current = normalized[end]
                    if (current === ',' || current === '}' || current === ']') {
                        break
                    }
                }

                const rawValue = normalized.slice(start, end).trim()
                const escaped = rawValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
                result += `"${escaped}"`
                expectingValue = false
                i = end - 1
                continue
            }

            if (ch === ':') {
                expectingValue = true
                result += ch
                continue
            }

            result += ch
        }

        return result
    }

    function extractBalancedBlock(input: string, startIdx: number, openChar: '{' | '[', closeChar: '}' | ']'): string | null {
        if (startIdx < 0 || startIdx >= input.length || input[startIdx] !== openChar) return null
        let depth = 0
        let inStr = false
        let esc = false
        for (let i = startIdx; i < input.length; i++) {
            const ch = input[i]
            if (inStr) {
                if (esc) {
                    esc = false
                } else if (ch === '\\') {
                    esc = true
                } else if (ch === '"') {
                    inStr = false
                }
                continue
            }
            if (ch === '"') {
                inStr = true
                continue
            }
            if (ch === openChar) depth++
            if (ch === closeChar) depth--
            if (depth === 0) {
                return input.slice(startIdx, i + 1)
            }
        }
        return null
    }

    function normalizeJsonLikeText(raw: string): string {
        return raw
            .replace(/^\uFEFF/, '')
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/,\s*([}\]])/g, '$1')
            .trim()
    }

    /**
     * Extracts JSON content from a response string (handles code fences and loose outputs).
     */
    function extractJsonFromResponse(text: string): string | null {
        if (!text || !text.trim()) return null
        const normalized = normalizeJsonLikeText(text)

        const fenced = normalized.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
        if (fenced?.[1]) {
            return normalizeJsonLikeText(fenced[1])
        }

        const openFence = normalized.match(/```(?:json)?\s*([\s\S]*)$/i)
        if (openFence?.[1]) {
            const fencedTail = normalizeJsonLikeText(openFence[1])
            if (fencedTail.startsWith('{') || fencedTail.startsWith('[')) {
                return fencedTail
            }
        }

        const firstObjectIdx = normalized.indexOf('{')
        if (firstObjectIdx !== -1) {
            const objectBlock = extractBalancedBlock(normalized, firstObjectIdx, '{', '}')
            if (objectBlock) {
                return normalizeJsonLikeText(objectBlock)
            }
        }

        const slidesKeyMatch = normalized.match(/"?slides"?\s*:\s*\[/i)
        if (slidesKeyMatch?.index !== undefined) {
            const arrayStart = normalized.indexOf('[', slidesKeyMatch.index)
            if (arrayStart !== -1) {
                const slidesArray = extractBalancedBlock(normalized, arrayStart, '[', ']')
                if (slidesArray) {
                    return normalizeJsonLikeText(`{"slides": ${slidesArray}}`)
                }
            }
        }

        const firstArrayIdx = normalized.indexOf('[')
        if (firstArrayIdx !== -1) {
            const arrayBlock = extractBalancedBlock(normalized, firstArrayIdx, '[', ']')
            if (arrayBlock) {
                const candidate = normalizeJsonLikeText(arrayBlock)
                if (/\{[\s\S]*\}/.test(candidate)) {
                    return `{"slides": ${candidate}}`
                }
            }
        }

        if (normalized.startsWith('{') || normalized.startsWith('[')) {
            return normalized
        }

        return null
    }

    /**
     * Extracts a clean URL from potential Markdown or dirty strings.
     */
    function sanitizeUrl(url?: string): string {
        if (!url) return ''
        let cleaned = url.trim().replace(/^["']|["']$/g, '')

        // Pattern 1: Direct Markdown match [text](url)
        const markdownMatch = cleaned.match(/\[.*?\]\((https?:\/\/.*?)\)/)
        if (markdownMatch) {
            cleaned = markdownMatch[1].trim()
        }

        // Pattern 2: Extract any valid URL starting with http
        const rawUrlMatch = cleaned.match(/(https?:\/\/[^\s\]\)]+)/)
        if (rawUrlMatch) {
            return rawUrlMatch[1].trim()
        }

        return cleaned
    }


    const normalizeParsed = (parsed: any) => {
        let caption = typeof parsed.caption === 'string' ? parsed.caption.trim() : ''
        if (!caption) {
            throw new Error('Missing caption')
        }
        const resolvedStructure = resolveStructureFromParsed(parsed.structure, parsed.detectedIntent)
        caption = replaceUrlsWithBrand(sanitizeTextFromMarkdownLinks(caption), brand.url)

        if (options?.captionOnly) {
            return {
                slides: [],
                hook: typeof parsed.hook === 'string' ? parsed.hook : undefined,
                structure: resolvedStructure ? { id: resolvedStructure.id, name: resolvedStructure.name } : undefined,
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
            title: sanitizeTextFromMarkdownLinks(typeof raw?.title === 'string' ? raw.title.trim() : ''),
            description: sanitizeTextFromMarkdownLinks(typeof raw?.description === 'string' ? raw.description.trim() : ''),
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
            structure: resolvedStructure ? { id: resolvedStructure.id, name: resolvedStructure.name } : undefined,
            optimalSlideCount: requested,
            detectedIntent: typeof parsed.detectedIntent === 'string' ? parsed.detectedIntent : undefined,
            caption
        }
    }

    const normalizeSuggestion = (raw: any): CarouselSuggestion | null => {
        if (!raw || typeof raw !== 'object') return null
        const title = typeof raw.title === 'string' ? raw.title.trim() : ''
        const subtitle = typeof raw.subtitle === 'string' ? raw.subtitle.trim() : ''
        if (!title || !subtitle) return null
        const normalized = normalizeParsed(raw)
        return {
            title,
            subtitle,
            slides: normalized.slides,
            hook: normalized.hook,
            structure: normalized.structure,
            optimalSlideCount: normalized.optimalSlideCount,
            detectedIntent: normalized.detectedIntent,
            caption: normalized.caption
        }
    }

    try {
        for (let attempt = 0; attempt < 3; attempt++) {
            const promptToUse = attempt === 0
                ? decompositionPrompt
                : attempt === 1
                    ? `${decompositionPrompt}\n\nREINTENTO: Devuelve EXACTAMENTE ${requested} slides validos. La slide final debe contener un CTA con verbo de accion claro (ej: inscribete, visita, escribenos) y URL si existe. Si fallas, responde con ERROR.`
                    : `${decompositionPrompt}\n\nULTIMO REINTENTO CRITICO: Responde SOLO JSON VALIDO. Sin markdown, sin texto extra, sin explicaciones. Debe empezar por '{' y terminar por '}'. Incluye SIEMPRE { "slides": [...], "caption": "...", "structure": {...}, "detectedIntent": "..." }. Si no puedes, responde exactamente: ERROR`

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
            const jsonString = extractJsonFromResponse(response)
            if (!jsonString) {
                const preview = response.slice(0, 220).replace(/\s+/g, ' ')
                console.error(`[Carousel JSON] attempt=${attempt + 1} no valid JSON extracted. preview="${preview}"`)
                if (attempt === 2) throw new Error('No valid JSON found in response')
                continue
            }
            let parsed: any

            try {
                // First try: direct parse
                parsed = JSON.parse(jsonString)
            } catch (firstError) {
                // Attempt repair for common AI mistakes (unquoted strings)
                try {
                    parsed = JSON.parse(repairJsonString(jsonString))
                } catch (repairError) {
                    console.error('JSON parse failed. Raw response snippet:', jsonString.substring(0, 200))
                    if (attempt === 2) throw new Error(`Invalid JSON from AI: ${(firstError as Error).message}`)
                    continue
                }
            }
            try {
                const normalized = normalizeParsed(parsed)
                const suggestions = Array.isArray(parsed?.suggestions)
                    ? parsed.suggestions.map(normalizeSuggestion).filter(Boolean) as CarouselSuggestion[]
                    : []
                return {
                    ...normalized,
                    suggestions
                }
            } catch (err) {
                if (attempt === 2) throw err
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
): Promise<{ imageUrl: string; prompt: string; references: DebugImageReference[] }> {
    const specificCompId = compositionId || slideContent.composition
    const composition = (structureId && specificCompId)
        ? getNarrativeComposition(structureId, specificCompId)
        : {
            layoutPrompt: "Standard clean social media composition with clear text area.",
            name: "Free Layout"
        }

    const findColorByRole = (role: string, fallback: string) => {
        if (!selectedColors || selectedColors.length === 0) return fallback
        const palette = selectedColors as { color?: string; role?: string }[]
        const match = palette.find(c => c?.role === role)
        return (match?.color || fallback)
    }

    const brandColors = {
        background: findColorByRole('Fondo', '#141210'),
        accent: findColorByRole('Acento', '#F0E500'),
        text: findColorByRole('Texto', '#FFFFFF')
    }

    const isLastSlide = slideContent.index === totalSlides - 1
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|es|org|net|io|co)[^\s]*)/i
    const extractedUrl = slideContent.description?.match(urlPattern)?.[0]
    const brandUrl = brand.url?.trim()
    const finalUrl = brandUrl || extractedUrl

    const moodCurve = 'problem-solution'
    const currentMood = getMoodForSlide(slideContent.index, totalSlides, slideContent.role, moodCurve)

    const fullPrompt = buildFinalPrompt({
        composition: composition as any,
        brandColors,
        slideData: slideContent,
        currentMood,
        currentSlide: slideContent.index + 1,
        totalSlides,
        logoPosition: extractLogoPosition(composition?.layoutPrompt || ''),
        includeLogo: Boolean(selectedLogoUrl),
        isSequentialSlide: slideContent.index > 0,
        ctaText: isLastSlide ? (slideContent.title || 'Mas info') : undefined,
        ctaUrl: isLastSlide ? finalUrl : undefined,
        visualAnalysis: aiImageDescription,
        language: brand.preferred_language || detectLanguage(slideContent.title || slideContent.description || '') || 'es',
        fonts: brand.fonts
    })

    const brandWrapper = { name: brand.brand_name, brand_dna: brand }

    // Build context array for reference images
    // NOTE: We intentionally avoid passing reference images to prevent literal copying.
    const context: Array<{ type: string; value: string; label?: string; weight?: number }> = []

    const hasConsistencyRef = Boolean(consistencyRefUrls?.length)
    if (selectedImageUrls && selectedImageUrls.length > 0) {
        selectedImageUrls.forEach((url, idx) => {
            context.push({
                type: 'image',
                value: url,
                label: `Reference Image ${idx + 1}${hasConsistencyRef ? ' (style support only)' : ''}`,
                weight: hasConsistencyRef ? 0.2 : 0.8
            })
        })
    }
    if (consistencyRefUrls && consistencyRefUrls.length > 0) {
        consistencyRefUrls.forEach((url, idx) => {
            context.push({
                type: 'image',
                value: url,
                label: idx === 0 ? 'Master Layout (Slide 1)' : `Continuity (Previous Slide ${idx})`,
                weight: idx === 0 ? 1.0 : 0.55
            })
        })
    }
    if (selectedLogoUrl) {
        context.push({ type: 'logo', value: selectedLogoUrl, label: 'Logo', weight: 1.0 })
    }

    const imageUrl = await generateContentImageUnified(brandWrapper, fullPrompt, {
        aspectRatio,
        model,
        context
    })

    const references: DebugImageReference[] = context.map(ref => ({
        type: ref.type,
        label: ref.label,
        url: ref.value
    }))

    return { imageUrl, prompt: fullPrompt, references }
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
                const brandUrl = brandDNA.url?.trim()
                const finalUrl = brandUrl || extractedUrl

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
                    ctaText: isLastSlide ? (slideContent.title || 'Más info') : undefined,
                    ctaUrl: isLastSlide ? finalUrl : undefined,
                    visualAnalysis: aiImageDescription,
                    language: input.language || detectLanguage(prompt) || 'es',
                    fonts: brandDNA.fonts
                })

                // Rule 4: Reference Chain Logic
                const contextReferences: Array<{ type: string; value: string; label?: string; weight?: number }> = []

                // A. Reference images (style/layout guidance)
                const hasMasterLayoutRef = generatedImageUrls.length > 0 && Boolean(generatedImageUrls[0])

                if (selectedImageUrls && selectedImageUrls.length > 0) {
                    selectedImageUrls.forEach((url, idx) => {
                        contextReferences.push({
                            type: 'image',
                            value: url,
                            label: `Reference Image ${idx + 1}${hasMasterLayoutRef ? ' (style support only)' : ''}`,
                            weight: hasMasterLayoutRef ? 0.2 : 0.85
                        })
                    })
                }

                // B. Consistency reference (generated slide 1)
                const consistencyRefUrls: string[] = []
                if (generatedImageUrls.length > 0 && generatedImageUrls[0]) {
                    consistencyRefUrls.push(generatedImageUrls[0])
                }
                const previousSlideUrl = i > 0 ? generatedImageUrls[i - 1] : undefined
                if (previousSlideUrl) {
                    consistencyRefUrls.push(previousSlideUrl)
                }
                if (consistencyRefUrls && consistencyRefUrls.length > 0) {
                    consistencyRefUrls.forEach((url, idx) => {
                        if (!url) return
                        contextReferences.push({
                            type: 'image',
                            value: url,
                            label: idx === 0 ? 'Master Layout (Slide 1)' : `Continuity (Previous Slide ${idx})`,
                            weight: idx === 0 ? 1.0 : 0.55
                        })
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
            caption: decomposition.caption,
            suggestions: decomposition.suggestions || []
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
    structureId?: string,
    aiImageDescription?: string,
    selectedImageUrls?: string[],
    consistencyRefUrls?: string[]
): Promise<{ success: boolean; imageUrl?: string; error?: string; debugPrompt?: string; debugReferences?: DebugImageReference[] }> {
    try {
        console.log(`Regenerating slide ${slideIndex + 1} for ${brandDNA.brand_name}...`)

        const { imageUrl, prompt, references } = await generateSlideImage(
            slideContent,
            totalSlides,
            aspectRatio,
            brandDNA,
            imageModel,
            selectedColors,
            selectedLogoUrl,
            selectedImageUrls,
            aiImageDescription,
            compositionId,
            structureId,
            consistencyRefUrls
        )

        return { success: true, imageUrl, debugPrompt: prompt, debugReferences: references }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}

