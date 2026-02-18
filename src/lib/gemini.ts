import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BrandDNA } from './brand-types'
import { buildImagePrompt, ImageGenerationOptions } from './prompt-builder'
import { log } from './logger'

// Initialize Gemini clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const imageGenAI = new GoogleGenerativeAI(process.env.GEMINI_IMAGE_API_KEY!)

// Models
export const flashModel = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

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
    log.info('IMAGE', `Start | Model=${model}`)

    // Build parts array for Wisdom API
    const parts: any[] = [{ text: enhancedPrompt }]

    // Add context images if any
    if (options.context && options.context.length > 0) {
        const imageItems = options.context.filter(
            c => c.type === 'image' || c.type === 'logo' || c.type === 'aux_logo'
        )

        if (imageItems.length > 0) {
            log.info('IMAGE', `Context images: ${imageItems.length}`)
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
            log.info('IMAGE', 'Layout reference added')
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
        'gemini-3-pro-preview': 'Gemini 3 Pro (Wisdom)',
        'gemini-3-flash-preview': 'Gemini 3 Flash (Wisdom)',
        'gemini-2.5-flash': 'Gemini 2.5 Flash (Wisdom)',
    },
    IMAGE: {
        'gemini-3-pro-image-preview': 'Gemini 3 Image (Wisdom)',
        'qwen-image': 'Qwen Image (Alibaba)',
        'kolors': 'Kolors (Kwai)',
        'wanx-v1': 'Wanx (Alibaba)',
        'seedream-4.0': 'SeeDream 4.0'
    }
}

// Helper to map aspect ratios to OpenAI-compatible sizes
function getOpenAISize(aspectRatio?: string): string {
    // Default to square
    if (!aspectRatio) return "1024x1024"

    switch (aspectRatio) {
        case '16:9': return "1024x1024" // specific scaling might be needed, but 1024x1024 is safe default or 1792x1024 if supported
        case '9:16': return "1024x1792"
        case '1:1': return "1024x1024"
        case '4:3': return "1024x1024"
        case '3:4': return "1024x1024"
        // Add more specific resolutions if the underlying models support exactly 1280x720 etc.
        // For now, these models often default to 1024x1024 if size isn't strictly standard 
        default: return "1024x1024"
    }
}

