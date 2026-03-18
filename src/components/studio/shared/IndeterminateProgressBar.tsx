'use client'

import { cn } from '@/lib/utils'

type IndeterminateProgressBarProps = {
    className?: string
}

export function IndeterminateProgressBar({ className }: IndeterminateProgressBarProps) {
    return (
        <div
            aria-hidden="true"
            className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-primary/12', className)}
        >
            <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-primary/85 animate-[studio-indeterminate_1.2s_ease-in-out_infinite]" />
        </div>
    )
}
