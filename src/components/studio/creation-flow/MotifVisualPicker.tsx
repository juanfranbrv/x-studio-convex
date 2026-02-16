'use client'

import { CSSProperties } from 'react'
import { LayoutTemplate, Route, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PickerMode = 'motif' | 'skeleton' | 'operator'

export type PreviewKind =
    | 'offer-burst'
    | 'hero-stage'
    | 'mosaic-grid'
    | 'launch-teaser'
    | 'service-blueprint'
    | 'bulletin'
    | 'event-card'
    | 'checklist-grid'
    | 'before-after'
    | 'commemoration-seal'
    | 'team-cards'
    | 'quote-poster'
    | 'hiring-spotlight'
    | 'confetti-island'
    | 'cutaway-layers'
    | 'data-spotlight'
    | 'step-flow'
    | 'definition-term'
    | 'axis-scan'
    | 'op-reading-z'
    | 'op-reading-f'
    | 'op-reading-s'
    | 'op-radial'
    | 'op-alternating-lr'
    | 'op-center-edge'
    | 'generic'

export interface VisualItem {
    _id: string
    name: string
    description?: string
    slug?: string
    structuralPrompt?: string
    promptInstruction?: string
    textZone?: string
    intentId?: string
}

interface BaseVisualPickerProps {
    items: VisualItem[]
    selectedId: string | 'auto'
    onSelect: (id: string | 'auto') => void
    mode: PickerMode
}

interface MotifVisualPickerProps {
    motifs: VisualItem[]
    selectedMotifId: string | 'auto'
    onSelect: (motifId: string | 'auto') => void
}

interface SkeletonVisualPickerProps {
    skeletons: VisualItem[]
    selectedSkeletonId: string | 'auto'
    onSelect: (skeletonId: string | 'auto') => void
}

interface OperatorVisualPickerProps {
    operators: VisualItem[]
    selectedOperatorId: string | 'auto'
    onSelect: (operatorId: string | 'auto') => void
}

const clamp2: CSSProperties = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
}

const hashSeed = (value: string): number =>
    value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 9973, 17)

const semanticScore = (text: string, rules: RegExp[]): number =>
    rules.reduce((acc, regex) => (regex.test(text) ? acc + 1 : acc), 0)

const pickSemanticKind = (text: string, mode: PickerMode): PreviewKind | null => {
    if (mode === 'operator') return null

    const scoreMap: Array<{ kind: PreviewKind; rules: RegExp[] }> = [
        { kind: 'offer-burst', rules: [/(oferta|discount|descuento|rebaja|promo|flash|precio|impacto|urgencia)/, /(burst|explosion|sale|oferta)/] },
        { kind: 'hero-stage', rules: [/(hero|protagon|escenario|showcase|spotlight|foco)/, /(centro|central|dominante|principal)/] },
        { kind: 'mosaic-grid', rules: [/(mosaico|reticula|retícula|grid|celdas|cuadrantes|modular|rejilla)/, /(bloques|modulos|módulos|cells)/] },
        { kind: 'before-after', rules: [/(comparativa|versus|before|after|antes|despues|después|split|dividido|diptico|díptico)/, /(dual|dos|columnas|mitad)/] },
        { kind: 'launch-teaser', rules: [/(lanzamiento|reveal|teaser|anticipa|anticipación|anticipacion|diagonal|zig|zeta|plegado|pliegue)/, /(impulso|velocidad|kinetic|kinetico|cinetico)/] },
        { kind: 'service-blueprint', rules: [/(servicio|blueprint|plano|planos|nodos|conectores|conexiones|flujo|route|ruta)/, /(proceso|sistema|relaciones|arquitectura)/] },
        { kind: 'bulletin', rules: [/(comunicado|bulletin|memo|aviso|notice|oficial|statement|marquesina|marquesina|cartel)/, /(texto|bloque textual|jerarquia|jerarquía)/] },
        { kind: 'event-card', rules: [/(evento|agenda|fecha|hora|timeline|calendario|countdown|save the date)/, /(cabecera|tarjeta|card)/] },
        { kind: 'checklist-grid', rules: [/(checklist|check list|lista|tareas|tasks|todo|puntos|items|ítems)/, /(orden|ordenado|ordenar|bullets|numerado)/] },
        { kind: 'commemoration-seal', rules: [/(sello|seal|badge|medalla|hito|conmemor|insignia|logro)/, /(centro|central)/] },
        { kind: 'team-cards', rules: [/(equipo|team|profiles|perfiles|cards|tarjetas|lineup|personas|talento)/, /(columna|stack|apilad)/] },
        { kind: 'quote-poster', rules: [/(cita|quote|testimonial|frase|poster|póster|tipografica|tipográfica)/, /(texto|statement)/] },
        { kind: 'hiring-spotlight', rules: [/(hiring|vacante|empleo|job|talent|talento|seleccion|selección)/, /(foco|spotlight)/] },
        { kind: 'confetti-island', rules: [/(celebr|confetti|isla|island|festiv|premio|achievement)/, /(acento|acentos|particulas|partículas)/] },
        { kind: 'cutaway-layers', rules: [/(capas|layers|superpuestas|superposicion|superposición|ventana|window|marco|frame)/, /(profundidad|depth|planos)/] },
        { kind: 'data-spotlight', rules: [/(dato|data|stat|estadistica|estadística|kpi|grafico|gráfico|barras|infografia|infografía)/, /(destacado|spotlight|foco)/] },
        { kind: 'step-flow', rules: [/(pasos|step|secuencia|timeline|proceso|recorrido|flujo|ruta)/, /(orden|progres|fase)/] },
        { kind: 'definition-term', rules: [/(definicion|definición|termino|término|glosario|concepto|enciclopedia)/, /(explicacion|explicación|termino|término)/] },
    ]

    let winner: PreviewKind | null = null
    let bestScore = 0
    for (const entry of scoreMap) {
        const score = semanticScore(text, entry.rules)
        if (score > bestScore) {
            bestScore = score
            winner = entry.kind
        }
    }
    return bestScore > 0 ? winner : null
}

