const GEMINI_IMAGE_BASE_RATIOS = [
    '1:1',
    '3:2',
    '2:3',
    '3:4',
    '4:3',
    '4:5',
    '5:4',
    '9:16',
    '16:9',
    '21:9',
] as const

const GEMINI_31_FLASH_IMAGE_EXTRA_RATIOS = [
    '1:4',
    '1:8',
    '4:1',
    '8:1',
] as const

function parseAspectRatioValue(aspectRatio?: string): number | null {
    if (!aspectRatio) return null

    const parts = aspectRatio.trim().split(':')
    if (parts.length !== 2) return null

    const width = Number(parts[0])
    const height = Number(parts[1])
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return null
    }

    return width / height
}

function getGeminiSupportedAspectRatios(model: string): readonly string[] {
    const normalizedModel = String(model || '').trim().toLowerCase()

    if (
        normalizedModel === 'gemini-3.1-flash-image-preview' ||
        normalizedModel === 'google/gemini-3.1-flash-image-preview' ||
        normalizedModel === 'google/nano-banana-2'
    ) {
        return [...GEMINI_IMAGE_BASE_RATIOS, ...GEMINI_31_FLASH_IMAGE_EXTRA_RATIOS]
    }

    return GEMINI_IMAGE_BASE_RATIOS
}

export function mapGeminiAspectRatio(model: string, aspectRatio?: string): string {
    const normalizedRatio = String(aspectRatio || '').trim()
    if (!normalizedRatio) return '1:1'

    const supportedRatios = getGeminiSupportedAspectRatios(model)
    if (supportedRatios.includes(normalizedRatio)) {
        return normalizedRatio
    }

    const requestedValue = parseAspectRatioValue(normalizedRatio)
    if (requestedValue === null) {
        return '1:1'
    }

    let bestRatio = '1:1'
    let bestDistance = Number.POSITIVE_INFINITY

    for (const candidate of supportedRatios) {
        const candidateValue = parseAspectRatioValue(candidate)
        if (candidateValue === null) continue

        const distance = Math.abs(candidateValue - requestedValue)
        if (distance < bestDistance) {
            bestDistance = distance
            bestRatio = candidate
        }
    }

    return bestRatio
}
