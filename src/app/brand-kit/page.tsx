'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
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
    "Capturando esencia visual de la web...",
    "Extrayendo ADN de marca con IA...",
    "Generando activos y paletas finales...",
    "Puliendo los últimos detalles..."
];

export default function BrandKitPage() {
    const { user, isLoaded } = useUser();
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

    // Asegurar que si hay perfiles y no hay resultado visible, se muestre el formulario o se cargue uno
    useEffect(() => {
        if (!contextLoading && brandKits.length === 0) {
            setShowNewKitForm(true);
        } else if (activeBrandKit) {
            setShowNewKitForm(false);
        }
    }, [contextLoading, brandKits, activeBrandKit]);

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
        if (!url || !user?.id) return;
        setLoading(true);
        setError('');
        await handleSubmit({ preventDefault: () => { } } as any);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !user?.id) return;

        setLoading(true);
        setError('');

        try {
            const response = await analyzeBrandDNA(url, true, user.id);

            if (response.success && response.data) {
                setShowNewKitForm(false);
                // Refrescar la lista global
                await reloadBrandKits();
                // El contexto se encargará de poner el nuevo como activo si es el único o si implementamos lógica de "último creado"
                if (response.data.id) {
                    await setActiveBrandKit(response.data.id);
                }
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
                {(brandKits.length === 0 || showNewKitForm) && !activeBrandKit && (
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

                {/* Loading state */}
                {loading && (
                    <div className="max-w-md mx-auto text-center py-16">
                        <div className="glass rounded-xl p-8 border border-[var(--border)] shadow-2xl relative overflow-hidden">
                            {/* Background glow animation */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 to-transparent"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />

                            <motion.div
                                className="relative mx-auto w-20 h-20 mb-6"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <svg className="w-20 h-20 absolute top-0 left-0 -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        className="text-[var(--accent)]/10 stroke-current"
                                        strokeWidth="8"
                                        fill="transparent"
                                        r="42"
                                        cx="50"
                                        cy="50"
                                    />
                                    <circle
                                        className="text-[var(--accent)] stroke-current transition-all duration-300 ease-in-out"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        fill="transparent"
                                        r="42"
                                        cx="50"
                                        cy="50"
                                        style={{
                                            strokeDasharray: '263.89',
                                            strokeDashoffset: `${263.89 - (progress / 100) * 263.89}`
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                    {Math.round(progress)}%
                                </div>
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={loadingMessageIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-lg font-medium text-[var(--accent)] relative z-10"
                                >
                                    {LOADING_MESSAGES[loadingMessageIndex]}
                                </motion.p>
                            </AnimatePresence>

                            <div className="mt-6 w-full bg-[var(--border)] h-1 rounded-full overflow-hidden relative z-10">
                                <motion.div
                                    className="h-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Result State */}
                {!loading && activeBrandKit && !showNewKitForm && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <BrandDNABoard
                            key={activeBrandKit.updated_at || activeBrandKit.id || 'new'}
                            data={activeBrandKit}
                            isDebug={false}
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
