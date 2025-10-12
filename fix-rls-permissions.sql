-- Fix RLS Permissions for ReelHaus Admin API
-- Run this in your Supabase SQL Editor

-- =========================================
-- STEP 1: Grant permissions to service role
-- =========================================

-- Grant full access to service role for all tables
GRANT ALL ON public.events TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.registrations TO service_role;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.audit_log TO service_role;
GRANT ALL ON public.exports TO service_role;

-- =========================================
-- STEP 2: Update RLS policies for service role
-- =========================================

-- Drop existing policies that might be blocking service role
DROP POLICY IF EXISTS "Public can view active events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can manage registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage exports" ON public.exports;
DROP POLICY IF EXISTS "Admins can manage audit log" ON public.audit_log;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;

-- Create new policies that allow service role full access
CREATE POLICY "Service role full access to events"
  ON public.events FOR ALL USING (true);

CREATE POLICY "Service role full access to profiles"
  ON public.profiles FOR ALL USING (true);

CREATE POLICY "Service role full access to registrations"
  ON public.registrations FOR ALL USING (true);

CREATE POLICY "Service role full access to payments"
  ON public.payments FOR ALL USING (true);

CREATE POLICY "Service role full access to audit_log"
  ON public.audit_log FOR ALL USING (true);

CREATE POLICY "Service role full access to exports"
  ON public.exports FOR ALL USING (true);

-- =========================================
-- STEP 3: Allow public access to active events (for frontend)
-- =========================================

-- Allow public to view active events (for the main website)
CREATE POLICY "Public can view active events"
  ON public.events FOR SELECT USING (is_active = true);

-- =========================================
-- STEP 4: Test the connection
-- =========================================

-- Test if we can now access the events table
SELECT COUNT(*) as event_count FROM public.events;
