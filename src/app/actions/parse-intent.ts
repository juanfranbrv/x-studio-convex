'use server'

import { generateTextUnified } from '@/lib/gemini'
import { buildIntentParserPrompt } from '@/lib/prompts/intents/parser'
import { INTENT_CATALOG, LAYOUTS_BY_INTENT, type IntentCategory } from '@/lib/creation-flow-types'

export interface ParsedIntentResult {
    detectedIntent?: string // Auto-detected intent ID
    detectedLanguage?: string // Auto-detected language code (es, en, etc)
    confidence?: number      // Confidence score 0-1
    headline?: string
    cta?: string
    ctaUrl?: string          // NEW: Separate field for the URL
    caption?: string         // NEW: Social media caption
    imageTexts?: Array<{ label: string; value: string; type?: 'tagline' | 'hook' | 'custom' }>
    customTexts?: Record<string, string>
    suggestions?: Array<{
        title: string
        subtitle: string
        modifications: any // Will be Partial<ParsedIntentResult> effectively
    }>
    error?: string
}

const INTENT_ALIASES: Record<string, string> = {
    promocional: 'oferta',
    promocion: 'oferta',
    promotional: 'oferta',
    promotion: 'oferta',
    promo: 'oferta',
    offer: 'oferta',
    sale: 'oferta',
    showcase: 'escaparate',
    catalog: 'catalogo',
    launch: 'lanzamiento',
    service: 'servicio',
    announcement: 'comunicado',
    event: 'evento',
    list: 'lista',
    comparison: 'comparativa',
    anniversary: 'efemeride',
    team: 'equipo',
    quote: 'cita',
    testimonial: 'cita',
    hiring: 'talento',
    jobs: 'talento',
    achievement: 'logro',
    bts: 'bts',
    data: 'dato',
    steps: 'pasos',
    howto: 'pasos',
    definition: 'definicion',
    question: 'pregunta',
    challenge: 'reto',
}

const DEFAULT_FALLBACK_INTENT: IntentCategory = 'servicio'

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
}

function includesAny(text: string, tokens: string[]): boolean {
    return tokens.some(token => text.includes(token))
}

/**
 * Extracts a clean URL from potential Markdown or dirty strings.
 * E.g. "[Link](https://bauset.es)" -> "https://bauset.es"
 * E.g. "https[https://bauset.es](...)" -> "https://bauset.es"
 */
function sanitizeUrl(url?: string): string {
    if (!url) return ''
    let cleaned = url.trim().replace(/^["']|["']$/g, '')

    // Pattern 1: Direct Markdown match [text](url)
    const markdownMatch = cleaned.match(/\[.*?\]\((https?:\/\/.*?)\)/)
    if (markdownMatch) {
        cleaned = markdownMatch[1].trim()
    }

    // Pattern 2: Extract the LAST valid URL starting with http
    // This handles hallucinated prefixes like "https[https://...]" or "https://bauset.https://bauset.es"
    const rawUrlMatches = Array.from(cleaned.matchAll(/(https?:\/\/[^\s\]\)]+)/g))
    if (rawUrlMatches.length > 0) {
        return rawUrlMatches[rawUrlMatches.length - 1][1].trim()
    }

    return cleaned
}

/**
 * Removes Markdown links from a text, keeping only the URL part.
 * E.g. "Visit [Bauset](https://bauset.es) now" -> "Visit https://bauset.es now"
 */
function sanitizeTextFromMarkdownLinks(text?: string): string {
    if (!text) return ''
    return text.replace(/\[.*?\]\((https?:\/\/.*?)\)/g, '$1')
}

/**
 * Cleans URLs embedded in text (caption, subtitles, etc.).
 * - Strips markdown links
 * - Fixes duplicated protocol fragments like "https://bahtttps://example.com"
 */
function sanitizeUrlsInText(text?: string): string {
    if (!text) return ''
    let cleaned = sanitizeTextFromMarkdownLinks(text)

    // Replace any occurrences of duplicated protocol inside a URL-like token
    cleaned = cleaned.replace(
        /https?:\/\/[^\s]+/g,
        (token) => sanitizeUrl(token)
    )

    return cleaned
}

function canonicalPhone(value: string): string {
    return value.replace(/\D/g, '')
}

