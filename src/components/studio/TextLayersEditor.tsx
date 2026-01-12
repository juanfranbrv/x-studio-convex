import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TextLayersEditorProps {
    headline: string
    cta: string
    customTexts: Record<string, string>
    onHeadlineChange: (value: string) => void
    onCtaChange: (value: string) => void
    onCustomTextChange: (id: string, value: string) => void
    onDeleteLayer: (id: string, type: 'headline' | 'cta' | 'custom') => void
}

export function TextLayersEditor({
    headline,
    cta,
    customTexts,
    onHeadlineChange,
    onCtaChange,
    onCustomTextChange,
    onDeleteLayer
}: TextLayersEditorProps) {
    // If we have an intent but empty strings, we still generally want to allow editing,
    // but the previous logic relied on truthiness. 
    // Since the parent now passes `selectedIntent` to show this component, 
    // we should render the inputs even if they are empty strings, as long as they are distinct from "undefined/null" if possible.
    // However, usually they are just empty strings. We'll render them if they are not explicitly "null" (though TS says string).
    // A safe bet is to always render Headline/CTA slots if the component is mounted, as it implies an intent is active.

    return (
        <div className="w-full h-full flex flex-col justify-between py-12 px-8 animate-in fade-in zoom-in-95 duration-500">

            {/* TOP: HEADLINE */}
            <div className="flex-1 flex flex-col items-center justify-start pt-4">
                <div className="group relative w-full max-w-2xl pointer-events-auto">
                    <textarea
                        value={headline}
                        onChange={(e) => onHeadlineChange(e.target.value)}
                        className="w-full bg-transparent border-none text-center text-4xl md:text-5xl font-black text-foreground placeholder:text-muted-foreground/20 focus:ring-0 resize-none overflow-hidden min-h-[1.5em] leading-tight drop-shadow-sm"
                        placeholder="ESCRIBE TU TITULAR"
                        rows={2}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto'; // Reset height to recalculate
                            target.style.height = target.scrollHeight + 'px';
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

                {/* Custom Texts directly below headline for "subheadline" feel */}
                <div className="w-full flex flex-col items-center gap-2 mt-4">
                    {Object.entries(customTexts).map(([key, value]) => (
                        <div key={key} className="group relative pointer-events-auto">
                            <Input
                                value={value}
                                onChange={(e) => onCustomTextChange(key, e.target.value)}
                                className="h-8 w-[300px] text-center bg-background/40 backdrop-blur-sm border-transparent hover:border-border/30 focus:bg-background/60 transition-all shadow-sm placeholder:text-muted-foreground/30"
                                placeholder={`Texto para ${key.replace(/_/g, ' ')}...`}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteLayer(key, 'custom')}
                                className="absolute -right-8 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM: CTA */}
            <div className="flex-none flex items-center justify-center pb-8 pointer-events-auto">
                <div className="group relative">
                    <div className="relative">
                        <MousePointerClick className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/70 pointer-events-none z-10" />
                        <Input
                            value={cta}
                            onChange={(e) => onCtaChange(e.target.value)}
                            className={cn(
                                "h-12 pl-10 pr-6 min-w-[200px] rounded-full text-center font-bold shadow-lg transition-all",
                                "bg-primary text-primary-foreground border-none placeholder:text-primary-foreground/40",
                                "hover:scale-105 hover:bg-primary/90 focus-visible:ring-offset-2"
                            )}
                            placeholder="BOTÓN DE ACCIÓN"
                        />
                    </div>
                    {cta && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteLayer('cta', 'cta')}
                            className="absolute -right-8 top-3 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
