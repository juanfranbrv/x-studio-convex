import type { IntentCategory, LayoutOption } from '@/lib/creation-flow-types'
import { LAYOUTS_BY_INTENT } from '@/lib/creation-flow-types'

type LayoutArchetype =
  | 'comparison'
  | 'list'
  | 'process'
  | 'metric'
  | 'event'
  | 'promo'
  | 'human'
  | 'question'
  | 'hero'
  | 'editorial'
  | 'general'

interface RecommendationContext {
  selectedIntent: IntentCategory | null
  rawContext: string
}

interface ScoredLayout {
  layout: LayoutOption
  score: number
  archetype: LayoutArchetype
}

interface PromptSignals {
  wordCount: number
  lineCount: number
  hasQuestion: boolean
  hasComparison: boolean
  hasProcess: boolean
  hasMetrics: boolean
  hasEventSignals: boolean
  hasUrgency: boolean
  hasHumanTone: boolean
  listLike: boolean
}

const BASIC_LAYOUT_IDS = new Set([
  'default-free',
  'basic-editorial-columns',
  'basic-mosaic-flow',
  'basic-spotlight-radial',
  'basic-stacked-cards',
  'basic-diagonal-energy',
  'comunicado-modern',
  'servicio-benefit',
])

const ARCHETYPE_BUCKET_LIMIT: Record<LayoutArchetype, number> = {
  comparison: 2,
  list: 2,
  process: 2,
  metric: 2,
  event: 2,
  promo: 2,
  human: 2,
  question: 2,
  hero: 2,
  editorial: 2,
  general: 2,
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function hasAny(text: string, terms: string[]) {
  return terms.some((t) => text.includes(t))
}

function parseSignals(rawText: string): PromptSignals {
  const text = normalize(rawText || '')
  const lines = rawText
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)

  const words = text.split(/\s+/).filter(Boolean)
  const listLikeLines = lines.filter((l) =>
    /^[-*•\d]+[\).\-\s]/.test(l) ||
    /^(clases|beneficios?|pasos?|puntos?|incluye|incluimos|ventajas?)/i.test(l)
  )

  return {
    wordCount: words.length,
    lineCount: lines.length,
    hasQuestion: text.includes('?') || hasAny(text, ['que opinas', 'te parece', 'pregunta', 'encuesta', 'quiz']),
    hasComparison: hasAny(text, [' vs ', 'versus', 'antes', 'despues', 'compar', 'mejor que', 'frente a']),
    hasProcess: hasAny(text, ['paso', 'proceso', 'metodo', 'como', 'guia', 'tutorial', 'timeline', 'fases']),
    hasMetrics: /(\d+[%€$]?)/.test(text) || hasAny(text, ['precio', 'descuento', 'plazas', 'datos', 'estadistica', 'ranking']),
    hasEventSignals: hasAny(text, ['evento', 'fecha', 'hora', 'lugar', 'reserva', 'inscripcion', 'apertura', 'webinar', 'taller']),
    hasUrgency: hasAny(text, ['hoy', 'ahora', 'ultimo', 'ultimas', 'limi', 'urgente', 'solo', 'ya']),
    hasHumanTone: hasAny(text, ['equipo', 'testimonio', 'historia', 'personas', 'comunidad', 'nosotros', 'senior', 'familia']),
    listLike: listLikeLines.length >= 2 || lines.length >= 4,
  }
}

function inferLayoutArchetype(layout: LayoutOption): LayoutArchetype {
  const text = normalize(
    `${layout.id} ${layout.name} ${layout.description} ${layout.promptInstruction || ''}`
  )

  if (hasAny(text, ['compar', 'versus', 'vs', 'split', 'beforeafter', 'transformation'])) return 'comparison'
  if (hasAny(text, ['checklist', 'lista', 'ranking', 'bullets', 'agenda', 'numerado', 'iconos'])) return 'list'
  if (hasAny(text, ['proceso', 'process', 'timeline', 'pasos', 'zigzag', 'recipe'])) return 'process'
  if (hasAny(text, ['dato', 'metric', 'dashboard', 'stat', 'pricing', 'price', 'number', 'circular', 'barras'])) return 'metric'
  if (hasAny(text, ['evento', 'conference', 'festival', 'concert', 'workshop', 'networking', 'calendar'])) return 'event'
  if (hasAny(text, ['oferta', 'flash', 'sale', 'retail', 'promo', 'banner', 'exclusive', 'urgency'])) return 'promo'
  if (hasAny(text, ['equipo', 'retrato', 'portrait', 'testimonial', 'cita', 'talento', 'logro', 'winner'])) return 'human'
  if (hasAny(text, ['pregunta', 'quiz', 'poll', 'debate', 'reto', 'giveaway'])) return 'question'
  if (hasAny(text, ['hero', 'spotlight', 'radial', 'focus', 'full bleed', 'full-bleed'])) return 'hero'
  if (hasAny(text, ['editorial', 'manuscrito', 'column', 'minimal', 'clean', 'memo'])) return 'editorial'
  return 'general'
}

