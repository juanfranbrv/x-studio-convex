import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BrandDNA } from './supabase'

// Initialize Gemini clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const imageGenAI = new GoogleGenerativeAI(process.env.GEMINI_IMAGE_API_KEY!)

// Models
export const flashModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })
export const imageModel = imageGenAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' })

// Brand-aware system prompt builder
export function buildBrandSystemPrompt(brand: { name: string; brand_dna: BrandDNA }): string {
    const { name, brand_dna } = brand
    const { colors, tone, fonts } = brand_dna

    return `Eres un director creativo experto trabajando para la marca "${name}".

DIRECTRICES DE MARCA OBLIGATORIAS:
- Paleta de colores: ${colors.length > 0 ? colors.join(', ') : 'Sin definir'}
- Tono de comunicación: ${tone}
- Tipografía principal: ${fonts.heading || 'Sin definir'}
- Tipografía secundaria: ${fonts.body || 'Sin definir'}

REGLAS DE DISEÑO:
1. Siempre incorpora sutilmente la identidad de marca
2. Los colores primarios deben ser dominantes
3. Mantén coherencia con el tono de marca
4. Evita elementos que contradigan la personalidad de marca

Responde siempre en español.`
}

// Generate marketing copy with brand context
export async function generateMarketingCopy(
    brand: { name: string; brand_dna: BrandDNA },
    prompt: string
): Promise<string> {
    const systemPrompt = buildBrandSystemPrompt(brand)

    const result = await flashModel.generateContent({
        contents: [
            {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nSOLICITUD DEL USUARIO:\n${prompt}` }]
            }
        ]
    })

    return result.response.text()
}

// Generate image with brand context
export async function generateBrandImage(
    brand: { name: string; brand_dna: BrandDNA },
    userPrompt: string,
    options: {
        headline?: string
        cta?: string
        platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
    } = {}
): Promise<string> {
    const { colors, tone } = brand.brand_dna

    // Build enhanced prompt with brand context
    const enhancedPrompt = `
Crear una imagen de marketing para la marca "${brand.name}".

COLORES DE MARCA: ${colors.join(', ')}
TONO: ${tone}
${options.headline ? `TITULAR: "${options.headline}"` : ''}
${options.cta ? `CTA: "${options.cta}"` : ''}
${options.platform ? `FORMATO: Optimizado para ${options.platform}` : ''}

PROMPT DEL USUARIO:
${userPrompt}

IMPORTANTE: La imagen debe reflejar la identidad visual de la marca.
`

    const result = await imageModel.generateContent({
        contents: [
            {
                role: 'user',
                parts: [{ text: enhancedPrompt }]
            }
        ],
        generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
        } as never
    })

    // Extract image from response
    const response = result.response
    const parts = response.candidates?.[0]?.content?.parts || []

    for (const part of parts) {
        if ('inlineData' in part && part.inlineData) {
            const { mimeType, data } = part.inlineData
            return `data:${mimeType};base64,${data}`
        }
    }

    throw new Error('No se pudo generar la imagen')
}
