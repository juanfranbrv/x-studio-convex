import { buildTypographyContract } from '@/lib/prompts/priorities/p09-brand-dna'
import { inferStyleMediumProfile } from '@/lib/prompts/image-generation/style-medium-profile'

type FontInput = string | { family?: string; role?: 'heading' | 'body' | string } | null | undefined

type TypographyInstructionOptions = {
    selectedStyles?: string[]
    customStyle?: string
    applyStyleToTypography?: boolean
    styleAnalysisKeywords?: string[]
    styleAnalysisSubject?: string
}

type TypographyFingerprint = {
    familyClass: string
    formalCharacter: string
    strokeLogic: string
    edgeLanguage: string
    contrastModel: string
    textureMemory: string
    paragraphCompanion: string
}

function buildAnalysisText(options?: TypographyInstructionOptions): string {
    return [
        options?.styleAnalysisSubject || '',
        ...(options?.styleAnalysisKeywords || []),
    ].join(' ').toLowerCase()
}

function buildFallbackStyleText(options?: TypographyInstructionOptions): string {
    return [
        ...(options?.selectedStyles || []),
        options?.customStyle || '',
    ].join(' ').toLowerCase()
}

function deriveTypographyFingerprint(options?: TypographyInstructionOptions): TypographyFingerprint {
    const analysisText = buildAnalysisText(options)
    const fallbackText = buildFallbackStyleText(options)
    const profile = inferStyleMediumProfile({
        analysisText,
        fallbackText,
    })

    const combined = [analysisText, fallbackText].filter(Boolean).join(' ')
    const hasScript = /\b(calligraph|script|lettering|signpaint|handletter|hand letter|chalk|brush pen|cursive|journal|notebook|notes|cuaderno|apuntes)\b/.test(combined)
    const hasEngraved = /\b(engraving|etching|etched|etch|grabado|crosshatch|hatching|incision)\b/.test(combined)
    const hasPlayful = /\b(comic|comix|cartoon|playful|naive|doodle|kid|infantil)\b/.test(combined)

    if (hasScript) {
        return {
            familyClass: 'script-display, hand-lettered humanist o cursiva editorial',
            formalCharacter: 'autoral, gestual, manuscrito, humano y claramente dibujado',
            strokeLogic: 'ritmo fluido con modulacion natural de presion',
            edgeLanguage: 'vivo, ligeramente irregular y guiado por mano',
            contrastModel: 'contraste medio con entradas y salidas visibles',
            textureMemory: 'memoria de tinta, lapiz o cuaderno integrada con sutileza',
            paragraphCompanion: 'companero de lectura mas limpio pero de la misma familia autoral',
        }
    }

    if (hasEngraved) {
        return {
            familyClass: 'serif grabada, serif literaria tallada o display etched',
            formalCharacter: 'clasico, ilustrado, culto y artesanal',
            strokeLogic: 'tallos deliberados con interior grabado o memoria de tramado',
            edgeLanguage: 'preciso, ligeramente tallado y visiblemente construido',
            contrastModel: 'contraste medio-alto con proporciones elegantes',
            textureMemory: 'hachurado fino o relleno grabado en el titular, mas contenido en el parrafo',
            paragraphCompanion: 'companero literario mas sereno dentro del mismo mundo tipografico',
        }
    }

    if (hasPlayful) {
        return {
            familyClass: 'display dibujada o humanista expresiva con energia ilustrada',
            formalCharacter: 'calido, narrativo, cercano y con gesto',
            strokeLogic: 'irregularidad controlada y ritmo animado',
            edgeLanguage: 'dibujado y con caracter, nunca corporativo plano',
            contrastModel: 'contraste bajo o medio con silueta muy clara',
            textureMemory: 'recuerdo sutil de doodle, marker o ilustracion',
            paragraphCompanion: 'companero mas simple pero del mismo tono ilustrado',
        }
    }

    const byMedium: Record<string, TypographyFingerprint> = {
        'line-illustration': {
            familyClass: 'serif ilustrada o humanista display ilustrada',
            formalCharacter: 'dibujado, literario, artesanal y autoral',
            strokeLogic: 'modulacion visible de pluma o tinta con leve irregularidad',
            edgeLanguage: 'nitido pero vivo, no geometrico-plano',
            contrastModel: 'contraste medio con sabor caligrafico o grabado',
            textureMemory: 'trazo, grano de tinta o contorno dibujado integrado en las letras',
            paragraphCompanion: 'companero mas calmado del mismo lenguaje ilustrado',
        },
        painterly: {
            familyClass: 'serif expresiva o display suave de modulacion pictorica',
            formalCharacter: 'material, artistico, tactil y compuesto',
            strokeLogic: 'modulacion suave y bordes con memoria de pincel',
            edgeLanguage: 'visiblemente trabajado, nunca esteril',
            contrastModel: 'contraste medio o medio-alto',
            textureMemory: 'huella de pigmento o pincel en el titular, mas limpia en el parrafo',
            paragraphCompanion: 'companero sobrio dentro del mismo clima pictorico',
        },
        'pixel-retro': {
            familyClass: 'display retro digital',
            formalCharacter: 'sintetico, modular y de silueta compacta',
            strokeLogic: 'construccion discreta y ritmo sintetico',
            edgeLanguage: 'duro o escalonado solo si la referencia lo exige de verdad',
            contrastModel: 'contraste bajo con gran claridad de silueta',
            textureMemory: 'acabado retro digital controlado',
            paragraphCompanion: 'companero mas simple del mismo sistema retro',
        },
        'editorial-graphic': {
            familyClass: 'serif editorial, serif poster o display sans autoritativa',
            formalCharacter: 'disenado, mandatorio, publicable y con voz grafica',
            strokeLogic: 'transiciones deliberadas y silueta fuerte',
            edgeLanguage: 'afilado, limpio e intencional',
            contrastModel: 'contraste medio-alto',
            textureMemory: 'acabado grafico controlado sin perder premium',
            paragraphCompanion: 'companero editorial sobrio y menos dramatico',
        },
        'soft-organic': {
            familyClass: 'sans humanista suave o serif organica calida',
            formalCharacter: 'amable, respirable, humano y suavemente expresivo',
            strokeLogic: 'ritmo suave con modulacion ligera',
            edgeLanguage: 'contornos blandos y acogedores',
            contrastModel: 'contraste bajo o medio',
            textureMemory: 'textura minima y delicada',
            paragraphCompanion: 'companero limpio del mismo tono calido',
        },
        photographic: {
            familyClass: 'sans editorial contemporanea o serif refinada de alta credibilidad',
            formalCharacter: 'moderno, seguro, limpio y verosimil',
            strokeLogic: 'construccion controlada y precisa',
            edgeLanguage: 'estable y nitido',
            contrastModel: 'contraste medio con lectura excelente',
            textureMemory: 'textura muy contenida para convivir con fotografia',
            paragraphCompanion: 'companero muy legible dentro del mismo sistema',
        },
        'vector-clean': {
            familyClass: 'sans geometrico-humanista o display modular limpia',
            formalCharacter: 'preciso, ordenado, grafico y contemporaneo',
            strokeLogic: 'consistente, racional y guiado por forma',
            edgeLanguage: 'limpio, suave y exacto',
            contrastModel: 'contraste bajo o medio',
            textureMemory: 'minima, apoyada en forma y jerarquia',
            paragraphCompanion: 'companero simple del mismo sistema limpio',
        },
        'three-dimensional': {
            familyClass: 'display dimensional o serif/sans escultorica compatible con volumen',
            formalCharacter: 'volumetrico, cinematografico y premium',
            strokeLogic: 'construccion estable apta para profundidad',
            edgeLanguage: 'bordes de volumen limpios, no cartoon',
            contrastModel: 'contraste medio con claves de profundidad',
            textureMemory: 'acabado dimensional solo si la referencia lo respalda',
            paragraphCompanion: 'companero mas plano y limpio dentro del mismo tono',
        },
        neutral: {
            familyClass: 'display contemporanea refinada con personalidad',
            formalCharacter: 'moderno, estable, expresivo y controlado',
            strokeLogic: 'preciso y muy legible',
            edgeLanguage: 'limpio y coherente',
            contrastModel: 'contraste medio',
            textureMemory: 'acabado contenido y compatible con estilo',
            paragraphCompanion: 'companero mas sereno de la misma voz tipografica',
        },
    }

    return byMedium[profile.id] || byMedium.neutral
}

