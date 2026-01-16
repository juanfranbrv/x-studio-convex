'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Save } from 'lucide-react'
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
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
import { Layout, X, Image as ImageIcon, Type, FileText, Link2, AtSign, Minus, Plus, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { DigitalStaticLoader } from './DigitalStaticLoader'
import { GeneratedCopyCard } from './GeneratedCopyCard'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { generateSocialPost } from '@/app/actions/generate-social-post'
import { WireframeRenderer } from './previews/WireframeRenderer'
import { GenerationState } from '@/lib/creation-flow-types'

export interface Generation {
    id: string
    image_url: string
    created_at: string
}

import { GenerateButton } from './creation-flow/GenerateButton'
import { TextLayersEditor } from './TextLayersEditor'

export interface CanvasPanelProps {
    currentImage: string | null
    isAnnotating: boolean
    onAnnotate: () => void
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
    onCustomTextChange?: (id: string, value: string) => void
    // New handlers for text assets
    onAddTextAsset?: () => void
    onRemoveTextAsset?: (id: string) => void
    onUpdateTextAsset?: (id: string, value: string) => void
    // Original props that were not removed but are still used

    aspectRatio?: string
    // Hide prompt area (when using external PromptCard)
    hidePromptArea?: boolean
}

export function CanvasPanel({
    currentImage,
    generations = [],
    onSelectGeneration,
    onAnnotate,
    isAnnotating = false,
    selectedContext = [],
    onRemoveContext,
    onAddContext,
    draggedElement,
    isGenerating,
    aspectRatio = "1:1",
    creationState,
    editPrompt,
    onEditPromptChange,
    canGenerate,
    onUnifiedAction,

    onCaptionChange,
    onHeadlineChange,
    onCtaChange,
    onCustomTextChange,
    onAddTextAsset,
    onRemoveTextAsset,
    onUpdateTextAsset,
    hidePromptArea = false
}: CanvasPanelProps) {
    const { t } = useTranslation()
    const { activeBrandKit } = useBrandKit()
    const [zoom, setZoom] = useState(100)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragActive, setIsDragActive] = useState(false)
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
    const [viewportHeight, setViewportHeight] = useState(800) // Default fallback
    const [isMobile, setIsMobile] = useState(false)

    // Track viewport height for responsive canvas
    useEffect(() => {
        const updateHeight = () => {
            setViewportHeight(window.innerHeight)
            setIsMobile(window.innerWidth < 768)
        }
        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [])

    // Calculate effective zoom (base scale * manual zoom)
    const effectiveZoom = useMemo(() => {
        const [w, h] = aspectRatio.split(':').map(Number);
        const ratio = w / h;
        const baseHeight = 600;

        // Smarter dimension calculation matching the container style
        // We use the same offsets to ensure indicator matches reality
        const footerOffset = isMobile
            ? (currentImage ? 180 : 120)
            : (currentImage ? 700 : 400);
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

    // Save Preset State
    const [isSavePresetOpen, setIsSavePresetOpen] = useState(false)
    const [presetName, setPresetName] = useState('')
    const [isSavingPreset, setIsSavingPreset] = useState(false)
    const { user } = useUser();
    const createPreset = useMutation(api.presets.create);

    const handleSavePreset = async () => {
        if (!presetName.trim() || !creationState) return;

        setIsSavingPreset(true);
        try {
            // Use activeBrandKit.userId if available, otherwise check user.id (clerk)
            // Assuming activeBrandKit might store the owner's ID or we use current user's ID
            const userId = user?.id || (activeBrandKit as any)?.userId || "user";

            await createPreset({
                userId: userId,
                brandId: activeBrandKit?.id as any,
                name: presetName,
                description: creationState.selectedIntent || "Preset personalizado",
                icon: creationState.selectedIntent ? creationState.selectedIntent : "Sparkles", // Use intent ID as icon reference or default
                state: {
                    // Platform & Format
                    selectedPlatform: creationState.selectedPlatform,
                    selectedFormat: creationState.selectedFormat,
                    // Intent
                    selectedGroup: creationState.selectedGroup,
                    selectedIntent: creationState.selectedIntent,
                    selectedSubMode: creationState.selectedSubMode,
                    // Image/Input
                    uploadedImage: creationState.uploadedImage,
                    selectedTheme: creationState.selectedTheme,
                    imageSourceMode: creationState.imageSourceMode,
                    selectedBrandKitImageId: creationState.selectedBrandKitImageId,
                    aiImageDescription: creationState.aiImageDescription,
                    // Styles & Layout
                    selectedStyles: creationState.selectedStyles,
                    selectedLayout: creationState.selectedLayout,
                    // Branding
                    selectedLogoId: creationState.selectedLogoId,
                    headline: creationState.headline,
                    cta: creationState.cta,
                    customTexts: creationState.customTexts,
                    selectedBrandColors: creationState.selectedBrandColors,
                    rawMessage: creationState.rawMessage,
                    additionalInstructions: creationState.additionalInstructions,
                    customStyle: creationState.customStyle,
                    selectedTextAssets: creationState.selectedTextAssets,
                }
            });
            setIsSavePresetOpen(false);
            setPresetName('');
            // Optional: Toast success
        } catch (error) {
            console.error("Failed to save preset:", error);
        } finally {
            setIsSavingPreset(false);
        }
    };



    const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200))
    const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50))
    const handleResetZoom = () => setZoom(100)

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
                model: creationState.selectedIntelligenceModel
            })

            if (result.success && result.data) {
                setGeneratedCopy(result.data.copy)
                setGeneratedHashtags(result.data.hashtags)
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
        <div className="flex-1 flex flex-col h-full bg-background relative isolate">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-start justify-between p-4 z-40 pointer-events-none">

                {/* Left: Badge & Title */}
                <div className="pointer-events-auto flex items-center gap-2 pt-1">
                    <Badge variant="outline" className="text-[10px] h-6 gap-2 bg-background/80 backdrop-blur-sm border-border shadow-sm px-2">
                        <span className="font-bold text-muted-foreground">{t('canvas.title')}</span>
                        <div className="w-px h-3 bg-border" />
                        {aspectRatio}
                        <span className="opacity-50">|</span>
                        {(() => {
                            const [w, h] = aspectRatio.split(':').map(Number);
                            const ratio = w / h;
                            const baseH = 600;
                            const calcW = baseH * ratio;
                            return `${Math.round(calcW)}x${baseH}`;
                        })()}
                    </Badge>
                </div>

                {/* Right: Actions - Hidden on mobile (actions now with RESULTADO section) */}
                {/* Zoom Controls & Actions */}
                <div className="hidden md:flex pointer-events-auto items-center gap-1 glass-panel rounded-full px-3 py-1.5 text-muted-foreground transition-all duration-300 hover:text-foreground">
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1 mr-2 border-r border-white/10 pr-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
                            <ZoomOutIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
                        </Button>
                        <span className="text-[10px] font-mono w-8 text-center">{effectiveZoom}%</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
                            <ZoomInIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
                        </Button>
                    </div>

                    <Dialog open={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" title={t('canvas.savePreset') || "Guardar Preset"}>
                                <Save className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Guardar Preset</DialogTitle>
                                <DialogDescription>
                                    Guarda esta configuración para reutilizarla en futuros diseños.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        value={presetName}
                                        onChange={(e) => setPresetName(e.target.value)}
                                        placeholder="Ej: Oferta Black Friday"
                                    />
                                </div>
                                {creationState?.selectedIntent && (
                                    <p className="text-sm text-muted-foreground">
                                        Tipo: <span className="font-medium">{creationState.selectedIntent}</span>
                                    </p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsSavePresetOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSavePreset} disabled={!presetName.trim() || isSavingPreset}>
                                    {isSavingPreset ? "Guardando..." : "Guardar Preset"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant={isAnnotating ? 'default' : 'ghost'}
                        size="icon"
                        onClick={onAnnotate}
                        className={cn("h-7 w-7", isAnnotating ? 'btn-gradient' : '')}
                    >
                        <EditIcon fontSize="small" style={{ fontSize: '1.1rem' }} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDownload} className="h-7 w-7">
                        <DownloadIcon fontSize="small" style={{ fontSize: '1.2rem' }} />
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
                "flex-1 relative flex flex-col items-center justify-start pb-8 overflow-auto thin-scrollbar",
                isMobile ? "px-0 pt-20" : "px-6 pt-20"
            )}>

                {/* Canvas Container - constrained to available space */}
                <div
                    ref={containerRef}
                    className="relative shadow-aero-lg ring-1 ring-black/10 dark:ring-white/20 transition-all duration-300 ease-out flex items-center justify-center bg-white dark:bg-zinc-900 bg-dot group shrink-0 rounded-aero overflow-hidden"
                    style={(() => {
                        const [w, h] = aspectRatio.split(':').map(Number);
                        const ratio = w / h;

                        // Smarter dimension calculation:
                        // 1. More vertical space if we don't have a copy card yet
                        // 2. Increase offset significantly to ensure zoom buttons (mt-4)
                        //    and copy card are visible without scroll
                        const footerOffset = isMobile
                            ? (currentImage ? 180 : 120)
                            : (currentImage ? 700 : 400);
                        const availableHeight = Math.max(200, viewportHeight - footerOffset);

                        // 2. Use real container width if available
                        const padding = isMobile ? 0 : 48;
                        const availableWidth = (containerRef.current?.parentElement?.clientWidth
                            ? containerRef.current.parentElement.clientWidth - padding
                            : (isMobile ? window.innerWidth : 1000));

                        let canvasWidth, canvasHeight;

                        if (isMobile) {
                            // Mobile: Always prioritize full width, ignore height constraints (let it scroll)
                            canvasWidth = availableWidth;
                            canvasHeight = canvasWidth / ratio;
                        } else {
                            // Desktop: Contain within viewport
                            if (ratio >= 1) {
                                canvasWidth = Math.min(availableWidth, availableHeight * ratio);
                                canvasHeight = canvasWidth / ratio;
                            } else {
                                canvasHeight = Math.min(availableHeight, availableWidth / ratio);
                                canvasWidth = canvasHeight * ratio;
                            }
                        }

                        return {
                            width: `${canvasWidth * (zoom / 100)}px`,
                            height: `${canvasHeight * (zoom / 100)}px`,
                        };
                    })()}
                >
                    <AnimatePresence mode="wait">
                        {(isGenerating || isRevealing) && (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0 z-50 overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10"
                            >
                                <DigitalStaticLoader />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {currentImage ? (
                        <div className="relative w-full h-full overflow-hidden rounded-lg bg-background/50">
                            <div className="w-full h-full flex items-center justify-center">
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
                                    {isAnnotating && (
                                        <div className="absolute top-1/4 right-1/4 w-24 h-24 annotation-ring flex items-center justify-center">
                                            <div className="bg-primary rounded-full p-1">
                                                <EditIcon fontSize="small" className="text-primary-foreground" style={{ width: 12, height: 12 }} />
                                            </div>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover px-2 py-1 rounded text-xs whitespace-nowrap">
                                                Add red accent stitching to laces.
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    ) : creationState ? (
                        <WireframeRenderer
                            state={creationState}
                            aspectRatio={(() => {
                                const [w, h] = aspectRatio.split(':').map(Number);
                                return w / h;
                            })()}
                        />
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
                    {!currentImage && creationState && (
                        <>
                            {/* Reference Image (Top Left) */}
                            {creationState.uploadedImage && (
                                <div className="absolute top-4 left-4 z-20 group/ref">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden ring-2 ring-white shadow-lg bg-white relative">
                                        <img
                                            src={creationState.uploadedImage}
                                            alt="Ref"
                                            className="w-full h-full object-cover opacity-90 group-hover/ref:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-[8px] text-white text-center py-0.5 backdrop-blur-sm">
                                            REFERENCIA
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Logo (Top Right) */}
                            {creationState.selectedLogoId && activeBrandKit?.logos && (
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm ring-1 ring-white/20 shadow-lg p-2">
                                        <img
                                            src={activeBrandKit.logos.find((l: any, idx: number) => l._id === creationState.selectedLogoId || `logo-${idx}` === creationState.selectedLogoId)?.url}
                                            alt="Logo"
                                            className="w-full h-full object-contain drop-shadow"
                                        />
                                    </div>
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
                                    customTexts={creationState.customTexts}
                                    textAssets={creationState.selectedTextAssets}
                                    onHeadlineChange={(val) => onHeadlineChange?.(val)}
                                    onCtaChange={(val) => onCtaChange?.(val)}
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

                {/* Zoom Controls moved to header */}



                {/* CAPTION CARD - Shows below texts */}
                {(creationState.caption || isGeneratingCopy || creationState.selectedIntent) && (
                    <div className="w-full max-w-[800px] mt-4 shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 z-10 pb-10">
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
            {selectedContext.length > 0 && (
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
            )}

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
