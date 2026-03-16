'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { IconEditorSection } from '@/components/admin/IconEditorSection'
import { IconGrid, IconPlus, IconDelete, IconEdit, IconArrowUpDown, IconArrowUp, IconArrowDown, IconPower } from '@/components/ui/icons'
import Link from 'next/link'

const ADMIN_EMAILS = ['juanfranbrv@gmail.com']

type StructureRow = {
    _id: Id<'carousel_structures'>
    structure_id: string
    name: string
    summary: string
    tension?: string
    flow?: string
    proof?: string
    cta?: string
    order: number
    isActive: boolean
}

type CompositionRow = {
    _id: Id<'carousel_compositions'>
    composition_id: string
    structure_id?: string
    scope: string
    mode: string
    name: string
    description: string
    layoutPrompt: string
    icon?: string
    iconPrompt?: string
    order: number
    isActive: boolean
}

type StructureSortKey = 'structure_id' | 'name' | 'order' | 'isActive'
type CompositionSortKey = 'composition_id' | 'name' | 'scope' | 'structure_id' | 'mode' | 'order' | 'isActive'
type SortDirection = 'asc' | 'desc'

function normalizeText(value?: string | number | boolean | null) {
    if (typeof value === 'boolean') return value ? '1' : '0'
    return String(value ?? '').toLowerCase().trim()
}

function compareValues(a: string | number | boolean | undefined, b: string | number | boolean | undefined) {
    if (typeof a === 'number' && typeof b === 'number') return a - b
    if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
    return normalizeText(a).localeCompare(normalizeText(b), 'es', { numeric: true, sensitivity: 'base' })
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
    return 'Inténtalo de nuevo.'
}

function SortableHead({
    label,
    active,
    direction,
    onClick,
    className
}: {
    label: string
    active: boolean
    direction: SortDirection
    onClick: () => void
    className?: string
}) {
    const Icon = active ? (direction === 'asc' ? IconArrowUp : IconArrowDown) : IconArrowUpDown

    return (
        <TableHead className={className}>
            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-1 text-left font-medium transition-colors hover:text-foreground"
            >
                <span>{label}</span>
                <Icon className="h-3.5 w-3.5" />
            </button>
        </TableHead>
    )
}