async function generateWisdomChatImage(prompt: string, model: string): Promise<string> {
    try {
        log.info('IMAGE', `Chat image generation: ${model}`)
        const response = await fetch(`${WISDOM_BASE_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WISDOM_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }], // Just prompt, or "Draw: " + prompt
                stream: false
            })
        })

        if (!response.ok) {
            const err = await response.text()
            throw new Error(`Wisdom Chat API Error: ${err}`)
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) throw new Error('No content in chat response')

        // Try to parse JSON content (common for some Chinese models like Seedream/Qwen)
        try {
            if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
                const parsed = JSON.parse(content)
                const url = Array.isArray(parsed) ? parsed[0]?.url : parsed?.url
                if (url) {
                    log.success('IMAGE', 'Extracted image URL from JSON', { url })
                    return url
                }
            }
        } catch (e) {
            console.warn('Failed to parse chat content as JSON, falling back to regex', e)
        }

        // Try to find Markdown image URL ![alt](url) or just (url)
        log.debug('IMAGE', 'Chat response content (truncated)', content.substring(0, 200))

        const urlMatch = content.match(/\((https?:\/\/[^\s\)"']+)\)/) || content.match(/(https?:\/\/[^\s\)"']+)/)

        if (urlMatch) {
            log.success('IMAGE', 'Extracted image URL from chat', { url: urlMatch[1] })
            return urlMatch[1]
        }

        throw new Error('No image URL found in chat response. Response was text only.')

    } catch (error) {
        log.error('IMAGE', 'Chat image generation error', error)
        throw error
    }
}

async function generateWisdomOpenAIImage(prompt: string, model: string, aspectRatio?: string): Promise<string> {
    try {
        // SPECIAL ROUTING FOR CHAT-BASED IMAGE MODELS (Qwen, Wanx, Kolors, Seedream)
        // These models often use the Chat Completion endpoint or return JSON in chat
        if (model.includes('qwen-image') || model.includes('wanx') || model.includes('kolors') || model.includes('seedream')) {
            return await generateWisdomChatImage(prompt, model)
        }

        log.info('IMAGE', `OpenAI-compatible image model: ${model}`)
        log.debug('IMAGE', `Endpoint: ${WISDOM_BASE_URL}/v1/images/generations`)

        const size = getOpenAISize(aspectRatio)

        const requestBody = {
            model: model,
            prompt: prompt,
            n: 1,
            size: size,
            response_format: "b64_json"
        }

        // Wisdom Gate OpenAI-compatible endpoint
        const endpoint = `${WISDOM_BASE_URL}/v1/images/generations`

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WISDOM_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const errorText = await response.text()
            log.error('IMAGE', 'OpenAI image API failed', errorText)
            throw new Error(`Wisdom Gate Error: ${errorText}`)
        }

        const data = await response.json()

        if (data.data && data.data[0] && data.data[0].b64_json) {
            return `data:image/png;base64,${data.data[0].b64_json}`
        }

        if (data.data && data.data[0] && data.data[0].url) {
            // If a URL is returned, we might need to fetch it to convert to base64 if consistency is needed,
            // but returning the URL is often fine if the frontend handles it. 
            // However, app expects base64 or accessible URL.
            return data.data[0].url
        }

        throw new Error('No image data found in Wisdom response')

    } catch (error) {
        log.error('IMAGE', 'OpenAI image error', error)
        throw error
    }
}

export interface TextGenerationOptions {
    temperature?: number
    topP?: number
}

async function generateWisdomText(
    prompt: string,
    model: string,
    systemPrompt?: string,
    images?: string[],
    options?: TextGenerationOptions
): Promise<string> {
    try {
        log.info('TEXT', `Generating with model: ${model}`)

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
            log.info('TEXT', `Processing ${images.length} images for text generation`)
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
                log.info('TEXT', `[${attempt + 1}/${maxRetries + 1}] Attempting Wisdom Gate API call (Native)`)

                const requestBody: any = {
                    contents,
                    generationConfig: {
                        temperature: options?.temperature ?? 0.7,
                        ...(typeof options?.topP === 'number' ? { topP: options.topP } : {}),
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
                        log.warn('TEXT', `[Attempt ${attempt + 1}] Wisdom Gate busy, retrying in ${delay}ms`)
                        lastError = new Error(errorMessage)
                        await new Promise(resolve => setTimeout(resolve, delay))
                        continue
                    }

                    log.error('TEXT', 'Text API failed', errorMessage)
                    throw new Error(errorMessage)
                }

                // Success
                log.success('TEXT', `[Attempt ${attempt + 1}] Wisdom Gate API call succeeded`)
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
        log.error('TEXT', 'Text generation error', error)
        throw error
    }
}

async function generateWisdomImage(parts: any[], model: string, aspectRatio?: string): Promise<string> {
    try {
        log.info('IMAGE', `Generating with model: ${model}`)
        log.debug('IMAGE', `Payload parts: ${parts.length}`)

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
                log.warn('IMAGE', `Mapping custom ratio ${aspectRatio} to supported ${targetRatio}`)
            }
        }

        // Retry logic with exponential backoff for "System busy" errors
        const maxRetries = 3
        const retryDelays = [1000, 2000, 4000] // 1s, 2s, 4s
        let lastError: Error | null = null

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                log.info('IMAGE', `[${attempt + 1}/${maxRetries + 1}] Attempting Wisdom Gate API call`)

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
                        log.warn('IMAGE', `[${attempt + 1}/${maxRetries + 1}] Wisdom Gate busy, retrying in ${delay}ms`)
                        lastError = new Error(errorMessage)
                        await new Promise(resolve => setTimeout(resolve, delay))
                        continue // Retry
                    }

                    // Non-retryable error or max retries reached
                    log.error('IMAGE', 'Image API failed', errorMessage)
                    throw new Error(errorMessage)
                }

                // Success - return the response data
                log.success('IMAGE', `[${attempt + 1}/${maxRetries + 1}] Wisdom Gate API call succeeded`)
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
        log.error('IMAGE', 'Image generation error', error)
        throw error
    }
}

async function generateGoogleImage(parts: any[], model: string, aspectRatio?: string): Promise<string> {
    try {
        if (!process.env.GEMINI_IMAGE_API_KEY) {
            throw new Error('Missing GEMINI_IMAGE_API_KEY for Google image generation')
        }

        const validRatios = ['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']
        let targetRatio = '1:1'

        if (aspectRatio) {
            if (validRatios.includes(aspectRatio)) {
                targetRatio = aspectRatio
            } else {
                switch (aspectRatio) {
                    case '1.91:1':
                        targetRatio = '16:9'
                        break
                    case '1.2:1':
                        targetRatio = '5:4'
                        break
                    default:
                        targetRatio = '1:1'
                }
            }
        }

        // Keep backward compatibility for legacy admin values.
        const normalizedModel = model === 'gemini-3-pro' ? 'gemini-3-pro-image-preview' : model
        const imageModel = imageGenAI.getGenerativeModel({ model: normalizedModel })

        const response = await imageModel.generateContent({
            contents: [{ role: 'user', parts }],
            generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: {
                    aspectRatio: targetRatio,
                    imageSize: '1K'
                }
            }
        } as any)

        const candidate = response?.response?.candidates?.[0]
        if (candidate) {
            for (const part of candidate.content?.parts || []) {
                if (part.inlineData?.data) {
                    return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`
                }
            }
        }

        throw new Error('No image found in Google image response')
    } catch (error) {
        console.error('Google Image Generation Error:', error)
        throw error
    }
}

