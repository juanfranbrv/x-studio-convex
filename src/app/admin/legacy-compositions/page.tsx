
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import type { IntentCategory, LayoutOption } from '@/lib/creation-flow-types'
import { getLegacyCompositions, type LegacyComposition } from '@/lib/legacy-compositions'
import { readBasicLegacyLayouts, readPromotedLegacyLayouts, removeLegacyLayoutFromModes, setLegacyLayoutMode } from '@/lib/legacy-promotions'
import { deleteCustomLegacyLayout, deleteLegacyLayoutOverride, removeLegacyLayoutFromWarehouse, restoreLegacyLayoutToWarehouse, upsertCustomLegacyLayout, upsertLegacyLayoutOverride } from '@/lib/legacy-warehouse'
import { generateCompositionIconSvg } from '@/lib/composition-icon'
import { generateLegacyAutoCompositions, type AutoDensity, type AutoTone } from '@/lib/legacy-composition-auto'

interface LegacyCompositionsPageProps {
  searchParams: Promise<{ id?: string; q?: string; edit?: string; nuevo?: string; intent?: string }>
}

const ADMIN_EMAILS = ['juanfranbrv@gmail.com']

const INTENT_OPTIONS: Array<{ id: IntentCategory; label: string }> = [
  { id: 'oferta', label: 'oferta' },
  { id: 'escaparate', label: 'escaparate' },
  { id: 'catalogo', label: 'catalogo' },
  { id: 'lanzamiento', label: 'lanzamiento' },
  { id: 'servicio', label: 'servicio' },
  { id: 'comunicado', label: 'comunicado' },
  { id: 'evento', label: 'evento' },
  { id: 'lista', label: 'lista' },
  { id: 'comparativa', label: 'comparativa' },
  { id: 'efemeride', label: 'efemeride' },
  { id: 'equipo', label: 'equipo' },
  { id: 'cita', label: 'cita' },
  { id: 'talento', label: 'talento' },
  { id: 'logro', label: 'logro' },
  { id: 'bts', label: 'bts' },
  { id: 'dato', label: 'dato' },
  { id: 'pasos', label: 'pasos' },
  { id: 'definicion', label: 'definicion' },
  { id: 'pregunta', label: 'pregunta' },
  { id: 'reto', label: 'reto' },
]

function norm(value: FormDataEntryValue | null): string {
  return String(value || '').trim()
}

function toLayout(item: LegacyComposition): LayoutOption {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    svgIcon: item.svgIcon || 'Layout',
    textZone: (item.textZone as LayoutOption['textZone']) || 'center',
    promptInstruction: item.promptInstruction || '',
    structuralPrompt: item.structuralPrompt || '',
    skillVersion: 'legacy',
  }
}

function fromForm(formData: FormData): LayoutOption | null {
  const id = norm(formData.get('id'))
  const name = norm(formData.get('name'))
  const description = norm(formData.get('description'))
  const promptInstruction = norm(formData.get('promptInstruction'))
  if (!id || !name || !description || !promptInstruction) return null

  return {
    id,
    name,
    description,
    svgIcon: norm(formData.get('svgIcon')) || 'Layout',
    textZone: (norm(formData.get('textZone')) as LayoutOption['textZone']) || 'center',
    promptInstruction,
    structuralPrompt: norm(formData.get('structuralPrompt')),
    skillVersion: 'legacy',
  }
}

