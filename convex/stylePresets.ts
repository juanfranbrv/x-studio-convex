import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

const ADMIN_EMAILS = ["juanfranbrv@gmail.com"];
const isAdmin = (email: string) => ADMIN_EMAILS.includes((email || "").toLowerCase().trim());
const MAX_ACTIVE_PRESETS = 16;
const MAX_ADMIN_PRESETS = 24;
const MAX_INLINE_IMAGE_DATA_URL_CHARS = 240_000;

function compactImageUrl(url: unknown): string {
  const value = typeof url === "string" ? url : "";
  if (!value) return "";
  if (!value.startsWith("data:")) return value;
  // Evita enviar blobs base64 gigantes al cliente en un unico query payload.
  if (value.length > MAX_INLINE_IMAGE_DATA_URL_CHARS) return "";
  return value;
}

function ensureValidImageUrl(url: unknown): string {
  const value = typeof url === "string" ? url.trim() : "";
  if (!value) throw new Error("La imagen del estilo es obligatoria.");
  if (value.startsWith("data:")) {
    throw new Error("No se admite data URL en image_url. Sube la imagen optimizada (WebP) y guarda la URL.");
  }
  return value;
}

function compactAnalysis(analysis: unknown) {
  const source = (analysis && typeof analysis === "object")
    ? (analysis as Record<string, unknown>)
    : {};

  const keywords = Array.isArray(source.keywords)
    ? source.keywords
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .slice(0, 8)
        .map((item) => item.slice(0, 500))
    : [];

  const colorPalette = Array.isArray(source.colorPalette)
    ? source.colorPalette
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .slice(0, 12)
        .map((item) => item.slice(0, 24))
    : [];

  const subject = (source.subject && typeof source.subject === "string") ? source.subject : "unknown";
  const subjectLabel = typeof source.subjectLabel === "string" ? source.subjectLabel.slice(0, 120) : "N/A";
  const lighting = typeof source.lighting === "string" ? source.lighting : "unknown";
  const confidence = typeof source.confidence === "number" ? source.confidence : 0;

  return {
    subject,
    subjectLabel,
    lighting,
    colorPalette,
    keywords,
    confidence,
  };
}

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("style_presets")
      .withIndex("by_active_sort", (q) => q.eq("is_active", true))
      .take(MAX_ACTIVE_PRESETS);

    return rows.map((row) => ({
      _id: row._id,
      name: row.name,
      description: row.description,
      image_url: compactImageUrl(row.image_url),
      analysis: compactAnalysis(row.analysis),
      is_active: row.is_active,
      sort_order: row.sort_order,
      updated_at: row.updated_at,
    }));
  },
});

export const listActivePaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("style_presets")
      .withIndex("by_active_sort", (q) => q.eq("is_active", true))
      .order("asc")
      .paginate(args.paginationOpts);

    return {
      ...page,
      page: page.page.map((row) => ({
        _id: row._id,
        name: row.name,
        description: row.description,
        image_url: compactImageUrl(row.image_url),
        analysis: compactAnalysis(row.analysis),
        is_active: row.is_active,
        sort_order: row.sort_order,
        updated_at: row.updated_at,
      })),
    };
  },
});

export const listAll = query({
  args: { admin_email: v.string() },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) throw new Error("Unauthorized");
    const rows = await ctx.db
      .query("style_presets")
      .withIndex("by_sort_order")
      .take(MAX_ADMIN_PRESETS);

    return rows.map((row) => ({
      _id: row._id,
      name: row.name,
      description: row.description,
      image_url: compactImageUrl(row.image_url),
      analysis: compactAnalysis(row.analysis),
      is_active: row.is_active,
      sort_order: row.sort_order,
      created_at: row.created_at,
      updated_at: row.updated_at,
      updated_by: row.updated_by,
    }));
  },
});

export const listAllPaginated = query({
  args: {
    admin_email: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) throw new Error("Unauthorized");
    const page = await ctx.db
      .query("style_presets")
      .withIndex("by_sort_order")
      .order("asc")
      .paginate(args.paginationOpts);

    return {
      ...page,
      page: page.page.map((row) => ({
        _id: row._id,
        name: row.name,
        description: row.description,
        image_url: compactImageUrl(row.image_url),
        analysis: compactAnalysis(row.analysis),
        is_active: row.is_active,
        sort_order: row.sort_order,
        created_at: row.created_at,
        updated_at: row.updated_at,
        updated_by: row.updated_by,
      })),
    };
  },
});

export const getRawImageByIdForAdmin = query({
  args: {
    admin_email: v.string(),
    id: v.id("style_presets"),
  },
  handler: async (ctx, args) => {
    if (!isAdmin(args.admin_email)) throw new Error("Unauthorized");
    const preset = await ctx.db.get(args.id);
    if (!preset) throw new Error("Style preset not found");
    return {
      _id: preset._id,
      name: preset.name,
      image_url: preset.image_url,
    };
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
      image_url: ensureValidImageUrl(args.image_url),
      analysis: compactAnalysis(args.analysis),
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
    if (typeof args.image_url === "string") patch.image_url = ensureValidImageUrl(args.image_url);
    if (args.analysis !== undefined) patch.analysis = compactAnalysis(args.analysis);
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

