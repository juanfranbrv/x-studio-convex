'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
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
import { LayoutGrid, Plus, Trash2, Pencil } from 'lucide-react'
import Link from 'next/link'

const ADMIN_EMAILS = ['juanfranbrv@gmail.com']

type StructureRow = {
    _id: string
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
    _id: string
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

    const sortedStructures = useMemo(() => (structures || []).slice().sort((a, b) => a.order - b.order), [structures])
    const sortedCompositions = useMemo(() => (compositions || []).slice().sort((a, b) => a.order - b.order), [compositions])

    const handleSeedDefaults = async (origin: 'manual' | 'auto') => {
        if (isSeeding) return
        setIsSeeding(true)
        try {
            const result = await seedDefaults({ admin_email: userEmail })
            if (result?.skipped) {
                if (origin === 'manual') {
                    toast({ title: 'Defaults ya importados', description: 'No se aplicaron cambios porque ya existían datos.' })
                }
            } else {
                toast({ title: 'Defaults importados', description: 'Narrativas y composiciones cargadas desde el catálogo actual.' })
            }
        } catch (error: any) {
            toast({ title: 'Error al importar defaults', description: error?.message || 'No se pudo completar la importación.', variant: 'destructive' })
        } finally {
            setIsSeeding(false)
        }
    }

    useEffect(() => {
        if (!isAdmin) return
        if (!structures || !compositions) return
        if (autoSeedRef.current) return
        if (structures.length === 0 && compositions.length === 0) {
            autoSeedRef.current = true
            handleSeedDefaults('auto')
        }
    }, [isAdmin, structures, compositions])

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

    const handleSaveStructure = async (payload: Omit<StructureRow, '_id'>, id?: string) => {
        if (!id) {
            await createStructure({ admin_email: userEmail, ...payload })
        } else {
            await updateStructure({ admin_email: userEmail, id: id as any, ...payload })
        }
        setStructureDialogOpen(false)
        setEditingStructure(null)
    }

    const handleSaveComposition = async (payload: Omit<CompositionRow, '_id'>, id?: string) => {
        const normalized = {
            ...payload,
            structure_id: payload.scope === 'narrative' ? payload.structure_id : undefined
        }
        if (!id) {
            await createComposition({ admin_email: userEmail, ...normalized })
        } else {
            await updateComposition({ admin_email: userEmail, id: id as any, ...normalized })
        }
        setCompositionDialogOpen(false)
        setEditingComposition(null)
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
                                <LayoutGrid className="h-4 w-4" />
                                Composiciones Imagen
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <Tabs defaultValue="structures" className="flex-1 overflow-hidden">
                <div className="px-6 pt-4">
                    <TabsList>
                        <TabsTrigger value="structures">Narrativas</TabsTrigger>
                        <TabsTrigger value="compositions">Composiciones</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="structures" className="p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Narrativas</h2>
                            <p className="text-sm text-muted-foreground">Estructuras narrativas globales del carrusel.</p>
                        </div>
                        <Button size="sm" onClick={() => { setEditingStructure(null); setStructureDialogOpen(true) }}>
                            <Plus className="h-4 w-4 mr-1" /> Nueva narrativa
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Orden</TableHead>
                                <TableHead>Activa</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedStructures.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell className="font-mono text-xs">{row.structure_id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.order}</TableCell>
                                    <TableCell>{row.isActive ? 'Sí' : 'No'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="outline" onClick={() => { setEditingStructure(row); setStructureDialogOpen(true) }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => removeStructure({ admin_email: userEmail, id: row._id as any })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {sortedStructures.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No hay narrativas todavía.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="compositions" className="p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Composiciones</h2>
                            <p className="text-sm text-muted-foreground">Layouts para carruseles. Globales o asociadas a una narrativa.</p>
                        </div>
                        <Button size="sm" onClick={() => { setEditingComposition(null); setCompositionDialogOpen(true) }}>
                            <Plus className="h-4 w-4 mr-1" /> Nueva composición
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Scope</TableHead>
                                <TableHead>Narrativa</TableHead>
                                <TableHead>Modo</TableHead>
                                <TableHead>Orden</TableHead>
                                <TableHead>Activa</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedCompositions.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell className="font-mono text-xs">{row.composition_id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.scope}</TableCell>
                                    <TableCell>{row.structure_id || '—'}</TableCell>
                                    <TableCell>{row.mode}</TableCell>
                                    <TableCell>{row.order}</TableCell>
                                    <TableCell>{row.isActive ? 'Sí' : 'No'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="outline" onClick={() => { setEditingComposition(row); setCompositionDialogOpen(true) }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => removeComposition({ admin_email: userEmail, id: row._id as any })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {sortedCompositions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                        No hay composiciones todavía.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>

            {structureDialogOpen && (
                <StructureDialog
                    open={structureDialogOpen}
                    onOpenChange={setStructureDialogOpen}
                    onSave={handleSaveStructure}
                    initial={editingStructure}
                />
            )}

            {compositionDialogOpen && (
                <CompositionDialog
                    open={compositionDialogOpen}
                    onOpenChange={setCompositionDialogOpen}
                    onSave={handleSaveComposition}
                    initial={editingComposition}
                    structures={sortedStructures}
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
    onSave: (payload: Omit<StructureRow, '_id'>, id?: string) => void
    initial: StructureRow | null
}) {
    const [form, setForm] = useState<Omit<StructureRow, '_id'>>({
        structure_id: initial?.structure_id || '',
        name: initial?.name || '',
        summary: initial?.summary || '',
        tension: initial?.tension || '',
        flow: initial?.flow || '',
        proof: initial?.proof || '',
        cta: initial?.cta || '',
        order: initial?.order ?? 0,
        isActive: initial?.isActive ?? true
    })
    useEffect(() => {
        setForm({
            structure_id: initial?.structure_id || '',
            name: initial?.name || '',
            summary: initial?.summary || '',
            tension: initial?.tension || '',
            flow: initial?.flow || '',
            proof: initial?.proof || '',
            cta: initial?.cta || '',
            order: initial?.order ?? 0,
            isActive: initial?.isActive ?? true
        })
    }, [initial])

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
    onSave: (payload: Omit<CompositionRow, '_id'>, id?: string) => void
    initial: CompositionRow | null
    structures: StructureRow[]
}) {
    const [form, setForm] = useState<Omit<CompositionRow, '_id'>>({
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
    })
    useEffect(() => {
        setForm({
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
        })
    }, [initial])

    const showStructure = form.scope === 'narrative'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{initial ? 'Editar composición' : 'Nueva composición'}</DialogTitle>
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
