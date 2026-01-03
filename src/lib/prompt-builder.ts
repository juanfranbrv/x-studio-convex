import type { BrandDNA } from './brand-types'
import { IMAGE_GENERATION_BASE_PROMPT } from './prompts/image-generator-base'
import { LAYOUTS_BY_INTENT, DEFAULT_LAYOUTS, LayoutOption } from './creation-flow-types'

export interface ImageGenerationOptions {
    headline?: string
    cta?: string
    platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
    context?: Array<{ type: string; value: string; label?: string }>
    model?: string
    layoutReference?: string // Path to Phantom Template
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
        contextInstructions = '\nELEMENTOS DISPONIBLES EN "LA MESA" (CONTEXTO):\n'
        options.context.forEach((item, index) => {
            // Use provided label (e.g., "Color 2") or generic fallback
            const tagName = item.label || `Recurso ${index + 1}`
            const tagRef = `[Ref: "${tagName}"]`

            switch (item.type) {
                case 'color':
                    contextInstructions += `- ${tagRef} (Color): ${item.value}\n`
                    break
                case 'text':
                    contextInstructions += `- ${tagRef} (Texto): "${item.value}"\n`
                    break
                case 'logo':
                    contextInstructions += `- ${tagRef} (Logo): Insertar este logo.\n`
                    break
                case 'image':
                    contextInstructions += `- ${tagRef}: ESTE ES EL PRODUCTO PRINCIPAL. Debe aparecer de forma prominente e integrada orgánicamente en la escena. Respeta su forma, color y detalles técnicos.\n`
                    break
                case 'font':
                    contextInstructions += `- ${tagRef} (Fuente): Usar tipografía ${item.value}\n`
                    break
                case 'layout_img':
                    contextInstructions += `- [REF_PLANTILLA_ESTRUCTURAL]: Esta imagen es tu guía de composición obligatoria.\n`
                    break
                default:
                    contextInstructions += `- ${tagRef}: ${item.value}\n`
            }
        })
    }

    // Special instruction for Phantom Templates
    let layoutReferencePart = ''
    if (options.layoutReference) {
        // Find the layout option to get its description
        const allLayouts = Object.values(LAYOUTS_BY_INTENT).flat()
        const selectedLayout = allLayouts.find(l => l?.referenceImage === options.layoutReference) ||
            DEFAULT_LAYOUTS.find(l => l.referenceImage === options.layoutReference)

        const description = selectedLayout?.referenceImageDescription || ''

        layoutReferencePart = `
COMPOSICIÓN Y PLANIMETRÍA (DIRECCIÓN TÉCNICA OBLIGATORIA):
Usa la imagen etiquetada como [REF_PLANTILLA_ESTRUCTURAL] como un MAPA ESTRUCTURAL SAGRADO. 
- CALCA la distribución espacial y la jerarquía de los elementos.
- DESCRIPCIÓN REFORZADA: ${description}
- Respeta la ALINEACIÓN MILIMÉTRICA de los bloques de texto y contenedores.
- Ignora el contenido visual de la plantilla (colores/fotos de ejemplo); solo hereda su GEOMETRÍA DE COMPOSICIÓN.
- La fidelidad al layout de [REF_PLANTILLA_ESTRUCTURAL] es prioritaria sobre cualquier inferencia estética propia.
`
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
