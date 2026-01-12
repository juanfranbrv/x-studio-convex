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

    // Internal handler to sync if onModeChange is provided, otherwise local (though we want controlled)
    const handleModeChange = (val: string) => {
        if (onModeChange) {
            onModeChange(val as ImageSourceMode)
        }
    }

    return (
        <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="upload" className="text-[10px] h-7">
                    <Upload className="w-3 h-3 mr-1" />
                    Subir
                </TabsTrigger>
                <TabsTrigger value="brandkit" className="text-[10px] h-7">
                    <Palette className="w-3 h-3 mr-1" />
                    Kit de Marca
                </TabsTrigger>
                <TabsTrigger value="generate" className="text-[10px] h-7">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Generar con IA
                </TabsTrigger>
            </TabsList>

            {/* UPLOAD MODE */}
            <TabsContent value="upload" className="mt-3">
                {uploadedImage ? (
                    <div className="space-y-2">
                        <div
                            className="relative rounded-lg overflow-hidden border border-border bg-muted/30 cursor-pointer group"
                            onClick={() => inputRef.current?.click()}
                        >
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="w-full h-24 object-cover transition-transform group-hover:scale-105"
                            />

                            {onClear && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onClear()
                                    }}
                                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}

                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <p className="text-[9px] text-white font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                    Cambiar
                                </p>
                            </div>

                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <div className="flex items-center gap-1.5 text-white text-[10px]">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span>Analizando...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {visionAnalysis && !isAnalyzing && (
                            <p className="text-[10px] text-green-600 dark:text-green-400">
                                ✓ {visionAnalysis.subjectLabel}
                            </p>
                        )}
                    </div>
                ) : (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            "relative h-24 rounded-lg border-2 border-dashed transition-all cursor-pointer",
                            "flex flex-col items-center justify-center gap-1.5",
                            isDragging
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            isDragging ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {isDragging ? (
                                <Upload className="w-4 h-4" />
                            ) : (
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] font-medium">
                                {isDragging ? 'Suelta aquí' : 'Arrastra o haz clic'}
                            </p>
                            <p className="text-[9px] text-muted-foreground">
                                JPG, PNG, WebP
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-[10px] text-destructive mt-1">{error}</p>
                )}
            </TabsContent>

            {/* BRAND KIT MODE */}
            <TabsContent value="brandkit" className="mt-3">
                {brandKitImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {brandKitImages.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => onSelectBrandKitImage?.(img.id)}
                                className={cn(
                                    "relative rounded-lg overflow-hidden border-2 transition-all aspect-square",
                                    selectedBrandKitImageId === img.id
                                        ? "border-primary border-[3px] ring-2 ring-primary/20 scale-[0.98]"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <img
                                    src={img.url}
                                    alt={img.name || 'Brand image'}
                                    className="w-full h-full object-cover"
                                />
                                {selectedBrandKitImageId === img.id && (
                                    <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[1px]">
                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform scale-110">
                                            <Check className="w-5 h-5 stroke-[3]" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                        <p className="text-[10px] text-muted-foreground">
                            No hay imágenes en el Kit de Marca
                        </p>
                    </div>
                )}
            </TabsContent>

            {/* AI GENERATION MODE */}
            <TabsContent value="generate" className="mt-3">
                <div className="space-y-2">
                    <Textarea
                        value={aiImageDescription}
                        onChange={(e) => onAiDescriptionChange?.(e.target.value)}
                        placeholder="Describe la imagen que quieres generar... Ej: 'Una taza de café humeante sobre una mesa de madera con luz natural'"
                        className="min-h-[80px] text-[11px] resize-none"
                    />
                    <p className="text-[9px] text-muted-foreground">
                        La IA generará esta imagen cuando presiones "Generar"
                    </p>
                </div>
            </TabsContent>
        </Tabs>
    )
}
