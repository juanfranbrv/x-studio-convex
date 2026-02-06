import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {
        userId: v.optional(v.string()),
        brandId: v.optional(v.id("brand_dna")),
    },
    handler: async (ctx, args) => {
        // 1. Get System Presets (Global)
        const systemPresets = await ctx.db
            .query("presets")
            .withIndex("by_system", (q) => q.eq("isSystem", true))
            .order("desc")
            .collect();

        // 2. Get User Presets scoped to Brand Kit (if brandId provided)
        let userPresets: any[] = [];
        if (args.brandId && args.userId) {
            userPresets = await ctx.db
                .query("presets")
                .withIndex("by_brand", (q) => q.eq("brandId", args.brandId))
                .order("desc")
                .collect()
                .then((items) =>
                    items.filter((preset: any) => preset.userId === args.userId && !preset.isSystem)
                );
        } else if (args.userId) {
            // Fallback: if no brandId but userId (though we prefer brand scoping now)
            userPresets = await ctx.db
                .query("presets")
                .withIndex("by_user", (q) => q.eq("userId", args.userId))
                .order("desc")
                .collect()
                .then((items) => items.filter((preset: any) => !preset.isSystem));
        }

        // Default System Presets (Mock data for UI visualization)
        const DEFAULT_PRESETS: any[] = [
            {
                _id: "sys_1",
                name: "Meme Viral",
                description: "Contenido de humor para Twitter/X",
                icon: "Smile",
                isSystem: true,
                state: { platform: "twitter", format: "post", intent: "meme" }
            },
            {
                _id: "sys_2",
                name: "Anuncio Corporativo",
                description: "Noticia formal para LinkedIn",
                icon: "Briefcase",
                isSystem: true,
                state: { platform: "linkedin", format: "post", intent: "news" }
            },
            {
                _id: "sys_3",
                name: "Cita Inspiradora",
                description: "Frase minimalista para feed",
                icon: "Quote",
                isSystem: true,
                state: { platform: "instagram", format: "square", intent: "quote" }
            },
            {
                _id: "sys_4",
                name: "Lanzamiento Producto",
                description: "Showcase visual para Stories",
                icon: "Rocket",
                isSystem: true,
                state: { platform: "instagram", format: "story", intent: "showcase" }
            },
            {
                _id: "sys_5",
                name: "Oferta Flash",
                description: "Promoción urgente con timer",
                icon: "Zap",
                isSystem: true,
                state: { platform: "instagram", format: "story", intent: "promotion" }
            },
            {
                _id: "sys_6",
                name: "Tutorial Rápido",
                description: "Paso a paso para TikTok",
                icon: "Clapperboard",
                isSystem: true,
                state: { platform: "tiktok", format: "reel", intent: "tutorial" }
            }
        ];

        return {
            system: (systemPresets.length > 0 ? systemPresets : DEFAULT_PRESETS) as any[],
            user: userPresets
        };
    },
});

export const create = mutation({
    args: {
        userId: v.string(),
        brandId: v.optional(v.id("brand_dna")),
        name: v.string(),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        state: v.any(), // Complete GenerationState snapshot
    },
    handler: async (ctx, args) => {
        const presetType =
            typeof (args.state as any)?.presetType === "string"
                ? (args.state as any).presetType
                : "image";

        // Enforce limit of 6 presets per Brand Kit + preset type
        if (args.brandId) {
            const existingPresets = await ctx.db
                .query("presets")
                .withIndex("by_brand", (q) => q.eq("brandId", args.brandId))
                .collect()
                .then((items) =>
                    items.filter((preset: any) => preset.userId === args.userId && !preset.isSystem)
                );

            const sameType = existingPresets.filter((preset: any) => {
                const type = typeof preset?.state?.presetType === "string" ? preset.state.presetType : "image";
                return type === presetType;
            });

            if (sameType.length >= 6) {
                throw new Error("Límite de presets alcanzado (máximo 6 por Brand Kit y tipo).");
            }
        }

        const presetId = await ctx.db.insert("presets", {
            userId: args.userId,
            brandId: args.brandId,
            name: args.name,
            description: args.description,
            icon: args.icon || "Sparkles", // Default icon
            state: args.state,
            isSystem: false,
            usageCount: 0,
            created_at: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
        });
        return presetId;
    },
});

export const remove = mutation({
    args: {
        presetId: v.id("presets"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const preset = await ctx.db.get(args.presetId);
        if (!preset) {
            throw new Error("Preset not found");
        }
        // Only allow deletion of own presets
        if (preset.userId !== args.userId) {
            throw new Error("Unauthorized");
        }
        // Don't allow deleting system presets
        if (preset.isSystem) {
            throw new Error("Cannot delete system presets");
        }
        await ctx.db.delete(args.presetId);
        return { success: true };
    },
});
