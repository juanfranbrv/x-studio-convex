import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveAsset = mutation({
    args: {
        brand_id: v.id("brands"),
        type: v.string(), // 'logo' | 'font' | 'image'
        storageId: v.string(),
        metadata: v.optional(v.any()), // JSON
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("brand_assets", {
            ...args,
            created_at: new Date().toISOString(),
        });
    },
});

export const getAssets = query({
    args: { brand_id: v.id("brands") },
    handler: async (ctx, args) => {
        const assets = await ctx.db
            .query("brand_assets")
            .withIndex("by_brand", (q) => q.eq("brand_id", args.brand_id))
            .collect();

        return await Promise.all(
            assets.map(async (asset) => ({
                ...asset,
                url: await ctx.storage.getUrl(asset.storageId),
            }))
        );
    },
});

export const getImageUrl = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const deleteAsset = mutation({
    args: { asset_id: v.id("brand_assets") },
    handler: async (ctx, args) => {
        const asset = await ctx.db.get(args.asset_id);
        if (!asset) return;

        await ctx.storage.delete(asset.storageId);
        await ctx.db.delete(args.asset_id);
    }
});
