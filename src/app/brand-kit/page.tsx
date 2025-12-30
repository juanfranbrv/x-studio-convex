'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { analyzeBrandDNA } from '@/app/actions/analyze-brand-dna';
import { useBrandKit } from '@/contexts/BrandKitContext';
import type { BrandDNA } from '@/lib/brand-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Globe,
    Sparkles,
    ArrowRight,
    Package,
    Loader2,
    RefreshCcw,
    Plus,
    TriangleAlert,
    Check,
    X,
    Pencil
} from 'lucide-react';
import { BrandDNABoard } from '@/components/brand-dna/BrandDNABoard';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const LOADING_MESSAGES = [
    "Iniciando motores de análisis...",
    "Conectando con Microlink API...",
    "Capturando esencia visual de la web...",
    "Extrayendo paleta técnica (DOM)...",
    "Analizando candidatos a logo...",
    "Descubriendo tipografías en CSS...",
    "Extrayendo ADN de marca con IA...",
    "Generando activos y paletas finales...",
    "Puliendo los últimos detalles..."
];

const TECHNICAL_LOGS = [
    "[INFO] Initializing analyze-engine v2.4...",
    "[NETWORK] Connecting to headfull browser cluster...",
    "[DOM] Analyzing 428 nodes for color frequency...",
    "[IMAGE] Processing full-page screenshot (1920x1080)...",
    "[AI] Running Gemini-1.5-Flash vision analysis...",
    "[STYLE] Extracting computed CSS variables...",
    "[LOGO] Scoring candidates based on prominence...",
    "[CONSENSUS] Running Delta-E clustering algorithm...",
    "[DONE] Brand DNA architecture complete."
];

