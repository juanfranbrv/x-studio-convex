import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BrandDNA } from './brand-types'
import { buildImagePrompt, ImageGenerationOptions } from './prompt-builder'

// Initialize Gemini clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const imageGenAI = new GoogleGenerativeAI(process.env.GEMINI_IMAGE_API_KEY!)

// Models
export const flashModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

// Default image model
const DEFAULT_IMAGE_MODEL = 'models/gemini-2.5-flash-image'

// Brand-aware system prompt builder
export function buildBrandSystemPrompt(brand: { name: string; brand_dna: BrandDNA }): string {
    const { name, brand_dna } = brand
    const { colors, tone_of_voice, fonts } = brand_dna

    // Adapt legacy property access to new array structure
    const tone = tone_of_voice?.join(', ') || 'Sin definir'
    const headingFont = fonts?.[0] || 'Sin definir'
    const bodyFont = fonts?.[1] || 'Sin definir'

    return `Eres un director creativo experto trabajando para la marca "${name}".

DIRECTRICES DE MARCA OBLIGATORIAS:
- Paleta de colores: ${colors.map(c => c.color).join(', ') || 'Sin definir'}
- Tono de comunicación: ${tone}
- Tipografía principal: ${headingFont}
- Tipografía secundaria: ${bodyFont}

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

// Helper to fetch image and convert to Gemini Part
async function urlToPart(url: string): Promise<{ inlineData: { data: string; mimeType: string } } | null> {
    try {
        // Handle Data URLs (Base64) immediately without fetching
        if (url.startsWith('data:')) {
            const base64Index = url.indexOf(';base64,')
            if (base64Index === -1) throw new Error('Invalid Data URL: missing ;base64,')

            const base64 = url.substring(base64Index + 8)
            const mimeType = url.substring(5, base64Index)

            return {
                inlineData: {
                    data: base64,
                    mimeType
                }
            }
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64 = buffer.toString('base64')
        const mimeType = response.headers.get('content-type') || 'image/png'

        return {
            inlineData: {
                data: base64,
                mimeType
            }
        }
    } catch (error) {
        console.error('Error processing context image:', error)
        return null
    }
}


// Generate image with brand context
export async function generateBrandImage(
    brand: { name: string; brand_dna: BrandDNA },
    userPrompt: string,
    options: ImageGenerationOptions = {}
): Promise<string> {

    // 1. Build text prompt
    const enhancedPrompt = buildImagePrompt(brand, userPrompt, options)

    // 2. Select model (dynamic or default)
    const modelName = options.model || DEFAULT_IMAGE_MODEL
    const activeImageModel = imageGenAI.getGenerativeModel({ model: modelName })

    console.log('\n--- 🎨 GENERATING IMAGE ---')
    console.log('Model:', modelName)
    console.log('Prompt Length:', enhancedPrompt.length)

    // 3. Prepare Payload Parts (Text + Images)
    const promptParts: any[] = [{ text: enhancedPrompt }]

    // 4. Process Context Images/Logos (Fetch & convert to Base64)
    if (options.context && options.context.length > 0) {
        const imageItems = options.context.filter(c => c.type === 'image' || c.type === 'logo')

        if (imageItems.length > 0) {
            console.log(`Processing ${imageItems.length} context images...`)

            // Process in parallel
            const imagePartsPromises = imageItems.map(async (item) => {
                if (!item.value) return null
                console.log(`Fetching image: ${item.label || 'Reference'}`)
                return await urlToPart(item.value)
            })

            const imageParts = await Promise.all(imagePartsPromises)

            // Add valid images to parts
            imageParts.forEach(part => {
                if (part) promptParts.push(part)
            })
        }
    }

    // 5. Process Layout Reference (Phantom Template)
    if (options.layoutReference) {
        console.log(`Processing layout reference: ${options.layoutReference}`)

        // Handle relative paths for local templates
        let layoutUrl = options.layoutReference
        if (layoutUrl.startsWith('/')) {
            // Use local origin if available, or fallback to localhost
            const baseUrl = typeof window !== 'undefined'
                ? window.location.origin
                : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
            layoutUrl = `${baseUrl}${layoutUrl}`
        }

        const layoutPart = await urlToPart(layoutUrl)
        if (layoutPart) {
            console.log('Layout reference image [REF_PLANTILLA_ESTRUCTURAL] added to prompt parts.')
            promptParts.push(layoutPart)
        }
    }

    console.log(`Sending payload with ${promptParts.length} parts to Gemini...`)

    const result = await activeImageModel.generateContent({
        contents: [
            {
                role: 'user',
                parts: promptParts
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
