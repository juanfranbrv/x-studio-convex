import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateContentImageUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { prompt, headline, cta, platform, brandDNA, context, model, layoutReference, aspectRatio } = body as {
            prompt: string
            headline?: string
            cta?: string
            platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
            brandDNA: BrandDNA
            context?: any[]
            model?: string
            layoutReference?: string
            aspectRatio?: string
        }

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Generate image with brand context
        const imageUrl = await generateContentImageUnified(
            { name: brandDNA.brand_name || 'Brand', brand_dna: brandDNA },
            prompt,
            { headline, cta, platform, context, model, layoutReference, aspectRatio }
        )

        return NextResponse.json({
            success: true,
            imageUrl
        })

    } catch (error: any) {
        console.error('Generation error:', error)

        const errorMessage = error.message || 'Failed to generate image'

        // Determine error type and appropriate status code
        let status = 500
        let userMessage = 'Error al generar la imagen. Por favor, inténtalo de nuevo.'
        let errorType = 'UNKNOWN'

        if (errorMessage.toLowerCase().includes('system busy') ||
            errorMessage.toLowerCase().includes('please try again')) {
            status = 503
            userMessage = 'El servicio está temporalmente saturado. Por favor, inténtalo de nuevo en unos segundos.'
            errorType = 'WISDOM_BUSY'
        } else if (errorMessage.toLowerCase().includes('rate limit') ||
            errorMessage.toLowerCase().includes('quota')) {
            status = 429
            userMessage = 'Has alcanzado el límite de generaciones. Espera un momento antes de continuar.'
            errorType = 'RATE_LIMIT'
        } else if (errorMessage.toLowerCase().includes('no image found')) {
            status = 500
            userMessage = 'No se pudo generar la imagen. Inténtalo de nuevo con un prompt diferente.'
            errorType = 'NO_IMAGE'
        }

        return NextResponse.json(
            {
                error: userMessage,
                errorType,
                details: errorMessage // Technical details for debugging
            },
            { status }
        )
    }
}
