import { SlideContent } from '@/app/actions/generate-carousel'
import { P09B } from '@/lib/prompts/priorities/p09b-cta-url-hierarchy'
import { FINAL_IMAGE_PROMPT_TEMPLATE } from './final-image.template'
import { LANGUAGE_ENFORCEMENT_INSTRUCTION } from '@/lib/prompts/priorities/p12-preferred-language'

// --- EXTRACT LOGO POSITION FROM COMPOSITION ---
/**
 * Extracts the logo position from a composition's layoutPrompt.
 * Parses patterns like "logo bottom-right", "logo top-center", etc.
 */
export function extractLogoPosition(layoutPrompt: string): string {
    // Match patterns like "logo bottom-right", "logo top-center", etc.
    const logoMatch = layoutPrompt.match(/logo\s+(top|bottom)[-\s]?(left|right|center)/i)

    if (logoMatch) {
        const vertical = logoMatch[1].charAt(0).toUpperCase() + logoMatch[1].slice(1).toLowerCase()
        const horizontal = logoMatch[2].charAt(0).toUpperCase() + logoMatch[2].slice(1).toLowerCase()
        const result = `${vertical}-${horizontal}`
        return result
    }

    // Default fallback
    return 'Bottom-Right'
}

// --- LOGO PROTECTION DIRECTIVE (Enhanced for Carousel Consistency) ---
function buildLogoDirective(position: string, slideNumber: number, totalSlides: number): string {
    // Define exact position coordinates based on position string
    const positionMap: Record<string, { x: string; y: string; anchor: string }> = {
        'Bottom-Right': { x: '85% from left', y: '90% from top', anchor: 'bottom-right corner' },
        'Bottom-Left': { x: '15% from left', y: '90% from top', anchor: 'bottom-left corner' },
        'Bottom-Center': { x: '50% centered', y: '90% from top', anchor: 'bottom-center' },
        'Top-Right': { x: '85% from left', y: '10% from top', anchor: 'top-right corner' },
        'Top-Left': { x: '15% from left', y: '10% from top', anchor: 'top-left corner' },
        'Top-Center': { x: '50% centered', y: '8% from top', anchor: 'top-center' }
    }

    const pos = positionMap[position] || positionMap['Bottom-Right']
    const isFirstSlide = slideNumber === 1

    return `
LOGO PLACEMENT (CRITICAL - CAROUSEL CONSISTENCY):
-----------------------------------------------

EXACT POSITION: ${position} - ${pos.anchor}
   - Horizontal: ${pos.x}
   - Vertical: ${pos.y}
   - THIS POSITION IS MANDATORY FOR ALL ${totalSlides} SLIDES

SIZE SPECIFICATIONS:
   - Logo height: approximately 5% of canvas height
   - Maximum width: 15% of canvas width
   - Maintain original aspect ratio - NO stretching or squeezing

IMMUTABILITY RULES:
   - The logo is a SACRED ELEMENT - DO NOT alter, recreate, or reimagine it
   - Copy the EXACT pixels from the provided logo reference image
   - Same colors, same shapes, same proportions, same details
   - The logo is a TOP LAYER superimposed AFTER the composition is complete
   - NO visual effects on logo: no blur, no glow, no shadows, no gradient overlays

${isFirstSlide ? `
FIRST SLIDE PRECEDENT:
   - This is Slide 1/${totalSlides}. The logo placement you create HERE sets the standard.
   - All subsequent slides MUST match this exact position and size.
` : `
CONSISTENCY REQUIREMENT (SLIDE ${slideNumber}/${totalSlides}):
   - Match the EXACT logo position, size, and appearance from Slide 1 (Reference Image 2)
   - If Slide 1 logo is at bottom-right, THIS slide's logo MUST be at bottom-right
   - Same size, same position, pixel-perfect match
`}

FAILURE CONDITION: If you cannot preserve the logo EXACTLY as provided, DO NOT include it at all.
`.trim()
}

