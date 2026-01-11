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
    images: { url: string }[];
    isUploading: boolean;
    onUpload: (files: FileList | File[]) => void;
    onRemoveImage: (index: number) => void;
    onOpenLightbox: (url: string) => void;
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
        <Card className="h-full glass-panel border-0 shadow-none flex flex-col">
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
                                    <div className="absolute top-1 left-1 bg-primary text-white rounded-full p-0.5 shadow-sm">
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
        <Card className="h-full glass-panel border-0 shadow-none">
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
        <Card className="h-full overflow-hidden glass-panel border-0 shadow-none flex flex-col">
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
    onOpenLightbox
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

    // Bento Grid pattern: some cards are larger
    const getBentoClass = (index: number) => {
        // Every 5th and 6th item is larger (spans 2 columns)
        if ((index % 7 === 4) || (index % 7 === 5)) {
            return "md:col-span-2";
        }
        return "col-span-1";
    };

    return (
        <Card className="glass-panel border-0 shadow-aero">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Image className="w-5 h-5 text-primary" />
                    Galería de imágenes
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {images.map((item, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "group relative rounded-2xl overflow-hidden bg-muted border border-border cursor-pointer shadow-aero hover:shadow-aero-glow transition-all duration-300 transparency-grid",
                                getBentoClass(idx)
                            )}
                            onClick={() => onOpenLightbox(item.url)}
                        >
                            <img
                                src={item.url}
                                alt={`Brand image ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />


                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Maximize2 className="w-8 h-8 text-white drop-shadow-lg" />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveImage(idx);
                                }}
                                className="absolute top-3 right-3 w-7 h-7 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 shadow-aero-lg z-10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {/* Upload Card */}
                    {images.length < 50 && (
                        <div
                            className={cn(
                                "border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary",
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
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8" />
                                    <span className="text-xs font-medium">Subir imágenes</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {images.length === 0 && !isUploading && (
                    <div className="text-center py-12">
                        <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <p className="text-sm text-muted-foreground italic opacity-60">
                            No se encontraron imágenes adicionales en el sitio.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
