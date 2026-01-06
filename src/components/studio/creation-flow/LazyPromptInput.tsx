'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, ArrowUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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

    useEffect(() => {
        if (!intent) {
            setPlaceholder("Describe lo que quieres crear... La IA detectará el tipo de publicación automáticamente ✨")
            return
        }

        // Dynamic placeholders based on intent
        switch (intent) {
            case 'oferta':
                setPlaceholder("Ej: Oferta de verano 50% en zapatillas running. Título: REBAJAS. CTA: Compra ya.")
                break
            case 'evento':
                setPlaceholder("Ej: Webinar sobre IA este Jueves a las 19h con Juan Pérez.")
                break
            case 'cita':
                setPlaceholder("Ej: La creatividad es la inteligencia divirtiéndose. - Albert Einstein")
                break
            case 'comunicado':
                setPlaceholder("Ej: Aviso importante: Nuestras oficinas cerrarán por vacaciones en Agosto.")
                break
            case 'reto':
                setPlaceholder("Ej: ¿Puedes encontrar las 3 diferencias? Comenta si lo logras.")
                break
            default:
                setPlaceholder("Describe tu idea y la IA rellenará los campos...")
        }
    }, [intent])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onAnalyze()
        }
    }

    return (
        <div className={cn(
            "relative rounded-xl border-2 transition-all duration-300 bg-background",
            isFocused ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-muted shadow-sm hover:border-primary/50"
        )}>
            <div className="absolute top-3 left-3">
                <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isAnalyzing ? "bg-primary/20 animate-pulse" : "bg-primary/10"
                )}>
                    {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 text-primary" />
                    )}
                </div>
            </div>

            <Textarea
                value={rawMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full min-h-[100px] pl-12 pr-12 py-3 bg-transparent border-none resize-none focus-visible:ring-0 text-sm leading-relaxed placeholder:text-muted-foreground/70"
                disabled={isAnalyzing}
            />

            <div className="absolute bottom-3 right-3">
                <Button
                    size="icon"
                    className={cn(
                        "h-8 w-8 rounded-lg transition-all",
                        rawMessage.trim() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                    )}
                    onClick={() => onAnalyze()}
                    disabled={isAnalyzing}
                >
                    <ArrowUp className="w-4 h-4" />
                </Button>
            </div>

            {/* Helper Text */}
            {isFocused && (
                <div className="absolute -bottom-6 left-0 text-[10px] text-primary/80 font-medium animate-in fade-in slide-in-from-top-1">
                    {intent
                        ? "Presiona Enter para autocompletar el formulario ✨"
                        : "Presiona Enter para que la IA detecte la intención y complete los campos ✨"
                    }
                </div>
            )}
        </div>
    )
}
