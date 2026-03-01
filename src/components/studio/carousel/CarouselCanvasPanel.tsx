'use client'

import { useState, useEffect, useRef, useMemo, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GeneratedCopyCard } from '@/components/studio/GeneratedCopyCard'
import { useToast } from '@/hooks/use-toast'
import {
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    MoreHorizontal,
    Share2,
    Images,
    Loader2,
    Fingerprint,
    ImageDown,
    SquareArrowDown,
    Bug,
    Video,
    Music
} from 'lucide-react'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import JSZip from 'jszip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { CarouselSlide } from '@/app/actions/generate-carousel'
import { DigitalStaticLoader } from '../DigitalStaticLoader'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ReferenceImageRole } from '@/lib/creation-flow-types'

interface CarouselCanvasPanelProps {
    slides: CarouselSlide[]
    currentIndex: number
    onSelectSlide: (index: number) => void
    onRegenerateSlide: (index: number, correctionPrompt?: string) => void
    onUpdateSlideScript?: (index: number, updates: { title?: string; description?: string }) => void
    isGenerating?: boolean
    isRegenerating: boolean
    regeneratingIndex: number | null
    aspectRatio: '1:1' | '4:5' | '3:4'
    caption?: string
    onCaptionChange?: (value: string) => void
    onRegenerateCaption?: () => void
    isCaptionGenerating?: boolean
    isCaptionLocked?: boolean
    onToggleCaptionLock?: () => void
    referenceImages?: Array<{ url: string; source: 'upload' | 'brandkit' }>
    referenceImageRoles?: Record<string, ReferenceImageRole>
    referenceImageMode?: 'upload' | 'brandkit' | 'generate'
    brandKitTexts?: Array<{ id: string; label: string; value: string }>
    brandName?: string
    hook?: string
    selectedLogoUrl?: string
    sessionHistory?: Array<{
        id: string
        createdAt: string
        slides: CarouselSlide[]
        caption?: string
    }>
    onSelectSessionHistory?: (id: string) => void
}

function AiPromptIcon({ className, style }: { className?: string; style?: CSSProperties }) {
    return (
        <svg
            viewBox="0 0 120 120"
            className={className}
            style={style}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect x="26" y="26" width="68" height="68" rx="12" fill="currentColor" />
            <text
                x="60"
                y="68"
                textAnchor="middle"
                fontSize="22"
                fontFamily="monospace"
                fill="white"
            >
                AI
            </text>
            <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                <line x1="8" y1="34" x2="26" y2="34" />
                <line x1="8" y1="52" x2="26" y2="52" />
                <line x1="8" y1="70" x2="26" y2="70" />
                <line x1="8" y1="88" x2="26" y2="88" />
                <line x1="94" y1="34" x2="112" y2="34" />
                <line x1="94" y1="52" x2="112" y2="52" />
                <line x1="94" y1="70" x2="112" y2="70" />
                <line x1="94" y1="88" x2="112" y2="88" />
                <line x1="34" y1="8" x2="34" y2="26" />
                <line x1="52" y1="8" x2="52" y2="26" />
                <line x1="70" y1="8" x2="70" y2="26" />
                <line x1="88" y1="8" x2="88" y2="26" />
                <line x1="34" y1="94" x2="34" y2="112" />
                <line x1="52" y1="94" x2="52" y2="112" />
                <line x1="70" y1="94" x2="70" y2="112" />
                <line x1="88" y1="94" x2="88" y2="112" />
            </g>
            <g fill="currentColor">
                <circle cx="8" cy="34" r="4.5" />
                <circle cx="8" cy="52" r="4.5" />
                <circle cx="8" cy="70" r="4.5" />
                <circle cx="8" cy="88" r="4.5" />
                <circle cx="112" cy="34" r="4.5" />
                <circle cx="112" cy="52" r="4.5" />
                <circle cx="112" cy="70" r="4.5" />
                <circle cx="112" cy="88" r="4.5" />
                <circle cx="34" cy="8" r="4.5" />
                <circle cx="52" cy="8" r="4.5" />
                <circle cx="70" cy="8" r="4.5" />
                <circle cx="88" cy="8" r="4.5" />
                <circle cx="34" cy="112" r="4.5" />
                <circle cx="52" cy="112" r="4.5" />
                <circle cx="70" cy="112" r="4.5" />
                <circle cx="88" cy="112" r="4.5" />
            </g>
        </svg>
    )
}

