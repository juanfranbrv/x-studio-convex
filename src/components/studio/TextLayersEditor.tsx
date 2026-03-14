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
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation('common')
    const visibleTextAssets = textAssets.filter(asset => asset.type !== 'cta' && asset.type !== 'url')
    const headlineRef = useRef<HTMLTextAreaElement | null>(null)
    const touchVisibleActionClass = 'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100'

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
        <div
            className="text-layer-editor w-full h-full grid animate-in fade-in zoom-in-95 duration-500 overflow-hidden"
            style={{
                paddingTop: 'var(--tl-pad-top)',
                paddingBottom: 'var(--tl-pad-bottom)',
                paddingLeft: 'var(--tl-pad-x)',
                paddingRight: 'var(--tl-pad-x)',
                gridTemplateRows: 'auto 1fr auto',
                rowGap: 'var(--tl-section-gap)',
            }}
        >

            {/* TITLE */}
            <div className="tl-title group relative w-full max-w-2xl px-[8cqw] pointer-events-auto" style={{ marginTop: 'var(--tl-title-top)' }}>
                    <textarea
                        value={headline || ''}
                        onChange={(e) => onHeadlineChange(e.target.value)}
                        className="w-full bg-transparent border-none text-center font-black text-foreground placeholder:text-muted-foreground/20 focus:ring-0 resize-none overflow-visible min-h-[1.2em] leading-tight drop-shadow-sm pb-1"
                        style={{ fontSize: 'var(--tl-head)', lineHeight: 'var(--tl-line-head)' }}
                        placeholder={t('textLayerEditor.headlinePlaceholder', { defaultValue: 'WRITE YOUR HEADLINE' })}
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
                            className={cn(
                                'absolute right-4 top-0 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg transition-opacity z-10 hover:bg-destructive hover:text-destructive-foreground',
                                touchVisibleActionClass
                            )}
                            style={{ width: 'clamp(16px, 2.8cqw, 22px)', height: 'clamp(16px, 2.8cqw, 22px)' }}
                        >
                            <X style={{ width: 'clamp(9px, 1.8cqw, 13px)', height: 'clamp(9px, 1.8cqw, 13px)' }} />
                        </Button>
                    )}
                </div>

            {/* MIDDLE: TEXT BLOCKS */}
            <div
                className="tl-middle w-full flex flex-col items-center justify-start"
                style={{ rowGap: 'var(--tl-gap)', minHeight: 0 }}
            >
                <div className="w-full flex flex-col items-center" style={{ rowGap: 'var(--tl-gap-tight)', marginTop: 'var(--tl-middle-top)' }}>
                    {Object.entries(customTexts).map(([key, value]) => (
                        <div key={key} className="group relative mx-auto w-[min(64%,38ch)] pointer-events-auto">
                            <textarea
                                value={value || ''}
                                onChange={(e) => onCustomTextChange(key, e.target.value)}
                                className="w-full bg-transparent border-none text-center font-medium text-foreground/90 placeholder:text-muted-foreground/15 focus:ring-0 resize-none overflow-hidden min-h-[1.1em] leading-tight transition-all drop-shadow-sm py-0"
                                style={{ fontSize: 'var(--tl-body)', lineHeight: 'var(--tl-line-body)' }}
                                placeholder={t('textLayerEditor.customPlaceholder', {
                                    defaultValue: 'PROMPT FOR {{label}}...',
                                    label: key.replace(/_/g, ' ').toUpperCase()
                                })}
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
                                className={cn(
                                    'absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg transition-opacity z-10 hover:bg-destructive hover:text-destructive-foreground',
                                    touchVisibleActionClass
                                )}
                                style={{ width: 'clamp(14px, 2.6cqw, 20px)', height: 'clamp(14px, 2.6cqw, 20px)' }}
                            >
                                <X style={{ width: 'clamp(8px, 1.6cqw, 12px)', height: 'clamp(8px, 1.6cqw, 12px)' }} />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Brand-based Text Assets (PROMPT TEXTS moved from Panel) */}
                {visibleTextAssets.length > 0 && (
                    <div className="w-full flex flex-col items-center pt-1" style={{ rowGap: 'var(--tl-gap-tight)' }}>
                        {visibleTextAssets.map((asset) => (
                            <div key={asset.id} className="group relative mx-auto w-[min(64%,38ch)] pointer-events-auto">
                                <textarea
                                    value={asset.value || ''}
                                    onChange={(e) => onUpdateTextAsset?.(asset.id, e.target.value)}
                                    className="w-full bg-transparent border-none text-center font-medium text-foreground/90 placeholder:text-muted-foreground/15 focus:ring-0 resize-none overflow-hidden min-h-[1.1em] leading-tight transition-all drop-shadow-sm py-0"
                                    style={{ fontSize: 'var(--tl-body)', lineHeight: 'var(--tl-line-body)' }}
                                    placeholder={t('textLayerEditor.assetPlaceholder', {
                                        defaultValue: 'Value for {{label}}...',
                                        label: asset.label
                                    })}
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
                                    className={cn(
                                        'absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-destructive/70 text-destructive-foreground shadow-lg transition-opacity z-10 hover:bg-destructive hover:text-destructive-foreground',
                                        touchVisibleActionClass
                                    )}
                                    style={{ width: 'clamp(14px, 2.6cqw, 20px)', height: 'clamp(14px, 2.6cqw, 20px)' }}
                                >
                                    <X style={{ width: 'clamp(8px, 1.6cqw, 12px)', height: 'clamp(8px, 1.6cqw, 12px)' }} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                    {/* Add New Text Button (Brand Kit Assets Only) */}
                    <div className="pointer-events-auto flex justify-center" style={{ marginTop: 'var(--tl-brand-top)' }}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors gap-2 bg-foreground/5 hover:bg-foreground/10 rounded-full"
                                style={{
                                    height: 'var(--tl-brand-h)',
                                    paddingLeft: 'var(--tl-brand-px)',
                                    paddingRight: 'var(--tl-brand-px)',
                                    fontSize: 'var(--tl-brand-fs)',
                                    width: 'fit-content',
                                    maxWidth: '92%',
                                }}
                            >
                                <Fingerprint style={{ width: 'var(--tl-brand-icon)', height: 'var(--tl-brand-icon)' }} className="text-primary" />
                                {t('preview.brandTexts', { defaultValue: 'Brand Kit texts' })}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-72 max-h-80 overflow-y-auto">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                {t('preview.selectBrandText', { defaultValue: 'Select a Brand Kit text' })}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Empty option to add custom text */}
                            <DropdownMenuItem
                                onClick={() => onAddTextAsset?.({
                                    id: `text-${Date.now()}`,
                                    type: 'custom',
                                    label: t('textLayerEditor.freeTextLabel', { defaultValue: 'Text' }),
                                    value: ''
                                })}
                                className="text-xs gap-2"
                            >
                                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">{t('textLayerEditor.addFreeText', { defaultValue: 'Add free text...' })}</span>
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
                                    {t('preview.noBrandTexts', { defaultValue: 'No texts available' })}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* BOTTOM: CTA + URL (URL takes priority like final render) */}
            <div
                className="tl-cta flex-none flex flex-col items-center justify-center pb-4 pointer-events-auto"
                style={{ marginTop: 'auto', marginBottom: 'var(--tl-cta-bottom)' }}
            >
                <div className="group relative flex flex-col items-center" style={{ rowGap: 'var(--tl-gap)' }}>
                    {/* CTA Text (small, above URL) */}
                    <div
                        className="group relative flex items-center gap-2 rounded-full bg-muted/60 text-muted-foreground border border-border shadow-sm"
                        style={{
                            paddingLeft: 'var(--tl-cta-px)',
                            paddingRight: 'var(--tl-cta-px)',
                            paddingTop: 'var(--tl-cta-py)',
                            paddingBottom: 'var(--tl-cta-py)',
                            width: 'fit-content',
                            maxWidth: '92%',
                        }}
                    >
                        <MousePointerClick style={{ width: 'var(--tl-cta-icon)', height: 'var(--tl-cta-icon)' }} className="text-muted-foreground flex-shrink-0" />
                        <input
                            value={cta || ''}
                            onChange={(e) => onCtaChange(e.target.value)}
                            className="bg-transparent text-muted-foreground font-semibold border-none placeholder:text-muted-foreground/60 focus:ring-0 focus:outline-none text-center"
                            style={{ fontSize: 'var(--tl-cta)', width: `${Math.max(8, (cta?.length || 10))}ch` }}
                        />
                        {(cta || ctaUrl) && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteLayer('cta', 'cta')}
                                className={cn(
                                    'ml-1 rounded-full bg-destructive/70 text-destructive-foreground shadow-md transition-opacity hover:bg-destructive hover:text-destructive-foreground',
                                    touchVisibleActionClass
                                )}
                                style={{ width: 'clamp(16px, 2.8cqw, 22px)', height: 'clamp(16px, 2.8cqw, 22px)' }}
                            >
                                <X style={{ width: 'clamp(9px, 1.8cqw, 13px)', height: 'clamp(9px, 1.8cqw, 13px)' }} />
                            </Button>
                        )}
                    </div>

                    {/* URL Chip (dominant, framed) */}
                    {ctaUrlEnabled && (
                        <div
                            className="group relative flex items-center justify-center gap-2 rounded-2xl bg-muted/70 border border-primary/30 shadow-md"
                            style={{
                                paddingLeft: 'var(--tl-url-px)',
                                paddingRight: 'var(--tl-url-px)',
                                paddingTop: 'var(--tl-url-py)',
                                paddingBottom: 'var(--tl-url-py)',
                                width: 'fit-content',
                                maxWidth: '92%',
                            }}
                        >
                            <Link2 style={{ width: 'var(--tl-url-icon)', height: 'var(--tl-url-icon)' }} className={`${ctaUrl ? 'text-primary' : 'text-muted-foreground'}`} />
                            <input
                                type="text"
                                value={ctaUrl || ''}
                                onChange={(e) => onCtaUrlChange?.(e.target.value)}
                                className="bg-transparent text-[14px] text-primary font-semibold border-none focus:ring-0 focus:outline-none text-center font-mono placeholder:text-muted-foreground/60"
                                placeholder={t('textLayerEditor.urlPlaceholder', { defaultValue: 'yourbrand.com/...' })}
                                style={{ width: `${Math.max(10, (ctaUrl?.length || 12))}ch`, fontSize: 'var(--tl-url)' }}
                            />
                            {ctaUrl && (
                                <button
                                    aria-label={t('textLayerEditor.clearUrl', { defaultValue: 'Clear URL' })}
                                    onClick={() => onCtaUrlChange?.('')}
                                    className={cn(
                                        'rounded-full bg-destructive/70 text-destructive-foreground shadow-md flex items-center justify-center transition-opacity hover:bg-destructive hover:text-destructive-foreground',
                                        touchVisibleActionClass
                                    )}
                                    style={{ width: 'clamp(16px, 2.8cqw, 22px)', height: 'clamp(16px, 2.8cqw, 22px)' }}
                                >
                                    <X style={{ width: 'clamp(9px, 1.8cqw, 13px)', height: 'clamp(9px, 1.8cqw, 13px)' }} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
