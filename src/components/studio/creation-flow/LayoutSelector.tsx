'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { LayoutOption, IntentCategory } from '@/lib/creation-flow-types'
import { CompositionPreviewThumbnail, getCompositionPreviewData } from './MotifVisualPicker'
import {
    getLayoutRatingStats,
    type LayoutRatingStoreEntry,
} from '@/lib/layout-ratings'


interface LayoutSelectorProps {
    availableLayouts: LayoutOption[]
    recommendedLayouts?: LayoutOption[]
    allLayouts?: LayoutOption[]
    selectedLayout: string | null
    onSelectLayout: (layoutId: string) => void
    intent?: IntentCategory
    isAdmin?: boolean
    layoutRatings?: Record<string, LayoutRatingStoreEntry>
}

export function LayoutSelector({
    availableLayouts,
    recommendedLayouts,
    allLayouts,
    selectedLayout,
    onSelectLayout,
    intent,
    isAdmin = false,
    layoutRatings = {},
}: LayoutSelectorProps) {
    if (availableLayouts.length === 0) {
        return null
    }

    const cleanSentence = (value?: string | null) => {
        const text = (value || '').replace(/\s+/g, ' ').trim()
        if (!text) return ''
        const withoutTrail = text.replace(/[.;:,\s]+$/g, '')
        return `${withoutTrail.charAt(0).toUpperCase()}${withoutTrail.slice(1)}.`
    }

    const textZoneLabel = (zone: LayoutOption['textZone']) => {
        switch (zone) {
            case 'top': return 'zona superior'
            case 'bottom': return 'zona inferior'
            case 'left': return 'columna izquierda'
            case 'right': return 'columna derecha'
            case 'center': return 'área central'
            case 'top-left': return 'esquina superior izquierda'
            case 'top-right': return 'esquina superior derecha'
            case 'bottom-left': return 'esquina inferior izquierda'
            case 'bottom-right': return 'esquina inferior derecha'
            case 'overlay': return 'superposición sobre imagen'
            default: return 'zona principal'
        }
    }

    const extractStructuralLine = (layout: LayoutOption) => {
        const prompt = layout.structuralPrompt || ''
        const structureMatch = prompt.match(/\*\*Estructura:\*\*\s*([^\n]+)/i)
        if (structureMatch?.[1]) {
            return cleanSentence(structureMatch[1])
        }
        return cleanSentence(`Distribución pensada para lectura clara en ${textZoneLabel(layout.textZone)}`)
    }

    const buildTooltip = (layout: LayoutOption) => {
        const line1 = cleanSentence(layout.description) || cleanSentence('Composición de lectura visual')
        const line2 = extractStructuralLine(layout)
        return [line1, line2].join('\n')
    }

    const renderGrid = (layouts: LayoutOption[], opts?: { recommended?: boolean }) => (
        <div className="grid grid-cols-3 gap-2">
            {layouts.map(layout => {
                const isSelected = selectedLayout === layout.id
                const title = layout.name || 'Composición'
                // description already contains the fallback to structuralPrompt and cleaning logic
                const description = cleanSentence(layout.description) || extractStructuralLine(layout)

                const preview = getCompositionPreviewData(
                    {
                        _id: layout.id,
                        name: layout.name,
                        description: layout.description,
                        slug: layout.id,
                        structuralPrompt: layout.structuralPrompt,
                        promptInstruction: layout.promptInstruction,
                        textZone: layout.textZone,
                        intentId: intent,
                    },
                    'motif'
                )
                const hasInlineSvg = typeof layout.svgIcon === 'string' && layout.svgIcon.trim().startsWith('<svg')

                return (
                    <motion.button
                        key={layout.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectLayout(layout.id)}
                        className={cn(
                            'group relative flex flex-col transition-all duration-300',
                            'rounded-xl overflow-hidden text-left h-full',
                            'border backdrop-blur-sm',
                            isSelected
                                ? 'border-primary/40 bg-primary/5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.25)] dark:bg-primary/10'
                                : 'border-slate-200/80 bg-white/60 hover:bg-white/90 hover:border-slate-300/80 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20'
                        )}
                    >
                        {isAdmin && (
                            <div className="absolute right-1.5 top-1.5 z-20 rounded-md border border-border/70 bg-background/85 px-1.5 py-0.5 backdrop-blur">
                                {(() => {
                                    const stats = getLayoutRatingStats(layout.id, layoutRatings)
                                    return (
                                        <span className="text-[9px] font-semibold text-foreground">
                                            {stats.average.toFixed(1)} · {stats.totalPoints}/{stats.uses || 0}
                                        </span>
                                    )
                                })()}
                            </div>
                        )}
                        {opts?.recommended && (
                            <span className="absolute top-1.5 left-1.5 z-10 rounded-full bg-primary/90 text-primary-foreground text-[8px] px-1.5 py-0.5 uppercase tracking-wide font-semibold">
                                Recom.
                            </span>
                        )}
                        <div className={cn(
                            'w-full flex items-center justify-center transition-colors py-1 px-1 overflow-hidden',
                            isSelected
                                ? 'bg-primary/5'
                                : 'bg-zinc-50/50 group-hover:bg-zinc-50 dark:bg-white/5 dark:group-hover:bg-white/10'
                        )}>
                            {hasInlineSvg ? (
                                <div
                                    className={cn(
                                        'w-10 h-10 text-primary/70 overflow-hidden flex items-center justify-center',
                                        '[&>svg]:w-full [&>svg]:h-full [&>svg]:block',
                                        opts?.recommended ? 'ring-1 ring-primary/20' : ''
                                    )}
                                    // svgIcon is generated by admin tool; render as inline svg
                                    dangerouslySetInnerHTML={{ __html: layout.svgIcon as string }}
                                />
                            ) : (layout.svgIcon && layout.svgIcon !== 'Layout' && !layout.svgIcon.startsWith('<svg')) ? (
                                <div className={cn(
                                    'w-10 h-10 flex items-center justify-center text-primary/70',
                                    opts?.recommended ? 'ring-1 ring-primary/20' : ''
                                )}>
                                    <span
                                        className="material-symbols-outlined leading-none"
                                        style={{ fontSize: '40px' }}
                                    >
                                        {layout.svgIcon}
                                    </span>
                                </div>
                            ) : (
                                <CompositionPreviewThumbnail
                                    data={preview}
                                    className={cn('w-full h-full shadow-sm', opts?.recommended ? 'ring-1 ring-primary/20' : '')}
                                />
                            )}
                        </div>

                        <div className={cn(
                            'p-1.5 pt-1 border-t transition-colors flex flex-col gap-0.5 flex-1',
                            isSelected
                                ? 'border-primary/20 bg-primary/5'
                                : 'border-slate-100 bg-white/40 dark:border-white/5 dark:bg-white/5'
                        )}>
                            <span className={cn(
                                'text-[9px] font-semibold block transition-colors duration-200 truncate text-center',
                                isSelected
                                    ? 'text-primary'
                                    : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200'
                            )}>
                                {title}
                            </span>
                            {isAdmin && (
                                <span className="text-[8px] block text-center leading-none text-muted-foreground">
                                    {(() => {
                                        const stats = getLayoutRatingStats(layout.id, layoutRatings)
                                        return `${stats.totalPoints} pts`
                                    })()}
                                </span>
                            )}
                            <span className={cn(
                                'text-[9px] block text-center leading-tight opacity-90',
                                isSelected ? 'text-primary/75' : 'text-muted-foreground/80'
                            )}>
                                {layout.promptInstruction || description}
                            </span>
                        </div>
                    </motion.button>
                )
            })}
        </div>
    )

    const hasAdvancedSections = Boolean(recommendedLayouts && allLayouts)

    return (
        <div className="space-y-4">
            {hasAdvancedSections ? (
                <>
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                            Recomendadas para tu intención
                        </p>
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-2">
                            {renderGrid(recommendedLayouts || [], { recommended: true })}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Todas las composiciones
                        </p>
                        <div className="rounded-xl border border-border/60 bg-background/40 p-2">
                            {renderGrid(allLayouts || [])}
                        </div>
                    </div>
                </>
            ) : (
                renderGrid(availableLayouts)
            )}
        </div>
    )
}
