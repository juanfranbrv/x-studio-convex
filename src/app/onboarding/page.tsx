'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { I18nProvider } from '@/components/providers/I18nProvider'
import { useBrandKit } from '@/contexts/BrandKitContext'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { brandKits, loading: brandKitsLoading, reloadBrandKits } = useBrandKit()
  const hasRetriedBrandKitLoadRef = useRef(false)

  const lastVisitedModule = useQuery(
    api.work_sessions.getLastVisitedModule,
    isLoaded && user?.id ? { user_id: user.id } : 'skip'
  )

  useEffect(() => {
    if (!isLoaded) return

    if (!user?.id) {
      router.replace('/sign-in')
      return
    }

    if (brandKitsLoading) return

    if (!Array.isArray(brandKits) || brandKits.length === 0) {
      // Reintento defensivo para evitar falsos "sin kits" por carrera de carga.
      if (!hasRetriedBrandKitLoadRef.current) {
        hasRetriedBrandKitLoadRef.current = true
        void reloadBrandKits(false)
        return
      }

      router.replace('/brand-kit')
      return
    }

    if (lastVisitedModule === undefined) return

    const targetPath = lastVisitedModule?.module === 'carousel' ? '/carousel' : '/image'
    router.replace(targetPath)
  }, [isLoaded, user?.id, brandKitsLoading, brandKits, lastVisitedModule, reloadBrandKits, router])

  return (
    <I18nProvider>
      <div className="relative min-h-screen bg-mesh text-foreground overflow-hidden">
        <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-72 w-[42rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-secondary/15 blur-[120px]" />

        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
          <div className="glass-card w-full max-w-xl border-white/20 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">Preparando tu Kit de Marca</h1>
            <p className="mt-3 text-muted-foreground">
              Te estamos llevando al flujo correcto segun tu ultima sesion.
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
