'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useBrandKit } from '@/contexts/BrandKitContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Settings,
    User,
    Bell,
    Palette,
    Globe,
    Shield,
    Zap,
    Save,
    Loader2
} from 'lucide-react';

export default function SettingsPage() {
    const { brandKits, activeBrandKit, setActiveBrandKit } = useBrandKit();
    const [isSaving, setIsSaving] = useState(false);

    // Placeholder states for future features
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Implement save logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
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
                    {/* Account Settings */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <User className="w-5 h-5 text-primary" />
                                Cuenta
                            </CardTitle>
                            <CardDescription>
                                Gestiona tu información personal y preferencias de cuenta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Tu nombre"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="bg-background/50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Bell className="w-5 h-5 text-primary" />
                                Notificaciones
                            </CardTitle>
                            <CardDescription>
                                Configura cómo y cuándo quieres recibir notificaciones
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="notifications">Notificaciones push</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Recibe notificaciones sobre actualizaciones importantes
                                    </p>
                                </div>
                                <Switch
                                    id="notifications"
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="auto-save">Guardado automático</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Guarda automáticamente tus cambios cada 10 segundos
                                    </p>
                                </div>
                                <Switch
                                    id="auto-save"
                                    checked={autoSave}
                                    onCheckedChange={setAutoSave}
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
                                Personaliza el tema y la apariencia de la aplicación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Tema</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <Button variant="outline" className="justify-start">
                                        Claro
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        Oscuro
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        Sistema
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language & Region */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Globe className="w-5 h-5 text-primary" />
                                Idioma y región
                            </CardTitle>
                            <CardDescription>
                                Configura tu idioma y zona horaria preferidos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="language">Idioma</Label>
                                <Input
                                    id="language"
                                    value="Español"
                                    disabled
                                    className="bg-background/50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Shield className="w-5 h-5 text-primary" />
                                Privacidad y seguridad
                            </CardTitle>
                            <CardDescription>
                                Gestiona tu privacidad y configuración de seguridad
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Próximamente: Configuración de privacidad y seguridad
                            </p>
                        </CardContent>
                    </Card>

                    {/* Advanced */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Zap className="w-5 h-5 text-primary" />
                                Avanzado
                            </CardTitle>
                            <CardDescription>
                                Configuración avanzada para usuarios expertos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Próximamente: Configuración avanzada
                            </p>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-brand-gradient shadow-aero-glow hover:shadow-aero-lg transition-all"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar cambios
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
}
