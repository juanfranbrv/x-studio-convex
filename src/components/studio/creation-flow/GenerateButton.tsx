'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GenerateButtonProps {
    isGenerating: boolean
    isDisabled: boolean
    onClick: () => void
}

export function GenerateButton({
    isGenerating,
    isDisabled,
    onClick,
}: GenerateButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={isDisabled || isGenerating}
            className={cn(
                "w-full h-12 rounded-xl font-semibold text-sm gap-2 transition-all",
                "bg-gradient-to-r from-primary via-primary to-primary/80",
                "hover:shadow-lg hover:shadow-primary/25",
                "active:scale-[0.98]"
            )}
        >
            {isGenerating ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generando...</span>
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar Imagen</span>
                </>
            )}
        </Button>
    )
}
