'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Camera, Globe, Cpu, ChevronRight, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApiTraceEntry {
    action: string;
    status: 'pending' | 'success' | 'fail' | 'highlight';
    timestamp: number;
    details?: string;
    duration?: number;
}

interface TechnicalAuditProps {
    trace?: ApiTraceEntry[];
    isVisible: boolean;
    debugData?: any;
}

interface ChainStep {
    id: string;
    label: string;
    prefix: string;
    description: string;
}

const CAPTURE_CHAIN: ChainStep[] = [
    { id: 'apiflash', label: 'ApiFlash', prefix: 'Capture: ApiFlash', description: 'Servicio de captura de pantalla de alta fidelidad.' },
    { id: 'layer', label: 'Layer', prefix: 'Capture: Layer', description: 'Sistema de respaldo para capturas visuales.' },
    { id: 'thum', label: 'Thum.io', prefix: 'Capture: Thum.io', description: 'Tercera opcion de fallback para screenshots.' },
];

const CONTENT_CHAIN: ChainStep[] = [
    { id: 'fetch', label: 'Fetch', prefix: 'Content: Fetch', description: 'Descarga inicial del codigo HTML crudo.' },
    { id: 'jina', label: 'Jina', prefix: 'Content: Jina', description: 'Extrae contenido limpio en formato Markdown para la IA.' },
    { id: 'scraper', label: 'Scraper', prefix: 'Content: Scraper', description: 'Analiza la estructura DOM y clases CSS.' },
    { id: 'assets', label: 'Assets', prefix: 'Content: Assets', description: 'Procesa, optimiza y sube logos e imagenes.' },
];

const AI_CHAIN: ChainStep[] = [
    { id: 'gemini', label: 'Gemini', prefix: 'Analysis: Gemini', description: 'Motor IA principal para analisis cognitivo.' },
    { id: 'groq', label: 'Groq', prefix: 'Analysis: Groq', description: 'Motor IA rapido de respaldo.' },
    { id: 'heuristic', label: 'Heuristic', prefix: 'Analysis: Heuristic', description: 'Analisis por reglas si fallan las IAs.' },
];