// --- TOKEN BLOCKS TO REMOVE (The "Noise Filter") ---
const NOISE_BLOCKS_REGEX = /---\s*(CONTEXTO|VALORES|VISION_CONTEXTO|CONTEXT|VALUES)\s*---[\s\S]*?(?=---|\n\n###|$)/gi

interface FinalPromptParams {
    composition: {
        layoutPrompt: string
        name?: string
        id?: string
    }
    brandColors: {
        background: string // Hex
        accent: string     // Hex
        text?: string      // Hex
    }
    slideData: SlideContent
    currentMood: string
    currentSlide: number
    totalSlides: number
    logoPosition?: string // e.g., "Bottom-Right"
    includeLogo: boolean
    isSequentialSlide: boolean // true for slides 2-5
    ctaText?: string
    ctaUrl?: string
    visualAnalysis?: string
    language?: string
    fonts?: { family: string; role?: 'heading' | 'body' }[]
}

/**
 * Cleans the layout prompt by removing noise blocks (CONTEXTO, VALORES, etc.)
 */
function cleanLayoutPrompt(layoutPrompt: string): string {
    return layoutPrompt.replace(NOISE_BLOCKS_REGEX, '').trim()
}

function injectColorsIntoBlueprint(layoutPrompt: string): string {
    return layoutPrompt
        .replace(/Solid negative space/gi, 'Solid negative space (use brand background)')
        .replace(/negative space/gi, 'negative space (use brand background)')
}

function stripColorGuidance(text: string): string {
    return text
        .replace(/#[0-9a-f]{3,8}/gi, '')
        .replace(/(monochromatic|monochrome|monocromatico|monocrom?tica|monocrom?tico)/gi, '')
        .replace(/(white|black|yellow|blue|red|green|purple|magenta|pink|orange|brown|gray|grey|gold|silver|beige|cream|ivory|cyan|teal|turquoise|navy|maroon)/gi, '')
        .replace(/(blanco|negro|amarillo|azul|rojo|verde|morado|magenta|rosa|naranja|marron|marr?n|gris|dorado|plata|beige|crema|marfil|cian|turquesa|azul marino|granate)/gi, '')
        .replace(/(fondo|background)\s+(color\s+)?(de\s+)?/gi, '$1 ')
        .replace(/\s{2,}/g, ' ')
        .trim()
}

function stripPaperCanvasHints(text: string): string {
    return text
        .replace(/(ink-on|ink on|pen-on|pen on)/gi, '')
        .replace(/(paper|paper-like|paperlike|sheet|canvas|white space|blank space)/gi, '')
        .replace(/(papel|papelera|hoja|lienzo|espacio en blanco|espacio blanco)/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
}

function extractStyleTraits(visualAnalysis: string): { lighting?: string; traits?: string } {
    const lightingMatch = visualAnalysis.match(/Lighting:\s*([^\.\n]+)/i)
    const keywordsMatch = visualAnalysis.match(/Keywords:\s*([\s\S]+)/i)
    const lighting = lightingMatch ? stripPaperCanvasHints(stripColorGuidance(lightingMatch[1])).trim() : undefined
    const rawKeywords = keywordsMatch ? keywordsMatch[1] : ''
    const traits = rawKeywords
        ? stripPaperCanvasHints(stripColorGuidance(rawKeywords))
        : undefined
    return {
        lighting: lighting || undefined,
        traits: traits || undefined
    }
}

type VisualMode = 'photo' | 'illustration'

function resolveVisualMode(visualAnalysis?: string): VisualMode {
    const source = (visualAnalysis || '').toLowerCase()
    const illustrationSignals = ['illustration', 'vector', 'cartoon', 'flat', '2d', 'comic', 'dibujo', 'ilustracion', 'ilustracion']
    const photoSignals = ['photo', 'photography', 'photoreal', 'realistic', 'editorial', 'cinematic', 'camera', 'fotografia', 'fotoreal']

    const hasIllustration = illustrationSignals.some((kw) => source.includes(kw))
    const hasPhoto = photoSignals.some((kw) => source.includes(kw))

    if (hasIllustration && !hasPhoto) return 'illustration'
    return 'photo'
}

function enforceVisualMode(scene: string, mode: VisualMode): string {
    const cleaned = scene
        .replace(/\s{2,}/g, ' ')
        .trim()

    if (mode === 'illustration') {
        const stripped = cleaned
            .replace(/\b(photo|photography|photorealistic|realistic|editorial|camera|lens|cinematic|fotografia|foto|fotografico|fotorealista)\b/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim()
        return `Ilustracion digital consistente de carrusel, misma tecnica grafica en todas las slides. ${stripped}`.trim()
    }

    const stripped = cleaned
        .replace(/\b(illustration|vector|cartoon|flat|comic|2d|drawing|line art|dibujo|ilustracion|ilustrado)\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    return `Fotografia editorial realista consistente de carrusel, misma tecnica fotografica en todas las slides. ${stripped}`.trim()
}

function buildVisualMediumDirective(mode: VisualMode, currentSlide: number, totalSlides: number): string {
    const mediumLabel = mode === 'illustration' ? 'ILLUSTRATION' : 'PHOTO'
    const forbidden = mode === 'illustration'
        ? 'NO photographic rendering, no camera/lens realism, no live-action look.'
        : 'NO illustration/vector/cartoon rendering, no drawn line-art look.'

    return `
VISUAL MEDIUM LOCK (CRITICAL):
- Locked medium for this full carousel: ${mediumLabel}.
- This slide (${currentSlide}/${totalSlides}) must use EXACTLY the same medium as slide 1.
- Do not mix mediums across slides.
- ${forbidden}
- Keep the same rendering family, finish, detail level, and material treatment in all slides.
`.trim()
}

function buildCtaDirective(ctaText: string, ctaUrl: string | undefined, accentColor: string): string {
    if (ctaUrl) {
        return `
CALL-TO-ACTION (FINAL SLIDE TREATMENT):
${P09B.CRITICAL_HIERARCHY_INSTRUCTION(ctaUrl)}
${P09B.URL_HERO_INSTRUCTION(ctaUrl)}
${P09B.CTA_SECONDARY_INSTRUCTION(ctaText)}
${P09B.FINAL_URL_VISIBILITY_INSTRUCTION(ctaUrl)}
CTA ACCENT COLOR: ${accentColor}
TEXT RENDER SAFETY: Never render labels/tokens like "CTA", "URL", "CTA CONTAINER", "CTA:", "URL:", "URLOCTAO", "CTAO". Render only the provided user-facing text.
`.trim()
    }

    return `
CALL-TO-ACTION (FINAL SLIDE TREATMENT):
${P09B.CTA_ONLY_INSTRUCTION(ctaText)}
CTA ACCENT COLOR: ${accentColor}
TEXT RENDER SAFETY: Never render labels/tokens like "CTA", "URL", "CTA CONTAINER", "CTA:", "URL:", "URLOCTAO", "CTAO". Render only the provided user-facing text.
`.trim()
}

function buildTypographyDirective(fonts?: { family: string; role?: 'heading' | 'body' }[]): string {
    if (!fonts || fonts.length === 0) return ''

    const headingFont = fonts.find(f => f?.role === 'heading')?.family
    const bodyFont = fonts.find(f => f?.role === 'body')?.family
    const firstAvailable = fonts.find(f => !!f?.family)?.family

    const lines: string[] = []
    lines.push('TYPOGRAPHY SYSTEM (INTERNAL INSTRUCTION):')

    if (headingFont) {
        lines.push(`- HEADLINE FONT TARGET: "${headingFont}".`)
    }
    if (bodyFont) {
        lines.push(`- BODY FONT TARGET: "${bodyFont}".`)
    }
    if (!headingFont && !bodyFont && firstAvailable) {
        lines.push(`- PRIMARY FONT TARGET: "${firstAvailable}".`)
    }

    lines.push('- If any target font is unavailable, use the closest similar typeface (same classification/weight/metrics).')
    lines.push('- CRITICAL: Font names are internal-only guidance. Never render font names as visible text in the image.')
    return lines.join('\n')
}

export function buildFinalPrompt({
    composition,
    brandColors,
    slideData,
    currentMood,
    currentSlide,
    totalSlides,
    logoPosition = 'Bottom-Right',
    ctaText,
    ctaUrl,
    includeLogo,
    isSequentialSlide,
    visualAnalysis,
    language,
    fonts
}: FinalPromptParams): string {
    let cleanedBlueprint = cleanLayoutPrompt(composition.layoutPrompt)
    cleanedBlueprint = cleanedBlueprint.replace('{DYNAMIC_MOOD}', currentMood)
    cleanedBlueprint = injectColorsIntoBlueprint(cleanedBlueprint)
    cleanedBlueprint = stripPaperCanvasHints(stripColorGuidance(cleanedBlueprint))

    const isFirstSlide = currentSlide === 1
    const isLastSlide = currentSlide === totalSlides
    const isMiddleSlide = isSequentialSlide && !isLastSlide

    const continuityInstruction = (() => {
        if (isFirstSlide) {
            return `MASTER TEMPLATE ESTABLISHMENT (SLIDE 1/${totalSlides}):
- Establish one immutable structural shell for the whole carousel:
  same grid, same text zones, same container geometry, same background polarity.
- Define a stable hierarchy now:
  HEADLINE block (dominant), BODY block (secondary), VISUAL block (support), LOGO anchor.
- NON-FINAL RULE: Do NOT render any action button, action strip, or URL highlight in this slide.
- This shell becomes the non-negotiable template for all next slides.`
        }

        if (isMiddleSlide) {
            return `STRUCTURAL CLONE REQUIRED (SLIDE ${currentSlide}/${totalSlides}):
- Clone the exact structural shell from Slide 1 reference.
- Keep identical: canvas polarity, frame/card system, text block coordinates, margins, paddings, and visual block proportions.
- Do not switch to a different layout family (no full-bleed swap, no poster mode, no new panel model).
- NON-FINAL RULE: Do NOT render any action button, action strip, or URL highlight in this slide.
- Only update narrative content, local subject action, and micro-details inside the same shell.`
        }

        return `CTA WITH SAME SYSTEM (SLIDE ${currentSlide}/${totalSlides}):
- Keep the exact same structural shell from Slide 1.
- CTA emphasis is allowed only inside the existing CTA/text zone.
- Do not redesign the canvas, do not move structural anchors, do not invert layout logic.`
    })()

    const logoBlock = includeLogo
        ? buildLogoDirective(logoPosition, currentSlide, totalSlides)
        : ''

    const finalActionBlock = (isLastSlide && ctaText)
        ? buildCtaDirective(ctaText, ctaUrl, brandColors.accent)
        : ''

    const cleanedVisualAnalysis = visualAnalysis
        ? stripPaperCanvasHints(stripColorGuidance(visualAnalysis.replace(/Colors?:[^\n]+/gi, '').trim()))
        : ''
    const { lighting: referenceLighting, traits: referenceTraits } = cleanedVisualAnalysis
        ? extractStyleTraits(cleanedVisualAnalysis)
        : { lighting: undefined, traits: undefined }

    const visualRefBlock = referenceTraits || referenceLighting
        ? `VISUAL REFERENCE (PRIMARY SOURCE OF TRUTH):
${referenceLighting ? `Lighting: ${referenceLighting}.` : ''}
${referenceTraits ? `Style Traits: ${referenceTraits}.` : ''}
CREATIVE DIRECTION: Apply the STYLE TRAITS and LIGHTING only. Ignore any implied support (paper/canvas/white) and follow the Brand Color Palette.`
        : ''

    const analysisForMatch = cleanedVisualAnalysis || visualAnalysis || ''
    const visualMode = resolveVisualMode(analysisForMatch)
    const visualMediumBlock = buildVisualMediumDirective(visualMode, currentSlide, totalSlides)
    const typographyBlock = buildTypographyDirective(fonts)
    const subject = (() => {
        const baseScene = slideData.visualPrompt || slideData.description
        if (!visualAnalysis) {
            return enforceVisualMode(
                stripPaperCanvasHints(stripColorGuidance(baseScene)),
                visualMode
            )
        }

        const illustrationKeywords = ['illustration', 'vector', 'cartoon', 'flat', 'cel-shad', 'digital art', '2d', 'graphic style', 'animation']
        const isIllustrationRef = illustrationKeywords.some(kw => analysisForMatch.toLowerCase().includes(kw))

        if (isIllustrationRef) {
            const cleanedScene = baseScene
                .replace(/fotograf|photo|editorial|estilo fotograf|imagen real|realistic/gi, '')
                .replace(/^\s*,\s*/, '')
                .trim()
            const illustrated = `Ilustracion vectorial estilo ${analysisForMatch.match(/Keywords:\s*([^.]+)/)?.[1]?.split(',')[0] || 'flat design'}. ${cleanedScene}`
            return enforceVisualMode(
                stripPaperCanvasHints(stripColorGuidance(illustrated)),
                visualMode
            )
        }
        return enforceVisualMode(
            stripPaperCanvasHints(stripColorGuidance(baseScene)),
            visualMode
        )
    })()

    const template = FINAL_IMAGE_PROMPT_TEMPLATE
    const languageBlock = LANGUAGE_ENFORCEMENT_INSTRUCTION((language || 'es').toLowerCase())
    const textColor = brandColors.text || '#141210'

    return template
        .replace('{{LANGUAGE_BLOCK}}', languageBlock)
        .replace('{{VISUAL_MEDIUM_BLOCK}}', visualMediumBlock)
        .replace('{{TYPOGRAPHY_BLOCK}}', typographyBlock)
        .replace('{{VISUAL_REF_BLOCK}}', visualRefBlock ? `${visualRefBlock}
` : '')
        .replace('{{LAYOUT_BLUEPRINT}}', cleanedBlueprint)
        .replace('{{BACKGROUND_COLOR}}', brandColors.background)
        .replace('{{TEXT_COLOR}}', textColor)
        .replace('{{ACCENT_COLOR}}', brandColors.accent)
        .replace('{{SUBJECT}}', subject)
        .replace('{{MOOD}}', currentMood)
        .replace('{{TEXT}}', `"${slideData.title}"${slideData.description ? ` - "${slideData.description}"` : ''}.`)
        .replace('{{FINAL_ACTION_BLOCK}}', finalActionBlock)
        .replace('{{LOGO_BLOCK}}', logoBlock)
        .replace('{{CONTINUITY}}', continuityInstruction)
}

export function generateCarouselSeed(): number {
    return Math.floor(Math.random() * 999999) + 1
}
