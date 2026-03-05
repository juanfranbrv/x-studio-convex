'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { BrandDNA, TextAssets } from '@/lib/brand-types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Palette, Upload, Image as ImageIcon, ShieldAlert, X, Loader2, Plus, Pipette, Quote, Sparkles, Type, MessageCircle, Megaphone, MousePointerClick, Trash2 } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { ContactSocialCard } from './ContactSocialCard'
import { TypographySection } from './TypographySection'
import { ImageGallery } from './VisualAssetComponents'
import { BrandContextCard } from './BrandContextCard'

type WizardStepId =
  | 'intro'
  | 'name'
  | 'url'
  | 'post-analysis'
  | 'logos'
  | 'colors'
  | 'brand-context'
  | 'contact'
  | 'typography'
  | 'slogan'
  | 'values'
  | 'visual-styles'
  | 'tone'
  | 'marketing-hooks'
  | 'ctas'
  | 'image-gallery'
  | 'done'

interface BrandKitAssistantWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand: BrandDNA
  forceMode?: boolean
  onUpdateBrandName: (value: string) => void
  onUpdateUrl: (value: string) => void
  onAnalyzeUrl: (urlOverride?: string) => Promise<void> | void
  onPreviewUrl: (url: string) => Promise<{
    success: boolean
    url: string
    title?: string
    screenshotUrl?: string
    error?: string
  }>
  onUploadLogos: (files: FileList | File[]) => Promise<void>
  onToggleLogo: (index: number) => void
  onRemoveLogo: (index: number) => void
  onAddColor: () => void
  onUpdateColor: (index: number, color: string) => void
  onUpdateColorRole: (index: number, role: string) => void
  onRemoveColor: (index: number) => void
  onUpdateBrandContext: (value: string) => void
  onUpdateContact: (data: { socialLinks: { platform: string; url: string; username?: string }[]; emails: string[]; phones: string[]; addresses: string[] }) => void
  onAddFont: (font: string) => void
  onSelectFontForRole: (family: string, role: 'heading' | 'body') => void
  onRemoveFont: (index: number) => void
  onUpdateFontRole: (index: number, role?: 'heading' | 'body') => void
  onUpdateTagline: (val: string) => void
  onUpdateValue: (index: number, val: string) => void
  onAddValue: () => void
  onRemoveValue: (index: number) => void
  onUpdateAesthetic: (index: number, val: string) => void
  onAddAesthetic: () => void
  onRemoveAesthetic: (index: number) => void
  onUpdateTone: (index: number, val: string) => void
  onAddTone: () => void
  onRemoveTone: (index: number) => void
  onChangeTextAssets: (newTextAssets: TextAssets) => void
  onAppendExtractedData: (extracted: any) => void
  onUploadImages: (files: FileList | File[]) => Promise<void>
  onRemoveImage: (index: number) => void
  onOpenLightbox: (url: string) => void
  isUploadingImages?: boolean
  completionPercentage: number
  minimumCompletionToFinish?: number
  onFinish: () => void
}

const STEPS: WizardStepId[] = ['intro', 'name', 'url', 'post-analysis', 'logos', 'colors', 'brand-context', 'contact', 'typography', 'slogan', 'values', 'visual-styles', 'tone', 'marketing-hooks', 'ctas', 'image-gallery', 'done']
const FLOW_STEPS: WizardStepId[] = ['name', 'url', 'post-analysis', 'logos', 'colors', 'brand-context', 'contact', 'typography', 'slogan', 'values', 'visual-styles', 'tone', 'marketing-hooks', 'ctas', 'image-gallery', 'done']
const ASSISTANT_STEP_KEY = 'brand-kit-assistant-step'
const ANALYZING_MESSAGES = [
  'Conectando con tu web...',
  'Abriendo la página en modo análisis...',
  'Leyendo estructura y estilos principales...',
  'Detectando logo y variaciones de marca...',
  'Extrayendo paleta de color dominante...',
  'Identificando colores de apoyo y contraste...',
  'Revisando tipografías visibles del sitio...',
  'Analizando jerarquía visual y bloques clave...',
  'Extrayendo textos útiles para tu marca...',
  'Buscando imágenes y recursos destacados...',
  'Unificando resultados de la web...',
  'Preparando una base de kit para ti...',
  'Aplicando validaciones finales...',
]

function normalizeUrl(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  if (value.toLowerCase().startsWith('manual-')) return null
  try {
    const withProtocol = value.startsWith('http://') || value.startsWith('https://')
      ? value
      : `https://${value}`
    const parsed = new URL(withProtocol)
    if (!isSyntacticallyValidWebHostname(parsed.hostname)) return null
    return parsed.toString()
  } catch {
    return null
  }
}

