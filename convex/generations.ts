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
        // First, unmark any existing "latest" generation for this brand
        const existingLatest = await ctx.db
            .query("generations")
            .withIndex("by_brand_latest", (q) =>
                q.eq("brand_id", args.brand_id).eq("isLatest", true)
            )
            .collect();

        // Unmark all previous latest generations
        for (const gen of existingLatest) {
            await ctx.db.patch(gen._id, { isLatest: false });
        }

        // Server-side safety: Recursively strip large strings to ensure document fits 1MB limit.
        // This is a more aggressive safeguard than the previous targeted check.
        const recursivelyStripLargeStrings = (obj: any): any => {
            if (typeof obj === 'string') {
                // If it's a large string (over 50KB), likely a blob/image, strip it.
                if (obj.length > 50000) return null;
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map(recursivelyStripLargeStrings);
            }
            if (typeof obj === 'object' && obj !== null) {
                const newObj: any = {};
                for (const [key, value] of Object.entries(obj)) {
                    newObj[key] = recursivelyStripLargeStrings(value);
                }
                return newObj;
            }
            return obj;
        };

        let finalState = args.state;
        const stateStr = JSON.stringify(finalState);
        if (stateStr.length > 800000) { // 0.8MB threshold
            finalState = recursivelyStripLargeStrings(args.state);
        }

        // Insert the new generation and mark it as latest
        const newGenId = await ctx.db.insert("generations", {
            ...args,
            state: finalState,
            isLatest: true,
            created_at: new Date().toISOString(),
        });

        // "Solo quiero guarde 2 recientes": Keep only 2 most recent generations per brand.
        // This keeps the database clean and efficient.
        const allGens = await ctx.db
            .query("generations")
            .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
            .order("desc")
            .collect();

        if (allGens.length > 2) {
            const olderGens = allGens.slice(2);
            for (const gen of olderGens) {
                await ctx.db.delete(gen._id);
            }
        }

        return newGenId;
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

export const getLatestGeneration = query({
    args: { brand_id: v.id("brand_dna") },
    handler: async (ctx, args) => {
        const latest = await ctx.db
            .query("generations")
            .withIndex("by_brand_latest", (q) =>
                q.eq("brand_id", args.brand_id).eq("isLatest", true)
            )
            .first();

        return latest;
    },
});
