'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Minus, Sparkles, Loader2, Palette, Wand2, Layout, Layers, ImagePlus, Fingerprint, GalleryHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BrandDNA } from '@/lib/brand-types'
import { ImageReferenceSelector } from '@/components/studio/creation-flow/ImageReferenceSelector'
import { resizeImage } from '@/lib/image-utils'
import { CAROUSEL_COMPOSITIONS } from '@/lib/carousel-compositions'
import { CarouselCompositionSelector } from '@/components/studio/carousel/CarouselCompositionSelector'
import { BrandingConfigurator } from '@/components/studio/creation-flow/BrandingConfigurator'

export interface SlideConfig {
    index: number
    customText?: string
}

export interface CarouselSettings {
    prompt: string
    slideCount: number
    aspectRatio: '1:1' | '4:5' | '3:4'
    style: string
    slides: SlideConfig[]
    compositionId: string
    imageSourceMode: 'upload' | 'brandkit' | 'generate'
    aiImageDescription?: string
    // Brand Kit Context
    selectedLogoUrl?: string
    selectedColors: string[]
    selectedImageUrls: string[]
    includeLogoOnSlides: boolean
}

interface CarouselControlsPanelProps {
    onAnalyze: (settings: CarouselSettings) => Promise<void>
    onGenerate: (settings: CarouselSettings) => void
    onAspectRatioChange?: (ratio: '1:1' | '4:5' | '3:4') => void
    onReferenceImagesChange?: (images: Array<{ url: string; source: 'upload' | 'brandkit' }>) => void
    isAnalyzing: boolean
    isGenerating: boolean
    currentSlideIndex: number
    generatedCount: number
    totalSlides: number
    // Brand Kit Data
    brandKit: BrandDNA | null
    analysisHook?: string
    analysisStructure?: { id?: string; name?: string }
    analysisIntent?: string
    analysisIntentLabel?: string
    isAdmin?: boolean
}

const SectionHeader = ({
    icon: Icon,
    title,
    extra,
}: {
    icon: React.ElementType
    title: string
    extra?: React.ReactNode
}) => (
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h3>
        </div>
        {extra}
    </div>
)

const STYLE_OPTIONS = [
    { id: 'minimal', label: 'Minimalista' },
    { id: 'gradient', label: 'Gradientes' },
    { id: 'photo', label: 'Fotográfico' },
    { id: 'illustration', label: 'Ilustración' },
    { id: 'bold', label: 'Bold & Tipográfico' },
    { id: 'elegant', label: 'Elegante' },
]

