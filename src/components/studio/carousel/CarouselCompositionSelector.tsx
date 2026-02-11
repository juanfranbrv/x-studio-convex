'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CarouselComposition } from '@/lib/carousel-structures'

interface CarouselCompositionSelectorProps {
    compositions: CarouselComposition[]
    selectedId: string
    onSelect: (id: string) => void
}

export function CarouselCompositionSelector({
    compositions,
    selectedId,
    onSelect
}: CarouselCompositionSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                {compositions.map((composition) => {
                    const isSelected = selectedId === composition.id
                    return (
                        <motion.button
                            key={composition.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(composition.id)}
                            className={cn(
                                "group relative flex flex-col transition-all duration-300",
                                "rounded-xl overflow-hidden text-left",
                                "border backdrop-blur-sm",
                                isSelected
                                    ? "border-primary/40 bg-primary/5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.25)] dark:bg-primary/10"
                                    : "border-slate-200/80 bg-white/60 hover:bg-white/90 hover:border-slate-300/80 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20"
                            )}
                            title={composition.description}
                        >
                            <div className={cn(
                                "aspect-square w-full transition-colors p-1.5",
                                isSelected
                                    ? "bg-primary/5"
                                    : "bg-zinc-50/50 group-hover:bg-zinc-50 dark:bg-white/5 dark:group-hover:bg-white/10"
                            )}>
                                <CompositionThumbnail id={composition.id} />
                            </div>
                            <div className={cn(
                                "p-1.5 px-2 border-t transition-colors",
                                isSelected
                                    ? "border-primary/20 bg-primary/5"
                                    : "border-slate-100 bg-white/40 dark:border-white/5 dark:bg-white/5"
                            )}>
                                <span className={cn(
                                    "text-[9px] font-semibold block transition-colors duration-200 truncate text-center",
                                    isSelected
                                        ? "text-primary"
                                        : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"
                                )}>
                                    {composition.name}
                                </span>
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}

function CompositionThumbnail({ id }: { id: string }) {
    const [structureId = 'default', baseId = id] = id.includes('::') ? id.split('::') : ['default', id]

    const renderVariantOverlay = () => {
        const variant = (structureId.charCodeAt(0) + structureId.length) % 4
        const dotClass = "absolute w-2 h-2 rounded-full bg-primary/80"
        switch (variant) {
            case 0:
            case 1:
            case 2:
            case 3:
            default:
                return null
        }
    }

    const withOverlay = (node: React.ReactNode) => (
        <div className="relative w-full h-full rounded-md overflow-hidden">
            {node}
            {renderVariantOverlay()}
        </div>
    )

    switch (baseId) {
        case 'free':
            return withOverlay(<TwoDiceLayout />)
        case 'basic-orbit-hook':
            return withOverlay(<BasicOrbitHookLayout />)
        case 'basic-split-stage':
            return withOverlay(<BasicSplitStageLayout />)
        case 'basic-card-core':
            return withOverlay(<BasicCardCoreLayout />)
        case 'basic-z-path':
            return withOverlay(<BasicZPathLayout />)
        case 'basic-modular-grid':
            return withOverlay(<BasicModularGridLayout />)
        case 'basic-pillar-rhythm':
            return withOverlay(<BasicPillarRhythmLayout />)
        case 'basic-diagonal-pulse':
            return withOverlay(<BasicDiagonalPulseLayout />)
        case 'basic-timeline-ribbon':
            return withOverlay(<BasicTimelineRibbonLayout />)
        case 'basic-frame-focus':
            return withOverlay(<BasicFrameFocusLayout />)
        case 'basic-cta-stage':
            return withOverlay(<BasicCTAStageLayout />)
        case 'basic-tercios-grid':
            return withOverlay(<BasicTerciosGridLayout />)
        case 'basic-golden-spiral':
            return withOverlay(<BasicGoldenSpiralLayout />)
        case 'basic-u-frame':
            return withOverlay(<BasicUFrameLayout />)
        case 'basic-golden-triangle':
            return withOverlay(<BasicGoldenTriangleLayout />)
        case 'basic-negative-chamber':
            return withOverlay(<BasicNegativeChamberLayout />)
        case 'basic-symmetric-core':
            return withOverlay(<BasicSymmetricCoreLayout />)
        case 'basic-f-scan':
            return withOverlay(<BasicFScanLayout />)
        case 'basic-z-scan':
            return withOverlay(<BasicZScanLayout />)
        case 'basic-odd-cluster':
            return withOverlay(<BasicOddClusterLayout />)
        case 'basic-leading-lines':
            return withOverlay(<BasicLeadingLinesLayout />)
        case 'basic-radial-hub':
            return withOverlay(<BasicRadialHubLayout />)
        case 'basic-vanishing-run':
            return withOverlay(<BasicVanishingRunLayout />)
        case 'basic-pyramid-stack':
            return withOverlay(<BasicPyramidStackLayout />)
        case 'basic-layered-depth':
            return withOverlay(<BasicLayeredDepthLayout />)
        case 'basic-twin-cards':
            return withOverlay(<BasicTwinCardsLayout />)
        case 'basic-crosshair-focus':
            return withOverlay(<BasicCrosshairFocusLayout />)
        case 'basic-ribbon-s':
            return withOverlay(<BasicRibbonSLayout />)
        case 'basic-arc-stage':
            return withOverlay(<BasicArcStageLayout />)
        case 'basic-window-strips':
            return withOverlay(<BasicWindowStripsLayout />)
        case 'basic-offset-quadrants':
            return withOverlay(<BasicOffsetQuadrantsLayout />)
        case 'hero-hook':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex flex-col gap-2">
                    <div className="h-3 rounded bg-primary/45" />
                    <div className="h-1.5 w-3/4 rounded bg-primary/25" />
                </div>
            )
        case 'split-duo':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-1 flex gap-1">
                    <div className="w-3/5 rounded bg-primary/30" />
                    <div className="flex-1 rounded bg-primary/45" />
                </div>
            )
        case 'stack-steps':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex flex-col gap-1">
                    <div className="h-1.5 rounded bg-primary/40" />
                    <div className="h-1.5 rounded bg-primary/30" />
                    <div className="h-1.5 rounded bg-primary/25" />
                </div>
            )
        case 'z-flow':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2">
                    <div className="h-full w-full rounded bg-gradient-to-br from-primary/20 via-transparent to-primary/30" />
                </div>
            )
        case 'grid-quads':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-1 grid grid-cols-2 gap-1">
                    <div className="rounded bg-primary/40" />
                    <div className="rounded bg-primary/25" />
                    <div className="rounded bg-primary/20" />
                    <div className="rounded bg-primary/30" />
                </div>
            )
        case 'big-number':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-3 rounded bg-primary/45" />
                    <div className="w-10 h-1 rounded bg-primary/20" />
                </div>
            )
        case 'timeline':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex">
                    <div className="w-1.5 bg-primary/35 rounded-full" />
                    <div className="flex-1 flex flex-col gap-1 pl-2">
                        <div className="h-1.5 rounded bg-primary/45" />
                        <div className="h-1 rounded bg-primary/25" />
                        <div className="h-1 rounded bg-primary/18" />
                    </div>
                </div>
            )
        case 'pillars':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 p-2 flex items-end gap-1">
                    <div className="flex-1 h-4 rounded bg-primary/30" />
                    <div className="flex-1 h-6 rounded bg-primary/40" />
                    <div className="flex-1 h-5 rounded bg-primary/25" />
                </div>
            )
        case 'diagonal':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 skew-y-6" />
                    <div className="absolute bottom-1 right-1 w-6 h-2 rounded bg-primary/45" />
                </div>
            )
        case 'card-stack':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 flex items-center justify-center relative">
                    <div className="w-4/5 h-4/5 rounded-lg bg-primary/15 border border-primary/20 rotate-[-2deg]" />
                    <div className="w-4/5 h-4/5 rounded-lg bg-primary/25 border border-primary/30 absolute rotate-3" />
                </div>
            )
        case 'cta-band':
            return withOverlay(
                <div className="w-full h-full rounded-md bg-white/60 dark:bg-white/10 flex flex-col justify-end">
                    <div className="h-2/3 bg-primary/10" />
                    <div className="h-1/3 bg-primary/35" />
                </div>
            )
        // PROBLEMA-SOLUCION VISUALS (NARRATIVE DRIVEN)
        case 'chaos-order': return withOverlay(<ChaosOrderLayout />)
        case 'bridge': return withOverlay(<BridgeLayout />)
        case 'lock-key': return withOverlay(<LockKeyLayout />)
        case 'storm-calm': return withOverlay(<CloudSunLayout />) // Reusing CloudSun
        case 'tangled': return withOverlay(<KnotLayout />) // Reusing Knot
        case 'weight': return withOverlay(<WeightLayout />)
        case 'maze': return withOverlay(<MazeLayout />)
        case 'broken-fix': return withOverlay(<KintsugiLayout />)
        case 'fog': return withOverlay(<FilterLayout />) // Reusing Filter
        case 'hurdle': return withOverlay(<HurdleLayout />)
        case 'target': return withOverlay(<BullseyeLayout />) // Reusing Bullseye

        // ANTES-DESPUES
        case 'split-v': return withOverlay(<SplitVLayout />)
        case 'diagonal': return withOverlay(<DiagonalLayout />)
        case 'spotlight': return withOverlay(<SpotlightLayout />)
        case 'arrow-trans': return withOverlay(<ArrowTransLayout />)
        case 'slider': return withOverlay(<SliderLayout />)
        case 'grid-contrast': return withOverlay(<GridContrastLayout />)
        case 'torn': return withOverlay(<TornLayout />)
        case 'mirror': return withOverlay(<MirrorLayout />)
        case 'fade': return withOverlay(<FadeLayout />)
        case 'inset': return withOverlay(<InsetLayout />)
        case 'magnify': return withOverlay(<MagnifyLayout />)
        // PASO-A-PASO
        case 'snake': return withOverlay(<SnakeLayout />)
        case 'stairs': return withOverlay(<StairsLayout />)
        case 'timeline-h': return withOverlay(<TimelineHLayout />)
        case 'track-v': return withOverlay(<TrackVLayout />)
        case 'cards': return withOverlay(<CardsLayout />)
        case 'cycle': return withOverlay(<CycleLayout />)
        case 'dots': return withOverlay(<DotsLayout />)
        case 'film': return withOverlay(<FilmLayout />)
        case 'zigzag': return withOverlay(<ZigZagLayout />)
        case 'pipeline': return withOverlay(<PipelineLayout />)
        case 'hop': return withOverlay(<HopLayout />)
        // LISTA-TIPS
        case 'clipboard': return withOverlay(<ClipboardLayout />)
        case 'postits': return withOverlay(<PostitsLayout />)
        case 'grid-cards': return withOverlay(<GridCardsLayout />)
        case 'stack-list': return withOverlay(<StackListLayout />)
        case 'bubbles': return withOverlay(<BubblesLayout />)
        case 'sidebar': return withOverlay(<SidebarLayout />)
        case 'notebook': return withOverlay(<NotebookLayout />)
        case 'icons-row': return withOverlay(<IconsRowLayout />)
        case 'honeycomb': return withOverlay(<HoneycombLayout />)
        case 'tags': return withOverlay(<TagsLayout />)
        case 'bookmarks': return withOverlay(<BookmarksLayout />)
        // TOP RANKING
        case 'podium': return withOverlay(<PodiumLayout />)
        case 'ladder': return withOverlay(<LadderLayout />)
        case 'medals': return withOverlay(<MedalsLayout />)
        case 'king': return withOverlay(<KingLayout />)
        case 'countdown': return withOverlay(<CountdownLayout />)
        case 'ticket': return withOverlay(<TicketLayout />)
        case 'bar-chart': return withOverlay(<BarChartLayout />)
        case 'circle': return withOverlay(<CircleLayout />)
        case 'trophy': return withOverlay(<TrophyLayout />)
        case 'bracket': return withOverlay(<BracketLayout />)
        case 'stars': return withOverlay(<StarsLayout />)
        // MITOS VS REALIDAD
        case 'split-x-check': return withOverlay(<SplitXCheckLayout />)
        case 'busted': return withOverlay(<BustedLayout />)
        case 'peel': return withOverlay(<PeelLayout />)
        case 'masks': return withOverlay(<MasksLayout />)
        case 'cloud-sun': return withOverlay(<CloudSunLayout />)
        case 'iceberg': return withOverlay(<IcebergLayout />)
        case 'broken-mirror': return withOverlay(<BrokenMirrorLayout />)
        case 'filter': return withOverlay(<FilterLayout />)
        case 'lightbulb': return withOverlay(<LightbulbLayout />)
        case 'shadow': return withOverlay(<ShadowLayout />)
        case 'eraser': return withOverlay(<EraserLayout />)
        // ERRORES COMUNES
        case 'warning': return withOverlay(<WarningLayout />)
        case 'red-zone': return withOverlay(<RedZoneLayout />)
        case 'stop': return withOverlay(<StopLayout />)
        case 'slope': return withOverlay(<SlopeLayout />)
        case 'trap': return withOverlay(<TrapLayout />)
        case 'chain': return withOverlay(<BrokenChainLayout />)
        case 'pen': return withOverlay(<PenLayout />)
        case 'rewind': return withOverlay(<RewindLayout />)
        case 'detour': return withOverlay(<DetourLayout />)
        case 'alarm': return withOverlay(<AlarmLayout />)
        case 'domino': return withOverlay(<DominoLayout />)
        // FRAMEWORK PAS
        case 'triptych': return withOverlay(<PAS_TriptychLayout />)
        case 'bullseye': return withOverlay(<BullseyeLayout />)
        case 'storm': return withOverlay(<StormToCalmLayout />)
        case 'knot': return withOverlay(<KnotLayout />)
        case 'amp': return withOverlay(<AmpLayout />)
        case 'burn': return withOverlay(<BurnLayout />)
        case 'scale': return withOverlay(<ScaleLayout />)
        case 'pressure': return withOverlay(<PressureLayout />)
        case 'crack': return withOverlay(<CrackLayout />)
        case 'math': return withOverlay(<MathLayout />)
        case 'puzzle': return withOverlay(<PuzzleLayout />)
        // COMPARATIVA PRODUCTOS
        case 'versus': return withOverlay(<VersusLayout />)
        case 'table': return withOverlay(<TableLayout />)
        case 'slider': return withOverlay(<SliderLayout />)
        case 'balance': return withOverlay(<BalanceLayout />)
        case 'winner': return withOverlay(<WinnerLayout />)
        case 'flip': return withOverlay(<FlipLayout />)
        case 'specs': return withOverlay(<SpecsLayout />)
        case 'mirror': return withOverlay(<MirrorLayout />)
        case 'ghost': return withOverlay(<GhostLayout />)
        case 'price': return withOverlay(<PriceLayout />)
        case 'swap': return withOverlay(<SwapLayout />)
        // CRONOLOGIA HISTORIA
        case 'path-v': return withOverlay(<PathVLayout />)
        case 'stones': return withOverlay(<StonesLayout />)
        case 'spiral': return withOverlay(<SpiralLayout />)
        case 'clock': return withOverlay(<ClockLayout />)
        case 'tree': return withOverlay(<TreeLayout />)
        case 'calendar': return withOverlay(<CalendarLayout />)
        case 'scroll': return withOverlay(<ScrollLayout />)
        case 'eras': return withOverlay(<ErasLayout />)
        // ESTUDIO CASO
        case 'before-after': return withOverlay(<BeforeAfterProLayout />)
        case 'quote': return withOverlay(<QuoteLayout />)
        case 'metric': return withOverlay(<MetricLayout />)
        case 'profile': return withOverlay(<ProfileLayout />)
        case 'steps': return withOverlay(<StepsLayout />)
        case 'document': return withOverlay(<DocumentLayout />)
        case 'graph': return withOverlay(<GraphLayout />)
        case 'logo': return withOverlay(<LogoLayout />)
        case 'story': return withOverlay(<StoryLayout />)
        case 'headshot': return withOverlay(<HeadshotLayout />)
        case 'badge': return withOverlay(<BadgeLayout />)
        // TUTORIAL HOW-TO
        case 'recipe': return withOverlay(<RecipeLayout />)
        case 'hands': return withOverlay(<HandsLayout />)
        case 'tools': return withOverlay(<ToolsLayout />)
        case 'check': return withOverlay(<CheckLayout />)
        case 'video': return withOverlay(<VideoLayout />)
        case 'flow': return withOverlay(<FlowLayout />)
        case 'split': return withOverlay(<SplitInstructLayout />)
        case 'blueprint': return withOverlay(<BlueprintLayout />)

        // CIFRAS DATO
        case 'big-number': return withOverlay(<BigNumberLayout />)
        case 'pie': return withOverlay(<PieLayout />)
        case 'bar': return withOverlay(<BarChartLayout />)
        case 'trend': return withOverlay(<TrendLineLayout />)
        case 'info': return withOverlay(<InfographicLayout />)
        case 'counter': return withOverlay(<CounterLayout />)
        case 'compare-bars': return withOverlay(<CompareBarsLayout />)
        case 'progress': return structureId === 'cifras-dato' ? withOverlay(<CircularProgressLayout />) : withOverlay(<ProgressLayout />)
        case 'type': return withOverlay(<TypeDataLayout />)
        case 'map': return withOverlay(<MapLayout />)
        case 'funnel': return withOverlay(<FunnelLayout />)

        // FRASE CELEBRE
        case 'minimal': return withOverlay(<MinimalLayout />)
        case 'bold': return withOverlay(<BoldLayout />)
        case 'author': return withOverlay(<AuthorLayout />)
        case 'marks': return withOverlay(<MarksLayout />)
        case 'typewriter': return withOverlay(<TypewriterLayout />)
        case 'hand': return withOverlay(<HandLayout />)
        case 'card': return structureId === 'promocion-oferta' ? withOverlay(<CreditCardLayout />) : withOverlay(<TextCardLayout />)
        case 'neon': return withOverlay(<NeonLayout />)
        case 'split-color': return withOverlay(<SplitColorLayout />)
        case 'press': return withOverlay(<LetterpressLayout />)
        case 'bubble': return withOverlay(<BubbleLayout />)

        // MEME HUMOR
        case 'top-bottom': return withOverlay(<TopBottomLayout />)
        case 'buttons': return withOverlay(<ButtonsLayout />)
        case 'drake': return withOverlay(<DrakeLayout />)
        case 'distracted': return withOverlay(<DistractedLayout />)
        case 'expectation': return withOverlay(<ExpectationLayout />)
        case 'brain': return withOverlay(<BrainLayout />)
        case 'mind': return withOverlay(<ChangeMindLayout />)
        case 'clown': return withOverlay(<ClownLayout />)
        case 'label': return withOverlay(<LabelingLayout />)
        case 'npc': return withOverlay(<NPCLayout />)
        case 'tier': return withOverlay(<TierLayout />)

        // PROMOCION OFERTA
        case 'percent': return withOverlay(<PercentLayout />)
        case 'timer': return withOverlay(<TimerLayout />)
        case 'coupon': return withOverlay(<CouponLayout />)
        case 'flash': return withOverlay(<FlashLayout />)
        case 'bundle': return withOverlay(<BundleLayout />)
        case 'limited': return withOverlay(<LimitedBadgeLayout />)
        case 'slash': return withOverlay(<PriceSlashLayout />)
        case 'gift': return withOverlay(<GiftLayout />)
        case 'cart': return withOverlay(<CartLayout />)
        case 'overlay': return withOverlay(<SaleOverlayLayout />)
        // COMUNICADO OPERATIVO
        case 'alert-bar': return withOverlay(<AlertBarLayout />)
        case 'notice-board': return withOverlay(<NoticeBoardLayout />)
        case 'schedule-shift': return withOverlay(<ScheduleShiftLayout />)
        case 'location-change': return withOverlay(<LocationChangeLayout />)
        case 'maintenance-window': return withOverlay(<MaintenanceWindowLayout />)
        case 'service-impact': return withOverlay(<ServiceImpactLayout />)
        case 'action-checklist': return withOverlay(<ActionChecklistLayout />)
        case 'timeline-pins': return withOverlay(<TimelinePinsLayout />)
        case 'info-stack': return withOverlay(<InfoStackLayout />)
        case 'contact-hub': return withOverlay(<ContactHubLayout />)
        // CHECKLIST DIAGNOSTICO
        case 'board': return withOverlay(<ChecklistBoardLayout />)
        case 'yes-no-split': return withOverlay(<YesNoSplitLayout />)
        case 'scorecard': return withOverlay(<ScorecardLayout />)
        case 'radar': return withOverlay(<RadarLayout />)
        case 'progress-meter': return withOverlay(<ProgressMeterLayout />)
        case 'decision-tree': return withOverlay(<DecisionTreeLayout />)
        case 'traffic-lights': return withOverlay(<TrafficLightsLayout />)
        case 'tile-grid': return withOverlay(<TileGridLayout />)
        case 'badge-levels': return withOverlay(<BadgeLevelsLayout />)
        case 'audit-columns': return withOverlay(<AuditColumnsLayout />)
        case 'stamp-result': return withOverlay(<StampResultLayout />)
        // PREGUNTAS RESPUESTAS
        case 'split-qa': return withOverlay(<SplitQALayout />)
        case 'ping-pong': return withOverlay(<PingPongLayout />)
        case 'chat-thread': return withOverlay(<ChatThreadLayout />)
        case 'accordion': return withOverlay(<AccordionLayout />)
        case 'cards': return withOverlay(<QACardsLayout />)
        case 'hotline': return withOverlay(<HotlineLayout />)
        case 'faq-grid': return withOverlay(<FAQGridLayout />)
        case 'speech-bubbles': return withOverlay(<SpeechBubblesLayout />)
        case 'timeline': return withOverlay(<QATimelineLayout />)
        case 'tagged-qa': return withOverlay(<TaggedQALayout />)
        case 'reply-thread': return withOverlay(<ReplyThreadLayout />)


        // FRAMEWORK PAS (NEW 12)
        case 'abyss':
            return withOverlay(<AbyssLayout />)
        case 'thorn':
            return withOverlay(<ThornLayout />)
        case 'horizon':
            return withOverlay(<HorizonLayout />)
        case 'anchor':
            return withOverlay(<AnchorLayout />)
        case 'crush':
            return withOverlay(<CrushLayout />)
        case 'ascent':
            return withOverlay(<AscentLayout />)
        case 'breach':
            return withOverlay(<BreachLayout />)
        case 'orbit':
            return withOverlay(<OrbitLayout />)
        case 'fragment':
            return withOverlay(<FragmentLayout />)
        case 'filter':
            return withOverlay(<FilterNewLayout />)
        case 'intersection':
            return withOverlay(<IntersectionLayout />)
        case 'eclipse':
            return withOverlay(<EclipseLayout />)

        // OLD PAS (Keeping for reference if needed, but likely unused)
        case 'pas-triptych':
            return withOverlay(<PAS_TriptychLayout />)
        case 'bullseye':
            return withOverlay(<BullseyeLayout />)
        case 'storm-to-calm':
            return withOverlay(<StormToCalmLayout />)
        case 'knot':
            return withOverlay(<KnotLayout />)
        case 'amp':
            return withOverlay(<AmpLayout />)
        case 'burn':
            return withOverlay(<BurnLayout />)
        case 'scale':
            return withOverlay(<ScaleLayout />)
        case 'pressure':
            return withOverlay(<PressureLayout />)
        case 'crack':
            return withOverlay(<CrackLayout />)
        case 'math':
            return withOverlay(<MathLayout />)
        case 'puzzle':
            return withOverlay(<PuzzleLayout />)

        default:
            return withOverlay(<DefaultIcon />)
    }
}

