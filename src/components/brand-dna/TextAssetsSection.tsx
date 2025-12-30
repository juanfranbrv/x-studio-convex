'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TextAssets } from '@/lib/brand-types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Megaphone, Tag, MousePointerClick, FileText, Pencil, Info, Check, X, Trash2, Plus } from 'lucide-react';


interface TextAssetsSectionProps {
    data?: TextAssets;
    onChange?: (data: TextAssets) => void;
}

// Datos de ejemplo por defecto
const DEFAULT_DATA: TextAssets = {
    marketing_hooks: [
        "Escapada romántica en Teruel",
        "Desconecta para reconectar",
        "Lujo rural accesible"
    ],
    visual_keywords: [
        "Jacuzzi",
        "Chimenea de leña",
        "Muros de piedra",
        "Vistas a la montaña"
    ],
    ctas: [
        "Reservar ahora",
        "Ver disponibilidad",
        "Contactar"
    ],
    brand_context: "Casa rural de alquiler completo situada en Rubielos de Mora, pueblo medieval. Ambiente relajado y exclusivo."
};

// Definiciones para tooltips de ayuda
const SECTION_TOOLTIPS = {
    marketing_hooks: "Frases impactantes que se usarán como titulares en los banners y anuncios de tu marca.",
    visual_keywords: "Palabras clave que describen elementos físicos de tu negocio. Se usan para generar imágenes con IA.",
    ctas: "Textos para botones de acción que invitan al usuario a hacer algo (reservar, contactar, etc.).",
    brand_context: "Descripción del negocio que ayuda a la IA a entender qué estás vendiendo y generar contenido relevante."
};

