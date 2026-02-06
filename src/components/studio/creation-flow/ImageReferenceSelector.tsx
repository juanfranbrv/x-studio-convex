'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2, X, Sparkles, Palette, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
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
    // Optional custom style (moved from Style card)
    customStyle?: string
    onCustomStyleChange?: (style: string) => void
    // Mode Control
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
    customStyle = '',
    onCustomStyleChange,
    mode = 'upload',
    onModeChange,
}: ImageReferenceSelectorProps) {
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Total images selected across both sources
    const totalSelected = uploadedImages.length + selectedBrandKitImageIds.length
    const canAddMore = totalSelected < MAX_REFERENCE_IMAGES

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

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
        files.slice(0, MAX_REFERENCE_IMAGES - totalSelected).forEach(file => {
            onUpload(file)
        })
    }, [onUpload, canAddMore, totalSelected])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.slice(0, MAX_REFERENCE_IMAGES - totalSelected).forEach(file => {
            onUpload(file)
        })
        // Reset input for re-selection
        if (inputRef.current) inputRef.current.value = ''
    }, [onUpload, totalSelected])

    // Internal handler to sync if onModeChange is provided
    const handleModeChange = (val: string) => {
        if (onModeChange) {
            onModeChange(val as ImageSourceMode)
        }
    }

    const getNextRole = (role: ReferenceImageRole): ReferenceImageRole => {
        if (role === 'style') return 'style_content'
        if (role === 'style_content') return 'content'
        if (role === 'content') return 'logo'
        return 'style'
    }

    const roleLabel = (role: ReferenceImageRole) => {
        if (role === 'style') return 'Estilo'
        if (role === 'style_content') return 'Estilo+Contenido'
        if (role === 'logo') return 'Logo'
        return 'Contenido'
    }

    const roleChipClasses = (role: ReferenceImageRole) => {
        if (role === 'style') return 'bg-violet-500/85 text-white'
        if (role === 'style_content') return 'bg-fuchsia-500/85 text-white'
        if (role === 'logo') return 'bg-amber-500/85 text-white'
        return 'bg-sky-500/85 text-white'
    }

    return (
        <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-10 p-1 bg-slate-100/50 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/5">
                <TabsTrigger
                    value="upload"
                    className="text-[10px] h-full rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10 dark:data-[state=active]:text-white transition-all"
                >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Subir
                </TabsTrigger>
                <TabsTrigger
                    value="brandkit"
                    className="text-[10px] h-full rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10 dark:data-[state=active]:text-white transition-all"
                >
                    <Palette className="w-3.5 h-3.5 mr-1.5" />
                    Kit de Marca
                </TabsTrigger>
                <TabsTrigger
                    value="generate"
                    className="text-[10px] h-full rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10 dark:data-[state=active]:text-white transition-all"
                >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Generar ia
                </TabsTrigger>
            </TabsList>

            {/* Selected count badge */}
            {totalSelected > 0 && (
                <div className="mt-2 flex items-center justify-between px-1">
                    <p className="text-[10px] text-muted-foreground">
                        <span className="font-semibold text-primary">{totalSelected}</span>/{MAX_REFERENCE_IMAGES} imágenes seleccionadas
                    </p>
                    {totalSelected > 0 && (
                        <button
                            onClick={() => {
                                onClearUploadedImages?.()
                                onClearBrandKitImages?.()
                            }}
                            className="text-[10px] text-red-500 hover:text-red-600 transition-colors"
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>
            )}

            {/* UPLOAD MODE */}
            <TabsContent value="upload" className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Grid of uploaded images */}
                {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {uploadedImages.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 aspect-square group"
                            >
                                <img
                                    src={img}
                                    alt={`Uploaded ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
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
                                            onReferenceRoleChange(img, getNextRole(currentRole))
                                        }}
                                        title="Cambiar rol: Estilo / Estilo+Contenido / Contenido / Logo"
                                        className={cn(
                                            "absolute top-1 left-1 text-[9px] px-2 py-0.5 rounded-full font-semibold transition-all z-10",
                                            roleChipClasses(referenceImageRoles[img] || 'content')
                                        )}
                                    >
                                        {roleLabel(referenceImageRoles[img] || 'content')}
                                    </button>
                                )}
                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                                    {idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload dropzone (always show if can add more) */}
                {canAddMore && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            "relative rounded-2xl border-2 border-dashed transition-all cursor-pointer group overflow-hidden",
                            "flex flex-col items-center justify-center gap-3",
                            uploadedImages.length > 0 ? "h-20" : "h-32",
                            isDragging
                                ? "border-primary bg-primary/10 dark:bg-primary/10 scale-[0.99]"
                                : "border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-white/10"
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                            isDragging
                                ? "bg-primary text-primary-foreground scale-110"
                                : "bg-white text-slate-400 group-hover:text-primary group-hover:scale-110 dark:bg-white/10 dark:text-slate-400"
                        )}>
                            {isDragging ? (
                                <Upload className="w-4 h-4" />
                            ) : uploadedImages.length > 0 ? (
                                <Plus className="w-4 h-4" />
                            ) : (
                                <ImageIcon className="w-4 h-4" />
                            )}
                        </div>

                        <div className="text-center z-10 relative">
                            <p className={cn(
                                "text-xs font-semibold transition-colors",
                                isDragging ? "text-primary dark:text-primary" : "text-slate-600 dark:text-slate-300"
                            )}>
                                {isDragging
                                    ? 'Suelta las imágenes'
                                    : uploadedImages.length > 0
                                        ? 'Añadir más imágenes'
                                        : 'Sube tus referencias'
                                }
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {uploadedImages.length > 0
                                    ? `${MAX_REFERENCE_IMAGES - totalSelected} disponibles`
                                    : 'Arrastra o haz clic (máx. 10)'
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/* Max reached message */}
                {!canAddMore && (
                    <div className="text-center py-2 px-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
                        <p className="text-[10px] text-amber-700 dark:text-amber-400">
                            Máximo de {MAX_REFERENCE_IMAGES} imágenes alcanzado
                        </p>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="mt-2 flex items-center gap-2 px-1">
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        <span className="text-[10px] text-muted-foreground">Analizando imagen...</span>
                    </div>
                )}

                {error && (
                    <div className="mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-500" />
                        <p className="text-[10px] text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                )}
            </TabsContent>

            {/* BRAND KIT MODE */}
            <TabsContent value="brandkit" className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {brandKitImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {brandKitImages.map((img) => {
                            const isSelected = selectedBrandKitImageIds.includes(img.id)
                            const canSelect = canAddMore || isSelected

                            return (
                                <button
                                    key={img.id}
                                    onClick={() => canSelect && onToggleBrandKitImage?.(img.id)}
                                    disabled={!canSelect}
                                    className={cn(
                                        "relative rounded-xl overflow-hidden border transition-all aspect-square group",
                                        isSelected
                                            ? "border-primary ring-2 ring-primary/20 shadow-md transform scale-[0.98]"
                                            : canSelect
                                                ? "border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-white/30"
                                                : "border-slate-200 dark:border-white/10 opacity-50 cursor-not-allowed"
                                    )}
                                >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                                <img
                                    src={img.url}
                                    alt={img.name || 'Brand image'}
                                    className="w-full h-full object-cover"
                                />
                                {isSelected && onReferenceRoleChange && (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const currentRole = referenceImageRoles[img.id] || 'content'
                                            onReferenceRoleChange(img.id, getNextRole(currentRole))
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                const currentRole = referenceImageRoles[img.id] || 'content'
                                                onReferenceRoleChange(img.id, getNextRole(currentRole))
                                            }
                                        }}
                                        title="Cambiar rol: Estilo / Estilo+Contenido / Contenido / Logo"
                                        className={cn(
                                            "absolute top-1 left-1 text-[9px] px-2 py-0.5 rounded-full font-semibold transition-all z-30 cursor-pointer",
                                            roleChipClasses(referenceImageRoles[img.id] || 'content')
                                        )}
                                    >
                                        {roleLabel(referenceImageRoles[img.id] || 'content')}
                                    </div>
                                )}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[1px] z-20">
                                        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform scale-100 animate-in zoom-in duration-200">
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div className="h-32 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex flex-col items-center justify-center gap-2 text-center p-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                            <Palette className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            No hay imágenes en el Kit de Marca
                        </p>
                    </div>
                )}
            </TabsContent>

            {/* AI GENERATION MODE */}
            <TabsContent value="generate" className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2 relative">
                    <div className="absolute -top-1 -right-1 w-20 h-20 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                    <Textarea
                        value={aiImageDescription}
                        onChange={(e) => onAiDescriptionChange?.(e.target.value)}
                        placeholder="Describe la imagen que quieres generar... Ej: 'Una taza de café humeante sobre una mesa de madera con luz natural'"
                        className="min-h-[100px] text-xs resize-none rounded-xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/20"
                    />
                    <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-primary" />
                            La IA generará esta imagen automáticamente
                        </p>
                    </div>
                </div>
            </TabsContent>

            {/* CUSTOM STYLE INPUT (optional) */}
            {onReferenceRoleChange && (
                <p className="mt-3 text-[10px] text-muted-foreground">
                    Tip: pulsa la etiqueta de cada imagen seleccionada para cambiar su rol (`Estilo`, `Estilo+Contenido`, `Contenido` o `Logo`).
                </p>
            )}
            {onCustomStyleChange && (
                <div className="mt-4 pt-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 pl-1">
                        ¿Otro estilo en mente?
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={customStyle}
                            onChange={(e) => onCustomStyleChange(e.target.value)}
                            placeholder="Ej: Cyberpunk, Acuarela, Lego..."
                            className={cn(
                                "w-full h-11 px-4 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10",
                                "backdrop-blur-md text-sm transition-all duration-300",
                                "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                                "focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white/80 dark:focus:bg-black/40",
                                "hover:border-slate-300 dark:hover:border-white/20"
                            )}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            {customStyle ? <Check className="w-4 h-4 text-green-500" /> : <Palette className="w-4 h-4 opacity-50" />}
                        </div>
                    </div>
                </div>
            )}
        </Tabs>
    )
}
