'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookmarkPlus, Loader2 } from 'lucide-react'

interface SavePresetDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (name: string, description: string) => Promise<void>
    isSaving?: boolean
}

export function SavePresetDialog({
    open,
    onOpenChange,
    onSave,
    isSaving = false
}: SavePresetDialogProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleSave = async () => {
        if (!name.trim()) return
        await onSave(name, description)
        setName('')
        setDescription('')
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <BookmarkPlus className="w-5 h-5" />
                        </div>
                        <DialogTitle>Guardar como Preset</DialogTitle>
                    </div>
                    <DialogDescription>
                        Guarda esta configuración para reutilizarla más tarde.
                        Aparecerá en tu lista de "Favoritos".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre del Preset</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Oferta de Verano, Meme Viral..."
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Breve descripción (opcional)</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Para qué sirve este estilo..."
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            'Guardar Preset'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
