'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'convex/react'
import { IconAlertCircle } from '@/components/ui/icons'
import { api } from '@/../convex/_generated/api'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function CreditsBadge() {
    const { t, i18n } = useTranslation('common')
    const { user, isLoaded } = useUser()
    const [isCreating, setIsCreating] = useState(false)
    const [createAttempted, setCreateAttempted] = useState(false)

    const userEmail = user?.emailAddresses[0]?.emailAddress || ''
    const creditsShortLabel = i18n.language.startsWith('es') ? 'créditos' : 'credits'

    const creditsData = useQuery(api.users.getCredits, user?.id ? { clerk_id: user.id } : 'skip')
    const upsertUser = useMutation(api.users.upsertUser)

    useEffect(() => {
        const createUserIfNeeded = async () => {
            if (isLoaded && user?.id && userEmail && creditsData === null && !isCreating && !createAttempted) {
                setIsCreating(true)
                setCreateAttempted(true)
                try {
                    await upsertUser({
                        clerk_id: user.id,
                        email: userEmail,
                    })
                } catch (error) {
                    console.log('User creation failed:', error)
                }
                setIsCreating(false)
            }
        }

        void createUserIfNeeded()
    }, [createAttempted, creditsData, isCreating, isLoaded, upsertUser, user?.id, userEmail])

    if (!isLoaded || isCreating) {
        return (
            <span className="inline-flex min-h-10 items-center justify-center rounded-full px-3 py-1.5 text-muted-foreground">
                <Loader2 className="h-5 w-5" />
            </span>
        )
    }

    if (!creditsData) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-flex min-h-10 items-baseline gap-2 px-2 py-1 text-foreground/80">
                        <span className="font-mono text-[clamp(1.02rem,0.97rem+0.18vw,1.12rem)]">--</span>
                        <span className="text-[0.82rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">{creditsShortLabel}</span>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('credits.notAvailable')}</p>
                </TooltipContent>
            </Tooltip>
        )
    }

    const { credits, isLow, status } = creditsData

    if (status === 'waitlist') {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-flex min-h-10 items-baseline gap-2 px-2 py-1 text-foreground/82">
                        <span className="font-mono text-[clamp(0.98rem,0.94rem+0.16vw,1.05rem)]">--</span>
                        <span className="text-[0.82rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">{t('credits.waitlist')}</span>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('credits.waitlistHelp')}</p>
                </TooltipContent>
            </Tooltip>
        )
    }

    if (status === 'suspended') {
        return (
            <span className="inline-flex min-h-10 items-center rounded-full bg-destructive/12 px-3 py-1.5 text-destructive ring-1 ring-destructive/20">
                <span className="text-[1rem] font-medium">{t('credits.suspended')}</span>
            </span>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className={cn(
                        "cursor-help transition-all",
                        isLow
                            ? 'inline-flex items-center gap-2 rounded-full bg-destructive/12 px-3 py-1.5 text-destructive ring-1 ring-destructive/20'
                            : 'inline-flex min-h-10 items-baseline gap-2 px-2 py-1 text-foreground'
                    )}
                >
                    {isLow ? <IconAlertCircle className="h-4.5 w-4.5 shrink-0" /> : null}
                    <span className="font-mono text-[clamp(1.02rem,0.97rem+0.18vw,1.12rem)]">{credits}</span>
                    <span className={cn(
                        "font-medium uppercase tracking-[0.08em]",
                        isLow ? 'text-[0.78rem] text-destructive/80' : 'text-[0.82rem] text-muted-foreground'
                    )}>
                        {creditsShortLabel}
                    </span>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                {isLow ? <p>{t('credits.low')}</p> : <p>{t('credits.available', { count: credits })}</p>}
            </TooltipContent>
        </Tooltip>
    )
}


