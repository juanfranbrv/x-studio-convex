import { SlideContent } from '@/app/actions/generate-carousel'

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
🔒 LOGO PLACEMENT (CRITICAL - CAROUSEL CONSISTENCY):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 EXACT POSITION: ${position} - ${pos.anchor}
   - Horizontal: ${pos.x}
   - Vertical: ${pos.y}
   - THIS POSITION IS MANDATORY FOR ALL ${totalSlides} SLIDES

📐 SIZE SPECIFICATIONS:
   - Logo height: approximately 5% of canvas height
   - Maximum width: 15% of canvas width
   - Maintain original aspect ratio - NO stretching or squeezing

🔐 IMMUTABILITY RULES:
   - The logo is a SACRED ELEMENT - DO NOT alter, recreate, or reimagine it
   - Copy the EXACT pixels from the provided logo reference image
   - Same colors, same shapes, same proportions, same details
   - The logo is a TOP LAYER superimposed AFTER the composition is complete
   - NO visual effects on logo: no blur, no glow, no shadows, no gradient overlays

${isFirstSlide ? `
🎯 FIRST SLIDE PRECEDENT:
   - This is Slide 1/${totalSlides}. The logo placement you create HERE sets the standard.
   - All subsequent slides MUST match this exact position and size.
` : `
🔄 CONSISTENCY REQUIREMENT (SLIDE ${slideNumber}/${totalSlides}):
   - Match the EXACT logo position, size, and appearance from Slide 1 (Reference Image 2)
   - If Slide 1 logo is at bottom-right, THIS slide's logo MUST be at bottom-right
   - Same size, same position, pixel-perfect match
`}

⚠️ FAILURE CONDITION: If you cannot preserve the logo EXACTLY as provided, DO NOT include it at all.
`.trim()
}

// --- TOKEN BLOCKS TO REMOVE (The "Noise Filter") ---
const NOISE_BLOCKS_REGEX = /---\s*(CONTEXTO|VALORES|VISION_CONTEXTO|CONTEXT|VALUES)\s*---[\s\S]*?(?=---|\\n\\n###|$)/gi

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
}

/**
 * Cleans the layout prompt by removing noise blocks (CONTEXTO, VALORES, etc.)
 */
function cleanLayoutPrompt(layoutPrompt: string): string {
    return layoutPrompt.replace(NOISE_BLOCKS_REGEX, '').trim()
}

/**
 * Injects brand colors into the layout prompt.
 * Replaces generic "Solid negative space" with specific hex color.
 */
function injectColorsIntoBlueprint(layoutPrompt: string, backgroundColor: string): string {
    return layoutPrompt
        .replace(/Solid negative space/gi, `Solid negative space in Hex ${backgroundColor}`)
        .replace(/negative space/gi, `negative space (${backgroundColor})`)
}

// --- CTA DIRECTIVE FOR FINAL SLIDE ---
function buildCtaDirective(ctaText: string, ctaUrl: string | undefined, accentColor: string): string {
    return `
📢 CALL-TO-ACTION (FINAL SLIDE TREATMENT):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔘 CTA BUTTON/PILL:
   - Text: "${ctaText}"
   - Style: Rounded pill button with solid fill in accent color (${accentColor})
   - Position: Center-bottom of the composition, above the logo
   - Size: Button width should fit the text + comfortable padding (approximately 20-30% of canvas width)
   - Typography: Bold, clean font, white or contrasting color for maximum legibility
${ctaUrl ? `
🔗 URL DISPLAY:
   - URL: "${ctaUrl}"
   - Position: Directly below the CTA button, or integrated into the button if short
   - Style: Clean sans-serif, smaller than CTA text, can be in accent color or white
   - DO NOT add "www." or "https://" unless it's part of the actual URL provided
` : ''}
⚡ VISUAL HIERARCHY:
   - The CTA button should be the MOST PROMINENT interactive element
   - Create visual breathing room around the button (negative space)
   - The button should feel "clickable" - use subtle shadow or depth if appropriate
