'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useState } from 'react'
import { Sparkles, Send, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

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
    onInspire?: () => void
    isInspiring?: boolean
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
    placeholder,
    onInspire,
    isInspiring = false,
}: PromptCardProps) {
    const { t } = useTranslation('common')
    const isLoading = isAnalyzing || isGenerating

    const handleSubmit = () => {
        if (hasGeneratedImage) {
            onGenerate()
        } else if (canGenerate) {
            onGenerate()
        } else {
            onAnalyze()
        }
    }

    const getButtonLabel = () => {
        if (isGenerating) return t('promptCard.generating', { defaultValue: 'Generating...' })
        if (isAnalyzing) return t('promptCard.analyzing', { defaultValue: 'Analyzing...' })
        if (hasGeneratedImage) return t('promptCard.apply', { defaultValue: 'Apply' })
        if (canGenerate) return t('promptCard.generate', { defaultValue: 'Generate' })
        return t('promptCard.analyze', { defaultValue: 'Analyze' })
    }

    const getPlaceholder = () => {
        if (hasGeneratedImage) {
            return t('promptCard.editPlaceholder', { defaultValue: "Describe the changes: 'make it darker', 'change the background'..." })
        }
        return placeholder || t('promptCard.createPlaceholder', { defaultValue: 'Describe what you want to create...' })
    }

    return (
        <div className="rounded-xl border border-border/60 bg-card/70 p-4 space-y-2">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <textarea
                        id="prompt-card-input"
                        aria-label={hasGeneratedImage
                            ? t('promptCard.editAria', { defaultValue: 'Edit generated image prompt' })
                            : t('promptCard.createAria', { defaultValue: 'Prompt to generate image' })}
                        placeholder={getPlaceholder()}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full min-h-[60px] max-h-[120px] text-sm p-3 pr-10 rounded-xl border border-border/60 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-muted-foreground/70"
                        rows={2}
                    />
                    {!hasGeneratedImage && value.trim() && (
                        <button
                            type="button"
                            onClick={onAnalyze}
                            disabled={isLoading}
                            className="absolute right-3 top-3 text-primary/70 hover:text-primary transition-colors disabled:opacity-50"
                            title={t('promptCard.analyzeWithAi', { defaultValue: 'Analyze with AI' })}
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
                        <Loader2 className="w-4 h-4" />
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            {getButtonLabel()}
                        </>
                    )}
                </Button>
            </div>
            {!hasGeneratedImage && onInspire && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onInspire}
                        disabled={isInspiring || isLoading}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors disabled:opacity-50"
                    >
                        {isInspiring ? (
                            <Loader2 className="w-3.5 h-3.5" />
                        ) : (
                            <Wand2 className="w-3.5 h-3.5" />
                        )}
                        {t('promptCard.inspireMe', { defaultValue: 'Generar idea para mí' })}
                    </button>
                </div>
            )}
        </div>
    )
}


