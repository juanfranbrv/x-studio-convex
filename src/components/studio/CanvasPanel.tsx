'use client'

import { useState, useEffect } from 'react'
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
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
import { ContextElement } from '@/app/studio/page'
import { Layout, X, Image as ImageIcon, Type, FileText, Link2, AtSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { DigitalStaticLoader } from './DigitalStaticLoader'
import { GeneratedCopyCard } from './GeneratedCopyCard'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { generateSocialPost } from '@/app/actions/generate-social-post'

interface Generation {
    id: string
    image_url: string
    created_at: string
}

interface CanvasPanelProps {
    currentImage: string | null
    generations?: Generation[]
    onSelectGeneration?: (gen: Generation) => void
    onAnnotate?: () => void
    isAnnotating?: boolean
    selectedContext?: ContextElement[]
    onRemoveContext?: (id: string) => void
    onAddContext?: (element: ContextElement) => void
    draggedElement?: ContextElement | null
    onGenerate: (prompt: string, model?: string) => void
    isGenerating: boolean
    selectedModel?: string
    onModelChange?: (model: string) => void
    selectedTextModel?: string
    onTextModelChange?: (model: string) => void
    aspectRatio?: string
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
    onGenerate,
    isGenerating,
    selectedModel,
    onModelChange,
    selectedTextModel,
    onTextModelChange,
    aspectRatio = "1:1"
}: CanvasPanelProps) {
    const { t } = useTranslation()
    const { activeBrandKit } = useBrandKit()
    const [zoom, setZoom] = useState(100)
    const [prompt, setPrompt] = useState('')
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false)
    const [prevImage, setPrevImage] = useState<string | null>(currentImage)
    const [wasJustGenerated, setWasJustGenerated] = useState(false)

    // Copy Generation State
    const [generatedCopy, setGeneratedCopy] = useState<string | null>(null)
    const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
    const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)

    const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200))
    const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50))
    const handleResetZoom = () => setZoom(100)

    // Handle Generation Reveal Effect - ONLY for newly generated images
    useEffect(() => {
        if (isGenerating) {
            setIsRevealing(true)
            setWasJustGenerated(true)
        } else if (isRevealing && currentImage !== prevImage && wasJustGenerated) {
            // SLOW CRYSTALLIZATION: Keep revealing for 3.5 seconds
            const timer = setTimeout(() => {
                setIsRevealing(false)
                setPrevImage(currentImage)
                setWasJustGenerated(false)
            }, 3500)
            return () => clearTimeout(timer)
        } else if (!isGenerating && !wasJustGenerated) {
            // History navigation: update immediately without animation
            setPrevImage(currentImage)
        }
    }, [isGenerating, currentImage, prevImage, isRevealing, wasJustGenerated])

    const handleGenerateCopy = async () => {
        if (!activeBrandKit || !currentImage) return

        setIsGeneratingCopy(true)
        try {
            const result = await generateSocialPost({
                brand: activeBrandKit,
                imageBase64: currentImage,
                model: selectedTextModel
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
        if (currentImage && activeBrandKit) {
            handleGenerateCopy()
        }
    }, [currentImage]) // Only trigger on new images, not on isGenerating changes

    const handleDownload = () => {
        if (!currentImage) return
        const link = document.createElement('a')
        link.href = currentImage
        link.download = `x-studio-generation-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleSelectTemplate = (template: Template) => {
        onAddContext?.({
            id: template.id,
            type: 'image',
            value: template.thumbnail,
            label: template.name
        });
    }

    const handleDragOver = (e: React.DragEvent) => {
        if (e.dataTransfer.types.includes('application/x-studio-context')) {
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
            const data = e.dataTransfer.getData('application/x-studio-context')
            if (data) {
                const element = JSON.parse(data) as ContextElement
                if (!selectedContext.some(c => c.id === element.id)) {
                    onAddContext?.(element)
                }
            }
        } catch (err) {
            console.error('Failed to parse dropped context', err)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background">
            {/* Canvas Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
                <h2 className="text-lg font-semibold font-heading">{t('canvas.title')}</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant={isAnnotating ? 'default' : 'ghost'}
                        size="icon"
                        onClick={onAnnotate}
                        className={isAnnotating ? 'btn-gradient' : ''}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDownload}>
                        <DownloadIcon fontSize="small" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizIcon fontSize="small" />
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

            <div className="flex-1 relative flex flex-col items-center justify-center p-8 pb-24 overflow-y-auto bg-zinc-100 dark:bg-zinc-900 scrollbar-hide">
                {/* Unified Aspect Ratio Container */}
                {/* Unified Aspect Ratio Container */}
                <div
                    className="relative flex items-center justify-center shadow-sm shrink-0 transition-[width,height] duration-200 ease-out"
                    style={{
                        aspectRatio: aspectRatio.replace(':', '/'),
                        ...(() => {
                            const [w, h] = aspectRatio.split(':').map(Number);
                            const ratio = w / h;
                            const zoomFactor = zoom / 100;
                            // Box container ratio is roughly 800/600 = 1.33
                            // If content is wider than box (ratio > 1.33), constrain width.
                            // Otherwise (taller or square), constrain height.
                            return ratio > (4 / 3) ? {
                                width: `calc(min(calc(100vw - 480px), 800px) * ${zoomFactor})`, // Dynamic width based on zoom
                                height: 'auto'
                            } : {
                                height: `calc(min(calc(100vh - 320px), 600px) * ${zoomFactor})`, // Dynamic height based on zoom
                                width: 'auto'
                            };
                        })()
                    }}
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

                    {/* Main Image content */}
                    {currentImage ? (
                        <div
                            className="relative w-full h-full overflow-hidden rounded-lg bg-background/50 ring-1 ring-black/5"
                        >
                            <div
                                className="w-full h-full flex items-center justify-center"
                            >
                                <motion.div
                                    key={currentImage}
                                    initial={wasJustGenerated ? { opacity: 0, filter: 'blur(80px) saturate(0.2)' } : { opacity: 1, filter: 'blur(0px) saturate(1)' }}
                                    animate={{
                                        opacity: 1,
                                        filter: 'blur(0px) saturate(1)',
                                    }}
                                    transition={wasJustGenerated ? {
                                        duration: 3.5,
                                        ease: [0.22, 1, 0.36, 1],
                                        filter: { duration: 4, ease: "linear" },
                                        opacity: { duration: 1.5 }
                                    } : {
                                        duration: 0.15
                                    }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <img
                                        src={currentImage}
                                        alt="Generated design"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* ... annotations ... */}
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
                    ) : (
                        // Empty state with visible frame matching aspect ratio
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
                </div>

                {currentImage && (
                    <div className="w-full max-w-[600px] mt-6 shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 z-10">
                        <GeneratedCopyCard
                            copy={generatedCopy}
                            hashtags={generatedHashtags}
                            isLoading={isGeneratingCopy}
                            onRegenerate={handleGenerateCopy}
                        />
                    </div>
                )}

                {/* Zoom Controls */}
                {currentImage && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-popover/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border">
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={handleZoomOut}>
                            <ZoomOutIcon fontSize="small" />
                        </Button>
                        <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={handleZoomIn}>
                            <ZoomInIcon fontSize="small" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer Area: History & Prompt */}
            <div className="border-t-2 border-border bg-muted/20">
                {/* Version History Row */}
                <div className="px-4 py-2 border-b-2 border-border/50">
                    <ScrollArea className="w-full">
                        <div className="flex gap-2 min-h-[70px] py-1">
                            {generations.map((gen) => (
                                <button
                                    key={gen.id}
                                    onClick={() => onSelectGeneration?.(gen)}
                                    className={`relative group flex-shrink-0 transition-all duration-200 ${currentImage === gen.image_url
                                        ? 'ring-2 ring-primary ring-offset-1 scale-105'
                                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <div className="w-14 h-14 rounded-lg overflow-hidden shadow-sm bg-muted border border-border/50">
                                        <img
                                            src={gen.image_url}
                                            alt={`Version ${gen.id}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>
                            ))}

                            {/* Empty slots placeholders */}
                            {Array.from({ length: Math.max(0, 5 - generations.length) }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="w-14 h-14 rounded-lg border border-dashed border-border/30 bg-muted/5 flex-shrink-0"
                                />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                {/* Staging Area / Context Drawer */}
                {selectedContext.length > 0 && (
                    <div
                        className="px-4 py-2 bg-background/50"
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

                                    {/* Label for non-image types */}
                                    {(item.type === 'color' || item.type === 'template' || item.type === 'font' || item.type === 'text' || item.type === 'link' || item.type === 'contact') && (
                                        <span className="text-[11px] font-medium max-w-[120px] truncate">
                                            {item.label || item.value}
                                        </span>
                                    )}

                                    <button
                                        onClick={() => onRemoveContext?.(item.id)}
                                        className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-destructive transition-colors ml-auto"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}

                            {/* Preview Chip while dragging */}
                            {isDraggingOver && draggedElement && !selectedContext.some(c => c.id === draggedElement.id) && (
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
                            )}
                        </div>
                    </div>
                )}

                {/* Prompt Input Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "p-3 pt-2 bg-background/50 backdrop-blur-md transition-all duration-300 relative",
                        isDraggingOver ? "bg-primary/10 ring-2 ring-primary ring-inset shadow-[0_0_20px_rgba(var(--primary),0.2)]" : ""
                    )}
                >
                    {isDraggingOver && (
                        <div className="absolute inset-x-0 -top-10 flex justify-center pointer-events-none animate-bounce">
                            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                Suelta para añadir al contexto
                            </div>
                        </div>
                    )}
                    <div className="relative max-w-5xl mx-auto flex gap-2 items-end">
                        <div className="relative flex-1">
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe los cambios..."
                                className="pr-12 min-h-[50px] max-h-[120px] py-3 resize-none bg-background/80 border-border/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl shadow-inner text-sm"
                            />
                            <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={() => setIsTemplateModalOpen(true)}
                                    title="Elegir Plantilla"
                                >
                                    <Layout className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            {(selectedModel && onModelChange) && (
                                <div className="flex gap-1">
                                    <Select value={selectedModel} onValueChange={onModelChange}>
                                        <SelectTrigger className="w-[140px] h-9 text-[10px] bg-background/50 border-border/50 shadow-none focus:ring-1 focus:ring-primary/30 rounded-xl">
                                            <SelectValue placeholder="Modelo Imagen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="wisdom/gemini-3.0-pro-image-01-preview" className="text-xs">Gemini 3.0 Pro Image 01 (Wisdom)</SelectItem>
                                            <SelectItem value="wisdom/qwen-image" className="text-xs">Qwen Image (Wisdom)</SelectItem>
                                            <SelectItem value="wisdom/seedream-4.0" className="text-xs">Seedream 4.0 (Wisdom)</SelectItem>
                                            <SelectItem value="models/gemini-3-pro-image-preview" className="text-xs">Gemini 3 Pro (Google Legacy)</SelectItem>
                                            <SelectItem value="models/gemini-2.5-flash-image" className="text-xs">Gemini 2.5 Flash (Google Legacy)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {(selectedTextModel && onTextModelChange) && (
                                        <Select value={selectedTextModel} onValueChange={onTextModelChange}>
                                            <SelectTrigger className="w-[140px] h-9 text-[10px] bg-background/50 border-border/50 shadow-none focus:ring-1 focus:ring-primary/30 rounded-xl">
                                                <SelectValue placeholder="Inteligencia" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="wisdom/gemini-2.5-flash" className="text-xs">Gemini 2.5 Flash (Wisdom)</SelectItem>
                                                <SelectItem value="wisdom/gemini-3-pro" className="text-xs">Gemini 3 Pro (Wisdom)</SelectItem>
                                                <SelectItem value="wisdom/gemini-3-flash" className="text-xs">Gemini 3 Flash (Wisdom)</SelectItem>
                                                <SelectItem value="google/gemini-flash-latest" className="text-xs">Gemini Flash Lite (Google)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            )}
                            <Button
                                size="sm"
                                className="h-10 px-4 btn-gradient rounded-xl font-semibold gap-2 shadow-lg glow-primary transition-transform active:scale-95 shrink-0"
                                disabled={isGenerating || (!prompt.trim() && selectedContext.length === 0)}
                                onClick={() => onGenerate(prompt, selectedModel)}
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="text-xs">Generando...</span>
                                        <span className="loading loading-spinner loading-xs"></span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xs">Generar</span>
                                        <AutoAwesomeIcon style={{ fontSize: 16 }} />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <TemplateSelectorModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelect={handleSelectTemplate}
                selectedTemplateId={selectedContext.find(c => c.type === 'template')?.id}
            />
        </div >
    )
}
