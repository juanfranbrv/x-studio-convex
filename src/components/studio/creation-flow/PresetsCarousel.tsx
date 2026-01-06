'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { icons } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { GenerationState } from '@/lib/creation-flow-types'

interface PresetsCarouselProps {
    onSelectPreset: (state: Partial<GenerationState>) => void
    userId?: string
    className?: string
}

export function PresetsCarousel({ onSelectPreset, userId, className }: PresetsCarouselProps) {
    const presets = useQuery(api.presets.list, { userId })

    if (presets === undefined) {
        return <PresetsSkeleton />
    }

    const allPresets = [...(presets.system || []), ...(presets.user || [])]

    if (allPresets.length === 0) return null

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Inicio Rápido
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
                {allPresets.map((preset) => {
                    // Dynamic Icon
                    const IconComponent = (icons as any)[preset.icon || 'Sparkles'] || (icons as any)['Sparkles']

                    return (
                        <button
                            key={preset._id}
                            onClick={() => onSelectPreset(preset.state)}
                            className="w-full text-left focus:outline-none group"
                        >
                            <Card className="h-full p-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 border-border/40 bg-card/30">
                                <div className="flex items-start gap-2">
                                    <div className="flex-none p-1 rounded-md bg-primary/5 text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-200 mt-0.5">
                                        <IconComponent className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[11px] leading-tight truncate group-hover:text-primary transition-colors">
                                            {preset.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 mt-0.5 line-clamp-2 leading-tight">
                                            {preset.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function PresetsSkeleton() {
    return (
        <div className="space-y-3 mb-6">
            <Skeleton className="h-3 w-20 bg-muted/20" />
            <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="w-full h-12 rounded-lg bg-muted/10" />
                ))}
            </div>
        </div>
    )
}
