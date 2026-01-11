import { v } from "convex/values";
import { query } from "./_generated/server";

export const getThemeSettings = query({
    args: {},
    handler: async (ctx) => {
        const primary = await ctx.db
            .query("app_settings")
            .withIndex("by_key", (q) => q.eq("key", "theme_primary"))
            .first();

        const secondary = await ctx.db
            .query("app_settings")
            .withIndex("by_key", (q) => q.eq("key", "theme_secondary"))
            .first();

        return {
            primary: (primary?.value as string) || "243.4 75.4% 58.6%",
            secondary: (secondary?.value as string) || "330 81% 60%",
        };
    },
});
