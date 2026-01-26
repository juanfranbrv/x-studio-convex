'use client';

import { LayoutOption } from '@/lib/creation-flow-types';
import { cn } from '@/lib/utils';
import {
    Trophy,
    Star,
    CheckCircle2,
    Users,
    User,
    Award,
    Target,
    Flag,
    Flame,
    Sparkles,
    Calendar,
    Search,
    Clock,
    Box,
    MessageSquare,
    Layers,
    Rocket,
    BarChart3,
    Heart,
    HandMetal,
    Crown,
    Gift,
    Zap,
    Bell,
    BookOpen
} from 'lucide-react';

interface LayoutThumbnailProps {
    layout: LayoutOption;
    intent?: string;
    className?: string;
}

/**
 * Renders unique visual thumbnails based on exact layout ID.
 * Each layout has its own distinctive visual representation.
 * Uses theme primary color for consistent branding.
 */
export function LayoutThumbnail({ layout, intent, className }: LayoutThumbnailProps) {
    const { id } = layout;

    return (
        <div className={cn(
            "w-full h-full bg-white rounded-md overflow-hidden flex items-center justify-center p-1.5",
            className
        )}>
            <div className="w-full h-full relative">
                {getLayoutVisual(id)}
            </div>
        </div>
    );
}

function getLayoutVisual(id: string) {
    // FREE layout (any intent) - Double size question mark
    if (id.endsWith('-free')) return <FreeLayout />;
    if (id === 'clean') return <CleanLayout />;
    if (id === 'full-bleed') return <FullBleedLayout />;
    if (id === 'frame') return <FrameLayout />;

    // === DEFINICION layouts ===
    if (id === 'def-classic') return <DictionaryLayout />;
    if (id === 'def-minimal') return <BigTypoLayout />;
    if (id === 'def-map') return <MindMapLayout />;
    if (id === 'def-encyclopedia') return <EncyclopediaLayout />;
    if (id === 'def-urban') return <StickerLayout />;
    if (id === 'def-tech') return <CodeBlockLayout />;
    if (id === 'def-neon') return <NeonLayout />;
    if (id === 'def-tarjeta') return <FlashcardLayout />;
    if (id === 'def-ilustrado') return <IllustratedLayout />;
    if (id === 'def-versus') return <ComparisonLayout />;
    if (id === 'def-emoji') return <EmojiLayout />;

    // === SERVICIO layouts (check BEFORE generic patterns) ===
    if (id === 'servicio-grid') return <BentoGridLayout />;
    if (id === 'servicio-benefit') return <SplitLayout />;
    if (id === 'servicio-pricing') return <SpotlightLayout />;
    if (id === 'servicio-process') return <ProcessLayout />;
    if (id === 'servicio-list') return <ListLayout />;
    if (id === 'servicio-workshop') return <WorkshopLayout />;
    if (id === 'servicio-ecosystem') return <EcosystemLayout />;
    if (id === 'servicio-stat') return <BigNumberLayout />;
    if (id === 'servicio-minimal') return <ImmersiveLayout />;
    if (id === 'servicio-interaction') return <InteractionLayout />;
    if (id === 'servicio-explosion') return <ExplosionLayout />;

    // === DATO layouts ===
    if (id === 'dato-big') return <BigNumberLayout />;
    if (id === 'dato-comparison' || id.includes('comparison') || id.includes('vs')) return <ComparisonLayout />;
    if (id === 'dato-process' || id.includes('process')) return <ProcessLayout />;
    if (id === 'dato-infographic' || id.includes('info')) return <InfoGridLayout />;
    if (id === 'dato-metric' || id.includes('metric')) return <MetricLayout />;
    if (id === 'dato-pie' || id.includes('circular') || id.includes('pie')) return <CircularLayout />;
    if (id === 'dato-dashboard' || id.includes('dashboard')) return <DashboardLayout />;
    if (id === 'dato-bar' || id.includes('bar')) return <BarChartLayout />;
    if (id === 'dato-icon' || id.includes('icon')) return <IconLayout />;
    if (id === 'dato-timeline' || id.includes('timeline')) return <TimelineLayout />;
    if (id === 'dato-map' || id.includes('map')) return <MapLayout />;

    // === CITA layouts ===
    if (id === 'cita-minimal') return <CitaMinimalLayout />;
    if (id === 'cita-portrait') return <CitaPortraitLayout />;
    if (id === 'cita-typo') return <CitaTypoLayout />;
    if (id === 'cita-frame') return <CitaStickerLayout />;
    if (id === 'cita-texture') return <CitaTextureLayout />;
    if (id === 'cita-split') return <SplitLayout />;
    if (id === 'cita-bocadillo') return <CitaBocadilloLayout />;
    if (id === 'cita-carousel') return <CitaCarouselLayout />;
    if (id === 'cita-neon') return <NeonLayout />;
    if (id === 'cita-manuscript') return <CitaManuscriptLayout />;
    if (id === 'cita-float') return <CitaFloatLayout />;

    // === EQUIPO layouts ===
    if (id === 'equipo-portrait') return <EquipoPortraitLayout />;
    if (id === 'equipo-group') return <EquipoGroupLayout />;
    if (id === 'equipo-collage') return <EquipoCollageLayout />;
    if (id === 'equipo-quote') return <EquipoQuoteLayout />;
    if (id === 'equipo-action') return <EquipoActionLayout />;
    if (id === 'equipo-minimal') return <EquipoCardLayout />;
    if (id === 'equipo-welcome') return <EquipoWelcomeLayout />;
    if (id === 'equipo-anniversary') return <EquipoAnniversaryLayout />;
    if (id === 'equipo-dept') return <EquipoDeptLayout />;
    if (id === 'equipo-lead') return <EquipoLeadLayout />;
    if (id === 'equipo-culture') return <EquipoCultureLayout />;

    // === LOGRO layouts ===
    if (id === 'logro-number') return <BigNumberLayout />;
    if (id === 'logro-trophy') return <LogroTrophyLayout />;
    if (id === 'logro-confetti') return <LogroConfettiLayout />;
    if (id === 'logro-team') return <EquipoGroupLayout />;
    if (id === 'logro-premium') return <LogroSealLayout />;
    if (id === 'logro-journey') return <TimelineLayout />;
    if (id === 'logro-star') return <LogroStarLayout />;
    if (id === 'logro-podium') return <LogroPodiumLayout />;
    if (id === 'logro-balloons') return <LogroBalloonsLayout />;
    if (id === 'logro-social') return <LogroSocialLayout />;
    if (id === 'logro-anniversary') return <LogroAnniversaryLayout />;

    // === LANZAMIENTO layouts ===
    if (id === 'lanzamiento-countdown') return <LanzamientoCountdownLayout />;
    if (id === 'lanzamiento-reveal') return <LanzamientoRevealLayout />;
    if (id === 'lanzamiento-silhouette') return <LanzamientoSilhouetteLayout />;
    if (id === 'lanzamiento-glitch') return <LanzamientoGlitchLayout />;
    if (id === 'lanzamiento-torn') return <LanzamientoTornLayout />;
    if (id === 'lanzamiento-calendar') return <LanzamientoCalendarLayout />;
    if (id === 'lanzamiento-apertura') return <LanzamientoBoxLayout />;
    if (id === 'lanzamiento-blur') return <LanzamientoBlurLayout />;
    if (id === 'lanzamiento-fragmentado') return <LanzamientoPuzzleLayout />;
    if (id === 'lanzamiento-espiral') return <LanzamientoVortexLayout />;
    if (id === 'lanzamiento-misterio') return <LanzamientoMysteryLayout />;

    // === RETO layouts ===
    if (id === 'reto-vs') return <RetoVersusLayout />;
    if (id === 'reto-giveaway') return <RetoGiveawayLayout />;
    if (id === 'reto-bracket') return <RetoBracketLayout />;
    if (id === 'reto-dare') return <RetoDareLayout />;
    if (id === 'reto-podium') return <LogroPodiumLayout />;
    if (id === 'reto-rules') return <RetoRulesLayout />;
    if (id === 'reto-countdown') return <LanzamientoCountdownLayout />;
    if (id === 'reto-viral') return <RetoViralLayout />;
    if (id === 'reto-quiz') return <RetoQuizLayout />;
    if (id === 'reto-winner') return <RetoWinnerLayout />;
    if (id === 'reto-participants') return <RetoParticipantsLayout />;

    // === TALENTO layouts ===
    if (id === 'talento-hiring') return <TalentoHiringLayout />;
    if (id === 'talento-culture') return <EquipoCollageLayout />;
    if (id === 'talento-values') return <TalentoValuesLayout />;
    if (id === 'talento-benefits') return <TalentoBenefitsLayout />;
    if (id === 'talento-spotlight') return <TalentoSpotlightLayout />;
    if (id === 'talento-office') return <TalentoOfficeLayout />;
    if (id === 'talento-team') return <EquipoGroupLayout />;
    if (id === 'talento-remote') return <TalentoRemoteLayout />;
    if (id === 'talento-growth') return <TalentoGrowthLayout />;
    if (id === 'talento-job-card') return <TalentoJobCardLayout />;
    if (id === 'talento-diversity') return <TalentoDiversityLayout />;

    // === EFEMERIDE layouts ===
    if (id === 'efemeride-calendar') return <LanzamientoCalendarLayout />;
    if (id === 'efemeride-flag') return <EfemerideFlagLayout />;
    if (id === 'efemeride-ribbon') return <EfemerideRibbonLayout />;
    if (id === 'efemeride-vintage') return <EfemerideVintageLayout />;
    if (id === 'efemeride-modern') return <EfemerideModernLayout />;
    if (id === 'efemeride-collage') return <EfemerideCollageLayout />;
    if (id === 'efemeride-stamp') return <EfemerideStampLayout />;
    if (id === 'efemeride-neon') return <NeonLayout />;
    if (id === 'efemeride-timeline') return <TimelineLayout />;
    if (id === 'efemeride-portrait') return <EquipoPortraitLayout />;
    if (id === 'efemeride-minimal') return <EfemerideMinimalLayout />;

    // === PASOS layouts ===
    if (id === 'pasos-vertical') return <PasosVerticalLayout />;
    if (id === 'pasos-horizontal') return <PasosHorizontalLayout />;
    if (id === 'pasos-circular') return <PasosCircularLayout />;
    if (id === 'pasos-cards') return <PasosCardsLayout />;
    if (id === 'pasos-timeline') return <TimelineLayout />;
    if (id === 'pasos-infographic') return <InfoGridLayout />;
    if (id === 'pasos-checklist') return <PasosChecklistLayout />;
    if (id === 'pasos-flowchart') return <PasosFlowchartLayout />;
    if (id === 'pasos-icons') return <PasosIconsLayout />;
    if (id === 'pasos-numbered') return <PasosNumberedLayout />;
    if (id === 'pasos-split') return <SplitLayout />;

    // === BTS layouts ===
    if (id === 'bts-filmstrip') return <BtsFilmstripLayout />;
    if (id === 'bts-polaroid') return <BtsPolaroidLayout />;
    if (id === 'bts-clapperboard') return <BtsClapperboardLayout />;
    if (id === 'bts-grid') return <BentoGridLayout />;
    if (id === 'bts-split') return <SplitLayout />;
    if (id === 'bts-story') return <BtsStoryLayout />;
    if (id === 'bts-focus') return <BtsFocusLayout />;
    if (id === 'bts-process') return <ProcessLayout />;
    if (id === 'bts-comparison') return <ComparisonLayout />;
    if (id === 'bts-quote') return <TestimonialLayout />;
    if (id === 'bts-collage') return <EquipoCollageLayout />;

    // === CATALOGO layouts ===
    if (id === 'catalogo-grid') return <CatalogoGridLayout />;
    if (id === 'catalogo-hero') return <CatalogoHeroLayout />;
    if (id === 'catalogo-carousel') return <CatalogoCarouselLayout />;
    if (id === 'catalogo-lookbook') return <CatalogoLookbookLayout />;
    if (id === 'catalogo-minimal') return <CatalogoMinimalLayout />;
    if (id === 'catalogo-comparison') return <ComparisonLayout />;
    if (id === 'catalogo-bundle') return <CatalogoBundleLayout />;
    if (id === 'catalogo-mosaic') return <EquipoCollageLayout />;
    if (id === 'catalogo-shelf') return <CatalogoShelfLayout />;
    if (id === 'catalogo-collection') return <CatalogoCollectionLayout />;
    if (id === 'catalogo-new') return <CatalogoNewLayout />;

    // === OFERTA layouts ===
    if (id === 'oferta-impacto') return <OfertaImpactoLayout />;
    if (id === 'oferta-precio') return <OfertaPrecioLayout />;
    if (id === 'oferta-flash') return <OfertaFlashLayout />;
    if (id === 'oferta-comparativa') return <ComparisonLayout />;
    if (id === 'oferta-bundle') return <CatalogoBundleLayout />;
    if (id === 'oferta-cupon') return <OfertaCuponLayout />;
    if (id === 'oferta-countdown') return <LanzamientoCountdownLayout />;
    if (id === 'oferta-sticker') return <OfertaStickerLayout />;
    if (id === 'oferta-split') return <SplitLayout />;
    if (id === 'oferta-minimal') return <OfertaMinimalLayout />;
    if (id === 'oferta-seasonal') return <OfertaSeasonalLayout />;

    // === ESCAPARATE layouts ===
    if (id === 'escaparate-hero') return <EscaparateHeroLayout />;
    if (id === 'escaparate-floating') return <EscaparateFloatingLayout />;
    if (id === 'escaparate-lifestyle') return <EscaparateLifestyleLayout />;
    if (id === 'escaparate-minimal') return <EscaparateMinimalLayout />;
    if (id === 'escaparate-detail') return <EscaparateDetailLayout />;
    if (id === 'escaparate-360') return <Escaparate360Layout />;
    if (id === 'escaparate-comparison') return <ComparisonLayout />;
    if (id === 'escaparate-context') return <EscaparateContextLayout />;
    if (id === 'escaparate-unboxing') return <LanzamientoBoxLayout />;
    if (id === 'escaparate-grid') return <BentoGridLayout />;
    if (id === 'escaparate-editorial') return <EscaparateEditorialLayout />;

    // === COMUNICADO layouts ===
    if (id === 'comunicado-oficial') return <ComunicadoOficialLayout />;
    if (id === 'comunicado-urgent' || id === 'comunicado-alerta') return <ComunicadoUrgenteLayout />;
    if (id === 'comunicado-modern') return <ComunicadoModernoLayout />;
    if (id === 'comunicado-editorial') return <ComunicadoEditorialLayout />;
    if (id === 'comunicado-community') return <ComunicadoComunidadLayout />;
    if (id === 'comunicado-minimal') return <ComunicadoMinimalLayout />;
    if (id === 'comunicado-card') return <ComunicadoCardLayout />;
    if (id === 'comunicado-ticker' || id === 'comunicado-banner') return <ComunicadoMarquesinaLayout />;
    if (id === 'comunicado-memo') return <ComunicadoMemoLayout />;
    if (id === 'comunicado-poster') return <ComunicadoCartelLayout />;
    if (id === 'comunicado-timeline') return <ComunicadoTimelineLayout />;
    if (id === 'comunicado-icon') return <ComunicadoIconLayout />;
    if (id === 'comunicado-quote') return <ComunicadoEditorialLayout />;
    if (id === 'comunicado-checklist') return <ComunicadoMemoLayout />;
    // === PREGUNTA layouts ===
    if (id === 'pregunta-big') return <PreguntaBigLayout />;
    if (id === 'pregunta-versus') return <PreguntaVersusLayout />;
    if (id === 'pregunta-conversation') return <PreguntaConversationLayout />;
    if (id === 'pregunta-thought') return <PreguntaThoughtLayout />;
    if (id === 'pregunta-contro') return <PreguntaControLayout />;
    if (id === 'pregunta-bold') return <PreguntaBoldLayout />;
    if (id === 'pregunta-poll') return <PreguntaPollLayout />;
    if (id === 'pregunta-options') return <PreguntaOptionsLayout />;
    if (id === 'pregunta-bubble') return <CitaBocadilloLayout />;
    if (id === 'pregunta-quiz') return <RetoQuizLayout />;
    if (id === 'pregunta-vs') return <PreguntaVersusLayout />;
    if (id === 'pregunta-fill') return <PreguntaFillLayout />;
    if (id === 'pregunta-slider') return <PreguntaSliderLayout />;
    if (id === 'pregunta-emoji') return <PreguntaEmojiLayout />;
    if (id === 'pregunta-mystery') return <LanzamientoMysteryLayout />;
    if (id === 'pregunta-debate') return <PreguntaDebateLayout />;

    // === EVENTO layouts ===
    if (id === 'evento-date') return <EventoDateLayout />;
    if (id === 'evento-countdown') return <LanzamientoCountdownLayout />;
    if (id === 'evento-poster') return <EventoPosterLayout />;
    if (id === 'evento-ticket') return <EventoTicketLayout />;
    if (id === 'evento-map') return <MapLayout />;
    if (id === 'evento-schedule') return <EventoScheduleLayout />;
    if (id === 'evento-speaker') return <EquipoPortraitLayout />;
    if (id === 'evento-gallery') return <EquipoCollageLayout />;
    if (id === 'evento-reminder') return <EventoReminderLayout />;
    if (id === 'evento-live') return <EventoLiveLayout />;
    if (id === 'evento-recap') return <EventoRecapLayout />;

    // === COMPARATIVA layouts ===
    if (id === 'comparativa-split') return <SplitLayout />;
    if (id === 'comparativa-before-after') return <ComparativaBeforeAfterLayout />;
    if (id === 'comparativa-table') return <ComparativaTableLayout />;
    if (id === 'comparativa-versus') return <RetoVersusLayout />;
    if (id === 'comparativa-slider') return <ComparativaSliderLayout />;
    if (id === 'comparativa-specs') return <ComparativaSpecsLayout />;
    if (id === 'comparativa-winner') return <RetoWinnerLayout />;
    if (id === 'comparativa-evolution') return <ComparativaEvolutionLayout />;
    if (id === 'comparativa-radar') return <ComparativaRadarLayout />;
    if (id === 'comparativa-price') return <OfertaPrecioLayout />;
    if (id === 'comparativa-stack') return <ComparativaStackLayout />;

    // === LISTA layouts ===
    if (id === 'lista-checklist') return <PasosChecklistLayout />;
    if (id === 'lista-numbered') return <PasosNumberedLayout />;
    if (id === 'lista-icons') return <PasosIconsLayout />;
    if (id === 'lista-cards') return <PasosCardsLayout />;
    if (id === 'lista-grid') return <InfoGridLayout />;
    if (id === 'lista-timeline') return <TimelineLayout />;
    if (id === 'lista-carousel') return <CitaCarouselLayout />;
    if (id === 'lista-bullets') return <ListaBulletsLayout />;
    if (id === 'lista-ranking') return <ListaRankingLayout />;
    if (id === 'lista-comparison') return <ComparisonLayout />;
    if (id === 'lista-minimal') return <ListaMinimalLayout />;

    // Generic patterns (fallback)
    if (id.includes('grid')) return <BentoGridLayout />;
    if (id.includes('benefit') || id.includes('split')) return <SplitLayout />;
    if (id.includes('pricing') || id.includes('spotlight')) return <SpotlightLayout />;
    if (id.includes('testimonial') || id.includes('quote')) return <TestimonialLayout />;

    // Default fallback
    return <DefaultLayout />;
}

