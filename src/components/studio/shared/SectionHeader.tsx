'use client'

import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  icon: ElementType
  title: string
  extra?: ReactNode
  className?: string
  iconContainerClassName?: string
  titleClassName?: string
}

export function SectionHeader({
  icon: Icon,
  title,
  extra,
  className,
  iconContainerClassName,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]", iconContainerClassName)}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <h3 className={cn("text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/90", titleClassName)}>{title}</h3>
      </div>
      {extra}
    </div>
  )
}
