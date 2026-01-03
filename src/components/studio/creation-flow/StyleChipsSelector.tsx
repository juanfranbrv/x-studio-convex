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
    const [activeCategory, setActiveCategory] = useState<string>('suggested')

    const filteredStyles = useMemo(() => {
        return availableStyles.filter(s => s.category === activeCategory)
    }, [availableStyles, activeCategory])

    // Filter groups to only show those that have styles available
    const activeGroups = useMemo(() => {
        const categoriesWithStyles = new Set(availableStyles.map(s => s.category))
        return styleGroups.filter(g => categoriesWithStyles.has(g.id))
    }, [availableStyles, styleGroups])

    if (availableStyles.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1 pb-1">
                {activeGroups.map(group => (
                    <button
                        key={group.id}
                        onClick={() => setActiveCategory(group.id)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                            activeCategory === group.id
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                    >
                        {group.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4 min-h-[100px]">
                <div className="flex flex-wrap gap-2">
                    {filteredStyles.map(style => {
                        const isSelected = selectedStyles.includes(style.id)

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
                                        : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/40 hover:text-foreground"
                                )}
                            >
                                <span className="text-sm opacity-80">{style.icon}</span>
                                {style.label}
                            </button>
                        )
                    })}
                    {filteredStyles.length === 0 && (
                        <p className="text-xs text-muted-foreground italic py-4">
                            No hay estilos disponibles en esta categoría.
                        </p>
                    )}
                </div>
            </div>

            {/* Custom Style Input */}
            <div className="space-y-2 pt-4 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-1">O define tu propio estilo</p>
                <input
                    type="text"
                    value={customStyle}
                    onChange={(e) => onCustomStyleChange(e.target.value)}
                    placeholder="Ej: Cyberpunk, Minimalist, Cinematic High Contrast..."
                    className="w-full bg-muted/20 border-border/50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                />
            </div>

            {(selectedStyles.length > 0 || customStyle) && (
                <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-muted-foreground">
                        Dirección estética configurada ({selectedStyles.length} estilos seleccionados)
                    </p>
                </div>
            )}
        </div>
    )
}
