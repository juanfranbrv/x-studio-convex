import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type SessionTitleDialogProps = {
  open: boolean
  title: string
  description: string
  value: string
  confirmLabel?: string
  onValueChange: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
}

export function SessionTitleDialog({
  open,
  title,
  description,
  value,
  confirmLabel = 'Guardar sesión',
  onValueChange,
  onCancel,
  onConfirm,
}: SessionTitleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onCancel() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            autoFocus
            value={value}
            maxLength={80}
            placeholder="Ej. Campaña primavera"
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onConfirm()
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            Lo podrás identificar mejor en el historial y luego seguirá guardándose con este nombre.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={!value.trim()}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