export function TechnicalAudit({ trace = [], isVisible, debugData }: TechnicalAuditProps) {
    if (!isVisible) return null;

    const renderChain = (title: string, icon: any, steps: ChainStep[]) => {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {steps.map((step, idx) => {
                        const entry = [...trace].reverse().find(t => t.action.startsWith(step.prefix));
                        const status = !entry ? 'inactive' : entry.status === 'fail' ? 'fail' : entry.status === 'success' || entry.status === 'highlight' ? 'success' : 'pending';

                        return (
                            <div key={step.id} className="flex items-center shrink-0">
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={cn(
                                                "px-4 py-2.5 rounded-2xl border flex flex-col gap-1 min-w-[110px] transition-all duration-500 shadow-sm cursor-help",
                                                status === 'success' ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 ring-1 ring-emerald-500/20" :
                                                    status === 'fail' ? "bg-rose-500/10 border-rose-500/40 text-rose-500 ring-1 ring-rose-500/20" :
                                                        status === 'pending' ? "bg-sky-500/10 border-sky-500/40 text-sky-500 animate-pulse ring-1 ring-sky-500/20" :
                                                            "bg-muted/40 border-border text-muted-foreground opacity-60 grayscale"
                                            )}>
                                                <span className="text-[9px] font-bold opacity-80 uppercase tracking-tighter">{step.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        status === 'success' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" :
                                                            status === 'fail' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" :
                                                                status === 'pending' ? "bg-sky-500" : "bg-zinc-600"
                                                    )} />
                                                    <span className="text-[12px] font-black tracking-tight">{entry ? (entry.status === 'fail' ? 'ERROR' : 'OK') : 'SKIP'}</span>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="text-xs max-w-[200px]">
                                            <p>{step.description}</p>
                                            {entry?.details && (
                                                <p className="mt-1 pt-1 opacity-70 border-t border-border/60 italic font-mono text-[10px] text-muted-foreground">
                                                    {entry.details}
                                                </p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {idx < steps.length - 1 && (
                                    <div className="mx-1 h-px w-4 bg-zinc-700 relative">
                                        <ChevronRight className="w-3 h-3 text-zinc-600 absolute -top-[5.5px] -right-1" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const normalizePalette = (items: any): string[] => {
        if (!Array.isArray(items)) return [];
        return items
            .map((item) => {
                if (typeof item === 'string') return item;
                if (item && typeof item.color === 'string') return item.color;
                return null;
            })
            .filter((color): color is string => Boolean(color) && color.startsWith('#'));
    };

    const renderSwatches = (title: string, colors: string[]) => (
        <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
            <div className="flex flex-wrap gap-2">
                {colors.length > 0 ? (
                    colors.map((color, idx) => (
                        <div key={`${title}-${idx}-${color}`} className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2 py-1">
                            <span className="h-3 w-3 rounded-full border border-white/40" style={{ backgroundColor: color }} />
                            <span className="font-mono text-[10px] text-foreground/80">{color}</span>
                        </div>
                    ))
                ) : (
                    <span className="text-xs text-muted-foreground/70">Sin datos</span>
                )}
            </div>
        </div>
    );

    const visualPalette = normalizePalette(debugData?.visual_palette);
    const weightedPalette = normalizePalette(debugData?.weighted_palette);
    const logoPalette = normalizePalette(debugData?.logo_palette);
    const designPalette = normalizePalette(debugData?.design_palette);
    const svgPalette = normalizePalette(debugData?.svg_palette);
    const codePalette = normalizePalette(debugData?.code_palette);
    const finalPalette = normalizePalette(debugData?.final_palette);
    const weights = debugData?.consensus_weights || {};

    return (
        <Card className="mt-8 glass-panel border-0 shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-base text-foreground font-bold uppercase">
                            <Bug className="w-5 h-5 text-primary" />
                            Arquitectura de Extraccion
                        </CardTitle>
                        <p className="text-[11px] text-muted-foreground mt-0.5 ml-7">
                            Monitor de trazabilidad del pipeline
                        </p>
                    </div>

                    <div className="flex gap-4 items-center bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Exito</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Fallo</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Omitido</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-8">
                <div className="grid grid-cols-1 gap-8 relative">
                    <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border/60 -z-10 border-l border-dashed border-zinc-300 dark:border-zinc-700" />

                    {renderChain("Secuencia de captura visual", <Camera className="w-3.5 h-3.5" />, CAPTURE_CHAIN)}
                    {renderChain("Secuencia de procesamiento de codigo", <Globe className="w-3.5 h-3.5" />, CONTENT_CHAIN)}
                    {renderChain("Secuencia de inteligencia", <Cpu className="w-3.5 h-3.5" />, AI_CHAIN)}
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        <p className="text-sm font-semibold">Depuracion de consenso de paleta</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderSwatches("Visual", visualPalette)}
                        {renderSwatches("Weighted DOM", weightedPalette)}
                        {renderSwatches("Logo", logoPalette)}
                        {renderSwatches("Design", designPalette)}
                        {renderSwatches("SVG", svgPalette)}
                        {renderSwatches("Code", codePalette)}
                    </div>

                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Pesos de consenso</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(weights).length > 0 ? (
                                Object.entries(weights).map(([key, value]) => (
                                    <span key={key} className="rounded-full border border-border/70 bg-muted/30 px-2 py-1 text-[10px] font-mono">
                                        {key}: {Number(value).toFixed(2)}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-muted-foreground/70">Sin datos</span>
                            )}
                        </div>
                    </div>

                    {renderSwatches("Paleta final", finalPalette)}
                </div>
            </CardContent>
        </Card>
    );
}
