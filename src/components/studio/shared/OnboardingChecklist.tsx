'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Circle, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface OnboardingStep {
  id: string
  label: string
  done: boolean
}

interface OnboardingChecklistProps {
  storageKey: string
  title: string
  subtitle: string
  steps: OnboardingStep[]
  className?: string
}

export function OnboardingChecklist({
  storageKey,
  title,
  subtitle,
  steps,
  className,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(storageKey) === '1'
  })
  const completed = useMemo(() => steps.filter((step) => step.done).length, [steps])
  const total = steps.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  const handleDismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, '1')
    }
  }

  if (dismissed) return null

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-primary/90 font-semibold">Onboarding</p>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
          title="Ocultar onboarding"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/25 p-2.5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Progreso inicial
          </span>
          <span className="font-semibold text-foreground">{completed}/{total}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs",
              step.done
                ? "border-primary/30 bg-primary/5 text-foreground"
                : "border-border/60 bg-background/50 text-muted-foreground"
            )}
          >
            {step.done ? (
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            ) : (
              <Circle className="w-4 h-4 shrink-0" />
            )}
            <span className="leading-relaxed">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
