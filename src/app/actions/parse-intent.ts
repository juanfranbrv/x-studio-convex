'use server'

import { generateTextUnified } from '@/lib/gemini'
import { buildBrandDirectorPrompt } from '@/lib/prompts/system/brand-director'
import { buildIntentParserPrompt } from '@/lib/prompts/intents/parser'
import { IntentMeta, LayoutOption, INTENT_CATALOG, LAYOUTS_BY_INTENT } from '@/lib/creation-flow-types'
import { INTENT_PARSER_SYSTEM_PROMPT } from '@/lib/prompts/intents/parser-system-prompt'

export interface ParsedIntentResult {
    detectedIntent?: string // Auto-detected intent ID
    confidence?: number      // Confidence score 0-1
    headline?: string
    cta?: string
    ctaUrl?: string          // NEW: Separate field for the URL
    caption?: string         // NEW: Social media caption
    imageTexts?: Record<string, string> // NEW: Consolidated image texts
    customTexts?: Record<string, string>
    error?: string
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
        const modelToUse = intelligenceModel || 'gemini-flash-latest'
        console.log(`[LazyPrompt] Parsing with model ${modelToUse} ${intent ? `for intent: ${intent.name}` : 'with auto-detection'}`)

        // 2. Build Prompt Parts (Include system prompt in body for maximum adherence across all models)
        const prompt = buildIntentParserPrompt(userText, brandWebsite, brandDNA, intent, layout, true)

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
        const parsed = JSON.parse(cleanJson)

        return parsed
    } catch (error) {
        console.error('[LazyPrompt] Error:', error)
        return { error: `Failed to parse intent: ${error instanceof Error ? error.message : String(error)}` }
    }
}