function buildTypographyFingerprintBlock(options?: TypographyInstructionOptions): string {
    const fingerprint = deriveTypographyFingerprint(options)

    return [
        'FINGERPRINT TIPOGRAFICO (BLOQUEANTE):',
        '- Este fingerprint debe derivarse primariamente del ANALISIS de la imagen de estilo y solo secundariamente de etiquetas o estilo manual.',
        '- Elige la familia una sola vez desde este fingerprint y manten esa misma logica entre titular y parrafo.',
        '- El parrafo no puede caer a una tipografia generica ajena; debe ser el companero de lectura del mismo mundo tipografico.',
        `- FAMILY CLASS: ${fingerprint.familyClass}.`,
        `- FORMAL CHARACTER: ${fingerprint.formalCharacter}.`,
        `- STROKE LOGIC: ${fingerprint.strokeLogic}.`,
        `- EDGE LANGUAGE: ${fingerprint.edgeLanguage}.`,
        `- CONTRAST MODEL: ${fingerprint.contrastModel}.`,
        `- TEXTURE MEMORY: ${fingerprint.textureMemory}.`,
        `- PARAGRAPH COMPANION: ${fingerprint.paragraphCompanion}.`,
    ].join('\n')
}

function normalizeFonts(fonts: FontInput[]): { family: string; role?: 'heading' | 'body' }[] {
    return fonts
        .map((font) => {
            if (typeof font === 'string') {
                const family = font.trim()
                return family ? { family } : null
            }

            if (!font || typeof font !== 'object') return null

            const family = (font.family || '').trim()
            if (!family) return null

            const role = font.role === 'heading' || font.role === 'body' ? font.role : undefined
            return { family, role }
        })
        .filter((font): font is { family: string; role?: 'heading' | 'body' } => Boolean(font))
}

