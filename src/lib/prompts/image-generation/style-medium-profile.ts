type MediumId =
    | 'neutral'
    | 'line-illustration'
    | 'painterly'
    | 'pixel-retro'
    | 'editorial-graphic'
    | 'soft-organic'
    | 'photographic'
    | 'vector-clean'
    | 'three-dimensional'

type Confidence = 'weak' | 'medium' | 'strong'
type Source = 'analysis' | 'fallback' | 'mixed' | 'none'

export interface StyleMediumProfile {
    id: MediumId
    label: string
    confidence: Confidence
    source: Source
    headlineTreatment: string
    paragraphTreatment: string
    mediumProtection: string
    forbiddenTreatments: string[]
}

type InferenceInput = {
    analysisText?: string
    fallbackText?: string
}

type MediumDefinition = {
    id: Exclude<MediumId, 'neutral'>
    label: string
    analysisPatterns: RegExp[]
    fallbackPatterns: RegExp[]
    headlineTreatment: string
    paragraphTreatment: string
    mediumProtection: string
    forbiddenTreatments: string[]
}

const MEDIUM_DEFINITIONS: MediumDefinition[] = [
    {
        id: 'line-illustration',
        label: 'ilustración lineal',
        analysisPatterns: [
            /\bsketch\b/i,
            /\bpencil\b/i,
            /\bgraphite\b/i,
            /\bcharcoal\b/i,
            /\bink(?:ed)?\b/i,
            /\billustrat(?:ed|ion)\b/i,
            /\bdrawn?\b/i,
            /\bdrawing\b/i,
            /\bline[\s-]?art\b/i,
            /\bhand[\s-]?drawn\b/i,
            /\bboceto\b/i,
            /\bgrabado\b/i,
        ],
        fallbackPatterns: [
            /\bmanual\b/i,
            /\bartesanal\b/i,
            /\bdoodle\b/i,
            /\btrazo\b/i,
            /\btinta\b/i,
        ],
        headlineTreatment: 'El titular debe sentirse claramente integrado en un medio ilustrado lineal: gesto dibujado, contorno organico, textura de trazo o tinta y una presencia expresiva visible, nunca como texto digital neutro.',
        paragraphTreatment: 'El parrafo puede recoger una textura ligera o una energia grafica sutil del mismo medio, pero debe mantenerse limpio, claro y estable.',
        mediumProtection: 'Mantener el medio global como ilustracion lineal o dibujo; el tratamiento del texto no puede empujar la escena hacia pixel art, 3D, foto hiperrealista ni acabados de videojuego.',
        forbiddenTreatments: ['pixel art', '8-bit', 'bitmap', 'mosaicado', 'bordes escalonados', 'bisel 3D', 'render glossy'],
    },
    {
        id: 'painterly',
        label: 'pictórico',
        analysisPatterns: [
            /\bpainterly\b/i,
            /\bpaint(?:ed|ing)?\b/i,
            /\bbrush(?:ed|stroke)?\b/i,
            /\boil\b/i,
            /\bacrylic\b/i,
            /\bgouache\b/i,
            /\bwatercolor\b/i,
            /\bacuarela\b/i,
            /\bimpasto\b/i,
        ],
        fallbackPatterns: [
            /\bpincel(?:ada)?\b/i,
            /\bacuoso\b/i,
            /\btextura pictorica\b/i,
        ],
        headlineTreatment: 'El titular debe adoptar una presencia pictorica controlada: bordes vivos, texturas suaves o ritmo de pincel, siempre con lectura clara y una personalidad formal visible.',
        paragraphTreatment: 'El parrafo debe mantenerse mas limpio que el titular, con ecos minimos del medio pictorico y prioridad total a la legibilidad.',
        mediumProtection: 'Mantener el medio global como pintura o ilustracion pictorica; la tipografia no puede arrastrar la composicion hacia pixel art, lettering mecanico o bloques digitales.',
        forbiddenTreatments: ['pixel art', '8-bit', 'bitmap', 'low-res', 'grid de videojuego'],
    },
    {
        id: 'pixel-retro',
        label: 'pixel retro',
        analysisPatterns: [
            /\bpixel\b/i,
            /\b8[\s-]?bit\b/i,
            /\b16[\s-]?bit\b/i,
            /\bretro[\s-]?game\b/i,
            /\barcade\b/i,
            /\bsprite\b/i,
            /\blow[\s-]?res\b/i,
        ],
        fallbackPatterns: [
            /\bretro\b/i,
            /\bgameboy\b/i,
            /\bconsole\b/i,
        ],
        headlineTreatment: 'El titular debe integrarse con el medio retro digital usando construccion modular y ritmo sintetico coherentes con ese universo visual.',
        paragraphTreatment: 'El parrafo debe ser mas limpio y mas fino que el titular, pero aun coherente con un acabado retro de baja complejidad visual.',
        mediumProtection: 'Solo mantener pixel-retro si ese medio ha sido inferido claramente de la referencia analizada. Nunca introducirlo por una etiqueta secundaria aislada.',
        forbiddenTreatments: ['trazo sketch', 'pincel organico', 'caligrafia fluida', 'textura pictorica'],
    },
    {
        id: 'editorial-graphic',
        label: 'editorial gráfico',
        analysisPatterns: [
            /\beditorial\b/i,
            /\bposter\b/i,
            /\bmagazine\b/i,
            /\bprint\b/i,
            /\bbrutalist\b/i,
            /\bbrutal\b/i,
            /\btypographic poster\b/i,
            /\bgraphic design\b/i,
        ],
        fallbackPatterns: [
            /\bposter\b/i,
            /\bmaquetacion\b/i,
            /\bprint\b/i,
        ],
        headlineTreatment: 'El titular debe ganar una presencia editorial inequívoca: jerarquia fuerte, contraste, tension compositiva y autoridad grafica visibles, sin convertirse en lettering tematico ajeno al medio.',
        paragraphTreatment: 'El parrafo debe sostener un acabado editorial sobrio y ordenado, claramente subordinado al titular.',
        mediumProtection: 'Mantener el medio global como diseño editorial o grafico; la tipografia no puede convertir la imagen en pixel art, cartoon ni ilustracion de otro medio.',
        forbiddenTreatments: ['pixel art', '8-bit', 'cartoon bubble', 'trazo infantil'],
    },
    {
        id: 'soft-organic',
        label: 'orgánico suave',
        analysisPatterns: [
            /\bsoft\b/i,
            /\borganic\b/i,
            /\bdreamy\b/i,
            /\bpoetic\b/i,
            /\bairy\b/i,
            /\bcalm\b/i,
            /\bserene\b/i,
            /\bdelicate\b/i,
        ],
        fallbackPatterns: [
            /\borganic\b/i,
            /\bsuave\b/i,
            /\bdelicado\b/i,
            /\bsereno\b/i,
        ],
        headlineTreatment: 'El titular debe respirar el estilo con una expresividad suave y organica: ritmo relajado, contorno amable y textura fina claramente perceptibles sin exceso decorativo.',
        paragraphTreatment: 'El parrafo debe seguir la suavidad del sistema pero permanecer muy limpio, legible y sin efectos fuertes.',
        mediumProtection: 'Mantener el medio global en su suavidad y organicidad; la tipografia no puede endurecer la escena hacia pixel, brutalismo o bloques rigidos.',
        forbiddenTreatments: ['pixel art', 'bitmap', 'bloques cuadrados', 'contorno agresivo'],
    },
    {
        id: 'photographic',
        label: 'fotográfico',
        analysisPatterns: [
            /\bphotographic\b/i,
            /\bphoto(?:graph)?\b/i,
            /\brealistic\b/i,
            /\bhyperreal\b/i,
            /\bcinematic\b/i,
            /\bstudio photo\b/i,
        ],
        fallbackPatterns: [
            /\bfoto\b/i,
            /\brealista\b/i,
            /\bcinematografico\b/i,
        ],
        headlineTreatment: 'El titular debe tener presencia visual contemporanea y caracter, pero debe sentirse coherente sobre una escena fotografica real, no como texto corporativo generico ni como textura que reescribe la imagen.',
        paragraphTreatment: 'El parrafo debe ser limpio, funcional y claramente legible sobre fotografia.',
        mediumProtection: 'Mantener el medio global fotografico; la tipografia no puede transformar la escena en ilustracion, pixel art ni render artificial.',
        forbiddenTreatments: ['pixel art', 'sketch line art', 'pincel pictorico', 'low-res retro'],
    },
    {
        id: 'vector-clean',
        label: 'vectorial limpio',
        analysisPatterns: [
            /\bvector\b/i,
            /\bflat\b/i,
            /\bclean illustration\b/i,
            /\bshape-based\b/i,
            /\bminimal vector\b/i,
        ],
        fallbackPatterns: [
            /\bflat\b/i,
            /\bgeometric\b/i,
            /\bvectorial\b/i,
        ],
        headlineTreatment: 'El titular debe adoptar un acabado grafico limpio, modular y preciso, con una forma claramente integrada en la composicion vectorial.',
        paragraphTreatment: 'El parrafo debe permanecer limpio, simple y muy facil de leer dentro del sistema vectorial.',
        mediumProtection: 'Mantener el medio global limpio y vectorial; la tipografia no puede arrastrar la imagen hacia pixel art, sketch o texturas pictoricas.',
        forbiddenTreatments: ['pixel art', 'charcoal sketch', 'impasto', 'brush chaos'],
    },
    {
        id: 'three-dimensional',
        label: 'tridimensional',
        analysisPatterns: [
            /\b3d\b/i,
            /\brender(?:ed)?\b/i,
            /\bglossy\b/i,
            /\bplastic\b/i,
            /\bextrud(?:ed|e)\b/i,
            /\bvolumetric\b/i,
        ],
        fallbackPatterns: [
            /\b3d\b/i,
            /\bvolumetrico\b/i,
            /\bglossy\b/i,
        ],
        headlineTreatment: 'El titular debe asumir profundidad o relieve compatibles con un medio tridimensional cuando corresponda, sin volverse juguete ni caricatura salvo que el estilo lo pida.',
        paragraphTreatment: 'El parrafo debe ser mucho mas sobrio que el titular, con minimo relieve y maxima legibilidad.',
        mediumProtection: 'Mantener el medio global tridimensional solo cuando la referencia realmente lo indique; la tipografia no puede empujar la escena a un render artificial si la base no lo es.',
        forbiddenTreatments: ['pixel art', 'line art sketch', 'watercolor bleed'],
    },
]

