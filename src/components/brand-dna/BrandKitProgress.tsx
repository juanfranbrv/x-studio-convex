'use client'

import { useMemo } from 'react'
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculateBrandKitCompleteness, getCompletenessMessage } from '@/lib/brand-kit-utils'
import type { BrandDNA } from '@/lib/brand-types'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface BrandKitProgressProps {
    brandKit: BrandDNA | null
    showDetails?: boolean
    compact?: boolean
    className?: string
}

export function BrandKitProgress({ brandKit, showDetails = true, compact = false, className }: BrandKitProgressProps) {
    const completeness = useMemo(() => calculateBrandKitCompleteness(brandKit), [brandKit])
    const message = useMemo(() => getCompletenessMessage(completeness.percentage), [completeness.percentage])

    if (compact) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn("flex items-center gap-2 cursor-help", className)}>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-500 ease-out rounded-full",
                                        completeness.isComplete
                                            ? "bg-green-500"
                                            : "bg-gradient-to-r from-primary to-primary/70"
                                    )}
                                    style={{ width: `${completeness.percentage}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                                {completeness.percentage}%
                            </span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[280px]">
                        <p className="font-medium mb-1">{message.emoji} {message.message}</p>
                        {completeness.tips.length > 0 && (
                            <ul className="text-xs text-muted-foreground space-y-1">
                                {completeness.tips.map((tip, i) => (
                                    <li key={i}>• {tip}</li>
                                ))}
                            </ul>
                        )}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <div className={cn("glass-panel rounded-xl p-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {completeness.isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Sparkles className="w-5 h-5 text-primary" />
                    )}
                    <span className="font-medium text-sm">Completitud del Kit de Marca</span>
                </div>
                <span className={cn("text-lg font-bold", message.color)}>
                    {completeness.percentage}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden mb-3">
                <div
                    className={cn(
                        "h-full transition-all duration-700 ease-out rounded-full",
                        completeness.isComplete
                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                            : "bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                    )}
                    style={{ width: `${completeness.percentage}%` }}
                />
            </div>

            {/* Message */}
            <p className={cn("text-sm font-medium mb-2", message.color)}>
                {message.emoji} {message.message}
            </p>

            {/* Tips */}
            {showDetails && completeness.tips.length > 0 && !completeness.isComplete && (
                <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Para mejorar:
                    </p>
                    <ul className="space-y-1">
                        {completeness.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Complete celebration */}
            {completeness.isComplete && (
                <p className="text-xs text-muted-foreground mt-2">
                    Tu Kit de Marca está listo para generar contenido de alta calidad.
                </p>
            )}
        </div>
    )
}
