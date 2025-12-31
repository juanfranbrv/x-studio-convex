'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { BrandDNA } from '@/lib/brand-types'
import { ColorPalette } from '@/components/brand-dna/ColorPalette'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Image, Check, Plus, X, ZoomIn, ChevronDown, Type, FileText, Link2, AtSign, Phone, MapPin, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { uploadBrandImage } from '@/app/actions/upload-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import { ContextElement, ContextType } from '@/app/studio/page'

// Extracted DraggableChip component to avoid re-creation on parent re-renders
interface DraggableChipProps {
    id: string
    type: ContextType
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
    isSelected: boolean
    onDragStart: (e: React.DragEvent, element: ContextElement) => void
    onDragEnd: () => void
    onToggle: () => void
}

function DraggableChip({ id, type, value, label, icon: Icon, isSelected, onDragStart, onDragEnd, onToggle }: DraggableChipProps) {
    return (
        <div
            draggable={true}
            onDragStart={(e) => {
                e.stopPropagation()
                onDragStart(e, { id, type, value, label })
            }}
            onDragEnd={onDragEnd}
            onClick={(e) => {
                e.stopPropagation()
                onToggle()
            }}
            className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium cursor-grab active:cursor-grabbing transition-all border select-none",
                isSelected
                    ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-border hover:bg-muted/50"
            )}
        >
            {Icon && <Icon className="w-3 h-3 opacity-60 pointer-events-none" />}
            <span className="truncate max-w-[180px] pointer-events-none">{label}</span>
            {isSelected && <Check className="w-3 h-3 ml-0.5 pointer-events-none" />}
        </div>
    )
}

interface BrandDNAPanelProps {
    brandDNA: BrandDNA
    logoInclusion?: boolean
    onLogoInclusionChange?: (enabled: boolean) => void
    onAddContext?: (element: ContextElement) => void
    onRemoveContext?: (id: string) => void
    onSetDraggedElement?: (element: ContextElement | null) => void
    selectedContext?: ContextElement[]
}

