import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateBrandImage } from '@/lib/gemini'
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
        const { prompt, headline, cta, platform, brandDNA, context } = body as {
            prompt: string
            headline?: string
            cta?: string
            platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
            brandDNA: BrandDNA
            context?: any[]
        }

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Generate image with brand context
        const imageUrl = await generateBrandImage(
            { name: 'Brand', brand_dna: brandDNA },
            prompt,
            { headline, cta, platform, context }
        )

        return NextResponse.json({
            success: true,
            imageUrl
        })

    } catch (error: any) {
        console.error('Generation error:', error)
        const status = error.status || 500
        const message = error.message || 'Failed to generate image'
        return NextResponse.json(
            { error: message },
            { status }
        )
    }
}
