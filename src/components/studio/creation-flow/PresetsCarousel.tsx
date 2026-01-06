'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { icons } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { GenerationState } from '@/lib/creation-flow-types'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Clock } from 'lucide-react'

interface PresetsCarouselProps {
    onSelectPreset: (state: Partial<GenerationState>) => void
    userId?: string
    className?: string
}

export function PresetsCarousel({ onSelectPreset, userId, className }: PresetsCarouselProps) {
    const { activeBrandKit } = useBrandKit()
    const presets = useQuery(api.presets.list, { userId })

    const recents = useQuery(api.generations.getRecents,
        activeBrandKit?.id
            ? { brand_id: activeBrandKit.id as any, limit: 2 }
            : "skip"
    )

    if (presets === undefined) {
        return <PresetsSkeleton />
    }

    const userPresets = (presets.user || []).slice(0, 4)
    // Only show user presets, ignore system presets for now to avoid clutter for new users
    // const systemPresets = presets.system || []

    // Combine for the main list - actually just user presets now
    const mainListPresets = [...userPresets]

    if (mainListPresets.length === 0 && (!recents || recents.length === 0)) return null

    return (
        <div className={cn("space-y-4", className)}>

            {/* RECENTS SECTION */}
            {recents && recents.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Recientes
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {recents.map((recent: any) => (
                            <button
                                key={recent._id}
                                onClick={() => onSelectPreset(recent.state)}
                                className="w-full text-left focus:outline-none group"
                            >
                                <Card className="h-full p-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 border-border/40 bg-card/30">
                                    <div className="flex items-start gap-2">
                                        <div className="flex-none p-1 rounded-md bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-200 mt-0.5">
                                            <Clock className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[11px] leading-tight truncate group-hover:text-primary transition-colors">
                                                {recent.state.intent ? recent.state.intent.charAt(0).toUpperCase() + recent.state.intent.slice(1) : 'Generación'}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70 mt-0.5 line-clamp-1 leading-tight">
                                                {new Date(recent.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* PRESETS SECTION - Only if User has Presets or there are System presets explicitly allowed (none for now) */}
            {userPresets.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            FAVORITOS
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pb-2">
                        {userPresets.map((preset) => {
                            // Dynamic Icon
                            const IconComponent = (icons as any)[preset.icon || 'Sparkles'] || (icons as any)['Sparkles']

                            return (
                                <button
                                    key={preset._id}
                                    onClick={() => onSelectPreset(preset.state)}
                                    className="w-full text-left focus:outline-none group"
                                >
                                    <Card className={cn(
                                        "h-full p-2 transition-all duration-200 border-border/40 bg-card/30",
                                        "hover:border-primary/50 hover:bg-primary/5",
                                        "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40"
                                    )}>
                                        <div className="flex items-start gap-2">
                                            <div className="flex-none p-1 rounded-md transition-colors duration-200 mt-0.5 bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20">
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
            )}
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
