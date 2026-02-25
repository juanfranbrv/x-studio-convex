'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Copy, Sparkles } from 'lucide-react'
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

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

const isDataUrl = (value: string) => value.startsWith('data:image/')
const looksLongBase64 = (value: string) => value.length > 180 && /^[A-Za-z0-9+/=\r\n]+$/.test(value)

function sanitizeForDisplay(value: unknown): JsonValue {
    if (value === null || value === undefined) return null

    if (typeof value === 'string') {
        if (isDataUrl(value)) {
            const mime = value.slice(5, value.indexOf(';') > -1 ? value.indexOf(';') : 20)
            return `[DATA_URL oculto (${mime}) - ${value.length} chars]`
        }
        if (looksLongBase64(value)) {
            return `[BASE64 oculto - ${value.length} chars]`
        }
        if (value.length > 280 && value.startsWith('http')) {
            return `${value.slice(0, 140)}... (${value.length} chars)`
        }
        return value
    }

    if (Array.isArray(value)) {
        return value.map((item) => sanitizeForDisplay(item))
    }

    if (typeof value === 'object') {
        const result: Record<string, JsonValue> = {}
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
            result[k] = sanitizeForDisplay(v)
        })
        return result
    }

    if (typeof value === 'number' || typeof value === 'boolean') return value
    return String(value)
}

const roleLabel = (role?: string) => {
    if (role === 'style') return 'Estilo'
    if (role === 'style_content') return 'Estilo+Contenido'
    if (role === 'content') return 'Contenido'
    if (role === 'logo' || role === 'primary_logo' || role === 'aux_logo') return 'Logo'
    if (role === 'generated') return 'Generada'
    return 'Referencia'
}

const roleBadgeClass = (role?: string) => {
    if (role === 'style') return 'bg-violet-500/20 text-violet-300 border-violet-400/30'
    if (role === 'style_content') return 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30'
    if (role === 'content') return 'bg-sky-500/20 text-sky-300 border-sky-400/30'
    if (role === 'logo' || role === 'primary_logo' || role === 'aux_logo') return 'bg-amber-500/20 text-amber-300 border-amber-400/30'
    if (role === 'generated') return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
    return 'bg-muted text-muted-foreground border-border'
}