function StyleReferenceCorner({ url }: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [boxSize, setBoxSize] = useState({ w: 0, h: 0 })
    const [naturalSize, setNaturalSize] = useState({ w: 1, h: 1 })

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const update = () => {
            setBoxSize({ w: el.clientWidth, h: el.clientHeight })
        }

        update()
        const ro = new ResizeObserver(update)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const ratio = naturalSize.w / naturalSize.h || 1
    let renderW = boxSize.w
    let renderH = renderW / ratio
    if (renderH > boxSize.h) {
        renderH = boxSize.h
        renderW = renderH * ratio
    }

    const imgTop = Math.max(0, boxSize.h - renderH)
    return (
        <div
            ref={containerRef}
            className="absolute z-50 w-[24%] aspect-square overflow-visible -left-10 bottom-10 pointer-events-none"
        >
            <div
                className="absolute left-0 group"
                style={{ top: `${imgTop}px`, width: `${renderW}px`, height: `${renderH}px` }}
            >
                <img
                    src={url}
                    alt="Referencia de estilo"
                    className="w-full h-full object-contain object-left-bottom origin-bottom-left -rotate-[10deg] drop-shadow-[0_12px_22px_rgba(0,0,0,0.24)]"
                    onLoad={(e) => {
                        const target = e.currentTarget
                        if (target.naturalWidth && target.naturalHeight) {
                            setNaturalSize({ w: target.naturalWidth, h: target.naturalHeight })
                        }
                    }}
                />
            </div>
        </div>
    )
}