async function saveAction(formData: FormData) {
  'use server'

  const source = norm(formData.get('source')) === 'custom' ? 'custom' : 'snapshot'
  const modeBasic = formData.get('modeBasic') === 'on'
  const modeAdvanced = formData.get('modeAdvanced') === 'on'
  const layout = fromForm(formData)
  if (!layout) return

  const originalId = norm(formData.get('originalId'))
  if (source === 'custom') {
    if (originalId && originalId !== layout.id) {
      await deleteCustomLegacyLayout(originalId)
      await removeLegacyLayoutFromModes(originalId)
      await deleteLegacyLayoutOverride(originalId)
    }
    await upsertCustomLegacyLayout(layout)
  } else {
    await upsertLegacyLayoutOverride(layout)
  }

  const composition: LegacyComposition = {
    id: layout.id,
    name: layout.name,
    description: layout.description,
    file: source === 'custom' ? 'custom' : 'snapshot',
    svgIcon: layout.svgIcon || 'Layout',
    textZone: layout.textZone || 'center',
    promptInstruction: layout.promptInstruction || '',
    structuralPrompt: layout.structuralPrompt || '',
    source,
  }

  await restoreLegacyLayoutToWarehouse(layout.id)
  await setLegacyLayoutMode(composition, 'basic', modeBasic)
  await setLegacyLayoutMode(composition, 'advanced', modeAdvanced)

  revalidatePath('/admin/legacy-compositions')
  revalidatePath('/admin')
  revalidatePath('/image')
}

async function regenerateIconAction(formData: FormData) {
  'use server'

  const source = norm(formData.get('source')) === 'custom' ? 'custom' : 'snapshot'
  const layout = fromForm(formData)
  if (!layout) return

  const svgIcon = generateCompositionIconSvg(layout)
  const updatedLayout: LayoutOption = { ...layout, svgIcon }

  const originalId = norm(formData.get('originalId'))
  if (source === 'custom') {
    if (originalId && originalId !== updatedLayout.id) {
      await deleteCustomLegacyLayout(originalId)
      await removeLegacyLayoutFromModes(originalId)
      await deleteLegacyLayoutOverride(originalId)
    }
    await upsertCustomLegacyLayout(updatedLayout)
  } else {
    await upsertLegacyLayoutOverride(updatedLayout)
  }

  const composition: LegacyComposition = {
    id: updatedLayout.id,
    name: updatedLayout.name,
    description: updatedLayout.description,
    file: source === 'custom' ? 'custom' : 'snapshot',
    svgIcon: updatedLayout.svgIcon || 'Layout',
    textZone: updatedLayout.textZone || 'center',
    promptInstruction: updatedLayout.promptInstruction || '',
    structuralPrompt: updatedLayout.structuralPrompt || '',
    source,
  }

  await restoreLegacyLayoutToWarehouse(updatedLayout.id)
  await setLegacyLayoutMode(composition, 'basic', formData.get('modeBasic') === 'on')
  await setLegacyLayoutMode(composition, 'advanced', formData.get('modeAdvanced') === 'on')

  revalidatePath('/admin/legacy-compositions')
  revalidatePath('/admin')
  revalidatePath('/image')
}

async function toggleModeAction(formData: FormData) {
  'use server'

  const layoutId = norm(formData.get('layoutId'))
  const mode = norm(formData.get('mode')) as 'basic' | 'advanced'
  const enabled = norm(formData.get('enabled')) === '1'
  if (!layoutId || (mode !== 'basic' && mode !== 'advanced')) return

  const all = await getLegacyCompositions()
  const item = all.find((entry) => entry.id === layoutId)
  if (!item) return

  await setLegacyLayoutMode(item, mode, enabled)

  revalidatePath('/admin/legacy-compositions')
  revalidatePath('/admin')
  revalidatePath('/image')
}

async function deleteAction(formData: FormData) {
  'use server'

  const layoutId = norm(formData.get('layoutId'))
  const source = norm(formData.get('source')) === 'custom' ? 'custom' : 'snapshot'
  if (!layoutId) return

  await removeLegacyLayoutFromModes(layoutId)
  await deleteLegacyLayoutOverride(layoutId)
  if (source === 'custom') await deleteCustomLegacyLayout(layoutId)
  else await removeLegacyLayoutFromWarehouse(layoutId)

  revalidatePath('/admin/legacy-compositions')
  revalidatePath('/admin')
  revalidatePath('/image')
}

