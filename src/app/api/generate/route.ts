import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { generateContentImageUnified } from '@/lib/gemini'
import type { BrandDNA } from '@/lib/brand-types'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check user credits before generation
        let creditsData = await convex.query(api.users.getCredits, { clerk_id: userId })

        // If user doesn't exist in Convex, create them automatically
        if (!creditsData) {
            const client = await clerkClient()
            const clerkUser = await client.users.getUser(userId)
            const email = clerkUser.emailAddresses[0]?.emailAddress || ''

            await convex.mutation(api.users.upsertUser, {
                clerk_id: userId,
                email: email
            })

            // Re-fetch credits data
            creditsData = await convex.query(api.users.getCredits, { clerk_id: userId })
        }

        if (!creditsData) {
            return NextResponse.json({ error: 'Error creando usuario' }, { status: 500 })
        }

        if (creditsData.status !== 'active') {
            const statusMessages: Record<string, string> = {
                waitlist: 'Tu cuenta está en lista de espera. Contacta al admin para activarla.',
                suspended: 'Tu cuenta ha sido suspendida. Contacta al admin.',
            }
            return NextResponse.json({
                error: statusMessages[creditsData.status] || 'Cuenta no activa'
            }, { status: 403 })
        }

        if (creditsData.credits < 1) {
            return NextResponse.json({
                error: 'Sin créditos disponibles. Contacta al admin para obtener más.'
            }, { status: 402 })
        }

        // Parse request body
        // Parse request body
        const body = await request.json()
        let { prompt, headline, cta, platform, brandDNA, context, model, layoutReference, aspectRatio, selectedColors, promptAlreadyBuilt } = body as {
            prompt: string
            headline?: string
            cta?: string
            platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
            brandDNA: BrandDNA
            context?: any[]
            model?: string
            layoutReference?: string
            aspectRatio?: string
            selectedColors?: any[]
            promptAlreadyBuilt?: boolean
        }

        // Robust Server-Side Fallback: If model is missing, fetch from DB
        if (!model) {
            console.log('[API] Model not provided by client, fetching from DB...')
            try {
                // Use the initialized convex client since we are in an API route
                const aiConfig = await convex.query(api.settings.getAIConfig)
                if (aiConfig && aiConfig.imageModel) {
                    model = aiConfig.imageModel
                    console.log(`[API] Resolved model from DB: ${model}`)
                }
            } catch (err) {
                console.error('[API] Failed to fetch AI config:', err)
            }
        }

        const provider = model?.startsWith('wisdom/')
            ? 'Wisdom'
            : model?.startsWith('google/')
                ? 'Google Oficial'
                : 'Google Oficial'
        console.log(`\n╔══════════════════════════════════════════════╗\n║ IMAGE REQUEST (SERVER)\n║ Provider: ${provider}\n║ Model: ${model || 'NO_CONFIG'}\n║ Prompt Length: ${prompt?.length || 0}\n║ Brand: ${brandDNA?.brand_name || 'N/A'}\n╚══════════════════════════════════════════════╝`)

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Generate image with brand context
        const imageUrl = await generateContentImageUnified(
            { name: brandDNA.brand_name || 'Brand', brand_dna: brandDNA },
            prompt,
            { headline, cta, platform, context, model, layoutReference, aspectRatio, selectedColors, promptAlreadyBuilt }
        )

        // Consume credit after successful generation
        try {
            await convex.mutation(api.users.consumeCredits, {
                clerk_id: userId,
                metadata: { action: 'image_generation', prompt: prompt.substring(0, 100) }
            })
        } catch (creditError) {
            console.error('Failed to consume credit (image was generated):', creditError)
            // Don't fail the request - image was generated, we just log the credit issue
        }

        return NextResponse.json({
            success: true,
            imageUrl,
            creditsRemaining: (creditsData.credits - 1)
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
