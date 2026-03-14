'use client'

import { useEffect } from 'react'

export function useDisablePullToRefresh(enabled: boolean) {
    useEffect(() => {
        if (!enabled || typeof document === 'undefined') return

        const html = document.documentElement
        const body = document.body
        const scrollingElement = document.scrollingElement || html

        const previousHtmlOverscroll = html.style.overscrollBehaviorY
        const previousBodyOverscroll = body.style.overscrollBehaviorY

        html.style.overscrollBehaviorY = 'none'
        body.style.overscrollBehaviorY = 'none'

        let touchStartY: number | null = null
        let touchTarget: EventTarget | null = null

        const canAncestorScrollUp = (target: EventTarget | null) => {
            let node = target instanceof HTMLElement ? target : null

            while (node && node !== body && node !== html) {
                const style = window.getComputedStyle(node)
                const overflowY = style.overflowY
                const isScrollable =
                    (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
                    node.scrollHeight > node.clientHeight

                if (isScrollable) {
                    return node.scrollTop > 0
                }

                node = node.parentElement
            }

            return (scrollingElement?.scrollTop ?? 0) > 0
        }

        const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length !== 1) {
                touchStartY = null
                touchTarget = null
                return
            }

            touchStartY = event.touches[0]?.clientY ?? null
            touchTarget = event.target
        }

        const handleTouchMove = (event: TouchEvent) => {
            if (event.touches.length !== 1 || touchStartY === null) return

            const currentY = event.touches[0]?.clientY ?? touchStartY
            const deltaY = currentY - touchStartY

            if (deltaY <= 0) return
            if (canAncestorScrollUp(touchTarget)) return

            event.preventDefault()
        }

        const resetTouchState = () => {
            touchStartY = null
            touchTarget = null
        }

        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', resetTouchState, { passive: true })
        document.addEventListener('touchcancel', resetTouchState, { passive: true })

        return () => {
            html.style.overscrollBehaviorY = previousHtmlOverscroll
            body.style.overscrollBehaviorY = previousBodyOverscroll
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', resetTouchState)
            document.removeEventListener('touchcancel', resetTouchState)
        }
    }, [enabled])
}
