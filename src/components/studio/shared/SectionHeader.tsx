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
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[11px] font-semibold text-foreground/95 uppercase tracking-[0.12em]">{title}</h3>
      </div>
      {extra}
    </div>
  )
}