const pickKind = (item: VisualItem, mode: PickerMode): PreviewKind => {
    const text = `${item.slug || ''} ${item.name || ''} ${item.description || ''} ${item.structuralPrompt || ''} ${item.promptInstruction || ''} ${item.textZone || ''} ${item.intentId || ''}`.toLowerCase()

    if (mode === 'operator') {
        const operatorChecks: Array<[RegExp, PreviewKind]> = [
            [/(reading\s*path\s*z|\bpath\s*z\b|\breading\s*z\b|\bz-like\b|\bzeta\b)/, 'op-reading-z'],
            [/(reading\s*path\s*f|\bpath\s*f\b|\breading\s*f\b|\bf-scan\b)/, 'op-reading-f'],
            [/(reading\s*path\s*s|\bpath\s*s\b|\breading\s*s\b|\bs-like\b|serpentine)/, 'op-reading-s'],
            [/(orbit|radial|circular|ring)/, 'op-radial'],
            [/(alternating|left[- ]right|left to right|lr\b)/, 'op-alternating-lr'],
            [/(center to edge|center-edge|centre to edge|pulse)/, 'op-center-edge'],
            [/(bridge|link|connect|signal)/, 'service-blueprint'],
            [/(split|dual|compare|versus)/, 'before-after'],
            [/(stack|vertical|column)/, 'team-cards'],
            [/(timeline|sequence|step)/, 'event-card'],
            [/(reading|path|ruta|scan|route|flow)/, 'step-flow'],
        ]
        for (const [regex, kind] of operatorChecks) {
            if (regex.test(text)) return kind
        }
        return 'axis-scan'
    }

    if (mode === 'skeleton') {
        const skeletonChecks: Array<[RegExp, PreviewKind]> = [
            [/(quadrant|grid|mosaic|cells|cell)/, 'mosaic-grid'],
            [/(split|bay|dual|two-column|two column)/, 'before-after'],
            [/(diagonal|fold|zig|step)/, 'launch-teaser'],
            [/(orbit|radial|ring|silent field)/, 'confetti-island'],
            [/(cards|lineup|stack|panel)/, 'team-cards'],
            [/(frame|window|cutaway|layer)/, 'cutaway-layers'],
        ]
        for (const [regex, kind] of skeletonChecks) {
            if (regex.test(text)) return kind
        }
    }

    const semanticKind = pickSemanticKind(text, mode)
    if (semanticKind) return semanticKind

    const checks: Array<[RegExp, PreviewKind]> = [
        [/(offer|burst|promo|descuento|impact|teaser)/, 'offer-burst'],
        [/(hero|showcase|stage|protagon)/, 'hero-stage'],
        [/(mosaic|catalog|catalogo|quadrant|grid spread)/, 'mosaic-grid'],
        [/(launch|reveal|anticip|window)/, 'launch-teaser'],
        [/(blueprint|service|signal|bridge|panel)/, 'service-blueprint'],
        [/(official|bulletin|statement|notice)/, 'bulletin'],
        [/(event|date|timeline|agenda)/, 'event-card'],
        [/(checklist|check list|tasks|todo)/, 'checklist-grid'],
        [/(before|after|comparison|versus|split)/, 'before-after'],
        [/(commemorat|seal|medal|badge)/, 'commemoration-seal'],
        [/(team|lineup|profile|cards)/, 'team-cards'],
        [/(quote|poster|testimonial)/, 'quote-poster'],
        [/(hiring|vacan|job|talent|spotlight)/, 'hiring-spotlight'],
        [/(confetti|achievement|celebrat|island)/, 'confetti-island'],
        [/(behind|scenes|cutaway|layers|layered)/, 'cutaway-layers'],
        [/(data|stat|figure|kpi)/, 'data-spotlight'],
        [/(step|flow|paso|ruta|path)/, 'step-flow'],
        [/(definition|term|glossary|concept)/, 'definition-term'],
    ]
    for (const [regex, kind] of checks) {
        if (regex.test(text)) return kind
    }
    return 'generic'
}

