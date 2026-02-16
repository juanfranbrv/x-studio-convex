'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, Wand2, Loader2, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IntentCategory } from '@/lib/creation-flow-types'

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
    const [isFocused, setIsFocused] = useState(false)
    const [placeholder, setPlaceholder] = useState("Describe lo que quieres crear...")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (!intent) {
            setPlaceholder("Describe tu visión creativa... ✨")
            return
        }

        // Dynamic placeholders based on intent
        switch (intent) {
            case 'oferta':
                setPlaceholder("Ej: Oferta de verano 50% en zapatillas running...")
                break
            case 'evento':
                setPlaceholder("Ej: Webinar sobre IA este Jueves a las 19h...")
                break
            case 'cita':
                setPlaceholder("Ej: La creatividad es la inteligencia divirtiéndose...")
                break
            case 'comunicado':
                setPlaceholder("Ej: Aviso importante: Nuestras oficinas cerrarán...")
                break
            case 'reto':
                setPlaceholder("Ej: ¿Puedes encontrar las 3 diferencias?...")
                break
            default:
                setPlaceholder("Describe tu idea y la IA rellenará los campos...")
        }
    }, [intent])

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto'
            // Set height to scrollHeight (content height)
            const newHeight = Math.max(72, Math.min(textarea.scrollHeight, 192)) // min 4.5rem (72px), max 12rem (192px)
            textarea.style.height = `${newHeight}px`
        }
    }, [rawMessage])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onAnalyze()
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-6">
            {/* Floating Capsule Container */}
            <div className={cn(
                "glass-panel rounded-3xl p-3 pl-5 flex items-start gap-3 transition-all duration-300",
                isFocused
                    ? "shadow-aero-glow ring-2 ring-primary/30"
                    : "shadow-aero hover:shadow-aero-lg"
            )}>


                {/* Text Input - Textarea with auto-grow */}
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
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 text-sm font-medium min-w-0 resize-none scrollbar-hide overflow-hidden"
                    style={{
                        minHeight: '4.5rem',
                        maxHeight: '12rem'
                    }}
                />

                {/* Generate Button */}
                <button
                    onClick={() => onAnalyze()}
                    disabled={isAnalyzing || !rawMessage.trim()}
                    className={cn(
                        "bg-primary text-primary-foreground p-3 rounded-full transition-all flex items-center justify-center group shrink-0 mt-1",
                        rawMessage.trim() && !isAnalyzing
                            ? "opacity-100 shadow-aero-glow hover:scale-110 active:scale-95"
                            : "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isAnalyzing ? (
                        <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" />
                    ) : (
                        <ArrowUp className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                    )}
                    <span className="sr-only">Generar</span>
                </button>
            </div>

            {/* Micro-text hint */}
            <p className={cn(
                "text-[10px] text-center mt-3 text-muted-foreground/60 font-medium tracking-wider uppercase transition-opacity duration-300",
                isFocused ? "opacity-100" : "opacity-0"
            )}>
                Presiona <kbd className="bg-white/40 dark:bg-white/10 px-1.5 py-0.5 rounded text-[9px]">Enter</kbd> para generar con IA
            </p>
        </div>
    )
}

