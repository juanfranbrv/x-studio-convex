import type { BrandDNA } from './brand-types'

export interface ImageGenerationOptions {
    headline?: string
    cta?: string
    platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin'
    context?: Array<{ type: string; value: string; label?: string }>
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
                    contextInstructions += `- ${tagRef} (Imagen Ref): Estilo/Contenido basado en esto.\n`
                    break
                case 'font':
                    contextInstructions += `- ${tagRef} (Fuente): Usar tipografía ${item.value}\n`
                    break
                default:
                    contextInstructions += `- ${tagRef}: ${item.value}\n`
            }
        })
    }

    // Determine aspect ratio/format context based on platform
    const platformContext = options.platform
        ? `FORMATO: Optimizado para ${options.platform}`
        : ''

    // The Final Prompt Construction
    return `
ROL: Eres un diseñador gráfico experto automatizado. Tu misión es componer una imagen usando los recursos proporcionados.

DATOS DE MARCA:
- Colores base: ${colorList}
- Tono visual: ${tone}

RECURSOS ARRASTRADOS (PRIORIDAD TOTAL):
${contextInstructions}

SOLICITUD DEL USUARIO:
"${userPrompt}"

---------------------------------------------------------
🧠 LÓGICA DE INFERENCIA INTELIGENTE (SMART MODE):
Si la solicitud del usuario es breve o ambigua, APLICA LOS RECURSOS AUTOMÁTICAMENTE:

1. ¿Hay Colores arrastrados?
   - Úsalos como colores dominantes (Fondos, bloques grandes).
   - "Color 1" suele ser primario/fondo. "Color 2" acento.

2. ¿Hay Texto arrastrado?
   - DEBE aparecer en la imagen. Prioridad absoluta a la legibilidad.
   - Si no se dice dónde, ponlo centrado o en una zona limpia.

3. ¿Hay Logos?
   - Intégralos sutilmente en una esquina superior o como cierre.

4. ¿El usuario refiere a una etiqueta ("Usa Color 2")?
   - Busca en lineas de RECURSOS ARRASTRADOS la referencia [Ref: "Color 2"] y úsalo exactamente como se pide.
---------------------------------------------------------
`.trim()
}
