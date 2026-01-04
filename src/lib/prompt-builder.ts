import type { BrandDNA } from './brand-types'
import { IMAGE_GENERATION_BASE_PROMPT } from './prompts/image-generator-base'
import { LAYOUTS_BY_INTENT, DEFAULT_LAYOUTS, LayoutOption } from './creation-flow-types'
import { buildContextInstructions } from './prompts/image-generation/context-builder'
import { buildLayoutInstruction } from './prompts/image-generation/layout-rules'

export interface ImageGenerationOptions {
    headline?: string
    cta?: string
    platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
    context?: Array<{ type: string; value: string; label?: string }>
    model?: string
    layoutReference?: string // Path to Phantom Template
    aspectRatio?: string
}

export function buildImagePrompt(
    brand: { name: string; brand_dna: BrandDNA },
    userPrompt: string,
    options: ImageGenerationOptions = {}
): string {
    const { colors, tone_of_voice } = brand.brand_dna
    const tone = tone_of_voice?.join(', ') || 'Sin definir'
    const colorList = colors?.map(c => c.color).join(', ') || 'Sin definir'

    // Process explicit context items (Drag & Drop)
    let contextInstructions = ''
    if (options.context && options.context.length > 0) {
        contextInstructions = buildContextInstructions(options.context)
    }

    // Special instruction for Phantom Templates
    let layoutReferencePart = ''
    if (options.layoutReference) {
        // Find the layout option to get its description
        const allLayouts = Object.values(LAYOUTS_BY_INTENT).flat()
        const selectedLayout = allLayouts.find(l => l?.referenceImage === options.layoutReference) ||
            DEFAULT_LAYOUTS.find(l => l.referenceImage === options.layoutReference)

        const description = selectedLayout?.referenceImageDescription || ''

        layoutReferencePart = buildLayoutInstruction(description)
    }

    // Determine aspect ratio/format context based on platform
    const platformContext = options.platform
        ? `FORMATO: Optimizado para ${options.platform}`
        : ''

    // The Final Prompt Construction
    // The Final Prompt Construction using the external template
    return IMAGE_GENERATION_BASE_PROMPT
        .replace('{{colorList}}', colorList)
        .replace('{{tone}}', tone)
        .replace('{{contextInstructions}}', contextInstructions)
        .replace('{{layoutReferencePart}}', layoutReferencePart)
        .replace('{{userPrompt}}', userPrompt)
}
