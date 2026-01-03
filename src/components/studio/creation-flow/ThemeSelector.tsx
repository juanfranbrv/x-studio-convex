'use client'

import { cn } from '@/lib/utils'
import { type SeasonalTheme, THEME_CATALOG } from '@/lib/creation-flow-types'

interface ThemeSelectorProps {
    selectedTheme: SeasonalTheme | null
    onSelectTheme: (theme: SeasonalTheme) => void
}

export function ThemeSelector({
    selectedTheme,
    onSelectTheme,
}: ThemeSelectorProps) {
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                {THEME_CATALOG.map(theme => {
                    const isSelected = selectedTheme === theme.id

                    return (
                        <button
                            key={theme.id}
                            onClick={() => onSelectTheme(theme.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all",
                                "border-2 text-left",
                                isSelected
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50"
                            )}
                        >
                            <span className="text-xl">{theme.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{theme.name}</p>
                                <div className="flex gap-0.5 mt-1">
                                    {theme.colors.slice(0, 3).map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="w-3 h-3 rounded-full border border-black/10"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
