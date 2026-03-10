'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { I18nProvider } from '@/components/providers/I18nProvider'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { getLastVisitedModuleAction } from '@/app/actions/get-last-visited-module'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const {
    brandKits,
    activeBrandKit,
    loading: brandKitsLoading,
    reloadBrandKits,
    setActiveBrandKit,
  } = useBrandKit()
  const hasRetriedBrandKitLoadRef = useRef(false)
  const hasCompletedRedirectRef = useRef(false)
  const hasResolvedLastSessionRef = useRef(false)
  const [lastVisitedModule, setLastVisitedModule] = useState<{
    module: 'image' | 'carousel'
    session_id: string
    brand_id?: string | null
    updated_at: string
  } | null | undefined>(undefined)

  useEffect(() => {
    hasResolvedLastSessionRef.current = false
    setLastVisitedModule(undefined)

    if (!isLoaded || !user?.id) return

    let cancelled = false
    void (async () => {
      const result = await getLastVisitedModuleAction(user.id)
      if (cancelled) return
      hasResolvedLastSessionRef.current = true
      setLastVisitedModule(result.success ? (result.data ?? null) : null)
    })()

    return () => {
      cancelled = true
    }
  }, [isLoaded, user?.id])

  useEffect(() => {
    if (!isLoaded) return

    if (!user?.id) {
      router.replace('/sign-in')
      return
    }

    if (hasCompletedRedirectRef.current) return

    const redirectToLastModule = async () => {
      if (!lastVisitedModule?.module) return false

      const targetPath = lastVisitedModule.module === 'carousel' ? '/carousel' : '/image'
      const targetBrandId = typeof lastVisitedModule.brand_id === 'string' ? lastVisitedModule.brand_id : null

      if (targetBrandId && activeBrandKit?.id !== targetBrandId) {
        const selectionResult = await Promise.race([
          setActiveBrandKit(targetBrandId, true, true),
          new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(false), 1500)
          }),
        ])

        if (!selectionResult) {
          void setActiveBrandKit(targetBrandId, true, true)
        }
      }

      hasCompletedRedirectRef.current = true
      router.replace(targetPath)
      return true
    }

    if (lastVisitedModule) {
      void redirectToLastModule()
      return
    }

    if (brandKitsLoading) return

    if (lastVisitedModule === undefined || !hasResolvedLastSessionRef.current) return

    if (!Array.isArray(brandKits) || brandKits.length === 0) {
      // Reintento defensivo para evitar falsos "sin kits" por carrera de carga.
      if (!hasRetriedBrandKitLoadRef.current) {
        hasRetriedBrandKitLoadRef.current = true
        void reloadBrandKits(true)
        return
      }

      hasCompletedRedirectRef.current = true
      router.replace('/brand-kit')
      return
    }

    if (!activeBrandKit?.id && brandKits[0]?.id) {
      void setActiveBrandKit(brandKits[0].id, true, true).finally(() => {
        hasCompletedRedirectRef.current = true
        router.replace('/brand-kit')
      })
      return
    }

    hasCompletedRedirectRef.current = true
    router.replace('/brand-kit')
  }, [
    isLoaded,
    user?.id,
    brandKitsLoading,
    brandKits,
    activeBrandKit?.id,
    lastVisitedModule,
    reloadBrandKits,
    router,
    setActiveBrandKit,
  ])

  return (
    <I18nProvider>
      <div className="relative min-h-screen bg-mesh text-foreground overflow-hidden">
        <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-72 w-[42rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-secondary/15 blur-[120px]" />

        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
          <div className="glass-card w-full max-w-xl border-white/20 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Preparando tu Kit de Marca</h1>
            <p className="mt-3 text-muted-foreground">
              Te estamos llevando al flujo correcto según tu última sesión.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Redirigiendo...</span>
            </div>
          </div>
        </main>
      </div>
    </I18nProvider>
  )
}
