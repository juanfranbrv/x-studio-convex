/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ADMIN_EMAILS = ["juanfranbrv@gmail.com"];
const STRIPE_INTERNAL_SECRET = process.env.STRIPE_INTERNAL_SECRET || "";

function isAdmin(email: string) {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

function assertStripeAccess(accessKey: string) {
  if (!STRIPE_INTERNAL_SECRET || accessKey !== STRIPE_INTERNAL_SECRET) {
    throw new Error("Unauthorized");
  }
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function normalizeReferralCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function getNumberSetting(ctx: any, key: string, fallback: number) {
  const setting = await ctx.db
    .query("app_settings")
    .withIndex("by_key", (q: any) => q.eq("key", key))
    .first();

  return typeof setting?.value === "number" ? setting.value : fallback;
}

function buildReferralBase(email: string) {
  const localPart = normalizeEmail(email).split("@")[0] || "studio";
  const sanitized = localPart.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return (sanitized || "STUDIO").slice(0, 6);
}

async function createUniqueReferralCode(ctx: any, email: string) {
  const base = buildReferralBase(email);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const suffix = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "X");
    const code = `${base}${suffix}`.slice(0, 10);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q: any) => q.eq("referral_code", code))
      .first();

    if (!existing) {
      return code;
    }
  }

  throw new Error("Could not allocate referral code");
}

async function ensureUserReferralCode(ctx: any, user: any) {
  if (user.referral_code) {
    return user.referral_code;
  }

  const code = await createUniqueReferralCode(ctx, user.email);
  await ctx.db.patch(user._id, { referral_code: code });
  return code;
}

export const ensureReferralProfile = mutation({
  args: {
    clerk_id: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const referralCode = await ensureUserReferralCode(ctx, { ...user, email });

    return {
      referralCode,
      userId: user._id,
    };
  },
});

export const claimReferralSecure = mutation({
  args: {
    access_key: v.string(),
    clerk_id: v.string(),
    email: v.string(),
    referral_code: v.string(),
  },
  handler: async (ctx, args) => {
    assertStripeAccess(args.access_key);

    const email = normalizeEmail(args.email);
    const referralCode = normalizeReferralCode(args.referral_code);
    if (!referralCode) {
      return { status: "invalid_code", clearStoredCode: true };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ensureUserReferralCode(ctx, user);

    const referrer = await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q) => q.eq("referral_code", referralCode))
      .first();

    if (!referrer) {
      return { status: "invalid_code", clearStoredCode: true };
    }

    if (referrer._id === user._id || referrer.clerk_id === user.clerk_id || normalizeEmail(referrer.email) === email) {
      return { status: "self_referral", clearStoredCode: true };
    }

    if (user.referred_by_user_id) {
      if (user.referred_by_user_id === referrer._id) {
        return { status: "already_applied", clearStoredCode: true };
      }
      return { status: "already_referred", clearStoredCode: true };
    }

    const existingReferral = await ctx.db
      .query("referrals")
      .withIndex("by_referred_user_id", (q) => q.eq("referred_user_id", user._id))
      .first();

    if (existingReferral) {
      return { status: "already_applied", clearStoredCode: true };
    }

    const signupReward = await getNumberSetting(ctx, "referral_signup_reward_credits", 5);
    const referrerBalance = (referrer.credits || 0) + signupReward;
    const timestamp = new Date().toISOString();

    await ctx.db.patch(user._id, {
      referred_by_user_id: referrer._id,
      referred_by_code: referralCode,
      referral_attributed_at: timestamp,
    });

    const referralId = await ctx.db.insert("referrals", {
      referrer_user_id: referrer._id,
      referred_user_id: user._id,
      referral_code: referralCode,
      signup_reward_credits: signupReward,
      signup_reward_granted_at: timestamp,
      total_purchase_reward_credits: 0,
      created_at: timestamp,
      updated_at: timestamp,
    });

    await ctx.db.patch(referrer._id, {
      credits: referrerBalance,
    });

    await ctx.db.insert("credit_transactions", {
      user_id: referrer._id,
      type: "referral_signup_bonus",
      amount: signupReward,
      balance_after: referrerBalance,
      metadata: {
        referral_id: referralId,
        referred_user_id: user._id,
        referred_email: email,
      },
      created_at: timestamp,
    });

    await ctx.db.insert("referral_rewards", {
      referral_id: referralId,
      referrer_user_id: referrer._id,
      referred_user_id: user._id,
      reward_type: "signup",
      credits_awarded: signupReward,
      status: "granted",
      metadata: {
        referred_email: email,
      },
      created_at: timestamp,
      updated_at: timestamp,
    });

    return {
      status: "applied",
      clearStoredCode: true,
      referralCode,
      signupReward,
      referrerUserId: referrer._id,
    };
  },
});

