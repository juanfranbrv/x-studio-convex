'use server'

import { BrandDNA } from '@/lib/brand-types'
import { generateTextUnified } from '@/lib/gemini'
import { detectLanguageWithApi } from '@/lib/language-detection'
import { buildSocialManagerPrompt } from '@/lib/prompts/actions/social-manager'

const FALLBACK_TAGS: Record<string, string[]> = {
    es: ['marketing', 'negocios', 'marca', 'socialmedia', 'contenido', 'diseno'],
    en: ['marketing', 'branding', 'socialmedia', 'content', 'design', 'creative'],
    fr: ['marketing', 'marque', 'contenu', 'design', 'reseaux', 'communication'],
    de: ['marketing', 'marke', 'inhalt', 'design', 'socialmedia', 'kommunikation'],
    it: ['marketing', 'brand', 'contenuto', 'design', 'social', 'comunicazione'],
    pt: ['marketing', 'marca', 'conteudo', 'design', 'socialmedia', 'comunicacao'],
    ca: ['marketing', 'marca', 'contingut', 'disseny', 'socialmedia', 'comunicacio']
}

const STOPWORDS = new Set([
    'de', 'la', 'el', 'y', 'a', 'en', 'con', 'para', 'que', 'un', 'una', 'los', 'las', 'tu', 'su', 'es', 'por',
    'the', 'and', 'of', 'for', 'to', 'in', 'on', 'at', 'is', 'this', 'that', 'your', 'our', 'you', 'we', 'us',
    'et', 'le', 'les', 'des', 'du', 'au', 'aux', 'un', 'une', 'pour', 'avec',
    'der', 'die', 'das', 'und', 'mit', 'fur', 'den', 'dem', 'ein', 'eine',
    'il', 'lo', 'gli', 'le', 'per', 'con', 'una', 'uno',
    'o', 'os', 'as', 'um', 'uma', 'por', 'com',
    'al', 'els', 'les', 'per', 'amb'
])

const sanitizeTag = (value: string) => {
    const cleaned = value
        .replace(/^#+/, '')
        .replace(/[^\p{L}\p{N}_]/gu, '')
        .trim()
    return cleaned
}

const normalizeHashtags = (hashtags: unknown): string[] => {
    let raw: string[] = []

    if (Array.isArray(hashtags)) {
        raw = hashtags.map((tag) => String(tag))
    } else if (typeof hashtags === 'string') {
        raw = hashtags.split(/[\s,]+/)
    }

    const normalized = raw
        .map((tag) => sanitizeTag(tag))
        .filter((tag) => tag.length > 1)
        .map((tag) => `#${tag}`)

    return Array.from(new Set(normalized))
}

const buildFallbackHashtags = (text: string, brandName?: string, language?: string) => {
    const tags: string[] = []
    const brandTag = brandName ? sanitizeTag(brandName) : ''
    if (brandTag) {
        tags.push(`#${brandTag}`)
    }

    const words = (text || '')
        .toLowerCase()
        .match(/\p{L}[\p{L}\p{N}_-]*/gu) || []

    for (const word of words) {
        const clean = sanitizeTag(word)
        if (!clean || clean.length < 3) continue
        if (STOPWORDS.has(clean)) continue
        tags.push(`#${clean}`)
    }

    const fallback = FALLBACK_TAGS[language || 'es'] || FALLBACK_TAGS.es
    for (const base of fallback) {
        tags.push(`#${sanitizeTag(base)}`)
    }

    return Array.from(new Set(tags)).slice(0, 12)
}

const ensureHashtags = (hashtags: string[], sourceText: string, brandName?: string, language?: string) => {
    const normalized = normalizeHashtags(hashtags)
    if (normalized.length >= 5) return normalized.slice(0, 12)

    const fallback = buildFallbackHashtags(sourceText, brandName, language)
    const merged = Array.from(new Set([...normalized, ...fallback]))
    return merged.slice(0, 12)
}

const normalizeCopyText = (value: string) =>
    value
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()

const parseGeneratedSocialPost = (
    text: string,
    topic: string | undefined,
    brandName: string | undefined,
    detectedLanguage: string
) => {
    try {
        let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
        const match = cleanedText.match(/\{[\s\S]*\}/)
        if (match) {
            cleanedText = match[0]
        }

        const json = JSON.parse(cleanedText)
        const normalized = normalizeHashtags(json.hashtags)
        const fallbackSource = `${json.copy || json.caption || ''} ${topic || ''}`.trim()
        const hashtags = ensureHashtags(normalized, fallbackSource, brandName, detectedLanguage)

        return {
            success: true as const,
            data: {
                copy: json.copy || json.caption || text,
                hashtags
            }
        }
    } catch (error) {
        console.error('Failed to parse response as JSON. Returning raw text.', error, text)
        if (text && !text.includes('Error') && !text.includes('Invalid')) {
            return {
                success: true as const,
                data: {
                    copy: text,
                    hashtags: ensureHashtags([], `${text} ${topic || ''}`, brandName, detectedLanguage)
                }
            }
        }

        return { success: false as const, error: 'Formato de respuesta invalido de la IA' }
    }
}

export async function generateSocialPost(params: {
    brand: BrandDNA
    imageBase64?: string
    topic?: string
    userPrompt?: string
    model?: string
    previousCopy?: string
    variationKey?: string
}) {
    const { brand, imageBase64, topic, userPrompt, model, previousCopy, variationKey } = params

    console.log('--- generateSocialPost call ---')
    console.log('Brand:', brand.brand_name)
    console.log('Model:', model || 'default')
    console.log('Start generation...')

    try {
        const detectedLanguage = await detectLanguageWithApi(userPrompt || topic || '', 'es')
        const images = imageBase64 ? [imageBase64] : []
        const normalizedPreviousCopy = normalizeCopyText(previousCopy || '')
        const totalAttempts = normalizedPreviousCopy ? 3 : 1
        let lastResult:
            | { success: true; data: { copy: string; hashtags: string[] } }
            | { success: false; error: string }
            | null = null

        for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
            const prompt = buildSocialManagerPrompt(brand, topic, detectedLanguage, {
                previousCopy,
                variationKey: `${variationKey || Date.now().toString(36)}-${attempt + 1}`
            })

            const text = await generateTextUnified(
                { name: brand.brand_name || 'Brand', brand_dna: brand },
                prompt,
                model,
                images
            )

            console.log('AI Response:', text)

            const parsed = parseGeneratedSocialPost(text, topic, brand.brand_name, detectedLanguage)
            lastResult = parsed

            if (!parsed.success) {
                return parsed
            }

            if (!normalizedPreviousCopy || normalizeCopyText(parsed.data.copy) !== normalizedPreviousCopy) {
                return parsed
            }

            console.warn('Generated copy matched previous version, retrying...')
        }

        return lastResult || { success: false, error: 'No se pudo generar un nuevo copy' }
    } catch (error: unknown) {
        console.error('Error generating social post:', error)
        const message = error instanceof Error ? error.message : 'Error al generar el post'
        return { success: false, error: message }
    }
}