// === COMPOSITION VISUALS (Flat & Monochrome Style) ===

// --- TOP RANKING ---
function PodiumLayout() { return <div className="w-full h-full p-2 flex items-end justify-center gap-0.5"><div className="w-4 h-[40%] bg-primary/30 rounded-t-sm" /><div className="w-4 h-[60%] bg-primary/50 rounded-t-sm relative"><div className="absolute -top-3 left-0 right-0 text-center text-[8px] font-bold text-primary">1</div></div><div className="w-4 h-[30%] bg-primary/20 rounded-t-sm" /></div> }
function LadderLayout() { return <div className="w-full h-full p-2 flex flex-col gap-1 justify-center items-center"><div className="w-3/4 h-1 bg-primary/60 rounded-full" /><div className="w-3/4 h-1 bg-primary/40 rounded-full" /><div className="w-3/4 h-1 bg-primary/20 rounded-full" /><div className="h-full w-0.5 bg-primary/10 absolute left-4" /><div className="h-full w-0.5 bg-primary/10 absolute right-4" /></div> }
function MedalsLayout() { return <div className="w-full h-full p-2 flex items-center justify-center gap-1"><div className="w-3 h-3 rounded-full bg-primary/30 border border-primary/40" /><div className="w-4 h-4 rounded-full bg-primary/60 border border-primary/80 mb-2" /><div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/30" /></div> }
function KingLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-primary/40 relative"><div className="absolute -top-1 -left-1 w-2 h-2 bg-primary/60 rounded-full" /></div></div> }
function CountdownLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="absolute top-1 right-2 text-[8px] text-primary/30">3</div><div className="absolute bottom-2 left-2 text-[8px] text-primary/40">2</div><div className="text-lg font-bold text-primary/60">1</div></div> }
function TicketLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-full h-1/2 bg-primary/20 border-dashed border-2 border-primary/40 rounded-sm flex items-center justify-center"><div className="w-4 h-4 bg-primary/60 rounded-full" /></div></div> }
function BarChartLayout() { return <div className="w-full h-full p-2 flex flex-col gap-1 justify-center"><div className="w-[90%] h-1.5 bg-primary/60 rounded-full" /><div className="w-[70%] h-1.5 bg-primary/40 rounded-full" /><div className="w-[50%] h-1.5 bg-primary/20 rounded-full" /></div> }
function CircleLayout() { return <div className="w-full h-full p-2 relative flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-primary/60" /><div className="absolute top-1 right-1 w-2 h-2 bg-primary/30 rounded-full" /><div className="absolute bottom-1 left-2 w-2 h-2 bg-primary/20 rounded-full" /></div> }
function TrophyLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-8 h-1 bg-primary/30 mb-1" /><div className="w-4 h-6 bg-primary/20 rounded-t-sm border-x-2 border-primary/40 relative"><div className="absolute -top-2 left-[-2px] w-5 h-2 bg-primary/10 rounded-full border border-primary/40" /></div></div> }
function BracketLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><svg className="stroke-primary/40 fill-none w-full h-full"><path d="M2 5 h5 M2 15 h5 M7 5 v10 M7 10 h5 M15 10 h5" strokeWidth="1.5" /></svg></div> }
function StarsLayout() { return <div className="w-full h-full p-2 flex items-center justify-center gap-0.5"><div className="w-2 h-2 bg-primary/60 clip-[polygon(50%_0,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" /><div className="w-2 h-2 bg-primary/60 clip-[polygon(50%_0,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" /><div className="w-2 h-2 bg-primary/60 clip-[polygon(50%_0,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" /></div> }

