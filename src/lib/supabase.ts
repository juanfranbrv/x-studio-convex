import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service-role Supabase client (for admin operations within server actions)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : supabase // Fallback to anon (will fail admin ops, but prevents crash if env missing)

// Type definitions for our database
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface BrandDNA {
    colors: string[]
    tone: 'professional' | 'casual' | 'bold' | 'elegant' | 'playful'
    fonts: {
        heading: string | null
        body: string | null
    }
}

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    clerk_id: string
                    email: string
                    current_brand_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    clerk_id: string
                    email: string
                    current_brand_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    clerk_id?: string
                    email?: string
                    current_brand_id?: string | null
                    created_at?: string
                }
            }
            brands: {
                Row: {
                    id: string
                    owner_id: string
                    name: string
                    website_url: string | null
                    brand_dna: BrandDNA
                    created_at: string
                }
                Insert: {
                    id?: string
                    owner_id: string
                    name: string
                    website_url?: string | null
                    brand_dna?: BrandDNA
                    created_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string
                    name?: string
                    website_url?: string | null
                    brand_dna?: BrandDNA
                    created_at?: string
                }
            }
            brand_assets: {
                Row: {
                    id: string
                    brand_id: string
                    type: 'logo' | 'font' | 'image'
                    storage_path: string
                    metadata: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    brand_id: string
                    type: 'logo' | 'font' | 'image'
                    storage_path: string
                    metadata?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    brand_id?: string
                    type?: 'logo' | 'font' | 'image'
                    storage_path?: string
                    metadata?: Json | null
                    created_at?: string
                }
            }
            generations: {
                Row: {
                    id: string
                    brand_id: string
                    prompt_snapshot: Json
                    image_url: string
                    annotations: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    brand_id: string
                    prompt_snapshot: Json
                    image_url: string
                    annotations?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    brand_id?: string
                    prompt_snapshot?: Json
                    image_url?: string
                    annotations?: Json | null
                    created_at?: string
                }
            }
        }
    }
}
