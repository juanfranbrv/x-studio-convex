'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconCheck, IconChevronDown, IconChevronUp, IconFingerprint, IconUpload, IconClose } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ReferenceImageRole } from '@/lib/creation-flow-types'
import { useTranslation } from 'react-i18next'

const MAX_REFERENCE_IMAGES = 10
const MAX_AUX_LOGOS = 4

interface AuxiliaryLogosCardProps {
  uploadedImages: string[]
  onUpload: (file: File, roleHint?: ReferenceImageRole) => void
  onRemoveUploadedImage?: (url: string) => void
  brandKitImages?: Array<{ id: string; url: string; name?: string }>
  // Backward compatibility: legacy source based on primary logos
  brandKitLogos?: Array<{ id: string; url: string; name?: string }>
  onRefreshBrandKitContent?: () => Promise<void> | void
  selectedBrandKitImageIds?: string[]
  onToggleBrandKitImage?: (imageId: string) => void
  referenceImageRoles?: Record<string, ReferenceImageRole>
  onReferenceRoleChange?: (imageId: string, role: ReferenceImageRole) => void
}

const isAuxLogoRole = (role?: ReferenceImageRole) => role === 'logo'

export function AuxiliaryLogosCard({
  uploadedImages = [],
  onUpload,
  onRemoveUploadedImage,
  brandKitImages = [],
  brandKitLogos = [],
  onRefreshBrandKitContent,
  selectedBrandKitImageIds = [],
  onToggleBrandKitImage,
  referenceImageRoles = {},
  onReferenceRoleChange,
}: AuxiliaryLogosCardProps) {
  const { t } = useTranslation('common')
  const tt = (key: string, defaultValue: string, options?: Record<string, unknown>) =>
    t(key, { defaultValue, ...options })
  const [collapsed, setCollapsed] = useState(true)
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false)
  const [isRefreshingBrandKit, setIsRefreshingBrandKit] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousUploadedRef = useRef<string[]>(uploadedImages)
  const waitingForUploadedAuxRef = useRef(false)

  const globalReferenceCount = uploadedImages.length + selectedBrandKitImageIds.length

  const auxUploadedIds = useMemo(
    () => uploadedImages.filter((id) => isAuxLogoRole(referenceImageRoles[id])),
    [uploadedImages, referenceImageRoles]
  )

  const auxBrandKitIds = useMemo(
    () => selectedBrandKitImageIds.filter((id) => isAuxLogoRole(referenceImageRoles[id])),
    [selectedBrandKitImageIds, referenceImageRoles]
  )
  const auxTotalCount = auxUploadedIds.length + auxBrandKitIds.length

  const brandKitSources = useMemo(
    () => (brandKitImages.length > 0 ? brandKitImages : brandKitLogos),
    [brandKitImages, brandKitLogos]
  )

  const brandKitAssetMap = useMemo(() => {
    const map = new Map<string, { id: string; url: string; name?: string }>()
    brandKitSources.forEach((item) => map.set(item.id, item))
    return map
  }, [brandKitSources])

  useEffect(() => {
    if (!waitingForUploadedAuxRef.current) {
      previousUploadedRef.current = uploadedImages
      return
    }

    const added = uploadedImages.filter((id) => !previousUploadedRef.current.includes(id))
    if (added.length === 0) return

    added.forEach((id) => onReferenceRoleChange?.(id, 'logo'))
    waitingForUploadedAuxRef.current = false
    previousUploadedRef.current = uploadedImages
  }, [uploadedImages, onReferenceRoleChange])

  const handleUploadFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    const availableGlobal = Math.max(0, MAX_REFERENCE_IMAGES - globalReferenceCount)
    const availableAux = Math.max(0, MAX_AUX_LOGOS - auxTotalCount)
    const available = Math.min(availableGlobal, availableAux)
    if (available <= 0) return

    waitingForUploadedAuxRef.current = true
    imageFiles.slice(0, available).forEach((file) => onUpload(file, 'logo'))
  }, [auxTotalCount, globalReferenceCount, onUpload])

  const removeAuxLogo = useCallback((id: string) => {
    if (uploadedImages.includes(id)) {
      onRemoveUploadedImage?.(id)
      return
    }
    if (selectedBrandKitImageIds.includes(id)) {
      onToggleBrandKitImage?.(id)
    }
  }, [onRemoveUploadedImage, onToggleBrandKitImage, selectedBrandKitImageIds, uploadedImages])

  const toggleAuxFromKit = useCallback((logo: { id: string; url: string; name?: string }) => {
    const isSelectedAsAux = auxBrandKitIds.includes(logo.id)
    if (isSelectedAsAux) {
      onToggleBrandKitImage?.(logo.id)
      return
    }

    if (!selectedBrandKitImageIds.includes(logo.id)) {
      if (globalReferenceCount >= MAX_REFERENCE_IMAGES) return
      if (auxTotalCount >= MAX_AUX_LOGOS) return
      onToggleBrandKitImage?.(logo.id)
    }

    onReferenceRoleChange?.(logo.id, 'logo')
  }, [auxBrandKitIds, auxTotalCount, globalReferenceCount, onReferenceRoleChange, onToggleBrandKitImage, selectedBrandKitImageIds])

  const selectedBrandKitAssets = useMemo(
    () => auxBrandKitIds
      .map((id) => brandKitAssetMap.get(id) || { id, url: id, name: tt('auxLogos.auxResource', 'Auxiliary asset') })
      .filter((item) => Boolean(item?.url)),
    [auxBrandKitIds, brandKitAssetMap]
  )

  const hasAuxLogos = auxUploadedIds.length > 0 || selectedBrandKitAssets.length > 0

  useEffect(() => {
    // Keep the card expanded whenever there are auxiliary logos selected.
    if (hasAuxLogos) {
      setCollapsed(false)
    }
  }, [hasAuxLogos])

  const refreshBrandKitContent = useCallback(async () => {
    if (!onRefreshBrandKitContent) return
    try {
      setIsRefreshingBrandKit(true)
      await onRefreshBrandKitContent()
    } finally {
      setIsRefreshingBrandKit(false)
    }
  }, [onRefreshBrandKitContent])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
            <IconFingerprint className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-[11px] font-semibold text-foreground/95 uppercase tracking-[0.12em]">{tt('auxLogos.title', 'Auxiliary logos')}</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (hasAuxLogos) {
              setCollapsed(false)
              return
            }
            setCollapsed((prev) => !prev)
          }}
          aria-label={collapsed
            ? tt('auxLogos.expandAria', 'Expand auxiliary logos')
            : tt('auxLogos.collapseAria', 'Collapse auxiliary logos')}
        >
          {collapsed ? <IconChevronDown className="w-4 h-4" /> : <IconChevronUp className="w-4 h-4" />}
        </Button>
      </div>

      {!collapsed ? (
        <>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[10px] gap-1"
              onClick={() => inputRef.current?.click()}
            >
              <IconUpload className="w-3 h-3" />
              {tt('auxLogos.upload', 'Upload logos')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[10px] gap-1"
              onClick={() => setIsBrandKitModalOpen(true)}
            >
              <IconFingerprint className="w-3 h-3" />
              {tt('auxLogos.fromBrandKit', 'From Brand Kit')}
            </Button>
            {hasAuxLogos ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-[10px] ml-auto"
                onClick={() => {
                  auxUploadedIds.forEach((id) => removeAuxLogo(id))
                  selectedBrandKitAssets.forEach((item) => removeAuxLogo(item.id))
                }}
              >
                {tt('auxLogos.clear', 'Clear')}
              </Button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleUploadFiles(Array.from(e.target.files || []))
              if (inputRef.current) inputRef.current.value = ''
            }}
          />

          {hasAuxLogos ? (
            <div className="grid grid-cols-3 gap-2">
              {auxUploadedIds.map((url, index) => (
                <div key={url} className="relative rounded-xl overflow-hidden border border-border/60 bg-background aspect-square group">
                  <img src={url} alt={tt('auxLogos.uploadedAlt', 'Uploaded auxiliary logo {{index}}', { index: index + 1 })} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold bg-sky-500/85 text-white">
                    {tt('auxLogos.uploadedBadge', 'Uploaded')}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAuxLogo(url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={tt('auxLogos.removeAria', 'Remove auxiliary logo')}
                  >
                    <IconClose className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {selectedBrandKitAssets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => removeAuxLogo(item.id)}
                  className="relative rounded-xl overflow-hidden border border-border/60 bg-background aspect-square group"
                  title={tt('auxLogos.removeTitle', 'Remove auxiliary logo')}
                >
                  <img src={item.url} alt={item.name || tt('auxLogos.brandKitAssetAlt', 'Brand Kit auxiliary asset')} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/85 text-white">
                    {tt('auxLogos.brandKitBadge', 'Kit')}
                  </span>
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity inline-flex">
                    <IconClose className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/25 p-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {tt('auxLogos.emptyHint', 'Add one or more auxiliary logos to use them as secondary brand support.')}
              </p>
            </div>
          )}
        </>
      ) : null}

      <Dialog open={isBrandKitModalOpen} onOpenChange={setIsBrandKitModalOpen}>
        <DialogContent className="!w-[64vw] !max-w-[64vw] sm:!max-w-[64vw] h-[min(88vh,860px)] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-3">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle>{tt('auxLogos.selectFromBrandKitTitle', 'Select auxiliary logos from Brand Kit')}</DialogTitle>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 text-[11px]"
                onClick={() => void refreshBrandKitContent()}
                disabled={isRefreshingBrandKit}
              >
                {isRefreshingBrandKit
                  ? tt('auxLogos.refreshing', 'Refreshing...')
                  : tt('auxLogos.refresh', 'Refresh Kit')}
              </Button>
            </div>
            <DialogDescription>
              {tt('auxLogos.selectFromBrandKitDescription', 'Brand Kit images are shown here so you can choose auxiliary logos or secondary visual assets.')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
            {brandKitSources.length > 0 ? (
              <div className="grid content-start [grid-template-columns:repeat(auto-fill,minmax(132px,1fr))] gap-3">
                {brandKitSources.map((item) => {
                  const isSelected = auxBrandKitIds.includes(item.id)
                  const canSelect = isSelected || (
                    (globalReferenceCount < MAX_REFERENCE_IMAGES || selectedBrandKitImageIds.includes(item.id)) &&
                    (auxTotalCount < MAX_AUX_LOGOS || auxBrandKitIds.includes(item.id))
                  )

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!canSelect) return
                        toggleAuxFromKit(item)
                      }}
                      className={cn(
                        'relative w-full rounded-xl overflow-hidden border aspect-square transition-all',
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20'
                          : canSelect
                            ? 'border-border hover:border-primary/40'
                            : 'border-border opacity-50 cursor-not-allowed'
                      )}
                    >
                        <img src={item.url} alt={item.name || tt('auxLogos.brandKitImageAlt', 'Brand Kit image')} className="w-full h-full object-cover" />
                      {isSelected ? (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center">
                            <IconCheck className="w-4 h-4" />
                          </span>
                        </div>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border mt-1 p-6 text-center text-sm text-muted-foreground">
                {tt('auxLogos.noBrandKitImages', 'This Brand Kit does not have any images yet.')}
              </div>
            )}
          </div>

          <div className="border-t border-border px-6 py-3 flex justify-end">
            <Button type="button" size="sm" onClick={() => setIsBrandKitModalOpen(false)}>
              {tt('actions.continue', 'Continue')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
