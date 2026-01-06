import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
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
    // NO TABS - Show Flat List
    // We display all available styles (Brand + Dynamic Suggestions) directly

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
                                    "px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-2",
                                    "border-2",
                                    isSelected
                                        ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.15)] ring-1 ring-primary/20"
                                        : isSuggested
                                            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 hover:border-indigo-500/60 hover:bg-indigo-500/20" // Highlight AI suggestions
                                            : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/40 hover:text-foreground"
                                )}
                            >
                                <span className="text-sm opacity-80">{style.icon}</span>
                                {style.label}
                                {isSuggested && <span className="ml-1 text-[9px] uppercase tracking-wider text-indigo-600/70 border border-indigo-200 px-1 rounded-sm">IA</span>}
                            </button>
                        )
                    })}
                </div>
            </div>


            {/* Custom Style Input */}
            < div className="pt-2" >
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    ¿Otro estilo en mente?
                </label>
                <input
                    type="text"
                    value={customStyle}
                    onChange={(e) => onCustomStyleChange(e.target.value)}
                    placeholder="Ej: Cyberpunk, Acuarela, Lego..."
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50"
                />
            </div >



            {
                (selectedStyles.length > 0 || customStyle) && (
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] text-muted-foreground">
                            Dirección estética configurada ({selectedStyles.length} estilos seleccionados)
                        </p>
                    </div>
                )
            }
        </div >
    )
}
