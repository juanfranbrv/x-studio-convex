'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Check, Image as ImageIcon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DebugPromptData } from '@/lib/creation-flow-types'

interface PromptDebugModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    promptData: DebugPromptData | null
}

export function PromptDebugModal({
    open,
    onClose,
    onConfirm,
    promptData
}: PromptDebugModalProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!promptData?.finalPrompt) return

        await navigator.clipboard.writeText(promptData.finalPrompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!promptData) return null

    const characterCount = promptData.finalPrompt.length
    const estimatedTokens = Math.ceil(characterCount / 4) // Rough estimate

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-h-[95vh] h-[95vh] flex flex-col"
                style={{ width: '90vw', maxWidth: '1400px' }}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Debug: Prompt de Generación
                    </DialogTitle>
                    <DialogDescription>
                        Revisa el prompt final antes de enviarlo al modelo de IA
                    </DialogDescription>
                </DialogHeader>

                {/* Content Area - Two Column Layout */}
                <div className="flex-1 overflow-hidden flex gap-4 py-4">
                    {/* LEFT: Prompt Text - Wide and Tall */}
                    <div className="w-[65%] flex flex-col space-y-2 min-w-0">
                        <div className="flex items-center justify-between shrink-0">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prompt Final</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {characterCount} chars • ~{estimatedTokens} tokens
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
                        <div className="relative flex-1 overflow-hidden">
                            <pre className="h-full p-4 bg-black/90 text-green-400 rounded-lg text-xs leading-relaxed overflow-y-auto font-mono whitespace-pre-wrap break-words">
                                {promptData.finalPrompt}
                            </pre>
                        </div>
                    </div>

                    {/* RIGHT: Metadata + Images */}
                    <div className="w-[35%] flex flex-col space-y-4 overflow-y-auto">
                        {/* Metadata Section */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg shrink-0">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plataforma</p>
                                <p className="text-sm font-medium">{promptData.platform || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Formato</p>
                                <p className="text-sm font-medium">{promptData.format || 'No especificado'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Intención</p>
                                <p className="text-sm font-medium">{promptData.intent || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estilos</p>
                                <p className="text-sm font-medium">{promptData.selectedStyles.length > 0 ? promptData.selectedStyles.join(', ') : 'Ninguno'}</p>
                            </div>
                        </div>

                        {/* Image Thumbnails */}
                        {(promptData.logoUrl || promptData.referenceImageUrl || (promptData.attachedImages && promptData.attachedImages.length > 0)) && (
                            <div className="space-y-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Imágenes Adjuntas</p>
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
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancelar Generación
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-primary"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Enviar Prompt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
