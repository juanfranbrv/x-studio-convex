import type { LayoutOption } from './creation-flow-types'

type LayoutInput = Pick<LayoutOption, 'id' | 'name' | 'description' | 'structuralPrompt' | 'promptInstruction' | 'textZone'>

type IconShape =
  | { type: 'rect'; x: number; y: number; w: number; h: number; r?: number; o: number }
  | { type: 'circle'; cx: number; cy: number; r: number; o: number }

const normalize = (value?: string | null) => (value || '').toLowerCase()

const diversifyKind = (kind: string, seed: number): string => {
  const pick = (options: string[]) => options[seed % options.length]
  if (kind === 'grid') return pick(['grid', 'bento', 'columns', 'gallery'])
  if (kind === 'cards') return pick(['cards', 'grid', 'frame', 'bento'])
  if (kind === 'hero') return pick(['hero', 'frame', 'cards', 'spotlight', 'badge'])
  if (kind === 'frame') return pick(['frame', 'hero', 'banner'])
  if (kind === 'list') return pick(['list', 'stats', 'timeline'])
  if (kind === 'timeline') return pick(['timeline', 'diagonal', 'map'])
  if (kind === 'banner') return pick(['banner', 'tag', 'burst'])
  if (kind === 'radial') return pick(['radial', 'badge', 'burst'])
  if (kind === 'columns') return pick(['columns', 'grid', 'cards'])
  if (kind === 'split') return pick(['split', 'banner', 'frame'])
  return kind
}

const pickKind = (layout: LayoutInput): string => {
  const text = `${layout.id} ${layout.name} ${layout.description} ${layout.structuralPrompt} ${layout.promptInstruction}`.toLowerCase()
  const has = (re: RegExp) => re.test(text)

  if (has(/(before|after|antes|despues|después|comparativa|versus|split|diptico|díptico|dual)/)) return 'split'
  if (has(/(urgencia|urgency|impacto|flash|alerta|explosion|explosión|boom|energia|energía|shock)/)) return 'burst'
  if (has(/(oferta|precio|descuento|promo|promotion|tag|etiqueta|sale|deal|rebaja|rebajas|pack|bundle)/)) return 'tag'
  if (has(/(mapa|map|conexion|conexiones|network|hub|ecosistema|nodos|nodes|ruta|route)/)) return 'map'
  if (has(/(spotlight|retrato|portrait|perfil|persona|personas|equipo|team|staff)/)) return 'spotlight'
  if (has(/(quote|cita|frase|testimonio|testimonial)/)) return 'quote'
  if (has(/(dato|estadistica|métrica|metric|stats|numeros|números|insight)/)) return 'stats'
  if (has(/(galeria|galería|collage|album|álbum|muestra|showcase)/)) return 'gallery'
  if (has(/(logo|sello|insignia|badge|emblema)/)) return 'badge'
  if (has(/(grid|mosaic|reticula|retícula|cuadrantes|catalogo|catálogo|cells|rejilla|modular)/)) return 'grid'
  if (has(/(timeline|pasos|step|secuencia|proceso|ruta|recorrido|flujo|flow)/)) return 'timeline'
  if (has(/(checklist|lista|bullets|items|puntos|ranking|ordenado)/)) return 'list'
  if (has(/(radial|orbita|órbita|circular|anillo|ring)/)) return 'radial'
  if (has(/(diagonal|zig|zeta|serpentin|serpenteante|s-?curve)/)) return 'diagonal'
  if (has(/(banner|horizontal|franja|tira|marquesina)/)) return 'banner'
  if (has(/(cards|tarjetas|stack|apilad|deck|paneles)/)) return 'cards'
  if (has(/(hero|protagon|foco|spotlight|dominante|escenario)/)) return 'hero'
  if (has(/(frame|marco|borde|window|ventana)/)) return 'frame'
  if (has(/(column|columna|rail|carril)/)) return 'columns'
  if (has(/(bento|tiles|mosaico|isla|satelite|satélite|capsula|cápsula)/)) return 'bento'
  return 'auto'
}

