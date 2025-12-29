import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    args: { clerk_id: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
            .first();
    },
});

export const upsertUser = mutation({
    args: {
        clerk_id: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { email: args.email });
            return existing._id;
        }

        return await ctx.db.insert("users", {
            clerk_id: args.clerk_id,
            email: args.email,
            created_at: new Date().toISOString(),
        });
    },
});
