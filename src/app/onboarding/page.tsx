'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LanguageIcon from '@mui/icons-material/Language'
import PaletteIcon from '@mui/icons-material/Palette'
import CheckIcon from '@mui/icons-material/Check'
import CircularProgress from '@mui/material/CircularProgress'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { I18nProvider } from '@/components/providers/I18nProvider'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

type Step = 1 | 2 | 3

interface ExtractedBrand {
    colors: string[]
    logo?: string
    fonts?: { heading?: string; body?: string }
}

export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useUser()
    const [step, setStep] = useState<Step>(1)
    const [brandName, setBrandName] = useState('')
    const [websiteUrl, setWebsiteUrl] = useState('')
    const [isExtracting, setIsExtracting] = useState(false)
    const [extractedData, setExtractedData] = useState<ExtractedBrand | null>(null)
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)

    const handleExtract = async () => {
        if (!websiteUrl) return

        setIsExtracting(true)
        try {
            // TODO: Implement actual URL scraping with Jina
            // For now, simulate extraction with mock data
            await new Promise(resolve => setTimeout(resolve, 2000))

            const mockExtracted: ExtractedBrand = {
                colors: ['#FF6B00', '#0057FF', '#222222', '#FFFFFF', '#E5E5E5'],
                fonts: { heading: 'Montserrat', body: 'Inter' },
            }

            setExtractedData(mockExtracted)
            setSelectedColors(mockExtracted.colors.slice(0, 4))
            setStep(3)
        } catch (error) {
            console.error('Extraction failed:', error)
        } finally {
            setIsExtracting(false)
        }
    }

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : prev.length < 5 ? [...prev, color] : prev
        )
    }

    const upsertBrandDNA = useMutation(api.brands.upsertBrandDNA)

    const handleFinish = async () => {
        setIsSaving(true)
        try {
            // CONVEX MIGRATION: Save to brand_dna table
            // We use upsertBrandDNA which maps to the table used by the dashboard
            await upsertBrandDNA({
                url: websiteUrl || `manual:${Date.now()}`, // Fallback if no URL
                brand_name: brandName,
                tagline: '',
                business_overview: '',
                brand_values: [],
                tone_of_voice: [],
                visual_aesthetic: [],
                colors: selectedColors,
                fonts: extractedData?.fonts ?
                    [extractedData.fonts.heading || '', extractedData.fonts.body || ''].filter(Boolean)
                    : [],
                logo_url: extractedData?.logo,
                // Ensure other required fields are present (even if empty) if schema requires them
                // Schema has updated_at as required string.
                updated_at: new Date().toISOString(),
                clerk_user_id: user?.id
            })

            router.push('/studio')
        } catch (error) {
            console.error('Save failed:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const canProceedStep1 = brandName.trim().length > 0
    const canProceedStep2 = websiteUrl.trim().length > 0

    return (
        <I18nProvider>
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <div className="w-full max-w-2xl">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {step > s ? <CheckIcon fontSize="small" /> : s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <Card className="border-border">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <AutoAwesomeIcon sx={{ width: 32, height: 32 }} className="text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-heading">
                                    ¡Bienvenido a x-Studio!
                                </CardTitle>
                                <CardDescription>
                                    Vamos a configurar tu primera marca. Solo necesitamos un poco de información.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="brandName">Nombre de tu marca</Label>
                                    <Input
                                        id="brandName"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        placeholder="Ej: Nike, Coca-Cola, Mi Empresa..."
                                        className="text-lg h-12"
                                    />
                                </div>

                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!canProceedStep1}
                                    className="w-full h-12 btn-gradient"
                                >
                                    Continuar
                                    <ArrowForwardIcon fontSize="small" className="ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: URL Extraction */}
                    {step === 2 && (
                        <Card className="border-border">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                                    <LanguageIcon sx={{ width: 32, height: 32 }} className="text-blue-400" />
                                </div>
                                <CardTitle className="text-2xl font-heading">
                                    Extracción Automática
                                </CardTitle>
                                <CardDescription>
                                    Si tienes un sitio web, podemos extraer automáticamente tu paleta de colores y logo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="websiteUrl">URL del sitio web (opcional)</Label>
                                    <Input
                                        id="websiteUrl"
                                        type="url"
                                        value={websiteUrl}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                        placeholder="https://tusitio.com"
                                        className="text-lg h-12"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-12"
                                    >
                                        <ArrowBackIcon fontSize="small" className="mr-2" />
                                        Atrás
                                    </Button>

                                    {websiteUrl ? (
                                        <Button
                                            onClick={handleExtract}
                                            disabled={isExtracting}
                                            className="flex-1 h-12 btn-gradient"
                                        >
                                            {isExtracting ? (
                                                <>
                                                    <CircularProgress size={20} color="inherit" className="mr-2" />
                                                    Extrayendo...
                                                </>
                                            ) : (
                                                <>
                                                    Extraer Brand DNA
                                                    <ArrowForwardIcon fontSize="small" className="ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setExtractedData({
                                                    colors: ['#6366F1', '#EC4899', '#10B981', '#F59E0B'],
                                                })
                                                setSelectedColors(['#6366F1', '#EC4899', '#10B981', '#F59E0B'])
                                                setStep(3)
                                            }}
                                            className="flex-1 h-12"
                                            variant="secondary"
                                        >
                                            Configurar manualmente
                                            <ArrowForwardIcon fontSize="small" className="ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Customization */}
                    {step === 3 && (
                        <Card className="border-border">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                    <PaletteIcon sx={{ width: 32, height: 32 }} className="text-purple-400" />
                                </div>
                                <CardTitle className="text-2xl font-heading">
                                    Personaliza tu Brand Kit
                                </CardTitle>
                                <CardDescription>
                                    Selecciona los colores que representan tu marca (máximo 5)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Brand Name Preview */}
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Tu marca</p>
                                    <p className="text-2xl font-bold font-heading">{brandName}</p>
                                </div>

                                {/* Color Palette */}
                                <div>
                                    <Label className="mb-3 block">Paleta de colores</Label>
                                    <div className="flex flex-wrap gap-3">
                                        {extractedData?.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => toggleColor(color)}
                                                className={`relative w-14 h-14 rounded-xl transition-all ${selectedColors.includes(color)
                                                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                                                    : 'hover:scale-105'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            >
                                                {selectedColors.includes(color) && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <CheckIcon sx={{ width: 24, height: 24 }} className="text-white drop-shadow-lg" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {selectedColors.length}/5 colores seleccionados
                                    </p>
                                </div>

                                {/* Selected Colors Preview */}
                                <div className="flex gap-2">
                                    {selectedColors.map((color) => (
                                        <Badge key={color} variant="secondary" className="font-mono">
                                            {color}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Typography Preview */}
                                {extractedData?.fonts && (
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-2">Tipografía detectada</p>
                                        <p className="text-xl font-bold">{extractedData.fonts.heading || 'Montserrat'}</p>
                                        <p className="text-base">{extractedData.fonts.body || 'Inter'}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(2)}
                                        className="flex-1 h-12"
                                    >
                                        <ArrowBackIcon fontSize="small" className="mr-2" />
                                        Atrás
                                    </Button>
                                    <Button
                                        onClick={handleFinish}
                                        disabled={isSaving || selectedColors.length === 0}
                                        className="flex-1 h-12 btn-gradient glow-primary"
                                    >
                                        {isSaving ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" className="mr-2" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                Ir al Estudio
                                                <AutoAwesomeIcon fontSize="small" className="ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </I18nProvider>
    )
}