const getMeta = (mode: PickerMode) => {
    if (mode === 'skeleton') {
        return {
            label: 'Estructura',
            autoLabel: 'Auto',
            autoDescription: 'El sistema decide como distribuir el contenido para tu idea.',
            Icon: LayoutTemplate,
            emptyDescription: 'Distribucion visual base de la composicion.',
        }
    }
    if (mode === 'operator') {
        return {
            label: 'Enfoque narrativo',
            autoLabel: 'Auto',
            autoDescription: 'El sistema decide como guiar la lectura y la atencion.',
            Icon: Route,
            emptyDescription: 'Guia visual del recorrido de lectura.',
        }
    }
    return {
        label: 'Estilo visual',
        autoLabel: 'Auto',
        autoDescription: 'El sistema define el look visual que mejor encaja con tu idea.',
        Icon: Wand2,
        emptyDescription: 'Look visual dominante de la composicion.',
    }
}

const getDescripcionEs = (mode: PickerMode, kind: PreviewKind): string => {
    const map: Record<PreviewKind, string> = {
        'offer-burst': 'Enfasis central con apoyos para comunicar impacto.',
        'hero-stage': 'Elemento protagonista con bloques de apoyo secundarios.',
        'mosaic-grid': 'Composicion modular en celdas para ordenar contenido.',
        'launch-teaser': 'Recorrido en diagonal para anticipar y revelar.',
        'service-blueprint': 'Nodos conectados para explicar relaciones o flujo.',
        'bulletin': 'Estructura de comunicado con jerarquia textual clara.',
        'event-card': 'Tarjeta con cabecera y bloque destacado de evento.',
        'checklist-grid': 'Bloques ordenados para checklist o puntos clave.',
        'before-after': 'Comparativa dividida para mostrar contraste visual.',
        'commemoration-seal': 'Sello central para mensajes de logro o hito.',
        'team-cards': 'Tarjetas en columna para perfiles o equipo.',
        'quote-poster': 'Composicion tipografica para citas o declaraciones.',
        'hiring-spotlight': 'Foco principal con apoyos para captar talento.',
        'confetti-island': 'Centro destacado con acentos para celebracion.',
        'cutaway-layers': 'Capas superpuestas para dar profundidad y contexto.',
        'data-spotlight': 'Barras y llamadas para destacar datos clave.',
        'step-flow': 'Ruta guiada de lectura para secuencia o proceso.',
        'definition-term': 'Bloque de termino y area de explicacion.',
        'axis-scan': 'Lectura sobre ejes para ritmo y direccion visual.',
        'op-reading-z': 'Lectura en Z: arriba, cruce y cierre inferior.',
        'op-reading-f': 'Lectura en F: ancla vertical y cortes horizontales.',
        'op-reading-s': 'Lectura en S: recorrido curvo y progresivo.',
        'op-radial': 'Lectura radial desde el centro hacia los apoyos.',
        'op-alternating-lr': 'Lectura alterna izquierda-derecha para ritmo.',
        'op-center-edge': 'Del centro a bordes: pulso y expansion visual.',
        'generic': mode === 'operator'
            ? 'Enfoque visual para guiar el recorrido de lectura.'
            : mode === 'skeleton'
                ? 'Estructura visual para organizar la composicion.'
                : 'Estilo visual para definir el gesto de la composicion.',
    }
    return map[kind]
}

