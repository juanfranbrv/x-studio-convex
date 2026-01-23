/**
 * TYPOGRAPHY INSTRUCTIONS BUILDER
 * 
 * Generates specific instructions for the AI model to use assigned 
 * headline and paragraph fonts from the BrandDNA.
 */

export function buildTypographyInstructions(fonts: any[]): string {
    if (!fonts || fonts.length === 0) {
        return ''
    }

    const headingFonts = fonts
        .filter((f: any) => typeof f === 'object' && f.role === 'heading')
        .map((f: any) => f.family)

    const bodyFonts = fonts
        .filter((f: any) => typeof f === 'object' && f.role === 'body')
        .map((f: any) => f.family)

    let instructions = '\nREGLAS DE TIPOGRAFÍA (OBLIGATORIO):\n'

    if (headingFonts.length > 0) {
        instructions += `- FUENTE PARA TITULARES: Usa "${headingFonts[0]}" para el texto principal o headline.\n`
    }

    if (bodyFonts.length > 0) {
        instructions += `- FUENTE PARA PÁRRAFOS: Usa "${bodyFonts[0]}" para textos secundarios, párrafos o descripción.\n`
    }

    if (headingFonts.length === 0 && bodyFonts.length === 0) {
        // Fallback if no roles are assigned but fonts exist
        const firstFont = typeof fonts[0] === 'string' ? fonts[0] : fonts[0].family
        instructions += `- FUENTE DISPONIBLE: Usa "${firstFont}" como fuente principal.\n`
    }

    instructions += '- NOTA: Si la fuente no está disponible en tu sistema, usa una de estilo similar.\n'

    return instructions
}
