'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

import { Terminal, Bug } from 'lucide-react';

interface TechnicalAuditProps {
    data: any;
}

export function TechnicalAudit({ data }: TechnicalAuditProps) {
    if (!data) return null;

    return (
        <Card className="mt-8 bg-black/80 border-slate-700 text-slate-300 font-mono text-xs">
            <CardHeader className="border-b border-slate-700 pb-2">
                <CardTitle className="flex items-center gap-2 text-slate-100 text-sm">
                    <Terminal className="w-4 h-4" />
                    Auditoría Técnica del Extractor
                    <div className="flex gap-2 ml-auto">
                        <Badge variant="outline" className="text-[10px] h-4 border-emerald-500/50 text-emerald-400 bg-emerald-500/5">
                            AI-GEN v2.0
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-4 border-blue-500/50 text-blue-400 bg-blue-500/5">
                            FIRE-SC-v4
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
                <div>
                    <h4 className="text-slate-100 mb-2 flex items-center gap-2">
                        <Bug className="w-3.5 h-3.5" />
                        Fuentes de Color Extraídas (Consenso)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { id: 'design_palette', label: 'Design System' },
                            { id: 'weighted_palette', label: 'Weighted DOM' },
                            { id: 'visual_palette', label: 'AI Visual' },
                            { id: 'logo_palette', label: 'Logo Colors' },
                            { id: 'svg_palette', label: 'SVG & Icons' },
                            { id: 'code_palette', label: 'CSS / Root' }
                        ].map((source) => (
                            <div key={source.id} className="bg-slate-900/50 rounded p-3 border border-slate-800">
                                <span className="text-slate-500 block mb-2 uppercase text-[9px] tracking-widest">{source.label}</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.debug?.[source.id]?.length > 0 ? (
                                        data.debug[source.id].slice(0, 12).map((c: any, i: number) => (
                                            <div
                                                key={i}
                                                className="w-4 h-4 rounded-sm border border-slate-700"
                                                style={{ backgroundColor: typeof c === 'string' ? c : c.hex }}
                                                title={typeof c === 'string' ? c : `${c.hex} (w: ${c.weight})`}
                                            />
                                        ))
                                    ) : (
                                        <span className="text-[10px] text-slate-600 italic">Sin datos</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-slate-100 mb-2">Candidatos a Logo (Scored)</h4>
                        <ScrollArea className="h-[200px] bg-slate-900/50 rounded border border-slate-800 p-2">
                            <div className="space-y-2">
                                {data.debug?.logo_candidates?.map((logo: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded border border-white/5">
                                        <div className="w-10 h-10 transparency-grid bg-white/10 rounded flex items-center justify-center p-1">
                                            {logo.url ? (
                                                <img src={logo.url} className="max-w-full max-h-full object-contain" alt={`Candidate ${i}`} />
                                            ) : (
                                                <div className="text-[10px] text-slate-500">SVG</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-[10px] text-slate-400">{logo.url || 'Inline SVG Content'}</p>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400 capitalize">{logo.type || 'unknown'}</Badge>
                                                <Badge variant="outline" className="text-[9px] border-emerald-900/50 text-emerald-400">Score: {logo.score?.toFixed(2)}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <div>
                        <h4 className="text-slate-100 mb-2">Detección de Tipografía</h4>
                        <div className="bg-slate-900/50 rounded border border-slate-800 p-3 space-y-4">
                            <div>
                                <span className="text-slate-500 block uppercase text-[9px] mb-1">Fuentes en CSS:</span>
                                <div className="flex flex-wrap gap-1">
                                    {(data.debug?.code_fonts || []).map((f: string, i: number) => (
                                        <Badge key={i} variant="outline" className="text-[10px] border-slate-700 text-slate-300">{f}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 block uppercase text-[9px] mb-1">Assets CSS Detectados:</span>
                                <div className="text-[10px] text-slate-400 max-h-24 overflow-y-auto">
                                    {data.debug?.css_links?.length > 0 ? (
                                        <ul className="list-disc pl-4 space-y-1">
                                            {data.debug.css_links.map((link: string, i: number) => (
                                                <li key={i} className="truncate">{link}</li>
                                            ))}
                                        </ul>
                                    ) : "No se detectaron archivos CSS externos."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <style jsx>{`
                .transparency-grid {
                    background-image: 
                        linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%);
                    background-size: 10px 10px;
                    background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
                }
            `}</style>
        </Card>
    );
}
