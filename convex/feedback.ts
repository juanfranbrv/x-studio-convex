'use server'

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit user feedback
export const submitFeedback = mutation({
    args: {
        userId: v.string(),
        userEmail: v.string(),
        rating: v.string(), // "negative" | "neutral" | "positive"
        comment: v.optional(v.string()),
        context: v.object({
            generationId: v.optional(v.id("generations")),
            brandId: v.optional(v.id("brand_dna")),
            intent: v.optional(v.string()),
            layout: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("feedback", {
            userId: args.userId,
            userEmail: args.userEmail,
            rating: args.rating,
            comment: args.comment,
            context: args.context,
            created_at: new Date().toISOString(),
        });
        return id;
    },
});

// List feedback for admin panel (with pagination)
export const listFeedback = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        const feedback = await ctx.db
            .query("feedback")
            .order("desc")
            .take(limit);
        return feedback;
    },
});

// Get feedback statistics
export const getFeedbackStats = query({
    args: {},
    handler: async (ctx) => {
        const allFeedback = await ctx.db.query("feedback").collect();

        const stats = {
            total: allFeedback.length,
            positive: allFeedback.filter(f => f.rating === "positive").length,
            neutral: allFeedback.filter(f => f.rating === "neutral").length,
            negative: allFeedback.filter(f => f.rating === "negative").length,
        };

        return stats;
    },
});
