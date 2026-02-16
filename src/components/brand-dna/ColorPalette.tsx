'use client';

import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type ContextElement } from "@/app/image/page";
import { cn } from '@/lib/utils';

import { Palette, Info, RotateCcw, X, Pipette, Check, Plus, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
            if (!rgb) return 'text-white';
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
                "relative overflow-visible z-40 glass-panel border-0 shadow-none",
                hideHeader && "bg-transparent backdrop-blur-0 border-none shadow-none"
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
                        "grid gap-4",
                        "grid-cols-5"
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
                                                        label: item.role || `Color ${idx + 1}`
                                                    })}
                                                    onDragEnd={onDragEnd}
                                                    className={cn(
                                                        "aspect-square rounded-full cursor-grab active:cursor-grabbing transition-all duration-300",
                                                        "hover:scale-110 hover:shadow-xl border-2",
                                                        "relative overflow-visible flex items-center justify-center",
                                                        colorPickerOpen === idx ? 'border-primary ring-2 ring-primary/20' : '',
                                                        selectedColorIds.includes(`color-${idx}`)
                                                            ? "border-primary shadow-md"
                                                            : "border-white/30 dark:border-white/20 hover:border-primary/50"
                                                    )}
                                                    style={{ backgroundColor: item.color }}
                                                >
                                                    {/* Role Indicator Letter */}
                                                    {item.role && (
                                                        <span className={cn(
                                                            "text-[12px] font-black select-none pointer-events-none uppercase tracking-tight leading-none text-center",
                                                            getContrastColor(item.color)
                                                        )}>
                                                            {item.role.replace(/\d+$/, '').trim()}
                                                        </span>
                                                    )}

                                                    {/* Toggle Selection Checkmark Overlay */}
                                                    {onToggleSelection && selectedColorIds.includes(`color-${idx}`) && (
                                                        <div
                                                            className={cn(
                                                                "absolute -bottom-1 -right-1 flex items-center justify-center z-30 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md",
                                                                "text-primary-foreground"
                                                            )}
                                                        >
                                                            <Check className="w-3 h-3 stroke-[3px]" />
                                                        </div>
                                                    )}

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemoveColor(idx);
                                                        }}
                                                        className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:scale-110 shadow-lg z-50"
                                                    >
                                                        <X className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            </PopoverTrigger>
                                        </TooltipTrigger>
                                        <PopoverContent className="w-[240px] p-3 border-border bg-popover z-[100]" side="right" align="start">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-2 px-1">Color de Marca</p>
                                                    <HexColorPicker
                                                        color={localColor?.index === idx ? localColor.color : item.color}
                                                        onChange={(newColor) => {
                                                            setLocalColor({ index: idx, color: newColor });
                                                        }}
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">Rol del Color</p>
                                                    <div className="flex gap-1 bg-muted/30 p-1 rounded-xl border border-white/10">
                                                        {(['Texto', 'Fondo', 'Acento'] as const).map(role => (
                                                            <Button
                                                                key={role}
                                                                variant={item.role === role ? "secondary" : "ghost"}
                                                                size="sm"
                                                                className={cn(
                                                                    "flex-1 h-7 text-[10px] px-0 rounded-lg transition-all",
                                                                    item.role === role
                                                                        ? "bg-white dark:bg-zinc-800 shadow-sm text-primary font-bold"
                                                                        : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground"
                                                                )}
                                                                onClick={() => onUpdateRole(idx, role)}
                                                            >
                                                                {role}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2 border-t border-border/40">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEyedropper(idx)}
                                                        className="flex-1 gap-1 h-8 text-xs font-medium rounded-lg"
                                                    >
                                                        <Pipette className="w-4 h-4" />
                                                        Capturar
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-lg" onClick={() => setColorPickerOpen(null)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <TooltipContent side="bottom" className="flex flex-col gap-1 p-2 bg-popover border-border shadow-md z-[110]">
                                        <p className="text-xs font-bold text-foreground">{item.role || 'Sin rol'}</p>
                                        <p className="text-[10px] font-mono text-muted-foreground">{item.color.toUpperCase()}</p>
                                        <p className="text-[9px] text-muted-foreground/60">Doble clic para cambiar rol</p>
                                    </TooltipContent>
                                </Tooltip>

                                <div className="mt-2 space-y-1">
                                    {/* Always show high-visibility editable HEX input below (for desktop/manual edit) */}
                                    <div className="relative group/hex-input">
                                        <Input
                                            value={item.color.toUpperCase()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Basic sanitization and limit
                                                if (val.length <= 7) {
                                                    onUpdateColor(idx, val.startsWith('#') ? val : `#${val}`);
                                                }
                                            }}
                                            className={cn(
                                                "w-full h-8 text-[11px] font-mono text-center bg-muted/50 border-border/50 focus:border-primary/50 transition-all uppercase px-1 py-0 rounded-lg group-hover/hex-input:bg-muted"
                                            )}
                                        />
                                        <button
                                            onClick={() => copyToClipboard(item.color)}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/hex-input:opacity-100 transition-opacity p-1 hover:text-primary"
                                            title="Copiar HEX"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {copiedColor === item.color && (
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-primary/10 rounded-lg animate-in fade-in duration-300">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {colors.length < 10 && (
                            <div
                                onClick={onAddColor}
                                className="aspect-square rounded-full border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors group bg-muted/50 cursor-pointer w-full"
                            >
                                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
