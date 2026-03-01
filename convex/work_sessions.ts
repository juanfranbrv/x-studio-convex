import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MODULES = new Set(["image", "carousel"]);

function ensureModule(module: string): "image" | "carousel" {
  const normalized = module.trim().toLowerCase();
  if (!MODULES.has(normalized)) throw new Error("Unsupported module");
  return normalized as "image" | "carousel";
}

function normalizePrompt(prompt?: string) {
  const clean = (prompt || "").trim();
  return clean.length > 0 ? clean : undefined;
}

function recursivelyStripLargeStrings(value: unknown, fieldName?: string): unknown {
  if (typeof value === "string") {
    if (value.startsWith("data:")) return null;
    // Preserve URLs exactly; truncating them breaks image recovery in session history.
    if (value.startsWith("http://") || value.startsWith("https://")) return value;

    const promptLikeField = new Set([
      "prompt",
      "prompt_used",
      "promptValue",
      "editPrompt",
      "rawMessage",
      "additionalInstructions",
      "headline",
      "cta",
      "caption",
      "rootPrompt",
    ]);

    if (promptLikeField.has(fieldName || "") && value.length > 6000) {
      return `${value.slice(0, 6000)}…`;
    }

    if (value.length > 20000) return `${value.slice(0, 20000)}…`;
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => recursivelyStripLargeStrings(item, fieldName));
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      next[k] = recursivelyStripLargeStrings(v, k);
    }
    return next;
  }
  return value;
}

function compactSessionGenerations(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const snapshot = { ...(value as Record<string, unknown>) };
  const raw = snapshot.sessionGenerations;
  if (!Array.isArray(raw)) return snapshot;

  snapshot.sessionGenerations = raw.map((item) => {
    if (!item || typeof item !== "object") return item;
    const row = item as Record<string, unknown>;
    return {
      id: row.id,
      image_url: row.image_url,
      image_storage_id: row.image_storage_id,
      created_at: row.created_at,
      prompt_used: typeof row.prompt_used === "string" ? row.prompt_used.slice(0, 1800) : row.prompt_used,
      error_title: row.error_title,
      error_fallback: row.error_fallback,
      request_payload: undefined,
    };
  });
  return snapshot;
}

function sanitizeSnapshot(snapshot: unknown): unknown {
  if (!snapshot) return snapshot;
  let next = recursivelyStripLargeStrings(snapshot);
  let size = JSON.stringify(next).length;

  if (size > 900_000) {
    next = compactSessionGenerations(next);
    size = JSON.stringify(next).length;
  }

  if (size > 900_000 && next && typeof next === "object") {
    const trimmed = { ...(next as Record<string, unknown>) };
    delete trimmed.selectedContext;
    next = trimmed;
    size = JSON.stringify(next).length;
  }

  if (size > 900_000 && next && typeof next === "object") {
    const trimmed = { ...(next as Record<string, unknown>) };
    delete trimmed.editPrompt;
    delete trimmed.promptValue;
    next = trimmed;
  }

  return next;
}

async function resolveSnapshotImageUrls(
  ctx: { storage: { getUrl: (storageId: string) => Promise<string | null> } },
  snapshot: unknown,
): Promise<unknown> {
  if (!snapshot || typeof snapshot !== "object") return snapshot;
  const next = { ...(snapshot as Record<string, unknown>) };
  const generationRows = Array.isArray(next.sessionGenerations) ? next.sessionGenerations : [];
  if (generationRows.length) {
    const resolvedGenerations = await Promise.all(
      generationRows.map(async (row) => {
        if (!row || typeof row !== "object") return row;
        const item = { ...(row as Record<string, unknown>) };
        const storageId = typeof item.image_storage_id === "string" ? item.image_storage_id.trim() : "";
        if (storageId) {
          const url = await ctx.storage.getUrl(storageId);
          if (url) item.image_url = url;
        }
        return item;
      }),
    );
    next.sessionGenerations = resolvedGenerations;
  }

  const previewState = next.previewState;
  if (previewState && typeof previewState === "object") {
    const previewNext = { ...(previewState as Record<string, unknown>) };
    const previewSlides = Array.isArray(previewNext.slides) ? previewNext.slides : [];
    if (previewSlides.length) {
      const resolvedSlides = await Promise.all(
        previewSlides.map(async (row) => {
          if (!row || typeof row !== "object") return row;
          const item = { ...(row as Record<string, unknown>) };
          const storageId = typeof item.image_storage_id === "string" ? item.image_storage_id.trim() : "";
          if (storageId) {
            const url = await ctx.storage.getUrl(storageId);
            if (url) item.imageUrl = url;
          }
          return item;
        }),
      );
      previewNext.slides = resolvedSlides;
      next.previewState = previewNext;
    }
  }

  return next;
}

