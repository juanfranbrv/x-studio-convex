'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
    ChevronLeft,
    ChevronRight,
    Download,
    RefreshCw,
    Loader2,
    Images,
    Share2,
    DownloadCloud
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CarouselSlide } from '@/app/actions/generate-carousel'

interface CarouselCanvasPanelProps {
    slides: CarouselSlide[]
    currentIndex: number
    onSelectSlide: (index: number) => void
    onRegenerateSlide: (index: number) => void
    isRegenerating: boolean
    regeneratingIndex: number | null
    aspectRatio: '1:1' | '4:5'
}

export function CarouselCanvasPanel({
    slides,
    currentIndex,
    onSelectSlide,
    onRegenerateSlide,
    isRegenerating,
    regeneratingIndex,
    aspectRatio
}: CarouselCanvasPanelProps) {
    const currentSlide = slides[currentIndex]

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onSelectSlide(currentIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            onSelectSlide(currentIndex + 1)
        }
    }

    const handleDownloadCurrent = () => {
        if (!currentSlide?.imageUrl) return
        const link = document.createElement('a')
        link.href = currentSlide.imageUrl
        link.download = `carousel-slide-${currentIndex + 1}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDownloadAll = async () => {
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].imageUrl) {
                const link = document.createElement('a')
                link.href = slides[i].imageUrl!
                link.download = `carousel-slide-${i + 1}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                await new Promise(r => setTimeout(r, 500)) // Small delay between downloads
            }
        }
    }

    const completedSlides = slides.filter(s => s.status === 'done').length

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950">

            {/* Navigation Header */}
            {slides.length > 0 && (
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-semibold px-4">
                        {currentIndex + 1} / {slides.length}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        disabled={currentIndex === slides.length - 1}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            )}

            {/* Main Preview */}
            <div
                className={cn(
                    "relative rounded-2xl overflow-hidden shadow-2xl bg-black",
                    aspectRatio === '1:1'
                        ? "w-full max-w-lg aspect-square"
                        : "h-[60vh] aspect-[4/5]"
                )}
            >
                <AnimatePresence mode="wait">
                    {!currentSlide ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-900/50 to-orange-900/50"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center mb-6">
                                <Images className="w-12 h-12 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white/80">
                                Tu carrusel aparecerá aquí
                            </h3>
                            <p className="mt-2 text-sm text-white/50 text-center max-w-sm">
                                Define el tema y número de slides, luego presiona "Generar Carrusel"
                            </p>
                        </motion.div>
                    ) : currentSlide.status === 'generating' || (isRegenerating && regeneratingIndex === currentIndex) ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-900/90 to-orange-900/90 backdrop-blur-sm"
                        >
                            <Loader2 className="w-16 h-16 text-white animate-spin" />
                            <p className="mt-6 text-lg font-medium text-white/90">
                                {currentSlide.status === 'generating'
                                    ? `Generando slide ${currentIndex + 1}...`
                                    : 'Regenerando slide...'}
                            </p>
                        </motion.div>
                    ) : currentSlide.status === 'error' ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/50"
                        >
                            <p className="text-red-300 mb-4">Error: {currentSlide.error}</p>
                            <Button
                                variant="outline"
                                onClick={() => onRegenerateSlide(currentIndex)}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reintentar
                            </Button>
                        </motion.div>
                    ) : currentSlide.imageUrl ? (
                        <motion.img
                            key={currentSlide.imageUrl}
                            src={currentSlide.imageUrl}
                            alt={`Slide ${currentIndex + 1}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <p className="text-muted-foreground">Pendiente</p>
                        </div>
                    )}
                </AnimatePresence>

                {/* Slide Info Overlay */}
                {currentSlide && currentSlide.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white font-semibold">{currentSlide.title}</p>
                        {currentSlide.description && (
                            <p className="text-white/70 text-sm line-clamp-2">{currentSlide.description}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {slides.length > 0 && (
                <div className="flex gap-2 mt-6 overflow-x-auto max-w-full pb-2">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectSlide(index)}
                            className={cn(
                                "relative flex-shrink-0 rounded-lg overflow-hidden transition-all border-2",
                                aspectRatio === '1:1' ? "w-16 h-16" : "w-14 h-[70px]",
                                currentIndex === index
                                    ? "border-primary ring-2 ring-primary/30"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            {slide.imageUrl ? (
                                <img
                                    src={slide.imageUrl}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : slide.status === 'generating' ? (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            ) : slide.status === 'error' ? (
                                <div className="w-full h-full bg-red-500/20 flex items-center justify-center">
                                    <span className="text-red-500 text-xs">!</span>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground text-xs">{index + 1}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            {completedSlides > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 mt-6"
                >
                    <Button
                        variant="outline"
                        onClick={() => onRegenerateSlide(currentIndex)}
                        disabled={isRegenerating || !currentSlide?.imageUrl}
                    >
                        <RefreshCw className={cn("w-4 h-4 mr-2", isRegenerating && "animate-spin")} />
                        Regenerar
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDownloadCurrent}
                        disabled={!currentSlide?.imageUrl}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                    </Button>
                    {completedSlides === slides.length && (
                        <Button
                            onClick={handleDownloadAll}
                            className="bg-gradient-to-r from-pink-500 to-orange-500"
                        >
                            <DownloadCloud className="w-4 h-4 mr-2" />
                            Descargar Todo
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    )
}
