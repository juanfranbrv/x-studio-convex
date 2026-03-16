'use client'

import { Loader2 } from '@/components/ui/spinner'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'convex/react'
import { IconAlertCircle, IconClock, IconCoins } from '@/components/ui/icons'
import { api } from '@/../convex/_generated/api'
import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

export function CreditsBadge() {
    const { t } = useTranslation('common')
    const { user, isLoaded } = useUser()
    const [isCreating, setIsCreating] = useState(false)
    const [createAttempted, setCreateAttempted] = useState(false)

    const userEmail = user?.emailAddresses[0]?.emailAddress || ''

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
            <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                <Loader2 className="h-5 w-5" />
            </Badge>
        )
    }

    if (!creditsData) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="secondary" className="cursor-help gap-2 px-3 py-1.5">
                        <IconCoins className="h-5 w-5" />
                        <span className="font-mono text-base">--</span>
                    </Badge>
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
                    <Badge variant="secondary" className="cursor-help gap-2 px-3 py-1.5">
                        <IconClock className="h-5 w-5" />
                        <span className="text-base">{t('credits.waitlist')}</span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('credits.waitlistHelp')}</p>
                </TooltipContent>
            </Tooltip>
        )
    }

    if (status === 'suspended') {
        return (
            <Badge variant="destructive" className="gap-2 px-3 py-1.5">
                <span className="text-base">{t('credits.suspended')}</span>
            </Badge>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge
                    variant={isLow ? 'destructive' : 'default'}
                    className={`cursor-help gap-2 px-3 py-1.5 ${!isLow ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                >
                    {isLow ? <IconAlertCircle className="h-5 w-5" /> : null}
                    <IconCoins className="h-5 w-5" />
                    <span className="font-mono text-base">{credits}</span>
                </Badge>
            </TooltipTrigger>
            <TooltipContent>
                {isLow ? <p>{t('credits.low')}</p> : <p>{t('credits.available', { count: credits })}</p>}
            </TooltipContent>
        </Tooltip>
    )
}