export function CarouselCanvasPanel({
    slides,
    currentIndex,
    onSelectSlide,
    onRegenerateSlide,
    onUpdateSlideScript,
    isGenerating = false,
    isRegenerating,
    regeneratingIndex,
    aspectRatio,
    caption,
    onCaptionChange,
    onRegenerateCaption,
    isCaptionGenerating = false,
    isCaptionLocked = false,
    onToggleCaptionLock,
    referenceImages = [],
    referenceImageRoles = {},
    referenceImageMode = 'upload',
    brandKitTexts = [],
    brandName,
    hook,
    selectedLogoUrl,
    sessionHistory = [],
    onSelectSessionHistory
}: CarouselCanvasPanelProps) {
    const [zoom, setZoom] = useState(110)
    const [hasManualZoom, setHasManualZoom] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [viewportHeight, setViewportHeight] = useState(800)
    const [viewportWidth, setViewportWidth] = useState(1200)
    const [isMobile, setIsMobile] = useState(false)
    const lastViewportHeightRef = useRef<number | null>(null)
    const [isEditingScript, setIsEditingScript] = useState(false)
    const [draftTitle, setDraftTitle] = useState('')
    const [draftDescription, setDraftDescription] = useState('')
    const loaderVisibleRef = useRef(false)
    const [debugOpen, setDebugOpen] = useState(false)
    const [debugSlide, setDebugSlide] = useState<CarouselSlide | null>(null)
    const [isExportingVideo, setIsExportingVideo] = useState(false)
    const [videoExportProgress, setVideoExportProgress] = useState(0)
    const [videoExportPhase, setVideoExportPhase] = useState('')
    const [slideCorrectionPrompt, setSlideCorrectionPrompt] = useState('')
    const [prevImageUrl, setPrevImageUrl] = useState<string | null>(null)
    const [wasJustGenerated, setWasJustGenerated] = useState(false)
    const { toast } = useToast()

    // Track viewport for responsive heights
    useEffect(() => {
        const updateDimensions = () => {
            setViewportHeight(window.innerHeight)
            setIsMobile(window.innerWidth < 768)
            setViewportWidth(window.innerWidth)
        }
        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const getWidthBucket = (width: number) => {
        if (width <= 1366) return '1:HD (≤1366)'
        if (width <= 1600) return '2:HD+ (1367–1600)'
        if (width <= 1920) return '3:FHD (1601–1920)'
        return '4:QHD+ (≥1921)'
    }

    const getHeightBucket = (height: number) => {
        if (height <= 760) return 'H1:≤760'
        if (height <= 900) return 'H2:761–900'
        if (height <= 1080) return 'H3:901–1080'
        return 'H4:≥1081'
    }

    useEffect(() => {
        const last = lastViewportHeightRef.current
        lastViewportHeightRef.current = viewportHeight
        if (last !== null && Math.abs(last - viewportHeight) > 40) {
            setHasManualZoom(false)
        }
    }, [viewportHeight])

    const getFooterOffset = () => {
        const slide = slides[currentIndex]
        if (isMobile) return slide?.imageUrl ? 180 : 120
        const base = slide?.imageUrl ? 700 : 400
        const maxOffset = Math.max(220, Math.round(viewportHeight * 0.45))
        return Math.min(base, maxOffset)
    }

    const getAutoZoomBoost = (height: number) => {
        if (height <= 760) return 1.25
        if (height <= 900) return 1.2
        if (height <= 1080) return 1.14
        return 1.08
    }

    const calcMaxZoom = () => {
        const [w, h] = aspectRatio.split(':').map(Number)
        const ratio = w / h
        const footerOffset = getFooterOffset()

        const availableWidth = (containerRef.current?.parentElement?.clientWidth
            ? containerRef.current.parentElement.clientWidth - (isMobile ? 12 : 32)
            : (isMobile ? window.innerWidth - 12 : 900))
        const availableHeight = Math.max(200, viewportHeight - footerOffset)

        let baseWidth
        let baseHeight
        if (ratio >= 1) {
            baseWidth = Math.min(availableWidth, availableHeight * ratio)
            baseHeight = baseWidth / ratio
        } else {
            baseHeight = Math.min(availableHeight, availableWidth / ratio)
            baseWidth = baseHeight * ratio
        }

        const fitScale = availableHeight / baseHeight
        const boost = getAutoZoomBoost(viewportHeight)
        return Math.min(Math.round(fitScale * 100 * boost), 300)
    }

    const currentSlide = slides[currentIndex]
    const currentImageUrl = currentSlide?.imageUrl || null

    useEffect(() => {
        if (hasManualZoom) return
        const autoZoom = calcMaxZoom()
        if (zoom !== autoZoom) setZoom(autoZoom)
    }, [hasManualZoom, isMobile, viewportHeight, zoom, currentSlide?.imageUrl, aspectRatio])
    const hasScript = Boolean(currentSlide && !currentSlide.imageUrl && (currentSlide.title || currentSlide.description))
    const completedSlides = slides.filter(s => s.status === 'done').length
    const isGeneratingAny = isGenerating || slides.some(s => s.status === 'generating') || isRegenerating
    const hasAnyImage = slides.some(s => Boolean(s.imageUrl))
    const isLoaderVisible = Boolean(isGeneratingAny && !hasAnyImage)

    useEffect(() => {
        if (!currentSlide) return
        setDraftTitle(currentSlide.title || '')
        setDraftDescription(currentSlide.description || '')
        setSlideCorrectionPrompt('')
        setIsEditingScript(false)
    }, [currentSlide?.index])

    useEffect(() => {
        loaderVisibleRef.current = isLoaderVisible
    }, [isLoaderVisible])

    useEffect(() => {
        if (isGenerating && currentImageUrl && currentImageUrl !== prevImageUrl) {
            setWasJustGenerated(true)
            setPrevImageUrl(currentImageUrl)
        } else if (currentImageUrl && currentImageUrl !== prevImageUrl) {
            setPrevImageUrl(currentImageUrl)
            if (wasJustGenerated) {
                const timer = setTimeout(() => setWasJustGenerated(false), 600)
                return () => clearTimeout(timer)
            }
        }
    }, [isGenerating, currentImageUrl, prevImageUrl, wasJustGenerated])

    const handleSaveScript = () => {
        if (!currentSlide) return
        const nextTitle = draftTitle.trim() || currentSlide.title
        const nextDescription = draftDescription.trim() || currentSlide.description
        onUpdateSlideScript?.(currentSlide.index, {
            title: nextTitle,
            description: nextDescription
        })
        setIsEditingScript(false)
    }

    const handleOpenDebug = () => {
        if (!currentSlide) return
        setDebugSlide(currentSlide)
        setDebugOpen(true)
    }

    const appendBrandText = (currentValue: string, value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return currentValue
        if (!currentValue.trim()) return trimmed
        return `${currentValue} ${trimmed}`
    }

    const renderBrandTextMenu = (onSelect: (value: string) => void) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Usar texto del Kit de Marca"
                >
                    <Fingerprint className="w-4 h-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Textos del Kit de Marca
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {brandKitTexts.length === 0 ? (
                    <DropdownMenuItem disabled className="text-xs text-muted-foreground italic">
                        Sin textos disponibles
                    </DropdownMenuItem>
                ) : (
                    brandKitTexts.map((option) => (
                        <DropdownMenuItem
                            key={option.id}
                            onClick={() => onSelect(option.value)}
                            className="text-xs flex flex-col items-start gap-0.5 py-2"
                        >
                            <span className="text-[9px] uppercase text-primary font-bold">{option.label}</span>
                            <span className="text-foreground truncate max-w-full">{option.value}</span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    // Navigation handlers
    const handlePrevious = () => currentIndex > 0 && onSelectSlide(currentIndex - 1)
    const handleNext = () => currentIndex < slides.length - 1 && onSelectSlide(currentIndex + 1)

    // Zoom handlers
    const handleZoomIn = () => {
        setHasManualZoom(true)
        setZoom(z => Math.min(z + 25, 300))
    }
    const handleZoomOut = () => {
        setHasManualZoom(true)
        setZoom(z => Math.max(z - 25, 25))
    }
    const handleResetZoom = () => {
        setHasManualZoom(true)
        setZoom(100)
    }

    const handleMaximizeZoom = () => {
        setHasManualZoom(true)
        setZoom(calcMaxZoom())
    }

    const handleApplySlideCorrection = () => {
        if (!currentSlide?.imageUrl) return
        const correction = slideCorrectionPrompt.trim()
        if (!correction) return
        onRegenerateSlide(currentIndex, correction)
    }

    // Download handlers
    const handleDownloadCurrent = () => {
        if (!currentSlide?.imageUrl) return
        const link = document.createElement('a')
        link.href = currentSlide.imageUrl
        link.download = `slide-${currentIndex + 1}.png`
        link.click()
    }

    const handleDownloadBundle = async () => {
        const timestamp = Date.now()
        const zip = new JSZip()

        // Add all slides to zip
        for (const [i, slide] of slides.entries()) {
            if (slide.imageUrl) {
                try {
                    const response = await fetch(slide.imageUrl)
                    const blob = await response.blob()
                    zip.file(`slide-${i + 1}.png`, blob)
                } catch (e) {
                    console.error(`Failed to fetch slide ${i + 1}:`, e)
                }
            }
        }

        // Add caption as text file
        if (caption) {
            const textContent = `CAPTION:\n${caption}`.trimEnd()
            zip.file(`caption-${timestamp}.txt`, textContent)
        }

        // Generate and download ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const zipUrl = URL.createObjectURL(zipBlob)
        const zipLink = document.createElement('a')
        zipLink.href = zipUrl
        // Format: brandname-hook-YYYY-MM-DD.zip
        const date = new Date()
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const safeBrandName = (brandName || 'carousel').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const safeHook = (hook || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 30) || 'slides'
        zipLink.download = `${safeBrandName}-${safeHook}-${dateStr}.zip`
        document.body.appendChild(zipLink)
        zipLink.click()
        document.body.removeChild(zipLink)
        URL.revokeObjectURL(zipUrl)
    }

    const getCanvasDimensions = (ratio: '1:1' | '4:5' | '3:4') => {
        if (ratio === '1:1') return { width: 1080, height: 1080 }
        if (ratio === '4:5') return { width: 1080, height: 1350 }
        return { width: 1080, height: 1440 }
    }

    const loadImageToCanvasSource = async (url: string): Promise<{ img: HTMLImageElement; revoke?: () => void }> => {
        let objectUrl: string | undefined
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`No se pudo descargar la slide (${response.status})`)
            }
            const blob = await response.blob()
            objectUrl = URL.createObjectURL(blob)
        } catch {
            objectUrl = undefined
        }

        const src = objectUrl || url

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image()
            image.crossOrigin = 'anonymous'
            image.onload = () => resolve(image)
            image.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${url}`))
            image.src = src
        })

        return {
            img,
            revoke: objectUrl ? () => URL.revokeObjectURL(objectUrl as string) : undefined
        }
    }

    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

    const pickVideoMimeType = () => {
        const candidates = [
            'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
            'video/mp4',
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm'
        ]
        return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || ''
    }

    const buildMusicTrack = async (musicUrl: string): Promise<{
        stream: MediaStream
        cleanup: () => void
        start: () => Promise<void>
    }> => {
        const audioContext = new AudioContext()
        const destination = audioContext.createMediaStreamDestination()
        const audioElement = new Audio(musicUrl)
        audioElement.crossOrigin = 'anonymous'
        audioElement.preload = 'auto'
        audioElement.loop = true
        audioElement.volume = 0.9

        const sourceNode = audioContext.createMediaElementSource(audioElement)
        sourceNode.connect(destination)

        return {
            stream: destination.stream,
            cleanup: () => {
                try {
                    audioElement.pause()
                    audioElement.src = ''
                } catch { }
                try {
                    sourceNode.disconnect()
                } catch { }
                try {
                    destination.disconnect()
                } catch { }
                void audioContext.close()
            },
            start: async () => {
                if (audioContext.state === 'suspended') {
                    await audioContext.resume()
                }
                await audioElement.play()
            }
        }
    }

    const exportCarouselVideo = async (withMusic: boolean) => {
        const completedSlidesOrdered = [...slides]
            .filter((slide) => slide.status === 'done' && Boolean(slide.imageUrl))
            .sort((a, b) => a.index - b.index)

        if (completedSlidesOrdered.length === 0) {
            toast({
                title: 'No hay slides exportables',
                description: 'Genera al menos una slide antes de exportar video.',
                variant: 'destructive'
            })
            return
        }

        const hasAllSlides = completedSlidesOrdered.length === slides.length
        if (!hasAllSlides) {
            toast({
                title: 'Faltan slides por generar',
                description: 'Para un MP4 completo, termina de generar todas las slides.',
                variant: 'destructive'
            })
            return
        }

        const musicUrl = withMusic
            ? (window.prompt('URL directa de musica (mp3/wav/m4a). Deja vacio para cancelar:') || '').trim()
            : ''

        if (withMusic && !musicUrl) return

        const mimeType = pickVideoMimeType()
        if (!mimeType) {
            toast({
                title: 'Navegador no compatible',
                description: 'Este navegador no permite grabar video del canvas.',
                variant: 'destructive'
            })
            return
        }

        const { width, height } = getCanvasDimensions(aspectRatio)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            toast({
                title: 'Error de canvas',
                description: 'No se pudo inicializar el render del video.',
                variant: 'destructive'
            })
            return
        }

        setIsExportingVideo(true)
        setVideoExportProgress(5)
        setVideoExportPhase('Preparando exportacion')
        toast({
            title: 'Exportando video',
            description: 'Estamos montando el MP4 del carrusel. Puede tardar un poco.'
        })

        const fps = 30
        const videoStream = canvas.captureStream(fps)
        let music: Awaited<ReturnType<typeof buildMusicTrack>> | null = null
        let outputStream: MediaStream = videoStream
        const chunks: BlobPart[] = []

        try {
            if (musicUrl) {
                music = await buildMusicTrack(musicUrl)
                outputStream = new MediaStream([
                    ...videoStream.getVideoTracks(),
                    ...music.stream.getAudioTracks()
                ])
            }

            const recorder = new MediaRecorder(outputStream, {
                mimeType,
                videoBitsPerSecond: 8_000_000
            })

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data)
                }
            }

            const recordDone = new Promise<void>((resolve, reject) => {
                recorder.onstop = () => resolve()
                recorder.onerror = () => reject(new Error('Fallo al grabar el video'))
            })

            setVideoExportProgress(15)
            setVideoExportPhase('Cargando slides')
            const loaded = await Promise.all(
                completedSlidesOrdered.map((slide) => loadImageToCanvasSource(slide.imageUrl as string))
            )

            recorder.start(250)
            if (music) {
                await music.start()
            }

            const totalDurationMs = loaded.reduce((sum, _slide, idx) => sum + (idx === loaded.length - 1 ? 6000 : 4000), 0)
            let renderedMs = 0
            let lastProgressUpdate = 0
            setVideoExportProgress(22)
            setVideoExportPhase('Renderizando video')

            for (let i = 0; i < loaded.length; i++) {
                const durationMs = i === loaded.length - 1 ? 6000 : 4000
                const start = performance.now()
                while (performance.now() - start < durationMs) {
                    const now = performance.now()
                    const elapsedInSlide = Math.min(durationMs, now - start)
                    if (now - lastProgressUpdate > 120) {
                        const progress = 22 + Math.round(((renderedMs + elapsedInSlide) / totalDurationMs) * 68)
                        setVideoExportProgress(Math.min(90, progress))
                        lastProgressUpdate = now
                    }
                    ctx.clearRect(0, 0, width, height)
                    ctx.drawImage(loaded[i].img, 0, 0, width, height)
                    await wait(1000 / fps)
                }
                renderedMs += durationMs
            }

            setVideoExportProgress(94)
            setVideoExportPhase('Finalizando archivo')
            recorder.stop()
            await recordDone
            loaded.forEach((item) => item.revoke?.())

            const blob = new Blob(chunks, { type: mimeType })
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            const extension = mimeType.includes('mp4') ? 'mp4' : 'webm'

            const date = new Date()
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            const safeBrandName = (brandName || 'carousel').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            const safeHook = (hook || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 30) || 'video'

            link.href = downloadUrl
            link.download = `${safeBrandName}-${safeHook}-${dateStr}.${extension}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)
            setVideoExportProgress(100)
            setVideoExportPhase('Completado')

            toast({
                title: extension === 'mp4' ? 'MP4 exportado' : 'Video exportado',
                description: extension === 'mp4'
                    ? 'Listo para publicar en Facebook/TikTok.'
                    : 'Tu navegador exporto WebM. Si quieres MP4, probamos otra estrategia de encoding.'
            })
        } catch (error) {
            console.error('Video export error:', error)
            toast({
                title: 'Error al exportar video',
                description: error instanceof Error ? error.message : 'No se pudo generar el video.',
                variant: 'destructive'
            })
        } finally {
            if (music) music.cleanup()
            setTimeout(() => {
                setVideoExportProgress(0)
                setVideoExportPhase('')
            }, 350)
            setIsExportingVideo(false)
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
                    <div className="flex flex-col items-start gap-0.5 leading-tight text-foreground/90 drop-shadow-sm">
                        <span className="text-[12px] font-medium">
                            {slides.length > 0 ? `${currentIndex + 1} / ${slides.length}` : '---'}
                        </span>
                        <span className="text-[12px] font-medium">
                            {aspectRatio}
                            <span className="opacity-60"> &middot; </span>
                            {(() => {
                                const [w, h] = aspectRatio.split(':').map(Number)
                                const ratio = w / h
                                const baseH = 600
                                const calcW = baseH * ratio
                                return `${Math.round(calcW)}x${baseH}`
                            })()}
                        </span>
                        <span className="text-[11px] font-medium">
                            {(() => {
                                return `W:${getWidthBucket(viewportWidth)}`
                            })()}
                        </span>
                        <span className="text-[11px] font-medium">
                            {(() => {
                                const footerOffset = getFooterOffset()
                                const availableHeight = Math.max(200, viewportHeight - footerOffset)
                                return `H:${getHeightBucket(viewportHeight)} (${Math.round(availableHeight)}px)`
                            })()}
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="hidden md:flex pointer-events-auto glass-panel text-muted-foreground transition-all duration-300 hover:text-foreground flex-col items-center gap-2 rounded-2xl px-2 py-2 absolute right-9 top-4">
                    <div className="flex flex-col items-center border-b border-white/10 pb-2 gap-1">
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
                            <AspectRatioOutlinedIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownloadCurrent} disabled={!currentSlide?.imageUrl} title="Descargar slide actual">
                        <ImageDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownloadBundle} disabled={completedSlides === 0} title="Descargar ZIP (carrusel + caption)">
                        <SquareArrowDown className="w-4 h-4" />
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
                            <DropdownMenuItem onClick={() => exportCarouselVideo(false)} disabled={isExportingVideo || completedSlides === 0}>
                                <Video className={cn("w-4 h-4 mr-2", isExportingVideo && "animate-pulse")} />
                                Exportar video (4s / 6s)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportCarouselVideo(true)} disabled={isExportingVideo || completedSlides === 0}>
                                <Music className={cn("w-4 h-4 mr-2", isExportingVideo && "animate-pulse")} />
                                Exportar video con musica
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
                isMobile ? "pt-5 px-4" : "pt-5 px-6"
            )}>
                {/* Canvas Scaling logic matching Image Canvas */}
                <div
                    className="shrink-0 flex items-start justify-center w-full"
                    style={(() => {
                        const [w, h] = aspectRatio.split(':').map(Number)
                        const ratio = w / h
                        const footerOffset = getFooterOffset()
                        const availableHeight = Math.max(200, viewportHeight - footerOffset)
                        const availableWidth = (containerRef.current?.parentElement?.clientWidth
                            ? containerRef.current.parentElement.clientWidth - (isMobile ? 12 : 32)
                            : (isMobile ? window.innerWidth - 12 : 900))

                        const canvasWidth = Math.min(availableWidth, availableHeight * ratio)
                        const canvasHeight = canvasWidth / ratio
                        return { height: `${canvasHeight * (zoom / 100)}px` }
                    })()}
                >
                    <div
                        ref={containerRef}
                        className="canvas-panel relative shadow-aero-lg ring-1 ring-black/10 dark:ring-white/20 transition-all duration-300 ease-out flex items-center justify-center bg-transparent bg-dot group shrink-0 rounded-aero overflow-visible"
                        style={(() => {
                            const [w, h] = aspectRatio.split(':').map(Number)
                            const ratio = w / h
                            const footerOffset = getFooterOffset()
                            const availableHeight = Math.max(200, viewportHeight - footerOffset)
                            const availableWidth = (containerRef.current?.parentElement?.clientWidth
                                ? containerRef.current.parentElement.clientWidth - (isMobile ? 12 : 32)
                                : (isMobile ? window.innerWidth - 12 : 900))

                            const canvasWidth = Math.min(availableWidth, availableHeight * ratio)
                            const canvasHeight = canvasWidth / ratio

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
                            {isLoaderVisible && (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 z-50 overflow-hidden rounded-sm shadow-lg ring-1 ring-white/10"
                                >
                                    <DigitalStaticLoader />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Side Navigation */}
                        {slides.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 z-40 h-10 w-10 rounded-full",
                                        "bg-background/80 backdrop-blur border border-border shadow-sm"
                                    )}
                                    aria-label="Slide anterior"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleNext}
                                    disabled={currentIndex === slides.length - 1}
                                    className={cn(
                                        "absolute right-3 top-1/2 -translate-y-1/2 z-40 h-10 w-10 rounded-full",
                                        "bg-background/80 backdrop-blur border border-border shadow-sm"
                                    )}
                                    aria-label="Slide siguiente"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </>
                        )}

                        {/* PREVIEW OVERLAYS (igual módulo imagen) */}
                        {!currentSlide?.imageUrl && (
                            <>
                                {(() => {
                                    const allImages = referenceImages.map((item, idx) => ({
                                        ...item,
                                        key: `${item.source}-${idx}`,
                                        role: referenceImageRoles?.[item.url] || 'content'
                                    }))

                                    const contentImages = allImages.filter((item) => item.role === 'content' || item.role === 'style_content')
                                    const styleImages = allImages.filter((item) => item.role === 'style' || item.role === 'style_content')
                                    const auxLogos = allImages.filter((item) => item.role === 'logo')
                                    const hasAiPromptReference = referenceImageMode === 'generate'
                                    const contentPreviewImages = contentImages.slice(0, 6)

                                    const renderStrip = (
                                        images: Array<{ url: string; source: 'upload' | 'brandkit'; key: string }>,
                                        positionClass: string
                                    ) => {
                                        if (images.length === 0) return null
                                        return (
                                            <div className={cn('absolute z-20 flex gap-2 flex-wrap max-w-[220px]', positionClass)}>
                                                {images.slice(0, 6).map((item, idx) => (
                                                    <div key={item.key} className="relative group">
                                                        <img
                                                            src={item.url}
                                                            alt={`Logo Aux ${idx + 1}`}
                                                            className="object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.28)]"
                                                            style={{ width: 'clamp(28px, 4.5cqw, 46px)', height: 'clamp(28px, 4.5cqw, 46px)' }}
                                                        />
                                                    </div>
                                                ))}
                                                {images.length > 6 && (
                                                    <div className="w-11 h-14 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-white/20">
                                                        +{images.length - 6}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }

                                    return (
                                        <>
                                            {styleImages.length > 0 && <StyleReferenceCorner url={styleImages[0].url} />}
                                            {renderStrip(auxLogos, 'bottom-6 right-4')}
                                            {(hasAiPromptReference || contentPreviewImages.length > 0) && (
                                                <div className="absolute top-2 right-4 z-40 flex flex-col items-end gap-2">
                                                    {hasAiPromptReference && (
                                                        <div className="relative group">
                                                            <AiPromptIcon
                                                                className="text-primary drop-shadow-[0_10px_18px_rgba(0,0,0,0.26)]"
                                                                style={{ width: 'var(--canvas-ai-size)', height: 'var(--canvas-ai-size)' }}
                                                            />
                                                        </div>
                                                    )}
                                                    {contentPreviewImages.map((item, idx) => (
                                                        <div key={item.key} className="relative group">
                                                            <img
                                                                src={item.url}
                                                                alt={`Contenido ${idx + 1}`}
                                                                className="object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.28)]"
                                                                style={{ width: 'clamp(60px, 11cqw, 112px)', height: 'clamp(60px, 11cqw, 112px)' }}
                                                            />
                                                        </div>
                                                    ))}
                                                    {contentImages.length > 6 && (
                                                        <div className="min-w-7 h-7 px-2 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-white/20">
                                                            +{contentImages.length - 6}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )
                                })()}

                                {selectedLogoUrl && (
                                    <div className="absolute top-1 left-4 z-20 group">
                                        <img
                                            src={selectedLogoUrl}
                                            alt="Logo"
                                            className="object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.26)]"
                                            style={{ width: 'var(--canvas-logo-size)', height: 'var(--canvas-logo-size)' }}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Debug Prompt Trigger (Top Right) */}
                        {currentSlide?.imageUrl && (
                            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleOpenDebug}
                                    className="h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border shadow-sm hover:shadow-md transition-all hover:scale-[1.03] active:scale-[0.98]"
                                    title="Ver prompt y referencias"
                                >
                                    <Bug className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

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
                            <div className="w-full h-full flex items-center justify-center">
                                <motion.div
                                    key={currentSlide.imageUrl}
                                    initial={wasJustGenerated ? { opacity: 0, filter: 'blur(20px)' } : { opacity: 1, filter: 'blur(0px)' }}
                                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                                    transition={wasJustGenerated ? {
                                        duration: 0.3,
                                        ease: 'easeOut',
                                        filter: { duration: 0.4 },
                                        opacity: { duration: 0.2 }
                                    } : {
                                        duration: 0.15
                                    }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <img
                                        src={currentSlide.imageUrl}
                                        alt={`Slide ${currentIndex + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </div>
                        ) : hasScript ? (
                            <div className="w-full h-full flex items-center justify-center p-10">
                                <div className="carousel-script-preview w-full max-w-md rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-6 text-center shadow-lg space-y-3">
                                    <p className="uppercase tracking-widest text-muted-foreground" style={{ fontSize: 'var(--cs-label)' }}>
                                        Guion previo
                                    </p>
                                    {isEditingScript ? (
                                        <div className="space-y-3 text-left">
                                            <div className="relative">
                                                <Input
                                                    value={draftTitle}
                                                    onChange={(e) => setDraftTitle(e.target.value)}
                                                    placeholder="Título del slide"
                                                    className="text-sm pr-9"
                                                    disabled={isGeneratingAny}
                                                />
                                                {brandKitTexts.length > 0 && renderBrandTextMenu((value) =>
                                                    setDraftTitle(prev => appendBrandText(prev, value))
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Textarea
                                                    value={draftDescription}
                                                    onChange={(e) => setDraftDescription(e.target.value)}
                                                    placeholder="Descripción del slide"
                                                    className="min-h-[90px] text-sm resize-none pr-9"
                                                    disabled={isGeneratingAny}
                                                />
                                                {brandKitTexts.length > 0 && renderBrandTextMenu((value) =>
                                                    setDraftDescription(prev => appendBrandText(prev, value))
                                                )}
                                            </div>
                                            {brandKitTexts.length > 0 && (
                                                <div className="flex justify-start">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors gap-2"
                                                            >
                                                                <Fingerprint className="w-3.5 h-3.5 text-primary" />
                                                                Textos de Marca
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" className="w-72 max-h-80 overflow-y-auto">
                                                            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                                Selecciona un texto del Kit de Marca
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            {brandKitTexts.map((option) => (
                                                                <DropdownMenuItem
                                                                    key={`button-${option.id}`}
                                                                    onClick={() => setDraftDescription(prev => appendBrandText(prev, option.value))}
                                                                    className="text-xs flex flex-col items-start gap-0.5 py-2"
                                                                >
                                                                    <span className="text-[9px] uppercase text-primary font-bold">{option.label}</span>
                                                                    <span className="text-foreground truncate max-w-full">{option.value}</span>
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={handleSaveScript} disabled={isGeneratingAny}>
                                                    Guardar
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => setIsEditingScript(false)} disabled={isGeneratingAny}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setIsEditingScript(true)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault()
                                                        setIsEditingScript(true)
                                                    }
                                                }}
                                                className="space-y-2 cursor-text"
                                                aria-label="Editar guion"
                                                title="Haz clic para editar"
                                            >
                                                <h3 className="font-semibold text-foreground" style={{ fontSize: 'var(--cs-title)', lineHeight: 1.2 }}>
                                                    {currentSlide?.title || `Slide ${currentIndex + 1}`}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'var(--cs-body)' }}>
                                                    {currentSlide?.description || 'Sin descripcion'}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setIsEditingScript(true)}
                                                className="mt-2"
                                                style={{ fontSize: 'var(--cs-button)' }}
                                            >
                                                Editar guion
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted-foreground opacity-30 flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span className="text-xs uppercase tracking-tighter font-mono">Pendiente</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lower Navigation & Thumbnails */}
                <div className="mt-6 w-full flex flex-col items-center gap-4 pb-6">
                    {/* Thumbnail Strip */}
                    {slides.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto max-w-full pb-3 pt-1 px-2 no-scrollbar">
                            {slides.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSelectSlide(index)}
                                    className={cn(
                                        "relative flex-shrink-0 rounded-[18px] p-1.5 transition-all duration-300",
                                        "bg-white/60 dark:bg-white/10 backdrop-blur border border-border/60",
                                        aspectRatio === '1:1' ? "w-16 h-16" : "w-14 h-20",
                                        currentIndex === index
                                            ? "ring-2 ring-primary/70 shadow-[0_0_12px_hsl(var(--primary)/0.25)] z-10"
                                            : "opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {/* Phone skin notch */}
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded-full bg-black/10 dark:bg-white/15" />
                                    <div
                                        className={cn(
                                            "relative w-full h-full rounded-[14px] overflow-hidden bg-muted/60 border border-black/5",
                                            aspectRatio === '1:1' ? "aspect-square" : "aspect-[3/4]"
                                        )}
                                    >
                                        {slide.imageUrl ? (
                                            <img src={slide.imageUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <span className="text-[10px] font-mono opacity-50">{index + 1}</span>
                                            </div>
                                        )}
                                    </div>
                                    {slide.status === 'generating' && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-[18px]">
                                            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Caption Card - Integrated with preview scroll */}
                {caption && (
                    <div className="w-full max-w-[800px] shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 z-10 pb-8">
                        <GeneratedCopyCard
                            copy={caption}
                            hashtags={[]}
                            onRegenerate={onRegenerateCaption}
                            isLoading={isCaptionGenerating}
                            isLocked={isCaptionLocked}
                            onToggleLock={onToggleCaptionLock}
                            onCopyChange={(val) => onCaptionChange?.(val)}
                        />
                    </div>
                )}

                {sessionHistory.length > 0 && (
                    <div className="w-full max-w-[800px] shrink-0 pb-4">
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Variaciones de la sesión</p>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {sessionHistory.map((item) => {
                                    const thumb = item.slides.find((s) => s.imageUrl)?.imageUrl
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => onSelectSessionHistory?.(item.id)}
                                            className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-border hover:border-primary/60 transition-colors bg-muted/40"
                                            title={`Carrusel ${new Date(item.createdAt).toLocaleTimeString()}`}
                                        >
                                            {thumb ? (
                                                <img src={thumb} alt="Variación carrusel" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">N/A</div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {currentSlide?.imageUrl && (
                    <div className="w-full max-w-[800px] shrink-0 pb-8">
                        <div className="flex items-end gap-2">
                            <Textarea
                                placeholder="Describe los cambios para esta diapositiva..."
                                value={slideCorrectionPrompt}
                                onChange={(e) => setSlideCorrectionPrompt(e.target.value)}
                                className="min-h-[44px] max-h-[120px] resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleApplySlideCorrection()
                                    }
                                }}
                            />
                            <Button
                                onClick={handleApplySlideCorrection}
                                disabled={isGeneratingAny || !slideCorrectionPrompt.trim()}
                                className="h-[44px] whitespace-nowrap"
                            >
                                Realizar corrección
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={debugOpen} onOpenChange={setDebugOpen}>
                <DialogContent
                    className="flex flex-col h-[calc(100vh-3rem)] top-6 bottom-6 left-auto right-6 translate-x-0 translate-y-0"
                    style={{ width: '620px', maxWidth: 'calc(100vw - 3rem)' }}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Debug de prompt - Slide {debugSlide ? debugSlide.index + 1 : currentIndex + 1}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 overflow-y-auto pr-1">
                        <div className="space-y-3">
                            <div className="text-sm uppercase tracking-wider text-muted-foreground">
                                Imágenes enviadas en la llamada
                            </div>
                            {debugSlide?.debugReferences && debugSlide.debugReferences.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {debugSlide.debugReferences.map((ref, idx) => (
                                        <div key={`${ref.type}-${idx}`} className="w-24 space-y-1">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted/50">
                                                <img
                                                    src={ref.url}
                                                    alt={ref.label || ref.type}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {ref.label || ref.type}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    No se enviaron imágenes en esta llamada.
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm uppercase tracking-wider text-muted-foreground">
                                Prompt enviado al modelo
                            </div>
                            <div className="flex-1 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
                                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground">
                                    {debugSlide?.debugPrompt || 'No hay prompt registrado para este slide.'}
                                </pre>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isExportingVideo} onOpenChange={() => { }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generando video del carrusel</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {videoExportPhase || 'Procesando'}
                        </p>
                        <div className="grid grid-cols-10 gap-1.5">
                            {Array.from({ length: 30 }).map((_, idx) => {
                                const threshold = Math.round(((idx + 1) / 30) * 100)
                                const active = videoExportProgress >= threshold
                                return (
                                    <div
                                        key={`video-progress-square-${idx}`}
                                        className={cn(
                                            'h-3 rounded-sm transition-all duration-200',
                                            active ? 'bg-primary shadow-sm' : 'bg-muted'
                                        )}
                                    />
                                )
                            })}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progreso</span>
                            <span className="font-mono">{videoExportProgress}%</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}


