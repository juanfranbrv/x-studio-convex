'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { icons } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { GenerationState } from '@/lib/creation-flow-types'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { X } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface PresetsCarouselProps {
    onSelectPreset: (state: Partial<GenerationState>) => void
    onReset?: () => void
    userId?: string
    className?: string
    filterPreset?: (preset: any) => boolean
}

export function PresetsCarousel({ onSelectPreset, onReset, userId, className, filterPreset }: PresetsCarouselProps) {
    const { activeBrandKit } = useBrandKit()
    const presets = useQuery(api.presets.list, {
        userId,
        brandId: activeBrandKit?.id as any
    })
    const deletePreset = useMutation(api.presets.remove)

    if (presets === undefined) {
        return <PresetsSkeleton />
    }

    const basePresets = presets.user || []
    const userPresets = filterPreset ? basePresets.filter(filterPreset) : basePresets

    // Don't render anything if there are no presets
    if (userPresets.length === 0) {
        return null
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="grid grid-cols-2 gap-2 pb-2">
                {userPresets.map((preset) => {
                    // Dynamic Icon
                    const IconComponent = (icons as any)[preset.icon || 'Sparkles'] || (icons as any)['Sparkles']

                    const presetDescription = preset.description || preset.state?.selectedIntent || ''

                    const handleDelete = async () => {
                        if (!userId) return
                        await deletePreset({ presetId: preset._id, userId })
                    }

                    return (
                        <div key={preset._id} className="relative group/preset">
                            <button
                                onClick={() => onSelectPreset(preset.state)}
                                className="w-full text-left focus:outline-none group"
                            >
                                <Card className={cn(
                                    "h-full p-2 transition-all duration-200 border-border/40 bg-card/30",
                                    "hover:border-primary/50 hover:bg-primary/5",
                                    "group-hover:border-border/60"
                                )}>
                                    <div className="flex items-start gap-2">
                                        <div className="flex-none p-1 rounded-md transition-colors duration-200 mt-0.5 bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                                            <IconComponent className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[11px] leading-tight truncate group-hover:text-primary transition-colors">
                                                {preset.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70 mt-0.5 line-clamp-2 leading-tight">
                                                {presetDescription}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </button>

                            {/* Elegant Delete Confirmation */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        className="absolute -top-1 -right-1 p-0.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover/preset:opacity-100 transition-opacity hover:bg-destructive shadow-lg z-10"
                                        title="Eliminar preset"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-background border-border/50 max-w-[440px] p-6 shadow-2xl">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-none p-3 rounded-xl bg-muted/50 text-foreground border border-border mt-1">
                                            <X className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-1.5 pt-1">
                                            <AlertDialogTitle className="text-base font-bold text-foreground">¿Eliminar favorito?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-muted-foreground/70 text-xs leading-relaxed">
                                                Esta acción no se puede deshacer. El preset <span className="text-foreground font-bold">"{preset.name}"</span> será eliminado permanentemente.
                                            </AlertDialogDescription>
                                        </div>
                                    </div>
                                    <AlertDialogFooter className="bg-transparent border-none p-0 mt-6 flex items-center justify-end gap-3">
                                        <AlertDialogCancel className="text-xs font-bold hover:bg-muted/30 border-none bg-transparent text-foreground/70 h-10 px-4 transition-all">
                                            Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-black hover:bg-black/90 text-white text-xs font-bold rounded-xl h-10 px-6 transition-all border-none shadow-md"
                                        >
                                            Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
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
