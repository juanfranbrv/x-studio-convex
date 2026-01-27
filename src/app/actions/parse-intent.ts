'use server'

import { generateTextUnified } from '@/lib/gemini'
import { buildIntentParserPrompt } from '@/lib/prompts/intents/parser'
import { INTENT_CATALOG, LAYOUTS_BY_INTENT, type IntentCategory } from '@/lib/creation-flow-types'

export interface ParsedIntentResult {
    detectedIntent?: string // Auto-detected intent ID
    confidence?: number      // Confidence score 0-1
    headline?: string
    cta?: string
    ctaUrl?: string          // NEW: Separate field for the URL
    caption?: string         // NEW: Social media caption
    imageTexts?: Array<{ label: string; value: string; type?: 'tagline' | 'hook' | 'custom' }>
    customTexts?: Record<string, string>
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

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
}

function includesAny(text: string, tokens: string[]): boolean {
    return tokens.some(token => text.includes(token))
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

        // 5. Parse Response
        const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim()
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

        if (intentId && isIntentCategory(intentId)) {
            parsed.detectedIntent = intentId
        } else if (detected) {
            parsed.detectedIntent = detected
        } else {
            parsed.detectedIntent = undefined
        }

        return parsed
    } catch (error) {
        console.error('[LazyPrompt] Error:', error)
        return { error: `Failed to parse intent: ${error instanceof Error ? error.message : String(error)}` }
    }
}

