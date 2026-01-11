'use client';

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useEffect } from "react";

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useQuery(api.settings.getThemeSettings);

    useEffect(() => {
        if (theme?.primary && theme?.secondary) {
            const root = document.documentElement;

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

            // Set specific brand tokens
            root.style.setProperty('--color-brand-primary', formatColor(theme.primary));
            root.style.setProperty('--color-brand-secondary', formatColor(theme.secondary));

            // CRITICAL: Update the source theme variables used by gradients (e.g., bg-brand-gradient)
            // These are defined in globals.css and used in linear-gradient(...)
            root.style.setProperty('--theme-primary', formatColor(theme.primary));
            root.style.setProperty('--theme-secondary', formatColor(theme.secondary));

            // Override standard Tailwind tokens to match brand
            // We set both the color variable (for direct usage) and the raw HSL variables (for opacity modifiers)
            root.style.setProperty('--color-primary', formatColor(theme.primary));
            root.style.setProperty('--color-secondary', formatColor(theme.secondary));
            root.style.setProperty('--color-ring', formatColor(theme.primary));

            // Also update sidebar variables to ensure consistency
            root.style.setProperty('--sidebar-primary', theme.primary);
            root.style.setProperty('--sidebar-ring', theme.primary);
            root.style.setProperty('--color-sidebar-primary', formatColor(theme.primary));
            root.style.setProperty('--color-sidebar-ring', formatColor(theme.primary));

            // Set raw HSL variables if the format matches (required for Tailwind opacity modifiers like bg-primary/90)
            if (theme.primary.includes(' ') && !theme.primary.includes('(')) {
                root.style.setProperty('--primary', theme.primary);
                root.style.setProperty('--ring', theme.primary);
            }
            if (theme.secondary.includes(' ') && !theme.secondary.includes('(')) {
                root.style.setProperty('--secondary', theme.secondary);
            }
        }
    }, [theme]);

    return <>{children}</>;
}
