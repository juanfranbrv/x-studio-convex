import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getBrands = query({
    args: { owner_id: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("brands")
            .withIndex("by_owner", (q) => q.eq("owner_id", args.owner_id))
            .collect();
    },
});

export const getBrandById = query({
    args: { brand_id: v.id("brands") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.brand_id);
    },
});

export const createBrand = mutation({
    args: {
        owner_id: v.string(),
        name: v.string(),
        website_url: v.optional(v.string()),
        brand_dna: v.object({
            colors: v.array(v.string()),
            tone: v.string(),
            fonts: v.object({
                heading: v.optional(v.string()),
                body: v.optional(v.string()),
            }),
            visual_aesthetic: v.optional(v.string()),
            debug: v.optional(v.any()),
        }),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("brands", {
            ...args,
            created_at: new Date().toISOString(),
        });
    },
});

export const updateBrandDNA = mutation({
    args: {
        brand_id: v.id("brands"),
        brand_dna: v.object({
            colors: v.array(v.string()),
            tone: v.string(),
            fonts: v.object({
                heading: v.optional(v.string()),
                body: v.optional(v.string()),
            }),
            visual_aesthetic: v.optional(v.string()),
            debug: v.optional(v.any()),
        }),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.brand_id, {
            brand_dna: args.brand_dna,
        });
    },
});

export const getBrandDNA = query({
    args: { url: v.string(), clerk_user_id: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerk_user_id) {
            return null;
        }

        return await ctx.db
            .query("brand_dna")
            .withIndex("by_url_user", (q) => q.eq("url", args.url).eq("clerk_user_id", args.clerk_user_id))
            .first();
    },
});

export const upsertBrandDNA = mutation({
    args: {
        url: v.string(),
        brand_name: v.string(),
        tagline: v.string(),
        business_overview: v.string(),
        brand_values: v.array(v.string()),
        tone_of_voice: v.array(v.string()),
        visual_aesthetic: v.array(v.string()),
        colors: v.any(),
        fonts: v.array(v.any()),
        text_assets: v.optional(v.any()),
        logo_url: v.optional(v.string()),
        logos: v.optional(v.any()), // array of logo objects
        favicon_url: v.optional(v.string()),
        screenshot_url: v.optional(v.string()),
        images: v.optional(v.any()),
        target_audience: v.optional(v.array(v.string())),
        social_links: v.optional(v.any()),
        emails: v.optional(v.array(v.string())),
        phones: v.optional(v.array(v.string())),
        addresses: v.optional(v.array(v.string())),
        preferred_language: v.optional(v.string()),
        api_trace: v.optional(v.any()),
        debug: v.optional(v.any()),
        clerk_user_id: v.string(),
        updated_at: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("brand_dna")
            .withIndex("by_url_user", (q) => q.eq("url", args.url).eq("clerk_user_id", args.clerk_user_id))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        } else {
            return await ctx.db.insert("brand_dna", args);
        }
    },
});

export const getBrandDNAByClerkId = query({
    args: { clerk_user_id: v.string() },
    handler: async (ctx, args) => {
        const brands = await ctx.db
            .query("brand_dna")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", args.clerk_user_id))
            .order("desc")
            .collect();

        return await Promise.all(
            brands.map(async (brand) => {
                // Resolve top-level URLs - detect raw IDs or bad /_storage/ URLs
                const needsResolve = (url: string) => !url.startsWith("http") || url.includes("/_storage/");
                const extractId = (url: string) => url.includes("/_storage/") ? url.split("/_storage/").pop()! : url;

                // Debug helper
                const resolveWithLog = async (fieldName: string, url: string | undefined) => {
                    if (!url) return url;
                    if (!needsResolve(url)) return url;
                    const id = extractId(url);
                    const resolved = await ctx.storage.getUrl(id as any);
                    console.log(`[getBrandDNAByClerkId] ${fieldName}: id=${id}, resolved=${resolved !== null}`);
                    return resolved || url;
                };

                const logo_url = await resolveWithLog("logo_url", brand.logo_url);
                const screenshot_url = await resolveWithLog("screenshot_url", brand.screenshot_url);
                const favicon_url = await resolveWithLog("favicon_url", brand.favicon_url);

                // Resolve URLs in images array (logos field doesn't exist in schema)
                const images = brand.images ? await Promise.all(brand.images.map(async (image: any) => {
                    if (typeof image === 'string') {
                        return needsResolve(image) ? (await ctx.storage.getUrl(extractId(image) as any)) || image : image;
                    } else if (image && image.url) {
                        const url = needsResolve(image.url) ? (await ctx.storage.getUrl(extractId(image.url) as any)) || image.url : image.url;
                        return { ...image, url };
                    }
                    return image;
                })) : brand.images;

                return {
                    ...brand,
                    logo_url,
                    screenshot_url,
                    favicon_url,
                    images,
                };
            })
        );
    },
});