export function PromptDebugModal({
    open,
    onClose,
    onConfirm,
    promptData,
    viewOnly = false,
}: PromptDebugModalProps) {
    const [copiedPayload, setCopiedPayload] = useState(false)
    const [copiedPrompt, setCopiedPrompt] = useState(false)
    const [activeSlideTab, setActiveSlideTab] = useState('')

    const payloadObj = (promptData?.requestPayload || {}) as Record<string, unknown>
    const payloadPrompt = typeof payloadObj.prompt === 'string' ? payloadObj.prompt : ''
    const slideDebug = Array.isArray(promptData?.slideDebug) ? promptData.slideDebug : []
    const firstSlideTab = slideDebug.length > 0 ? `slide-${slideDebug[0].slideNumber}` : ''
    const activeSlideTabValue = slideDebug.some((slide) => `slide-${slide.slideNumber}` === activeSlideTab)
        ? activeSlideTab
        : firstSlideTab

    if (!promptData) return null

    const effectiveModel = promptData.model || (typeof payloadObj.model === 'string' ? payloadObj.model : '') || 'No configurado'
    const providerLabel = !effectiveModel || effectiveModel === 'No configurado'
        ? 'No configurado'
        : effectiveModel.startsWith('wisdom/')
            ? 'Wisdom'
            : effectiveModel.startsWith('naga/')
                ? 'NagaAI'
            : effectiveModel.startsWith('google/')
                ? 'Google Oficial'
                : 'Proveedor personalizado'

    const contextItems = promptData.contextItems || []
    const contextByRole = contextItems.reduce((acc, item) => {
        const key = item.role || 'unknown'
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
    }, {} as Record<string, typeof contextItems>)

    const {
        brandDNA,
        context,
        ...rest
    } = payloadObj

    const safeBrand = brandDNA && typeof brandDNA === 'object'
        ? {
            brand_name: (brandDNA as Record<string, unknown>).brand_name,
            website: (brandDNA as Record<string, unknown>).url,
            logos_count: Array.isArray((brandDNA as Record<string, unknown>).logos)
                ? ((brandDNA as Record<string, unknown>).logos as unknown[]).length
                : 0,
            images_count: Array.isArray((brandDNA as Record<string, unknown>).images)
                ? ((brandDNA as Record<string, unknown>).images as unknown[]).length
                : 0,
        }
        : null

    const safeContext = Array.isArray(context)
        ? context.map((entry) => {
            const item = entry as Record<string, unknown>
            const rawValue = typeof item.value === 'string' ? item.value : ''
            let valuePreview = rawValue
            if (isDataUrl(rawValue)) valuePreview = '[DATA_URL oculto]'
            else if (looksLongBase64(rawValue)) valuePreview = `[BASE64 oculto - ${rawValue.length} chars]`
            return {
                id: item.id,
                type: item.type,
                label: item.label,
                value: valuePreview,
            }
        })
        : []

    const readablePayload = sanitizeForDisplay({
        ...rest,
        brandDNA: safeBrand,
        context: safeContext,
    })

    const payloadPreview = JSON.stringify(readablePayload, null, 2)

    const handleCopyPayload = async () => {
        await navigator.clipboard.writeText(payloadPreview)
        setCopiedPayload(true)
        setTimeout(() => setCopiedPayload(false), 1200)
    }

    const handleCopyPrompt = async () => {
        const selectedSlidePrompt = slideDebug.find(
            (slide) => `slide-${slide.slideNumber}` === activeSlideTabValue
        )?.prompt
        const promptToCopy = selectedSlidePrompt || payloadPrompt
        if (!promptToCopy) return
        await navigator.clipboard.writeText(promptToCopy)
        setCopiedPrompt(true)
        setTimeout(() => setCopiedPrompt(false), 1200)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[95vh] h-[95vh] flex flex-col" style={{ width: '92vw', maxWidth: '1500px' }}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Debug: payload de generacion
                    </DialogTitle>
                    <DialogDescription>
                        Fuente de verdad: lo que ves sale del payload final que se envia a <code>/api/generate</code>.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex gap-4 py-4">
                    <div className="w-[68%] min-w-0 min-h-0 flex flex-col gap-3">
                        <div className="rounded-lg border bg-muted/30 p-3 min-h-0 flex-1 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prompt enviado (payload.prompt)</p>
                                <Button variant="ghost" size="sm" onClick={handleCopyPrompt} className="h-7 px-2" disabled={!payloadPrompt}>
                                    {copiedPrompt ? (
                                        <><Check className="w-3 h-3 mr-1" />Copiado</>
                                    ) : (
                                        <><Copy className="w-3 h-3 mr-1" />Copiar prompt</>
                                    )}
                                </Button>
                            </div>
                            {slideDebug.length > 0 ? (
                                <Tabs value={activeSlideTabValue} onValueChange={setActiveSlideTab} className="min-h-0 flex-1 flex flex-col gap-2">
                                    <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap">
                                        {slideDebug.map((slide) => (
                                            <TabsTrigger key={slide.slideNumber} value={`slide-${slide.slideNumber}`} className="shrink-0">
                                                Slide {slide.slideNumber}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {slideDebug.map((slide) => (
                                        <TabsContent
                                            key={slide.slideNumber}
                                            value={`slide-${slide.slideNumber}`}
                                            className="min-h-0 flex-1 mt-0"
                                        >
                                            <pre className="h-full overflow-y-auto rounded-lg bg-black/90 p-4 text-[11px] leading-relaxed text-green-400 font-mono whitespace-pre-wrap break-words">
                                                {slide.prompt}
                                            </pre>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            ) : (
                                <pre className="flex-1 overflow-y-auto rounded-lg bg-black/90 p-4 text-[11px] leading-relaxed text-green-400 font-mono whitespace-pre-wrap break-words">
                                    {payloadPrompt || 'No hay prompt en el payload.'}
                                </pre>
                            )}
                        </div>

                        <div className="rounded-lg border bg-muted/30 shrink-0">
                            <details>
                                <summary className="cursor-pointer list-none p-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payload legible (sin base64)</p>
                                    <span className="text-[11px] text-muted-foreground">Desplegar</span>
                                </summary>
                                <div className="px-3 pb-3 flex flex-col gap-2">
                                    <div className="flex items-center justify-end">
                                        <Button variant="ghost" size="sm" onClick={handleCopyPayload} className="h-7 px-2">
                                            {copiedPayload ? (
                                                <><Check className="w-3 h-3 mr-1" />Copiado</>
                                            ) : (
                                                <><Copy className="w-3 h-3 mr-1" />Copiar JSON</>
                                            )}
                                        </Button>
                                    </div>
                                    <pre className="max-h-[30vh] overflow-y-auto rounded-lg bg-black/90 p-4 text-[11px] leading-relaxed text-green-400 font-mono whitespace-pre-wrap break-words">
                                        {payloadPreview}
                                    </pre>
                                </div>
                            </details>
                        </div>
                    </div>

                    <div className="w-[32%] min-w-0 flex flex-col gap-4 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg">
                            <div className="col-span-2 p-3 rounded border bg-background/70">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modelo objetivo</p>
                                <p className="text-sm font-semibold mt-1 break-all">{effectiveModel}</p>
                                <p className="text-xs text-muted-foreground mt-1">Proveedor: {providerLabel}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Intent</p>
                                <p className="text-sm font-medium">{promptData.intent || 'No especificado'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Composicion</p>
                                <p className="text-sm font-medium">{promptData.layoutName || promptData.layoutId || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Plataforma</p>
                                <p className="text-sm font-medium">{promptData.platform || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Formato</p>
                                <p className="text-sm font-medium">{promptData.format || promptData.aspectRatio || 'No especificado'}</p>
                            </div>
                        </div>

                        {slideDebug.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Detalle por slide</p>
                                <div className="space-y-2 max-h-[34vh] overflow-y-auto pr-1">
                                    {slideDebug.map((slide) => (
                                        <div key={slide.slideNumber} className="rounded-lg border bg-muted/30 p-2.5 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold">Slide {slide.slideNumber}</p>
                                                <span className="text-[10px] text-muted-foreground">{slide.mood}</span>
                                            </div>
                                            <pre className="max-h-28 overflow-y-auto rounded-md bg-black/90 p-2 text-[10px] leading-relaxed text-green-400 font-mono whitespace-pre-wrap break-words">
                                                {slide.prompt}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Previews de imagenes enviadas</p>
                            {Object.keys(contextByRole).length === 0 ? (
                                <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                                    No hay imagenes de contexto en este payload.
                                </div>
                            ) : (
                                Object.entries(contextByRole).map(([role, items]) => (
                                    <div key={role} className="rounded-lg border bg-muted/30 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] px-2 py-1 rounded-md border ${roleBadgeClass(role)}`}>
                                                {roleLabel(role)}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">{items.length}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {items.map((item, idx) => (
                                                <div key={`${item.id}-${idx}`} className="aspect-square rounded-md overflow-hidden border bg-background/60">
                                                    <img
                                                        src={item.url}
                                                        alt={item.label || roleLabel(role)}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    {viewOnly ? (
                        <Button variant="outline" onClick={onClose}>Cerrar</Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={onClose}>Cancelar generacion</Button>
                            <Button onClick={() => onConfirm(undefined)} className="bg-primary">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Enviar prompt
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
