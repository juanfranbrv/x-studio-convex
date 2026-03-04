'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import type { Id } from '@/../convex/_generated/dataModel'
import type { VisionAnalysis } from '@/lib/creation-flow-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type PresetRow = {
  _id: Id<'style_presets'>
  name: string
  image_url: string
  analysis: VisionAnalysis
  is_active: boolean
  sort_order: number
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

interface StylePresetsManagerProps {
  adminEmail: string
}

const LOCAL_STORAGE_STYLE_MODEL_KEY = 'x-studio-admin-style-analysis-model'
const FALLBACK_INTELLIGENCE_MODEL = 'wisdom/gemini-3-flash-preview'

const STYLE_NAME_RULES: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bcommercial\b|\badvertising\b/, label: 'Comercial' },
  { pattern: /\beditorial\b/, label: 'Editorial' },
  { pattern: /\bproduct\b|\bpackshot\b/, label: 'Producto' },
  { pattern: /\banime\b|\bmanga\b|\bghibli\b/, label: 'Anime' },
  { pattern: /\bcomic\b|\bpop art\b|\bhalftone\b/, label: 'Comic' },
  { pattern: /\billustrat/i, label: 'Ilustracion' },
  { pattern: /\bvector\b|\bflat design\b/, label: 'Vectorial' },
  { pattern: /\bwatercolor\b|\bacuarela\b/, label: 'Acuarela' },
  { pattern: /\boil painting\b|\bpainterly\b/, label: 'Pictorico' },
  { pattern: /\b3d\b|\bcgi\b|\brender\b/, label: 'Render' },
  { pattern: /\bphotoreal\b|\bphoto\b|\bphotograph/i, label: 'Fotografico' },
  { pattern: /\bcinematic\b|\bfilm\b|\bmovie\b/, label: 'Cinematico' },
  { pattern: /\bminimal\b/, label: 'Minimalista' },
  { pattern: /\bvintage\b|\bretro\b/, label: 'Retro' },
  { pattern: /\bnoir\b/, label: 'Noir' },
  { pattern: /\bhigh contrast\b|\bdramatic contrast\b/, label: 'Contraste' },
  { pattern: /\bpastel\b/, label: 'Pastel' },
]

const NAME_STOPWORDS = new Set([
  'this', 'visual', 'style', 'is', 'with', 'and', 'the', 'for', 'that', 'from', 'into', 'while',
  'una', 'uno', 'unas', 'unos', 'con', 'para', 'como', 'desde', 'hacia', 'entre', 'sobre', 'estilo',
  'look', 'mood', 'image', 'images', 'render', 'rendered', 'quality',
])

function sentenceCase(input: string): string {
  const cleaned = input.trim()
  if (!cleaned) return ''
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
}

function synthesizeLabelFromKeywords(paragraph: string): string {
  const cleaned = paragraph
    .toLowerCase()
    .replace(/\bthis visual style is\b/g, ' ')
    .replace(/\bvisual style\b/g, ' ')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) return ''

  const tokens = cleaned
    .split(' ')
    .filter((token) => token.length >= 4)
    .filter((token) => !NAME_STOPWORDS.has(token))

  const unique = Array.from(new Set(tokens)).slice(0, 2)
  if (unique.length === 0) return ''
  return unique.map(sentenceCase).join(' · ')
}

function normalizeSingleWordName(input: string): string {
  const cleaned = input
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return ''
  const first = cleaned.split(' ')[0] || ''
  return sentenceCase(first)
}

