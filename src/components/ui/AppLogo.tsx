'use client'

import { cn } from '@/lib/utils'

type Props = {
    className?: string
    style?: React.CSSProperties
}

/**
 * Renders the PostLaboratory brand logo using CSS mask so it inherits
 * the active theme primary color at all times.
 *
 * The source file (logo.svg) is a black-on-transparent raster embedded
 * in SVG. CSS mask paints it with `var(--color-brand-primary)` so it
 * always matches the user/admin configured palette.
 */
export function AppLogo({ className, style }: Props) {
    return (
        <span
            aria-label="PostLaboratory"
            role="img"
            className={cn('block', className)}
            style={{
                WebkitMaskImage: 'url(/logo.svg)',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskImage: 'url(/logo.svg)',
                maskRepeat: 'no-repeat',
                maskSize: 'contain',
                maskPosition: 'center',
                backgroundColor: 'var(--color-brand-primary)',
                ...style,
            }}
        />
    )
}
