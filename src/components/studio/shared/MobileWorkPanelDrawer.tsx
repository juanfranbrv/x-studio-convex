'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useDragControls, useReducedMotion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
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

const CLOSED_OFFSET = '100%'
const DRAG_DISTANCE = 24
const DRAG_VELOCITY = 140

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
    const suppressToggleRef = useRef(false)

    const panelTransition = prefersReducedMotion
        ? { duration: 0.06 }
        : {
              type: 'tween' as const,
              duration: open ? 0.17 : 0.13,
              ease: open ? [0.16, 1, 0.3, 1] : [0.32, 0.72, 0, 1],
          }

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
                transition={prefersReducedMotion ? { duration: 0.06 } : { duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-40 bg-black/12 backdrop-blur-[1px]"
            />

            <motion.button
                type="button"
                aria-label={open ? closeLabel : handleLabel}
                onClick={() => {
                    if (suppressToggleRef.current) {
                        suppressToggleRef.current = false
                        return
                    }
                    onOpenChange(!open)
                }}
                onPointerDown={(event) => {
                    suppressToggleRef.current = false
                    dragControls.start(event)
                }}
                initial={false}
                animate={
                    open
                        ? { opacity: 1, x: 0, scale: 1, pointerEvents: 'auto' }
                        : prefersReducedMotion
                            ? { opacity: 1, x: 0, scale: 1, pointerEvents: 'auto' }
                            : {
                                  opacity: 1,
                                  x: 0,
                                  scale: [1, 1.02, 1],
                                  filter: [
                                      'brightness(1)',
                                      'brightness(1.08)',
                                      'brightness(1)',
                                  ],
                                  pointerEvents: 'auto',
                              }
                }
                transition={
                    open
                        ? { duration: 0.1, ease: [0.22, 1, 0.36, 1] }
                        : prefersReducedMotion
                            ? { duration: 0.12 }
                            : {
                                  opacity: { duration: 0.14 },
                                  scale: { duration: 0.14 },
                                  filter: {
                                      duration: 1.6,
                                      repeat: Infinity,
                                      repeatDelay: 2.4,
                                      ease: [0.22, 1, 0.36, 1],
                                  },
                                  scale: {
                                      duration: 1.6,
                                      repeat: Infinity,
                                      repeatDelay: 2.4,
                                      ease: [0.22, 1, 0.36, 1],
                                  },
                              }
                }
                className={cn(
                    'fixed right-0 top-1/2 z-[70] flex -translate-y-1/2 items-center justify-center overflow-hidden rounded-l-[1.35rem] border border-r-0 border-primary/30',
                    'bg-primary text-primary-foreground shadow-lg shadow-primary/25 backdrop-blur-2xl',
                    'transition-[transform,filter,background-color] hover:brightness-[1.04]',
                    'h-[4.8rem] w-12'
                )}
                style={{ touchAction: 'pan-y' }}
            >
                <div className="relative flex items-center justify-center">
                    {open ? (
                        <PanelLeftOpen className="h-6 w-6" />
                    ) : (
                        <PanelLeftClose className="h-6 w-6" />
                    )}
                </div>
            </motion.button>

            <motion.aside
                initial={false}
                animate={{ x: open ? 0 : CLOSED_OFFSET }}
                transition={panelTransition}
                drag="x"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.02}
                dragMomentum={false}
                onDragStart={() => {
                    suppressToggleRef.current = true
                }}
                onDragEnd={(_, info) => {
                    if (info.offset.x <= -DRAG_DISTANCE || info.velocity.x <= -DRAG_VELOCITY) {
                        onOpenChange(true)
                        suppressToggleRef.current = false
                        return
                    }

                    if (info.offset.x >= DRAG_DISTANCE || info.velocity.x >= DRAG_VELOCITY) {
                        onOpenChange(false)
                        suppressToggleRef.current = false
                        return
                    }

                    suppressToggleRef.current = false
                }}
                className={cn(
                    'fixed inset-y-3 right-0 z-[60] w-[calc(100vw-0.5rem)] max-w-none touch-pan-y',
                    className
                )}
                style={{ willChange: 'transform' }}
            >
                <div className="min-w-0 h-full overflow-hidden rounded-l-[1.5rem] rounded-r-none border border-border/70 bg-background/95 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
                    <div
                        className={cn('h-full overflow-y-auto pb-6', contentClassName)}
                        onPointerDown={(event) => dragControls.start(event)}
                        style={{ touchAction: 'pan-y' }}
                    >
                        <div className="sr-only">
                            <p>{title}</p>
                            <p>{description}</p>
                            <p>{closeLabel}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </motion.aside>
        </>
    )
}
