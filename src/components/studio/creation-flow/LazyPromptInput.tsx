'use client'

import { Loader2 } from '@/components/ui/spinner'
import React, { useState, useEffect, useRef } from 'react'
import { IconArrowUp } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { IntentCategory } from '@/lib/creation-flow-types'
import { useTranslation } from 'react-i18next'

interface LazyPromptInputProps {
    intent: IntentCategory | null
    rawMessage: string
    onMessageChange: (message: string) => void
    onAnalyze: () => Promise<void>
    isAnalyzing?: boolean
}

export function LazyPromptInput({
    intent,
    rawMessage,
    onMessageChange,
    onAnalyze,
    isAnalyzing = false
}: LazyPromptInputProps) {
    const { t } = useTranslation('common')
    const [isFocused, setIsFocused] = useState(false)
    const [placeholder, setPlaceholder] = useState(t('lazyPrompt.default', { defaultValue: 'Describe what you want to create...' }))
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (!intent) {
            setPlaceholder(t('lazyPrompt.creativeVision', { defaultValue: 'Describe your creative vision... ✨' }))
            return
        }

        switch (intent) {
            case 'oferta':
                setPlaceholder(t('lazyPrompt.offer', { defaultValue: 'Ex: Summer sale, 50% off on running shoes...' }))
                break
            case 'evento':
                setPlaceholder(t('lazyPrompt.event', { defaultValue: 'Ex: AI webinar this Thursday at 7pm...' }))
                break
            case 'cita':
                setPlaceholder(t('lazyPrompt.quote', { defaultValue: 'Ex: Creativity is intelligence having fun...' }))
                break
            case 'comunicado':
                setPlaceholder(t('lazyPrompt.announcement', { defaultValue: 'Ex: Important notice: our offices will close...' }))
                break
            case 'reto':
                setPlaceholder(t('lazyPrompt.challenge', { defaultValue: 'Ex: Can you find the 3 differences?...' }))
                break
            default:
                setPlaceholder(t('lazyPrompt.aiFill', { defaultValue: 'Describe your idea and AI will fill the fields...' }))
        }
    }, [intent, t])

    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            const newHeight = Math.max(72, Math.min(textarea.scrollHeight, 192))
            textarea.style.height = `${newHeight}px`
        }
    }, [rawMessage])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void onAnalyze()
        }
    }

    return (
        <div className="mx-auto mb-6 w-full max-w-2xl">
            <div className={cn(
                'glass-panel flex items-start gap-3 rounded-3xl p-3 pl-5 transition-all duration-300',
                isFocused ? 'ring-2 ring-primary/30 shadow-aero-glow' : 'shadow-aero hover:shadow-aero-lg'
            )}>
                <textarea
                    ref={textareaRef}
                    value={rawMessage}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isAnalyzing}
                    rows={4}
                    className="min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60 scrollbar-hide"
                    style={{ minHeight: '4.5rem', maxHeight: '12rem' }}
                />

                <button
                    onClick={() => void onAnalyze()}
                    disabled={isAnalyzing || !rawMessage.trim()}
                    className={cn(
                        'group mt-1 flex shrink-0 items-center justify-center rounded-full bg-primary p-3 text-primary-foreground transition-all',
                        rawMessage.trim() && !isAnalyzing ? 'opacity-100 shadow-aero-glow hover:scale-110 active:scale-95' : 'cursor-not-allowed opacity-50'
                    )}
                >
                    {isAnalyzing ? (
                        <Loader2 className="h-5 w-5 text-primary-foreground" />
                    ) : (
                        <IconArrowUp className="h-5 w-5 text-primary-foreground transition-transform group-hover:scale-110" />
                    )}
                    <span className="sr-only">{t('lazyPrompt.generateAria', { defaultValue: 'Generate' })}</span>
                </button>
            </div>

            <p className={cn(
                'mt-3 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 transition-opacity duration-300',
                isFocused ? 'opacity-100' : 'opacity-0'
            )}>
                {t('lazyPrompt.enterHintBefore', { defaultValue: 'Press' })} <kbd className="rounded bg-white/40 px-1.5 py-0.5 text-[9px]$1">Enter</kbd> {t('lazyPrompt.enterHintAfter', { defaultValue: 'to generate with AI' })}
            </p>
        </div>
    )
}


