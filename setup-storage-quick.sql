-- Quick setup for Supabase Storage
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
