'use server'

import { generateTextUnified } from '@/lib/gemini'
import { log } from '@/lib/logger'
import { buildIntentParserPrompt } from '@/lib/prompts/intents/parser'
import { INTENT_CATALOG, MERGED_LAYOUTS_BY_INTENT, type IntentCategory } from '@/lib/creation-flow-types'

export interface ParsedIntentResult {
    detectedIntent?: string // Auto-detected intent ID
    detectedLanguage?: string // Auto-detected language code (es, en, etc)
    confidence?: number      // Confidence score 0-1
    headline?: string
    cta?: string
    ctaUrl?: string          // NEW: Separate field for the URL
    caption?: string         // NEW: Social media caption
    imageTexts?: Array<{ label: string; value: string; type?: 'tagline' | 'hook' | 'custom' }>
    imagePromptSuggestions?: string[]
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
const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu
const EMOJI_TEST_REGEX = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u

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
        const picked = rawUrlMatches[rawUrlMatches.length - 1][1].trim()
        if (/^https?:\/\/$/i.test(picked)) return ''
        return picked
    }

    if (/^https?:\/\/$/i.test(cleaned)) return ''
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

function replaceUrlsWithBrand(text: string, brandWebsite?: string): string {
    if (!text) return ''
    if (!brandWebsite) return text
    return text.replace(/https?:\/\/[^\s\])}]+/gi, brandWebsite)
}

function sanitizePromptSuggestion(value: unknown): string {
    if (typeof value !== 'string') return ''
    return removeVisualStyleHints(
        sanitizeUrlsInText(value).replace(/\s+/g, ' ').trim()
    ).slice(0, 220)
}

function removeVisualStyleHints(text: string): string {
    if (!text) return ''

    const blockedTokens = [
        'style', 'aesthetic', 'mood', 'vibe', 'look', 'visual',
        'estilo', 'estética', 'estetica', 'ánimo', 'animo', 'vibra', 'aspecto', 'visual',
        'color', 'palette', 'tone', 'contrast', 'saturation', 'hue',
        'color', 'colores', 'paleta', 'tono', 'contraste', 'saturación', 'saturacion', 'matiz',
        'lighting', 'light', 'shadow', 'cinematic', 'film', 'grain',
        'iluminación', 'iluminacion', 'luz', 'sombras', 'sombra', 'cinematográfico', 'cinematografico', 'grano',
        'texture', 'composition', 'framing', 'depth of field', 'bokeh',
        'textura', 'composición', 'composicion', 'encuadre', 'profundidad de campo',
        'close-up', 'close up', 'wide shot', 'soft focus',
        'primer plano', 'plano amplio', 'foco suave',
        'realistic', 'photorealistic', 'illustration', 'illustrative',
        'realista', 'fotorrealista', 'fotográfico', 'fotografico', 'fotografía', 'fotografia', 'ilustración', 'ilustracion',
        'vector', 'comic', 'cartoon', 'watercolor', 'oil painting',
        'vectorial', 'cómic', 'comic', 'caricatura', 'acuarela', 'óleo', 'oleo',
        'corporate aesthetic', 'studio quality'
    ]
    const normalizedBlockedTokens = blockedTokens.map((token) => normalizeText(token))

    const clauses = text
        .split(/[,;]+/g)
        .map((c) => c.trim())
        .filter(Boolean)
        .filter((clause) => {
            const normalizedClause = normalizeText(clause)
            return !normalizedBlockedTokens.some((token) => normalizedClause.includes(token))
        })

    const cleaned = clauses.join(', ').trim()
    if (cleaned) {
        return cleaned
            .replace(/^(ilustracion|fotografia|foto|render|imagen|vector|vectorial)\s+(de|del|de la)\s+/i, '')
            .replace(/\s+/g, ' ')
            .trim()
    }

    // Last-resort fallback: keep only likely semantic scaffold
    return text
        .replace(/^(ilustración|ilustracion|fotografía|fotografia|foto|render|imagen|vector|vectorial)\s+(de|del|de la)\s+/i, '')
        .replace(/\b(with|in|using|con|en|usando)\b[^,.;]*(style|aesthetic|mood|look|lighting|color|palette|composition|texture|realistic|illustration|comic|estilo|estetica|iluminacion|color|paleta|composicion|realista|fotografia|ilustracion)\b[^,.;]*/gi, '')
        .replace(/\s+/g, ' ')
        .replace(/^[,.\s]+|[,.\s]+$/g, '')
        .trim()
}

