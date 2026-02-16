import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ARTISTIC_STYLE_CATALOG, ARTISTIC_STYLE_GROUPS } from '@/lib/creation-flow-types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';

import { Pencil, Check, X, Trash2, Plus, Sparkles, Type, MessageCircle, Quote } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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
    const [originalValue, setOriginalValue] = useState('');

    // Suggestion State
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleStartEdit = (section: string, index: number, value: string) => {
        setEditingItem({ section, index });
        setEditValue(value);
        setOriginalValue(value);
        setShowSuggestions(false); // DO NOT open by default anymore
    };

    const handleSaveEdit = () => {
        if (!editingItem) return;
        const { section, index } = editingItem;
        if (section === 'values') onUpdateValue(index, editValue);
        if (section === 'aesthetic') onUpdateAesthetic(index, editValue);
        if (section === 'tone') onUpdateTone(index, editValue);
        setEditingItem(null);
        setShowSuggestions(false);
    };

    const handleSelectStyle = (value: string) => {
        if (!editingItem) return;
        const { section, index } = editingItem;
        if (section === 'aesthetic') onUpdateAesthetic(index, value);
        setEditingItem(null);
        setShowSuggestions(false);
    };

    // Auto-open edit mode when a new empty aesthetic is added
    useEffect(() => {
        const lastIndex = aesthetic.length - 1;
        if (lastIndex >= 0 && aesthetic[lastIndex] === '' && !editingItem) {
            handleStartEdit('aesthetic', lastIndex, '');
        }
    }, [aesthetic.length]);

    // Filter suggestions based on current input
    // Filter suggestions based on current input
    const filteredSuggestions = ARTISTIC_STYLE_CATALOG.filter(style => {
        // Show all if the user hasn't typed anything new (editValue matches original) or input is empty
        if (editValue === '' || editValue === originalValue) return true;

        return style.label.toLowerCase().includes(editValue.toLowerCase()) ||
            style.keywords.some(k => k.toLowerCase().includes(editValue.toLowerCase()));
    });

    // Group filtered suggestions
    const groupedSuggestions = ARTISTIC_STYLE_GROUPS.reduce((acc, group) => {
        const stylesInGroup = filteredSuggestions.filter(s => s.category === group.id);
        if (stylesInGroup.length > 0) {
            acc[group.id] = {
                label: group.label,
                styles: stylesInGroup
            };
        }
        return acc;
    }, {} as Record<string, { label: string; styles: typeof ARTISTIC_STYLE_CATALOG }>);

    const EditableItem = ({ value, section, index, onRemove }: { value: string; section: string; index: number, onRemove: () => void }) => {
        const isEditing = editingItem?.section === section && editingItem.index === index;
        const isAesthetic = section === 'aesthetic';

        const content = (
            <div className="group relative">
                <div className={cn(
                    "flex items-center gap-2 p-2.5 border rounded-lg shadow-sm transition-all",
                    isEditing ? "bg-background border-primary ring-1 ring-primary z-20" : "bg-muted/20 border-border hover:shadow-md hover:border-primary/30"
                )}>
                    {isEditing ? (
                        <div
                            className="flex-1 flex items-center gap-2 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Input
                                value={editValue}
                                onChange={(e) => {
                                    setEditValue(e.target.value);
                                    // Only show suggestions if typing, but don't force it to open if it was closed
                                }}
                                className="flex-1 h-7 text-sm bg-transparent border-none focus-visible:ring-0 px-0"
                                autoFocus
                                placeholder={isAesthetic ? "Escribe un estilo..." : "Escribe aquí..."}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit();
                                    if (e.key === 'Escape') {
                                        setEditingItem(null);
                                        setShowSuggestions(false);
                                    }
                                }}
                            />

                            {isAesthetic && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className={cn(
                                        "h-6 w-6 p-0 hover:bg-primary/10",
                                        showSuggestions && "text-primary bg-primary/5"
                                    )}
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    title="Ver catálogo de estilos"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                </Button>
                            )}

                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-500/10" onClick={handleSaveEdit}>
                                <Check className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-red-500/10"
                                onClick={() => {
                                    setEditingItem(null);
                                    setShowSuggestions(false);
                                }}
                            >
                                <X className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <span
                                className="flex-1 text-sm text-[var(--text-primary)] cursor-pointer"
                                onClick={() => handleStartEdit(section, index, value)}
                            >
                                {value}
                            </span>
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
            </div>
        );

        if (isEditing && isAesthetic) {
            return (
                <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                    <PopoverAnchor asChild>
                        {content}
                    </PopoverAnchor>
                    <PopoverContent
                        className="p-0 w-[350px] shadow-xl border-border max-h-[300px] overflow-hidden flex flex-col bg-card"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        align="start"
                        sideOffset={5}
                    >
                        <div className="overflow-y-auto flex-1">
                            {Object.keys(groupedSuggestions).length > 0 ? (
                                Object.entries(groupedSuggestions).map(([groupId, group]) => (
                                    <div key={groupId}>
                                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-muted/50 text-muted-foreground sticky top-0 backdrop-blur-sm z-10">
                                            {group.label}
                                        </div>
                                        {group.styles.map(style => (
                                            <button
                                                key={style.id}
                                                className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-3 transition-colors border-b border-border/40 last:border-0"
                                                onClick={() => {
                                                    handleSelectStyle(style.label);
                                                }}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-foreground">{style.label}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">{style.keywords.slice(0, 3).join(', ')}</span>


                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    <p>No se encontraron coincidencias.</p>
                                </div>
                            )}
                        </div>
                        {/* Always show generic 'Create' option if filtering */}
                        {editValue && !ARTISTIC_STYLE_CATALOG.some(s => s.label.toLowerCase() === editValue.toLowerCase()) && (
                            <div className="p-2 border-t border-border bg-muted/30">
                                <button
                                    className="w-full flex items-center gap-2 p-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors font-medium"
                                    onClick={() => {
                                        handleSaveEdit();
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Crear estilo personalizado "{editValue}"
                                </button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            );
        }

        return content;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Tagline */}
            <Card className="md:col-span-2 glass-panel border-0 shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Quote className="w-5 h-5 text-primary" />
                        Eslogan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "group relative p-3 bg-muted/20 border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer",
                            isEditingTagline && "cursor-default"
                        )}
                        onClick={() => {
                            if (!isEditingTagline) {
                                setTaglineEdit(tagline);
                                setIsEditingTagline(true);
                            }
                        }}
                    >
                        {isEditingTagline ? (
                            <div
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
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
            <Card className="glass-panel border-0 shadow-none">
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
            <Card className="glass-panel border-0 shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Type className="w-5 h-5 text-primary" />
                        Estilos Visuales
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Para generación de imágenes en el panel Imagen</p>
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
            <Card className="glass-panel border-0 shadow-none">
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