function buildDisabledDirective(): string {
    return [
        'TRATAMIENTO TIPOGRAFICO:',
        '- Mantener la tipografia definida por el Kit de Marca para titular y parrafo.',
        '- La familia tipografica del Kit de Marca es obligatoria cuando esta opcion esta apagada. No sustituirla por otra familia, ni reinterpretarla libremente.',
        '- El texto puede recoger un acabado visual sutil coherente con la imagen, pero sin cambiar la familia tipografica marcada por la marca.',
        '- Los ajustes permitidos en este modo son de acabado: peso, escala, espaciado, color, contorno o pequenos recursos expresivos compatibles con la escena.',
        '- Los ajustes NO permitidos en este modo son cambiar la familia tipografica, mezclar familias nuevas o dejar que el estilo visual elija una fuente distinta.',
        '- No renderizar el texto como tipografia plana de interfaz pegada encima de la imagen.',
        '- El titular puede tener presencia editorial o pequenos adornos compatibles con la escena, sin perder legibilidad.',
        '- El parrafo debe seguir siendo claro, ordenado y muy legible en movil.'
    ].join('\n')
}

function buildEnabledDirective(options?: TypographyInstructionOptions): string {
    const profile = inferStyleMediumProfile({
        analysisText: buildAnalysisText(options),
        fallbackText: buildFallbackStyleText(options),
    })

    return [
        'TRATAMIENTO TIPOGRAFICO:',
        '- Regla central: el texto debe adaptarse al estilo visual dominante de la imagen. No es un elemento independiente ni una capa ajena.',
        profile.source === 'analysis' || profile.source === 'mixed'
            ? `- El medio visual dominante detectado para la referencia es "${profile.label}". La tipografia debe adaptarse a ese medio, no redefinirlo.`
            : '- Si no hay analisis suficiente de referencia, usar el estilo seleccionado solo como guia secundaria del tratamiento tipografico.',
        '- La transferencia de estilo global de la imagen ya viene definida por la referencia y debe permanecer intacta.',
        '- Esta capa solo gobierna el render del texto. No puede alterar ilustracion, textura, acabado, resolucion ni medio visual del resto de la escena.',
        '- El titular y el parrafo deben parecer nacidos del mismo lenguaje visual que la imagen: mismo universo estetico, misma sensibilidad material y misma direccion de arte.',
        '- Cuando la referencia sea expresiva, ilustrada, editorial, artesanal, retro o claramente estilizada, el titular NO puede resolverse como texto corporativo neutro o sans plana por defecto.',
        '- El titular debe mostrar una adaptacion visible al estilo: eleccion de familia, ritmo, contraste, silhouette, remates, modulacion, tension o gesto formal propios del medio detectado.',
        '- Si el estilo visual es fuerte, un titular demasiado neutro se considera un fallo. El resultado debe sentirse deliberadamente disenado, no simplemente escrito.',
        `- ${profile.headlineTreatment}`,
        `- ${profile.paragraphTreatment}`,
        '- Proteger siempre la coherencia del medio ya establecido por la referencia. La tipografia debe reforzar ese lenguaje visual, no arrastrar la escena hacia otro sistema grafico.',
        '- El texto debe sentirse disenado dentro de la escena, no pegado como una interfaz, pero sin secuestrar la direccion de arte global.',
        '- Priorizar contraste, lectura rapida y nitidez del texto por encima del efecto visual.',
        '- El parrafo puede heredar rasgos del estilo, pero siempre con una intensidad menor que el titular y con prioridad absoluta a la legibilidad.',
        '- Nunca renderizar nombres de fuentes ni etiquetas internas como texto visible (por ejemplo Google Sans Flex, HEADLINE_FONT o BODY_FONT).',
        '- Con esta opcion activa, la tipografia ya no viene fijada por el Kit de Marca: el modelo debe elegir la familia y el estilismo que mejor encajen con el estilo visual dominante.'
    ].join('\n')
}

