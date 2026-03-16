'use client'

import { Loader2 } from '@/components/ui/spinner'
;

import { useRef, KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { IconMonitor, IconBuilding, IconSparkles, IconImage, IconMaximize, IconDelete, IconUpload, IconInfo } from '@/components/ui/icons';
import { useTranslation } from 'react-i18next';

interface VisualAssetsProps {
    screenshotUrl?: string;
    logoUrl?: string;
    faviconUrl?: string;
    images: { url: string; selected?: boolean }[];
    isUploading: boolean;
    onUpload: (files: FileList | File[]) => void;
    onRemoveImage: (index: number) => void;
    onOpenLightbox: (url: string) => void;
    onToggleSelection?: (index: number) => void;
}

export function VisualAssets({
    screenshotUrl,
    logoUrl,
    faviconUrl,
    images,
    isUploading,
    onUpload,
    onRemoveImage,
    onOpenLightbox,
    onToggleSelection
}: VisualAssetsProps) {
    const { t } = useTranslation('brandKit');
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

    const handleKeyActivate = (event: KeyboardEvent<HTMLDivElement>, action: () => void) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Screenshot */}
            <div className="lg:col-span-1">
                <Card className="h-full overflow-hidden glass-panel border-0 shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                            <IconMonitor className="w-5 h-5 text-[var(--accent)]" />
                            {t('visualAssets.webScreenshotTitle', { defaultValue: 'Website screenshot' })}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                            {t('visualAssets.webScreenshotDescription', { defaultValue: 'Website preview' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden bg-muted/30">
                        {screenshotUrl ? (
                            <div className="w-full h-full flex items-start justify-center overflow-auto max-h-[400px] scrollbar-hide">
                                <img
                                    src={screenshotUrl}
                                    alt="Website Screenshot"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)] min-h-[200px]">
                                <IconMonitor className="w-10 h-10 opacity-20 mb-1" />
                                <p className="text-xs italic">{t('visualAssets.noScreenshot', { defaultValue: 'No screenshot available' })}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Logo, Favicon & Uploads */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Logo */}
                    <Card className="glass-panel border-0 shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base text-foreground">
                                <IconBuilding className="w-5 h-5 text-primary" />
                                {t('visualAssets.mainLogo', { defaultValue: 'Main logo' })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center p-4 min-h-[140px] transparency-grid border-border">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Brand Logo"
                                    className="max-w-full max-h-24 object-contain"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground opacity-50">
                                    <IconBuilding className="w-8 h-8 mb-1" />
                                    <p className="text-[10px]">{t('visualAssets.noLogo', { defaultValue: 'No logo' })}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Favicon */}
                    <Card className="glass-panel border-0 shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base text-foreground">
                                <IconSparkles className="w-5 h-5 text-primary" />
                                {t('visualAssets.faviconTitle', { defaultValue: 'Favicon' })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center p-4 min-h-[140px] transparency-grid border-border">
                            {faviconUrl ? (
                                <img
                                    src={faviconUrl}
                                    alt="Favicon"
                                    className="w-10 h-10 object-contain"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground opacity-50">
                                    <IconSparkles className="w-8 h-8 mb-1" />
                                    <p className="text-[10px]">{t('visualAssets.noFavicon', { defaultValue: 'No favicon' })}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Gallery & Upload */}
                <Card className="glass-panel border-0 shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                            <IconImage className="w-5 h-5 text-[var(--accent)]" />
                            {t('visualAssets.analyzedGallery', { defaultValue: 'Analyzed image gallery' })}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                            {t('visualAssets.extractedAssets', { defaultValue: 'Extracted visual assets' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 bg-muted/30">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {images.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border cursor-pointer transition-all duration-300",
                                        item.selected === false && "grayscale-[0] opacity-100"
                                    )}
                                    onClick={() => onOpenLightbox(item.url)}
                                    onKeyDown={(event) => handleKeyActivate(event, () => onOpenLightbox(item.url))}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={t('visualAssets.openInLightbox', { index: idx + 1, defaultValue: 'Open image {{index}} in viewer' })}
                                >
                                    <img
                                        src={item.url}
                                        alt={`Brand image ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

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
                                                "p-0.5 rounded-full",
                                                item.selected !== false ? "bg-white shadow-sm" : "bg-black/20"
                                            )}>
                                                <IconSparkles className={cn("w-3 h-3", item.selected !== false ? "text-primary" : "text-white")} />
                                            </div>
                                        </button>
                                    )}

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <IconMaximize className="w-6 h-6 text-white shadow-lg" />
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-1 -right-1 h-6 w-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveImage(idx);
                                        }}
                                    >
                                        <IconDelete className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                            {images.length < 10 && (
                                <div
                                    className={cn(
                                        "aspect-square border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1",
                                        isUploading && "opacity-50 pointer-events-none"
                                    )}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(event) => handleKeyActivate(event, () => fileInputRef.current?.click())}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={t('visualAssets.uploadNewImage', { defaultValue: 'Upload new image to the kit' })}
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files) onUpload(e.target.files);
                                        }}
                                    />
                                    {isUploading ? (
                                        <Loader2 className="w-6 h-6 text-muted-foreground" />
                                    ) : (
                                        <>
                                            <IconUpload className="w-5 h-5 text-[var(--text-secondary)]" />
                                            <span className="text-[10px] font-medium text-[var(--text-secondary)]">{t('visualAssets.upload', { defaultValue: 'Upload' })}</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style jsx>{`
                .transparency-grid {
                    background-image:
                        linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(0,0,0,0.05) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.05) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.05) 75%);
                    background-size: 16px 16px;
                    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
                }
            `}</style>
        </div>
    );
}