const getNombreEs = (mode: PickerMode, item: VisualItem, kind: PreviewKind): string => {
    const text = `${item.slug || ''} ${item.name || ''}`.toLowerCase()
    const byPattern: Array<[RegExp, string]> = [
        [/(reading\s*path\s*z|\bpath\s*z\b|\breading\s*z\b|\bz-like\b|\bzeta\b)/, 'Ruta de Lectura Z'],
        [/(reading\s*path\s*f|\bpath\s*f\b|\breading\s*f\b|\bf-scan\b)/, 'Ruta de Lectura F'],
        [/(reading\s*path\s*s|\bpath\s*s\b|\breading\s*s\b|\bs-like\b|serpentine)/, 'Ruta de Lectura S'],
        [/(radial|orbit|circular|ring)/, 'Ruta de Lectura Radial'],
        [/(alternating|left[- ]right|left to right|lr\b)/, 'Alternancia Izquierda-Derecha'],
        [/(center to edge|center-edge|centre to edge|pulse)/, 'Pulso Centro-Borde'],
        [/(offer|burst|promo|descuento|impact)/, 'Nucleo de Oferta Impacto'],
        [/(hero|showcase|stage)/, 'Escenario Hero'],
        [/(mosaic|catalog|catalogo|quadrant)/, 'Mosaico de Catalogo'],
        [/(launch|teaser|reveal)/, 'Revelado de Lanzamiento'],
        [/(blueprint|service)/, 'Planos de Servicio'],
        [/(official|bulletin|statement|notice)/, 'Comunicado Oficial'],
        [/(event|date|agenda|timeline)/, 'Tarjeta de Evento'],
        [/(checklist|tasks|todo)/, 'Cuadricula Checklist'],
        [/(before|after|comparison|versus|split)/, 'Comparativa Antes-Despues'],
        [/(commemorat|seal|medal|badge)/, 'Sello Conmemorativo'],
        [/(team|lineup|profile)/, 'Tarjetas de Equipo'],
        [/(quote|testimonial)/, 'Poster de Cita'],
        [/(hiring|vacan|job|talent)/, 'Foco de Talento'],
        [/(confetti|achievement|celebrat)/, 'Isla de Celebracion'],
        [/(behind|scenes|cutaway|layer)/, 'Capas Tras Bastidores'],
        [/(data|stat|figure|kpi)/, 'Dato Destacado'],
        [/(step|flow|paso|ruta|path)/, 'Flujo Paso a Paso'],
        [/(definition|term|glossary|concept)/, 'Tarjeta de Definicion'],
    ]
    for (const [regex, label] of byPattern) {
        if (regex.test(text)) return label
    }

    const kindFallback: Record<PreviewKind, string> = {
        'offer-burst': 'Nucleo de Oferta',
        'hero-stage': 'Escenario Hero',
        'mosaic-grid': 'Mosaico',
        'launch-teaser': 'Lanzamiento',
        'service-blueprint': 'Planos de Servicio',
        'bulletin': 'Comunicado',
        'event-card': 'Evento',
        'checklist-grid': 'Checklist',
        'before-after': 'Antes-Despues',
        'commemoration-seal': 'Sello',
        'team-cards': 'Equipo',
        'quote-poster': 'Cita',
        'hiring-spotlight': 'Talento',
        'confetti-island': 'Celebracion',
        'cutaway-layers': 'Capas',
        'data-spotlight': 'Dato',
        'step-flow': 'Flujo',
        'definition-term': 'Definicion',
        'axis-scan': mode === 'operator' ? 'Recorrido por Ejes' : 'Ejes',
        'op-reading-z': 'Ruta de Lectura Z',
        'op-reading-f': 'Ruta de Lectura F',
        'op-reading-s': 'Ruta de Lectura S',
        'op-radial': 'Ruta de Lectura Radial',
        'op-alternating-lr': 'Alternancia Izquierda-Derecha',
        'op-center-edge': 'Pulso Centro-Borde',
        'generic': item.name || 'Componente',
    }
    return kindFallback[kind] || item.name || 'Componente'
}

export interface CompositionPreviewData {
    kind: PreviewKind
    variant: number
    title: string
    description: string
    sectionLabel: string
}

export function getCompositionPreviewData(item: VisualItem, mode: PickerMode): CompositionPreviewData {
    const kind = pickKind(item, mode)
    const variant = hashSeed(`${item.slug || item.name}-${item._id}`) % 6
    const title = getNombreEs(mode, item, kind)
    const description = getDescripcionEs(mode, kind) || getMeta(mode).emptyDescription
    const sectionLabel = getMeta(mode).label
    return { kind, variant, title, description, sectionLabel }
}

