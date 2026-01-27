'use client';

import { cn } from '@/lib/utils';
import { DEFAULT_LAYOUTS, LAYOUTS_BY_INTENT, type LayoutOption } from '@/lib/creation-flow-types';
import { LayoutThumbnail } from './LayoutThumbnail';

const ALL_LAYOUTS: LayoutOption[] = [
    ...DEFAULT_LAYOUTS,
    ...Object.values(LAYOUTS_BY_INTENT).flatMap(list => list ?? [])
];

function getLayoutById(layoutId: string): LayoutOption | undefined {
    return ALL_LAYOUTS.find(layout => layout.id === layoutId);
}

interface CanvasGhostOverlayProps {
    layoutId: string | null;
    className?: string;
}

/**
 * A large-scale ghost overlay that shows the structural layout
 * based on the selected layout ID. Updates when layout changes.
 * Uses theme primary color for consistent branding.
 */
export function CanvasGhostOverlay({ layoutId, className }: CanvasGhostOverlayProps) {
    if (!layoutId) return null;

    return (
        <div className={cn(
            "absolute inset-0 pointer-events-none flex items-center justify-center",
            className
        )}>
            <div className="w-full h-full relative">
                {getGhostVisual(layoutId)}
            </div>
        </div>
    );
}

function getGhostVisual(id: string) {
    // COMUNICADO layouts
    if (id.startsWith('comunicado-')) {
        if (id === 'comunicado-oficial') return <ComunicadoOficialGhost />;
        if (id === 'comunicado-urgent' || id === 'comunicado-alerta') return <ComunicadoUrgenteGhost />;
        if (id === 'comunicado-modern') return <ComunicadoModernoGhost />;
        if (id === 'comunicado-editorial' || id === 'comunicado-quote') return <ComunicadoEditorialGhost />;
        if (id === 'comunicado-community') return <ComunicadoComunidadGhost />;
        if (id === 'comunicado-minimal') return <ComunicadoMinimalGhost />;
        if (id === 'comunicado-card') return <ComunicadoCardGhost />;
        if (id === 'comunicado-ticker' || id === 'comunicado-banner') return <ComunicadoMarquesinaGhost />;
        if (id === 'comunicado-memo' || id === 'comunicado-checklist') return <ComunicadoMemoGhost />;
        if (id === 'comunicado-poster') return <ComunicadoCartelGhost />;
        if (id === 'comunicado-timeline') return <ComunicadoTimelineGhost />;
        if (id === 'comunicado-icon') return <ComunicadoIconGhost />;
    }

    // DATO layouts
    if (id === 'dato-free' || id.endsWith('-free')) return <FreeGhost />;
    if (id === 'dato-big') return <BigNumberGhost />;
    if (id === 'dato-comparison' || id.includes('comparison') || id.includes('vs')) return <ComparisonGhost />;
    if (id === 'dato-process' || id.includes('process')) return <ProcessGhost />;
    if (id === 'dato-infographic' || id.includes('info') || id.includes('grid')) return <InfoGridGhost />;
    if (id === 'dato-metric' || id.includes('metric')) return <MetricGhost />;
    if (id === 'dato-pie' || id.includes('circular') || id.includes('pie')) return <CircularGhost />;
    if (id === 'dato-dashboard' || id.includes('dashboard')) return <DashboardGhost />;
    if (id === 'dato-bar' || id.includes('bar')) return <BarChartGhost />;
    if (id === 'dato-icon' || id.includes('icon')) return <IconGhost />;
    if (id === 'dato-timeline' || id.includes('timeline')) return <TimelineGhost />;
    if (id === 'dato-map' || id.includes('map')) return <MapGhost />;

    // SERVICIO layouts
    if (id.includes('benefit') || id.includes('split')) return <SplitGhost />;
    if (id.includes('pricing') || id.includes('spotlight')) return <SpotlightGhost />;
    if (id.includes('testimonial') || id.includes('quote')) return <TestimonialGhost />;

    const layout = getLayoutById(id);
    if (layout) {
        return <ThumbnailGhost layout={layout} />;
    }

    // Default fallback
    return <DefaultGhost />;
}

