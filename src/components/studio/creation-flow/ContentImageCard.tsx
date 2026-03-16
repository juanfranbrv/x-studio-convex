'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { IconCheck, IconImage, IconPalette, IconSparkles, IconUpload, IconClose } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { ReferenceImageRole, VisionAnalysis } from '@/lib/creation-flow-types'
import { useTranslation } from 'react-i18next'

type ImageSourceMode = 'upload' | 'brandkit' | 'generate'

const MAX_CONTENT_IMAGES = 8

interface ContentImageCardProps {
    mode?: ImageSourceMode
    onModeChange?: (mode: ImageSourceMode) => void
    uploadedImages: string[]
    onUpload: (file: File, roleHint?: ReferenceImageRole) => void
    onRemoveUploadedImage?: (url: string) => void
    onClearUploadedImages?: () => void
    brandKitImages?: Array<{ id: string; url: string; name?: string }>
    selectedBrandKitImageIds?: string[]
    onToggleBrandKitImage?: (imageId: string) => void
    onClearBrandKitImages?: () => void
    referenceImageRoles?: Record<string, ReferenceImageRole>
    onReferenceRoleChange?: (imageId: string, role: ReferenceImageRole) => void
    aiImageDescription?: string
    onAiDescriptionChange?: (description: string) => void
    suggestedImagePrompts?: string[]
    isAnalyzing?: boolean
    error?: string | null
    visionAnalysis?: VisionAnalysis | null
}

