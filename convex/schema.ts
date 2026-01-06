import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerk_id: v.string(),
    email: v.string(),
    current_brand_id: v.optional(v.string()), // Can be converted to v.id("brands") later if we want strict relations
    created_at: v.string(),
  }).index("by_clerk_id", ["clerk_id"]),

  brands: defineTable({
    owner_id: v.string(), // clerk_id
    name: v.string(),
    website_url: v.optional(v.string()),
    brand_dna: v.object({
      colors: v.array(v.string()),
      tone: v.string(), // 'professional' | 'casual' | ... (keeping string for flexibility)
      fonts: v.object({
        heading: v.optional(v.string()), // string | null -> optional string
        body: v.optional(v.string()),
      }),
      visual_aesthetic: v.optional(v.string()), // from migration fix
      debug: v.optional(v.any()), // JSONB
    }),
    created_at: v.string(),
  }).index("by_owner", ["owner_id"]),

  brand_assets: defineTable({
    brand_id: v.id("brands"), // Using Convex ID for relation
    type: v.string(), // 'logo' | 'font' | 'image'
    storageId: v.string(), // Replaces storage_path. This will be the Convex Storage ID
    metadata: v.optional(v.any()), // JSON
    created_at: v.string(),
  }).index("by_brand", ["brand_id"]),

  // Cache/Store for Brand DNA Analysis (from analyze-brand-dna.ts)
  brand_dna: defineTable({
    url: v.string(),
    brand_name: v.string(),
    tagline: v.string(),
    business_overview: v.string(),
    brand_values: v.array(v.string()), // string[]
    tone_of_voice: v.array(v.string()), // string[]
    visual_aesthetic: v.array(v.string()), // string[]
    colors: v.any(), // Complex object with sources and scores
    fonts: v.array(v.string()),
    text_assets: v.optional(v.any()), // JSON
    logo_url: v.optional(v.string()),
    logos: v.optional(v.any()), // Array of logo objects
    favicon_url: v.optional(v.string()),
    screenshot_url: v.optional(v.string()),
    images: v.optional(v.any()), // Array of objects
    target_audience: v.optional(v.array(v.string())),
    social_links: v.optional(v.any()), // Array of platform/url objects
    emails: v.optional(v.array(v.string())),
    phones: v.optional(v.array(v.string())),
    addresses: v.optional(v.array(v.string())),
    api_trace: v.optional(v.any()), // Array of trace objects
    debug: v.optional(v.any()), // JSON
    clerk_user_id: v.optional(v.string()),
    updated_at: v.string(),
  }).index("by_url", ["url"])
    .index("by_clerk_id", ["clerk_user_id"]),

  generations: defineTable({
    brand_id: v.id("brands"),
    prompt_snapshot: v.any(), // JSON
    image_url: v.string(), // Could be external URL or Convex storage URL
    annotations: v.optional(v.any()), // JSON
    created_at: v.string(),
  }).index("by_brand", ["brand_id"]),

  presets: defineTable({
    userId: v.optional(v.string()), // clerk_id, optional for system presets
    isSystem: v.boolean(),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    // Snapshot of GenerationState
    state: v.object({
      platform: v.string(), // e.g. 'instagram'
      format: v.string(), // e.g. 'story', 'post'
      intent: v.string(), // e.g. 'sales', 'quote'
      layout: v.optional(v.string()), // e.g. 'impact-offer'
      styles: v.optional(v.array(v.string())), // e.g. ['minimalist', 'bold']
      customTexts: v.optional(v.any()), // Pre-filled text fields
    }),
    usageCount: v.number(),
    lastUsed: v.optional(v.string()),
    created_at: v.string(),
  }).index("by_user", ["userId"])
    .index("by_system", ["isSystem"]),
});