function pickCaptionEmojis(intentId?: string): [string, string] {
    switch (intentId) {
        case 'oferta':
        case 'servicio':
        case 'lanzamiento':
        case 'escaparate':
        case 'catalogo':
            return ['\u{1F680}', '\u{2705}']
        case 'logro':
        case 'equipo':
        case 'cita':
        case 'talento':
        case 'bts':
            return ['\u{1F49A}', '\u{2728}']
        case 'reto':
        case 'pregunta':
            return ['\u{1F525}', '\u{1F4AC}']
        case 'comunicado':
        case 'evento':
        case 'lista':
        case 'comparativa':
        case 'efemeride':
        case 'dato':
        case 'pasos':
        case 'definicion':
            return ['\u{1F4CC}', '\u{1F9E0}']
        default:
            return ['\u{2728}', '\u{1F4E3}']
    }
}
function ensureCaptionHasEmojis(caption?: string, intentId?: string): string {
    const sanitized = sanitizeUrlsInText(caption).trim()
    if (!sanitized) return ''

    const [primaryEmoji, secondaryEmoji] = pickCaptionEmojis(intentId)
    const emojiMatches = sanitized.match(EMOJI_REGEX) || []
    if (emojiMatches.length >= 2) return sanitized

    const sentences = sanitized
        .split(/(?<=[.!?])\s+/g)
        .map((s) => s.trim())
        .filter(Boolean)

    if (sentences.length === 0) return `${primaryEmoji} ${sanitized}`

    if (emojiMatches.length === 0) {
        sentences[0] = `${primaryEmoji} ${sentences[0]}`
    }

    const currentJoined = sentences.join(' ')
    const currentMatches = currentJoined.match(EMOJI_REGEX) || []
    if (currentMatches.length < 2) {
        if (sentences.length > 1) {
            if (!EMOJI_TEST_REGEX.test(sentences[1])) {
                sentences[1] = `${secondaryEmoji} ${sentences[1]}`
            }
        } else if (!EMOJI_TEST_REGEX.test(sentences[0])) {
            sentences[0] = `${secondaryEmoji} ${sentences[0]}`
        } else {
            sentences[0] = `${secondaryEmoji} ${sentences[0]}`
        }
    }

    return sentences.join(' ')
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
        const alpha = l.replace(/[^\p{L}]/gu, '')
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
    const userProvidedUrl = Boolean(firstUserUrl)

    let headline = sanitizeUrlsInText(parsed.headline).trim()
    if (!headline) {
        const fallbackHeadline = userLines.find((line) => !/https?:\/\//i.test(line) && canonicalPhone(line).length < 7)
        if (fallbackHeadline) headline = fallbackHeadline
    }

    const safeBrandWebsite = sanitizeUrl(brandWebsite)
    const effectiveCtaUrl = userProvidedUrl
        ? (sanitizeUrl(parsed.ctaUrl) || firstUserUrl || '')
        : (safeBrandWebsite?.trim() || sanitizeUrl(parsed.ctaUrl) || '')
    const ctaUrl = effectiveCtaUrl
    const cta = sanitizeUrlsInText(parsed.cta).trim()
    if (!userProvidedUrl && safeBrandWebsite) {
        parsed.caption = replaceUrlsWithBrand(sanitizeUrlsInText(parsed.caption), safeBrandWebsite)
    }

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
        const normalizedClean = (!userProvidedUrl && safeBrandWebsite)
            ? replaceUrlsWithBrand(clean, safeBrandWebsite)
            : clean

        const phone = canonicalPhone(normalizedClean)
        if (phone.length >= 7) {
            // Keep only one normalized phone line in the block.
            if (Array.from(seenPhones).some((p) => p === phone || p.includes(phone) || phone.includes(p))) return
            seenPhones.add(phone)
        }

        const canon = canonicalText(normalizedClean)
        if (!canon) return
        if (blocked.some((b) => b === canon || b.includes(canon) || canon.includes(b))) return
        if (seenCanon.has(canon)) return
        if (isDuplicateBySimilarity(canon, Array.from(seenCanon))) return

        seenCanon.add(canon)
        fragments.push(normalizedClean)
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

    const imageTexts = fragments.length > 0
        ? fragments.map((fragment, idx) => ({
            label: idx === 0 ? 'Texto principal' : `Texto ${idx + 1}`,
            value: fragment,
            type: 'custom' as const
        }))
        : []

    return {
        ...parsed,
        headline: (!userProvidedUrl && safeBrandWebsite) ? replaceUrlsWithBrand(headline, safeBrandWebsite) : headline,
        cta: (!userProvidedUrl && safeBrandWebsite) ? replaceUrlsWithBrand(cta, safeBrandWebsite) : cta,
        ctaUrl,
        imageTexts,
        customTexts: undefined
    }
}

function buildSuggestionFromBase(
    base: ParsedIntentResult,
    mode: 'direct' | 'emotional' | 'proof',
    coreSubject?: string
) {
    const baseImageTexts = Array.isArray(base.imageTexts)
        ? base.imageTexts.map((item) => ({
            label: item?.label || 'Texto principal',
            value: sanitizeUrlsInText(item?.value || ''),
            type: item?.type || 'custom'
        }))
        : []
    const subjectSuffix = coreSubject ? ` (${coreSubject})` : ''
    const title = mode === 'direct'
        ? `Enfoque Directo${subjectSuffix}`
        : mode === 'proof'
            ? `Enfoque de Credibilidad${subjectSuffix}`
            : `Enfoque Emocional${subjectSuffix}`
    const subtitle = mode === 'direct'
        ? 'Mensaje claro y accionable, orientado a conversion y comprension inmediata.'
        : mode === 'proof'
            ? 'Apoya la promesa con pruebas, datos o elementos concretos para aumentar confianza.'
            : 'Mensaje inspirador y cercano, reforzando beneficio percibido y conexion emocional.'

    return {
        title,
        subtitle,
        modifications: {
            headline: base.headline || '',
            cta: base.cta || '',
            ctaUrl: base.ctaUrl || '',
            caption: base.caption || '',
            imageTexts: baseImageTexts
        }
    }
}

function extractCoreSubject(userText: string): string {
    const lines = extractLineCandidates(userText)
        .filter((line) => !/https?:\/\//i.test(line))
        .filter((line) => canonicalPhone(line).length < 7)
    return lines[0]?.trim().slice(0, 60) || ''
}

function normalizeSuggestions(
    parsedSuggestions: ParsedIntentResult['suggestions'],
    organizedBase: ParsedIntentResult,
    userText: string
): ParsedIntentResult['suggestions'] {
    const TARGET_COUNT = 5
    const source = Array.isArray(parsedSuggestions) ? parsedSuggestions : []
    const coreSubject = extractCoreSubject(userText)
    const userUrls = Array.from(userText.matchAll(/(https?:\/\/[^\s\])}]+)/g)).map((m) => sanitizeUrl(m[1]))
    const userProvidedUrl = Boolean(userUrls.find(Boolean))
    const safeBrandWebsite = sanitizeUrl(organizedBase.ctaUrl)
    const maybeReplace = (value: string) =>
        (!userProvidedUrl && safeBrandWebsite) ? replaceUrlsWithBrand(value, safeBrandWebsite) : value

    const normalized = source.map((suggestion) => {
        const modifications = { ...(suggestion?.modifications || {}) } as Record<string, unknown>
        const imageTexts = Array.isArray(modifications.imageTexts) ? modifications.imageTexts : organizedBase.imageTexts
        const headlineText = typeof modifications.headline === 'string' ? modifications.headline : ''
        const ctaText = typeof modifications.cta === 'string' ? modifications.cta : ''
        const ctaUrlText = typeof modifications.ctaUrl === 'string' ? modifications.ctaUrl : ''
        const captionText = typeof modifications.caption === 'string' ? modifications.caption : ''

        return {
            title: typeof suggestion?.title === 'string' && suggestion.title.trim()
                ? suggestion.title.trim()
                : buildSuggestionFromBase(organizedBase, 'direct', coreSubject)?.title,
            subtitle: typeof suggestion?.subtitle === 'string' && suggestion.subtitle.trim()
                ? suggestion.subtitle.trim()
                : 'Variante optimizada para este objetivo.',
            modifications: {
                headline: maybeReplace(sanitizeUrlsInText(headlineText) || organizedBase.headline || ''),
                cta: maybeReplace(sanitizeUrlsInText(ctaText) || organizedBase.cta || ''),
                ctaUrl: (!userProvidedUrl && safeBrandWebsite) ? safeBrandWebsite : (sanitizeUrl(ctaUrlText) || organizedBase.ctaUrl || ''),
                caption: ensureCaptionHasEmojis(
                    maybeReplace(sanitizeUrlsInText(captionText) || organizedBase.caption || ''),
                    organizedBase.detectedIntent
                ),
                imageTexts: Array.isArray(imageTexts)
                    ? imageTexts.map((item: unknown) => {
                        const typedItem = (item && typeof item === 'object') ? (item as Record<string, unknown>) : {}
                        return {
                            label: typeof typedItem.label === 'string' && typedItem.label.trim() ? typedItem.label : 'Texto principal',
                            value: maybeReplace(sanitizeUrlsInText(String(typedItem.value || ''))),
                            type: typedItem.type === 'tagline' || typedItem.type === 'hook' ? typedItem.type : 'custom'
                        }
                    })
                    : []
            }
        }
    }).filter((item) => item.modifications.headline || item.modifications.caption || (item.modifications.imageTexts?.length ?? 0) > 0)

    if (normalized.length >= TARGET_COUNT) {
        return normalized.slice(0, TARGET_COUNT)
    }

    const fallbackDirect = buildSuggestionFromBase(organizedBase, 'direct', coreSubject)
    const fallbackEmotional = buildSuggestionFromBase(organizedBase, 'emotional', coreSubject)
    const fallbackProof = buildSuggestionFromBase(organizedBase, 'proof', coreSubject)
    const fallbackProof2 = buildSuggestionFromBase(organizedBase, 'proof', coreSubject)
    const fallbackDirect2 = buildSuggestionFromBase(organizedBase, 'direct', coreSubject)
    const seeded = [...normalized]

    if (seeded.length === 0) {
        seeded.push(fallbackDirect, fallbackEmotional, fallbackProof)
    } else if (seeded.length === 1) {
        const existingTitle = seeded[0].title?.toLowerCase() || ''
        const second = existingTitle.includes('emoc')
            ? fallbackDirect
            : fallbackEmotional
        seeded.push(second)
    }

    if (seeded.length === 2) seeded.push(fallbackProof)
    if (seeded.length === 3) seeded.push(fallbackProof2)
    if (seeded.length === 4) seeded.push(fallbackDirect2)

    return seeded.slice(0, TARGET_COUNT)
}

