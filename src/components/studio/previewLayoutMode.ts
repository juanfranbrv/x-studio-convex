export type PreviewLayoutMode = 'default' | 'compact-scroll'

type ResolvePreviewLayoutModeArgs = {
    isMobile: boolean
    viewportHeight: number
}

const DESKTOP_PREVIEW_SCROLL_MAX_VIEWPORT_HEIGHT = 935

export function resolvePreviewLayoutMode({
    isMobile,
    viewportHeight,
}: ResolvePreviewLayoutModeArgs): PreviewLayoutMode {
    if (isMobile) return 'default'

    if (viewportHeight < DESKTOP_PREVIEW_SCROLL_MAX_VIEWPORT_HEIGHT) {
        return 'compact-scroll'
    }

    return 'default'
}