// === UNIQUE LAYOUT PREVIEWS WITH THEMED COLORS ===

function FreeLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary/60 text-5xl font-bold">?</div>
        </div>
    );
}

function CleanLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-1 p-1">
            <div className="flex-1 rounded-sm border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/5 to-white relative overflow-hidden">
                <div className="absolute right-1 top-1 w-2.5 h-2.5 rounded-full bg-primary/35" />
                <div className="absolute left-1 bottom-1 w-6 h-1 bg-white/70 rounded-full" />
                <div className="absolute inset-0 border border-dashed border-primary/20 rounded-sm" />
            </div>
            <div className="h-3 flex flex-col gap-0.5">
                <div className="h-1 w-full bg-primary/35 rounded-full" />
                <div className="h-1 w-[70%] bg-primary/20 rounded-full" />
            </div>
        </div>
    );
}

function FullBleedLayout() {
    return (
        <div className="w-full h-full relative overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/45 via-primary/25 to-primary/5" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/30" />
            <div className="absolute bottom-1 left-1 right-1 h-3 rounded-sm border border-white/70 bg-white/70 backdrop-blur-sm" />
            <div className="absolute top-1 left-1 w-4 h-4 rounded-sm border border-white/70 bg-white/40" />
        </div>
    );
}

function FrameLayout() {
    return (
        <div className="w-full h-full p-1">
            <div className="w-full h-full rounded-sm border-2 border-primary/40 p-1">
                <div className="w-full h-full rounded-sm border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-white relative">
                    <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-primary/60 rounded-sm" />
                    <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-primary/35 rounded-sm" />
                    <div className="absolute inset-x-1 bottom-1 h-1 bg-white/70 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function BigNumberLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="text-primary/80 text-3xl font-black">73%</div>
            <div className="h-1 w-[70%] bg-primary/20 rounded-full" />
        </div>
    );
}

