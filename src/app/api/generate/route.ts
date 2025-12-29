import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateBrandImage } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { prompt, headline, cta, platform, brandDNA } = body as {
            prompt: string
            headline?: string
            cta?: string
            platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
            brandDNA: BrandDNA
        }

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Generate image with brand context
        const imageUrl = await generateBrandImage(
            { name: 'Brand', brand_dna: brandDNA },
            prompt,
            { headline, cta, platform }
        )

        return NextResponse.json({
            success: true,
            imageUrl
        })

    } catch (error) {
        console.error('Generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        )
    }
}
