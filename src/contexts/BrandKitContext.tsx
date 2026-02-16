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
    // Estado
    activeBrandKit: BrandDNA | null
    brandKits: BrandKitSummary[]
    loading: boolean

    // Acciones
    setActiveBrandKit: (id: string, shouldPersist?: boolean, allowFallback?: boolean) => Promise<boolean>
    reloadBrandKits: (isSilent?: boolean) => Promise<void>
    deleteBrandKitById: (id: string) => Promise<void>
    updateActiveBrandKit: (data: Partial<BrandDNA>) => Promise<boolean>
    syncActiveBrandKit: (data: BrandDNA) => void
}

const BrandKitContext = createContext<BrandKitContextType | undefined>(undefined)

export function BrandKitProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [activeBrandKit, setActiveBrandKitState] = useState<BrandDNA | null>(null)
    const [brandKits, setBrandKits] = useState<BrandKitSummary[]>([])
    const [loading, setLoading] = useState(true)

    // Convex hooks
    const userRecord = useQuery(api.users.getUser, user?.id ? { clerk_id: user.id } : 'skip')
    const updateLastBrand = useMutation(api.users.setCurrentBrand)
    const upsertUser = useMutation(api.users.upsertUser)

    // Track if we have already attempted initial load
    const initialLoadAttempted = useRef(false)

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

    // Cargar todos los kits de marca del usuario
    const loadBrandKits = async (isSilent = false) => {
        if (!user?.id) return

        if (!isSilent) setLoading(true)
        try {
            const result = await getAllUserBrandKits(user.id)
            if (result.success && result.data) {
                setBrandKits(result.data)

                // Preference:
                // 1. Current Active (if already set)
                // 2. Persisted Last Brand (from userRecord)
                // 3. First from list
                if (result.data.length > 0 && !activeBrandKit) {
                    const lastBrandId = userRecord?.current_brand_id
                    const hasPersistedBrand = Boolean(lastBrandId && result.data.find(b => b.id === lastBrandId))
                    const brandToSelect = hasPersistedBrand
                        ? (lastBrandId as string)
                        : result.data[0].id

                    // Si el persisted id ya no existe, curamos el estado guardando uno valido
                    await setActiveBrandKit(brandToSelect, !hasPersistedBrand)
                }
            }
        } catch (error) {
            console.error('Error loading brand kits:', error)
        } finally {
            if (!isSilent) setLoading(false)
        }
    }

    // Cambiar el kit de marca activo
    const setActiveBrandKit = async (
        id: string,
        shouldPersist = true,
        allowFallback = true
    ): Promise<boolean> => {
        console.log(`[CONTEXT] Setting active brand kit: ${id} (persist: ${shouldPersist}, fallback: ${allowFallback})`)
        try {
            const result = await getUserBrandKitById(id)
            if (result.success && result.data) {
                console.log('[CONTEXT] Brand kit loaded successfully:', result.data.brand_name)
                setActiveBrandKitState(result.data)

                // Persist choice in Convex if requested and user exists
                if (shouldPersist && user?.id) {
                    const canPersist = userRecord ? true : await ensureConvexUser()
                    if (canPersist) {
                        updateLastBrand({ clerk_id: user.id, brandId: id })
                            .catch(err => console.error('[CONTEXT] Failed to persist last brand:', err))
                    }
                }

                return true
            }

            console.error('[CONTEXT] Failed to load brand kit:', id, result.error)
            if (!allowFallback) return false

            // Fallback defensivo: si el id es legacy/huerfano, intenta con el primero valido
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
                                    .catch(err => console.error('[CONTEXT] Failed to persist fallback brand:', err))
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

    // Recargar la lista de kits de marca
    const reloadBrandKits = async (isSilent = true) => {
        await loadBrandKits(isSilent)
    }

    // Eliminar un kit de marca
    const deleteBrandKitById = async (id: string) => {
        try {
            const result = await deleteBrandKit(id)
            if (result.success) {
                // Recargar la lista
                await loadBrandKits()

                // Si el kit eliminado era el activo, limpiar
                if (activeBrandKit?.id === id) {
                    setActiveBrandKitState(null)
                }
            }
        } catch (error) {
            console.error('Error deleting brand kit:', error)
        }
    }

    // Actualizar el kit de marca activo (y persistir)
    const updateActiveBrandKit = async (data: Partial<BrandDNA>) => {
        if (!activeBrandKit || !activeBrandKit.id) return false

        const updated = { ...activeBrandKit, ...data }

        try {
            const result = await updateUserBrandKit(activeBrandKit.id, updated)
            if (result.success) {
                setActiveBrandKitState(updated)
                // Opcional: recargar lista para ver nombres actualizados en el dropdown
                await loadBrandKits(true)
                return true
            }
            return false
        } catch (error) {
            console.error('Error updating active brand kit:', error)
            return false
        }
    }

    // Sincronizar estado localmente sin persistir (util tras un guardado externo)
    const syncActiveBrandKit = (data: BrandDNA) => {
        setActiveBrandKitState(data)
    }

    // Cargar kits cuando usuario y datos de Convex esten disponibles
    useEffect(() => {
        if (isLoaded && user && userRecord !== undefined && !initialLoadAttempted.current) {
            initialLoadAttempted.current = true
            loadBrandKits()
        }
    }, [isLoaded, user, userRecord])

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

// Hook para usar el contexto
export function useBrandKit() {
    const context = useContext(BrandKitContext)
    if (context === undefined) {
        throw new Error('useBrandKit must be used within a BrandKitProvider')
    }
    return context
}
