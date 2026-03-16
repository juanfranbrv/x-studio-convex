'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconCheck, IconImage, IconPalette, IconUpload, IconClose } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ReferenceImageRole } from '@/lib/creation-flow-types'
import { useTranslation } from 'react-i18next'

interface StyleImageCardProps {
    uploadedImages: string[]
    onUpload: (file: File, roleHint?: ReferenceImageRole) => void
    onRemoveUploadedImage?: (url: string) => void
    brandKitImages?: Array<{ id: string; url: string; name?: string }>
    selectedBrandKitImageIds?: string[]
    onToggleBrandKitImage?: (imageId: string) => void
    referenceImageRoles?: Record<string, ReferenceImageRole>
    onReferenceRoleChange?: (imageId: string, role: ReferenceImageRole) => void
    stylePresets?: Array<{
        _id: string
        name?: string
        image_url: string
    }>
    stylePresetsStatus?: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted'
    onLoadMoreStylePresets?: () => void
    selectedStylePresetId?: string | null
    selectedStylePresetName?: string | null
    onSelectStylePreset?: (preset: { id: string; name?: string } | null) => void
    isAnalyzing?: boolean
    error?: string | null
}

const isStyleRole = (role?: ReferenceImageRole) => role === 'style' || role === 'style_content'
const hasRenderableImage = (url?: string) => typeof url === 'string' && url.trim().length > 0

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
    stylePresetsStatus = 'Exhausted',
    onLoadMoreStylePresets,
    selectedStylePresetId = null,
    onSelectStylePreset,
    isAnalyzing = false,
    error = null,
}: StyleImageCardProps) {
    const { t } = useTranslation('common')
    const tt = (key: string, defaultValue: string, options?: Record<string, unknown>) =>
        t(key, { defaultValue, ...options })
    const [isDragging, setIsDragging] = useState(false)
    const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false)
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false)
    const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(new Set())
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
            ? { id: currentStyleId, url: currentStyleId, name: tt('styleImage.uploadedStyle', 'Uploaded style') }
            : brandKitMap.get(currentStyleId) || null)
        : null

    const selectedPreset = useMemo(
        () => (selectedStylePresetId ? stylePresets.find((preset) => preset._id === selectedStylePresetId) || null : null),
        [selectedStylePresetId, stylePresets]
    )
    const canRenderImageUrl = useCallback((url?: string) => {
        if (!hasRenderableImage(url)) return false
        return !failedImageUrls.has(String(url))
    }, [failedImageUrls])
    const markImageAsFailed = useCallback((url?: string) => {
        if (!url) return
        setFailedImageUrls((prev) => {
            if (prev.has(url)) return prev
            const next = new Set(prev)
            next.add(url)
            return next
        })
    }, [])

    const visualStylePreview = currentStyleImage
        ? {
            id: currentStyleImage.id,
            url: currentStyleImage.url,
            sourceLabel: currentStyleIsUpload ? tt('styleImage.uploadedBadge', 'Uploaded') : tt('styleImage.brandKitBadge', 'Brand Kit'),
            title: currentStyleImage.name || tt('styleImage.referenceTitle', 'Style reference'),
            removable: true,
        }
            : selectedPreset
            ? {
                id: selectedPreset._id,
                url: selectedPreset.image_url,
                sourceLabel: tt('styleImage.presetBadge', 'Preset'),
                title: selectedPreset.name || tt('styleImage.presetTitle', 'Preset style'),
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
        onUpload(file, 'style')
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
                <div className="w-full flex items-center gap-2">
                    <div className="grid grid-cols-3 gap-1.5 flex-1 min-w-0">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-1.5 text-[10px] gap-1 min-w-0"
                            onClick={() => inputRef.current?.click()}
                        >
                            <IconUpload className="w-3 h-3 shrink-0" />
                            <span className="truncate">{tt('styleImage.upload', 'Upload style')}</span>
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-1.5 text-[10px] gap-1 min-w-0"
                            onClick={() => setIsBrandKitModalOpen(true)}
                        >
                            <IconPalette className="w-3 h-3 shrink-0" />
                            <span className="truncate">{tt('styleImage.fromBrandKit', 'From Brand Kit')}</span>
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-1.5 text-[10px] gap-1 min-w-0"
                            onClick={() => setIsPresetModalOpen(true)}
                        >
                            <span className="truncate">{tt('styleImage.presetButton', 'Preset style')}</span>
                        </Button>
                    </div>

                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className={cn(
                            'h-7 px-2 text-[10px] shrink-0',
                            !currentStyleId && !selectedStylePresetId && 'invisible pointer-events-none'
                        )}
                        onClick={() => {
                            if (currentStyleId) {
                                removeStyleId(currentStyleId)
                                return
                            }
                            if (selectedStylePresetId) {
                                onSelectStylePreset?.(null)
                            }
                        }}
                    >
                        {tt('styleImage.clear', 'Clear')}
                    </Button>
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
                        <div className="rounded-lg border border-border/70 shadow-sm bg-background p-1 shrink-0 w-[6.5rem]">
                            {canRenderImageUrl(visualStylePreview.url) ? (
                                <img
                                    src={visualStylePreview.url}
                                    alt={visualStylePreview.title || tt('styleImage.previewAlt', 'Style preview')}
                                    className="w-full aspect-[2/3] rounded-md object-cover"
                                    onError={() => markImageAsFailed(visualStylePreview.url)}
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] rounded-md bg-muted/50 text-[11px] text-muted-foreground flex items-center justify-center">
                                    {tt('styleImage.noImage', 'No image')}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                            <span className="inline-flex rounded-full px-2 py-1 text-[10px] font-semibold bg-violet-500/10 text-violet-700 border border-violet-500/30">
                                {visualStylePreview.sourceLabel}
                            </span>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {tt('styleImage.activeHint', 'Active style reference for the next generation.')}
                            </p>
                        </div>
                    </div>

                    {visualStylePreview.removable ? (
                        <button
                            type="button"
                            onClick={() => removeStyleId(visualStylePreview.id)}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={tt('styleImage.removeAria', 'Remove style image')}
                        >
                            <IconClose className="w-3 h-3" />
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
                        {isDragging ? <IconUpload className="w-4 h-4 text-primary" /> : <IconImage className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <p className="text-xs font-medium">
                        {isDragging ? tt('styleImage.dropHere', 'Drop your style image') : tt('styleImage.dragOrClick', 'Drag one style image here or click')}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        {tt('styleImage.singleHint', 'Only one style image. If you choose another, it replaces the current one.')}
                    </p>
                </div>
            )}

            {isAnalyzing && (
                <div className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Loader2 className="w-3 h-3 text-primary" />
                    {tt('styleImage.analyzing', 'Analyzing style...')}
                </div>
            )}
            {error && (
                <p className="text-[10px] text-destructive">{error}</p>
            )}

            <Dialog open={isBrandKitModalOpen} onOpenChange={setIsBrandKitModalOpen}>
                <DialogContent className="!w-[64vw] !max-w-[64vw] sm:!max-w-[64vw] h-[min(88vh,860px)] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-6 pt-6 pb-3">
                        <DialogTitle>{tt('styleImage.selectFromBrandKitTitle', 'Select style from Brand Kit')}</DialogTitle>
                        <DialogDescription>
                            {tt('styleImage.selectFromBrandKitDescription', 'You can only choose one style image. If you select another one, it replaces the current one.')}
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
                                            <img src={image.url} alt={image.name || tt('styleImage.brandKitImageAlt', 'Brand Kit image')} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center">
                                                        <IconCheck className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border mt-1 p-6 text-center text-sm text-muted-foreground">
                                {tt('styleImage.noBrandKitImages', 'This Brand Kit does not have any images yet.')}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border px-6 py-3 flex justify-end">
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setIsBrandKitModalOpen(false)}
                        >
                            {tt('actions.continue', 'Continue')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPresetModalOpen} onOpenChange={setIsPresetModalOpen}>
                <DialogContent className="h-[min(84vh,920px)] w-[min(94vw,1240px)] !max-w-[min(94vw,1240px)] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-6 pt-6 pb-3">
                        <DialogTitle>{tt('styleImage.selectPresetTitle', 'Select preset style')}</DialogTitle>
                        <DialogDescription>
                            {tt('styleImage.selectPresetDescription', 'This style uses a saved analysis and is injected directly into the prompt.')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
                        {stylePresets.length > 0 ? (
                            <div className="space-y-4">
                                <div className="text-xs text-muted-foreground">
                                    {tt('styleImage.showingPresets', 'Showing {{count}} styles', { count: stylePresets.length })}
                                </div>
                                <div className="grid content-start [grid-template-columns:repeat(auto-fill,minmax(118px,1fr))] gap-3 sm:[grid-template-columns:repeat(auto-fill,minmax(124px,1fr))]">
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
                                                    })
                                                    setIsPresetModalOpen(false)
                                                }}
                                                className={cn(
                                                    'relative w-full rounded-xl overflow-hidden border transition-all text-left group',
                                                    isSelected
                                                        ? 'border-primary ring-2 ring-primary/20'
                                                        : 'border-border hover:border-primary/40'
                                                )}
                                            >
                                                <div className="aspect-[2/3]">
                                                    {canRenderImageUrl(preset.image_url) ? (
                                                        <img
                                                            src={preset.image_url}
                                                            alt={preset.name || tt('styleImage.presetTitle', 'Preset style')}
                                                            className="w-full h-full object-cover"
                                                            onError={() => markImageAsFailed(preset.image_url)}
                                                        />
                                                ) : (
                                                        <div className="w-full h-full bg-muted/50 flex items-center justify-center text-[11px] text-muted-foreground font-medium">
                                                            {tt('styleImage.noImage', 'No image')}
                                                        </div>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center">
                                                        <IconCheck className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                                {stylePresetsStatus !== 'Exhausted' ? (
                                    <div className="flex justify-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={onLoadMoreStylePresets}
                                            disabled={stylePresetsStatus === 'LoadingFirstPage' || stylePresetsStatus === 'LoadingMore'}
                                        >
                                            {stylePresetsStatus === 'LoadingFirstPage' || stylePresetsStatus === 'LoadingMore'
                                                ? <Loader2 className="w-4 h-4 mr-2" />
                                                : null}
                                            {tt('styleImage.loadMore', 'Load more styles')}
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border mt-1 p-6 text-center text-sm text-muted-foreground">
                                {tt('styleImage.noActivePresets', 'There are no active preset styles.')}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border px-6 py-3 flex justify-end">
                        <Button type="button" size="sm" onClick={() => setIsPresetModalOpen(false)}>
                            {tt('actions.continue', 'Continue')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}