// --- MITOS VS REALIDAD ---
function SplitXCheckLayout() { return <div className="w-full h-full flex"><div className="flex-1 bg-primary/10 flex items-center justify-center text-primary/40 text-[10px]">✕</div><div className="flex-1 bg-primary/30 flex items-center justify-center text-primary/80 text-[10px]">✓</div></div> }
function BustedLayout() { return <div className="w-full h-full p-2 relative flex items-center justify-center"><div className="w-full h-full bg-primary/10" /><div className="absolute border-2 border-primary/60 text-[8px] font-bold text-primary/60 px-1 -rotate-12 border-double">BUSTED</div></div> }
function PeelLayout() { return <div className="w-full h-full bg-primary/20 relative overflow-hidden"><div className="absolute top-0 right-0 w-4 h-4 bg-primary/40 shadow-sm" /><div className="absolute top-0 right-0 w-0 h-0 border-b-[16px] border-b-primary/60 border-r-[16px] border-r-transparent rotate-90" /></div> }
function MasksLayout() { return <div className="w-full h-full p-2 flex items-center justify-center gap-1"><div className="w-4 h-5 bg-primary/20 rounded-full border border-primary/40 flex items-center justify-center text-[8px]">:(</div><div className="w-4 h-5 bg-primary/40 rounded-full border border-primary/60 flex items-center justify-center text-[8px]">:)</div></div> }
function CloudSunLayout() { return <div className="w-full h-full p-2 relative"><div className="absolute top-1 left-1 w-4 h-4 bg-primary/20 rounded-full" /><div className="absolute bottom-1 right-1 w-5 h-5 bg-primary/60 rounded-full border-2 border-primary/20 border-dashed" /></div> }
function IcebergLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-end relative"><div className="w-full h-[1px] bg-primary/40 absolute top-1/3" /><div className="w-4 h-2 bg-primary/20 rounded-t-full mb-0.5" /><div className="w-8 h-6 bg-primary/50 rounded-b-xl" /></div> }
function BrokenMirrorLayout() { return <div className="w-full h-full p-2"><div className="w-full h-full bg-primary/10 border border-primary/30 relative overflow-hidden"><div className="absolute w-full h-[1px] bg-primary/40 top-1/2 rotate-12" /><div className="absolute w-full h-[1px] bg-primary/40 top-1/3 -rotate-45" /></div></div> }
function FilterLayout() { return <div className="w-full h-full flex p-1 gap-1"><div className="flex-1 bg-primary/10 blur-[1px]" /><div className="flex-1 bg-primary/40 border border-primary/60" /></div> }
function LightbulbLayout() { return <div className="w-full h-full p-2 flex gap-1 items-center justify-center"><div className="w-3 h-4 bg-primary/10 rounded-full opacity-50" /><div className="w-4 h-5 bg-primary/40 rounded-full border border-primary/60 shadow-[0_0_5px_rgba(var(--primary),0.5)]" /></div> }
function ShadowLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-end"><div className="w-4 h-4 bg-primary/60 rounded-sm mb-1" /><div className="w-6 h-2 bg-primary/20 skew-x-12 rounded-full blur-[1px]" /></div> }
function EraserLayout() { return <div className="w-full h-full p-2 relative"><div className="w-full h-full bg-primary/10" /><div className="absolute top-0 left-0 w-full h-1/2 bg-white dark:bg-zinc-800 skew-y-6 opacity-80 border-b border-primary/20" /></div> }

// --- ERRORES COMUNES ---
function WarningLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-primary/60 relative"><div className="absolute bottom-1 left-[-1px] text-[10px] text-white font-bold">!</div></div></div> }
function RedZoneLayout() { return <div className="w-full h-full p-1 relative"><div className="size-full rounded-sm bg-primary/10" /><div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/50 rounded-bl-xl rounded-tr-sm" /></div> }
function StopLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-6 bg-primary/60 clip-[polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)] flex items-center justify-center"><div className="w-4 h-1 bg-white" /></div></div> }
function SlopeLayout() { return <div className="w-full h-full p-2 relative"><div className="absolute top-2 left-2 w-2 h-2 bg-primary/60 rounded-full" /><div className="w-full h-0.5 bg-primary/40 rotate-12 absolute top-1/2" /><div className="absolute bottom-2 right-2 w-2 h-2 bg-primary/20 rounded-full text-[6px] flex items-center justify-center">?</div></div> }
function TrapLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-end"><div className="w-6 h-3 border-t-2 border-primary/60 rounded-t-full relative"><div className="absolute bottom-0 left-1/2 w-1 h-3 bg-primary/40 -translate-x-1/2 -rotate-12 origin-bottom" /></div><div className="w-8 h-1 bg-primary/30" /></div> }
function BrokenChainLayout() { return <div className="w-full h-full p-2 flex items-center justify-center gap-0.5"><div className="w-3 h-1.5 border-2 border-primary/40 rounded-full" /><div className="w-3 h-1.5 border-2 border-primary/20 rounded-full rotate-45 border-dashed" /><div className="w-3 h-1.5 border-2 border-primary/40 rounded-full" /></div> }
function PenLayout() { return <div className="w-full h-full p-2 relative"><div className="w-full h-full bg-primary/5" /><svg className="absolute inset-0 stroke-primary/60 fill-none"><path d="M5 5 l10 10 M15 5 l-10 10" strokeWidth="1.5" /></svg></div> }
function RewindLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary/40 rounded-full border-t-transparent -rotate-45 relative"><div className="absolute -top-1 -left-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-primary/60 rotate-[-45deg]" /></div></div> }
function DetourLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><svg className="stroke-primary/60 fill-none w-6 h-6"><path d="M2 15 h5 a3 3 0 0 0 3-3 v-4 a3 3 0 0 1 3-3 h5" strokeWidth="1.5" /><path d="M16 3 l3 2 l-3 2" strokeWidth="1.5" /></svg></div> }
function AlarmLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-4 h-4 bg-primary/50 rounded-t-lg rounded-b-sm custom-bell" /><div className="absolute top-1 left-2 w-1 h-2 -rotate-45 bg-primary/30 rounded-full" /><div className="absolute top-1 right-2 w-1 h-2 rotate-45 bg-primary/30 rounded-full" /></div> }
function DominoLayout() { return <div className="w-full h-full p-2 flex items-end justify-center gap-0.5"><div className="w-2 h-6 bg-primary/40 rotate-[-15deg]" /><div className="w-2 h-6 bg-primary/30 rotate-[-30deg] origin-bottom-left" /><div className="w-2 h-6 bg-primary/10 rotate-[-60deg] origin-bottom-left" /></div> }

// --- FRAMEWORK PAS ---
// --- FRAMEWORK PAS (NEW 12) ---
function AbyssLayout() { return <div className="w-full h-full p-2 flex flex-col justify-between items-center"><div className="w-full h-3/4 bg-primary/80 rounded-2xl" /><div className="w-3/4 h-1.5 bg-primary/20 rounded-full mt-1" /></div> }
function ThornLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-12 h-12 bg-primary/20 rounded-full" /><div className="absolute bottom-2 right-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[28px] border-b-primary/80 rotate-45 rounded-sm" /></div> }
function HorizonLayout() { return <div className="w-full h-full p-2 flex flex-col justify-end"><div className="w-10 h-10 bg-primary/40 rounded-full mx-auto -mb-4" /><div className="w-full h-2 bg-primary/60 rounded-full" /></div> }
function AnchorLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-end"><div className="w-2 h-2 bg-primary/40 rounded-full mb-1" /><div className="w-6 h-3 bg-primary/30 rounded-t-lg" /><div className="w-10 h-5 bg-primary/60 rounded-t-lg" /><div className="w-full h-4 bg-primary/80 rounded-t-lg" /></div> }
function CrushLayout() { return <div className="w-full h-full p-2 flex justify-between items-center gap-1"><div className="w-3 h-full bg-primary/60 rounded-full" /><div className="w-1 h-3/4 bg-primary/20 rounded-full" /><div className="w-3 h-full bg-primary/60 rounded-full" /></div> }
function AscentLayout() { return <div className="w-full h-full p-2 flex items-end justify-center gap-1"><div className="w-3 h-4 bg-primary/30 rounded-t-lg" /><div className="w-3 h-8 bg-primary/50 rounded-t-lg" /><div className="w-3 h-full bg-primary/80 rounded-t-lg" /></div> }
function BreachLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-10 h-10 bg-primary/80 rounded-full" /><div className="absolute h-full w-2 bg-white dark:bg-zinc-950 rotate-12" /></div> }
function OrbitLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-primary/20 relative flex items-center justify-center"><div className="absolute top-0 right-0 w-3 h-3 bg-primary/60 rounded-full" /><div className="w-4 h-4 bg-primary/80 rounded-full" /></div></div> }
function FragmentLayout() { return <div className="w-full h-full p-2 relative"><div className="absolute top-2 left-2 w-4 h-4 bg-primary/40 rounded-lg -rotate-12" /><div className="absolute bottom-2 right-2 w-5 h-5 bg-primary/60 rounded-lg rotate-12" /><div className="absolute top-2 right-2 w-3 h-3 bg-primary/30 rounded-full" /></div> }
function FilterNewLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-center gap-1"><div className="flex gap-1"><div className="w-2 h-2 bg-primary/30 rounded-full" /><div className="w-2 h-2 bg-primary/30 rounded-full" /><div className="w-2 h-2 bg-primary/30 rounded-full" /></div><div className="w-8 h-1 bg-primary/20 rounded-full" /><div className="w-4 h-4 bg-primary/80 rounded-full mt-1" /></div> }
function IntersectionLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="absolute w-full h-2 bg-primary/30 rotate-45 rounded-full" /><div className="absolute w-full h-2 bg-primary/30 -rotate-45 rounded-full" /><div className="w-4 h-4 bg-primary/80 rounded-full z-10 ring-2 ring-white dark:ring-zinc-950" /></div> }
function EclipseLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-8 h-8 bg-primary/30 rounded-full absolute right-2" /><div className="w-8 h-8 bg-primary/80 rounded-full absolute left-2 ring-2 ring-white dark:ring-zinc-950" /></div> }

