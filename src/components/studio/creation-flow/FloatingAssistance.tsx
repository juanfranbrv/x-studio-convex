'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useUI } from '@/contexts/UIContext';
import { useToast } from '@/hooks/use-toast';

interface FloatingAssistanceProps {
    title?: string;
    description?: string;
    onClose?: () => void;
    isVisible?: boolean;
    className?: string;
    side?: 'left' | 'right';
    anchorRef?: React.RefObject<HTMLDivElement | null>; // Anchor to track
}

export function FloatingAssistance({
    title,
    description,
    onClose,
    isVisible = true,
    className,
    side = 'left',
    anchorRef
}: FloatingAssistanceProps) {
    const { setAssistanceEnabled } = useUI();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, right: 0, width: 0 });
    const assistanceRef = useRef<HTMLDivElement>(null);
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Track anchor position
    useEffect(() => {
        if (!isVisible || !anchorRef?.current || !mounted) return;

        const updatePosition = () => {
            if (anchorRef.current) {
                const rect = anchorRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    width: rect.width
                });
            }
        };

        // Initial update
        updatePosition();

        // Update on scroll or resize
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);

        // Polling as fallback for dynamic changes (like panel width changes)
        const interval = setInterval(updatePosition, 100);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
            clearInterval(interval);
        };
    }, [isVisible, anchorRef, mounted]);

    if (!mounted || !isVisible || !description) return null;

    const handleCloseAssistance = () => {
        setAssistanceEnabled(false);
        toast({
            title: 'Ayudas desactivadas',
            description: 'Puedes volver a activarlas desde Ajustes.',
        });
        onClose?.();
    };

    const contentWidth = assistanceRef.current?.getBoundingClientRect().width ?? 280;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const drift = side === 'left' ? 6 : -6;
    const desiredLeft = side === 'left'
        ? coords.left - contentWidth - 16
        : coords.right + 16;
    const clampedLeft = clamp(desiredLeft, 12, Math.max(12, viewportWidth - contentWidth - 12));

    // The assistance content
    const content = (
        <AnimatePresence mode="wait">
            <motion.div
                ref={assistanceRef}
                initial={{ opacity: 0, x: side === 'left' ? 20 : -20, scale: 0.95 }}
                animate={{ opacity: 1, x: [0, drift, 0], scale: 1 }}
                exit={{ opacity: 0, x: side === 'left' ? 20 : -20, scale: 0.95 }}
                transition={{
                    opacity: { duration: 0.3, ease: 'easeOut' },
                    scale: { duration: 0.3, ease: 'easeOut' },
                    x: { duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 0.2 }
                }}
                className={cn(
                    "fixed z-[9999] w-[280px] pointer-events-auto",
                    "overflow-visible rounded-xl border border-primary/20",
                    "bg-background/95 backdrop-blur-xl shadow-2xl",
                    "p-4",
                    className
                )}
                style={{
                    top: coords.top,
                    left: clampedLeft
                }}
            >
                {/* Arrow pointing towards the step */}
                <div
                    className={cn(
                        "absolute top-5 w-0 h-0",
                        "border-t-[8px] border-t-transparent",
                        "border-b-[8px] border-b-transparent",
                        side === 'left'
                            ? "right-0 translate-x-full border-l-[10px] border-l-background"
                            : "left-0 -translate-x-full border-r-[10px] border-r-background"
                    )}
                />

                {/* Decorative background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none rounded-xl" />

                <div className="relative flex gap-3">
                    <div className="mt-1 shrink-0">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Lightbulb className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-1">
                        {title && (
                            <h4 className="text-sm font-semibold text-foreground/90 leading-none mb-1.5">
                                {title}
                            </h4>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <button
                        onClick={handleCloseAssistance}
                        className="shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors -mt-1 -mr-1 p-1"
                        aria-label="Cerrar ayuda y desactivar asistencias"
                        title="Cerrar ayuda"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
