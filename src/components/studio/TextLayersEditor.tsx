import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, MousePointerClick, Plus, Fingerprint, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TextAsset } from '@/lib/creation-flow-types'

interface TextLayersEditorProps {
    headline: string
    cta: string
    ctaUrl?: string
    customTexts: Record<string, string>
    textAssets?: TextAsset[]
    onHeadlineChange: (value: string) => void
    onCtaChange: (value: string) => void
    onCtaUrlChange?: (value: string) => void
    onCustomTextChange: (id: string, value: string) => void
    onDeleteLayer: (id: string, type: 'headline' | 'cta' | 'custom' | 'asset') => void
    // New handlers for text assets
    onAddTextAsset?: () => void
    onUpdateTextAsset?: (id: string, value: string) => void
}

export function TextLayersEditor({
    headline,
    cta,
    ctaUrl = '',
    customTexts,
    textAssets = [],
    onHeadlineChange,
    onCtaChange,
    onCtaUrlChange,
    onCustomTextChange,
    onDeleteLayer,
    onAddTextAsset,
    onUpdateTextAsset
}: TextLayersEditorProps) {

    return (
        <div className="w-full h-full flex flex-col justify-between py-12 px-8 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto overflow-x-hidden thin-scrollbar">

            {/* TOP: HEADLINE & CUSTOM TEXTS (Required by Intent) */}
            <div className="flex-none flex flex-col items-center justify-start pt-4 space-y-6">
                {/* Headline */}
                <div className="group relative w-full max-w-2xl px-12 pointer-events-auto">
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
                            className="absolute right-4 top-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive z-10"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Intent-based Custom Texts */}
                <div className="w-full flex flex-col items-center gap-4">
                    {Object.entries(customTexts).map(([key, value]) => (
                        <div key={key} className="group relative w-full max-w-3xl px-12 pointer-events-auto">
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive z-10"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Brand-based Text Assets (PROMPT TEXTS moved from Panel) */}
                {textAssets.length > 0 && (
                    <div className="w-full flex flex-col items-center gap-3 pt-4 border-t border-dashed border-foreground/10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Textos Adicionales</p>
                        {textAssets.map((asset) => (
                            <div key={asset.id} className="group relative w-full max-w-2xl pointer-events-auto flex items-start justify-center gap-2 px-4">
                                <div className="flex-1 flex items-start gap-3 px-4 py-2 bg-foreground/5 rounded-2xl ring-1 ring-foreground/10 hover:ring-foreground/20 transition-all">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground opacity-70 pt-1 flex-shrink-0">{asset.label}</span>
                                    <textarea
                                        value={asset.value || ''}
                                        onChange={(e) => onUpdateTextAsset?.(asset.id, e.target.value)}
                                        className="flex-1 bg-transparent border-none text-sm font-medium text-foreground focus:ring-0 resize-none overflow-hidden min-h-[1.4em] leading-relaxed"
                                        placeholder={`Valor para ${asset.label}...`}
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
                                        onClick={() => onDeleteLayer(asset.id, 'asset')}
                                        className="h-5 w-5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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

            {/* BOTTOM: CTA Button with integrated URL */}
            <div className="flex-none flex flex-col items-center justify-center pb-8 pointer-events-auto">
                {/* UNIFIED CTA CONTAINER */}
                <div className="group relative flex flex-col items-center bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-[2rem] p-1.5 border border-white/10 hover:border-primary/20 transition-all hover:bg-black/10 dark:hover:bg-white/15 gap-0.5">

                    {/* 1. CTA Button (Primary Visual) */}
                    <div className="relative z-10 flex items-center gap-2 bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-3 transition-transform group-hover:scale-[1.02]">
                        <MousePointerClick className="w-4.5 h-4.5 text-primary-foreground/70 flex-shrink-0" />
                        <input
                            value={cta || ''}
                            onChange={(e) => onCtaChange(e.target.value)}
                            className="bg-transparent text-primary-foreground font-bold text-lg border-none placeholder:text-primary-foreground/40 focus:ring-0 focus:outline-none min-w-[100px] text-center"
                            placeholder="Inscríbete"
                            style={{ width: `${Math.max(100, (cta?.length || 10) * 12)}px` }}
                        />
                    </div>

                    {/* 2. URL Input (Integrated Footer) */}
                    <div className="relative z-0 flex items-center justify-center gap-1.5 px-4 py-1 w-full rounded-b-2xl transition-colors group/url">
                        <Link2 className={`w-3 h-3 ${ctaUrl ? 'text-primary' : 'text-muted-foreground'}`} />
                        <input
                            type="text"
                            value={ctaUrl || ''}
                            onChange={(e) => onCtaUrlChange?.(e.target.value)}
                            className="bg-transparent text-[10px] text-muted-foreground group-hover:text-foreground font-medium border-none focus:ring-0 focus:outline-none min-w-[120px] text-center font-mono placeholder:text-muted-foreground/50"
                            placeholder="bauset.es/..."
                            style={{ width: `${Math.max(120, (ctaUrl?.length || 15) * 6)}px` }}
                        />
                        {ctaUrl && (
                            <button
                                aria-label="Clear URL"
                                onClick={() => onCtaUrlChange?.('')}
                                className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Global Delete Button (Floating Top Right) */}
                    {(cta || ctaUrl) && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteLayer('cta', 'cta')}
                            className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive bg-background/50 hover:bg-destructive/10 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
