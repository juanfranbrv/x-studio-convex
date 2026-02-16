'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { INTENT_OPTIONS } from '@/lib/creation-flow-types'
import { Input } from '@/components/ui/input'

export function CompositionsFilterBar({
    initialQuery,
    initialIntent,
    initialMode
}: {
    initialQuery: string,
    initialIntent: string,
    initialMode: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [q, setQ] = useState(initialQuery)
    const [intent, setIntent] = useState(initialIntent)
    const [mode, setMode] = useState(initialMode)

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateUrl(q, intent, mode)
        }, 400)
        return () => clearTimeout(timer)
    }, [q])

    const updateUrl = (newQ: string, newIntent: string, newMode: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newQ) params.set('q', newQ)
        else params.delete('q')

        if (newIntent && newIntent !== 'all') params.set('intent', newIntent)
        else params.delete('intent')

        if (newMode && newMode !== 'all') params.set('mode', newMode)
        else params.delete('mode')

        // Preserve existing ID if any, unless we want to clear it on search?
        // Usually keep it.

        startTransition(() => {
            router.push(`/admin/compositions?${params.toString()}`)
        })
    }

    const handleIntentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value
        setIntent(val)
        updateUrl(q, val, mode)
    }

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value
        setMode(val)
        updateUrl(q, intent, val)
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por ID, nombre o descripción..."
                    className="pl-9 h-11 bg-background shadow-sm"
                />
                {q && (
                    <button
                        onClick={() => { setQ(''); updateUrl('', intent, mode); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select
                        value={intent}
                        onChange={handleIntentChange}
                        className="h-11 w-full md:w-48 appearance-none rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                    >
                        <option value="all">Todos los objetivos</option>
                        {INTENT_OPTIONS.map((opt: { id: string; label: string }) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select
                        value={mode}
                        onChange={handleModeChange}
                        className="h-11 w-full md:w-36 appearance-none rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                    >
                        <option value="all">Cualquier Modo</option>
                        <option value="basic">Sólo Básico</option>
                        <option value="advanced">Sólo Avanzado</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {isPending && (
                <span className="text-xs text-muted-foreground animate-pulse">Filtrando...</span>
            )}
        </div>
    )
}
