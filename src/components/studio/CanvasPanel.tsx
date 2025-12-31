'use client'

import { useState } from 'react'
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
import { TemplateSelectorModal, Template } from './TemplateSelectorModal'
import { ContextElement } from '@/app/studio/page'
import { Layout, X, Image as ImageIcon, Type, FileText, Link2, AtSign } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    onGenerate: (prompt: string) => void
    isGenerating: boolean
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
    isGenerating
}: CanvasPanelProps) {
    const { t } = useTranslation()
    const [zoom, setZoom] = useState(100)
    const [prompt, setPrompt] = useState('')
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200))
    const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50))
    const handleResetZoom = () => setZoom(100)

    const handleSelectTemplate = (template: Template) => {
        onAddContext?.({
            id: template.id,
            type: 'template',
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
                    <Button variant="ghost" size="icon">
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

            {/* Main Canvas Area */}
            <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                {currentImage ? (
                    <div
                        className="relative transition-transform duration-200"
                        style={{ transform: `scale(${zoom / 100})` }}
                    >
                        <img
                            src={currentImage}
                            alt="Generated design"
                            className="max-w-full max-h-[60vh] rounded-lg shadow-2xl object-contain"
                        />

                        {/* Annotation overlay example (dashed circle from mockup) */}
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
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-3">
                            <span className="text-3xl">🎨</span>
                        </div>
                        <p className="text-base font-medium text-muted-foreground/80">{t('canvas.noImage')}</p>
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
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={handleResetZoom}>
                            <RestartAltIcon fontSize="small" />
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

                        <Button
                            size="sm"
                            className="h-10 px-4 btn-gradient rounded-xl font-semibold gap-2 shadow-lg glow-primary transition-transform active:scale-95 shrink-0 mb-1"
                            disabled={isGenerating || (!prompt.trim() && selectedContext.length === 0)}
                            onClick={() => onGenerate(prompt)}
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

            <TemplateSelectorModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelect={handleSelectTemplate}
                selectedTemplateId={selectedContext.find(c => c.type === 'template')?.id}
            />
        </div >
    )
}
