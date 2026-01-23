'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Plus, Minus, Sparkles, Loader2, GripVertical, Pencil, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SlideConfig {
    index: number
    customText?: string
    isEditing?: boolean
}

export interface CarouselSettings {
    prompt: string
    slideCount: number
    aspectRatio: '1:1' | '4:5'
    style: string
    slides: SlideConfig[]
}

interface CarouselControlsPanelProps {
    onGenerate: (settings: CarouselSettings) => void
    isGenerating: boolean
    currentSlideIndex: number
    generatedCount: number
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
    generatedCount
}: CarouselControlsPanelProps) {
    const [prompt, setPrompt] = useState('')
    const [slideCount, setSlideCount] = useState(5)
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5'>('1:1')
    const [style, setStyle] = useState('minimal')
    const [slides, setSlides] = useState<SlideConfig[]>([])
    const [editingSlide, setEditingSlide] = useState<number | null>(null)
    const [editText, setEditText] = useState('')

    // Update slide configs when count changes
    const handleSlideCountChange = (delta: number) => {
        const newCount = Math.max(2, Math.min(10, slideCount + delta))
        setSlideCount(newCount)

        // Adjust slides array
        if (newCount > slides.length) {
            const newSlides = [...slides]
            for (let i = slides.length; i < newCount; i++) {
                newSlides.push({ index: i })
            }
            setSlides(newSlides)
        } else {
            setSlides(slides.slice(0, newCount))
        }
    }

    // Initialize slides when prompt changes
    const initializeSlides = () => {
        setSlides(Array.from({ length: slideCount }, (_, i) => ({ index: i })))
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

        // Initialize slides if empty
        const finalSlides = slides.length === slideCount
            ? slides
            : Array.from({ length: slideCount }, (_, i) => slides[i] || { index: i })

        onGenerate({
            prompt,
            slideCount,
            aspectRatio,
            style: STYLE_OPTIONS.find(s => s.id === style)?.label || 'Minimalista',
            slides: finalSlides
        })
    }

    const canGenerate = prompt.trim().length > 0 && !isGenerating

    return (
        <div className="w-full md:w-96 h-full bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border-l border-white/20 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Slide Count */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Número de Slides
                    </Label>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSlideCountChange(-1)}
                            disabled={slideCount <= 2}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-3xl font-bold">{slideCount}</span>
                            <span className="text-sm text-muted-foreground ml-2">slides</span>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSlideCountChange(1)}
                            disabled={slideCount >= 10}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Prompt Input */}
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Tema del Carrusel
                    </Label>
                    <Textarea
                        placeholder="Ej: 5 tips para mejorar tu productividad, Los beneficios del yoga, Receta paso a paso..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px] resize-none"
                    />
                </div>

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
                                aspectRatio === '1:1'
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-10 h-10 rounded bg-muted border border-border" />
                            <span className="text-xs font-medium">1:1 Cuadrado</span>
                        </button>
                        <button
                            onClick={() => setAspectRatio('4:5')}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all flex-1",
                                aspectRatio === '4:5'
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                            )}
                        >
                            <div className="w-8 h-10 rounded bg-muted border border-border" />
                            <span className="text-xs font-medium">4:5 Vertical</span>
                        </button>
                    </div>
                </div>

                {/* Style Selection */}
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
                                    style === opt.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
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
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {Array.from({ length: slideCount }, (_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg border transition-all",
                                    isGenerating && i === currentSlideIndex
                                        ? "border-primary bg-primary/5"
                                        : isGenerating && i < generatedCount
                                            ? "border-green-500/50 bg-green-500/5"
                                            : "border-border"
                                )}
                            >
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {i === 0 ? '📌 Portada' :
                                            i === slideCount - 1 ? '🎯 CTA' :
                                                `📄 Slide ${i + 1}`}
                                    </p>
                                    {slides[i]?.customText && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {slides[i].customText}
                                        </p>
                                    )}
                                </div>
                                {editingSlide === i ? (
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={handleSaveSlideEdit}
                                        >
                                            <Sparkles className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setEditingSlide(null)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleEditSlide(i)}
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                )}
                                {isGenerating && i === currentSlideIndex && (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                )}
                                {isGenerating && i < generatedCount && (
                                    <span className="text-green-500 text-xs">✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Edit Slide Modal/Inline */}
                {editingSlide !== null && (
                    <div className="p-3 rounded-lg border border-primary/50 bg-primary/5 space-y-2">
                        <Label className="text-xs">Texto personalizado para Slide {editingSlide + 1}</Label>
                        <Textarea
                            placeholder="Dejar vacío para generación automática..."
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[60px] resize-none text-sm"
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={handleSaveSlideEdit}
                                className="flex-1"
                            >
                                Guardar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingSlide(null)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <div className="p-6 border-t border-border/40">
                <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generando {generatedCount}/{slideCount}...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generar Carrusel
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
