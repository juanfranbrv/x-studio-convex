'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CarouselComposition } from '@/lib/carousel-compositions'

interface CarouselCompositionSelectorProps {
    compositions: CarouselComposition[]
    selectedId: string
    onSelect: (id: string) => void
}

export function CarouselCompositionSelector({
    compositions,
    selectedId,
    onSelect
}: CarouselCompositionSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                {compositions.map((composition) => {
                    const isSelected = selectedId === composition.id
                    return (
                        <motion.button
                            key={composition.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(composition.id)}
                            className={cn(
                                "group relative flex flex-col transition-all duration-300",
                                "rounded-xl overflow-hidden text-left",
                                "border backdrop-blur-sm",
                                isSelected
                                    ? "border-primary/40 bg-primary/5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.25)] dark:bg-primary/10"
                                    : "border-slate-200/80 bg-white/60 hover:bg-white/90 hover:border-slate-300/80 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20"
                            )}
                            title={composition.description}
                        >
                            <div className={cn(
                                "aspect-square w-full transition-colors p-1.5",
                                isSelected
                                    ? "bg-primary/5"
                                    : "bg-zinc-50/50 group-hover:bg-zinc-50 dark:bg-white/5 dark:group-hover:bg-white/10"
                            )}>
                                <CompositionThumbnail id={composition.id} />
                            </div>
                            <div className={cn(
                                "p-1.5 px-2 border-t transition-colors",
                                isSelected
                                    ? "border-primary/20 bg-primary/5"
                                    : "border-slate-100 bg-white/40 dark:border-white/5 dark:bg-white/5"
                            )}>
                                <span className={cn(
                                    "text-[9px] font-semibold block transition-colors duration-200 truncate text-center",
                                    isSelected
                                        ? "text-primary"
                                        : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"
                                )}>
                                    {composition.name}
                                </span>
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}

function CompositionThumbnail({ id }: { id: string }) {
    switch (id) {
        case 'free':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 flex items-center justify-center">
                    <div className="text-[10px] font-bold text-primary/70">L</div>
                </div>
            )
        case 'hero':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex flex-col gap-2">
                    <div className="h-3 rounded bg-primary/40" />
                    <div className="h-1.5 w-3/4 rounded bg-primary/25" />
                </div>
            )
        case 'split':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-1 flex gap-1">
                    <div className="w-3/5 rounded bg-primary/25" />
                    <div className="flex-1 rounded bg-primary/40" />
                </div>
            )
        case 'card':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-lg border border-primary/30 bg-primary/10" />
                </div>
            )
        case 'list':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary/45" />
                        <div className="h-1 w-4/5 rounded bg-primary/25" />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary/35" />
                        <div className="h-1 w-3/4 rounded bg-primary/20" />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary/30" />
                        <div className="h-1 w-2/3 rounded bg-primary/15" />
                    </div>
                </div>
            )
        case 'grid':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-1 grid grid-cols-2 gap-1">
                    <div className="rounded bg-primary/35" />
                    <div className="rounded bg-primary/25" />
                    <div className="rounded bg-primary/20" />
                    <div className="rounded bg-primary/30" />
                </div>
            )
        case 'timeline':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex">
                    <div className="w-1.5 bg-primary/30 rounded-full" />
                    <div className="flex-1 flex flex-col gap-1 pl-2">
                        <div className="h-1.5 rounded bg-primary/40" />
                        <div className="h-1 rounded bg-primary/25" />
                        <div className="h-1 rounded bg-primary/20" />
                    </div>
                </div>
            )
        case 'quote':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex flex-col items-center justify-center gap-2">
                    <div className="w-4 h-1 rounded bg-primary/40" />
                    <div className="w-6 h-1 rounded bg-primary/25" />
                </div>
            )
        case 'comparison':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-1 flex gap-1">
                    <div className="flex-1 rounded bg-primary/25" />
                    <div className="flex-1 rounded bg-primary/40" />
                </div>
            )
        case 'stat':
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex flex-col gap-2 items-center justify-center">
                    <div className="w-6 h-3 rounded bg-primary/45" />
                    <div className="w-8 h-1 rounded bg-primary/20" />
                </div>
            )
        default:
            return (
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10" />
            )
    }
}