// Unified Generator Function
export async function generateTextUnified(
    brand: { name: string; brand_dna: BrandDNA },
    prompt: string,
    model: string = 'gemini-3-flash-preview', // Default to native Google
    images?: string[],
    systemPromptOverride?: string, // NEW: Allow specialized tasks to set their own persona
    options?: TextGenerationOptions
): Promise<string> {
    const systemPrompt = typeof systemPromptOverride === 'string' ? systemPromptOverride : buildBrandSystemPrompt(brand)
    const modelName = String(model || '').trim()
    const modelNameLower = modelName.toLowerCase()

    if (modelNameLower.startsWith('wisdom/')) {
        const wisdomModel = modelName.replace(/^wisdom\//i, '')
        return await generateWisdomText(prompt, wisdomModel, systemPrompt, images, options)
    }

    // Default to Google
    const selectedModel = genAI.getGenerativeModel({ model: modelName })
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

    const result = await selectedModel.generateContent({
        contents: [
            {
                role: 'user',
                parts
            }
        ],
        generationConfig: {
            responseMimeType: "application/json",
            ...(typeof options?.temperature === 'number' ? { temperature: options.temperature } : {}),
            ...(typeof options?.topP === 'number' ? { topP: options.topP } : {}),
        }
    })
    return result.response.text()
}

// Exposed wrapper for Image Generation
export async function generateContentImageUnified(
    brand: { name: string; brand_dna: BrandDNA },
    prompt: string,
    options: ImageGenerationOptions = {}
): Promise<string> {
    const generationStart = Date.now()
    const rawModelName = options.model || DEFAULT_IMAGE_MODEL
    const modelName = String(rawModelName).trim()
    const modelNameLower = modelName.toLowerCase()
    log.info('IMAGE', `Router | Requested=${modelName || 'NO_CONFIG'}`)

    if (modelNameLower.startsWith('wisdom/')) {
        log.info('IMAGE', `Provider route: wisdom (${modelName})`)
        let wisdomModel = modelName.replace('wisdom/', '')

        // Failsafe: Map known incorrect model names to valid ones
        if (wisdomModel === 'gemini-3.0-pro-image-01-preview') {
            log.warn('IMAGE', 'Correcting invalid model name: gemini-3.0-pro-image-01-preview -> gemini-3-pro-image-preview')
            wisdomModel = 'gemini-3-pro-image-preview'
        }
        const enhancedPrompt = options.promptAlreadyBuilt
            ? prompt
            : buildImagePrompt(brand, prompt, options)

        // Prepare parts similar to generateBrandImage to ensure parity
        const promptParts: any[] = [{ text: enhancedPrompt }]

        // Process Context Images/Logos (Fetch & convert to Base64)
        if (options.context && options.context.length > 0) {
            const imageItems = options.context.filter(
                c => c.type === 'image' || c.type === 'logo' || c.type === 'aux_logo'
            )

            if (imageItems.length > 0) {
                log.info('IMAGE', `Context images: ${imageItems.length}`)
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
                log.info('IMAGE', 'Layout reference added')
                promptParts.push(layoutPart)
            }
        }

        if (wisdomModel === 'gemini-3-pro-image-preview' || wisdomModel.includes('gemini')) {
            const result = await generateWisdomImage(promptParts, wisdomModel, options.aspectRatio)
            log.success('IMAGE', `Generation done in ${Date.now() - generationStart}ms`)
            return result
        } else {
            // For Qwen, Kolors, Wanx, etc., use the OpenAI-compatible endpoint
            // Note: Context images might not be supported easily in standard OpenAI text-to-image payload 
            // without using specific image-to-image endpoints. 
            // For now, we pass just the prompt for these models as they are primarily text-to-image in this flow.
            const result = await generateWisdomOpenAIImage(enhancedPrompt, wisdomModel, options.aspectRatio)
            log.success('IMAGE', `Generation done in ${Date.now() - generationStart}ms`)
            return result
        }
    }

    if (modelNameLower.startsWith('google/')) {
        log.info('IMAGE', `Provider route: google (${modelName})`)
        const googleModelRaw = modelName.replace('google/', '')
        const enhancedPrompt = options.promptAlreadyBuilt
            ? prompt
            : buildImagePrompt(brand, prompt, options)
        const promptParts: any[] = [{ text: enhancedPrompt }]

        if (options.context && options.context.length > 0) {
            const imageItems = options.context.filter(
                c => c.type === 'image' || c.type === 'logo' || c.type === 'aux_logo'
            )
            if (imageItems.length > 0) {
                const imagePartsPromises = imageItems.map(async (item) => {
                    if (!item.value) return null
                    return await urlToPart(item.value)
                })
                const imageParts = await Promise.all(imagePartsPromises)
                imageParts.forEach(part => {
                    if (part) promptParts.push(part)
                })
            }
        }

        if (options.layoutReference) {
            let layoutUrl = options.layoutReference
            if (layoutUrl.startsWith('/')) {
                const baseUrl = typeof window !== 'undefined'
                    ? window.location.origin
                    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
                layoutUrl = `${baseUrl}${layoutUrl}`
            }
            const layoutPart = await urlToPart(layoutUrl)
            if (layoutPart) promptParts.push(layoutPart)
        }

        const result = await generateGoogleImage(promptParts, googleModelRaw, options.aspectRatio)
        log.success('IMAGE', `Generation done in ${Date.now() - generationStart}ms`)
        return result
    }

    throw new Error(`Image model provider no soportado o inválido: "${modelName}"`)
}

// Raw prompt image generation without brand prompt injection
export async function generateImageFromPromptRaw(
    prompt: string,
    model: string,
    aspectRatio?: string
): Promise<string> {
    if (!model) {
        throw new Error('Missing image model')
    }

    const normalized = model.startsWith('wisdom/') ? model.replace('wisdom/', '') : model
    const parts: any[] = [{ text: prompt }]

    return await generateWisdomImage(parts, normalized, aspectRatio)
}

// =============================================================================
// VIDEO GENERATION (Veo 3.1 via Wisdom Gate)
// =============================================================================

export interface VideoGenerationOptions {
    prompt: string
    negativePrompt?: string
    startFrame?: string // Base64 or URL
    endFrame?: string   // Base64 or URL
    aspectRatio?: '16:9' | '9:16'
    resolution?: '720p' | '1080p'
    durationSeconds?: 4 | 6 | 8
    personGeneration?: 'allow_all' | 'allow_adult' | 'dont_allow'
}

export interface VideoGenerationResult {
    videoUrl: string
    operationName?: string
}

/**
 * Generate video using Veo 3.1 via Wisdom Gate
 * Supports text-to-video and image-to-video (start/end frames)
 */
export async function generateVideoUnified(
    options: VideoGenerationOptions
): Promise<VideoGenerationResult> {
    const model = 'veo-3.1'

    console.log('\n--- 🎬 GENERATING VIDEO WITH VEO 3.1 ---')
    console.log('Prompt:', options.prompt.substring(0, 100) + '...')
    console.log('Aspect Ratio:', options.aspectRatio || '16:9')
    console.log('Resolution:', options.resolution || '720p')
    console.log('Duration:', options.durationSeconds || 4, 'seconds')

    // Build request payload
    const instances: any = [{
        prompt: options.prompt
    }]

    // Add negative prompt if provided
    if (options.negativePrompt) {
        instances[0].negativePrompt = options.negativePrompt
    }

    // Add start frame (first frame) if provided
    if (options.startFrame) {
        const startPart = await urlToPart(options.startFrame)
        if (startPart) {
            instances[0].image = {
                inlineData: startPart.inlineData
            }
        }
    }

    // Add end frame (last frame) if provided
    if (options.endFrame) {
        const endPart = await urlToPart(options.endFrame)
        if (endPart) {
            instances[0].lastFrame = {
                image: {
                    inlineData: endPart.inlineData
                }
            }
        }
    }

    // Build parameters
    const parameters: any = {
        aspectRatio: options.aspectRatio || '16:9',
        resolution: options.resolution || '720p',
        durationSeconds: String(options.durationSeconds || 4),
    }

    if (options.personGeneration) {
        parameters.personGeneration = options.personGeneration
    }

    const requestBody = {
        instances,
        parameters
    }

    try {
        // Start the video generation (async operation)
        console.log('🚀 Starting video generation...')
        const startResponse = await fetch(`${WISDOM_BASE_URL}/v1beta/models/${model}:predictLongRunning`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': WISDOM_API_KEY
            },
            body: JSON.stringify(requestBody)
        })

        if (!startResponse.ok) {
            const errorText = await startResponse.text()
            console.error('Video generation start failed:', errorText)
            throw new Error(`Video generation failed: ${errorText}`)
        }

        const startData = await startResponse.json()
        const operationName = startData.name

        if (!operationName) {
            throw new Error('No operation name returned from video generation')
        }

        console.log('⏳ Operation started:', operationName)

        // Poll for completion
        const maxPolls = 60 // 10 minutes max (10s * 60)
        let pollCount = 0

        while (pollCount < maxPolls) {
            await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
            pollCount++

            console.log(`📊 Polling status (${pollCount}/${maxPolls})...`)

            const statusResponse = await fetch(`${WISDOM_BASE_URL}/v1beta/${operationName}`, {
                method: 'GET',
                headers: {
                    'x-goog-api-key': WISDOM_API_KEY
                }
            })

            if (!statusResponse.ok) {
                console.warn('Status check failed, retrying...')
                continue
            }

            const statusData = await statusResponse.json()

            if (statusData.done) {
                console.log('✅ Video generation complete!')

                // Extract video URL from response
                const videoUri = statusData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
                    || statusData.response?.generatedVideos?.[0]?.video?.uri

                if (!videoUri) {
                    console.error('Response structure:', JSON.stringify(statusData, null, 2))
                    throw new Error('No video URI in completed response')
                }

                return {
                    videoUrl: videoUri,
                    operationName
                }
            }

            // Check for error
            if (statusData.error) {
                throw new Error(`Video generation error: ${statusData.error.message || JSON.stringify(statusData.error)}`)
            }
        }

        throw new Error('Video generation timed out after 10 minutes')

    } catch (error) {
        console.error('Video Generation Error:', error)
        throw error
    }
}

/**
 * Check the status of a video generation operation
 */
export async function checkVideoOperationStatus(operationName: string): Promise<{
    done: boolean
    videoUrl?: string
    error?: string
    progress?: number
}> {
    try {
        const response = await fetch(`${WISDOM_BASE_URL}/v1beta/${operationName}`, {
            method: 'GET',
            headers: {
                'x-goog-api-key': WISDOM_API_KEY
            }
        })

        if (!response.ok) {
            const errorText = await response.text()
            return { done: false, error: errorText }
        }

        const data = await response.json()

        if (data.done) {
            const videoUri = data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
                || data.response?.generatedVideos?.[0]?.video?.uri

            return {
                done: true,
                videoUrl: videoUri
            }
        }

        if (data.error) {
            return {
                done: true,
                error: data.error.message || 'Unknown error'
            }
        }

        // Still processing
        return {
            done: false,
            progress: data.metadata?.progress || undefined
        }

    } catch (error) {
        return {
            done: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

