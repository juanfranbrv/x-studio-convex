import Link from 'next/link'
import { ArrowLeft, Layers3, LayoutGrid, Shapes } from 'lucide-react'
import { ALL_IMAGE_LAYOUTS, INTENT_CATALOG, LAYOUTS_BY_INTENT } from '@/lib/creation-flow-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const countByIntent = INTENT_CATALOG.map((intent) => ({
    id: intent.id,
    name: intent.name,
    count: (LAYOUTS_BY_INTENT[intent.id] || []).length,
}))

export default function AdminComposicionesPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4 space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon" title="Volver a Admin">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Panel de Composiciones</h1>
                            <p className="text-muted-foreground">Vista general del catálogo de composiciones por objetivo.</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        {ALL_IMAGE_LAYOUTS.length} composiciones
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Shapes className="h-4 w-4 text-primary" />
                                Total de objetivos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{INTENT_CATALOG.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Layers3 className="h-4 w-4 text-primary" />
                                Composiciones registradas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ALL_IMAGE_LAYOUTS.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Estado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Módulo de entrada habilitado en Admin.</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Catálogo por objetivo</CardTitle>
                        <CardDescription>
                            Recuento de composiciones disponibles en cada objetivo de contenido.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {countByIntent.map((row) => (
                            <div key={row.id} className="flex items-center justify-between rounded-md border p-3">
                                <div>
                                    <p className="font-medium">{row.name}</p>
                                    <p className="text-xs text-muted-foreground">{row.id}</p>
                                </div>
                                <Badge variant="outline">{row.count}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
