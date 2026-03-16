'use client'

import { Loader2 } from'@/components/ui/spinner'
import { useCallback, useState } from'react'
import { useTranslation } from'react-i18next'
import { AlertTriangle, ImageIcon, Sparkles, Wand2, X } from'lucide-react'
import { Button } from'@/components/ui/button'
import { Textarea } from'@/components/ui/textarea'
import { Label } from'@/components/ui/label'
import { Switch } from'@/components/ui/switch'
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from'@/components/ui/select'
import { cn } from'@/lib/utils'

export interface VideoSettings {
 prompt: string
 negativePrompt?: string
 startFrame?: string
 endFrame?: string
 aspectRatio:'16:9' |'9:16'
 resolution:'720p' |'1080p'
 durationSeconds: 4 | 6 | 8
 useFrameMode: boolean
}

interface VideoControlsPanelProps {
 onGenerate: (settings: VideoSettings) => void
 onCancelGenerate?: () => void
 isGenerating: boolean
 isCancelingGenerate?: boolean
 progress?: string
 maintenanceMode?: boolean
}

export function VideoControlsPanel({
 onGenerate,
 onCancelGenerate,
 isGenerating,
 isCancelingGenerate = false,
 progress,
 maintenanceMode = false,
}: VideoControlsPanelProps) {
 const { t } = useTranslation('video')
 const [prompt, setPrompt] = useState('')
 const [useFrameMode, setUseFrameMode] = useState(false)
 const [startFrame, setStartFrame] = useState<string | undefined>()
 const [endFrame, setEndFrame] = useState<string | undefined>()
 const [aspectRatio, setAspectRatio] = useState<'16:9' |'9:16'>('16:9')
 const [resolution, setResolution] = useState<'720p' |'1080p'>('720p')
 const [durationSeconds, setDurationSeconds] = useState<4 | 6 | 8>(4)

 const handleImageUpload = useCallback((
 e: React.ChangeEvent<HTMLInputElement>,
 setImage: (url: string | undefined) => void
 ) => {
 if (maintenanceMode) return
 const file = e.target.files?.[0]
 if (!file) return

 const reader = new FileReader()
 reader.onload = (event) => setImage(event.target?.result as string)
 reader.readAsDataURL(file)
 }, [maintenanceMode])

 const handleGenerate = () => {
 if (maintenanceMode || !prompt.trim()) return
 onGenerate({
 prompt,
 startFrame: useFrameMode ? startFrame : undefined,
 endFrame: useFrameMode ? endFrame : undefined,
 aspectRatio,
 resolution,
 durationSeconds,
 useFrameMode,
 })
 }

 const canGenerate = !maintenanceMode && prompt.trim().length > 0 && !isGenerating

 return (
 <div className={cn(
'flex w-full flex-col border-t border-white/20 bg-white/30 backdrop-blur-xl md:h-full md:w-96 md:border-l md:border-t-0',
 maintenanceMode &&'opacity-90'
 )}>
 <div className="flex-1 space-y-5 overflow-y-auto p-4 md:space-y-6 md:p-6">
 {maintenanceMode ? (
 <div className="rounded-xl border border-amber-300/60 bg-amber-50/90 px-3 py-2.5">
 <p className="flex items-center gap-2 text-[11px] font-semibold text-amber-900">
 <AlertTriangle className="h-3.5 w-3.5" />
 {t('controls.maintenanceBanner')}
 </p>
 </div>
 ) : null}

 {!useFrameMode ? (
 <div className="space-y-3">
 <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
 {t('controls.referenceImage')}
 </Label>
 <ImageUploadBox
 image={startFrame}
 onUpload={(e) => handleImageUpload(e, setStartFrame)}
 onClear={() => setStartFrame(undefined)}
 label={t('controls.clickOrDrop')}
 sublabel={t('controls.imageFormats')}
 disabled={maintenanceMode}
 />
 </div>
 ) : (
 <div className="space-y-3">
 <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
 {t('controls.startEndFrames')}
 </Label>
 <div className="grid grid-cols-2 gap-3">
 <ImageUploadBox
 image={startFrame}
 onUpload={(e) => handleImageUpload(e, setStartFrame)}
 onClear={() => setStartFrame(undefined)}
 label={t('controls.startFrame')}
 sublabel={t('controls.clickOrDrop')}
 compact
 disabled={maintenanceMode}
 />
 <ImageUploadBox
 image={endFrame}
 onUpload={(e) => handleImageUpload(e, setEndFrame)}
 onClear={() => setEndFrame(undefined)}
 label={t('controls.endFrame')}
 sublabel={t('controls.clickOrDrop')}
 compact
 disabled={maintenanceMode}
 />
 </div>
 </div>
 )}

 <div className="flex items-center justify-between py-2">
 <Label className="text-sm font-medium">{t('controls.startEndMode')}</Label>
 <Switch
 checked={useFrameMode}
 onCheckedChange={(checked) => {
 if (maintenanceMode) return
 setUseFrameMode(checked)
 }}
 disabled={maintenanceMode}
 />
 </div>

 <div className="space-y-3">
 <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
 {t('controls.prompt')}
 </Label>
 <div className="relative">
 <Textarea
 placeholder={t('controls.promptPlaceholder')}
 value={prompt}
 onChange={(e) => setPrompt(e.target.value)}
 className="min-h-[120px] resize-none pr-24"
 disabled={maintenanceMode}
 />
 <div className="absolute bottom-3 right-3 flex gap-2">
 <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" disabled>
 <Wand2 className="h-3 w-3" />
 {t('controls.preset')}
 </Button>
 <Button variant="secondary" size="sm" className="h-8 text-xs" disabled>
 {t('controls.promptImprove')}
 </Button>
 </div>
 </div>
 </div>

 <div className="space-y-3">
 <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
 {t('controls.aspectRatio')}
 </Label>
 <div className="flex gap-3">
 <button
 onClick={() => !maintenanceMode && setAspectRatio('16:9')}
 disabled={maintenanceMode}
 className={cn(
'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
 maintenanceMode &&'cursor-not-allowed',
 aspectRatio ==='16:9' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
 )}
 >
 <div className="h-7 w-12 rounded border border-border bg-muted" />
 <span className="text-xs font-medium">16:9</span>
 </button>
 <button
 onClick={() => !maintenanceMode && setAspectRatio('9:16')}
 disabled={maintenanceMode}
 className={cn(
'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
 maintenanceMode &&'cursor-not-allowed',
 aspectRatio ==='9:16' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
 )}
 >
 <div className="h-12 w-7 rounded border border-border bg-muted" />
 <span className="text-xs font-medium">9:16</span>
 </button>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('controls.quality')}</Label>
 <Select
 value={resolution}
 onValueChange={(value) => {
 if (maintenanceMode) return
 setResolution(value as'720p' |'1080p')
 }}
 disabled={maintenanceMode}
 >
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="720p">720p</SelectItem>
 <SelectItem value="1080p">1080p</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-2">
 <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('controls.duration')}</Label>
 <Select
 value={String(durationSeconds)}
 onValueChange={(value) => {
 if (maintenanceMode) return
 setDurationSeconds(Number(value) as 4 | 6 | 8)
 }}
 disabled={maintenanceMode}
 >
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="4">4s</SelectItem>
 <SelectItem value="6">6s</SelectItem>
 <SelectItem value="8">8s</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 </div>

 <div className="border-t border-border/40 p-4 md:p-6">
 <Button
 onClick={handleGenerate}
 disabled={!canGenerate}
 className="h-12 w-full bg-gradient-to-r from-violet-500 to-purple-600 text-base font-semibold hover:from-violet-600 hover:to-purple-700"
 >
 {maintenanceMode ? (
 <>
 <Sparkles className="mr-2 h-5 w-5" />
 {t('controls.underConstruction')}
 </>
 ) : isGenerating ? (
 <>
 <Loader2 className="mr-2 h-5 w-5" />
 {progress || t('processing')}
 </>
 ) : (
 <>
 <Sparkles className="mr-2 h-5 w-5" />
 {t('controls.generate')}
 </>
 )}
 </Button>
 {isGenerating && onCancelGenerate ? (
 <Button
 variant="link"
 size="sm"
 onClick={onCancelGenerate}
 className="mt-2 h-7 px-0 text-[11px] text-muted-foreground hover:text-foreground"
 >
 {isCancelingGenerate ? t('ui.canceling', { defaultValue:'Canceling...' }) : t('ui.stop', { defaultValue:'Stop' })}
 </Button>
 ) : null}
 </div>
 </div>
 )
}

