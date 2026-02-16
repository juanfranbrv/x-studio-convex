import path from 'path'
import { readFileSync } from 'fs'
import { buildCarouselImagePrompt } from './carousel-image'

interface CarouselDecompositionParams {
    brandContext: string
    topic: string
    brandWebsite?: string
    requestedSlideCount?: number
    visualAnalysis?: string
    language?: string
}

interface CarouselImageParams {
    slideIndex: number
    totalSlides: number
    brandName: string
    brandContext: string
    title: string
    description: string
    visualPrompt: string
    composition?: string
    compositionPreset?: string
    focus?: string
    role?: 'hook' | 'content' | 'cta'
    style: string
    aspectRatio: string
    includeLogo: boolean
    aiImageDescription?: string
}

const DECOMPOSITION_PROMPT_PATH = path.join(
    process.cwd(),
    'src',
    'lib',
    'prompts',
    'carousel',
    'lazy-carousel-parser.md'
)

let cachedDecompositionTemplate: string | null = null

function getDecompositionTemplate(): string {
    if (!cachedDecompositionTemplate) {
        cachedDecompositionTemplate = readFileSync(DECOMPOSITION_PROMPT_PATH, 'utf8')
    }
    return cachedDecompositionTemplate
}

export function buildCarouselDecompositionPrompt({
    brandContext,
    topic,
    brandWebsite,
    requestedSlideCount,
    visualAnalysis,
    language
}: CarouselDecompositionParams): string {
    const websiteContext = brandWebsite ? `BRAND WEBSITE:\n${brandWebsite}` : 'BRAND WEBSITE: (none)'
    const requestedCount = typeof requestedSlideCount === 'number' ? String(requestedSlideCount) : 'N/A'
    const langInstructions = language ? `\nIDIOMA: Responde estrictamente en ${language}.` : ''

    // Construct visual analysis section if present
    const visualSection = visualAnalysis
        ? `\nVISUAL REFERENCE (PRIMARY SOURCE OF TRUTH):\n${visualAnalysis}\n\n⚠️ CREATIVE DIRECTION: Use this ENTIRE visual description as your creative inspiration. The Subject, Lighting, Keywords, Colors, and Medium described above define the aesthetic universe for this carousel. Each slide's "visualPrompt" must feel like it belongs to this same visual world – same style, same mood, same medium, same color palette. DO NOT invent a different aesthetic.`
        : ''

    return getDecompositionTemplate()
        .replaceAll('{{BRAND_CONTEXT}}', brandContext)
        .replaceAll('{{WEBSITE_CONTEXT}}', websiteContext)
        .replaceAll('{{USER_REQUEST}}', topic)
        .replaceAll('{{REQUESTED_SLIDE_COUNT}}', requestedCount)
        .replaceAll('{{VISUAL_ANALYSIS}}', visualSection)
        .replaceAll('{{LANGUAGE}}', langInstructions)
}

export { buildCarouselImagePrompt }