export function ContentImageCard({
    mode = 'upload',
    onModeChange,
    uploadedImages = [],
    onUpload,
    onRemoveUploadedImage,
    onClearUploadedImages,
    brandKitImages = [],
    selectedBrandKitImageIds = [],
    onToggleBrandKitImage,
    onClearBrandKitImages,
    referenceImageRoles = {},
    onReferenceRoleChange,
    aiImageDescription = '',
    onAiDescriptionChange,
    suggestedImagePrompts = [],
    error = null,
}: ContentImageCardProps) {
    const { t } = useTranslation('common')
    const tt = (key: string, defaultValue: string, options?: Record<string, unknown>) =>
        t(key, { defaultValue, ...options })
    const [isDragging, setIsDragging] = useState(false)
    const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false)
    const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0)
    const [editedSuggestionDescriptions, setEditedSuggestionDescriptions] = useState<Record<number, string>>({})
    const inputRef = useRef<HTMLInputElement>(null)

    const isAiContentMode = mode === 'generate'
    const isContentRole = useCallback((id: string) => {
        const role = referenceImageRoles[id]
        if (!role) return true
        return role === 'content' || role === 'style_content'
    }, [referenceImageRoles])

    const contentUploadedImages = useMemo(
        () => uploadedImages.filter((id) => isContentRole(id)),
        [uploadedImages, isContentRole]
    )
    const contentBrandKitImageIds = useMemo(
        () => selectedBrandKitImageIds.filter((id) => isContentRole(id)),
        [selectedBrandKitImageIds, isContentRole]
    )

    const totalManualSelected = contentUploadedImages.length + contentBrandKitImageIds.length
    const canAddMoreManual = totalManualSelected < MAX_CONTENT_IMAGES
    const hasSuggestions = suggestedImagePrompts.length > 0
    const safeSuggestionIndex = hasSuggestions ? Math.min(activeSuggestionIdx, suggestedImagePrompts.length - 1) : 0

    const getSuggestionText = useCallback((index: number) => {
        const original = suggestedImagePrompts[index] || ''
        const edited = editedSuggestionDescriptions[index]
        return typeof edited === 'string' ? edited : original
    }, [editedSuggestionDescriptions, suggestedImagePrompts])


    const selectedBrandKitMap = useMemo(() => {
        const map = new Map<string, { id: string; url: string; name?: string }>()
        for (const image of brandKitImages) {
            map.set(image.id, image)
        }
        return map
    }, [brandKitImages])

    const setMode = useCallback((nextMode: ImageSourceMode) => {
        onModeChange?.(nextMode)
    }, [onModeChange])

    const applySuggestion = useCallback((index: number) => {
        setActiveSuggestionIdx(index)
        onAiDescriptionChange?.(getSuggestionText(index))
        setMode('generate')
    }, [getSuggestionText, onAiDescriptionChange, setMode])

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
        if (isAiContentMode || !canAddMoreManual) return
        const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'))
        files.slice(0, MAX_CONTENT_IMAGES - totalManualSelected).forEach((file) => onUpload(file, 'content'))
        setMode('upload')
    }, [isAiContentMode, canAddMoreManual, totalManualSelected, onUpload, setMode])

    const handleSelectFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (isAiContentMode) return
        files.slice(0, MAX_CONTENT_IMAGES - totalManualSelected).forEach((file) => onUpload(file, 'content'))
        if (files.length > 0) setMode('upload')
        if (inputRef.current) inputRef.current.value = ''
    }, [isAiContentMode, totalManualSelected, onUpload, setMode])

    const renderManualPreview = () => {
        const selectedBrandKitImages = contentBrandKitImageIds
            .map((id) => selectedBrandKitMap.get(id))
            .filter((item): item is { id: string; url: string; name?: string } => Boolean(item))

        const hasManual = contentUploadedImages.length > 0 || selectedBrandKitImages.length > 0
        if (!hasManual) return null

        return (
            <div className="grid grid-cols-3 gap-2">
                {contentUploadedImages.map((url, index) => (
                    <div key={url} className="relative rounded-xl overflow-hidden border border-border/60 bg-background aspect-square group">
                        <img src={url} alt={tt('contentImage.ownImageAlt', 'Own content image {{index}}', { index: index + 1 })} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold bg-sky-500/85 text-white">
                            {tt('contentImage.contentBadge', 'Content')}
                        </span>
                        {onRemoveUploadedImage && (
                            <button
                                type="button"
                                onClick={() => onRemoveUploadedImage(url)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={tt('contentImage.removeUploadedAria', 'Remove content image')}
                            >
                                <IconClose className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
                {selectedBrandKitImages.map((image) => (
                    <button
                        key={image.id}
                        type="button"
                        onClick={() => onToggleBrandKitImage?.(image.id)}
                        className="relative rounded-xl overflow-hidden border border-border/60 bg-background aspect-square group"
                        title={tt('contentImage.removeFromContentTitle', 'Remove from content')}
                    >
                        <img src={image.url} alt={image.name || tt('contentImage.brandKitImageAlt', 'Brand Kit image')} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/85 text-white">
                            {tt('contentImage.brandKitBadge', 'Brand Kit')}
                        </span>
                        <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity inline-flex">
                            <IconClose className="w-3 h-3" />
                        </span>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {isAiContentMode ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    {hasSuggestions ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {suggestedImagePrompts.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => applySuggestion(index)}
                                    className={cn(
                                        'h-6 px-2.5 rounded-full text-[10px] border transition-all',
                                        index === activeSuggestionIdx
                                            ? 'border-primary/50 bg-primary/15 text-primary'
                                            : 'border-border bg-background text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {tt('contentImage.suggestion', 'Suggestion {{index}}', { index: index + 1 })}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border bg-background px-3 py-2.5">
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                {tt('contentImage.analyzeHint', 'Press Analyze to generate visual content suggestions with AI.')}
                            </p>
                        </div>
                    )}

                    <Textarea
                        value={aiImageDescription}
                        onChange={(e) => {
                            const next = e.target.value
                            onAiDescriptionChange?.(next)
                            if (hasSuggestions) {
                                setEditedSuggestionDescriptions((prev) => ({
                                    ...prev,
                                    [safeSuggestionIndex]: next,
                                }))
                            }
                            setMode('generate')
                        }}
                        placeholder={tt('contentImage.aiPlaceholder', 'Describe the visual content you want AI to generate...')}
                        className="min-h-[96px] text-xs resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground inline-flex items-center gap-1.5">
                        <IconSparkles className="w-3 h-3 text-primary" />
                        {tt('contentImage.aiHelper', 'AI will build the main visual content of the image.')}
                    </p>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[10px] gap-1"
                            onClick={() => inputRef.current?.click()}
                            disabled={!canAddMoreManual}
                        >
                            <IconUpload className="w-3 h-3" />
                            {tt('contentImage.upload', 'Upload content')}
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[10px] gap-1"
                            onClick={() => setIsBrandKitModalOpen(true)}
                        >
                            <IconPalette className="w-3 h-3" />
                            {tt('contentImage.fromBrandKit', 'From Brand Kit')}
                        </Button>
                            {(contentUploadedImages.length > 0 || contentBrandKitImageIds.length > 0) && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-[10px] ml-auto"
                                    onClick={() => {
                                        contentUploadedImages.forEach((id) => onRemoveUploadedImage?.(id))
                                        contentBrandKitImageIds.forEach((id) => onToggleBrandKitImage?.(id))
                                    }}
                                >
                                    {tt('contentImage.clear', 'Clear')}
                            </Button>
                        )}
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSelectFiles}
                        className="hidden"
                    />

                    {renderManualPreview()}

                    {canAddMoreManual && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
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
                                {isDragging
                                    ? tt('contentImage.dropHere', 'Drop your content images here')
                                    : tt('contentImage.dragOrClick', 'Drag content images here or click')}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                                {tt('contentImage.maxImages', 'Up to {{count}} images combining uploads and Brand Kit.', { count: MAX_CONTENT_IMAGES })}
                            </p>
                        </div>
                    )}

                    <p className="text-[10px] text-muted-foreground">
                        {tt('contentImage.manualModeHint', 'Manual mode is active: AI will not generate the main visual content.')}
                    </p>
                </div>
            )}

            {error && (
                <p className="text-[10px] text-destructive">{error}</p>
            )}

            <Dialog open={isBrandKitModalOpen} onOpenChange={setIsBrandKitModalOpen}>
                <DialogContent className="h-[min(88vh,860px)] w-[min(92vw,1120px)] !max-w-[min(92vw,1120px)] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-6 pt-6 pb-3">
                        <DialogTitle>{tt('contentImage.selectFromBrandKitTitle', 'Select content from Brand Kit')}</DialogTitle>
                        <DialogDescription>
                            {tt('contentImage.selectFromBrandKitDescription', 'Choose the images you want to use as the main content in the generation.')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
                        {brandKitImages.length > 0 ? (
                            <div className="grid content-start [grid-template-columns:repeat(auto-fill,minmax(88px,1fr))] gap-3 sm:[grid-template-columns:repeat(auto-fill,minmax(96px,1fr))]">
                                {brandKitImages.map((image) => {
                                const isSelected = contentBrandKitImageIds.includes(image.id)
                                const canSelect = canAddMoreManual || isSelected
                                return (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => {
                                            if (!canSelect) return
                                            if (isSelected) {
                                                onToggleBrandKitImage?.(image.id)
                                            } else if (selectedBrandKitImageIds.includes(image.id)) {
                                                onReferenceRoleChange?.(image.id, 'content')
                                            } else {
                                                onToggleBrandKitImage?.(image.id)
                                            }
                                            onReferenceRoleChange?.(image.id, 'content')
                                            if (!isAiContentMode) setMode('brandkit')
                                        }}
                                            className={cn(
                                                'relative w-full rounded-xl overflow-hidden border aspect-square transition-all',
                                                isSelected
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : canSelect
                                                        ? 'border-border hover:border-primary/40'
                                                        : 'border-border opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            <img src={image.url} alt={image.name || tt('contentImage.brandKitImageAlt', 'Brand Kit image')} className="w-full h-full object-cover" />
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
                                {tt('contentImage.noBrandKitImages', 'This Brand Kit does not have any images yet.')}
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
        </div>
    )
}