function canonicalText(value: string): string {
    return sanitizeUrlsInText(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
}

function isDuplicateBySimilarity(candidate: string, existing: string[]): boolean {
    for (const ex of existing) {
        if (!ex) continue
        if (candidate === ex) return true
        if (candidate.length >= 16 && ex.includes(candidate)) return true
        if (ex.length >= 16 && candidate.includes(ex)) return true
    }
    return false
}

function extractLineCandidates(text: string): string[] {
    const rawLines = text
        .split(/\r?\n+/g)
        .map((l) => l.trim())
        .filter(Boolean)

    // Keep concrete/user-authored lines, avoid very short noise and number-only fragments
    const filtered = rawLines.filter((l) => {
        if (l.length < 8 || l.length > 160) return false
        const digits = l.replace(/\D/g, '')
        const alpha = l.replace(/[^a-zA-ZÀ-ÿ]/g, '')
        if (digits.length >= 7 && alpha.length < 3) return false
        return true
    })
    return Array.from(new Set(filtered))
}

function organizeParsedOutput(
    parsed: ParsedIntentResult,
    userText: string,
    brandWebsite?: string
): ParsedIntentResult {
    const aiImageTexts = Array.isArray(parsed.imageTexts) ? parsed.imageTexts : []
    const userLines = extractLineCandidates(userText)
    const userUrls = Array.from(userText.matchAll(/(https?:\/\/[^\s\])}]+)/g)).map((m) => sanitizeUrl(m[1]))
    const firstUserUrl = userUrls.find(Boolean)

    let headline = sanitizeUrlsInText(parsed.headline).trim()
    if (!headline) {
        const fallbackHeadline = userLines.find((line) => !/https?:\/\//i.test(line) && canonicalPhone(line).length < 7)
        if (fallbackHeadline) headline = fallbackHeadline
    }

    const ctaUrl = sanitizeUrl(parsed.ctaUrl) || firstUserUrl || (brandWebsite?.trim() || '')
    const cta = sanitizeUrlsInText(parsed.cta).trim()

    const blocked = [headline, cta, ctaUrl]
        .map((v) => canonicalText(v))
        .filter(Boolean)

    const fragments: string[] = []
    const seenCanon = new Set<string>()
    const seenPhones = new Set<string>()

    const splitCandidateLines = (value: string): string[] =>
        value
            .split(/\r?\n+/g)
            .map((line) => line.trim())
            .filter(Boolean)

    const pushFragment = (raw: string) => {
        const clean = sanitizeUrlsInText(raw).trim()
        if (!clean) return
        if (/^https?:\/\//i.test(clean)) return

        const phone = canonicalPhone(clean)
        if (phone.length >= 7) {
            // Keep only one normalized phone line in the block.
            if (Array.from(seenPhones).some((p) => p === phone || p.includes(phone) || phone.includes(p))) return
            seenPhones.add(phone)
        }

        const canon = canonicalText(clean)
        if (!canon) return
        if (blocked.some((b) => b === canon || b.includes(canon) || canon.includes(b))) return
        if (seenCanon.has(canon)) return
        if (isDuplicateBySimilarity(canon, Array.from(seenCanon))) return

        seenCanon.add(canon)
        fragments.push(clean)
    }

    // 1) Prefer model-organized content first.
    aiImageTexts.forEach((item) => {
        splitCandidateLines(item?.value || '').forEach(pushFragment)
    })

    // 2) Add model custom text support, line by line.
    if (parsed.customTexts) {
        Object.values(parsed.customTexts).forEach((value) => {
            if (typeof value === 'string') {
                splitCandidateLines(value).forEach(pushFragment)
            }
        })
    }

    // 3) Fallback: if model returned little, use user-authored lines.
    if (fragments.length === 0) {
        userLines.forEach((line) => {
            pushFragment(line)
        })
    }

    const bodyBlock = fragments.join('\n').trim()
    const imageTexts = bodyBlock
        ? [{ label: 'Texto principal', value: bodyBlock, type: 'custom' as const }]
        : []

    return {
        ...parsed,
        headline,
        cta,
        ctaUrl,
        imageTexts,
        customTexts: undefined
    }
}

/**
 * Robustly extracts the first JSON object found in a string.
 * Handles noise before/after the JSON and handles markdown blocks.
 */
function extractJson(text: string): string {
    // 1. Remove markdown code blocks if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    // 2. Find the first '{' and the last matching '}'
    const startIdx = cleaned.indexOf('{')
    if (startIdx === -1) return cleaned // Let JSON.parse fail with original string if no {

    let braceCount = 0
    let endIdx = -1

    for (let i = startIdx; i < cleaned.length; i++) {
        if (cleaned[i] === '{') braceCount++
        else if (cleaned[i] === '}') braceCount--

        if (braceCount === 0) {
            endIdx = i + 1
            break
        }
    }

    if (endIdx !== -1) {
        return cleaned.substring(startIdx, endIdx)
    }

    return cleaned
}

function inferIntentFromText(userText: string): string | undefined {
    const text = normalizeText(userText)
    if (!text.trim()) return undefined

    const has = (tokens: string[]) => includesAny(text, tokens)
    const challengeTokens = [
        'reto',
        'desafio',
        'challenge',
        'adivinanza',
        'adivina',
        'traduccion',
        'sin usar google',
        'sin usar google translate',
        'quien acierta',
        'a ver quien',
        'acierta',
        'juego',
        'trivia',
        'quiz',
    ]
    const isChallenge = has(challengeTokens)
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    const months = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
    ]
    const hasDate = new RegExp(`\\b\\d{1,2}\\s*(de\\s*)?(${months.join('|')})\\b`).test(text)
    const hasDay = new RegExp(`\\b(${days.join('|')})\\b`).test(text)
    const hasTime = /\b\d{1,2}(:\d{2})?\s*(h|am|pm)\b/.test(text)
    const hasEventTime = hasDate || hasDay || hasTime

    const discountTokens = ['descuento', 'oferta', 'rebaja', 'promocion', 'promo', '2x1', '2x', 'liquidacion']
    const hasDiscount = has(discountTokens)

    if (has(['comunicado', 'aviso', 'anuncio oficial', 'cambio de horario', 'horario', 'cierre', 'cerramos', 'politica', 'normativa'])) {
        return 'comunicado'
    }

    if (has(['evento', 'webinar', 'directo', 'live', 'charla', 'conferencia', 'seminario', 'presentacion'])) {
        return 'evento'
    }
    if (hasEventTime && has(['curso', 'taller', 'formacion', 'clase'])) {
        return 'evento'
    }

    if (hasDiscount) {
        return 'oferta'
    }

    if (has(['lanzamiento', 'lanzamos', 'presentamos', 'proximamente', 'coming soon', 'nuevo producto', 'nueva coleccion'])) {
        return 'lanzamiento'
    }

    if (has(['catalogo', 'coleccion', 'gama', 'linea', 'variedad', 'seleccion'])) {
        return 'catalogo'
    }

    if (has(['servicio', 'consultoria', 'asesoria', 'mentoria', 'curso', 'taller', 'clase', 'programa', 'formacion'])) {
        return 'servicio'
    }

    if (has(['comparativa', 'comparar', 'versus', 'vs', 'antes y despues', 'antes/despues'])) {
        return 'comparativa'
    }

    if (has(['lista', 'checklist', 'top', 'consejos', 'tips'])) {
        return 'lista'
    }

    if (has(['dato', 'estadistica', 'estadisticas', 'porcentaje', 'segun', 'estudio', 'datos']) || (text.includes('%') && !hasDiscount)) {
        return 'dato'
    }

    if (has(['reto', 'desafio', 'challenge'])) {
        return 'reto'
    }

    if (isChallenge) {
        return 'reto'
    }

    if (has(['pregunta', 'que opinas', 'opinas']) || text.includes('?')) {
        return 'pregunta'
    }

    if (has(['definicion', 'que es', 'significado', 'concepto'])) {
        return 'definicion'
    }

    if (has(['paso', 'pasos', 'tutorial', 'guia', 'receta', 'instrucciones'])) {
        return 'pasos'
    }

    if (text.includes('como ') && has(['hacer', 'preparar', 'construir', 'crear', 'usar', 'montar', 'configurar', 'aprender'])) {
        return 'pasos'
    }

    if (has(['logro', 'premio', 'ganamos', 'reconocimiento', 'finalista'])) {
        return 'logro'
    }

    if (has(['equipo', 'nuestro equipo', 'conoce al equipo', 'staff'])) {
        return 'equipo'
    }

    if (has(['cita', 'frase', 'testimonio', 'testimonios', 'review', 'resena'])) {
        return 'cita'
    }

    if (has(['vacante', 'empleo', 'contratamos', 'buscamos', 'reclutamiento', 'oferta de empleo'])) {
        return 'talento'
    }

    if (has(['bts', 'detras de', 'behind', 'making of', 'proceso'])) {
        return 'bts'
    }

    if (has(['efemeride', 'aniversario', 'cumpleanos', 'feliz', 'navidad', 'halloween', 'black friday', 'san valentin', 'dia de'])) {
        return 'efemeride'
    }

    if (has(['producto', 'modelo', 'edicion', 'nuevo modelo'])) {
        return 'escaparate'
    }

    return undefined
}

