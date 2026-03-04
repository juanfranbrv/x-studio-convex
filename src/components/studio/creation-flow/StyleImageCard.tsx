'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Image as ImageIcon, Loader2, Palette, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ReferenceImageRole } from '@/lib/creation-flow-types'

interface StyleImageCardProps {
    uploadedImages: string[]
    onUpload: (file: File) => void
    onRemoveUploadedImage?: (url: string) => void
    brandKitImages?: Array<{ id: string; url: string; name?: string }>
    selectedBrandKitImageIds?: string[]
    onToggleBrandKitImage?: (imageId: string) => void
    referenceImageRoles?: Record<string, ReferenceImageRole>
    onReferenceRoleChange?: (imageId: string, role: ReferenceImageRole) => void
    stylePresets?: Array<{
        _id: string
        name: string
        description?: string
        image_url: string
        analysis: unknown
    }>
    selectedStylePresetId?: string | null
    selectedStylePresetName?: string | null
    onSelectStylePreset?: (preset: { id: string; name: string; analysis: unknown } | null) => void
    isAnalyzing?: boolean
    error?: string | null
}

const isStyleRole = (role?: ReferenceImageRole) => role === 'style' || role === 'style_content'

export function StyleImageCard({
    uploadedImages = [],
    onUpload,
    onRemoveUploadedImage,
    brandKitImages = [],
    selectedBrandKitImageIds = [],
    onToggleBrandKitImage,
    referenceImageRoles = {},
    onReferenceRoleChange,
    stylePresets = [],
    selectedStylePresetId = null,
    selectedStylePresetName = null,
    onSelectStylePreset,
    isAnalyzing = false,
    error = null,
}: StyleImageCardProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false)
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const previousUploadedRef = useRef<string[]>(uploadedImages)
    const waitingForUploadedStyleRef = useRef(false)

    const brandKitMap = useMemo(() => {
        const map = new Map<string, { id: string; url: string; name?: string }>()
        brandKitImages.forEach((image) => map.set(image.id, image))
        return map
    }, [brandKitImages])

    const styleIds = useMemo(
        () => [...uploadedImages, ...selectedBrandKitImageIds].filter((id) => isStyleRole(referenceImageRoles[id])),
        [uploadedImages, selectedBrandKitImageIds, referenceImageRoles]
    )

    const currentStyleId = styleIds.length > 0 ? styleIds[styleIds.length - 1] : null
    const currentStyleIsUpload = Boolean(currentStyleId && uploadedImages.includes(currentStyleId))
    const currentStyleImage = currentStyleId
        ? (currentStyleIsUpload
            ? { id: currentStyleId, url: currentStyleId, name: 'Estilo subido' }
            : brandKitMap.get(currentStyleId) || null)
        : null

    const selectedPreset = useMemo(
        () => (selectedStylePresetId ? stylePresets.find((preset) => preset._id === selectedStylePresetId) || null : null),
        [selectedStylePresetId, stylePresets]
    )

    const visualStylePreview = currentStyleImage
        ? {
            id: currentStyleImage.id,
            url: currentStyleImage.url,
            sourceLabel: currentStyleIsUpload ? 'Subido' : 'Kit de marca',
            title: currentStyleImage.name || 'Referencia de estilo',
            removable: true,
        }
        : selectedPreset
            ? {
                id: selectedPreset._id,
                url: selectedPreset.image_url,
                sourceLabel: 'Predefinido',
                title: selectedPreset.name,
                removable: false,
            }
            : null

    const removeStyleId = useCallback((id: string) => {
        if (uploadedImages.includes(id)) {
            onRemoveUploadedImage?.(id)
            return
        }
        if (selectedBrandKitImageIds.includes(id)) {
            onToggleBrandKitImage?.(id)
        }
    }, [uploadedImages, selectedBrandKitImageIds, onRemoveUploadedImage, onToggleBrandKitImage])

    const applyAsSingleStyle = useCallback((id: string, source: 'upload' | 'brandkit') => {
        if (!onReferenceRoleChange) return
        onSelectStylePreset?.(null)

        styleIds
            .filter((existingId) => existingId !== id)
            .forEach((existingId) => removeStyleId(existingId))

        if (source === 'brandkit' && !selectedBrandKitImageIds.includes(id)) {
            onToggleBrandKitImage?.(id)
        }

        onReferenceRoleChange(id, 'style')
    }, [onReferenceRoleChange, onSelectStylePreset, onToggleBrandKitImage, removeStyleId, selectedBrandKitImageIds, styleIds])

    useEffect(() => {
        if (!waitingForUploadedStyleRef.current) {
            previousUploadedRef.current = uploadedImages
            return
        }

        const added = uploadedImages.filter((id) => !previousUploadedRef.current.includes(id))
        if (added.length === 0) return

        const latestId = added[added.length - 1]
        applyAsSingleStyle(latestId, 'upload')
        waitingForUploadedStyleRef.current = false
        previousUploadedRef.current = uploadedImages
    }, [uploadedImages, applyAsSingleStyle])

    const handleUploadFiles = useCallback((files: File[]) => {
        if (files.length === 0) return
        const file = files.find((item) => item.type.startsWith('image/'))
        if (!file) return
        waitingForUploadedStyleRef.current = true
        onUpload(file)
    }, [onUpload])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleUploadFiles(Array.from(e.dataTransfer.files))
    }, [handleUploadFiles])

    const handleSelectFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleUploadFiles(Array.from(e.target.files || []))
        if (inputRef.current) inputRef.current.value = ''
    }, [handleUploadFiles])

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="w-full flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[10px] gap-1"
                        onClick={() => inputRef.current?.click()}
                    >
                        <Upload className="w-3 h-3" />
                        Subir estilo
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[10px] gap-1"
                        onClick={() => setIsBrandKitModalOpen(true)}
                    >
                        <Palette className="w-3 h-3" />
                        Desde Kit de marca
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[10px] gap-1"
                        onClick={() => setIsPresetModalOpen(true)}
                    >
                        Estilo predefinido
                    </Button>
                    {currentStyleId && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] ml-auto"
                            onClick={() => removeStyleId(currentStyleId)}
                        >
                            Limpiar
                        </Button>
                    )}
                    {!currentStyleId && selectedStylePresetId && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] ml-auto"
                            onClick={() => onSelectStylePreset?.(null)}
                        >
                            Limpiar
                        </Button>
                    )}
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleSelectFiles}
                className="hidden"
            />

            {visualStylePreview ? (
                <div className="relative rounded-xl border border-border/60 bg-background p-3 min-h-[120px] group">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-border/70 shadow-sm bg-background p-1 shrink-0">
                            <img
                                src={visualStylePreview.url}
                                alt={visualStylePreview.title || 'Vista de estilo'}
                                className="w-20 h-20 rounded-md object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                            <span className="inline-flex rounded-full px-2 py-1 text-[10px] font-semibold bg-violet-500/10 text-violet-700 border border-violet-500/30">
                                {visualStylePreview.sourceLabel}
                            </span>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Referencia de estilo activa para la próxima generación.
                            </p>
                        </div>
                    </div>

                    {visualStylePreview.removable ? (
                        <button
                            type="button"
                            onClick={() => removeStyleId(visualStylePreview.id)}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Eliminar imagen de estilo"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    ) : null}
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        'rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center p-4',
                        isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'
                    )}
                >
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                        {isDragging ? <Upload className="w-4 h-4 text-primary" /> : <ImageIcon className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <p className="text-xs font-medium">
                        {isDragging ? 'Suelta tu imagen de estilo' : 'Arrastra 1 imagen de estilo o haz clic'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        Solo una imagen de estilo. Si eliges otra, reemplaza a la anterior.
                    </p>
                </div>
            )}

            {isAnalyzing && (
                <div className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    Analizando estilo...
                </div>
            )}
            {error && (
                <p className="text-[10px] text-destructive">{error}</p>
            )}

            <Dialog open={isBrandKitModalOpen} onOpenChange={setIsBrandKitModalOpen}>
                <DialogContent className="!w-[64vw] !max-w-[64vw] sm:!max-w-[64vw] h-[min(88vh,860px)] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-6 pt-6 pb-3">
                        <DialogTitle>Seleccionar estilo desde Kit de marca</DialogTitle>
                        <DialogDescription>
                            Solo puedes elegir una imagen de estilo. Si seleccionas otra, sustituye la actual.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
                        {brandKitImages.length > 0 ? (
                            <div className="grid content-start [grid-template-columns:repeat(auto-fill,minmax(132px,1fr))] gap-3">
                                {brandKitImages.map((image) => {
                                    const isSelected = currentStyleId === image.id
                                    return (
                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() => {
                                                applyAsSingleStyle(image.id, 'brandkit')
                                                setIsBrandKitModalOpen(false)
                                            }}
                                            className={cn(
                                                'relative w-full rounded-xl overflow-hidden border aspect-square transition-all',
                                                isSelected
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-border hover:border-primary/40'
                                            )}
                                        >
                                            <img src={image.url} alt={image.name || 'Imagen de Kit de marca'} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center">
                                                        <Check className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border mt-1 p-6 text-center text-sm text-muted-foreground">
                                Este Kit de marca no tiene imagenes aun.
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border px-6 py-3 flex justify-end">
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setIsBrandKitModalOpen(false)}
                        >
                            Aceptar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPresetModalOpen} onOpenChange={setIsPresetModalOpen}>
                <DialogContent className="!w-[64vw] !max-w-[64vw] sm:!max-w-[64vw] h-[min(93vh,980px)] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-6 pt-6 pb-3">
                        <DialogTitle>Seleccionar estilo predefinido</DialogTitle>
                        <DialogDescription>
                            Este estilo usa un analisis ya guardado y se inyecta directamente en el prompt.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
                        {stylePresets.length > 0 ? (
                            <div className="grid content-start [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-3">
                                {stylePresets.map((preset) => {
                                    const isSelected = selectedStylePresetId === preset._id
                                    return (
                                        <button
                                            key={preset._id}
                                            type="button"
                                            onClick={() => {
                                                onSelectStylePreset?.({
                                                    id: preset._id,
                                                    name: preset.name,
                                                    analysis: preset.analysis,
                                                })
                                                setIsPresetModalOpen(false)
                                            }}
                                            className={cn(
                                                'relative w-full rounded-xl overflow-hidden border transition-all text-left',
                                                isSelected
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-border hover:border-primary/40'
                                            )}
                                        >
                                            <div className="aspect-square">
                                                <img src={preset.image_url} alt={preset.name} className="w-full h-full object-cover" />
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border mt-1 p-6 text-center text-sm text-muted-foreground">
                                No hay estilos predefinidos activos.
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border px-6 py-3 flex justify-end">
                        <Button type="button" size="sm" onClick={() => setIsPresetModalOpen(false)}>
                            Aceptar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
