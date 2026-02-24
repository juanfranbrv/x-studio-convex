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
        background: string | string[] // Hex list or single
        accent: string | string[]     // Hex list or single
        text?: string | string[]      // Hex list or single
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

    const headingFont = fonts.find((f) => f?.role === 'heading' && f?.family)?.family
    const bodyFont = fonts.find((f) => f?.role === 'body' && f?.family)?.family
    const firstAvailable = fonts.find((f) => f?.family)?.family

    const lines: string[] = []
    lines.push('REGLAS DE TIPOGRAFIA (OBLIGATORIO):')

    if (headingFont) {
        lines.push(`- FUENTE PARA TITULARES: Usa "${headingFont}" para el texto principal o headline.`)
    }
    if (bodyFont) {
        lines.push(`- FUENTE PARA PARRAFOS: Usa "${bodyFont}" para textos secundarios, parrafos o descripcion.`)
    }
    if (!headingFont && !bodyFont && firstAvailable) {
        lines.push(`- FUENTE DISPONIBLE: Usa "${firstAvailable}" como fuente principal.`)
    }

    lines.push('- REGLA CRITICA: Los nombres de fuente son instrucciones internas. NUNCA renderices el nombre de la fuente como texto visible en la imagen.')
    lines.push('- NOTA: Si la fuente no esta disponible en tu sistema, usa una de estilo similar.')
    return lines.join('\n')
}

function toUniqueColorList(input: string | string[] | undefined, fallback: string): string[] {
    const raw = Array.isArray(input) ? input : (typeof input === 'string' ? [input] : [])
    const normalized = raw
        .flatMap((entry) => entry.split(','))
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean)
    const withFallback = normalized.length > 0 ? normalized : [fallback.toLowerCase()]
    return Array.from(new Set(withFallback))
}

function toBulletList(colors: string[]): string {
    return colors.map((color) => `- ${color}`).join('\n')
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

    const primaryAccentForCta = toUniqueColorList(brandColors.accent, '#f0e500')[0]
    const finalActionBlock = (isLastSlide && ctaText)
        ? buildCtaDirective(ctaText, ctaUrl, primaryAccentForCta)
        : ''

    const hasStyleDirectiveBlock = Boolean(
        visualAnalysis && /STYLE DIRECTIVES:/i.test(visualAnalysis)
    )
    const cleanedVisualAnalysis = hasStyleDirectiveBlock
        ? (visualAnalysis || '').trim()
        : (visualAnalysis
            ? stripPaperCanvasHints(stripColorGuidance(visualAnalysis.replace(/Colors?:[^\n]+/gi, '').trim()))
            : '')
    const { lighting: referenceLighting, traits: referenceTraits } = !hasStyleDirectiveBlock && cleanedVisualAnalysis
        ? extractStyleTraits(cleanedVisualAnalysis)
        : { lighting: undefined, traits: undefined }

    const visualRefBlock = hasStyleDirectiveBlock
        ? cleanedVisualAnalysis
        : (referenceTraits || referenceLighting
            ? `VISUAL REFERENCE (PRIMARY SOURCE OF TRUTH):
${referenceLighting ? `Lighting: ${referenceLighting}.` : ''}
${referenceTraits ? `Style Traits: ${referenceTraits}.` : ''}
CREATIVE DIRECTION: Apply the STYLE TRAITS and LIGHTING only. Ignore any implied support (paper/canvas/white) and follow the Brand Color Palette.`
            : '')

    const visualMediumBlock = ''
    const typographyBlock = buildTypographyDirective(fonts)
    const subject = (() => {
        const baseScene = slideData.visualPrompt || slideData.description
        const cleanedBaseScene = stripPaperCanvasHints(stripColorGuidance(baseScene))
        return cleanedBaseScene
    })()

    const template = FINAL_IMAGE_PROMPT_TEMPLATE
    const languageBlock = LANGUAGE_ENFORCEMENT_INSTRUCTION((language || 'es').toLowerCase())
    const backgroundColors = toUniqueColorList(brandColors.background, '#141210')
    const textColors = toUniqueColorList(brandColors.text, '#141210')
    const accentColors = toUniqueColorList(brandColors.accent, '#f0e500')

    return template
        .replace('{{LANGUAGE_BLOCK}}', languageBlock)
        .replace('{{VISUAL_MEDIUM_BLOCK}}', visualMediumBlock)
        .replace('{{TYPOGRAPHY_BLOCK}}', typographyBlock)
        .replace('{{VISUAL_REF_BLOCK}}', visualRefBlock ? `${visualRefBlock}
` : '')
        .replace('{{LAYOUT_BLUEPRINT}}', cleanedBlueprint)
        .replace('{{BACKGROUND_COLORS}}', toBulletList(backgroundColors))
        .replace('{{TEXT_COLORS}}', toBulletList(textColors))
        .replace('{{ACCENT_COLORS}}', toBulletList(accentColors))
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