// --- OLD PAS (Deprecated?) ---
function PAS_TriptychLayout() { return <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1"><div className="bg-primary/20" /><div className="bg-primary/50" /><div className="bg-primary/10" /></div> }
function BullseyeLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center"><div className="w-4 h-4 rounded-full border border-primary/40 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-primary/60 rounded-full" /></div></div></div> }
function StormToCalmLayout() { return <div className="w-full h-full flex"><div className="flex-1 bg-primary/40 opacity-80" /><div className="flex-1 bg-gradient-to-r from-primary/40 to-primary/10" /><div className="flex-1 bg-primary/10" /></div> }
function KnotLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><svg className="stroke-primary/50 fill-none w-6 h-6"><path d="M2 10 c5 0 5-5 10 0 s5 0 10 0" strokeWidth="1.5" /></svg></div> }
function AmpLayout() { return <div className="w-full h-full p-2 flex flex-col justify-end gap-0.5"><div className="w-1 h-2 bg-primary/10" /><div className="w-1 h-3 bg-primary/20" /><div className="w-1 h-5 bg-primary/40" /><div className="w-1 h-full bg-primary/60" /></div> }
function BurnLayout() { return <div className="w-full h-full p-2 relative flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary/40 rounded-full bg-white/10 relative"><div className="absolute top-1/2 left-1/2 w-8 h-[1px] bg-primary/30 -rotate-45 -translate-x-1/2 -translate-y-1/2" /></div></div> }
function ScaleLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-center"><div className="w-8 h-[1px] bg-primary/40 rotate-12 relative"><div className="absolute left-0 bottom-0 w-2 h-2 rounded-sm bg-primary/50 translate-y-2" /><div className="absolute right-0 bottom-0 w-2 h-2 rounded-sm bg-primary/20 translate-y-[-2px]" /></div><div className="w-0.5 h-4 bg-primary/30 mt-1" /></div> }
function PressureLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-8 h-4 rounded-t-full border-2 border-primary/30 relative overflow-hidden"><div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-primary/60 origin-bottom rotate-45" /></div></div> }
function CrackLayout() { return <div className="w-full h-full p-2 bg-primary/5 flex items-center justify-center"><svg className="stroke-primary/40 fill-none w-6 h-6"><path d="M12 12 l-4 -4 m4 4 l3 -3 m-3 3 l-2 5" strokeWidth="1" /></svg></div> }
function MathLayout() { return <div className="w-full h-full p-2 flex items-center justify-center text-[10px] font-mono text-primary/60">X+Y=?</div> }
function PuzzleLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-6 h-6 bg-primary/20 grid grid-cols-2 gap-px"><div className="bg-primary/40" /><div className="bg-primary/40" /><div className="bg-transparent border border-primary/20 border-dashed" /><div className="bg-primary/40" /></div></div> }

// --- COMPARATIVA PRODUCTOS ---
function VersusLayout() { return <div className="w-full h-full p-2 flex items-center justify-center gap-0.5"><div className="flex-1 h-full bg-primary/20 rounded-l-sm" /><div className="text-[10px] font-bold text-primary/80 z-10 bg-white dark:bg-zinc-800 px-0.5 rounded-full">VS</div><div className="flex-1 h-full bg-primary/40 rounded-r-sm" /></div> }
function TableLayout() { return <div className="w-full h-full p-2 flex flex-col gap-0.5"><div className="w-full h-1.5 bg-primary/20 rounded-full" /><div className="w-full h-1.5 bg-primary/10 rounded-full" /><div className="w-full h-1.5 bg-primary/10 rounded-full" /></div> }
// SliderLayout reused
function BalanceLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-full h-1 bg-primary/40 rotate-6 relative"><div className="absolute left-0 bottom-1 w-3 h-3 rounded-sm bg-primary/60" /><div className="absolute right-0 bottom-[-2px] w-3 h-3 rounded-sm bg-primary/20" /></div><div className="w-0.5 h-3 bg-primary/30" /></div> }
function WinnerLayout() { return <div className="w-full h-full p-2 relative flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-primary/20 absolute top-2 right-2" /><div className="w-8 h-8 rounded-full bg-primary/60 z-10 border-2 border-primary/20 flex items-center justify-center text-white text-[8px]">★</div></div> }
function FlipLayout() { return <div className="w-full h-full p-2 flex items-center justify-center perspective-[50px]"><div className="w-8 h-10 bg-primary/40 rounded-sm rotate-y-45 border-r-2 border-primary/60" /></div> }
function SpecsLayout() { return <div className="w-full h-full p-2 relative"><div className="border border-primary/30 w-full h-full grid grid-cols-2 grid-rows-2"><div className="border-r border-b border-primary/20" /><div className="border-b border-primary/20" /><div className="border-r border-primary/20" /><div /></div></div> }
// MirrorLayout reused
function GhostLayout() { return <div className="w-full h-full p-2 flex items-center justify-center gap-1"><div className="w-4 h-4 bg-primary/60 rounded-sm" /><div className="w-4 h-4 border border-dashed border-primary/40 rounded-sm" /></div> }
function PriceLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-4 bg-primary/20 rounded-sm relative"><div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-primary/60" /></div></div> }
function SwapLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-center gap-0.5"><div className="flex gap-2"><div className="w-3 h-3 bg-primary/20 rounded-sm" /><div className="w-3 h-3 bg-primary/60 rounded-sm" /></div><div className="text-[8px] text-primary/40">⇄</div></div> }

// --- CRONOLOGIA HISTORIA ---
// TimelineHLayout reused
function PathVLayout() { return <div className="w-full h-full p-1 flex justify-center"><svg className="stroke-primary/40 fill-none w-full h-full"><path d="M12 2 q 5 5 0 10 q -5 5 0 10" strokeWidth="1.5" /><circle cx="12" cy="7" r="1.5" className="fill-primary/60" /><circle cx="12" cy="17" r="1.5" className="fill-primary/60" /></svg></div> }
function StonesLayout() { return <div className="w-full h-full p-2 flex flex-wrap gap-1 items-center justify-center"><div className="w-2 h-1.5 bg-primary/20 rounded-full" /><div className="w-2 h-1.5 bg-primary/30 rounded-full translate-y-1" /><div className="w-2 h-1.5 bg-primary/40 rounded-full" /></div> }
function SpiralLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><svg className="stroke-primary/40 fill-none w-8 h-8"><path d="M16 16 m 0 0 l-2 -2 a 2 2 0 0 1 4 0 a 4 4 0 0 1 -6 0 a 6 6 0 0 1 10 0" strokeWidth="1" /></svg></div> }
// FilmLayout reused
function ClockLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary/40 relative"><div className="absolute top-1/2 left-1/2 h-3 w-0.5 bg-primary/60 -translate-x-1/2 -translate-y-full origin-bottom" /><div className="absolute top-1/2 left-1/2 h-2 w-0.5 bg-primary/40 -translate-x-1/2 -translate-y-full origin-bottom rotate-90" /></div></div> }
function TreeLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-end"><div className="w-0.5 h-4 bg-primary/60" /><div className="w-6 h-4 bg-primary/30 rounded-full -mb-2" /></div> }
function CalendarLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 bg-primary/5 border border-primary/20 grid grid-cols-3 gap-0.5 p-0.5"><div className="bg-primary/20 rounded-[1px]" /><div className="bg-primary/20 rounded-[1px]" /><div className="bg-primary/60 rounded-[1px]" /><div className="bg-primary/20 rounded-[1px]" /><div className="bg-primary/20 rounded-[1px]" /></div></div> }
// DotsLayout reused
function ScrollLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-8 bg-primary/10 border-y-2 border-primary/40 rounded-sm relative"><div className="absolute -top-1 left-1/2 w-8 h-1 bg-primary/60 rounded-full -translate-x-1/2" /><div className="absolute -bottom-1 left-1/2 w-8 h-1 bg-primary/60 rounded-full -translate-x-1/2" /></div></div> }
function ErasLayout() { return <div className="w-full h-full p-2 flex gap-0.5"><div className="flex-1 bg-primary/20" /><div className="flex-1 bg-primary/40" /><div className="flex-1 bg-primary/60" /></div> }

// --- ESTUDIO CASO ---
function BeforeAfterProLayout() { return <div className="w-full h-full flex"><div className="w-1/2 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[6px] text-primary/40">BEFORE</div><div className="w-1/2 bg-primary/20 flex items-center justify-center text-[6px] text-primary/80">AFTER</div></div> }
function QuoteLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="absolute top-1 left-1 text-2xl leading-3 text-primary/20">“</div><div className="w-6 h-6 rounded-full bg-primary/40 border-2 border-primary/10" /></div> }
function MetricLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="text-sm font-bold text-primary/80">3x</div></div> }
function ProfileLayout() { return <div className="w-full h-full p-2 flex gap-1 items-center"><div className="w-3 h-4 bg-primary/40 rounded-sm" /><div className="flex-1 flex flex-col gap-0.5"><div className="h-0.5 w-full bg-primary/20" /><div className="h-0.5 w-3/4 bg-primary/20" /></div></div> }
function StepsLayout() { return <div className="w-full h-full p-2 flex flex-col justify-between"><div className="h-1.5 w-4 bg-primary/20 rounded-r-full self-start" /><div className="h-1.5 w-4 bg-primary/40 rounded-r-full self-center" /><div className="h-1.5 w-4 bg-primary/60 rounded-r-full self-end" /></div> }
function DocumentLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-8 bg-primary/10 border border-primary/20 rounded-tr-lg relative"><div className="absolute top-0 right-0 w-2 h-2 bg-primary/20 border-l border-b border-primary/20" /></div></div> }
function GraphLayout() { return <div className="w-full h-full p-2 flex items-end"><div className="w-full h-6 border-l border-b border-primary/40 relative"><div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-primary/10 to-transparent clip-path-polygon-[0_100,100_0,100_100]" /></div></div> }
function LogoLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-6 rotate-45 border-2 border-primary/60 rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-primary/40" /></div></div> }
function StoryLayout() { return <div className="w-full h-full flex p-1 gap-1"><div className="w-1/3 flex flex-col gap-0.5 pt-1"><div className="h-0.5 w-full bg-primary/20" /><div className="h-0.5 w-full bg-primary/20" /><div className="h-0.5 w-full bg-primary/20" /></div><div className="flex-1 bg-primary/30 rounded-sm" /></div> }
function HeadshotLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-full h-full absolute left-1/2 bg-primary/10 rounded-l-full" /><div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-white relative z-10" /></div> }
function BadgeLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-6 bg-primary/10 rounded-full border border-primary/40 flex items-center justify-center relative"><div className="absolute -bottom-1 w-2 h-2 bg-primary/60 rotate-45" /></div></div> }

