import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // App-wide configurable settings (editable via admin panel)
  app_settings: defineTable({
    key: v.string(),           // "beta_initial_credits", "low_credits_threshold", "credits_per_generation", "theme_primary", "theme_secondary"
    value: v.any(),            // number | string
    description: v.optional(v.string()),
    updated_at: v.string(),
    updated_by: v.optional(v.string()), // admin email
  }).index("by_key", ["key"]),

  // Beta access requests (waitlist)
  beta_requests: defineTable({
    email: v.string(),
    status: v.string(), // "pending" | "approved" | "rejected"
    created_at: v.string(),
    processed_at: v.optional(v.string()),
    processed_by: v.optional(v.string()), // admin email
  }).index("by_email", ["email"])
    .index("by_status", ["status"]),

  users: defineTable({
    clerk_id: v.string(),
    email: v.string(),
    current_brand_id: v.optional(v.string()),
    created_at: v.string(),
    // Credits system
    credits: v.number(),                      // Current balance
    status: v.string(),                       // "waitlist" | "active" | "suspended"
    role: v.string(),                         // "user" | "beta" | "admin"
    plan_id: v.optional(v.string()),          // null for beta, later "free" | "pro" | etc.
    credits_reset_at: v.optional(v.string()), // For future monthly plans
    // Onboarding
    onboarding_completed: v.optional(v.boolean()),
    onboarding_completed_at: v.optional(v.string()),
  }).index("by_clerk_id", ["clerk_id"]),

  // Credit transaction audit log
  credit_transactions: defineTable({
    user_id: v.id("users"),
    type: v.string(),           // "grant" | "consume" | "refund" | "purchase" | "monthly_reset" | "admin_adjust"
    amount: v.number(),         // Positive or negative
    balance_after: v.number(),
    metadata: v.optional(v.any()), // { action?, generation_id?, admin_id?, note? }
    created_at: v.string(),
  }).index("by_user", ["user_id"])
    .index("by_type", ["type"])
    .index("by_created", ["created_at"]),

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
    cta_url_enabled: v.optional(v.boolean()),
    brand_values: v.array(v.string()), // string[]
    tone_of_voice: v.array(v.string()), // string[]
    visual_aesthetic: v.array(v.string()), // string[]
    colors: v.any(), // Complex object with sources and scores
    fonts: v.array(v.any()), // Changed from string[] to object array { family, role? }
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
    preferred_language: v.optional(v.string()), // 'es' | 'en' | 'fr' | 'de' | 'pt' | 'it' | 'ca'
    api_trace: v.optional(v.any()), // Array of trace objects
    debug: v.optional(v.any()), // JSON
    clerk_user_id: v.optional(v.string()),
    updated_at: v.string(),
  }).index("by_url", ["url"])
    .index("by_url_user", ["url", "clerk_user_id"])
    .index("by_clerk_id", ["clerk_user_id"]),

  generations: defineTable({
    brand_id: v.id("brand_dna"),
    prompt_snapshot: v.any(), // JSON
    image_url: v.string(), // Could be external URL or Convex storage URL
    annotations: v.optional(v.any()), // JSON
    // Snapshot of GenerationState for "Recents" functionality
    state: v.any(), // Complete GenerationState snapshot
    isLatest: v.optional(v.boolean()), // Marks the most recent generation for this brand
    created_at: v.string(),
  }).index("by_brand", ["brand_id"])
    .index("by_brand_latest", ["brand_id", "isLatest"]),

  carousels: defineTable({
    brand_id: v.optional(v.id("brand_dna")),
    styleDNA: v.optional(v.any()),
    adapter: v.optional(v.any()),
    brandLock: v.any(),
    layoutSpec: v.any(),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
  }).index("by_brand", ["brand_id"]),

  slides: defineTable({
    carousel_id: v.id("carousels"),
    slide: v.number(),
    narrative_raw: v.optional(v.any()),
    narrative_sanitized: v.optional(v.any()),
    lint_report: v.optional(v.any()),
    compiled_prompt: v.optional(v.any()),
    status: v.optional(v.string()),
    errors: v.optional(v.any()),
    created_at: v.string(),
    updated_at: v.optional(v.string()),
  }).index("by_carousel", ["carousel_id"])
    .index("by_carousel_slide", ["carousel_id", "slide"]),

  presets: defineTable({
    userId: v.optional(v.string()), // clerk_id, optional for system presets
    brandId: v.optional(v.id("brand_dna")), // Scoped to a specific brand kit
    isSystem: v.boolean(),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    // Snapshot of GenerationState (complete state for full restoration)
    state: v.any(),
    usageCount: v.number(),
    lastUsed: v.optional(v.string()),
    created_at: v.string(),
  }).index("by_user", ["userId"])
    .index("by_brand", ["brandId"])
    .index("by_system", ["isSystem"]),

  // User feedback system
  feedback: defineTable({
    userId: v.string(),              // clerk_id
    userEmail: v.string(),           // for admin view
    rating: v.string(),              // "negative" | "neutral" | "positive"
    comment: v.optional(v.string()), // optional text feedback
    context: v.object({              // generation context
      generationId: v.optional(v.id("generations")),
      brandId: v.optional(v.id("brand_dna")),
      intent: v.optional(v.string()),
      layout: v.optional(v.string()),
    }),
    created_at: v.string(),
  }).index("by_user", ["userId"])
    .index("by_rating", ["rating"])
    .index("by_created", ["created_at"]),
});
