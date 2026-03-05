'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { BrandDNA } from '@/lib/brand-types';
import { cn } from '@/lib/utils';
import { TextAssetsSection } from './TextAssetsSection';
import { ColorPalette } from './ColorPalette';
import { LogoCard, FaviconCard, ScreenshotCard, ImageGallery } from './VisualAssetComponents';
import { BrandAssets } from './BrandAssets';
import { TypographySection } from './TypographySection';
import { BrandContextCard } from './BrandContextCard';
import { TechnicalAudit } from './TechnicalAudit';
import { ContactSocialCard } from './ContactSocialCard';
import { TargetAudienceCard } from './TargetAudienceCard';
import { BrandKitAssistantWizard } from './BrandKitAssistantWizard';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrandKit } from '@/contexts/BrandKitContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { uploadBrandImage } from '@/app/actions/upload-image';
import { updateUserBrandKit } from '@/app/actions/update-user-brand-kit';
import { hexToRgb } from '@/lib/color-utils';
import { calculateBrandKitCompleteness } from '@/lib/brand-kit-utils';

import { Save, Download, CheckCircle, RotateCcw, AlertCircle, X, Bug, Globe, ListChecks } from 'lucide-react';

interface BrandDNABoardProps {
    data: BrandDNA;
    isDebug?: boolean;
    allowAssistantExit?: boolean;
    assistantCreationMode?: boolean;
    onAbortAssistantCreation?: () => Promise<void> | void;
    onCompleteAssistantCreation?: () => void;
    onRegenerate?: (urlOverride?: string) => void;
    onAnalyzeUrlFromAssistant?: (urlOverride?: string) => void;
    onPreviewUrlFromAssistant?: (url: string) => Promise<{
        success: boolean;
        url: string;
        title?: string;
        screenshotUrl?: string;
        error?: string;
    }>;
    onNewBrandKit?: () => void;
    onSaveSuccess?: () => void;
}

function colorLuminance(hex?: string): number {
    if (!hex) return 1;
    const rgb = hexToRgb(hex);
    if (!rgb) return 1;
    return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
}

function normalizeStudioColorRoles(payload: BrandDNA): BrandDNA {
    const colors = Array.isArray(payload.colors) ? [...payload.colors] : [];
    if (colors.length === 0) return payload;

    const roleNormalized = colors.map((c) => {
        const role = (c.role || '').toString().trim().toLowerCase();
        let normalizedRole: 'Fondo' | 'Texto' | 'Acento' = 'Acento';
        if (role.includes('fondo') || role.includes('background')) normalizedRole = 'Fondo';
        else if (role.includes('texto') || role.includes('text')) normalizedRole = 'Texto';
        return { ...c, role: normalizedRole };
    });

    const hasFondo = roleNormalized.some((c) => c.role === 'Fondo');
    const hasTexto = roleNormalized.some((c) => c.role === 'Texto');

    // Si la paleta no cumple contrato, la reescribimos con la regla de producto.
    if (!hasFondo || !hasTexto) {
        // Fondo = primer color
        roleNormalized[0] = { ...roleNormalized[0], role: 'Fondo' };

        // Texto = color mas oscuro entre el resto
        if (roleNormalized.length > 1) {
            let darkestIdx = 1;
            let darkestLum = colorLuminance(roleNormalized[1].color);
            for (let i = 2; i < roleNormalized.length; i++) {
                const lum = colorLuminance(roleNormalized[i].color);
                if (lum < darkestLum) {
                    darkestLum = lum;
                    darkestIdx = i;
                }
            }
            roleNormalized.forEach((c, i) => {
                if (i === 0) return;
                roleNormalized[i] = { ...c, role: i === darkestIdx ? 'Texto' : 'Acento' };
            });
        }
    }

    return {
        ...payload,
        colors: roleNormalized,
    };
}

