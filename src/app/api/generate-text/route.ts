import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Use the same Gemini client pattern as existing code
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const flashModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { prompt } = body as { prompt: string }

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Generate text using Gemini Flash (fast and cheap for copywriting)
        const result = await flashModel.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 100,
            }
        })

        const text = result.response.text()?.trim() || ''

        return NextResponse.json({
            success: true,
            text
        })

    } catch (error: any) {
        console.error('Text generation error:', error)

        return NextResponse.json(
            {
                error: 'Error al generar el texto. Por favor, inténtalo de nuevo.',
                details: error.message
            },
            { status: 500 }
        )
    }
}
