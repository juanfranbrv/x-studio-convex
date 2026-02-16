import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { INTENT_OPTIONS } from '@/lib/creation-flow-types'
import { autoGenerateAction } from '@/lib/admin-compositions-actions'
import { Button } from '@/components/ui/button'

const ADMIN_EMAILS = ['juanfranbrv@gmail.com']

export default async function AutoGenerateCompositionsPage() {
    const user = await currentUser()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || ''
    if (!ADMIN_EMAILS.includes(userEmail)) redirect('/image')

    return (
        <main className="min-h-screen bg-background p-6 text-foreground">
            <div className="mx-auto max-w-4xl space-y-8">
                <header className="space-y-2">
                    <Link href="/admin/compositions" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Gestor de Composiciones
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Generación Automática</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Crea composiciones completas asistidas por IA optimizadas para cada objetivo.
                    </p>
                </header>

                <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="border-b border-border bg-muted/30 px-6 py-4">
                        <h2 className="font-semibold text-lg">Configuración de la Generación</h2>
                        <p className="text-sm text-muted-foreground">Define el objetivo y los parámetros para las nuevas composiciones.</p>
                    </div>

                    <form action={autoGenerateAction} className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 md:col-span-2">
                                <label className="block space-y-2">
                                    <span className="text-sm font-medium">Objetivo de la Composición</span>
                                    <input
                                        name="goal"
                                        required
                                        placeholder="Ej: captar leads para curso de informática para mayores..."
                                        className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                                    />
                                    <p className="text-xs text-muted-foreground">Describe detalladamente qué quieres comunicar con estas composiciones.</p>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Intent (Categoría)</label>
                                <select name="intent" defaultValue="servicio" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                                    {INTENT_OPTIONS.map((option: { id: string; label: string }) => (
                                        <option key={option.id} value={option.id}>{option.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cantidad de variaciones</label>
                                <input
                                    name="count"
                                    type="number"
                                    min={1}
                                    max={12}
                                    defaultValue={3}
                                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Densidad de Texto</label>
                                <select name="textDensity" defaultValue="mid" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                                    <option value="low">Poco texto (Minimalista)</option>
                                    <option value="mid">Equilibrado</option>
                                    <option value="high">Mucho texto (Informativo)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tono Comunicativo</label>
                                <select name="tone" defaultValue="editorial" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                                    <option value="editorial">Editorial (Equilibrado)</option>
                                    <option value="comercial">Comercial (Venta directa)</option>
                                    <option value="institucional">Institucional (Formal)</option>
                                    <option value="didactico">Didáctico (Explicativo)</option>
                                    <option value="dinamico">Dinámico (Moderno/Rápido)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Modo de Publicación</label>
                                <select name="modePreset" defaultValue="auto" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                                    <option value="auto">Automático (Recomendado)</option>
                                    <option value="basic">Sólo Básico</option>
                                    <option value="advanced">Sólo Avanzado</option>
                                    <option value="both">Ambos Modos</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Semilla (Opcional)</label>
                                <input
                                    name="seed"
                                    type="number"
                                    min={1}
                                    placeholder="ID para replicar resultados"
                                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" className="px-8 h-12 text-base shadow-lg shadow-primary/20">
                                Generar Composiciones Automaticamente
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}