function BrandKitPageContent() {
    const { user, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        activeBrandKit,
        brandKits,
        loading: contextLoading,
        setActiveBrandKit,
        deleteBrandKitById,
        updateActiveBrandKit,
        reloadBrandKits
    } = useBrandKit();

    const { toast } = useToast();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Multi-profile state
    const [showNewKitForm, setShowNewKitForm] = useState(false);
    const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

    // Brand name editing
    const [isEditingBrandName, setIsEditingBrandName] = useState(false);
    const [brandNameEdit, setBrandNameEdit] = useState('');

    // Efecto para animar progreso y mensajes
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            setProgress(0);
            setLoadingMessageIndex(0);

            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 90) return prev + Math.random() * 5;
                    return prev + 0.1;
                });

                setLoadingMessageIndex(prev => {
                    const next = prev + 1;
                    return next < LOADING_MESSAGES.length ? next : prev;
                });
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Handle initial state and query params
    useEffect(() => {
        if (!contextLoading) {
            const action = searchParams.get('action');
            if (action === 'new') {
                setShowNewKitForm(true);
                // Clear the param without refreshing to avoid re-triggering on reload
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete('action');
                router.replace(`/brand-kit${newParams.toString() ? `?${newParams.toString()}` : ''}`);
            } else if (brandKits.length === 0) {
                setShowNewKitForm(true);
            }
        }
    }, [contextLoading, brandKits, searchParams, router]);

    // Handle case where active brand kit changes
    useEffect(() => {
        if (activeBrandKit && !searchParams.get('action')) {
            setShowNewKitForm(false);
        }
    }, [activeBrandKit]);

    const handleBrandDelete = async (brandId: string) => {
        try {
            await deleteBrandKitById(brandId);
            toast({
                title: "✅ Brand Kit eliminado",
                description: "El Brand Kit se ha eliminado correctamente.",
            });
        } catch (err: any) {
            toast({
                title: "❌ Error al eliminar",
                description: err.message || "No se pudo eliminar el Brand Kit.",
                variant: "destructive",
            });
        }
    };

    const handleBrandNameUpdate = async (newName: string) => {
        if (!activeBrandKit || !newName.trim()) return;

        try {
            const success = await updateActiveBrandKit({ brand_name: newName.trim() });

            if (success) {
                toast({
                    title: "✅ Nombre actualizado",
                    description: "El nombre del Brand Kit se ha actualizado correctamente.",
                });
            } else {
                toast({
                    title: "❌ Error al actualizar",
                    description: "No se pudo actualizar el nombre.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error updating brand name:', error);
            toast({
                title: "❌ Error",
                description: "Ocurrió un error al actualizar el nombre.",
                variant: "destructive",
            });
        }
    };

    // Handler para crear nuevo kit
    const handleNewProfile = () => {
        setUrl('');
        setShowNewKitForm(true);
    };

    const handleRegenerate = async () => {
        setShowRegenerateConfirm(false);
        const targetUrl = url || activeBrandKit?.url;
        if (!targetUrl || !user?.id) {
            console.warn('❌ Cannot regenerate: No URL found', { url, activeBrandKitUrl: activeBrandKit?.url });
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await analyzeBrandDNA(targetUrl, true, user.id);

            if (response.success && response.data) {
                setShowNewKitForm(false);
                // The activeBrandKit context should handle updating the current kit if its ID matches
                // and reloadBrandKits is not needed here to avoid flickering.
                toast({
                    title: "✅ Brand Kit regenerado",
                    description: "El análisis se ha completado correctamente.",
                });
            } else {
                setError(response.error || 'No se pudo regenerar el Brand Kit.');
            }
        } catch (err) {
            console.error('Unexpected error during regenerate:', err);
            setError('Ocurrió un error inesperado al regenerar.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !user?.id) return;

        setLoading(true);
        setError('');

        try {
            const response = await analyzeBrandDNA(url, true, user.id);

            if (response.success && response.data) {
                console.log('[NEW BRAND KIT] Created successfully, reloading...', response.data.id);
                setShowNewKitForm(false);

                // Esperar un momento para que Convex propague los datos
                await new Promise(resolve => setTimeout(resolve, 500));

                // Refrescar la lista global
                await reloadBrandKits();
                console.log('[NEW BRAND KIT] List reloaded, setting active...');

                // Activar el nuevo brand kit
                if (response.data.id) {
                    await setActiveBrandKit(response.data.id);
                    console.log('[NEW BRAND KIT] Active kit set:', response.data.id);
                }

                toast({
                    title: "✅ Brand Kit creado",
                    description: "El análisis se ha completado correctamente.",
                });
            } else {
                setError(response.error || 'No se pudo analizar la marca.');
            }
        } catch (err) {
            console.error('Unexpected error during submit:', err);
            setError('Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    // Pantalla de carga inicial
    if (!isLoaded || contextLoading) {
        return (
            <DashboardLayout
                brands={brandKits}
                currentBrand={activeBrandKit}
                onBrandChange={setActiveBrandKit}
                onBrandDelete={handleBrandDelete}
                onNewBrandKit={handleNewProfile}
            >
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center animate-in fade-in zoom-in duration-500">
                        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mx-auto" />
                        <p className="text-[var(--text-secondary)] mt-4 text-sm font-medium">Cargando tus Brand Kits...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={handleBrandDelete}
            onNewBrandKit={handleNewProfile}
        >
            <main className="p-6 md:p-12 max-w-7xl mx-auto">

                {/* Si no tiene Brand Kits o está creando uno nuevo */}
                {((brandKits.length === 0 || showNewKitForm) && !loading) && (
                    <div className="max-w-2xl mx-auto text-center py-12 animate-in zoom-in-95 duration-500">
                        <div className="bg-card rounded-xl p-8 mb-8 border border-border relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                            <Package className="w-16 h-16 text-primary opacity-50 mx-auto mb-4" />

                            <h2 className="text-2xl font-bold mb-2 text-foreground">
                                {brandKits.length === 0 ? '¡Bienvenido a Brand Kit Extractor!' : 'Crear Nuevo Brand Kit'}
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                {brandKits.length === 0
                                    ? 'Aún no tienes un Brand Kit. Introduce la URL de tu marca para crear uno.'
                                    : 'Introduce la URL de la nueva marca que quieres analizar.'}
                            </p>

                            {/* URL Input */}
                            <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-background rounded-2xl border border-input p-4 shadow-sm w-full transition-all focus-within:ring-2 focus-within:ring-ring focus-within:shadow-lg hover:shadow-md">
                                <Globe className="w-8 h-8 text-muted-foreground" />
                                <Input
                                    placeholder="ejemplo.com"
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-xl h-12 placeholder:text-muted-foreground/50 font-semibold"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    disabled={loading || !url}
                                    className="btn-gradient rounded-xl px-6 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Crear
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Cancel button when creating new (and has existing profiles) */}
                            {brandKits.length > 0 && showNewKitForm && (
                                <Button
                                    variant="ghost"
                                    className="mt-6 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => {
                                        setShowNewKitForm(false);
                                    }}
                                >
                                    Cancelar y volver al kit actual
                                </Button>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
                                <TriangleAlert className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Premium Loading state */}
                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
                        <div className="max-w-xl w-full mx-auto px-6 text-center">
                            <div className="relative mb-12">
                                {/* Large central ambient glow */}
                                <motion.div
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--accent)]/20 rounded-full blur-[80px]"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                />

                                {/* Spinning Ring */}
                                <div className="relative mx-auto w-32 h-32">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        {/* Background track */}
                                        <circle
                                            className="text-white/5 stroke-current"
                                            strokeWidth="4"
                                            fill="transparent"
                                            r="46"
                                            cx="50"
                                            cy="50"
                                        />
                                        {/* Progress bar */}
                                        <motion.circle
                                            className="text-[var(--accent)] stroke-current"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            fill="transparent"
                                            r="46"
                                            cx="50"
                                            cy="50"
                                            initial={{ strokeDasharray: "289", strokeDashoffset: "289" }}
                                            animate={{ strokeDashoffset: 289 - (progress / 100) * 289 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            style={{ filter: "drop-shadow(0 0 8px var(--accent))" }}
                                        />
                                    </svg>

                                    {/* Percentage text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            key={Math.floor(progress / 10)}
                                            initial={{ y: 5, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="text-2xl font-bold tracking-tighter"
                                        >
                                            {Math.round(progress)}%
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Floating particles/nodes */}
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                                        animate={{
                                            x: [
                                                Math.cos(i * 60 * (Math.PI / 180)) * 80,
                                                Math.cos(i * 60 * (Math.PI / 180)) * 60
                                            ],
                                            y: [
                                                Math.sin(i * 60 * (Math.PI / 180)) * 80,
                                                Math.sin(i * 60 * (Math.PI / 180)) * 60
                                            ],
                                            opacity: [0, 1, 0],
                                            scale: [0, 1.5, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                            ease: "circOut"
                                        }}
                                        style={{
                                            left: '50%',
                                            top: '50%',
                                            marginLeft: '-3px',
                                            marginTop: '-3px'
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="space-y-4">
                                <motion.h3
                                    className="text-2xl font-medium tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {progress < 20 && "Analizando estructura del sitio..."}
                                    {progress >= 20 && progress < 40 && "Conectando con el motor visual..."}
                                    {progress >= 40 && progress < 60 && "Extrayendo ADN de marca..."}
                                    {progress >= 60 && progress < 80 && "Procesando activos visuales..."}
                                    {progress >= 80 && progress < 95 && "Generando paletas de diseño..."}
                                    {progress >= 95 && "Finalizando el Kit de Marca..."}
                                </motion.h3>

                                {/* Technical Log Overlay */}
                                <div className="h-24 overflow-hidden relative max-w-sm mx-auto bg-black/5 rounded-lg border border-border/5 p-3 font-mono text-[10px] text-muted-foreground/40 text-left">
                                    <motion.div
                                        animate={{ y: [0, -120] }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        className="space-y-1"
                                    >
                                        {[...TECHNICAL_LOGS, ...TECHNICAL_LOGS].map((log, i) => (
                                            <div key={i} className="truncate">
                                                <span className="text-[var(--accent)]/50 mr-2 opacity-50">{">"}</span>
                                                {log}
                                            </div>
                                        ))}
                                    </motion.div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
                                </div>

                                <div className="flex justify-center gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>

                                <motion.p
                                    className="text-xs text-muted-foreground/40 max-w-sm mx-auto"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    FIRE-SC Engine v4.0 • Gemini 1.5 Flash • Headless-Chromium
                                </motion.p>
                            </div>
                        </div>

                        {/* Animated scanning bar effect */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent h-40"
                            animate={{ top: ['-20%', '110%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                )}
                {/* Result State */}
                {!loading && activeBrandKit && !showNewKitForm && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <BrandDNABoard
                            key={activeBrandKit.id || 'new'}
                            data={activeBrandKit}
                            isDebug={searchParams.get('debug') === 'true'}
                            onRegenerate={() => setShowRegenerateConfirm(true)}
                            onNewBrandKit={handleNewProfile}
                            onSaveSuccess={reloadBrandKits}
                        />
                    </div>
                )}

                {/* AlertDialog de Confirmación de Regeneración - REDESIGNED */}
                <AlertDialog open={showRegenerateConfirm} onOpenChange={setShowRegenerateConfirm}>
                    <AlertDialogContent className="max-w-md shadow-2xl p-0 overflow-hidden gap-0">
                        <div className="p-6 pb-2">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-3 text-xl text-foreground">
                                    <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-500">
                                        <TriangleAlert className="w-6 h-6 animate-pulse" />
                                    </div>
                                    ¿Regenerar Brand Kit?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground pt-4 text-base leading-relaxed">
                                    Esta acción volverá a analizar el sitio web <span className='font-semibold text-foreground'>{activeBrandKit?.url}</span> desde cero.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                        </div>

                        <div className="px-6 py-4">
                            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 flex gap-3">
                                <TriangleAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-500/90 font-medium">
                                    ¡Cuidado! Se perderán permanentemente todos los cambios manuales que hayas realizado en este perfil.
                                </p>
                            </div>
                        </div>

                        <AlertDialogFooter className="p-6 border-t border-border flex-row justify-end gap-3 sm:space-x-0">
                            <AlertDialogCancel className="mt-0 border-border hover:bg-accent hover:text-accent-foreground text-foreground transition-all active:scale-95">
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleRegenerate}
                                className="shadow-lg transition-all active:scale-95"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Sí, regenerar ahora
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </DashboardLayout>
    );
}

export default function BrandKitPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <BrandKitPageContent />
        </Suspense>
    );
}
