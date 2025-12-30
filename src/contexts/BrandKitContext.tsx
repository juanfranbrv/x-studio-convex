'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
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
    setActiveBrandKit: (id: string) => Promise<void>
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

    // Cargar todos los Brand Kits del usuario
    const loadBrandKits = async (isSilent = false) => {
        if (!user?.id) return

        if (!isSilent) setLoading(true)
        try {
            const result = await getAllUserBrandKits(user.id)
            if (result.success && result.data) {
                setBrandKits(result.data)

                // Si hay Brand Kits y no hay uno activo, cargar el primero
                if (result.data.length > 0 && !activeBrandKit) {
                    await setActiveBrandKit(result.data[0].id)
                }
            }
        } catch (error) {
            console.error('Error loading brand kits:', error)
        } finally {
            if (!isSilent) setLoading(false)
        }
    }

    // Cambiar el Brand Kit activo
    const setActiveBrandKit = async (id: string) => {
        console.log('[CONTEXT] Setting active brand kit:', id);
        try {
            const result = await getUserBrandKitById(id)
            if (result.success && result.data) {
                console.log('[CONTEXT] Brand kit loaded successfully:', result.data.brand_name);
                setActiveBrandKitState(result.data)
            } else {
                console.error('[CONTEXT] Failed to load brand kit:', id, result.error);
            }
        } catch (error) {
            console.error('Error loading brand kit:', error)
        }
    }

    // Recargar la lista de Brand Kits
    const reloadBrandKits = async (isSilent = true) => {
        await loadBrandKits(isSilent)
    }

    // Eliminar un Brand Kit
    const deleteBrandKitById = async (id: string) => {
        try {
            const result = await deleteBrandKit(id)
            if (result.success) {
                // Recargar la lista
                await loadBrandKits()

                // Si el Brand Kit eliminado era el activo, limpiar
                if (activeBrandKit?.id === id) {
                    setActiveBrandKitState(null)
                }
            }
        } catch (error) {
            console.error('Error deleting brand kit:', error)
        }
    }

    // Actualizar el Brand Kit activo (y persistir)
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

    // Sincronizar estado localmente sin persistir (útil tras un guardado externo)
    const syncActiveBrandKit = (data: BrandDNA) => {
        setActiveBrandKitState(data)
    }

    // Cargar Brand Kits cuando el usuario esté disponible
    useEffect(() => {
        if (isLoaded && user) {
            loadBrandKits()
        }
    }, [isLoaded, user])

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