`.trim()
}

/**
 * Builds the final clean prompt for the image generation API.
 * Follows the 5-rule system for refined carousel generation.
 */
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
    visualAnalysis
}: FinalPromptParams): string {

    // 1. Clean the blueprint (remove CONTEXTO, VALORES, etc.)
    let cleanedBlueprint = cleanLayoutPrompt(composition.layoutPrompt)

    // 2. Replace {DYNAMIC_MOOD} placeholder
    cleanedBlueprint = cleanedBlueprint.replace('{DYNAMIC_MOOD}', currentMood)

    // 3. Inject brand colors into blueprint
    cleanedBlueprint = injectColorsIntoBlueprint(cleanedBlueprint, brandColors.background)

    // 4. Build the consolidated prompt
    const continuityInstruction = isSequentialSlide
        ? `CONTINUITY: Keep the same professional person (man/woman) and suit style as seen in Reference Image 2. Change only the action/background.`
        : ''

    const logoBlock = includeLogo
        ? buildLogoDirective(logoPosition, currentSlide, totalSlides)
        : ''

    // CTA block for final slide only
    const isLastSlide = currentSlide === totalSlides
    const ctaBlock = (isLastSlide && ctaText)
        ? buildCtaDirective(ctaText, ctaUrl, brandColors.accent)
        : ''

    const visualRefBlock = visualAnalysis
        ? `
VISUAL REFERENCE (PRIMARY SOURCE OF TRUTH):
${visualAnalysis}
⚠️ CREATIVE DIRECTION: This visual description defines the aesthetic universe for this image. Match the Subject, Lighting, Keywords, Colors, and Medium described above. The SCENE must feel like it belongs to this same visual world – same style, same mood, same medium, same color palette. DO NOT invent a different aesthetic.
`
        : ''

    return `
⚠️ CRITICAL RENDERING RULES (ABSOLUTE - ZERO TOLERANCE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE FOLLOWING MUST NEVER APPEAR AS VISIBLE TEXT IN THE IMAGE:
❌ Template/layout names: "Notebook", "Minimalist", "Bold", "Classic", etc.
❌ Hex color codes: #F0E500, #141210, #FFFFFF, etc.
❌ Font names: "Inter", "Roboto", "Arial", "Montserrat", etc.
❌ Technical terms: "LAYOUT BLUEPRINT", "BRAND COLORS", "SCENE", "MOOD", "CTA"
❌ Instructions or section headers from this prompt
❌ Any text that looks like code, configuration, or metadata

✅ ONLY RENDER TEXT FROM THE "TEXT:" FIELD BELOW
✅ Everything else is INVISIBLE composition/style guidance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---
${visualRefBlock}
LAYOUT BLUEPRINT: ${composition.name || 'Custom Layout'}
${cleanedBlueprint}

BRAND COLORS: Background ${brandColors.background}, Accent ${brandColors.accent}${brandColors.text ? `, Text ${brandColors.text}` : ''}.

SCENE: ${(() => {
            const baseScene = slideData.visualPrompt || slideData.description
            if (!visualAnalysis) return baseScene

            // Check if reference is an illustration/vector style
            const illustrationKeywords = ['illustration', 'vector', 'cartoon', 'flat', 'cel-shad', 'digital art', '2d', 'graphic style', 'animation']
            const isIllustrationRef = illustrationKeywords.some(kw => visualAnalysis.toLowerCase().includes(kw))

            if (isIllustrationRef) {
                // Remove photo-related words and prepend illustration style
                const cleanedScene = baseScene
                    .replace(/fotograf[íi]a|photo|editorial|estilo fotogr[áa]fico|imagen real|realistic/gi, '')
                    .replace(/^\s*,\s*/, '')
                    .trim()
                return `Ilustración vectorial estilo ${visualAnalysis.match(/Keywords:\s*([^.]+)/)?.[1]?.split(',')[0] || 'flat design'}. ${cleanedScene}`
            }
            return baseScene
        })()}

MOOD: ${currentMood}

TEXT: "${slideData.title}"${slideData.description ? ` - "${slideData.description}"` : ''} in White and ${brandColors.accent}.

${ctaBlock}

${logoBlock}

${continuityInstruction}
`.trim()
}

/**
 * Generates a random seed for image consistency across carousel slides.
 */
export function generateCarouselSeed(): number {
    return Math.floor(Math.random() * 999999) + 1
}
