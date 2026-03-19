import { INTENT_CATALOG } from './creation-flow-types'

export function getDetectedIntentLabel(
    intentId?: string | null,
    fallback = ''
): string {
    const raw = String(intentId || '').trim()
    if (!raw) return fallback

    const normalized = raw.toLowerCase()
    const intent = INTENT_CATALOG.find((item) => item.id === normalized)
    return intent?.name || raw
}
