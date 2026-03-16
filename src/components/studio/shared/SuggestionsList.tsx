'use client'

import { IconRotate } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface SuggestionItem {
  title: string
  subtitle: string
}

interface SuggestionsListProps {
  suggestions?: SuggestionItem[]
  onApply: (index: number) => void
  onUndo: () => void
  hasOriginalState: boolean
}

export function SuggestionsList({
  suggestions,
  onApply,
  onUndo,
  hasOriginalState,
}: SuggestionsListProps) {
  const { t } = useTranslation('common')
  if (!suggestions || suggestions.length === 0) return null

  return (
    <TooltipProvider delayDuration={300}>
      <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
            {t('suggestions.alternatives')}
          </p>
          {hasOriginalState ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-primary gap-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <IconRotate className="w-2.5 h-2.5" />
              {t('suggestions.backToOriginal').toUpperCase()}
            </Button>
          ) : (
            <span />
          )}
        </div>
        {suggestions.map((suggestion, idx) => (
          <Tooltip key={`${suggestion.title}-${idx}`}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onApply(idx)}
                className="studio-tone-suggestion group relative w-full flex items-center gap-2.5 p-2.5 rounded-lg border hover:shadow-sm transition-all duration-200 overflow-hidden text-left"
              >
                <span className="text-[11px] font-bold text-foreground shrink-0">
                  {suggestion.title}
                </span>
                <div className="studio-tone-divider h-3 w-[1px] shrink-0" />
                <span className="text-[11px] text-muted-foreground truncate font-medium group-hover:text-foreground transition-colors">
                  {suggestion.subtitle}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="max-w-[260px] text-xs bg-muted text-foreground border border-border shadow-md"
            >
              <p className="font-semibold text-foreground mb-1">{suggestion.title}</p>
              <p className="text-muted-foreground">{suggestion.subtitle}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
