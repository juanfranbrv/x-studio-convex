'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';


import {
    Monitor,
    Building2,
    Sparkles,
    Image,
    Maximize2,
    Trash2,
    Upload,
    Loader2,
    Check
} from 'lucide-react';

// --- Interfaces ---
interface LogoCardProps {
    logoUrl?: string; // Legacy support
    logos?: { url: string; selected?: boolean }[];
    onUpload?: (files: FileList | File[]) => void;
    onRemove?: (index: number) => void;
    onToggle?: (index: number) => void;
    isUploading?: boolean;
}

interface FaviconCardProps {
    faviconUrl?: string;
}

interface ScreenshotCardProps {
    screenshotUrl?: string;
}

interface ImageGalleryProps {
    images: { url: string; selected?: boolean }[];
    isUploading: boolean;
    onUpload: (files: FileList | File[]) => void;
    onRemoveImage: (index: number) => void;
    onOpenLightbox: (url: string) => void;
    onToggleSelection?: (index: number) => void;
}

// --- Components ---

export function LogoCard({ logoUrl, logos = [], onUpload, onRemove, onToggle, isUploading }: LogoCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Si no hay array de logos pero hay logoUrl, lo tratamos como el único logo
    const effectiveLogos = logos.length > 0
        ? logos
        : (logoUrl ? [{ url: logoUrl, selected: true }] : []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="h-full bg-card border-border shadow-sm flex flex-col">
            <CardHeader className="pb-2 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-base text-foreground justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Logo de marca
                    </div>
                    <span className="text-xs font-normal text-muted-foreground">
                        {effectiveLogos.length}/6
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                {effectiveLogos.length === 0 ? (
                    <div
                        className="h-full min-h-[120px] flex flex-col items-center justify-center text-muted-foreground opacity-50 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 hover:text-accent-foreground transition-all"
                        onClick={handleUploadClick}
                    >
                        <Building2 className="w-8 h-8 mb-2" />
                        <p className="text-xs">Subir logos (Max 6)</p>
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                if (e.target.files && onUpload) onUpload(e.target.files);
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2 h-full content-start">
                        {effectiveLogos.map((logo, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "group relative aspect-square rounded-md overflow-hidden border transition-all cursor-pointer transparency-grid",
                                    logo.selected !== false
                                        ? "border-primary shadow-sm"
                                        : "border-border opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                                )}
                                onClick={() => onToggle && onToggle(idx)}
                            >
                                <img
                                    src={logo.url} /* Safe access, transparency-grid handles bg */
                                    alt={`Logo ${idx + 1}`}
                                    className="w-full h-full object-contain p-1"
                                />
                                {logo.selected !== false && (
                                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                                        <Check className="w-2 h-2" />
                                    </div>
                                )}
                                {onRemove && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(idx);
                                        }}
                                        className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    >
                                        <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Upload Button inside Grid */}
                        {effectiveLogos.length < 6 && (
                            <div
                                className={cn(
                                    "aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-colors gap-1 text-muted-foreground hover:text-primary",
                                    isUploading && "opacity-50 pointer-events-none"
                                )}
                                onClick={handleUploadClick}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files && onUpload) onUpload(e.target.files);
                                    }}
                                />
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Upload className="w-5 h-5" />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function FaviconCard({ faviconUrl }: FaviconCardProps) {
    return (
        <Card className="h-full bg-card border-border shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Favicon
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4 min-h-[140px] transparency-grid border-t border-border">
                {faviconUrl ? (
                    <img
                        src={faviconUrl}
                        alt="Favicon"
                        className="w-12 h-12 object-contain"
                    />
                ) : (
                    <div className="text-center text-muted-foreground opacity-50">
                        <Sparkles className="w-8 h-8 mb-1" />
                        <p className="text-[10px]">Sin favicon</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function ScreenshotCard({ screenshotUrl }: ScreenshotCardProps) {
    return (
        <Card className="h-full overflow-hidden bg-card border-border shadow-sm flex flex-col">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Monitor className="w-5 h-5 text-primary" />
                    Captura Web
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden bg-muted/30 flex-1 relative min-h-[300px]">
                {screenshotUrl ? (
                    <div className="absolute inset-0 overflow-auto scrollbar-hide">
                        <img
                            src={screenshotUrl}
                            alt="Website Screenshot"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)]">
                        <Monitor className="w-12 h-12 opacity-20 mb-2" />
                        <p className="text-sm italic">No hay captura disponible</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function ImageGallery({
    images,
    isUploading,
    onUpload,
    onRemoveImage,
    onOpenLightbox,
    onToggleSelection
}: ImageGalleryProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Card className="bg-card border-border shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Image className="w-5 h-5 text-primary" />
                    Galería de imágenes analizadas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((item, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 transparency-grid",
                                item.selected === false && "grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100"
                            )}
                            onClick={() => onOpenLightbox(item.url)}
                        >
                            <img
                                src={item.url}
                                alt={`Brand image ${idx + 1} `}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Selection Toggle */}
                            {onToggleSelection && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleSelection(idx);
                                    }}
                                    className={cn(
                                        "absolute top-2 left-2 flex items-center justify-center transition-all duration-200 z-30",
                                        item.selected !== false
                                            ? "text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] scale-110 opacity-100"
                                            : "text-white/20 scale-90 opacity-0 group-hover:opacity-100 hover:text-white/60 hover:scale-110"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1 rounded-full",
                                        item.selected !== false ? "bg-white shadow-sm" : "bg-black/20"
                                    )}>
                                        <Check className={cn("w-3.5 h-3.5", item.selected !== false ? "text-primary" : "text-white")} />
                                    </div>
                                </button>
                            )}

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Maximize2 className="w-7 h-7 text-white" />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveImage(idx);
                                }}
                                className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 shadow-lg z-10"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {images.length < 20 && (
                        <div
                            className={cn(
                                "aspect-square border-2 border-dashed border-border hover:border-sidebar-primary hover:bg-sidebar-primary/5 rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-sidebar-primary",
                                isUploading && "opacity-50 pointer-events-none"
                            )}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) onUpload(e.target.files);
                                }}
                            />
                            {isUploading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
                            ) : (
                                <>
                                    <Upload className="w-7 h-7" />
                                    <span className="text-xs font-medium">Subir</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {images.length === 0 && !isUploading && (
                    <p className="text-center text-sm text-[var(--text-secondary)] py-8 italic opacity-60">
                        No se encontraron imágenes adicionales en el sitio.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
