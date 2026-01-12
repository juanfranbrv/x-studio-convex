'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Palette, Wand2, LayoutTemplate, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface OnboardingModalProps {
    isOpen: boolean
    onClose: () => void
    onComplete?: () => void
}

const BENEFITS = [
    {
        icon: Palette,
        title: 'Identidad visual coherente',
        description: 'Tus colores, tipografías y logos siempre consistentes'
    },
    {
        icon: Wand2,
        title: 'Generaciones precisas',
        description: 'La IA entiende tu marca y crea contenido alineado'
    },
    {
        icon: LayoutTemplate,
        title: 'Plantillas personalizadas',
        description: 'Diseños que reflejan tu estilo único'
    }
]

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
    const router = useRouter()
    const [step, setStep] = useState(0)

    const handleCreateBrandKit = () => {
        onComplete?.()
        onClose()
        router.push('/brand-kit')
    }

    const handleSkip = () => {
        onComplete?.()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/20">
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-6 pt-8 pb-6">
                    <div className="absolute top-4 right-4">
                        <Button variant="ghost" size="icon" onClick={handleSkip} className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center mb-4 shadow-lg"
                    >
                        <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>

                    <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-bold">
                            ¡Bienvenido a X-Studio! 🎨
                        </DialogTitle>
                        <p className="text-muted-foreground mt-2">
                            Para crear contenido visual increíble, primero necesitamos conocer tu marca.
                        </p>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                        ¿Por qué crear un Kit de Marca?
                    </h3>

                    <div className="space-y-4">
                        {BENEFITS.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="flex items-start gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <benefit.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        Solo toma 2 minutos configurar tu Kit de Marca completo
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex flex-col gap-2">
                    <Button
                        onClick={handleCreateBrandKit}
                        className="w-full h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90"
                    >
                        Crear mi Kit de Marca
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        className="w-full text-muted-foreground hover:text-foreground"
                    >
                        Saltar por ahora
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