function ComparisonLayout() {
    return (
        <div className="w-full h-full flex items-end justify-center gap-2 p-2 pb-3">
            <div className="w-[30%] h-[40%] bg-primary/30 rounded-sm" />
            <div className="w-[30%] h-[70%] bg-primary/60 rounded-sm" />
        </div>
    );
}

function ProcessLayout() {
    return (
        <div className="w-full h-full flex items-center justify-around p-2">
            <div className="flex flex-col items-center gap-0.5">
                <div className="w-3 h-3 rounded-full bg-primary/80 text-[6px] text-white flex items-center justify-center font-bold">1</div>
            </div>
            <div className="h-px w-2 bg-primary/30" />
            <div className="flex flex-col items-center gap-0.5">
                <div className="w-3 h-3 rounded-full bg-primary/50 text-[6px] text-white flex items-center justify-center font-bold">2</div>
            </div>
            <div className="h-px w-2 bg-primary/30" />
            <div className="flex flex-col items-center gap-0.5">
                <div className="w-3 h-3 rounded-full bg-primary/30 text-[6px] text-primary/60 flex items-center justify-center font-bold">3</div>
            </div>
        </div>
    );
}

function InfoGridLayout() {
    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1">
            <div className="bg-primary/20 rounded-sm flex items-center justify-center text-[8px] text-primary/70 font-bold">42</div>
            <div className="bg-primary/35 rounded-sm flex items-center justify-center text-[8px] text-primary/80 font-bold">18</div>
            <div className="bg-primary/35 rounded-sm flex items-center justify-center text-[8px] text-primary/80 font-bold">7K</div>
            <div className="bg-primary/20 rounded-sm flex items-center justify-center text-[8px] text-primary/70 font-bold">99</div>
        </div>
    );
}

function MetricLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
            <div className="text-primary/70 text-sm font-mono font-bold">1,234</div>
            <div className="flex items-center gap-0.5">
                <div className="text-green-500/80 text-[8px]">▲</div>
                <div className="text-[7px] text-primary/50">+12%</div>
            </div>
        </div>
    );
}

function CircularLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary/70 border-r-primary/70 flex items-center justify-center">
                <span className="text-[7px] font-bold text-primary/70">67%</span>
            </div>
        </div>
    );
}

function DashboardLayout() {
    return (
        <div className="w-full h-full p-1.5">
            <div className="w-full h-full rounded border border-primary/20 bg-primary/5 p-1 flex flex-col gap-1">
                <div className="h-1 w-[50%] bg-primary/40 rounded-full" />
                <div className="text-[10px] font-bold text-primary/70">847</div>
                <div className="flex-1 flex items-end gap-0.5">
                    <div className="w-1 h-[30%] bg-primary/25 rounded-t-sm" />
                    <div className="w-1 h-[50%] bg-primary/40 rounded-t-sm" />
                    <div className="w-1 h-[40%] bg-primary/25 rounded-t-sm" />
                    <div className="w-1 h-[70%] bg-primary/60 rounded-t-sm" />
                </div>
            </div>
        </div>
    );
}

function BarChartLayout() {
    return (
        <div className="w-full h-full flex flex-col justify-end gap-1 p-2 pb-3">
            <div className="flex items-end gap-1 h-full">
                <div className="w-[20%] h-[30%] bg-primary/25 rounded-t-sm" />
                <div className="w-[20%] h-[60%] bg-primary/40 rounded-t-sm" />
                <div className="w-[20%] h-[80%] bg-primary/65 rounded-t-sm" />
                <div className="w-[20%] h-[50%] bg-primary/40 rounded-t-sm" />
            </div>
        </div>
    );
}

function IconLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary/70">
                <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-bold text-primary/70">+50%</div>
        </div>
    );
}

function TimelineLayout() {
    return (
        <div className="w-full h-full flex items-center p-2">
            <div className="w-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary/70" />
                <div className="flex-1 h-0.5 bg-primary/40" />
                <div className="w-2 h-2 rounded-full bg-primary/45" />
                <div className="flex-1 h-0.5 bg-primary/25" />
                <div className="w-2 h-2 rounded-full bg-primary/25" />
            </div>
        </div>
    );
}

function MapLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-2">
            <div className="w-full h-full rounded bg-primary/10 relative overflow-hidden">
                <div className="absolute top-1 left-1 w-3 h-2 bg-primary/35 rounded-sm" />
                <div className="absolute top-2 right-2 w-2 h-3 bg-primary/55 rounded-sm" />
                <div className="absolute bottom-1 left-2 w-4 h-2 bg-primary/25 rounded-sm" />
                <div className="absolute bottom-2 right-1 w-1.5 h-1.5 rounded-full bg-red-400/70" />
            </div>
        </div>
    );
}

function SplitLayout() {
    return (
        <div className="w-full h-full flex gap-1 p-1">
            <div className="w-[40%] flex flex-col gap-1 justify-center">
                <div className="h-1.5 w-full bg-primary/40 rounded-full" />
                <div className="h-1.5 w-[70%] bg-primary/25 rounded-full" />
            </div>
            <div className="w-[60%] bg-primary/25 rounded-sm" />
        </div>
    );
}

function SpotlightLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
            <div className="w-[50%] aspect-square bg-primary/35 rounded-full" />
            <div className="h-1 w-[60%] bg-primary/25 rounded-full" />
        </div>
    );
}

function TestimonialLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
            <div className="text-primary/40 text-lg leading-none">"</div>
            <div className="h-1 w-[80%] bg-primary/25 rounded-full" />
            <div className="h-1 w-[60%] bg-primary/20 rounded-full" />
            <div className="w-3 h-3 rounded-full bg-primary/35 mt-1" />
        </div>
    );
}

function DefaultLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-2 p-1.5">
            <div className="flex-1 bg-primary/10 rounded-md border-2 border-dashed border-primary/25" />
            <div className="h-2 w-[80%] mx-auto bg-primary/25 rounded-full" />
        </div>
    );
}

// === SERVICIO-SPECIFIC LAYOUTS ===

