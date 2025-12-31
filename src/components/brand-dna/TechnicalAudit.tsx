'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Camera, Globe, Cpu, ChevronRight, AlertCircle } from 'lucide-react';
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
    { id: 'thum', label: 'Thum.io', prefix: 'Capture: Thum.io', description: 'Tercera opción de fallback para screenshots.' },
];

const CONTENT_CHAIN: ChainStep[] = [
    { id: 'fetch', label: 'Fetch', prefix: 'Content: Fetch', description: 'Descarga inicial del código HTML crudo.' },
    { id: 'jina', label: 'Jina', prefix: 'Content: Jina', description: 'Extrae contenido limpio en formato Markdown para la IA.' },
    { id: 'scraper', label: 'Scraper', prefix: 'Content: Scraper', description: 'Analiza la estructura DOM y clases CSS.' },
    { id: 'assets', label: 'Assets', prefix: 'Content: Assets', description: 'Procesa, optimiza y sube logos e imágenes.' },
];

const AI_CHAIN: ChainStep[] = [
    { id: 'gemini', label: 'Gemini', prefix: 'Analysis: Gemini', description: 'Motor IA principal (Google Gemini) para análisis cognitivo.' },
    { id: 'groq', label: 'Groq', prefix: 'Analysis: Groq', description: 'Motor IA ultrarrápido (Llama 3). Se activa si Gemini falla.' },
    { id: 'heuristic', label: 'Heuristic', prefix: 'Analysis: Heuristic', description: 'Análisis basado en reglas si fallan todas las IAs.' },
];

export function TechnicalAudit({ trace = [], isVisible }: TechnicalAuditProps) {
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
                        // Buscar el ÚLTIMO estado (el más reciente) revertiendo el array temporalmente
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
                                        <TooltipContent side="bottom" className="text-xs bg-zinc-900 border-zinc-800 text-zinc-300 max-w-[200px]">
                                            <p>{step.description}</p>
                                            {entry?.details && (
                                                <p className="mt-1 pt-1 opacity-70 border-t border-zinc-700 italic font-mono text-[10px]">
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

    return (
        <Card className="mt-8 bg-card border-border shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-base text-foreground font-bold uppercase">
                            <Bug className="w-5 h-5 text-primary" />
                            Arquitectura de Extracción
                        </CardTitle>
                        <p className="text-[11px] text-muted-foreground mt-0.5 ml-7">
                            Monitor de Trazabilidad en Tiempo Real
                        </p>
                    </div>

                    <div className="flex gap-4 items-center bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Éxito</span>
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
                    {/* Decorative line connecting rows */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border/60 -z-10 border-l border-dashed border-zinc-300 dark:border-zinc-700" />

                    {renderChain("Secuencia de Captura Visual", <Camera className="w-3.5 h-3.5" />, CAPTURE_CHAIN)}
                    {renderChain("Secuencia de Procesamiento de Código", <Globe className="w-3.5 h-3.5" />, CONTENT_CHAIN)}
                    {renderChain("Secuencia de Inteligencia Cognitiva", <Cpu className="w-3.5 h-3.5" />, AI_CHAIN)}
                </div>
            </CardContent>
        </Card>
    );
}
