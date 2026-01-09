import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper: get a setting value with fallback
async function getSetting(ctx: any, key: string, fallback: number): Promise<number> {
    const setting = await ctx.db
        .query("app_settings")
        .withIndex("by_key", (q: any) => q.eq("key", key))
        .first();
    return setting?.value ?? fallback;
}

export const getUser = query({
    args: { clerk_id: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
            .first();
    },
});

// Query: get user's credit balance and status
export const getCredits = query({
    args: { clerk_id: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
            .first();

        if (!user) return null;

        const lowThreshold = await getSetting(ctx, "low_credits_threshold", 10);

        return {
            credits: user.credits,
            isLow: user.credits < lowThreshold,
            status: user.status,
            role: user.role,
        };
    },
});

// Mutation: consume credits when generating
export const consumeCredits = mutation({
    args: {
        clerk_id: v.string(),
        amount: v.optional(v.number()), // If not provided, uses credits_per_generation setting
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
            .first();

        if (!user) throw new Error("User not found");
        if (user.status !== "active") throw new Error("User not active");

        const creditsToConsume = args.amount ?? await getSetting(ctx, "credits_per_generation", 1);

        if (user.credits < creditsToConsume) throw new Error("Insufficient credits");

        const newBalance = user.credits - creditsToConsume;
        const lowThreshold = await getSetting(ctx, "low_credits_threshold", 10);

        await ctx.db.patch(user._id, { credits: newBalance });

        await ctx.db.insert("credit_transactions", {
            user_id: user._id,
            type: "consume",
            amount: -creditsToConsume,
            balance_after: newBalance,
            metadata: args.metadata,
            created_at: new Date().toISOString(),
        });

        return { success: true, newBalance, isLow: newBalance < lowThreshold };
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

        // Check if email is approved in beta_requests
        const emailLower = args.email.toLowerCase().trim();
        const betaRequest = await ctx.db
            .query("beta_requests")
            .withIndex("by_email", (q) => q.eq("email", emailLower))
            .first();

        // Check if admin email
        const ADMIN_EMAILS = ["juanfranbrv@gmail.com"];
        const isAdmin = ADMIN_EMAILS.includes(emailLower);

        if (betaRequest?.status === "approved" || isAdmin) {
            // Approved user - create with active status and initial credits
            const initialCredits = await getSetting(ctx, "beta_initial_credits", 100);

            const userId = await ctx.db.insert("users", {
                clerk_id: args.clerk_id,
                email: args.email,
                created_at: new Date().toISOString(),
                credits: initialCredits,
                status: "active",
                role: isAdmin ? "admin" : "beta",
            });

            // Record the credit grant
            await ctx.db.insert("credit_transactions", {
                user_id: userId,
                type: "grant",
                amount: initialCredits,
                balance_after: initialCredits,
                metadata: { reason: "Beta activation on first login" },
                created_at: new Date().toISOString(),
            });

            return userId;
        }

        // Not approved - don't create user, throw error
        throw new Error("No tienes acceso a la beta. Solicita acceso en la página principal.");
    },
});
