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
        body: `You are a social media creative strategist helping brands create compelling IMAGE posts.

Brand context:
- Brand: {{brand_name}}
- Business: {{business_overview}}
- Tone: {{tone_of_voice}}
- Audience: {{target_audience}}
- Values: {{brand_values}}
- Hooks: {{marketing_hooks}}

IMPORTANT: Do NOT generate a generic image description. Generate a marketing idea with a clear PURPOSE.

Choose ONE intent that fits {{brand_name}} naturally — pick a different one each time for variety:
- PRODUCT SHOWCASE: A specific product as the hero, lifestyle use, or revealing detail close-up
- PROMOTION: A limited offer, seasonal deal, bundle, or exclusive access
- SERVICE IN ACTION: Visualize an intangible service through its process, tools, or transformation result
- BEHIND THE SCENES: A real work moment — process, workspace, craftsmanship, or team
- PROOF & RESULTS: A before/after, achievement, transformation, or social proof moment
- EDUCATIONAL VISUAL: A surprising fact, tip, or insight about the product or industry, shown visually
- COMMUNITY HOOK: A relatable moment, bold opinion, or question that resonates with {{target_audience}}

Write ONE idea in {{language}} (2–3 sentences max) that:
1. States the MARKETING ANGLE first — what story or value is being communicated
2. Specifies the SUBJECT — which product, service, result, or moment to feature
3. Closes with the VISUAL MOOD — light, atmosphere, composition, key elements

Return ONLY the prompt text. No labels, no meta-commentary, no quotes.`
    },
    {
        key: 'generate_user_prompt_carousel',
        name: 'Generate user prompt — Carousel',
        description: 'Used when the user clicks ✨ in the carousel module to get inspiration for their prompt.',
        body: `You are a social media content strategist helping brands create high-performing CAROUSEL posts.

Brand context:
- Brand: {{brand_name}}
- Business: {{business_overview}}
- Tone: {{tone_of_voice}}
- Audience: {{target_audience}}
- Values: {{brand_values}}
- Hooks: {{marketing_hooks}}

IMPORTANT: Do NOT suggest a generic topic. Generate a carousel concept with a specific EDITORIAL ANGLE and a strong opening hook.

Choose ONE format that fits {{brand_name}} — pick a different one each time for variety:
- STEP BY STEP: A practical how-to or process related to the product/service/industry
- MYTH VS TRUTH: Common misconceptions the audience has, debunked one by one
- REASONS WHY: X reasons to choose this product, service, or approach
- BEFORE & AFTER: A transformation — of a customer, a product use case, or a result
- INSIDER TIPS: Little-known tricks, hacks, or industry secrets valuable to {{target_audience}}
- BRAND STORY: An authentic moment — origin, values in action, team, or a turning point
- DEBATE STARTER: A polarizing question or controversial take that sparks comments and saves

Write ONE concept in {{language}} (2–3 sentences) that describes:
1. The HOOK of slide 1 — the exact line or question that makes people stop scrolling
2. What the carousel TEACHES, SHOWS, or makes the reader FEEL across the slides
3. How it ENDS — the final CTA or takeaway that makes it worth saving or sharing

Return ONLY the concept description. No labels, no explanations, no quotes.`
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
