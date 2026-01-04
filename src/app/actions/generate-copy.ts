'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { BrandDNA } from '@/lib/brand-types'
import { VisionAnalysis, IntentCategory } from '@/lib/creation-flow-types'
import { buildCopywriterPrompt } from '@/lib/prompts/actions/copywriter'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

export async function generateFieldCopy(params: {
    brandName: string
    brandDNA: BrandDNA
    intent: IntentCategory
    visionAnalysis?: VisionAnalysis | null
    fieldLabel: string
    fieldDescription?: string
    currentValue?: string
    rawMessage?: string
}) {
    const { brandName, brandDNA, intent, visionAnalysis, fieldLabel, fieldDescription, rawMessage } = params

    // DEBUG LOGGING
    console.log('--- generateFieldCopy call ---')
    console.log('Params:', { fieldLabel, rawMessage, intent })

    const systemPrompt = buildCopywriterPrompt({
        brandName,
        brandDNA,
        visionAnalysis,
        fieldLabel,
        fieldDescription,
        rawMessage
    })

    console.log('Generated System Prompt:', systemPrompt)

    try {
        const result = await model.generateContent(systemPrompt)
        const text = result.response.text().trim().replace(/^["']|["']$/g, '') // Remove quotes if any
        console.log('AI Response:', text)
        return { success: true, text }
    } catch (error) {
        console.error('Error generating copy:', error)
        return { success: false, error: 'No se pudo generar el texto' }
    }
}