// --- TUTORIAL HOW-TO ---
function RecipeLayout() { return <div className="w-full h-full p-2"><div className="w-full h-full bg-white dark:bg-zinc-800 shadow-sm border border-primary/10 rounded-sm p-1 flex flex-col gap-0.5"><div className="h-1 w-1/2 bg-primary/40" /><div className="h-[0.5px] w-full bg-primary/20 my-0.5" /><div className="h-3 w-full bg-primary/5 rounded-sm" /></div></div> }
function HandsLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-4 h-4 bg-primary/40 rounded-full mb-[-5px]" /><div className="w-4 h-4 bg-primary/40 rounded-full mb-[-5px] translate-x-4" /></div> }
function ToolsLayout() { return <div className="w-full h-full p-2 grid grid-cols-2 gap-1 content-center"><div className="w-0.5 h-4 bg-primary/60 rotate-45 justify-self-center" /><div className="w-3 h-3 bg-primary/30 rounded-full justify-self-center" /></div> }
function CheckLayout() { return <div className="w-full h-full p-2 flex flex-col gap-1 justify-center"><div className="flex gap-1 items-center"><div className="w-2 h-2 border border-primary/40 rounded-[1px]" /><div className="h-0.5 w-6 bg-primary/10" /></div><div className="flex gap-1 items-center"><div className="w-2 h-2 bg-primary/60 rounded-[1px] flex items-center justify-center"><div className="text-[6px] text-white">✓</div></div><div className="h-0.5 w-6 bg-primary/10" /></div></div> }
function VideoLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-full h-full bg-primary/10 rounded-sm flex items-center justify-center"><div className="w-4 h-3 bg-primary/80 rounded-[2px] flex items-center justify-center"><div className="w-0 h-0 border-l-[3px] border-l-white border-y-[2px] border-y-transparent ml-0.5" /></div></div><div className="absolute bottom-3 left-3 w-8 h-0.5 bg-primary/40 rounded-full" /></div> }
function FlowLayout() { return <div className="w-full h-full p-2 flex flex-col items-center gap-0.5"><div className="w-3 h-3 border border-primary/40 rotate-45" /><div className="h-2 w-0.5 bg-primary/20" /><div className="flex gap-2"><div className="w-3 h-3 bg-primary/20 rounded-sm" /><div className="w-3 h-3 bg-primary/20 rounded-sm" /></div></div> }
function SplitInstructLayout() { return <div className="w-full h-full flex flex-col"><div className="flex-1 bg-primary/20" /><div className="flex-1 bg-white dark:bg-zinc-800 p-1 flex flex-col gap-0.5"><div className="h-0.5 w-full bg-primary/10" /><div className="h-0.5 w-3/4 bg-primary/10" /></div></div> }
// ArrowLayout reused with check?
function BlueprintLayout() { return <div className="w-full h-full bg-primary/80 p-1 grid grid-cols-4 grid-rows-4 gap-0.5"><div className="border border-white/20 col-span-2 row-span-2" /><div className="border border-white/20" /><div className="border border-white/20" /><div className="border border-white/20" /><div className="border border-white/20" /></div> }
function ProgressLayout() { return <div className="w-full h-full p-2 flex flex-col justify-center gap-1"><div className="w-full h-full bg-primary/5 rounded-sm p-1" /><div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-primary/60" /></div></div> }

// --- CIFRAS DATO ---
function BigNumberLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="text-xl font-bold text-primary/80">85%</div></div> }
function PieLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary/60 border-r-primary/60 rotate-45" /></div> }
function TrendLineLayout() { return <div className="w-full h-full p-2 flex items-end"><svg className="w-full h-full stroke-primary/60 fill-none"><polyline points="0,20 10,15 20,18 30,5" strokeWidth="2" /></svg></div> }
function InfographicLayout() { return <div className="w-full h-full p-2 flex flex-col gap-1 items-center"><div className="w-4 h-4 rounded-full bg-primary/20" /><div className="w-0.5 h-2 bg-primary/40" /><div className="w-4 h-4 rounded-full bg-primary/40" /><div className="w-0.5 h-2 bg-primary/60" /><div className="w-4 h-4 rounded-full bg-primary/60" /></div> }
function CounterLayout() { return <div className="w-full h-full p-2 flex items-center justify-center bg-zinc-900 rounded-sm"><div className="text-primary font-mono text-xs tracking-widest">09:41</div></div> }
function CompareBarsLayout() { return <div className="w-full h-full p-2 flex flex-col justify-center gap-1"><div className="w-1/2 h-2 bg-primary/30 rounded-r-full" /><div className="w-3/4 h-2 bg-primary/60 rounded-r-full" /></div> }
function CircularProgressLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary/10 border-t-primary/60 rotate-[-90deg]" /></div> }
function TypeDataLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="text-[8px] text-primary/40 leading-3 text-center">ONE IN <span className="text-lg font-bold text-primary/80 block">3</span> PEOPLE</div></div> }
function MapLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-8 h-6 bg-primary/20 rounded-sm clip-[polygon(20%_0%,80%_0%,100%_20%,100%_100%,0%_100%,0%_20%)]" /><div className="absolute top-1 right-2 w-1 h-3 bg-primary/60 rounded-full" /></div> }
function FunnelLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-center gap-0.5"><div className="w-8 h-2 bg-primary/20" /><div className="w-6 h-2 bg-primary/40" /><div className="w-4 h-2 bg-primary/60" /><div className="w-2 h-2 bg-primary/80" /></div> }

// --- FRASE CELEBRE ---
function MinimalLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-0.5 bg-primary/40" /></div> }
function BoldLayout() { return <div className="w-full h-full bg-primary/80 flex items-center justify-center"><div className="text-white font-bold text-lg">Aa</div></div> }
function AuthorLayout() { return <div className="w-full h-full flex"><div className="flex-1 bg-primary/10 flex items-center justify-center text-[6px] text-primary/40">TEXT</div><div className="flex-1 bg-primary/40 relative"><div className="absolute bottom-0 w-full h-3/4 bg-primary/60 rounded-t-full" /></div></div> }
function MarksLayout() { return <div className="w-full h-full p-1 relative"><div className="absolute top-0 left-0 text-2xl text-primary/20 leading-3">“</div><div className="absolute bottom-0 right-0 text-2xl text-primary/20 leading-3 rotate-180">“</div></div> }
function TypewriterLayout() { return <div className="w-full h-full p-2 font-mono text-[6px] text-primary/60 flex items-center">typewriter_</div> }
function HandLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-4 border border-primary/40 rotate-[-2deg] bg-white dark:bg-zinc-800 shadow-sm" /></div> }
function TextCardLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="absolute inset-0 bg-primary/20 blur-[1px]" /><div className="w-8 h-6 bg-white dark:bg-zinc-800 shadow-sm relative z-10 p-1 flex items-center"><div className="w-full h-0.5 bg-primary/20" /></div></div> }
function NeonLayout() { return <div className="w-full h-full bg-zinc-900 p-2 flex items-center justify-center border border-zinc-800"><div className="text-primary text-[8px] drop-shadow-[0_0_2px_rgba(var(--primary),1)]">NEON</div></div> }
function SplitColorLayout() { return <div className="w-full h-full flex relative"><div className="w-1/2 h-full bg-primary/20" /><div className="w-1/2 h-full bg-primary/60" /></div> }
function LetterpressLayout() { return <div className="w-full h-full p-2 bg-primary/10 flex items-center justify-center"><div className="bg-white/50 w-6 h-6 shadow-inner rounded-sm" /></div> }
function BubbleLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-8 h-6 bg-primary/10 border border-primary/40 rounded-t-lg rounded-br-lg relative mb-2"><div className="absolute -bottom-1 left-0 w-2 h-2 bg-primary/10 border-b border-l border-primary/40 skew-x-12" /></div></div> }

// --- MEME HUMOR ---
function TopBottomLayout() { return <div className="w-full h-full p-1 flex flex-col justify-between items-center bg-primary/10"><div className="w-full h-2 bg-white dark:bg-zinc-800 opacity-50" /><div className="w-full h-2 bg-white dark:bg-zinc-800 opacity-50" /></div> }
function ButtonsLayout() { return <div className="w-full h-full p-2 flex gap-1 items-center justify-center"><div className="w-3 h-3 rounded-full border-2 border-primary/60" /><div className="w-3 h-3 rounded-full border-2 border-primary/60" /></div> }
function DrakeLayout() { return <div className="w-full h-full flex flex-col gap-0.5 p-1"><div className="flex-1 flex gap-0.5"><div className="w-1/3 bg-primary/40" /><div className="flex-1 bg-primary/10" /></div><div className="flex-1 flex gap-0.5"><div className="w-1/3 bg-primary/60" /><div className="flex-1 bg-primary/10" /></div></div> }
function DistractedLayout() { return <div className="w-full h-full p-2 flex items-center justify-center gap-1"><div className="w-2 h-2 rounded-full bg-primary/20" /><div className="w-2 h-2 rounded-full bg-primary/40" /><div className="w-2 h-2 rounded-full bg-primary/60 text-[6px] text-white flex items-center justify-center">?</div></div> }
function ExpectationLayout() { return <div className="w-full h-full flex p-1 gap-1"><div className="flex-1 border border-primary/20 flex items-center justify-center text-[6px]">✨</div><div className="flex-1 border border-primary/20 flex items-center justify-center text-[6px]">💩</div></div> }
function BrainLayout() { return <div className="w-full h-full p-1 flex flex-col gap-0.5"><div className="flex-1 flex gap-0.5"><div className="w-1/3 bg-primary/20" /><div className="flex-1 bg-primary/10" /></div><div className="flex-1 flex gap-0.5"><div className="w-1/3 bg-primary/40" /><div className="flex-1 bg-primary/10" /></div><div className="flex-1 flex gap-0.5"><div className="w-1/3 bg-primary/60" /><div className="flex-1 bg-primary/10" /></div></div> }
function ChangeMindLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-6 h-3 bg-primary/20 border-t border-primary/40 rounded-t-sm relative"><div className="absolute -top-3 left-0 w-8 h-3 bg-white border border-primary/20 text-[4px] flex items-center justify-center text-center">CHANGE MIND</div></div></div> }
function ClownLayout() { return <div className="w-full h-full p-2 grid grid-cols-2 gap-0.5"><div className="bg-primary/10" /><div className="bg-primary/30" /><div className="bg-primary/50" /><div className="bg-primary/70" /></div> }
function LabelingLayout() { return <div className="w-full h-full p-2 relative"><div className="w-4 h-4 bg-primary/40 rounded-full absolute bottom-2 left-2" /><div className="absolute bottom-6 left-2 bg-white text-[4px] px-0.5 border border-primary/20">ME</div><div className="w-6 h-6 bg-primary/20 rounded-sm absolute top-2 right-2" /><div className="absolute top-2 right-8 bg-white text-[4px] px-0.5 border border-primary/20">LIFE</div></div> }
function NPCLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 rounded-full border border-primary/40 bg-zinc-100 dark:bg-zinc-800" /></div> }
function TierLayout() { return <div className="w-full h-full p-1 flex flex-col gap-0.5"><div className="flex-1 flex gap-0.5"><div className="w-2 h-full bg-primary/60" /><div className="flex-1 bg-primary/10" /></div><div className="flex-1 flex gap-0.5"><div className="w-2 h-full bg-primary/40" /><div className="flex-1 bg-primary/10" /></div><div className="flex-1 flex gap-0.5"><div className="w-2 h-full bg-primary/20" /><div className="flex-1 bg-primary/10" /></div></div> }

// --- PROMOCION OFERTA ---
function PercentLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="text-xl font-black text-primary rotate-[-10deg]">%</div></div> }
function TimerLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="border border-primary/60 px-1 py-0.5 rounded-sm text-[8px] font-mono text-primary">00:00</div></div> }
function CouponLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-10 h-6 border-2 border-dashed border-primary/40 rounded-sm flex items-center justify-center bg-primary/5"><div className="text-[6px] font-bold text-primary/60">SAVE</div></div></div> }
function FlashLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative bg-primary/10"><div className="w-4 h-8 bg-primary/80 clip-[polygon(100%_0,60%_40%,100%_40%,0_100%,40%_60%,0_60%)] rotate-12" /></div> }
function BundleLayout() { return <div className="w-full h-full p-2 flex items-end justify-center -space-x-2"><div className="w-4 h-6 bg-primary/20 border border-primary/40 z-0 rotate-[-10deg]" /><div className="w-5 h-7 bg-primary/40 border border-primary/60 z-10" /><div className="w-4 h-5 bg-primary/60 border border-primary/80 z-20 rotate-[10deg]" /></div> }
function LimitedBadgeLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 bg-primary/60 clip-[polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)] flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div></div> }
function PriceSlashLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-center"><div className="text-[8px] text-primary/40 line-through decoration-primary/60">$99</div><div className="text-sm font-bold text-primary">$49</div></div> }
function GiftLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-6 h-6 bg-primary/20 rounded-sm" /><div className="absolute w-2 h-6 bg-primary/60" /><div className="absolute w-6 h-2 bg-primary/60" /><div className="absolute -top-1 w-4 h-2 bg-primary/40 rounded-full" /></div> }
function CreditCardLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-10 h-6 bg-primary/60 rounded-sm relative overflow-hidden"><div className="absolute top-2 left-0 w-full h-1 bg-zinc-800" /></div></div> }
function CartLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-6 h-4 border-2 border-primary/40 rounded-sm relative"><div className="absolute -top-2 right-0 w-3 h-2 border-t-2 border-l-2 border-primary/40 rounded-tl-sm" /><div className="absolute -bottom-1 left-1 w-1 h-1 bg-primary/60 rounded-full" /><div className="absolute -bottom-1 right-1 w-1 h-1 bg-primary/60 rounded-full" /></div></div> }
function SaleOverlayLayout() { return <div className="w-full h-full p-1 relative"><div className="w-full h-full bg-primary/20 rounded-sm" /><div className="absolute top-1/2 left-0 w-full h-4 bg-primary/80 -translate-y-1/2 flex items-center justify-center text-[8px] text-white font-bold tracking-widest">SALE</div></div> }

