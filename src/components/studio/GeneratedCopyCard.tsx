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
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

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

    React.useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.style.height = '0px'
        textarea.style.height = `${textarea.scrollHeight}px`
    }, [editedCopy, isLoading])

    const hasHashtags = hashtags.length > 0

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
        <Card className={cn('w-full rounded-[1.45rem] border border-border/50 bg-background/78 shadow-[0_16px_34px_-30px_rgba(15,23,42,0.12)]', className)}>
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

            <CardContent className={cn('p-4 pt-2', isLoading || hasHashtags ? 'space-y-3' : 'space-y-0')}>
                {isLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-5/6 rounded bg-muted" />
                    </div>
                ) : (
                    <Textarea
                        ref={textareaRef}
                        value={editedCopy}
                        onChange={(e) => {
                            setEditedCopy(e.target.value)
                            onCopyChange?.(e.target.value)
                        }}
                        rows={1}
                        className="h-auto !min-h-0 resize-none overflow-hidden border-none bg-transparent p-0 !text-[1.12rem] md:!text-[1.12rem] leading-[1.7] focus-visible:ring-0"
                        placeholder={t('copyCard.placeholder')}
                    />
                )}

                {isLoading || hasHashtags ? (
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
                ) : null}
            </CardContent>

            <CardFooter className="border-t border-border/45 bg-muted/10 p-2.5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRegenerate}
                            disabled={isLoading}
                            className="h-8 rounded-[0.85rem] px-2.5 text-[0.82rem] text-muted-foreground hover:text-primary"
                            title={t('copyCard.regenerateHelp', { defaultValue: 'Genera una nueva versión del copy' })}
                        >
                            {isLoading ? <Loader2 className="mr-1.5 h-3.5 w-3.5" /> : <IconRefresh className="mr-1.5 h-3.5 w-3.5" />}
                            {isLoading ? t('copyCard.regenerating') : t('copyCard.tryAnotherVersion')}
                        </Button>
                        {hasPreviousVersion && onRestorePrevious ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onRestorePrevious}
                                disabled={isLoading}
                                className="h-8 rounded-[0.85rem] px-2.5 text-[0.82rem] text-muted-foreground hover:text-primary"
                            >
                                <IconUndo className="mr-1.5 h-3.5 w-3.5" />
                                {t('copyCard.restorePrevious', { defaultValue: 'Volver al anterior' })}
                            </Button>
                        ) : null}
                        {isLoading && onCancel ? (
                            <Button
                                variant="link"
                                size="sm"
                                onClick={onCancel}
                                className="h-8 px-0 text-[0.82rem] text-muted-foreground hover:text-foreground"
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
                            className={cn('h-8 rounded-[0.85rem] px-2.5 text-[0.82rem]', isLocked ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}
                            title={isLocked ? t('copyCard.unlockTitle') : t('copyCard.lockHelp')}
                        >
                            {isLocked ? <IconLock className="mr-1.5 h-3.5 w-3.5" /> : <IconUnlock className="mr-1.5 h-3.5 w-3.5" />}
                            {isLocked ? t('copyCard.locked') : t('copyCard.keepThisText')}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className={cn('h-8 rounded-[0.85rem] px-2.5 text-[0.82rem] transition-all', isCopied && 'bg-primary/10 text-primary')}
                            title={isCopied ? t('copyCard.copied') : t('copyCard.copy')}
                        >
                            {isCopied ? <IconCheck className="mr-1.5 h-3.5 w-3.5" /> : <IconCopy className="mr-1.5 h-3.5 w-3.5" />}
                            {isCopied ? t('copyCard.copied') : t('copyCard.copy')}
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