export const getBrandDNAById = query({
    args: { id: v.id("brand_dna"), clerk_user_id: v.string() },
    handler: async (ctx, args) => {
        const brand = await ctx.db.get(args.id);
        if (!brand) return null;
        if (brand.clerk_user_id !== args.clerk_user_id) return null;

        // URL resolution helpers (same as getBrandDNAByClerkId)
        const needsResolve = (url: string) => !url.startsWith("http") || url.includes("/_storage/");
        const extractId = (url: string) => url.includes("/_storage/") ? url.split("/_storage/").pop()! : url;

        const resolveUrl = async (url: string | undefined) => {
            if (!url) return url;
            if (!needsResolve(url)) return url;
            const id = extractId(url);
            return (await ctx.storage.getUrl(id as any)) || url;
        };

        const logo_url = await resolveUrl(brand.logo_url);
        const screenshot_url = await resolveUrl(brand.screenshot_url);
        const favicon_url = await resolveUrl(brand.favicon_url);

        // Resolve URLs in images array
        const images = brand.images ? await Promise.all(brand.images.map(async (image: any) => {
            if (typeof image === 'string') {
                return needsResolve(image) ? (await ctx.storage.getUrl(extractId(image) as any)) || image : image;
            } else if (image && image.url) {
                const url = needsResolve(image.url) ? (await ctx.storage.getUrl(extractId(image.url) as any)) || image.url : image.url;
                return { ...image, url };
            }
            return image;
        })) : brand.images;

        return {
            ...brand,
            logo_url,
            screenshot_url,
            favicon_url,
            images,
        };
    },
});

export const updateBrandDNADoc = mutation({
    args: {
        id: v.id("brand_dna"),
        clerk_user_id: v.string(),
        updates: v.object({
            brand_name: v.optional(v.string()),
            tagline: v.optional(v.string()),
            business_overview: v.optional(v.string()),
            brand_values: v.optional(v.array(v.string())),
            tone_of_voice: v.optional(v.array(v.string())),
            visual_aesthetic: v.optional(v.array(v.string())),
            colors: v.optional(v.any()), // array ok
            fonts: v.optional(v.array(v.any())),
            logo_url: v.optional(v.string()),
            logos: v.optional(v.any()), // array of objects
            favicon_url: v.optional(v.string()),
            screenshot_url: v.optional(v.string()),
            images: v.optional(v.any()), // array of objects
            target_audience: v.optional(v.array(v.string())),
            social_links: v.optional(v.any()),
            emails: v.optional(v.array(v.string())),
            phones: v.optional(v.array(v.string())),
            addresses: v.optional(v.array(v.string())),
            preferred_language: v.optional(v.string()),
            api_trace: v.optional(v.any()),
            text_assets: v.optional(v.any()),
            updated_at: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id);
        if (!existing) throw new Error("Brand kit not found");
        if (existing.clerk_user_id !== args.clerk_user_id) throw new Error("Unauthorized");
        await ctx.db.patch(args.id, args.updates);
    },
});

export const deleteBrandDNA = mutation({
    args: { id: v.id("brand_dna"), clerk_user_id: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id);
        if (!existing) throw new Error("Brand kit not found");
        if (existing.clerk_user_id !== args.clerk_user_id) throw new Error("Unauthorized");
        await ctx.db.delete(args.id);
    },
});

export const createEmptyBrandKit = mutation({
    args: {
        clerk_user_id: v.string(),
        brand_name: v.string(),
        source_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // Create a minimal brand_dna record with empty defaults
        const brandId = await ctx.db.insert("brand_dna", {
            url: args.source_url || `manual-${Date.now()}`,
            brand_name: args.brand_name,
            tagline: "",
            business_overview: "",
            brand_values: [],
            tone_of_voice: [],
            visual_aesthetic: [],
            colors: [],
            fonts: [],
            text_assets: [],
            clerk_user_id: args.clerk_user_id,
            updated_at: now,
        });

        return brandId;
    },
});

export const cloneBrandDNAToUser = mutation({
    args: {
        source_id: v.id("brand_dna"),
        target_clerk_user_id: v.string(),
    },
    handler: async (ctx, args) => {
        const source = await ctx.db.get(args.source_id);
        if (!source) throw new Error("Source brand kit not found");

        const { _id, _creationTime, ...data } = source as any;
        const now = new Date().toISOString();

        return await ctx.db.insert("brand_dna", {
            ...data,
            clerk_user_id: args.target_clerk_user_id,
            updated_at: now,
        });
    },
});
