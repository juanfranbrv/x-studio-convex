'use client'

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { IconCopy, IconRefresh, IconLock, IconUnlock, IconCheck, IconUndo } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useTranslation } from 'react-i18next'

interface GeneratedCopyCardProps {
    copy?: string | null
    hashtags?: string[]
    onCopy?: (text: string) => void
    onCopyChange?: (text: string) => void
    onRegenerate?: () => void
    onRestorePrevious?: () => void
    onCancel?: () => void
    className?: string
    isLoading?: boolean
    isCanceling?: boolean
    isLocked?: boolean
    onToggleLock?: () => void
    hasPreviousVersion?: boolean
}

export const GeneratedCopyCard: React.FC<GeneratedCopyCardProps> = ({
    copy,
    hashtags = [],
    onCopy,
    onRegenerate,
    onRestorePrevious,
    onCancel,
    className,
    isLoading = false,
    isCanceling = false,
    isLocked = false,
    onToggleLock,
    onCopyChange,
    hasPreviousVersion = false,
}) => {
    const { t } = useTranslation('common')
    const { activeBrandKit: brand } = useBrandKit()
    const [editedCopy, setEditedCopy] = React.useState(copy || '')
    const [isCopied, setIsCopied] = React.useState(false)
    const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
        setEditedCopy(copy || '')
    }, [copy])

    React.useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current)
            }
        }
    }, [])

    const handleCopy = () => {
        const fullText = `${editedCopy}\n\n${hashtags.join(' ')}`
        navigator.clipboard.writeText(fullText)
        onCopy?.(fullText)
        setIsCopied(true)
        if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current)
        }
        copyTimeoutRef.current = setTimeout(() => {
            setIsCopied(false)
        }, 1600)
    }

    return (
        <Card className={cn('w-full rounded-sm border-muted bg-card/50 backdrop-blur-sm', className)}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4 pb-2">
                <Avatar className="h-8 w-8 border">
                    <AvatarImage
                        src={brand?.favicon_url || brand?.logo_url || undefined}
                        alt={brand?.brand_name || t('copyCard.brandFallback')}
                    />
                    <AvatarFallback>{brand?.brand_name?.[0] || 'B'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{brand?.brand_name || t('copyCard.brandFallback')}</span>
                    <span className="text-[10px] text-muted-foreground">{t('copyCard.generatedNow')}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-2">
                {isLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-5/6 rounded bg-muted" />
                    </div>
                ) : (
                    <Textarea
                        value={editedCopy}
                        onChange={(e) => {
                            setEditedCopy(e.target.value)
                            onCopyChange?.(e.target.value)
                        }}
                        className="min-h-[80px] resize-none border-none bg-transparent p-0 text-sm leading-relaxed focus-visible:ring-0"
                        placeholder={t('copyCard.placeholder')}
                    />
                )}

                <div className="flex flex-wrap gap-1.5">
                    {isLoading ? (
                        <>
                            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                            <div className="h-5 w-14 animate-pulse rounded bg-muted" />
                        </>
                    ) : (
                        hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="h-5 px-1.5 py-0 text-[10px] font-normal text-muted-foreground">
                                {tag}
                            </Badge>
                        ))
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-muted/20 p-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRegenerate}
                        disabled={isLoading}
                        className="h-7 text-xs text-muted-foreground hover:text-primary"
                    >
                        {isLoading ? <Loader2 className="mr-1.5 h-3 w-3" /> : <IconRefresh className="mr-1.5 h-3 w-3" />}
                        {isLoading ? t('copyCard.regenerating') : t('copyCard.regenerate')}
                    </Button>
                    {hasPreviousVersion && onRestorePrevious ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRestorePrevious}
                            disabled={isLoading}
                            className="h-7 text-xs text-muted-foreground hover:text-primary"
                        >
                            <IconUndo className="mr-1.5 h-3 w-3" />
                            {t('copyCard.restorePrevious', { defaultValue: 'Volver al anterior' })}
                        </Button>
                    ) : null}
                    {isLoading && onCancel ? (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={onCancel}
                            className="h-7 px-0 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                            {isCanceling ? t('actions.canceling', { defaultValue: 'Canceling...' }) : t('actions.stop', { defaultValue: 'Stop' })}
                        </Button>
                    ) : null}
                </div>

                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleLock}
                        className={cn('h-7 text-xs', isLocked ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}
                        title={isLocked ? t('copyCard.unlockTitle') : t('copyCard.lockTitle')}
                    >
                        {isLocked ? <IconLock className="mr-1.5 h-3 w-3" /> : <IconUnlock className="mr-1.5 h-3 w-3" />}
                        {isLocked ? t('copyCard.locked') : t('copyCard.lock')}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className={cn('h-7 text-xs transition-all', isCopied && 'bg-primary/10 text-primary')}
                        title={isCopied ? t('copyCard.copied') : t('copyCard.copy')}
                    >
                        {isCopied ? <IconCheck className="mr-1.5 h-3 w-3" /> : <IconCopy className="mr-1.5 h-3 w-3" />}
                        {isCopied ? t('copyCard.copied') : t('copyCard.copy')}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