// === LARGE SCALE GHOST LAYOUTS WITH THEMED COLORS ===

function FreeGhost() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary/30 text-8xl font-bold">?</div>
        </div>
    );
}

function BigNumberGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <div className="h-8 w-[50%] bg-primary/15 rounded-lg" />
            <div className="text-primary/25 text-[120px] font-black leading-none">73%</div>
            <div className="h-4 w-[60%] bg-primary/10 rounded-full" />
        </div>
    );
}

function ComparisonGhost() {
    return (
        <div className="w-full h-full flex items-end justify-center gap-12 pb-20">
            <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-[120px] bg-primary/20 rounded-lg" />
                <div className="h-4 w-20 bg-primary/10 rounded-full" />
            </div>
            <div className="text-primary/20 text-4xl font-bold">VS</div>
            <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-[200px] bg-primary/35 rounded-lg" />
                <div className="h-4 w-20 bg-primary/10 rounded-full" />
            </div>
        </div>
    );
}

function ProcessGhost() {
    return (
        <div className="w-full h-full flex items-center justify-around px-12">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/25 flex items-center justify-center text-primary/50 text-2xl font-bold">
                        {i}
                    </div>
                    <div className="h-3 w-20 bg-primary/10 rounded-full" />
                </div>
            ))}
        </div>
    );
}

function InfoGridGhost() {
    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-6 p-8">
            {['42', '18K', '7.2', '99%'].map((label, i) => (
                <div key={label} className="bg-primary/10 rounded-xl flex flex-col items-center justify-center gap-2">
                    <div className="text-primary/30 text-4xl font-bold">{label}</div>
                    <div className="h-3 w-[60%] bg-primary/10 rounded-full" />
                </div>
            ))}
        </div>
    );
}

function MetricGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-primary/30 text-7xl font-mono font-bold">1,234</div>
            <div className="flex items-center gap-2">
                <div className="text-green-500/40 text-3xl">▲</div>
                <div className="text-2xl text-primary/30 font-medium">+12.5%</div>
            </div>
            <div className="h-4 w-[40%] bg-primary/10 rounded-full mt-4" />
        </div>
    );
}

function CircularGhost() {
    return (
        <div className="w-full h-full flex items-center justify-center p-12">
            <div className="w-48 h-48 rounded-full border-[16px] border-primary/15 border-t-primary/35 border-r-primary/35 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary/35">67%</span>
            </div>
        </div>
    );
}

function DashboardGhost() {
    return (
        <div className="w-full h-full p-8">
            <div className="w-full h-full rounded-2xl border-2 border-primary/15 bg-primary/5 p-6 flex flex-col gap-4">
                <div className="h-4 w-[30%] bg-primary/15 rounded-full" />
                <div className="text-5xl font-bold text-primary/30">847</div>
                <div className="flex-1 flex items-end gap-2">
                    {[30, 50, 40, 70, 55, 80].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-md bg-primary/15" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function BarChartGhost() {
    return (
        <div className="w-full h-full flex items-end justify-center gap-6 p-12 pb-20">
            {[30, 60, 80, 50, 70].map((h, i) => (
                <div key={i} className="w-12 rounded-t-lg bg-primary/25" style={{ height: `${h}%` }} />
            ))}
        </div>
    );
}

function IconGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-24 h-24 rounded-2xl bg-primary/15 flex items-center justify-center text-5xl">
                💡
            </div>
            <div className="text-5xl font-bold text-primary/30">+50%</div>
            <div className="h-4 w-[40%] bg-primary/10 rounded-full" />
        </div>
    );
}

