'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GenerateButtonProps {
    isGenerating: boolean
    isDisabled: boolean
    onClick: () => void
    className?: string
    label?: string  // Custom label for the button
}

export function GenerateButton({
    isGenerating,
    isDisabled,
    onClick,
    className,
    label,
}: GenerateButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={isDisabled || isGenerating}
            className={cn(
                "flex-1 h-12 rounded-xl font-semibold text-sm gap-2 transition-all",
                "bg-primary text-primary-foreground",
                "hover:shadow-lg hover:shadow-primary/25",
                "active:scale-[0.98]",
                "disabled:pointer-events-auto disabled:cursor-not-allowed",
                className
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
                    <span>{label || "Generar"}</span>
                </>
            )}
        </Button>
    )
}
