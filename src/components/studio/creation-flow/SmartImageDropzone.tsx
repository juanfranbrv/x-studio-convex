'use client'

import { useCallback, useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VisionAnalysis } from '@/lib/creation-flow-types'

interface SmartImageDropzoneProps {
    uploadedImage: string | null
    visionAnalysis: VisionAnalysis | null
    isAnalyzing: boolean
    error: string | null
    onUpload: (file: File) => void
    onClear?: () => void
    isOptional?: boolean
    onSkip?: () => void
}

export function SmartImageDropzone({
    uploadedImage,
    visionAnalysis,
    isAnalyzing,
    error,
    onUpload,
    onClear,
    isOptional = false,
}: SmartImageDropzoneProps) {
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

    // Show uploaded image with analysis
    if (uploadedImage) {
        return (
            <div className="space-y-3">
                <div
                    className="relative rounded-xl overflow-hidden border border-border bg-muted/30 cursor-pointer group"
                    onClick={() => inputRef.current?.click()}
                >
                    <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />

                    {/* Clear button */}
                    {onClear && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onClear()
                            }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {/* Change indicator overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <p className="text-[10px] text-white font-medium bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                            Haz clic para cambiar
                        </p>
                    </div>

                    {/* Analysis overlay */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Analizando...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Vision Analysis Results */}
                {visionAnalysis && !isAnalyzing && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                            <Check className="w-3.5 h-3.5" />
                            <span className="font-medium">Detectado: {visionAnalysis.subjectLabel}</span>
                        </div>

                        {/* Extracted Colors */}
                        {visionAnalysis.colorPalette.length > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground mr-1">Colores:</span>
                                {visionAnalysis.colorPalette.slice(0, 5).map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="w-4 h-4 rounded-full border border-black/10"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Keywords */}
                        {visionAnalysis.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {visionAnalysis.keywords.slice(0, 5).map((keyword, idx) => (
                                    <span
                                        key={idx}
                                        className="px-1.5 py-0.5 text-[10px] bg-muted rounded-md text-muted-foreground"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        )
    }

    // Dropzone
    return (
        <div className="space-y-2">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "relative h-28 rounded-xl border-2 border-dashed transition-all cursor-pointer",
                    "flex flex-col items-center justify-center gap-2",
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
                        <Upload className="w-5 h-5" />
                    ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>

                <div className="text-center">
                    <p className="text-xs font-medium">
                        {isDragging ? 'Suelta aquí' : 'Arrastra o haz clic'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        JPG, PNG, WebP
                    </p>
                </div>
            </div>
        </div>
    )
}
