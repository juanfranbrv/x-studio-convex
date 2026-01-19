import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Check, Palette } from 'lucide-react'
import type { StyleChip } from '@/lib/creation-flow-types'

interface StyleChipGroup {
    id: string
    label: string
    description?: string
}

interface StyleChipsSelectorProps {
    availableStyles: StyleChip[]
    styleGroups: StyleChipGroup[]
    selectedStyles: string[]
    customStyle: string
    onToggleStyle: (styleId: string) => void
    onCustomStyleChange: (style: string) => void
}

export function StyleChipsSelector({
    availableStyles,
    styleGroups,
    selectedStyles,
    customStyle,
    onToggleStyle,
    onCustomStyleChange,
}: StyleChipsSelectorProps) {
    if (availableStyles.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Flat List of Chips */}
            <div className="space-y-4 min-h-[100px]">
                <div className="flex flex-wrap gap-2">
                    {availableStyles.map(style => {
                        const isSelected = selectedStyles.includes(style.id)
                        const isSuggested = style.category === 'suggested'

                        return (
                            <button
                                key={style.id}
                                onClick={() => onToggleStyle(style.id)}
                                title={style.keywords?.join(', ')}
                                className={cn(
                                    "px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 flex items-center gap-2",
                                    "border backdrop-blur-md",
                                    isSelected
                                        ? "border-blue-500/50 bg-blue-50/50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                                        : isSuggested
                                            ? "border-indigo-500/30 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-100/50 dark:hover:bg-indigo-500/20"
                                            : "border-slate-200 bg-white/50 text-slate-600 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white hover:-translate-y-0.5"
                                )}
                            >
                                <span className={cn(
                                    "text-sm",
                                    isSelected ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                                )}>{style.icon}</span>
                                {style.label}
                                {isSuggested && (
                                    <span className={cn(
                                        "ml-1 text-[9px] uppercase tracking-wider px-1 rounded-sm border",
                                        isSelected
                                            ? "border-blue-200/50 text-blue-600 dark:text-blue-200 dark:border-blue-400/30"
                                            : "border-indigo-200 text-indigo-600 dark:text-indigo-300 dark:border-indigo-500/30"
                                    )}>
                                        IA
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>


            {/* Custom Style Input */}
            <div className="pt-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 pl-1">
                    ¿Otro estilo en mente?
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        value={customStyle}
                        onChange={(e) => onCustomStyleChange(e.target.value)}
                        placeholder="Ej: Cyberpunk, Acuarela, Lego..."
                        className={cn(
                            "w-full h-11 px-4 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10",
                            "backdrop-blur-md text-sm transition-all duration-300",
                            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white/80 dark:focus:bg-black/40",
                            "hover:border-slate-300 dark:hover:border-white/20"
                        )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        {customStyle ? <Check className="w-4 h-4 text-green-500" /> : <Palette className="w-4 h-4 opacity-50" />}
                    </div>
                </div>
            </div>

            {(selectedStyles.length > 0 || customStyle) && (
                <div className="flex items-center gap-2 px-1 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        Dirección estética configurada ({selectedStyles.length + (customStyle ? 1 : 0)} estilos)
                    </p>
                </div>
            )}
        </div>
    )
}