function countMatches(text: string, patterns: RegExp[]): number {
    if (!text) return 0
    return patterns.reduce((acc, pattern) => acc + (pattern.test(text) ? 1 : 0), 0)
}

function inferSource(analysisScore: number, fallbackScore: number): Source {
    if (analysisScore > 0 && fallbackScore > 0) return 'mixed'
    if (analysisScore > 0) return 'analysis'
    if (fallbackScore > 0) return 'fallback'
    return 'none'
}

function inferConfidence(top: number, second: number): Confidence {
    if (top >= 8 && top >= second + 4) return 'strong'
    if (top >= 4 && top >= second + 2) return 'medium'
    return 'weak'
}

export function inferStyleMediumProfile(input: InferenceInput): StyleMediumProfile {
    const analysisText = (input.analysisText || '').toLowerCase()
    const fallbackText = (input.fallbackText || '').toLowerCase()

    const scored = MEDIUM_DEFINITIONS.map((definition) => {
        const analysisScore = countMatches(analysisText, definition.analysisPatterns) * 3
        const fallbackScore = countMatches(fallbackText, definition.fallbackPatterns)
        return {
            definition,
            analysisScore,
            fallbackScore,
            total: analysisScore + fallbackScore,
        }
    }).sort((a, b) => b.total - a.total)

    const top = scored[0]
    const second = scored[1]

    if (!top || top.total < 2) {
        return {
            id: 'neutral',
            label: 'neutral',
            confidence: 'weak',
            source: 'none',
            headlineTreatment: 'El titular puede salir de lo plano con un tratamiento visual sutil y elegante, pero sin convertirse en lettering tematico ni cambiar el medio de la imagen.',
            paragraphTreatment: 'El parrafo debe mantenerse limpio, claro, estable y claramente subordinado al titular.',
            mediumProtection: 'La tipografia solo puede afectar a las letras. Nunca puede redefinir el medio visual global de la imagen.',
            forbiddenTreatments: ['pixel art', '8-bit', 'bitmap', 'bordes escalonados salvo evidencia fuerte de referencia'],
        }
    }

    const confidence = inferConfidence(top.total, second?.total || 0)
    const source = inferSource(top.analysisScore, top.fallbackScore)

    return {
        id: top.definition.id,
        label: top.definition.label,
        confidence,
        source,
        headlineTreatment: top.definition.headlineTreatment,
        paragraphTreatment: top.definition.paragraphTreatment,
        mediumProtection: top.definition.mediumProtection,
        forbiddenTreatments: top.definition.forbiddenTreatments,
    }
}