function buildPresetNameFromAnalysis(analysis: VisionAnalysis | null, fallback = 'Estilo'): string {
  if (!analysis) return fallback

  const paragraph = (analysis.keywords?.[0] || '').trim()
  const normalized = paragraph.toLowerCase()

  for (const rule of STYLE_NAME_RULES) {
    if (rule.pattern.test(normalized)) {
      return rule.label
    }
  }

  const subject = (analysis.subjectLabel || '').trim()
  if (subject && subject.toUpperCase() !== 'N/A') {
    const normalizedSubject = normalizeSingleWordName(subject)
    if (normalizedSubject) return normalizedSubject
  }

  const synthesized = synthesizeLabelFromKeywords(paragraph)
  if (synthesized) {
    const normalizedSynthesized = normalizeSingleWordName(synthesized)
    if (normalizedSynthesized) return normalizedSynthesized
  }

  return normalizeSingleWordName(fallback) || 'Estilo'
}

function extractStylePrompt(analysis: VisionAnalysis | null): string {
  const firstKeyword = analysis?.keywords?.[0]
  return typeof firstKeyword === 'string' ? firstKeyword.trim() : ''
}

export function StylePresetsManager({ adminEmail }: StylePresetsManagerProps) {
  const { toast } = useToast()
  const presets = useQuery(api.stylePresets.listAll, { admin_email: adminEmail }) as PresetRow[] | undefined
  const modelCosts = useQuery(api.economic.listModelCosts, { admin_email: adminEmail }) as Array<{
    _id: Id<'model_costs'>
    model: string
    kind: 'intelligence' | 'image'
    active: boolean
  }> | undefined
  const aiConfig = useQuery(api.settings.getAIConfig, {})
  const createPreset = useMutation(api.stylePresets.create)
  const updatePreset = useMutation(api.stylePresets.update)
  const removePreset = useMutation(api.stylePresets.remove)

  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newActive, setNewActive] = useState(true)
  const [newSortOrder, setNewSortOrder] = useState(0)
  const [newImageDataUrl, setNewImageDataUrl] = useState('')
  const [newAnalysis, setNewAnalysis] = useState<VisionAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [reanalyzingId, setReanalyzingId] = useState<string | null>(null)
  const [styleAnalysisModel, setStyleAnalysisModel] = useState<string>('')

  const intelligenceModelOptions = useMemo(() => {
    const models = (modelCosts || [])
      .filter((row) => row.kind === 'intelligence' && row.active !== false)
      .map((row) => row.model?.trim())
      .filter((value): value is string => Boolean(value))

    const uniqueModels = Array.from(new Set(models))
    if (uniqueModels.length > 0) return uniqueModels

    const fallback = String(aiConfig?.intelligenceModel || '').trim()
    return [fallback || FALLBACK_INTELLIGENCE_MODEL]
  }, [aiConfig?.intelligenceModel, modelCosts])

  useEffect(() => {
    if (styleAnalysisModel) return
    if (typeof window === 'undefined') return
    const persisted = window.localStorage.getItem(LOCAL_STORAGE_STYLE_MODEL_KEY)?.trim()
    if (persisted && intelligenceModelOptions.includes(persisted)) {
      setStyleAnalysisModel(persisted)
      return
    }
    setStyleAnalysisModel(intelligenceModelOptions[0] || FALLBACK_INTELLIGENCE_MODEL)
  }, [intelligenceModelOptions, styleAnalysisModel])

  useEffect(() => {
    if (!styleAnalysisModel) return
    if (intelligenceModelOptions.includes(styleAnalysisModel)) return
    const next = intelligenceModelOptions[0] || FALLBACK_INTELLIGENCE_MODEL
    setStyleAnalysisModel(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_STYLE_MODEL_KEY, next)
    }
  }, [intelligenceModelOptions, styleAnalysisModel])

  const updateStyleAnalysisModel = (nextModel: string) => {
    setStyleAnalysisModel(nextModel)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_STYLE_MODEL_KEY, nextModel)
    }
  }

  const dataUrlToPayload = (dataUrl: string) => {
    const match = /^data:([^;]+);base64,/.exec(dataUrl)
    const mimeType = match?.[1] || 'image/jpeg'
    const base64 = dataUrl.split(',')[1] || ''
    return { mimeType, base64 }
  }

  const urlToPayload = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('No se pudo descargar la imagen para analizar')
    }
    const buffer = await response.arrayBuffer()
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
    const base64 = btoa(binary)
    const mimeType = response.headers.get('content-type') || 'image/jpeg'
    return { mimeType, base64 }
  }

  const resolveImagePayload = async (imageValue: string) => {
    if (imageValue.startsWith('data:')) return dataUrlToPayload(imageValue)
    return await urlToPayload(imageValue)
  }

  const nextSortOrder = useMemo(() => {
    const maxOrder = (presets || []).reduce((max, item) => Math.max(max, item.sort_order || 0), 0)
    return maxOrder + 1
  }, [presets])

  const analyzeNewImage = async () => {
    if (!newImageDataUrl) {
      toast({ title: 'Falta imagen', description: 'Sube una imagen de estilo primero.', variant: 'destructive' })
      return
    }

    setIsAnalyzing(true)
    try {
      const match = /^data:([^;]+);base64,/.exec(newImageDataUrl)
      const mimeType = match?.[1] || 'image/jpeg'
      const base64 = newImageDataUrl.split(',')[1]

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          intelligenceModel: styleAnalysisModel || undefined,
        }),
      })

      const result = await response.json()
      if (!result?.success || !result?.data) {
        throw new Error(result?.error || 'No se pudo analizar la imagen')
      }

      const parsed = result.data as VisionAnalysis
      setNewAnalysis(parsed)
      setNewName((prev) => (prev.trim() ? prev : buildPresetNameFromAnalysis(parsed)))
      toast({ title: 'Analisis completado', description: 'Texto de estilo listo para guardar.' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      toast({ title: 'Error al analizar', description: message, variant: 'destructive' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reanalyzePreset = async (preset: PresetRow) => {
    setReanalyzingId(String(preset._id))
    setSavingId(String(preset._id))
    try {
      const { mimeType, base64 } = await resolveImagePayload(preset.image_url)
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          intelligenceModel: styleAnalysisModel || undefined,
        }),
      })

      const result = await response.json()
      if (!result?.success || !result?.data) {
        throw new Error(result?.error || 'No se pudo reanalizar la imagen')
      }

      const parsed = result.data as VisionAnalysis
      const normalizedName = buildPresetNameFromAnalysis(parsed)
      await updatePreset({
        admin_email: adminEmail,
        id: preset._id,
        name: normalizedName,
        analysis: parsed,
      })
      toast({ title: 'Estilo reanalizado', description: `Análisis y nombre actualizados: ${normalizedName}` })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      toast({ title: 'Error al reanalizar', description: message, variant: 'destructive' })
    } finally {
      setSavingId(null)
      setReanalyzingId(null)
    }
  }

  const createNewPreset = async () => {
    if (!newImageDataUrl || !newAnalysis) {
      toast({ title: 'Faltan datos', description: 'Sube una imagen y analizala antes de guardar.', variant: 'destructive' })
      return
    }

    const finalName = normalizeSingleWordName(newName) || buildPresetNameFromAnalysis(newAnalysis)

    setIsCreating(true)
    try {
      await createPreset({
        admin_email: adminEmail,
        name: finalName,
        image_url: newImageDataUrl,
        analysis: newAnalysis,
        is_active: newActive,
        sort_order: newSortOrder || nextSortOrder,
      })

      setNewName('')
      setNewImageDataUrl('')
      setNewAnalysis(null)
      setNewActive(true)
      setNewSortOrder(nextSortOrder + 1)
      toast({ title: 'Estilo creado' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      toast({ title: 'Error al crear', description: message, variant: 'destructive' })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo estilo predefinido</CardTitle>
          <CardDescription>Sube una imagen, analizala y guarda el texto de estilo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Se autocompleta tras analizar"
              />
            </div>
            <div className="space-y-2">
              <Label>Modelo de análisis (solo Estilos)</Label>
              <Select
                value={styleAnalysisModel || intelligenceModelOptions[0] || FALLBACK_INTELLIGENCE_MODEL}
                onValueChange={updateStyleAnalysisModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona modelo para analizar estilos" />
                </SelectTrigger>
                <SelectContent>
                  {intelligenceModelOptions.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Orden</Label>
              <Input
                type="number"
                value={newSortOrder || nextSortOrder}
                onChange={(e) => setNewSortOrder(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label>Activo</Label>
            <Switch checked={newActive} onCheckedChange={setNewActive} />
          </div>

          <div className="space-y-2">
            <Label>Imagen</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const dataUrl = await fileToDataUrl(file)
                setNewImageDataUrl(dataUrl)
                setNewAnalysis(null)
              }}
            />
          </div>

          {newImageDataUrl ? (
            <img src={newImageDataUrl} alt="Preview estilo" className="w-40 h-40 rounded-lg object-cover border" />
          ) : null}

          {newAnalysis ? (
            <div className="space-y-2">
              <Label>Texto de estilo (se inyecta en el prompt)</Label>
              <div className="rounded-md border bg-muted/20 p-3 text-sm leading-relaxed whitespace-pre-wrap max-h-40 overflow-auto">
                {extractStylePrompt(newAnalysis) || 'Sin texto de estilo generado.'}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={analyzeNewImage} disabled={!newImageDataUrl || isAnalyzing}>
              {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Analizar estilo
            </Button>
            <Button type="button" onClick={createNewPreset} disabled={isCreating || !newAnalysis}>
              {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Guardar estilo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
          <CardDescription>{(presets || []).length} estilos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(presets || []).map((preset) => (
              <div key={preset._id} className="border rounded-xl p-3 space-y-3">
                <div className="flex items-start gap-3">
                  <img src={preset.image_url} alt={preset.name} className="w-20 h-20 rounded-lg object-cover border shrink-0" />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    key={`${String(preset._id)}-${preset.name}`}
                    defaultValue={preset.name}
                    onBlur={async (e) => {
                      const value = e.target.value.trim()
                      if (!value || value === preset.name) return
                      setSavingId(String(preset._id))
                      try {
                        await updatePreset({ admin_email: adminEmail, id: preset._id, name: value })
                      } finally {
                        setSavingId(null)
                      }
                    }}
                  />

                  <Input
                    type="number"
                    defaultValue={preset.sort_order}
                    onBlur={async (e) => {
                      const value = Number(e.target.value || preset.sort_order)
                      if (value === preset.sort_order) return
                      setSavingId(String(preset._id))
                      try {
                        await updatePreset({ admin_email: adminEmail, id: preset._id, sort_order: value })
                      } finally {
                        setSavingId(null)
                      }
                    }}
                  />

                    <div className="sm:col-span-2 rounded-md border bg-muted/20 p-2 text-xs leading-relaxed whitespace-pre-wrap min-h-32 max-h-44 overflow-auto">
                      {extractStylePrompt(preset.analysis) || 'Sin texto de estilo'}
                    </div>

                    <div className="flex items-center gap-3">
                      <Label>Activo</Label>
                      <Switch
                        checked={preset.is_active}
                        onCheckedChange={async (checked) => {
                          setSavingId(String(preset._id))
                          try {
                            await updatePreset({ admin_email: adminEmail, id: preset._id, is_active: checked })
                          } finally {
                            setSavingId(null)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  {savingId === String(preset._id) ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void reanalyzePreset(preset)}
                    disabled={Boolean(reanalyzingId)}
                  >
                    {reanalyzingId === String(preset._id)
                      ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      : <RefreshCw className="w-4 h-4 mr-1" />
                    }
                    Reanalizar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={Boolean(reanalyzingId)}
                    size="sm"
                    onClick={async () => {
                      await removePreset({ admin_email: adminEmail, id: preset._id })
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {(presets || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay estilos aun.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
