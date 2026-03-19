import { RefObject, useEffect, useMemo, useState } from 'react'
import { resolvePreviewCompositionForCanvas } from './previewCompositionPlan'

interface UsePreviewCompositionInput {
    headline: string
    support: string[]
    meta: string[]
    hasCta: boolean
    hasUrl: boolean
}

const FALLBACK_SIZE = { width: 520, height: 720 }

export function usePreviewComposition(
    containerRef: RefObject<HTMLElement | null>,
    input: UsePreviewCompositionInput
) {
    const [size, setSize] = useState(FALLBACK_SIZE)

    useEffect(() => {
        const node = containerRef.current
        if (!node || typeof ResizeObserver === 'undefined') return

        const update = () => {
            const rect = node.getBoundingClientRect()
            setSize({
                width: Math.max(0, Math.round(rect.width)),
                height: Math.max(0, Math.round(rect.height)),
            })
        }

        update()
        const observer = new ResizeObserver(() => update())
        observer.observe(node)
        return () => observer.disconnect()
    }, [containerRef])

    return useMemo(() => (
        resolvePreviewCompositionForCanvas({
            canvasWidth: size.width,
            canvasHeight: size.height,
            headline: input.headline,
            support: input.support,
            meta: input.meta,
            hasCta: input.hasCta,
            hasUrl: input.hasUrl,
        })
    ), [input.hasCta, input.hasUrl, input.headline, input.meta, input.support, size.height, size.width])
}
