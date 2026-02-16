import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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

export const getAIConfig = query({
    args: {},
    handler: async (ctx) => {
        const imageModel = await ctx.db
            .query("app_settings")
            .withIndex("by_key", (q) => q.eq("key", "model_image_generation"))
            .first();

        const intelligenceModel = await ctx.db
            .query("app_settings")
            .withIndex("by_key", (q) => q.eq("key", "model_intelligence"))
            .first();

        return {
            imageModel: (imageModel?.value as string) || "wisdom/gemini-3-pro-image-preview",
            intelligenceModel: (intelligenceModel?.value as string) || "gemini-3-flash-preview",
        };
    },
});

export const saveAppSetting = mutation({
    args: {
        key: v.string(),
        value: v.any(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("app_settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();

        const timestamp = new Date().toISOString();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value, updated_at: timestamp });
        } else {
            await ctx.db.insert("app_settings", { key: args.key, value: args.value, updated_at: timestamp });
        }
    },
});
