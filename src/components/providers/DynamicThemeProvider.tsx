'use client';

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useEffect } from "react";

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useQuery(api.settings.getThemeSettings);

    useEffect(() => {
        if (theme?.primary && theme?.secondary) {
            const root = document.documentElement;

            // Convert hex to HSL string format "H S% L%" for Tailwind v4
            const hexToHslString = (hex: string): string | null => {
                // Remove # if present
                hex = hex.replace(/^#/, '');
                if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null;

                const r = parseInt(hex.slice(0, 2), 16) / 255;
                const g = parseInt(hex.slice(2, 4), 16) / 255;
                const b = parseInt(hex.slice(4, 6), 16) / 255;

                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h = 0, s = 0;
                const l = (max + min) / 2;

                if (max !== min) {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                        case g: h = ((b - r) / d + 2) / 6; break;
                        case b: h = ((r - g) / d + 4) / 6; break;
                    }
                }

                return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
            };

            const formatColor = (val: string) => {
                if (!val) return val;
                // If it's the old format "H S L" (e.g., "243.4 75.4% 58.6%")
                if (val.includes(' ') && !val.includes('(')) {
                    return `hsl(${val})`;
                }
                // If it's a hex without # (e.g., "6366f1")
                if (/^[0-9A-F]{6}$/i.test(val)) {
                    return `#${val}`;
                }
                return val;
            };

            // Convert to raw HSL format for Tailwind v4 (without hsl() wrapper)
            const getRawHsl = (val: string): string => {
                if (!val) return val;
                // Already in "H S% L%" format
                if (val.includes(' ') && !val.includes('(')) {
                    return val;
                }
                // Convert hex to HSL
                const hex = val.replace(/^#/, '');
                if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                    const hsl = hexToHslString(hex);
                    if (hsl) return hsl;
                }
                return val;
            };

            // Set specific brand tokens
            root.style.setProperty('--color-brand-primary', formatColor(theme.primary));
            root.style.setProperty('--color-brand-secondary', formatColor(theme.secondary));

            // CRITICAL: Update the source theme variables used by gradients (e.g., bg-brand-gradient)
            // These are defined in globals.css and used in linear-gradient(...)
            root.style.setProperty('--theme-primary', formatColor(theme.primary));
            root.style.setProperty('--theme-secondary', formatColor(theme.secondary));

            // Override standard Tailwind tokens to match brand
            // Using 'important' priority to override @theme inline definitions
            const primaryHsl = getRawHsl(theme.primary);
            const secondaryHsl = getRawHsl(theme.secondary);
            const primaryFormatted = formatColor(theme.primary);
            const secondaryFormatted = formatColor(theme.secondary);

            root.style.setProperty('--primary', primaryHsl, 'important');
            root.style.setProperty('--ring', primaryHsl, 'important');
            root.style.setProperty('--secondary', secondaryHsl, 'important');

            root.style.setProperty('--color-primary', primaryFormatted, 'important');
            root.style.setProperty('--color-secondary', secondaryFormatted, 'important');
            root.style.setProperty('--color-ring', primaryFormatted, 'important');

            // Also update sidebar variables to ensure consistency
            root.style.setProperty('--sidebar-primary', primaryHsl, 'important');
            root.style.setProperty('--sidebar-ring', primaryHsl, 'important');
            root.style.setProperty('--color-sidebar-primary', primaryFormatted, 'important');
            root.style.setProperty('--color-sidebar-ring', primaryFormatted, 'important');
        }
    }, [theme]);

    return <>{children}</>;
}
