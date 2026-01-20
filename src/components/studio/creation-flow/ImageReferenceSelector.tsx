'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2, X, Sparkles, Palette, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { VisionAnalysis } from '@/lib/creation-flow-types'

type ImageSourceMode = 'upload' | 'brandkit' | 'generate'

interface ImageReferenceSelectorProps {
    uploadedImage: string | null
    visionAnalysis: VisionAnalysis | null
    isAnalyzing: boolean
    error: string | null
    onUpload: (file: File) => void
    onClear?: () => void
    isOptional?: boolean
    // Brand Kit images
    brandKitImages?: Array<{ id: string; url: string; name?: string }>
    selectedBrandKitImageId?: string | null
    onSelectBrandKitImage?: (imageId: string) => void
    // AI Generation
    aiImageDescription?: string
    onAiDescriptionChange?: (description: string) => void
    // Mode Control
    mode?: ImageSourceMode
    onModeChange?: (mode: ImageSourceMode) => void
}

export function ImageReferenceSelector({
    uploadedImage,
    visionAnalysis,
    isAnalyzing,
    error,
    onUpload,
    onClear,
    isOptional = false,
    brandKitImages = [],
    selectedBrandKitImageId = null,
    onSelectBrandKitImage,
    aiImageDescription = '',
    onAiDescriptionChange,
    mode = 'upload',
    onModeChange,
}: ImageReferenceSelectorProps) {
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

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
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            onUpload(file)
        }
    }, [onUpload])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onUpload(file)
        }
    }, [onUpload])

    // Internal handler to sync if onModeChange is provided
    const handleModeChange = (val: string) => {
        if (onModeChange) {
            onModeChange(val as ImageSourceMode)
        }
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

            {/* UPLOAD MODE */}
            <TabsContent value="upload" className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {uploadedImage ? (
                    <div className="space-y-3">
                        <div
                            className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md cursor-pointer group shadow-sm transition-all hover:shadow-md"
                            onClick={() => inputRef.current?.click()}
                        >
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {onClear && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onClear()
                                    }}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all z-10 hover:scale-110"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}

                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <p className="text-[10px] text-white font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                                    Cambiar imagen
                                </p>
                            </div>

                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2 text-white/90">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        <span className="text-[10px] font-medium tracking-wide">Analizando visión...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {visionAnalysis && !isAnalyzing && (
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] font-medium text-green-700 dark:text-green-400">
                                    Análisis completado: {visionAnalysis.subjectLabel}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            "relative h-32 rounded-2xl border-2 border-dashed transition-all cursor-pointer group overflow-hidden",
                            "flex flex-col items-center justify-center gap-3",
                            isDragging
                                ? "border-primary bg-primary/10 dark:bg-primary/10 scale-[0.99]"
                                : "border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-white/10"
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                            isDragging
                                ? "bg-primary text-primary-foreground scale-110"
                                : "bg-white text-slate-400 group-hover:text-primary group-hover:scale-110 dark:bg-white/10 dark:text-slate-400"
                        )}>
                            {isDragging ? (
                                <Upload className="w-5 h-5" />
                            ) : (
                                <ImageIcon className="w-5 h-5" />
                            )}
                        </div>

                        <div className="text-center z-10 relative">
                            <p className={cn(
                                "text-xs font-semibold transition-colors",
                                isDragging ? "text-primary dark:text-primary" : "text-slate-600 dark:text-slate-300"
                            )}>
                                {isDragging ? 'Suelta la imagen' : 'Sube tu referencia'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                Arrastra o haz clic para explorar
                            </p>
                        </div>
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
                        {brandKitImages.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => onSelectBrandKitImage?.(img.id)}
                                className={cn(
                                    "relative rounded-xl overflow-hidden border transition-all aspect-square group",
                                    selectedBrandKitImageId === img.id
                                        ? "border-primary ring-2 ring-primary/20 shadow-md transform scale-[0.98]"
                                        : "border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-white/30"
                                )}
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                                <img
                                    src={img.url}
                                    alt={img.name || 'Brand image'}
                                    className="w-full h-full object-cover"
                                />
                                {selectedBrandKitImageId === img.id && (
                                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[1px] z-20">
                                        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform scale-100 animate-in zoom-in duration-200">
                                            <Check className="w-4 h-4 stroke-[3]" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
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
        </Tabs>
    )
}
