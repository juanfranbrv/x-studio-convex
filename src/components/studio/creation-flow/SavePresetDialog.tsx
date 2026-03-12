'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookmarkPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SavePresetDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (name: string) => Promise<void>
    isSaving?: boolean
}

export function SavePresetDialog({
    open,
    onOpenChange,
    onSave,
    isSaving = false
}: SavePresetDialogProps) {
    const { t } = useTranslation('common')
    const [name, setName] = useState('')

    const handleSave = async () => {
        if (!name.trim()) return
        await onSave(name.trim())
        setName('')
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[380px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <BookmarkPlus className="w-5 h-5" />
                        </div>
                        <DialogTitle>{t('presets.saveAsFavoriteTitle', { defaultValue: 'Save as favorite' })}</DialogTitle>
                    </div>
                    <DialogDescription>
                        {t('presets.saveAsFavoriteDescription', { defaultValue: 'Save this configuration to reuse it later.' })}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('presets.nameLabel', { defaultValue: 'Name' })}</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('presets.namePlaceholder', { defaultValue: 'e.g. Summer offer, Viral meme...' })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && name.trim()) {
                                    handleSave()
                                }
                            }}
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('actions.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4" />
                                {t('presets.saving', { defaultValue: 'Saving...' })}
                            </>
                        ) : (
                            t('actions.save')
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


