'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Minus, Sparkles, Loader2, GripVertical, Pencil, X, Palette, Image as ImageIcon, Type } from 'lucide-react'
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
    onGenerate: (settings: CarouselSettings) => void
    isGenerating: boolean
    currentSlideIndex: number
    generatedCount: number
    totalSlides: number
    // Brand Kit Data
    brandKit: BrandDNA | null
}

const STYLE_OPTIONS = [
    { id: 'minimal', label: 'Minimalista' },
    { id: 'gradient', label: 'Gradientes' },
    { id: 'photo', label: 'Fotográfico' },
    { id: 'illustration', label: 'Ilustración' },
    { id: 'bold', label: 'Bold & Tipográfico' },
    { id: 'elegant', label: 'Elegante' },
]

export function CarouselControlsPanel({
    onGenerate,
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
        const newCount = Math.max(2, Math.min(10, slideCount + delta))
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

    const handleGenerate = () => {
        if (!prompt.trim()) return

        const finalSlides = slides.length === slideCount
            ? slides
            : Array.from({ length: slideCount }, (_, i) => slides[i] || { index: i })

        onGenerate({
            prompt,
            slideCount,
            aspectRatio,
            style: STYLE_OPTIONS.find(s => s.id === style)?.label || 'Minimalista',
            slides: finalSlides,
            selectedLogoUrl: includeLogoOnSlides ? (selectedLogoUrl || primaryLogo) : undefined,
            selectedColors: selectedColors.length > 0 ? selectedColors : brandColors.slice(0, 3).map(c => c.color),
            selectedImageUrls,
            includeLogoOnSlides
        })
    }

    const canGenerate = prompt.trim().length > 0 && !isGenerating && brandKit !== null

    return (
        <div className="w-full md:w-96 h-full bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border-l border-white/20 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Brand Kit Header */}
                {brandKit && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        {primaryLogo && (
                            <img src={primaryLogo} alt="Logo" className="w-10 h-10 object-contain rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{brandKit.brand_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{brandKit.tagline}</p>
                        </div>
                    </div>
                )}

                {/* Slide Count */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Número de Slides
                    </Label>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => handleSlideCountChange(-1)} disabled={slideCount <= 2}>
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-3xl font-bold">{slideCount}</span>
                            <span className="text-sm text-muted-foreground ml-2">slides</span>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => handleSlideCountChange(1)} disabled={slideCount >= 10}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Prompt */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Tema del Carrusel
                    </Label>
                    <Textarea
                        placeholder="Ej: 5 tips para mejorar tu productividad..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px] resize-none"
                    />
                </div>

                {/* Brand Colors */}
                {brandColors.length > 0 && (
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Palette className="w-3 h-3" />
                            Colores de Marca
                        </Label>
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
                                Se usarán los 3 primeros colores por defecto
                            </p>
                        )}
                    </div>
                )}

                {/* Brand Images */}
                {brandImages.length > 0 && (
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" />
                            Imágenes de Referencia
                        </Label>
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
                    </div>
                )}

                {/* Logo Toggle */}
                {primaryLogo && (
                    <div className="flex items-center justify-between py-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            Incluir logo en slides
                        </Label>
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
                )}

                {/* Aspect Ratio */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Formato
                    </Label>
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

                {/* Style */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Estilo Visual
                    </Label>
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

                {/* Slide List */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Slides
                    </Label>
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
                                        {i === 0 ? '📌 Portada' : i === slideCount - 1 ? '🎯 CTA' : `📄 Slide ${i + 1}`}
                                    </p>
                                    {slides[i]?.customText && (
                                        <p className="text-xs text-muted-foreground truncate">{slides[i].customText}</p>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSlide(i)}>
                                    <Pencil className="w-3 h-3" />
                                </Button>
                                {isGenerating && i === currentSlideIndex && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                                {isGenerating && i < generatedCount && <span className="text-green-500 text-xs">✓</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Edit Slide Inline */}
                {editingSlide !== null && (
                    <div className="p-3 rounded-lg border border-primary/50 bg-primary/5 space-y-2">
                        <Label className="text-xs">Texto para Slide {editingSlide + 1}</Label>
                        <Textarea
                            placeholder="Dejar vacío para auto..."
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
