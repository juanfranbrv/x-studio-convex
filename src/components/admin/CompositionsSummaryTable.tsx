'use client'

import React, { useState, useMemo, useTransition } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
    Search,
    Shapes,
    ChevronUp,
    ChevronDown,
    Filter,
    Loader2,
    Eye,
    Info
} from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { type CompositionSummary, toggleModeAction } from '@/lib/admin-compositions-actions'
import { INTENT_OPTIONS } from '@/lib/creation-flow-types'

interface CompositionsSummaryTableProps {
    initialData: CompositionSummary[]
}

type SortConfig = {
    key: keyof CompositionSummary
    direction: 'asc' | 'desc'
} | null

export function CompositionsSummaryTable({ initialData }: CompositionsSummaryTableProps) {
    const [data, setData] = useState(initialData)
    const [q, setQ] = useState('')
    const [intent, setIntent] = useState('all')
    const [modeFilter, setModeFilter] = useState('all')
    const [sort, setSort] = useState<SortConfig>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSort = (key: keyof CompositionSummary) => {
        setSort(current => {
            if (current?.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' }
                return null
            }
            return { key, direction: 'asc' }
        })
    }

    const filteredAndSortedData = useMemo(() => {
        let result = [...data]

        // Filter
        if (q.trim()) {
            const term = q.toLowerCase()
            result = result.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.id.toLowerCase().includes(term)
            )
        }

        if (intent !== 'all') {
            result = result.filter(item => item.intent === intent)
        }

        if (modeFilter === 'basic') {
            result = result.filter(item => item.isBasic)
        } else if (modeFilter === 'advanced') {
            result = result.filter(item => item.isAdvanced)
        }

        // Sort
        if (sort) {
            result.sort((a, b) => {
                const aVal = a[sort.key]
                const bVal = b[sort.key]

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sort.direction === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal)
                }

                if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
                    if (aVal === bVal) return 0
                    return sort.direction === 'asc' ? (aVal ? -1 : 1) : (aVal ? 1 : -1)
                }

                return 0
            })
        }

        return result
    }, [data, q, intent, modeFilter, sort])

    const handleToggleBasic = async (id: string, enabled: boolean) => {
        setUpdatingId(id)
        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append('layoutId', id)
                formData.append('mode', 'basic')
                formData.append('enabled', enabled ? '1' : '0')

                await toggleModeAction(formData)

                // Update local state for immediate feedback
                setData(current => current.map(item =>
                    item.id === id ? { ...item, isBasic: enabled } : item
                ))
            } catch (error) {
                console.error('Error toggling mode:', error)
            } finally {
                setUpdatingId(null)
            }
        })
    }

    const SortIcon = ({ column }: { column: keyof CompositionSummary }) => {
        if (sort?.key !== column) return null
        return sort.direction === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 p-4 border-b bg-muted/5 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Buscar por nombre o ID..."
                        className="pl-9 h-9"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <select
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                            className="h-9 min-w-[140px] appearance-none rounded-md border border-input bg-background pl-8 pr-8 text-xs focus:ring-1 focus:ring-primary shadow-sm"
                        >
                            <option value="all">Intents: Todos</option>
                            {INTENT_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={modeFilter}
                        onChange={(e) => setModeFilter(e.target.value)}
                        className="h-9 min-w-[120px] appearance-none rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-primary shadow-sm"
                    >
                        <option value="all">Modo: Todos</option>
                        <option value="basic">Sólo Básico</option>
                        <option value="advanced">Sólo Avanzado</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[32px]"></TableHead>
                            <TableHead
                                className="cursor-pointer hover:text-foreground transition-colors w-[160px]"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">
                                    Nombre <SortIcon column="name" />
                                </div>
                            </TableHead>
                            <TableHead className="w-[40px] text-center">Prompt</TableHead>
                            <TableHead
                                className="cursor-pointer hover:text-foreground transition-colors"
                                onClick={() => handleSort('intent')}
                            >
                                <div className="flex items-center">
                                    Intent <SortIcon column="intent" />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:text-foreground transition-colors text-center"
                                onClick={() => handleSort('isBasic')}
                            >
                                <div className="flex items-center justify-center">
                                    Básico <SortIcon column="isBasic" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedData.map((comp) => (
                            <TableRow key={comp.id} className="group hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <div
                                        className="h-16 w-16 rounded-md bg-muted/50 flex items-center justify-center p-2 border border-border/50 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors overflow-hidden"
                                    >
                                        {comp.svgIcon && comp.svgIcon.startsWith('<svg') ? (
                                            <div
                                                className="h-full w-full [&>svg]:!w-full [&>svg]:!h-full [&>svg]:!block text-muted-foreground group-hover:text-primary transition-colors"
                                                dangerouslySetInnerHTML={{ __html: comp.svgIcon }}
                                            />
                                        ) : comp.svgIcon && comp.svgIcon !== 'Layout' ? (
                                            <span
                                                className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors leading-none"
                                                style={{ fontSize: '40px' }}
                                            >
                                                {comp.svgIcon}
                                            </span>
                                        ) : (
                                            <Shapes className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium text-sm truncate">{comp.name}</span>
                                        <span className="text-[10px] text-muted-foreground font-mono truncate">{comp.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="p-1 px-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95 flex-shrink-0">
                                                    <Eye className="h-7 w-7" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="max-w-[600px] p-6 bg-card border-border shadow-2xl">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 border-b pb-3">
                                                        <Shapes className="h-6 w-6 text-primary" />
                                                        <p className="text-base font-bold text-primary uppercase tracking-wider">Prompt Estructural</p>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap font-medium">
                                                        {comp.structuralPrompt || <span className="italic text-muted-foreground">Sin prompt estructural definido.</span>}
                                                    </p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-200/50 capitalize font-medium text-[10px] px-2 py-0">
                                        {comp.intent}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center items-center">
                                        {updatingId === comp.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <Switch
                                                checked={comp.isBasic}
                                                onCheckedChange={(checked) => handleToggleBasic(comp.id, checked)}
                                                className="scale-75"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredAndSortedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                    No se encontraron composiciones con esos filtros.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <footer className="p-3 border-t bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Mostrando {filteredAndSortedData.length} de {data.length} composiciones</span>
                <span className="font-mono">Modo avanzado activo siempre por defecto</span>
            </footer>
        </div>
    )
}
