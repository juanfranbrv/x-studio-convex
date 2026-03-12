'use client'

import { Loader2 } from '@/components/ui/spinner'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GenerateButtonProps {
    isGenerating: boolean
    isDisabled: boolean
    onClick: () => void
    className?: string
    label?: string  // Custom label for the button
}

export function GenerateButton({
    isGenerating,
    isDisabled,
    onClick,
    className,
    label,
}: GenerateButtonProps) {
    const { t } = useTranslation('common')
    return (
        <Button
            onClick={onClick}
            disabled={isDisabled || isGenerating}
            data-busy={isGenerating ? 'true' : 'false'}
            className={cn(
                "group feedback-action flex-1 h-12 rounded-xl font-semibold text-sm gap-2 transition-all",
                "bg-primary text-primary-foreground",
                "hover:shadow-lg hover:shadow-primary/25",
                "active:scale-[0.98]",
                "disabled:pointer-events-auto disabled:cursor-not-allowed",
                className
            )}
        >
            {isGenerating ? (
                <>
                    <Loader2 className="w-4 h-4" />
                    <span>{t('copyCard.regenerating')}</span>
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-110 group-hover:rotate-6" />
                    <span>{label || t('actions.create')}</span>
                </>
            )}
        </Button>
    )
}


