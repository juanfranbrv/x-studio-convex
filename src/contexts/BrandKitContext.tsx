'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
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

    const ensureConvexUser = async () => {
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
    }

    const loadBrandKits = async (isSilent = false) => {
        if (!user?.id) return

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

            if (result.success && result.data) {
                setBrandKits(result.data)

                if (result.data.length > 0 && !activeBrandKit) {
                    const lastBrandId = userRecord?.current_brand_id
                    const hasPersistedBrand = Boolean(lastBrandId && result.data.find((b) => b.id === lastBrandId))
                    const brandToSelect = hasPersistedBrand
                        ? (lastBrandId as string)
                        : result.data[0].id

                    const selected = await setActiveBrandKit(brandToSelect, !hasPersistedBrand)
                    if (!selected && result.data[0]?.id && result.data[0].id !== brandToSelect) {
                        await setActiveBrandKit(result.data[0].id, true, true)
                    }
                }
            }
        } catch (error) {
            console.error('Error loading brand kits:', error)
        } finally {
            if (!isSilent) setLoading(false)
        }
    }

    const setActiveBrandKit = async (
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
    }

    const reloadBrandKits = async (isSilent = true) => {
        await loadBrandKits(isSilent)
    }

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
        if (isLoaded && user && userRecord !== undefined && !initialLoadAttempted.current) {
            initialLoadAttempted.current = true
            void loadBrandKits()
        }
    }, [isLoaded, user, userRecord])

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
    }, [loading, user?.id, brandKits, activeBrandKit?.id, userRecord?.current_brand_id])

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
