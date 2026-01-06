'use server'

import { generateTextUnified } from '@/lib/gemini'
import { buildBrandDirectorPrompt } from '@/lib/prompts/system/brand-director'
import { buildIntentParserPrompt } from '@/lib/prompts/intents/parser'
import { IntentMeta, LayoutOption } from '@/lib/creation-flow-types'

export interface ParsedIntentResult {
    headline?: string
    cta?: string
    customTexts?: Record<string, string>
    error?: string
}

export async function parseLazyIntentAction(
    userText: string,
    intent: IntentMeta,
    brandName: string, // Simplified context
    layout?: LayoutOption
): Promise<ParsedIntentResult> {
    try {
        console.log(`[LazyPrompt] Parsing for intent: ${intent.name}`)

        // 1. Build Prompt
        const prompt = buildIntentParserPrompt(userText, intent, layout)

        // 2. Mock Brand DNA for system prompt (minimal context needed for parser)
        const mockBrandContext = {
            name: brandName,
            brand_dna: {
                name: brandName,
                mission: '',
                values: [],
                voice: [],
                visual_style: [],
                target_audience: [],
                colors: [],
                fonts: [],
                tone_of_voice: []
            }
        }

        // 3. Call AI
        // We use the unified generator but with JSON expectation
        const jsonResponse = await generateTextUnified(
            // @ts-ignore - Minimal mock is fine here
            mockBrandContext,
            prompt,
            'wisdom/gemini-2.5-flash' // Fast model is sufficient
        )

        // 4. Parse Response
        const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(cleanJson)

        return parsed
    } catch (error) {
        console.error('[LazyPrompt] Error:', error)
        return { error: `Failed to parse intent: ${error instanceof Error ? error.message : String(error)}` }
    }
}
