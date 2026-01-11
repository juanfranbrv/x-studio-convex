'use client'

import { useQuery, useMutation } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '@/../convex/_generated/api'
import { Coins, AlertTriangle, Clock, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'

export function CreditsBadge() {
    const { user, isLoaded } = useUser()
    const [isCreating, setIsCreating] = useState(false)
    const [createAttempted, setCreateAttempted] = useState(false)

    const userEmail = user?.emailAddresses[0]?.emailAddress || ''

    const creditsData = useQuery(
        api.users.getCredits,
        user?.id ? { clerk_id: user.id } : 'skip'
    )

    const upsertUser = useMutation(api.users.upsertUser)

    // Auto-create user if they don't exist
    useEffect(() => {
        const createUserIfNeeded = async () => {
            if (isLoaded && user?.id && userEmail && creditsData === null && !isCreating && !createAttempted) {
                setIsCreating(true)
                setCreateAttempted(true)
                try {
                    await upsertUser({
                        clerk_id: user.id,
                        email: userEmail
                    })
                } catch (error) {
                    // User creation failed (probably not approved for beta)
                    console.log('User creation failed:', error)
                }
                setIsCreating(false)
            }
        }
        createUserIfNeeded()
    }, [isLoaded, user?.id, userEmail, creditsData, isCreating, createAttempted, upsertUser])

    // Loading state
    if (!isLoaded || isCreating) {
        return (
            <Badge variant="secondary" className="gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
            </Badge>
        )
    }

    // Still loading or no user in database
    if (!creditsData) return null

    const { credits, isLow, status } = creditsData

    // Waitlist status
    if (status === 'waitlist') {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="secondary" className="gap-1.5 cursor-help">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">Lista de espera</span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Tu cuenta está pendiente de activación</p>
                </TooltipContent>
            </Tooltip>
        )
    }

    // Suspended status
    if (status === 'suspended') {
        return (
            <Badge variant="destructive" className="gap-1.5">
                <span className="text-xs">Cuenta suspendida</span>
            </Badge>
        )
    }

    // Active user - show credits
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge
                    variant={isLow ? 'destructive' : 'default'}
                    className={`gap-1.5 cursor-help ${!isLow ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                >
                    {isLow && <AlertTriangle className="h-3 w-3" />}
                    <Coins className="h-3 w-3" />
                    <span className="font-mono text-xs">{credits}</span>
                </Badge>
            </TooltipTrigger>
            <TooltipContent>
                {isLow ? (
                    <p>¡Créditos bajos! Contacta al admin para más.</p>
                ) : (
                    <p>{credits} créditos disponibles</p>
                )}
            </TooltipContent>
        </Tooltip>
    )
}
