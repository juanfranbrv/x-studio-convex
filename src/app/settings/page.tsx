'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { applyThemeColors, DEFAULT_THEME_COLORS, readThemeColors, writeThemeColors } from '@/lib/theme-colors';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function SettingsPage() {
    const { brandKits, activeBrandKit, setActiveBrandKit } = useBrandKit();
    const { assistanceEnabled, setAssistanceEnabled, panelPosition, setPanelPosition } = useUI();
    const { signOut } = useClerk();
    const { user } = useUser();
    const { resolvedTheme, setTheme } = useTheme();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const themeDefaults = useQuery(api.settings.getThemeSettings);

    const userId = useMemo(() => user?.id ?? null, [user?.id]);

    const hslToHex = (raw: string): string | null => {
        if (!raw) return null;
        const trimmed = raw.replace(/^hsl\(/, '').replace(/\)$/, '').trim();
        if (/^#?[0-9A-Fa-f]{6}$/.test(trimmed)) {
            return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
        }
        const parts = trimmed.split(/\s+/g);
        if (parts.length < 3) return null;
        const h = Number(parts[0]);
        const s = Number(parts[1].replace('%', '')) / 100;
        const l = Number(parts[2].replace('%', '')) / 100;
        if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) return null;

        const hueToRgb = (p: number, q: number, t: number) => {
            let tt = t;
            if (tt < 0) tt += 1;
            if (tt > 1) tt -= 1;
            if (tt < 1 / 6) return p + (q - p) * 6 * tt;
            if (tt < 1 / 2) return q;
            if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const r = Math.round(hueToRgb(p, q, h / 360 + 1 / 3) * 255);
        const g = Math.round(hueToRgb(p, q, h / 360) * 255);
        const b = Math.round(hueToRgb(p, q, h / 360 - 1 / 3) * 255);

        const toHex = (val: number) => val.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const resolveHex = (value: string | undefined): string => {
        if (!value) return '#6366f1';
        return hslToHex(value) || (value.startsWith('#') ? value : `#${value}`);
    };

    const [primaryColor, setPrimaryColor] = useState('#6366f1');
    const [secondaryColor, setSecondaryColor] = useState('#ec4899');

    useEffect(() => {
        const stored = readThemeColors(userId);
        if (stored?.primary && stored?.secondary) {
            setPrimaryColor(resolveHex(stored.primary));
            setSecondaryColor(resolveHex(stored.secondary));
            return;
        }

        if (themeDefaults?.primary && themeDefaults?.secondary) {
            setPrimaryColor(resolveHex(themeDefaults.primary));
            setSecondaryColor(resolveHex(themeDefaults.secondary));
            return;
        }

        setPrimaryColor(resolveHex(DEFAULT_THEME_COLORS.primary));
        setSecondaryColor(resolveHex(DEFAULT_THEME_COLORS.secondary));
    }, [themeDefaults?.primary, themeDefaults?.secondary, userId]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({ redirectUrl: '/' });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setIsLoggingOut(false);
        }
    };

    const saveThemeColors = (nextPrimary: string, nextSecondary: string) => {
        const payload = { primary: nextPrimary, secondary: nextSecondary };
        writeThemeColors(userId, payload);
        applyThemeColors(payload);
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

                    {/* Theme Colors */}
                    <Card className="glass-panel border-0 shadow-aero">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Palette className="w-5 h-5 text-primary" />
                                Colores de interfaz
                            </CardTitle>
                            <CardDescription>
                                Personaliza los colores del sistema solo para tu sesiÃ³n
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Separator />
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm text-muted-foreground">Presets rÃ¡pidos</Label>
                                <div className="flex gap-3">
                                    {[
                                        { primary: '#22c55e', secondary: '#38bdf8', title: 'Green & Blue' },
                                        { primary: '#a855f7', secondary: '#fb923c', title: 'Purple & Orange' },
                                        { primary: '#6366f1', secondary: '#ec4899', title: 'Indigo & Pink' },
                                        { primary: '#ef4444', secondary: '#f97316', title: 'Red & Amber' },
                                        { primary: '#0ea5e9', secondary: '#14b8a6', title: 'Ocean Breeze' },
                                    ].map((preset) => (
                                        <button
                                            key={preset.title}
                                            onClick={() => {
                                                setPrimaryColor(preset.primary);
                                                setSecondaryColor(preset.secondary);
                                                saveThemeColors(preset.primary, preset.secondary);
                                            }}
                                            className="group relative h-10 w-10 rounded-full hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2"
                                            style={{
                                                background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                                            }}
                                            title={preset.title}
                                        >
                                            <span className="sr-only">{preset.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 max-w-md">
                                <div className="flex flex-col gap-2">
                                    <Label>Color primario</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg overflow-hidden border shadow-sm relative ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => {
                                                    const hex = e.target.value;
                                                    setPrimaryColor(hex);
                                                    saveThemeColors(hex, secondaryColor);
                                                }}
                                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer border-none"
                                            />
                                        </div>
                                        <span className="text-sm font-mono text-muted-foreground uppercase">{primaryColor}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Color secundario</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg overflow-hidden border shadow-sm relative ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                            <input
                                                type="color"
                                                value={secondaryColor}
                                                onChange={(e) => {
                                                    const hex = e.target.value;
                                                    setSecondaryColor(hex);
                                                    saveThemeColors(primaryColor, hex);
                                                }}
                                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer border-none"
                                            />
                                        </div>
                                        <span className="text-sm font-mono text-muted-foreground uppercase">{secondaryColor}</span>
                                    </div>
                                </div>
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