export function TextAssetsSection({ data, onChange }: TextAssetsSectionProps) {
    const [assets, setAssets] = useState<TextAssets>(data || DEFAULT_DATA);
    const [editingItem, setEditingItem] = useState<{ section: keyof TextAssets; index: number } | null>(null);
    const [editValue, setEditValue] = useState('');

    // Sincronizar estado interno cuando cambian los props (para edición bidireccional)
    useEffect(() => {
        if (data) {
            setAssets(data);
        }
    }, [data]);

    const updateAssets = (newAssets: TextAssets) => {
        setAssets(newAssets);
        onChange?.(newAssets);
    };

    // Handlers para arrays
    const handleStartEdit = (section: 'marketing_hooks' | 'visual_keywords' | 'ctas', index: number) => {
        setEditingItem({ section, index });
        setEditValue(assets[section][index]);
    };

    const handleSaveEdit = () => {
        if (!editingItem || editingItem.section === 'brand_context') return;
        const section = editingItem.section as 'marketing_hooks' | 'visual_keywords' | 'ctas';
        const newArray = [...assets[section]];
        newArray[editingItem.index] = editValue;
        updateAssets({ ...assets, [section]: newArray });
        setEditingItem(null);
        setEditValue('');
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditValue('');
    };

    const handleDelete = (section: 'marketing_hooks' | 'visual_keywords' | 'ctas', index: number) => {
        const newArray = assets[section].filter((_, i) => i !== index);
        updateAssets({ ...assets, [section]: newArray });
    };

    const handleAdd = (section: 'marketing_hooks' | 'visual_keywords' | 'ctas') => {
        const newItem = section === 'marketing_hooks' ? 'Nuevo titular' :
            section === 'visual_keywords' ? 'Nueva keyword' : 'Nuevo CTA';
        updateAssets({ ...assets, [section]: [...assets[section], newItem] });
    };


    // Componente de título de sección con tooltip
    const SectionTitle = ({
        icon: Icon,
        title,
        tooltipKey
    }: {
        icon: any;
        title: string;
        tooltipKey: keyof typeof SECTION_TOOLTIPS
    }) => (
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{title}</span>
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-0.5 rounded-full hover:bg-[var(--surface-hover)] transition-colors">
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

    // Componente de tarjeta editable
    const EditableCard = ({
        value,
        isEditing,
        onEdit,
        onSave,
        onCancel,
        onDelete,
        editValue,
        setEditValue
    }: {
        value: string;
        isEditing: boolean;
        onEdit: () => void;
        onSave: () => void;
        onCancel: () => void;
        onDelete: () => void;
        editValue: string;
        setEditValue: (v: string) => void;
    }) => (
        <div className="group relative flex items-center gap-2 p-2.5 bg-muted/20 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
            {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 h-7 text-sm bg-transparent border-border focus-visible:ring-primary"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSave();
                            if (e.key === 'Escape') onCancel();
                        }}
                    />
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-500/10" onClick={onSave}>
                        <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-500/10" onClick={onCancel}>
                        <X className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            ) : (
                <>
                    <span className="flex-1 text-sm text-[var(--text-primary)]">{value}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            className="p-1 rounded hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                            onClick={onEdit}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            className="p-1 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                            onClick={onDelete}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <Card className="bg-card border-border relative overflow-visible shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--accent)]/10 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <FileText className="w-5 h-5 text-primary" />
                    Activos de texto
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                    Textos editables para campañas y generación de contenido
                </p>
            </CardHeader>
            <CardContent className="relative space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* A. Marketing Hooks (Titulares) */}
                    <div className="space-y-3">
                        <SectionTitle icon={Megaphone} title="Titulares de Marketing" tooltipKey="marketing_hooks" />
                        <div className="space-y-2">
                            {assets.marketing_hooks.map((hook, idx) => (
                                <EditableCard
                                    key={idx}
                                    value={hook}
                                    isEditing={editingItem?.section === 'marketing_hooks' && editingItem.index === idx}
                                    onEdit={() => handleStartEdit('marketing_hooks', idx)}
                                    onSave={handleSaveEdit}
                                    onCancel={handleCancelEdit}
                                    onDelete={() => handleDelete('marketing_hooks', idx)}
                                    editValue={editValue}
                                    setEditValue={setEditValue}
                                />
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs h-8"
                                onClick={() => handleAdd('marketing_hooks')}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Añadir Titular
                            </Button>
                        </div>
                    </div>

                    {/* B. Visual Keywords */}
                    <div className="space-y-3">
                        <SectionTitle icon={Tag} title="Palabras Clave Visuales" tooltipKey="visual_keywords" />
                        <div className="space-y-2">
                            {assets.visual_keywords.map((keyword, idx) => (
                                <EditableCard
                                    key={idx}
                                    value={keyword}
                                    isEditing={editingItem?.section === 'visual_keywords' && editingItem.index === idx}
                                    onEdit={() => handleStartEdit('visual_keywords', idx)}
                                    onSave={handleSaveEdit}
                                    onCancel={handleCancelEdit}
                                    onDelete={() => handleDelete('visual_keywords', idx)}
                                    editValue={editValue}
                                    setEditValue={setEditValue}
                                />
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs h-8"
                                onClick={() => handleAdd('visual_keywords')}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Añadir Palabra Clave
                            </Button>
                        </div>
                    </div>

                    {/* C. Call to Actions */}
                    <div className="space-y-3">
                        <SectionTitle icon={MousePointerClick} title="Llamadas a la Acción" tooltipKey="ctas" />
                        <div className="space-y-2">
                            {assets.ctas.map((cta, idx) => (
                                <EditableCard
                                    key={idx}
                                    value={cta}
                                    isEditing={editingItem?.section === 'ctas' && editingItem.index === idx}
                                    onEdit={() => handleStartEdit('ctas', idx)}
                                    onSave={handleSaveEdit}
                                    onCancel={handleCancelEdit}
                                    onDelete={() => handleDelete('ctas', idx)}
                                    editValue={editValue}
                                    setEditValue={setEditValue}
                                />
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs h-8"
                                onClick={() => handleAdd('ctas')}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Añadir CTA
                            </Button>
                        </div>
                    </div>


                </div>
            </CardContent>
        </Card>
    );
}