export function BrandDNAPanel({
    brandDNA: initialData,
    logoInclusion = true,
    onLogoInclusionChange,
    onAddContext,
    onRemoveContext,
    onSetDraggedElement,
    selectedContext = [],
}: BrandDNAPanelProps) {
    const { t } = useTranslation()
    const { updateActiveBrandKit } = useBrandKit()
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [data, setData] = useState<BrandDNA>(initialData)
    const [isSaving, setIsSaving] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [viewerImage, setViewerImage] = useState<string | null>(null)

    // Accordion state - sections open by default
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        colors: true,
        logos: true,
        images: true,
        typography: false,
        textAssets: false,
        links: false,
    })

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Sync with initialData only when brand ID changes or there are no unsaved changes
    useEffect(() => {
        const isSameBrand = initialData.id && data.id && initialData.id === data.id;

        if (!isSameBrand || !hasUnsavedChanges) {
            setData(initialData);
            setHasUnsavedChanges(false);
        }
    }, [initialData.id]);

    // Auto-save logic
    useEffect(() => {
        if (hasUnsavedChanges && !isSaving) {
            const timer = setTimeout(() => {
                handleSave()
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [data, hasUnsavedChanges, isSaving])

    const handleSave = async () => {
        if (!hasUnsavedChanges) return
        setIsSaving(true)
        try {
            await updateActiveBrandKit(data)
            setHasUnsavedChanges(false)
        } catch (error) {
            console.error('Error auto-saving from Studio:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const updateData = useCallback((updater: (prev: BrandDNA) => BrandDNA) => {
        setData(prev => {
            const newData = updater(prev)
            setHasUnsavedChanges(true)
            return newData
        })
    }, [])

    const { colors = [], fonts = [], brand_name, logo_url, logos = [], tone_of_voice = [], tagline, brand_values = [], visual_aesthetic = [], url, social_links = [], emails = [], phones = [], addresses = [] } = data

    // Handlers for ColorPalette
    const handleAddColor = () => {
        updateData(prev => ({
            ...prev,
            colors: [...(prev.colors || []), { color: '#cccccc', sources: ['user'], score: 1, role: 'Neutral', selected: true }]
        }))
    }

    const handleRemoveColor = (index: number) => {
        updateData(prev => ({
            ...prev,
            colors: prev.colors?.filter((_, i) => i !== index)
        }))
    }

    const handleUpdateColor = (index: number, newColor: string) => {
        updateData(prev => ({
            ...prev,
            colors: prev.colors?.map((c, i) => i === index ? { ...c, color: newColor } : c)
        }))
    }

    const handleUpdateColorRole = (index: number, newRole: string) => {
        updateData(prev => ({
            ...prev,
            colors: prev.colors?.map((c, i) => i === index ? { ...c, role: newRole } : c)
        }))
    }

    const handleToggleColorSelection = (index: number) => {
        const colorObj = colors[index]
        const isCurrentlySelected = selectedContext.some(c => c.id === `color-${index}`)

        if (isCurrentlySelected) {
            onRemoveContext?.(`color-${index}`)
        } else {
            onAddContext?.({
                id: `color-${index}`,
                type: 'color',
                value: colorObj.color,
                label: colorObj.role || colorObj.color
            })
        }

        updateData(prev => ({
            ...prev,
            colors: prev.colors?.map((c, i) => i === index ? { ...c, selected: !c.selected } : c)
        }))
    }

    const handleResetColors = () => {
        setData(initialData)
        setHasUnsavedChanges(false)
    }

    const handleToggleImageSelection = (idx: number) => {
        const image = allImages[idx]
        const isCurrentlySelected = selectedContext.some(c => c.id === `image-${idx}`)

        if (isCurrentlySelected) {
            onRemoveContext?.(`image-${idx}`)
        } else {
            onAddContext?.({
                id: `image-${idx}`,
                type: 'image',
                value: image.url,
                label: `Imagen ${idx + 1}`
            })
        }

        updateData(prev => {
            const newImages = [...(prev.images || [])]
            const current = newImages[idx]

            if (typeof current === 'string') {
                newImages[idx] = { url: current, selected: !isCurrentlySelected }
            } else if (current && typeof current === 'object') {
                newImages[idx] = {
                    ...current,
                    url: (current as any).url || '',
                    selected: !isCurrentlySelected
                }
            }
            return { ...prev, images: newImages }
        })
    }

    const handleRemoveImage = (index: number) => {
        updateData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }))
    }

    const handleToggleLogoSelection = (idx: number) => {
        const logo = logos[idx]
        const isCurrentlySelected = selectedContext.some(c => c.id === `logo-${idx}`)

        if (isCurrentlySelected) {
            onRemoveContext?.(`logo-${idx}`)
        } else {
            onAddContext?.({
                id: `logo-${idx}`,
                type: 'logo',
                value: logo.url,
                label: `Logo ${idx + 1}`
            })
        }

        updateData(prev => {
            const newLogos = [...(prev.logos || [])]
            newLogos.forEach((l, i) => {
                if (i !== idx) l.selected = false
                else l.selected = !l.selected
            })
            return {
                ...prev,
                logos: newLogos,
                logo_url: newLogos.find(l => l.selected)?.url || ''
            }
        })
    }

    const handleRemoveLogo = (idx: number) => {
        updateData(prev => {
            const newLogos = prev.logos?.filter((_, i) => i !== idx) || []
            const hasSelected = newLogos.some(l => l.selected)
            if (!hasSelected && newLogos.length > 0) {
                newLogos[0].selected = true
            }
            return {
                ...prev,
                logos: newLogos,
                logo_url: newLogos.find(l => l.selected)?.url || ''
            }
        })
    }

    const handleUploadLogos = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const currentCount = logos.length
        const remaining = 6 - currentCount
        if (remaining <= 0) return

        const toUpload = files.slice(0, remaining)
        setIsSaving(true)

        try {
            const uploadedUrls: string[] = []
            for (const file of toUpload) {
                const formData = new FormData()
                formData.append('file', file)
                const result = await uploadBrandImage(formData)
                if (result.success && result.url) {
                    uploadedUrls.push(result.url)
                }
            }

            if (uploadedUrls.length > 0) {
                updateData(prev => {
                    const newLogos = [...(prev.logos || [])]
                    uploadedUrls.forEach(url => {
                        const isFirst = newLogos.length === 0
                        newLogos.push({ url, selected: isFirst })
                    })
                    return {
                        ...prev,
                        logos: newLogos,
                        logo_url: newLogos.find(l => l.selected)?.url || prev.logo_url
                    }
                })
            }
        } catch (error) {
            console.error('Error uploading logos:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const currentImagesCount = data.images?.length || 0

        if (currentImagesCount + files.length > 20) {
            alert('Puedes tener hasta 20 imágenes en tu biblioteca de marca.')
            return
        }

        setIsSaving(true)
        try {
            const uploadedImages: { url: string; selected: boolean }[] = []
            for (const file of files) {
                const formData = new FormData()
                formData.append('file', file)
                const result = await uploadBrandImage(formData)
                if (result.success && result.url) {
                    uploadedImages.push({ url: result.url, selected: true })
                }
            }

            if (uploadedImages.length > 0) {
                updateData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...uploadedImages]
                }))
            }
        } catch (error) {
            console.error('Error uploading images to kit:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const normalizeImg = (img: any) => {
        if (typeof img === 'string') return { url: img, selected: true };
        return {
            url: img?.url || '',
            selected: img?.selected !== false
        };
    };

    const allImages = (data.images || []).map(img => normalizeImg(img))
    const selectedCount = allImages.filter(img => img.selected !== false).length
    const totalCount = allImages.length

    const handleDeselectAll = () => {
        updateData(prev => ({
            ...prev,
            images: prev.images?.map(img => ({ ...img, selected: false })) || []
        }))
    }

    const selectedImages = allImages.filter(img => img.selected !== false);

    const handleDragStart = (e: React.DragEvent, element: ContextElement) => {
        const jsonData = JSON.stringify(element)
        e.dataTransfer.setData('application/x-studio-context', jsonData)
        e.dataTransfer.setData('text/plain', element.label || element.value)
        e.dataTransfer.effectAllowed = 'copy'
        onSetDraggedElement?.(element)
    }

    const handleDragEnd = () => {
        onSetDraggedElement?.(null)
    }

    // Helper to generate common chip props
    const chipProps = (id: string, type: ContextType, value: string, label: string) => ({
        id,
        type,
        value,
        label,
        isSelected: selectedContext.some(c => c.id === id),
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onToggle: () => {
            const isSelected = selectedContext.some(c => c.id === id)
            if (isSelected) {
                onRemoveContext?.(id)
            } else {
                onAddContext?.({ id, type, value, label })
            }
        }
    })

    // Helper component for section headers
    const SectionHeader = ({ icon: Icon, title, count, maxCount, isOpen, extra }: {
        icon: any, title: string, count?: number, maxCount?: number, isOpen: boolean, extra?: React.ReactNode
    }) => (
        <CollapsibleTrigger className="flex items-center justify-between w-full px-1 py-1.5 hover:bg-muted/30 rounded-md transition-colors group">
            <div className="flex items-center gap-1.5 text-muted-foreground/70">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider font-bold">
                    {title}
                    {count !== undefined && maxCount !== undefined && (
                        <span className="text-[9px] opacity-40 ml-1">({count}/{maxCount})</span>
                    )}
                </span>
            </div>
            <div className="flex items-center gap-1">
                {extra}
                <ChevronDown className={cn(
                    "w-3.5 h-3.5 text-muted-foreground/40 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </div>
        </CollapsibleTrigger>
    )


    return (
        <div className="w-[340px] h-full bg-card border-r border-border flex flex-col gap-1 overflow-hidden relative">
            {/* Lightbox Viewer */}
            {viewerImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-10 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setViewerImage(null)}
                >
                    <button
                        onClick={() => setViewerImage(null)}
                        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={viewerImage}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        alt="Preview"
                    />
                </div>
            )}

            <div className="p-2 flex flex-col gap-1 overflow-y-auto scrollbar-thin flex-1">
                {/* COLORS SECTION */}
                <Collapsible open={openSections.colors} onOpenChange={() => toggleSection('colors')}>
                    <div className="space-y-1">
                        <SectionHeader
                            icon={Palette}
                            title={t('brandDNA.colorPalette')}
                            isOpen={openSections.colors}
                            extra={isSaving && (
                                <Badge variant="outline" className="animate-pulse bg-primary/10 text-[8px] py-0 px-1 h-3.5 text-primary border-primary/20">
                                    SINC
                                </Badge>
                            )}
                        />
                        <CollapsibleContent>
                            <div className="bg-muted/20 rounded-xl p-2">
                                <ColorPalette
                                    colors={colors}
                                    isEdited={hasUnsavedChanges}
                                    onUpdateColor={handleUpdateColor}
                                    onUpdateRole={handleUpdateColorRole}
                                    onToggleSelection={handleToggleColorSelection}
                                    onRemoveColor={handleRemoveColor}
                                    onAddColor={handleAddColor}
                                    onReset={handleResetColors}
                                    hideHeader={true}
                                    selectedColorIds={selectedContext.filter(c => c.type === 'color').map(c => c.id)}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                />
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>

                {/* LOGOS SECTION */}
                <Collapsible open={openSections.logos} onOpenChange={() => toggleSection('logos')}>
                    <div className="space-y-1">
                        <SectionHeader
                            icon={Image}
                            title="Logos de Marca"
                            count={logos.length}
                            maxCount={6}
                            isOpen={openSections.logos}
                            extra={
                                <label className={cn(
                                    "cursor-pointer hover:text-primary transition-colors p-0.5",
                                    logos.length >= 6 && "opacity-20 cursor-not-allowed pointer-events-none"
                                )} onClick={(e) => e.stopPropagation()}>
                                    <Plus className="w-3 h-3 text-muted-foreground/60" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogos} disabled={logos.length >= 6} />
                                </label>
                            }
                        />
                        <CollapsibleContent>
                            <div className="grid grid-cols-3 gap-1.5 p-1">
                                {logos.map((logo, idx) => (
                                    <div
                                        key={`logo-${idx}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, {
                                            id: `logo-${idx}`,
                                            type: 'logo',
                                            value: logo.url,
                                            label: `Logo ${idx + 1}`
                                        })}
                                        onDragEnd={handleDragEnd}
                                        onClick={() => handleToggleLogoSelection(idx)}
                                        className={cn(
                                            "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing flex items-center justify-center p-1.5 transparency-grid",
                                            selectedContext.some(c => c.id === `logo-${idx}`)
                                                ? "border-primary shadow-sm ring-1 ring-primary/20"
                                                : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                                        )}
                                    >
                                        <img
                                            src={logo.url}
                                            draggable={false}
                                            className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110 pointer-events-none select-none"
                                            alt={`Logo ${idx}`}
                                        />
                                        {selectedContext.some(c => c.id === `logo-${idx}`) && (
                                            <div className={cn(
                                                "absolute top-1 left-1 flex items-center justify-center transition-all duration-200 z-30 pointer-events-none",
                                                isDark
                                                    ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                                    : "text-primary drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
                                            )}>
                                                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveLogo(idx); }}
                                            className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                        >
                                            <X className="w-2 h-2" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setViewerImage(logo.url); }}
                                            className="absolute bottom-0.5 right-0.5 p-0.5 bg-white/90 text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                        >
                                            <ZoomIn className="w-2 h-2" />
                                        </button>
                                    </div>
                                ))}
                                {Array.from({ length: Math.max(0, 6 - logos.length) }).map((_, i) => (
                                    <label
                                        key={`placeholder-${i}`}
                                        className="border border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center bg-muted/5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer aspect-square group"
                                    >
                                        <Plus className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/50" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogos} />
                                    </label>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>

                {/* IMAGES SECTION */}
                <Collapsible open={openSections.images} onOpenChange={() => toggleSection('images')}>
                    <div className="space-y-1">
                        <SectionHeader
                            icon={Image}
                            title="Imágenes"
                            count={selectedCount}
                            maxCount={totalCount}
                            isOpen={openSections.images}
                            extra={
                                <label className={cn(
                                    "cursor-pointer hover:text-primary transition-colors p-0.5",
                                    totalCount >= 20 && "opacity-20 cursor-not-allowed pointer-events-none"
                                )} onClick={(e) => e.stopPropagation()}>
                                    <Plus className="w-3 h-3 text-muted-foreground/60" />
                                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleUploadImages} disabled={totalCount >= 20} />
                                </label>
                            }
                        />
                        <CollapsibleContent>
                            <Tabs defaultValue="selected" className="w-full">
                                <TabsList className="bg-muted/50 h-6 p-0.5 w-full">
                                    <TabsTrigger value="selected" className="text-[9px] px-2 h-5 uppercase font-bold tracking-tight flex-1">
                                        Usadas <Badge className="ml-1 h-3 min-w-[12px] px-0.5 text-[7px] flex items-center justify-center bg-primary/20 text-primary border-none">{selectedCount}</Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="library" className="text-[9px] px-2 h-5 uppercase font-bold tracking-tight flex-1">Biblioteca</TabsTrigger>
                                </TabsList>

                                <TabsContent value="selected" className="mt-1">
                                    <div className="grid grid-cols-3 gap-1 max-h-[200px] overflow-y-auto pr-0.5 scrollbar-thin">
                                        {selectedImages.map((img, i) => {
                                            const originalIdx = (data.images || []).findIndex(orig => (orig as any).url === img.url || orig === img.url);
                                            const elementId = `image-${originalIdx}`;
                                            const isSelected = selectedContext.some(c => c.id === elementId);

                                            return (
                                                <div
                                                    key={`sel-${i}`}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, {
                                                        id: elementId,
                                                        type: 'image',
                                                        value: img.url,
                                                        label: `Imagen ${originalIdx + 1}`
                                                    })}
                                                    onDragEnd={handleDragEnd}
                                                    onClick={() => handleToggleImageSelection(originalIdx)}
                                                    className={cn(
                                                        "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing transparency-grid",
                                                        isSelected
                                                            ? "border-primary shadow-sm"
                                                            : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                                                    )}
                                                >
                                                    <img
                                                        src={img.url}
                                                        draggable={false}
                                                        className="w-full h-full object-cover pointer-events-none select-none"
                                                        alt={`Asset ${originalIdx}`}
                                                    />
                                                    {isSelected && (
                                                        <div className={cn(
                                                            "absolute top-1 left-1 z-30 pointer-events-none",
                                                            isDark ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "text-primary drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
                                                        )}>
                                                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0.5 right-0.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setViewerImage(img.url); }}
                                                            className="w-4 h-4 bg-white/90 text-black rounded-full flex items-center justify-center hover:scale-110"
                                                        >
                                                            <ZoomIn className="w-2 h-2" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(originalIdx); }}
                                                            className="w-4 h-4 bg-destructive text-white rounded-full flex items-center justify-center hover:scale-110"
                                                        >
                                                            <X className="w-2 h-2" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {selectedImages.length === 0 && (
                                            <div className="col-span-3 py-6 text-center border border-dashed border-muted/50 rounded-lg">
                                                <p className="text-[9px] text-muted-foreground opacity-50">Nada seleccionado</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedImages.length > 0 && (
                                        <button
                                            onClick={handleDeselectAll}
                                            className="w-full mt-1.5 text-[8px] text-muted-foreground hover:text-primary font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Limpiar Selección
                                        </button>
                                    )}
                                </TabsContent>

                                <TabsContent value="library" className="mt-1">
                                    <div className="grid grid-cols-3 gap-1 max-h-[200px] overflow-y-auto pr-0.5 scrollbar-thin">
                                        {allImages.map((img, idx) => {
                                            const elementId = `image-${idx}`;
                                            const isSelected = selectedContext.some(c => c.id === elementId);

                                            return (
                                                <div
                                                    key={`lib-${idx}`}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, {
                                                        id: elementId,
                                                        type: 'image',
                                                        value: img.url,
                                                        label: `Imagen ${idx + 1}`
                                                    })}
                                                    onDragEnd={handleDragEnd}
                                                    onClick={() => handleToggleImageSelection(idx)}
                                                    className={cn(
                                                        "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing transparency-grid",
                                                        isSelected
                                                            ? "border-primary shadow-sm"
                                                            : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                                                    )}
                                                >
                                                    <img
                                                        src={img.url}
                                                        draggable={false}
                                                        className="w-full h-full object-cover pointer-events-none select-none"
                                                        alt={`Asset ${idx}`}
                                                    />
                                                    {isSelected && (
                                                        <div className={cn(
                                                            "absolute top-1 left-1 z-30 pointer-events-none",
                                                            isDark ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "text-primary drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
                                                        )}>
                                                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0.5 right-0.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setViewerImage(img.url); }}
                                                            className="w-4 h-4 bg-white/90 text-black rounded-full flex items-center justify-center hover:scale-110"
                                                        >
                                                            <ZoomIn className="w-2 h-2" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                                            className="w-4 h-4 bg-destructive text-white rounded-full flex items-center justify-center hover:scale-110"
                                                        >
                                                            <X className="w-2 h-2" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {totalCount < 20 && (
                                            <label className="border border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer aspect-square group">
                                                <Plus className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/50" />
                                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleUploadImages} />
                                            </label>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CollapsibleContent>
                    </div>
                </Collapsible>

                {/* TYPOGRAPHY SECTION */}
                <Collapsible open={openSections.typography} onOpenChange={() => toggleSection('typography')}>
                    <div className="space-y-1">
                        <SectionHeader
                            icon={Type}
                            title="Tipografía"
                            isOpen={openSections.typography}
                        />
                        <CollapsibleContent>
                            <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/10 rounded-lg">
                                {fonts.length > 0 ? fonts.map((font, idx) => (
                                    <DraggableChip
                                        key={`font-${idx}`}
                                        {...chipProps(`font-${idx}`, 'font', font, font)}
                                        icon={Type}
                                    />
                                )) : (
                                    <p className="text-[9px] text-muted-foreground/50 italic p-1">Sin tipografías detectadas</p>
                                )}
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>

                {/* TEXT ASSETS SECTION */}
                <Collapsible open={openSections.textAssets} onOpenChange={() => toggleSection('textAssets')}>
                    <div className="space-y-1">
                        <SectionHeader
                            icon={FileText}
                            title="Textos de Marca"
                            isOpen={openSections.textAssets}
                        />
                        <CollapsibleContent>
                            <div className="space-y-2 p-1.5 bg-muted/10 rounded-lg">
                                {/* Tagline */}
                                {tagline && (
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground/50 px-0.5">Tagline</p>
                                        <DraggableChip
                                            {...chipProps('tagline', 'text', tagline, tagline)}
                                        />
                                    </div>
                                )}

                                {/* Brand Values */}
                                {brand_values.length > 0 && (
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground/50 px-0.5">Valores</p>
                                        <div className="flex flex-wrap gap-1">
                                            {brand_values.map((val, idx) => (
                                                <DraggableChip
                                                    key={`value-${idx}`}
                                                    {...chipProps(`value-${idx}`, 'text', val, val)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tone of Voice */}
                                {tone_of_voice.length > 0 && (
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground/50 px-0.5">Tono de Voz</p>
                                        <div className="flex flex-wrap gap-1">
                                            {tone_of_voice.map((tone, idx) => (
                                                <DraggableChip
                                                    key={`tone-${idx}`}
                                                    {...chipProps(`tone-${idx}`, 'text', tone, tone)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Visual Aesthetic */}
                                {visual_aesthetic.length > 0 && (
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground/50 px-0.5">Estética Visual</p>
                                        <div className="flex flex-wrap gap-1">
                                            {visual_aesthetic.map((ae, idx) => (
                                                <DraggableChip
                                                    key={`aesthetic-${idx}`}
                                                    {...chipProps(`aesthetic-${idx}`, 'text', ae, ae)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!tagline && brand_values.length === 0 && tone_of_voice.length === 0 && visual_aesthetic.length === 0 && (
                                    <p className="text-[9px] text-muted-foreground/50 italic p-1">Sin textos de marca</p>
                                )}
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>

                {/* LINKS & CONTACT SECTION */}
                <Collapsible open={openSections.links} onOpenChange={() => toggleSection('links')}>
                    <div className="space-y-1">
                        <SectionHeader
                            icon={Link2}
                            title="Enlaces y Contacto"
                            isOpen={openSections.links}
                        />
                        <CollapsibleContent>
                            <div className="space-y-2 p-1.5 bg-muted/10 rounded-lg">
                                {/* URL */}
                                {url && (
                                    <DraggableChip
                                        {...chipProps('url', 'link', url, url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}
                                        icon={Link2}
                                    />
                                )}

                                {/* Social Links */}
                                {social_links.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {social_links.map((link, idx) => (
                                            <DraggableChip
                                                key={`social-${idx}`}
                                                {...chipProps(`social-${idx}`, 'link', link.url, link.username || link.platform)}
                                                icon={AtSign}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Emails */}
                                {emails.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {emails.map((email, idx) => (
                                            <DraggableChip
                                                key={`email-${idx}`}
                                                {...chipProps(`email-${idx}`, 'contact', email, email)}
                                                icon={Mail}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Phones */}
                                {phones.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {phones.map((phone, idx) => (
                                            <DraggableChip
                                                key={`phone-${idx}`}
                                                {...chipProps(`phone-${idx}`, 'contact', phone, phone)}
                                                icon={Phone}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Addresses */}
                                {addresses.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {addresses.map((addr, idx) => (
                                            <DraggableChip
                                                key={`address-${idx}`}
                                                {...chipProps(`address-${idx}`, 'contact', addr, addr.length > 30 ? addr.substring(0, 30) + '...' : addr)}
                                                icon={MapPin}
                                            />
                                        ))}
                                    </div>
                                )}

                                {!url && social_links.length === 0 && emails.length === 0 && phones.length === 0 && addresses.length === 0 && (
                                    <p className="text-[9px] text-muted-foreground/50 italic p-1">Sin enlaces ni contacto</p>
                                )}
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>
            </div>

            {/* Brand Identity Footer */}
            <div className="p-2 border-t border-border bg-muted/20">
                <div className="flex items-center gap-2 overflow-hidden px-1">
                    {logo_url ? (
                        <img src={logo_url} alt="Logo" className="w-4 h-4 object-contain opacity-60" />
                    ) : (
                        <div className="w-4 h-4 bg-muted rounded flex items-center justify-center text-[8px]">
                            🖼️
                        </div>
                    )}
                    <span className="text-[10px] font-medium truncate text-muted-foreground/80">{brand_name}</span>
                </div>
            </div>
        </div>
    )
}
