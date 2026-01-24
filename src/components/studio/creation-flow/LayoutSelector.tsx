'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { LayoutOption, IntentCategory } from '@/lib/creation-flow-types'
import { LayoutThumbnail } from './LayoutThumbnail'

interface LayoutSelectorProps {
    availableLayouts: LayoutOption[]
    selectedLayout: string | null
    onSelectLayout: (layoutId: string) => void
    intent?: IntentCategory
}

export function LayoutSelector({
    availableLayouts,
    selectedLayout,
    onSelectLayout,
    intent
}: LayoutSelectorProps) {
    if (availableLayouts.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                {availableLayouts.map(layout => {
                    const isSelected = selectedLayout === layout.id

                    return (
                        <motion.button
                            key={layout.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectLayout(layout.id)}
                            className={cn(
                                "group relative flex flex-col transition-all duration-300",
                                "rounded-xl overflow-hidden text-left",
                                "border backdrop-blur-sm",
                                isSelected
                                    ? "border-primary/40 bg-primary/5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.25)] dark:bg-primary/10"
                                    : "border-slate-200/80 bg-white/60 hover:bg-white/90 hover:border-slate-300/80 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20"
                            )}
                            title={layout.description}
                        >
                            {/* Visual Preview */}
                            <div className={cn(
                                "aspect-square w-full transition-colors p-1.5",
                                isSelected
                                    ? "bg-primary/5"
                                    : "bg-zinc-50/50 group-hover:bg-zinc-50 dark:bg-white/5 dark:group-hover:bg-white/10"
                            )}>
                                <LayoutThumbnail layout={layout} intent={intent} className="shadow-sm" />
                            </div>

                            {/* Label Area */}
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
                                    {layout.name}
                                </span>
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}

