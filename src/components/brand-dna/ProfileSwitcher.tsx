'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Check, Globe, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BrandKitSummary } from '@/lib/brand-types';

interface ProfileSwitcherProps {
    profiles: BrandKitSummary[];
    activeProfileId?: string;
    onProfileChange: (profileId: string) => void;
    onNewProfile: () => void;
    isLoading?: boolean;
}

export function ProfileSwitcher({
    profiles,
    activeProfileId,
    onProfileChange,
    onNewProfile,
    isLoading = false,
}: ProfileSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeProfile = profiles.find(p => p.id === activeProfileId);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (profiles.length === 0 && !isLoading) {
        return null; // No mostrar nada si no hay perfiles
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm",
                    "hover:bg-muted/50 hover:border-primary/30 transition-all duration-200",
                    "shadow-sm hover:shadow-md",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : activeProfile?.favicon_url ? (
                    <img
                        src={activeProfile.favicon_url}
                        alt=""
                        className="w-5 h-5 rounded-sm object-contain"
                    />
                ) : (
                    <Building2 className="w-5 h-5 text-primary" />
                )}

                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                        {isLoading ? 'Cargando...' : activeProfile?.brand_name || 'Seleccionar perfil'}
                    </span>
                    {activeProfile?.url && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                            {new URL(activeProfile.url).hostname}
                        </span>
                    )}
                </div>

                <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={cn(
                    "absolute top-full left-0 mt-2 w-72 z-50",
                    "glass-panel border-0 shadow-xl",
                    "animate-in fade-in slide-in-from-top-2 duration-200"
                )}>
                    {/* Profile List */}
                    <div className="max-h-64 overflow-y-auto py-2">
                        {profiles.map((profile) => (
                            <button
                                key={profile.id}
                                onClick={() => {
                                    onProfileChange(profile.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-left",
                                    "hover:bg-muted/50 transition-colors",
                                    profile.id === activeProfileId && "bg-primary/5"
                                )}
                            >
                                {profile.favicon_url ? (
                                    <img
                                        src={profile.favicon_url}
                                        alt=""
                                        className="w-6 h-6 rounded-sm object-contain flex-shrink-0"
                                    />
                                ) : (
                                    <Globe className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {profile.brand_name || 'Sin nombre'}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                        {profile.url ? new URL(profile.url).hostname : 'URL no disponible'}
                                    </p>
                                </div>

                                {profile.id === activeProfileId && (
                                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-border" />

                    {/* New Profile Button */}
                    <div className="p-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => {
                                onNewProfile();
                                setIsOpen(false);
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Nuevo Kit de Marca
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
