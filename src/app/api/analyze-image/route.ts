import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { VisionAnalysis, DetectedSubject } from '@/lib/creation-flow-types'

// Use the same paid API key as image generation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_IMAGE_API_KEY!)

const VISION_MODEL = 'models/gemini-flash-lite-latest'

const ANALYSIS_PROMPT = `Analyze this image for marketing/advertising purposes. Return a JSON object with:

1. "subject": One of: "food", "tech", "fashion", "beauty", "home", "sports", "nature", "people", "abstract", "product", "unknown"
2. "subjectLabel": A short Spanish description of the main subject (e.g., "Botella de aceite de oliva", "Auriculares inalámbricos")
3. "lighting": One of: "bright", "dim", "natural", "studio", "golden_hour", "unknown"
4. "colorPalette": Array of 3-5 dominant hex colors extracted from the image
5. "keywords": Provide 3-5 rigorous visual style descriptors in English. Focus on: lighting (e.g. cinematic, flat), vibe (e.g. minimalist, authentic, neon, luxury), and composition (e.g. wide angle, macro). Avoid generic terms.
6. "confidence": A number between 0 and 1 indicating confidence in the analysis

Respond ONLY with valid JSON, no markdown or explanation.`

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
                        { text: ANALYSIS_PROMPT },
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
            analysis = {
                subject: validateSubject(parsed.subject),
                subjectLabel: parsed.subjectLabel || 'Objeto detectado',
                lighting: parsed.lighting || 'unknown',
                colorPalette: Array.isArray(parsed.colorPalette) ? parsed.colorPalette : [],
                keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
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

function validateSubject(subject: string): DetectedSubject {
    const validSubjects: DetectedSubject[] = [
        'food', 'tech', 'fashion', 'beauty', 'home', 'sports',
        'nature', 'people', 'abstract', 'product', 'unknown'
    ]
    return validSubjects.includes(subject as DetectedSubject)
        ? (subject as DetectedSubject)
        : 'unknown'
}