// --- ANTES-DESPUES ---
function SplitVLayout() { return <div className="w-full h-full flex p-2 gap-1"><div className="flex-1 bg-primary/20 rounded-sm" /><div className="w-0.5 bg-primary/40" /><div className="flex-1 bg-primary/40 rounded-sm" /></div> }
function DiagonalLayout() { return <div className="w-full h-full relative overflow-hidden p-2"><div className="absolute inset-0 bg-primary/20" /><div className="absolute inset-0 bg-primary/40 clip-[polygon(100%_0,0_100%,100%_100%)]" /></div> }
function SpotlightLayout() { return <div className="w-full h-full bg-primary/20 p-2 flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-primary/50 bg-primary/10" /></div> }
function ArrowTransLayout() { return <div className="w-full h-full flex items-center p-2 gap-1"><div className="flex-1 h-3/4 bg-primary/20 rounded-sm" /><div className="w-3 text-primary/60">→</div><div className="flex-1 h-3/4 bg-primary/40 rounded-sm" /></div> }
function SliderLayout() { return <div className="w-full h-full relative p-2"><div className="absolute inset-2 bg-primary/20 rounded-sm" /><div className="absolute inset-y-2 left-2 w-1/2 bg-primary/40 rounded-l-sm border-r-2 border-primary/60" /></div> }
function GridContrastLayout() { return <div className="grid grid-cols-2 grid-rows-2 gap-0.5 p-2 w-full h-full"><div className="bg-primary/20" /><div className="bg-primary/20" /><div className="bg-primary/40" /><div className="bg-primary/40" /></div> }
function TornLayout() { return <div className="w-full h-full flex flex-col p-2 relative"><div className="flex-1 bg-primary/20 rounded-t-sm" /><div className="h-2 w-full bg-white dark:bg-zinc-900 skew-y-2" /><div className="flex-1 bg-primary/40 rounded-b-sm" /></div> }
function MirrorLayout() { return <div className="w-full h-full flex flex-col p-2 gap-0.5"><div className="flex-1 bg-primary/40 rounded-t-sm" /><div className="flex-1 bg-primary/20 rounded-b-sm scale-y-[-1] opacity-50" /></div> }
function FadeLayout() { return <div className="w-full h-full p-2"><div className="w-full h-full rounded-sm bg-gradient-to-r from-primary/20 to-primary/60 opacity-80" /></div> }
function InsetLayout() { return <div className="w-full h-full p-2 relative"><div className="w-full h-full bg-primary/40 rounded-sm" /><div className="absolute bottom-1 right-1 w-5 h-5 bg-primary/20 border border-primary/60 rounded-sm" /></div> }
function MagnifyLayout() { return <div className="w-full h-full p-2 relative flex items-center justify-center"><div className="absolute inset-2 bg-primary/20" /><div className="w-8 h-8 border-2 border-primary/80 rounded-full z-10 bg-primary/10 backdrop-blur-sm -translate-y-1 translate-x-1" /></div> }

// --- PASO-A-PASO ---
function SnakeLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-10 h-8 border-2 border-primary/40 border-t-0 rounded-b-lg relative"><div className="absolute -top-2 -left-1 w-2 h-2 bg-primary/60 rounded-full" /><div className="absolute -top-2 -right-1 w-2 h-2 bg-primary/60 rounded-full" /><div className="absolute bottom-[-5px] left-3 w-2 h-2 bg-primary/60 rounded-full" /></div></div> }
function StairsLayout() { return <div className="w-full h-full p-2 flex items-end gap-0.5"><div className="w-1/4 h-1/4 bg-primary/20 rounded-t-sm" /><div className="w-1/4 h-2/4 bg-primary/30 rounded-t-sm" /><div className="w-1/4 h-3/4 bg-primary/40 rounded-t-sm" /><div className="w-1/4 h-full bg-primary/50 rounded-t-sm" /></div> }
function TimelineHLayout() { return <div className="w-full h-full p-2 flex items-center"><div className="w-full h-0.5 bg-primary/40 relative"><div className="absolute left-1 w-2 h-2 bg-primary/60 rounded-full -top-[3px]" /><div className="absolute left-1/2 w-2 h-2 bg-primary/60 rounded-full -top-[3px]" /><div className="absolute right-1 w-2 h-2 bg-primary/60 rounded-full -top-[3px]" /></div></div> }
function TrackVLayout() { return <div className="w-full h-full p-2 flex gap-2"><div className="w-0.5 h-full bg-primary/40 relative"><div className="absolute top-1 w-2 h-2 bg-primary/60 rounded-full -left-[3px]" /><div className="absolute top-1/2 w-2 h-2 bg-primary/60 rounded-full -left-[3px]" /><div className="absolute bottom-1 w-2 h-2 bg-primary/60 rounded-full -left-[3px]" /></div><div className="flex-1 flex flex-col justify-between py-1"><div className="h-1.5 w-full bg-primary/20 rounded-full" /><div className="h-1.5 w-full bg-primary/20 rounded-full" /><div className="h-1.5 w-full bg-primary/20 rounded-full" /></div></div> }
function CardsLayout() { return <div className="w-full h-full p-2 relative flex items-center justify-center"><div className="absolute w-8 h-10 bg-primary/20 rounded-sm -rotate-12" /><div className="absolute w-8 h-10 bg-primary/30 rounded-sm rotate-0" /><div className="absolute w-8 h-10 bg-primary/40 rounded-sm rotate-12" /></div> }
function CycleLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-dashed border-primary/40 relative"><div className="absolute top-0 left-1/2 w-2 h-2 bg-primary/60 rounded-full" /></div></div> }
function DotsLayout() { return <div className="w-full h-full p-2 relative"><div className="absolute top-2 left-2 w-2 h-2 bg-primary/60 rounded-full" /><div className="absolute bottom-3 right-4 w-2 h-2 bg-primary/60 rounded-full" /><div className="absolute inset-0 m-auto w-2 h-2 bg-primary/60 rounded-full" /><svg className="absolute inset-0 w-full h-full stroke-primary/30"><line x1="20%" y1="20%" x2="50%" y2="50%" /><line x2="80%" y2="70%" x1="50%" y1="50%" /></svg></div> }
function FilmLayout() { return <div className="w-full h-full p-1 flex flex-col gap-0.5 bg-primary/10"><div className="h-2 w-full flex gap-1"><div className="w-1 h-full bg-primary/40" /><div className="w-1 h-full bg-primary/40" /></div><div className="flex-1 bg-primary/20" /><div className="h-2 w-full flex gap-1"><div className="w-1 h-full bg-primary/40" /><div className="w-1 h-full bg-primary/40" /></div></div> }
function ZigZagLayout() { return <div className="w-full h-full p-2 flex flex-col justify-between"><div className="w-4 h-4 bg-primary/20 self-start rounded-sm" /><div className="w-4 h-4 bg-primary/40 self-center rounded-sm" /><div className="w-4 h-4 bg-primary/60 self-end rounded-sm" /></div> }
function PipelineLayout() { return <div className="w-full h-full p-2 flex items-center gap-0"><div className="h-4 w-1/3 bg-primary/20 rounded-l-full border-r-2 border-white" /><div className="h-4 w-1/3 bg-primary/40 border-r-2 border-white" /><div className="h-4 w-1/3 bg-primary/60 rounded-r-full" /></div> }
function HopLayout() { return <div className="w-full h-full p-2 grid grid-cols-2 gap-1 items-end"><div className="h-4 w-4 bg-primary/20 rounded-full mb-4" /><div className="h-4 w-4 bg-primary/40 rounded-full" /></div> }

// --- LISTA-TIPS ---
function ClipboardLayout() { return <div className="w-full h-full p-2 flex justify-center"><div className="w-3/4 h-full bg-primary/10 rounded-sm relative border-t-4 border-primary/40"><div className="absolute top-1 left-1 right-1 flex flex-col gap-1"><div className="h-0.5 w-full bg-primary/20" /><div className="h-0.5 w-full bg-primary/20" /></div></div></div> }
function PostitsLayout() { return <div className="w-full h-full p-2 relative"><div className="absolute top-1 left-1 w-5 h-5 bg-primary/20 -rotate-6" /><div className="absolute bottom-2 right-2 w-5 h-5 bg-primary/30 rotate-3" /><div className="absolute top-2 right-1 w-5 h-5 bg-primary/10 rotate-12" /></div> }
function GridCardsLayout() { return <div className="w-full h-full p-2 grid grid-cols-2 gap-1"><div className="bg-primary/10 rounded-sm" /><div className="bg-primary/20 rounded-sm" /><div className="bg-primary/30 rounded-sm" /><div className="bg-primary/40 rounded-sm" /></div> }
function StackListLayout() { return <div className="w-full h-full p-2 flex flex-col gap-1 justify-center"><div className="w-full h-2 bg-primary/10 rounded-full" /><div className="w-full h-2 bg-primary/20 rounded-full" /><div className="w-full h-2 bg-primary/30 rounded-full" /></div> }
function BubblesLayout() { return <div className="w-full h-full p-2 flex flex-col gap-1 items-start"><div className="w-3/4 h-3 bg-primary/10 rounded-tr-lg rounded-bl-lg rounded-tl-lg" /><div className="w-3/4 h-3 bg-primary/20 rounded-tl-lg rounded-br-lg rounded-tr-lg self-end" /></div> }
function SidebarLayout() { return <div className="w-full h-full p-1 flex gap-1"><div className="w-1/3 h-full bg-primary/40 rounded-sm" /><div className="flex-1 h-full bg-primary/10 rounded-sm" /></div> }
function NotebookLayout() { return <div className="w-full h-full p-2 bg-primary/5 rounded-sm flex gap-1"><div className="w-0.5 h-full border-l-2 border-dashed border-primary/20" /><div className="flex-1 flex flex-col gap-1 pt-1"><div className="h-0.5 bg-primary/10" /><div className="h-0.5 bg-primary/10" /></div></div> }
function IconsRowLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-center gap-1"><div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-primary/40" /><div className="w-2 h-2 rounded-full bg-primary/40" /><div className="w-2 h-2 rounded-full bg-primary/40" /></div><div className="w-full h-1 bg-primary/10 rounded-full" /></div> }
function HoneycombLayout() { return <div className="w-full h-full p-2 flex flex-wrap justify-center gap-0.5"><div className="w-3 h-3 bg-primary/20 clip-[polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" /><div className="w-3 h-3 bg-primary/30 clip-[polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" /><div className="w-3 h-3 bg-primary/40 clip-[polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" /></div> }
function TagsLayout() { return <div className="w-full h-full p-2 flex flex-wrap gap-1 content-center"><div className="h-2 w-6 bg-primary/20 rounded-full" /><div className="h-2 w-4 bg-primary/30 rounded-full" /><div className="h-3 w-8 bg-primary/40 rounded-full" /></div> }
function BookmarksLayout() { return <div className="w-full h-full p-0 flex gap-1 justify-center"><div className="w-3 h-3/4 bg-primary/20 rounded-b-sm" /><div className="w-3 h-1/2 bg-primary/40 rounded-b-sm" /><div className="w-3 h-2/3 bg-primary/30 rounded-b-sm" /></div> }

// === COMPOSITION VISUALS (Flat & Monochrome Style) ===

