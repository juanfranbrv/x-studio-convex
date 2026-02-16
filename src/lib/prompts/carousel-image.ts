interface CarouselImageParams {
    slideIndex: number
    totalSlides: number
    brandName: string
    brandContext: string
    title: string
    description: string
    visualPrompt: string
    composition?: string
    compositionPreset?: string
    focus?: string
    role?: 'hook' | 'content' | 'cta'
    style: string
    aspectRatio: string
    includeLogo: boolean
    aiImageDescription?: string
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
    compositionPreset,
    focus,
    role,
    style,
    aspectRatio,
    includeLogo,
    aiImageDescription
}: CarouselImageParams): string {
    const logoBlock = includeLogo
        ? `
PRIORIDAD LOGO (OBLIGATORIO):
- Inserta el logo proporcionado, sin deformar ni recrear.
- Manten la MISMA posicion, tamano y tratamiento en TODAS las slides.
- No anadas efectos agresivos; debe verse limpio y consistente.`
        : 'SIN LOGO.'

    return `
ROL: Eres un director de arte y diseno editorial. Mantienes coherencia absoluta entre slides (tipografia, composicion, grid, tratamiento visual).

CARRUSEL INSTAGRAM - Slide ${slideIndex + 1} de ${totalSlides}
FORMATO: ${aspectRatio}
MARCA: ${brandName}

${brandContext}

---
CONTENIDO DEL SLIDE:
TITULO: ${title}
DESCRIPCION: ${description}
FOCO: ${focus || 'no especificado'}
COMPOSICION BASE: ${compositionPreset || 'Libre (define una base coherente)'}
ARQUITECTURA DEL SLIDE: ${composition || 'Hereda exactamente la arquitectura base; solo cambia el contenido narrativo.'}
ROL: ${role || 'content'}
${aiImageDescription ? `ESTILO MAESTRO (OBLIGATORIO): ${aiImageDescription}` : ''}

ESTILO VISUAL: ${style}
INSTRUCCIONES: ${visualPrompt}

COHERENCIA OBLIGATORIA:
- Usa la misma composicion base en todas las diapositivas.
- Mantener margenes, grid, jerarquia tipografica y espaciado constantes.
- Reutiliza el mismo tratamiento de fondos, formas y estilos.
- Paleta de marca consistente, sin cambios de estilo entre slides.
- El elemento principal debe variar solo en contenido, no en estilo.
- Hilo narrativo continuo entre las piezas.
- Trata la referencia de continuidad como MASTER LAYOUT.
- No cambies la tipografia, escala, pesos ni jerarquia entre slides.
- No cambies la posicion o tamano de cajas de texto ni bloques principales.

${logoBlock}

REQUISITOS TECNICOS:
- Diseno limpio y profesional para Instagram
- Tipografia legible en movil
`
}