function BentoGridLayout() {
    return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-0.5 p-1">
            <div className="col-span-2 bg-primary/40 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
            <div className="col-span-2 bg-primary/35 rounded-sm" />
        </div>
    );
}

function ListLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-1 p-1.5">
            {[0.7, 0.5, 0.6].map((w, i) => (
                <div key={i} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-primary/50" />
                    <div className="h-1" style={{ width: `${w * 100}%` }}>
                        <div className="h-full bg-primary/25 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function WorkshopLayout() {
    return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
            <div className="bg-primary/25 rounded-sm" />
            <div className="bg-primary/35 rounded-sm" />
            <div className="bg-primary/20 rounded-sm" />
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/50 rounded-sm flex items-center justify-center">
                <Box className="w-4 h-4 text-primary/80" />
            </div>
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/20 rounded-sm" />
            <div className="bg-primary/35 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
        </div>
    );
}

function EcosystemLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-2">
            <div className="relative">
                <div className="w-4 h-4 rounded-full bg-primary/60" />
                <div className="absolute -top-2 -left-2 w-2 h-2 rounded-full bg-primary/30" />
                <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-primary/30" />
                <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary/30" />
                <div className="absolute -bottom-2 -right-2 w-2 h-2 rounded-full bg-primary/30" />
            </div>
        </div>
    );
}

function ImmersiveLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-full h-full rounded-sm bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary/70" />
            </div>
        </div>
    );
}

function InteractionLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-2 p-2">
            <div className="w-4 h-6 rounded-full bg-primary/40" />
            <div className="w-4 h-6 rounded-full bg-primary/30" />
        </div>
    );
}

function ExplosionLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative">
                <div className="w-3 h-3 rounded-full bg-primary/70" />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/40" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/40" />
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/40" />
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/40" />
                <div className="absolute -top-1 -left-1 w-1 h-1 rounded-full bg-primary/25" />
                <div className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-primary/25" />
                <div className="absolute -bottom-1 -left-1 w-1 h-1 rounded-full bg-primary/25" />
                <div className="absolute -bottom-1 -right-1 w-1 h-1 rounded-full bg-primary/25" />
            </div>
        </div>
    );
}

// === DEFINICION LAYOUT PREVIEWS ===

function DictionaryLayout() {
    return (
        <div className="w-full h-full flex flex-col p-2 gap-2">
            <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary/60 shrink-0" />
                <div className="text-primary/80 text-base font-serif font-bold">Abc</div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="h-1 w-full bg-primary/20 rounded-full" />
                <div className="h-1 w-[80%] bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

function BigTypoLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary/70 text-4xl font-black tracking-tighter">Aa</div>
        </div>
    );
}

function MindMapLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative">
                <div className="w-4 h-4 rounded-full bg-primary/60 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary/90" />
                </div>
                <div className="absolute top-1/2 -left-3 w-2.5 h-px bg-primary/40" />
                <div className="absolute top-1/2 -right-3 w-2.5 h-px bg-primary/40" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-2 w-px bg-primary/40" />
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/30" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/30" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/30" />
            </div>
        </div>
    );
}

function EncyclopediaLayout() {
    return (
        <div className="w-full h-full grid grid-cols-2 gap-1 p-1.5">
            <div className="flex flex-col gap-0.5">
                <div className="h-0.5 w-full bg-primary/25 rounded-full" />
                <div className="h-0.5 w-full bg-primary/20 rounded-full" />
                <div className="h-0.5 w-[70%] bg-primary/15 rounded-full" />
            </div>
            <div className="bg-primary/15 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 border border-primary/40 rounded-sm" />
            </div>
        </div>
    );
}

function StickerLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-200/30 p-1">
            <div className="w-6 h-6 bg-primary/70 rounded-lg rotate-3 flex items-center justify-center shadow-sm">
                <span className="text-white text-[8px] font-black">TAG</span>
            </div>
        </div>
    );
}

function CodeBlockLayout() {
    return (
        <div className="w-full h-full bg-primary/10 rounded-sm p-1.5 flex flex-col gap-0.5">
            <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <div className="w-1 h-1 rounded-full bg-primary/30" />
                <div className="w-1 h-1 rounded-full bg-primary/20" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5 mt-1">
                <div className="h-0.5 w-[70%] bg-primary/50 rounded-full" />
                <div className="h-0.5 w-[50%] bg-primary/35 rounded-full" />
                <div className="h-0.5 w-[60%] bg-primary/25 rounded-full" />
            </div>
        </div>
    );
}

function NeonLayout() {
    return (
        <div className="w-full h-full bg-primary/10 rounded-sm flex items-center justify-center border border-dashed border-primary/30">
            <div className="text-primary/80 text-sm font-bold">
                Neo
            </div>
        </div>
    );
}

function FlashcardLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-full h-full bg-white border border-primary/20 rounded-sm shadow-sm flex flex-col">
                <div className="flex-1 flex items-center justify-center border-b border-dashed border-primary/20">
                    <span className="text-primary/70 text-[8px] font-bold">?</span>
                </div>
                <div className="h-[40%] bg-primary/5 flex items-center justify-center">
                    <div className="w-[60%] h-0.5 bg-primary/20 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function IllustratedLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="w-5 h-4 bg-primary/20 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary/50" />
            </div>
            <div className="w-[70%] h-0.5 bg-primary/30 rounded-full" />
        </div>
    );
}

function EmojiLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <div className="text-primary/70 text-lg font-bold">:)</div>
            <div className="w-[50%] h-0.5 bg-primary/25 rounded-full" />
        </div>
    );
}

// === CITA LAYOUTS ===
function CitaMinimalLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-2">
            <div className="text-primary/60 text-3xl font-serif">"</div>
            <div className="w-[85%] h-1 bg-primary/25 rounded-full" />
            <div className="w-[60%] h-1 bg-primary/15 rounded-full" />
        </div>
    );
}

function CitaPortraitLayout() {
    return (
        <div className="w-full h-full flex gap-2 p-2">
            <div className="w-2/5 bg-primary/30 rounded-md" />
            <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="text-primary/50 text-base leading-none">"</div>
                <div className="h-1 w-full bg-primary/20 rounded-full" />
                <div className="h-1 w-[80%] bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

function CitaTypoLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary/70 text-4xl font-black tracking-tighter">"Aa"</div>
        </div>
    );
}

function CitaStickerLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1.5">
            <div className="w-full h-full border-2 border-dashed border-primary/40 rounded-xl flex items-center justify-center">
                <div className="text-primary/50 text-2xl font-serif">"</div>
            </div>
        </div>
    );
}

function CitaTextureLayout() {
    return (
        <div className="w-full h-full bg-primary/10 flex items-center justify-center p-2">
            <div className="text-primary/60 text-4xl font-serif italic">"</div>
        </div>
    );
}

function CitaBocadilloLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-2">
            <div className="bg-primary/20 rounded-xl px-4 py-2 relative">
                <MessageSquare className="w-6 h-6 text-primary/60" />
                <div className="absolute -bottom-1 left-3 w-3 h-3 bg-primary/20 rotate-45" />
            </div>
        </div>
    );
}

function CitaCarouselLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1.5 p-1.5">
            <div className="flex-1 h-10 bg-primary/10 rounded-md" />
            <div className="w-12 h-14 bg-primary/40 rounded-lg flex items-center justify-center shadow-md">
                <div className="text-primary/70 text-xl font-serif">"</div>
            </div>
            <div className="flex-1 h-10 bg-primary/10 rounded-md" />
        </div>
    );
}

function CitaManuscriptLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-1.5 p-3">
            <div className="h-1 w-full bg-primary/15 rounded-full" />
            <div className="h-1 w-[90%] bg-primary/25 rounded-full" />
            <div className="h-1 w-[80%] bg-primary/15 rounded-full" />
            <div className="h-1 w-[70%] bg-primary/10 rounded-full" />
        </div>
    );
}

function CitaFloatLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative">
                <div className="w-12 h-12 bg-primary/15 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center text-primary/60 text-2xl font-serif">"</div>
            </div>
        </div>
    );
}

// === EQUIPO LAYOUTS ===
function EquipoPortraitLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-1">
            <div className="w-10 h-10 rounded-full bg-primary/40 ring-2 ring-primary/10" />
            <div className="w-[80%] h-1 bg-primary/25 rounded-full" />
        </div>
    );
}

function EquipoGroupLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1.5 p-2">
            <Users className="w-12 h-12 text-primary/50" />
        </div>
    );
}

function EquipoCollageLayout() {
    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/40 rounded-sm" />
            <div className="bg-primary/35 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
        </div>
    );
}

function EquipoQuoteLayout() {
    return (
        <div className="w-full h-full flex items-center gap-2 p-2">
            <div className="w-10 h-10 rounded-full bg-primary/40 shrink-0" />
            <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="h-1 w-full bg-primary/20 rounded-full" />
                <div className="h-1 w-[70%] bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

function EquipoActionLayout() {
    return (
        <div className="w-full h-full flex items-end justify-center p-2">
            <User className="w-12 h-12 text-primary/40" />
        </div>
    );
}

function EquipoCardLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1 bg-primary/5 rounded-sm">
            <div className="w-4 h-4 rounded-full bg-primary/40" />
            <div className="w-[50%] h-0.5 bg-primary/30 rounded-full" />
        </div>
    );
}

function EquipoWelcomeLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-1">
            <HandMetal className="w-6 h-6 text-primary/40 -rotate-12" />
            <div className="w-8 h-8 rounded-full bg-primary/40" />
        </div>
    );
}

function EquipoAnniversaryLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="text-primary/60 text-xs font-bold">5</div>
            <div className="w-4 h-4 rounded-full bg-primary/30" />
        </div>
    );
}

function EquipoDeptLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-1">
            <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full bg-primary/40" />
                <div className="w-4 h-4 rounded-full bg-primary/40" />
                <div className="w-4 h-4 rounded-full bg-primary/40" />
            </div>
            <div className="w-[80%] h-1 bg-primary/25 rounded-full" />
        </div>
    );
}

function EquipoLeadLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="w-5 h-5 rounded-full bg-primary/50 ring-2 ring-primary/20" />
            <div className="w-[50%] h-0.5 bg-primary/30 rounded-full" />
        </div>
    );
}

function EquipoCultureLayout() {
    return (
        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1">
            <div className="bg-primary/25 rounded-sm" />
            <div className="bg-primary/35 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
        </div>
    );
}

// === LOGRO LAYOUTS ===
function LogroTrophyLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary/60" />
        </div>
    );
}

function LogroConfettiLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <div className="text-primary/70 text-3xl font-bold">!</div>
            <div className="absolute top-1 left-3 w-1.5 h-1.5 bg-primary/30 rounded-full" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary/40 rounded-full" />
            <div className="absolute bottom-3 left-4 w-1.5 h-1.5 bg-primary/25 rounded-full" />
        </div>
    );
}

function LogroSealLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary/60" />
            </div>
        </div>
    );
}

function LogroStarLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Star className="w-10 h-10 text-primary/60 fill-primary/20" />
        </div>
    );
}

function LogroPodiumLayout() {
    return (
        <div className="w-full h-full flex items-end justify-center gap-1.5 p-2">
            <div className="w-4 h-6 bg-primary/30 rounded-t-sm" />
            <div className="w-4 h-10 bg-primary/50 rounded-t-sm" />
            <div className="w-4 h-4 bg-primary/20 rounded-t-sm" />
        </div>
    );
}

function LogroBalloonsLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-2">
            <div className="w-4 h-6 bg-primary/40 rounded-full" />
            <div className="w-4 h-6 bg-primary/30 rounded-full mt-2" />
        </div>
    );
}

function LogroSocialLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="text-primary/70 text-xl font-black">1K</div>
            <Heart className="w-4 h-4 text-primary/40 fill-primary/10" />
        </div>
    );
}

function LogroAnniversaryLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-primary/40 rounded-full flex items-center justify-center">
                <div className="text-primary/60 text-base font-bold">10</div>
            </div>
        </div>
    );
}

// === LANZAMIENTO LAYOUTS ===
function LanzamientoCountdownLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1 p-2">
            <div className="px-2 py-1 bg-primary/30 rounded-md text-primary/70 text-base font-mono font-bold">03</div>
            <div className="text-primary/40 text-lg font-bold">:</div>
            <div className="px-2 py-1 bg-primary/30 rounded-md text-primary/70 text-base font-mono font-bold">21</div>
        </div>
    );
}

function LanzamientoRevealLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1.5">
            <div className="w-12 h-12 bg-gradient-to-t from-primary/60 to-primary/10 rounded-lg shadow-inner" />
        </div>
    );
}

function LanzamientoSilhouetteLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1 bg-primary/10">
            <User className="w-10 h-10 text-primary/60 scale-150 mt-4 translate-y-2 opacity-50" />
        </div>
    );
}

function LanzamientoGlitchLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="w-[60%] h-1 bg-primary/40 rounded-sm translate-x-0.5" />
            <div className="w-[60%] h-1 bg-primary/30 rounded-sm -translate-x-0.5" />
            <div className="w-[60%] h-1 bg-primary/20 rounded-sm translate-x-0.5" />
        </div>
    );
}

function LanzamientoTornLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-full h-full bg-primary/20 rounded-sm relative overflow-hidden">
                <div className="absolute inset-y-0 left-1/2 w-px bg-primary/50 border-dashed" />
            </div>
        </div>
    );
}

function LanzamientoCalendarLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-1">
            <div className="w-6 h-1 bg-primary/50 rounded-t-sm" />
            <div className="w-6 h-5 bg-primary/20 rounded-b-sm flex items-center justify-center">
                <div className="text-primary/60 text-[8px] font-bold">24</div>
            </div>
        </div>
    );
}

function LanzamientoBoxLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-5 h-5 border-2 border-primary/40 rounded-sm relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-primary/30 rounded-t-sm" />
            </div>
        </div>
    );
}

function LanzamientoBlurLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 bg-primary/20 rounded-full blur-sm" />
        </div>
    );
}

function LanzamientoPuzzleLayout() {
    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 p-1.5">
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/40 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
            <div className="bg-primary/15 border border-dashed border-primary/30 rounded-sm" />
        </div>
    );
}

function LanzamientoVortexLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary/60" />
        </div>
    );
}

function LanzamientoMysteryLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <div className="text-primary/50 text-xl font-bold">?</div>
        </div>
    );
}

// === RETO LAYOUTS ===
function RetoVersusLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1 p-1">
            <div className="w-3 h-4 bg-primary/40 rounded-sm" />
            <div className="text-primary/50 text-[8px] font-bold">VS</div>
            <div className="w-3 h-4 bg-primary/30 rounded-sm" />
        </div>
    );
}

function RetoGiveawayLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center relative">
                <Gift className="w-8 h-8 text-primary/60" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary/40" />
            </div>
        </div>
    );
}

function RetoBracketLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="flex flex-col gap-0.5">
                <div className="flex gap-1 items-center">
                    <div className="w-2 h-1 bg-primary/30 rounded-sm" />
                    <div className="w-1 h-2 border-r border-t border-primary/40" />
                </div>
                <div className="flex gap-1 items-center">
                    <div className="w-2 h-1 bg-primary/30 rounded-sm" />
                    <div className="w-1 h-2 border-r border-b border-primary/40" />
                </div>
            </div>
            <div className="w-2 h-1 bg-primary/50 rounded-sm" />
        </div>
    );
}

function RetoDareLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary/60 text-lg font-black">!</div>
        </div>
    );
}

function RetoRulesLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[6px]">1.</div>
                <div className="h-0.5 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[6px]">2.</div>
                <div className="h-0.5 flex-1 bg-primary/20 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[6px]">3.</div>
                <div className="h-0.5 flex-1 bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

function RetoViralLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative">
                <div className="w-4 h-4 bg-primary/40 rounded-full" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary/60 rounded-full" />
            </div>
        </div>
    );
}

function RetoQuizLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="text-primary/60 text-sm font-bold">?</div>
            <div className="flex gap-0.5">
                <div className="w-2 h-2 bg-primary/30 rounded-sm" />
                <div className="w-2 h-2 bg-primary/40 rounded-sm" />
            </div>
        </div>
    );
}

function RetoWinnerLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <Crown className="w-10 h-10 text-primary/60 fill-primary/10" />
            <div className="w-8 h-8 rounded-full bg-primary/40" />
        </div>
    );
}

function RetoParticipantsLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="flex -space-x-1">
                <div className="w-3 h-3 rounded-full bg-primary/50 ring-1 ring-white" />
                <div className="w-3 h-3 rounded-full bg-primary/40 ring-1 ring-white" />
                <div className="w-3 h-3 rounded-full bg-primary/30 ring-1 ring-white" />
            </div>
        </div>
    );
}

// === TALENTO LAYOUTS ===
function TalentoHiringLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="px-2 py-1 bg-primary/40 rounded-sm">
                <div className="text-white text-[7px] font-bold">HIRING</div>
            </div>
        </div>
    );
}

function TalentoValuesLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1 p-1">
            <div className="w-2 h-2 bg-primary/40 rounded-sm" />
            <div className="w-2 h-2 bg-primary/50 rounded-sm" />
            <div className="w-2 h-2 bg-primary/30 rounded-sm" />
        </div>
    );
}

function TalentoBenefitsLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[6px]">✓</div>
                <div className="h-0.5 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[6px]">✓</div>
                <div className="h-0.5 flex-1 bg-primary/20 rounded-full" />
            </div>
        </div>
    );
}

function TalentoSpotlightLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-5 h-5 rounded-full bg-primary/40 ring-4 ring-primary/15" />
        </div>
    );
}

function TalentoOfficeLayout() {
    return (
        <div className="w-full h-full flex items-end p-1">
            <div className="w-full h-[60%] bg-primary/20 rounded-t-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-primary/40 rounded-sm" />
            </div>
        </div>
    );
}

function TalentoRemoteLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-5 h-4 border border-primary/40 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary/40" />
            </div>
        </div>
    );
}

