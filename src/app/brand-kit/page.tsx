'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { analyzeBrandDNA } from '@/app/actions/analyze-brand-dna';
import { useBrandKit } from '@/contexts/BrandKitContext';
import type { BrandDNA } from '@/lib/brand-types';
import { fetchQuery } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';
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
    const [loadingScreenshot, setLoadingScreenshot] = useState<string | null>(null);

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
        setLoadingScreenshot(null);

        try {
            const response = await analyzeBrandDNA(targetUrl, true, user.id);

            if (response.success && response.data) {
                setShowNewKitForm(false);

                // CRITICAL: Force reload to show updated data
                await new Promise(resolve => setTimeout(resolve, 500));
                await reloadBrandKits();

                // Re-set the active brand kit to force UI refresh
                if (activeBrandKit?.id) {
                    await setActiveBrandKit(activeBrandKit.id);
                }

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
            setLoadingScreenshot(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !user?.id) return;

        setLoading(true);
        setError('');
        setLoadingScreenshot(null);

        try {
            const response = await analyzeBrandDNA(url, true, user.id);

            if (response.success && response.data) {
                console.log('[NEW BRAND KIT] ✅ Created successfully!', response.data.id);

                // Hide form immediately
                setShowNewKitForm(false);

                // CRITICAL: Wait for Convex to propagate
                console.log('[NEW BRAND KIT] ⏳ Waiting 2 seconds for Convex propagation...');
                await new Promise(resolve => setTimeout(resolve, 2000));

                // FORCE NAVIGATION to the new brand kit using URL parameter
                console.log('[NEW BRAND KIT] 🎯 Forcing navigation to new kit:', response.data.id);
                const debugParam = searchParams.get('debug') === 'true' ? '&debug=true' : '';
                window.location.href = `/brand-kit?id=${response.data.id}${debugParam}`;

                toast({
                    title: "✅ Brand Kit creado",
                    description: "Cargando resultados...",
                });
            } else {
                setError(response.error || 'No se pudo crear el Brand Kit.');
            }
        } catch (err) {
            console.error('❌ Unexpected error during submit:', err);
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto text-center py-12"
                    >
                        <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-2xl p-10 mb-8 border border-border/50 relative overflow-hidden shadow-2xl">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl -z-10" />

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mb-6"
                            >
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-10 h-10 text-primary-foreground" />
                                </div>
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {brandKits.length === 0 ? '¡Bienvenido a X Imagen!' : 'Crear Nuevo Brand Kit'}
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
                                {brandKits.length === 0
                                    ? 'Extrae el ADN visual de cualquier marca en segundos. Introduce una URL para comenzar.'
                                    : 'Analiza una nueva marca y extrae automáticamente su identidad visual.'}
                            </p>

                            {/* URL Input */}
                            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                                <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-2xl border-2 border-border/50 p-2 shadow-lg transition-all focus-within:border-primary/50 focus-within:shadow-xl hover:shadow-lg group">
                                    <div className="pl-4">
                                        <Globe className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input
                                        placeholder="ejemplo.com o https://ejemplo.com"
                                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg h-14 placeholder:text-muted-foreground/40 font-medium"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={loading}
                                        autoFocus
                                    />
                                    <Button
                                        type="submit"
                                        disabled={loading || !url}
                                        size="lg"
                                        className="btn-gradient rounded-xl px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mr-1"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5 mr-2" />
                                                Analizar
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>

                            {/* Cancel button when creating new (and has existing profiles) */}
                            {brandKits.length > 0 && showNewKitForm && (
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="mt-8 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => {
                                        setShowNewKitForm(false);
                                        setUrl('');
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancelar
                                </Button>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
                                <TriangleAlert className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TECH-FOCUSED Full-Screen Loading Animation */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
                    >
                        {/* Animated Background Gradient Orbs - MUCH BRIGHTER */}
                        <motion.div
                            className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/50 via-accent/40 to-transparent blur-3xl"
                            animate={{
                                x: [-200, 200, -200],
                                y: [-100, 100, -100],
                                scale: [1, 1.3, 1],
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            style={{ top: '5%', left: '5%' }}
                        />
                        <motion.div
                            className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-br from-accent/50 via-primary/40 to-transparent blur-3xl"
                            animate={{
                                x: [200, -200, 200],
                                y: [100, -100, 100],
                                scale: [1.3, 1, 1.3],
                            }}
                            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
                            style={{ bottom: '5%', right: '5%' }}
                        />

                        {/* Floating Particles Grid - MUCH BIGGER AND BRIGHTER */}
                        <div className="absolute inset-0">
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-4 h-4 rounded-full shadow-lg"
                                    style={{
                                        left: `${(i % 6) * 20}%`,
                                        top: `${Math.floor(i / 6) * 20}%`,
                                        background: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                                        boxShadow: i % 2 === 0 ? '0 0 20px var(--primary)' : '0 0 20px var(--accent)',
                                    }}
                                    animate={{
                                        y: [0, -40, 0],
                                        opacity: [0.4, 1, 0.4],
                                        scale: [1, 2, 1],
                                    }}
                                    transition={{
                                        duration: 2 + (i % 2),
                                        repeat: Infinity,
                                        delay: i * 0.08,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Animated Waves - MUCH BRIGHTER */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={`wave-${i}`}
                                className="absolute inset-x-0 h-1"
                                style={{
                                    top: `${20 + i * 15}%`,
                                    background: `linear-gradient(90deg, transparent, var(--accent), transparent)`,
                                    boxShadow: '0 0 20px var(--accent)',
                                }}
                                animate={{
                                    opacity: [0, 0.8, 0],
                                    scaleX: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.6,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}

                        {/* Vertical Scan Lines */}
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={`vscan-${i}`}
                                className="absolute inset-y-0 w-px"
                                style={{
                                    left: `${25 * (i + 1)}%`,
                                    background: 'var(--primary)',
                                    boxShadow: '0 0 10px var(--primary)',
                                }}
                                animate={{
                                    opacity: [0.2, 0.6, 0.2],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                }}
                            />
                        ))}

                        {/* Central Content */}
                        <div className="relative z-10 max-w-2xl w-full mx-auto px-6 text-center">
                            {/* Main Progress Circle */}
                            <div className="relative mb-16">
                                {/* Outer rotating ring - BRIGHTER */}
                                <motion.div
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-4 border-primary/40"
                                    style={{ boxShadow: '0 0 30px var(--primary)' }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Inner rotating ring (opposite direction) - BRIGHTER */}
                                <motion.div
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border-4 border-accent/40"
                                    style={{ boxShadow: '0 0 25px var(--accent)' }}
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Progress SVG */}
                                <div className="relative mx-auto w-36 h-36">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            className="text-muted/10 stroke-current"
                                            strokeWidth="6"
                                            fill="transparent"
                                            r="44"
                                            cx="50"
                                            cy="50"
                                        />
                                        <motion.circle
                                            className="text-primary stroke-current"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            fill="transparent"
                                            r="44"
                                            cx="50"
                                            cy="50"
                                            initial={{ strokeDasharray: "276", strokeDashoffset: "276" }}
                                            animate={{ strokeDashoffset: 276 - (progress / 100) * 276 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            style={{ filter: "drop-shadow(0 0 12px var(--primary))" }}
                                        />
                                    </svg>

                                    {/* Percentage */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            key={Math.floor(progress / 10)}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
                                        >
                                            {Math.round(progress)}%
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Orbiting dots */}
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={`orbit-${i}`}
                                        className="absolute w-3 h-3 rounded-full"
                                        style={{
                                            background: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                                            left: '50%',
                                            top: '50%',
                                            marginLeft: '-6px',
                                            marginTop: '-6px',
                                        }}
                                        animate={{
                                            x: [
                                                Math.cos(i * 45 * (Math.PI / 180)) * 100,
                                                Math.cos((i * 45 + 360) * (Math.PI / 180)) * 100
                                            ],
                                            y: [
                                                Math.sin(i * 45 * (Math.PI / 180)) * 100,
                                                Math.sin((i * 45 + 360) * (Math.PI / 180)) * 100
                                            ],
                                            opacity: [0.3, 1, 0.3],
                                            scale: [0.8, 1.2, 0.8],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            delay: i * 0.5,
                                            ease: "linear"
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Status Text */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.h3
                                    key={Math.floor(progress / 20)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-3xl font-bold text-foreground"
                                >
                                    {progress < 20 && "Analizando estructura del sitio..."}
                                    {progress >= 20 && progress < 40 && "Conectando con el motor visual..."}
                                    {progress >= 40 && progress < 60 && "Extrayendo ADN de marca..."}
                                    {progress >= 60 && progress < 80 && "Procesando activos visuales..."}
                                    {progress >= 80 && progress < 95 && "Generando paletas de diseño..."}
                                    {progress >= 95 && "Finalizando el Kit de Marca..."}
                                </motion.h3>

                                {/* Technical Log */}
                                <div className="max-w-lg mx-auto h-40 overflow-hidden relative">
                                    <motion.div
                                        animate={{ y: [0, -250] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="space-y-2"
                                    >
                                        {[...TECHNICAL_LOGS, ...TECHNICAL_LOGS, ...TECHNICAL_LOGS].map((log, i) => (
                                            <div key={i} className="flex items-center gap-2 text-muted-foreground/40 text-sm font-mono">
                                                <span className="text-primary/40">▸</span>
                                                <span className="truncate">{log}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Animated dots */}
                                <div className="flex justify-center gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-primary"
                                            animate={{
                                                opacity: [0.3, 1, 0.3],
                                                scale: [1, 1.3, 1]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.2
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Engine info */}
                                <motion.p
                                    className="text-sm text-muted-foreground/40 font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    FIRE-SC Engine v4.0 • Gemini 1.5 Flash • Headless-Chromium
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.div>
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
        </DashboardLayout >
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