function buildImagePromptSuggestions(
    parsed: ParsedIntentResult,
    organizedBase: ParsedIntentResult
): string[] {
    const fromModel = Array.isArray(parsed.imagePromptSuggestions)
        ? parsed.imagePromptSuggestions.map(sanitizePromptSuggestion).filter(Boolean)
        : []

    if (fromModel.length > 0) {
        return Array.from(new Set(fromModel)).slice(0, 8)
    }

    const fromSuggestions = Array.isArray(parsed.suggestions)
        ? parsed.suggestions
            .map((s) => {
                const modifications = (s?.modifications || {}) as Record<string, unknown>
                const head = sanitizePromptSuggestion(modifications.headline)
                const textBlock = Array.isArray(modifications.imageTexts)
                    ? sanitizePromptSuggestion((modifications.imageTexts[0] as Record<string, unknown>)?.value)
                    : ''
                return [head, textBlock].filter(Boolean).join('. ')
            })
            .map((v) => sanitizePromptSuggestion(v))
            .filter(Boolean)
        : []

    if (fromSuggestions.length > 0) {
        return Array.from(new Set(fromSuggestions)).slice(0, 8)
    }

    const captionSeed = (organizedBase.caption || '').split(/[.!?]\s+/g)[0] || ''
    const imageTextSeed = Array.isArray(organizedBase.imageTexts) && organizedBase.imageTexts[0]
        ? String(organizedBase.imageTexts[0].value || '').split(/\r?\n+/g)[0]
        : ''

    const rawSeeds = [
        organizedBase.headline,
        organizedBase.cta,
        captionSeed,
        imageTextSeed,
        `${organizedBase.headline || organizedBase.cta} en una situacion real y concreta`.trim()
    ]

    const normalizedSeeds = rawSeeds
        .map(sanitizePromptSuggestion)
        .filter(Boolean)

    const uniqueSeeds = Array.from(new Set(normalizedSeeds))
    return uniqueSeeds.slice(0, 8)
}

