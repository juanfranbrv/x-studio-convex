'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

import { Terminal, Bug, X, TriangleAlert } from 'lucide-react';

interface TechnicalAuditProps {
    data: any;
}

export function TechnicalAudit({ data }: TechnicalAuditProps) {
    if (!data) return null;

    return (
        <Card className="mt-8 bg-black/80 border-slate-700 text-slate-300 font-mono text-sm shadow-2xl">
            <CardHeader className="border-b border-slate-700 pb-3">
                <CardTitle className="flex items-center gap-3 text-slate-100 text-base">
                    <Terminal className="w-5 h-5 text-emerald-500" />
                    Auditoría Técnica del Extractor
                    <div className="flex gap-2 ml-auto">
                        <Badge variant="outline" className="text-xs h-5 border-emerald-500/50 text-emerald-400 bg-emerald-500/5">
                            AI-GEN v2.0
                        </Badge>
                        <Badge variant="outline" className="text-xs h-5 border-blue-500/50 text-blue-400 bg-blue-500/5">
                            FIRE-SC-v4
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
                {/* Paletas Técnicas */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            Fuentes de Color Extraídas (Consenso Engine)
                        </h4>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20">AI-GEN v2.4</Badge>
                            <Badge variant="outline" className="text-[10px] bg-orange-500/10 text-orange-400 border-orange-500/20">FIRE-SC v4.2</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { id: 'design_palette', label: 'Design System Intent' },
                            { id: 'weighted_palette', label: 'Weighted DOM (JS)' },
                            { id: 'visual_palette', label: 'AI Visual (Vision)' },
                            { id: 'logo_palette', label: 'Logo Extraction' },
                            { id: 'svg_palette', label: 'SVG & Icons' },
                            { id: 'code_palette', label: 'CSS / Root Variables' },
                        ].map((source) => {
                            const colors = data.debug?.[source.id] || [];
                            const isEmpty = colors.length === 0 || (colors.length === 1 && colors[0].startsWith('#NO_'));

                            return (
                                <div key={source.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3 group hover:border-slate-700 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-300">{source.label}</span>
                                        <Badge variant="secondary" className="text-[9px] bg-slate-800 text-slate-400 group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                                            {isEmpty ? 0 : colors.length} slots
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 p-2 bg-black/30 rounded-lg min-h-[44px] items-center justify-center">
                                        {!isEmpty ? (
                                            colors.slice(0, 15).map((c: any, i: number) => {
                                                const hex = typeof c === 'string' ? c : c.hex;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-7 h-7 rounded-sm border border-white/10 shadow-sm"
                                                        style={{ backgroundColor: hex }}
                                                        title={hex}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 opacity-40">
                                                <X className="w-4 h-4 text-red-500" />
                                                <span className="text-[10px] italic text-slate-500">
                                                    {colors[0]?.substring(1) || 'Sin datos'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Motor de Consenso (Lógica de Pesos) */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                        <Bug className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">
                            Motor de Consenso: Lógica de Ponderación
                        </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                        {[
                            { id: 'visual', label: 'Visual Grid', weight: data.debug?.consensus_weights?.visual || 0.50, color: 'text-emerald-400' },
                            { id: 'weighted', label: 'Weighted DOM', weight: data.debug?.consensus_weights?.weighted || 0.15, color: 'text-blue-400' },
                            { id: 'logo', label: 'Logo Audit', weight: data.debug?.consensus_weights?.logo || 0.15, color: 'text-orange-400' },
                            { id: 'design', label: 'Design Intent', weight: data.debug?.consensus_weights?.design || 0.10, color: 'text-purple-400' },
                            { id: 'svg', label: 'SVG Palette', weight: data.debug?.consensus_weights?.svg || 0.05, color: 'text-pink-400' },
                            { id: 'code', label: 'Code Sweep', weight: data.debug?.consensus_weights?.code || 0.05, color: 'text-slate-400' },
                        ].map((w) => (
                            <div key={w.id} className="flex flex-col items-center p-2 rounded bg-black/40 border border-slate-800">
                                <span className="text-[9px] text-slate-500 font-bold uppercase mb-1">{w.label}</span>
                                <span className={`text-sm font-black ${w.color}`}>{(w.weight * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-relaxed bg-black/20 p-3 rounded border border-white/5">
                        <p className="mb-2 italic">
                            <TriangleAlert className="w-3 h-3 inline-block mr-1 text-orange-500" />
                            <strong>Lógica de Redundancia:</strong> Si un color aparece en múltiples fuentes, recibe un bono multiplicador:
                            <span className="text-slate-300 ml-1">2 fuentes (1.5x), 3 fuentes (2.5x), 4+ fuentes (5.0x)</span>.
                        </p>
                        <p>
                            Los colores son agrupados mediante <strong>Delta-E (perceptual)</strong> con un umbral de &lt; 10 para evitar duplicidad de tonos visualmente idénticos.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-slate-100 mb-4 text-sm font-bold uppercase tracking-wider">Candidatos a Logo (Scored)</h4>
                        <ScrollArea className="h-[280px] bg-slate-900/40 rounded-lg border border-slate-800 p-3">
                            <div className="space-y-3">
                                {data.debug?.logo_candidates?.map((logo: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-14 h-14 transparency-grid bg-white/5 rounded-md flex items-center justify-center p-1.5 overflow-hidden border border-slate-800">
                                            {logo.url ? (
                                                <img src={logo.url} className="max-w-full max-h-full object-contain" alt={`Candidate ${i}`} />
                                            ) : (
                                                <div className="text-[10px] text-slate-500 font-bold">SVG</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-xs text-slate-400 mb-2 font-medium">{logo.url || 'Contenido SVG Inline'}</p>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="text-[10px] px-2 py-0 border-slate-700 text-slate-400 capitalize bg-slate-800/50">{logo.type || 'unknown'}</Badge>
                                                <Badge variant="outline" className="text-[10px] px-2 py-0 border-emerald-900/50 text-emerald-400 bg-emerald-500/5">Score: {logo.score?.toFixed(2)}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <div>
                        <h4 className="text-slate-100 mb-4 text-sm font-bold uppercase tracking-wider">Análisis Técnico</h4>
                        <div className="bg-slate-900/40 rounded-lg border border-slate-800 p-4 space-y-6 h-[280px] overflow-auto">
                            <div>
                                <span className="text-slate-500 block uppercase text-[10px] font-bold tracking-widest mb-2">Tipografías Detectadas:</span>
                                <div className="flex flex-wrap gap-2">
                                    {data.debug?.code_fonts?.length > 0 ? (
                                        (data.debug.code_fonts).map((f: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-xs px-2 py-0.5 border-slate-700 text-slate-200 bg-slate-800/50">{f}</Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-600 italic">No se detectaron fuentes en el código.</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 block uppercase text-[10px] font-bold tracking-widest mb-2">Ficheros CSS Analizados:</span>
                                <div className="space-y-2">
                                    {data.debug?.css_links?.length > 0 ? (
                                        <div className="grid gap-2">
                                            {data.debug.css_links.map((link: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded group hover:bg-blue-500/10 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                                    <span className="text-[11px] text-slate-400 truncate flex-1" title={link}>
                                                        {link.split('/').pop()}
                                                    </span>
                                                    <span className="text-[9px] text-slate-600 hidden group-hover:block truncate max-w-[150px]">
                                                        {link}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-600 italic">No se detectaron archivos CSS externos.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <style jsx>{`
                .transparency-grid {
                    background-image: 
                        linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%);
                    background-size: 12px 12px;
                    background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
                }
            `}</style>
        </Card>
    );
}
