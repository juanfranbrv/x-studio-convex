import { PreviewCompositionMetrics, buildPreviewCompositionMetrics } from './previewCompositionMetrics'

export type PreviewLayoutMode = 'compact' | 'balanced' | 'airy'

export interface PreviewCompositionPlan {
    mode: PreviewLayoutMode
    zoneHeadlineMaxCh: number
    zoneSupportMaxCh: number
    zoneMetaMaxCh: number
    minHeadlineWidthCh: number
    minSupportWidthCh: number
    minMetaWidthCh: number
    headlineScale: number
    supportScale: number
    metaScale: number
    stackGap: number
    supportGap: number
    metaGap: number
    flowTopInset: number
    titleTop: number
    middleTop: number
    brandTop: number
    ctaBottom: number
    headlineMaxLines: number
    supportMaxLines: number
    metaMaxLines: number
}

const DESKTOP_BALANCED_REFERENCE = {
    stackGap: 1.02,
    supportGap: 0.24,
    metaGap: 0.16,
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function estimateLines(lengths: number[], widthCh: number) {
    return lengths.reduce((sum, length) => {
        if (!length) return sum
        return sum + Math.max(1, Math.ceil(length / Math.max(1, widthCh)))
    }, 0)
}

function estimateVerticalSlack(
    metrics: PreviewCompositionMetrics,
    headlineWidthCh: number,
    supportWidthCh: number,
    metaWidthCh: number
) {
    const headlineLines = metrics.headlineLength
        ? Math.max(1, Math.ceil(metrics.headlineLength / Math.max(1, headlineWidthCh)))
        : 0
    const supportLines = estimateLines(metrics.supportLengths, supportWidthCh)
    const metaLines = estimateLines(metrics.metaLengths, metaWidthCh)
    const ctaUnits = metrics.hasCta ? 1 : 0
    const urlUnits = metrics.hasUrl ? 1 : 0
    const estimatedHeight =
        (headlineLines * 72) +
        (supportLines * 32) +
        (metaLines * 26) +
        ((metrics.supportCount + metrics.metaCount) * 16) +
        (ctaUnits * 76) +
        (urlUnits * 58) +
        120

    return metrics.canvasHeight - estimatedHeight
}

function resolveMode(metrics: PreviewCompositionMetrics): PreviewLayoutMode {
    if (metrics.viewportBucket === 'narrow') return 'compact'
    if (metrics.textPressure === 'high') return 'compact'
    if (metrics.aspectBucket === 'portrait' && metrics.totalVisibleBlocks >= 7) return 'compact'

    if (
        metrics.viewportBucket === 'wide' &&
        metrics.aspectBucket !== 'portrait' &&
        metrics.totalVisibleBlocks <= 6
    ) {
        return 'airy'
    }

    return 'balanced'
}

export function buildPreviewCompositionPlan(metrics: PreviewCompositionMetrics): PreviewCompositionPlan {
    const mode = resolveMode(metrics)
    const compact = mode === 'compact'
    const airy = mode === 'airy'
    const isNarrow = metrics.viewportBucket === 'narrow'
    const portraitBias =
        metrics.aspectBucket === 'portrait'
            ? (compact ? 0.68 : 0.82)
            : metrics.viewportBucket === 'medium'
                ? 0.26
                : 0

    const headlineMaxLines = compact ? (isNarrow ? 4 : 3) : airy ? 2 : 3
    const supportMaxLines = compact ? 2 : airy ? 2 : 2
    const metaMaxLines = compact ? (metrics.metaCount >= 2 || metrics.hasUrl ? 2 : 1) : 2

    const headlineBaseWidth =
        isNarrow ? 18 :
            metrics.viewportBucket === 'medium' ? 24 :
                airy ? 34 : 30
    const supportBaseWidth =
        isNarrow ? 28 :
            metrics.viewportBucket === 'medium' ? 38 :
                airy ? 56 : 46
    const metaBaseWidth =
        isNarrow ? 18 :
            metrics.viewportBucket === 'medium' ? 26 :
                airy ? 34 : 30

    const zoneHeadlineMaxCh = clamp(
        Math.max(headlineBaseWidth, Math.ceil(metrics.headlineLength / headlineMaxLines) + (airy ? 6 : 4)),
        isNarrow ? 17 : 22,
        airy ? 42 : 36
    )

    const zoneSupportMaxCh = clamp(
        Math.max(
            supportBaseWidth,
            Math.min(metrics.longestSupportLength + (airy ? 8 : 5), airy ? 58 : 48)
        ),
        isNarrow ? 26 : 34,
        airy ? 64 : 54
    )

    const zoneMetaMaxCh = clamp(
        Math.max(
            metaBaseWidth,
            Math.min(metrics.longestMetaLength + 4, airy ? 36 : 32)
        ),
        isNarrow ? 16 : 22,
        airy ? 40 : 34
    )

    const verticalSlack = estimateVerticalSlack(
        metrics,
        zoneHeadlineMaxCh,
        zoneSupportMaxCh,
        zoneMetaMaxCh
    )

    const supportScale = compact
        ? (isNarrow ? 0.95 : 0.98)
        : airy
            ? 1.03
            : 1

    const metaScale = compact
        ? (isNarrow ? 0.94 : 0.97)
        : airy
            ? 1.02
            : 1

    const headlineScale = compact
        ? (isNarrow ? 0.98 : 1)
        : airy
            ? 1.04
            : 1.01

    const verticalBias = clamp(verticalSlack / 280, -0.24, 0.3)

    return {
        mode,
        zoneHeadlineMaxCh,
        zoneSupportMaxCh,
        zoneMetaMaxCh,
        minHeadlineWidthCh: compact ? 12 : 16,
        minSupportWidthCh: compact ? 16 : 22,
        minMetaWidthCh: compact ? 11 : 16,
        headlineScale,
        supportScale,
        metaScale,
        stackGap: clamp(
            (compact ? 0.66 : airy ? 1.06 : 0.88) + verticalBias,
            compact ? 0.56 : 0.72,
            airy ? 1.36 : 1.08
        ),
        supportGap: clamp(
            (compact ? 0.18 : airy ? 0.34 : 0.24) + (verticalBias * 0.45),
            0.14,
            airy ? 0.48 : 0.34
        ),
        metaGap: clamp(
            (compact ? 0.12 : airy ? 0.2 : 0.16) + (verticalBias * 0.28),
            0.08,
            airy ? 0.28 : 0.22
        ),
        flowTopInset: clamp(
            (compact ? 0.48 : airy ? 0.08 : 0.18) + (portraitBias * 2.5),
            0.08,
            airy ? 0.7 : 3
        ),
        titleTop: clamp(
            (compact ? 0.82 : airy ? 1.18 : 0.98) + (verticalBias * 0.55) + portraitBias,
            compact ? 0.72 : 0.88,
            airy ? 1.9 : 2.65
        ),
        middleTop: clamp(
            (compact ? 0.08 : airy ? 0.28 : 0.16) + (verticalBias * 0.2) + (portraitBias * 0.72),
            0.04,
            airy ? 0.78 : 1.28
        ),
        brandTop: clamp(
            (compact ? 0.38 : airy ? 0.7 : 0.52) + (verticalBias * 0.18) + (portraitBias * 0.5),
            0.3,
            airy ? 1.16 : 1.42
        ),
        ctaBottom: clamp(
            (compact ? 0.42 : airy ? 0.78 : 0.56) + (verticalBias * 0.16),
            0.34,
            airy ? 0.94 : 0.68
        ),
        headlineMaxLines,
        supportMaxLines,
        metaMaxLines,
    }
}

export function resolvePreviewCompositionForCanvas(input: {
    canvasWidth: number
    canvasHeight: number
    headline: string
    support: string[]
    meta: string[]
    hasCta: boolean
    hasUrl: boolean
}) {
    const metrics = buildPreviewCompositionMetrics({
        canvasWidth: input.canvasWidth,
        canvasHeight: input.canvasHeight,
        headlineLength: (input.headline || '').trim().length,
        supportLengths: input.support.map((value) => (value || '').trim().length),
        metaLengths: input.meta.map((value) => (value || '').trim().length),
        hasCta: input.hasCta,
        hasUrl: input.hasUrl,
    })

    return {
        ...buildPreviewCompositionPlan(metrics),
        metrics,
        desktopBalanced: DESKTOP_BALANCED_REFERENCE,
    }
}
