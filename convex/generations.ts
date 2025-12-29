import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveGeneration = mutation({
    args: {
        brand_id: v.id("brands"),
        prompt_snapshot: v.any(),
        image_url: v.string(),
        annotations: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("generations", {
            ...args,
            created_at: new Date().toISOString(),
        });
    },
});

export const getGenerations = query({
    args: { brand_id: v.id("brands") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("generations")
            .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
            .collect();
    },
});
