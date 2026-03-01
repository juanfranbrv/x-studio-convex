'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useBrandKit } from '@/contexts/BrandKitContext'
import { useToast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CanvasPanel } from '@/components/studio/CanvasPanel'
import { ControlsPanel } from '@/components/studio/ControlsPanel'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PromptCard } from '@/components/studio/PromptCard'
import { CaptionCard } from '@/components/studio/CaptionCard'
import { ThumbnailHistory } from '@/components/studio/ThumbnailHistory'
import { useCreationFlow, UseCreationFlowOptions } from '@/hooks/useCreationFlow'
import { uploadBrandImage } from '@/app/actions/upload-image'
import { SOCIAL_FORMATS, ALL_IMAGE_LAYOUTS, LAYOUTS_BY_INTENT, type DebugPromptData, type DebugContextItem } from '@/lib/creation-flow-types'
import { Loader2, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PromptDebugModal } from '@/components/studio/modals/PromptDebugModal'
import { buildEditPrompt } from '@/lib/prompts/image-edit'
import { buildImagePrompt } from '@/lib/prompt-builder'
import { parseLazyIntentAction } from '@/app/actions/parse-intent'
import { IntentCategory, TextAsset } from '@/lib/creation-flow-types'
import { useUI } from '@/contexts/UIContext'
import { hexToHslString } from '@/lib/color-utils'
import { FeedbackButton } from '@/components/studio/FeedbackButton'
import { Id } from '../../../convex/_generated/dataModel'
import type { BrandDNA } from '@/lib/brand-types'
import { getCompositionsSummaryAction, type CompositionSummary } from '@/lib/admin-compositions-actions'

// Admin email for debug modal access
const ADMIN_EMAIL = 'juanfranbrv@gmail.com'

interface Generation {
    id: string
    image_url: string
    image_storage_id?: string
    created_at: string
    prompt_used?: string
    request_payload?: Record<string, unknown>
    error_title?: string
    error_fallback?: string
}

interface ImageWorkspaceSnapshot {
    version: number
    module: 'image'
    promptValue: string
    editPrompt: string
    logoInclusion: boolean
    compositionMode: 'basic' | 'advanced'
    selectedContext: ContextElement[]
    sessionGenerations: Generation[]
    creationFlowState: Record<string, unknown>
    rootPrompt?: string
}

type CompactGeneration = Pick<Generation, 'id' | 'image_url' | 'image_storage_id' | 'created_at' | 'prompt_used' | 'error_title' | 'error_fallback'> & {
    request_payload?: {
        prompt?: string
        model?: string
        layoutId?: string
        aspectRatio?: string
    }
}

export type ContextType = 'color' | 'logo' | 'aux_logo' | 'template' | 'image' | 'font' | 'text' | 'link' | 'contact'

export interface ContextElement {
    id: string
    type: ContextType
    value: string
    label?: string
}



