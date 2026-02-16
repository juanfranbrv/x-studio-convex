'use client'

import React, { useState } from 'react'
import { Search, Sparkles, Wand2 } from 'lucide-react'
import { IconSelector } from './IconSelector'
import { suggestIconAction } from '@/lib/admin-compositions-actions'

interface IconEditorSectionProps {
    initialSvg: string
}

export function IconEditorSection({ initialSvg }: IconEditorSectionProps) {
    const [svg, setSvg] = useState(initialSvg || '')
    const [isOpen, setIsOpen] = useState(false)
    const [isSuggesting, setIsSuggesting] = useState(false)

    // Sync state with prop when selection changes
    React.useEffect(() => {
        setSvg(initialSvg || '')
    }, [initialSvg])

    const handleSuggest = async () => {
        const form = document.querySelector('form')
        if (!form) return

        const name = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value
        const description = (form.querySelector('textarea[name="description"]') as HTMLTextAreaElement)?.value
        const promptInstruction = (form.querySelector('textarea[name="promptInstruction"]') as HTMLTextAreaElement)?.value

        if (!name) return

        setIsSuggesting(true)
        try {
            const suggested = await suggestIconAction('', name, description, promptInstruction)
            if (suggested) {
                setSvg(suggested)
            }
        } catch (error) {
            console.error('Error suggesting icon:', error)
        } finally {
            setIsSuggesting(false)
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1 text-sm">
                <label className="flex items-center justify-between text-muted-foreground">
                    <span>Icono (SVG o Nombre)</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleSuggest}
                            disabled={isSuggesting}
                            className="flex h-7 items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 text-[11px] text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                            title="Sugerir icono con IA"
                        >
                            <Sparkles className={`h-3.5 w-3.5 ${isSuggesting ? 'animate-pulse' : ''}`} />
                            {isSuggesting ? 'Sugiriendo...' : 'IA'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="flex h-7 items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 text-[11px] text-primary hover:bg-primary/10 transition-colors"
                        >
                            <Search className="h-3 w-3" />
                            Catálogo
                        </button>
                    </div>
                </label>
                <textarea
                    name="svgIcon"
                    value={svg}
                    onChange={(e) => setSvg(e.target.value)}
                    rows={5}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-[10px] font-mono outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                    placeholder='<svg ...'
                />
            </div>

            <div className="space-y-1 text-sm">
                <span className="text-muted-foreground">Vista previa</span>
                <div className="flex h-16 w-full items-center justify-center rounded-md border border-border bg-muted/30">
                    {svg.trim().startsWith('<svg') ? (
                        <div
                            className="h-full w-full text-primary/70 overflow-hidden flex items-center justify-center [&>svg]:!w-full [&>svg]:!h-full [&>svg]:!block p-2"
                            dangerouslySetInnerHTML={{ __html: svg }}
                        />
                    ) : (
                        <span
                            className="material-symbols-outlined text-primary/70 leading-none"
                            style={{ fontSize: '40px' }}
                        >
                            {svg || 'grid_view'}
                        </span>
                    )}
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                    {svg.startsWith('<svg') ? `${svg.length} caracteres (SVG)` : 'Material Symbol'}
                </p>
            </div>

            {isOpen && (
                <IconSelector
                    onSelect={(newSvg) => setSvg(newSvg)}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
