'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ImageIcon, Sparkles, Loader2, X, Wand2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface VideoSettings {
    prompt: string
    negativePrompt?: string
    startFrame?: string
    endFrame?: string
    aspectRatio: '16:9' | '9:16'
    resolution: '720p' | '1080p'
    durationSeconds: 4 | 6 | 8
    useFrameMode: boolean
}

interface VideoControlsPanelProps {
    onGenerate: (settings: VideoSettings) => void
    isGenerating: boolean
    progress?: string
    maintenanceMode?: boolean
}

export function VideoControlsPanel({
    onGenerate,
    isGenerating,
    progress,
    maintenanceMode = false
}: VideoControlsPanelProps) {
    const [prompt, setPrompt] = useState('')
    const [useFrameMode, setUseFrameMode] = useState(false)
    const [startFrame, setStartFrame] = useState<string | undefined>()
    const [endFrame, setEndFrame] = useState<string | undefined>()
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')
    const [resolution, setResolution] = useState<'720p' | '1080p'>('720p')
    const [durationSeconds, setDurationSeconds] = useState<4 | 6 | 8>(4)

    const handleImageUpload = useCallback((
        e: React.ChangeEvent<HTMLInputElement>,
        setImage: (url: string | undefined) => void
    ) => {
        if (maintenanceMode) return
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setImage(event.target?.result as string)
        }
        reader.readAsDataURL(file)
    }, [maintenanceMode])

    const handleGenerate = () => {
        if (maintenanceMode) return
        if (!prompt.trim()) return

        onGenerate({
            prompt,
            startFrame: useFrameMode ? startFrame : undefined,
            endFrame: useFrameMode ? endFrame : undefined,
            aspectRatio,
            resolution,
            durationSeconds,
            useFrameMode
        })
    }

    const canGenerate = !maintenanceMode && prompt.trim().length > 0 && !isGenerating

    return (
        <div className={cn(
            'w-full md:w-96 h-full bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border-l border-white/20 flex flex-col',
            maintenanceMode && 'opacity-90'
        )}>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {maintenanceMode && (
                    <div className="rounded-xl border border-amber-300/60 bg-amber-50/90 dark:bg-amber-900/20 dark:border-amber-500/40 px-3 py-2.5">
                        <p className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Modulo en construccion: temporalmente no operativo
                        </p>
                    </div>
                )}

                {!useFrameMode ? (
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Imagen de Referencia (Opcional)
                        </Label>
                        <ImageUploadBox
                            image={startFrame}
                            onUpload={(e) => handleImageUpload(e, setStartFrame)}
                            onClear={() => setStartFrame(undefined)}
                            label="Haz clic o suelta una imagen aquí"
                            sublabel="JPG, JPEG o PNG de hasta 10 MB"
                            disabled={maintenanceMode}
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Frames de Inicio y Fin
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <ImageUploadBox
                                image={startFrame}
                                onUpload={(e) => handleImageUpload(e, setStartFrame)}
                                onClear={() => setStartFrame(undefined)}
                                label="Marco de inicio"
                                sublabel="Haz clic o suelta una imagen"
                                compact
                                disabled={maintenanceMode}
                            />
                            <ImageUploadBox
                                image={endFrame}
                                onUpload={(e) => handleImageUpload(e, setEndFrame)}
                                onClear={() => setEndFrame(undefined)}
                                label="Marco final"
                                sublabel="Haz clic o suelta una imagen"
                                compact
                                disabled={maintenanceMode}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-medium">
                        Modo de marco de inicio-fin
                    </Label>
                    <Switch
                        checked={useFrameMode}
                        onCheckedChange={(checked) => {
                            if (maintenanceMode) return
                            setUseFrameMode(checked)
                        }}
                        disabled={maintenanceMode}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Prompt
                    </Label>
                    <div className="relative">
                        <Textarea
                            placeholder="Por favor, describe el contenido del video"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="min-h-[120px] resize-none pr-24"
                            disabled={maintenanceMode}
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" disabled>
                                <Wand2 className="w-3 h-3" />
                                Preset
                            </Button>
                            <Button variant="secondary" size="sm" className="h-8 text-xs" disabled>
                                Mejora de Prompt
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Proporciones de aspecto de salida
                    </Label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => !maintenanceMode && setAspectRatio('16:9')}
                            disabled={maintenanceMode}
                            className={cn(
                                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                                maintenanceMode && 'cursor-not-allowed',
                                aspectRatio === '16:9'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                            )}
                        >
                            <div className="w-12 h-7 rounded bg-muted border border-border" />
                            <span className="text-xs font-medium">16:9</span>
                        </button>
                        <button
                            onClick={() => !maintenanceMode && setAspectRatio('9:16')}
                            disabled={maintenanceMode}
                            className={cn(
                                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                                maintenanceMode && 'cursor-not-allowed',
                                aspectRatio === '9:16'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                            )}
                        >
                            <div className="w-7 h-12 rounded bg-muted border border-border" />
                            <span className="text-xs font-medium">9:16</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Calidad
                        </Label>
                        <Select
                            value={resolution}
                            onValueChange={(v) => {
                                if (maintenanceMode) return
                                setResolution(v as '720p' | '1080p')
                            }}
                            disabled={maintenanceMode}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="720p">720p</SelectItem>
                                <SelectItem value="1080p">1080p</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Duración
                        </Label>
                        <Select
                            value={String(durationSeconds)}
                            onValueChange={(v) => {
                                if (maintenanceMode) return
                                setDurationSeconds(Number(v) as 4 | 6 | 8)
                            }}
                            disabled={maintenanceMode}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="4">4s</SelectItem>
                                <SelectItem value="6">6s</SelectItem>
                                <SelectItem value="8">8s</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-border/40">
                <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                    {maintenanceMode ? (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            En construcción
                        </>
                    ) : isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {progress || 'Generando...'}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generar
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

function ImageUploadBox({
    image,
    onUpload,
    onClear,
    label,
    sublabel,
    compact = false,
    disabled = false
}: {
    image?: string
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
    label: string
    sublabel: string
    compact?: boolean
    disabled?: boolean
}) {
    return (
        <div className="relative">
            <label className={cn(
                'flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all',
                disabled
                    ? 'cursor-not-allowed opacity-70 border-border bg-background/40'
                    : 'cursor-pointer hover:border-primary/50 hover:bg-primary/5',
                image ? 'border-primary bg-primary/5' : 'border-border',
                compact ? 'p-4 min-h-[120px]' : 'p-8 min-h-[160px]'
            )}>
                {image ? (
                    <img src={image} alt="Preview" className="max-h-32 object-contain rounded-lg" />
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
                            <ImageIcon className="w-6 h-6 text-violet-500" />
                        </div>
                        <p className={cn('text-center font-medium text-foreground', compact ? 'text-xs' : 'text-sm')}>
                            {label}
                        </p>
                        <p className={cn('text-center text-muted-foreground mt-1', compact ? 'text-[10px]' : 'text-xs')}>
                            {sublabel}
                        </p>
                    </>
                )}
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={onUpload}
                    className="hidden"
                    disabled={disabled}
                />
            </label>
            {image && !disabled && (
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onClear()
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}

