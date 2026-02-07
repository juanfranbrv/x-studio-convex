export function buildContextInstructions(context: Array<{ type: string; value: string; label?: string }>): string {
    let contextInstructions = '\nELEMENTOS DISPONIBLES EN "LA MESA" (CONTEXTO):\n'
    context.forEach((item, index) => {
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
            case 'aux_logo':
                contextInstructions += `- ${tagRef} (Logo auxiliar): DEBE aparecer en el diseño como sello secundario de colaborador/organismo. Es obligatorio incluirlo cuando esté presente. NO sustituir ni competir con el logo principal de marca.\n`
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
    return contextInstructions
}
