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
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Generation {
    id: string
    image_url: string
    created_at: string
}

interface CanvasPanelProps {
    currentImage?: string | null
    generations?: Generation[]
    onSelectGeneration?: (generation: Generation) => void
    onAnnotate?: () => void
    isAnnotating?: boolean
}

export function CanvasPanel({
    currentImage,
    generations = [],
    onSelectGeneration,
    onAnnotate,
    isAnnotating = false,
}: CanvasPanelProps) {
    const { t } = useTranslation()
    const [zoom, setZoom] = useState(100)

    const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200))
    const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50))
    const handleResetZoom = () => setZoom(100)

    return (
        <div className="flex-1 flex flex-col h-full bg-background">
            {/* Canvas Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
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
            <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
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
                        <div className="w-32 h-32 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                            <span className="text-5xl">🎨</span>
                        </div>
                        <p className="text-lg">{t('canvas.noImage')}</p>
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

            {/* Version History */}
            {generations.length > 0 && (
                <div className="border-t border-border p-4">
                    <h3 className="text-sm font-medium mb-3">{t('canvas.versionHistory')}</h3>
                    <ScrollArea className="w-full">
                        <div className="flex gap-3">
                            {generations.map((gen) => (
                                <button
                                    key={gen.id}
                                    onClick={() => onSelectGeneration?.(gen)}
                                    className={`version-thumb flex-shrink-0 ${currentImage === gen.image_url ? 'active' : ''
                                        }`}
                                >
                                    <img
                                        src={gen.image_url}
                                        alt={`Version ${gen.id}`}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1 text-center">
                                        {new Date(gen.created_at).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}
