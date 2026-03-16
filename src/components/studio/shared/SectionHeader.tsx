'use client'

import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  icon: ElementType
  title: string
  extra?: ReactNode
  className?: string
}

export function SectionHeader({ icon: Icon, title, extra, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/90">{title}</h3>
      </div>
      {extra}
    </div>
  )
}
