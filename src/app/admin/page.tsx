'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import type { Id } from '@/../convex/_generated/dataModel'
import { Loader2, Users, Coins, RefreshCw, Plus, Minus, Check, X, Settings, Activity, ArrowLeft, Mail, ExternalLink, Trash2, MessageSquare, Shapes } from 'lucide-react'
import { CreditsBadge } from '@/components/layout/CreditsBadge'
import { getCompositionsSummaryAction, type CompositionSummary } from '@/lib/admin-compositions-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'


import { CompositionsSummaryTable } from '@/components/admin/CompositionsSummaryTable'

export default function AdminPage() {
    const { user, isLoaded } = useUser()
    const { resolvedTheme } = useTheme()
    const { toast } = useToast()
    const userEmail = user?.emailAddresses[0]?.emailAddress || ''

    // Queries
    const stats = useQuery(api.admin.getDashboardStats, { admin_email: userEmail })
    const users = useQuery(api.admin.listUsers, { admin_email: userEmail })
    const settings = useQuery(api.admin.getSettings, { admin_email: userEmail })
    const recentTransactions = useQuery(api.admin.getRecentTransactions, { admin_email: userEmail, limit: 20 })
    const betaRequests = useQuery(api.admin.listBetaRequests, { admin_email: userEmail })

    // Feedback queries
    const feedbackList = useQuery(api.feedback.listFeedback, { limit: 50 })
    const feedbackStats = useQuery(api.feedback.getFeedbackStats, {})

    // Mutations
    const activateUser = useMutation(api.admin.activateUser)
    const suspendUser = useMutation(api.admin.suspendUser)
    const deleteUser = useMutation(api.admin.deleteUser)
    const adjustCredits = useMutation(api.admin.adjustCredits)
    const updateSetting = useMutation(api.settings.saveAppSetting) // Use the new generic settings mutation
    const initializeSettings = useMutation(api.admin.initializeSettings)
    const approveBetaRequest = useMutation(api.admin.approveBetaRequest)
    const rejectBetaRequest = useMutation(api.admin.rejectBetaRequest)
    const deleteBetaRequest = useMutation(api.admin.deleteBetaRequest)

    // Local state
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(null)
    const [creditAmount, setCreditAmount] = useState('50')
    const [creditReason, setCreditReason] = useState('')

    // Compositions Summary
    const [compositionsSummary, setCompositionsSummary] = useState<CompositionSummary[]>([])
    const [loadingCompositions, setLoadingCompositions] = useState(true)

    useEffect(() => {
        async function fetchCompositions() {
            try {
                const data = await getCompositionsSummaryAction()
                setCompositionsSummary(data)
            } catch (error) {
                console.error('Error fetching compositions summary:', error)
            } finally {
                setLoadingCompositions(false)
            }
        }
        fetchCompositions()
    }, [])

    const [isProcessing, setIsProcessing] = useState(false)

    // Settings state
    const [editingSettings, setEditingSettings] = useState<Record<string, number | string>>({})

    // Initialize settings on first load
    useEffect(() => {
        if (settings && settings.length === 0 && userEmail) {
            initializeSettings({ admin_email: userEmail })
        }
    }, [settings, userEmail])

    // Update local settings state when server data changes
    useEffect(() => {
        if (settings) {
            const settingsMap: Record<string, number | string> = {}
            settings.forEach(s => {
                settingsMap[s.key] = s.value
            })
            setEditingSettings(settingsMap)
        }
    }, [settings])

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    // Check if current user is admin (we rely on backend validation, but show UI accordingly)
    const ADMIN_EMAILS = ['juanfranbrv@gmail.com']
    if (!ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <X className="w-16 h-16 text-destructive" />
                <h1 className="text-2xl font-bold">Acceso Denegado</h1>
                <p className="text-muted-foreground">No tienes permisos de administrador.</p>
            </div>
        )
    }

    const handleActivate = async (userId: Id<"users">) => {
        setIsProcessing(true)
        try {
            await activateUser({ admin_email: userEmail, user_id: userId })
            toast({ title: 'Usuario activado', description: 'Se le asignaron los crÃ©ditos iniciales.' })
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' })
        }
        setIsProcessing(false)
    }

    const handleSuspend = async (userId: Id<"users">) => {
        setIsProcessing(true)
        try {
            await suspendUser({ admin_email: userEmail, user_id: userId })
            toast({ title: 'Usuario suspendido' })
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' })
        }
        setIsProcessing(false)
    }

    const handleDeleteUser = async (userId: Id<"users">, email: string) => {
        if (!confirm(`Â¿EstÃ¡s seguro de que quieres ELIMINAR PERMANENTEMENTE al usuario ${email}?\n\nEsta acciÃ³n no se puede deshacer.`)) {
            return
        }
        setIsProcessing(true)
        try {
            await deleteUser({ admin_email: userEmail, user_id: userId })
            toast({ title: 'ðŸ—‘ï¸ Usuario eliminado', description: `${email} ha sido eliminado permanentemente` })
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' })
        }
        setIsProcessing(false)
    }

    const handleAdjustCredits = async () => {
        if (!selectedUserId || !creditAmount) return
        setIsProcessing(true)
        try {
            await adjustCredits({
                admin_email: userEmail,
                user_id: selectedUserId,
                amount: parseInt(creditAmount),
                reason: creditReason || undefined
            })
            toast({ title: 'CrÃ©ditos ajustados' })
            setAdjustDialogOpen(false)
            setCreditAmount('')
            setCreditReason('')
            setSelectedUserId(null)
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' })
        }
        setIsProcessing(false)
    }

    const handleSaveSetting = async (key: string, value: number | string) => {
        try {
            await updateSetting({ key, value })
            toast({ title: 'ConfiguraciÃ³n guardada' })
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' })
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-500">Activo</Badge>
            case 'waitlist':
                return <Badge variant="secondary">Waitlist</Badge>
            case 'suspended':
                return <Badge variant="destructive">Suspendido</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/image">
                            <Button variant="ghost" size="icon" title="Volver a Imagen">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Panel de AdministraciÃ³n</h1>
                            <p className="text-muted-foreground">GestiÃ³n de usuarios y crÃ©ditos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/compositions">
                            <Button variant="outline" className="gap-2">
                                <Shapes className="h-4 w-4" />
                                Gestor de composiciones
                            </Button>
                        </Link>
                        <CreditsBadge />
                        <UserButton
                            appearance={{
                                baseTheme: resolvedTheme === 'dark' ? dark : undefined
                            }}
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers ?? '-'}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Activos</CardTitle>
                            <Check className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats?.activeUsers ?? '-'}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
                            <RefreshCw className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">{stats?.waitlistUsers ?? '-'}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">CrÃ©ditos Totales</CardTitle>
                            <Coins className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalCreditsInCirculation ?? '-'}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="requests" className="space-y-4">
                    <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap">
                        <TabsTrigger value="requests" className="gap-2">
                            <Mail className="h-4 w-4" /> Solicitudes
                            {(stats?.pendingBetaRequests ?? 0) > 0 && (
                                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    {stats?.pendingBetaRequests}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="users" className="gap-2">
                            <Users className="h-4 w-4" /> Usuarios
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="gap-2">
                            <Activity className="h-4 w-4" /> Transacciones
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings className="h-4 w-4" /> ConfiguraciÃ³n
                        </TabsTrigger>
                        <TabsTrigger value="links" className="gap-2">
                            <ExternalLink className="h-4 w-4" /> Enlaces
                        </TabsTrigger>
                        <TabsTrigger value="feedback" className="gap-2">
                            <MessageSquare className="h-4 w-4" /> Feedback
                            {(feedbackStats?.total ?? 0) > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                    {feedbackStats?.total}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="compositions" className="gap-2">
                            <Shapes className="h-4 w-4" /> Composiciones
                        </TabsTrigger>
                    </TabsList>

                    {/* Beta Requests Tab */}
                    <TabsContent value="requests">
                        <Card>
                            <CardHeader>
                                <CardTitle>Solicitudes de Acceso Beta</CardTitle>
                                <CardDescription>Usuarios que quieren acceso a la beta privada</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {betaRequests?.filter(r => r.status === 'pending').map((request) => (
                                            <TableRow key={request._id}>
                                                <TableCell className="font-medium">{request.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">Pendiente</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(request.created_at).toLocaleDateString('es-ES')}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={async () => {
                                                            try {
                                                                await approveBetaRequest({
                                                                    admin_email: userEmail,
                                                                    request_id: request._id
                                                                })
                                                                toast({ title: 'âœ… Acceso aprobado', description: `${request.email} ahora puede acceder` })
                                                            } catch (e: any) {
                                                                toast({ title: 'Error', description: e.message, variant: 'destructive' })
                                                            }
                                                        }}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Aprobar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={async () => {
                                                            try {
                                                                await rejectBetaRequest({
                                                                    admin_email: userEmail,
                                                                    request_id: request._id
                                                                })
                                                                toast({ title: 'Rechazado', description: `${request.email} ha sido rechazado` })
                                                            } catch (e: any) {
                                                                toast({ title: 'Error', description: e.message, variant: 'destructive' })
                                                            }
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!betaRequests || betaRequests.filter(r => r.status === 'pending').length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    No hay solicitudes pendientes
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Processed requests section */}
                                {betaRequests && betaRequests.filter(r => r.status !== 'pending').length > 0 && (
                                    <div className="mt-8">
                                        <h4 className="font-medium mb-4 text-muted-foreground">Historial de Solicitudes</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Estado</TableHead>
                                                    <TableHead>Procesado</TableHead>
                                                    <TableHead className="text-right">Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {betaRequests.filter(r => r.status !== 'pending').map((request) => (
                                                    <TableRow key={request._id}>
                                                        <TableCell>{request.email}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                                                                {request.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {request.processed_at ? new Date(request.processed_at).toLocaleDateString('es-ES') : '-'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={async () => {
                                                                    try {
                                                                        await deleteBetaRequest({
                                                                            admin_email: userEmail,
                                                                            request_id: request._id
                                                                        })
                                                                    } catch (e: any) {
                                                                        toast({ title: 'Error', description: e.message, variant: 'destructive' })
                                                                    }
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>GestiÃ³n de Usuarios</CardTitle>
                                <CardDescription>Activa, suspende y ajusta crÃ©ditos de usuarios</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>CrÃ©ditos</TableHead>
                                            <TableHead>Registro</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users?.map((u) => (
                                            <TableRow key={u._id}>
                                                <TableCell className="font-medium">{u.email}</TableCell>
                                                <TableCell>{getStatusBadge(u.status)}</TableCell>
                                                <TableCell>
                                                    <span className="font-mono">{u.credits}</span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    {u.status === 'waitlist' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleActivate(u._id)}
                                                            disabled={isProcessing}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" /> Activar
                                                        </Button>
                                                    )}
                                                    {u.status === 'active' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleSuspend(u._id)}
                                                            disabled={isProcessing}
                                                        >
                                                            <X className="h-4 w-4 mr-1" /> Suspender
                                                        </Button>
                                                    )}
                                                    {u.status === 'suspended' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleActivate(u._id)}
                                                            disabled={isProcessing}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" /> Reactivar
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedUserId(u._id)
                                                            setAdjustDialogOpen(true)
                                                        }}
                                                    >
                                                        <Coins className="h-4 w-4 mr-1" /> CrÃ©ditos
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteUser(u._id, u.email)}
                                                        disabled={isProcessing || u.email.toLowerCase() === userEmail.toLowerCase()}
                                                        title="Eliminar usuario permanentemente"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!users || users.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                    No hay usuarios registrados
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historial de Transacciones</CardTitle>
                                <CardDescription>Ãšltimas 20 transacciones de crÃ©ditos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Cantidad</TableHead>
                                            <TableHead>Balance</TableHead>
                                            <TableHead>Fecha</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTransactions?.map((tx) => (
                                            <TableRow key={tx._id}>
                                                <TableCell className="font-medium">{tx.user_email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={tx.amount > 0 ? 'default' : 'secondary'}>
                                                        {tx.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                                </TableCell>
                                                <TableCell className="font-mono">{tx.balance_after}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(tx.created_at).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!recentTransactions || recentTransactions.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                    No hay transacciones
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>ConfiguraciÃ³n del Sistema</CardTitle>
                                <CardDescription>Valores configurables para crÃ©ditos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {settings?.filter(s => s.key !== 'theme_primary' && s.key !== 'theme_secondary' && s.key !== 'model_image_generation' && s.key !== 'model_intelligence').map((setting) => (
                                    <div key={setting.key} className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <Label className="text-base">{setting.key}</Label>
                                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type={typeof setting.value === 'number' ? "number" : "text"}
                                                className="w-24"
                                                value={editingSettings[setting.key] ?? setting.value}
                                                onChange={(e) => setEditingSettings(prev => ({
                                                    ...prev,
                                                    [setting.key]: typeof setting.value === 'number' ? (parseInt(e.target.value) || 0) : e.target.value
                                                }))}
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleSaveSetting(setting.key, editingSettings[setting.key] ?? setting.value)}
                                                disabled={editingSettings[setting.key] === setting.value}
                                            >
                                                Guardar
                                            </Button>
                                        </div>
                                    </div>
                                ))}

{(!settings || settings.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground mb-4">No hay configuraciÃ³n. Inicializar valores por defecto:</p>
                                        <Button onClick={() => initializeSettings({ admin_email: userEmail })}>
                                            Inicializar ConfiguraciÃ³n
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Links Tab */}
                    <TabsContent value="links">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enlaces de GestiÃ³n</CardTitle>
                                <CardDescription>Accesos directos a las plataformas de control de la aplicaciÃ³n</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { name: 'Vercel', url: 'https://vercel.com/juanfranbrvs-projects/x-studio', desc: 'Despliegues, logs y dominios' },
                                        { name: 'Convex', url: 'https://dashboard.convex.dev', desc: 'Base de datos y funciones backend' },
                                        { name: 'Clerk', url: 'https://dashboard.clerk.com', desc: 'AutenticaciÃ³n y usuarios' },
                                        { name: 'Google AI Studio', url: 'https://aistudio.google.com', desc: 'API Keys y modelos Gemini' },
                                        { name: 'GitHub', url: 'https://github.com/juanfranbrv/x-studio', desc: 'Repositorio de cÃ³digo fuente' }
                                    ].map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col p-4 rounded-lg border bg-card hover:bg-accent transition-colors group"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold">{link.name}</span>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{link.desc}</span>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Feedback Tab */}
                    <TabsContent value="feedback">
                        {/* Stats Row */}
                        <div className="grid gap-4 md:grid-cols-4 mb-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{feedbackStats?.total ?? 0}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-green-500">ðŸ˜Š Positivo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-500">{feedbackStats?.positive ?? 0}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-yellow-500">ðŸ˜ Neutral</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-500">{feedbackStats?.neutral ?? 0}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-red-500">ðŸ˜ž Negativo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-500">{feedbackStats?.negative ?? 0}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Feedback Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Feedback Reciente</CardTitle>
                                <CardDescription>Ãšltimas valoraciones de los usuarios</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>ValoraciÃ³n</TableHead>
                                            <TableHead>Intent</TableHead>
                                            <TableHead className="max-w-[300px]">Comentario</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feedbackList?.map((fb) => (
                                            <TableRow key={fb._id}>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(fb.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                </TableCell>
                                                <TableCell className="font-medium text-sm">
                                                    {fb.userEmail}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xl">
                                                        {fb.rating === 'positive' ? 'ðŸ˜Š' : fb.rating === 'neutral' ? 'ðŸ˜' : 'ðŸ˜ž'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {fb.context?.intent ? (
                                                        <Badge variant="outline" className="text-xs">
                                                            {fb.context.intent}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                                                    {fb.comment || <span className="italic">Sin comentario</span>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!feedbackList || feedbackList.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                    No hay feedback todavÃ­a
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Compositions Tab */}
                    <TabsContent value="compositions" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">GestiÃ³n de CatÃ¡logo</h3>
                                <p className="text-sm text-muted-foreground">Explora y edita las estructuras de las publicaciones.</p>
                            </div>
                            <Link href="/admin/compositions">
                                <Button className="gap-2 shadow-sm">
                                    <Shapes className="h-4 w-4" />
                                    Abrir gestor completo
                                </Button>
                            </Link>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                {loadingCompositions ? (
                                    <div className="h-64 flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <CompositionsSummaryTable initialData={compositionsSummary} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Adjust Credits Dialog */}
            <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajustar CrÃ©ditos</DialogTitle>
                        <DialogDescription>
                            Ingresa un nÃºmero positivo para aÃ±adir o negativo para quitar crÃ©ditos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Cantidad</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCreditAmount(prev => String((parseInt(prev) || 0) - 10))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={creditAmount}
                                    onChange={(e) => setCreditAmount(e.target.value)}
                                    placeholder="ej: 50 o -10"
                                    className="text-center"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCreditAmount(prev => String((parseInt(prev) || 0) + 10))}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>RazÃ³n (opcional)</Label>
                            <Input
                                value={creditReason}
                                onChange={(e) => setCreditReason(e.target.value)}
                                placeholder="ej: Bonus por feedback"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAdjustCredits} disabled={!creditAmount || isProcessing}>
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Aplicar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