const addTextZone = (zone: LayoutInput['textZone'], shapes: IconShape[]) => {
  const z = normalize(zone)
  if (!z) return
  if (z === 'top') shapes.push({ type: 'rect', x: 10, y: 8, w: 100, h: 12, r: 6, o: 0.6 })
  if (z === 'bottom') shapes.push({ type: 'rect', x: 10, y: 60, w: 100, h: 12, r: 6, o: 0.6 })
  if (z === 'left') shapes.push({ type: 'rect', x: 8, y: 10, w: 26, h: 60, r: 8, o: 0.6 })
  if (z === 'right') shapes.push({ type: 'rect', x: 86, y: 10, w: 26, h: 60, r: 8, o: 0.6 })
  if (z === 'center') shapes.push({ type: 'rect', x: 32, y: 30, w: 56, h: 20, r: 10, o: 0.6 })
  if (z === 'top-left') shapes.push({ type: 'rect', x: 8, y: 8, w: 40, h: 18, r: 8, o: 0.6 })
  if (z === 'top-right') shapes.push({ type: 'rect', x: 72, y: 8, w: 40, h: 18, r: 8, o: 0.6 })
  if (z === 'bottom-left') shapes.push({ type: 'rect', x: 8, y: 54, w: 40, h: 18, r: 8, o: 0.6 })
  if (z === 'bottom-right') shapes.push({ type: 'rect', x: 72, y: 54, w: 40, h: 18, r: 8, o: 0.6 })
  if (z === 'overlay') shapes.push({ type: 'rect', x: 20, y: 26, w: 80, h: 28, r: 12, o: 0.45 })
}

