import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ADMIN_EMAILS = ["juanfranbrv@gmail.com"];
const isAdmin = (email: string) => ADMIN_EMAILS.includes((email || "").toLowerCase().trim());

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("style_presets")
      .withIndex("by_active_sort", (q) => q.eq("is_active", true))
      .collect();
  },
});

export const listAll = query({
  args: { admin_email: v.string() },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) throw new Error("Unauthorized");
    return await ctx.db
      .query("style_presets")
      .withIndex("by_sort_order")
      .collect();
  },
});

export const create = mutation({
  args: {
    admin_email: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    image_url: v.string(),
    analysis: v.any(),
    is_active: v.optional(v.boolean()),
    sort_order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) throw new Error("Unauthorized");
    const now = new Date().toISOString();
    const all = await ctx.db.query("style_presets").withIndex("by_sort_order").collect();
    const maxOrder = all.reduce((max, item) => Math.max(max, item.sort_order || 0), 0);
    return await ctx.db.insert("style_presets", {
      name: args.name.trim(),
      description: args.description?.trim() || undefined,
      image_url: args.image_url,
      analysis: args.analysis,
      is_active: args.is_active ?? true,
      sort_order: args.sort_order ?? (maxOrder + 1),
      created_at: now,
      updated_at: now,
      updated_by: args.admin_email,
    });
  },
});

export const update = mutation({
  args: {
    admin_email: v.string(),
    id: v.id("style_presets"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    image_url: v.optional(v.string()),
    analysis: v.optional(v.any()),
    is_active: v.optional(v.boolean()),
    sort_order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) throw new Error("Unauthorized");
    const preset = await ctx.db.get(args.id);
    if (!preset) throw new Error("Style preset not found");

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updated_by: args.admin_email,
    };
    if (typeof args.name === "string") patch.name = args.name.trim();
    if (args.description !== undefined) patch.description = args.description?.trim() || undefined;
    if (typeof args.image_url === "string") patch.image_url = args.image_url;
    if (args.analysis !== undefined) patch.analysis = args.analysis;
    if (typeof args.is_active === "boolean") patch.is_active = args.is_active;
    if (typeof args.sort_order === "number") patch.sort_order = args.sort_order;

    await ctx.db.patch(args.id, patch);
    return args.id;
  },
});

export const remove = mutation({
  args: {
    admin_email: v.string(),
    id: v.id("style_presets"),
  },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
