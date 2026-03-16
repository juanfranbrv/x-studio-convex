'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { IconCheck, IconMessage, IconSend, IconClose } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface FeedbackButtonProps {
    show: boolean
    generationId?: Id<"generations">
    brandId?: Id<"brand_dna">
    intent?: string
    layout?: string
    className?: string
    compact?: boolean
    variant?: 'default' | 'tab'
    tabSide?: 'right' | 'left'
}

const REACTIONS = [
    { id: 'negative', emoji: '😞', labelKey: 'bad', defaultLabel: 'Bad' },
    { id: 'neutral', emoji: '😐', labelKey: 'neutral', defaultLabel: 'Neutral' },
    { id: 'positive', emoji: '😊', labelKey: 'good', defaultLabel: 'Good' },
] as const

function useCanvasEdgePosition(tabSide: 'right' | 'left') {
    const [style, setStyle] = useState<React.CSSProperties>({})

    useEffect(() => {
        function update() {
            const canvas = document.querySelector('.canvas-panel')
            if (!canvas) return
            const scrollRegion = document.querySelector('.canvas-scroll-region')
            const rect = canvas.getBoundingClientRect()
            const tabHeight = 108
            const viewportPadding = 12
            const scrollRect = scrollRegion instanceof HTMLElement
                ? scrollRegion.getBoundingClientRect()
                : { top: viewportPadding, bottom: window.innerHeight - viewportPadding }
            const minVisibleTop = scrollRect.top + viewportPadding
            const maxVisibleBottom = scrollRect.bottom - viewportPadding
            const visibleTop = Math.max(rect.top, minVisibleTop)
            const visibleBottom = Math.min(rect.bottom, maxVisibleBottom)
            const maxTop = Math.max(minVisibleTop, visibleBottom - tabHeight)
            const top = Math.max(minVisibleTop, Math.min(visibleTop + 16, maxTop))
            if (tabSide === 'right') {
                setStyle({ position: 'fixed', top, left: rect.right })
            } else {
                setStyle({ position: 'fixed', top, right: window.innerWidth - rect.left })
            }
        }

        requestAnimationFrame(update)
        window.addEventListener('resize', update)
        window.addEventListener('scroll', update, true)
        const ro = new ResizeObserver(update)
        const canvas = document.querySelector('.canvas-panel')
        if (canvas) ro.observe(canvas)
        return () => {
            window.removeEventListener('resize', update)
            window.removeEventListener('scroll', update, true)
            ro.disconnect()
        }
    }, [tabSide])

    return style
}