export const getActiveSession = query({
  args: {
    user_id: v.string(),
    module: v.string(),
    brand_id: v.optional(v.id("brand_dna")),
  },
  handler: async (ctx, args) => {
    const moduleKey = ensureModule(args.module);
    const rows = args.brand_id
      ? await ctx.db
          .query("work_sessions")
          .withIndex("by_user_brand_module", (q) =>
            q.eq("user_id", args.user_id).eq("brand_id", args.brand_id).eq("module", moduleKey),
          )
          .collect()
      : await ctx.db
          .query("work_sessions")
          .withIndex("by_user_module", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
          .collect();

    const active = rows.filter((row) => row.active).sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
    const fallbackLatest = rows.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
    const selected = active || fallbackLatest;

    if (!selected) return null;
    const snapshot = await resolveSnapshotImageUrls(ctx, selected.snapshot);
    return {
      ...selected,
      snapshot,
    };
  },
});

export const listSessions = query({
  args: {
    user_id: v.string(),
    module: v.string(),
    brand_id: v.optional(v.id("brand_dna")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const moduleKey = ensureModule(args.module);
    const rows = args.brand_id
      ? await ctx.db
          .query("work_sessions")
          .withIndex("by_user_brand_module", (q) =>
            q.eq("user_id", args.user_id).eq("brand_id", args.brand_id).eq("module", moduleKey),
          )
          .collect()
      : await ctx.db
          .query("work_sessions")
          .withIndex("by_user_module_updated", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
          .order("desc")
          .take(Math.max(1, Math.min(args.limit ?? 30, 200)));

    return rows
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, Math.max(1, Math.min(args.limit ?? 30, 200)))
      .map((row) => {
        const snapshot = row.snapshot as { generatedImage?: unknown } | undefined;
        return {
          _id: row._id,
          module: row.module,
          brand_id: row.brand_id,
          title: row.title || "",
          root_prompt: row.root_prompt || "",
          active: row.active,
          created_at: row.created_at,
          updated_at: row.updated_at,
          preview_image_url: typeof snapshot?.generatedImage === "string" ? snapshot.generatedImage : undefined,
        };
      });
  },
});

export const createSession = mutation({
  args: {
    user_id: v.string(),
    module: v.string(),
    brand_id: v.optional(v.id("brand_dna")),
    title: v.optional(v.string()),
    root_prompt: v.optional(v.string()),
    snapshot: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const moduleKey = ensureModule(args.module);
    const now = new Date().toISOString();
    const rows = args.brand_id
      ? await ctx.db
          .query("work_sessions")
          .withIndex("by_user_brand_module", (q) =>
            q.eq("user_id", args.user_id).eq("brand_id", args.brand_id).eq("module", moduleKey),
          )
          .collect()
      : await ctx.db
          .query("work_sessions")
          .withIndex("by_user_module", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
          .collect();

    for (const row of rows) {
      if (!row.active) continue;
      await ctx.db.patch(row._id, { active: false, updated_at: now });
    }

    const id = await ctx.db.insert("work_sessions", {
      user_id: args.user_id,
      module: moduleKey,
      brand_id: args.brand_id,
      title: args.title?.trim() || undefined,
      root_prompt: normalizePrompt(args.root_prompt),
      snapshot: sanitizeSnapshot(args.snapshot),
      active: true,
      created_at: now,
      updated_at: now,
    });

    return { session_id: id };
  },
});

export const upsertActiveSession = mutation({
  args: {
    user_id: v.string(),
    module: v.string(),
    brand_id: v.optional(v.id("brand_dna")),
    session_id: v.optional(v.id("work_sessions")),
    title: v.optional(v.string()),
    root_prompt: v.optional(v.string()),
    snapshot: v.any(),
  },
  handler: async (ctx, args) => {
    const moduleKey = ensureModule(args.module);
    const now = new Date().toISOString();

    if (args.session_id) {
      const existing = await ctx.db.get(args.session_id);
      if (!existing || existing.user_id !== args.user_id) throw new Error("Session not found");

      const rows = await ctx.db
        .query("work_sessions")
        .withIndex("by_user_module", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
        .collect();
      for (const row of rows) {
        if (!row.active) continue;
        if (args.brand_id && row.brand_id !== args.brand_id) continue;
        if (!args.brand_id && row.brand_id !== undefined) continue;
        if (row._id === args.session_id) continue;
        await ctx.db.patch(row._id, { active: false, updated_at: now });
      }

      await ctx.db.patch(args.session_id, {
        title: args.title?.trim() || existing.title,
        root_prompt: normalizePrompt(args.root_prompt) || existing.root_prompt,
        snapshot: sanitizeSnapshot(args.snapshot),
        active: true,
        updated_at: now,
      });
      return { session_id: args.session_id };
    }

    const rows = args.brand_id
      ? await ctx.db
          .query("work_sessions")
          .withIndex("by_user_brand_module", (q) =>
            q.eq("user_id", args.user_id).eq("brand_id", args.brand_id).eq("module", moduleKey),
          )
          .collect()
      : await ctx.db
          .query("work_sessions")
          .withIndex("by_user_module", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
          .collect();

    const current = rows
      .filter((row) => row.active)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];

    if (current) {
      await ctx.db.patch(current._id, {
        title: args.title?.trim() || current.title,
        root_prompt: normalizePrompt(args.root_prompt) || current.root_prompt,
        snapshot: sanitizeSnapshot(args.snapshot),
        active: true,
        updated_at: now,
      });
      return { session_id: current._id };
    }

    const created = await ctx.db.insert("work_sessions", {
      user_id: args.user_id,
      module: moduleKey,
      brand_id: args.brand_id,
      title: args.title?.trim() || undefined,
      root_prompt: normalizePrompt(args.root_prompt),
      snapshot: sanitizeSnapshot(args.snapshot),
      active: true,
      created_at: now,
      updated_at: now,
    });

    return { session_id: created };
  },
});

export const activateSession = mutation({
  args: {
    user_id: v.string(),
    session_id: v.id("work_sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.session_id);
    if (!session || session.user_id !== args.user_id) throw new Error("Session not found");

    const moduleKey = ensureModule(session.module);
    const now = new Date().toISOString();

    const rows = await ctx.db
      .query("work_sessions")
      .withIndex("by_user_module", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
      .collect();

    for (const row of rows) {
      if (!row.active) continue;
      if (row.brand_id !== session.brand_id) continue;
      if (row._id === session._id) continue;
      await ctx.db.patch(row._id, { active: false, updated_at: now });
    }

    await ctx.db.patch(session._id, { active: true, updated_at: now });
    const refreshed = await ctx.db.get(session._id);
    if (!refreshed) return null;
    const snapshot = await resolveSnapshotImageUrls(ctx, refreshed.snapshot);
    return {
      ...refreshed,
      snapshot,
    };
  },
});

export const deleteSession = mutation({
  args: {
    user_id: v.string(),
    session_id: v.id("work_sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.session_id);
    if (!session || session.user_id !== args.user_id) throw new Error("Session not found");

    const moduleKey = ensureModule(session.module);
    const brandId = session.brand_id;

    await ctx.db.delete(args.session_id);

    const remaining = await ctx.db
      .query("work_sessions")
      .withIndex("by_user_module_updated", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
      .order("desc")
      .take(200);

    const sameScope = remaining.filter((row) => row.brand_id === brandId);
    if (!sameScope.length) {
      return { deleted: true, next_session_id: null as string | null };
    }

    const nextActive = sameScope[0];
    const now = new Date().toISOString();
    for (const row of sameScope) {
      await ctx.db.patch(row._id, { active: row._id === nextActive._id, updated_at: now });
    }

    return { deleted: true, next_session_id: String(nextActive._id) };
  },
});

export const clearSessions = mutation({
  args: {
    user_id: v.string(),
    module: v.string(),
    brand_id: v.optional(v.id("brand_dna")),
  },
  handler: async (ctx, args) => {
    const moduleKey = ensureModule(args.module);
    const rows = await ctx.db
      .query("work_sessions")
      .withIndex("by_user_module", (q) => q.eq("user_id", args.user_id).eq("module", moduleKey))
      .collect();

    const targets = rows.filter((row) => row.brand_id === args.brand_id);
    for (const row of targets) {
      await ctx.db.delete(row._id);
    }

    return { deleted: targets.length };
  },
});