function PreviewThumbnail({ kind, variant }: { kind: PreviewKind; variant: number }) {
    const left = variant % 2 === 0
    const isAlt = variant >= 3
    const soft = { fill: 'currentColor', fillOpacity: 0.18 }
    const medium = { fill: 'currentColor', fillOpacity: 0.34 }
    const strong = { fill: 'currentColor', fillOpacity: 0.52 }

    return (
        <svg viewBox="0 0 120 72" className="w-full h-full" aria-hidden="true">
            {kind === 'offer-burst' && (
                <>
                    <circle cx="60" cy="36" r="17" {...medium} />
                    <rect x={left ? 10 : 78} y="12" width="28" height="10" rx="5" {...soft} />
                    <rect x={left ? 82 : 10} y="50" width="28" height="10" rx="5" {...soft} />
                    <rect x="54" y="8" width="12" height="8" rx="4" {...strong} />
                    <rect x="54" y="56" width="12" height="8" rx="4" {...strong} />
                </>
            )}
            {kind === 'hero-stage' && (
                <>
                    <rect x={left ? 10 : 48} y="10" width="62" height="52" rx="12" {...medium} />
                    {isAlt ? (
                        <>
                            <rect x={left ? 14 : 58} y="46" width="40" height="10" rx="5" {...soft} />
                            <rect x={left ? 58 : 14} y="18" width="30" height="10" rx="5" {...strong} />
                        </>
                    ) : (
                        <>
                            <rect x={left ? 76 : 10} y="16" width="34" height="12" rx="6" {...soft} />
                            <rect x={left ? 76 : 10} y="34" width="24" height="8" rx="4" {...strong} />
                        </>
                    )}
                </>
            )}
            {kind === 'mosaic-grid' && (
                <>
                    {isAlt ? (
                        <>
                            <rect x="10" y="10" width="30" height="26" rx="8" {...soft} />
                            <rect x="44" y="10" width="42" height="26" rx="8" {...strong} />
                            <rect x="90" y="10" width="20" height="26" rx="8" {...medium} />
                            <rect x="10" y="40" width="38" height="22" rx="8" {...medium} />
                            <rect x="52" y="40" width="58" height="22" rx="8" {...soft} />
                        </>
                    ) : (
                        <>
                            <rect x="10" y="10" width="36" height="22" rx="8" {...medium} />
                            <rect x="50" y="10" width="26" height="22" rx="8" {...soft} />
                            <rect x="80" y="10" width="30" height="22" rx="8" {...strong} />
                            <rect x="10" y="36" width="24" height="26" rx="8" {...soft} />
                            <rect x="38" y="36" width="42" height="26" rx="8" {...strong} />
                            <rect x="84" y="36" width="26" height="26" rx="8" {...medium} />
                        </>
                    )}
                </>
            )}
            {kind === 'launch-teaser' && (
                <>
                    <rect x="14" y="12" width="92" height="48" rx="12" {...soft} />
                    <path d={left ? 'M22 52 L62 18 L98 18' : 'M98 52 L58 18 L22 18'} fill="none" stroke="currentColor" strokeWidth="6" strokeOpacity="0.45" strokeLinecap="round" />
                    <circle cx={left ? 96 : 24} cy="50" r="6" {...strong} />
                </>
            )}
            {kind === 'service-blueprint' && (
                <>
                    {isAlt ? (
                        <>
                            <circle cx="20" cy="50" r="8" {...soft} />
                            <circle cx="54" cy="24" r="8" {...strong} />
                            <circle cx="96" cy="36" r="8" {...medium} />
                            <path d="M28 46 L48 28 M62 26 L88 34" fill="none" stroke="currentColor" strokeWidth="6" strokeOpacity="0.45" strokeLinecap="round" />
                            <rect x="18" y="14" width="28" height="8" rx="4" {...soft} />
                        </>
                    ) : (
                        <>
                            <circle cx="24" cy="22" r="8" {...medium} />
                            <circle cx="60" cy="36" r="8" {...strong} />
                            <circle cx="96" cy="50" r="8" {...soft} />
                            <path d="M30 24 L54 34 M66 38 L90 48" fill="none" stroke="currentColor" strokeWidth="6" strokeOpacity="0.45" strokeLinecap="round" />
                            <rect x="44" y="12" width="24" height="8" rx="4" {...soft} />
                        </>
                    )}
                </>
            )}
            {kind === 'bulletin' && (
                <>
                    <rect x="14" y="12" width="92" height="48" rx="12" {...soft} />
                    <rect x="22" y="20" width="46" height="8" rx="4" {...strong} />
                    <rect x="22" y="34" width="76" height="7" rx="3.5" {...medium} />
                    <rect x="22" y="46" width="58" height="7" rx="3.5" {...medium} />
                </>
            )}
            {kind === 'event-card' && (
                <>
                    <rect x="14" y="12" width="92" height="48" rx="12" {...soft} />
                    <rect x="14" y="12" width="92" height="12" rx="12" {...medium} />
                    <circle cx={left ? 24 : 96} cy="18" r="4" {...strong} />
                    <rect x="24" y="32" width="36" height="16" rx="8" {...strong} />
                    <rect x="66" y="34" width="30" height="7" rx="3.5" {...medium} />
                </>
            )}
            {kind === 'checklist-grid' && (
                <>
                    <rect x="12" y="12" width="44" height="22" rx="8" {...soft} />
                    <rect x="64" y="12" width="44" height="22" rx="8" {...medium} />
                    <rect x="12" y="40" width="44" height="20" rx="8" {...medium} />
                    <rect x="64" y="40" width="44" height="20" rx="8" {...soft} />
                    <circle cx="22" cy="23" r="3.5" {...strong} />
                    <circle cx="74" cy="23" r="3.5" {...strong} />
                </>
            )}
            {kind === 'before-after' && (
                <>
                    <rect x="12" y="10" width="96" height="52" rx="12" {...soft} />
                    {isAlt ? (
                        <>
                            <rect x="16" y="12" width="40" height="48" rx="10" {...soft} />
                            <rect x="64" y="12" width="40" height="48" rx="10" {...medium} />
                            <path d="M60 18v36" fill="none" stroke="currentColor" strokeWidth="6" strokeOpacity="0.45" />
                        </>
                    ) : (
                        <>
                            <rect x={left ? 14 : 60} y="12" width="46" height="48" rx="10" {...medium} />
                            <rect x={left ? 60 : 14} y="12" width="46" height="48" rx="10" {...soft} />
                            <path d="M60 22v28" fill="none" stroke="currentColor" strokeWidth="5" strokeOpacity="0.45" />
                        </>
                    )}
                </>
            )}
            {kind === 'commemoration-seal' && (
                <>
                    <circle cx="60" cy="34" r="18" {...medium} />
                    <circle cx="60" cy="34" r="8" {...strong} />
                    <path d="M50 52 L56 64 L60 58 L64 64 L70 52" fill="currentColor" fillOpacity="0.34" />
                </>
            )}
            {kind === 'team-cards' && (
                <>
                    <rect x="10" y="10" width="32" height="52" rx="10" {...medium} />
                    <rect x="46" y="10" width="32" height="52" rx="10" {...soft} />
                    <rect x="82" y="10" width="28" height="52" rx="10" {...strong} />
                    <rect x="18" y="20" width="16" height="16" rx="8" {...strong} />
                    <rect x="54" y="20" width="16" height="16" rx="8" {...medium} />
                </>
            )}
            {kind === 'quote-poster' && (
                <>
                    <rect x="14" y="12" width="92" height="48" rx="12" {...soft} />
                    <rect x="24" y="22" width="12" height="10" rx="3" {...strong} />
                    <rect x="42" y="22" width="12" height="10" rx="3" {...strong} />
                    <rect x="24" y="40" width="72" height="8" rx="4" {...medium} />
                </>
            )}
            {kind === 'hiring-spotlight' && (
                <>
                    <circle cx={left ? 36 : 84} cy="30" r="16" {...medium} />
                    <rect x={left ? 62 : 16} y="18" width="42" height="8" rx="4" {...soft} />
                    <rect x={left ? 62 : 16} y="32" width="28" height="8" rx="4" {...strong} />
                    <rect x={left ? 20 : 72} y="50" width="30" height="8" rx="4" {...soft} />
                </>
            )}
            {kind === 'confetti-island' && (
                <>
                    <rect x="20" y="30" width="80" height="28" rx="14" {...medium} />
                    <circle cx="30" cy="20" r="4" {...strong} />
                    <circle cx="52" cy="14" r="3" {...soft} />
                    <circle cx="78" cy="18" r="5" {...strong} />
                    <circle cx="96" cy="22" r="3" {...soft} />
                </>
            )}
            {kind === 'cutaway-layers' && (
                <>
                    <rect x="14" y="14" width="72" height="44" rx="10" {...soft} />
                    <rect x="24" y="10" width="72" height="44" rx="10" {...medium} />
                    <rect x="34" y="6" width="72" height="44" rx="10" {...strong} />
                </>
            )}
            {kind === 'data-spotlight' && (
                <>
                    <rect x="16" y="40" width="14" height="18" rx="4" {...soft} />
                    <rect x="36" y="32" width="14" height="26" rx="4" {...medium} />
                    <rect x="56" y="22" width="14" height="36" rx="4" {...strong} />
                    <rect x="76" y="28" width="28" height="10" rx="5" {...soft} />
                    <rect x="76" y="44" width="22" height="8" rx="4" {...medium} />
                </>
            )}
            {kind === 'step-flow' && (
                <>
                    <circle cx="20" cy="20" r="8" {...medium} />
                    <circle cx="60" cy="36" r="8" {...strong} />
                    <circle cx="100" cy="52" r="8" {...soft} />
                    <path d="M28 24 L52 32 M68 40 L92 48" fill="none" stroke="currentColor" strokeWidth="6" strokeOpacity="0.45" strokeLinecap="round" />
                </>
            )}
            {kind === 'definition-term' && (
                <>
                    <rect x="14" y="14" width="30" height="44" rx="8" {...strong} />
                    <rect x="50" y="16" width="56" height="12" rx="6" {...medium} />
                    <rect x="50" y="34" width="44" height="8" rx="4" {...soft} />
                    <rect x="50" y="46" width="50" height="8" rx="4" {...soft} />
                </>
            )}
            {kind === 'axis-scan' && (
                <>
                    <rect x="14" y="14" width="92" height="44" rx="12" {...soft} />
                    <rect x={left ? 18 : 86} y="18" width="16" height="36" rx="8" {...strong} />
                    <rect x={left ? 40 : 18} y="24" width="28" height="8" rx="4" {...medium} />
                    <rect x={left ? 40 : 18} y="40" width="42" height="8" rx="4" {...medium} />
                </>
            )}
            {kind === 'op-reading-z' && (
                <>
                    <circle cx="20" cy="18" r="6" {...strong} />
                    <circle cx="98" cy="18" r="6" {...medium} />
                    <circle cx="28" cy="52" r="6" {...medium} />
                    <circle cx="100" cy="52" r="6" {...soft} />
                    <path d="M26 18H92L34 52H94" fill="none" stroke="currentColor" strokeWidth="6" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}
            {kind === 'op-reading-f' && (
                <>
                    <rect x="18" y="14" width="14" height="44" rx="7" {...strong} />
                    <rect x="36" y="16" width="58" height="9" rx="4.5" {...medium} />
                    <rect x="36" y="33" width="44" height="9" rx="4.5" {...medium} />
                    <rect x="36" y="50" width="30" height="8" rx="4" {...soft} />
                </>
            )}
            {kind === 'op-reading-s' && (
                <>
                    <circle cx="24" cy="18" r="6" {...strong} />
                    <circle cx="82" cy="22" r="6" {...medium} />
                    <circle cx="38" cy="50" r="6" {...medium} />
                    <circle cx="96" cy="54" r="6" {...soft} />
                    <path d="M30 18C48 10 72 10 82 22C90 30 56 38 40 48C30 54 66 60 90 54" fill="none" stroke="currentColor" strokeWidth="6" strokeOpacity="0.5" strokeLinecap="round" />
                </>
            )}
            {kind === 'op-radial' && (
                <>
                    <circle cx="60" cy="36" r="10" {...strong} />
                    <circle cx="24" cy="20" r="5" {...medium} />
                    <circle cx="98" cy="20" r="5" {...medium} />
                    <circle cx="24" cy="54" r="5" {...soft} />
                    <circle cx="98" cy="54" r="5" {...soft} />
                    <path d="M31 23L52 31M89 23L68 31M31 51L52 41M89 51L68 41" fill="none" stroke="currentColor" strokeWidth="5" strokeOpacity="0.45" strokeLinecap="round" />
                </>
            )}
            {kind === 'op-alternating-lr' && (
                <>
                    <rect x="14" y="14" width="92" height="44" rx="12" {...soft} />
                    <rect x={left ? 18 : 58} y="18" width="44" height="8" rx="4" {...strong} />
                    <rect x={left ? 58 : 18} y="30" width="44" height="8" rx="4" {...medium} />
                    <rect x={left ? 18 : 58} y="42" width="44" height="8" rx="4" {...strong} />
                </>
            )}
            {kind === 'op-center-edge' && (
                <>
                    <circle cx="60" cy="36" r="10" {...strong} />
                    <rect x="16" y="24" width="26" height="8" rx="4" {...medium} />
                    <rect x="16" y="40" width="26" height="8" rx="4" {...soft} />
                    <rect x="78" y="24" width="26" height="8" rx="4" {...medium} />
                    <rect x="78" y="40" width="26" height="8" rx="4" {...soft} />
                    <path d="M50 34L42 28M50 38L42 44M70 34L78 28M70 38L78 44" fill="none" stroke="currentColor" strokeWidth="4.5" strokeOpacity="0.45" strokeLinecap="round" />
                </>
            )}
            {kind === 'generic' && (
                <>
                    <rect x="12" y="12" width="46" height="22" rx="8" {...medium} />
                    <rect x="62" y="12" width="46" height="22" rx="8" {...soft} />
                    <rect x="12" y="38" width="96" height="22" rx="10" {...strong} />
                </>
            )}
        </svg>
    )
}

export function CompositionPreviewThumbnail({
    data,
    className,
    style,
}: {
    data: CompositionPreviewData
    className?: string
    style?: CSSProperties
}) {
    return (
        <div className={cn("rounded-md bg-primary/10 text-primary overflow-hidden", className)} style={style}>
            <PreviewThumbnail kind={data.kind} variant={data.variant} />
        </div>
    )
}

function CompositionVisualPicker({ items, selectedId, onSelect, mode }: BaseVisualPickerProps) {
    const meta = getMeta(mode)
    const MetaIcon = meta.Icon

    return (
        <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                {meta.label}
            </p>
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => onSelect('auto')}
                    className={cn(
                        'rounded-xl border p-2.5 text-left transition-all duration-200',
                        selectedId === 'auto'
                            ? 'border-primary/35 bg-primary/10'
                            : 'border-border hover:border-primary/25 hover:bg-primary/5'
                    )}
                >
                    <div className="h-[56px] rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <MetaIcon className="w-7 h-7" />
                    </div>
                    <p className="text-[11px] font-semibold leading-tight mt-1.5">{meta.autoLabel}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-1" style={clamp2}>
                        {meta.autoDescription}
                    </p>
                </button>

                {items.map((item) => {
                    const isActive = selectedId === item._id
                    const kind = pickKind(item, mode)
                    const variant = hashSeed(`${item.slug || item.name}-${item._id}`) % 3
                    const descripcionEs = getDescripcionEs(mode, kind)
                    const nombreEs = getNombreEs(mode, item, kind)

                    return (
                        <button
                            key={item._id}
                            type="button"
                            onClick={() => onSelect(item._id)}
                            className={cn(
                                'rounded-xl border p-2.5 text-left transition-all duration-200',
                                isActive
                                    ? 'border-primary/35 bg-primary/10'
                                    : 'border-border hover:border-primary/25 hover:bg-primary/5'
                            )}
                            title={`${nombreEs}. ${descripcionEs}`}
                        >
                            <div className="h-[56px] rounded-lg bg-primary/10 px-1.5 py-1 text-primary">
                                <PreviewThumbnail kind={kind} variant={variant} />
                            </div>
                            <p className="text-[11px] font-semibold leading-tight mt-1.5">{nombreEs}</p>
                            <p className="text-[10px] text-muted-foreground leading-tight mt-1" style={clamp2}>
                                {descripcionEs || meta.emptyDescription}
                            </p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export function MotifVisualPicker({ motifs, selectedMotifId, onSelect }: MotifVisualPickerProps) {
    return (
        <CompositionVisualPicker
            items={motifs}
            selectedId={selectedMotifId}
            onSelect={onSelect}
            mode="motif"
        />
    )
}

export function SkeletonVisualPicker({ skeletons, selectedSkeletonId, onSelect }: SkeletonVisualPickerProps) {
    return (
        <CompositionVisualPicker
            items={skeletons}
            selectedId={selectedSkeletonId}
            onSelect={onSelect}
            mode="skeleton"
        />
    )
}

export function OperatorVisualPicker({ operators, selectedOperatorId, onSelect }: OperatorVisualPickerProps) {
    return (
        <CompositionVisualPicker
            items={operators}
            selectedId={selectedOperatorId}
            onSelect={onSelect}
            mode="operator"
        />
    )
}