const buildShapes = (kind: string, zone: LayoutInput['textZone'], seed: number): IconShape[] => {
  const shapes: IconShape[] = []
  const v = seed % 5

  if (kind === 'split') {
    if (v === 0) {
      shapes.push({ type: 'rect', x: 8, y: 10, w: 50, h: 60, r: 10, o: 0.4 })
      shapes.push({ type: 'rect', x: 62, y: 10, w: 50, h: 60, r: 10, o: 0.7 })
    } else if (v === 1) {
      shapes.push({ type: 'rect', x: 8, y: 10, w: 38, h: 60, r: 10, o: 0.35 })
      shapes.push({ type: 'rect', x: 50, y: 10, w: 62, h: 60, r: 10, o: 0.7 })
    } else if (v === 2) {
      shapes.push({ type: 'rect', x: 8, y: 10, w: 56, h: 60, r: 10, o: 0.6 })
      shapes.push({ type: 'rect', x: 68, y: 10, w: 44, h: 60, r: 10, o: 0.4 })
    } else if (v === 3) {
      shapes.push({ type: 'rect', x: 10, y: 12, w: 46, h: 56, r: 10, o: 0.6 })
      shapes.push({ type: 'rect', x: 64, y: 12, w: 46, h: 56, r: 10, o: 0.35 })
      shapes.push({ type: 'rect', x: 56, y: 16, w: 8, h: 48, r: 4, o: 0.25 })
    } else {
      shapes.push({ type: 'rect', x: 8, y: 10, w: 104, h: 26, r: 10, o: 0.55 })
      shapes.push({ type: 'rect', x: 8, y: 42, w: 104, h: 28, r: 10, o: 0.35 })
    }
  } else if (kind === 'grid') {
    if (v === 0) {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 48, h: 30, r: 8, o: 0.5 })
      shapes.push({ type: 'rect', x: 64, y: 8, w: 48, h: 30, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 8, y: 42, w: 48, h: 30, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 64, y: 42, w: 48, h: 30, r: 8, o: 0.55 })
    } else if (v === 1) {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 70, h: 30, r: 8, o: 0.6 })
      shapes.push({ type: 'rect', x: 82, y: 8, w: 30, h: 30, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 8, y: 42, w: 40, h: 30, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 52, y: 42, w: 60, h: 30, r: 8, o: 0.55 })
    } else if (v === 2) {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 40, h: 30, r: 8, o: 0.45 })
      shapes.push({ type: 'rect', x: 52, y: 8, w: 60, h: 30, r: 8, o: 0.6 })
      shapes.push({ type: 'rect', x: 8, y: 42, w: 60, h: 30, r: 8, o: 0.55 })
      shapes.push({ type: 'rect', x: 72, y: 42, w: 40, h: 30, r: 8, o: 0.35 })
    } else if (v === 3) {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 34, h: 64, r: 8, o: 0.5 })
      shapes.push({ type: 'rect', x: 46, y: 8, w: 34, h: 30, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 84, y: 8, w: 28, h: 30, r: 8, o: 0.6 })
      shapes.push({ type: 'rect', x: 46, y: 42, w: 66, h: 30, r: 8, o: 0.45 })
    } else {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 104, h: 22, r: 8, o: 0.55 })
      shapes.push({ type: 'rect', x: 8, y: 34, w: 52, h: 38, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 64, y: 34, w: 48, h: 38, r: 8, o: 0.6 })
    }
  } else if (kind === 'timeline') {
    if (v === 0) {
      shapes.push({ type: 'rect', x: 16, y: 38, w: 88, h: 6, r: 3, o: 0.35 })
      shapes.push({ type: 'circle', cx: 24, cy: 41, r: 8, o: 0.7 })
      shapes.push({ type: 'circle', cx: 60, cy: 41, r: 8, o: 0.55 })
      shapes.push({ type: 'circle', cx: 96, cy: 41, r: 8, o: 0.4 })
    } else if (v === 1) {
      shapes.push({ type: 'rect', x: 58, y: 10, w: 6, h: 60, r: 3, o: 0.35 })
      shapes.push({ type: 'circle', cx: 61, cy: 16, r: 8, o: 0.7 })
      shapes.push({ type: 'circle', cx: 61, cy: 40, r: 8, o: 0.55 })
      shapes.push({ type: 'circle', cx: 61, cy: 64, r: 8, o: 0.4 })
    } else if (v === 2) {
      shapes.push({ type: 'rect', x: 14, y: 20, w: 92, h: 6, r: 3, o: 0.35 })
      shapes.push({ type: 'rect', x: 14, y: 54, w: 92, h: 6, r: 3, o: 0.35 })
      shapes.push({ type: 'circle', cx: 24, cy: 23, r: 7, o: 0.7 })
      shapes.push({ type: 'circle', cx: 96, cy: 57, r: 7, o: 0.55 })
    } else if (v === 3) {
      shapes.push({ type: 'rect', x: 12, y: 18, w: 96, h: 8, r: 4, o: 0.3 })
      shapes.push({ type: 'rect', x: 12, y: 38, w: 64, h: 8, r: 4, o: 0.3 })
      shapes.push({ type: 'rect', x: 12, y: 58, w: 48, h: 8, r: 4, o: 0.3 })
      shapes.push({ type: 'circle', cx: 100, cy: 22, r: 7, o: 0.6 })
      shapes.push({ type: 'circle', cx: 86, cy: 42, r: 7, o: 0.5 })
      shapes.push({ type: 'circle', cx: 72, cy: 62, r: 7, o: 0.45 })
    } else {
      shapes.push({ type: 'rect', x: 18, y: 12, w: 84, h: 56, r: 10, o: 0.2 })
      shapes.push({ type: 'circle', cx: 34, cy: 28, r: 9, o: 0.7 })
      shapes.push({ type: 'circle', cx: 60, cy: 40, r: 9, o: 0.55 })
      shapes.push({ type: 'circle', cx: 86, cy: 52, r: 9, o: 0.4 })
    }
  } else if (kind === 'list') {
    if (v < 2) {
      shapes.push({ type: 'circle', cx: 20, cy: 20, r: 6, o: 0.7 })
      shapes.push({ type: 'rect', x: 32, y: 16, w: 72, h: 8, r: 4, o: 0.35 })
      shapes.push({ type: 'circle', cx: 20, cy: 40, r: 6, o: 0.7 })
      shapes.push({ type: 'rect', x: 32, y: 36, w: 64, h: 8, r: 4, o: 0.35 })
      shapes.push({ type: 'circle', cx: 20, cy: 60, r: 6, o: 0.7 })
      shapes.push({ type: 'rect', x: 32, y: 56, w: 56, h: 8, r: 4, o: 0.35 })
    } else if (v < 4) {
      shapes.push({ type: 'rect', x: 14, y: 18, w: 10, h: 10, r: 3, o: 0.7 })
      shapes.push({ type: 'rect', x: 30, y: 16, w: 76, h: 8, r: 4, o: 0.35 })
      shapes.push({ type: 'rect', x: 14, y: 38, w: 10, h: 10, r: 3, o: 0.7 })
      shapes.push({ type: 'rect', x: 30, y: 36, w: 68, h: 8, r: 4, o: 0.35 })
      shapes.push({ type: 'rect', x: 14, y: 58, w: 10, h: 10, r: 3, o: 0.7 })
      shapes.push({ type: 'rect', x: 30, y: 56, w: 60, h: 8, r: 4, o: 0.35 })
    } else {
      shapes.push({ type: 'circle', cx: 22, cy: 24, r: 8, o: 0.7 })
      shapes.push({ type: 'rect', x: 38, y: 18, w: 64, h: 12, r: 6, o: 0.35 })
      shapes.push({ type: 'circle', cx: 22, cy: 52, r: 8, o: 0.7 })
      shapes.push({ type: 'rect', x: 38, y: 46, w: 56, h: 12, r: 6, o: 0.35 })
    }
  } else if (kind === 'radial') {
    if (v === 0) {
      shapes.push({ type: 'circle', cx: 60, cy: 40, r: 24, o: 0.55 })
      shapes.push({ type: 'circle', cx: 60, cy: 40, r: 12, o: 0.75 })
    } else if (v === 1) {
      shapes.push({ type: 'circle', cx: 60, cy: 36, r: 28, o: 0.45 })
      shapes.push({ type: 'circle', cx: 60, cy: 36, r: 10, o: 0.75 })
      shapes.push({ type: 'rect', x: 16, y: 60, w: 88, h: 8, r: 4, o: 0.35 })
    } else if (v === 2) {
      shapes.push({ type: 'circle', cx: 42, cy: 40, r: 18, o: 0.55 })
      shapes.push({ type: 'circle', cx: 78, cy: 40, r: 12, o: 0.35 })
      shapes.push({ type: 'circle', cx: 60, cy: 40, r: 6, o: 0.8 })
    } else if (v === 3) {
      shapes.push({ type: 'circle', cx: 60, cy: 40, r: 26, o: 0.35 })
      shapes.push({ type: 'circle', cx: 22, cy: 40, r: 8, o: 0.6 })
      shapes.push({ type: 'circle', cx: 98, cy: 40, r: 8, o: 0.6 })
      shapes.push({ type: 'circle', cx: 60, cy: 16, r: 8, o: 0.6 })
      shapes.push({ type: 'circle', cx: 60, cy: 64, r: 8, o: 0.6 })
    } else {
      shapes.push({ type: 'circle', cx: 60, cy: 40, r: 18, o: 0.55 })
      shapes.push({ type: 'rect', x: 18, y: 18, w: 84, h: 44, r: 12, o: 0.2 })
    }
  } else if (kind === 'diagonal') {
    if (v < 3) {
      shapes.push({ type: 'rect', x: 10, y: 12, w: 100, h: 56, r: 10, o: 0.3 })
      shapes.push({ type: 'rect', x: 14, y: 48, w: 92, h: 12, r: 6, o: 0.6 })
      shapes.push({ type: 'rect', x: 14, y: 26, w: 60, h: 10, r: 6, o: 0.5 })
    } else {
      shapes.push({ type: 'rect', x: 12, y: 14, w: 96, h: 16, r: 8, o: 0.6 })
      shapes.push({ type: 'rect', x: 22, y: 34, w: 86, h: 16, r: 8, o: 0.45 })
      shapes.push({ type: 'rect', x: 32, y: 54, w: 76, h: 16, r: 8, o: 0.3 })
    }
  } else if (kind === 'banner') {
    if (v < 3) {
      shapes.push({ type: 'rect', x: 10, y: 18, w: 100, h: 20, r: 10, o: 0.7 })
      shapes.push({ type: 'rect', x: 20, y: 44, w: 80, h: 12, r: 6, o: 0.35 })
    } else {
      shapes.push({ type: 'rect', x: 8, y: 12, w: 104, h: 16, r: 8, o: 0.6 })
      shapes.push({ type: 'rect', x: 14, y: 34, w: 92, h: 26, r: 10, o: 0.35 })
      shapes.push({ type: 'circle', cx: 96, cy: 26, r: 6, o: 0.75 })
    }
  } else if (kind === 'cards') {
    if (v < 3) {
      shapes.push({ type: 'rect', x: 12, y: 14, w: 96, h: 52, r: 10, o: 0.3 })
      shapes.push({ type: 'rect', x: 18, y: 18, w: 84, h: 44, r: 10, o: 0.55 })
    } else {
      shapes.push({ type: 'rect', x: 16, y: 10, w: 84, h: 44, r: 10, o: 0.35 })
      shapes.push({ type: 'rect', x: 24, y: 18, w: 84, h: 44, r: 10, o: 0.55 })
      shapes.push({ type: 'rect', x: 12, y: 28, w: 84, h: 44, r: 10, o: 0.2 })
    }
  } else if (kind === 'frame') {
    if (v < 3) {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 104, h: 64, r: 10, o: 0.35 })
      shapes.push({ type: 'rect', x: 18, y: 18, w: 84, h: 44, r: 8, o: 0.15 })
      shapes.push({ type: 'rect', x: 24, y: 24, w: 60, h: 14, r: 7, o: 0.55 })
    } else {
      shapes.push({ type: 'rect', x: 10, y: 10, w: 100, h: 60, r: 10, o: 0.3 })
      shapes.push({ type: 'rect', x: 18, y: 20, w: 84, h: 40, r: 8, o: 0.2 })
      shapes.push({ type: 'rect', x: 18, y: 14, w: 50, h: 6, r: 3, o: 0.6 })
    }
  } else if (kind === 'columns') {
    if (v < 3) {
      shapes.push({ type: 'rect', x: 8, y: 10, w: 34, h: 60, r: 8, o: 0.6 })
      shapes.push({ type: 'rect', x: 46, y: 10, w: 34, h: 60, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 84, y: 10, w: 28, h: 60, r: 8, o: 0.5 })
    } else {
      shapes.push({ type: 'rect', x: 8, y: 12, w: 26, h: 56, r: 8, o: 0.55 })
      shapes.push({ type: 'rect', x: 38, y: 12, w: 44, h: 56, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 86, y: 12, w: 26, h: 56, r: 8, o: 0.55 })
    }
  } else if (kind === 'bento') {
    if (v < 3) {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 58, h: 28, r: 8, o: 0.55 })
      shapes.push({ type: 'rect', x: 70, y: 8, w: 42, h: 28, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 8, y: 40, w: 42, h: 32, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 54, y: 40, w: 58, h: 32, r: 8, o: 0.6 })
    } else {
      shapes.push({ type: 'rect', x: 8, y: 8, w: 40, h: 64, r: 8, o: 0.35 })
      shapes.push({ type: 'rect', x: 52, y: 8, w: 60, h: 30, r: 8, o: 0.55 })
      shapes.push({ type: 'rect', x: 52, y: 42, w: 28, h: 30, r: 8, o: 0.55 })
      shapes.push({ type: 'rect', x: 84, y: 42, w: 28, h: 30, r: 8, o: 0.35 })
    }
  } else if (kind === 'quote') {
    shapes.push({ type: 'circle', cx: 42, cy: 34, r: 18, o: 0.55 })
    shapes.push({ type: 'rect', x: 64, y: 20, w: 38, h: 10, r: 5, o: 0.35 })
    shapes.push({ type: 'rect', x: 64, y: 36, w: 28, h: 10, r: 5, o: 0.35 })
    if (v > 2) shapes.push({ type: 'circle', cx: 28, cy: 52, r: 6, o: 0.4 })
  } else if (kind === 'stats') {
    shapes.push({ type: 'rect', x: 16, y: 48, w: 16, h: 22, r: 6, o: 0.45 })
    shapes.push({ type: 'rect', x: 38, y: 40, w: 16, h: 30, r: 6, o: 0.55 })
    shapes.push({ type: 'rect', x: 60, y: 30, w: 16, h: 40, r: 6, o: 0.65 })
    shapes.push({ type: 'rect', x: 82, y: 22, w: 16, h: 48, r: 6, o: 0.75 })
    if (v > 2) shapes.push({ type: 'rect', x: 16, y: 18, w: 64, h: 8, r: 4, o: 0.3 })
  } else if (kind === 'gallery') {
    shapes.push({ type: 'rect', x: 16, y: 14, w: 70, h: 50, r: 10, o: 0.35 })
    shapes.push({ type: 'rect', x: 30, y: 20, w: 70, h: 50, r: 10, o: 0.55 })
    if (v > 2) shapes.push({ type: 'rect', x: 44, y: 10, w: 50, h: 28, r: 8, o: 0.25 })
  } else if (kind === 'badge') {
    shapes.push({ type: 'circle', cx: 60, cy: 38, r: 22, o: 0.6 })
    shapes.push({ type: 'circle', cx: 22, cy: 38, r: 6, o: 0.4 })
    shapes.push({ type: 'circle', cx: 98, cy: 38, r: 6, o: 0.4 })
    shapes.push({ type: 'rect', x: 44, y: 18, w: 32, h: 8, r: 4, o: 0.35 })
  } else if (kind === 'tag') {
    shapes.push({ type: 'rect', x: 14, y: 18, w: 76, h: 44, r: 12, o: 0.6 })
    shapes.push({ type: 'circle', cx: 26, cy: 40, r: 6, o: 0.8 })
    shapes.push({ type: 'rect', x: 40, y: 28, w: 44, h: 8, r: 4, o: 0.35 })
    shapes.push({ type: 'rect', x: 40, y: 44, w: 32, h: 8, r: 4, o: 0.35 })
  } else if (kind === 'burst') {
    shapes.push({ type: 'circle', cx: 60, cy: 40, r: 22, o: 0.55 })
    shapes.push({ type: 'rect', x: 58, y: 8, w: 4, h: 16, r: 2, o: 0.6 })
    shapes.push({ type: 'rect', x: 58, y: 56, w: 4, h: 16, r: 2, o: 0.6 })
    shapes.push({ type: 'rect', x: 16, y: 38, w: 16, h: 4, r: 2, o: 0.6 })
    shapes.push({ type: 'rect', x: 88, y: 38, w: 16, h: 4, r: 2, o: 0.6 })
    if (v > 2) shapes.push({ type: 'circle', cx: 86, cy: 22, r: 6, o: 0.45 })
  } else if (kind === 'map') {
    shapes.push({ type: 'circle', cx: 26, cy: 26, r: 8, o: 0.7 })
    shapes.push({ type: 'circle', cx: 86, cy: 22, r: 8, o: 0.5 })
    shapes.push({ type: 'circle', cx: 70, cy: 60, r: 10, o: 0.6 })
    shapes.push({ type: 'rect', x: 34, y: 28, w: 44, h: 6, r: 3, o: 0.3 })
    shapes.push({ type: 'rect', x: 60, y: 36, w: 8, h: 22, r: 4, o: 0.3 })
  } else if (kind === 'spotlight') {
    shapes.push({ type: 'circle', cx: 38, cy: 40, r: 22, o: 0.6 })
    shapes.push({ type: 'rect', x: 70, y: 18, w: 34, h: 12, r: 6, o: 0.35 })
    shapes.push({ type: 'rect', x: 70, y: 36, w: 28, h: 10, r: 5, o: 0.35 })
    shapes.push({ type: 'rect', x: 70, y: 52, w: 24, h: 8, r: 4, o: 0.35 })
  } else {
    if (v < 3) {
      shapes.push({ type: 'rect', x: 14, y: 12, w: 64, h: 56, r: 12, o: 0.55 })
      shapes.push({ type: 'rect', x: 84, y: 18, w: 24, h: 14, r: 7, o: 0.35 })
      shapes.push({ type: 'rect', x: 84, y: 38, w: 20, h: 10, r: 6, o: 0.5 })
    } else {
      shapes.push({ type: 'rect', x: 12, y: 10, w: 96, h: 40, r: 12, o: 0.45 })
      shapes.push({ type: 'rect', x: 20, y: 54, w: 72, h: 14, r: 7, o: 0.35 })
      shapes.push({ type: 'circle', cx: 94, cy: 26, r: 8, o: 0.6 })
    }
  }

  addTextZone(zone, shapes)
  return shapes
}

const renderShape = (shape: IconShape) => {
  if (shape.type === 'circle') {
    return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" fill="currentColor" fill-opacity="${shape.o}" />`
  }
  return `<rect x="${shape.x}" y="${shape.y}" width="${shape.w}" height="${shape.h}" rx="${shape.r ?? 0}" fill="currentColor" fill-opacity="${shape.o}" />`
}

export function generateCompositionIconSvg(layout: LayoutInput): string {
  let kind = pickKind(layout)
  const seedText = `${layout.id}|${layout.name}|${layout.description}|${layout.textZone}|${layout.promptInstruction}|${layout.structuralPrompt}|${(layout as LayoutInput & { file?: string }).file || ''}`
  const seed = seedText.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0)
  if (kind === 'auto') {
    const pool = ['hero', 'frame', 'cards', 'banner', 'diagonal', 'columns', 'bento', 'grid', 'radial', 'quote', 'stats', 'gallery', 'badge', 'tag', 'burst', 'spotlight', 'map']
    kind = pool[seed % pool.length]
  }
  kind = diversifyKind(kind, seed)
  const shapes = buildShapes(kind, layout.textZone, seed)
  const body = shapes.map(renderShape).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="120" height="80" fill="none">${body}</svg>`
}
