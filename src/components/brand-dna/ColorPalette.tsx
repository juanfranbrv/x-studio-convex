'use client';

import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type ContextElement } from "@/app/studio/page";
import { cn } from '@/lib/utils';

import { Palette, Info, RotateCcw, X, Pipette, Check, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { hexToRgb, rgbToLab } from '@/lib/color-utils';

interface ColorPaletteProps {
    colors: { color: string; sources: string[]; score: number; role?: string; selected?: boolean }[];
    isEdited: boolean;
    onUpdateColor: (index: number, newColor: string) => void;
    onUpdateRole: (index: number, newRole: string) => void;
    onToggleSelection?: (index: number) => void;
    onRemoveColor: (index: number) => void;
    onAddColor: () => void;
    onReset: () => void;
    hideHeader?: boolean;
    selectedColorIds?: string[];
    onDragStart?: (e: React.DragEvent, element: ContextElement) => void;
    onDragEnd?: () => void;
}

export function ColorPalette({
    colors,
    isEdited,
    onUpdateColor,
    onUpdateRole,
    onToggleSelection,
    onRemoveColor,
    onAddColor,
    onReset,
    hideHeader = false,
    selectedColorIds = [],
    onDragStart,
    onDragEnd
}: ColorPaletteProps) {
    const [colorPickerOpen, setColorPickerOpen] = useState<number | null>(null);
    const [localColor, setLocalColor] = useState<{ index: number, color: string } | null>(null);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { theme } = useTheme();

    // Sincronizar con el padre cuando el color local cambia (debounced)
    useEffect(() => {
        if (localColor) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                onUpdateColor(localColor.index, localColor.color);
            }, 100);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [localColor, onUpdateColor]);
    const isDark = theme === 'dark';

    const getContrastColor = (hex: string) => {
        try {
            const rgb = hexToRgb(hex);
            const lab = rgbToLab(rgb);
            return lab.l > 60 ? (isDark ? 'text-zinc-900' : 'text-primary') : 'text-white';
        } catch (e) {
            return 'text-white';
        }
    };

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const handleEyedropper = async (index: number) => {
        if ('EyeDropper' in window) {
            try {
                // Keep track of current state
                const wasOpen = colorPickerOpen === index;

                // @ts-ignore
                const eyeDropper = new window.EyeDropper();
                const result = await eyeDropper.open();

                if (result?.sRGBHex) {
                    onUpdateColor(index, result.sRGBHex);
                }

                // Re-open the popover if it was open before
                // Use setTimeout to ensure the DOM has updated
                if (wasOpen) {
                    setTimeout(() => setColorPickerOpen(index), 50);
                }
            } catch (error) {
                console.log('Eyedropper cancelled or failed', error);
                // Re-open popover even if cancelled
                setTimeout(() => setColorPickerOpen(index), 50);
            }
        }
    };

    return (
        <TooltipProvider delayDuration={400}>
            <Card className={cn(
                "relative overflow-visible z-40 bg-card border-border",
                hideHeader && "border-none shadow-none bg-transparent"
            )}>
                {!hideHeader && (
                    <>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[var(--accent)]/5 to-transparent rounded-full blur-3xl" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                                <Palette className="w-5 h-5 text-primary" />
                                Paleta de colores
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/60 cursor-help">
                                            <Info className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs text-xs bg-popover border-border text-popover-foreground">
                                        <p>Colores principales y secundarios de la marca.</p>
                                    </TooltipContent>
                                </Tooltip>
                                {isEdited && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onReset}
                                        className="text-xs h-7 gap-1"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Restablecer
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                    </>
                )}
                <CardContent className={cn("relative space-y-1 overflow-visible", hideHeader && "p-0")}>
                    <div className={cn(
                        "grid gap-3",
                        hideHeader ? "grid-cols-5" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
                    )}>
                        {colors.map((item, idx) => (
                            <div key={idx} className="group relative">
                                <Tooltip>
                                    <Popover
                                        open={colorPickerOpen === idx}
                                        onOpenChange={(open) => {
                                            setColorPickerOpen(open ? idx : null);
                                            if (!open) setLocalColor(null);
                                        }}
                                    >
                                        <TooltipTrigger asChild>
                                            <PopoverTrigger asChild>
                                                <div
                                                    draggable={onDragStart !== undefined}
                                                    onDragStart={(e) => onDragStart?.(e, {
                                                        id: `color-${idx}`,
                                                        type: 'color',
                                                        value: item.color,
                                                        label: `Color ${idx + 1}`
                                                    })}
                                                    onDragEnd={onDragEnd}
                                                    className={cn(
                                                        "aspect-square rounded-full cursor-grab active:cursor-grabbing transition-all duration-300",
                                                        "hover:scale-105 hover:shadow-xl border-2 border-border",
                                                        "hover:border-primary relative overflow-visible",
                                                        colorPickerOpen === idx ? 'border-primary ring-2 ring-primary/20' : '',
                                                        selectedColorIds.includes(`color-${idx}`)
                                                            ? "border-primary shadow-sm"
                                                            : "border-transparent hover:border-border"
                                                    )}
                                                    style={{ backgroundColor: item.color }}
                                                >
                                                    {/* Toggle Selection Checkmark */}
                                                    {onToggleSelection && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onToggleSelection(idx);
                                                            }}
                                                            className={cn(
                                                                "absolute top-1.5 left-1.5 flex items-center justify-center transition-all duration-200 z-30",
                                                                selectedColorIds.includes(`color-${idx}`)
                                                                    ? `${getContrastColor(item.color)} drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] scale-110 opacity-100`
                                                                    : "text-white/20 scale-90 opacity-0 group-hover:opacity-100 hover:text-white/60 hover:scale-110"
                                                            )}
                                                            title={selectedColorIds.includes(`color-${idx}`) ? "Deseleccionar para IA" : "Seleccionar para IA"}
                                                        >
                                                            <Check className="w-4 h-4 stroke-[3.5px]" />
                                                        </button>
                                                    )}

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemoveColor(idx);
                                                        }}
                                                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:scale-110 shadow-lg z-20"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </PopoverTrigger>
                                        </TooltipTrigger>
                                        <PopoverContent className="w-[240px] p-3 border-border bg-popover z-[100]" side="right" align="start">
                                            <HexColorPicker
                                                color={localColor?.index === idx ? localColor.color : item.color}
                                                onChange={(newColor) => {
                                                    setLocalColor({ index: idx, color: newColor });
                                                }}
                                                style={{ width: '100%' }}
                                            />
                                            <div className="mt-3 flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEyedropper(idx)}
                                                    className="flex-1 gap-1 h-8 text-xs font-medium"
                                                >
                                                    <Pipette className="w-4 h-4" />
                                                    Capturar
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setColorPickerOpen(null)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <TooltipContent side="bottom" className="flex flex-col gap-1 p-2 bg-popover border-border shadow-md z-[110]">
                                        <p className="text-xs font-mono font-bold text-foreground">HEX: {item.color.toUpperCase()}</p>
                                        <p className="text-[10px] text-muted-foreground">Rol: <span className="text-primary font-medium">{item.role || 'Neutral'}</span></p>
                                    </TooltipContent>
                                </Tooltip>

                                {!hideHeader && (
                                    <div className="mt-2 space-y-1">
                                        <button
                                            onClick={() => copyToClipboard(item.color)}
                                            className="w-full text-[10px] font-mono text-center px-1 py-1 rounded bg-muted hover:bg-muted/80 transition-colors relative group truncate border border-transparent hover:border-border"
                                        >
                                            {item.color.toUpperCase()}
                                            {copiedColor === item.color && (
                                                <span className="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground rounded text-[10px] font-bold">
                                                    <Check className="w-2.5 h-2.5 mr-1" />
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const roles = ['Principal', 'Secundario', 'Texto', 'Fondo', 'Acento', 'Neutral'];
                                                const currentIndex = roles.indexOf(item.role || 'Neutral');
                                                const nextRole = roles[(currentIndex + 1) % roles.length];
                                                onUpdateRole(idx, nextRole);
                                            }}
                                            className="w-full text-[10px] text-center px-1 py-1 rounded bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium truncate"
                                        >
                                            {item.role || 'Neutral'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {colors.length < 10 && (
                            <div
                                onClick={onAddColor}
                                className="aspect-square rounded-full border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors group bg-muted/50 cursor-pointer w-full"
                            >
                                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
