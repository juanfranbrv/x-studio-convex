import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getLegacyCompositions } from '@/lib/legacy-compositions'
import { readBasicLegacyLayouts, readPromotedLegacyLayouts } from '@/lib/legacy-promotions'
import { CompositionsLayout } from '@/components/admin/CompositionsLayout'
import { CompositionsFilterBar } from '@/components/admin/CompositionsFilterBar'
import { Plus, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ADMIN_EMAILS = ['juanfranbrv@gmail.com']

interface CompositionsPageProps {
    searchParams: Promise<{ id?: string; q?: string; intent?: string; mode?: string; nuevo?: string }>
}

export default async function AdminCompositionsPage({ searchParams }: CompositionsPageProps) {
    const user = await currentUser()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || ''
    if (!ADMIN_EMAILS.includes(userEmail)) redirect('/image')

    const params = await searchParams
    const q = (params.q || '').trim().toLowerCase()
    const intentFilter = (params.intent || '').trim().toLowerCase()
    const modeFilter = (params.mode || '').trim().toLowerCase()
    const selectedId = (params.id || '').trim()
    const isNew = params.nuevo === '1'

    const [all, basic, advanced] = await Promise.all([
        getLegacyCompositions(),
        readBasicLegacyLayouts(),
        readPromotedLegacyLayouts(),
    ])

    const basicIds = new Set(basic.map((item) => item.id))
    const advancedIds = new Set(advanced.map((item) => item.id))

    const filtered = all.filter((item) => {
        const haystack = `${item.id} ${item.name} ${item.description} ${item.file}`.toLowerCase()
        if (q && !haystack.includes(q)) return false
        if (intentFilter && intentFilter !== 'all') {
            const intentNeedle = `${intentFilter}`
            const idHit = item.id.toLowerCase().startsWith(`${intentNeedle}-`)
            const textHit = haystack.includes(intentNeedle)
            if (!idHit && !textHit) return false
        }
        if (modeFilter && modeFilter !== 'all') {
            if (modeFilter === 'basic' && !basicIds.has(item.id)) return false
            if (modeFilter === 'advanced' && !advancedIds.has(item.id)) return false
        }
        return true
    })

    const selected = isNew ? null : (filtered.find((item) => item.id === selectedId) || null)

    return (
        <div className="flex h-screen overflow-hidden bg-background flex-col">
            <header className="p-6 border-b border-border bg-muted/20 space-y-4 shadow-sm z-10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link href="/admin" className="text-xs font-medium text-primary hover:underline">← Volver a Admin</Link>
                        <h1 className="text-2xl font-bold tracking-tight">Gestor de Composiciones</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/compositions/auto">
                            <Button variant="outline" size="sm" className="gap-2">
                                <LayoutGrid className="h-4 w-4" />
                                Auto-Generación
                            </Button>
                        </Link>
                        <Link href="/admin/compositions?nuevo=1">
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Nueva Composición
                            </Button>
                        </Link>
                    </div>
                </div>

                <CompositionsFilterBar
                    initialQuery={q}
                    initialIntent={intentFilter}
                    initialMode={modeFilter}
                />

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <span>Total: <b className="text-foreground">{all.length}</b></span>
                    <span className="opacity-30">|</span>
                    <span>Filtrado: <b className="text-foreground">{filtered.length}</b></span>
                    <span className="opacity-30">|</span>
                    <span>Básico: <b className="text-foreground">{basicIds.size}</b></span>
                    <span className="opacity-30">|</span>
                    <span>Avanzado: <b className="text-foreground">{advancedIds.size}</b></span>
                </div>
            </header>

            <CompositionsLayout
                compositions={filtered}
                selectedComposition={selected}
                selectedId={selectedId}
                isNew={isNew}
                basicIds={basicIds}
                filters={{ q, intent: intentFilter, mode: modeFilter }}
            />
        </div>
    )
}