function TimelineGhost() {
    return (
        <div className="w-full h-full flex items-center px-12">
            <div className="w-full flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/40" />
                <div className="flex-1 h-1 bg-primary/20" />
                <div className="w-8 h-8 rounded-full bg-primary/25" />
                <div className="flex-1 h-1 bg-primary/15" />
                <div className="w-8 h-8 rounded-full bg-primary/15" />
            </div>
        </div>
    );
}

function MapGhost() {
    return (
        <div className="w-full h-full flex items-center justify-center p-8">
            <div className="w-full h-full rounded-xl bg-primary/5 relative overflow-hidden">
                <div className="absolute top-8 left-8 w-20 h-16 bg-primary/15 rounded-lg" />
                <div className="absolute top-12 right-12 w-16 h-24 bg-primary/25 rounded-lg" />
                <div className="absolute bottom-8 left-16 w-28 h-14 bg-primary/10 rounded-lg" />
                <div className="absolute bottom-12 right-8 w-6 h-6 rounded-full bg-red-400/40" />
                <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-blue-400/40" />
            </div>
        </div>
    );
}

function SplitGhost() {
    return (
        <div className="w-full h-full flex gap-6 p-8">
            <div className="w-[40%] flex flex-col gap-4 justify-center">
                <div className="h-6 w-full bg-primary/25 rounded-full" />
                <div className="h-6 w-[70%] bg-primary/15 rounded-full" />
                <div className="h-10 w-[50%] bg-primary/25 rounded-full mt-4" />
            </div>
            <div className="w-[60%] bg-primary/10 rounded-2xl" />
        </div>
    );
}

function SpotlightGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8">
            <div className="w-40 h-40 bg-primary/20 rounded-full" />
            <div className="h-6 w-[50%] bg-primary/15 rounded-full" />
            <div className="h-4 w-[30%] bg-primary/10 rounded-full" />
        </div>
    );
}

function TestimonialGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
            <div className="text-primary/25 text-8xl leading-none">"</div>
            <div className="h-5 w-[80%] bg-primary/15 rounded-full" />
            <div className="h-5 w-[60%] bg-primary/15 rounded-full" />
            <div className="w-16 h-16 rounded-full bg-primary/20 mt-6" />
        </div>
    );
}

function ComunicadoOficialGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-10">
            <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border-[6px] border-primary/20" />
                <div className="absolute inset-4 rounded-full border-[4px] border-primary/15" />
                <div className="absolute inset-8 rounded-full bg-primary/10" />
                <div className="absolute inset-y-6 left-1/2 w-1.5 -translate-x-1/2 bg-primary/35" />
            </div>
            <div className="w-[60%] h-5 bg-primary/15 rounded-full" />
            <div className="w-[45%] h-4 bg-primary/10 rounded-full" />
        </div>
    );
}

function ComunicadoUrgenteGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-10">
            <div className="w-[80%] h-6 bg-primary/25 rounded-full" />
            <div className="relative w-32 h-32 flex items-end justify-center">
                <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[40px] border-transparent border-b-primary/35" />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-2 h-10 bg-primary/45" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/45 rounded-full" />
            </div>
            <div className="w-[55%] h-4 bg-primary/15 rounded-full" />
        </div>
    );
}

function ComunicadoModernoGhost() {
    return (
        <div className="w-full h-full flex gap-10 p-10">
            <div className="w-[60%] rounded-2xl bg-primary/15 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10" />
                <div className="absolute top-6 left-6 w-10 h-10 border-[4px] border-primary/25 rounded-xl" />
                <div className="absolute bottom-6 left-6 h-4 w-40 bg-primary/25 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="h-6 bg-primary/25 rounded-lg" />
                <div className="h-5 bg-primary/18 rounded-lg" />
                <div className="h-5 bg-primary/12 rounded-lg" />
            </div>
        </div>
    );
}

function ComunicadoEditorialGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-10">
            <div className="text-primary/25 text-[120px] font-black leading-none">Aa</div>
            <div className="w-[60%] h-4 bg-primary/12 rounded-full" />
        </div>
    );
}

function ComunicadoComunidadGhost() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/25 rounded-full" />
                <div className="w-20 h-20 bg-primary/35 rounded-full" />
                <div className="w-14 h-14 bg-primary/20 rounded-full" />
            </div>
            <div className="w-[60%] h-4 bg-primary/12 rounded-full" />
        </div>
    );
}

function ComunicadoMinimalGhost() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-6 p-10">
            <div className="w-10 h-10 bg-primary/20 rounded-lg" />
            <div className="w-full h-4 bg-primary/12 rounded-full" />
            <div className="w-[65%] h-4 bg-primary/10 rounded-full" />
        </div>
    );
}

function ComunicadoCardGhost() {
    return (
        <div className="w-full h-full flex items-center justify-center p-10">
            <div className="w-[80%] h-[70%] rounded-2xl border-2 border-primary/15 bg-primary/10 flex flex-col gap-4 p-6 shadow-sm">
                <div className="h-6 w-[70%] bg-primary/20 rounded-full" />
                <div className="h-4 w-full bg-primary/12 rounded-full" />
                <div className="h-4 w-[80%] bg-primary/10 rounded-full" />
            </div>
        </div>
    );
}

function ComunicadoMarquesinaGhost() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-6 p-10">
            <div className="h-8 bg-primary/25 rounded-2xl flex items-center gap-4 px-6">
                <div className="w-10 h-4 bg-primary/45 rounded-full" />
                <div className="h-3 flex-1 bg-primary/12 rounded-full" />
            </div>
            <div className="h-4 w-[70%] bg-primary/12 rounded-full" />
        </div>
    );
}

function ComunicadoMemoGhost() {
    return (
        <div className="w-full h-full flex flex-col gap-5 p-10">
            <div className="flex items-center gap-4">
                <div className="w-10 h-5 bg-primary/30 rounded-full" />
                <div className="h-4 flex-1 bg-primary/15 rounded-full" />
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-5 bg-primary/20 rounded-full" />
                <div className="h-4 flex-1 bg-primary/12 rounded-full" />
            </div>
            <div className="h-4 w-full bg-primary/12 rounded-full" />
            <div className="h-4 w-[80%] bg-primary/10 rounded-full" />
            <div className="h-4 w-[50%] bg-primary/12 rounded-full self-end" />
        </div>
    );
}

function ComunicadoCartelGhost() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-6 p-10">
            <div className="h-12 bg-primary/30 rounded-2xl" />
            <div className="h-6 bg-primary/18 rounded-2xl" />
            <div className="h-4 w-[60%] bg-primary/12 rounded-full" />
        </div>
    );
}

function ComunicadoTimelineGhost() {
    return <TimelineGhost />;
}

function ComunicadoIconGhost() {
    return (
        <div className="w-full h-full flex items-center gap-8 p-10">
            <div className="w-20 h-20 rounded-2xl border-2 border-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary/25 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-4">
                <div className="h-5 w-full bg-primary/15 rounded-full" />
                <div className="h-4 w-[70%] bg-primary/10 rounded-full" />
            </div>
        </div>
    );
}

function DefaultGhost() {
    return (
        <div className="w-full h-full flex flex-col gap-6 p-8">
            <div className="flex-1 bg-primary/5 rounded-2xl" />
            <div className="h-6 w-[50%] mx-auto bg-primary/15 rounded-full" />
        </div>
    );
}

function ThumbnailGhost({ layout }: { layout: LayoutOption }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[96%] h-[96%] opacity-80">
                <div className="w-full h-full scale-[2.1] origin-center transform-gpu">
                    <LayoutThumbnail layout={layout} variant="ghost" className="bg-transparent shadow-none" />
                </div>
            </div>
        </div>
    );
}
