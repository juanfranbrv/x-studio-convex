import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { VisionAnalysis, DetectedSubject } from '@/lib/creation-flow-types'
import { IMAGE_ANALYSIS_PROMPT } from '@/lib/prompts/vision/image-analysis.prompt'

// Use the same paid API key as image generation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_IMAGE_API_KEY!)

const VISION_MODEL = 'models/gemini-flash-lite-latest'


export async function POST(request: NextRequest) {
    try {
        const { imageBase64, mimeType = 'image/jpeg' } = await request.json()

        if (!imageBase64) {
            return NextResponse.json(
                { success: false, error: 'No image provided' },
                { status: 400 }
            )
        }

        // Remove data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')

        const model = genAI.getGenerativeModel({ model: VISION_MODEL })

        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                mimeType,
                                data: base64Data,
                            },
                        },
                        { text: IMAGE_ANALYSIS_PROMPT },
                    ],
                },
            ],
        })

        const response = result.response
        const text = response.text()

        // Parse JSON from response
        let analysis: VisionAnalysis
        try {
            // Clean up potential markdown wrapping
            const jsonText = text.replace(/```json\n?|\n?```/g, '').trim()
            const parsed = JSON.parse(jsonText)

            // Validate and normalize the response
            const rawKeywords = Array.isArray(parsed.keywords)
                ? parsed.keywords.filter((k: unknown) => typeof k === 'string')
                : (typeof parsed.keywords === 'string' ? [parsed.keywords] : [])
            const normalizedKeywords = normalizeStyleKeywords(rawKeywords)

            analysis = {
                subject: validateSubject(parsed.subject),
                subjectLabel: parsed.subjectLabel || 'Objeto detectado',
                lighting: parsed.lighting || 'unknown',
                colorPalette: Array.isArray(parsed.colorPalette) ? parsed.colorPalette : [],
                keywords: normalizedKeywords,
                confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
            }
        } catch {
            // Fallback if parsing fails
            analysis = {
                subject: 'product',
                subjectLabel: 'Producto',
                lighting: 'unknown',
                colorPalette: [],
                keywords: ['commercial', 'product'],
                confidence: 0.5,
            }
        }

        return NextResponse.json({
            success: true,
            data: analysis,
        })
    } catch (error) {
        console.error('[VISION API] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Vision analysis failed',
            },
            { status: 500 }
        )
    }
}

function normalizeStyleKeywords(rawKeywords: string[]): string[] {
    if (!rawKeywords || rawKeywords.length === 0) return []

    const merged = rawKeywords.join(' ').replace(/\s+/g, ' ').trim()
    if (!merged) return []

    const cleaned = merged
        .replace(/```json|```/gi, '')
        .replace(/\s+/g, ' ')
        .trim()

    const fallback =
        'photorealistic commercial treatment with controlled contrast, coherent natural lighting, clean finishing, balanced texture, and professional art direction focused on readability and visual clarity'

    const safeText = cleaned.length > 24 ? cleaned : fallback
    return [safeText]
}

function validateSubject(subject: string): DetectedSubject {
    const validSubjects: DetectedSubject[] = [
        'food', 'tech', 'fashion', 'beauty', 'home', 'sports',
        'nature', 'people', 'abstract', 'product', 'unknown'
    ]
    return validSubjects.includes(subject as DetectedSubject)
        ? (subject as DetectedSubject)
        : 'unknown'
}
