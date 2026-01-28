'use client';

import { useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useBrandKit } from '@/contexts/BrandKitContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Settings,
    Palette,
    Loader2,
    LogOut,
    Layout,
    Moon,
    Sun
} from 'lucide-react';
import { useUI } from '@/contexts/UIContext';

export default function SettingsPage() {
    const { brandKits, activeBrandKit, setActiveBrandKit } = useBrandKit();
    const { assistanceEnabled, setAssistanceEnabled, panelPosition, setPanelPosition } = useUI();
    const { signOut } = useClerk();
    const { user } = useUser();
    const { resolvedTheme, setTheme } = useTheme();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({ redirectUrl: '/' });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
        >
            <main className="p-6 md:p-12 max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-2xl bg-brand-gradient shadow-aero-glow">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
                            <p className="text-muted-foreground">Personaliza tu experiencia en X Studio</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* UI Preferences */}
                    <Card className="glass-panel border-0 shadow-aero border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Layout className="w-5 h-5 text-primary" />
                                Interfaz (X Studio)
                            </CardTitle>
                            <CardDescription>
                                Controla las ayudas que ves mientras creas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Separator />
                            <div className="space-y-2">
                                <div className="space-y-0.5">
                                    <Label>Panel de controles</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Coloca el panel a la derecha o a la izquierda
                                    </p>
                                </div>
                                <div className="flex w-full items-center rounded-full bg-muted/60 p-1">
                                    <Button
                                        variant={panelPosition === 'right' ? 'secondary' : 'ghost'}
                                        className="h-8 flex-1 rounded-full text-xs font-medium"
                                        onClick={() => setPanelPosition('right')}
                                    >
                                        Derecha
                                    </Button>
                                    <Button
                                        variant={panelPosition === 'left' ? 'secondary' : 'ghost'}
                                        className="h-8 flex-1 rounded-full text-xs font-medium"
                                        onClick={() => setPanelPosition('left')}
                                    >
                                        Izquierda
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="guided-assistance">Asistencia Guiada</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Muestra ayudas contextuales paso a paso
                                    </p>
                                </div>
                                <Switch
                                    id="guided-assistance"
                                    checked={assistanceEnabled}
                                    onCheckedChange={setAssistanceEnabled}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Palette className="w-5 h-5 text-primary" />
                                Apariencia
                            </CardTitle>
                            <CardDescription>
                                Elige un tema claro u oscuro
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Tema</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={resolvedTheme === 'light' ? 'secondary' : 'outline'}
                                        className="justify-start gap-2 transition-all"
                                        onClick={() => setTheme('light')}
                                    >
                                        <Sun className="w-4 h-4" />
                                        Claro
                                    </Button>
                                    <Button
                                        variant={resolvedTheme === 'dark' ? 'secondary' : 'outline'}
                                        className="justify-start gap-2 transition-all"
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Moon className="w-4 h-4" />
                                        Oscuro
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Session */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <LogOut className="w-5 h-5 text-primary" />
                                Sesión
                            </CardTitle>
                            <CardDescription>
                                Gestiona tu sesión activa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                {/* User Avatar */}
                                <div className="h-14 w-14 shrink-0 rounded-full border-2 border-primary/20 overflow-hidden shadow-sm bg-muted">
                                    {user?.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt={user.firstName || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg font-bold">
                                            {user?.firstName?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                {/* User Info */}
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">
                                        {user?.fullName || user?.firstName || 'Usuario'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {user?.primaryEmailAddress?.emailAddress || 'Sin email'}
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium text-foreground">Cerrar sesión</p>
                                    <p className="text-sm text-muted-foreground">
                                        Cierra tu sesión en todos los dispositivos
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="gap-2"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Cerrando...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="w-4 h-4" />
                                            Cerrar sesión
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </DashboardLayout>
    );
}
