'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BrandDNA } from '@/lib/brand-types'
import { ColorPalette } from '@/components/brand-dna/ColorPalette'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { Palette, Image, Check, Plus, Trash2, Upload, Maximize2, Loader2, X, Search, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { uploadBrandImage } from '@/app/actions/upload-image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BrandDNAPanelProps {
    brandDNA: BrandDNA
    logoInclusion?: boolean
    onLogoInclusionChange?: (enabled: boolean) => void
}

export function BrandDNAPanel({
    brandDNA: initialData,
    logoInclusion = true,
    onLogoInclusionChange,
}: BrandDNAPanelProps) {
    const { t } = useTranslation()
    const { updateActiveBrandKit } = useBrandKit()
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [data, setData] = useState<BrandDNA>(initialData)
    const [isSaving, setIsSaving] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [viewerImage, setViewerImage] = useState<string | null>(null)

    // Sync when initialData changes
    // Sync with initialData only when brand ID changes or there are no unsaved changes
    useEffect(() => {
        const isSameBrand = initialData.id && data.id && initialData.id === data.id;

        if (!isSameBrand || !hasUnsavedChanges) {
            setData(initialData);
            setHasUnsavedChanges(false);
        }
    }, [initialData.id]); // Solo re-sync si cambia el ID del Brand Kit activo

    // Auto-save logic
    useEffect(() => {
        if (hasUnsavedChanges && !isSaving) {
            const timer = setTimeout(() => {
                handleSave()
            }, 2000) // 2 seconds debounce
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

    const { colors = [], fonts = [], brand_name, logo_url, logos = [], tone_of_voice = [] } = data

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
        updateData(prev => ({
            ...prev,
            colors: prev.colors?.map((c, i) => i === index ? { ...c, selected: c.selected === false ? true : false } : c)
        }))
    }

    const handleResetColors = () => {
        setData(initialData)
        setHasUnsavedChanges(false)
    }

    const handleToggleImageSelection = (idx: number) => {
        updateData(prev => {
            const newImages = [...(prev.images || [])]
            const current = newImages[idx]

            if (typeof current === 'string') {
                newImages[idx] = { url: current, selected: false }
            } else if (current && typeof current === 'object') {
                newImages[idx] = {
                    ...current,
                    url: (current as any).url || '',
                    selected: !((current as any).selected !== false)
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
        updateData(prev => {
            const newLogos = [...(prev.logos || [])]
            // Deselect all others if we select this one
            newLogos.forEach((l, i) => {
                if (i !== idx) l.selected = false
                else l.selected = true
            })
            return {
                ...prev,
                logos: newLogos,
                logo_url: newLogos[idx].url // Sync secondary logo_url
            }
        })
    }

    const handleRemoveLogo = (idx: number) => {
        updateData(prev => {
            const newLogos = prev.logos?.filter((_, i) => i !== idx) || []
            // If we removed the selected one, select the first available or clear logo_url
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
        const remaining = 5 - currentCount
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

    const ImageItem = ({ item, idx }: { item: any, idx: number }) => {
        return (
            <div
                key={`img-${idx}`}
                onClick={() => handleToggleImageSelection(idx)}
                className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer transparency-grid",
                    item.selected !== false
                        ? "border-primary shadow-sm"
                        : "border-transparent opacity-60 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 hover:border-border"
                )}
            >
                <img src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={`Asset ${idx}`} />

                {/* Icon Overlays */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />

                {/* Selection Checkmark UI */}
                <div className={cn(
                    "absolute top-2 left-2 flex items-center justify-center transition-all duration-200 z-30",
                    item.selected !== false
                        ? (isDark
                            ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] scale-110 opacity-100"
                            : "text-primary drop-shadow-[0_0_8px_rgba(255,255,255,1)] scale-110 opacity-100")
                        : "text-white/20 scale-90 opacity-0 group-hover:opacity-100 hover:text-white/60 hover:scale-110"
                )}>
                    <Check className="w-4 h-4 stroke-[3px]" />
                </div>

                {/* Actions Row */}
                <div className="absolute bottom-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <button
                        onClick={(e) => { e.stopPropagation(); setViewerImage(item.url); }}
                        className="w-5 h-5 bg-white/90 text-black rounded-full flex items-center justify-center hover:scale-110 shadow-lg"
                        title="Ver en grande"
                    >
                        <ZoomIn className="w-2.5 h-2.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                        className="w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center hover:scale-110 shadow-lg"
                    >
                        <X className="w-2.5 h-2.5" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-[340px] h-full bg-card border-r border-border flex flex-col gap-3 overflow-hidden relative">
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

            <div className="p-3 flex flex-col gap-3 overflow-y-auto scrollbar-thin flex-1">
                {/* Color Palette (Prominent) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-muted-foreground/70" />
                            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
                                {t('brandDNA.colorPalette')}
                            </span>
                        </div>

                        {isSaving && (
                            <Badge variant="outline" className="animate-pulse bg-primary/10 text-[9px] py-0 px-1.5 h-4 text-primary border-primary/20">
                                SINC...
                            </Badge>
                        )}
                    </div>
                    <div className="bg-muted/20 rounded-xl p-2.5">
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
                        />
                    </div>
                </div>

                {/* Visual Elements */}
                <div className="space-y-4">
                    {/* Logo Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground/70">
                                <Image className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase tracking-wider font-bold">
                                    Logos de Marca <span className="text-[9px] opacity-40 ml-1">({logos.length}/5)</span>
                                </span>
                            </div>

                            <label className={cn(
                                "cursor-pointer hover:text-primary transition-colors p-1",
                                logos.length >= 5 && "opacity-20 cursor-not-allowed pointer-events-none"
                            )}>
                                <Plus className="w-3.5 h-3.5 text-muted-foreground/60" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogos} disabled={logos.length >= 5} />
                            </label>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                            {logos.map((logo, idx) => (
                                <div
                                    key={`logo-${idx}`}
                                    onClick={() => handleToggleLogoSelection(idx)}
                                    className={cn(
                                        "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex items-center justify-center p-1.5",
                                        logo.selected !== false
                                            ? "border-primary shadow-sm ring-1 ring-primary/20"
                                            : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                                    )}
                                >
                                    <img src={logo.url} className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110" alt={`Logo ${idx}`} />

                                    {/* Selection Check */}
                                    {logo.selected !== false && (
                                        <div className={cn(
                                            "absolute top-1 left-1 z-20",
                                            isDark ? "text-white drop-shadow-md" : "text-primary drop-shadow-sm"
                                        )}>
                                            <Check className="w-3 h-3 stroke-[4px]" />
                                        </div>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRemoveLogo(idx); }}
                                        className="absolute top-1 right-1 p-0.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    >
                                        <X className="w-2 h-2" />
                                    </button>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setViewerImage(logo.url); }}
                                        className="absolute bottom-1 right-1 p-0.5 bg-white/90 text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    >
                                        <ZoomIn className="w-2 h-2" />
                                    </button>
                                </div>
                            ))}

                            {/* Empty slots placeholders */}
                            {Array.from({ length: Math.max(0, 5 - logos.length) }).map((_, i) => (
                                <label
                                    key={`placeholder-${i}`}
                                    className="border border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center bg-muted/5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer aspect-square group"
                                >
                                    <Plus className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogos} />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Image Management with Tabs */}
                    <div className="space-y-3">
                        <Tabs defaultValue="selected" className="w-full">
                            <div className="flex items-center justify-between px-1 mb-2">
                                <TabsList className="bg-muted/50 h-7 p-0.5">
                                    <TabsTrigger value="selected" className="text-[9px] px-2 h-6 uppercase font-bold tracking-tight">
                                        Usadas <Badge className="ml-1 h-3.5 min-w-[14px] px-0.5 text-[8px] flex items-center justify-center bg-primary/20 text-primary border-none">{selectedCount}</Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="library" className="text-[9px] px-2 h-6 uppercase font-bold tracking-tight">Biblioteca</TabsTrigger>
                                </TabsList>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] text-muted-foreground/50 font-medium">{totalCount}/20</span>
                                    <label className={cn(
                                        "cursor-pointer hover:text-primary transition-colors p-1",
                                        totalCount >= 20 && "opacity-20 cursor-not-allowed pointer-events-none"
                                    )} title="Subir a biblioteca">
                                        <Plus className="w-3.5 h-3.5 text-muted-foreground/60" />
                                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleUploadImages} disabled={totalCount >= 20} />
                                    </label>
                                </div>
                            </div>

                            <TabsContent value="selected" className="mt-0">
                                <div className="grid grid-cols-3 gap-1.5 p-0.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                                    {selectedImages.map((img, i) => {
                                        const originalIdx = (data.images || []).findIndex(orig => (orig as any).url === img.url || orig === img.url);
                                        return <ImageItem key={`sel - ${i} `} item={img} idx={originalIdx} />
                                    })}
                                    {selectedImages.length === 0 && (
                                        <div className="col-span-3 py-10 text-center border-2 border-dashed border-muted/50 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground opacity-50">Nada seleccionado</p>
                                        </div>
                                    )}
                                </div>
                                {selectedImages.length > 0 && (
                                    <button
                                        onClick={handleDeselectAll}
                                        className="w-full mt-2 text-[8px] text-muted-foreground hover:text-primary font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Limpiar Seleccionadas
                                    </button>
                                )}
                            </TabsContent>

                            <TabsContent value="library" className="mt-0">
                                <div className="grid grid-cols-3 gap-1.5 p-0.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                                    {allImages.map((img, i) => (
                                        <ImageItem key={`lib - ${i} `} item={img} idx={i} />
                                    ))}
                                    {totalCount < 20 && (
                                        <label className="border border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center gap-0.5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer aspect-square group">
                                            <Plus className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50" />
                                            <span className="text-[7px] text-muted-foreground/40 group-hover:text-primary/50 uppercase font-bold">Subir</span>
                                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleUploadImages} />
                                        </label>
                                    )}
                                    {totalCount === 0 && (
                                        <div className="col-span-3 py-6 text-center border-2 border-dashed border-muted/50 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground opacity-50">Biblioteca vacía</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Typography & Other Details */}
                <div className="space-y-2 mt-2">
                    <Card className="bg-muted/10 border-none shadow-none">
                        <CardContent className="p-2.5 space-y-3">
                            <div>
                                <p className="text-[9px] font-bold uppercase text-muted-foreground/40 mb-1 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                                    {t('brandDNA.typography')}
                                </p>
                                <div className="space-y-0.5 px-1.5">
                                    {fonts.length > 0 ? (
                                        fonts.map((font, idx) => (
                                            <p key={idx} className={idx === 0 ? "text-sm font-heading font-bold truncate" : "text-[11px] truncate opacity-60"}>
                                                {font}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-[9px] text-muted-foreground italic">Sin tipografía</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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

