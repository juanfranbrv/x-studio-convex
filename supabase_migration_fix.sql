-- Migration to fix Brand DNA schema and Storage Buckets

-- 1. Rename column if exists, to match code expectation (brand_aesthetic -> visual_aesthetic)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='brand_dna' AND column_name='brand_aesthetic') THEN
        ALTER TABLE brand_dna RENAME COLUMN brand_aesthetic TO visual_aesthetic;
    END IF;
END $$;

-- 2. Add 'debug' column if missing (used for storing screenshot_url fallback etc)
ALTER TABLE brand_dna ADD COLUMN IF NOT EXISTS debug JSONB;

-- 3. Create 'brand-assets' Storage Bucket (Main bucket for all brand files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
    ('brand-assets', 'brand-assets', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon'])
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 4. Create RLS Policies for 'brand-assets'
DO $$
BEGIN
    -- Public Read
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Read Brand Assets') THEN
        CREATE POLICY "Public Read Brand Assets" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');
    END IF;
    
    -- Authenticated Upload
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Auth Upload Brand Assets') THEN
        CREATE POLICY "Auth Upload Brand Assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');
    END IF;

    -- Authenticated Update/Delete (Optional but good for management)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Auth Update Brand Assets') THEN
        CREATE POLICY "Auth Update Brand Assets" ON storage.objects FOR UPDATE USING (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');
    END IF;
END $$;
