import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ARTISTIC_STYLE_CATALOG, ARTISTIC_STYLE_GROUPS } from '@/lib/creation-flow-types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Trash2, Plus, Sparkles, Type, MessageCircle, Quote } from 'lucide-react';

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
    onRemoveTone,
}: BrandAssetsProps) {
    const [openSuggestionIndex, setOpenSuggestionIndex] = useState<number | null>(null);

    const groupedSuggestions = useMemo(() => {
        return ARTISTIC_STYLE_GROUPS.reduce((acc, group) => {
            const stylesInGroup = ARTISTIC_STYLE_CATALOG.filter((s) => s.category === group.id);
            if (stylesInGroup.length > 0) {
                acc[group.id] = {
                    label: group.label,
                    styles: stylesInGroup,
                };
            }
            return acc;
        }, {} as Record<string, { label: string; styles: typeof ARTISTIC_STYLE_CATALOG }>);
    }, []);

    const DirectRow = ({
        value,
        onChange,
        onDelete,
        placeholder,
        right,
    }: {
        value: string;
        onChange: (v: string) => void;
        onDelete: () => void;
        placeholder: string;
        right?: React.ReactNode;
    }) => (
        <div className="group relative flex items-center gap-2 py-1">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-9 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
            />
            {right}
            <button
                className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                onClick={onDelete}
                type="button"
                aria-label="Eliminar"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 glass-panel border-0 shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Quote className="w-5 h-5 text-primary" />
                        Eslogan
                    </CardTitle>
                </CardHeader>
            <CardContent>
                    <div className="py-1">
                        <Input
                            value={tagline}
                            onChange={(e) => onUpdateTagline(e.target.value)}
                            className="h-10 text-sm bg-transparent border-0 border-b border-border rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                            placeholder="Escribe el eslogan de marca"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-panel border-0 shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Valores
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {values.map((v, i) => (
                        <DirectRow
                            key={`value-${i}`}
                            value={v}
                            onChange={(val) => onUpdateValue(i, val)}
                            onDelete={() => onRemoveValue(i)}
                            placeholder="Valor de marca"
                        />
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 h-8 text-xs" onClick={onAddValue} type="button">
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir Valor
                    </Button>
                </CardContent>
            </Card>

            <Card className="glass-panel border-0 shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <Type className="w-5 h-5 text-primary" />
                        Estilos Visuales
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Para generación de imágenes en el panel Imagen</p>
                </CardHeader>
                <CardContent className="space-y-1">
                    {aesthetic.map((v, i) => (
                        <DirectRow
                            key={`aesthetic-${i}`}
                            value={v}
                            onChange={(val) => onUpdateAesthetic(i, val)}
                            onDelete={() => onRemoveAesthetic(i)}
                            placeholder="Estilo visual"
                            right={
                                <Popover open={openSuggestionIndex === i} onOpenChange={(open) => setOpenSuggestionIndex(open ? i : null)}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 hover:bg-primary/10"
                                            type="button"
                                            title="Sugerencias de estilos"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-[350px] shadow-xl border-border max-h-[300px] overflow-hidden flex flex-col bg-card" align="start" sideOffset={5}>
                                        <div className="overflow-y-auto flex-1">
                                            {Object.entries(groupedSuggestions).map(([groupId, group]) => (
                                                <div key={groupId}>
                                                    <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-muted/50 text-muted-foreground sticky top-0 backdrop-blur-sm z-10">
                                                        {group.label}
                                                    </div>
                                                    {group.styles.map((style) => (
                                                        <button
                                                            key={style.id}
                                                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-3 transition-colors border-b border-border/40 last:border-0"
                                                            onClick={() => {
                                                                onUpdateAesthetic(i, style.label);
                                                                setOpenSuggestionIndex(null);
                                                            }}
                                                            type="button"
                                                        >
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-medium text-foreground">{style.label}</span>
                                                                <span className="text-xs text-muted-foreground line-clamp-1">{style.keywords.slice(0, 3).join(', ')}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            }
                        />
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 h-8 text-xs" onClick={onAddAesthetic} type="button">
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir Estilo
                    </Button>
                </CardContent>
            </Card>

            <Card className="glass-panel border-0 shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-foreground">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Tono de voz
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {tone.map((v, i) => (
                        <DirectRow
                            key={`tone-${i}`}
                            value={v}
                            onChange={(val) => onUpdateTone(i, val)}
                            onDelete={() => onRemoveTone(i)}
                            placeholder="Tono de voz"
                        />
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed border-border hover:border-primary hover:bg-primary/5 h-8 text-xs" onClick={onAddTone} type="button">
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir Tono
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