export default function CarouselCompositionsAdminPage() {
    const { user, isLoaded } = useUser()
    const { toast } = useToast()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || ''
    const isAdmin = ADMIN_EMAILS.includes(userEmail.toLowerCase())

    const structures = useQuery(api.carouselAdmin.listStructures, isAdmin ? { admin_email: userEmail } : 'skip') as StructureRow[] | undefined
    const compositions = useQuery(api.carouselAdmin.listCompositions, isAdmin ? { admin_email: userEmail } : 'skip') as CompositionRow[] | undefined

    const createStructure = useMutation(api.carouselAdmin.createStructure)
    const updateStructure = useMutation(api.carouselAdmin.updateStructure)
    const removeStructure = useMutation(api.carouselAdmin.removeStructure)

    const createComposition = useMutation(api.carouselAdmin.createComposition)
    const updateComposition = useMutation(api.carouselAdmin.updateComposition)
    const removeComposition = useMutation(api.carouselAdmin.removeComposition)
    const seedDefaults = useMutation(api.carouselSeed.seedDefaults)

    const [structureDialogOpen, setStructureDialogOpen] = useState(false)
    const [compositionDialogOpen, setCompositionDialogOpen] = useState(false)
    const [isSeeding, setIsSeeding] = useState(false)
    const autoSeedRef = useRef(false)

    const [editingStructure, setEditingStructure] = useState<StructureRow | null>(null)
    const [editingComposition, setEditingComposition] = useState<CompositionRow | null>(null)
    const [structureSearch, setStructureSearch] = useState('')
    const [structureStatusFilter, setStructureStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [structureSort, setStructureSort] = useState<{ key: StructureSortKey; direction: SortDirection }>({
        key: 'order',
        direction: 'asc'
    })
    const [compositionSearch, setCompositionSearch] = useState('')
    const [compositionScopeFilter, setCompositionScopeFilter] = useState<'all' | 'global' | 'narrative'>('all')
    const [compositionStructureFilter, setCompositionStructureFilter] = useState<string>('all')
    const [compositionModeFilter, setCompositionModeFilter] = useState<'all' | 'basic' | 'advanced'>('all')
    const [compositionStatusFilter, setCompositionStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [compositionSort, setCompositionSort] = useState<{ key: CompositionSortKey; direction: SortDirection }>({
        key: 'order',
        direction: 'asc'
    })

    const filteredStructures = useMemo(() => {
        const base = (structures || []).filter((row) => {
            const haystack = `${row.structure_id} ${row.name} ${row.summary}`.toLowerCase()
            if (structureSearch.trim() && !haystack.includes(structureSearch.trim().toLowerCase())) return false
            if (structureStatusFilter === 'active' && !row.isActive) return false
            if (structureStatusFilter === 'inactive' && row.isActive) return false
            return true
        })

        return base.sort((a, b) => {
            const result = compareValues(a[structureSort.key], b[structureSort.key])
            return structureSort.direction === 'asc' ? result : -result
        })
    }, [structures, structureSearch, structureStatusFilter, structureSort])

    const filteredCompositions = useMemo(() => {
        const base = (compositions || []).filter((row) => {
            const haystack = `${row.composition_id} ${row.name} ${row.description} ${row.scope} ${row.structure_id || ''} ${row.mode}`.toLowerCase()
            if (compositionSearch.trim() && !haystack.includes(compositionSearch.trim().toLowerCase())) return false
            if (compositionScopeFilter !== 'all' && row.scope !== compositionScopeFilter) return false
            if (compositionStructureFilter !== 'all' && (row.structure_id || '') !== compositionStructureFilter) return false
            if (compositionModeFilter !== 'all' && row.mode !== compositionModeFilter) return false
            if (compositionStatusFilter === 'active' && !row.isActive) return false
            if (compositionStatusFilter === 'inactive' && row.isActive) return false
            return true
        })

        return base.sort((a, b) => {
            const result = compareValues(a[compositionSort.key], b[compositionSort.key])
            return compositionSort.direction === 'asc' ? result : -result
        })
    }, [
        compositions,
        compositionSearch,
        compositionScopeFilter,
        compositionStructureFilter,
        compositionModeFilter,
        compositionStatusFilter,
        compositionSort
    ])

    const toggleStructureSort = (key: StructureSortKey) => {
        setStructureSort((current) => current.key === key
            ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
            : { key, direction: 'asc' })
    }

    const toggleCompositionSort = (key: CompositionSortKey) => {
        setCompositionSort((current) => current.key === key
            ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
            : { key, direction: 'asc' })
    }

    const handleSeedDefaults = useCallback(async (origin: 'manual' | 'auto') => {
        if (isSeeding) return
        setIsSeeding(true)
        try {
            const result = await seedDefaults({ admin_email: userEmail })
            if (result?.skipped) {
                if (origin === 'manual') {
                    toast({ title: 'Defaults ya importados', description: 'No se aplicaron cambios porque ya existían datos.' })
                }
            } else {
                toast({ title: 'Defaults importados', description: 'Narrativas y diseños cargados desde el catálogo actual.' })
            }
        } catch (error: unknown) {
            toast({ title: 'Error al importar defaults', description: getErrorMessage(error), variant: 'destructive' })
        } finally {
            setIsSeeding(false)
        }
    }, [isSeeding, seedDefaults, toast, userEmail])

    useEffect(() => {
        if (!isAdmin) return
        if (!structures || !compositions) return
        if (autoSeedRef.current) return
        if (structures.length === 0 && compositions.length === 0) {
            autoSeedRef.current = true
            handleSeedDefaults('auto')
        }
    }, [isAdmin, structures, compositions, handleSeedDefaults])

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-sm text-muted-foreground">Cargando...</div>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-sm text-muted-foreground">Acceso denegado.</div>
            </div>
        )
    }

    const handleSaveStructure = async (payload: Omit<StructureRow, '_id'>, id?: Id<'carousel_structures'>) => {
        if (!id) {
            await createStructure({ admin_email: userEmail, ...payload })
        } else {
            await updateStructure({ admin_email: userEmail, id, ...payload })
        }
        setStructureDialogOpen(false)
        setEditingStructure(null)
    }

    const handleSaveComposition = async (payload: Omit<CompositionRow, '_id'>, id?: Id<'carousel_compositions'>) => {
        const normalized = {
            ...payload,
            structure_id: payload.scope === 'narrative' ? payload.structure_id : undefined
        }
        if (!id) {
            await createComposition({ admin_email: userEmail, ...normalized })
        } else {
            await updateComposition({ admin_email: userEmail, id, ...normalized })
        }
        setCompositionDialogOpen(false)
        setEditingComposition(null)
    }

    const handleToggleStructure = async (row: StructureRow) => {
        try {
            await updateStructure({
                admin_email: userEmail,
                id: row._id,
                isActive: !row.isActive
            })
            toast({
                title: row.isActive ? 'Narrativa desactivada' : 'Narrativa activada',
                description: `${row.name} ahora está ${row.isActive ? 'inactiva' : 'activa'}.`
            })
        } catch (error: unknown) {
            toast({
                title: 'No se pudo actualizar la narrativa',
                description: getErrorMessage(error),
                variant: 'destructive'
            })
        }
    }

    const handleToggleComposition = async (row: CompositionRow) => {
        try {
            await updateComposition({
                admin_email: userEmail,
                id: row._id,
                isActive: !row.isActive
            })
            toast({
                title: row.isActive ? 'Diseño desactivado' : 'Diseño activado',
                description: `${row.name} ahora está ${row.isActive ? 'inactivo' : 'activo'}.`
            })
        } catch (error: unknown) {
            toast({
                title: 'No se pudo actualizar el diseño',
                description: getErrorMessage(error),
                variant: 'destructive'
            })
        }
    }

    const handleRemoveStructure = async (row: StructureRow) => {
        const confirmed = window.confirm(`Vas a borrar la narrativa "${row.name}". Esta acción elimina el registro. ¿Continuar?`)
        if (!confirmed) return
        try {
            await removeStructure({ admin_email: userEmail, id: row._id })
            toast({ title: 'Narrativa borrada', description: `${row.name} se ha eliminado.` })
        } catch (error: unknown) {
            toast({
                title: 'No se pudo borrar la narrativa',
                description: getErrorMessage(error),
                variant: 'destructive'
            })
        }
    }

    const handleRemoveComposition = async (row: CompositionRow) => {
        const confirmed = window.confirm(`Vas a borrar el diseño "${row.name}". Si solo quieres ocultarlo, usa desactivar. ¿Continuar?`)
        if (!confirmed) return
        try {
            await removeComposition({ admin_email: userEmail, id: row._id })
            toast({ title: 'Diseño borrado', description: `${row.name} se ha eliminado.` })
        } catch (error: unknown) {
            toast({
                title: 'No se pudo borrar el diseño',
                description: getErrorMessage(error),
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="flex h-screen flex-col bg-background">
            <header className="p-6 border-b border-border bg-muted/20 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href="/admin" className="text-xs font-medium text-primary hover:underline">← Volver a Admin</Link>
                        <h1 className="text-2xl font-bold tracking-tight">Gestor de Carruseles</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSeedDefaults('manual')}
                            disabled={isSeeding}
                        >
                            {isSeeding ? 'Importando...' : 'Importar defaults'}
                        </Button>
                        <Link href="/admin/compositions">
                            <Button variant="outline" size="sm" className="gap-2">
                                <IconGrid className="h-4 w-4" />
                                Diseños Imagen
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <Tabs defaultValue="structures" className="flex-1 overflow-hidden">
                <div className="px-6 pt-4 space-y-4">
                    <details className="rounded-2xl border border-border bg-muted/30 p-4" open>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Mapa rápido</p>
                                <h2 className="mt-1 text-base font-semibold">Cómo se decide un diseño de carrusel</h2>
                            </div>
                            <span className="text-xs text-muted-foreground">Mostrar / ocultar</span>
                        </summary>
                        <div className="mt-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                <p className="text-xs text-muted-foreground md:max-w-xl">
                                    Resumen operativo: el sistema no elige entre todos los diseños del universo, sino entre los que encajan con la narrativa detectada o seleccionada.
                                </p>
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-4">
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs text-muted-foreground">1. Intent</p>
                                    <p className="mt-1 text-sm font-medium">Se interpreta qué quiere hacer el usuario con el carrusel.</p>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                        Ejemplos típicos: oferta, comparativa, lista, pregunta, dato, tutorial o comunicado.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs text-muted-foreground">2. Narrativa</p>
                                    <p className="mt-1 text-sm font-medium">Ese intent se traduce a una estructura narrativa principal.</p>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                        No suele abrir varias narrativas a la vez: normalmente aterriza en una como <span className="font-mono">problema-solucion</span>, <span className="font-mono">comparativa-productos</span> o <span className="font-mono">preguntas-respuestas</span>.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs text-muted-foreground">3. Diseños válidos</p>
                                    <p className="mt-1 text-sm font-medium">Se construye el catálogo disponible para esa narrativa.</p>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                        El conjunto final mezcla los diseños específicos de esa narrativa con los diseños globales compartidos. Aquí es donde entran esas 11-12 composiciones por narrativa.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs text-muted-foreground">4. Selección</p>
                                    <p className="mt-1 text-sm font-medium">La diferencia entre básico y avanzado está en quién decide.</p>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                        <span className="font-medium text-foreground">Modo básico:</span> el sistema autoelige dentro de ese catálogo usando heurísticas del prompt y del número de slides.{' '}
                                        <span className="font-medium text-foreground">Modo avanzado:</span> tú eliges manualmente la narrativa y luego la composición concreta.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3">
                                <p className="text-xs text-muted-foreground">Definición de Scope</p>
                                <p className="mt-1 text-sm font-medium">El scope indica a qué grupo de narrativas pertenece un diseño.</p>
                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                    <span className="font-medium text-foreground">Global:</span> el diseño puede reutilizarse en cualquier narrativa y entra como comodín compartido.{' '}
                                    <span className="font-medium text-foreground">Narrative:</span> el diseño está ligado a una narrativa concreta, por ejemplo <span className="font-mono">problema-solucion</span> o <span className="font-mono">cifras-dato</span>, y solo debería aparecer dentro de ese contexto.
                                </p>
                            </div>
                        </div>
                    </details>
                    <TabsList>
                        <TabsTrigger value="structures">Narrativas</TabsTrigger>
                        <TabsTrigger value="compositions">Diseños</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="structures" className="p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Narrativas</h2>
                            <p className="text-sm text-muted-foreground">Estructuras narrativas globales del carrusel.</p>
                        </div>
                        <Button size="sm" onClick={() => { setEditingStructure(null); setStructureDialogOpen(true) }}>
                            <IconPlus className="h-4 w-4 mr-1" /> Nueva narrativa
                        </Button>
                    </div>

                    <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
                        <Input
                            value={structureSearch}
                            onChange={(e) => setStructureSearch(e.target.value)}
                            placeholder="Buscar por ID, nombre o resumen..."
                        />
                        <Select value={structureStatusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStructureStatusFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="active">Activas</SelectItem>
                                <SelectItem value="inactive">Inactivas</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center text-xs text-muted-foreground">
                            {filteredStructures.length} resultado(s)
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <SortableHead label="ID" active={structureSort.key === 'structure_id'} direction={structureSort.direction} onClick={() => toggleStructureSort('structure_id')} />
                                <SortableHead label="Nombre" active={structureSort.key === 'name'} direction={structureSort.direction} onClick={() => toggleStructureSort('name')} />
                                <SortableHead label="Orden" active={structureSort.key === 'order'} direction={structureSort.direction} onClick={() => toggleStructureSort('order')} />
                                <SortableHead label="Activa" active={structureSort.key === 'isActive'} direction={structureSort.direction} onClick={() => toggleStructureSort('isActive')} />
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStructures.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell className="font-mono text-xs">{row.structure_id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.order}</TableCell>
                                    <TableCell>{row.isActive ? 'Sí' : 'No'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleStructure(row)}
                                            title={row.isActive ? 'Desactivar narrativa' : 'Activar narrativa'}
                                        >
                                            <IconPower className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => { setEditingStructure(row); setStructureDialogOpen(true) }}>
                                            <IconEdit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleRemoveStructure(row)}>
                                            <IconDelete className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredStructures.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No hay narrativas para esos filtros.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="compositions" className="p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Diseños</h2>
                            <p className="text-sm text-muted-foreground">Layouts para carruseles. Globales o asociados a una narrativa.</p>
                        </div>
                        <Button size="sm" onClick={() => { setEditingComposition(null); setCompositionDialogOpen(true) }}>
                            <IconPlus className="h-4 w-4 mr-1" /> Nuevo diseño
                        </Button>
                    </div>

                    <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_160px_220px_160px_160px_auto]">
                        <Input
                            value={compositionSearch}
                            onChange={(e) => setCompositionSearch(e.target.value)}
                            placeholder="Buscar por ID, nombre, narrativa o descripción..."
                        />
                        <Select value={compositionScopeFilter} onValueChange={(value: 'all' | 'global' | 'narrative') => setCompositionScopeFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Scope" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los scope</SelectItem>
                                <SelectItem value="global">Global</SelectItem>
                                <SelectItem value="narrative">Narrativa</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={compositionStructureFilter} onValueChange={setCompositionStructureFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Narrativa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las narrativas</SelectItem>
                                {(structures || []).map((structure) => (
                                    <SelectItem key={structure._id} value={structure.structure_id}>
                                        {structure.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={compositionModeFilter} onValueChange={(value: 'all' | 'basic' | 'advanced') => setCompositionModeFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Modo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los modos</SelectItem>
                                <SelectItem value="basic">Básico</SelectItem>
                                <SelectItem value="advanced">Avanzado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={compositionStatusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setCompositionStatusFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="active">Activos</SelectItem>
                                <SelectItem value="inactive">Inactivos</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center text-xs text-muted-foreground">
                            {filteredCompositions.length} resultado(s)
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <SortableHead label="ID" active={compositionSort.key === 'composition_id'} direction={compositionSort.direction} onClick={() => toggleCompositionSort('composition_id')} />
                                <SortableHead label="Nombre" active={compositionSort.key === 'name'} direction={compositionSort.direction} onClick={() => toggleCompositionSort('name')} />
                                <SortableHead label="Scope" active={compositionSort.key === 'scope'} direction={compositionSort.direction} onClick={() => toggleCompositionSort('scope')} />
                                <SortableHead label="Narrativa" active={compositionSort.key === 'structure_id'} direction={compositionSort.direction} onClick={() => toggleCompositionSort('structure_id')} />
                                <SortableHead label="Modo" active={compositionSort.key === 'mode'} direction={compositionSort.direction} onClick={() => toggleCompositionSort('mode')} />
                                <SortableHead label="Orden" active={compositionSort.key === 'order'} direction={compositionSort.direction} onClick={() => toggleCompositionSort('order')} />
                                <SortableHead label="Activa" active={compositionSort.key === 'isActive'} direction={compositionSort.direction} onClick={() => toggleCompositionSort('isActive')} />
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCompositions.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell className="font-mono text-xs">{row.composition_id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.scope}</TableCell>
                                    <TableCell>{row.structure_id || '—'}</TableCell>
                                    <TableCell>{row.mode}</TableCell>
                                    <TableCell>{row.order}</TableCell>
                                    <TableCell>{row.isActive ? 'Sí' : 'No'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleComposition(row)}
                                            title={row.isActive ? 'Desactivar diseño' : 'Activar diseño'}
                                        >
                                            <IconPower className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => { setEditingComposition(row); setCompositionDialogOpen(true) }}>
                                            <IconEdit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleRemoveComposition(row)}>
                                            <IconDelete className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredCompositions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                        No hay diseños para esos filtros.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>

            {structureDialogOpen && (
                <StructureDialog
                    key={editingStructure?._id || 'new-structure'}
                    open={structureDialogOpen}
                    onOpenChange={setStructureDialogOpen}
                    onSave={handleSaveStructure}
                    initial={editingStructure}
                />
            )}

            {compositionDialogOpen && (
                <CompositionDialog
                    key={editingComposition?._id || 'new-composition'}
                    open={compositionDialogOpen}
                    onOpenChange={setCompositionDialogOpen}
                    onSave={handleSaveComposition}
                    initial={editingComposition}
                    structures={structures || []}
                />
            )}
        </div>
    )
}

function StructureDialog({
    open,
    onOpenChange,
    onSave,
    initial
}: {
    open: boolean
    onOpenChange: (value: boolean) => void
    onSave: (payload: Omit<StructureRow, '_id'>, id?: Id<'carousel_structures'>) => void
    initial: StructureRow | null
}) {
    const [form, setForm] = useState<Omit<StructureRow, '_id'>>(() => ({
        structure_id: initial?.structure_id || '',
        name: initial?.name || '',
        summary: initial?.summary || '',
        tension: initial?.tension || '',
        flow: initial?.flow || '',
        proof: initial?.proof || '',
        cta: initial?.cta || '',
        order: initial?.order ?? 0,
        isActive: initial?.isActive ?? true
    }))

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{initial ? 'Editar narrativa' : 'Nueva narrativa'}</DialogTitle>
                    <DialogDescription>Define la estructura narrativa global.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>ID</Label>
                        <Input value={form.structure_id} onChange={(e) => setForm({ ...form, structure_id: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Resumen</Label>
                        <Textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Tensión</Label>
                        <Input value={form.tension} onChange={(e) => setForm({ ...form, tension: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Flow</Label>
                        <Input value={form.flow} onChange={(e) => setForm({ ...form, flow: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Proof</Label>
                        <Input value={form.proof} onChange={(e) => setForm({ ...form, proof: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>CTA</Label>
                        <Input value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Orden</Label>
                        <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Activa</Label>
                        <div className="flex items-center gap-2">
                            <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
                            <span className="text-sm text-muted-foreground">{form.isActive ? 'Activa' : 'Inactiva'}</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={() => onSave(form, initial?._id)}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function CompositionDialog({
    open,
    onOpenChange,
    onSave,
    initial,
    structures
}: {
    open: boolean
    onOpenChange: (value: boolean) => void
    onSave: (payload: Omit<CompositionRow, '_id'>, id?: Id<'carousel_compositions'>) => void
    initial: CompositionRow | null
    structures: StructureRow[]
}) {
    const [form, setForm] = useState<Omit<CompositionRow, '_id'>>(() => ({
        composition_id: initial?.composition_id || '',
        structure_id: initial?.structure_id,
        scope: initial?.scope || 'global',
        mode: initial?.mode || 'basic',
        name: initial?.name || '',
        description: initial?.description || '',
        layoutPrompt: initial?.layoutPrompt || '',
        icon: initial?.icon || '',
        iconPrompt: initial?.iconPrompt || '',
        order: initial?.order ?? 0,
        isActive: initial?.isActive ?? true
    }))

    const showStructure = form.scope === 'narrative'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{initial ? 'Editar diseño' : 'Nuevo diseño'}</DialogTitle>
                    <DialogDescription>Define layout y metadatos.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>ID</Label>
                        <Input value={form.composition_id} onChange={(e) => setForm({ ...form, composition_id: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Scope</Label>
                        <Select value={form.scope} onValueChange={(value) => setForm({ ...form, scope: value })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="global">Global</SelectItem>
                                <SelectItem value="narrative">Narrativa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {showStructure && (
                        <div className="space-y-2">
                            <Label>Narrativa</Label>
                            <Select value={form.structure_id || ''} onValueChange={(value) => setForm({ ...form, structure_id: value })}>
                                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                                <SelectContent>
                                    {structures.map((s) => (
                                        <SelectItem key={s._id} value={s.structure_id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Modo</Label>
                        <Select value={form.mode} onValueChange={(value) => setForm({ ...form, mode: value })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">Básico</SelectItem>
                                <SelectItem value="advanced">Avanzado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Orden</Label>
                        <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Activa</Label>
                        <div className="flex items-center gap-2">
                            <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
                            <span className="text-sm text-muted-foreground">{form.isActive ? 'Activa' : 'Inactiva'}</span>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Descripción</Label>
                        <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Layout Prompt</Label>
                        <Textarea rows={6} value={form.layoutPrompt} onChange={(e) => setForm({ ...form, layoutPrompt: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <IconEditorSection
                            initialSvg={form.icon || ''}
                            onChange={(value) => setForm({ ...form, icon: value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={() => onSave(form, initial?._id)}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
