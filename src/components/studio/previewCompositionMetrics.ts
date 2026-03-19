export type PreviewViewportBucket = 'narrow' | 'medium' | 'wide'
export type PreviewTextPressure = 'low' | 'medium' | 'high'
export type PreviewAspectBucket = 'portrait' | 'balanced' | 'landscape'

export interface PreviewCompositionMetricsInput {
    canvasWidth: number
    canvasHeight: number
    headlineLength: number
    supportLengths: number[]
    metaLengths: number[]
    hasCta: boolean
    hasUrl: boolean
}

export interface PreviewCompositionMetrics {
    canvasWidth: number
    canvasHeight: number
    aspectRatio: number
    aspectBucket: PreviewAspectBucket
    viewportBucket: PreviewViewportBucket
    textPressure: PreviewTextPressure
    totalVisibleBlocks: number
    totalCharacters: number
    headlineLength: number
    supportCount: number
    metaCount: number
    supportLengths: number[]
    metaLengths: number[]
    longestSupportLength: number
    longestMetaLength: number
    hasCta: boolean
    hasUrl: boolean
}

function clampLength(value: number) {
    return Math.max(0, Math.round(value || 0))
}

export function buildPreviewCompositionMetrics(input: PreviewCompositionMetricsInput): PreviewCompositionMetrics {
    const canvasWidth = Math.max(0, input.canvasWidth || 0)
    const canvasHeight = Math.max(0, input.canvasHeight || 0)
    const headlineLength = clampLength(input.headlineLength)
    const supportLengths = input.supportLengths.map(clampLength).filter(Boolean)
    const metaLengths = input.metaLengths.map(clampLength).filter(Boolean)
    const hasCta = input.hasCta === true
    const hasUrl = input.hasUrl === true

    const totalVisibleBlocks =
        (headlineLength > 0 ? 1 : 0) +
        supportLengths.length +
        metaLengths.length +
        (hasCta ? 1 : 0) +
        (hasUrl ? 1 : 0)

    const totalCharacters =
        headlineLength +
        supportLengths.reduce((sum, value) => sum + value, 0) +
        metaLengths.reduce((sum, value) => sum + value, 0)

    const aspectRatio = canvasHeight > 0 ? canvasWidth / canvasHeight : 1
    let aspectBucket: PreviewAspectBucket = 'balanced'
    if (aspectRatio <= 0.82) aspectBucket = 'portrait'
    else if (aspectRatio >= 1.08) aspectBucket = 'landscape'

    let viewportBucket: PreviewViewportBucket = 'wide'
    if (canvasWidth < 380 || canvasHeight < 520) viewportBucket = 'narrow'
    else if (canvasWidth < 560 || canvasHeight < 760) viewportBucket = 'medium'

    const densityScore =
        totalCharacters +
        (supportLengths.length * 18) +
        (metaLengths.length * 10) +
        (hasCta ? 12 : 0) +
        (hasUrl ? 16 : 0)

    const availableArea = Math.max(1, canvasWidth * canvasHeight)
    const pressureRatio = densityScore / Math.sqrt(availableArea)

    let textPressure: PreviewTextPressure = 'low'
    if (
        pressureRatio > 10.5 ||
        totalVisibleBlocks >= 8 ||
        totalCharacters >= 150
    ) {
        textPressure = 'high'
    } else if (
        pressureRatio > 6.6 ||
        totalVisibleBlocks >= 5 ||
        totalCharacters >= 80
    ) {
        textPressure = 'medium'
    }

    return {
        canvasWidth,
        canvasHeight,
        aspectRatio,
        aspectBucket,
        viewportBucket,
        textPressure,
        totalVisibleBlocks,
        totalCharacters,
        headlineLength,
        supportCount: supportLengths.length,
        metaCount: metaLengths.length,
        supportLengths,
        metaLengths,
        longestSupportLength: supportLengths.reduce((max, value) => Math.max(max, value), 0),
        longestMetaLength: metaLengths.reduce((max, value) => Math.max(max, value), 0),
        hasCta,
        hasUrl,
    }
}