function buildSafeFallbackParsedOutput(
    userText: string,
    brandWebsite?: string,
    intentId?: string
): ParsedIntentResult {
    const inferredIntent =
        (intentId && INTENT_CATALOG.some((i) => i.id === intentId) ? intentId : undefined) ||
        inferIntentFromText(userText) ||
        DEFAULT_FALLBACK_INTENT

    const base: ParsedIntentResult = {
        detectedIntent: inferredIntent,
        detectedLanguage: 'es',
        confidence: 0.25,
        headline: '',
        cta: '',
        ctaUrl: brandWebsite?.trim() || '',
        caption: sanitizeUrlsInText(userText),
        imageTexts: [{ label: 'Texto principal', value: sanitizeUrlsInText(userText), type: 'custom' }],
    }

    return organizeParsedOutput(base, userText, brandWebsite)
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

function normalizeSmartQuotes(raw: string): string {
    return raw
        .replace(/[â€œâ€]/g, '"')
        .replace(/[â€˜â€™]/g, "'")
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
    intelligenceModel,
    variationSeed,
    previewTextContext
}: {
    userText: string
    brandDNA: any
    brandWebsite?: string
    intentId?: string
    layoutId?: string
    intelligenceModel?: string
    variationSeed?: number
    previewTextContext?: string
}): Promise<ParsedIntentResult> {
    try {
        // 1. Prepare Metadata
        const intent = intentId ? INTENT_CATALOG.find(i => i.id === intentId) : undefined
        const allLayouts = Object.values(MERGED_LAYOUTS_BY_INTENT).flat()
        const layout = layoutId ? allLayouts.find(l => l.id === layoutId) : undefined
        if (!intelligenceModel) {
            throw new Error('[LazyPrompt] Missing intelligence model configuration')
        }
        const modelToUse = intelligenceModel
        log.info('LazyPrompt', `Parsing with model ${modelToUse} ${intent ? `for intent: ${intent.name}` : 'with auto-detection'}`)

        // 2. Build Prompt Parts (Include system prompt in body for maximum adherence across all models)
        const prompt = buildIntentParserPrompt(userText, brandWebsite, brandDNA, intent, layout, previewTextContext)
        const creativeLenses = [
            'beneficio directo y claridad accionable',
            'prueba social y credibilidad concreta',
            'urgencia suave y oportunidad inmediata',
            'narrativa breve de problema-solucion',
            'tono conversacional con propuesta clara',
            'enfoque aspiracional con llamada precisa',
            'enfoque visual concreto con escena memorable',
            'enfoque humano y emocional con gesto claro',
            'enfoque de detalle tangible (objeto, lugar, accion)',
        ] as const
        const seed = Number.isFinite(variationSeed) ? Number(variationSeed) : Date.now()
        const selectedLens = creativeLenses[Math.abs(seed) % creativeLenses.length]
        const promptWithVariation = `${prompt}

CREATIVE VARIATION MODE:
- Mantén intactos todos los datos literales críticos (URLs, teléfonos, precios, fechas, condiciones).
- Esta ejecución debe priorizar el ángulo: ${selectedLens}.
- Las 3 sugerencias deben diferenciarse claramente entre sí y no ser reformulaciones mínimas.`
        // 3. Prepare Brand Context
        const brandName = brandDNA?.brand_name || brandDNA?.name || 'la marca'
        const brandContextForAI = {
            name: brandName,
            brand_dna: brandDNA || {}
        }

        // 4. Call AI with specialized System Instruction (Empty override to avoid persona blending)
        const jsonResponse = await generateTextUnified(
            brandContextForAI as any,
            promptWithVariation,
            modelToUse,
            [], // No images for intent parsing
            "", // SILENCE generic persona to avoid hallucinations
            { temperature: 0.9, topP: 0.92 }
        )

        log.debug('LazyPrompt', 'Received JSON', jsonResponse.substring(0, 500))

        // 5. Parse Response (Robustly)
        const cleanJson = extractJson(jsonResponse)
        let parsed: ParsedIntentResult
        try {
            parsed = JSON.parse(cleanJson)
        } catch (firstError) {
            try {
                parsed = JSON.parse(repairJsonString(cleanJson))
            } catch (secondError) {
                const firstMessage = firstError instanceof Error ? firstError.message : String(firstError)
                const secondMessage = secondError instanceof Error ? secondError.message : String(secondError)
                throw new Error(`Invalid JSON from intent parser (${firstMessage}) -> repair failed (${secondMessage})`)
            }
        }

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
        parsed.caption = ensureCaptionHasEmojis(parsed.caption, parsed.detectedIntent)

        if (parsed.imageTexts && Array.isArray(parsed.imageTexts)) {
            parsed.imageTexts = parsed.imageTexts.map(item => ({
                ...item,
                value: sanitizeUrlsInText(item.value)
            }))
        }
        if (parsed.imagePromptSuggestions && Array.isArray(parsed.imagePromptSuggestions)) {
            parsed.imagePromptSuggestions = parsed.imagePromptSuggestions
                .map(sanitizePromptSuggestion)
                .filter(Boolean)
                .slice(0, 8)
        }

        // 7. Brand Consistency check for URLs
        // ONLY fallback to Brand Website if ctaUrl is missing or a placeholder.
        // If the AI provided a valid URL with subpaths, we MUST preserve it.
        if (brandWebsite && (!parsed.ctaUrl || parsed.ctaUrl.includes('[BRAND'))) {
            parsed.ctaUrl = sanitizeUrl(brandWebsite.trim())
        }

        // 8. Final organization layer:
        // keep headline/cta/url and collapse the rest into one coherent preview block.
        const organized = organizeParsedOutput(parsed, userText, brandWebsite)
        organized.suggestions = normalizeSuggestions(parsed.suggestions, organized, userText)
        organized.imagePromptSuggestions = buildImagePromptSuggestions(parsed, organized)
        return organized
    } catch (error) {
        log.error('LazyPrompt', 'Error', error)
        throw error
    }
}


