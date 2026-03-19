import type { TextAsset } from '@/lib/creation-flow-types'

export type PreviewTextZone = 'headline' | 'support' | 'meta' | 'cta' | 'url'

export interface PreviewTextLayer {
    id: string
    label: string
    value: string
    zone: PreviewTextZone
    source: 'headline' | 'custom' | 'asset' | 'cta' | 'url'
}

interface BuildPreviewTextLayoutParams {
    headline: string
    customTexts: Record<string, string>
    textAssets?: TextAsset[]
    cta: string
    ctaUrl?: string
    ctaUrlEnabled?: boolean
}

export interface PreviewTextLayout {
    headline: PreviewTextLayer
    support: PreviewTextLayer[]
    meta: PreviewTextLayer[]
    cta: PreviewTextLayer | null
    url: PreviewTextLayer | null
}

const META_HINTS = [
    'phone',
    'telefono',
    'tel',
    'movil',
    'mobile',
    'whatsapp',
    'email',
    'mail',
    'contact',
    'contacto',
    'web',
    'website',
    'site',
    'sitio',
    'url',
    'address',
    'direccion',
    'ubicacion',
    'location',
]

function normalizeText(value: string | null | undefined) {
    return String(value || '').trim()
}

function normalizeKey(value: string | null | undefined) {
    return normalizeText(value).toLowerCase()
}

function looksLikeMetaText(value: string) {
    const normalized = normalizeText(value).toLowerCase()
    if (!normalized) return false
    if (normalized.includes('@')) return true
    if (/https?:\/\//.test(normalized) || normalized.includes('www.')) return true
    if (/[+()]/.test(normalized) && /\d/.test(normalized)) return true
    const digits = normalized.replace(/\D/g, '')
    if (digits.length >= 8) return true
    if (/\.[a-z]{2,}/.test(normalized) && !normalized.includes(' ')) return true
    return false
}

function shouldUseMetaZone(label: string, value: string, assetType?: TextAsset['type']) {
    if (assetType === 'url') return true

    const normalizedLabel = normalizeKey(label)
    if (META_HINTS.some((hint) => normalizedLabel.includes(hint))) {
        return true
    }

    return looksLikeMetaText(value)
}

export function buildPreviewTextLayout({
    headline,
    customTexts,
    textAssets = [],
    cta,
    ctaUrl = '',
    ctaUrlEnabled = true,
}: BuildPreviewTextLayoutParams): PreviewTextLayout {
    const support: PreviewTextLayer[] = []
    const meta: PreviewTextLayer[] = []

    Object.entries(customTexts).forEach(([key, value]) => {
        const normalizedValue = normalizeText(value)
        if (!normalizedValue) return

        const layer: PreviewTextLayer = {
            id: key,
            label: key,
            value: normalizedValue,
            zone: shouldUseMetaZone(key, normalizedValue) ? 'meta' : 'support',
            source: 'custom',
        }

        if (layer.zone === 'meta') meta.push(layer)
        else support.push(layer)
    })

    textAssets.forEach((asset) => {
        if (asset.type === 'cta') return
        const normalizedValue = normalizeText(asset.value)
        if (!normalizedValue) return

        const layer: PreviewTextLayer = {
            id: asset.id,
            label: asset.label,
            value: normalizedValue,
            zone: shouldUseMetaZone(asset.label, normalizedValue, asset.type) ? 'meta' : 'support',
            source: 'asset',
        }

        if (layer.zone === 'meta') meta.push(layer)
        else support.push(layer)
    })

    const normalizedHeadline = normalizeText(headline)
    const normalizedCta = normalizeText(cta)
    const normalizedUrl = ctaUrlEnabled ? normalizeText(ctaUrl) : ''

    return {
        headline: {
            id: 'headline',
            label: 'headline',
            value: normalizedHeadline,
            zone: 'headline',
            source: 'headline',
        },
        support,
        meta,
        cta: normalizedCta
            ? {
                id: 'cta',
                label: 'cta',
                value: normalizedCta,
                zone: 'cta',
                source: 'cta',
            }
            : null,
        url: normalizedUrl
            ? {
                id: 'url',
                label: 'url',
                value: normalizedUrl,
                zone: 'url',
                source: 'url',
            }
            : null,
    }
}
