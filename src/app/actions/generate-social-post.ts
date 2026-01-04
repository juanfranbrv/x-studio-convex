'use server'

import { BrandDNA } from '@/lib/brand-types'
import { generateTextUnified } from '@/lib/gemini'
import { buildSocialManagerPrompt } from '@/lib/prompts/actions/social-manager'

export async function generateSocialPost(params: {
    brand: BrandDNA
    imageBase64?: string
    topic?: string
    model?: string
}) {
    const { brand, imageBase64, topic, model } = params

    console.log('--- generateSocialPost call ---')
    console.log('Brand:', brand.brand_name)
    console.log('Model:', model || 'default')
    console.log('Start generation...')

    try {
        // 1. Construct Prompt
        const prompt = buildSocialManagerPrompt(brand, topic)

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
            return {
                success: true,
                data: {
                    copy: json.copy || json.caption || text, // Fallback keys
                    hashtags: json.hashtags || []
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
                        hashtags: []
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
