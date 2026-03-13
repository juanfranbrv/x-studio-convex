'use client'

import type { ReactNode } from 'react'
import { motion, useDragControls, useReducedMotion } from 'framer-motion'
import { GripVertical, SlidersHorizontal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MobileWorkPanelDrawerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    handleLabel: string
    closeLabel: string
    children: ReactNode
    className?: string
    contentClassName?: string
}

const CLOSED_OFFSET = 'calc(100% - 3rem)'
const DRAG_DISTANCE = 56
const DRAG_VELOCITY = 420

export function MobileWorkPanelDrawer({
    open,
    onOpenChange,
    title,
    description,
    handleLabel,
    closeLabel,
    children,
    className,
    contentClassName,
}: MobileWorkPanelDrawerProps) {
    const prefersReducedMotion = useReducedMotion()
    const dragControls = useDragControls()

    const transition = prefersReducedMotion
        ? { duration: 0.12 }
        : { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.78 }

    return (
        <>
            <motion.button
                type="button"
                aria-label={closeLabel}
                onClick={() => onOpenChange(false)}
                initial={false}
                animate={{
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                }}
                transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.18 }}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1.5px]"
            />

            <motion.aside
                initial={false}
                animate={{ x: open ? 0 : CLOSED_OFFSET }}
                transition={transition}
                drag="x"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                    if (info.offset.x <= -DRAG_DISTANCE || info.velocity.x <= -DRAG_VELOCITY) {
                        onOpenChange(true)
                        return
                    }

                    if (info.offset.x >= DRAG_DISTANCE || info.velocity.x >= DRAG_VELOCITY) {
                        onOpenChange(false)
                    }
                }}
                className={cn(
                    'fixed inset-y-3 right-0 z-50 flex w-[min(92vw,30rem)] max-w-[30rem] touch-pan-y flex-row',
                    className
                )}
            >
                <button
                    type="button"
                    aria-expanded={open}
                    aria-label={open ? closeLabel : handleLabel}
                    onClick={() => onOpenChange(!open)}
                    onPointerDown={(event) => dragControls.start(event)}
                    className={cn(
                        'pointer-events-auto flex w-12 shrink-0 items-center justify-center rounded-l-[1.35rem] border border-r-0 border-border/70',
                        'bg-background/94 text-muted-foreground shadow-[0_14px_36px_-22px_rgba(15,23,42,0.58)] backdrop-blur-xl transition-all duration-200',
                        open ? 'text-foreground/90' : 'hover:text-foreground'
                    )}
                    style={{ touchAction: 'pan-y' }}
                >
                    <div className="flex h-36 w-full flex-col items-center justify-center gap-2">
                        <GripVertical className="h-4 w-4 opacity-60" />
                        <SlidersHorizontal className="h-4 w-4 opacity-80" />
                        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-semibold uppercase tracking-[0.22em]">
                            {handleLabel}
                        </span>
                    </div>
                </button>

                <div className="min-w-0 flex-1 overflow-hidden rounded-l-[1.5rem] border border-border/70 bg-background/96 shadow-[0_20px_55px_-28px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
                    <div
                        className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3"
                        onPointerDown={(event) => dragControls.start(event)}
                        style={{ touchAction: 'pan-y' }}
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">{title}</p>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => onOpenChange(false)}
                            className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground transition-all hover:text-foreground"
                            aria-label={closeLabel}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className={cn('h-[calc(100%-4.5rem)] overflow-y-auto pb-6', contentClassName)}>
                        {children}
                    </div>
                </div>
            </motion.aside>
        </>
    )
}
