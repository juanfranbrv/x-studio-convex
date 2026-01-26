'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Minus, Sparkles, Loader2, GripVertical, Pencil, Palette, Wand2, Layout, Layers, ImagePlus, Fingerprint, GalleryHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BrandDNA } from '@/lib/brand-types'

export interface SlideConfig {
    index: number
    customText?: string
}

export interface CarouselSettings {
    prompt: string
    slideCount: number
    aspectRatio: '1:1' | '4:5'
    style: string
    slides: SlideConfig[]
    // Brand Kit Context
    selectedLogoUrl?: string
    selectedColors: string[]
    selectedImageUrls: string[]
    includeLogoOnSlides: boolean
}

interface CarouselControlsPanelProps {
    onAnalyze: (settings: CarouselSettings) => void
    onGenerate: (settings: CarouselSettings) => void
    isAnalyzing: boolean
    isGenerating: boolean
    currentSlideIndex: number
    generatedCount: number
    totalSlides: number
    // Brand Kit Data
    brandKit: BrandDNA | null
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
    currentSlideIndex,
    generatedCount,
    totalSlides,
    brandKit
}: CarouselControlsPanelProps) {
    const [prompt, setPrompt] = useState('')
    const [slideCount, setSlideCount] = useState(5)
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5'>('1:1')
    const [style, setStyle] = useState('minimal')
    const [slides, setSlides] = useState<SlideConfig[]>([])
    const [editingSlide, setEditingSlide] = useState<number | null>(null)
    const [editText, setEditText] = useState('')

    // Brand Kit Selections
    const [selectedLogoUrl, setSelectedLogoUrl] = useState<string | undefined>()
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([])
    const [includeLogoOnSlides, setIncludeLogoOnSlides] = useState(true)

    // Get brand logos
    const brandLogos = brandKit?.logos || []
    const primaryLogo = brandLogos[0]?.url || brandKit?.logo_url

    // Get brand colors
    const brandColors = (brandKit?.colors || []).filter(c => c.color)

    // Get brand images
    const brandImages = (brandKit?.images || []).filter(img => img.url)

    const handleSlideCountChange = (delta: number) => {
        const newCount = Math.max(1, Math.min(5, slideCount + delta))
        setSlideCount(newCount)
    }

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        )
    }

    const toggleImage = (url: string) => {
        setSelectedImageUrls(prev =>
            prev.includes(url)
                ? prev.filter(u => u !== url)
                : [...prev, url]
        )
    }

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

        return {
            prompt,
            slideCount,
            aspectRatio,
            style: STYLE_OPTIONS.find(s => s.id === style)?.label || 'Minimalista',
            slides: finalSlides,
            selectedLogoUrl: includeLogoOnSlides ? (selectedLogoUrl || primaryLogo) : undefined,
            selectedColors: selectedColors.length > 0 ? selectedColors : brandColors.slice(0, 3).map(c => c.color),
            selectedImageUrls,
            includeLogoOnSlides
        }
    }

    const handleGenerate = () => {
        if (!prompt.trim()) return
        onGenerate(buildSettings())
    }

    const handleAnalyze = () => {
        if (!prompt.trim()) return
        onAnalyze(buildSettings())
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
                        <Button variant="outline" size="icon" onClick={() => handleSlideCountChange(1)} disabled={slideCount >= 5}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Entre 1 y 5 diapositivas.</p>
                </div>

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
                    <SectionHeader icon={Layout} title="Composicion" />
                    <div className="space-y-2 max-h-[180px] overflow-y-auto">
                        {Array.from({ length: slideCount }, (_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg border transition-all",
                                    isGenerating && i === currentSlideIndex ? "border-primary bg-primary/5" :
                                        isGenerating && i < generatedCount ? "border-green-500/50 bg-green-500/5" : "border-border"
                                )}
                            >
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {i === 0 ? 'Portada' : i === slideCount - 1 ? 'CTA' : `Slide ${i + 1}`}
                                    </p>
                                    {slides[i]?.customText && (
                                        <p className="text-xs text-muted-foreground truncate">{slides[i].customText}</p>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSlide(i)}>
                                    <Pencil className="w-3 h-3" />
                                </Button>
                                {isGenerating && i === currentSlideIndex && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                                {isGenerating && i < generatedCount && <span className="text-green-500 text-xs">OK</span>}
                            </div>
                        ))}
                    </div>

                    {editingSlide !== null && (
                        <div className="p-3 rounded-lg border border-primary/50 bg-primary/5 space-y-2">
                            <Label className="text-xs">Texto para Slide {editingSlide + 1}</Label>
                            <Textarea
                                placeholder="Dejar vacio para auto..."
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="min-h-[60px] resize-none text-sm"
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveSlideEdit} className="flex-1">Guardar</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingSlide(null)}>Cancelar</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Format */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Layers} title="Formato" />
                    <div className="flex gap-3">
                        <button
                            onClick={() => setAspectRatio('1:1')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all flex-1",
                                aspectRatio === '1:1' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-10 h-10 rounded bg-muted border border-border" />
                            <span className="text-xs font-medium">1:1</span>
                        </button>
                        <button
                            onClick={() => setAspectRatio('4:5')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all flex-1",
                                aspectRatio === '4:5' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-8 h-10 rounded bg-muted border border-border" />
                            <span className="text-xs font-medium">4:5</span>
                        </button>
                    </div>
                </div>

                {/* Image */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={ImagePlus} title="Imagen" />
                    {brandImages.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                            {brandImages.slice(0, 8).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => toggleImage(img.url)}
                                    className={cn(
                                        "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                        selectedImageUrls.includes(img.url)
                                            ? "border-primary ring-2 ring-primary/30"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            No hay imagenes en tu Brand Kit.
                        </p>
                    )}
                </div>

                {/* Style */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Sparkles} title="Estilo" />
                    <div className="grid grid-cols-2 gap-2">
                        {STYLE_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setStyle(opt.id)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                    style === opt.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logo */}
                <div className="glass-card p-4 space-y-3">
                    <SectionHeader icon={Fingerprint} title="Logo" />
                    {primaryLogo ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                    <img src={selectedLogoUrl || primaryLogo} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Incluir logo</p>
                                    <p className="text-xs text-muted-foreground">Se aplicara en las slides</p>
                                </div>
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

