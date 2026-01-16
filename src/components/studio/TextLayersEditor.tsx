import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, MousePointerClick, Plus, Fingerprint } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TextAsset } from '@/lib/creation-flow-types'

interface TextLayersEditorProps {
    headline: string
    cta: string
    customTexts: Record<string, string>
    textAssets?: TextAsset[]
    onHeadlineChange: (value: string) => void
    onCtaChange: (value: string) => void
    onCustomTextChange: (id: string, value: string) => void
    onDeleteLayer: (id: string, type: 'headline' | 'cta' | 'custom' | 'asset') => void
    // New handlers for text assets
    onAddTextAsset?: () => void
    onUpdateTextAsset?: (id: string, value: string) => void
}

export function TextLayersEditor({
    headline,
    cta,
    customTexts,
    textAssets = [],
    onHeadlineChange,
    onCtaChange,
    onCustomTextChange,
    onDeleteLayer,
    onAddTextAsset,
    onUpdateTextAsset
}: TextLayersEditorProps) {

    return (
        <div className="w-full h-full flex flex-col justify-between py-12 px-8 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto thin-scrollbar">

            {/* TOP: HEADLINE & CUSTOM TEXTS (Required by Intent) */}
            <div className="flex-none flex flex-col items-center justify-start pt-4 space-y-6">
                {/* Headline */}
                <div className="group relative w-full max-w-2xl pointer-events-auto">
                    <textarea
                        value={headline || ''}
                        onChange={(e) => onHeadlineChange(e.target.value)}
                        className="w-full bg-transparent border-none text-center text-4xl md:text-5xl font-black text-foreground placeholder:text-muted-foreground/20 focus:ring-0 resize-none overflow-hidden min-h-[1.5em] leading-tight drop-shadow-sm"
                        placeholder="ESCRIBE TU TITULAR"
                        rows={2}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                        ref={(el) => {
                            if (el) {
                                el.style.height = 'auto';
                                el.style.height = el.scrollHeight + 'px';
                            }
                        }}
                    />
                    {headline && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteLayer('headline', 'headline')}
                            className="absolute -right-8 top-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Intent-based Custom Texts */}
                <div className="w-full flex flex-col items-center gap-4">
                    {Object.entries(customTexts).map(([key, value]) => (
                        <div key={key} className="group relative w-full max-w-3xl pointer-events-auto">
                            <textarea
                                value={value || ''}
                                onChange={(e) => onCustomTextChange(key, e.target.value)}
                                className="w-full bg-transparent border-none text-center text-xl md:text-3xl font-medium text-foreground/90 placeholder:text-muted-foreground/15 focus:ring-0 resize-none overflow-hidden min-h-[1.2em] leading-tight transition-all drop-shadow-sm py-1"
                                placeholder={`PROMPT PARA ${key.replace(/_/g, ' ').toUpperCase()}...`}
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = target.scrollHeight + 'px';
                                }}
                                ref={(el) => {
                                    if (el) {
                                        el.style.height = 'auto';
                                        el.style.height = el.scrollHeight + 'px';
                                    }
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteLayer(key, 'custom')}
                                className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Brand-based Text Assets (PROMPT TEXTS moved from Panel) */}
                {textAssets.length > 0 && (
                    <div className="w-full flex flex-col items-center gap-2 pt-4 border-t border-dashed border-foreground/10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Textos Adicionales</p>
                        {textAssets.map((asset) => (
                            <div key={asset.id} className="group relative w-full max-w-xl pointer-events-auto flex items-center justify-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full ring-1 ring-foreground/10 hover:ring-foreground/20 transition-all">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mr-1 opacity-70">{asset.label}</span>
                                    <input
                                        value={asset.value || ''}
                                        onChange={(e) => onUpdateTextAsset?.(asset.id, e.target.value)}
                                        className="bg-transparent border-none text-sm font-medium text-foreground focus:ring-0 p-0 text-center min-w-[50px]"
                                        placeholder={`Valor para ${asset.label}...`}
                                        style={{ width: `${Math.max(80, (asset.value?.length || 0) * 8)}px` }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDeleteLayer(asset.id, 'asset')}
                                        className="h-4 w-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Text Button (Shared for both custom and assets) */}
                <div className="pt-2 pointer-events-auto flex gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const newId = `custom_text_${Object.keys(customTexts).length + 1}`
                            onCustomTextChange(newId, '')
                        }}
                        className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors h-8 gap-2 bg-foreground/5 hover:bg-foreground/10 rounded-full px-4"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Capas de Diseño
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onAddTextAsset}
                        className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors h-8 gap-2 bg-foreground/5 hover:bg-foreground/10 rounded-full px-4"
                    >
                        <Fingerprint className="w-3.5 h-3.5 text-primary" />
                        Textos Prompt
                    </Button>
                </div>
            </div>

            {/* BOTTOM: CTA (Dynamic Width) */}
            <div className="flex-none flex items-center justify-center pb-8 pointer-events-auto">
                <div className="group relative">
                    <div className="relative inline-flex items-center justify-center">
                        {/* Hidden span to measure width - matches input styling exactly */}
                        <div className="invisible whitespace-pre px-14 py-3 font-bold text-lg md:text-xl border border-transparent select-none">
                            {cta || "BOTÓN DE ACCIÓN"}
                        </div>

                        <MousePointerClick className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-primary-foreground/70 pointer-events-none z-10" />

                        <input
                            value={cta || ''}
                            onChange={(e) => onCtaChange(e.target.value)}
                            className={cn(
                                "absolute inset-0 w-full h-full rounded-full text-center font-bold shadow-lg transition-all",
                                "bg-primary text-primary-foreground border-none placeholder:text-primary-foreground/40",
                                "hover:scale-105 hover:bg-primary/90 focus-visible:ring-offset-2 focus:ring-2 focus:ring-primary/50 outline-none",
                                "text-lg md:text-xl leading-none px-12"
                            )}
                            placeholder="BOTÓN DE ACCIÓN"
                        />
                    </div>
                    {cta && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteLayer('cta', 'cta')}
                            className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
