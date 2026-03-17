'use client'

import { useMemo } from 'react'
import { IconCheck, IconAlertCircle, IconSparkles } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { calculateBrandKitCompleteness, getCompletenessMessage } from '@/lib/brand-kit-utils'
import type { BrandDNA } from '@/lib/brand-types'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'
import {
    BRAND_KIT_PAGE_SHELL_CLASS,
    BRAND_KIT_PANEL_DESCRIPTION_CLASS,
    BRAND_KIT_PANEL_HEADER_CLASS,
    BRAND_KIT_PANEL_TITLE_CLASS,
} from './brandKitStyles'

interface BrandKitProgressProps {
    brandKit: BrandDNA | null
    showDetails?: boolean
    compact?: boolean
    className?: string
}

export function BrandKitProgress({ brandKit, showDetails = true, compact = false, className }: BrandKitProgressProps) {
    const { t } = useTranslation('brandKit')
    const completeness = useMemo(() => calculateBrandKitCompleteness(brandKit), [brandKit])
    const message = useMemo(() => getCompletenessMessage(completeness.percentage), [completeness.percentage])

    if (compact) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn("flex items-center gap-3 cursor-help", className)}>
                            <div className="h-2.5 w-28 overflow-hidden rounded-full bg-[hsl(var(--surface-alt))]">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-500 ease-out",
                                        completeness.isComplete
                                            ? "bg-primary"
                                            : "bg-gradient-to-r from-primary to-primary/75"
                                    )}
                                    style={{ width: `${completeness.percentage}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
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
        <div className={cn(BRAND_KIT_PAGE_SHELL_CLASS, "px-6 py-5", className)}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className={cn(BRAND_KIT_PANEL_HEADER_CLASS, "px-0 pt-0")}>
                    <div className={BRAND_KIT_PANEL_TITLE_CLASS}>
                    {completeness.isComplete ? (
                            <IconCheck className="h-5 w-5 text-primary" />
                    ) : (
                            <IconSparkles className="h-5 w-5 text-primary" />
                    )}
                        <span>{t('progress.title', { defaultValue: 'Completitud del Kit de Marca' })}</span>
                    </div>
                    <p className={BRAND_KIT_PANEL_DESCRIPTION_CLASS}>
                        {completeness.isComplete
                            ? t('progress.complete', { defaultValue: 'Tu Kit de Marca esta listo para generar contenido de alta calidad.' })
                            : t('progress.description', { defaultValue: 'Completa los activos visuales y editoriales para que el resto de la app genere con mas precision.' })}
                    </p>
                </div>
                <div className="rounded-[1.1rem] border border-border/70 bg-[hsl(var(--surface-alt))]/70 px-4 py-3 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {t('progress.scoreLabel', { defaultValue: 'Progreso' })}
                    </p>
                    <span className="text-[clamp(1.35rem,1.28rem+0.24vw,1.55rem)] font-semibold tracking-[-0.02em] text-foreground">
                        {completeness.percentage}%
                    </span>
                </div>
            </div>

            <div className="mt-5 h-3.5 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-alt))]">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        completeness.isComplete
                            ? "bg-primary"
                            : "bg-gradient-to-r from-primary via-primary/85 to-primary/65"
                    )}
                    style={{ width: `${completeness.percentage}%` }}
                />
            </div>

            <p className={cn("mt-4 text-[1rem] font-medium", message.color)}>
                {message.emoji} {message.message}
            </p>

            {showDetails && completeness.tips.length > 0 && !completeness.isComplete && (
                <div className="mt-4 rounded-[1.2rem] border border-border/70 bg-[hsl(var(--surface-alt))]/70 px-4 py-4">
                    <p className="mb-3 flex items-center gap-1.5 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <IconAlertCircle className="h-3.5 w-3.5" />
                        {t('progress.improve', { defaultValue: 'To improve:' })}
                    </p>
                    <ul className="space-y-2.5">
                        {completeness.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[0.96rem] leading-relaxed text-foreground/85">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary/65" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