function isSyntacticallyValidWebHostname(hostnameRaw: string): boolean {
  const hostname = hostnameRaw.trim().toLowerCase()
  if (!hostname) return false
  if (/\s/.test(hostname)) return false

  if (hostname === 'localhost') return true

  const ipv4Match = hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/)
  if (ipv4Match) {
    return hostname.split('.').every((part) => {
      const n = Number(part)
      return Number.isInteger(n) && n >= 0 && n <= 255
    })
  }

  // Dominio web sintácticamente válido: labels + TLD (sin validar existencia)
  if (!hostname.includes('.')) return false
  const labels = hostname.split('.')
  if (labels.some((label) => !label)) return false

  const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/
  if (!labels.every((label) => validLabel.test(label))) return false

  const tld = labels[labels.length - 1]
  return /^[a-z]{2,63}$/.test(tld)
}

function getInitialAssistantStep(): number {
  if (typeof window === 'undefined') return 0
  const stored = window.sessionStorage.getItem(ASSISTANT_STEP_KEY)
  if (!stored) return 0
  const parsed = Number(stored)
  if (!Number.isInteger(parsed)) return 0
  if (parsed < 0 || parsed >= STEPS.length) return 0
  return parsed
}

function normalizeHexColor(color: string): string {
  const base = (color || '').trim().toLowerCase()
  if (!base) return '#000000'
  const withHash = base.startsWith('#') ? base : `#${base}`
  return /^#[0-9a-f]{6}$/i.test(withHash) ? withHash : '#000000'
}

function RoleColorSwatch({
  color,
  onCommit,
  onEyedropper,
  draggable = false,
  onDragStart,
  onDragEnd,
  sizeClass = 'w-12 h-12 rounded-full',
}: {
  color: string
  onCommit: (nextColor: string) => void
  onEyedropper?: () => void
  draggable?: boolean
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void
  onDragEnd?: (event: React.DragEvent<HTMLButtonElement>) => void
  sizeClass?: string
}) {
  const initial = normalizeHexColor(color)
  const [draft, setDraft] = useState(initial)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDraft(initial)
  }, [initial])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(sizeClass, 'border border-border/70 shadow-sm')}
          style={{ backgroundColor: initial }}
          title={initial}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3 space-y-3 bg-card border border-border/80 shadow-xl z-[140]" align="start">
        <HexColorPicker
          color={draft}
          onChange={(next) => setDraft(normalizeHexColor(next))}
          className="!w-full !h-28"
        />
        <Input
          value={draft.toUpperCase()}
          onChange={(e) => setDraft(normalizeHexColor(e.target.value))}
          className="h-8 text-xs font-mono"
        />
        <Button
          type="button"
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => {
            onCommit(draft)
            setOpen(false)
          }}
        >
          Aplicar color
        </Button>
        {onEyedropper && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs gap-1"
            onClick={() => onEyedropper()}
          >
            <Pipette className="w-3.5 h-3.5" />
            Tomar muestra
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}