export function buildTypographyInstructions(fonts: FontInput[], options?: TypographyInstructionOptions): string {
    const interpretationGuard = [
        'INTERPRETACION DEL CONTRATO TIPOGRAFICO:',
        '- La familia tipografica de marca define coherencia, jerarquia y tono, no una textura literal ni un medio visual concreto.',
        '- Terminos como geometric, bold o structural deben interpretarse como claridad, presencia y construccion precisa de la letra.',
        '- Mantener siempre la nitidez del texto y la coherencia con el medio visual de la referencia analizada.'
    ].join('\n')

    if (options?.applyStyleToTypography) {
        const freeTypographySelection = [
            'SELECCION TIPOGRAFICA GUIADA POR EL ESTILO:',
            '- Con esta opcion activa, NO uses la familia tipografica del Kit de Marca como restriccion.',
            '- Elige la tipografia del titular y del parrafo en funcion del estilo visual dominante de la imagen.',
            '- Debes decidir familia, peso, remates, contraste, contorno, silhouette y tratamiento visual del texto para integrarlo en la direccion de arte.',
            '- El titular debe separarse visiblemente de una solucion generica de interfaz. Si la referencia tiene personalidad visual, la tipografia tambien debe tenerla.',
            '- Solo en referencias claramente neutras o minimalistas se permite una resolucion tipografica sobria.',
            '- Mantener siempre jerarquia clara y alta legibilidad, sobre todo en el parrafo.',
            '- No renderices nombres de fuente ni tokens internos como texto visible.'
        ].join('\n')

        return `\n${interpretationGuard}\n${freeTypographySelection}\n${buildTypographyFingerprintBlock(options)}\n${buildEnabledDirective(options)}\n`
    }

    const normalized = normalizeFonts(fonts || [])
    if (normalized.length === 0) {
        return `\n${interpretationGuard}\n${buildDisabledDirective()}\n`
    }

    return `\n${buildTypographyContract(normalized)}\n${interpretationGuard}\n${buildDisabledDirective()}\n`
}
