'use client';

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useEffect } from "react";
import { applyThemeColors, buildThemeColors, DEFAULT_THEME_COLORS } from "@/lib/theme-colors";

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useQuery(api.settings.getThemeSettings);

    useEffect(() => {
        if (theme) {
            applyThemeColors(buildThemeColors(theme));
            return;
        }

        applyThemeColors(DEFAULT_THEME_COLORS);
    }, [theme]);

    return <>{children}</>;
}
