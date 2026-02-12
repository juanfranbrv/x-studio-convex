'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
    Upload,
    Image as ImageIcon,
    Loader2,
    X,
    Sparkles,
    Palette,
    Check,
    Plus,
    Wand2,
    RefreshCw,
    Type,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { VisionAnalysis, ReferenceImageRole } from '@/lib/creation-flow-types'

type ImageSourceMode = 'upload' | 'brandkit' | 'generate'

const MAX_REFERENCE_IMAGES = 10

interface ImageReferenceSelectorProps {
    // Multi-image support
    uploadedImages: string[]
    visionAnalysis: VisionAnalysis | null
    isAnalyzing: boolean
    error: string | null
    onUpload: (file: File) => void
    onRemoveUploadedImage?: (url: string) => void
    onClearUploadedImages?: () => void
    isOptional?: boolean
    // Brand Kit images
    brandKitImages?: Array<{ id: string; url: string; name?: string }>
    selectedBrandKitImageIds?: string[]
    onToggleBrandKitImage?: (imageId: string) => void
    onClearBrandKitImages?: () => void
    referenceImageRoles?: Record<string, ReferenceImageRole>
    onReferenceRoleChange?: (imageId: string, role: ReferenceImageRole) => void
    // AI Generation
    aiImageDescription?: string
    onAiDescriptionChange?: (description: string) => void
    // Optional suggestion from model analysis
    suggestedImagePrompts?: string[]
    // Optional custom style (moved from Style card)
    customStyle?: string
    onCustomStyleChange?: (style: string) => void
    // Mode Control (preserved for compatibility with flow)
    mode?: ImageSourceMode
    onModeChange?: (mode: ImageSourceMode) => void
}

