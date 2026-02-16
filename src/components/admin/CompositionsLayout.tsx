'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { CompositionEditor } from '@/components/admin/CompositionEditor'
import { Badge } from '@/components/ui/badge'
import { FileText, Wand2, Loader2 } from 'lucide-react'
import type { LegacyComposition } from '@/lib/legacy-compositions'
import { Button } from '@/components/ui/button'
import { batchAssignIconsAction } from '@/lib/admin-compositions-actions'
import { useToast } from '@/hooks/use-toast'

interface CompositionsLayoutProps {
    compositions: LegacyComposition[]
    selectedComposition: LegacyComposition | null
    selectedId: string
    isNew: boolean
    basicIds: Set<string>
    filters: {
        q: string
        intent: string
        mode: string
    }
}

export function CompositionsLayout({
    compositions,
    selectedComposition,
    selectedId,
    isNew,
    basicIds,
    filters
}: CompositionsLayoutProps) {
    const [isBatchPending, startBatchTransition] = useTransition()
    const { toast } = useToast()

    const handleBatchAssign = () => {
        if (!confirm('¿Estás seguro de que quieres asignar iconos por IA a todas las composiciones que no tengan uno?')) return

        startBatchTransition(async () => {
            const results = await batchAssignIconsAction()
            toast({
                title: 'Asignación completada',
                description: `Se procesaron ${results.count} composiciones y se actualizaron ${results.updated}.`,
            })
        })
    }

    const buildEditUrl = (id: string) => {
        const params = new URLSearchParams()
        params.set('id', id)
        if (filters.q) params.set('q', filters.q)
        if (filters.intent && filters.intent !== 'all') params.set('intent', filters.intent)
        if (filters.mode && filters.mode !== 'all') params.set('mode', filters.mode)
        return `/admin/compositions?${params.toString()}`
    }

    return (
        <PanelGroup orientation="horizontal" className="flex-1">
            <Panel defaultSize={60} minSize={30}>
                <section className="h-full overflow-y-auto p-6 space-y-4 bg-muted/5 thin-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Listado</h2>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                            onClick={handleBatchAssign}
                            disabled={isBatchPending}
                        >
                            {isBatchPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                            Asignar Iconos IA
                        </Button>
                    </div>

                    {compositions.map((item) => {
                        const isSelected = selectedId === item.id
                        const editUrl = buildEditUrl(item.id)

                        return (
                            <Link
                                key={item.id}
                                href={editUrl}
                                className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                                    ? 'border-primary ring-1 ring-primary bg-primary/5 shadow-md shadow-primary/5'
                                    : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
                                    }`}
                            >
                                <div
                                    className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-primary/70 shrink-0 overflow-hidden border border-border/50"
                                >
                                    {item.svgIcon?.startsWith('<svg') ? (
                                        <div
                                            className="w-full h-full [&>svg]:!w-full [&>svg]:!h-full [&>svg]:!block p-2"
                                            dangerouslySetInnerHTML={{ __html: item.svgIcon }}
                                        />
                                    ) : (
                                        <span
                                            className="material-symbols-outlined leading-none"
                                            style={{ fontSize: '40px' }}
                                        >
                                            {item.svgIcon || 'grid_view'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold truncate">{item.name}</h3>
                                        <div className="flex gap-1">
                                            {basicIds.has(item.id) && (
                                                <Badge variant="secondary" className="text-[10px] px-1 h-4 bg-emerald-500/10 text-emerald-600 border-none">
                                                    Básico
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mb-2">{item.id}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2 italic">
                                        {item.structuralPrompt || item.promptInstruction || item.description}
                                    </p>
                                </div>

                                {item.source === 'custom' && (
                                    <div className="absolute top-4 right-4 text-right">
                                        <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                                            Custom
                                        </Badge>
                                    </div>
                                )}
                            </Link>
                        )
                    })}

                    {compositions.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20 space-y-4">
                            <FileText className="h-12 w-12 opacity-20" />
                            <p>No se encontraron composiciones que coincidan con tu búsqueda.</p>
                        </div>
                    )}
                </section>
            </Panel>

            <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/30 transition-colors cursor-col-resize flex items-center justify-center group">
                <div className="w-1 h-8 rounded-full bg-border group-hover:bg-primary/50 transition-colors" />
            </PanelResizeHandle>

            <Panel defaultSize={40} minSize={25}>
                <CompositionEditor
                    composition={selectedComposition}
                    isNew={isNew}
                    isBasic={selectedComposition ? basicIds.has(selectedComposition.id) : false}
                />
            </Panel>
        </PanelGroup>
    )
}
