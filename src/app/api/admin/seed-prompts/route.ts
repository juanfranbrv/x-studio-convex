import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'
import { log } from '@/lib/logger'

const DEFAULT_PROMPTS = [
    {
        key: 'generate_user_prompt_image',
        name: 'Generate user prompt — Image',
        description: 'Used when the user clicks ✨ in the image module to get inspiration for their prompt.',
        body: `You are a creative social media expert specialized in visual content.

A user wants to create a social media IMAGE post but doesn't know what to publish.

Brand context:
- Brand: {{brand_name}}
- Business: {{business_overview}}
- Tone of voice: {{tone_of_voice}}
- Target audience: {{target_audience}}
- Brand values: {{brand_values}}
- Marketing hooks: {{marketing_hooks}}

Generate ONE compelling image prompt in {{language}} that:
1. Is specific and visually descriptive (colors, composition, mood, subject)
2. Connects with the brand's tone and audience
3. Would make an engaging social media post
4. Is 1-3 sentences maximum

Return ONLY the prompt text, nothing else. No explanations, no labels, no quotes.`
    },
    {
        key: 'generate_user_prompt_carousel',
        name: 'Generate user prompt — Carousel',
        description: 'Used when the user clicks ✨ in the carousel module to get inspiration for their prompt.',
        body: `You are a creative social media strategist specialized in carousel content.

A user wants to create a social media CAROUSEL post but doesn't know what topic to cover.

Brand context:
- Brand: {{brand_name}}
- Business: {{business_overview}}
- Tone of voice: {{tone_of_voice}}
- Target audience: {{target_audience}}
- Brand values: {{brand_values}}
- Marketing hooks: {{marketing_hooks}}

Generate ONE compelling carousel idea in {{language}} that:
1. Has a clear educational or storytelling angle (tips, steps, story, comparison)
2. Connects with the brand's tone and audience
3. Would generate saves and shares on social media
4. Is 1-3 sentences describing the topic and angle

Return ONLY the prompt text, nothing else. No explanations, no labels, no quotes.`
    }
]

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        log.info('ADMIN', `Seed-prompts start | user=${userId}`)

        // Get Convex client and upsert default prompts
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
        if (!convexUrl) {
            return NextResponse.json(
                { error: 'Convex URL not configured' },
                { status: 500 }
            )
        }

        const convex = new ConvexHttpClient(convexUrl)

        // Upsert each default prompt
        for (const prompt of DEFAULT_PROMPTS) {
            await convex.mutation(api.systemPrompts.upsert, {
                key: prompt.key,
                name: prompt.name,
                body: prompt.body,
                description: prompt.description,
                updated_by: userId
            })
        }

        log.success('ADMIN', `Seed-prompts done | seeded=${DEFAULT_PROMPTS.length}`)

        return NextResponse.json({
            success: true,
            seeded: DEFAULT_PROMPTS.length
        })

    } catch (error: unknown) {
        log.error('ADMIN', 'Seed-prompts failed', error)
        const details = error instanceof Error ? error.message : String(error)

        return NextResponse.json(
            {
                error: 'Failed to seed default prompts',
                details
            },
            { status: 500 }
        )
    }
}