export async function parseLazyIntentAction({
    userText,
    brandDNA,
    brandWebsite,
    intentId,
    layoutId,
    intelligenceModel
}: {
    userText: string
    brandDNA: any
    brandWebsite?: string
    intentId?: string
    layoutId?: string
    intelligenceModel?: string
}): Promise<ParsedIntentResult> {
    try {
        // 1. Prepare Metadata
        const intent = intentId ? INTENT_CATALOG.find(i => i.id === intentId) : undefined
        const allLayouts = Object.values(LAYOUTS_BY_INTENT).flat()
        const layout = layoutId ? allLayouts.find(l => l.id === layoutId) : undefined
        if (!intelligenceModel) {
            throw new Error('Missing intelligence model configuration')
        }
        const modelToUse = intelligenceModel
        console.log(`[LazyPrompt] Parsing with model ${modelToUse} ${intent ? `for intent: ${intent.name}` : 'with auto-detection'}`)

        // 2. Build Prompt Parts (Include system prompt in body for maximum adherence across all models)
        const prompt = buildIntentParserPrompt(userText, brandWebsite, brandDNA, intent, layout)

        // 3. Prepare Brand Context
        const brandName = brandDNA?.brand_name || brandDNA?.name || 'la marca'
        const brandContextForAI = {
            name: brandName,
            brand_dna: brandDNA || {}
        }

        // 4. Call AI with specialized System Instruction (Empty override to avoid persona blending)
        const jsonResponse = await generateTextUnified(
            brandContextForAI as any,
            prompt,
            modelToUse,
            [], // No images for intent parsing
            "" // SILENCE generic persona to avoid hallucinations
        )

        console.log(`[LazyPrompt] Received JSON: ${jsonResponse.substring(0, 500)}...`)

        // 5. Parse Response (Robustly)
        const cleanJson = extractJson(jsonResponse)
        const parsed: ParsedIntentResult = JSON.parse(cleanJson)

        const validIntentIds = new Set<IntentCategory>(INTENT_CATALOG.map(i => i.id))
        const isIntentCategory = (value?: string): value is IntentCategory =>
            !!value && validIntentIds.has(value as IntentCategory)
        let detected = parsed.detectedIntent?.toLowerCase().trim()

        if (detected && !isIntentCategory(detected)) {
            const alias = INTENT_ALIASES[detected]
            if (alias && isIntentCategory(alias)) {
                detected = alias
            } else {
                detected = undefined
            }
        }

        if (!detected) {
            const fallback = inferIntentFromText(userText)
            if (isIntentCategory(fallback)) {
                detected = fallback
            }
        }

        if (!detected) {
            detected = DEFAULT_FALLBACK_INTENT
        }

        if (intentId && isIntentCategory(intentId)) {
            parsed.detectedIntent = intentId
        } else if (detected) {
            parsed.detectedIntent = detected
        } else {
            parsed.detectedIntent = undefined
        }

        if (parsed.detectedLanguage) {
            parsed.detectedLanguage = parsed.detectedLanguage.trim().toLowerCase().substring(0, 2)
        }

        // 6. Sanitize URLs and Captions (AI occasionally ignores prompt rules)
        parsed.ctaUrl = sanitizeUrl(parsed.ctaUrl)
        parsed.caption = sanitizeUrlsInText(parsed.caption)

        if (parsed.imageTexts && Array.isArray(parsed.imageTexts)) {
            parsed.imageTexts = parsed.imageTexts.map(item => ({
                ...item,
                value: sanitizeUrlsInText(item.value)
            }))
        }

        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
            parsed.suggestions = parsed.suggestions.map(suggestion => {
                const modifications = { ...(suggestion.modifications || {}) }
                if (typeof modifications.ctaUrl === 'string') {
                    modifications.ctaUrl = sanitizeUrl(modifications.ctaUrl)
                }
                if (typeof modifications.caption === 'string') {
                    modifications.caption = sanitizeUrlsInText(modifications.caption)
                }
                if (Array.isArray(modifications.imageTexts)) {
                    modifications.imageTexts = modifications.imageTexts.map((item: any) => ({
                        ...item,
                        value: sanitizeUrlsInText(item?.value)
                    }))
                }
                return { ...suggestion, modifications }
            })
        }

        // 7. Brand Consistency check for URLs
        // ONLY fallback to Brand Website if ctaUrl is missing or a placeholder.
        // If the AI provided a valid URL with subpaths, we MUST preserve it.
        if (brandWebsite && (!parsed.ctaUrl || parsed.ctaUrl.includes('[BRAND'))) {
            parsed.ctaUrl = brandWebsite.trim()
        }

        // 8. Final organization layer:
        // keep headline/cta/url and collapse the rest into one coherent preview block.
        const organized = organizeParsedOutput(parsed, userText, brandWebsite)
        return organized
    } catch (error) {
        console.error('[LazyPrompt] Error:', error)
        return { error: `Failed to parse intent: ${error instanceof Error ? error.message : String(error)}` }
    }
}