export const getMyReferralOverview = query({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .first();

    if (!user) {
      return null;
    }

    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrer_user_id_and_created_at", (q) => q.eq("referrer_user_id", user._id))
      .collect();

    const rewards = await ctx.db
      .query("referral_rewards")
      .withIndex("by_referrer_user_id", (q) => q.eq("referrer_user_id", user._id))
      .collect();

    const recentReferrals = await Promise.all(
      referrals
        .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
        .slice(0, 10)
        .map(async (referral: any) => {
          const referredUser = (await ctx.db.get(referral.referred_user_id)) as { email?: string } | null;
          return {
            _id: referral._id,
            created_at: referral.created_at,
            signup_reward_credits: referral.signup_reward_credits ?? 0,
            total_purchase_reward_credits: referral.total_purchase_reward_credits ?? 0,
            referred_email: referredUser?.email ?? "",
          };
        })
    );

    const totals = rewards.reduce(
      (acc: { signup: number; purchase: number }, reward: any) => {
        if (reward.status !== "granted") return acc;
        if (reward.reward_type === "signup") acc.signup += reward.credits_awarded;
        if (reward.reward_type === "purchase") acc.purchase += reward.credits_awarded;
        return acc;
      },
      { signup: 0, purchase: 0 }
    );

    const purchaseRewardPercentage = await getNumberSetting(ctx, "referral_purchase_reward_percentage", 50);
    const signupRewardCredits = await getNumberSetting(ctx, "referral_signup_reward_credits", 5);

    return {
      referralCode: user.referral_code ?? null,
      referredByCode: user.referred_by_code ?? null,
      stats: {
        totalReferrals: referrals.length,
        signupCredits: totals.signup,
        purchaseCredits: totals.purchase,
        totalCreditsEarned: totals.signup + totals.purchase,
      },
      config: {
        signupRewardCredits,
        purchaseRewardPercentage,
      },
      recentReferrals,
    };
  },
});

export const getAdminReferralSummary = query({
  args: {
    admin_email: v.string(),
  },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) {
      throw new Error("Unauthorized");
    }

    const [referrals, rewards] = await Promise.all([
      ctx.db.query("referrals").collect(),
      ctx.db.query("referral_rewards").collect(),
    ]);

    const signupRewardCredits = await getNumberSetting(ctx, "referral_signup_reward_credits", 5);
    const purchaseRewardPercentage = await getNumberSetting(ctx, "referral_purchase_reward_percentage", 50);

    const recentRewards = await Promise.all(
      rewards
        .filter((reward: any) => reward.status === "granted")
        .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
        .slice(0, 12)
        .map(async (reward: any) => {
          const [referrer, referred] = await Promise.all([
            ctx.db.get(reward.referrer_user_id),
            ctx.db.get(reward.referred_user_id),
          ]);

          return {
            _id: reward._id,
            reward_type: reward.reward_type,
            credits_awarded: reward.credits_awarded,
            created_at: reward.created_at,
            referrer_email: (referrer as { email?: string } | null)?.email ?? "",
            referred_email: (referred as { email?: string } | null)?.email ?? "",
          };
        })
    );

    const grantedRewards = rewards.filter((reward: any) => reward.status === "granted");

    return {
      config: {
        signupRewardCredits,
        purchaseRewardPercentage,
      },
      stats: {
        totalReferrals: referrals.length,
        activeReferrers: new Set(referrals.map((referral: any) => String(referral.referrer_user_id))).size,
        signupCreditsAwarded: grantedRewards
          .filter((reward: any) => reward.reward_type === "signup")
          .reduce((sum: number, reward: any) => sum + reward.credits_awarded, 0),
        purchaseCreditsAwarded: grantedRewards
          .filter((reward: any) => reward.reward_type === "purchase")
          .reduce((sum: number, reward: any) => sum + reward.credits_awarded, 0),
      },
      recentRewards,
    };
  },
});