function ImageUploadBox({
 image,
 onUpload,
 onClear,
 label,
 sublabel,
 compact = false,
 disabled = false,
}: {
 image?: string
 onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
 onClear: () => void
 label: string
 sublabel: string
 compact?: boolean
 disabled?: boolean
}) {
 return (
 <div className="relative">
 <label
 className={cn(
'flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all',
 disabled
 ?'cursor-not-allowed border-border bg-muted/50 opacity-70'
 :'cursor-pointer hover:border-primary/50 hover:bg-primary/5',
 image ?'border-primary bg-primary/5' :'border-border',
 compact ?'min-h-[120px] p-4' :'min-h-[160px] p-8'
 )}
 >
 {image ? (
 <img src={image} alt="Preview" className="max-h-32 rounded-lg object-contain" />
 ) : (
 <>
 <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
 <ImageIcon className="h-6 w-6 text-violet-500" />
 </div>
 <p className={cn('text-center font-medium text-foreground', compact ?'text-xs' :'text-sm')}>{label}</p>
 <p className={cn('mt-1 text-center text-muted-foreground', compact ?'text-[10px]' :'text-xs')}>{sublabel}</p>
 </>
 )}
 <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={onUpload} className="hidden" disabled={disabled} />
 </label>
 {image && !disabled ? (
 <button
 onClick={(e) => {
 e.preventDefault()
 onClear()
 }}
 className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
 >
 <X className="h-4 w-4" />
 </button>
 ) : null}
 </div>
 )
}


