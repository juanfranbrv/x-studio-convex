'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ChevronLeft,
    ChevronRight,
    Download,
    RefreshCw,
    Maximize,
    ZoomIn,
    ZoomOut,
    MoreHorizontal,
    Share2,
    DownloadCloud,
    Images,
    X,
    Loader2
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { CarouselSlide } from '@/app/actions/generate-carousel'
import { DigitalStaticLoader } from '../DigitalStaticLoader'

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
    const [zoom, setZoom] = useState(100)
    const containerRef = useRef<HTMLDivElement>(null)
    const [viewportHeight, setViewportHeight] = useState(800)
    const [isMobile, setIsMobile] = useState(false)

    // Track viewport for responsive heights
    useEffect(() => {
        const updateDimensions = () => {
            setViewportHeight(window.innerHeight)
            setIsMobile(window.innerWidth < 768)
        }
        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const currentSlide = slides[currentIndex]
    const completedSlides = slides.filter(s => s.status === 'done').length
    const isGeneratingAny = slides.some(s => s.status === 'generating') || isRegenerating

    // Navigation handlers
    const handlePrevious = () => currentIndex > 0 && onSelectSlide(currentIndex - 1)
    const handleNext = () => currentIndex < slides.length - 1 && onSelectSlide(currentIndex + 1)

    // Zoom handlers
    const handleZoomIn = () => setZoom(z => Math.min(z + 25, 300))
    const handleZoomOut = () => setZoom(z => Math.max(z - 25, 25))
    const handleResetZoom = () => setZoom(100)

    const handleMaximizeZoom = () => {
        if (!containerRef.current) return
        const [w, h] = aspectRatio.split(':').map(Number)
        const ratio = w / h

        const hBuffer = isMobile ? 20 : 60
        const availableWidth = containerRef.current.parentElement?.clientWidth
            ? containerRef.current.parentElement.clientWidth - hBuffer
            : (isMobile ? window.innerWidth - 20 : 800)

        const vOffset = isMobile ? 240 : 320
        const targetHeight = viewportHeight - vOffset

        // Match the base dimension logic in render
        const footerOffset = isMobile ? 300 : 450
        const availableHeight = Math.max(200, viewportHeight - footerOffset)

        let baseWidth, baseHeight
        if (ratio >= 1) {
            baseWidth = Math.min(availableWidth, availableHeight * ratio)
            baseHeight = baseWidth / ratio
        } else {
            baseHeight = Math.min(availableHeight, availableWidth * ratio)
            baseWidth = baseHeight / ratio
        }

        const zoomW = (availableWidth / baseWidth) * 100 * 0.95
        const zoomH = (targetHeight / baseHeight) * 100 * 0.95
        setZoom(Math.min(Math.round(Math.min(zoomW, zoomH)), 300))
    }

    // Download handlers
    const handleDownloadCurrent = () => {
        if (!currentSlide?.imageUrl) return
        const link = document.createElement('a')
        link.href = currentSlide.imageUrl
        link.download = `slide-${currentIndex + 1}.png`
        link.click()
    }

    const handleDownloadAll = async () => {
        for (const [i, slide] of slides.entries()) {
            if (slide.imageUrl) {
                const link = document.createElement('a')
                link.href = slide.imageUrl
                link.download = `slide-${i + 1}.png`
                link.click()
                await new Promise(r => setTimeout(r, 500))
            }
        }
    }

    const effectiveZoom = useMemo(() => {
        return zoom // Simplified for carousel as we don't have the same baseScale complexity yet
    }, [zoom])

    return (
        <div className="flex-1 flex flex-col h-full relative isolate overflow-x-hidden p-0">
            {/* Header Overlay - Balanced with Image Canvas */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-start justify-between p-4 z-40 pointer-events-none">
                {/* Left: Metadata */}
                <div className="pointer-events-auto flex items-center gap-2 pt-1">
                    <Badge variant="outline" className="text-[10px] h-7 gap-2 bg-background/80 backdrop-blur-sm border-border shadow-sm px-3 rounded-full">
                        <span className="font-bold text-muted-foreground uppercase tracking-wider">Slide</span>
                        <div className="w-px h-3 bg-border" />
                        <span className="font-mono">{slides.length > 0 ? `${currentIndex + 1} / ${slides.length}` : '---'}</span>
                        <div className="w-px h-3 bg-border" />
                        <span className="text-primary font-semibold">{aspectRatio}</span>
                    </Badge>
                </div>

                {/* Center: Quick Nav */}
                {slides.length > 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center glass-panel rounded-full p-1 shadow-sm mt-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={handleNext}
                            disabled={currentIndex === slides.length - 1}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="hidden md:flex pointer-events-auto items-center gap-1 glass-panel rounded-full px-3 py-1.5 text-muted-foreground">
                    <div className="flex items-center gap-1 mr-2 border-r border-white/10 pr-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-[10px] font-mono w-10 text-center cursor-pointer" onClick={handleResetZoom}>
                            {zoom}%
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 ml-1" onClick={handleMaximizeZoom}>
                            <Maximize className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownloadCurrent} disabled={!currentSlide?.imageUrl}>
                        <Download className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-panel border-white/10">
                            <DropdownMenuItem onClick={() => onRegenerateSlide(currentIndex)} disabled={!currentSlide || isRegenerating}>
                                <RefreshCw className={cn("w-4 h-4 mr-2", isRegenerating && "animate-spin")} />
                                Regenerar slide actual
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadAll} disabled={completedSlides < slides.length}>
                                <DownloadCloud className="w-4 h-4 mr-2" />
                                Descargar Carrusel completo
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartir carrusel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 relative flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden thin-scrollbar",
                isMobile ? "pt-20 px-4" : "pt-24 px-6"
            )}>
                {/* Canvas Scaling logic matching Image Canvas */}
                <div
                    className="shrink-0 flex items-start justify-center w-full"
                    style={(() => {
                        const [w, h] = aspectRatio.split(':').map(Number)
                        const ratio = w / h
                        const footerOffset = isMobile ? 300 : 450
                        const availableHeight = Math.max(200, viewportHeight - footerOffset)
                        const availableWidth = containerRef.current?.parentElement?.clientWidth || 800

                        let canvasHeight
                        if (ratio >= 1) {
                            const canvasWidth = Math.min(availableWidth, availableHeight * ratio)
                            canvasHeight = canvasWidth / ratio
                        } else {
                            canvasHeight = Math.min(availableHeight, availableWidth * ratio)
                        }
                        return { height: `${canvasHeight * (zoom / 100)}px` }
                    })()}
                >
                    <div
                        ref={containerRef}
                        className="relative shadow-aero-lg ring-1 ring-black/10 dark:ring-white/20 transition-all duration-300 ease-out flex items-center justify-center bg-transparent bg-dot group shrink-0 rounded-aero overflow-hidden"
                        style={(() => {
                            const [w, h] = aspectRatio.split(':').map(Number)
                            const ratio = w / h
                            const footerOffset = isMobile ? 300 : 450
                            const availableHeight = Math.max(200, viewportHeight - footerOffset)
                            const availableWidth = 800 // Default reference

                            let canvasWidth, canvasHeight
                            if (ratio >= 1) {
                                canvasWidth = Math.min(availableWidth, availableHeight * ratio)
                                canvasHeight = canvasWidth / ratio
                            } else {
                                canvasHeight = Math.min(availableHeight, availableWidth * ratio)
                                canvasWidth = canvasHeight / ratio
                            }

                            return {
                                width: `${canvasWidth}px`,
                                height: `${canvasHeight}px`,
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
                            }
                        })()}
                    >
                        <AnimatePresence mode="wait">
                            {/* Loading Overlay */}
                            {(currentSlide?.status === 'generating' || (isRegenerating && regeneratingIndex === currentIndex)) && (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm"
                                >
                                    <DigitalStaticLoader />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Content */}
                        {!currentSlide ? (
                            <div className="flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 dark:bg-zinc-800/50 shadow-inner flex items-center justify-center mb-6">
                                    <Images className="w-10 h-10 opacity-20" />
                                </div>
                                <h3 className="text-lg font-semibold opacity-80">Empieza tu creación</h3>
                                <p className="text-sm opacity-50 max-w-[200px] mt-1">Configura los detalles en el panel derecho para generar slides</p>
                            </div>
                        ) : currentSlide.status === 'error' ? (
                            <div className="flex flex-col items-center justify-center bg-destructive/10 p-8 rounded-xl border border-destructive/20">
                                <p className="text-destructive font-medium mb-4">{currentSlide.error || 'Error en este slide'}</p>
                                <Button variant="outline" size="sm" onClick={() => onRegenerateSlide(currentIndex)}>
                                    <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
                                </Button>
                            </div>
                        ) : currentSlide.imageUrl ? (
                            <motion.img
                                key={currentSlide.imageUrl}
                                src={currentSlide.imageUrl}
                                alt={`Slide ${currentIndex + 1}`}
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-muted-foreground opacity-30 flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span className="text-xs uppercase tracking-tighter font-mono">Pendiente</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lower Navigation & Thumbnails */}
                <div className="mt-12 w-full flex flex-col items-center gap-8 pb-12">
                    {/* Thumbnail Strip */}
                    {slides.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto max-w-full pb-4 px-4 no-scrollbar">
                            {slides.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSelectSlide(index)}
                                    className={cn(
                                        "relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 border-2",
                                        aspectRatio === '1:1' ? "w-20 h-20" : "w-16 h-20",
                                        currentIndex === index
                                            ? "border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] scale-110 z-10"
                                            : "border-transparent opacity-60 hover:opacity-100 scale-100"
                                    )}
                                >
                                    {slide.imageUrl ? (
                                        <img src={slide.imageUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <span className="text-[10px] font-mono opacity-50">{index + 1}</span>
                                        </div>
                                    )}
                                    {slide.status === 'generating' && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