export function BrandDNABoard({
    data: initialData,
    isDebug = false,
    allowAssistantExit = false,
    assistantCreationMode = false,
    onAbortAssistantCreation,
    onCompleteAssistantCreation,
    onRegenerate,
    onAnalyzeUrlFromAssistant,
    onPreviewUrlFromAssistant,
    onNewBrandKit,
    onSaveSuccess
}: BrandDNABoardProps) {
    const ASSISTANT_LOCK_KEY = 'brand-kit-assistant-lock';
    const { user } = useUser();
    const { syncActiveBrandKit } = useBrandKit();
    const [data, setData] = useState<BrandDNA>(() => normalizeStudioColorRoles(initialData));
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
    const [showDebug, setShowDebug] = useState(isDebug);
    const [showAssistantWizard, setShowAssistantWizard] = useState(false);
    const [assistantFlowLocked, setAssistantFlowLocked] = useState(false);
    const canUseDebugAudit = isDebug;
    const rawBrandUrl = (data.url || '').trim();
    const isManualPlaceholderUrl = rawBrandUrl.toLowerCase().startsWith('manual-');
    const normalizedAnalysisUrl = (() => {
        if (!rawBrandUrl || isManualPlaceholderUrl) return null;
        try {
            const withProtocol = rawBrandUrl.startsWith('http://') || rawBrandUrl.startsWith('https://')
                ? rawBrandUrl
                : `https://${rawBrandUrl}`;
            return new URL(withProtocol).toString();
        } catch {
            return null;
        }
    })();
    const completeness = calculateBrandKitCompleteness(data);
    const assistantPriorityMode = completeness.percentage < 70;
    const mustForceAssistant = (assistantPriorityMode || assistantFlowLocked) && !allowAssistantExit;

    useEffect(() => {
        setData(normalizeStudioColorRoles(initialData));
    }, [initialData]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const locked = window.sessionStorage.getItem(ASSISTANT_LOCK_KEY) === '1';
        if (locked) {
            setAssistantFlowLocked(true);
            setShowAssistantWizard(true);
        }
    }, []);

    useEffect(() => {
        if (!data?.id) return;
        if (assistantPriorityMode && !allowAssistantExit) {
            setAssistantFlowLocked(true);
            if (typeof window !== 'undefined') {
                window.sessionStorage.setItem(ASSISTANT_LOCK_KEY, '1');
            }
            setShowAssistantWizard(true);
            return;
        }
        if (assistantFlowLocked && !allowAssistantExit) {
            setShowAssistantWizard(true);
            return;
        }
        const key = `brand-kit-wizard-dismissed:${data.id}`;
        const dismissed = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : '1';
        const shouldSuggestWizard = isManualPlaceholderUrl;
        if (shouldSuggestWizard && !dismissed) {
            setShowAssistantWizard(true);
        }
    }, [data?.id, isManualPlaceholderUrl, assistantPriorityMode, assistantFlowLocked, allowAssistantExit]);

    const handleWizardOpenChange = (open: boolean) => {
        if (!open && mustForceAssistant) return;
        if (!open && assistantCreationMode) {
            void onAbortAssistantCreation?.();
            return;
        }
        setShowAssistantWizard(open);
        if (!open && data?.id && typeof window !== 'undefined') {
            window.sessionStorage.setItem(`brand-kit-wizard-dismissed:${data.id}`, '1');
        }
    };


    const handleSave = async (isAuto = false) => {
        if (!user || !hasUnsavedChanges) return;
        if (!data.id) {
            console.error('âŒ Cannot save: Brand Kit ID is missing.', data);
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
                        images: [...(prev.images || []), { url: result.url! }]
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

    const handleReorderLogos = (fromIndex: number, toIndex: number) => {
        updateData(prev => {
            const currentLogos = prev.logos || (prev.logo_url ? [{ url: prev.logo_url, selected: true }] : []);
            if (
                fromIndex < 0
                || toIndex < 0
                || fromIndex >= currentLogos.length
                || toIndex >= currentLogos.length
                || fromIndex === toIndex
            ) {
                return prev;
            }

            const reordered = [...currentLogos];
            const [moved] = reordered.splice(fromIndex, 1);
            reordered.splice(toIndex, 0, moved);

            const firstSelected = reordered.find(l => l.selected !== false);

            return {
                ...prev,
                logos: reordered,
                logo_url: firstSelected ? firstSelected.url : undefined
            };
        });
    };

    const handleUploadLogos = async (files: FileList | File[]) => {
        if (!user) return;

        // Check limit
        const currentCount = (data.logos?.length || (data.logo_url ? 1 : 0));
        if (currentCount + files.length > 6) {
            setErrorModal({
                open: true,
                title: 'Límite Excedido',
                message: 'Solo puedes tener hasta 6 logos.'
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

    const handleUpdateContact = (contactData: { socialLinks: { platform: string; url: string; username?: string }[], emails: string[], phones: string[], addresses: string[] }) => {
        updateData(prev => ({
            ...prev,
            social_links: contactData.socialLinks,
            emails: contactData.emails,
            phones: contactData.phones,
            addresses: contactData.addresses
        }));
    };

    const handleAddFont = (font: string) => {
        updateData(prev => ({ ...prev, fonts: [...(prev.fonts || []), { family: font }] }));
    };

    const handleRemoveFont = (idx: number) => {
        updateData(prev => ({ ...prev, fonts: prev.fonts?.filter((_, i) => i !== idx) }));
    };

    const handleUpdateFontRole = (idx: number, role?: 'heading' | 'body') => {
        updateData(prev => ({
            ...prev,
            fonts: (prev.fonts || []).map((f, i) => {
                const fontObj = typeof f === 'string' ? { family: f } : f;
                return i === idx ? { ...fontObj, role } : f;
            })
        }));
    };

    const handleSelectFontForRole = (family: string, role: 'heading' | 'body') => {
        updateData(prev => {
            const normalizedFonts = (prev.fonts || []).map((f) => typeof f === 'string' ? { family: f } : f);
            const updatedForRole = normalizedFonts
                .filter((f) => f.role !== role)
                .filter((f) => !(f.family === family && f.role === role));

            const selectedFont = { family, role } as { family: string; role: 'heading' | 'body' };
            const withSelection = [...updatedForRole, selectedFont];

            const heading = withSelection.find((f) => f.role === 'heading');
            const body = withSelection.find((f) => f.role === 'body');
            const ordered = [
                ...(heading ? [heading] : []),
                ...(body ? [body] : []),
            ];

            return {
                ...prev,
                fonts: ordered
            };
        });
    };

    const handleUpdateTagline = (val: string) => {
        updateData(prev => ({ ...prev, tagline: val }));
    };

    const handleUpdateBrandValue = (index: number, val: string) => {
        updateData(prev => ({
            ...prev,
            brand_values: (prev.brand_values || []).map((v, i) => i === index ? val : v)
        }));
    };

    const handleAddBrandValue = () => {
        updateData(prev => ({ ...prev, brand_values: [...(prev.brand_values || []), 'Nuevo Valor'] }));
    };

    const handleRemoveBrandValue = (idx: number) => {
        updateData(prev => ({ ...prev, brand_values: prev.brand_values?.filter((_, i) => i !== idx) }));
    };

    const handleUpdateAesthetic = (idx: number, val: string) => {
        updateData(prev => ({ ...prev, visual_aesthetic: prev.visual_aesthetic?.map((v, i) => i === idx ? val : v) }));
    };

    const handleAddAesthetic = () => {
        updateData(prev => ({ ...prev, visual_aesthetic: [...(prev.visual_aesthetic || []), ''] }));
    };

    const handleRemoveAesthetic = (idx: number) => {
        updateData(prev => ({ ...prev, visual_aesthetic: prev.visual_aesthetic?.filter((_, i) => i !== idx) }));
    };

    const handleUpdateTone = (idx: number, val: string) => {
        updateData(prev => ({ ...prev, tone_of_voice: prev.tone_of_voice?.map((v, i) => i === idx ? val : v) }));
    };

    const handleAddTone = () => {
        updateData(prev => ({ ...prev, tone_of_voice: [...(prev.tone_of_voice || []), 'Nuevo Tono'] }));
    };

    const handleRemoveTone = (idx: number) => {
        updateData(prev => ({ ...prev, tone_of_voice: prev.tone_of_voice?.filter((_, i) => i !== idx) }));
    };

    const handleTextAssetsChange = (newTextAssets: any) => {
        updateData(prev => ({
            ...prev,
            text_assets: newTextAssets,
            business_overview: newTextAssets.brand_context || prev.business_overview
        }));
    };

    const handleUpdateBrandContext = (value: string) => {
        updateData(prev => ({
            ...prev,
            business_overview: value,
            text_assets: prev.text_assets ? { ...prev.text_assets, brand_context: value } : {
                marketing_hooks: [],
                visual_keywords: [],
                ctas: [],
                brand_context: value
            }
        }));
    };

    const handleRemoveImage = (idx: number) => {
        updateData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }));
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

    const handleAppendExtractedData = (extracted: any) => {
        updateData(prev => {
            const newState = { ...prev };

            // Merge arrays by appending and de-duplicating strings
            const mergeArray = (key: string, items: string[]) => {
                if (!items || items.length === 0) return (prev as any)[key];
                const current = (prev as any)[key] || [];
                const combined = [...current, ...items];
                return [...new Set(combined)];
            };

            if (extracted.brand_values) newState.brand_values = mergeArray('brand_values', extracted.brand_values);
            if (extracted.tone_of_voice) newState.tone_of_voice = mergeArray('tone_of_voice', extracted.tone_of_voice);
            if (extracted.visual_aesthetic) newState.visual_aesthetic = mergeArray('visual_aesthetic', extracted.visual_aesthetic);
            if (extracted.target_audience) newState.target_audience = mergeArray('target_audience', extracted.target_audience);
            if (extracted.emails) newState.emails = mergeArray('emails', extracted.emails);
            if (extracted.phones) newState.phones = mergeArray('phones', extracted.phones);


            // For brand_name and tagline, only update if they were empty or very short
            if (extracted.brand_name && (!prev.brand_name || prev.brand_name.length < 3)) {
                newState.brand_name = extracted.brand_name;
            }
            if (extracted.tagline && (!prev.tagline || prev.tagline.length < 3)) {
                newState.tagline = extracted.tagline;
            }

            // Text assets merging
            if (extracted.text_assets) {
                const currentText = prev.text_assets || { marketing_hooks: [], visual_keywords: [], ctas: [], brand_context: '' };
                newState.text_assets = {
                    marketing_hooks: [...new Set([...(currentText.marketing_hooks || []), ...(extracted.text_assets.marketing_hooks || [])])],
                    visual_keywords: currentText.visual_keywords, // No extracted by this schema
                    ctas: [...new Set([...(currentText.ctas || []), ...(extracted.text_assets.ctas || [])])],
                    brand_context: extracted.text_assets.brand_context || currentText.brand_context
                };

                if (extracted.text_assets.brand_context) {
                    newState.business_overview = extracted.text_assets.brand_context;
                }
            }

            // Social links merging
            if (extracted.social_links) {
                const currentLinks = prev.social_links || [];
                const newLinks = [...currentLinks];
                extracted.social_links.forEach((link: any) => {
                    if (!currentLinks.some(l => l.url === link.url)) {
                        newLinks.push(link);
                    }
                });
                newState.social_links = newLinks;
            }

            return newState;
        });
    };

    return (
        <div className="space-y-8 pb-12">
            {!assistantPriorityMode && (
            <div className="rounded-2xl glass-panel transition-all duration-200 mb-6 p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-4">
                        <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                            <p className="text-xs font-semibold text-foreground mb-1">Como completar este bloque</p>
                            <p className="text-xs text-muted-foreground">Paso 1: Pon nombre a tu kit. Paso 2 (opcional): pega una URL y pulsa Analizar URL para autocompletar contenido.</p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shadow-sm shrink-0">
                                {data.logo_url ? (
                                    <img src={data.logo_url} className="w-8 h-8 object-contain" alt="Logo" />
                                ) : (
                                    <span className="text-xl font-bold">{data.brand_name?.[0] || 'M'}</span>
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Paso 1 · Nombre del kit</p>
                                    <Input
                                        value={data.brand_name || ''}
                                        onChange={(e) => {
                                            setData((prev) => ({ ...prev, brand_name: e.target.value }));
                                            setHasUnsavedChanges(true);
                                        }}
                                        className="h-10 px-3 bg-background border-border focus-visible:ring-primary font-semibold"
                                        placeholder="Ej: Mi Marca"
                                    />
                                </div>

                                <div>
                                    <p className="text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5" />
                                        Paso 2 (opcional) · URL web para analizar
                                    </p>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <Input
                                            value={data.url || ''}
                                            onChange={(e) => {
                                                setData((prev) => ({ ...prev, url: e.target.value }));
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="https://tuweb.com"
                                            className="text-xs h-9 px-3 bg-background border-border focus-visible:ring-primary sm:max-w-[360px]"
                                        />
                                        {onRegenerate && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 text-xs px-4 w-full sm:w-auto"
                                                disabled={!normalizedAnalysisUrl}
                                                onClick={() => onRegenerate(normalizedAnalysisUrl || rawBrandUrl)}
                                            >
                                                Analizar URL
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground/80 mt-1">
                                        {isManualPlaceholderUrl
                                            ? 'Tu kit se creó manualmente. Añade una URL válida para completar datos automáticamente.'
                                            : normalizedAnalysisUrl
                                                ? 'URL válida. Pulsa "Analizar URL" para actualizar este kit con datos de la web.'
                                                : 'Si añades una URL válida, podrás analizarla para completar este kit más rápido.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:pt-1">
                        {isSaving ? (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium animate-pulse">
                                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
                            </div>
                        ) : hasUnsavedChanges ? (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                <Save className="w-4 h-4 mr-2" />
                                Cambios pendientes
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Sincronizado
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-border/50 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-9"
                        onClick={() => setShowAssistantWizard(true)}
                    >
                        <ListChecks className="w-4 h-4" />
                        Modo guiado
                    </Button>
                    {canUseDebugAudit && (
    <Button
        variant="ghost"
        size="sm"
        className={cn(
            "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-all gap-2 h-9",
            showDebug && "text-emerald-500 bg-emerald-500/10"
        )}
        onClick={() => setShowDebug(!showDebug)}
    >
        <Bug className="w-4 h-4" />
        Auditoria
    </Button>
)}
                    <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-2 h-9">
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleSave(false)}
                        disabled={!hasUnsavedChanges || isSaving}
                        className="gap-2 h-9 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                    >
                        {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Ahora
                    </Button>
                </div>
            </div>
            )}

            {assistantPriorityMode && !allowAssistantExit ? (
                !showAssistantWizard && (
                    <div className="rounded-xl border border-dashed border-border/70 p-6 bg-muted/20">
                        <p className="text-base font-medium text-foreground mb-1">Completa primero el asistente guiado</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Cuando termines estos pasos, se desbloqueara el editor completo.
                        </p>
                        <Button onClick={() => setShowAssistantWizard(true)}>Continuar asistente</Button>
                    </div>
                )
            ) : (
                <>
                    {/* NEW LAYOUT IMPLEMENTATION */}

                    {/* Top Section: Branding & Screenshot */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {/* Left Column: Identities & Palette */}
                        <div className="space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <LogoCard
                                    logoUrl={data.logo_url}
                                    logos={data.logos}
                                    onUpload={handleUploadLogos}
                                    onRemove={handleRemoveLogo}
                                    onToggle={handleToggleLogoSelection}
                                    onReorder={handleReorderLogos}
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

                    {/* Middle Section: Brand Context (Full Width Focus) */}
                    <div className="w-full">
                        <BrandContextCard
                            context={data.business_overview || ''}
                            onUpdate={(val) => updateData(prev => ({
                                ...prev,
                                business_overview: val,
                                text_assets: prev.text_assets ? { ...prev.text_assets, brand_context: val } : {
                                    marketing_hooks: [],
                                    visual_keywords: [],
                                    ctas: [],
                                    brand_context: val
                                }
                            }))}
                        />
                    </div>

                    {/* Two-Column Layout: Content Cards (Left) + Image Gallery (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        {/* Left Column: All Content/Info Cards */}
                        <div className="space-y-6">
                            <TargetAudienceCard audience={data.target_audience} />
                            <ContactSocialCard
                                socialLinks={data.social_links}
                                emails={data.emails}
                                phones={data.phones}
                                addresses={data.addresses}
                                onUpdate={handleUpdateContact}
                            />

                            <TypographySection
                                fonts={(data.fonts || []).map(f => typeof f === 'string' ? { family: f } : f)}
                                tagline={data.tagline || ''}
                                onAddFont={handleAddFont}
                                onSelectFontForRole={handleSelectFontForRole}
                                onRemoveFont={handleRemoveFont}
                                onUpdateRole={handleUpdateFontRole}
                            />

                            <BrandAssets
                                tagline={data.tagline || ''}
                                values={data.brand_values || []}
                                aesthetic={data.visual_aesthetic || []}
                                tone={data.tone_of_voice || []}
                                onUpdateTagline={handleUpdateTagline}
                                onUpdateValue={handleUpdateBrandValue}
                                onAddValue={handleAddBrandValue}
                                onRemoveValue={handleRemoveBrandValue}
                                onUpdateAesthetic={handleUpdateAesthetic}
                                onAddAesthetic={handleAddAesthetic}
                                onRemoveAesthetic={handleRemoveAesthetic}
                                onUpdateTone={handleUpdateTone}
                                onAddTone={handleAddTone}
                                onRemoveTone={handleRemoveTone}
                            />

                            <TextAssetsSection
                                data={data.text_assets}
                                onChange={handleTextAssetsChange}
                                onAppendData={handleAppendExtractedData}
                            />
                        </div>

                        <div className="lg:sticky lg:top-6">
                            <ImageGallery
                                images={data.images || []}
                                isUploading={isUploading}
                                onUpload={handleUploadFiles}
                                onRemoveImage={handleRemoveImage}
                                onOpenLightbox={setLightboxImage}
                            />
                        </div>
                    </div>

                    {canUseDebugAudit && showDebug && <TechnicalAudit trace={data.api_trace} isVisible={showDebug} debugData={data.debug} />}
                </>
            )}

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

            <BrandKitAssistantWizard
                open={showAssistantWizard}
                onOpenChange={handleWizardOpenChange}
                brand={data}
                forceMode={mustForceAssistant}
                onUpdateBrandName={(value) => updateData((prev) => ({ ...prev, brand_name: value }))}
                onUpdateUrl={(value) => updateData((prev) => ({ ...prev, url: value }))}
                onAnalyzeUrl={(urlOverride) => (onAnalyzeUrlFromAssistant || onRegenerate)?.(urlOverride || data.url || '')}
                onPreviewUrl={async (targetUrl) => {
                    if (!onPreviewUrlFromAssistant) {
                        return { success: false, url: targetUrl, error: 'Preview no disponible' };
                    }
                    return onPreviewUrlFromAssistant(targetUrl);
                }}
                onUploadLogos={handleUploadLogos}
                onToggleLogo={handleToggleLogoSelection}
                onRemoveLogo={handleRemoveLogo}
                onAddColor={handleAddColor}
                onUpdateColor={handleUpdateColor}
                onUpdateColorRole={handleUpdateColorRole}
                onRemoveColor={handleRemoveColor}
                onUpdateBrandContext={handleUpdateBrandContext}
                onUpdateContact={handleUpdateContact}
                onAddFont={handleAddFont}
                onSelectFontForRole={handleSelectFontForRole}
                onRemoveFont={handleRemoveFont}
                onUpdateFontRole={handleUpdateFontRole}
                onUpdateTagline={handleUpdateTagline}
                onUpdateValue={handleUpdateBrandValue}
                onAddValue={handleAddBrandValue}
                onRemoveValue={handleRemoveBrandValue}
                onUpdateAesthetic={handleUpdateAesthetic}
                onAddAesthetic={handleAddAesthetic}
                onRemoveAesthetic={handleRemoveAesthetic}
                onUpdateTone={handleUpdateTone}
                onAddTone={handleAddTone}
                onRemoveTone={handleRemoveTone}
                onChangeTextAssets={handleTextAssetsChange}
                onAppendExtractedData={handleAppendExtractedData}
                onUploadImages={handleUploadFiles}
                onRemoveImage={handleRemoveImage}
                onOpenLightbox={setLightboxImage}
                isUploadingImages={isUploading}
                completionPercentage={completeness.percentage}
                minimumCompletionToFinish={70}
                onFinish={() => {
                    setShowAssistantWizard(false);
                    setAssistantFlowLocked(false);
                    if (typeof window !== 'undefined') {
                        window.sessionStorage.removeItem(ASSISTANT_LOCK_KEY);
                    }
                    onCompleteAssistantCreation?.();
                }}
            />
        </div >
    );
}

