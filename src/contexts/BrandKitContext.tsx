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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function calculateCompletenessFromSummary(brand: any): number {
    let score = 0

    if ((brand.brand_name || '').trim().length > 0) score += 10
    if ((brand.tagline || '').trim().length > 0) score += 10
    if ((brand.business_overview_length || 0) > 20) score += 10
    if ((brand.colors_count || 0) >= 3) score += 15
    if ((brand.logos_count || 0) >= 1 || Boolean(brand.logo_url)) score += 15
    if ((brand.fonts_count || 0) >= 1) score += 10
    if ((brand.images_count || 0) >= 1) score += 10
    if ((brand.brand_values_count || 0) >= 1) score += 5
    if ((brand.tone_of_voice_count || 0) >= 1) score += 5
    if (Boolean(brand.has_text_assets)) score += 10

    return Math.max(0, Math.min(100, Math.round(score)))
}

function normalizeBrandKitSummaries(brands: any[] | undefined | null): BrandKitSummary[] {
    return (brands || [])
        .slice()
        .sort((a: any, b: any) => {
            const dateA = new Date(a.updated_at || 0).getTime()
            const dateB = new Date(b.updated_at || 0).getTime()
            return dateB - dateA
        })
        .map((brand: any) => ({
            id: String(brand._id),
            brand_name: brand.brand_name || '',
            url: brand.url || '',
            logo_url: brand.logo_url || null,
            favicon_url: brand.favicon_url || null,
            screenshot_url: brand.screenshot_url || null,
            completeness: calculateCompletenessFromSummary(brand),
            updated_at: brand.updated_at || new Date().toISOString(),
        }))
}

export function BrandKitProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useUser()
    const [activeBrandKit, setActiveBrandKitState] = useState<BrandDNA | null>(null)
    const [brandKits, setBrandKits] = useState<BrandKitSummary[]>([])
    const [loading, setLoading] = useState(true)

    // Convex hooks
    const userRecord = useQuery(api.users.getUser, user?.id ? { clerk_id: user.id } : 'skip')
    const liveBrandSummaries = useQuery(
        api.brands.listSummariesByClerkId,
        user?.id ? { clerk_user_id: user.id } : 'skip'
    )
    const updateLastBrand = useMutation(api.users.setCurrentBrand)
    const upsertUser = useMutation(api.users.upsertUser)

    const activeSelectionHealing = useRef(false)
    const loadingBrandDetailsRef = useRef<string | null>(null)

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

        if (Array.isArray(liveBrandSummaries)) {
            const nextBrandKits = normalizeBrandKitSummaries(liveBrandSummaries)
            setBrandKits(nextBrandKits)
            if (nextBrandKits.length === 0) {
                setActiveBrandKitState(null)
            }
            if (!isSilent) setLoading(false)
            return
        }

        if (!isSilent) setLoading(true)
        try {
            // Produccion puede devolver un vacio/transitorio justo tras login.
            // Reintentamos de forma acotada antes de concluir "0 kits".
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

                // Si tras todos los intentos sigue sin datos, aceptamos el resultado final.
                if (i === retryDelaysMs.length - 1) {
                    break
                }
            }

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

    useEffect(() => {
        if (!isLoaded) {
            setLoading(true)
            return
        }

        if (!user?.id) {
            setActiveBrandKitState(null)
            setBrandKits([])
            setLoading(false)
            return
        }

        if (liveBrandSummaries === undefined) {
            setLoading(true)
            return
        }

        const nextBrandKits = normalizeBrandKitSummaries(liveBrandSummaries)
        setBrandKits(nextBrandKits)

        if (nextBrandKits.length === 0) {
            loadingBrandDetailsRef.current = null
            setActiveBrandKitState(null)
            setLoading(false)
            return
        }

        const activeId = activeBrandKit?.id
        const hasValidActive = Boolean(activeId && nextBrandKits.some((kit) => kit.id === activeId))
        if (hasValidActive) {
            loadingBrandDetailsRef.current = null
            setLoading(false)
            return
        }

        const lastBrandId = userRecord?.current_brand_id
        const preferredId = (lastBrandId && nextBrandKits.some((kit) => kit.id === lastBrandId))
            ? (lastBrandId as string)
            : nextBrandKits[0].id

        if (!preferredId) {
            setLoading(false)
            return
        }

        if (activeSelectionHealing.current && loadingBrandDetailsRef.current === preferredId) {
            setLoading(true)
            return
        }

        activeSelectionHealing.current = true
        loadingBrandDetailsRef.current = preferredId
        setLoading(true)
        void setActiveBrandKit(preferredId, !Boolean(lastBrandId && lastBrandId === preferredId), true).finally(() => {
            activeSelectionHealing.current = false
            loadingBrandDetailsRef.current = null
            setLoading(false)
        })
    }, [isLoaded, user?.id, liveBrandSummaries, userRecord?.current_brand_id, activeBrandKit?.id])

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
