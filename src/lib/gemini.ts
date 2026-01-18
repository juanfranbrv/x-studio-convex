import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BrandDNA } from './brand-types'
import { buildImagePrompt, ImageGenerationOptions } from './prompt-builder'

// Initialize Gemini clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const imageGenAI = new GoogleGenerativeAI(process.env.GEMINI_IMAGE_API_KEY!)

// Models
export const flashModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

// Default image model
const DEFAULT_IMAGE_MODEL = 'gemini-3-pro-image-preview'

// Brand-aware system prompt builder
import { buildBrandDirectorPrompt } from './prompts/system/brand-director'
export const buildBrandSystemPrompt = buildBrandDirectorPrompt

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

    // 2. Prepare Payload Parts from options
    const model = options.model || DEFAULT_IMAGE_MODEL
    console.log('\n--- 🎨 GENERATING IMAGE WITH WISDOM GATE ---')
    console.log('Model:', model)

    // Build parts array for Wisdom API
    const parts: any[] = [{ text: enhancedPrompt }]

    // Add context images if any
    if (options.context && options.context.length > 0) {
        const imageItems = options.context.filter(c => c.type === 'image' || c.type === 'logo')

        if (imageItems.length > 0) {
            console.log(`Processing ${imageItems.length} context images...`)
            // Convert urls/base64 to parts suitable for standard Gemini format
            // generateWisdomImage will handle final formatting if needed
            const imagePartsPromises = imageItems.map(async (item) => {
                if (!item.value) return null
                return await urlToPart(item.value)
            })

            const imageParts = await Promise.all(imagePartsPromises)
            imageParts.forEach(part => {
                if (part) parts.push(part)
            })
        }
    }

    // Add layout reference if any
    if (options.layoutReference) {
        let layoutUrl = options.layoutReference
        if (layoutUrl.startsWith('/')) {
            const baseUrl = typeof window !== 'undefined'
                ? window.location.origin
                : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
            layoutUrl = `${baseUrl}${layoutUrl}`
        }

        const layoutPart = await urlToPart(layoutUrl)
        if (layoutPart) {
            console.log('Layout reference added.')
            parts.push(layoutPart)
        }
    }

    // 3. Call Wisdom API
    return await generateWisdomImage(parts, model, options.aspectRatio)
}

// --- WIDOM GATE INTEGRATION ---
const WISDOM_API_KEY = process.env.WISDOM_API_KEY || ''
const WISDOM_BASE_URL = 'https://wisdom-gate.juheapi.com'

export const WISDOM_MODELS = {
    TEXT: {
        'gemini-3-pro': 'Gemini 3 Pro (Wisdom)',
        'gemini-3-flash': 'Gemini 3 Flash (Wisdom)',
        'gemini-2.5-flash': 'Gemini 2.5 Flash (Wisdom)',
    },
    IMAGE: {
        'gemini-3-pro-image-preview': 'Gemini 3 Image (Wisdom)',
        'qwen-image': 'Qwen Image',
        'seedream-4.0': 'SeeDream 4.0'
    }
}

