'use client';

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { applyThemeColors, DEFAULT_THEME_COLORS, deriveSchemeFromColors, readThemeColors } from "@/lib/theme-colors";

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const theme = useQuery(api.settings.getThemeSettings);
    const userId = useMemo(() => user?.id ?? null, [user?.id]);

    useEffect(() => {
        const stored = readThemeColors(userId);
        if (stored) {
            applyThemeColors(stored);
            return;
        }

        if (theme?.primary && theme?.secondary) {
            applyThemeColors(deriveSchemeFromColors(theme.primary, theme.secondary));
            return;
        }

        applyThemeColors(DEFAULT_THEME_COLORS);
    }, [theme, userId]);

    useEffect(() => {
        const handleRefresh = () => {
            const stored = readThemeColors(userId);
            if (stored) {
                applyThemeColors(stored);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('x-studio-theme-colors-updated', handleRefresh as EventListener);
            window.addEventListener('storage', handleRefresh);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('x-studio-theme-colors-updated', handleRefresh as EventListener);
                window.removeEventListener('storage', handleRefresh);
            }
        };
    }, [userId]);

    return <>{children}</>;
}
