'use client';

import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type ContextElement } from "@/app/image/page";
import { cn } from '@/lib/utils';

import { Info } from 'lucide-react';
import { IconPalette, IconRotate, IconClose, IconColorPicker, IconCheck, IconPlus, IconCopy } from '@/components/ui/icons';
import { useTheme } from 'next-themes';
import { hexToRgb, rgbToLab } from '@/lib/color-utils';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('brandKit');
    const [colorPickerOpen, setColorPickerOpen] = useState<number | null>(null);
    const [localColor, setLocalColor] = useState<{ index: number, color: string } | null>(null);
    const [draggedColorIndex, setDraggedColorIndex] = useState<number | null>(null);
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

    const normalizeRole = (role?: string): 'Texto' | 'Fondo' | 'Acento' => {
        const raw = (role || '').toLowerCase();
        if (raw.includes('text') || raw.includes('texto')) return 'Texto';
        if (raw.includes('fondo') || raw.includes('background')) return 'Fondo';
        return 'Acento';
    };

    const textIndex = colors.findIndex((c) => normalizeRole(c.role) === 'Texto');
    const backgroundIndex = colors.findIndex((c) => normalizeRole(c.role) === 'Fondo');
    const accentIndexes = colors
        .map((item, index) => ({ item, index }))
        .filter(({ item, index }) =>
            normalizeRole(item.role) === 'Acento'
            && index !== textIndex
            && index !== backgroundIndex
        )
        .map(({ index }) => index);
    const orderedIndexes = [
        ...(textIndex >= 0 ? [textIndex] : []),
        ...(backgroundIndex >= 0 && backgroundIndex !== textIndex ? [backgroundIndex] : []),
        ...accentIndexes
    ];

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

    const swapColorRoles = (sourceIndex: number, targetIndex: number) => {
        if (sourceIndex === targetIndex) return;
        const sourceRole = colors[sourceIndex]?.role || 'Acento';
        const targetRole = colors[targetIndex]?.role || 'Acento';
        onUpdateRole(sourceIndex, targetRole);
        onUpdateRole(targetIndex, sourceRole);
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
                                <IconPalette className="w-5 h-5 text-primary" />
                                {t('palette.title', { defaultValue: 'Color palette' })}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/60 cursor-help">
                                            <Info className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs text-xs bg-popover border-border text-popover-foreground">
                                        <p>{t('palette.tooltip', { defaultValue: 'Primary and secondary brand colors.' })}</p>
                                    </TooltipContent>
                                </Tooltip>
                                {isEdited && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onReset}
                                        className="text-xs h-7 gap-1"
                                    >
                                        <IconRotate className="w-3.5 h-3.5" />
                                        {t('palette.reset', { defaultValue: 'Reset' })}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                    </>
                )}
                <CardContent className={cn("relative space-y-1 overflow-visible", hideHeader && "p-0")}>
                    <div className="flex items-start gap-3 flex-wrap">
                        {orderedIndexes.map((idx, visualIdx) => {
                            const item = colors[idx];
                            const role = normalizeRole(item.role);
                            const isAccent = role === 'Acento';
                            const firstAccentVisualIndex = orderedIndexes.findIndex((id) => normalizeRole(colors[id]?.role) === 'Acento');
                            const addLeftSpacingForAccents = isAccent && visualIdx === firstAccentVisualIndex;
                            return (
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
                                                    draggable
                                                    onDragStart={(e) => {
                                                        setDraggedColorIndex(idx);
                                                        onDragStart?.(e, {
                                                            id: `color-${idx}`,
                                                            type: 'color',
                                                            value: item.color,
                                                            label: item.role || `Color ${idx + 1}`
                                                        });
                                                    }}
                                                    onDragEnd={(e) => {
                                                        setDraggedColorIndex(null);
                                                        onDragEnd?.();
                                                    }}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        if (draggedColorIndex === null) return;
                                                        swapColorRoles(draggedColorIndex, idx);
                                                        setDraggedColorIndex(null);
                                                    }}
                                                    className={cn(
                                                        "aspect-square rounded-full cursor-grab active:cursor-grabbing transition-all duration-300",
                                                        "hover:scale-110 hover:shadow-xl border-2",
                                                        "relative overflow-visible flex items-center justify-center w-20 h-20",
                                                        addLeftSpacingForAccents && "ml-2",
                                                        colorPickerOpen === idx ? 'border-primary ring-2 ring-primary/20' : '',
                                                        draggedColorIndex !== null && draggedColorIndex !== idx && 'ring-2 ring-primary/20',
                                                        selectedColorIds.includes(`color-${idx}`)
                                                            ? "border-primary shadow-md"
                                                            : "border-white/30 hover:border-primary/50"
                                                    )}
                                                    style={{ backgroundColor: item.color }}
                                                >
                                                    {/* Toggle Selection Checkmark Overlay */}
                                                    {onToggleSelection && selectedColorIds.includes(`color-${idx}`) && (
                                                        <div
                                                            className={cn(
                                                                "absolute -bottom-1 -right-1 flex items-center justify-center z-30 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-md",
                                                                "text-primary-foreground"
                                                            )}
                                                        >
                                                            <IconCheck className="w-3 h-3 stroke-[3px]" />
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
                                                        <IconClose className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            </PopoverTrigger>
                                        </TooltipTrigger>
                                        <PopoverContent className="w-[240px] p-3 border-border bg-popover z-[100]" side="right" align="start">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-2 px-1">{t('palette.brandColor', { defaultValue: 'Brand color' })}</p>
                                                    <HexColorPicker
                                                        color={localColor?.index === idx ? localColor.color : item.color}
                                                        onChange={(newColor) => {
                                                            setLocalColor({ index: idx, color: newColor });
                                                        }}
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">{t('palette.colorRole', { defaultValue: 'Color role' })}</p>
                                                    <div className="flex gap-1 bg-muted/30 p-1 rounded-xl border border-white/10">
                                                        {(['Texto', 'Fondo', 'Acento'] as const).map(role => (
                                                            <Button
                                                                key={role}
                                                                variant={item.role === role ? "secondary" : "ghost"}
                                                                size="sm"
                                                                className={cn(
                                                                    "flex-1 h-7 text-[10px] px-0 rounded-lg transition-all",
                                                                    item.role === role
                                                                        ? "bg-white shadow-sm text-primary font-bold"
                                                                        : "hover:bg-white/50 text-muted-foreground"
                                                                )}
                                                                onClick={() => onUpdateRole(idx, role)}
                                                            >
                                                                {t(`palette.roles.${role}`, { defaultValue: role })}
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
                                                        <IconColorPicker className="w-4 h-4" />
                                                        {t('palette.capture', { defaultValue: 'Capture' })}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-lg" onClick={() => setColorPickerOpen(null)}>
                                                        <IconClose className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <TooltipContent side="bottom" className="flex flex-col gap-1 p-2 bg-popover border-border shadow-md z-[110]">
                                        <p className="text-xs font-bold text-foreground">{t(`palette.roles.${role}`, { defaultValue: role })}</p>
                                        <p className="text-[9px] text-muted-foreground/60">{t('palette.dragHint', { defaultValue: 'Drag onto another color to swap roles' })}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <div className={cn("mt-2 text-center", addLeftSpacingForAccents && "ml-2")}>
                                    <span className="text-xs text-muted-foreground">{t(`palette.roles.${role}`, { defaultValue: role })}</span>
                                </div>
                            </div>
                        )})}
                        {colors.length < 10 && (
                            <div
                                onClick={onAddColor}
                                className="rounded-full border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors group bg-muted/50 cursor-pointer w-20 h-20"
                            >
                                <IconPlus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