async function generateWisdomText(prompt: string, model: string, systemPrompt?: string, images?: string[]): Promise<string> {
    try {
        console.log(`Generating Wisdom Text with model: ${model}`)

        // Construct Gemini-native payload
        const parts: any[] = []

        // Add text prompt
        // Note: For Gemini, system instructions are usually passed in a separate field 'systemInstruction' 
        // or prepended to the user prompt if the model doesn't support it strictly.
        // For simplicity and broad compatibility, we'll prepend system prompt or use the config if strictly supported.
        // However, the unified flow often combines them. Let's prepend for now to ensure context.
        let finalPrompt = prompt

        // Build contents array
        // Gemini expects: { role: 'user', parts: [...] }
        const promptParts: any[] = []

        if (images && images.length > 0) {
            console.log(`Processing ${images.length} images for text generation...`)
            for (const img of images) {
                const part = await urlToPart(img)
                if (part) promptParts.push(part)
            }
        }

        // Add text part
        promptParts.push({ text: finalPrompt })

        const contents = [{
            role: 'user',
            parts: promptParts
        }]

        // Retry logic with exponential backoff
        const maxRetries = 3
        const retryDelays = [1000, 2000, 4000]
        let lastError: Error | null = null

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[Text ${attempt + 1}/${maxRetries + 1}] Attempting Wisdom Gate API call (Native)...`)

                const requestBody: any = {
                    contents,
                    generationConfig: {
                        temperature: 0.7
                    }
                }

                // Add system instruction if provided (Gemini 1.5+ supports this)
                if (systemPrompt) {
                    requestBody.systemInstruction = {
                        parts: [{ text: systemPrompt }]
                    }
                }

                // Use the correct base URL with /v1beta as per docs
                const endpoint = `${WISDOM_BASE_URL}/v1beta/models/${model}:generateContent`

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': WISDOM_API_KEY
                    },
                    body: JSON.stringify(requestBody)
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    let errorMessage = errorText
                    try {
                        const json = JSON.parse(errorText)
                        if (json.error?.message) errorMessage = json.error.message
                    } catch (e) { }

                    const isSystemBusy = errorMessage.toLowerCase().includes('system busy') ||
                        errorMessage.toLowerCase().includes('please try again') ||
                        errorMessage.includes('503') ||
                        errorMessage.includes('429')

                    if (isSystemBusy && attempt < maxRetries) {
                        const delay = retryDelays[attempt]
                        console.warn(`[Text Attempt ${attempt + 1}] Wisdom Gate busy, retrying in ${delay}ms...`)
                        lastError = new Error(errorMessage)
                        await new Promise(resolve => setTimeout(resolve, delay))
                        continue
                    }

                    console.error(`Wisdom Text API failed: ${errorMessage}`)
                    throw new Error(errorMessage)
                }

                // Success
                console.log(`[Text Attempt ${attempt + 1}] Wisdom Gate API call succeeded`)
                const data = await response.json()

                // Extract text from Gemini response candidates
                // data.candidates[0].content.parts[0].text
                const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || ''
                return text

            } catch (error) {
                if (attempt === maxRetries) throw error
                lastError = error as Error
            }
        }

        throw lastError || new Error('Unknown error during Wisdom Gate text API call')

    } catch (error) {
        console.error('Wisdom Gate Text Generation Error:', error)
        throw error
    }
}

async function generateWisdomImage(parts: any[], model: string, aspectRatio?: string): Promise<string> {
    try {
        console.log(`Generating Wisdom Image with model: ${model}`)
        console.log(`Payload parts: ${parts.length}`)

        // UNIFIED LOGIC: ALWAYS Use Wisdom/Google Native Endpoint for ALL models
        // This ensures context images (logos, references) are passed correctly.

        // Map Aspect Ratio to Google format if needed (though app uses 16:9, 1:1 which match)
        // Map Aspect Ratio to Google format if needed
        // Valid ratios per documentation: 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
        const validRatios = ['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']
        let targetRatio = '1:1'

        if (aspectRatio) {
            if (validRatios.includes(aspectRatio)) {
                targetRatio = aspectRatio
            } else {
                // Map custom social ratios to closest supported
                switch (aspectRatio) {
                    case '1.91:1': // Facebook/Twitter Horizontal (1.91)
                        targetRatio = '16:9' // Closest (1.77) - 21:9 (2.33) is too wide
                        break
                    case '1.2:1':  // LinkedIn (1.2)
                        targetRatio = '5:4'  // Closest (1.25) - matches better than 1:1
                        break
                    default:
                        targetRatio = '1:1'
                }
                console.log(`Mapping custom ratio ${aspectRatio} to supported ${targetRatio}`)
            }
        }

        // Retry logic with exponential backoff for "System busy" errors
        const maxRetries = 3
        const retryDelays = [1000, 2000, 4000] // 1s, 2s, 4s
        let lastError: Error | null = null

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[${attempt + 1}/${maxRetries + 1}] Attempting Wisdom Gate API call...`)

                const response = await fetch(`${WISDOM_BASE_URL}/v1beta/models/${model}:generateContent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': WISDOM_API_KEY
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: parts
                        }],
                        generationConfig: {
                            responseModalities: ["IMAGE"],
                            imageConfig: {
                                aspectRatio: targetRatio,
                                imageSize: "1K"
                            }
                        }
                    })
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    let errorMessage = errorText
                    try {
                        const json = JSON.parse(errorText)
                        if (json.error?.message) errorMessage = json.error.message
                    } catch (e) { }

                    // Check if it's a "System busy" error that we should retry
                    const isSystemBusy = errorMessage.toLowerCase().includes('system busy') ||
                        errorMessage.toLowerCase().includes('please try again')

                    if (isSystemBusy && attempt < maxRetries) {
                        const delay = retryDelays[attempt]
                        console.warn(`[${attempt + 1}/${maxRetries + 1}] Wisdom Gate busy, retrying in ${delay}ms...`)
                        lastError = new Error(errorMessage)
                        await new Promise(resolve => setTimeout(resolve, delay))
                        continue // Retry
                    }

                    // Non-retryable error or max retries reached
                    console.error(`Wisdom Image API failed: ${errorMessage}`)
                    throw new Error(errorMessage)
                }

                // Success - return the response data
                console.log(`[${attempt + 1}/${maxRetries + 1}] Wisdom Gate API call succeeded`)
                const data = await response.json()

                // Extract image from Google-style response
                const candidate = data.candidates?.[0]
                if (candidate) {
                    for (const part of candidate.content?.parts || []) {
                        if (part.inlineData && part.inlineData.data) {
                            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`
                        }
                    }
                }

                // No image found in response
                throw new Error('No image found in Wisdom response')

            } catch (error) {
                if (attempt === maxRetries) {
                    // All retries exhausted
                    throw error
                }
                // Store error and continue to next retry
                lastError = error as Error
            }
        }

        throw lastError || new Error('Unknown error during Wisdom Gate API call')

    } catch (error) {
        console.error('Wisdom Gate Image Generation Error:', error)
        throw error
    }
}

