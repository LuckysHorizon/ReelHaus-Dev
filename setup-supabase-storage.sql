-- Setup Supabase Storage Buckets for ReelHaus
-- Run this in your Supabase SQL Editor

-- =========================================
-- CREATE STORAGE BUCKETS
-- =========================================

-- Create event-media bucket (public, for event images/videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-media',
  'event-media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
);

-- Create exports bucket (private, for Excel exports)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exports',
  'exports',
  false,
  104857600, -- 100MB limit
  ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
);

-- Create qrs bucket (private, for QR codes)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'qrs',
  'qrs',
  false,
  1048576, -- 1MB limit
  ARRAY['image/png', 'image/svg+xml']
);

-- =========================================
-- STORAGE POLICIES
-- =========================================

-- Event media policies (public read, admin write)
CREATE POLICY "Public can view event media" ON storage.objects
FOR SELECT USING (bucket_id = 'event-media');

CREATE POLICY "Admins can upload event media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'event-media' AND auth.role() = 'service_role');

CREATE POLICY "Admins can update event media" ON storage.objects
FOR UPDATE USING (bucket_id = 'event-media' AND auth.role() = 'service_role');

CREATE POLICY "Admins can delete event media" ON storage.objects
FOR DELETE USING (bucket_id = 'event-media' AND auth.role() = 'service_role');

-- Exports policies (admin only)
CREATE POLICY "Admins can manage exports" ON storage.objects
FOR ALL USING (bucket_id = 'exports' AND auth.role() = 'service_role');

-- QR codes policies (admin only)
CREATE POLICY "Admins can manage QR codes" ON storage.objects
FOR ALL USING (bucket_id = 'qrs' AND auth.role() = 'service_role');

-- =========================================
-- TEST STORAGE SETUP
-- =========================================

-- Test if buckets were created successfully
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('event-media', 'exports', 'qrs');
