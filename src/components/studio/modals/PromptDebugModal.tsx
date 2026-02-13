'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Check, Image as ImageIcon, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DebugPromptData } from '@/lib/creation-flow-types'

interface PromptDebugModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (editedPrompt?: string) => void
    promptData: DebugPromptData | null
    viewOnly?: boolean
    editablePrompt?: string
    onEditablePromptChange?: (value: string) => void
}

export function PromptDebugModal({
    open,
    onClose,
    onConfirm,
    promptData,
    viewOnly = false,
    editablePrompt,
    onEditablePromptChange
}: PromptDebugModalProps) {
    const [copied, setCopied] = useState(false)
    const [copiedAll, setCopiedAll] = useState(false)
    const [activeSlide, setActiveSlide] = useState(0)

    const hasSlideDebug = Boolean(promptData?.slideDebug && promptData.slideDebug.length > 0)
    const currentSlideData = hasSlideDebug ? promptData?.slideDebug?.[activeSlide] : null
    const displayPrompt = currentSlideData?.prompt || promptData?.finalPrompt || ''
    const editableValue = editablePrompt ?? displayPrompt
    const promptForDisplay = !viewOnly && !hasSlideDebug ? editableValue : displayPrompt
    const characterCount = promptForDisplay.length
    const estimatedTokens = Math.ceil(characterCount / 4)
    const fullPrompt = promptData?.finalPrompt || ''
    const fullCharCount = fullPrompt.length
    const fullEstimatedTokens = Math.ceil(fullCharCount / 4)

    const handleCopy = async () => {
        if (!promptData) return
        const textToCopy = !viewOnly && !hasSlideDebug
            ? editableValue
            : (promptData.slideDebug?.[activeSlide]?.prompt || promptData.finalPrompt)
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCopyAll = async () => {
        if (!promptData?.finalPrompt) return
        await navigator.clipboard.writeText(promptData.finalPrompt)
        setCopiedAll(true)
        setTimeout(() => setCopiedAll(false), 2000)
    }

    if (!promptData) return null
    const effectiveModel = promptData.model || 'No configurado'
    const providerLabel = effectiveModel.startsWith('wisdom/')
        ? 'Wisdom'
        : effectiveModel.startsWith('google/')
            ? 'Google Oficial'
            : 'Google Oficial'

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-h-[95vh] h-[95vh] flex flex-col"
                style={{ width: '90vw', maxWidth: '1400px' }}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Debug: Prompt de GeneraciÃ³n
                        {hasSlideDebug && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                (Slide {activeSlide + 1} de {promptData.slideDebug!.length})
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {viewOnly
                            ? 'Revisa el prompt exacto que se enviÃ³ al modelo de IA'
                            : 'Revisa el prompt exacto que se enviarÃ¡ al modelo de IA'}
                    </DialogDescription>
                </DialogHeader>

                {/* Slide Navigation (if carousel) */}
                {hasSlideDebug && (
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                            disabled={activeSlide === 0}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex gap-1">
                            {promptData.slideDebug!.map((_, idx) => (
                                <Button
                                    key={idx}
                                    variant={activeSlide === idx ? 'default' : 'outline'}
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => setActiveSlide(idx)}
                                >
                                    {idx + 1}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveSlide(Math.min(promptData.slideDebug!.length - 1, activeSlide + 1))}
                            disabled={activeSlide === promptData.slideDebug!.length - 1}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        {promptData.seed && (
                            <span className="ml-4 text-xs text-muted-foreground">
                                ðŸŽ² Seed: <code className="bg-muted px-1 rounded">{promptData.seed}</code>
                            </span>
                        )}
                        {promptData.model && (
                            <span className="text-xs text-muted-foreground">
                                ðŸ¤– Model: <code className="bg-muted px-1 rounded">{promptData.model}</code>
                            </span>
                        )}
                    </div>
                )}

                {/* Content Area - Two Column Layout */}
                <div className="flex-1 overflow-hidden flex gap-4 py-4">
                    {/* LEFT: Prompt Text - Wide and Tall */}
                    <div className="w-[65%] flex flex-col gap-4 min-w-0 min-h-0">
                        <div className="flex flex-col gap-2 min-h-0 flex-1">
                            <div className="flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Prompt {hasSlideDebug ? `Slide ${activeSlide + 1}` : 'Final'}
                                </p>
                                {currentSlideData?.mood && (
                                    <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded">
                                        ðŸŽ­ {currentSlideData.mood.substring(0, 40)}...
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {characterCount} chars â€¢ ~{estimatedTokens} tokens
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-7 px-2"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3 h-3 mr-1" />
                                            Copiado
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3 h-3 mr-1" />
                                            Copiar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="relative flex-1 overflow-hidden min-h-0">
                            {!viewOnly && !hasSlideDebug ? (
                                <textarea
                                    value={editableValue}
                                    onChange={(e) => onEditablePromptChange?.(e.target.value)}
                                    className="h-full w-full p-4 bg-black/90 text-green-400 rounded-lg text-xs leading-relaxed overflow-y-auto font-mono whitespace-pre-wrap break-words resize-none border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            ) : (
                                <pre className="h-full p-4 bg-black/90 text-green-400 rounded-lg text-xs leading-relaxed overflow-y-auto font-mono whitespace-pre-wrap break-words">
                                    {displayPrompt}
                                </pre>
                            )}
                        </div>
                        </div>

                        {hasSlideDebug && fullPrompt && (
                            <div className="flex flex-col gap-2 min-h-0 flex-1">
                                <div className="flex items-center justify-between shrink-0">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Prompt completo (todas las slides)
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {fullCharCount} chars Ã¢â‚¬Â¢ ~{fullEstimatedTokens} tokens
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCopyAll}
                                            className="h-7 px-2"
                                        >
                                            {copiedAll ? (
                                                <>
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Copiado
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3 mr-1" />
                                                    Copiar todo
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative flex-1 overflow-hidden min-h-0">
                                    <pre className="h-full p-4 bg-black/90 text-green-400 rounded-lg text-xs leading-relaxed overflow-y-auto font-mono whitespace-pre-wrap break-words">
                                        {fullPrompt}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Metadata + References */}
                    <div className="w-[35%] flex flex-col space-y-4 overflow-y-auto">
                        {/* Per-Slide References */}
                        {currentSlideData?.references && currentSlideData.references.length > 0 && (
                            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    ðŸ–¼ï¸ Referencias API ({currentSlideData.references.length})
                                </p>
                                <div className="space-y-2">
                                    {currentSlideData.references.map((ref, idx) => (
                                        <div key={idx} className="flex items-start gap-2 p-2 bg-background rounded border text-xs">
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded font-mono text-[10px]",
                                                ref.type === 'logo' ? 'bg-purple-500/20 text-purple-400' :
                                                    ref.type === 'image' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20'
                                            )}>
                                                {ref.type.toUpperCase()}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{ref.label || 'Sin etiqueta'}</p>
                                                <p className="text-muted-foreground truncate">{ref.url}</p>
                                            </div>
                                            <span className="text-muted-foreground">w:{ref.weight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata Section */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg shrink-0">
                            <div className="col-span-2 p-3 rounded border bg-background/70">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modelo que se enviarÃ¡</p>
                                <p className="text-sm font-semibold mt-1 break-all">{effectiveModel}</p>
                                <p className="text-xs text-muted-foreground mt-1">Proveedor: {providerLabel}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plataforma</p>
                                <p className="text-sm font-medium">{promptData.platform || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Formato</p>
                                <p className="text-sm font-medium">{promptData.format || promptData.aspectRatio || 'No especificado'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">IntenciÃ³n</p>
                                <p className="text-sm font-medium">{promptData.intent || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Composición</p>
                                <p className="text-sm font-medium">
                                    {promptData.layoutName || promptData.layoutId || 'No especificada'}
                                </p>
                                {promptData.layoutId && promptData.layoutName && (
                                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{promptData.layoutId}</p>
                                )}
                                {(promptData.layoutSkillName || promptData.layoutSkillVersion) && (
                                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                                        {`Skill: ${promptData.layoutSkillName || 'composiciones'} v${promptData.layoutSkillVersion || 'n/a'}`}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estilos</p>
                                <p className="text-sm font-medium">{promptData.selectedStyles.length > 0 ? promptData.selectedStyles.join(', ') : 'Ninguno'}</p>
                            </div>
                        </div>

                        {/* Legacy Image Thumbnails (fallback) */}
                        {!hasSlideDebug && (promptData.logoUrl || promptData.referenceImageUrl || (promptData.attachedImages && promptData.attachedImages.length > 0)) && (
                            <div className="space-y-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ImÃ¡genes Adjuntas</p>
                                <div className="flex gap-4 flex-wrap">
                                    {promptData.logoUrl && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Logo</p>
                                            <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border-2 border-border bg-muted/30">
                                                <img
                                                    src={promptData.logoUrl}
                                                    alt="Logo preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {promptData.referenceImageUrl && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Imagen de Referencia</p>
                                            <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border-2 border-border bg-muted/30">
                                                <img
                                                    src={promptData.referenceImageUrl}
                                                    alt="Reference preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {promptData.attachedImages && promptData.attachedImages.map((imgUrl, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Contexto {idx + 1}</p>
                                            <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden border-2 border-border bg-muted/30">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Context preview ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <DialogFooter className="gap-2">
                    {viewOnly ? (
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancelar GeneraciÃ³n
                            </Button>
                            <Button
                                onClick={() => onConfirm(!hasSlideDebug ? editableValue : undefined)}
                                className="bg-primary"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Enviar Prompt
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
