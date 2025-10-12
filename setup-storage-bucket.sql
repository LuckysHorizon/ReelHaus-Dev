-- Setup Supabase Storage for Event Media
-- Run this in your Supabase SQL Editor

-- Create the event-media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-media', 
  'event-media', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for event-media bucket
-- Public read access
CREATE POLICY "Public read access for event media" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-media');

-- Admin write access (service role)
CREATE POLICY "Admin write access for event media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-media' AND auth.role() = 'service_role');

CREATE POLICY "Admin update access for event media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-media' AND auth.role() = 'service_role');

CREATE POLICY "Admin delete access for event media" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-media' AND auth.role() = 'service_role');

-- Create exports bucket for Excel files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exports', 
  'exports', 
  false, 
  10485760, -- 10MB limit
  ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
) ON CONFLICT (id) DO NOTHING;

-- Admin only access for exports
CREATE POLICY "Admin full access for exports" ON storage.objects
  FOR ALL TO service_role USING (bucket_id = 'exports') WITH CHECK (bucket_id = 'exports');

-- Create qrs bucket for QR codes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'qrs', 
  'qrs', 
  true, 
  1048576, -- 1MB limit
  ARRAY['image/png', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Public read access for QRs
CREATE POLICY "Public read access for QRs" ON storage.objects
  FOR SELECT USING (bucket_id = 'qrs');

-- Admin write access for QRs
CREATE POLICY "Admin write access for QRs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'qrs' AND auth.role() = 'service_role');

CREATE POLICY "Admin update access for QRs" ON storage.objects
  FOR UPDATE USING (bucket_id = 'qrs' AND auth.role() = 'service_role');

CREATE POLICY "Admin delete access for QRs" ON storage.objects
  FOR DELETE USING (bucket_id = 'qrs' AND auth.role() = 'service_role');