function AddAccentSwatch({
  disabled,
  onAdd,
}: {
  disabled?: boolean
  onAdd: (nextColor: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('#4f46e5')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'w-12 h-12 rounded-full border border-dashed border-border/80 flex items-center justify-center text-muted-foreground',
            'hover:text-primary hover:border-primary/60 transition-colors',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          title="Añadir acento"
        >
          <Plus className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3 space-y-3 bg-card border border-border/80 shadow-xl z-[140]" align="start">
        <HexColorPicker
          color={draft}
          onChange={(next) => setDraft(normalizeHexColor(next))}
          className="!w-full !h-28"
        />
        <Input
          value={draft.toUpperCase()}
          onChange={(e) => setDraft(normalizeHexColor(e.target.value))}
          className="h-8 text-xs font-mono"
        />
        <Button
          type="button"
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => {
            onAdd(draft)
            setOpen(false)
          }}
        >
          Añadir acento
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export function BrandKitAssistantWizard({
  open,
  onOpenChange,
  brand,
  forceMode = false,
  onUpdateBrandName,
  onUpdateUrl,
  onAnalyzeUrl,
  onPreviewUrl,
  onUploadLogos,
  onToggleLogo,
  onRemoveLogo,
  onAddColor,
  onUpdateColor,
  onUpdateColorRole,
  onRemoveColor,
  onUpdateBrandContext,
  onUpdateContact,
  onAddFont,
  onSelectFontForRole,
  onRemoveFont,
  onUpdateFontRole,
  onUpdateTagline,
  onUpdateValue,
  onAddValue,
  onRemoveValue,
  onUpdateAesthetic,
  onAddAesthetic,
  onRemoveAesthetic,
  onUpdateTone,
  onAddTone,
  onRemoveTone,
  onChangeTextAssets,
  onAppendExtractedData,
  onUploadImages,
  onRemoveImage,
  onOpenLightbox,
  isUploadingImages = false,
  completionPercentage,
  minimumCompletionToFinish = 70,
  onFinish,
}: BrandKitAssistantWizardProps) {
  const [stepIndex, setStepIndex] = useState(getInitialAssistantStep)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewAnalyzing, setPreviewAnalyzing] = useState(false)
  const [analyzingMessageIndex, setAnalyzingMessageIndex] = useState(0)
  const [analyzingProgress, setAnalyzingProgress] = useState(12)
  const [previewData, setPreviewData] = useState<{ url: string; title?: string; screenshotUrl?: string } | null>(null)
  const [previewError, setPreviewError] = useState('')
  const [isDraggingLogos, setIsDraggingLogos] = useState(false)
  const [draggedColorSource, setDraggedColorSource] = useState<{ role: 'Texto' | 'Fondo' | 'Acento'; index: number } | null>(null)
  const [pendingRoleAdd, setPendingRoleAdd] = useState<{ role: 'Texto' | 'Fondo' | 'Acento'; color: string; previousLength: number } | null>(null)
  const logoInputRef = useRef<HTMLInputElement | null>(null)

  const step = STEPS[stepIndex]
  const flowStepIndex = FLOW_STEPS.indexOf(step)
  const progress = step === 'intro'
    ? 0
    : Math.round(((Math.max(flowStepIndex, 0) + 1) / FLOW_STEPS.length) * 100)
  const headerStepLabel = step === 'intro'
    ? 'Introducción'
    : `Paso ${flowStepIndex + 1} de ${FLOW_STEPS.length}`
  const currentUrl = brand.url || ''
  const isManualPlaceholderUrl = currentUrl.trim().toLowerCase().startsWith('manual-')
  const visibleUrlValue = isManualPlaceholderUrl ? '' : currentUrl
  const normalizedCurrentUrl = normalizeUrl(visibleUrlValue)
  const canAnalyze = Boolean(normalizedCurrentUrl)
  const hasTypedUrl = visibleUrlValue.trim().length > 0
  const invalidUrl = hasTypedUrl && !canAnalyze
  const currentLogos = useMemo(
    () => brand.logos || (brand.logo_url ? [{ url: brand.logo_url, selected: true }] : []),
    [brand.logos, brand.logo_url]
  )
  const colorItems = useMemo(
    () => (brand.colors || []).map((item, index) => ({ ...item, index })),
    [brand.colors]
  )
  const normalizeRole = (role?: string): 'Texto' | 'Fondo' | 'Acento' => {
    const raw = (role || '').toLowerCase()
    if (raw.includes('text') || raw.includes('texto')) return 'Texto'
    if (raw.includes('fondo') || raw.includes('background')) return 'Fondo'
    return 'Acento'
  }
  const groupedColors = useMemo(() => {
    const grouped = {
      Texto: [] as Array<{ index: number; color: string }>,
      Fondo: [] as Array<{ index: number; color: string }>,
      Acento: [] as Array<{ index: number; color: string }>,
    }
    colorItems.forEach((item) => {
      const role = normalizeRole(item.role)
      grouped[role].push({ index: item.index, color: item.color })
    })
    return grouped
  }, [colorItems])
  const fonts = useMemo(
    () => (brand.fonts || []).map((f) => (typeof f === 'string' ? { family: f } : f)),
    [brand.fonts]
  )
  const textAssets = useMemo<TextAssets>(() => ({
    marketing_hooks: brand.text_assets?.marketing_hooks || [],
    visual_keywords: brand.text_assets?.visual_keywords || [],
    ctas: brand.text_assets?.ctas || [],
    brand_context: brand.text_assets?.brand_context || brand.business_overview || '',
  }), [brand.text_assets, brand.business_overview])
  const hasHeadingFont = fonts.some((font) => font.role === 'heading')
  const hasBodyFont = fonts.some((font) => font.role === 'body')
  const canProceedFromTypography = hasHeadingFont && hasBodyFont
  const completionClamped = Math.max(0, Math.min(100, completionPercentage))
  const canFinishWizard = completionClamped >= minimumCompletionToFinish
  const completionMissing = Math.max(0, minimumCompletionToFinish - completionClamped)
  const hasUrlValue = hasTypedUrl

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1))
  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0))

  useEffect(() => {
    if (!pendingRoleAdd) return
    if (!brand.colors) return
    if (brand.colors.length <= pendingRoleAdd.previousLength) return
    const newIndex = brand.colors.length - 1
    onUpdateColor(newIndex, pendingRoleAdd.color)
    onUpdateColorRole(newIndex, pendingRoleAdd.role)
    setPendingRoleAdd(null)
  }, [brand.colors, pendingRoleAdd, onUpdateColor, onUpdateColorRole])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(ASSISTANT_STEP_KEY, String(stepIndex))
  }, [stepIndex])

  useEffect(() => {
    if (!previewAnalyzing) return

    const messageTimer = setInterval(() => {
      setAnalyzingMessageIndex((prev) => Math.min(prev + 1, ANALYZING_MESSAGES.length - 1))
    }, 1700)

    const progressTimer = setInterval(() => {
      setAnalyzingProgress((prev) => Math.min(prev + Math.random() * 9, 92))
    }, 700)

    return () => {
      clearInterval(messageTimer)
      clearInterval(progressTimer)
    }
  }, [previewAnalyzing])

  const closeWizard = () => {
    onOpenChange(false)
    setStepIndex(0)
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(ASSISTANT_STEP_KEY)
    }
  }

  const completeWizard = () => {
    if (!canFinishWizard) return
    onFinish()
    setStepIndex(0)
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(ASSISTANT_STEP_KEY)
    }
  }

  const handleAnalyzeClick = async () => {
    const normalizedUrl = normalizeUrl(visibleUrlValue)
    if (!normalizedUrl) return

    setPreviewOpen(true)
    setPreviewLoading(true)
    setPreviewError('')
    setPreviewData({ url: normalizedUrl })

    try {
      const result = await onPreviewUrl(normalizedUrl)
      if (!result.success) {
        setPreviewError(result.error || 'No pudimos cargar una vista previa de esta web.')
        return
      }
      setPreviewData({
        url: result.url || normalizedUrl,
        title: result.title,
        screenshotUrl: result.screenshotUrl,
      })
    } catch {
      setPreviewError('No pudimos cargar una vista previa de esta web.')
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleNextClick = async () => {
    if (step === 'url') {
      if (!hasUrlValue) {
        goNext()
        return
      }

      if (!canAnalyze) return

      await handleAnalyzeClick()
      return
    }

    goNext()
  }

  const confirmAnalyze = async () => {
    if (!previewData?.url) return
    setPreviewAnalyzing(true)
    setAnalyzingMessageIndex(0)
    setAnalyzingProgress(14)
    setPreviewError('')

    const urlStep = STEPS.indexOf('url')
    const postAnalysisStep = STEPS.indexOf('post-analysis')
    const nextStep = stepIndex <= urlStep ? postAnalysisStep : stepIndex
    setStepIndex(nextStep)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ASSISTANT_STEP_KEY, String(nextStep))
    }

    try {
      await onAnalyzeUrl(previewData.url)
      setAnalyzingProgress(100)
      setPreviewOpen(false)
    } catch (error: any) {
      setPreviewError(error?.message || 'No se pudo analizar la web. Revisa la URL e inténtalo de nuevo.')
    } finally {
      setPreviewAnalyzing(false)
    }
  }

  const handleLogoFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return
    await onUploadLogos(files)
  }

  const ensureRoleColor = (role: 'Texto' | 'Fondo' | 'Acento', fallbackColor: string) => {
    const current = groupedColors[role][0]
    if (current) {
      onUpdateColorRole(current.index, role)
      return current.index
    }

    const previousLength = brand.colors?.length || 0
    onAddColor()
    setPendingRoleAdd({ role, color: fallbackColor, previousLength })
    return null
  }

  const handleEyedropperForIndex = async (index: number) => {
    if (!('EyeDropper' in window)) return
    try {
      // @ts-ignore navegador compatible
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()
      if (result?.sRGBHex) {
        onUpdateColor(index, result.sRGBHex)
      }
    } catch {
      // cancelado por el usuario
    }
  }

  const moveOrSwapRole = (
    sourceRole: 'Texto' | 'Fondo' | 'Acento',
    sourceIdx: number,
    targetRole: 'Texto' | 'Fondo' | 'Acento',
    explicitTargetIdx?: number
  ) => {
    if (sourceRole === targetRole && explicitTargetIdx === undefined) return

    let targetIdx = explicitTargetIdx
    if (targetIdx === undefined && targetRole !== 'Acento') {
      targetIdx = groupedColors[targetRole][0]?.index
    }

    onUpdateColorRole(sourceIdx, targetRole)

    if (targetIdx !== undefined && targetIdx !== sourceIdx) {
      const fallbackRole: 'Texto' | 'Fondo' | 'Acento' = sourceRole === 'Acento' ? 'Acento' : sourceRole
      onUpdateColorRole(targetIdx, fallbackRole)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          if (forceMode) return
          closeWizard()
          return
        }
        onOpenChange(next)
      }}
    >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/85 backdrop-blur-md"
          onEscapeKeyDown={(event) => {
            if (forceMode) event.preventDefault()
          }}
          onPointerDownOutside={(event) => event.preventDefault()}
          className="w-[min(97.5vw,1160px)] max-w-[1160px] h-[min(90vh,820px)] p-0 overflow-hidden"
        >
        <div className="h-full min-h-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="min-w-0 text-xl md:text-2xl truncate">
                Asistente de Kit de Marca
              </DialogTitle>
              <div className="flex items-start gap-2 shrink-0">
                <div className="text-sm text-muted-foreground font-medium whitespace-nowrap pt-1">
                  {headerStepLabel}
                </div>
                {!forceMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 -mt-1"
                    onClick={closeWizard}
                    aria-label="Cerrar asistente"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <DialogDescription className="text-base">
              Te guiamos paso a paso.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 py-5 overflow-y-auto flex-1 min-h-0">
            <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Completitud real del kit</p>
                <p
                  className={cn(
                    'text-xs font-semibold',
                    canFinishWizard ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  )}
                >
                  {completionClamped}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    canFinishWizard ? 'bg-emerald-500' : 'bg-amber-500'
                  )}
                  style={{ width: `${completionClamped}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Este porcentaje sube con lo que completas manualmente y también con datos autocompletados al analizar la URL.
              </p>
            </div>

            {step === 'intro' && (
              <section className="rounded-2xl border border-border/70 bg-muted/25 p-6 md:p-8 space-y-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-6 h-6 text-primary mt-1" />
                  <div className="space-y-3">
                    {forceMode ? (
                      <>
                        <p className="font-semibold text-2xl leading-tight">Tu kit de marca es necesario</p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          Sin un kit por encima del 70% no se desbloquean Imagen ni el resto de modulos.
                        </p>
                        <p className="text-base text-muted-foreground">
                          Completa este asistente y sigues directo al editor.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-2xl leading-tight">Vamos a crear un nuevo kit de marca</p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          Te guiaremos paso a paso para tenerlo listo rapidamente.
                        </p>
                        <p className="text-base text-muted-foreground">
                          Puedes cerrar este asistente cuando quieras.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </section>
            )}

            {step === 'name' && (
              <section className="space-y-4">
                <p className="text-base text-muted-foreground">Escribe el nombre de tu marca.</p>
                <Input
                  value={brand.brand_name || ''}
                  onChange={(e) => onUpdateBrandName(e.target.value)}
                  placeholder="Ej: Mi Marca"
                  className="h-12 text-base"
                />
              </section>
            )}

            {step === 'url' && (
              <section className="space-y-5">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Paso opcional: analiza tu web</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Si pones tu web, intentaremos extraer logos, colores, tipografias y textos automaticamente.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Direccion de tu pagina web
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={visibleUrlValue}
                      onChange={(e) => onUpdateUrl(e.target.value)}
                      placeholder="https://tuweb.com"
                      className="h-11 text-base"
                    />
                    <Button variant="outline" disabled={!canAnalyze} onClick={handleAnalyzeClick} className="h-11 text-base">
                      Analizar URL
                    </Button>
                  </div>
                </div>

                {invalidUrl && (
                  <p className="text-xs text-destructive">
                    Revisa la URL. Ejemplo válido: `https://tuweb.com`.
                  </p>
                )}

                {hasUrlValue && canAnalyze && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Formato de URL correcto. Puedes pulsar <span className="font-medium">Analizar URL</span> o <span className="font-medium">Siguiente</span> para empezar el análisis.
                  </p>
                )}

                <div className="rounded-lg border border-dashed border-border/70 p-3">
                  <p className="text-xs text-muted-foreground">
                    Si ahora no tienes web, puedes continuar con <span className="font-medium text-foreground">Siguiente</span> y completar el kit manualmente.
                  </p>
                </div>

              </section>
            )}

            {step === 'post-analysis' && (
              <section className="rounded-2xl border border-border/70 bg-muted/25 p-6 md:p-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-1" />
                  <div className="space-y-3">
                    <p className="font-semibold text-xl leading-tight">Hemos preparado una base de tu kit con la web</p>
                    <p className="text-base text-muted-foreground">
                      En los siguientes pasos verás logos, colores, textos y otros datos detectados automáticamente.
                    </p>
                    <p className="text-base text-muted-foreground">
                      Tu papel ahora es revisarlo: puedes dejarlo como está, corregirlo o añadir lo que falte.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {step === 'logos' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <ImageIcon className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Revisa los logos detectados o sube los tuyos.</p>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => logoInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      logoInputRef.current?.click()
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDraggingLogos(true)
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault()
                    setIsDraggingLogos(false)
                  }}
                  onDrop={async (event) => {
                    event.preventDefault()
                    setIsDraggingLogos(false)
                    await handleLogoFiles(event.dataTransfer.files)
                  }}
                  className={cn(
                    'rounded-xl border-2 border-dashed p-4 cursor-pointer transition-colors bg-muted/20',
                    isDraggingLogos ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Arrastra logos aquí o haz clic para subir</p>
                      <p className="text-xs text-muted-foreground">{currentLogos.length} / 6 logos</p>
                    </div>
                  </div>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const inputEl = e.currentTarget
                    const files = inputEl.files
                    if (!files || files.length === 0) return
                    try {
                      await handleLogoFiles(files)
                    } finally {
                      if (inputEl) inputEl.value = ''
                    }
                  }}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
                  {currentLogos.length === 0 && (
                    <div className="col-span-full text-sm text-muted-foreground border border-dashed border-border rounded-lg p-3">
                      No hay logos aún. Puedes subir uno o varios.
                    </div>
                  )}
                  {currentLogos.map((logo, index) => (
                    <div key={`${logo.url}-${index}`} className="rounded-lg border border-border overflow-hidden bg-card">
                      <div className="h-20 transparency-grid bg-muted/20">
                        <img
                          src={logo.url}
                          alt={`Logo ${index + 1}`}
                          className="w-full h-full object-contain p-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                        />
                      </div>
                      <div className="p-2 flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => onRemoveLogo(index)}
                          aria-label="Eliminar logo"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step === 'colors' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <Palette className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Ajusta tu paleta. Texto, Fondo y hasta 5 acentos.</p>
                </div>

                <div className="grid grid-cols-[auto_auto_auto] items-start gap-x-2 gap-y-3">
                  <div
                    className={cn(
                      'w-[64px] flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-colors',
                      draggedColorSource && draggedColorSource.role !== 'Texto' ? 'bg-primary/5 border border-primary/20' : ''
                    )}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault()
                      if (!draggedColorSource) return
                      moveOrSwapRole(draggedColorSource.role, draggedColorSource.index, 'Texto')
                      setDraggedColorSource(null)
                    }}
                  >
                    <RoleColorSwatch
                      color={groupedColors.Texto[0]?.color || '#111111'}
                      onCommit={(nextColor) => {
                        const idx = ensureRoleColor('Texto', nextColor)
                        if (idx !== null) onUpdateColor(idx, nextColor)
                      }}
                      onEyedropper={() => {
                        const idx = ensureRoleColor('Texto', '#111111')
                        if (idx !== null) void handleEyedropperForIndex(idx)
                      }}
                      draggable={Boolean(groupedColors.Texto[0])}
                      onDragStart={() => {
                        const idx = groupedColors.Texto[0]?.index
                        if (idx === undefined) return
                        setDraggedColorSource({ role: 'Texto', index: idx })
                      }}
                      onDragEnd={() => setDraggedColorSource(null)}
                    />
                    <span className="text-xs text-muted-foreground">Texto</span>
                  </div>

                  <div
                    className={cn(
                      'w-[64px] flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-colors',
                      draggedColorSource && draggedColorSource.role !== 'Fondo' ? 'bg-primary/5 border border-primary/20' : ''
                    )}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault()
                      if (!draggedColorSource) return
                      moveOrSwapRole(draggedColorSource.role, draggedColorSource.index, 'Fondo')
                      setDraggedColorSource(null)
                    }}
                  >
                    <RoleColorSwatch
                      color={groupedColors.Fondo[0]?.color || '#ffffff'}
                      onCommit={(nextColor) => {
                        const idx = ensureRoleColor('Fondo', nextColor)
                        if (idx !== null) onUpdateColor(idx, nextColor)
                      }}
                      onEyedropper={() => {
                        const idx = ensureRoleColor('Fondo', '#ffffff')
                        if (idx !== null) void handleEyedropperForIndex(idx)
                      }}
                      draggable={Boolean(groupedColors.Fondo[0])}
                      onDragStart={() => {
                        const idx = groupedColors.Fondo[0]?.index
                        if (idx === undefined) return
                        setDraggedColorSource({ role: 'Fondo', index: idx })
                      }}
                      onDragEnd={() => setDraggedColorSource(null)}
                    />
                    <span className="text-xs text-muted-foreground">Fondo</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 min-w-0 rounded-xl p-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {groupedColors.Acento.slice(0, 5).map((accent) => (
                        <div
                          key={accent.index}
                          className={cn(
                            'relative inline-flex items-center group/accent rounded-full',
                            draggedColorSource && draggedColorSource.index !== accent.index ? 'ring-2 ring-primary/20' : ''
                          )}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault()
                            if (!draggedColorSource) return
                            moveOrSwapRole(draggedColorSource.role, draggedColorSource.index, 'Acento', accent.index)
                            setDraggedColorSource(null)
                          }}
                        >
                          <RoleColorSwatch
                            color={accent.color}
                            onCommit={(nextColor) => {
                              onUpdateColorRole(accent.index, 'Acento')
                              onUpdateColor(accent.index, nextColor)
                            }}
                            onEyedropper={() => void handleEyedropperForIndex(accent.index)}
                            draggable
                            onDragStart={() => setDraggedColorSource({ role: 'Acento', index: accent.index })}
                            onDragEnd={() => setDraggedColorSource(null)}
                          />
                          <button
                            type="button"
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border border-border/70 text-muted-foreground hover:text-destructive hover:border-destructive/50 inline-flex items-center justify-center shadow-sm opacity-0 group-hover/accent:opacity-100 group-focus-within/accent:opacity-100 transition-opacity"
                            onClick={() => onRemoveColor(accent.index)}
                            title="Quitar acento"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {groupedColors.Acento.length < 5 && (
                        <AddAccentSwatch
                          onAdd={(nextColor) => {
                            const accentCount = groupedColors.Acento.length
                            if (accentCount >= 5) return
                            const previousLength = brand.colors?.length || 0
                            onAddColor()
                            setPendingRoleAdd({ role: 'Acento', color: nextColor, previousLength })
                          }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">Acentos</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Como se usan estos roles</p>
                  <p className="text-xs text-muted-foreground">
                    El color de <span className="font-medium text-foreground">Texto</span> se usara para titulares y textos en las imagenes generadas.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    El color de <span className="font-medium text-foreground">Fondo</span> sera el tono base predominante en las imagenes generadas.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Los <span className="font-medium text-foreground">Acentos</span> se usaran para resaltar elementos destacados.
                  </p>
                  <p className="text-xs text-muted-foreground pt-1">
                    Arrastra un color sobre otro para intercambiar su rol (Texto, Fondo o Acento).
                  </p>
                </div>
              </section>
            )}

            {step === 'contact' && (
              <section className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Completa tus datos de contacto: email, teléfonos, direcciones y redes sociales.
                </p>
                <ContactSocialCard
                  socialLinks={brand.social_links || []}
                  emails={brand.emails || []}
                  phones={brand.phones || []}
                  addresses={brand.addresses || []}
                  onUpdate={onUpdateContact}
                />
              </section>
            )}

            {step === 'brand-context' && (
              <section className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Explica en pocas lineas que hace tu marca, para quien y con que enfoque.
                </p>
                <BrandContextCard
                  context={brand.business_overview || brand.text_assets?.brand_context || ''}
                  onUpdate={onUpdateBrandContext}
                  minHeightClassName="min-h-[220px]"
                />
              </section>
            )}

            {step === 'typography' && (
              <section className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-sm font-medium text-foreground">No te preocupes si no conoces Google Fonts.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Elige una fuente para titulares y otra para párrafos. Puedes probar y cambiar en cualquier momento.
                  </p>
                </div>
                <TypographySection
                  fonts={fonts}
                  tagline={brand.tagline || ''}
                  guidedMode
                  onAddFont={onAddFont}
                  onSelectFontForRole={onSelectFontForRole}
                  onRemoveFont={onRemoveFont}
                  onUpdateRole={onUpdateFontRole}
                />
              </section>
            )}

            {step === 'slogan' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <Quote className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Define tu eslogan principal.</p>
                </div>
                <Input
                  value={brand.tagline || ''}
                  onChange={(event) => onUpdateTagline(event.target.value)}
                  placeholder="Ej: Tu marca, tu estilo"
                  className="h-11 text-base"
                />
              </section>
            )}

            {step === 'values' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Añade los valores clave de tu marca.</p>
                </div>
                <div className="space-y-2">
                  {(brand.brand_values || []).map((value, index) => (
                    <div key={`value-${index}`} className="flex items-center gap-2">
                      <Input
                        value={value}
                        onChange={(event) => onUpdateValue(index, event.target.value)}
                        placeholder="Valor de marca"
                        className="h-10 text-sm"
                      />
                      <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onRemoveValue(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="h-9 text-sm" onClick={onAddValue}>
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir valor
                  </Button>
                </div>
              </section>
            )}

            {step === 'visual-styles' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <Type className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Define estilos visuales para tus piezas.</p>
                </div>
                <div className="space-y-2">
                  {(brand.visual_aesthetic || []).map((style, index) => (
                    <div key={`style-${index}`} className="flex items-center gap-2">
                      <Input
                        value={style}
                        onChange={(event) => onUpdateAesthetic(index, event.target.value)}
                        placeholder="Ej: Minimalista, editorial, premium..."
                        className="h-10 text-sm"
                      />
                      <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onRemoveAesthetic(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="h-9 text-sm" onClick={onAddAesthetic}>
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir estilo
                  </Button>
                </div>
              </section>
            )}

            {step === 'tone' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Selecciona el tono de voz de tu marca.</p>
                </div>
                <div className="space-y-2">
                  {(brand.tone_of_voice || []).map((tone, index) => (
                    <div key={`tone-${index}`} className="flex items-center gap-2">
                      <Input
                        value={tone}
                        onChange={(event) => onUpdateTone(index, event.target.value)}
                        placeholder="Ej: Cercano, profesional, directo..."
                        className="h-10 text-sm"
                      />
                      <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onRemoveTone(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="h-9 text-sm" onClick={onAddTone}>
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir tono
                  </Button>
                </div>
              </section>
            )}

            {step === 'marketing-hooks' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <Megaphone className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Define titulares de marketing para campañas.</p>
                </div>
                <div className="space-y-2">
                  {textAssets.marketing_hooks.map((hook, index) => (
                    <div key={`hook-${index}`} className="flex items-start gap-2">
                      <textarea
                        value={hook}
                        onChange={(event) => {
                          const nextHooks = [...textAssets.marketing_hooks]
                          nextHooks[index] = event.target.value
                          onChangeTextAssets({ ...textAssets, marketing_hooks: nextHooks })
                        }}
                        className="w-full min-h-[88px] rounded-md border border-border bg-background px-3 py-2 text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 mt-1"
                        onClick={() => {
                          const nextHooks = textAssets.marketing_hooks.filter((_, itemIndex) => itemIndex !== index)
                          onChangeTextAssets({ ...textAssets, marketing_hooks: nextHooks })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm"
                    onClick={() => onChangeTextAssets({ ...textAssets, marketing_hooks: [...textAssets.marketing_hooks, 'Nuevo titular'] })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir titular
                  </Button>
                </div>
              </section>
            )}

            {step === 'ctas' && (
              <section className="space-y-4">
                <div className="flex items-start gap-2">
                  <MousePointerClick className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-base text-muted-foreground">Añade llamadas a la acción (CTAs).</p>
                </div>
                <p className="text-base text-muted-foreground">
                  Estas frases se usarán en botones y cierres de piezas.
                </p>
                <div className="space-y-2">
                  {textAssets.ctas.map((cta, index) => (
                    <div key={`cta-${index}`} className="flex items-center gap-2">
                      <Input
                        value={cta}
                        onChange={(event) => {
                          const nextCtas = [...textAssets.ctas]
                          nextCtas[index] = event.target.value
                          onChangeTextAssets({ ...textAssets, ctas: nextCtas })
                        }}
                        placeholder="Ej: Reservar ahora"
                        className="h-10 text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => {
                          const nextCtas = textAssets.ctas.filter((_, itemIndex) => itemIndex !== index)
                          onChangeTextAssets({ ...textAssets, ctas: nextCtas })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm"
                    onClick={() => onChangeTextAssets({ ...textAssets, ctas: [...textAssets.ctas, 'Nuevo CTA'] })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir CTA
                  </Button>
                </div>
              </section>
            )}

            {step === 'image-gallery' && (
              <section className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Revisa las imágenes detectadas y sube las que quieras conservar en tu kit.
                </p>
                <ImageGallery
                  images={brand.images || []}
                  isUploading={isUploadingImages}
                  onUpload={onUploadImages}
                  onRemoveImage={onRemoveImage}
                  onOpenLightbox={onOpenLightbox}
                />
              </section>
            )}

            {step === 'done' && (
              <section className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-base">Base del kit lista</p>
                    <p className="text-base text-muted-foreground">Ya puedes seguir afinando en el editor.</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Resumen: {brand.brand_name?.trim() ? 'nombre definido,' : 'nombre pendiente,'}{' '}
                  {normalizeUrl(brand.url || '') ? 'URL válida,' : 'sin URL,'}{' '}
                  {(currentLogos.length || 0) > 0 ? `${currentLogos.length} logos,` : 'sin logos,'}{' '}
                  {(brand.colors?.length || 0)} colores,{' '}
                  {(brand.fonts?.length || 0)} tipografías,{' '}
                  {(brand.images?.length || 0)} imágenes.
                </div>
                {!canFinishWizard && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Te falta {completionMissing}% para llegar al {minimumCompletionToFinish}% minimo y desbloquear Imagen.
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>

          <div className="px-6 py-4 border-t border-border/50 shrink-0">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goBack} disabled={stepIndex === 0} className="h-11 text-base">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              </div>
              <div className="flex items-center justify-end gap-2 flex-wrap">
                {step !== 'done' ? (
                  <Button
                    onClick={handleNextClick}
                    className="h-11 text-base"
                    disabled={previewLoading || previewAnalyzing}
                  >
                    {step === 'url' && hasUrlValue ? 'Analizar y seguir' : 'Siguiente'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={completeWizard} className="h-11 text-base" disabled={!canFinishWizard}>
                    {canFinishWizard ? 'Ir al editor' : `Te falta ${completionMissing}%`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <Dialog
        open={previewOpen}
        onOpenChange={(next) => {
          if (!next && (previewLoading || previewAnalyzing)) return
          setPreviewOpen(next)
        }}
      >
        <DialogContent
          showCloseButton={false}
          onEscapeKeyDown={(event) => {
            if (previewLoading || previewAnalyzing) event.preventDefault()
          }}
          onPointerDownOutside={(event) => {
            if (previewLoading || previewAnalyzing) event.preventDefault()
          }}
          className="w-[min(96vw,980px)] max-w-[980px]"
        >
          <DialogHeader>
            <DialogTitle>Confirma tu web</DialogTitle>
            <DialogDescription>
              {previewData?.url || currentUrl}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {previewLoading && (
              <div className="rounded-lg border border-border p-6 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparando vista previa...
              </div>
            )}

            {previewAnalyzing && (
              <div className="rounded-lg border border-border p-6 space-y-4 bg-muted/20">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Estamos analizando tu web. Esto puede tardar unos segundos.
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${analyzingProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ANALYZING_MESSAGES[analyzingMessageIndex]}
                  </p>
                </div>
              </div>
            )}

            {!previewLoading && previewData?.screenshotUrl && (
              <div className="rounded-lg border border-border overflow-hidden bg-muted/20 flex items-center justify-center p-2">
                <img
                  src={previewData.screenshotUrl}
                  alt="Vista previa de la web"
                  className="w-full max-h-[520px] object-contain rounded-md"
                />
              </div>
            )}

            {!previewLoading && !previewData?.screenshotUrl && (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No pudimos mostrar la captura ahora, pero puedes confirmar si la URL es correcta.
              </div>
            )}

            {!previewLoading && previewData?.title && (
              <p className="text-sm text-muted-foreground">
                Titulo detectado: <span className="text-foreground font-medium">{previewData.title}</span>
              </p>
            )}

            {!previewLoading && previewError && (
              <p className="text-sm text-destructive">{previewError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)} disabled={previewLoading || previewAnalyzing}>
              No, corregir URL
            </Button>
            <Button onClick={confirmAnalyze} disabled={previewLoading || previewAnalyzing || !previewData?.url}>
              {previewAnalyzing ? 'Analizando...' : 'Sí, esta es mi web'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
