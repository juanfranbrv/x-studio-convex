import path from 'path'
import { readFileSync } from 'fs'
import { buildCarouselImagePrompt } from './carousel-image'

interface CarouselDecompositionParams {
    brandContext: string
    topic: string
    brandWebsite?: string
    requestedSlideCount?: number
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
    requestedSlideCount
}: CarouselDecompositionParams): string {
    const websiteContext = brandWebsite ? `BRAND WEBSITE:\n${brandWebsite}` : 'BRAND WEBSITE: (none)'
    const requestedCount = typeof requestedSlideCount === 'number' ? String(requestedSlideCount) : 'N/A'

    return getDecompositionTemplate()
        .replaceAll('{{BRAND_CONTEXT}}', brandContext)
        .replaceAll('{{WEBSITE_CONTEXT}}', websiteContext)
        .replaceAll('{{USER_REQUEST}}', topic)
        .replaceAll('{{REQUESTED_SLIDE_COUNT}}', requestedCount)
}

export { buildCarouselImagePrompt }
