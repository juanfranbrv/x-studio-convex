'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    XCircle,
    FileText,
    Megaphone,
    MousePointerClick,
    Globe,
    Users,
    Heart,
    MessageSquare,
    Palette,
    Mail,
    Phone,
    MapPin,
    Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExtractionPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any | null;
    onConfirm: (selectedData: any) => void;
}

export function ExtractionPreviewModal({ open, onOpenChange, data, onConfirm }: ExtractionPreviewModalProps) {
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (data) {
            const initial: Record<string, boolean> = {};
            // Set everything to true by default for now
            Object.keys(data).forEach(key => {
                const value = (data as any)[key];
                if (Array.isArray(value)) {
                    value.forEach((_, idx) => initial[`${key}-${idx}`] = true);
                } else if (typeof value === 'object' && value !== null) {
                    if (key === 'text_assets') {
                        Object.keys(value).forEach(subKey => {
                            const subValue = (value as any)[subKey];
                            if (Array.isArray(subValue)) {
                                subValue.forEach((_, idx) => initial[`text_assets-${subKey}-${idx}`] = true);
                            } else if (typeof subValue === 'string' && subValue) {
                                initial[`text_assets-${subKey}`] = true;
                            }
                        });
                    } else if (key === 'social_links') {
                        (value as any[]).forEach((_, idx) => initial[`social_links-${idx}`] = true);
                    }
                } else if (value) {
                    initial[key] = true;
                }
            });
            setSelectedItems(initial);
        }
    }, [data]);

    if (!data) return null;

    const toggleItem = (id: string) => {
        setSelectedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleConfirm = () => {
        // Filter data based on selectedItems
        const result: any = {};

        if (selectedItems['brand_name']) result.brand_name = data.brand_name;
        if (selectedItems['tagline']) result.tagline = data.tagline;
        if (selectedItems['business_overview']) result.business_overview = data.business_overview;
        if (selectedItems['preferred_language']) result.preferred_language = data.preferred_language;

        const filterArray = (key: string) => (data[key] || []).filter((_: any, idx: number) => selectedItems[`${key}-${idx}`]);

        result.brand_values = filterArray('brand_values');
        result.tone_of_voice = filterArray('tone_of_voice');
        result.visual_aesthetic = filterArray('visual_aesthetic');
        result.target_audience = filterArray('target_audience');
        result.emails = filterArray('emails');
        result.phones = filterArray('phones');
        result.addresses = filterArray('addresses');
        result.social_links = (data.social_links || []).filter((_: any, idx: number) => selectedItems[`social_links-${idx}`]);

        if (data.text_assets) {
            result.text_assets = {
                marketing_hooks: (data.text_assets.marketing_hooks || []).filter((_: any, idx: number) => selectedItems[`text_assets-marketing_hooks-${idx}`]),
                ctas: (data.text_assets.ctas || []).filter((_: any, idx: number) => selectedItems[`text_assets-ctas-${idx}`]),
                brand_context: selectedItems['text_assets-brand_context'] ? data.text_assets.brand_context : undefined
            };
        }

        onConfirm(result);
        onOpenChange(false);
    };

    const Section = ({ title, icon: Icon, children, className }: any) => (
        <div className={cn("space-y-3 p-4 rounded-xl border border-border/50 bg-muted/5 shadow-sm", className)}>
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">{title}</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {children}
            </div>
        </div>
    );

    const Item = ({ id, label, value, sublabel }: any) => (
        <label
            className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group hover:shadow-md",
                selectedItems[id] ? "bg-primary/5 border-primary/30 ring-1 ring-primary/10" : "bg-background border-border opacity-60 hover:opacity-100"
            )}
        >
            <Checkbox
                checked={selectedItems[id]}
                onCheckedChange={() => toggleItem(id)}
                className="mt-1"
            />
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    {sublabel && <Badge variant="secondary" className="text-[10px] h-4">{sublabel}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                    "{value}"
                </p>
            </div>
        </label>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-7xl h-[92vh] sm:max-w-none flex flex-col p-0 overflow-hidden glass-panel border-0">
                <DialogHeader className="p-6 pb-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                Activos Extraídos del Archivo
                            </DialogTitle>
                            <DialogDescription>
                                La IA ha analizado tu documento. Selecciona qué elementos quieres añadir a tu Kit de Marca.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <div className="space-y-6">
                        {/* 1. Brand Identity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <Section title="Identidad Básica" icon={CheckCircle2}>
                                {data.brand_name && <Item id="brand_name" label="Nombre de Marca" value={data.brand_name} />}
                                {data.tagline && <Item id="tagline" label="Eslogan" value={data.tagline} />}
                                {data.preferred_language && <Item id="preferred_language" label="Idioma" value={data.preferred_language === 'es' ? 'Español' : data.preferred_language} />}
                            </Section>

                            <Section title="Visión y Resumen" icon={Globe}>
                                {data.business_overview && <Item id="business_overview" label="Resumen de Negocio" value={data.business_overview} />}
                                {data.text_assets?.brand_context && <Item id="text_assets-brand_context" label="Contexto de Marca" value={data.text_assets.brand_context} />}
                            </Section>
                        </div>

                        {/* 2. Text Assets (Hooks & CTAs) */}
                        <Section title="Activos de Marketing" icon={Megaphone} className="border-primary/20 bg-primary/2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {data.text_assets?.marketing_hooks?.map((hook: string, i: number) => (
                                    <Item key={i} id={`text_assets-marketing_hooks-${i}`} label={`Titular ${i + 1}`} value={hook} sublabel="HOOK" />
                                ))}
                                {data.text_assets?.ctas?.map((cta: string, i: number) => (
                                    <Item key={i} id={`text_assets-ctas-${i}`} label={`Acción ${i + 1}`} value={cta} sublabel="CTA" />
                                ))}
                            </div>
                        </Section>

                        {/* 3. DNA Components */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            <Section title="Valores" icon={Heart}>
                                {data.brand_values?.map((v: string, i: number) => (
                                    <Item key={i} id={`brand_values-${i}`} label={`Valor ${i + 1}`} value={v} />
                                ))}
                            </Section>
                            <Section title="Tono de Voz" icon={MessageSquare}>
                                {data.tone_of_voice?.map((v: string, i: number) => (
                                    <Item key={i} id={`tone_of_voice-${i}`} label={`Tono ${i + 1}`} value={v} />
                                ))}
                            </Section>
                            <Section title="Estética" icon={Palette}>
                                {data.visual_aesthetic?.map((v: string, i: number) => (
                                    <Item key={i} id={`visual_aesthetic-${i}`} label={`Estilo ${i + 1}`} value={v} />
                                ))}
                            </Section>
                        </div>

                        {/* 4. Audience & Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <Section title="Público Objetivo" icon={Users}>
                                {data.target_audience?.map((v: string, i: number) => (
                                    <Item key={i} id={`target_audience-${i}`} label={`Perfil ${i + 1}`} value={v} />
                                ))}
                            </Section>
                            <Section title="Contacto y Redes" icon={Mail}>
                                {data.emails?.map((v: string, i: number) => <Item key={i} id={`emails-${i}`} label="Email" value={v} />)}
                                {data.phones?.map((v: string, i: number) => <Item key={i} id={`phones-${i}`} label="Teléfono" value={v} />)}
                                {data.addresses?.map((v: string, i: number) => <Item key={i} id={`addresses-${i}`} label="Dirección" value={v} />)}
                                {data.social_links?.map((v: any, i: number) => <Item key={i} id={`social_links-${i}`} label={v.platform} value={v.url} />)}
                            </Section>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t border-border/50 bg-muted/20">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="gap-2">
                        <XCircle className="w-4 h-4" />
                        Descartar todo
                    </Button>
                    <Button onClick={handleConfirm} className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 gap-2 px-8">
                        <CheckCircle2 className="w-4 h-4" />
                        Añadir Seleccionados al Kit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
