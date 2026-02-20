'use client'

import { useState, useEffect, useRef, useMemo, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import JSZip from 'jszip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { TemplateSelectorModal, Template } from './TemplateSelectorModal'
import { ContextElement } from '@/app/image/page'
import { Layout, X, Image as ImageIcon, Type, FileText, Link2, AtSign, Minus, Plus, ImagePlus, SquareArrowDown, ImageDown, Bug, Sparkles, Paintbrush } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { DigitalStaticLoader } from './DigitalStaticLoader'
import { GeneratedCopyCard } from './GeneratedCopyCard'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useUI } from '@/contexts/UIContext'
import { generateSocialPost } from '@/app/actions/generate-social-post'
import { WireframeRenderer } from './previews/WireframeRenderer'
import { FloatingAssistance } from './creation-flow/FloatingAssistance'
import { ALL_IMAGE_LAYOUTS, GenerationState, TextAsset } from '@/lib/creation-flow-types'

export interface Generation {
    id: string
    image_url: string
    created_at: string
}

import { GenerateButton } from './creation-flow/GenerateButton'
import { TextLayersEditor } from './TextLayersEditor'

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

function renderLayoutIcon(svgIcon: string) {
    const trimmed = (svgIcon || '').trim()
    if (!trimmed) return null

    if (trimmed.startsWith('<svg')) {
        return (
            <div
                className="w-[85%] h-[85%] text-primary/25 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                dangerouslySetInnerHTML={{ __html: trimmed }}
            />
        )
    }

    return (
        <span
            className="material-symbols-outlined text-primary/25 leading-none"
            style={{ fontSize: 'clamp(240px, 86cqw, 1500px)' }}
        >
            {trimmed}
        </span>
    )
}

function StyleReferenceCorner({
    url,
    onRemove,
}: {
    url: string
    onRemove?: () => void
}) {
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
            className="absolute z-50 w-[24%] aspect-square overflow-visible -left-10 bottom-10 pointer-events-auto"
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
                {null}
                {onRemove && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemove()
                        }}
                        className="absolute top-1 right-1 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg z-50 pointer-events-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                        style={{ width: 'clamp(16px, 2.8cqw, 22px)', height: 'clamp(16px, 2.8cqw, 22px)' }}
                    >
                        <X style={{ width: 'clamp(9px, 1.8cqw, 13px)', height: 'clamp(9px, 1.8cqw, 13px)' }} />
                    </Button>
                )}
            </div>
        </div>
    )
}

export interface CanvasPanelProps {
    currentImage: string | null
    generations: Generation[]
    onSelectGeneration: (gen: Generation) => void
    selectedContext: ContextElement[]
    onRemoveContext: (id: string, type: 'style') => void
    onAddContext?: (element: ContextElement) => void
    draggedElement?: ContextElement | null
    isGenerating: boolean
    // Creation props
    creationState: GenerationState
    // Edit props
    editPrompt: string
    onEditPromptChange: (value: string) => void
    canGenerate: boolean
    onUnifiedAction: () => Promise<void>
    // New unified setters
    onCaptionChange?: (value: string) => void
    onHeadlineChange?: (value: string) => void
    onCtaChange?: (value: string) => void
    onCtaUrlChange?: (value: string) => void
    onCustomTextChange?: (id: string, value: string) => void
    // New handlers for text assets
    onAddTextAsset?: (asset: TextAsset) => void
    onRemoveTextAsset?: (id: string) => void
    onUpdateTextAsset?: (id: string, value: string) => void
    // Original props that were not removed but are still used

    aspectRatio?: string
    // Hide prompt area (when using external PromptCard)
    hidePromptArea?: boolean
    onSelectLogo?: (id: string | null) => void
    onClearUploadedImage?: () => void
    onRemoveReferenceImage?: (url: string) => void
    onDisableAiPromptReference?: () => void
    onOpenPromptDebug?: () => void
    showPromptDebugTrigger?: boolean
    layoutIconOverrides?: Record<string, string>
}

