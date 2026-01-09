import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveGeneration = mutation({
    args: {
        brand_id: v.id("brand_dna"),
        prompt_snapshot: v.any(),
        image_url: v.string(),
        annotations: v.optional(v.any()),
        state: v.any(), // Complete GenerationState snapshot
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("generations", {
            ...args,
            created_at: new Date().toISOString(),
        });
    },
});

export const getGenerations = query({
    args: { brand_id: v.id("brand_dna") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("generations")
            .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
            .order("desc")
            .collect();
    },
});

export const getRecents = query({
    args: {
        brand_id: v.id("brand_dna"),
        limit: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 2;

        return await ctx.db
            .query("generations")
            .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
            .order("desc")
            .take(limit);
    },
});
