interface CarouselDecompositionParams {
    brandName: string
    slideCount: number
    brandContext: string
    topic: string
}

interface CarouselImageParams {
    slideIndex: number
    totalSlides: number
    brandName: string
    brandContext: string
    title: string
    description: string
    visualPrompt: string
    focus?: string
    style: string
    aspectRatio: string
    includeLogo: boolean
}

export function buildCarouselDecompositionPrompt({
    brandName,
    slideCount,
    brandContext,
    topic
}: CarouselDecompositionParams): string {
    return `
Eres un experto en contenido para Instagram para la marca "${brandName}".
Tu tarea es descomponer el tema en exactamente ${slideCount} slides para un carrusel.

${brandContext}

TEMA DEL CARRUSEL: "${topic}"

OBJETIVO:
- Crear un guion con ${slideCount} beats (uno por slide).
- Mantener coherencia visual estricta entre slides.
- Cada slide debe aportar un punto distinto del tema.

REGLAS DE COHERENCIA:
- Todas las diapositivas comparten la misma plantilla base (margenes, grid, jerarquia).
- Tipografias, estilo de iconos y espaciados consistentes.
- Misma paleta de colores en todo el carrusel.
- No cambies el layout base entre slides, solo varia el contenido.
- No repitas la misma escena o motivo en todos los slides.

PARA CADA SLIDE, PROPORCIONA:
1. Titulo corto (maximo 6 palabras)
2. Descripcion breve (1-2 oraciones)
3. VisualPrompt detallado que respete la misma plantilla base
4. Focus: una frase corta con el foco del slide

REGLAS DE CONTENIDO:
- Slide 1: portada llamativa con el titulo principal
- Slides intermedios: desarrollan el contenido punto por punto
- Ultimo slide: CTA o conclusion
- Marca: reflejar valores y tono de ${brandName}

Responde SOLO con JSON valido:
{
  "slides": [
    {
      "index": 0,
      "title": "Titulo",
      "description": "Descripcion",
      "visualPrompt": "Prompt visual detallado...",
      "focus": "Foco del slide"
    }
  ]
}
`
}

export function buildCarouselImagePrompt({
    slideIndex,
    totalSlides,
    brandName,
    brandContext,
    title,
    description,
    visualPrompt,
    focus,
    style,
    aspectRatio,
    includeLogo
}: CarouselImageParams): string {
    return `
CARRUSEL INSTAGRAM - Slide ${slideIndex + 1} de ${totalSlides}
FORMATO: ${aspectRatio}
MARCA: ${brandName}

${brandContext}

---
CONTENIDO DEL SLIDE:
TITULO: ${title}
DESCRIPCION: ${description}
FOCO: ${focus || 'no especificado'}

ESTILO VISUAL: ${style}
INSTRUCCIONES: ${visualPrompt}

COHERENCIA OBLIGATORIA:
- Usa la misma plantilla base en todas las diapositivas.
- Mantener margenes, grid, jerarquia tipografica y espaciado.
- Paleta de marca consistente, sin cambios de estilo entre slides.
- Hilo narrativo continuo entre las piezas.
- El elemento principal debe ser distinto al del slide anterior y siguiente.

REQUISITOS TECNICOS:
- Diseno limpio y profesional para Instagram
- Tipografia legible en movil
- ${includeLogo ? 'Incluir logo de forma sutil' : 'Sin logo'}
`
}
