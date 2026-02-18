import React, { useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, MousePointerClick, Fingerprint, Link2, Plus } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { TextAsset } from '@/lib/creation-flow-types'

export interface BrandKitTextOption {
    id: string
    label: string
    value: string
    type: 'url' | 'tagline' | 'cta' | 'hook' | 'custom'
}

interface TextLayersEditorProps {
    headline: string
    cta: string
    ctaUrl?: string
    ctaUrlEnabled?: boolean
    customTexts: Record<string, string>
    textAssets?: TextAsset[]
    brandKitTexts?: BrandKitTextOption[]
    onHeadlineChange: (value: string) => void
    onCtaChange: (value: string) => void
    onCtaUrlChange?: (value: string) => void
    onCustomTextChange: (id: string, value: string) => void
    onDeleteLayer: (id: string, type: 'headline' | 'cta' | 'custom' | 'asset') => void
    onAddTextAsset?: (asset: TextAsset) => void
    onUpdateTextAsset?: (id: string, value: string) => void
}

export function TextLayersEditor({
    headline,
    cta,
    ctaUrl = '',
    ctaUrlEnabled = true,
    customTexts,
    textAssets = [],
    brandKitTexts = [],
    onHeadlineChange,
    onCtaChange,
    onCtaUrlChange,
    onCustomTextChange,
    onDeleteLayer,
    onAddTextAsset,
    onUpdateTextAsset
}: TextLayersEditorProps) {
    const visibleTextAssets = textAssets.filter(asset => asset.type !== 'cta' && asset.type !== 'url')
    const headlineRef = useRef<HTMLTextAreaElement | null>(null)

    const resizeHeadline = useCallback(() => {
        const el = headlineRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight + 2}px`
    }, [])

    useLayoutEffect(() => {
        resizeHeadline()
    }, [headline, resizeHeadline])

    useEffect(() => {
        const el = headlineRef.current
        if (!el || typeof ResizeObserver === 'undefined') return
        const observer = new ResizeObserver(() => resizeHeadline())
        observer.observe(el)
        return () => observer.disconnect()
    }, [resizeHeadline])

    return (
        <div className="w-full h-full flex flex-col justify-between py-[4cqh] py-[2cqw] px-[6cqw] animate-in fade-in zoom-in-95 duration-500 overflow-y-auto overflow-x-hidden thin-scrollbar">

            {/* TOP: HEADLINE & CUSTOM TEXTS (Required by Intent) */}
            <div className="flex-none flex flex-col items-center justify-start pt-2 space-y-[1.5cqw]">
                {/* Headline */}
                <div className="group relative w-full max-w-2xl px-[8cqw] pointer-events-auto">
                    <textarea
                        value={headline || ''}
                        onChange={(e) => onHeadlineChange(e.target.value)}
                        className="w-full bg-transparent border-none text-center font-black text-foreground placeholder:text-muted-foreground/20 focus:ring-0 resize-none overflow-hidden min-h-[1.2em] leading-tight drop-shadow-sm"
                        style={{ fontSize: 'min(5cqw, 5cqh, 32px)' }}
                        placeholder="ESCRIBE TU TITULAR"
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = (target.scrollHeight + 2) + 'px';
                        }}
                        ref={headlineRef}
                    />
                    {headline && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteLayer('headline', 'headline')}
                            className="absolute right-4 top-0 h-5 w-5 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    )}
                </div>

                {/* Intent-based Custom Texts */}
                <div className="w-full flex flex-col items-center gap-4">
                    {Object.entries(customTexts).map(([key, value]) => (
                        <div key={key} className="group relative mx-auto w-[min(64%,38ch)] pointer-events-auto">
                            <textarea
                                value={value || ''}
                                onChange={(e) => onCustomTextChange(key, e.target.value)}
                                className="w-full bg-transparent border-none text-center font-medium text-foreground/90 placeholder:text-muted-foreground/15 focus:ring-0 resize-none overflow-hidden min-h-[1.1em] leading-tight transition-all drop-shadow-sm py-0.5"
                                style={{ fontSize: 'min(3cqw, 3cqh, 18px)' }}
                                placeholder={`PROMPT PARA ${key.replace(/_/g, ' ').toUpperCase()}...`}
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = (target.scrollHeight + 2) + 'px';
                                }}
                                ref={(el) => {
                                    if (el) {
                                        el.style.height = 'auto';
                                        el.style.height = (el.scrollHeight + 2) + 'px';
                                    }
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteLayer(key, 'custom')}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <X className="w-2.5 h-2.5" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Brand-based Text Assets (PROMPT TEXTS moved from Panel) */}
                {visibleTextAssets.length > 0 && (
                    <div className="w-full flex flex-col items-center gap-1 pt-1">
                        {visibleTextAssets.map((asset) => (
                            <div key={asset.id} className="group relative mx-auto w-[min(64%,38ch)] pointer-events-auto">
                                <textarea
                                    value={asset.value || ''}
                                    onChange={(e) => onUpdateTextAsset?.(asset.id, e.target.value)}
                                    className="w-full bg-transparent border-none text-center font-medium text-foreground/90 placeholder:text-muted-foreground/15 focus:ring-0 resize-none overflow-hidden min-h-[1.1em] leading-tight transition-all drop-shadow-sm py-0.5"
                                    style={{ fontSize: 'min(3cqw, 3cqh, 18px)' }}
                                    placeholder={`Valor para ${asset.label}...`}
                                    rows={1}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = (target.scrollHeight + 2) + 'px';
                                    }}
                                    ref={(el) => {
                                        if (el) {
                                            el.style.height = 'auto';
                                            el.style.height = (el.scrollHeight + 2) + 'px';
                                        }
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeleteLayer(asset.id, 'asset')}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Text Button (Brand Kit Assets Only) */}
                <div className="pt-2 pointer-events-auto flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors h-8 gap-2 bg-foreground/5 hover:bg-foreground/10 rounded-full px-4"
                            >
                                <Fingerprint className="w-3.5 h-3.5 text-primary" />
                                Textos de Marca
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-72 max-h-80 overflow-y-auto">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                Selecciona un texto del Kit de Marca
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Empty option to add custom text */}
                            <DropdownMenuItem
                                onClick={() => onAddTextAsset?.({
                                    id: `text-${Date.now()}`,
                                    type: 'custom',
                                    label: 'Texto',
                                    value: ''
                                })}
                                className="text-xs gap-2"
                            >
                                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">Añadir texto libre...</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Brand Kit Texts */}
                            {brandKitTexts && brandKitTexts.length > 0 ? (
                                brandKitTexts.map((option) => (
                                    <DropdownMenuItem
                                        key={option.id}
                                        onClick={() => onAddTextAsset?.({
                                            id: `text-${Date.now()}-${option.id}`,
                                            type: option.type,
                                            label: option.label,
                                            value: option.value
                                        })}
                                        className="text-xs flex flex-col items-start gap-0.5 py-2"
                                    >
                                        <span className="text-[9px] uppercase text-primary font-bold">{option.label}</span>
                                        <span className="text-foreground truncate max-w-full">{option.value}</span>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem disabled className="text-xs text-muted-foreground italic">
                                    Sin textos guardados en el Kit
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* BOTTOM: CTA + URL (URL takes priority like final render) */}
            <div className="flex-none flex flex-col items-center justify-center pb-8 pointer-events-auto">
                <div className="group relative flex flex-col items-center gap-3">
                    {/* CTA Text (small, above URL) */}
                    <div className="group relative flex items-center gap-3 px-5 py-2 rounded-full bg-muted/60 text-muted-foreground border border-border shadow-sm">
                        <MousePointerClick className="w-4.5 h-4.5 text-muted-foreground flex-shrink-0" />
                        <input
                            value={cta || ''}
                            onChange={(e) => onCtaChange(e.target.value)}
                            className="bg-transparent text-muted-foreground font-semibold border-none placeholder:text-muted-foreground/60 focus:ring-0 focus:outline-none min-w-[80px] text-center"
                            style={{ fontSize: 'min(3.2cqw, 3.2cqh, 16px)', width: `${Math.max(130, (cta?.length || 10) * 10)}px` }}
                        />
                        {(cta || ctaUrl) && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteLayer('cta', 'cta')}
                                className="ml-1 h-5 w-5 rounded-full bg-destructive/70 text-destructive-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        )}
                    </div>

                    {/* URL Chip (dominant, framed) */}
                    {ctaUrlEnabled && (
                        <div className="group relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-muted/70 border border-primary/30 shadow-md">
                            <Link2 className={`w-5 h-5 ${ctaUrl ? 'text-primary' : 'text-muted-foreground'}`} />
                            <input
                                type="text"
                                value={ctaUrl || ''}
                                onChange={(e) => onCtaUrlChange?.(e.target.value)}
                                className="bg-transparent text-[14px] text-primary font-semibold border-none focus:ring-0 focus:outline-none min-w-[220px] text-center font-mono placeholder:text-muted-foreground/60"
                                placeholder="bauset.es/..."
                                style={{ width: `${Math.max(220, (ctaUrl?.length || 18) * 9)}px` }}
                            />
                            {ctaUrl && (
                                <button
                                    aria-label="Clear URL"
                                    onClick={() => onCtaUrlChange?.('')}
                                    className="h-5 w-5 rounded-full bg-destructive/70 text-destructive-foreground shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