export default function ImagePage() {
    const router = useRouter()
    const { user } = useUser()
    const { activeBrandKit, brandKits, loading, setActiveBrandKit, updateActiveBrandKit, deleteBrandKitById } = useBrandKit()
    const { panelPosition } = useUI()
    const [isGenerating, setIsGenerating] = useState(false)
    const { toast } = useToast()
    const [selectedContext, setSelectedContext] = useState<ContextElement[]>([])
    const [logoInclusion, setLogoInclusion] = useState(true)
    const [compositionMode, setCompositionMode] = useState<'basic' | 'advanced'>('basic')

    const [promptValue, setPromptValue] = useState('')
    const [editPrompt, setEditPrompt] = useState('')
    const [isMobile, setIsMobile] = useState(false)
    const [isMagicParsing, setIsMagicParsing] = useState(false)
    const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set())
    const [auditFlowId, setAuditFlowId] = useState<string | null>(null)
    const auditFlowIdRef = useRef<string | null>(null)
    const smartAnalyzeInFlightRef = useRef(false)

    // Layout Overrides for Icons
    const [layoutOverrides, setLayoutOverrides] = useState<CompositionSummary[]>([])

    useEffect(() => {
        getCompositionsSummaryAction()
            .then(setLayoutOverrides)
            .catch(err => console.error('Failed to load layout overrides:', err))
    }, [])

    useEffect(() => {
        auditFlowIdRef.current = auditFlowId
    }, [auditFlowId])

    const layoutIconOverrides = useMemo(() => {
        if (!layoutOverrides.length) return {}
        return layoutOverrides.reduce<Record<string, string>>((acc, item) => {
            if (item.svgIcon) acc[item.id] = item.svgIcon
            return acc
        }, {})
    }, [layoutOverrides])
    const lastCompositionModeRef = useRef<'basic' | 'advanced'>(compositionMode)

    // AI Configuration
    const aiConfig = useQuery(api.settings.getAIConfig)

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Debug Modal States
    const [showDebugModal, setShowDebugModal] = useState(false)
    const [debugPromptData, setDebugPromptData] = useState<DebugPromptData | null>(null)
    const [editableDebugPrompt, setEditableDebugPrompt] = useState('')
    const [isDebugViewOnly, setIsDebugViewOnly] = useState(false)
    const [pendingGenerationData, setPendingGenerationData] = useState<any>(null)
    const [pendingRetryRequest, setPendingRetryRequest] = useState<{
        payload: Record<string, unknown>
        errorTitle: string
        errorFallback: string
    } | null>(null)
    const [lastGenerationRequest, setLastGenerationRequest] = useState<{
        payload: Record<string, unknown>
        errorTitle: string
        errorFallback: string
    } | null>(null)
    const basicLayoutCursorByIntentRef = useRef<Partial<Record<IntentCategory, number>>>({})

    // Local session history
    const [sessionGenerations, setSessionGenerations] = useState<Generation[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [selectedSessionToLoad, setSelectedSessionToLoad] = useState<string>('')
    const [sessionRootPrompt, setSessionRootPrompt] = useState<string | null>(null)
    const [isHydratingSession, setIsHydratingSession] = useState(false)
    const hydrationScopeRef = useRef<string>('')
    const hasHydratedScopeRef = useRef(false)
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const persistedSessionImageCacheRef = useRef<Map<string, { storageId: string; imageUrl: string }>>(new Map())
    const persistImageInFlightRef = useRef<Map<string, Promise<{ storageId: string; imageUrl: string } | null>>>(new Map())

    const createWorkSession = useMutation(api.work_sessions.createSession)
    const upsertWorkSession = useMutation(api.work_sessions.upsertActiveSession)
    const activateWorkSession = useMutation(api.work_sessions.activateSession)
    const deleteWorkSession = useMutation(api.work_sessions.deleteSession)
    const clearWorkSessions = useMutation(api.work_sessions.clearSessions)

    const scopedBrandId = activeBrandKit?.id as Id<'brand_dna'> | undefined
    const activeWorkSession = useQuery(
        api.work_sessions.getActiveSession,
        user?.id && scopedBrandId
            ? { user_id: user.id, module: 'image', brand_id: scopedBrandId }
            : 'skip'
    )
    const workSessions = useQuery(
        api.work_sessions.listSessions,
        user?.id && scopedBrandId
            ? { user_id: user.id, module: 'image', brand_id: scopedBrandId, limit: 50 }
            : 'skip'
    )

    // Sync history
    const displayGenerations = useMemo(() => {
        return sessionGenerations.filter((generation) => {
            const hasUrl = typeof generation.image_url === 'string' && generation.image_url.trim().length > 0
            const hasStorageId = typeof generation.image_storage_id === 'string' && generation.image_storage_id.trim().length > 0
            return hasUrl || hasStorageId
        })
    }, [sessionGenerations])

    const creationFlow = useCreationFlow({
        getOrCreateAuditFlowId: () => {
            const current = auditFlowIdRef.current
            if (current) return current
            const next = `flow_${Date.now()}`
            auditFlowIdRef.current = next
            setAuditFlowId(next)
            return next
        },
        onImageUploaded: async (file: File) => {
            // Reference images are only used for the current session/generation
            // and should not be persisted in the permanent Brand Kit image storage.
            console.log('Image uploaded for current flow:', file.name)
        },
        onReset: () => {
            creationFlow.setGeneratedImage(null)
            setDebugPromptData(null)
            setSelectedContext([])
            setPromptValue('')
            setCompositionMode('basic')
            basicLayoutCursorByIntentRef.current = {}
            setPendingRetryRequest(null)
            setLastGenerationRequest(null)
        }
    } as UseCreationFlowOptions)

    const normalizePromptForSession = useCallback((value?: string | null) => {
        const cleaned = (value || '')
            .trim()
            .replace(/\s+/g, ' ')
            .toLowerCase()
        return cleaned.length > 0 ? cleaned : null
    }, [])

    const buildSessionTitle = useCallback((value?: string | null) => {
        const cleaned = (value || '').replace(/\s+/g, ' ').trim()
        if (!cleaned) return 'Sesion nueva'
        if (cleaned.length <= 48) return cleaned
        return `${cleaned.slice(0, 48)}...`
    }, [])

    const buildWorkspaceSnapshot = useCallback((rootPromptOverride?: string | null, generationsOverride?: Generation[]): ImageWorkspaceSnapshot => {
        const sourceGenerations = generationsOverride ?? sessionGenerations
        const compactGenerations: CompactGeneration[] = sourceGenerations.slice(0, 120).map((generation) => {
            const payload = generation.request_payload || {}
            return {
                id: generation.id,
                image_url: generation.image_url,
                image_storage_id: generation.image_storage_id,
                created_at: generation.created_at,
                prompt_used: generation.prompt_used?.slice(0, 2500),
                error_title: generation.error_title,
                error_fallback: generation.error_fallback,
                request_payload: {
                    prompt: typeof payload.prompt === 'string' ? payload.prompt.slice(0, 2500) : undefined,
                    model: typeof payload.model === 'string' ? payload.model : undefined,
                    layoutId: typeof payload.layoutId === 'string' ? payload.layoutId : undefined,
                    aspectRatio: typeof payload.aspectRatio === 'string' ? payload.aspectRatio : undefined,
                }
            }
        })

        return {
            version: 1,
            module: 'image',
            promptValue,
            editPrompt,
            logoInclusion,
            compositionMode,
            selectedContext,
            sessionGenerations: compactGenerations,
            creationFlowState: creationFlow.getStateSnapshot(),
            rootPrompt: rootPromptOverride ?? sessionRootPrompt ?? undefined,
        }
    }, [
        promptValue,
        editPrompt,
        logoInclusion,
        compositionMode,
        selectedContext,
        sessionGenerations,
        creationFlow,
        sessionRootPrompt
    ])

    const persistGenerationImage = useCallback(async (generation: Generation) => {
        const imageUrl = typeof generation.image_url === 'string' ? generation.image_url.trim() : ''
        if (!imageUrl || generation.image_storage_id) return null

        const needsPersistence =
            imageUrl.startsWith('data:') ||
            imageUrl.startsWith('http://') ||
            imageUrl.startsWith('https://')

        if (!needsPersistence) return null

        const cached = persistedSessionImageCacheRef.current.get(generation.id)
        if (cached) return cached

        const inFlight = persistImageInFlightRef.current.get(generation.id)
        if (inFlight) return await inFlight

        const task = (async () => {
            const response = await fetch('/api/work-sessions/persist-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'No se pudo persistir la imagen de sesion' }))
                throw new Error(errorData.error || 'No se pudo persistir la imagen de sesion')
            }

            const data = await response.json() as { storageId?: string; imageUrl?: string }
            if (!data.storageId || !data.imageUrl) {
                throw new Error('Persistencia de imagen incompleta')
            }
            const persisted = { storageId: data.storageId, imageUrl: data.imageUrl }
            persistedSessionImageCacheRef.current.set(generation.id, persisted)
            return persisted
        })()

        persistImageInFlightRef.current.set(generation.id, task)
        try {
            return await task
        } finally {
            persistImageInFlightRef.current.delete(generation.id)
        }
    }, [])

    const materializeGenerationsForSnapshot = useCallback(async (generations: Generation[]) => {
        const updated = await Promise.all(generations.map(async (generation) => {
            try {
                const persisted = await persistGenerationImage(generation)
                if (!persisted) return generation
                return {
                    ...generation,
                    image_storage_id: persisted.storageId,
                    image_url: persisted.imageUrl,
                }
            } catch (error) {
                console.error('Session image persist failed:', error)
                return generation
            }
        }))
        return updated
    }, [persistGenerationImage])

    const restoreWorkspaceFromSnapshot = useCallback((snapshot: ImageWorkspaceSnapshot) => {
        setIsHydratingSession(true)
        try {
            if (snapshot.creationFlowState && typeof snapshot.creationFlowState === 'object') {
                creationFlow.loadPreset(snapshot.creationFlowState)
            }
            setPromptValue(snapshot.promptValue || '')
            creationFlow.setRawMessage(snapshot.promptValue || '')
            setEditPrompt(snapshot.editPrompt || '')
            setLogoInclusion(typeof snapshot.logoInclusion === 'boolean' ? snapshot.logoInclusion : true)
            setCompositionMode(snapshot.compositionMode === 'advanced' ? 'advanced' : 'basic')
            setSelectedContext(Array.isArray(snapshot.selectedContext) ? snapshot.selectedContext : [])
            setSessionGenerations(
                Array.isArray(snapshot.sessionGenerations)
                    ? snapshot.sessionGenerations.filter((item) => {
                        if (!item || typeof item !== 'object') return false
                        const row = item as Generation
                        return Boolean(row.image_url || row.image_storage_id)
                    })
                    : []
            )
            setSessionRootPrompt(normalizePromptForSession(snapshot.rootPrompt || snapshot.promptValue))
        } finally {
            window.setTimeout(() => setIsHydratingSession(false), 0)
        }
    }, [creationFlow, normalizePromptForSession])

    const createNewImageSession = useCallback(async (initialPrompt?: string, silent = false) => {
        if (!user?.id || !scopedBrandId) return null

        const prompt = initialPrompt ?? ''
        const normalizedPrompt = normalizePromptForSession(prompt)

        creationFlow.reset()
        setSessionGenerations([])
        setDebugPromptData(null)
        setSelectedContext([])
        setEditPrompt('')
        setPendingRetryRequest(null)
        setLastGenerationRequest(null)
        setPromptValue(prompt)
        creationFlow.setRawMessage(prompt)
        setSessionRootPrompt(normalizedPrompt)
        setAuditFlowId(null)
        auditFlowIdRef.current = null

        const created = await createWorkSession({
            user_id: user.id,
            module: 'image',
            brand_id: scopedBrandId,
            title: buildSessionTitle(prompt),
            root_prompt: normalizedPrompt || undefined,
        })

        const newId = String(created.session_id)
        setCurrentSessionId(newId)
        setSelectedSessionToLoad(newId)

        if (!silent) {
            toast({
                title: "Sesion nueva",
                description: "Se ha iniciado una nueva sesion de trabajo para este kit de marca.",
            })
        }
        return newId
    }, [user?.id, scopedBrandId, normalizePromptForSession, creationFlow, createWorkSession, toast, buildSessionTitle])

    const handleLoadSession = useCallback(async (sessionId: string) => {
        if (!sessionId || !user?.id) return
        const activated = await activateWorkSession({
            user_id: user.id,
            session_id: sessionId as Id<'work_sessions'>,
        })
        if (activated?.snapshot) {
            restoreWorkspaceFromSnapshot(activated.snapshot as ImageWorkspaceSnapshot)
        }
        setCurrentSessionId(String(activated?._id || sessionId))
        setSelectedSessionToLoad(String(activated?._id || sessionId))
        setSessionRootPrompt(normalizePromptForSession(activated?.root_prompt))
    }, [user?.id, activateWorkSession, restoreWorkspaceFromSnapshot, normalizePromptForSession])

    const handleDeleteCurrentSession = useCallback(async () => {
        if (!user?.id || !currentSessionId) return
        if (!window.confirm('¿Quieres borrar esta sesion?')) return

        const result = await deleteWorkSession({
            user_id: user.id,
            session_id: currentSessionId as Id<'work_sessions'>,
        })

        if (result?.next_session_id) {
            await handleLoadSession(String(result.next_session_id))
        } else {
            await createNewImageSession('', true)
        }

        toast({
            title: 'Sesion eliminada',
            description: 'La sesion se ha borrado correctamente.',
        })
    }, [user?.id, currentSessionId, deleteWorkSession, handleLoadSession, createNewImageSession, toast])

    const handleClearAllSessions = useCallback(async () => {
        if (!user?.id || !scopedBrandId) return
        if (!window.confirm('¿Quieres borrar todas las sesiones de este kit de marca?')) return

        await clearWorkSessions({
            user_id: user.id,
            module: 'image',
            brand_id: scopedBrandId,
        })

        await createNewImageSession('', true)
        toast({
            title: 'Sesiones borradas',
            description: 'Se han eliminado todas las sesiones de este kit.',
        })
    }, [user?.id, scopedBrandId, clearWorkSessions, createNewImageSession, toast])

    // Hydrate one session per scope (user + module + brand kit).
    useEffect(() => {
        const scopeKey = `${user?.id || 'anon'}::image::${scopedBrandId || 'no-brand'}`
        if (hydrationScopeRef.current !== scopeKey) {
            hydrationScopeRef.current = scopeKey
            hasHydratedScopeRef.current = false
            setCurrentSessionId(null)
            setSelectedSessionToLoad('')
            setSessionRootPrompt(null)
        }

        if (!user?.id || !scopedBrandId) return
        if (activeWorkSession === undefined) return
        if (hasHydratedScopeRef.current) return

        if (activeWorkSession?.snapshot) {
            restoreWorkspaceFromSnapshot(activeWorkSession.snapshot as ImageWorkspaceSnapshot)
            setCurrentSessionId(String(activeWorkSession._id))
            setSelectedSessionToLoad(String(activeWorkSession._id))
            setSessionRootPrompt(normalizePromptForSession(activeWorkSession.root_prompt))
            hasHydratedScopeRef.current = true
            return
        }

        hasHydratedScopeRef.current = true
        createWorkSession({
            user_id: user.id,
            module: 'image',
            brand_id: scopedBrandId,
            title: 'Sesion nueva',
            snapshot: buildWorkspaceSnapshot(),
        }).then((created) => {
            const id = String(created.session_id)
            setCurrentSessionId(id)
            setSelectedSessionToLoad(id)
        }).catch((error) => {
            hasHydratedScopeRef.current = false
            console.error('Error creating initial image work session:', error)
        })
    }, [
        user?.id,
        scopedBrandId,
        activeWorkSession,
        createWorkSession,
        buildWorkspaceSnapshot,
        restoreWorkspaceFromSnapshot,
        normalizePromptForSession
    ])

    // Autosave current workspace snapshot.
    useEffect(() => {
        if (!user?.id || !scopedBrandId) return
        if (!hasHydratedScopeRef.current) return
        if (isHydratingSession) return

        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current)
        }

        autosaveTimerRef.current = setTimeout(() => {
            void (async () => {
                try {
                    const persistedGenerations = await materializeGenerationsForSnapshot(sessionGenerations)
                    const hasPersistedChanges = persistedGenerations.some((generation, index) => (
                        generation.image_storage_id !== sessionGenerations[index]?.image_storage_id ||
                        generation.image_url !== sessionGenerations[index]?.image_url
                    ))
                    if (hasPersistedChanges) {
                        setSessionGenerations(persistedGenerations)
                    }

                    const snapshot = buildWorkspaceSnapshot(undefined, persistedGenerations)
                    const result = await upsertWorkSession({
                        user_id: user.id,
                        module: 'image',
                        brand_id: scopedBrandId,
                        session_id: currentSessionId ? (currentSessionId as Id<'work_sessions'>) : undefined,
                        title: buildSessionTitle(snapshot.promptValue || 'Sesion de imagen'),
                        root_prompt: normalizePromptForSession(snapshot.rootPrompt || snapshot.promptValue) || undefined,
                        snapshot,
                    })
                    const id = String(result.session_id)
                    if (!currentSessionId) {
                        setCurrentSessionId(id)
                        setSelectedSessionToLoad(id)
                    }
                } catch (error) {
                    console.error('Autosave session failed:', error)
                }
            })()
        }, 1500)

        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current)
            }
        }
    }, [
        user?.id,
        scopedBrandId,
        isHydratingSession,
        currentSessionId,
        promptValue,
        editPrompt,
        logoInclusion,
        compositionMode,
        selectedContext,
        sessionGenerations,
        creationFlow.state,
        buildWorkspaceSnapshot,
        materializeGenerationsForSnapshot,
        upsertWorkSession,
        normalizePromptForSession,
        buildSessionTitle
    ])

    // Reset Studio when Brand Kit changes
    useEffect(() => {
        if (activeBrandKit?.id) {
            setSelectedContext([])
            creationFlow.reset()
            setDebugPromptData(null)
            setPromptValue('')
            setCompositionMode('basic')
            basicLayoutCursorByIntentRef.current = {}
            setPendingRetryRequest(null)
            setLastGenerationRequest(null)
        }
    }, [activeBrandKit?.id])

    useEffect(() => {
        const previous = lastCompositionModeRef.current
        lastCompositionModeRef.current = compositionMode
        if (previous === 'advanced' || compositionMode !== 'advanced') return

        const intentId = creationFlow.state.selectedIntent
        const intentLayouts = intentId ? LAYOUTS_BY_INTENT[intentId] || [] : []
        const libreFromIntent = intentLayouts.find(layout =>
            (layout.name || '').trim().toLowerCase() === 'libre'
        )
        const fallbackLibre = ALL_IMAGE_LAYOUTS.find(layout =>
            (layout.name || '').trim().toLowerCase() === 'libre'
        )
        const libreLayoutId = (libreFromIntent || fallbackLibre)?.id
        if (!libreLayoutId) return

        creationFlow.selectLayout(libreLayoutId)
    }, [compositionMode, creationFlow.state.selectedIntent, creationFlow])

    const getNextBasicLayoutId = useCallback((intent: IntentCategory, previousLayoutId?: string | null) => {
        const layoutsForIntent = LAYOUTS_BY_INTENT[intent] || []
        if (!layoutsForIntent.length) return null

        const currentCursor = basicLayoutCursorByIntentRef.current[intent] ?? 0
        let nextCursor = currentCursor % layoutsForIntent.length

        if (
            previousLayoutId &&
            layoutsForIntent.length > 1 &&
            layoutsForIntent[nextCursor]?.id === previousLayoutId
        ) {
            nextCursor = (nextCursor + 1) % layoutsForIntent.length
        }

        basicLayoutCursorByIntentRef.current[intent] = (nextCursor + 1) % layoutsForIntent.length
        return layoutsForIntent[nextCursor]?.id ?? null
    }, [])

    const executeGenerationRequest = async (
        requestPayload: Record<string, unknown>,
        errorTitle: string,
        errorFallback: string
    ) => {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
        })

        if (response.ok) {
            const result = await response.json()
            creationFlow.setGeneratedImage(result.imageUrl)

            setSessionGenerations(prev => [{
                id: Date.now().toString(),
                image_url: result.imageUrl,
                created_at: new Date().toISOString(),
                prompt_used: typeof requestPayload.prompt === 'string' ? requestPayload.prompt : '',
                request_payload: { ...requestPayload },
                error_title: errorTitle,
                error_fallback: errorFallback
            }, ...prev].slice(0, 80))
            return
        }

        const errorData = await response.json().catch(() => ({ error: errorFallback }))
        toast({
            title: errorTitle,
            description: errorData.error || errorFallback,
            variant: "destructive",
        })
    }

    const buildFinalModelPrompt = (requestPayload: Record<string, unknown>): string => {
        const requestPrompt = typeof requestPayload.prompt === 'string' ? requestPayload.prompt : ''
        if (!requestPrompt) return ''

        if (requestPayload.promptAlreadyBuilt === true) {
            return requestPrompt
        }

        const brandDNA = requestPayload.brandDNA as BrandDNA | undefined
        if (!brandDNA) return requestPrompt

        return buildImagePrompt(
            { name: brandDNA.brand_name || 'Brand', brand_dna: brandDNA },
            requestPrompt,
            {
                headline: typeof requestPayload.headline === 'string' ? requestPayload.headline : undefined,
                cta: typeof requestPayload.cta === 'string' ? requestPayload.cta : undefined,
                platform: requestPayload.platform as 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | undefined,
                context: Array.isArray(requestPayload.context) ? requestPayload.context as any[] : [],
                model: typeof requestPayload.model === 'string' ? requestPayload.model : undefined,
                layoutReference: typeof requestPayload.layoutReference === 'string' ? requestPayload.layoutReference : undefined,
                aspectRatio: typeof requestPayload.aspectRatio === 'string' ? requestPayload.aspectRatio : undefined,
                selectedColors: Array.isArray(requestPayload.selectedColors)
                    ? requestPayload.selectedColors as Array<{ color: string; role: string } | string>
                    : []
            }
        )
    }

    const buildGenerationRequestPayload = (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
        model?: string
        promptAlreadyBuilt?: boolean
        forcedLayoutId?: string
        auditFlowId?: string
    }) => {
        if (!activeBrandKit) return null

        const selectedImages = (activeBrandKit.images || [])
            .filter(img => img.selected !== false)
            .map(img => img.url)

        const finalContext: ContextElement[] = [...selectedContext]
        const styleReferenceImages: string[] = []
        const debugContextItems: DebugContextItem[] = []
        const getReferenceRole = (imageId: string) => creationFlow.state.referenceImageRoles?.[imageId] || 'content'
        const isStyleRole = (role: string) => role === 'style' || role === 'style_content'
        const hasDebugItem = (url: string, role?: DebugContextItem['role']) =>
            debugContextItems.some((item) => item.url === url && item.role === role)
        const addDebugItem = (item: DebugContextItem) => {
            if (hasDebugItem(item.url, item.role)) return
            debugContextItems.push(item)
        }

        if (creationFlow.state.uploadedImages.length > 0) {
            creationFlow.state.uploadedImages.forEach((imgUrl, idx) => {
                const role = getReferenceRole(imgUrl)
                if (isStyleRole(role)) styleReferenceImages.push(imgUrl)
                addDebugItem({
                    id: `debug-upload-${idx}`,
                    type: role === 'logo' ? 'aux_logo' : 'image',
                    label: role === 'logo' ? `Logo auxiliar ${idx + 1}` : `Upload ${idx + 1}`,
                    url: imgUrl,
                    source: 'upload',
                    role: role as DebugContextItem['role'],
                })
                if (role === 'style') return

                const hasImg = finalContext.some(c => c.id === `flow-upload-${idx}`)
                if (!hasImg) {
                    finalContext.push({
                        id: `flow-upload-${idx}`,
                        type: role === 'logo' ? 'aux_logo' : 'image',
                        value: imgUrl,
                        label: role === 'logo' ? `Logo auxiliar ${idx + 1}` : `Referencia ${idx + 1}`
                    })
                }
            })
        }

        if (creationFlow.state.selectedBrandKitImageIds.length > 0) {
            creationFlow.state.selectedBrandKitImageIds.forEach((imgUrl, idx) => {
                const role = getReferenceRole(imgUrl)
                if (isStyleRole(role)) styleReferenceImages.push(imgUrl)
                addDebugItem({
                    id: `debug-brandkit-${idx}`,
                    type: role === 'logo' ? 'aux_logo' : 'image',
                    label: role === 'logo' ? `Logo auxiliar BrandKit ${idx + 1}` : `BrandKit ${idx + 1}`,
                    url: imgUrl,
                    source: 'brandkit',
                    role: role as DebugContextItem['role'],
                })
                if (role === 'style') return

                const hasImg = finalContext.some(c => c.id === `flow-brandkit-${idx}`)
                if (!hasImg) {
                    finalContext.push({
                        id: `flow-brandkit-${idx}`,
                        type: role === 'logo' ? 'aux_logo' : 'image',
                        value: imgUrl,
                        label: role === 'logo' ? `Logo auxiliar BrandKit ${idx + 1}` : `Imagen BrandKit ${idx + 1}`
                    })
                }
            })
        }

        if (logoInclusion && creationFlow.state.selectedLogoId) {
            const logo = activeBrandKit.logos?.find((l, idx) =>
                (l as any).id === creationFlow.state.selectedLogoId || `logo-${idx}` === creationFlow.state.selectedLogoId
            )
            const logoUrl = logo?.url || null
            if (logoUrl) {
                const hasLogo = finalContext.some(c => c.type === 'logo')
                if (!hasLogo) {
                    finalContext.push({
                        id: 'flow-logo',
                        type: 'logo',
                        value: logoUrl,
                        label: 'Logo'
                    })
                }
                addDebugItem({
                    id: 'debug-primary-logo',
                    type: 'logo',
                    label: 'Logo principal',
                    url: logoUrl,
                    source: 'system',
                    role: 'primary_logo',
                })
            }
        }

        if (creationFlow.state.generatedImage) {
            const hasReference = finalContext.some(c => c.id === 'edit-reference')
            if (!hasReference) {
                finalContext.push({
                    id: 'edit-reference',
                    type: 'image',
                    value: creationFlow.state.generatedImage,
                    label: 'Imagen actual'
                })
            }
            addDebugItem({
                id: 'debug-generated-reference',
                type: 'image',
                label: 'Imagen actual',
                url: creationFlow.state.generatedImage,
                source: 'generated',
                role: 'generated',
            })
        }

        const effectivePrompt = data.promptAlreadyBuilt
            ? data.prompt
            : (creationFlow.state.generatedImage ? buildEditPrompt(data.prompt) : data.prompt)

        const effectiveLayoutId = data.forcedLayoutId || creationFlow.state.selectedLayout
        const effectiveLayoutMeta = ALL_IMAGE_LAYOUTS.find((l) => l.id === effectiveLayoutId)
        const compositionSkill = effectiveLayoutMeta?.skillVersion
            ? {
                name: 'composiciones',
                version: effectiveLayoutMeta.skillVersion,
                layoutId: effectiveLayoutMeta.id,
            }
            : undefined

        const requestPayload = {
            ...data,
            prompt: effectivePrompt,
            promptAlreadyBuilt: Boolean(data.promptAlreadyBuilt),
            brandDNA: {
                ...activeBrandKit,
                images: selectedImages
            },
            logoInclusion,
            context: finalContext,
            model: data.model || creationFlow.state.selectedImageModel || aiConfig?.imageModel,
            layoutId: effectiveLayoutMeta?.id,
            layoutName: effectiveLayoutMeta?.name,
            layoutSkillVersion: effectiveLayoutMeta?.skillVersion,
            compositionSkill,
            layoutReference: effectiveLayoutMeta?.referenceImage,
            aspectRatio: SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio,
            selectedColors: creationFlow.state.selectedBrandColors,
            auditFlowId: data.auditFlowId
        } as Record<string, unknown>

        return {
            requestPayload,
            styleReferenceImage: styleReferenceImages[0],
            attachedImages: finalContext
                .filter((item) => item.type === 'image' || item.type === 'logo' || item.type === 'aux_logo')
                .map((item) => item.value),
            debugContextItems,
        }
    }

    const handleNewBrandKit = () => {
        router.push('/brand-kit?action=new')
    }

    const getDefaultFormatId = useCallback((platform?: string | null) => {
        const normalized = platform || 'instagram'
        return SOCIAL_FORMATS.find((format) => format.platform === normalized)?.id || null
    }, [])

    // Smart analyze prompt
    const handleSmartAnalyze = async (autoModel?: string) => {
        if (!promptValue.trim()) return null
        if (smartAnalyzeInFlightRef.current) return null

        smartAnalyzeInFlightRef.current = true
        setIsMagicParsing(true)
        setHighlightedFields(new Set())

        try {
            const normalizedPrompt = normalizePromptForSession(promptValue)
            if (normalizedPrompt && sessionRootPrompt && normalizedPrompt !== sessionRootPrompt) {
                await createNewImageSession(promptValue, true)
            } else if (normalizedPrompt && !sessionRootPrompt) {
                setSessionRootPrompt(normalizedPrompt)
            }

            const modelToUse = autoModel || aiConfig?.intelligenceModel
            if (!modelToUse) {
                toast({
                    title: "Falta configuracion de IA",
                    description: "No hay un modelo de inteligencia configurado en el panel de Admin.",
                    variant: "destructive"
                })
                return null
            }

            creationFlow.setRawMessage(promptValue)
            const nextFlowId = auditFlowIdRef.current || `flow_${Date.now()}`
            if (!auditFlowIdRef.current) {
                auditFlowIdRef.current = nextFlowId
                setAuditFlowId(nextFlowId)
            }

            const previewTextContext = [
                creationFlow.state.headline?.trim() ? `HEADLINE: ${creationFlow.state.headline.trim()}` : '',
                creationFlow.state.cta?.trim() ? `CTA: ${creationFlow.state.cta.trim()}` : '',
                (creationFlow.state.ctaUrlEnabled && creationFlow.state.ctaUrl?.trim())
                    ? `URL: ${creationFlow.state.ctaUrl.trim()}`
                    : '',
                ...Object.entries(creationFlow.state.customTexts || {})
                    .map(([key, value]) => {
                        const val = Array.isArray(value) ? value.join(', ') : String(value ?? '')
                        return val.trim() ? `TEXT_${key.toUpperCase()}: ${val.trim()}` : ''
                    })
                    .filter(Boolean),
                ...(creationFlow.state.selectedTextAssets || [])
                    .map((asset) => asset?.value?.trim() ? `ASSET_${asset.label?.toUpperCase() || asset.type}: ${asset.value.trim()}` : '')
                    .filter(Boolean)
            ].filter(Boolean).join('\n')

            const result = await parseLazyIntentAction({
                userText: promptValue,
                brandDNA: activeBrandKit,
                brandWebsite: activeBrandKit?.url,
                intelligenceModel: modelToUse,
                intentId: creationFlow.currentIntent?.id,
                layoutId: creationFlow.selectedLayoutMeta?.id,
                variationSeed: Date.now(),
                previewTextContext,
                auditFlowId: nextFlowId
            })

            if (result.error) {
                toast({
                    title: "Error analyzing prompt",
                    description: "Could not parse intent. Please fill manually.",
                    variant: "destructive"
                })
                return null
            }

            const newHighlights = new Set<string>()

            // Auto-detect intent
            if (result.detectedIntent && !creationFlow.state.selectedIntent) {
                creationFlow.selectIntent(result.detectedIntent as IntentCategory)
                toast({
                    title: "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ IntenciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n detectada",
                    description: `Detectamos que quieres crear: ${result.detectedIntent}`,
                })
            }

            // Populate fields
            if (result.headline) {
                creationFlow.setHeadline(result.headline)
                newHighlights.add('headline')
            }
            if (result.cta) {
                creationFlow.setCta(result.cta)
                newHighlights.add('cta')
            }
            if (result.ctaUrl) {
                creationFlow.setCtaUrl(result.ctaUrl)
                newHighlights.add('ctaUrl')
            }
            if (result.caption) {
                creationFlow.setCaption(result.caption)
                newHighlights.add('caption')
            }

            // Process imageTexts (secondary text layers for preview)
            const aiAssets: TextAsset[] = []
            const seenValues = new Set<string>()

            const addAsset = (label: string, value: string, type?: TextAsset['type']) => {
                const cleanValue = value.trim()
                if (!cleanValue) return
                if (seenValues.has(cleanValue.toLowerCase())) return
                seenValues.add(cleanValue.toLowerCase())
                aiAssets.push({
                    id: `ai-${Date.now()}-${aiAssets.length}`,
                    type: type || 'custom',
                    label: label.trim() || 'Texto',
                    value: cleanValue
                })
            }

            if (Array.isArray(result.imageTexts)) {
                result.imageTexts.forEach((item) => {
                    if (!item || typeof item !== 'object') return
                    const label = typeof item.label === 'string' ? item.label : 'Texto'
                    const value = typeof item.value === 'string' ? item.value : ''
                    const type = item.type === 'tagline' || item.type === 'hook' ? item.type : 'custom'
                    addAsset(label, value, type)
                })
            } else if (result.imageTexts && typeof result.imageTexts === 'object') {
                Object.entries(result.imageTexts).forEach(([key, value]) => {
                    if (typeof value === 'string') {
                        addAsset(key, value, 'custom')
                    }
                })
            }

            // If parser already returned a consolidated imageTexts block,
            // do not re-expand customTexts into extra layers.
            if (result.customTexts && aiAssets.length === 0) {
                Object.entries(result.customTexts).forEach(([key, value]) => {
                    if (value && typeof value === 'string' && value.trim()) {
                        addAsset(key.replace(/_/g, ' '), value, 'custom')
                    }
                })
            }

            creationFlow.setSelectedTextAssets(aiAssets)

            if (result.suggestions) {
                creationFlow.setSuggestions(result.suggestions)
            } else {
                creationFlow.setSuggestions(undefined)
            }
            if (Array.isArray(result.imagePromptSuggestions)) {
                creationFlow.setImagePromptSuggestions(result.imagePromptSuggestions)
            } else {
                creationFlow.setImagePromptSuggestions([])
            }

            setHighlightedFields(newHighlights)
            setTimeout(() => setHighlightedFields(new Set()), 2500)

            // Reset preview after analysis but keep current selections
            creationFlow.setGeneratedImage(null)

            if (!creationFlow.state.selectedFormat) {
                const fallbackFormat = getDefaultFormatId(creationFlow.state.selectedPlatform)
                if (fallbackFormat) {
                    creationFlow.selectFormat(fallbackFormat)
                }
            }

            if (!creationFlow.state.aiImageDescription.trim()) {
                const fallbackDescription = Array.isArray(result.imagePromptSuggestions) && result.imagePromptSuggestions[0]
                    ? result.imagePromptSuggestions[0]
                    : (result.headline || promptValue)
                if (fallbackDescription) {
                    creationFlow.setAiImageDescription(fallbackDescription)
                }
            }

            // Expand all cards after a successful analysis
            creationFlow.setStep(6)
            return result

        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Something went wrong with the magic analysis.",
                variant: "destructive"
            })
            return null
        } finally {
            setIsMagicParsing(false)
            smartAnalyzeInFlightRef.current = false
        }
    }

    const handleGenerate = async (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
        model?: string
        promptAlreadyBuilt?: boolean
        forcedLayoutId?: string
        auditFlowId?: string
    }) => {
        if (!activeBrandKit) return
        if (creationFlow.state.isAnalyzing) {
            toast({
                title: "Analizando referencia",
                description: "Espera a que termine el anÃƒÂ¡lisis antes de generar.",
                variant: "destructive",
            })
            return
        }

        setIsGenerating(true)
        try {
            const effectiveFlowId = data.auditFlowId || auditFlowId || `flow_${Date.now()}`
            if (!auditFlowId) setAuditFlowId(effectiveFlowId)
            const prepared = buildGenerationRequestPayload({
                ...data,
                auditFlowId: effectiveFlowId
            })
            if (!prepared) return

            const { requestPayload, styleReferenceImage, attachedImages, debugContextItems } = prepared
            const selectedFormat = SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)
            const finalModelPrompt = buildFinalModelPrompt(requestPayload)

            const resolvedDebugModel = resolveImageModelForDebug(data.model)
            const requestPayloadForApi = {
                ...requestPayload,
                prompt: finalModelPrompt,
                promptAlreadyBuilt: true
            }
            setDebugPromptData({
                finalPrompt: finalModelPrompt,
                logoUrl: activeBrandKit?.logos?.[0]?.url,
                referenceImageUrl: styleReferenceImage,
                attachedImages,
                selectedStyles: creationFlow.state.selectedStyles,
                headline: creationFlow.state.headline,
                cta: creationFlow.state.cta,
                platform: creationFlow.state.selectedPlatform || undefined,
                format: creationFlow.state.selectedFormat || undefined,
                intent: creationFlow.state.selectedIntent || undefined,
                layoutId: data.forcedLayoutId || creationFlow.state.selectedLayout || undefined,
                layoutName: ALL_IMAGE_LAYOUTS.find((l) => l.id === (data.forcedLayoutId || creationFlow.state.selectedLayout))?.name,
                layoutSkillName: 'composiciones',
                layoutSkillVersion: ALL_IMAGE_LAYOUTS.find((l) => l.id === (data.forcedLayoutId || creationFlow.state.selectedLayout))?.skillVersion,
                model: resolvedDebugModel,
                aspectRatio: selectedFormat?.aspectRatio,
                compositionMode,
                contextItems: debugContextItems,
                requestPayload: requestPayloadForApi,
            })

            const effectiveModel = resolvedDebugModel
            const effectiveProvider = effectiveModel?.startsWith('wisdom/')
                ? 'Wisdom'
                : effectiveModel?.startsWith('naga/')
                    ? 'NagaAI'
                : effectiveModel?.startsWith('google/')
                    ? 'Google Oficial'
                    : 'Google Oficial'
            console.log(`[IMAGE][CLIENT] Request | Provider: ${effectiveProvider}`)
            console.log(`[IMAGE][CLIENT] Model: ${effectiveModel || 'NO_CONFIG'}`)

            setLastGenerationRequest({
                payload: requestPayloadForApi,
                errorTitle: "Error de generaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                errorFallback: "Error al generar la imagen"
            })

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayloadForApi),
            })

            if (response.ok) {
                const result = await response.json()
                creationFlow.setGeneratedImage(result.imageUrl)

                setSessionGenerations(prev => [{
                    id: Date.now().toString(),
                    image_url: result.imageUrl,
                    created_at: new Date().toISOString(),
                    prompt_used: typeof requestPayloadForApi.prompt === 'string' ? requestPayloadForApi.prompt : '',
                    request_payload: { ...requestPayloadForApi },
                    error_title: "Error de generaciÃƒÂ³n",
                    error_fallback: "Error al generar la imagen"
                }, ...prev].slice(0, 80))
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Error al generar la imagen' }))
                toast({
                    title: "Error de generaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                    description: errorData.error || 'Error al generar la imagen',
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            console.error('Generation failed:', error)
            toast({
                title: "Error de generaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                description: error.message || 'No se pudo generar la imagen.',
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleEditImage = async (editPrompt: string) => {
        if (!activeBrandKit || !creationFlow.state.generatedImage) return

        setIsGenerating(true)
        try {
            const effectiveFlowId = auditFlowId || `flow_${Date.now()}`
            if (!auditFlowId) setAuditFlowId(effectiveFlowId)
            const editContext = [{
                id: 'edit-reference',
                type: 'image' as const,
                value: creationFlow.state.generatedImage,
                label: 'Imagen a editar'
            }]

            const fullPrompt = buildEditPrompt(editPrompt)
            const selectedFormat = SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)
            const selectedStyleRef = [
                ...creationFlow.state.uploadedImages,
                ...creationFlow.state.selectedBrandKitImageIds
            ].find((id) => {
                const role = creationFlow.state.referenceImageRoles?.[id] || 'content'
                return role === 'style' || role === 'style_content'
            })

            setDebugPromptData({
                finalPrompt: fullPrompt,
                logoUrl: activeBrandKit?.logos?.[0]?.url,
                referenceImageUrl: selectedStyleRef,
                attachedImages: [creationFlow.state.generatedImage],
                selectedStyles: creationFlow.state.selectedStyles,
                headline: creationFlow.state.headline,
                cta: creationFlow.state.cta,
                platform: creationFlow.state.selectedPlatform || undefined,
                format: creationFlow.state.selectedFormat || undefined,
                intent: creationFlow.state.selectedIntent || undefined,
                layoutId: creationFlow.state.selectedLayout || undefined,
                layoutName: ALL_IMAGE_LAYOUTS.find((l) => l.id === creationFlow.state.selectedLayout)?.name,
                layoutSkillName: 'composiciones',
                layoutSkillVersion: ALL_IMAGE_LAYOUTS.find((l) => l.id === creationFlow.state.selectedLayout)?.skillVersion,
                model: resolveImageModelForDebug(),
                aspectRatio: selectedFormat?.aspectRatio,
                compositionMode,
                contextItems: editContext.map((item, idx) => ({
                    id: `edit-context-${idx}`,
                    type: item.type,
                    label: item.label || `Contexto ${idx + 1}`,
                    url: item.value,
                    source: item.id === 'edit-reference' ? 'generated' : 'unknown',
                    role: item.id === 'edit-reference' ? 'generated' : 'unknown',
                })),
            })

            const effectiveModel = resolveImageModelForDebug()
            const effectiveProvider = effectiveModel?.startsWith('wisdom/')
                ? 'Wisdom'
                : effectiveModel?.startsWith('naga/')
                    ? 'NagaAI'
                : effectiveModel?.startsWith('google/')
                    ? 'Google Oficial'
                    : 'Google Oficial'
            console.log(`[IMAGE][CLIENT] Request | Provider: ${effectiveProvider}`)
            console.log(`[IMAGE][CLIENT] Model: ${effectiveModel || 'NO_CONFIG'}`)

            const requestPayload = {
                prompt: fullPrompt,
                brandDNA: activeBrandKit,
                context: editContext,
                model: creationFlow.state.selectedImageModel || aiConfig?.imageModel,
                layoutId: creationFlow.state.selectedLayout || undefined,
                layoutName: ALL_IMAGE_LAYOUTS.find((l) => l.id === creationFlow.state.selectedLayout)?.name,
                layoutSkillVersion: ALL_IMAGE_LAYOUTS.find((l) => l.id === creationFlow.state.selectedLayout)?.skillVersion,
                compositionSkill: ALL_IMAGE_LAYOUTS.find((l) => l.id === creationFlow.state.selectedLayout)?.skillVersion
                    ? {
                        name: 'composiciones',
                        version: ALL_IMAGE_LAYOUTS.find((l) => l.id === creationFlow.state.selectedLayout)?.skillVersion,
                        layoutId: creationFlow.state.selectedLayout || undefined,
                    }
                    : undefined,
                aspectRatio: SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio,
                selectedColors: creationFlow.state.selectedBrandColors,
                auditFlowId: effectiveFlowId
            }
            setLastGenerationRequest({
                payload: requestPayload,
                errorTitle: "Error de ediciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                errorFallback: "Error al editar la imagen"
            })

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload),
            })

            if (response.ok) {
                const result = await response.json()
                creationFlow.setGeneratedImage(result.imageUrl)

                setSessionGenerations(prev => [{
                    id: Date.now().toString(),
                    image_url: result.imageUrl,
                    created_at: new Date().toISOString(),
                    prompt_used: typeof requestPayload.prompt === 'string' ? requestPayload.prompt : '',
                    request_payload: { ...requestPayload },
                    error_title: "Error de ediciÃƒÂ³n",
                    error_fallback: "Error al editar la imagen"
                }, ...prev].slice(0, 80))
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Error al editar la imagen' }))
                toast({
                    title: "Error de ediciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                    description: errorData.error || 'Error al editar la imagen',
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            console.error('Edit failed:', error)
            toast({
                title: "Error de ediciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                description: error.message || 'No se pudo editar la imagen.',
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    // Check if current user is admin
    const isAdmin = user?.emailAddresses?.some(
        email => email.emailAddress === ADMIN_EMAIL
    ) ?? false

    // Rule: once the final Branding card (Logo/Colors) is reachable, Generate must be enabled.
    const { state } = creationFlow
    const hasReachedBrandingStep =
        state.currentStep >= 5 ||
        (state.currentStep >= 4 && state.imageSourceMode === 'generate') ||
        state.hasGeneratedImage
    const canGenerate = Boolean(hasReachedBrandingStep && !state.isAnalyzing)
    const resolveImageModelForDebug = (explicitModel?: string) =>
        explicitModel || state.selectedImageModel || aiConfig?.imageModel || undefined

    // Wrapped handleGenerate with debug modal intercept (admin only)
    const handleGenerateWithDebug = async (data: {
        platform?: string
        headline?: string
        cta?: string
        prompt: string
        model?: string
        promptAlreadyBuilt?: boolean
        forcedLayoutId?: string
        auditFlowId?: string
    }) => {
        if (!isAdmin) {
            await handleGenerate(data)
            return
        }

        setIsDebugViewOnly(false)
        const prepared = buildGenerationRequestPayload(data)
        if (!prepared) return

        const { requestPayload, styleReferenceImage, attachedImages, debugContextItems } = prepared
        const finalModelPrompt = buildFinalModelPrompt(requestPayload)
        const requestPayloadForApi = {
            ...requestPayload,
            prompt: finalModelPrompt,
            promptAlreadyBuilt: true,
        }

        setDebugPromptData({
            finalPrompt: finalModelPrompt,
            logoUrl: activeBrandKit?.logos?.[0]?.url,
            referenceImageUrl: styleReferenceImage,
            attachedImages,
            selectedStyles: state.selectedStyles,
            headline: state.headline,
            cta: state.cta,
            platform: state.selectedPlatform || undefined,
            format: state.selectedFormat || undefined,
            intent: state.selectedIntent || undefined,
            layoutId: data.forcedLayoutId || state.selectedLayout || undefined,
            layoutName: ALL_IMAGE_LAYOUTS.find((l) => l.id === (data.forcedLayoutId || state.selectedLayout))?.name,
            layoutSkillName: 'composiciones',
            layoutSkillVersion: ALL_IMAGE_LAYOUTS.find((l) => l.id === (data.forcedLayoutId || state.selectedLayout))?.skillVersion,
            model: resolveImageModelForDebug(data.model),
            aspectRatio: SOCIAL_FORMATS.find(f => f.id === state.selectedFormat)?.aspectRatio,
            compositionMode,
            contextItems: debugContextItems,
            requestPayload: requestPayloadForApi,
        })
        setEditableDebugPrompt(finalModelPrompt)
        setPendingGenerationData({
            ...data,
            prompt: finalModelPrompt,
            promptAlreadyBuilt: true
        })
        setShowDebugModal(true)
    }

    const confirmGeneration = async (editedPrompt?: string) => {
        setIsDebugViewOnly(false)
        setShowDebugModal(false)
        if (pendingRetryRequest) {
            const promptFromPayload = typeof pendingRetryRequest.payload.prompt === 'string'
                ? pendingRetryRequest.payload.prompt
                : ''
            const promptToSend = editedPrompt?.trim() ? editedPrompt : promptFromPayload
            const retryPayload = {
                ...pendingRetryRequest.payload,
                prompt: promptToSend
            }

            setIsGenerating(true)
            try {
                setLastGenerationRequest({
                    payload: retryPayload,
                    errorTitle: pendingRetryRequest.errorTitle,
                    errorFallback: pendingRetryRequest.errorFallback
                })
                await executeGenerationRequest(
                    retryPayload,
                    pendingRetryRequest.errorTitle,
                    pendingRetryRequest.errorFallback
                )
            } catch (error: any) {
                console.error('Retry confirm failed:', error)
                toast({
                    title: "Error al reintentar",
                    description: error?.message || 'No se pudo volver a tirar.',
                    variant: "destructive",
                })
            } finally {
                setIsGenerating(false)
                setPendingRetryRequest(null)
            }
            return
        }

        if (pendingGenerationData) {
            const promptToSend = editedPrompt?.trim() ? editedPrompt : pendingGenerationData.prompt
            await handleGenerate({
                ...pendingGenerationData,
                prompt: promptToSend
            })
            setPendingGenerationData(null)
        }
    }

    const cancelGeneration = () => {
        setShowDebugModal(false)
        setPendingGenerationData(null)
        setPendingRetryRequest(null)
        setEditableDebugPrompt('')
        if (!isDebugViewOnly) {
            setDebugPromptData(null)
        }
        setIsDebugViewOnly(false)
    }

    const handleOpenPromptDebug = () => {
        if (!debugPromptData?.finalPrompt) {
            toast({
                title: "Sin prompt disponible",
                description: "Genera o edita una imagen primero para ver el prompt enviado.",
                variant: "destructive"
            })
            return
        }
        setIsDebugViewOnly(true)
        setEditableDebugPrompt(debugPromptData.finalPrompt || '')
        setShowDebugModal(true)
    }

    const handleUnifiedAction = async () => {
        // Mode 1: Edit existing image
        if (creationFlow.state.generatedImage && editPrompt.trim()) {
            await handleEditImage(editPrompt)
            setEditPrompt('')
            return
        }

        const currentIntent = creationFlow.state.selectedIntent
        if (!currentIntent) {
            toast({
                title: "Falta intent",
                description: "Primero analiza el prompt para detectar la intenciÃƒÂ³n.",
                variant: "destructive",
            })
            return
        }

        if (compositionMode === 'advanced' && !creationFlow.state.selectedLayout) {
            toast({
                title: "Selecciona una composiciÃƒÂ³n",
                description: "En modo avanzado debes elegir una composiciÃƒÂ³n manualmente.",
                variant: "destructive",
            })
            return
        }

        let forcedLayoutId: string | undefined
        let promptForAttempt = creationFlow.buildGenerationPrompt()
        if (compositionMode === 'basic') {
            const basicLayoutId = getNextBasicLayoutId(currentIntent)
            if (!basicLayoutId) {
                toast({
                    title: "Sin composiciones disponibles",
                    description: "No se encontraron composiciones para el intent detectado.",
                    variant: "destructive",
                })
                return
            }
            creationFlow.setSelectedLayoutForGeneration(basicLayoutId)
            forcedLayoutId = basicLayoutId
            promptForAttempt = creationFlow.buildGenerationPrompt({ selectedLayout: basicLayoutId })
        }

        // Mode 2: Generate new image
        await handleGenerateWithDebug({
            prompt: promptForAttempt,
            forcedLayoutId,
        })
    }

    const handleRetryLastPrompt = async () => {
        if (compositionMode === 'basic') {
            const currentIntent = creationFlow.state.selectedIntent
            if (!currentIntent) {
                toast({
                    title: "Falta intent",
                    description: "Primero analiza el prompt para detectar la intenciÃƒÂ³n.",
                    variant: "destructive",
                })
                return
            }
            const previousLayoutId =
                (lastGenerationRequest?.payload?.layoutId as string | undefined) ||
                creationFlow.state.selectedLayout

            const nextLayoutId = getNextBasicLayoutId(currentIntent, previousLayoutId || null)
            if (!nextLayoutId) {
                toast({
                    title: "Sin composiciones disponibles",
                    description: "No se encontraron composiciones para el intent detectado.",
                    variant: "destructive",
                })
                return
            }

            creationFlow.setSelectedLayoutForGeneration(nextLayoutId)
            const prompt = creationFlow.buildGenerationPrompt({ selectedLayout: nextLayoutId })
            await handleGenerateWithDebug({
                prompt,
                forcedLayoutId: nextLayoutId,
                promptAlreadyBuilt: true,
            })
            return
        }

        if (!lastGenerationRequest) {
            toast({
                title: "Sin prompt previo",
                description: "Genera o refina una imagen primero para volver a tirar.",
                variant: "destructive",
            })
            return
        }
        if (creationFlow.state.isAnalyzing) {
            toast({
                title: "Analizando referencia",
                description: "Espera a que termine el anÃƒÂ¡lisis antes de generar.",
                variant: "destructive",
            })
            return
        }

        setIsGenerating(true)
        try {
            await executeGenerationRequest(
                { ...lastGenerationRequest.payload },
                lastGenerationRequest.errorTitle,
                lastGenerationRequest.errorFallback
            )
        } catch (error: any) {
            console.error('Retry request failed:', error)
            toast({
                title: "Error al reintentar",
                description: error?.message || "No se pudo generar otra imagen con los mismos ajustes.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleRemoveReferenceFromPreview = (imageUrl: string) => {
        let removed = false
        if (creationFlow.state.uploadedImages.includes(imageUrl)) {
            creationFlow.removeUploadedImage(imageUrl)
            removed = true
        }
        if (creationFlow.state.selectedBrandKitImageIds.includes(imageUrl)) {
            creationFlow.toggleBrandKitImage(imageUrl)
            removed = true
        }
        if (!removed) {
            console.warn('[Preview Remove] No se encontro referencia para URL:', imageUrl.slice(0, 80))
        }
    }

    const handleDisableAiPromptReference = () => {
        creationFlow.setImageSourceMode('upload')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-lg font-medium">Cargando Imagen...</span>
            </div>
        )
    }

    return (
        <DashboardLayout
            brands={brandKits}
            currentBrand={activeBrandKit}
            onBrandChange={setActiveBrandKit}
            onBrandDelete={deleteBrandKitById}
            onNewBrandKit={handleNewBrandKit}
            isFixed={true}
        >
            {activeBrandKit ? (
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* TOP AREA: 2 Columns */}
                    <div className={cn(
                        "flex-1 flex overflow-hidden min-h-0",
                        panelPosition === 'right' ? "flex-row" : "flex-row-reverse"
                    )}>
                        {/* LEFT COLUMN (Main Canvas) */}
                        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto overflow-x-hidden min-w-0 no-scrollbar">
                            {/* Canvas Preview */}
                            <div className="flex-1 min-h-[500px] flex flex-col overflow-x-hidden">
                                <CanvasPanel
                                    currentImage={creationFlow.state.generatedImage}
                                    generations={[]}
                                    onSelectGeneration={() => { }}
                                    selectedContext={selectedContext}
                                    onRemoveContext={(id) => setSelectedContext(prev => prev.filter(c => c.id !== id))}
                                    onAddContext={(element) => setSelectedContext(prev => [...prev, element])}
                                    draggedElement={null}
                                    isGenerating={isGenerating}
                                    aspectRatio={SOCIAL_FORMATS.find(f => f.id === creationFlow.state.selectedFormat)?.aspectRatio || "4:5"}
                                    creationState={creationFlow.state}
                                    editPrompt=""
                                    onEditPromptChange={() => { }}
                                    canGenerate={Boolean(canGenerate)}
                                    onUnifiedAction={handleUnifiedAction}
                                    onCaptionChange={creationFlow.setCaption}
                                    onHeadlineChange={creationFlow.setHeadline}
                                    onCtaChange={creationFlow.setCta}
                                    onCtaUrlChange={creationFlow.setCtaUrl}
                                    onCustomTextChange={creationFlow.setCustomText}
                                    onAddTextAsset={(asset) => creationFlow.addTextAsset(asset)}
                                    onRemoveTextAsset={creationFlow.removeTextAsset}
                                    onUpdateTextAsset={creationFlow.updateTextAsset}
                                    hidePromptArea={true}
                                    onSelectLogo={creationFlow.selectLogo}
                                    onClearUploadedImage={creationFlow.clearImage}
                                    onRemoveReferenceImage={handleRemoveReferenceFromPreview}
                                    onDisableAiPromptReference={handleDisableAiPromptReference}
                                    onOpenPromptDebug={handleOpenPromptDebug}
                                    showPromptDebugTrigger={Boolean(isAdmin && creationFlow.state.generatedImage && debugPromptData?.finalPrompt)}
                                    layoutIconOverrides={layoutIconOverrides}
                                />
                            </div>

                            {/* Thumbnail History (Moved below Canvas) */}
                            <div className="flex-shrink-0">
                                <ThumbnailHistory
                                    generations={displayGenerations}
                                    currentImageUrl={creationFlow.state.generatedImage}
                                    onSelectGeneration={(gen) => {
                                        creationFlow.setGeneratedImage(gen.image_url)
                                        if (gen.request_payload) {
                                            setLastGenerationRequest({
                                                payload: { ...gen.request_payload },
                                                errorTitle: gen.error_title || "Error de generaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                                                errorFallback: gen.error_fallback || "Error al generar la imagen"
                                            })
                                        } else if (gen.prompt_used) {
                                            setLastGenerationRequest(prev => ({
                                                payload: {
                                                    ...(prev?.payload || {}),
                                                    prompt: gen.prompt_used
                                                },
                                                errorTitle: prev?.errorTitle || "Error de generaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n",
                                                errorFallback: prev?.errorFallback || "Error al generar la imagen"
                                            }))
                                        }
                                    }}
                                />
                            </div >
                        </div >

                        {/* Feedback Button - Floating to the right of the canvas area */}
                        <FeedbackButton
                            show={Boolean(creationFlow.state.generatedImage)}
                            brandId={activeBrandKit?.id as Id<"brand_dna"> | undefined}
                            intent={creationFlow.state.selectedIntent || undefined}
                            layout={creationFlow.selectedLayoutMeta?.id}
                            className={cn(
                                "z-50 transition-all duration-300",
                                isMobile
                                    ? "fixed bottom-24 right-4"
                                    : cn(
                                        "absolute top-[30%] -translate-y-1/2",
                                        panelPosition === 'right' ? "right-[32%]" : "left-[32%]"
                                    )
                            )}
                        />

                        {/* RIGHT COLUMN - Controls Panel */}
                        <ControlsPanel
                            creationFlow={creationFlow}
                            highlightedFields={highlightedFields}
                            promptValue={promptValue}
                            onPromptChange={(val) => {
                                setPromptValue(val)
                                creationFlow.setRawMessage(val)
                            }}
                            isMagicParsing={isMagicParsing}
                            isGenerating={isGenerating}
                            canGenerate={Boolean(canGenerate)}
                            onUnifiedAction={handleUnifiedAction}
                            onAnalyze={() => handleSmartAnalyze()}
                            isAdmin={isAdmin}
                            adminEmail={user?.emailAddresses?.[0]?.emailAddress}
                            compositionMode={compositionMode}
                            onCompositionModeChange={setCompositionMode}
                            layoutOverrides={layoutOverrides}
                            sessions={(workSessions || []).map((session) => ({
                                id: String(session._id),
                                title: buildSessionTitle(session.title || 'Sesion sin titulo'),
                                updatedAt: session.updated_at,
                                active: session.active,
                            }))}
                            selectedSessionId={selectedSessionToLoad}
                            onSelectSession={(id) => {
                                setSelectedSessionToLoad(id)
                                if (id && id !== currentSessionId) {
                                    void handleLoadSession(id)
                                }
                            }}
                            onCreateSession={() => void createNewImageSession(promptValue)}
                            onDeleteSession={() => void handleDeleteCurrentSession()}
                            onClearSessions={() => void handleClearAllSessions()}
                        />
                    </div>

                    {/* BOTTOM BAR: Local Edits & Generate */}
                    <div className={cn(
                        "flex-none flex border-t border-white/10 bg-background/50 backdrop-blur-md min-h-[80px]",
                        panelPosition === 'right' ? "flex-row" : "flex-row-reverse"
                    )}>
                        {/* Left: Text Area (Matches Canvas width) */}
                        <div className="flex-1 p-4 flex items-end gap-2">
                            <Textarea
                                placeholder={creationFlow.state.generatedImage ? "Describe los cambios para editar la imagen..." : "Configura tu imagen en el panel derecho..."}
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                disabled={!creationFlow.state.generatedImage}
                                className="w-full min-h-[44px] max-h-[120px] resize-none bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-100 disabled:cursor-not-allowed transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        if (creationFlow.state.generatedImage && editPrompt.trim()) {
                                            handleEditImage(editPrompt)
                                        }
                                    }
                                }}
                            />
                            {creationFlow.state.generatedImage && (
                                <Button
                                    onClick={() => handleEditImage(editPrompt)}
                                    disabled={isGenerating || !editPrompt.trim()}
                                    className="h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all font-semibold px-4 whitespace-nowrap"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Realizar correcciÃƒÂ³n
                                </Button>
                            )}
                        </div>

                        {/* Right: Generate Button (Matches ControlsPanel width) */}
                        <div className={cn(
                            "w-full md:w-[27%] p-4 flex flex-col justify-end",
                            panelPosition === 'right' ? "border-l border-white/5" : "border-r border-white/5"
                        )}>
                            {creationFlow.state.generatedImage ? (
                                <Button
                                    onClick={handleRetryLastPrompt}
                                    disabled={isGenerating || !lastGenerationRequest || creationFlow.state.isAnalyzing}
                                    className="w-full h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all font-semibold"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Generar otra con mismos ajustes
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleUnifiedAction}
                                    disabled={isGenerating || !canGenerate}
                                    className="w-full h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all font-semibold"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Generar Imagen
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="max-w-md space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold">Selecciona un Brand Kit</h2>
                        <p className="text-muted-foreground">
                            Para empezar a diseÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±ar en el panel de Imagen, necesitas seleccionar un Brand Kit.
                            Si aÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºn no tienes uno, crÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©alo en la secciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n "Brand Kit".
                        </p>
                    </div>
                </div>
            )}


            <PromptDebugModal
                open={showDebugModal}
                onClose={cancelGeneration}
                onConfirm={confirmGeneration}
                promptData={debugPromptData}
                viewOnly={isDebugViewOnly}
                editablePrompt={editableDebugPrompt}
                onEditablePromptChange={setEditableDebugPrompt}
            />


        </DashboardLayout >
    )
}


