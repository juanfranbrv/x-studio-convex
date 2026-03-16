'use client'

import { IconRotate } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export interface SuggestionItem {
  title: string
  subtitle: string
}

interface SuggestionsListProps {
  suggestions?: SuggestionItem[]
  onApply: (index: number) => void
  onUndo: () => void
  hasOriginalState: boolean
  activeSuggestionIndex?: number | null
}

export function SuggestionsList({
  suggestions,
  onApply,
  onUndo,
  hasOriginalState,
  activeSuggestionIndex = null,
}: SuggestionsListProps) {
  const { t } = useTranslation('common')
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
          {t('suggestions.alternatives')}
        </p>
        {hasOriginalState ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            className="h-8 rounded-xl px-3 text-[clamp(0.88rem,0.84rem+0.1vw,0.94rem)] text-muted-foreground hover:bg-muted/80 hover:text-foreground gap-1 opacity-80 hover:opacity-100 transition-all"
          >
            <IconRotate className="w-2.5 h-2.5" />
            {t('suggestions.backToOriginal')}
          </Button>
        ) : (
          <span />
        )}
      </div>
      {suggestions.map((suggestion, idx) => (
        <button
          key={`${suggestion.title}-${idx}`}
          onClick={() => onApply(idx)}
          aria-pressed={activeSuggestionIndex === idx}
          className={cn(
            "group relative flex min-h-[44px] w-full items-center rounded-[1rem] border px-4 py-3 text-left transition-all duration-200 hover:shadow-sm",
            activeSuggestionIndex === idx
              ? "border-primary/35 bg-primary/[0.07] shadow-[0_16px_34px_-26px_rgba(59,130,246,0.20)]"
              : "border-border/55 bg-background/55 hover:border-border/80 hover:bg-background/88"
          )}
        >
          <span
            className={cn(
              "truncate text-[clamp(0.96rem,0.92rem+0.1vw,1.02rem)] font-semibold transition-colors group-hover:text-foreground/90",
              activeSuggestionIndex === idx ? "text-primary/90" : "text-foreground/92"
            )}
          >
            {suggestion.title}
          </span>
        </button>
      ))}
    </div>
  )
}
