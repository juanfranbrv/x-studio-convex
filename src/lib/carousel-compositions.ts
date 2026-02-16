export interface CarouselComposition {
    id: string
    name: string
    description: string
    layoutPrompt: string
}

export const CAROUSEL_COMPOSITIONS: CarouselComposition[] = [
    {
        id: 'free',
        name: 'Libre',
        description: 'La IA define la composición base.',
        layoutPrompt: 'Libre: define una composición base coherente y mantenla constante en todas las slides.'
    },
    {
        id: 'hero',
        name: 'Titular Hero',
        description: 'Titular grande + apoyo breve.',
        layoutPrompt: 'Titular dominante centrado o en la parte superior, subtítulo corto debajo, mucho aire.'
    },
    {
        id: 'split',
        name: 'Split Texto/Visual',
        description: 'Dos columnas equilibradas.',
        layoutPrompt: 'Dividir en dos columnas 60/40: texto en un lado, elemento visual en el otro.'
    },
    {
        id: 'card',
        name: 'Tarjeta Central',
        description: 'Contenido en una tarjeta.',
        layoutPrompt: 'Bloque de contenido centrado dentro de una tarjeta con borde/sombra sutil.'
    },
    {
        id: 'list',
        name: 'Lista con Iconos',
        description: 'Bullets con iconos/checks.',
        layoutPrompt: 'Lista vertical de 3-5 puntos con iconos consistentes y alineación clara.'
    },
    {
        id: 'grid',
        name: 'Grid 2x2',
        description: 'Cuatro bloques visuales.',
        layoutPrompt: 'Rejilla 2x2 con cuatro módulos equilibrados y márgenes uniformes.'
    },
    {
        id: 'timeline',
        name: 'Pasos/Timeline',
        description: 'Secuencia numerada.',
        layoutPrompt: 'Línea vertical con pasos numerados y textos alineados.'
    },
    {
        id: 'quote',
        name: 'Cita Destacada',
        description: 'Frase protagonista.',
        layoutPrompt: 'Texto principal tipo cita grande, autor o remate breve debajo.'
    },
    {
        id: 'comparison',
        name: 'Comparativa',
        description: 'Dos columnas vs.',
        layoutPrompt: 'Dos columnas comparativas con contraste visual, etiquetas claras.'
    },
    {
        id: 'stat',
        name: 'Dato Protagonista',
        description: 'Número grande + explicación.',
        layoutPrompt: 'Número grande protagonista, explicación breve secundaria.'
    }
]

export function getCarouselComposition(id?: string): CarouselComposition | undefined {
    if (!id) return undefined
    return CAROUSEL_COMPOSITIONS.find((composition) => composition.id === id)
}
