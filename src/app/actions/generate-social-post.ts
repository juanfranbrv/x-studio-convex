'use server'

import { BrandDNA } from '@/lib/brand-types'
import { generateTextUnified } from '@/lib/gemini'
import { buildSocialManagerPrompt } from '@/lib/prompts/actions/social-manager'
import { detectLanguage } from '@/lib/language-detection'

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

export async function generateSocialPost(params: {
    brand: BrandDNA
    imageBase64?: string
    topic?: string
    userPrompt?: string
    model?: string
}) {
    const { brand, imageBase64, topic, userPrompt, model } = params

    console.log('--- generateSocialPost call ---')
    console.log('Brand:', brand.brand_name)
    console.log('Model:', model || 'default')
    console.log('Start generation...')

    try {
        // 1. Construct Prompt
        const detectedLanguage = detectLanguage(userPrompt || topic || '') || 'es'
        const prompt = buildSocialManagerPrompt(brand, topic, detectedLanguage)

        // 2. Prepare Images
        const images = imageBase64 ? [imageBase64] : []

        // 3. Generate using Unified function (handles Google vs Wisdom)
        const text = await generateTextUnified(
            { name: brand.brand_name || 'Brand', brand_dna: brand },
            prompt,
            model,
            images
        )

        console.log('AI Response:', text)

        try {
            // Clean markdown tokens if present (```json ... ```)
            // Enhanced cleaning to handle potential leading/trailing non-json chars
            let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
            const match = cleanedText.match(/\{[\s\S]*\}/)
            if (match) {
                cleanedText = match[0]
            }

            const json = JSON.parse(cleanedText)
            const normalizedHashtags = normalizeHashtags(json.hashtags)
            const fallbackSource = `${json.copy || json.caption || ''} ${topic || ''}`.trim()
            const ensuredHashtags = ensureHashtags(normalizedHashtags, fallbackSource, brand.brand_name, detectedLanguage)
            return {
                success: true,
                data: {
                    copy: json.copy || json.caption || text, // Fallback keys
                    hashtags: ensuredHashtags
                }
            }
        } catch (e) {
            console.error('Failed to parse response as JSON. Returning raw text.', e, text)
            // Fallback: return raw text if it's not a server error message
            if (text && !text.includes('Error') && !text.includes('Invalid')) {
                return {
                    success: true,
                    data: {
                        copy: text,
                        hashtags: ensureHashtags([], `${text} ${topic || ''}`, brand.brand_name, detectedLanguage)
                    }
                }
            }
            return { success: false, error: 'Formato de respuesta inválido de la IA' }
        }

    } catch (error: any) {
        console.error('Error generating social post:', error)
        return { success: false, error: error.message || 'Error al generar el post' }
    }
}