async function autoGenerateAction(formData: FormData) {
  'use server'

  const validIntents = new Set<string>(INTENT_OPTIONS.map((item) => item.id))
  const intentRaw = norm(formData.get('intent'))
  if (!validIntents.has(intentRaw)) return
  const intent = intentRaw as IntentCategory

  const goal = norm(formData.get('goal'))
  if (!goal) return

  const countRaw = Number(norm(formData.get('count')) || '3')
  const count = Number.isFinite(countRaw) ? Math.min(12, Math.max(1, Math.round(countRaw))) : 3

  const densityRaw = norm(formData.get('textDensity'))
  const textDensity: AutoDensity = densityRaw === 'low' || densityRaw === 'high' ? densityRaw : 'mid'

  const toneRaw = norm(formData.get('tone'))
  const tone: AutoTone = (
    toneRaw === 'comercial' ||
    toneRaw === 'institucional' ||
    toneRaw === 'didactico' ||
    toneRaw === 'dinamico'
  ) ? toneRaw : 'editorial'

  const modePresetRaw = norm(formData.get('modePreset'))
  const modePreset: 'auto' | 'basic' | 'advanced' | 'both' =
    modePresetRaw === 'basic' || modePresetRaw === 'advanced' || modePresetRaw === 'both' ? modePresetRaw : 'auto'

  const seedRaw = Number(norm(formData.get('seed')) || '0')
  const seed = Number.isFinite(seedRaw) && seedRaw > 0 ? Math.round(seedRaw) : Date.now()

  const existing = await getLegacyCompositions()
  const generated = generateLegacyAutoCompositions({
    intent,
    goal,
    count,
    textDensity,
    tone,
    seed,
    existingIds: existing.map((item) => item.id),
  })

  for (const item of generated) {
    const layout = item.layout
    await upsertCustomLegacyLayout(layout)
    await restoreLegacyLayoutToWarehouse(layout.id)

    const modeBasic = modePreset === 'basic' ? true : modePreset === 'advanced' ? false : modePreset === 'both' ? true : item.modeBasic
    const modeAdvanced = modePreset === 'basic' ? false : modePreset === 'advanced' ? true : modePreset === 'both' ? true : item.modeAdvanced

    const composition: LegacyComposition = {
      id: layout.id,
      name: layout.name,
      description: layout.description,
      file: 'custom',
      svgIcon: layout.svgIcon || 'Layout',
      textZone: layout.textZone || 'center',
      promptInstruction: layout.promptInstruction || '',
      structuralPrompt: layout.structuralPrompt || '',
      source: 'custom',
    }

    await setLegacyLayoutMode(composition, 'basic', modeBasic)
    await setLegacyLayoutMode(composition, 'advanced', modeAdvanced)
  }

  revalidatePath('/admin/legacy-compositions')
  revalidatePath('/admin')
  revalidatePath('/image')
}

