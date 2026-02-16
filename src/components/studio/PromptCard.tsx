'use client'

import { useState } from 'react'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PromptCardProps {
    value: string
    onChange: (value: string) => void
    onAnalyze: () => void
    onGenerate: () => void
    isAnalyzing?: boolean
    isGenerating?: boolean
    canGenerate?: boolean
    hasGeneratedImage?: boolean
    placeholder?: string
}

export function PromptCard({
    value,
    onChange,
    onAnalyze,
    onGenerate,
    isAnalyzing = false,
    isGenerating = false,
    canGenerate = false,
    hasGeneratedImage = false,
    placeholder = "Describe lo que quieres crear...",
}: PromptCardProps) {
    const isLoading = isAnalyzing || isGenerating

    const handleSubmit = () => {
        if (hasGeneratedImage) {
            // Edit mode: apply changes
            onGenerate()
        } else if (canGenerate) {
            // Generate mode
            onGenerate()
        } else {
            // Analyze first
            onAnalyze()
        }
    }

    const getButtonLabel = () => {
        if (isGenerating) return "Generando..."
        if (isAnalyzing) return "Analizando..."
        if (hasGeneratedImage) return "Aplicar"
        if (canGenerate) return "Generar"
        return "Analizar"
    }

    const getPlaceholder = () => {
        if (hasGeneratedImage) {
            return "Describe los cambios: 'hazla más oscura', 'cambia el fondo'..."
        }
        return placeholder
    }

    return (
        <div className="glass-card p-4">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <textarea
                        placeholder={getPlaceholder()}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full min-h-[60px] max-h-[120px] text-sm p-3 pr-10 rounded-xl border border-white/10 bg-white/5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
                        rows={2}
                    />
                    {!hasGeneratedImage && value.trim() && (
                        <button
                            onClick={onAnalyze}
                            disabled={isLoading}
                            className="absolute right-3 top-3 text-primary/70 hover:text-primary transition-colors disabled:opacity-50"
                            title="Analizar con IA"
                        >
                            <Sparkles className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || (!canGenerate && !hasGeneratedImage && !value.trim())}
                    className="h-auto px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            {getButtonLabel()}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