// --- PROBLEMA-SOLUCION (NEW NARRATIVE) ---
function ChaosOrderLayout() { return <div className="w-full h-full p-2 flex gap-0.5"><div className="w-1/2 h-full bg-primary/10 flex flex-wrap gap-0.5 content-center"><div className="w-2 h-2 bg-primary/40 rotate-12" /><div className="w-2 h-2 bg-primary/40 -rotate-12" /><div className="w-2 h-2 bg-primary/40 rotate-45" /></div><div className="w-1/2 h-full bg-primary/30 flex flex-col gap-0.5 justify-center"><div className="w-full h-2 bg-primary/60" /><div className="w-full h-2 bg-primary/60" /><div className="w-full h-2 bg-primary/60" /></div></div> }
function BridgeLayout() { return <div className="w-full h-full p-2 flex items-end justify-center relative"><div className="w-1/3 h-1/2 bg-primary/20 absolute left-0 bottom-0" /><div className="w-1/3 h-1/2 bg-primary/40 absolute right-0 bottom-0" /><div className="absolute bottom-1/2 left-0 right-0 h-1 bg-primary/60" /></div> }
function LockKeyLayout() { return <div className="w-full h-full p-2 flex items-center justify-center relative"><div className="w-6 h-8 bg-primary/20 rounded-t-full border-2 border-primary/40" /><div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-4 bg-primary/60 rounded-full" /></div></div> }
function WeightLayout() { return <div className="w-full h-full p-2 flex flex-col items-center justify-end"><div className="w-8 h-4 bg-primary/60 rounded-sm mb-1" /><div className="w-1 h-4 bg-primary/20" /></div> }
function MazeLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/40 relative"><div className="absolute top-0 left-2 w-1 h-4 bg-primary/20" /><div className="absolute bottom-0 right-2 w-1 h-4 bg-primary/20" /><div className="absolute top-1/2 left-0 w-4 h-1 bg-primary/20" /></div></div> }
function KintsugiLayout() { return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-8 h-8 rounded-full bg-primary/10 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-full border-t-2 border-r-2 border-primary/60 rotate-12" /></div></div> }
function HurdleLayout() { return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-1 h-4 bg-primary/40 mr-2" /><div className="w-4 h-4 rounded-full bg-primary/60 mb-6" /></div> }


// --- BASIC SAFE COMPOSITIONS ---
function BasicOrbitHookLayout() {
    return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-primary/35 relative"><div className="absolute w-3 h-3 rounded-full bg-primary/65 top-1 left-1/2 -translate-x-1/2" /><div className="absolute w-2 h-2 rounded-full bg-primary/35 bottom-1 right-1" /><div className="absolute inset-0 m-auto w-4 h-4 rounded-md bg-primary/25" /></div></div>
}
function BasicSplitStageLayout() {
    return <div className="w-full h-full p-2 flex gap-1"><div className="w-[62%] rounded-sm bg-primary/25" /><div className="flex-1 rounded-sm bg-primary/45" /></div>
}
function BasicCardCoreLayout() {
    return <div className="w-full h-full p-2 flex items-center justify-center"><div className="w-full h-full rounded-sm bg-primary/10 p-1.5"><div className="w-full h-full rounded-md border-2 border-primary/45 bg-primary/20" /></div></div>
}
function BasicZPathLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute top-2 left-2 w-5 h-2 rounded bg-primary/45" /><div className="absolute top-1/2 right-2 w-5 h-2 rounded bg-primary/35 -translate-y-1/2" /><div className="absolute bottom-2 left-2 w-5 h-2 rounded bg-primary/25" /><svg className="absolute inset-0 w-full h-full stroke-primary/55 fill-none"><path d="M10 10 H34 L10 28 H34" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
}
function BasicModularGridLayout() {
    return <div className="w-full h-full p-2 grid grid-cols-2 grid-rows-3 gap-1"><div className="row-span-2 rounded-sm bg-primary/45" /><div className="rounded-sm bg-primary/20" /><div className="rounded-sm bg-primary/30" /><div className="rounded-sm bg-primary/25" /><div className="rounded-sm bg-primary/20" /></div>
}
function BasicPillarRhythmLayout() {
    return <div className="w-full h-full p-2 flex items-end gap-1"><div className="flex-1 h-5 rounded-t-sm bg-primary/25" /><div className="flex-1 h-8 rounded-t-sm bg-primary/45" /><div className="flex-1 h-6 rounded-t-sm bg-primary/35" /></div>
}
function BasicDiagonalPulseLayout() {
    return <div className="w-full h-full p-2 relative overflow-hidden"><div className="absolute inset-0 rounded-sm bg-primary/15" /><div className="absolute -left-1 top-1/2 w-[120%] h-2 -translate-y-1/2 rotate-[-24deg] bg-primary/55" /><div className="absolute top-2 right-2 w-4 h-2 rounded bg-primary/30" /></div>
}
function BasicTimelineRibbonLayout() {
    return <div className="w-full h-full p-2 flex gap-2"><div className="w-1.5 rounded-full bg-primary/45 relative"><div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/65" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/55 -translate-y-1/2" /><div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/45" /></div><div className="flex-1 flex flex-col justify-between py-1"><div className="h-1.5 rounded bg-primary/25" /><div className="h-1.5 rounded bg-primary/20" /><div className="h-1.5 rounded bg-primary/30" /></div></div>
}
function BasicFrameFocusLayout() {
    return <div className="w-full h-full p-2"><div className="w-full h-full rounded-sm border-2 border-primary/35 p-1.5"><div className="w-full h-full rounded-sm bg-primary/20 flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-primary/55" /></div></div></div>
}
function BasicCTAStageLayout() {
    return <div className="w-full h-full p-2 flex flex-col gap-1"><div className="flex-1 rounded-sm bg-primary/20" /><div className="h-4 rounded-sm bg-primary/55" /></div>
}
function BasicTerciosGridLayout() {
    return <div className="w-full h-full p-2 grid grid-cols-3 grid-rows-3 gap-0.5"><div className="rounded-sm bg-primary/20" /><div className="rounded-sm bg-primary/20" /><div className="rounded-sm bg-primary/30" /><div className="rounded-sm bg-primary/20" /><div className="rounded-sm bg-primary/25" /><div className="rounded-sm bg-primary/35" /><div className="rounded-sm bg-primary/20" /><div className="rounded-sm bg-primary/20" /><div className="rounded-sm bg-primary/55" /></div>
}
function BasicGoldenSpiralLayout() {
    return <div className="w-full h-full p-2 flex items-center justify-center"><div className="relative w-10 h-10 border-2 border-primary/35"><div className="absolute inset-1 border-2 border-primary/45"><div className="absolute inset-1 border-2 border-primary/55"><div className="absolute right-0 bottom-0 w-3 h-3 rounded-sm bg-primary/65" /></div></div></div></div>
}
function BasicUFrameLayout() {
    return <div className="w-full h-full p-2"><div className="w-full h-full border-2 border-primary/45 border-t-0 rounded-b-md relative"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-2 rounded-b-sm bg-primary/35" /><div className="absolute inset-x-2 bottom-2 h-3 rounded-sm bg-primary/20" /></div></div>
}
function BasicGoldenTriangleLayout() {
    return <div className="w-full h-full p-2 relative"><svg className="w-full h-full stroke-primary/55 fill-none"><path d="M4 4 L34 30 L4 30 Z" strokeWidth="2" /><path d="M34 4 L20 18" strokeWidth="2" /></svg><div className="absolute top-2 right-2 w-4 h-2 rounded bg-primary/30" /></div>
}
function BasicNegativeChamberLayout() {
    return <div className="w-full h-full p-2 rounded-sm bg-primary/10 relative"><div className="absolute left-2 bottom-2 w-6 h-6 rounded-sm bg-primary/55" /><div className="absolute top-2 left-2 right-2 h-2 rounded bg-primary/20" /></div>
}
function BasicSymmetricCoreLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-0.5 bg-primary/50" /><div className="h-2 rounded bg-primary/35 mb-1" /><div className="grid grid-cols-2 gap-1 h-[calc(100%-0.75rem)]"><div className="rounded-sm bg-primary/25" /><div className="rounded-sm bg-primary/25" /></div></div>
}
function BasicFScanLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute left-2 top-2 bottom-2 w-2 rounded-sm bg-primary/45" /><div className="absolute left-4 top-2 right-2 h-2 rounded-sm bg-primary/35" /><div className="absolute left-4 top-1/2 -translate-y-1/2 right-4 h-2 rounded-sm bg-primary/30" /><div className="absolute left-4 bottom-2 right-6 h-2 rounded-sm bg-primary/25" /></div>
}
function BasicZScanLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute top-2 left-2 w-5 h-2 rounded bg-primary/45" /><div className="absolute top-2 right-2 w-5 h-2 rounded bg-primary/35" /><div className="absolute bottom-2 left-2 w-5 h-2 rounded bg-primary/55" /><svg className="absolute inset-0 w-full h-full stroke-primary/60 fill-none"><path d="M8 8 H32 L8 30 H32" strokeWidth="2.2" strokeLinecap="round" /></svg></div>
}
function BasicOddClusterLayout() {
    return <div className="w-full h-full p-2 flex items-center justify-center"><div className="relative w-10 h-10"><div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-primary/60" /><div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-primary/30" /><div className="absolute right-0 top-2 w-2.5 h-2.5 rounded-full bg-primary/35" /><div className="absolute left-1 bottom-1 w-2.5 h-2.5 rounded-full bg-primary/35" /><div className="absolute right-1 bottom-0 w-3 h-3 rounded-full bg-primary/30" /></div></div>
}
function BasicLeadingLinesLayout() {
    return <div className="w-full h-full p-2 relative"><svg className="absolute inset-0 w-full h-full stroke-primary/40 fill-none"><path d="M2 2 L20 18" strokeWidth="2" /><path d="M2 34 L20 18" strokeWidth="2" /><path d="M38 2 L20 18" strokeWidth="2" /><path d="M38 34 L20 18" strokeWidth="2" /></svg><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-3 rounded bg-primary/60" /></div>
}
function BasicRadialHubLayout() {
    return <div className="w-full h-full p-2 flex items-center justify-center"><div className="relative w-10 h-10"><div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-primary/60" /><div className="absolute inset-0 m-auto w-10 h-10 rounded-full border border-primary/25" /><div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-3 bg-primary/35" /><div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-0.5 h-3 bg-primary/35" /><div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-primary/35" /><div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-primary/35" /></div></div>
}
function BasicVanishingRunLayout() {
    return <div className="w-full h-full p-2 relative"><svg className="absolute inset-0 w-full h-full stroke-primary/45 fill-none"><path d="M4 34 L20 10" strokeWidth="2" /><path d="M36 34 L20 10" strokeWidth="2" /><path d="M10 34 L20 10" strokeWidth="1.6" /><path d="M30 34 L20 10" strokeWidth="1.6" /></svg><div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-2 rounded bg-primary/60" /></div>
}
function BasicPyramidStackLayout() {
    return <div className="w-full h-full p-2 flex items-end justify-center"><div className="w-10 h-2 rounded-sm bg-primary/25 absolute bottom-2" /><div className="w-7 h-2 rounded-sm bg-primary/35 absolute bottom-5" /><div className="w-4 h-2 rounded-sm bg-primary/55 absolute bottom-8" /></div>
}
function BasicLayeredDepthLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute inset-3 rounded-sm bg-primary/15" /><div className="absolute inset-2 rounded-sm bg-primary/25" /><div className="absolute inset-1 rounded-sm bg-primary/35" /><div className="absolute top-2 left-2 right-2 h-2 rounded bg-primary/55" /></div>
}
function BasicTwinCardsLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute left-2 top-3 w-5 h-8 rounded-md bg-primary/35" /><div className="absolute right-2 top-2 w-6 h-9 rounded-md bg-primary/25 border border-primary/45" /></div>
}
function BasicCrosshairFocusLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-0.5 bg-primary/35" /><div className="absolute top-1/2 left-2 right-2 -translate-y-1/2 h-0.5 bg-primary/35" /><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary/60" /></div>
}
function BasicRibbonSLayout() {
    return <div className="w-full h-full p-2 relative"><svg className="absolute inset-0 w-full h-full stroke-primary/60 fill-none"><path d="M8 8 C24 8, 24 18, 10 20 C2 22, 10 30, 28 30" strokeWidth="3" strokeLinecap="round" /></svg><div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-primary/35" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/45" /><div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-primary/55" /></div>
}
function BasicArcStageLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute inset-x-2 top-2 h-8 rounded-t-full border-2 border-b-0 border-primary/45" /><div className="absolute inset-x-2 bottom-2 h-4 rounded-sm bg-primary/55" /><div className="absolute left-1/2 top-5 -translate-x-1/2 w-3 h-3 rounded-full bg-primary/30" /></div>
}
function BasicWindowStripsLayout() {
    return <div className="w-full h-full p-2 flex flex-col gap-1"><div className="h-2 rounded-sm bg-primary/35" /><div className="h-2.5 rounded-sm bg-primary/30" /><div className="h-3 rounded-sm bg-primary/45" /><div className="h-3.5 rounded-sm bg-primary/25" /></div>
}
function BasicOffsetQuadrantsLayout() {
    return <div className="w-full h-full p-2 relative"><div className="absolute top-2 left-2 w-4 h-4 rounded-sm bg-primary/30" /><div className="absolute top-2 right-1 w-5 h-5 rounded-sm bg-primary/20" /><div className="absolute bottom-1 left-1 w-5 h-5 rounded-sm bg-primary/25" /><div className="absolute bottom-2 right-2 w-6 h-6 rounded-sm bg-primary/55" /></div>
}

function DefaultIcon() {
    return (
        <div className="w-full h-full rounded-md flex items-center justify-center">
            <div className="w-8 h-8 rounded bg-primary/10" />
        </div>
    )
}

