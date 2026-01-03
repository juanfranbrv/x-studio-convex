'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Pencil, Check, X, Trash2, Plus, Sparkles, Type, MessageCircle, Quote } from 'lucide-react';

interface BrandAssetsProps {
    tagline: string;
    values: string[];
    aesthetic: string[];
    tone: string[];
    onUpdateTagline: (val: string) => void;
    onUpdateValue: (index: number, val: string) => void;
    onAddValue: () => void;
    onRemoveValue: (index: number) => void;
    onUpdateAesthetic: (index: number, val: string) => void;
    onAddAesthetic: () => void;
    onRemoveAesthetic: (index: number) => void;
    onUpdateTone: (index: number, val: string) => void;
    onAddTone: () => void;
    onRemoveTone: (index: number) => void;
}

export function BrandAssets({
    tagline,
    values,
    aesthetic,
    tone,
    onUpdateTagline,
    onUpdateValue,
    onAddValue,
    onRemoveValue,
    onUpdateAesthetic,
    onAddAesthetic,
    onRemoveAesthetic,
    onUpdateTone,
    onAddTone,
    onRemoveTone
}: BrandAssetsProps) {
    const [isEditingTagline, setIsEditingTagline] = useState(false);
    const [taglineEdit, setTaglineEdit] = useState(tagline);
    const [editingItem, setEditingItem] = useState<{ section: string; index: number } | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleStartEdit = (section: string, index: number, value: string) => {
        setEditingItem({ section, index });
        setEditValue(value);
    };

    const handleSaveEdit = () => {
        if (!editingItem) return;
        const { section, index } = editingItem;
        if (section === 'values') onUpdateValue(index, editValue);
        if (section === 'aesthetic') onUpdateAesthetic(index, editValue);
        if (section === 'tone') onUpdateTone(index, editValue);
        setEditingItem(null);
    };

    const EditableItem = ({ value, section, index, onRemove }: { value: string; section: string; index: number, onRemove: () => void }) => {
        const isEditing = editingItem?.section === section && editingItem.index === index;

        return (
            <div className="group relative flex items-center gap-2 p-2.5 bg-muted/20 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 h-7 text-sm bg-transparent border-border"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setEditingItem(null);
                            }}
                        />
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-500/10" onClick={handleSaveEdit}>
                            <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-500/10" onClick={() => setEditingItem(null)}>
                            <X className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <span className="flex-1 text-sm text-[var(--text-primary)]">{value}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                className="p-1 rounded hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                                onClick={() => handleStartEdit(section, index, value)}
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                className="p-1 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                onClick={onRemove}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Tagline */}
            <Card className="md:col-span-2 bg-card border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Quote className="w-5 h-5 text-primary" />
                        Eslogan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="group relative p-3 bg-muted/20 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        {isEditingTagline ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={taglineEdit}
                                    onChange={(e) => setTaglineEdit(e.target.value)}
                                    className="flex-1 h-8 text-sm bg-transparent border-border"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') { onUpdateTagline(taglineEdit); setIsEditingTagline(false); }
                                        if (e.key === 'Escape') { setTaglineEdit(tagline); setIsEditingTagline(false); }
                                    }}
                                />
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { onUpdateTagline(taglineEdit); setIsEditingTagline(false); }}>
                                    <Check className="w-5 h-5 text-green-500" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setTaglineEdit(tagline); setIsEditingTagline(false); }}>
                                    <X className="w-5 h-5 text-red-500" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-foreground leading-relaxed pr-8">&quot;{tagline}&quot;</p>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-1 rounded hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                                        onClick={() => { setTaglineEdit(tagline); setIsEditingTagline(true); }}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Values */}
            <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Valores
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {values.map((v, i) => (
                        <EditableItem key={i} value={v} section="values" index={i} onRemove={() => onRemoveValue(i)} />
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 h-8 text-xs" onClick={onAddValue}>
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir Valor
                    </Button>
                </CardContent>
            </Card>

            {/* Visual Styles (unified for image generation) */}
            <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Type className="w-5 h-5 text-primary" />
                        Estilos Visuales
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Para generación de imágenes en el Studio</p>
                </CardHeader>
                <CardContent className="space-y-2">
                    {aesthetic.map((v, i) => (
                        <EditableItem key={i} value={v} section="aesthetic" index={i} onRemove={() => onRemoveAesthetic(i)} />
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 h-8 text-xs" onClick={onAddAesthetic}>
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir Estilo
                    </Button>
                </CardContent>
            </Card>

            {/* Tone */}
            <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Tono de voz
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {tone.map((v, i) => (
                        <EditableItem key={i} value={v} section="tone" index={i} onRemove={() => onRemoveTone(i)} />
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 h-8 text-xs" onClick={onAddTone}>
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir Tono
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
