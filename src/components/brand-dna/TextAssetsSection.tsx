'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TextAssets } from '@/lib/brand-types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { Megaphone, MousePointerClick, FileText, Info, Trash2, Plus, Upload, Loader2 } from 'lucide-react';
import { analyzeBrandFile } from '@/app/actions/analyze-brand-file';
import { ExtractionPreviewModal } from './ExtractionPreviewModal';
import { useToast } from '@/hooks/use-toast';

interface TextAssetsSectionProps {
    data?: TextAssets;
    onChange?: (data: TextAssets) => void;
    onAppendData?: (extractedData: any) => void;
}

const DEFAULT_DATA: TextAssets = {
    marketing_hooks: [
        'Escapada romántica en Teruel',
        'Desconecta para reconectar',
        'Lujo rural accesible',
    ],
    visual_keywords: ['Jacuzzi', 'Chimenea de leña', 'Muros de piedra', 'Vistas a la montaña'],
    ctas: ['Reservar ahora', 'Ver disponibilidad', 'Contactar'],
    brand_context: 'Casa rural de alquiler completo situada en Rubielos de Mora, pueblo medieval. Ambiente relajado y exclusivo.',
};

const SECTION_TOOLTIPS = {
    marketing_hooks: 'Frases impactantes que se usarán como titulares en banners y anuncios de tu marca.',
    visual_keywords: 'Palabras clave visuales del negocio para guiar generación de imágenes.',
    ctas: 'Textos para botones de acción que invitan al usuario a hacer algo.',
    brand_context: 'Descripción del negocio para generar contenido relevante.',
};

export function TextAssetsSection({ data, onChange, onAppendData }: TextAssetsSectionProps) {
    const mergeWithDefaults = (incoming?: TextAssets): TextAssets => ({
        marketing_hooks: incoming?.marketing_hooks ?? DEFAULT_DATA.marketing_hooks,
        visual_keywords: incoming?.visual_keywords ?? DEFAULT_DATA.visual_keywords,
        ctas: incoming?.ctas ?? DEFAULT_DATA.ctas,
        brand_context: incoming?.brand_context ?? DEFAULT_DATA.brand_context,
    });

    const [assets, setAssets] = useState<TextAssets>(mergeWithDefaults(data));
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showExtractionModal, setShowExtractionModal] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (data) setAssets(mergeWithDefaults(data));
    }, [data]);

    const updateAssets = (newAssets: TextAssets) => {
        setAssets(newAssets);
        onChange?.(newAssets);
    };

    const updateItem = (section: 'marketing_hooks' | 'ctas' | 'visual_keywords', index: number, value: string) => {
        const next = [...assets[section]];
        next[index] = value;
        updateAssets({ ...assets, [section]: next });
    };

    const handleDelete = (section: 'marketing_hooks' | 'visual_keywords' | 'ctas', index: number) => {
        const newArray = assets[section].filter((_, i) => i !== index);
        updateAssets({ ...assets, [section]: newArray });
    };

    const handleAdd = (section: 'marketing_hooks' | 'visual_keywords' | 'ctas') => {
        const newItem = section === 'marketing_hooks' ? 'Nuevo titular' : section === 'visual_keywords' ? 'Nueva keyword' : 'Nuevo CTA';
        updateAssets({ ...assets, [section]: [...assets[section], newItem] });
    };

    const SectionTitle = ({
        icon: Icon,
        title,
        tooltipKey,
    }: {
        icon: any;
        title: string;
        tooltipKey: keyof typeof SECTION_TOOLTIPS;
    }) => (
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{title}</span>
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-0.5 rounded-full hover:bg-[var(--surface-hover)] transition-colors" type="button">
                            <Info className="w-3.5 h-3.5 text-[var(--text-secondary)] opacity-60" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs bg-popover border-border text-popover-foreground">
                        <p>{SECTION_TOOLTIPS[tooltipKey]}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );

    const DirectEditableCard = ({
        value,
        onChange,
        onDelete,
        sectionType,
    }: {
        value: string;
        onChange: (val: string) => void;
        onDelete: () => void;
        sectionType: 'marketing_hooks' | 'ctas' | 'visual_keywords';
    }) => (
        <div className="group relative flex items-start gap-2 py-1">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    'flex-1 text-sm bg-transparent border border-border/70 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary rounded-md p-2 resize-y leading-relaxed',
                    sectionType === 'marketing_hooks' ? 'min-h-[110px]' : 'min-h-[80px]'
                )}
                rows={sectionType === 'marketing_hooks' ? 4 : 3}
            />
            <button
                className="p-1 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 mt-1"
                onClick={onDelete}
                type="button"
                aria-label="Eliminar"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );

    return (
        <Card className="glass-panel border-0 shadow-none relative overflow-visible">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--accent)]/10 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative pb-3 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <FileText className="w-5 h-5 text-primary" />
                        Activos de texto
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Textos editables para campañas y generación de contenido</p>
                </div>

                <div className="flex gap-2">
                    <input
                        type="file"
                        id="brand-file-upload"
                        className="hidden"
                        accept=".pdf,.txt,.md"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsAnalyzing(true);
                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const result = await analyzeBrandFile(formData);
                                if (result.success && result.data) {
                                    setExtractedData(result.data);
                                    setShowExtractionModal(true);
                                } else {
                                    toast({
                                        title: 'Error al analizar',
                                        description: result.error || 'No se pudo procesar el archivo.',
                                        variant: 'destructive',
                                    });
                                }
                            } catch (err) {
                                console.error(err);
                            } finally {
                                setIsAnalyzing(false);
                                e.target.value = '';
                            }
                        }}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary cursor-pointer"
                        disabled={isAnalyzing}
                        asChild
                    >
                        <label htmlFor="brand-file-upload">
                            {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            Importar desde Archivo
                        </label>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="relative space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <SectionTitle icon={Megaphone} title="Titulares de Marketing" tooltipKey="marketing_hooks" />
                        <div className="space-y-1">
                            {assets.marketing_hooks.map((hook, idx) => (
                                <DirectEditableCard
                                    key={`hook-${idx}`}
                                    value={hook}
                                    onChange={(val) => updateItem('marketing_hooks', idx, val)}
                                    onDelete={() => handleDelete('marketing_hooks', idx)}
                                    sectionType="marketing_hooks"
                                />
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs h-8"
                                onClick={() => handleAdd('marketing_hooks')}
                                type="button"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Añadir Titular
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <SectionTitle icon={MousePointerClick} title="Llamadas a la Acción" tooltipKey="ctas" />
                        <div className="space-y-1">
                            {assets.ctas.map((cta, idx) => (
                                <DirectEditableCard
                                    key={`cta-${idx}`}
                                    value={cta}
                                    onChange={(val) => updateItem('ctas', idx, val)}
                                    onDelete={() => handleDelete('ctas', idx)}
                                    sectionType="ctas"
                                />
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs h-8"
                                onClick={() => handleAdd('ctas')}
                                type="button"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Añadir CTA
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>

            <ExtractionPreviewModal
                open={showExtractionModal}
                onOpenChange={setShowExtractionModal}
                data={extractedData}
                onConfirm={(selectedData) => {
                    onAppendData?.(selectedData);
                    toast({
                        title: 'Kit actualizado',
                        description: 'Los activos seleccionados se han añadido a tu kit de marca.',
                    });
                }}
            />
        </Card>
    );
}