export default async function LegacyCompositionsPage({ searchParams }: LegacyCompositionsPageProps) {
  const user = await currentUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || ''
  if (!ADMIN_EMAILS.includes(userEmail)) redirect('/image')

  const params = await searchParams
  const q = (params.q || '').trim().toLowerCase()
  const intentFilter = (params.intent || '').trim().toLowerCase()
  const selectedId = (params.id || '').trim()
  const isEditing = params.edit === '1' || params.nuevo === '1'
  const isNew = params.nuevo === '1'

  const [all, basic, advanced] = await Promise.all([
    getLegacyCompositions(),
    readBasicLegacyLayouts(),
    readPromotedLegacyLayouts(),
  ])

  const basicIds = new Set(basic.map((item) => item.id))
  const advancedIds = new Set(advanced.map((item) => item.id))

  const filtered = all.filter((item) => {
    const haystack = `${item.id} ${item.name} ${item.description} ${item.file}`.toLowerCase()
    if (q && !haystack.includes(q)) return false
    if (intentFilter && intentFilter !== 'all') {
      const intentNeedle = `${intentFilter}`
      const idHit = item.id.toLowerCase().startsWith(`${intentNeedle}-`)
      const textHit = haystack.includes(intentNeedle)
      if (!idHit && !textHit) return false
    }
    return true
  })

  const selected = isNew ? null : (filtered.find((item) => item.id === selectedId) || filtered[0] || null)

  const editorTarget: LegacyComposition | null = isNew
    ? {
      id: '',
      name: '',
      description: '',
      file: 'custom',
      svgIcon: 'Layout',
      textZone: 'center',
      promptInstruction: '',
      structuralPrompt: '',
      source: 'custom',
    }
    : selected

  const editorLayout = editorTarget ? toLayout(editorTarget) : null
  const renderIcon = (svgIcon?: string) => {
    if (!svgIcon || !svgIcon.trim().startsWith('<svg')) return null
    return (
      <div
        className="h-32 w-32 text-primary/70 overflow-hidden flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
        dangerouslySetInnerHTML={{ __html: svgIcon }}
      />
    )
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="space-y-1">
          <Link href="/admin" className="text-sm text-primary hover:underline">Volver a Admin</Link>
          <h1 className="text-2xl font-semibold tracking-tight">Gestor de composiciones legacy</h1>
          <p className="text-sm text-muted-foreground">
            CRUD completo: crear, editar, eliminar y mover entre basico y avanzado.
          </p>
          <p className="text-xs text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{all.length}</span>
            {' '}| Filtradas: <span className="font-semibold text-foreground">{filtered.length}</span>
            {' '}| Basico: <span className="font-semibold text-foreground">{basicIds.size}</span>
            {' '}| Avanzado: <span className="font-semibold text-foreground">{advancedIds.size}</span>
          </p>
        </header>

        <form method="get" className="flex flex-wrap gap-2">
          <input
            name="q"
            defaultValue={params.q || ''}
            placeholder="Filtrar por id, nombre o descripcion..."
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <select
            name="intent"
            defaultValue={params.intent || 'all'}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="all">Todos los intents</option>
            {INTENT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
          <button type="submit" className="h-10 rounded-md border border-border bg-muted px-4 text-sm hover:bg-muted/80">Filtrar</button>
          <Link href="/admin/legacy-compositions" className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm hover:bg-muted/40">
            Limpiar
          </Link>
          <Link href={`/admin/legacy-compositions?nuevo=1${params.q ? `&q=${encodeURIComponent(params.q)}` : ''}${params.intent ? `&intent=${encodeURIComponent(params.intent)}` : ''}`} className="inline-flex h-10 items-center rounded-md border border-primary/40 bg-primary/10 px-4 text-sm text-primary hover:bg-primary/15">
            Nueva composicion
          </Link>
        </form>

        <form action={autoGenerateAction} className="rounded-lg border border-border bg-card p-3 md:p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Generacion automatica</p>
            <p className="text-xs text-muted-foreground">
              Crea composiciones completas en modo automatico (contenido + IDs optimizados para miniatura + modos de publicacion).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <label className="text-xs text-muted-foreground md:col-span-1">
              Intent
              <select name="intent" defaultValue="servicio" className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                {INTENT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground md:col-span-3">
              Objetivo
              <input
                name="goal"
                required
                placeholder="Ej: captar leads para curso de informatica para mayores"
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="text-xs text-muted-foreground md:col-span-1">
              Cantidad
              <input
                name="count"
                type="number"
                min={1}
                max={12}
                defaultValue={3}
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground md:col-span-1">
              Semilla
              <input
                name="seed"
                type="number"
                min={1}
                placeholder="opcional"
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground md:col-span-2">
              Densidad
              <select name="textDensity" defaultValue="mid" className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                <option value="low">low</option>
                <option value="mid">mid</option>
                <option value="high">high</option>
              </select>
            </label>
            <label className="text-xs text-muted-foreground md:col-span-2">
              Tono
              <select name="tone" defaultValue="editorial" className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                <option value="editorial">editorial</option>
                <option value="comercial">comercial</option>
                <option value="institucional">institucional</option>
                <option value="didactico">didactico</option>
                <option value="dinamico">dinamico</option>
              </select>
            </label>
            <label className="text-xs text-muted-foreground md:col-span-2">
              Modo final
              <select name="modePreset" defaultValue="auto" className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
                <option value="auto">auto (recomendado)</option>
                <option value="basic">solo basico</option>
                <option value="advanced">solo avanzado</option>
                <option value="both">basico y avanzado</option>
              </select>
            </label>
          </div>
          <button type="submit" className="h-10 rounded-md border border-primary/40 bg-primary/10 px-4 text-sm text-primary hover:bg-primary/15">
            Generar composiciones automaticas
          </button>
        </form>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[520px_1fr]">
          <aside className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Catalogo editable</p>
            </div>
            <div className="max-h-[82vh] space-y-3 overflow-y-auto p-3 thin-scrollbar">
              {filtered.map((item) => {
                const detailHref = q
                  ? `/admin/legacy-compositions?id=${encodeURIComponent(item.id)}&q=${encodeURIComponent(params.q || '')}`
                  : `/admin/legacy-compositions?id=${encodeURIComponent(item.id)}`
                const editHref = `${detailHref}${q ? '&' : '?'}edit=1`

                return (
                  <div key={`${item.file}:${item.id}`} className={`rounded-md border p-2 transition-colors ${selected?.id === item.id ? 'border-primary/40 bg-primary/10' : 'border-border bg-background hover:bg-muted/50'}`}>
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <p className="text-xs text-muted-foreground">{item.id}</p>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className={`text-[10px] rounded border px-1.5 py-0.5 ${item.source === 'custom' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600' : 'border-border text-muted-foreground'}`}>
                          {item.source === 'custom' ? 'Custom' : 'Snapshot'}
                        </span>
                        {basicIds.has(item.id) ? <span className="text-[10px] rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-primary">Basico</span> : null}
                        {advancedIds.has(item.id) ? <span className="text-[10px] rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-primary">Avanzado</span> : null}
                      </div>
                    </div>

                    <Link href={detailHref} className="flex items-start gap-3">
                      {renderIcon(item.svgIcon)}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                          {item.structuralPrompt || item.promptInstruction || item.description}
                        </p>
                      </div>
                    </Link>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link href={editHref} className="inline-flex h-8 items-center rounded-md border border-border bg-background px-2.5 text-xs hover:bg-muted/50">Editar</Link>

                      <form action={toggleModeAction}>
                        <input type="hidden" name="layoutId" value={item.id} />
                        <input type="hidden" name="mode" value="advanced" />
                        <input type="hidden" name="enabled" value={advancedIds.has(item.id) ? '0' : '1'} />
                        <button type="submit" className="inline-flex h-8 items-center rounded-md border border-primary/40 bg-primary/10 px-2.5 text-xs text-primary hover:bg-primary/15">
                          {advancedIds.has(item.id) ? 'Quitar avanzado' : 'Pasar a avanzado'}
                        </button>
                      </form>

                      <form action={toggleModeAction}>
                        <input type="hidden" name="layoutId" value={item.id} />
                        <input type="hidden" name="mode" value="basic" />
                        <input type="hidden" name="enabled" value={basicIds.has(item.id) ? '0' : '1'} />
                        <button type="submit" className="inline-flex h-8 items-center rounded-md border border-secondary px-2.5 text-xs hover:bg-muted/50">
                          {basicIds.has(item.id) ? 'Quitar basico' : 'Pasar a basico'}
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}

              {filtered.length === 0 ? <p className="p-2 text-sm text-muted-foreground">Sin resultados para ese filtro.</p> : null}
            </div>
          </aside>

          <article className="rounded-lg border border-border bg-card p-4">
            {!isEditing && selected ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{selected.id}</span> | {selected.file}</p>
                  <p className="text-sm">{selected.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={(q ? `/admin/legacy-compositions?id=${encodeURIComponent(selected.id)}&q=${encodeURIComponent(params.q || '')}` : `/admin/legacy-compositions?id=${encodeURIComponent(selected.id)}`) + '&edit=1'} className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm hover:bg-muted/50">
                    Editar manualmente
                  </Link>
                  <form action={deleteAction}>
                    <input type="hidden" name="layoutId" value={selected.id} />
                    <input type="hidden" name="source" value={selected.source} />
                    <button type="submit" className="inline-flex h-9 items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 text-sm text-destructive hover:bg-destructive/15">
                      Eliminar
                    </button>
                  </form>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Prompt instruction</h3>
                  <pre className="rounded-md border border-border bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap break-words">{selected.promptInstruction || '(vacio)'}</pre>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Prompt estructural</h3>
                  <pre className="rounded-md border border-border bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap break-words">{selected.structuralPrompt || '(vacio)'}</pre>
                </div>
              </div>
            ) : null}

            {isEditing && editorLayout ? (
              <form action={saveAction} className="space-y-3">
                <input type="hidden" name="source" value={editorTarget?.source || 'custom'} />
                <input type="hidden" name="originalId" value={editorTarget?.id || ''} />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">ID</span>
                    <input name="id" defaultValue={editorLayout.id} readOnly={!isNew} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 read-only:opacity-70" />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Nombre</span>
                    <input name="name" defaultValue={editorLayout.name} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                  </label>
                </div>

                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Descripcion</span>
                  <textarea name="description" defaultValue={editorLayout.description} rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Icono SVG</span>
                    <input name="svgIcon" defaultValue={editorLayout.svgIcon} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                  </label>
                  <div className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Vista previa</span>
                    <div className="h-20 w-full rounded-md border border-border bg-background px-3 flex items-center">
                      <div className="h-20 w-20 text-primary/70 overflow-hidden flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block">
                        {editorLayout.svgIcon && editorLayout.svgIcon.trim().startsWith('<svg')
                          ? <span dangerouslySetInnerHTML={{ __html: editorLayout.svgIcon }} />
                          : null}
                      </div>
                      {!editorLayout.svgIcon || !editorLayout.svgIcon.trim().startsWith('<svg') ? (
                        <span className="text-xs text-muted-foreground ml-2">Sin SVG</span>
                      ) : null}
                    </div>
                  </div>
                  <label className="space-y-1 text-sm">
                    <span className="text-muted-foreground">Zona de texto</span>
                    <input name="textZone" defaultValue={editorLayout.textZone || 'center'} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                  </label>
                </div>

                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Prompt instruction</span>
                  <textarea name="promptInstruction" defaultValue={editorLayout.promptInstruction} rows={6} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                </label>

                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Prompt estructural</span>
                  <textarea name="structuralPrompt" defaultValue={editorLayout.structuralPrompt || ''} rows={8} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                </label>

                <div className="flex flex-wrap items-center gap-4 rounded-md border border-border p-3">
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="modeBasic" defaultChecked={editorTarget ? basicIds.has(editorTarget.id) : false} /> Activar en basico</label>
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="modeAdvanced" defaultChecked={editorTarget ? advancedIds.has(editorTarget.id) : false} /> Activar en avanzado</label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="submit" className="h-10 rounded-md border border-primary/40 bg-primary/10 px-4 text-sm text-primary hover:bg-primary/15">Guardar composicion</button>
                  <button formAction={regenerateIconAction} type="submit" className="h-10 rounded-md border border-border bg-muted px-4 text-sm hover:bg-muted/80">
                    Regenerar icono
                  </button>
                  <Link href={selected ? `/admin/legacy-compositions?id=${encodeURIComponent(selected.id)}${params.q ? `&q=${encodeURIComponent(params.q)}` : ''}` : '/admin/legacy-compositions'} className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm hover:bg-muted/40">Cancelar</Link>
                </div>
              </form>
            ) : null}

            {!selected && !isEditing ? <p className="text-sm text-muted-foreground">No hay composiciones en el catalogo.</p> : null}
          </article>
        </section>
      </div>
    </main>
  )
}
