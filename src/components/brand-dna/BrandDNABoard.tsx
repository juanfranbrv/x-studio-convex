'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { BrandDNA } from '@/lib/brand-types';
import { TextAssetsSection } from './TextAssetsSection';
import { ColorPalette } from './ColorPalette';
import { LogoCard, FaviconCard, ScreenshotCard, ImageGallery } from './VisualAssetComponents';
import { BrandAssets } from './BrandAssets';
import { TypographySection } from './TypographySection';
import { TechnicalAudit } from './TechnicalAudit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrandKit } from '@/contexts/BrandKitContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { uploadBrandImage } from '@/app/actions/upload-image';
import { updateUserBrandKit } from '@/app/actions/update-user-brand-kit';

import { Save, Download, CheckCircle, RotateCcw, AlertCircle, X, Check, Pencil, Plus } from 'lucide-react';

interface BrandDNABoardProps {
    data: BrandDNA;
    isDebug?: boolean;
    onRegenerate?: () => void;
    onNewBrandKit?: () => void;
    onSaveSuccess?: () => void;
}

export function BrandDNABoard({ data: initialData, isDebug = false, onRegenerate, onNewBrandKit, onSaveSuccess }: BrandDNABoardProps) {
    const { user } = useUser();
    const { syncActiveBrandKit } = useBrandKit();
    const [data, setData] = useState<BrandDNA>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [errorModal, setErrorModal] = useState<{ open: boolean; title: string; message: string }>({
        open: false,
        title: '',
        message: ''
    });
    const [isEditingBrandName, setIsEditingBrandName] = useState(false);
    const [brandNameEdit, setBrandNameEdit] = useState(initialData.brand_name);

    const handleSave = async (isAuto = false) => {
        if (!user || !hasUnsavedChanges) return;
        if (!data.id) {
            console.error('❌ Cannot save: Brand Kit ID is missing.', data);
            setErrorModal({
                open: true,
                title: 'Error de Identificador',
                message: 'No se puede guardar porque falta el ID del Brand Kit. Intente recargar la página o regenerar.'
            });
            return;
        }

        setIsSaving(true);
        try {
            const result = await updateUserBrandKit(data.id || '', data);
            if (result.success) {
                setHasUnsavedChanges(false);
                setLastSaved(new Date());
                // Importante: sincronizar con el contexto sin recargar todo
                syncActiveBrandKit?.(data);

                // Solo llamar a onSaveSuccess si NO es autoguardado para evitar re-refrescos silenciosos en la UI global
                if (onSaveSuccess && !isAuto) onSaveSuccess();
            } else {
                throw new Error(result.error || 'Error al guardar');
            }
        } catch (error: any) {
            console.error('Error saving brand kit:', error);
            setErrorModal({
                open: true,
                title: 'Error al Guardar',
                message: error.message || 'No se pudo sincronizar los cambios con la base de datos.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save logic
    useEffect(() => {
        if (hasUnsavedChanges && !isSaving) {
            const timer = setTimeout(() => {
                handleSave(true); // Is auto-save
            }, 10000); // 10 seconds debounce for auto-save
            return () => clearTimeout(timer);
        }
    }, [data, hasUnsavedChanges, isSaving]);

    const updateData = useCallback((updater: (prev: BrandDNA) => BrandDNA) => {
        setData(prev => {
            const newData = updater(prev);
            setHasUnsavedChanges(true);
            return newData;
        });
    }, []);

    // Handlers
    const handleAddColor = () => {
        updateData(prev => ({
            ...prev,
            colors: [...(prev.colors || []), { color: '#cccccc', sources: ['user'], score: 1, role: 'Neutral' }]
        }));
    };

    const handleRemoveColor = (index: number) => {
        updateData(prev => ({
            ...prev,
            colors: prev.colors?.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateColor = (index: number, newColor: string) => {
        updateData(prev => ({
            ...prev,
            colors: prev.colors?.map((c, i) => i === index ? { ...c, color: newColor } : c)
        }));
    };

    const handleUpdateColorRole = (index: number, newRole: string) => {
        updateData(prev => ({
            ...prev,
            colors: prev.colors?.map((c, i) => i === index ? { ...c, role: newRole } : c)
        }));
    };

    const handleResetColors = () => {
        updateData(prev => ({
            ...prev,
            colors: initialData.colors
        }));
    };

    const handleToggleImageSelection = (index: number) => {
        updateData(prev => ({
            ...prev,
            images: prev.images?.map((img, i) =>
                i === index ? { ...img, selected: !img.selected } : img
            ) || []
        }));
    };

    const handleUploadFiles = async (files: FileList | File[]) => {
        if (!user) return;
        setIsUploading(true);
        try {
            const fileArray = Array.from(files);
            for (const file of fileArray) {
                if (file.size > 3 * 1024 * 1024) {
                    throw new Error(`La imagen ${file.name} supera los 3MB permitidos.`);
                }
                const formData = new FormData();
                formData.append('file', file);
                const result = await uploadBrandImage(formData);
                if (result.success && result.url) {
                    updateData(prev => ({
                        ...prev,
                        images: [...(prev.images || []), { url: result.url!, selected: true }]
                    }));
                } else {
                    throw new Error(result.error || 'Error al subir imagen');
                }
            }
        } catch (error: any) {
            setErrorModal({ open: true, title: 'Error de Subida', message: error.message });
        } finally {
            setIsUploading(false);
        }
    };

    // LOGO HANDLERS
    const handleToggleLogoSelection = (index: number) => {
        updateData(prev => {
            const currentLogos = prev.logos || (prev.logo_url ? [{ url: prev.logo_url, selected: true }] : []);
            const newLogos = currentLogos.map((logo, i) =>
                i === index ? { ...logo, selected: !logo.selected } : logo
            );

            // Find the first selected logo to be the primary logo_url
            const firstSelected = newLogos.find(l => l.selected !== false);

            return {
                ...prev,
                logos: newLogos,
                logo_url: firstSelected ? firstSelected.url : undefined
            };
        });
    };

    const handleRemoveLogo = (index: number) => {
        updateData(prev => {
            const currentLogos = prev.logos || (prev.logo_url ? [{ url: prev.logo_url, selected: true }] : []);
            const newLogos = currentLogos.filter((_, i) => i !== index);

            // Find the first selected logo to be the primary logo_url
            const firstSelected = newLogos.find(l => l.selected !== false);

            return {
                ...prev,
                logos: newLogos,
                logo_url: firstSelected ? firstSelected.url : undefined
            };
        });
    };

    const handleUploadLogos = async (files: FileList | File[]) => {
        if (!user) return;

        // Check limit
        const currentCount = (data.logos?.length || (data.logo_url ? 1 : 0));
        if (currentCount + files.length > 5) {
            setErrorModal({
                open: true,
                title: 'Límite Excedido',
                message: 'Solo puedes tener hasta 5 logos.'
            });
            return;
        }

        setIsUploading(true);
        try {
            const fileArray = Array.from(files);
            const newLogos: { url: string; selected: boolean }[] = [];

            for (const file of fileArray) {
                if (file.size > 3 * 1024 * 1024) {
                    throw new Error(`El archivo ${file.name} supera los 3MB permitidos.`);
                }
                const formData = new FormData();
                formData.append('file', file);
                const result = await uploadBrandImage(formData);
                if (result.success && result.url) {
                    newLogos.push({ url: result.url!, selected: true });
                } else {
                    throw new Error(result.error || 'Error al subir logo');
                }
            }

            if (newLogos.length > 0) {
                updateData(prev => {
                    const currentLogos = prev.logos || (prev.logo_url ? [{ url: prev.logo_url, selected: true }] : []);
                    const updatedLogos = [...currentLogos, ...newLogos];

                    // If we didn't have a logo_url, set it to the first new one
                    const newLogoUrl = prev.logo_url || newLogos[0].url;

                    return {
                        ...prev,
                        logos: updatedLogos,
                        logo_url: newLogoUrl
                    };
                });
            }

        } catch (error: any) {
            setErrorModal({ open: true, title: 'Error de Subida', message: error.message });
        } finally {
            setIsUploading(false);
        }
    };

    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `brand-dna-${data.brand_name?.toLowerCase().replace(/\s+/g, '-')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header / Save Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shadow-sm">
                        {data.logo_url ? (
                            <img src={data.logo_url} className="w-8 h-8 object-contain" alt="Logo" />
                        ) : (
                            <span className="text-xl font-bold">{data.brand_name?.[0]}</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 group">
                            {isEditingBrandName ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={brandNameEdit}
                                        onChange={(e) => setBrandNameEdit(e.target.value)}
                                        className="text-xl font-bold h-9 px-2 border-primary"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setData({ ...data, brand_name: brandNameEdit });
                                                setHasUnsavedChanges(true);
                                                setIsEditingBrandName(false);
                                            }
                                            if (e.key === 'Escape') {
                                                setBrandNameEdit(data.brand_name);
                                                setIsEditingBrandName(false);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            setData({ ...data, brand_name: brandNameEdit });
                                            setHasUnsavedChanges(true);
                                            setIsEditingBrandName(false);
                                        }}
                                        className="p-1 rounded hover:bg-muted"
                                    >
                                        <Check className="w-4 h-4 text-green-500" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setBrandNameEdit(data.brand_name);
                                            setIsEditingBrandName(false);
                                        }}
                                        className="p-1 rounded hover:bg-muted"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-foreground">{data.brand_name}</h2>
                                    <button
                                        onClick={() => {
                                            setBrandNameEdit(data.brand_name);
                                            setIsEditingBrandName(true);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                                    >
                                        <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {isSaving ? (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium animate-pulse">
                                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando cambios...
                                </div>
                            ) : hasUnsavedChanges ? (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <Save className="w-4 h-4 mr-2" />
                                    Cambios locales pendientes
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Sincronizado
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {onRegenerate && (
                        <Button variant="ghost" size="sm" onClick={onRegenerate} className="gap-2 h-9 text-muted-foreground hover:text-destructive">
                            <RotateCcw className="w-4 h-4" />
                            Regenerar
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-2 h-9">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                    <Button size="sm" onClick={() => handleSave(false)} disabled={!hasUnsavedChanges || isSaving} className="gap-2 h-9">
                        {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Ahora
                    </Button>
                </div>
            </div>

            {/* NEW LAYOUT IMPLEMENTATION */}

            {/* Top Section: Branding & Screenshot */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left Column: Identities & Palette */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 h-[200px]">
                        <LogoCard
                            logoUrl={data.logo_url}
                            logos={data.logos}
                            onUpload={handleUploadLogos}
                            onRemove={handleRemoveLogo}
                            onToggle={handleToggleLogoSelection}
                            isUploading={isUploading}
                        />
                        <FaviconCard faviconUrl={data.favicon_url} />
                    </div>
                    <ColorPalette
                        colors={data.colors || []}
                        isEdited={JSON.stringify(data.colors) !== JSON.stringify(initialData.colors)}
                        onUpdateColor={handleUpdateColor}
                        onUpdateRole={handleUpdateColorRole}
                        onRemoveColor={handleRemoveColor}
                        onAddColor={handleAddColor}
                        onReset={handleResetColors}
                    />
                </div>

                {/* Right Column: Screenshot */}
                <div className="h-full min-h-[400px]">
                    <ScreenshotCard screenshotUrl={data.screenshot_url} />
                </div>
            </div>

            {/* Middle Section: Typography & Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TypographySection
                    fonts={data.fonts || []}
                    tagline={data.tagline || ''}
                    onAddFont={(f) => updateData(prev => ({ ...prev, fonts: [...(prev.fonts || []), f] }))}
                    onRemoveFont={(idx) => updateData(prev => ({ ...prev, fonts: prev.fonts?.filter((_, i) => i !== idx) }))}
                />
                <BrandAssets
                    tagline={data.tagline || ''}
                    business_overview={data.business_overview || ''}
                    values={data.brand_values || []}
                    aesthetic={data.visual_aesthetic || []}
                    tone={data.tone_of_voice || []}
                    onUpdateTagline={(val) => updateData(prev => ({ ...prev, tagline: val }))}
                    onUpdateOverview={(val) => updateData(prev => ({ ...prev, business_overview: val }))}
                    onUpdateValue={(index, val) => {
                        updateData(prev => ({
                            ...prev,
                            brand_values: (prev.brand_values || []).map((v, i) => i === index ? val : v)
                        }));
                    }}
                    onAddValue={() => updateData(prev => ({ ...prev, brand_values: [...(prev.brand_values || []), 'Nuevo Valor'] }))}
                    onRemoveValue={(idx) => updateData(prev => ({ ...prev, brand_values: prev.brand_values?.filter((_, i) => i !== idx) }))}
                    onUpdateAesthetic={(idx, val) => updateData(prev => ({ ...prev, visual_aesthetic: prev.visual_aesthetic?.map((v, i) => i === idx ? val : v) }))}
                    onAddAesthetic={() => updateData(prev => ({ ...prev, visual_aesthetic: [...(prev.visual_aesthetic || []), 'Nueva Estética'] }))}
                    onRemoveAesthetic={(idx) => updateData(prev => ({ ...prev, visual_aesthetic: prev.visual_aesthetic?.filter((_, i) => i !== idx) }))}
                    onUpdateTone={(idx, val) => updateData(prev => ({ ...prev, tone_of_voice: prev.tone_of_voice?.map((v, i) => i === idx ? val : v) }))}
                    onAddTone={() => updateData(prev => ({ ...prev, tone_of_voice: [...(prev.tone_of_voice || []), 'Nuevo Tono'] }))}
                    onRemoveTone={(idx) => updateData(prev => ({ ...prev, tone_of_voice: prev.tone_of_voice?.filter((_, i) => i !== idx) }))}
                />
            </div>

            {/* Bottom Section: Text Assets & Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Text Assets */}
                <TextAssetsSection
                    data={data.text_assets}
                    onChange={(newTextAssets) => {
                        updateData(prev => ({
                            ...prev,
                            text_assets: newTextAssets,
                            // Keep business_overview in sync with brand_context if updated
                            business_overview: newTextAssets.brand_context || prev.business_overview
                        }));
                    }}
                />

                {/* Right: Gallery */}
                <ImageGallery
                    images={data.images || []}
                    isUploading={isUploading}
                    onUpload={handleUploadFiles}
                    onRemoveImage={(idx) => updateData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                    onToggleSelection={handleToggleImageSelection}
                    onOpenLightbox={setLightboxImage}
                />
            </div>

            {/* Technical Audit (Debug) */}
            {(isDebug || isDebug) && <TechnicalAudit data={data} />}

            {/* Lightbox */}
            {
                lightboxImage && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setLightboxImage(null)}
                    >
                        <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
                            <img src={lightboxImage} alt="Full size" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                            <button className="absolute -top-12 right-0 p-2 text-white hover:text-accent transition-colors" onClick={() => setLightboxImage(null)}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Error Dialog */}
            <Dialog open={errorModal.open} onOpenChange={(open) => setErrorModal(prev => ({ ...prev, open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                            {errorModal.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {errorModal.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setErrorModal(prev => ({ ...prev, open: false }))}>
                            Entendido
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
