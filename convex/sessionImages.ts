import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByUserHash = query({
  args: {
    user_id: v.string(),
    source_hash: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("session_images")
      .withIndex("by_user_hash", (q) => q.eq("user_id", args.user_id).eq("source_hash", args.source_hash))
      .first();
  },
});

export const getByUserOriginalStorage = query({
  args: {
    user_id: v.string(),
    original_storage_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("session_images")
      .withIndex("by_user_original_storage", (q) =>
        q.eq("user_id", args.user_id).eq("original_storage_id", args.original_storage_id),
      )
      .first();
  },
});

export const upsert = mutation({
  args: {
    user_id: v.string(),
    source_hash: v.string(),
    original_storage_id: v.string(),
    original_url: v.string(),
    preview_storage_id: v.string(),
    preview_url: v.string(),
    mime_type: v.optional(v.string()),
    size_bytes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("session_images")
      .withIndex("by_user_hash", (q) => q.eq("user_id", args.user_id).eq("source_hash", args.source_hash))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        original_storage_id: args.original_storage_id,
        original_url: args.original_url,
        preview_storage_id: args.preview_storage_id,
        preview_url: args.preview_url,
        mime_type: args.mime_type,
        size_bytes: args.size_bytes,
        last_used_at: now,
      });
      return {
        ...existing,
        original_storage_id: args.original_storage_id,
        original_url: args.original_url,
        preview_storage_id: args.preview_storage_id,
        preview_url: args.preview_url,
        mime_type: args.mime_type,
        size_bytes: args.size_bytes,
        last_used_at: now,
      };
    }

    const id = await ctx.db.insert("session_images", {
      user_id: args.user_id,
      source_hash: args.source_hash,
      original_storage_id: args.original_storage_id,
      original_url: args.original_url,
      preview_storage_id: args.preview_storage_id,
      preview_url: args.preview_url,
      mime_type: args.mime_type,
      size_bytes: args.size_bytes,
      created_at: now,
      last_used_at: now,
    });

    const row = await ctx.db.get(id);
    return row;
  },
});

export const touch = mutation({
  args: {
    id: v.id("session_images"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { last_used_at: new Date().toISOString() });
    return { success: true };
  },
});