export function FeedbackButton({
    show,
    generationId,
    brandId,
    intent,
    layout,
    className,
    compact = false,
    variant = 'default',
    tabSide = 'right',
}: FeedbackButtonProps) {
    const { t } = useTranslation('common')
    const { user } = useUser()
    const { toast } = useToast()
    const submitFeedback = useMutation(api.feedback.submitFeedback)

    const [isOpen, setIsOpen] = useState(false)
    const [selectedRating, setSelectedRating] = useState<string | null>(null)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [anchorStyle, setAnchorStyle] = useState<React.CSSProperties>({})
    const tabRef = useRef<HTMLButtonElement>(null)

    const tabStyle = useCanvasEdgePosition(tabSide)

    const handleTabOpen = () => {
        if (variant === 'tab' && tabRef.current) {
            const r = tabRef.current.getBoundingClientRect()
            const maxTop = window.innerHeight - 440
            const top = Math.max(8, Math.min(r.top, maxTop))
            if (tabSide === 'right') {
                setAnchorStyle({ position: 'fixed', top, left: r.right + 8 })
            } else {
                setAnchorStyle({ position: 'fixed', top, right: window.innerWidth - r.left + 8 })
            }
        }
        setIsOpen(true)
    }

    useEffect(() => {
        if (show && !hasSubmitted) {
            const timer = setTimeout(() => setIsVisible(true), 2000)
            return () => clearTimeout(timer)
        }
        setIsVisible(false)
    }, [show, hasSubmitted])

    const handleSubmit = async (rating?: string) => {
        const finalRating = rating || selectedRating
        if (!finalRating || !user) return

        setIsSubmitting(true)
        try {
            await submitFeedback({
                userId: user.id,
                userEmail: user.emailAddresses[0]?.emailAddress || '',
                rating: finalRating,
                comment: comment.trim() || undefined,
                context: {
                    generationId,
                    brandId,
                    intent,
                    layout,
                },
            })

            toast({
                title: t('feedback.thanksTitle', { defaultValue: 'Thanks' }),
                description: t('feedback.thanksDescription', { defaultValue: 'Your feedback helps us improve.' }),
            })

            setIsOpen(false)
            setHasSubmitted(true)
            setSelectedRating(null)
            setComment('')
        } catch (error) {
            console.error('Error submitting feedback:', error)
            toast({
                title: t('feedback.errorTitle', { defaultValue: 'Error' }),
                description: t('feedback.errorDescription', { defaultValue: 'We could not send your feedback.' }),
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEmojiClick = (ratingId: string) => {
        if (selectedRating === ratingId && isOpen) {
            handleSubmit(ratingId)
            return
        }

        setSelectedRating(ratingId)
        if (!isOpen) {
            setIsOpen(true)
        }
    }

    if (!isVisible) return null

    return (
        <>
            {!isOpen && variant === 'tab' && (
                <button
                    ref={tabRef}
                    onClick={handleTabOpen}
                    style={tabStyle}
                    className={cn(
                        'z-50 flex flex-col items-center gap-1.5 px-2.5 py-3',
                        'border border-border/50 bg-card/90 backdrop-blur-xl',
                        tabSide === 'right'
                            ? 'border-l-0 rounded-r-xl rounded-l-none shadow-[3px_3px_12px_rgba(0,0,0,0.18),0_1px_4px_rgba(0,0,0,0.1)]'
                            : 'border-r-0 rounded-l-xl rounded-r-none shadow-[-3px_3px_12px_rgba(0,0,0,0.18),0_1px_4px_rgba(0,0,0,0.1)]',
                        'opacity-80 hover:opacity-100 hover:bg-card',
                        'transition-all duration-300 ease-out active:scale-95',
                        'group animate-in fade-in duration-700',
                    )}
                    title={t('feedback.openTitle', { defaultValue: 'Send feedback' })}
                >
                    <IconMessage className="h-3.5 w-3.5 text-primary transition-transform group-hover:scale-110" />
                    <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-medium text-foreground/60 group-hover:text-foreground/90 tracking-wide">
                        {t('feedback.compactLabel', { defaultValue: 'Feedback' })}
                    </span>
                </button>
            )}

            {!isOpen && variant !== 'tab' && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        !className?.includes('absolute') && !className?.includes('fixed') && 'fixed bottom-24 left-1/2 -translate-x-1/2',
                        compact ? 'z-50 rounded-full px-3 py-2' : 'z-50 rounded-full px-4 py-2.5',
                        'flex items-center gap-2 border border-primary/20 bg-card/90 backdrop-blur-xl',
                        compact ? 'opacity-75 hover:opacity-95' : 'opacity-90 hover:opacity-100',
                        'shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:border-primary/40 hover:shadow-xl active:scale-95',
                        'group animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700',
                        className
                    )}
                    title={t('feedback.openTitle', { defaultValue: 'Send feedback' })}
                >
                    <IconMessage className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                    <span
                        className={cn(
                            compact ? 'text-xs font-medium' : 'text-sm font-medium',
                            'text-foreground/80 group-hover:text-foreground'
                        )}
                    >
                        {compact
                            ? t('feedback.compactLabel', { defaultValue: 'Feedback' })
                            : t('feedback.title', { defaultValue: 'What did you think?' })}
                    </span>
                </button>
            )}

            {isOpen && (
                <div
                    style={variant === 'tab' ? anchorStyle : undefined}
                    className={cn(
                        'z-50 animate-in fade-in slide-in-from-bottom-4 duration-300',
                        variant !== 'tab' && 'fixed bottom-24 left-1/2 -translate-x-1/2'
                    )}
                >
                    <div
                        className={cn(
                            'w-80 space-y-4 rounded-2xl border border-border/70 bg-card/95 p-5 shadow-2xl backdrop-blur-xl',
                            'studio-tone-panel'
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground">
                                {t('feedback.title', { defaultValue: 'What did you think?' })}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setSelectedRating(null)
                                    setComment('')
                                }}
                                className="rounded-full p-1 transition-colors hover:bg-muted/50"
                            >
                                <IconClose className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="flex justify-center gap-4">
                            {REACTIONS.map((reaction) => (
                                <button
                                    key={reaction.id}
                                    onClick={() => handleEmojiClick(reaction.id)}
                                    className={cn(
                                        'flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all duration-200 hover:scale-110 active:scale-95',
                                        selectedRating === reaction.id
                                            ? 'scale-110 bg-primary/20 ring-2 ring-primary shadow-lg'
                                            : 'hover:bg-muted/30'
                                    )}
                                >
                                    <span className="text-3xl">{reaction.emoji}</span>
                                    <span
                                        className={cn(
                                            'text-xs font-medium',
                                            selectedRating === reaction.id ? 'text-primary' : 'text-muted-foreground'
                                        )}
                                    >
                                        {t(`feedback.reactions.${reaction.labelKey}`, { defaultValue: reaction.defaultLabel })}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {selectedRating && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={t('feedback.commentPlaceholder', { defaultValue: 'Tell us more (optional)...' })}
                                    className={cn(
                                        'h-20 w-full resize-none rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm transition-all',
                                        'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50'
                                    )}
                                />
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={isSubmitting}
                                    className={cn(
                                        'flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200',
                                        'hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 text-primary-foreground" />
                                            {t('feedback.sending', { defaultValue: 'Sending...' })}
                                        </>
                                    ) : (
                                        <>
                                            <IconSend className="h-4 w-4" />
                                            {t('feedback.send', { defaultValue: 'Send feedback' })}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {!selectedRating && (
                            <p className="text-center text-xs text-muted-foreground/70">
                                {t('feedback.quickHint', { defaultValue: 'Tap an emoji to rate quickly' })}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {hasSubmitted && (
                <div
                    style={variant === 'tab' ? anchorStyle : undefined}
                    className={cn(
                        'z-50 animate-in fade-in zoom-in duration-500',
                        variant !== 'tab' && 'fixed bottom-24 left-1/2 -translate-x-1/2'
                    )}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/35 bg-primary/20 shadow-lg">
                        <IconCheck className="h-6 w-6 text-primary" />
                    </div>
                </div>
            )}
        </>
    )
}
