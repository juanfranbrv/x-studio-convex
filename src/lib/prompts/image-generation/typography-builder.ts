/**
 * TYPOGRAPHY INSTRUCTIONS BUILDER
 * 
 * Generates specific instructions for the AI model to use assigned
 * headline and paragraph fonts from the BrandDNA.
 */

type FontInput = string | { family?: string; role?: 'heading' | 'body' | string } | null | undefined

export function buildTypographyInstructions(fonts: FontInput[]): string {
    if (!fonts || fonts.length === 0) {
        return ''
    }

    const headingFonts = fonts
        .filter((f): f is { family?: string; role?: string } => typeof f === 'object' && f !== null && f.role === 'heading')
        .map((f) => f.family)
        .filter((family): family is string => typeof family === 'string' && family.trim().length > 0)

    const bodyFonts = fonts
        .filter((f): f is { family?: string; role?: string } => typeof f === 'object' && f !== null && f.role === 'body')
        .map((f) => f.family)
        .filter((family): family is string => typeof family === 'string' && family.trim().length > 0)

    let instructions = '\nREGLAS DE TIPOGRAFIA (OBLIGATORIO):\n'

    if (headingFonts.length > 0) {
        instructions += `- FUENTE PARA TITULARES: Usa "${headingFonts[0]}" para el texto principal o headline.\n`
    }

    if (bodyFonts.length > 0) {
        instructions += `- FUENTE PARA PARRAFOS: Usa "${bodyFonts[0]}" para textos secundarios, parrafos o descripcion.\n`
    }

    if (headingFonts.length === 0 && bodyFonts.length === 0) {
        // Fallback if no roles are assigned but fonts exist
        const firstFont =
            typeof fonts[0] === 'string'
                ? fonts[0]
                : (fonts[0] && typeof fonts[0] === 'object' && typeof fonts[0].family === 'string' ? fonts[0].family : '')
        if (firstFont) {
            instructions += `- FUENTE DISPONIBLE: Usa "${firstFont}" como fuente principal.\n`
        }
    }

    instructions += '- REGLA CRITICA: Los nombres de fuente son instrucciones internas. NUNCA renderices el nombre de la fuente como texto visible en la imagen.\n'
    instructions += '- NOTA: Si la fuente no esta disponible en tu sistema, usa una de estilo similar.\n'

    return instructions
}