// Unified Generator Function
export async function generateTextUnified(
    brand: { name: string; brand_dna: BrandDNA },
    prompt: string,
    model: string = 'gemini-flash-latest', // Default to native Google
    images?: string[],
    systemPromptOverride?: string // NEW: Allow specialized tasks to set their own persona
): Promise<string> {
    const systemPrompt = typeof systemPromptOverride === 'string' ? systemPromptOverride : buildBrandSystemPrompt(brand)

    if (model.startsWith('wisdom/')) {
        const wisdomModel = model.replace('wisdom/', '')
        return await generateWisdomText(prompt, wisdomModel, systemPrompt, images)
    }

    // Default to Google
    const parts: any[] = [{ text: `${systemPrompt}\n\nSOLICITUD DEL USUARIO:\n${prompt}` }]

    if (images && images.length > 0) {
        images.forEach(img => {
            // Handle base64
            const base64Data = img.includes('base64,') ? img.split('base64,')[1] : img
            parts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/png'
                }
            })
        })
    }

    const result = await flashModel.generateContent({
        contents: [
            {
                role: 'user',
                parts
            }
        ],
        generationConfig: { responseMimeType: "application/json" }
    })
    return result.response.text()
}

// Exposed wrapper for Image Generation
export async function generateContentImageUnified(
    brand: { name: string; brand_dna: BrandDNA },
    prompt: string,
    options: ImageGenerationOptions = {}
): Promise<string> {
    const modelName = options.model || DEFAULT_IMAGE_MODEL

    if (modelName.startsWith('wisdom/')) {
        let wisdomModel = modelName.replace('wisdom/', '')

        // Failsafe: Map known incorrect model names to valid ones
        if (wisdomModel === 'gemini-3.0-pro-image-01-preview') {
            console.warn('⚠️ Correcting invalid model name: gemini-3.0-pro-image-01-preview -> gemini-3-pro-image-preview')
            wisdomModel = 'gemini-3-pro-image-preview'
        }
        const enhancedPrompt = buildImagePrompt(brand, prompt, options)

        // Prepare parts similar to generateBrandImage to ensure parity
        const promptParts: any[] = [{ text: enhancedPrompt }]

        // Process Context Images/Logos (Fetch & convert to Base64)
        if (options.context && options.context.length > 0) {
            const imageItems = options.context.filter(c => c.type === 'image' || c.type === 'logo')

            if (imageItems.length > 0) {
                console.log(`Processing ${imageItems.length} context images for Wisdom...`)
                const imagePartsPromises = imageItems.map(async (item) => {
                    if (!item.value) return null
                    // Use existing urlToPart helper
                    return await urlToPart(item.value)
                })

                const imageParts = await Promise.all(imagePartsPromises)
                imageParts.forEach(part => {
                    if (part) promptParts.push(part)
                })
            }
        }

        // Process Layout Reference
        if (options.layoutReference) {
            // Handle relative paths for local templates
            let layoutUrl = options.layoutReference
            if (layoutUrl.startsWith('/')) {
                const baseUrl = typeof window !== 'undefined'
                    ? window.location.origin
                    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
                layoutUrl = `${baseUrl}${layoutUrl}`
            }

            const layoutPart = await urlToPart(layoutUrl)
            if (layoutPart) {
                console.log('Layout reference image added to Wisdom parts.')
                promptParts.push(layoutPart)
            }
        }

        return await generateWisdomImage(promptParts, wisdomModel, options.aspectRatio)
    }

    // Fallback to existing Google Implementation
    return await generateBrandImage(brand, prompt, options)
}