export function ImageReferenceSelector({
    uploadedImages = [],
    visionAnalysis,
    isAnalyzing,
    error,
    onUpload,
    onRemoveUploadedImage,
    onClearUploadedImages,
    isOptional = false,
    brandKitImages = [],
    selectedBrandKitImageIds = [],
    onToggleBrandKitImage,
    onClearBrandKitImages,
    referenceImageRoles = {},
    onReferenceRoleChange,
    aiImageDescription = '',
    onAiDescriptionChange,
    suggestedImagePrompts = [],
    customStyle = '',
    onCustomStyleChange,
    mode = 'upload',
    onModeChange,
}: ImageReferenceSelectorProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0)
    const [editedSuggestionDescriptions, setEditedSuggestionDescriptions] = useState<Record<number, string>>({})
    const inputRef = useRef<HTMLInputElement>(null)

    const totalSelected = uploadedImages.length + selectedBrandKitImageIds.length
    const canAddMore = totalSelected < MAX_REFERENCE_IMAGES
    const hasSuggestions = suggestedImagePrompts.length > 0
    const safeActiveSuggestionIdx = hasSuggestions
        ? Math.min(activeSuggestionIdx, suggestedImagePrompts.length - 1)
        : 0
    const getSuggestionText = useCallback((idx: number) => {
        const original = suggestedImagePrompts[idx] || ''
        const edited = editedSuggestionDescriptions[idx]
        return typeof edited === 'string' ? edited : original
    }, [editedSuggestionDescriptions, suggestedImagePrompts])
    const activeSuggestion = hasSuggestions ? getSuggestionText(safeActiveSuggestionIdx) : ''
    const isAiContentMode = mode === 'generate'

    const setMode = useCallback((nextMode: ImageSourceMode) => {
        if (onModeChange) onModeChange(nextMode)
    }, [onModeChange])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (!canAddMore) return

        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
        files.slice(0, MAX_REFERENCE_IMAGES - totalSelected).forEach((file) => {
            onUpload(file)
        })
        if (!isAiContentMode) setMode('upload')
    }, [onUpload, canAddMore, totalSelected, setMode, isAiContentMode])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.slice(0, MAX_REFERENCE_IMAGES - totalSelected).forEach((file) => {
            onUpload(file)
        })
        if (files.length > 0 && !isAiContentMode) setMode('upload')
        if (inputRef.current) inputRef.current.value = ''
    }, [onUpload, totalSelected, setMode, isAiContentMode])

    const applySuggestionByIndex = useCallback((idx: number) => {
        setActiveSuggestionIdx(idx)
        onAiDescriptionChange?.(getSuggestionText(idx))
        setMode('generate')
    }, [getSuggestionText, onAiDescriptionChange, setMode])

    const handleToggleAiContentMode = (checked: boolean) => {
        if (checked) {
            if (!aiImageDescription.trim() && activeSuggestion) {
                onAiDescriptionChange?.(activeSuggestion)
            }
            if (onReferenceRoleChange) {
                const selectedIds = [...uploadedImages, ...selectedBrandKitImageIds]
                selectedIds.forEach((id) => {
                    const role = referenceImageRoles[id]
                    if (role === 'content' || role === 'style_content') {
                        // When IA content is active, remove content-driven reference roles.
                        onReferenceRoleChange(id, 'logo')
                    }
                })
            }
            setMode('generate')
            return
        }
        // Exit IA mode and fallback to upload flow
        setMode('upload')
    }

    useEffect(() => {
        if (!hasSuggestions) return
        if (aiImageDescription.trim()) return
        if (!activeSuggestion) return
        onAiDescriptionChange?.(activeSuggestion)
        setMode('generate')
    }, [activeSuggestion, aiImageDescription, hasSuggestions, onAiDescriptionChange, setMode])

    const hasUploadedStyle = uploadedImages.some((id) => {
        const role = referenceImageRoles[id]
        return role === 'style' || role === 'style_content'
    })
    const hasVisualStyle = [...uploadedImages, ...selectedBrandKitImageIds].some((id) => {
        const role = referenceImageRoles[id]
        return role === 'style' || role === 'style_content'
    })
    const hasManualStyle = Boolean(customStyle.trim())
    const isManualStyleBlocked = hasVisualStyle

    const getRoleCycleForImage = (imageId: string): ReferenceImageRole[] => {
        const baseCycle: ReferenceImageRole[] = isAiContentMode
            ? ['style', 'logo']
            : ['style', 'style_content', 'content', 'logo']
        const cycleWithoutStyle = baseCycle.filter((role) => role !== 'style' && role !== 'style_content')
        if (hasManualStyle) {
            return cycleWithoutStyle.length > 0 ? cycleWithoutStyle : ['content']
        }
        const isBrandKitImage = selectedBrandKitImageIds.includes(imageId)
        if (isBrandKitImage && hasUploadedStyle) {
            return baseCycle.filter((role) => role !== 'style' && role !== 'style_content')
        }
        return baseCycle
    }

    const getNextRole = (imageId: string, role: ReferenceImageRole): ReferenceImageRole => {
        const cycle = getRoleCycleForImage(imageId)
        const currentIndex = cycle.indexOf(role)
        if (currentIndex === -1) return cycle[0]
        return cycle[(currentIndex + 1) % cycle.length]
    }

    const roleLabel = (role: ReferenceImageRole) => {
        if (role === 'style') return 'Estilo'
        if (role === 'style_content') return 'Estilo+Contenido'
        if (role === 'logo') return 'Logo Aux'
        return 'Contenido'
    }

    const roleChipClasses = (role: ReferenceImageRole) => {
        if (role === 'style') return 'bg-violet-500/85 text-white'
        if (role === 'style_content') return 'bg-fuchsia-500/85 text-white'
        if (role === 'logo') return 'bg-amber-500/85 text-white'
        return 'bg-sky-500/85 text-white'
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Wand2 className="w-3.5 h-3.5" />
                        Contenido generado con IA
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={isAiContentMode} onCheckedChange={handleToggleAiContentMode} />
                    </div>
                </div>
                {hasSuggestions ? (
                    <>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {suggestedImagePrompts.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => applySuggestionByIndex(idx)}
                                    className={cn(
                                        'h-6 px-2.5 rounded-full text-[10px] border transition-all',
                                        idx === activeSuggestionIdx
                                            ? 'border-primary/50 bg-primary/15 text-primary'
                                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    Propuesta {idx + 1}
                            </button>
                        ))}
                    </div>
                    </>
                ) : (
                    <>
                        <div className="rounded-xl border border-dashed border-border bg-background px-3 py-3">
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Aún no hay una propuesta visual sugerida. Pulsa Analizar para que el modelo proponga una dirección de imagen.
                            </p>
                        </div>
                    </>
                )}
                <div className="space-y-2">
                <Textarea
                    id="ai-image-description"
                    value={aiImageDescription}
                    onChange={(e) => {
                        const nextValue = e.target.value
                        onAiDescriptionChange?.(nextValue)
                        if (hasSuggestions) {
                            setEditedSuggestionDescriptions((prev) => ({
                                ...prev,
                                [safeActiveSuggestionIdx]: nextValue,
                            }))
                        }
                        setMode('generate')
                    }}
                    placeholder="Describe la imagen que quieres generar..."
                    className="min-h-[96px] text-xs resize-none"
                />
                <div className="flex items-center justify-between px-0.5">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        La IA generará una imagen con esta descripción
                    </p>
                    {hasSuggestions && (
                        <button
                            type="button"
                            onClick={() => {
                                const original = suggestedImagePrompts[safeActiveSuggestionIdx] || ''
                                setEditedSuggestionDescriptions((prev) => {
                                    const next = { ...prev }
                                    delete next[safeActiveSuggestionIdx]
                                    return next
                                })
                                onAiDescriptionChange?.(original)
                                setMode('generate')
                            }}
                            className="text-[10px] text-muted-foreground hover:text-foreground"
                        >
                            Restaurar
                        </button>
                    )}
                    {!hasSuggestions && !!aiImageDescription.trim() && (
                        <button
                            type="button"
                            onClick={() => onAiDescriptionChange?.('')}
                            className="text-[10px] text-muted-foreground hover:text-foreground"
                        >
                            Restaurar
                        </button>
                    )}
                </div>
                {isAiContentMode && (
                    <p className="text-[10px] text-muted-foreground">
                        Modo IA activo: las referencias solo pueden marcarse como `Estilo` o `Logo Aux` para mantener consistencia visual en la generación.
                    </p>
                )}
            </div>
            </div>

            <div className={cn('space-y-3 rounded-2xl border p-3.5 transition-all', mode === 'upload' ? 'border-primary/40 bg-primary/5' : 'border-border/70 bg-muted/20')}>
                <div className="flex items-center justify-between">
                    <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Upload className="w-3.5 h-3.5" />
                        Subir referencias
                    </p>
                </div>

                {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                        {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border border-border/60 bg-background aspect-square group">
                                <img src={img} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                                {onRemoveUploadedImage && (
                                    <button
                                        onClick={() => onRemoveUploadedImage(img)}
                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-all z-10 opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                                {onReferenceRoleChange && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const currentRole = referenceImageRoles[img] || 'content'
                                            onReferenceRoleChange(img, getNextRole(img, currentRole))
                                        }}
                                        title="Cambiar rol"
                                        className={cn('absolute top-1 left-1 text-[9px] px-2 py-0.5 rounded-full font-semibold transition-all z-10', roleChipClasses(referenceImageRoles[img] || 'content'))}
                                    >
                                        {roleLabel(referenceImageRoles[img] || 'content')}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {canAddMore && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            'relative rounded-2xl border-2 border-dashed transition-all cursor-pointer group overflow-hidden flex flex-col items-center justify-center gap-2.5',
                            uploadedImages.length > 0 ? 'h-20' : 'h-32',
                            isDragging ? 'border-primary bg-primary/10 scale-[0.99]' : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'
                        )}
                    >
                        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                            {isDragging ? <Upload className="w-4 h-4" /> : uploadedImages.length > 0 ? <Plus className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                        </div>
                        <p className="text-xs font-semibold text-foreground">
                            {isDragging ? 'Suelta las imágenes' : uploadedImages.length > 0 ? 'Añadir más imágenes' : 'Sube tus referencias'}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            {uploadedImages.length > 0 ? `${MAX_REFERENCE_IMAGES - totalSelected} disponibles` : 'Arrastra o haz clic (max. 10)'}
                        </p>
                    </div>
                )}

                {!canAddMore && (
                    <div className="text-center py-2 px-3 bg-muted rounded-lg border border-border">
                        <p className="text-[10px] text-muted-foreground">Máximo de {MAX_REFERENCE_IMAGES} imágenes alcanzado</p>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="mt-1 flex items-center gap-2 px-1">
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        <span className="text-[10px] text-muted-foreground">Analizando imagen...</span>
                    </div>
                )}

                {error && (
                    <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-destructive" />
                        <p className="text-[10px] text-destructive font-medium">{error}</p>
                    </div>
                )}
            </div>

            <div className={cn('space-y-3 rounded-2xl border p-3.5 transition-all', mode === 'brandkit' ? 'border-primary/40 bg-primary/5' : 'border-border/70 bg-muted/20')}>
                <div className="flex items-center justify-between">
                    <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Palette className="w-3.5 h-3.5" />
                        Kit de Marca
                    </p>
                    <div className="flex items-center gap-2">
                        {selectedBrandKitImageIds.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onClearBrandKitImages?.()}
                                className="text-[10px] text-muted-foreground hover:text-foreground"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {brandKitImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {brandKitImages.map((img) => {
                            const isSelected = selectedBrandKitImageIds.includes(img.id)
                            const canSelect = canAddMore || isSelected
                            return (
                                <button
                                    key={img.id}
                                    onClick={() => {
                                        if (!canSelect) return
                                        onToggleBrandKitImage?.(img.id)
                                        if (!isAiContentMode) setMode('brandkit')
                                    }}
                                    disabled={!canSelect}
                                    className={cn(
                                        'relative rounded-xl overflow-hidden border transition-all aspect-square group',
                                        isSelected
                                            ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[0.98]'
                                            : canSelect
                                                ? 'border-border hover:border-primary/50'
                                                : 'border-border opacity-50 cursor-not-allowed'
                                    )}
                                >
                                    <img src={img.url} alt={img.name || 'Brand image'} className="w-full h-full object-cover" />
                                    {isSelected && onReferenceRoleChange && (
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                const currentRole = referenceImageRoles[img.id] || 'content'
                                                onReferenceRoleChange(img.id, getNextRole(img.id, currentRole))
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    const currentRole = referenceImageRoles[img.id] || 'content'
                                                    onReferenceRoleChange(img.id, getNextRole(img.id, currentRole))
                                                }
                                            }}
                                            title="Cambiar rol"
                                            className={cn('absolute top-1 left-1 text-[9px] px-2 py-0.5 rounded-full font-semibold transition-all z-30 cursor-pointer', roleChipClasses(referenceImageRoles[img.id] || 'content'))}
                                        >
                                            {roleLabel(referenceImageRoles[img.id] || 'content')}
                                        </div>
                                    )}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[1px] z-20">
                                            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div className="h-28 rounded-2xl border border-dashed border-border bg-background flex flex-col items-center justify-center gap-2 text-center p-4">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Palette className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-[10px] text-muted-foreground">No hay imágenes en el Kit de Marca</p>
                    </div>
                )}
            </div>

            {onReferenceRoleChange && (
                <p className="text-[10px] text-muted-foreground">
                    Tip: pulsa la etiqueta de cada imagen seleccionada para cambiar su rol
                    {isAiContentMode
                        ? ' (`Estilo` o `Logo Aux`).'
                        : ' (`Estilo`, `Estilo+Contenido`, `Contenido` o `Logo`).'}
                </p>
            )}

            {onCustomStyleChange && (
                <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-3.5 transition-all">
                    <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Type className="w-3.5 h-3.5" />
                        Estilo por texto
                    </p>
                    <div className="relative group">
                        <input
                            type="text"
                            value={customStyle}
                            onChange={(e) => {
                                if (isManualStyleBlocked) return
                                onCustomStyleChange(e.target.value)
                            }}
                            onFocus={() => {
                                if (isManualStyleBlocked) return
                                setMode('generate')
                            }}
                            placeholder="Escribe aquí el estilo (ej: Cyberpunk, Acuarela, Lego...)"
                            disabled={isManualStyleBlocked}
                            className={cn(
                                'w-full h-11 px-4 rounded-xl bg-background border border-border',
                                'text-sm transition-all duration-300 placeholder:text-muted-foreground/70',
                                'focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
                                'hover:border-border/80',
                                isManualStyleBlocked && 'opacity-60 cursor-not-allowed'
                            )}
                        />
                        {customStyle && !isManualStyleBlocked ? (
                            <button
                                type="button"
                                onClick={() => onCustomStyleChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                aria-label="Limpiar estilo por texto"
                                title="Limpiar"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                {customStyle ? <Check className="w-4 h-4 text-primary" /> : <RefreshCw className="w-4 h-4 opacity-50" />}
                            </div>
                        )}
                    </div>
                    {isManualStyleBlocked && (
                        <p className="text-[10px] text-muted-foreground">
                            Ya hay una referencia visual marcada como `Estilo`. Quita ese rol para habilitar esta fuente manual.
                        </p>
                    )}
                </div>
            )}

            {(visionAnalysis || !isOptional || totalSelected > 0) && (
                <div className="flex items-center justify-between pt-1 px-0.5">
                    <p className="text-[10px] text-muted-foreground">
                        {totalSelected > 0 ? `${totalSelected} referencia(s) activa(s)` : 'Puedes continuar sin referencia'}
                    </p>
                    {totalSelected > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                onClearUploadedImages?.()
                                onClearBrandKitImages?.()
                            }}
                            className="text-[10px] text-muted-foreground hover:text-foreground"
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
