'use server'

import { generateContentImageUnified } from '@/lib/gemini'
import { generateTextUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'
import { buildCarouselDecompositionPrompt } from '@/lib/prompts/carousel'
import { buildCarouselBrandContext } from '@/lib/carousel-brand-context'
import { buildCarouselPrompt } from '@/lib/prompts/carousel/builder'
import { getMoodForSlide } from '@/lib/prompts/carousel/mood'
import { buildFinalPrompt, generateCarouselSeed, extractLogoPosition } from '@/lib/prompts/carousel/builder/final-prompt'
import { detectLanguage } from '@/lib/language-detection'
import type { NarrativeStructure, CarouselComposition as NarrativeComposition } from '@/lib/carousel-structures'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { auth } from '@clerk/nextjs/server'
import { log } from '@/lib/logger'
import { api } from '../../../convex/_generated/api'

type DbStructure = {
    structure_id: string
    name: string
    summary: string
    tension?: string
    flow?: string
    proof?: string
    cta?: string
    order: number
}

type DbComposition = {
    composition_id: string
    structure_id?: string
    scope: string
    mode: string
    name: string
    description: string
    layoutPrompt: string
    icon?: string
    iconPrompt?: string
    order: number
}

type CarouselStructure = {
    id: string
    name: string
    summary: string
    tension?: string
    flow?: string
    proof?: string
    cta?: string
    order: number
}

type CarouselComposition = {
    id: string
    structureId?: string
    scope: 'global' | 'narrative'
    mode: 'basic' | 'advanced'
    name: string
    description: string
    layoutPrompt: string
    icon?: string
    iconPrompt?: string
    order: number
}

type CarouselCatalog = {
    structures: CarouselStructure[]
    compositions: CarouselComposition[]
}

type EconomicAuditContext = {
    flowId: string
    userClerkId?: string
    userEmail?: string
}

function createEconomicFlowId(prefix: string): string {
    return `flow_${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function shortFlowId(flowId?: string): string {
    if (!flowId) return 'sin-flow'
    if (flowId.length <= 28) return flowId
    return `${flowId.slice(0, 22)}...${flowId.slice(-5)}`
}

async function resolveEconomicAuditActor(): Promise<Pick<EconomicAuditContext, 'userClerkId' | 'userEmail'>> {
    try {
        const { userId } = await auth()
        if (!userId) return {}
        const userRow = await fetchQuery(api.users.getUser, { clerk_id: userId }) as { email?: string } | null
        return {
            userClerkId: userId,
            userEmail: userRow?.email,
        }
    } catch {
        return {}
    }
}

async function logEconomicModelCall(params: {
    audit?: EconomicAuditContext
    phase: string
    model: string
    kind: 'intelligence' | 'image'
    metadata?: Record<string, unknown>
}) {
    const { audit, phase, model, kind, metadata } = params
    if (!audit?.flowId) return
    try {
        await fetchMutation(api.economic.logEconomicEvent, {
            flow_id: audit.flowId,
            phase,
            model,
            kind,
            user_clerk_id: audit.userClerkId,
            user_email: audit.userEmail,
            metadata,
        })
    } catch (error) {
        log.warn('ECONOMIC', `Audit event failed | phase=${phase} model=${model}`, error)
    }
}

const normalizeCompositionId = (id?: string) => (id && id !== 'free' ? id : undefined)

async function loadCarouselCatalog(): Promise<CarouselCatalog> {
    const structures = await fetchQuery(api.carousel.listStructures, { includeInactive: false }) as unknown as DbStructure[]
    const compositions = await fetchQuery(api.carousel.listCompositions, { includeInactive: false, includeGlobals: true }) as unknown as DbComposition[]

    const mappedStructures = (structures || []).map((s) => ({
        id: s.structure_id,
        name: s.name,
        summary: s.summary,
        tension: s.tension,
        flow: s.flow,
        proof: s.proof,
        cta: s.cta,
        order: s.order
    })).sort((a, b) => a.order - b.order)

    const mappedCompositions = (compositions || []).map((c) => ({
        id: c.composition_id,
        structureId: c.structure_id,
        scope: (c.scope as 'global' | 'narrative') || 'narrative',
        mode: (c.mode as 'basic' | 'advanced') || 'basic',
        name: c.name,
        description: c.description,
        layoutPrompt: c.layoutPrompt,
        icon: c.icon,
        iconPrompt: c.iconPrompt,
        order: c.order
    })).sort((a, b) => a.order - b.order)

    if (mappedStructures.length === 0) {
        throw new Error('No hay narrativas de carrusel configuradas en Convex.')
    }

    return {
        structures: mappedStructures,
        compositions: mappedCompositions
    }
}

function getStructureById(structures: CarouselStructure[], id?: string): CarouselStructure | undefined {
    if (!id) return undefined
    return structures.find((s) => s.id === id)
}

function getDefaultStructure(structures: CarouselStructure[]): CarouselStructure | undefined {
    return structures[0]
}

function getCompositionsForStructure(
    compositions: CarouselComposition[],
    structureId?: string
): CarouselComposition[] {
    if (!structureId) return compositions.filter((c) => c.scope === 'global')
    return compositions.filter((c) => c.scope === 'global' || c.structureId === structureId)
}

function getCompositionById(
    compositions: CarouselComposition[],
    id?: string
): CarouselComposition | undefined {
    if (!id) return undefined
    return compositions.find((c) => c.id === id)
}

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
    image_storage_id?: string
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
    auditFlowId?: string
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
    auditFlowId?: string
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
    catalog?: CarouselCatalog,
    options?: {
        captionOnly?: boolean
        structureId?: string
        compositionId?: string
        visualDescription?: string
        language?: string
        audit?: EconomicAuditContext
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
    const auditFlowTag = options?.audit?.flowId || 'no-flow'

    // Auto-detect language from user prompt (like image module does)
    const detectedLanguage = detectLanguage(prompt) || 'es'
    log.info('CAROUSEL', 'Iniciando análisis del carrusel', {
        flow: shortFlowId(auditFlowTag),
        slides_solicitadas: slideCount,
        modelo: model,
        idioma: detectedLanguage,
    })

    const selectedColorsList = selectedColors?.map(c => c.color) || []
    const brandContext = buildCarouselBrandContext(brand, selectedColorsList, includeLogoUrl)

    // NEW: Use Modular Prompt Builder if structure is defined
    let decompositionPrompt = ''

    const normalizedCompositionId = normalizeCompositionId(options?.compositionId)
    if (options?.structureId && normalizedCompositionId && catalog) {
        const structure = getStructureById(catalog.structures, options.structureId)
        const available = getCompositionsForStructure(catalog.compositions, options.structureId)
        const composition = getCompositionById(available, normalizedCompositionId)

        if (structure && composition) {
            log.info('CAROUSEL', `Using modular prompt | structure=${structure.id} composition=${composition.id}`)
            const narrative: NarrativeStructure = {
                id: structure.id,
                name: structure.name,
                summary: structure.summary,
                compositions: available.map((item) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    layoutPrompt: item.layoutPrompt,
                    iconPrompt: item.iconPrompt || item.icon || '',
                    mode: item.mode
                })) as NarrativeComposition[]
            }
            const compositionForPrompt: NarrativeComposition = {
                id: composition.id,
                name: composition.name,
                description: composition.description,
                layoutPrompt: composition.layoutPrompt,
                iconPrompt: composition.iconPrompt || composition.icon || '',
                mode: composition.mode
            }
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
                narrative,
                compositionForPrompt
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
        if (['cta', 'cierre', 'accion', 'acciÃ³n', 'conclusion', 'conclusiÃ³n'].includes(normalized)) return 'cta'
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
        const fallback = catalog ? getDefaultStructure(catalog.structures) : undefined
        const mappedIntent = detectedIntent ? intentStructureMap[detectedIntent] : undefined
        if (mappedIntent && !(mappedIntent === 'frase-celebre' && !hasQuoteLikeSignal(text))) {
            const mapped = catalog ? getStructureById(catalog.structures, mappedIntent) : undefined
            if (mapped) return mapped
        }

        if (hasQuoteLikeSignal(text)) {
            return catalog ? getStructureById(catalog.structures, 'frase-celebre') : undefined
        }

        return fallback
    }

    const resolveStructureFromParsed = (parsedStructure: any, detectedIntent?: string) => {
        const fallback = catalog ? getDefaultStructure(catalog.structures) : undefined
        const rawId = typeof parsedStructure?.id === 'string' ? parsedStructure.id : ''
        const rawName = typeof parsedStructure?.name === 'string' ? parsedStructure.name : ''
        const normalizedId = rawId ? normalizeStructureKey(rawId) : ''
        const normalizedName = rawName ? normalizeStructureKey(rawName) : ''
        const mappedIntent = detectedIntent ? intentStructureMap[detectedIntent] : undefined
        const hasQuoteSignal = hasQuoteLikeSignal(prompt)
        const mappedFromIntent =
            mappedIntent && !(mappedIntent === 'frase-celebre' && !hasQuoteSignal)
                ? (catalog ? getStructureById(catalog.structures, mappedIntent) : undefined)
                : undefined

        if (normalizedId) {
            const direct = catalog ? getStructureById(catalog.structures, normalizedId) : undefined
            if (direct) {
                if (direct.id === 'frase-celebre' && !hasQuoteSignal) {
                    return mappedFromIntent ?? inferStructureFromPrompt(prompt, detectedIntent)
                }
                return direct
            }
            const alias = STRUCTURE_ALIASES[normalizedId]
            if (alias) {
                const mapped = catalog ? getStructureById(catalog.structures, alias) : undefined
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
                const mapped = catalog ? getStructureById(catalog.structures, nameAlias) : undefined
                if (mapped) {
                    if (mapped.id === 'frase-celebre' && !hasQuoteSignal) {
                        return mappedFromIntent ?? inferStructureFromPrompt(prompt, detectedIntent)
                    }
                    return mapped
                }
            }
        }

        if (mappedFromIntent) return mappedFromIntent
        if (hasQuoteSignal) return catalog ? getStructureById(catalog.structures, 'frase-celebre') : undefined
        return fallback
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

        const parsedSlides = Array.isArray(parsed.slides) ? parsed.slides : null
        if (!parsedSlides) {
            throw new Error(`Slide count mismatch: expected ${requested}, got 0`)
        }
        const roleByIndex = (idx: number): 'hook' | 'content' | 'cta' => {
            if (requested === 1) return 'hook'
            if (idx === 0) return 'hook'
            if (idx === requested - 1) return 'cta'
            return 'content'
        }

        const coerceSlidesToRequested = (source: unknown[]): unknown[] => {
            if (source.length === requested) return source
            if (source.length > requested) {
                const buildNarrativeSlice = (items: unknown[]) => {
                    if (requested <= 1) return [items[0]]
                    if (requested === 2) return [items[0], items[items.length - 1]]
                    const first = items[0]
                    const last = items[items.length - 1]
                    const middle = items.slice(1, -1)
                    const neededMiddle = requested - 2
                    if (middle.length <= neededMiddle) {
                        return [first, ...middle, last]
                    }
                    const picked: unknown[] = []
                    for (let i = 0; i < neededMiddle; i++) {
                        const pos = Math.floor((i * middle.length) / neededMiddle)
                        picked.push(middle[Math.min(pos, middle.length - 1)])
                    }
                    return [first, ...picked, last]
                }
                log.warn('FLOW', 'El modelo devolvió más slides; se conserva hook+cta y se muestrea el contenido intermedio', {
                    flow: shortFlowId(auditFlowTag),
                    esperadas: requested,
                    recibidas: source.length,
                })
                return buildNarrativeSlice(source)
            }
            const next = [...source]
            log.warn('FLOW', `Carousel parser incompleto: expected=${requested}, got=${source.length}. Rellenando faltantes.`)
            while (next.length < requested) {
                const idx = next.length
                const fallbackRole = roleByIndex(idx)
                next.push({
                    index: idx,
                    role: fallbackRole,
                    title: fallbackRole === 'hook'
                        ? 'Descubre esta idea'
                        : fallbackRole === 'cta'
                            ? 'Da el siguiente paso'
                            : `Punto clave ${idx + 1}`,
                    description: fallbackRole === 'cta'
                        ? (brand.url?.trim()
                            ? `Visita ${brand.url?.trim()} y empieza hoy.`
                            : 'Escríbenos y empecemos hoy mismo.')
                        : 'Contenido principal del carrusel.',
                    visualPrompt: `Representa visualmente esta idea del carrusel: ${prompt}`,
                })
            }
            return next
        }

        const rawSlides =
            requested === 1 && parsedSlides.length > 1
                ? [parsedSlides[0]]
                : coerceSlidesToRequested(parsedSlides)

        let slides: SlideContent[] = rawSlides.map((raw: any, i: number) => {
            const fallbackRole = roleByIndex(i)
            const safeRole = normalizeRole(raw?.role) || fallbackRole
            const safeTitle = sanitizeTextFromMarkdownLinks(typeof raw?.title === 'string' ? raw.title.trim() : '')
            const safeDescription = sanitizeTextFromMarkdownLinks(typeof raw?.description === 'string' ? raw.description.trim() : '')
            const safeVisualPrompt = typeof raw?.visualPrompt === 'string' ? raw.visualPrompt.trim() : ''
            return {
                index: i,
                title: safeTitle || (safeRole === 'hook'
                    ? 'Descubre esta idea'
                    : safeRole === 'cta'
                        ? 'Da el siguiente paso'
                        : `Punto clave ${i + 1}`),
                description: safeDescription || (safeRole === 'cta'
                    ? (brand.url?.trim()
                        ? `Visita ${brand.url?.trim()} y empieza hoy.`
                        : 'Escríbenos y empecemos hoy mismo.')
                    : 'Contenido principal del carrusel.'),
                visualPrompt: safeVisualPrompt || `Representa visualmente esta idea del carrusel: ${prompt}`,
                composition: typeof raw?.composition === 'string' ? raw.composition.trim() : undefined,
                focus: typeof raw?.focus === 'string' ? raw.focus.trim() : undefined,
                role: safeRole
            }
        })

        // Validate required fields
        const hasMissing = slides.some((s: SlideContent) => !s.title || !s.description || !s.visualPrompt || !s.role)
        if (hasMissing) {
            throw new Error('Missing required fields in one or more slides')
        }

        // Reindex and normalize order deterministically to avoid brittle model indexing.
        slides = slides.map((slide, index) => ({ ...slide, index }))

        const lastIndex = requested - 1

        // Force stable role schema instead of failing hard on model inconsistencies.
        if (requested > 1) {
            slides = slides.map((slide, index) => ({
                ...slide,
                role: index === 0 ? 'hook' : index === lastIndex ? 'cta' : 'content',
            }))
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
                    : 'EscrÃ­benos y empecemos hoy mismo.'

                slides[lastIndex] = {
                    ...slides[lastIndex],
                    description: `${slides[lastIndex].description} ${fallbackCTA}`.trim()
                }
                log.warn('CAROUSEL', 'CTA missing explicit action; fallback CTA appended')
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
            const basePhase = options?.captionOnly ? 'carousel_caption_regeneration' : 'carousel_script_decomposition'
            const phase = attempt === 0 ? basePhase : `${basePhase}_retry`
            await logEconomicModelCall({
                audit: options?.audit,
                phase,
                model,
                kind: 'intelligence',
                metadata: {
                    attempt: attempt + 1,
                    requested_slides: requested,
                }
            })
            log.info('CAROUSEL', 'Respuesta del modelo recibida', {
                flow: shortFlowId(auditFlowTag),
                intento: `${attempt + 1}/3`,
            })

            if (/^\s*ERROR\b/i.test(response)) {
                throw new Error(response.trim())
            }

            // Extract JSON with robust parsing
            const jsonString = extractJsonFromResponse(response)
            if (!jsonString) {
                const preview = response.slice(0, 220).replace(/\s+/g, ' ')
                log.warn('CAROUSEL', 'No se pudo extraer JSON válido de la respuesta', {
                    flow: shortFlowId(auditFlowTag),
                    intento: `${attempt + 1}/3`,
                    preview,
                })
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
                    log.warn('CAROUSEL', 'Falló el parseo JSON incluso tras intentar repararlo', {
                        flow: shortFlowId(auditFlowTag),
                        intento: `${attempt + 1}/3`,
                        fragmento: jsonString.substring(0, 200),
                    })
                    if (attempt === 2) throw new Error(`Invalid JSON from AI: ${(firstError as Error).message}`)
                    continue
                }
            }
            try {
                const normalized = normalizeParsed(parsed)
                const suggestions = Array.isArray(parsed?.suggestions)
                    ? parsed.suggestions.map(normalizeSuggestion).filter(Boolean) as CarouselSuggestion[]
                    : []
                log.success('CAROUSEL', 'Análisis del carrusel completado', {
                    flow: shortFlowId(auditFlowTag),
                    intento: `${attempt + 1}/3`,
                    slides: normalized.slides.length,
                    sugerencias: suggestions.length,
                })
                return {
                    ...normalized,
                    suggestions
                }
            } catch (err) {
                log.warn('CAROUSEL', 'La respuesta no cumple el formato esperado del carrusel', {
                    flow: shortFlowId(auditFlowTag),
                    intento: `${attempt + 1}/3`,
                })
                log.debug('CAROUSEL', 'Detalle técnico de normalización', err)
                if (attempt === 2) throw err
                continue
            }
        }

        throw new Error('Failed to generate a valid slide script')

    } catch (error) {
        log.error('CAROUSEL', 'Análisis del carrusel fallido', {
            flow: shortFlowId(auditFlowTag),
            motivo: error instanceof Error ? error.message : String(error),
        })
        throw error
    }
}

/**
 * Generate a single slide image with brand context
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function isTransientImageGenerationError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error || '')
    const normalized = message.toLowerCase()
    return [
        'system busy',
        'try again later',
        'request id',
        'temporarily unavailable',
        'rate limit',
        'too many requests',
        '429'
    ].some(token => normalized.includes(token))
}

async function generateContentImageWithRetry(
    brandWrapper: { name: string; brand_dna: BrandDNA },
    fullPrompt: string,
    options: {
        aspectRatio: string
        model: string
        context: Array<{ type: string; value: string; label?: string; weight?: number }>
        seed?: number
        selectedColors?: { color: string; role: string }[]
    },
    audit?: {
        context?: EconomicAuditContext
        phase?: string
        slideIndex?: number
    }
): Promise<string> {
    const maxAttempts = 3
    let lastError: unknown = null

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const imageUrl = await generateContentImageUnified(brandWrapper, fullPrompt, options)
            const basePhase = audit?.phase || 'carousel_slide_image_generation'
            const phase = attempt === 1 ? basePhase : `${basePhase}_retry`
            await logEconomicModelCall({
                audit: audit?.context,
                phase,
                model: options.model,
                kind: 'image',
                metadata: {
                    slide_index: audit?.slideIndex,
                    attempt,
                    status: 'success',
                }
            })
            return imageUrl
        } catch (error) {
            lastError = error
            const basePhase = audit?.phase || 'carousel_slide_image_generation'
            const phase = attempt === 1 ? basePhase : `${basePhase}_retry`
            await logEconomicModelCall({
                audit: audit?.context,
                phase,
                model: options.model,
                kind: 'image',
                metadata: {
                    slide_index: audit?.slideIndex,
                    attempt,
                    status: 'error',
                    error: error instanceof Error ? error.message : String(error),
                }
            })
            const shouldRetry = isTransientImageGenerationError(error) && attempt < maxAttempts
            if (!shouldRetry) {
                throw error
            }
            const waitMs = Math.min(5000, 900 * Math.pow(2, attempt - 1))
            await sleep(waitMs)
        }
    }

    throw lastError instanceof Error ? lastError : new Error('Image generation failed after retries')
}

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
    consistencyRefUrls?: string[],
    catalog?: CarouselCatalog,
    audit?: {
        context?: EconomicAuditContext
        phase?: string
    }
): Promise<{ imageUrl: string; prompt: string; references: DebugImageReference[] }> {
    const specificCompId = normalizeCompositionId(compositionId) || normalizeCompositionId(slideContent.composition)
    const availableComps = catalog ? getCompositionsForStructure(catalog.compositions, structureId) : []
    const composition = (structureId && specificCompId && catalog)
        ? getCompositionById(availableComps, specificCompId)
        : undefined
    const resolvedComposition = composition || {
        layoutPrompt: "Standard clean social media composition with clear text area.",
        name: "Free Layout"
    }

    const findColorsByRole = (role: string, fallback: string) => {
        if (!selectedColors || selectedColors.length === 0) return [fallback]
        const palette = selectedColors as Array<{ color?: string; role?: string } | string>
        const fromRole = palette
            .filter((entry): entry is { color?: string; role?: string } => typeof entry !== 'string')
            .filter((entry) => entry?.role === role)
            .map((entry) => (entry?.color || '').trim())
            .filter(Boolean)
        if (fromRole.length === 0) return [fallback]
        return Array.from(new Set(fromRole))
    }

    const brandColors = {
        background: findColorsByRole('Fondo', '#141210'),
        accent: findColorsByRole('Acento', '#F0E500'),
        text: findColorsByRole('Texto', '#FFFFFF')
    }

    const isLastSlide = slideContent.index === totalSlides - 1
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|es|org|net|io|co)[^\s]*)/i
    const extractedUrl = slideContent.description?.match(urlPattern)?.[0]
    const brandUrl = brand.url?.trim()
    const finalUrl = brandUrl || extractedUrl

    const moodCurve = 'problem-solution'
    const currentMood = getMoodForSlide(slideContent.index, totalSlides, slideContent.role, moodCurve)

    const fullPrompt = buildFinalPrompt({
        composition: resolvedComposition as any,
        brandColors,
        slideData: slideContent,
        currentMood,
        currentSlide: slideContent.index + 1,
        totalSlides,
        logoPosition: extractLogoPosition(resolvedComposition?.layoutPrompt || ''),
        includeLogo: Boolean(selectedLogoUrl),
        isSequentialSlide: slideContent.index > 0,
        ctaText: isLastSlide ? (slideContent.title || 'Mas info') : undefined,
        ctaUrl: isLastSlide ? finalUrl : undefined,
        visualAnalysis: aiImageDescription,
        language: detectLanguage(`${slideContent.title || ''} ${slideContent.description || ''}`) || brand.preferred_language || 'es',
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

    const imageUrl = await generateContentImageWithRetry(brandWrapper, fullPrompt, {
        aspectRatio,
        model,
        context
    }, {
        context: audit?.context,
        phase: audit?.phase || 'carousel_slide_regeneration',
        slideIndex: slideContent.index,
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
        const catalog = await loadCarouselCatalog()
        const auditActor = await resolveEconomicAuditActor()
        const auditContext: EconomicAuditContext = {
            flowId: input.auditFlowId || createEconomicFlowId('carousel_generate'),
            ...auditActor,
        }
        log.info('CAROUSEL', `Generate start | brand=${brandDNA.brand_name} slides=${slideCount} flow=${auditContext.flowId}`)

        // Step 1: Decompose prompt (or reuse script)
        const canUseScript = Array.isArray(slideScript) && slideScript.length === slideCount
        log.info('CAROUSEL', `Generate script source | mode=${canUseScript ? 'provided_script' : 'ai_decomposition'}`)
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
                catalog,
                {
                    structureId,
                    compositionId,
                    visualDescription: aiImageDescription,
                    language: input.language,
                    audit: auditContext,
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
        log.info('CAROUSEL', `Generate seed | ${carouselSeed}`)

        for (let i = 0; i < slides.length; i++) {
            const currentSlide = slides[i]
            log.info('CAROUSEL', `Generate slide start | flow=${auditContext.flowId} slide=${i + 1}/${effectiveSlideCount}`)
            currentSlide.status = 'generating'

            try {
                // Rule 2: Determine Dynamic Mood from MOOD_MAP
                const moodCurve = 'problem-solution' // Could be mapped from structureId in future
                const currentMood = getMoodForSlide(i, effectiveSlideCount, slideContents[i].role, moodCurve)

                // Resolve Composition (Specific or Default/Free)
                const specificCompId = normalizeCompositionId(compositionId) || normalizeCompositionId(slideContents[i].composition)
                const availableComps = getCompositionsForStructure(catalog.compositions, input.structureId)
                const composition = (input.structureId && specificCompId)
                    ? getCompositionById(availableComps, specificCompId)
                    : undefined
                const resolvedComposition = composition || {
                    layoutPrompt: "Standard clean social media composition with clear text area.",
                    name: "Free Layout"
                }

                // Rule 3: Build Brand Colors object from user selection accurately by Role
                const findColorsByRole = (role: string, fallback: string) => {
                    const palette = (selectedColors || []) as Array<{ color?: string; role?: string }>
                    const fromRole = palette
                        .filter((entry) => entry?.role === role)
                        .map((entry) => (entry?.color || '').trim())
                        .filter(Boolean)
                    if (fromRole.length === 0) return [fallback]
                    return Array.from(new Set(fromRole))
                }

                const brandColors = {
                    background: findColorsByRole('Fondo', '#141210'),
                    accent: findColorsByRole('Acento', '#F0E500'),
                    text: findColorsByRole('Texto', '#FFFFFF')
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
                    composition: resolvedComposition as any,
                    brandColors,
                    slideData: slideContents[i],
                    currentMood,
                    currentSlide: i + 1,
                    totalSlides: effectiveSlideCount,
                    logoPosition: extractLogoPosition(resolvedComposition?.layoutPrompt || ''),
                    includeLogo: !!(includeLogoOnSlides && selectedLogoUrl),
                    isSequentialSlide: i > 0, // true for slides 2-5
                    // CTA for final slide only
                    ctaText: isLastSlide ? (slideContent.title || 'MÃ¡s info') : undefined,
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

                log.debug('CAROUSEL', `Slide payload | flow=${auditContext.flowId} slide=${i + 1}/${effectiveSlideCount} model=${imageModel} refs=${contextReferences.length}`)

                // 5. Generate with seed
                const imageUrl = await generateContentImageWithRetry(
                    { name: brandDNA.brand_name, brand_dna: brandDNA },
                    promptToUse,
                    {
                        aspectRatio,
                        model: imageModel,
                        context: contextReferences,
                        seed: carouselSeed, // Same seed for all slides
                        selectedColors
                    },
                    {
                        context: auditContext,
                        phase: 'carousel_slide_image_generation',
                        slideIndex: i,
                    }
                )

                currentSlide.imageUrl = imageUrl
                currentSlide.status = 'done'
                generatedImageUrls.push(imageUrl)
                log.success('CAROUSEL', `Generate slide done | flow=${auditContext.flowId} slide=${i + 1}/${effectiveSlideCount}`)

            } catch (error) {
                log.error('CAROUSEL', `Generate slide failed | flow=${auditContext.flowId} slide=${i + 1}/${effectiveSlideCount}`, error)
                currentSlide.status = 'error'
                currentSlide.error = error instanceof Error ? error.message : 'Error'
                generatedImageUrls.push('') // Push empty to keep index alignment
            }
        }

        log.success('CAROUSEL', `Generate done | flow=${auditContext.flowId} slides=${slides.length}`)
        return { success: true, slides }

    } catch (error) {
        log.error('CAROUSEL', 'Generate failed', error)
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
        const catalog = await loadCarouselCatalog()
        const auditActor = await resolveEconomicAuditActor()
        const auditContext: EconomicAuditContext = {
            flowId: input.auditFlowId || createEconomicFlowId('carousel_analyze'),
            ...auditActor,
        }
        log.info('CAROUSEL', 'Solicitud de análisis recibida', {
            marca: brandDNA.brand_name,
            slides: slideCount,
            flow: shortFlowId(auditContext.flowId),
        })
        log.debug('CAROUSEL', 'Estado de referencia de estilo', {
            flow: shortFlowId(auditContext.flowId),
            referencia: input.aiImageDescription ? 'disponible' : 'vacía',
        })
        const decomposition = await decomposeIntoSlides(
            prompt,
            slideCount,
            brandDNA,
            intelligenceModel,
            selectedColors,
            includeLogoOnSlides ? selectedLogoUrl : undefined,
            catalog,
            {
                structureId: input.structureId,
                visualDescription: input.aiImageDescription,
                language: input.language,
                audit: auditContext,
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
        log.error('CAROUSEL', 'No se pudo completar el análisis del carrusel', {
            motivo: error instanceof Error ? error.message : String(error),
        })
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
        const catalog = await loadCarouselCatalog()
        const auditActor = await resolveEconomicAuditActor()
        const auditContext: EconomicAuditContext = {
            flowId: input.auditFlowId || createEconomicFlowId('carousel_caption'),
            ...auditActor,
        }
        const decomposition = await decomposeIntoSlides(
            prompt,
            slideCount,
            brandDNA,
            intelligenceModel,
            selectedColors,
            includeLogoOnSlides ? selectedLogoUrl : undefined,
            catalog,
            {
                captionOnly: true,
                structureId: input.structureId,
                visualDescription: input.aiImageDescription,
                language: input.language,
                audit: auditContext,
            }
        )
        return { success: true, caption: decomposition.caption }
    } catch (error) {
        log.error('CAROUSEL', 'Caption action failed', error)
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
    consistencyRefUrls?: string[],
    auditFlowId?: string
): Promise<{ success: boolean; imageUrl?: string; error?: string; debugPrompt?: string; debugReferences?: DebugImageReference[] }> {
    try {
        const catalog = await loadCarouselCatalog()
        const auditActor = await resolveEconomicAuditActor()
        const auditContext: EconomicAuditContext = {
            flowId: auditFlowId || createEconomicFlowId('carousel_regenerate'),
            ...auditActor,
        }
        log.info('CAROUSEL', `Regenerate slide request | brand=${brandDNA.brand_name} slide=${slideIndex + 1} flow=${auditContext.flowId}`)

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
            consistencyRefUrls,
            catalog,
            {
                context: auditContext,
                phase: 'carousel_slide_regeneration',
            }
        )

        return { success: true, imageUrl, debugPrompt: prompt, debugReferences: references }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error'
        }
    }
}


