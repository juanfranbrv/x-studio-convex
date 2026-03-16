'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useState } from 'react'
import { IconCopy, IconRefresh, IconCheck } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface CaptionCardProps {
    caption: string
    onChange: (value: string) => void
    onRegenerate?: () => void
    isRegenerating?: boolean
}

export function CaptionCard({
    caption,
    onChange,
    onRegenerate,
    isRegenerating = false,
}: CaptionCardProps) {
    const { t } = useTranslation('common')
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(caption)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="rounded-xl border border-border/60 bg-card/70 p-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('captionCard.title', { defaultValue: 'Social caption' })}
                </p>
                <div className="flex items-center gap-1">
                    {onRegenerate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={onRegenerate}
                            disabled={isRegenerating}
                            title={t('copyCard.regenerate', { defaultValue: 'Regenerate' })}
                        >
                            {isRegenerating ? <Loader2 className="h-3.5 w-3.5" /> : <IconRefresh className="h-3.5 w-3.5" />}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={handleCopy}
                        title={t('copyCard.copy', { defaultValue: 'Copy' })}
                    >
                        {copied ? (
                            <IconCheck className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                            <IconCopy className="w-3.5 h-3.5" />
                        )}
                    </Button>
                </div>
            </div>
            <textarea
                id="caption-card-input"
                aria-label={t('captionCard.aria', { defaultValue: 'Generated social caption' })}
                value={caption}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('captionCard.placeholder', { defaultValue: 'The caption will appear here after generating...' })}
                className="w-full min-h-[80px] text-sm p-3 rounded-lg border border-border/60 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-muted-foreground/70"
                rows={3}
            />
        </div>
    )
}
