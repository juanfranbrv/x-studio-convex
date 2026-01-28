import path from 'path'
import { readFileSync } from 'fs'

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

export function buildCarouselImagePrompt({
    slideIndex,
    totalSlides,
    brandName,
    brandContext,
    title,
    description,
    visualPrompt,
    composition,
    focus,
    role,
    style,
    aspectRatio,
    includeLogo,
    aiImageDescription
}: CarouselImageParams): string {
    return `
CARRUSEL INSTAGRAM - Slide ${slideIndex + 1} de ${totalSlides}
FORMATO: ${aspectRatio}
MARCA: ${brandName}

${brandContext}

---
CONTENIDO DEL SLIDE:
TITULO: ${title}
DESCRIPCION: ${description}
FOCO: ${focus || 'no especificado'}
COMPOSICION: ${composition || 'no especificada'}
ROL: ${role || 'content'}
${aiImageDescription ? `REFERENCIA IA: ${aiImageDescription}` : ''}

ESTILO VISUAL: ${style}
INSTRUCCIONES: ${visualPrompt}

COHERENCIA OBLIGATORIA:
- Usa la misma plantilla base en todas las diapositivas.
- Mantener margenes, grid, jerarquia tipografica y espaciado.
- Paleta de marca consistente, sin cambios de estilo entre slides.
- Hilo narrativo continuo entre las piezas.
- El elemento principal debe ser distinto al del slide anterior y siguiente.

REQUISITOS TECNICOS:
- Diseno limpio y profesional para Instagram
- Tipografia legible en movil
- ${includeLogo ? 'Incluir logo de forma sutil' : 'Sin logo'}
`
}