function scoreBySignals(layout: LayoutOption, signals: PromptSignals, archetype: LayoutArchetype): number {
  let score = 0
  const textZone = layout.textZone

  if (signals.hasComparison && archetype === 'comparison') score += 24
  if (signals.listLike && archetype === 'list') score += 20
  if (signals.hasProcess && archetype === 'process') score += 22
  if (signals.hasMetrics && archetype === 'metric') score += 22
  if (signals.hasEventSignals && archetype === 'event') score += 20
  if (signals.hasUrgency && archetype === 'promo') score += 18
  if (signals.hasQuestion && archetype === 'question') score += 20
  if (signals.hasHumanTone && archetype === 'human') score += 16

  if (signals.wordCount > 40 && (archetype === 'list' || archetype === 'editorial')) score += 12
  if (signals.wordCount <= 24 && (archetype === 'hero' || archetype === 'promo')) score += 10

  if (signals.lineCount >= 5 && textZone !== 'overlay') score += 6
  if (signals.lineCount <= 2 && (textZone === 'center' || textZone === 'overlay')) score += 4

  if (signals.wordCount > 55 && textZone === 'overlay') score -= 12
  if (signals.listLike && archetype === 'hero') score -= 6

  if (archetype === 'general') score += 2

  return score
}

function scoreIntentAffinity(layout: LayoutOption, selectedIntent: IntentCategory | null): number {
  if (!selectedIntent) return 0
  const preferred = LAYOUTS_BY_INTENT[selectedIntent] || []
  if (preferred.some((l) => l.id === layout.id)) return 35
  return 0
}

function diversify(scored: ScoredLayout[], maxItems: number): ScoredLayout[] {
  const usage: Record<LayoutArchetype, number> = {
    comparison: 0,
    list: 0,
    process: 0,
    metric: 0,
    event: 0,
    promo: 0,
    human: 0,
    question: 0,
    hero: 0,
    editorial: 0,
    general: 0,
  }

  const result: ScoredLayout[] = []
  for (const item of scored) {
    if (result.length >= maxItems) break
    const limit = ARCHETYPE_BUCKET_LIMIT[item.archetype]
    if (usage[item.archetype] >= limit) continue
    result.push(item)
    usage[item.archetype] += 1
  }

  if (result.length < maxItems) {
    for (const item of scored) {
      if (result.length >= maxItems) break
      if (result.some((r) => r.layout.id === item.layout.id)) continue
      result.push(item)
    }
  }

  return result
}

export function getRecommendedAdvancedLayouts(
  layouts: LayoutOption[],
  context: RecommendationContext,
  maxItems = 6
): LayoutOption[] {
  const filtered = layouts.filter((layout) => {
    if (BASIC_LAYOUT_IDS.has(layout.id)) return false
    const id = layout.id.toLowerCase()
    const name = layout.name.toLowerCase()
    if (id.endsWith('-free') || id.includes('default-free')) return false
    if (name.includes('libre')) return false
    return true
  })

  const signals = parseSignals(context.rawContext)
  const scored: ScoredLayout[] = filtered.map((layout) => {
    const archetype = inferLayoutArchetype(layout)
    const score =
      scoreIntentAffinity(layout, context.selectedIntent) +
      scoreBySignals(layout, signals, archetype)

    return { layout, score, archetype }
  })

  scored.sort((a, b) => b.score - a.score)
  return diversify(scored, maxItems).map((item) => item.layout)
}

