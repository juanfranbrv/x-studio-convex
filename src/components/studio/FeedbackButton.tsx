'use client'

import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { MessageSquare, X, Send, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Id } from '../../../convex/_generated/dataModel'

interface FeedbackButtonProps {
    show: boolean
    generationId?: Id<"generations">
    brandId?: Id<"brand_dna">
    intent?: string
    layout?: string
    className?: string
}

const REACTIONS = [
    { id: 'negative', emoji: '😞', label: 'Malo' },
    { id: 'neutral', emoji: '😐', label: 'Normal' },
    { id: 'positive', emoji: '😊', label: 'Bueno' },
] as const

export function FeedbackButton({ show, generationId, brandId, intent, layout, className }: FeedbackButtonProps) {
    const { user } = useUser()
    const { toast } = useToast()
    const submitFeedback = useMutation(api.feedback.submitFeedback)

    const [isOpen, setIsOpen] = useState(false)
    const [selectedRating, setSelectedRating] = useState<string | null>(null)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    // Fade in after delay when show becomes true
    useEffect(() => {
        if (show && !hasSubmitted) {
            const timer = setTimeout(() => setIsVisible(true), 2000)
            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
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
                title: '¡Gracias!',
                description: 'Tu feedback nos ayuda a mejorar.',
            })

            setIsOpen(false)
            setHasSubmitted(true)
            setSelectedRating(null)
            setComment('')
        } catch (error) {
            console.error('Error submitting feedback:', error)
            toast({
                title: 'Error',
                description: 'No se pudo enviar el feedback.',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEmojiClick = (ratingId: string) => {
        // If same emoji clicked and open, submit immediately
        if (selectedRating === ratingId && isOpen) {
            handleSubmit(ratingId)
        } else {
            setSelectedRating(ratingId)
            // If no comment field needed, submit after a short delay
            if (!isOpen) {
                setIsOpen(true)
            }
        }
    }

    if (!isVisible) return null

    return (
        <>
            {/* Floating trigger button - centered near image */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        // Default positioning (can be overridden by className)
                        !className?.includes('absolute') && !className?.includes('fixed') && "fixed bottom-24 left-1/2 -translate-x-1/2",
                        "z-50 px-4 py-2.5 rounded-full",
                        "glass-panel border border-white/20",
                        "flex items-center gap-2",
                        "opacity-90 hover:opacity-100",
                        "hover:scale-105 active:scale-95",
                        "transition-all duration-300 ease-out",
                        "shadow-lg hover:shadow-xl",
                        "group",
                        "animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700",
                        className
                    )}
                    title="Enviar feedback"
                >
                    <MessageSquare className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">¿Qué te pareció?</span>
                </button>
            )}

            {/* Feedback modal - centered */}
            {isOpen && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className={cn(
                        "w-80 p-5 rounded-2xl",
                        "glass-panel border border-white/10",
                        "shadow-2xl backdrop-blur-xl",
                        "space-y-4"
                    )}>
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground">
                                ¿Qué te pareció?
                            </h3>
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setSelectedRating(null)
                                    setComment('')
                                }}
                                className="p-1 rounded-full hover:bg-muted/50 transition-colors"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Emoji reactions */}
                        <div className="flex justify-center gap-4">
                            {REACTIONS.map((reaction) => (
                                <button
                                    key={reaction.id}
                                    onClick={() => handleEmojiClick(reaction.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 p-3 rounded-xl",
                                        "transition-all duration-200",
                                        "hover:scale-110 active:scale-95",
                                        selectedRating === reaction.id
                                            ? "bg-primary/20 ring-2 ring-primary shadow-lg scale-110"
                                            : "hover:bg-muted/30"
                                    )}
                                >
                                    <span className="text-3xl">{reaction.emoji}</span>
                                    <span className={cn(
                                        "text-xs font-medium",
                                        selectedRating === reaction.id
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    )}>
                                        {reaction.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Optional comment */}
                        {selectedRating && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Cuéntanos más (opcional)..."
                                    className={cn(
                                        "w-full h-20 px-3 py-2 text-sm rounded-xl",
                                        "bg-muted/30 border border-white/10",
                                        "placeholder:text-muted-foreground/50",
                                        "focus:outline-none focus:ring-2 focus:ring-primary/50",
                                        "resize-none transition-all"
                                    )}
                                />
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full py-2.5 rounded-xl",
                                        "bg-primary text-primary-foreground",
                                        "font-medium text-sm",
                                        "flex items-center justify-center gap-2",
                                        "hover:bg-primary/90 active:scale-[0.98]",
                                        "transition-all duration-200",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Enviar feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Hint if no rating selected */}
                        {!selectedRating && (
                            <p className="text-xs text-center text-muted-foreground/70">
                                Pulsa un emoji para valorar rápidamente
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Success checkmark (centered) */}
            {hasSubmitted && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-500">
                    <div className={cn(
                        "w-12 h-12 rounded-full",
                        "bg-green-500/20 border border-green-500/30",
                        "flex items-center justify-center",
                        "shadow-lg"
                    )}>
                        <Check className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            )}
        </>
    )
}