export function CanvasPanel({
    currentImage,
    generations = [],
    onSelectGeneration,
    selectedContext = [],
    onRemoveContext,
    onAddContext,
    draggedElement,
    isGenerating,
    aspectRatio = "4:5",
    creationState,
    editPrompt,
    onEditPromptChange,
    canGenerate,
    onUnifiedAction,

    onCaptionChange,
    onHeadlineChange,
    onCtaChange,
    onCtaUrlChange,
    onCustomTextChange,
    onAddTextAsset,
    onRemoveTextAsset,
    onUpdateTextAsset,
    hidePromptArea = false,
    onSelectLogo,
    onClearUploadedImage,
    onRemoveReferenceImage,
    onDisableAiPromptReference,
    onOpenPromptDebug,
    showPromptDebugTrigger = false,
    layoutIconOverrides = {},
}: CanvasPanelProps) {
    const { t } = useTranslation()
    const { activeBrandKit } = useBrandKit()
    const { panelPosition, assistanceEnabled } = useUI()
    const [zoom, setZoom] = useState(100)
    const [hasManualZoom, setHasManualZoom] = useState(false)
    const lastViewportHeightRef = useRef<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragActive, setIsDragActive] = useState(false)
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
    const [viewportHeight, setViewportHeight] = useState(800) // Default fallback
    const [viewportWidth, setViewportWidth] = useState(1200)
    const [isMobile, setIsMobile] = useState(false)
    const selectedLogoUrl = useMemo(() => {
        if (!creationState.selectedLogoId || !activeBrandKit?.logos?.length) return null
        const found = activeBrandKit.logos.find((logo: any, idx: number) =>
            logo?._id === creationState.selectedLogoId || `logo-${idx}` === creationState.selectedLogoId
        )
        if (!found) return null
        return typeof found === 'string' ? found : found.url
    }, [activeBrandKit?.logos, creationState.selectedLogoId])

    const selectedLayoutIcon = useMemo(() => {
        const layoutId = creationState.selectedLayout
        if (!layoutId) return null
        const override = layoutIconOverrides[layoutId]
        if (override && override !== 'Layout') return override
        const layout = ALL_IMAGE_LAYOUTS.find((item) => item.id === layoutId)
        const icon = layout?.svgIcon || null
        if (!icon || icon === 'Layout') return null
        return icon
    }, [creationState.selectedLayout, layoutIconOverrides])

    // Track viewport height for responsive canvas
    useEffect(() => {
        const updateHeight = () => {
            setViewportHeight(window.innerHeight)
            setIsMobile(window.innerWidth < 768)
            setViewportWidth(window.innerWidth)
        }
        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [])

    const getWidthBucket = (width: number) => {
        if (width <= 1366) return '1:HD (<=1366)'
        if (width <= 1600) return '2:HD+ (1367-1600)'
        if (width <= 1920) return '3:FHD (1601-1920)'
        return '4:QHD+ (>=1921)'
    }

    const getHeightBucket = (height: number) => {
        if (height <= 760) return 'H1:<=760'
        if (height <= 900) return 'H2:761-900'
        if (height <= 1080) return 'H3:901-1080'
        return 'H4:>=1081'
    }


    const getFooterOffset = () => {
        if (isMobile) return currentImage ? 180 : 120
        const base = currentImage ? 700 : 400
        const maxOffset = Math.max(220, Math.round(viewportHeight * 0.45))
        return Math.min(base, maxOffset)
    }

    const getAutoZoomBoost = (height: number) => {
        if (height <= 760) return 1.25
        if (height <= 900) return 1.2
        if (height <= 1080) return 1.14
        return 1.08
    }

    // Calculate effective zoom (base scale * manual zoom)
    const effectiveZoom = useMemo(() => {
        const [w, h] = aspectRatio.split(':').map(Number);
        const ratio = w / h;
        const baseHeight = 600;

        // Smarter dimension calculation matching the container style
        // We use the same offsets to ensure indicator matches reality
        const footerOffset = getFooterOffset();
        const availableHeight = Math.max(200, viewportHeight - footerOffset);
        const padding = isMobile ? 0 : 48;
        const availableWidth = (containerRef.current?.parentElement?.clientWidth
            ? containerRef.current.parentElement.clientWidth - padding
            : (isMobile ? window.innerWidth : 800));

        let canvasHeight;
        if (ratio >= 1) {
            const maxWidth = Math.min(availableWidth, availableHeight * ratio);
            canvasHeight = maxWidth / ratio;
        } else {
            canvasHeight = Math.min(availableHeight, availableWidth / ratio);
        }

        const baseScale = (canvasHeight / baseHeight) * 100;
        return Math.round(baseScale * (zoom / 100));
    }, [aspectRatio, viewportHeight, zoom, currentImage, isMobile])

    // Animation & Reveal States
    const [isRevealing, setIsRevealing] = useState(false)
    const [wasJustGenerated, setWasJustGenerated] = useState(false)
    const [prevImage, setPrevImage] = useState<string | null>(null)

    // Track last used prompt for regeneration
    const [lastUsedPrompt, setLastUsedPrompt] = useState('')

    // Copy Generation State
    const [generatedCopy, setGeneratedCopy] = useState<string | null>(null)
    const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
    const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
    const [isCopyLocked, setIsCopyLocked] = useState(false) // New state for locking copy

    // Build brand kit text options for the dropdown
    const brandKitTexts = useMemo(() => {
        if (!activeBrandKit) return []
        const options: { id: string; label: string; value: string; type: 'url' | 'tagline' | 'cta' | 'hook' | 'custom' }[] = []

        // Tagline
        if (activeBrandKit.tagline) {
            options.push({ id: 'bk-tagline', label: 'Tagline', value: activeBrandKit.tagline, type: 'tagline' })
        }
        // Marketing Hooks
        if (activeBrandKit.text_assets?.marketing_hooks) {
            activeBrandKit.text_assets.marketing_hooks.forEach((hook, idx) => {
                options.push({ id: `bk-hook-${idx}`, label: `Hook ${idx + 1}`, value: hook, type: 'hook' })
            })
        }
        return options
    }, [activeBrandKit])

    const handleZoomIn = () => {
        setHasManualZoom(true)
        setZoom((z) => Math.min(z + 25, 300))
    }
    const handleZoomOut = () => {
        setHasManualZoom(true)
        setZoom((z) => Math.max(z - 25, 25))
    }
    const handleResetZoom = () => {
        setHasManualZoom(true)
        setZoom(100)
    }

    const handleMaximizeZoom = () => {
        setHasManualZoom(true)
        const newZoom = calcMaxZoom();
        setZoom(newZoom);
    }

    const calcMaxZoom = () => {
        const [w, h] = aspectRatio.split(':').map(Number);
        const ratio = w / h;
        const footerOffset = getFooterOffset();

        const availableWidth = (containerRef.current?.parentElement?.clientWidth
            ? containerRef.current.parentElement.clientWidth - (isMobile ? 12 : 32)
            : (isMobile ? window.innerWidth - 12 : 900));
        const availableHeight = Math.max(200, viewportHeight - footerOffset);

        let baseWidth;
        let baseHeight;
        if (ratio >= 1) {
            baseWidth = Math.min(availableWidth, availableHeight * ratio);
            baseHeight = baseWidth / ratio;
        } else {
            baseHeight = Math.min(availableHeight, availableWidth / ratio);
            baseWidth = baseHeight * ratio;
        }

        const fitScale = availableHeight / baseHeight;
        const boost = getAutoZoomBoost(viewportHeight);
        return Math.min(Math.round(fitScale * 100 * boost), 300);
    }

    // Auto-boost zoom on smaller screens unless user already adjusted it.
    useEffect(() => {
        const last = lastViewportHeightRef.current
        lastViewportHeightRef.current = viewportHeight
        if (last !== null && Math.abs(last - viewportHeight) > 40) {
            setHasManualZoom(false)
        }
    }, [viewportHeight])

    useEffect(() => {
        if (hasManualZoom) return
        const autoZoom = calcMaxZoom();
        if (zoom !== autoZoom) setZoom(autoZoom)
    }, [hasManualZoom, isMobile, viewportHeight, zoom])

    // Handle Generation Reveal Effect - simplified, no longer wraps generation

    // Handle Generation Reveal Effect
    useEffect(() => {
        if (isGenerating) {
            setWasJustGenerated(true)
            setIsRevealing(true)
        } else if (currentImage && currentImage !== prevImage) {
            setPrevImage(currentImage)
            setIsRevealing(false)

            if (wasJustGenerated) {
                const timer = setTimeout(() => {
                    setWasJustGenerated(false)
                }, 500)
                return () => clearTimeout(timer)
            }
        }
    }, [isGenerating, currentImage, prevImage, wasJustGenerated])

    const handleGenerateCopy = async () => {
        if (!activeBrandKit || !currentImage) return

        // Respect Lock
        if (isCopyLocked) return

        setIsGeneratingCopy(true)
        try {
            const result = await generateSocialPost({
                brand: activeBrandKit,
                imageBase64: currentImage,
                topic: creationState.rawMessage || undefined,
                userPrompt: creationState.rawMessage || undefined,
                model: creationState.selectedIntelligenceModel
            })

            if (result.success && result.data) {
                setGeneratedCopy(result.data.copy)
                setGeneratedHashtags(result.data.hashtags)
                // Also update global state to ensure UI updates if creationState.caption is being used
                onCaptionChange?.(result.data.copy)
            }
        } catch (error) {
            console.error('Failed to generate copy:', error)
        } finally {
            setIsGeneratingCopy(false)
        }
    }

    // Trigger Copy Generation when image changes
    useEffect(() => {
        // Only auto-generate copy if we don't have one from the unified flow
        if (currentImage && activeBrandKit && !creationState.caption) {
            handleGenerateCopy()
        } else if (!currentImage) {
            // Clear copy when image is removed (e.g. on reset)
            setGeneratedCopy(null)
            setGeneratedHashtags([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentImage])

    const handleDownload = () => {
        if (!currentImage) return
        const link = document.createElement('a')
        link.href = currentImage
        link.download = `x-image-generation-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDownloadBundle = async () => {
        if (!currentImage) return
        const timestamp = Date.now()

        const caption = (creationState.caption || generatedCopy || '').trim()
        const hashtags = generatedHashtags.length > 0 ? generatedHashtags.join(' ') : ''
        const urlText = creationState.ctaUrlEnabled ? (creationState.ctaUrl || '') : ''
        const textContent = [
            `COPY:\n${caption}`,
            `HASHTAGS:\n${hashtags}`,
            `HEADLINE:\n${creationState.headline || ''}`,
            `CTA:\n${creationState.cta || ''}`,
            `URL:\n${urlText}`,
        ].join('\n\n').trimEnd()

        const imageResponse = await fetch(currentImage)
        const imageBlob = await imageResponse.blob()

        const zip = new JSZip()
        zip.file(`image-${timestamp}.png`, imageBlob)
        zip.file(`copy-${timestamp}.txt`, textContent || '')

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const zipUrl = URL.createObjectURL(zipBlob)
        const zipLink = document.createElement('a')
        zipLink.href = zipUrl
        zipLink.download = `x-image-generation-${timestamp}.zip`
        document.body.appendChild(zipLink)
        zipLink.click()
        document.body.removeChild(zipLink)
        URL.revokeObjectURL(zipUrl)
    }



    const handleSelectTemplate = (template: Template) => {
        // Assuming 'template' is a valid type for ContextElement
        // The original onAddContext was not typed for 'template' specifically,
        // but the instruction implies it should be handled.
        // For now, mapping it to 'image' type as per existing ContextElement structure.
        // If 'template' is a new type, ContextElement interface needs update.
        // For this change, I'll assume it's added as a generic 'template' type.
        // The original ContextElement type was:
        // type ContextElement = { id: string; type: 'image' | 'logo' | 'color' | 'font' | 'text' | 'link' | 'contact'; value: string; label?: string; };
        // Adding 'template' to this type would be necessary for full type safety.
        // For now, I'll use 'template' as the type and assume ContextElement can handle it.
        // The instruction did not provide an update to ContextElement, so I'll proceed with this assumption.
        // If onAddContext is not provided, this will do nothing.
        // The original onAddContext was not part of the new CanvasPanelProps, but it's used here.
        // I'll assume it's still available or needs to be added to the new props.
        // For now, I'll keep the original onAddContext call.
        // The instruction removed onAddContext from CanvasPanelProps, so I'm commenting it out.
        // onAddContext?.({
        //     id: template.id,
        //     type: 'template', // Assuming 'template' is a valid type
        //     value: template.thumbnail,
        //     label: template.name
        // });
    }

    const handleDragOver = (e: React.DragEvent) => {
        if (e.dataTransfer.types.includes('application/x-image-context')) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
            setIsDraggingOver(true)
        }
    }

    const handleDragLeave = () => {
        setIsDraggingOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggingOver(false)

        try {
            const data = e.dataTransfer.getData('application/x-image-context')
            if (data) {
                const element = JSON.parse(data) as ContextElement
                // The onAddContext prop was removed from the new CanvasPanelProps.
                // If it's still needed, it should be re-added to the interface.
                // For now, I'm commenting out the call to onAddContext.
                // if (!selectedContext.some(c => c.id === element.id)) {
                //     onAddContext?.(element)
                // }
            }
        } catch (err) {
            console.error('Failed to parse dropped context', err)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full relative isolate overflow-x-hidden">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-start justify-between px-4 pt-1 z-40 pointer-events-none">

                {/* Left: Canvas info */}
                <div className="pointer-events-auto flex items-center gap-2 pt-1">
                    <div className="flex flex-col items-start gap-0.5 leading-tight text-foreground/90 drop-shadow-sm">
                        <span className="text-[12px] font-medium">
                            {aspectRatio}
                            <span className="opacity-60"> &middot; </span>
                            {(() => {
                                const [w, h] = aspectRatio.split(':').map(Number);
                                const ratio = w / h;
                                const baseH = 600;
                                const calcW = baseH * ratio;
                                return `${Math.round(calcW)}x${baseH}`;
                            })()}
                        </span>
                        <span className="text-[11px] font-medium">
                            {(() => {
                                return `W:${getWidthBucket(viewportWidth)}`;
                            })()}
                        </span>
                        <span className="text-[11px] font-medium">
                            {(() => {
                                const footerOffset = getFooterOffset();
                                const availableHeight = Math.max(200, viewportHeight - footerOffset);
                                return `H:${getHeightBucket(viewportHeight)} (${Math.round(availableHeight)}px)`;
                            })()}
                        </span>
                    </div>
                </div>

                {/* Right: Actions - Hidden on mobile (actions now with RESULTADO section) */}
                {/* Zoom Controls & Actions */}
                <div className="hidden md:flex pointer-events-auto glass-panel text-muted-foreground transition-all duration-300 hover:text-foreground flex-col items-center gap-2 rounded-2xl px-2 py-2 absolute right-9 top-1">
                    {/* Zoom Controls */}
                    <div className="flex flex-col items-center border-b border-white/10 pb-2 gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut} title="Zoom out">
                            <ZoomOutIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
                        </Button>
                        <span className="text-[10px] font-mono w-8 text-center" onClick={handleResetZoom} style={{ cursor: 'pointer' }} title="Reset zoom">
                            {effectiveZoom}%
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn} title="Zoom in">
                            <ZoomInIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 ml-1" onClick={handleMaximizeZoom} title="Ajustar al alto (Maximizar)">
                            <AspectRatioOutlinedIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={handleDownload} className="h-7 w-7" title="Descargar imagen">
                        <ImageDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDownloadBundle} className="h-7 w-7" title="Descargar ZIP (imagen + copy)">
                        <SquareArrowDown className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <ShareIcon fontSize="small" className="mr-2" />
                                {t('canvas.share')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className={cn(
                "flex-1 relative flex flex-col items-center justify-start pb-12 overflow-y-auto overflow-x-hidden thin-scrollbar gap-12",
                isMobile ? "px-0 pt-1" : "px-6 pt-1"
            )}>
                {/* Canvas Wrapper - reserves correct space and prevents overflow */}
                <div
                    className="shrink-0 flex items-start justify-center w-full"
                    style={(() => {
                        const [w, h] = aspectRatio.split(':').map(Number);
                        const ratio = w / h;
                        const footerOffset = getFooterOffset();
                        const availableHeight = Math.max(200, viewportHeight - footerOffset);
                        const padding = isMobile ? 0 : 48;
                        const availableWidth = (containerRef.current?.parentElement?.clientWidth
                            ? containerRef.current.parentElement.clientWidth - padding
                            : (isMobile ? window.innerWidth : 1000));

                        let canvasHeight;
                        if (isMobile) {
                            canvasHeight = availableWidth / ratio;
                        } else {
                            if (ratio >= 1) {
                                const canvasWidth = Math.min(availableWidth, availableHeight * ratio);
                                canvasHeight = canvasWidth / ratio;
                            } else {
                                canvasHeight = Math.min(availableHeight, availableWidth / ratio);
                            }
                        }

                        // Strictly follow scaled height to maintain fixed gap below
                        const scaledHeight = canvasHeight * (zoom / 100);
                        return {
                            height: `${scaledHeight}px`
                        };
                    })()}
                >
                    {/* Canvas Container */}
                    <div
                        ref={containerRef}
                        className={cn(
                            "canvas-panel relative shadow-aero-lg ring-1 ring-black/10 dark:ring-white/20 transition-all duration-300 ease-out flex items-center justify-center bg-transparent bg-dot shrink-0 rounded-aero",
                            "overflow-visible"
                        )}
                        style={(() => {
                            const [w, h] = aspectRatio.split(':').map(Number);
                            const ratio = w / h;

                            const footerOffset = getFooterOffset();
                            const availableHeight = Math.max(200, viewportHeight - footerOffset);

                            const padding = isMobile ? 0 : 48;
                            const availableWidth = (containerRef.current?.parentElement?.clientWidth
                                ? containerRef.current.parentElement.clientWidth - padding
                                : (isMobile ? window.innerWidth : 1000));

                            let canvasWidth, canvasHeight;

                            if (isMobile) {
                                canvasWidth = availableWidth;
                                canvasHeight = canvasWidth / ratio;
                            } else {
                                if (ratio >= 1) {
                                    canvasWidth = Math.min(availableWidth, availableHeight * ratio);
                                    canvasHeight = canvasWidth / ratio;
                                } else {
                                    canvasHeight = Math.min(availableHeight, availableWidth / ratio);
                                    canvasWidth = canvasHeight * ratio;
                                }
                            }

                            return {
                                width: `${canvasWidth}px`,
                                height: `${canvasHeight}px`,
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
                                containerType: 'inline-size',
                                containerName: 'canvas',
                            };

                        })()}
                    >
                        <FloatingAssistance
                            isVisible={
                                assistanceEnabled &&
                                !isMobile &&
                                !isGenerating &&
                                !currentImage &&
                                creationState.currentStep >= 2 &&
                                !!creationState.selectedIntent
                            }
                            title="Vista previa"
                            description="Puedes añadir, editar o quitar textos. Haz clic en cada capa para ajustarla."
                            side={panelPosition === 'right' ? 'left' : 'right'}
                            anchorRef={containerRef}
                            className="w-[240px] opacity-95"
                        />
                        <AnimatePresence mode="wait">
                            {(isGenerating || isRevealing) && (
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

                        {/* Composition Icon Overlay - subtle ghosted backdrop */}
                        {selectedLayoutIcon && !isGenerating && !currentImage && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-50">
                                {renderLayoutIcon(selectedLayoutIcon)}
                            </div>
                        )}

                        {/* Main Content Area */}
                        {currentImage ? (
                            <div className="relative w-full h-full overflow-hidden rounded-sm z-20">
                                {showPromptDebugTrigger && onOpenPromptDebug && (
                                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={onOpenPromptDebug}
                                            className="h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border shadow-sm hover:shadow-md transition-all hover:scale-[1.03] active:scale-[0.98]"
                                            title="Ver prompt enviado"
                                        >
                                            <Bug className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                                <div className="w-full h-full flex items-center justify-center text-center">
                                    <motion.div
                                        key={currentImage}
                                        initial={wasJustGenerated ? { opacity: 0, filter: 'blur(20px)' } : { opacity: 1, filter: 'blur(0px)' }}
                                        animate={{
                                            opacity: 1,
                                            filter: 'blur(0px)',
                                        }}
                                        transition={wasJustGenerated ? {
                                            duration: 0.3,
                                            ease: "easeOut",
                                            filter: { duration: 0.4 },
                                            opacity: { duration: 0.2 }
                                        } : {
                                            duration: 0.15
                                        }}
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        <img
                                            src={currentImage}
                                            alt="Generated design"
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        ) : creationState ? (
                            <div className="relative w-full h-full z-10">
                                <WireframeRenderer
                                    state={creationState}
                                    aspectRatio={(() => {
                                        const [w, h] = aspectRatio.split(':').map(Number);
                                        return w / h;
                                    })()}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/40 rounded-lg bg-background/40 hover:bg-background/60 transition-colors">
                                <div className="w-16 h-16 rounded-2xl bg-white/50 dark:bg-zinc-800/50 shadow-sm flex items-center justify-center mb-3 backdrop-blur-sm">
                                    <span className="text-3xl opacity-70">🎨</span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground/70">{t('canvas.noImage')}</p>
                                <div className="mt-4 px-3 py-1 rounded-full bg-muted/50 text-[10px] uppercase tracking-wider font-mono text-muted-foreground/60 border border-border/30">
                                    {aspectRatio}
                                </div>
                            </div>
                        )}

                        {/* PREVIEW OVERLAYS (Reference Image & Logo) */}
                        {!currentImage && !isGenerating && creationState && (
                            <>
                                {/* Reference Images by role */}
                                {(() => {
                                    // Combine uploaded images and brand kit selections
                                    const uploadedImgs = creationState.uploadedImages.map((url, i) => ({ url, source: 'upload' as const, key: `u-${i}` }))
                                    // Since selectedBrandKitImageIds now stores URLs directly, use them as-is
                                    const brandKitImgs = creationState.selectedBrandKitImageIds.map((url, i) => ({
                                        url,
                                        source: 'brandkit' as const,
                                        key: `bk-${i}`
                                    }))
                                    const allImages = [...uploadedImgs, ...brandKitImgs].map((item) => ({
                                        ...item,
                                        role: creationState.referenceImageRoles?.[item.url] || 'content'
                                    }))

                                    const contentImages = allImages.filter((item) => item.role === 'content' || item.role === 'style_content')
                                    const styleImages = allImages.filter((item) => item.role === 'style' || item.role === 'style_content')
                                    const auxLogos = allImages.filter((item) => item.role === 'logo')
                                    const hasAiPromptReference = creationState.imageSourceMode === 'generate'
                                    const contentPreviewImages = contentImages.slice(0, 6)

                                    const renderStrip = (
                                        images: Array<{ url: string; source: 'upload' | 'brandkit'; key: string }>,
                                        positionClass: string,
                                        badgeClass: string,
                                        variant: 'default' | 'style' = 'default'
                                    ) => {
                                        if (images.length === 0) return null
                                        return (
                                            <div className={cn("absolute z-20 flex gap-2 flex-wrap max-w-[220px]", positionClass)}>
                                                {images.slice(0, 6).map((item, idx) => (
                                                    <div
                                                        key={item.key}
                                                        className={cn(
                                                            "relative group",
                                                            variant === 'style' && "transition-transform duration-300 hover:-translate-y-0.5"
                                                        )}
                                                    >
                                                            <img
                                                                src={item.url}
                                                                alt={`Ref ${idx + 1}`}
                                                                className={cn(
                                                                    "object-cover shadow-xl",
                                                                    variant === 'style'
                                                                        ? "rounded-2xl border-2 border-violet-300/70 ring-4 ring-violet-500/15 bg-white p-1 -rotate-6 group-hover:rotate-0 transition-transform duration-300"
                                                                        : "object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.28)]"
                                                                )}
                                                                style={variant === 'style'
                                                                    ? { width: 'var(--style-thumb-w)', height: 'var(--style-thumb-h)' }
                                                                    : { width: 'clamp(28px, 4.5cqw, 46px)', height: 'clamp(28px, 4.5cqw, 46px)' }
                                                                }
                                                            />
                                                        {variant === 'style' && (
                                                            <div className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center shadow-md ring-2 ring-white/70">
                                                                <Sparkles className="w-2.5 h-2.5" />
                                                            </div>
                                                        )}
                                                        {variant === 'style' && (
                                                            <div className={cn("absolute bottom-0 inset-x-0 text-[5px] text-white text-center py-0.5 backdrop-blur-sm rounded-b-lg", badgeClass)}>
                                                                {`ESTILO ${item.source === 'brandkit' ? 'BK' : idx + 1}`}
                                                            </div>
                                                        )}
                                                        {onRemoveReferenceImage && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => onRemoveReferenceImage(item.url)}
                                                                className="absolute -top-2 -right-2 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-40 hover:bg-destructive hover:text-destructive-foreground"
                                                                style={{ width: 'clamp(14px, 2.6cqw, 20px)', height: 'clamp(14px, 2.6cqw, 20px)' }}
                                                            >
                                                                <X style={{ width: 'clamp(8px, 1.6cqw, 12px)', height: 'clamp(8px, 1.6cqw, 12px)' }} />
                                                            </Button>
                                                        )}
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

                                    const renderStyleCorner = (
                                        images: Array<{ url: string; source: 'upload' | 'brandkit'; key: string }>
                                    ) => {
                                        if (images.length === 0) return null
                                        const mainStyle = images[0]
                                        return (
                                            <StyleReferenceCorner
                                                url={mainStyle.url}
                                                onRemove={onRemoveReferenceImage ? () => onRemoveReferenceImage(mainStyle.url) : undefined}
                                            />
                                        )
                                    }

                                    return (
                                        <>
                                            {renderStyleCorner(styleImages)}
                                            {renderStrip(auxLogos, "bottom-6 right-4", "bg-amber-600/80")}
                                            {(hasAiPromptReference || contentPreviewImages.length > 0) && (
                                                <div className="absolute top-2 right-4 z-40 flex flex-col items-end gap-2">
                                                    {hasAiPromptReference && (
                                                        <div className="relative group">
                                                            <AiPromptIcon
                                                                className="text-primary drop-shadow-[0_10px_18px_rgba(0,0,0,0.26)]"
                                                                style={{ width: 'var(--canvas-ai-size)', height: 'var(--canvas-ai-size)' }}
                                                            />
                                                            {onDisableAiPromptReference && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={onDisableAiPromptReference}
                                                                    className="absolute -top-2 -right-2 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-40 hover:bg-destructive hover:text-destructive-foreground"
                                                                    style={{ width: 'clamp(14px, 2.6cqw, 20px)', height: 'clamp(14px, 2.6cqw, 20px)' }}
                                                                >
                                                                    <X style={{ width: 'clamp(8px, 1.6cqw, 12px)', height: 'clamp(8px, 1.6cqw, 12px)' }} />
                                                                </Button>
                                                            )}
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
                                                            {onRemoveReferenceImage && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => onRemoveReferenceImage(item.url)}
                                                                    className="absolute -top-2 -right-2 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-40 hover:bg-destructive hover:text-destructive-foreground"
                                                                    style={{ width: 'clamp(14px, 2.6cqw, 20px)', height: 'clamp(14px, 2.6cqw, 20px)' }}
                                                                >
                                                                    <X style={{ width: 'clamp(8px, 1.6cqw, 12px)', height: 'clamp(8px, 1.6cqw, 12px)' }} />
                                                                </Button>
                                                            )}
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

                                {/* Logo (Top Left) */}
                                {selectedLogoUrl && (
                                    <div className="absolute top-1 left-4 z-20 group">
                                        <img
                                            src={selectedLogoUrl}
                                            alt="Logo"
                                            className="object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.26)]"
                                            style={{ width: 'var(--canvas-logo-size)', height: 'var(--canvas-logo-size)' }}
                                        />
                                        {onSelectLogo && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onSelectLogo(null)}
                                                className="absolute -top-2 -right-2 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-destructive hover:text-destructive-foreground"
                                                style={{ width: 'clamp(16px, 2.8cqw, 22px)', height: 'clamp(16px, 2.8cqw, 22px)' }}
                                            >
                                                <X style={{ width: 'clamp(9px, 1.8cqw, 13px)', height: 'clamp(9px, 1.8cqw, 13px)' }} />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* TEXT LAYERS EDITOR - Overlay on Canvas (Only visible when no image is generated) */}
                        {!currentImage && (creationState.headline || creationState.cta || Object.keys(creationState.customTexts).length > 0 || creationState.selectedIntent) && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                                <div className="w-full h-full">
                                        <TextLayersEditor
                                            headline={creationState.headline}
                                            cta={creationState.cta}
                                            ctaUrl={creationState.ctaUrl}
                                            ctaUrlEnabled={creationState.ctaUrlEnabled}
                                            customTexts={creationState.customTexts}
                                            textAssets={creationState.selectedTextAssets}
                                            brandKitTexts={brandKitTexts}
                                        onHeadlineChange={(val) => onHeadlineChange?.(val)}
                                        onCtaChange={(val) => onCtaChange?.(val)}
                                        onCtaUrlChange={(val) => onCtaUrlChange?.(val)}
                                        onCustomTextChange={(id, val) => onCustomTextChange?.(id, val)}
                                        onAddTextAsset={onAddTextAsset}
                                        onUpdateTextAsset={onUpdateTextAsset}
                                        onDeleteLayer={(id, type) => {
                                            if (type === 'headline') onHeadlineChange?.('')
                                            if (type === 'cta') onCtaChange?.('')
                                            if (type === 'custom') onCustomTextChange?.(id, '')
                                            if (type === 'asset') onRemoveTextAsset?.(id)
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Close Canvas Wrapper */}
                </div>

                {/* CAPTION CARD - Shows below texts */}
                {(creationState.caption || isGeneratingCopy || creationState.selectedIntent) && (
                    <div className="w-full max-w-[800px] shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 z-10 pb-20">
                        <GeneratedCopyCard
                            copy={creationState.caption || generatedCopy}
                            hashtags={generatedHashtags}
                            isLoading={isGeneratingCopy}
                            onRegenerate={handleGenerateCopy}
                            isLocked={isCopyLocked}
                            onToggleLock={() => setIsCopyLocked(!isCopyLocked)}
                            onCopyChange={(val) => onCaptionChange?.(val)}
                        />
                    </div>
                )}
            </div>



            {/* Staging Area / Context Drawer */}
            {
                selectedContext.length > 0 && (
                    <div
                        className="px-4 py-2 bg-background"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-wrap gap-2">
                            {selectedContext.map((item) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex items-center gap-2 bg-background border border-border/50 rounded-lg shadow-sm group animate-in fade-in slide-in-from-bottom-1 transition-all overflow-hidden",
                                        (item.type === 'image' || item.type === 'logo') ? "p-0 pr-1.5" : "px-2 py-1"
                                    )}
                                >
                                    {item.type === 'color' && (
                                        <div className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: item.value }} />
                                    )}
                                    {item.type === 'template' && (
                                        <Layout className="w-3.5 h-3.5 text-primary shrink-0" />
                                    )}
                                    {(item.type === 'logo' || item.type === 'image') && (
                                        <div className="w-10 h-10 flex-shrink-0 bg-muted/20 border-r border-border/30">
                                            <img
                                                src={item.value}
                                                className={cn(
                                                    "w-full h-full",
                                                    item.type === 'logo' ? "object-contain p-1" : "object-cover"
                                                )}
                                                alt={item.label}
                                            />
                                        </div>
                                    )}

                                    {/* Font */}
                                    {item.type === 'font' && (
                                        <Type className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                    )}

                                    {/* Text assets */}
                                    {item.type === 'text' && (
                                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    )}

                                    {/* Links */}
                                    {item.type === 'link' && (
                                        <Link2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                    )}

                                    {/* Contact */}
                                    {item.type === 'contact' && (
                                        <AtSign className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                    )}

                                    {(item.type === 'color' || item.type === 'template' || item.type === 'font' || item.type === 'text' || item.type === 'link' || item.type === 'contact') && (
                                        <span className="text-[11px] font-medium max-w-[120px] truncate">
                                            {item.label || item.value}
                                        </span>
                                    )}

                                    <button
                                        onClick={() => onRemoveContext?.(item.id, 'style')}
                                        className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive transition-colors ml-auto"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                            }

                            {/* Preview Chip while dragging */}
                            {
                                isDraggingOver && draggedElement && !selectedContext.some(c => c.id === draggedElement.id) && (
                                    <div
                                        className={cn(
                                            "flex items-center gap-2 bg-primary/5 border border-primary/30 border-dashed rounded-lg shadow-sm animate-pulse overflow-hidden opacity-80",
                                            (draggedElement.type === 'image' || draggedElement.type === 'logo') ? "p-0 pr-1.5" : "px-2 py-1"
                                        )}
                                    >
                                        {draggedElement.type === 'color' && (
                                            <div className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: draggedElement.value }} />
                                        )}
                                        {draggedElement.type === 'template' && (
                                            <Layout className="w-3.5 h-3.5 text-primary shrink-0" />
                                        )}
                                        {(draggedElement.type === 'logo' || draggedElement.type === 'image') && (
                                            <div className="w-10 h-10 flex-shrink-0 bg-muted/20 border-r border-border/30">
                                                <img
                                                    src={draggedElement.value}
                                                    className={cn(
                                                        "w-full h-full",
                                                        draggedElement.type === 'logo' ? "object-contain p-1" : "object-cover"
                                                    )}
                                                    alt="Preview"
                                                />
                                            </div>
                                        )}

                                        {/* Font */}
                                        {draggedElement.type === 'font' && (
                                            <Type className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                        )}

                                        {/* Text assets */}
                                        {draggedElement.type === 'text' && (
                                            <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        )}

                                        {/* Links */}
                                        {draggedElement.type === 'link' && (
                                            <Link2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                        )}

                                        {/* Contact */}
                                        {draggedElement.type === 'contact' && (
                                            <AtSign className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                        )}

                                        {(draggedElement.type === 'color' || draggedElement.type === 'template' || draggedElement.type === 'font' || draggedElement.type === 'text' || draggedElement.type === 'link' || draggedElement.type === 'contact') && (
                                            <span className="text-[11px] font-medium opacity-50">
                                                {draggedElement.label}
                                            </span>
                                        )}
                                    </div>
                                )
                            }
                        </div >
                    </div >
                )
            }

            {/* Prompt Input Area - Hidden when using external PromptCard */}
            {
                !hidePromptArea && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "transition-all duration-300 relative mx-auto w-full max-w-[98%] mb-2 pointer-events-auto",
                            isDraggingOver ? "scale-[1.01]" : ""
                        )}
                    >
                        {isDraggingOver && (
                            <div className="absolute inset-x-0 -top-12 flex justify-center pointer-events-none animate-bounce z-50">
                                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg ring-2 ring-background">
                                    Suelta para añadir al contexto
                                </div>
                            </div>
                        )}

                        <div className={cn(
                            "flex items-center gap-2 p-2 pl-4 bg-background/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[32px] transition-all duration-300",
                            isDraggingOver ? "ring-2 ring-primary ring-offset-2 bg-background" : "hover:bg-background/90"
                        )}>
                            {/* Add Image Icon */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 h-10 w-10 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                title="Añadir imagen de referencia (Próximamente)"
                            >
                                <ImagePlus className="w-5 h-5" />
                            </Button>

                            {/* Input */}
                            <Textarea
                                value={editPrompt}
                                onChange={(e) => onEditPromptChange?.(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        if (canGenerate || editPrompt.trim()) {
                                            onUnifiedAction()
                                        }
                                    }
                                }}
                                disabled={!currentImage}
                                placeholder={currentImage ? "Describe los cambios que quieres..." : "Genera una imagen primero para poder editarla..."}
                                className="flex-1 min-h-[50px] max-h-[120px] py-3 bg-transparent border-0 focus-visible:ring-0 resize-none shadow-none text-base placeholder:text-muted-foreground/60 leading-relaxed scrollbar-hide disabled:opacity-50 disabled:cursor-not-allowed"
                            />



                            {/* Generate Button */}
                            <GenerateButton
                                onClick={onUnifiedAction}
                                isGenerating={isGenerating}

                                label={currentImage && editPrompt.trim() ? "EDITAR IMAGEN" : "Generar"}
                                isDisabled={!canGenerate && !editPrompt.trim()}
                                className="h-14 px-8 rounded-xl font-bold shadow-lg hover:shadow-primary/25 bg-primary text-primary-foreground border-0 shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            />
                        </div>
                    </div>
                )
            }


            <TemplateSelectorModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelect={handleSelectTemplate}
                selectedTemplateId={selectedContext.find(c => c.type === 'template')?.id}
            />
        </div >
    )
}
