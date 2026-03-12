import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

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
  confirmLabel,
  onValueChange,
  onCancel,
  onConfirm,
}: SessionTitleDialogProps) {
  const { t } = useTranslation('common')

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
            placeholder={t('sessionDialog.placeholder', { defaultValue: 'e.g. Spring campaign' })}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onConfirm()
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            {t('sessionDialog.helper', { defaultValue: 'You will recognize it more easily in history, and it will keep saving under this name.' })}
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t('actions.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button onClick={onConfirm} disabled={!value.trim()}>
            {confirmLabel || t('sessionDialog.confirm', { defaultValue: 'Save session' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