export function CarouselControlsPanel({
    onAnalyze,
    onGenerate,
    isAnalyzing,
    isGenerating,
    onAspectRatioChange,
    onReferenceImagesChange,
    currentSlideIndex,
    generatedCount,
    totalSlides,
    brandKit,
    analysisHook,
    analysisStructure,
    analysisIntent,
    analysisIntentLabel,
    isAdmin = false
}: CarouselControlsPanelProps) {
    const [prompt, setPrompt] = useState('')
    const [slideCount, setSlideCount] = useState(5)
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '3:4'>('3:4')
    const [style, setStyle] = useState('minimal')
    const [slides, setSlides] = useState<SlideConfig[]>([])
    const [compositionId, setCompositionId] = useState(CAROUSEL_COMPOSITIONS[0]?.id || 'free')
    const [editingSlide, setEditingSlide] = useState<number | null>(null)
    const [editText, setEditText] = useState('')

    // Brand Kit Selections
    const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null)
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedBrandKitImageIds, setSelectedBrandKitImageIds] = useState<string[]>([])
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'brandkit' | 'generate'>('upload')
    const [aiImageDescription, setAiImageDescription] = useState('')
    const [isImageAnalyzing, setIsImageAnalyzing] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)
    const [includeLogoOnSlides, setIncludeLogoOnSlides] = useState(true)

    // Get brand logos
    const brandLogos = brandKit?.logos || []
    const primaryLogo = brandLogos[0]?.url || brandKit?.logo_url

    // Get brand colors
    const brandColors = (brandKit?.colors || []).filter(c => c.color)

    // Get brand images
    const brandImages = (brandKit?.images || []).filter(img => img.url)

    const handleSlideCountChange = (delta: number) => {
        const newCount = Math.max(1, Math.min(15, slideCount + delta))
        setSlideCount(newCount)
    }

    useEffect(() => {
        if (!onReferenceImagesChange) return
        const uploaded = uploadedImages.map(url => ({ url, source: 'upload' as const }))
        const brandkit = selectedBrandKitImageIds.map(url => ({ url, source: 'brandkit' as const }))
        onReferenceImagesChange([...uploaded, ...brandkit])
    }, [uploadedImages, selectedBrandKitImageIds, onReferenceImagesChange])

    const handleAspectRatioSelect = (ratio: '1:1' | '4:5' | '3:4') => {
        setAspectRatio(ratio)
        onAspectRatioChange?.(ratio)
    }

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        )
    }

    const toggleBrandKitImage = (id: string) => {
        setSelectedBrandKitImageIds(prev =>
            prev.includes(id)
                ? prev.filter(u => u !== id)
                : [...prev, id]
        )
    }

    const handleUploadImage = async (file: File) => {
        const maxTotal = 10
        const totalSelected = uploadedImages.length + selectedBrandKitImageIds.length
        if (totalSelected >= maxTotal) return

        setIsImageAnalyzing(true)
        setImageError(null)
        try {
            const base64 = await resizeImage(file, {
                maxWidth: 1536,
                maxHeight: 1536,
                quality: 0.8,
                format: 'image/jpeg'
            })
            setUploadedImages(prev => [...prev, base64])
        } catch (error) {
            setImageError(error instanceof Error ? error.message : 'Error al subir imagen')
        } finally {
            setIsImageAnalyzing(false)
        }
    }

    const removeUploadedImage = (url: string) => {
        setUploadedImages(prev => prev.filter(u => u !== url))
    }

    const clearUploadedImages = () => setUploadedImages([])
    const clearBrandKitImages = () => setSelectedBrandKitImageIds([])

    const handleEditSlide = (index: number) => {
        setEditingSlide(index)
        setEditText(slides[index]?.customText || '')
    }

    const handleSaveSlideEdit = () => {
        if (editingSlide !== null) {
            const newSlides = [...slides]
            if (!newSlides[editingSlide]) {
                newSlides[editingSlide] = { index: editingSlide }
            }
            newSlides[editingSlide].customText = editText || undefined
            setSlides(newSlides)
            setEditingSlide(null)
            setEditText('')
        }
    }

    const buildSettings = () => {
        const finalSlides = slides.length === slideCount
            ? slides
            : Array.from({ length: slideCount }, (_, i) => slides[i] || { index: i })

        const selectedImageUrls =
            imageSourceMode === 'upload'
                ? uploadedImages
                : imageSourceMode === 'brandkit'
                    ? selectedBrandKitImageIds
                    : []

        const resolveSelectedLogoUrl = () => {
            if (!includeLogoOnSlides) return undefined
            if (!selectedLogoId) return primaryLogo
            const match = selectedLogoId.match(/^logo-(\d+)$/)
            if (match) {
                const idx = Number(match[1])
                return brandLogos[idx]?.url || primaryLogo
            }
            return primaryLogo
        }

        return {
            prompt,
            slideCount,
            aspectRatio,
            style: STYLE_OPTIONS.find(s => s.id === style)?.label || 'Minimalista',
            slides: finalSlides,
            compositionId,
            imageSourceMode,
            aiImageDescription: imageSourceMode === 'generate' ? (aiImageDescription.trim() || undefined) : undefined,
            selectedLogoUrl: resolveSelectedLogoUrl(),
            selectedColors: selectedColors.length > 0 ? selectedColors : brandColors.slice(0, 3).map(c => c.color),
            selectedImageUrls,
            includeLogoOnSlides
        }
    }

    const handleGenerate = () => {
        if (!prompt.trim()) return
        onGenerate(buildSettings())
    }

    const handleAnalyze = async () => {
        if (!prompt.trim()) return
        await onAnalyze(buildSettings())
    }

    const canGenerate = prompt.trim().length > 0 && !isGenerating && brandKit !== null
    const canAnalyze = prompt.trim().length > 0 && !isAnalyzing && !isGenerating && brandKit !== null

    return (
        <div className="w-full md:w-[27%] h-full controls-panel flex flex-col shrink-0 relative group/panel">
            <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-6">
                {/* Slide Count */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={GalleryHorizontal} title="Numero de diapositivas" />
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => handleSlideCountChange(-1)} disabled={slideCount <= 1}>
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-3xl font-bold">{slideCount}</span>
                            <span className="text-sm text-muted-foreground ml-2">slides</span>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => handleSlideCountChange(1)} disabled={slideCount >= 15}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Entre 1 y 15 diapositivas.</p>
                </div>

                {/* Lazy Prompt Result */}
                {isAdmin && (analysisHook || analysisStructure?.name || analysisStructure?.id || analysisIntentLabel || analysisIntent) && (
                    <div className="glass-card p-4 space-y-3">
                        <SectionHeader icon={Sparkles} title="Resumen IA" />
                        <div className="space-y-2 text-sm">
                            {(analysisIntentLabel || analysisIntent) && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Intencion</span>
                                    <span className="text-foreground">{analysisIntentLabel || analysisIntent}</span>
                                </div>
                            )}
                            {(analysisStructure?.name || analysisStructure?.id) && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estructura</span>
                                    <span className="text-foreground">
                                        {analysisStructure?.name || analysisStructure?.id}
                                        {analysisStructure?.name && analysisStructure?.id ? ` (${analysisStructure.id})` : ''}
                                    </span>
                                </div>
                            )}
                            {analysisHook && (
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gancho</span>
                                    <p className="text-foreground leading-snug">{analysisHook}</p>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diapositivas</span>
                                <span className="text-foreground">{slideCount}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Formato</span>
                                <span className="text-foreground">{aspectRatio}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Prompt */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Wand2} title="Que quieres crear?" />
                    <div className="relative">
                        <Textarea
                            placeholder="Ej: 5 tips para mejorar tu productividad..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    if (canAnalyze) {
                                        handleAnalyze()
                                    }
                                }
                            }}
                            className="min-h-[100px] text-sm resize-none bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary pb-12 pr-2 transition-all"
                        />
                        <div className="absolute right-2 bottom-2 flex items-center gap-2">
                            {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                            <Button
                                size="sm"
                                onClick={handleAnalyze}
                                disabled={!canAnalyze}
                                className="h-8 px-4 text-xs uppercase font-bold tracking-wider bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-2" />
                                Analizar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Composition */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Layout} title="Composición" />
                    <CarouselCompositionSelector
                        compositions={CAROUSEL_COMPOSITIONS}
                        selectedId={compositionId}
                        onSelect={setCompositionId}
                    />
                    <p className="text-[11px] text-muted-foreground leading-snug">
                        Define la forma de distribuir el contenido en cada diapositiva.
                    </p>
                </div>

                {/* Format */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Layers} title="Formato" />
                    <div className="space-y-2">
                        <button
                            onClick={() => handleAspectRatioSelect('3:4')}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
                                aspectRatio === '3:4' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-8 h-10 rounded bg-muted border border-border" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Tall / Vertical Extendido (Tendencia 2026)</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">3:4</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    1080x1440 ? +6.6% pantalla ? domina el feed y encaja con la nueva cuadr?cula vertical.
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAspectRatioSelect('4:5')}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
                                aspectRatio === '4:5' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-8 h-10 rounded bg-muted border border-border" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Vertical Est?ndar (Retrato)</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">4:5</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    1080x1350 ? el est?ndar m?s seguro para evitar recortes en dispositivos antiguos o Meta Ads.
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAspectRatioSelect('1:1')}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left",
                                aspectRatio === '1:1' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-10 h-10 rounded bg-muted border border-border" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">Cuadrado (Tradicional)</span>
                                    <span className="text-[10px] font-medium text-muted-foreground">1:1</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    1080x1080 ? formato original y cl?sico para composiciones equilibradas.
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Image */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={ImagePlus} title="Imagen de Referencia" />
                    <ImageReferenceSelector
                        uploadedImages={uploadedImages}
                        visionAnalysis={null}
                        isAnalyzing={isImageAnalyzing}
                        error={imageError}
                        onUpload={handleUploadImage}
                        onRemoveUploadedImage={removeUploadedImage}
                        onClearUploadedImages={clearUploadedImages}
                        brandKitImages={brandImages.map((img, idx) => ({
                            id: img.url,
                            url: img.url,
                            name: `Imagen ${idx + 1}`
                        }))}
                        selectedBrandKitImageIds={selectedBrandKitImageIds}
                        onToggleBrandKitImage={toggleBrandKitImage}
                        onClearBrandKitImages={clearBrandKitImages}
                        aiImageDescription={aiImageDescription}
                        onAiDescriptionChange={setAiImageDescription}
                        mode={imageSourceMode}
                        onModeChange={setImageSourceMode}
                    />
                </div>

                {/* Logo */}
                <div className="glass-card p-4 space-y-4">
                    <SectionHeader icon={Fingerprint} title="Logo" />
                    {brandLogos.length > 0 || primaryLogo ? (
                        <>
                            <BrandingConfigurator
                                selectedLayout={null}
                                selectedLogoId={selectedLogoId}
                                selectedBrandColors={[]}
                                onSelectLogo={setSelectedLogoId}
                                onToggleBrandColor={() => { }}
                                onAddCustomColor={() => { }}
                                showLogo={true}
                                showColors={false}
                                showTypography={false}
                                showBrandTexts={false}
                                rawMessage={prompt}
                            />
                            <div className="flex items-center justify-between pt-1">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Aplicar logo en todas</p>
                                    <p className="text-xs text-muted-foreground">Misma posiciÃ³n y tamaÃ±o</p>
                                </div>
                                <button
                                    onClick={() => setIncludeLogoOnSlides(!includeLogoOnSlides)}
                                    className={cn(
                                        "w-10 h-6 rounded-full transition-colors",
                                        includeLogoOnSlides ? "bg-primary" : "bg-muted"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full bg-white transition-transform mx-1",
                                        includeLogoOnSlides ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-muted-foreground">No hay logo en tu Brand Kit.</p>
                    )}
                </div>

                {/* Colors */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Palette} title="Colores" />
                    {brandColors.length > 0 ? (
                        <>
                            <div className="flex flex-wrap gap-2">
                                {brandColors.map((c, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => toggleColor(c.color)}
                                        className={cn(
                                            "w-8 h-8 rounded-full border-2 transition-all",
                                            selectedColors.includes(c.color)
                                                ? "border-primary ring-2 ring-primary/30 scale-110"
                                                : "border-transparent hover:scale-105"
                                        )}
                                        style={{ backgroundColor: c.color }}
                                        title={c.role || c.color}
                                    />
                                ))}
                            </div>
                            {selectedColors.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Se usaran los 3 primeros colores por defecto.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-xs text-muted-foreground">No hay colores en tu Brand Kit.</p>
                    )}
                </div>
            </div>

            {/* Generate */}
            <div className="p-6 border-t border-border/40">
                <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generando {generatedCount}/{totalSlides}...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generar Carrusel
                        </>
                    )}
                </Button>

                {!brandKit && (
                    <p className="text-xs text-destructive text-center mt-2">
                        Selecciona un Brand Kit para continuar
                    </p>
                )}
            </div>
        </div>
    )
}
