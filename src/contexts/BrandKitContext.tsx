'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { getAllUserBrandKits, getUserBrandKitById } from '@/app/actions/get-user-brand-kit'
import { deleteBrandKit } from '@/app/actions/delete-brand-kit'
import { updateUserBrandKit } from '@/app/actions/update-user-brand-kit'
import type { BrandKitSummary, BrandDNA } from '@/lib/brand-types'

interface BrandKitContextType {
    activeBrandKit: BrandDNA | null
    brandKits: BrandKitSummary[]
    loading: boolean
    setActiveBrandKit: (id: string, shouldPersist?: boolean, allowFallback?: boolean) => Promise<boolean>
    reloadBrandKits: (isSilent?: boolean) => Promise<void>
    deleteBrandKitById: (id: string) => Promise<void>
    updateActiveBrandKit: (data: Partial<BrandDNA>) => Promise<boolean>
    syncActiveBrandKit: (data: BrandDNA) => void
}

const BrandKitContext = createContext<BrandKitContextType | undefined>(undefined)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const EMPTY_BRANDKIT_RECOVERY_DELAYS_MS = [1800, 4500, 9000]

export function BrandKitProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [activeBrandKit, setActiveBrandKitState] = useState<BrandDNA | null>(null)
    const [brandKits, setBrandKits] = useState<BrandKitSummary[]>([])
    const [loading, setLoading] = useState(true)

    const userRecord = useQuery(api.users.getUser, user?.id ? { clerk_id: user.id } : 'skip')
    const updateLastBrand = useMutation(api.users.setCurrentBrand)
    const upsertUser = useMutation(api.users.upsertUser)

    const initialLoadAttempted = useRef(false)
    const activeSelectionHealing = useRef(false)
    const initializedUserIdRef = useRef<string | null>(null)
    const loadRequestIdRef = useRef(0)
    const loadInFlightRef = useRef(false)
    const backgroundRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const emptyRecoveryAttemptRef = useRef(0)
    const loadBrandKitsRef = useRef<(isSilent?: boolean) => Promise<void>>(async () => { })
    const setActiveBrandKitRef = useRef<BrandKitContextType['setActiveBrandKit']>(async () => false)

    const clearBackgroundRetry = useCallback(() => {
        if (backgroundRetryTimeoutRef.current) {
            clearTimeout(backgroundRetryTimeoutRef.current)
            backgroundRetryTimeoutRef.current = null
        }
    }, [])

    const scheduleBackgroundRecovery = useCallback(() => {
        if (!user?.id) return
        if (backgroundRetryTimeoutRef.current) return

        const attemptIndex = emptyRecoveryAttemptRef.current
        const delay = EMPTY_BRANDKIT_RECOVERY_DELAYS_MS[attemptIndex]
        if (typeof delay !== 'number') return

        backgroundRetryTimeoutRef.current = setTimeout(() => {
            backgroundRetryTimeoutRef.current = null
            emptyRecoveryAttemptRef.current += 1
            void loadBrandKitsRef.current(true)
        }, delay)
    }, [user?.id])

    const ensureConvexUser = useCallback(async () => {
        if (!user?.id) return false
        if (userRecord) return true

        const userEmail = user.emailAddresses[0]?.emailAddress
        if (!userEmail) return false

        try {
            await upsertUser({
                clerk_id: user.id,
                email: userEmail,
            })
            return true
        } catch (error) {
            console.warn('[CONTEXT] Could not create user before persisting brand:', error)
            return false
        }
    }, [upsertUser, user?.emailAddresses, user?.id, userRecord])

    const loadBrandKits = useCallback(async (isSilent = false) => {
        if (!user?.id) {
            if (!isSilent) setLoading(false)
            return
        }

        if (loadInFlightRef.current) return
        loadInFlightRef.current = true
        const requestId = ++loadRequestIdRef.current

        if (!isSilent) setLoading(true)
        try {
            let result: Awaited<ReturnType<typeof getAllUserBrandKits>> = { success: false, error: 'No data' }
            const retryDelaysMs = [0, 350, 900]
            for (let i = 0; i < retryDelaysMs.length; i++) {
                if (retryDelaysMs[i] > 0) {
                    await wait(retryDelaysMs[i])
                }

                result = await getAllUserBrandKits(user.id)

                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    break
                }

                if (i === retryDelaysMs.length - 1) {
                    break
                }
            }

            if (requestId !== loadRequestIdRef.current) return

            if (result.success && result.data) {
                setBrandKits(result.data)

                if (result.data.length > 0) {
                    emptyRecoveryAttemptRef.current = 0
                    clearBackgroundRetry()
                } else {
                    scheduleBackgroundRecovery()
                }

                if (result.data.length > 0 && !activeBrandKit) {
                    const lastBrandId = userRecord?.current_brand_id
                    const hasPersistedBrand = Boolean(lastBrandId && result.data.find((b) => b.id === lastBrandId))
                    const brandToSelect = hasPersistedBrand
                        ? (lastBrandId as string)
                        : result.data[0].id

                    const selected = await setActiveBrandKitRef.current(brandToSelect, !hasPersistedBrand)
                    if (!selected && result.data[0]?.id && result.data[0].id !== brandToSelect) {
                        await setActiveBrandKitRef.current(result.data[0].id, true, true)
                    }
                }
            } else {
                scheduleBackgroundRecovery()
            }
        } catch (error) {
            console.error('Error loading brand kits:', error)
            scheduleBackgroundRecovery()
        } finally {
            loadInFlightRef.current = false
            if (!isSilent) setLoading(false)
        }
    }, [user?.id, activeBrandKit, userRecord?.current_brand_id, clearBackgroundRetry, scheduleBackgroundRecovery])

    const setActiveBrandKit = useCallback(async (
        id: string,
        shouldPersist = true,
        allowFallback = true
    ): Promise<boolean> => {
        console.log(`[CONTEXT] Setting active brand kit: ${id} (persist: ${shouldPersist}, fallback: ${allowFallback})`)
        try {
            const result = await getUserBrandKitById(id)
            if (result.success && result.data) {
                setActiveBrandKitState(result.data)

                if (shouldPersist && user?.id) {
                    const canPersist = userRecord ? true : await ensureConvexUser()
                    if (canPersist) {
                        updateLastBrand({ clerk_id: user.id, brandId: id })
                            .catch((err) => console.error('[CONTEXT] Failed to persist last brand:', err))
                    }
                }

                return true
            }

            if (!allowFallback) return false

            if (brandKits.length > 0) {
                const fallbackId = brandKits[0].id
                if (fallbackId && fallbackId !== id) {
                    const fallback = await getUserBrandKitById(fallbackId)
                    if (fallback.success && fallback.data) {
                        setActiveBrandKitState(fallback.data)
                        if (user?.id) {
                            const canPersist = userRecord ? true : await ensureConvexUser()
                            if (canPersist) {
                                updateLastBrand({ clerk_id: user.id, brandId: fallbackId })
                                    .catch((err) => console.error('[CONTEXT] Failed to persist fallback brand:', err))
                            }
                        }
                    }
                }
            }

            return false
        } catch (error) {
            console.error('Error loading brand kit:', error)
            return false
        }
    }, [brandKits, ensureConvexUser, updateLastBrand, user?.id, userRecord])

    useEffect(() => {
        loadBrandKitsRef.current = loadBrandKits
    }, [loadBrandKits])

    useEffect(() => {
        setActiveBrandKitRef.current = setActiveBrandKit
    }, [setActiveBrandKit])

    const reloadBrandKits = useCallback(async (isSilent = true) => {
        clearBackgroundRetry()
        emptyRecoveryAttemptRef.current = 0
        await loadBrandKits(isSilent)
    }, [clearBackgroundRetry, loadBrandKits])

    const deleteBrandKitById = async (id: string) => {
        try {
            const result = await deleteBrandKit(id)
            if (result.success) {
                await loadBrandKits()

                if (activeBrandKit?.id === id) {
                    setActiveBrandKitState(null)
                }
            }
        } catch (error) {
            console.error('Error deleting brand kit:', error)
        }
    }

    const updateActiveBrandKit = async (data: Partial<BrandDNA>) => {
        if (!activeBrandKit || !activeBrandKit.id) return false

        const updated = { ...activeBrandKit, ...data }

        try {
            const result = await updateUserBrandKit(activeBrandKit.id, updated)
            if (result.success) {
                setActiveBrandKitState(updated)
                await loadBrandKits(true)
                return true
            }
            return false
        } catch (error) {
            console.error('Error updating active brand kit:', error)
            return false
        }
    }

    const syncActiveBrandKit = (data: BrandDNA) => {
        setActiveBrandKitState(data)
    }

    useEffect(() => {
        const nextUserId = user?.id ?? null
        if (initializedUserIdRef.current === nextUserId) return

        initializedUserIdRef.current = nextUserId
        initialLoadAttempted.current = false
        activeSelectionHealing.current = false
        clearBackgroundRetry()
        loadInFlightRef.current = false
        emptyRecoveryAttemptRef.current = 0
        setActiveBrandKitState(null)
        setBrandKits([])
        setLoading(Boolean(nextUserId))
    }, [clearBackgroundRetry, user?.id])

    useEffect(() => {
        if (isLoaded && user && !initialLoadAttempted.current) {
            initialLoadAttempted.current = true
            void loadBrandKits()
        }
        if (isLoaded && !user) {
            setLoading(false)
        }
    }, [isLoaded, loadBrandKits, user])

    useEffect(() => {
        if (loading) return
        if (!user?.id) return
        if (!Array.isArray(brandKits) || brandKits.length === 0) return
        if (activeSelectionHealing.current) return

        const activeId = activeBrandKit?.id
        const hasValidActive = Boolean(activeId && brandKits.some((kit) => kit.id === activeId))
        if (hasValidActive) return

        const lastBrandId = userRecord?.current_brand_id
        const preferredId = (lastBrandId && brandKits.some((kit) => kit.id === lastBrandId))
            ? (lastBrandId as string)
            : brandKits[0].id

        if (!preferredId) return

        activeSelectionHealing.current = true
        void setActiveBrandKit(preferredId, true, true).finally(() => {
            activeSelectionHealing.current = false
        })
    }, [loading, user?.id, brandKits, activeBrandKit?.id, setActiveBrandKit, userRecord?.current_brand_id])

    useEffect(() => {
        if (!user?.id) return

        const shouldHeal = () => {
            if (document.visibilityState !== 'visible') return
            if (loadInFlightRef.current) return
            if (loading) return
            if (brandKits.length > 0) return
            void loadBrandKits(true)
        }

        const handleVisibilityChange = () => shouldHeal()
        const handleFocus = () => shouldHeal()

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('focus', handleFocus)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('focus', handleFocus)
        }
    }, [brandKits.length, loadBrandKits, loading, user?.id])

    useEffect(() => {
        return () => {
            clearBackgroundRetry()
        }
    }, [clearBackgroundRetry])

    const value: BrandKitContextType = {
        activeBrandKit,
        brandKits,
        loading,
        setActiveBrandKit,
        reloadBrandKits,
        deleteBrandKitById,
        updateActiveBrandKit,
        syncActiveBrandKit,
    }

    return (
        <BrandKitContext.Provider value={value}>
            {children}
        </BrandKitContext.Provider>
    )
}

export function useBrandKit() {
    const context = useContext(BrandKitContext)
    if (context === undefined) {
        throw new Error('useBrandKit must be used within a BrandKitProvider')
    }
    return context
}