function TalentoGrowthLayout() {
    return (
        <div className="w-full h-full flex items-end justify-center gap-0.5 p-1">
            <div className="w-2 h-2 bg-primary/25 rounded-sm" />
            <div className="w-2 h-3 bg-primary/35 rounded-sm" />
            <div className="w-2 h-5 bg-primary/50 rounded-sm" />
        </div>
    );
}

function TalentoJobCardLayout() {
    return (
        <div className="w-full h-full flex flex-col p-1.5 bg-primary/5 rounded-sm">
            <div className="h-0.5 w-[60%] bg-primary/40 rounded-full" />
            <div className="h-0.5 w-[40%] bg-primary/20 rounded-full mt-0.5" />
            <div className="mt-auto w-3 h-1 bg-primary/30 rounded-sm" />
        </div>
    );
}

function TalentoDiversityLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
            <div className="w-2 h-2 rounded-full bg-primary/50" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/20" />
        </div>
    );
}

// === EFEMERIDE LAYOUTS ===
function EfemerideFlagLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-1 h-5 bg-primary/50" />
            <div className="w-4 h-3 bg-primary/30 -ml-px" />
        </div>
    );
}

function EfemerideRibbonLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-2 bg-primary/40 rounded-full" />
        </div>
    );
}

function EfemerideVintageLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 border-2 border-primary/30 rounded-sm flex items-center justify-center">
                <div className="text-primary/50 text-[8px] font-serif">19</div>
            </div>
        </div>
    );
}

function EfemerideModernLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="text-primary/60 text-sm font-bold">24</div>
            <div className="w-[50%] h-0.5 bg-primary/25 rounded-full" />
        </div>
    );
}

function EfemerideCollageLayout() {
    return (
        <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1">
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/20 rounded-sm" />
        </div>
    );
}

function EfemerideStampLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-5 h-5 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary/30 rounded-full" />
            </div>
        </div>
    );
}

function EfemerideMinimalLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <Calendar className="w-10 h-10 text-primary/50" />
            <div className="w-[60%] h-1 bg-primary/25 rounded-full" />
        </div>
    );
}

// === PASOS LAYOUTS ===
function PasosVerticalLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="w-2 h-2 rounded-full bg-primary/50" />
            <div className="w-px h-1 bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-px h-1 bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
    );
}

function PasosHorizontalLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
            <div className="w-2 h-2 rounded-full bg-primary/50" />
            <div className="w-2 h-px bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-px bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
    );
}

function PasosCircularLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary/60" />
        </div>
    );
}

function PasosCardsLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
            <div className="w-3 h-4 bg-primary/40 rounded-sm flex items-center justify-center">
                <div className="text-white text-[6px]">1</div>
            </div>
            <div className="w-3 h-4 bg-primary/30 rounded-sm flex items-center justify-center">
                <div className="text-white text-[6px]">2</div>
            </div>
            <div className="w-3 h-4 bg-primary/20 rounded-sm flex items-center justify-center">
                <div className="text-primary/50 text-[6px]">3</div>
            </div>
        </div>
    );
}

function PasosChecklistLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 border border-primary/40 rounded-sm flex items-center justify-center">
                    <div className="text-primary/60 text-[5px]">✓</div>
                </div>
                <div className="h-0.5 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 border border-primary/30 rounded-sm" />
                <div className="h-0.5 flex-1 bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

function PasosFlowchartLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="flex flex-col items-center">
                <div className="w-3 h-2 bg-primary/40 rounded-sm" />
                <div className="w-px h-1 bg-primary/30" />
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary/30 rounded-sm" />
                    <div className="w-2 h-2 bg-primary/30 rounded-sm" />
                </div>
            </div>
        </div>
    );
}

function PasosIconsLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-2 p-1">
            <div className="w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center">
                <Box className="w-6 h-6 text-primary/70" />
            </div>
            <div className="text-primary/30 text-lg">→</div>
            <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary/70" />
            </div>
        </div>
    );
}

function PasosNumberedLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/50 flex items-center justify-center text-white text-[6px]">1</div>
                <div className="h-0.5 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/35 flex items-center justify-center text-white text-[6px]">2</div>
                <div className="h-0.5 flex-1 bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

// === BTS LAYOUTS ===
function BtsFilmstripLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-full h-4 bg-primary/20 flex items-center justify-between px-0.5">
                <div className="w-1 h-full bg-primary/40" />
                <div className="w-3 h-3 bg-primary/30 rounded-sm" />
                <div className="w-1 h-full bg-primary/40" />
            </div>
        </div>
    );
}

function BtsPolaroidLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-5 h-6 bg-white border border-primary/20 rounded-sm p-0.5 shadow-sm">
                <div className="w-full h-3 bg-primary/25 rounded-sm" />
            </div>
        </div>
    );
}

function BtsClapperboardLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="flex flex-col">
                <div className="w-5 h-1.5 bg-primary/50 rounded-t-sm flex">
                    <div className="w-1 h-full bg-primary/30" />
                    <div className="w-1 h-full bg-primary/50" />
                    <div className="w-1 h-full bg-primary/30" />
                </div>
                <div className="w-5 h-3 bg-primary/25 rounded-b-sm" />
            </div>
        </div>
    );
}

function BtsStoryLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
            <div className="w-3 h-5 bg-primary/40 rounded-sm" />
            <div className="w-3 h-5 bg-primary/25 rounded-sm" />
        </div>
    );
}

function BtsFocusLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 border-2 border-primary/40 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-primary/50 rounded-full" />
            </div>
        </div>
    );
}

// === CATALOGO LAYOUTS ===
function CatalogoGridLayout() {
    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
            <div className="bg-primary/30 rounded-sm" />
        </div>
    );
}

function CatalogoHeroLayout() {
    return (
        <div className="w-full h-full flex flex-col p-1 gap-0.5">
            <div className="flex-1 bg-primary/40 rounded-sm" />
            <div className="h-2 flex gap-0.5">
                <div className="flex-1 bg-primary/20 rounded-sm" />
                <div className="flex-1 bg-primary/20 rounded-sm" />
            </div>
        </div>
    );
}

function CatalogoCarouselLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
            <div className="w-2 h-5 bg-primary/20 rounded-sm" />
            <div className="w-4 h-6 bg-primary/40 rounded-sm" />
            <div className="w-2 h-5 bg-primary/20 rounded-sm" />
        </div>
    );
}

function CatalogoLookbookLayout() {
    return (
        <div className="w-full h-full flex gap-0.5 p-1">
            <div className="flex-1 bg-primary/35 rounded-sm" />
            <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex-1 bg-primary/25 rounded-sm" />
                <div className="flex-1 bg-primary/20 rounded-sm" />
            </div>
        </div>
    );
}

function CatalogoMinimalLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="w-5 h-5 bg-primary/30 rounded-sm" />
            <div className="w-[50%] h-0.5 bg-primary/25 rounded-full" />
        </div>
    );
}

function CatalogoBundleLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="flex -space-x-2">
                <div className="w-4 h-5 bg-primary/40 rounded-sm" />
                <div className="w-4 h-5 bg-primary/30 rounded-sm" />
                <div className="w-4 h-5 bg-primary/20 rounded-sm" />
            </div>
        </div>
    );
}

function CatalogoShelfLayout() {
    return (
        <div className="w-full h-full flex items-end justify-center gap-0.5 p-1">
            <div className="w-2 h-4 bg-primary/35 rounded-t-sm" />
            <div className="w-2 h-5 bg-primary/45 rounded-t-sm" />
            <div className="w-2 h-3 bg-primary/25 rounded-t-sm" />
        </div>
    );
}

function CatalogoCollectionLayout() {
    return (
        <div className="w-full h-full p-1">
            <div className="w-full h-full border border-primary/30 rounded-sm p-0.5">
                <div className="grid grid-cols-2 gap-0.5 h-full">
                    <div className="bg-primary/25 rounded-sm" />
                    <div className="bg-primary/25 rounded-sm" />
                </div>
            </div>
        </div>
    );
}

function CatalogoNewLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative">
                <div className="w-5 h-5 bg-primary/30 rounded-sm" />
                <div className="absolute -top-1 -right-1 px-1 bg-primary/60 rounded-sm text-white text-[5px]">NEW</div>
            </div>
        </div>
    );
}

// === OFERTA LAYOUTS ===
function OfertaImpactoLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary/70 text-lg font-black">%</div>
        </div>
    );
}

function OfertaPrecioLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="text-primary/40 text-[8px] line-through">$99</div>
            <div className="text-primary/70 text-sm font-bold">$49</div>
        </div>
    );
}

function OfertaFlashLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <Zap className="w-12 h-12 text-primary/60 fill-primary/20" />
        </div>
    );
}

function OfertaCuponLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-full h-4 border-2 border-dashed border-primary/40 rounded-sm flex items-center justify-center">
                <div className="text-primary/60 text-[6px] font-mono">CODE</div>
            </div>
        </div>
    );
}

function OfertaStickerLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 bg-primary/50 rounded-full flex items-center justify-center -rotate-12">
                <div className="text-white text-[6px] font-bold">-30%</div>
            </div>
        </div>
    );
}

function OfertaMinimalLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="text-primary/60 text-sm font-bold">50%</div>
            <div className="w-[40%] h-0.5 bg-primary/25 rounded-full" />
        </div>
    );
}

function OfertaSeasonalLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="px-2 py-1 bg-primary/30 rounded-sm">
                <div className="text-primary/70 text-[7px] font-bold">SALE</div>
            </div>
        </div>
    );
}

// === ESCAPARATE LAYOUTS ===
function EscaparateHeroLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 bg-primary/40 rounded-sm ring-4 ring-primary/15" />
        </div>
    );
}

function EscaparateFloatingLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-5 h-5 bg-primary/40 rounded-sm shadow-lg shadow-primary/20" />
        </div>
    );
}

function EscaparateLifestyleLayout() {
    return (
        <div className="w-full h-full p-1">
            <div className="w-full h-full bg-primary/20 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-primary/50 rounded-sm" />
            </div>
        </div>
    );
}

function EscaparateMinimalLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1 bg-white">
            <div className="w-5 h-5 bg-primary/30 rounded-sm" />
            <div className="w-[40%] h-0.5 bg-primary/20 rounded-full" />
        </div>
    );
}

function EscaparateDetailLayout() {
    return (
        <div className="w-full h-full flex gap-0.5 p-1">
            <div className="flex-1 bg-primary/40 rounded-sm" />
            <div className="w-2 flex flex-col gap-0.5">
                <div className="flex-1 bg-primary/25 rounded-sm" />
                <div className="flex-1 bg-primary/25 rounded-sm" />
            </div>
        </div>
    );
}

function Escaparate360Layout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-5 h-5 border-2 border-primary/40 rounded-full flex items-center justify-center">
                <div className="text-primary/60 text-[6px]">360°</div>
            </div>
        </div>
    );
}

function EscaparateContextLayout() {
    return (
        <div className="w-full h-full flex items-end p-1">
            <div className="w-full h-[70%] bg-primary/20 rounded-t-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-primary/50 rounded-sm" />
            </div>
        </div>
    );
}

function EscaparateEditorialLayout() {
    return (
        <div className="w-full h-full flex gap-1 p-1.5">
            <div className="w-1/2 bg-primary/35 rounded-sm" />
            <div className="w-1/2 flex flex-col gap-0.5 justify-center">
                <div className="h-0.5 w-full bg-primary/25 rounded-full" />
                <div className="h-0.5 w-[70%] bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

// === COMUNICADO LAYOUTS ===
function ComunicadoOficialLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-1">
            <div className="relative w-7 h-7">
                <div className="absolute inset-0 rounded-full border-2 border-primary/40" />
                <div className="absolute inset-1 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-2 rounded-full bg-primary/15" />
                <div className="absolute inset-y-1.5 left-1/2 w-1 -translate-x-1/2 bg-primary/60" />
            </div>
            <div className="w-[75%] h-1 bg-primary/30 rounded-full" />
            <div className="w-[60%] h-1 bg-primary/20 rounded-full" />
        </div>
    );
}

function ComunicadoUrgenteLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-1">
            <div className="w-full h-2 bg-primary/40 rounded-full" />
            <div className="relative w-7 h-7 flex items-end justify-center">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-transparent border-b-primary/50" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-2.5 bg-primary/70" />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/70 rounded-full" />
            </div>
            <div className="w-[70%] h-1 bg-primary/20 rounded-full" />
        </div>
    );
}

function ComunicadoModernoLayout() {
    return (
        <div className="w-full h-full flex gap-1 p-1">
            <div className="w-2/3 h-full rounded-sm bg-primary/30 relative overflow-hidden">
                <div className="absolute -top-1 -right-2 w-7 h-7 rounded-full bg-primary/20" />
                <div className="absolute top-1 left-1 w-2.5 h-2.5 border-2 border-primary/45 rounded-sm" />
                <div className="absolute bottom-1 left-1 h-1.5 w-7 bg-primary/40 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="h-2 bg-primary/40 rounded-sm" />
                <div className="h-1.5 bg-primary/30 rounded-sm" />
                <div className="h-1.5 bg-primary/20 rounded-sm" />
            </div>
        </div>
    );
}

function ComunicadoEditorialLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-1">
            <div className="flex items-end gap-1">
                <div className="text-primary/80 text-xl font-black leading-none">A</div>
                <div className="text-primary/50 text-sm font-bold leading-none">a</div>
            </div>
            <div className="w-[75%] h-1 bg-primary/20 rounded-full" />
        </div>
    );
}

function ComunicadoComunidadLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-1">
            <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-primary/30 rounded-full" />
                <div className="w-5 h-5 bg-primary/45 rounded-full" />
                <div className="w-4 h-4 bg-primary/25 rounded-full" />
            </div>
            <div className="w-[65%] h-1 bg-primary/20 rounded-full" />
        </div>
    );
}

function ComunicadoMinimalLayout() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-1.5 p-1">
            <div className="w-3 h-3 bg-primary/40 rounded-sm" />
            <div className="w-full h-1 bg-primary/25 rounded-full" />
            <div className="w-[70%] h-1 bg-primary/15 rounded-full" />
        </div>
    );
}

function ComunicadoCardLayout() {
    return (
        <div className="w-full h-full p-1">
            <div className="w-full h-full rounded-sm bg-primary/5 flex items-center justify-center">
                <div className="w-[88%] h-[75%] rounded-sm border-2 border-primary/25 bg-primary/10 shadow-sm flex flex-col gap-1 p-1.5">
                    <div className="h-2 w-[70%] bg-primary/30 rounded-sm" />
                    <div className="h-1 w-full bg-primary/20 rounded-full" />
                    <div className="h-1 w-[80%] bg-primary/15 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function ComunicadoMarquesinaLayout() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-1.5 p-1">
            <div className="h-3 bg-primary/45 rounded-sm flex items-center gap-1 px-1">
                <div className="w-3 h-1.5 bg-primary/70 rounded-sm" />
                <div className="h-1 flex-1 bg-primary/15 rounded-full" />
            </div>
            <div className="h-1 w-[75%] bg-primary/25 rounded-full" />
        </div>
    );
}

function ComunicadoMemoLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-1 p-1">
            <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 bg-primary/40 rounded-sm" />
                <div className="h-1 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 bg-primary/30 rounded-sm" />
                <div className="h-1 flex-1 bg-primary/20 rounded-full" />
            </div>
            <div className="mt-0.5 h-1 w-full bg-primary/20 rounded-full" />
            <div className="h-1 w-[80%] bg-primary/15 rounded-full" />
            <div className="h-1 w-[50%] bg-primary/20 rounded-full self-end" />
        </div>
    );
}

function ComunicadoCartelLayout() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-1 p-1">
            <div className="h-5 bg-primary/45 rounded-sm" />
            <div className="h-2 bg-primary/25 rounded-sm" />
            <div className="h-1 w-[60%] bg-primary/20 rounded-full" />
        </div>
    );
}

function ComunicadoTimelineLayout() {
    return (
        <div className="w-full h-full flex items-center p-1">
            <div className="relative h-full w-4 flex items-center justify-center">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-primary/25" />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary/45 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary/30 rounded-full" />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary/20 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-1 pl-1.5">
                <div className="h-1 w-full bg-primary/20 rounded-full" />
                <div className="h-1 w-[80%] bg-primary/15 rounded-full" />
                <div className="h-1 w-[60%] bg-primary/10 rounded-full" />
            </div>
        </div>
    );
}

function ComunicadoIconLayout() {
    return (
        <div className="w-full h-full flex items-center gap-1.5 p-1">
            <div className="w-5 h-5 rounded-sm border-2 border-primary/35 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary/40 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-1 justify-center">
                <div className="h-1 w-full bg-primary/25 rounded-full" />
                <div className="h-1 w-[70%] bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

// === PREGUNTA LAYOUTS ===
function PreguntaBigLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="w-full h-3 rounded-md bg-primary/30" />
            <div className="w-[85%] h-3 rounded-md bg-primary/20" />
            <div className="relative mt-0.5">
                <div className="text-primary/80 text-2xl font-black leading-none">?</div>
                <div className="absolute -top-1 -right-2 w-3 h-3 bg-primary/35 rounded-full" />
            </div>
        </div>
    );
}

function PreguntaVersusLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative w-full h-10 rounded-md overflow-hidden border border-primary/25">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-primary/25" />
                <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary/60 text-primary-foreground text-[8px] font-bold flex items-center justify-center">
                        VS
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreguntaConversationLayout() {
    return (
        <div className="w-full h-full relative p-1 flex items-center justify-center">
            <div className="absolute left-1 top-2 w-9 h-5 rounded-lg bg-primary/35" />
            <div className="absolute left-3 top-6 w-2 h-2 bg-primary/35 rotate-45" />
            <div className="absolute right-1 bottom-2 w-10 h-5 rounded-lg border-2 border-primary/35 bg-background" />
            <div className="absolute right-4 bottom-1 w-2 h-2 border-2 border-primary/35 bg-background rotate-45" />
            <div className="absolute left-3 top-3 w-4 h-1 bg-primary/45 rounded-full" />
            <div className="absolute right-3 bottom-3 w-4 h-1 bg-primary/30 rounded-full" />
        </div>
    );
}

function PreguntaThoughtLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
                <div className="w-5 h-5 bg-primary/35 rounded-full" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/35 rounded-full" />
                <div className="absolute -top-2 left-2 w-2 h-2 bg-primary/25 rounded-full" />
                <div className="absolute -right-3 top-4 w-1.5 h-1.5 bg-primary/25 rounded-full" />
            </div>
        </div>
    );
}

function PreguntaControLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative w-10 h-10 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary/70" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/40 rounded-full" />
            </div>
        </div>
    );
}

function PreguntaBoldLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="relative w-10 h-10 rounded-full border-2 border-primary/40 flex items-center justify-center">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/35 rounded-full" />
                <div className="text-primary/70 text-2xl font-black leading-none">?</div>
            </div>
        </div>
    );
}

function PreguntaPollLayout() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-1 p-1">
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border-2 border-primary/45 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                </div>
                <div className="h-2 flex-1 bg-primary/35 rounded-md" />
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border-2 border-primary/30" />
                <div className="h-2 flex-1 bg-primary/20 rounded-md" />
            </div>
            <div className="mt-0.5 h-1 w-[70%] bg-primary/20 rounded-full self-end" />
        </div>
    );
}

function PreguntaOptionsLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-1 p-1">
            <div className="flex items-center justify-between h-4 px-1.5 rounded-md bg-primary/25">
                <div className="w-4 h-4 rounded-full bg-primary/45 flex items-center justify-center text-[7px] font-bold text-primary-foreground">A</div>
                <div className="h-1 w-8 bg-primary/40 rounded-full" />
            </div>
            <div className="flex items-center justify-between h-4 px-1.5 rounded-md border border-primary/30">
                <div className="w-4 h-4 rounded-full border-2 border-primary/40 flex items-center justify-center text-[7px] font-bold text-primary/70">B</div>
                <div className="h-1 w-8 bg-primary/25 rounded-full" />
            </div>
        </div>
    );
}

function PreguntaFillLayout() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-1 p-1">
            <div className="h-1 w-full bg-primary/25 rounded-full" />
            <div className="flex items-center gap-1">
                <div className="h-1 w-4 bg-primary/25 rounded-full" />
                <div className="h-2 w-10 border-b-2 border-primary/50" />
                <div className="h-1 w-6 bg-primary/25 rounded-full" />
            </div>
        </div>
    );
}

function PreguntaSliderLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
            <div className="w-full h-2 bg-primary/20 rounded-full relative">
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary/45 rounded-full ring-2 ring-primary/30" />
            </div>
            <div className="flex w-full justify-between px-1">
                <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
            </div>
        </div>
    );
}

function PreguntaEmojiLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1 p-1">
            <div className="w-7 h-7 rounded-full border-2 border-primary/50 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-primary/60 rounded-full" />
                <div className="w-1 h-1 bg-primary/60 rounded-full" />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-primary/35 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-primary/45 rounded-full" />
                <div className="w-1 h-1 bg-primary/45 rounded-full" />
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-primary/25 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-primary/35 rounded-full" />
                <div className="w-1 h-1 bg-primary/35 rounded-full" />
            </div>
        </div>
    );
}

function PreguntaDebateLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1 p-1">
            <div className="relative w-6 h-5 rounded-md bg-primary/35 flex items-center justify-center">
                <div className="absolute -bottom-1 left-1.5 w-2 h-2 bg-primary/35 rotate-45" />
                <div className="text-primary-foreground text-[7px] font-bold">A</div>
            </div>
            <div className="w-1.5 h-5 bg-primary/30 rounded-full" />
            <div className="relative w-6 h-5 rounded-md border-2 border-primary/35 flex items-center justify-center">
                <div className="absolute -bottom-1 right-1.5 w-2 h-2 border-2 border-primary/35 rotate-45 bg-background" />
                <div className="text-primary/70 text-[7px] font-bold">B</div>
            </div>
        </div>
    );
}

// === EVENTO LAYOUTS ===
function EventoDateLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-1">
            <div className="w-6 h-1 bg-primary/50 rounded-t-sm" />
            <div className="w-6 h-5 bg-primary/20 rounded-b-sm flex items-center justify-center">
                <div className="text-primary/60 text-[8px] font-bold">15</div>
            </div>
        </div>
    );
}

function EventoPosterLayout() {
    return (
        <div className="w-full h-full flex flex-col p-1 gap-0.5">
            <div className="flex-1 bg-primary/30 rounded-sm" />
            <div className="h-2 flex flex-col gap-0.5 items-center justify-center">
                <div className="w-[60%] h-0.5 bg-primary/40 rounded-full" />
            </div>
        </div>
    );
}

function EventoTicketLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-full h-4 bg-primary/30 rounded-sm flex items-center">
                <div className="w-1 h-full bg-primary/50 rounded-l-sm" />
                <div className="flex-1 border-l border-dashed border-primary/40" />
            </div>
        </div>
    );
}

function EventoScheduleLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[5px]">10:00</div>
                <div className="h-0.5 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[5px]">14:00</div>
                <div className="h-0.5 flex-1 bg-primary/20 rounded-full" />
            </div>
        </div>
    );
}

function EventoReminderLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <Bell className="w-10 h-10 text-primary/60" />
        </div>
    );
}

function EventoLiveLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-1 p-1">
            <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse" />
            <div className="text-primary/60 text-[7px] font-bold">LIVE</div>
        </div>
    );
}

function EventoRecapLayout() {
    return (
        <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1">
            <div className="bg-primary/30 rounded-sm" />
            <div className="bg-primary/25 rounded-sm" />
            <div className="col-span-2 h-2 bg-primary/20 rounded-sm" />
        </div>
    );
}

// === COMPARATIVA LAYOUTS ===
function ComparativaBeforeAfterLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
            <div className="w-4 h-5 bg-primary/25 rounded-sm" />
            <div className="text-primary/40 text-[6px]">→</div>
            <div className="w-4 h-5 bg-primary/50 rounded-sm" />
        </div>
    );
}

function ComparativaTableLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-1">
            <div className="h-1.5 flex gap-0.5">
                <div className="flex-1 bg-primary/40 rounded-sm" />
                <div className="flex-1 bg-primary/40 rounded-sm" />
            </div>
            <div className="h-1 flex gap-0.5">
                <div className="flex-1 bg-primary/20 rounded-sm" />
                <div className="flex-1 bg-primary/20 rounded-sm" />
            </div>
            <div className="h-1 flex gap-0.5">
                <div className="flex-1 bg-primary/15 rounded-sm" />
                <div className="flex-1 bg-primary/15 rounded-sm" />
            </div>
        </div>
    );
}

function ComparativaSliderLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-full h-5 relative">
                <div className="absolute inset-0 bg-primary/25 rounded-sm" />
                <div className="absolute inset-y-0 left-0 w-1/2 bg-primary/40 rounded-l-sm" />
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/60" />
            </div>
        </div>
    );
}

function ComparativaSpecsLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="h-0.5 flex-1 bg-primary/40 rounded-full" />
                <div className="h-0.5 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="h-0.5 flex-1 bg-primary/30 rounded-full" />
                <div className="h-0.5 flex-1 bg-primary/40 rounded-full" />
            </div>
        </div>
    );
}

function ComparativaEvolutionLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
            <div className="w-2 h-2 bg-primary/25 rounded-sm" />
            <div className="w-3 h-3 bg-primary/35 rounded-sm" />
            <div className="w-4 h-4 bg-primary/50 rounded-sm" />
        </div>
    );
}

function ComparativaRadarLayout() {
    return (
        <div className="w-full h-full flex items-center justify-center p-1">
            <div className="w-6 h-6 border border-primary/30 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary/30 rotate-45" />
            </div>
        </div>
    );
}

function ComparativaStackLayout() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="w-5 h-1.5 bg-primary/40 rounded-sm" />
            <div className="w-5 h-1.5 bg-primary/30 rounded-sm" />
            <div className="w-5 h-1.5 bg-primary/20 rounded-sm" />
        </div>
    );
}

// === LISTA LAYOUTS ===
function ListaBulletsLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-primary/50" />
                <div className="h-0.5 flex-1 bg-primary/25 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-primary/50" />
                <div className="h-0.5 flex-1 bg-primary/20 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-primary/50" />
                <div className="h-0.5 flex-1 bg-primary/15 rounded-full" />
            </div>
        </div>
    );
}

function ListaRankingLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="flex items-center gap-1">
                <div className="text-primary/60 text-[6px] font-bold">1</div>
                <div className="h-1.5 flex-1 bg-primary/40 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
                <div className="text-primary/50 text-[6px]">2</div>
                <div className="h-1.5 flex-[0.7] bg-primary/30 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
                <div className="text-primary/40 text-[6px]">3</div>
                <div className="h-1.5 flex-[0.5] bg-primary/20 rounded-sm" />
            </div>
        </div>
    );
}

function ListaMinimalLayout() {
    return (
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
            <div className="h-0.5 w-full bg-primary/30 rounded-full" />
            <div className="h-0.5 w-[85%] bg-primary/20 rounded-full" />
            <div className="h-0.5 w-[70%] bg-primary/15 rounded-full" />
        </div>
    );
}
