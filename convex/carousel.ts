import { v } from "convex/values";
import { query } from "./_generated/server";

export const listStructures = query({
    args: { includeInactive: v.optional(v.boolean()) },
    handler: async (ctx, args) => {
        const includeInactive = args.includeInactive ?? false;
        const rows = await ctx.db.query("carousel_structures")
            .order("asc")
            .collect();
        const filtered = includeInactive ? rows : rows.filter(r => r.isActive);
        return filtered.sort((a, b) => a.order - b.order);
    }
});

export const listCompositions = query({
    args: {
        structureId: v.optional(v.string()),
        includeInactive: v.optional(v.boolean()),
        includeGlobals: v.optional(v.boolean()),
        mode: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const includeInactive = args.includeInactive ?? false;
        const includeGlobals = args.includeGlobals ?? true;
        const structureId = args.structureId;
        const mode = args.mode?.trim();

        let rows = await ctx.db.query("carousel_compositions")
            .order("asc")
            .collect();

        if (!includeInactive) {
            rows = rows.filter(r => r.isActive);
        }

        if (mode) {
            rows = rows.filter(r => r.mode === mode);
        }

        if (structureId) {
            rows = rows.filter(r => r.scope === "global" ? includeGlobals : r.structure_id === structureId);
        } else if (!includeGlobals) {
            rows = rows.filter(r => r.scope !== "global");
        }

        return rows.sort((a, b) => a.order - b.order);
    }
});