function TwoDiceLayout() {
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Dice 1 (Back Left) - Cara 3 */}
                <div className="absolute left-0 top-0 w-8 h-8 z-0 opacity-70">
                    {/* Top Face */}
                    <div className="absolute -top-[8px] left-0 w-8 h-[8px] bg-primary/20 transform skew-x-[-45deg] origin-bottom-left" />
                    {/* Right Face */}
                    <div className="absolute top-0 -right-[8px] w-[8px] h-8 bg-primary/40 transform skew-y-[-45deg] origin-top-left" />
                    {/* Front Face */}
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-primary/60" />
                            <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-primary/60" />
                            <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary/60" />
                        </div>
                    </div>
                </div>

                {/* Dice 2 (Front Right) - Cara 5 */}
                <div className="absolute right-2 bottom-2 w-8 h-8 z-20">
                    {/* Top Face */}
                    <div className="absolute -top-[8px] left-0 w-8 h-[8px] bg-primary/30 transform skew-x-[-45deg] origin-bottom-left" />
                    {/* Right Face */}
                    <div className="absolute top-0 -right-[8px] w-[8px] h-8 bg-primary/60 transform skew-y-[-45deg] origin-top-left" />
                    {/* Front Face */}
                    <div className="absolute inset-0 bg-primary/30 shadow-sm">
                        <div className="relative w-full h-full">
                            <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-primary/80" />
                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary/80" />
                            <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-primary/80" />
                            <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-primary/80" />
                            <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary/80" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- COMUNICADO OPERATIVO ---
function AlertBarLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="h-3 rounded-sm bg-primary/40" />
            <div className="flex-1 rounded-sm bg-primary/10" />
        </div>
    )
}
function NoticeBoardLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-10 h-12 rounded-md bg-primary/15 border border-primary/30 relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/40" />
                <div className="p-1 space-y-1">
                    <div className="h-1 rounded bg-primary/35" />
                    <div className="h-1 rounded bg-primary/25" />
                    <div className="h-1 rounded bg-primary/20" />
                </div>
            </div>
        </div>
    )
}
function ScheduleShiftLayout() {
    return (
        <div className="w-full h-full p-2 flex gap-1">
            <div className="w-1/2 rounded-sm bg-primary/15 grid grid-cols-2 gap-0.5 p-1">
                <div className="h-2 rounded bg-primary/30" />
                <div className="h-2 rounded bg-primary/20" />
                <div className="h-2 rounded bg-primary/20" />
                <div className="h-2 rounded bg-primary/30" />
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="w-6 h-0.5 bg-primary/40 relative">
                    <div className="absolute right-0 -top-1 w-2 h-2 rotate-45 border-t-2 border-r-2 border-primary/40" />
                </div>
            </div>
        </div>
    )
}
function LocationChangeLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-between">
            <div className="w-3 h-3 rounded-full bg-primary/30" />
            <div className="w-6 h-0.5 bg-primary/40" />
            <div className="w-3 h-3 rounded-full bg-primary/40" />
        </div>
    )
}
function MaintenanceWindowLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-10 h-8 rounded-sm bg-primary/15 flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full border-2 border-primary/40" />
                <div className="w-3 h-0.5 bg-primary/40" />
            </div>
        </div>
    )
}
function ServiceImpactLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-4 h-10 rounded-md bg-primary/15 flex flex-col items-center justify-between p-0.5">
                <div className="w-2 h-2 rounded-full bg-primary/35" />
                <div className="w-2 h-2 rounded-full bg-primary/35" />
                <div className="w-2 h-2 rounded-full bg-primary/35" />
            </div>
        </div>
    )
}
function ActionChecklistLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-sm bg-primary/40" />
                <div className="flex-1 h-1 rounded bg-primary/20" />
            </div>
            <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-sm bg-primary/35" />
                <div className="flex-1 h-1 rounded bg-primary/20" />
            </div>
            <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-sm bg-primary/30" />
                <div className="flex-1 h-1 rounded bg-primary/20" />
            </div>
        </div>
    )
}
function TimelinePinsLayout() {
    return (
        <div className="w-full h-full p-2 flex">
            <div className="w-0.5 bg-primary/35 rounded-full relative">
                <div className="absolute top-1 w-2 h-2 rounded-full bg-primary/45 -left-[3px]" />
                <div className="absolute top-1/2 w-2 h-2 rounded-full bg-primary/45 -left-[3px]" />
                <div className="absolute bottom-1 w-2 h-2 rounded-full bg-primary/45 -left-[3px]" />
            </div>
            <div className="flex-1 pl-2 space-y-1">
                <div className="h-1 rounded bg-primary/25" />
                <div className="h-1 rounded bg-primary/20" />
                <div className="h-1 rounded bg-primary/25" />
            </div>
        </div>
    )
}
function InfoStackLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="h-3 rounded-sm bg-primary/20" />
            <div className="h-3 rounded-sm bg-primary/30" />
            <div className="h-3 rounded-sm bg-primary/25" />
        </div>
    )
}
function ContactHubLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-10 h-6 rounded-full bg-primary/25 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary/45" />
            </div>
        </div>
    )
}

// --- CHECKLIST DIAGNOSTICO ---
function ChecklistBoardLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-10 h-12 rounded-md bg-primary/15 border border-primary/30">
                <div className="h-2 bg-primary/30 rounded-t-md" />
                <div className="p-1 space-y-1">
                    <div className="h-1 rounded bg-primary/40" />
                    <div className="h-1 rounded bg-primary/30" />
                    <div className="h-1 rounded bg-primary/25" />
                </div>
            </div>
        </div>
    )
}
function YesNoSplitLayout() {
    return (
        <div className="w-full h-full p-2 flex gap-1">
            <div className="flex-1 rounded-sm bg-primary/30 flex items-center justify-center text-[7px] font-bold text-primary">✓</div>
            <div className="flex-1 rounded-sm bg-primary/15 flex items-center justify-center text-[7px] font-bold text-primary">×</div>
        </div>
    )
}
function ScorecardLayout() {
    return (
        <div className="w-full h-full p-2 flex gap-1">
            <div className="flex-1 space-y-1">
                <div className="h-1 rounded bg-primary/25" />
                <div className="h-1 rounded bg-primary/20" />
                <div className="h-1 rounded bg-primary/15" />
            </div>
            <div className="w-5 rounded-sm bg-primary/35 flex items-center justify-center text-[8px] font-bold text-primary">8</div>
        </div>
    )
}
function RadarLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-primary/35 relative">
                <div className="absolute inset-0 m-auto w-0.5 h-full bg-primary/25" />
                <div className="absolute inset-0 m-auto h-0.5 w-full bg-primary/25" />
                <div className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-primary/50" />
            </div>
        </div>
    )
}
function ProgressMeterLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col justify-center gap-1">
            <div className="h-2 rounded-full bg-primary/20">
                <div className="h-2 w-2/3 rounded-full bg-primary/50" />
            </div>
            <div className="h-1 rounded bg-primary/15" />
        </div>
    )
}
function DecisionTreeLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="relative w-12 h-10">
                <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-primary/50" />
                <div className="absolute top-2 left-1/2 w-0.5 h-3 -translate-x-1/2 bg-primary/30" />
                <div className="absolute top-5 left-2 w-2 h-2 rounded-full bg-primary/40" />
                <div className="absolute top-5 right-2 w-2 h-2 rounded-full bg-primary/40" />
                <div className="absolute top-4 left-1/2 w-6 h-0.5 -translate-x-1/2 bg-primary/30" />
            </div>
        </div>
    )
}
function TrafficLightsLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-6 h-12 rounded-md bg-primary/15 flex flex-col items-center justify-between p-1">
                <div className="w-3 h-3 rounded-full bg-primary/35" />
                <div className="w-3 h-3 rounded-full bg-primary/35" />
                <div className="w-3 h-3 rounded-full bg-primary/35" />
            </div>
        </div>
    )
}
function TileGridLayout() {
    return (
        <div className="w-full h-full p-2 grid grid-cols-2 gap-1">
            <div className="bg-primary/20 rounded-sm" />
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
            <div className="bg-primary/35 rounded-sm" />
        </div>
    )
}
function BadgeLevelsLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary/25 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-primary/50" />
            </div>
        </div>
    )
}
function AuditColumnsLayout() {
    return (
        <div className="w-full h-full p-2 flex gap-1 items-end">
            <div className="flex-1 h-6 rounded-sm bg-primary/20" />
            <div className="flex-1 h-8 rounded-sm bg-primary/30" />
            <div className="flex-1 h-5 rounded-sm bg-primary/25" />
        </div>
    )
}
function StampResultLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-primary/45 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary/45" />
            </div>
        </div>
    )
}

// --- PREGUNTAS RESPUESTAS ---
function SplitQALayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="flex-1 rounded-sm bg-primary/20 flex items-center justify-center text-[7px] font-bold text-primary">Q</div>
            <div className="flex-1 rounded-sm bg-primary/35 flex items-center justify-center text-[7px] font-bold text-primary">A</div>
        </div>
    )
}
function PingPongLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="w-3/4 h-3 rounded-full bg-primary/25 self-start" />
            <div className="w-3/4 h-3 rounded-full bg-primary/40 self-end" />
            <div className="w-3/4 h-3 rounded-full bg-primary/20 self-start" />
        </div>
    )
}
function ChatThreadLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="w-4 h-4 rounded-full bg-primary/25" />
            <div className="w-10 h-3 rounded-full bg-primary/20 self-end" />
            <div className="w-10 h-3 rounded-full bg-primary/35 self-start" />
        </div>
    )
}
function AccordionLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="h-2 rounded-sm bg-primary/20" />
            <div className="h-2 rounded-sm bg-primary/35" />
            <div className="h-2 rounded-sm bg-primary/20" />
        </div>
    )
}
function QACardsLayout() {
    return (
        <div className="w-full h-full p-2 grid grid-cols-2 gap-1">
            <div className="rounded-sm bg-primary/20" />
            <div className="rounded-sm bg-primary/35" />
            <div className="rounded-sm bg-primary/35" />
            <div className="rounded-sm bg-primary/20" />
        </div>
    )
}
function HotlineLayout() {
    return (
        <div className="w-full h-full p-2 flex gap-1 items-center">
            <div className="flex-1 h-8 rounded-sm bg-primary/25 flex items-center justify-center text-[7px] font-bold text-primary">Q</div>
            <div className="flex-1 h-8 rounded-sm bg-primary/40 flex items-center justify-center text-[7px] font-bold text-primary">A</div>
        </div>
    )
}
function FAQGridLayout() {
    return (
        <div className="w-full h-full p-2 grid grid-cols-3 gap-1">
            <div className="rounded-sm bg-primary/20" />
            <div className="rounded-sm bg-primary/30" />
            <div className="rounded-sm bg-primary/25" />
            <div className="rounded-sm bg-primary/30" />
            <div className="rounded-sm bg-primary/20" />
            <div className="rounded-sm bg-primary/35" />
        </div>
    )
}
function SpeechBubblesLayout() {
    return (
        <div className="w-full h-full p-2 relative">
            <div className="absolute top-2 left-2 w-7 h-4 rounded-full bg-primary/25" />
            <div className="absolute bottom-3 right-2 w-8 h-4 rounded-full bg-primary/40" />
        </div>
    )
}
function QATimelineLayout() {
    return (
        <div className="w-full h-full p-2 flex items-center">
            <div className="w-0.5 h-full bg-primary/30 relative">
                <div className="absolute top-1 w-2 h-2 rounded-full bg-primary/45 -left-[3px]" />
                <div className="absolute top-1/2 w-2 h-2 rounded-full bg-primary/45 -left-[3px]" />
                <div className="absolute bottom-1 w-2 h-2 rounded-full bg-primary/45 -left-[3px]" />
            </div>
            <div className="flex-1 ml-2 space-y-1">
                <div className="h-1 rounded bg-primary/20" />
                <div className="h-1 rounded bg-primary/30" />
                <div className="h-1 rounded bg-primary/20" />
            </div>
        </div>
    )
}
function TaggedQALayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-primary/35" />
                <div className="flex-1 h-3 rounded bg-primary/20" />
            </div>
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-primary/50" />
                <div className="flex-1 h-3 rounded bg-primary/30" />
            </div>
        </div>
    )
}
function ReplyThreadLayout() {
    return (
        <div className="w-full h-full p-2 flex flex-col gap-1">
            <div className="w-full h-3 rounded bg-primary/25" />
            <div className="w-5/6 h-3 rounded bg-primary/40 ml-3" />
            <div className="w-full h-3 rounded bg-primary/25" />
        </div>
    )
}
