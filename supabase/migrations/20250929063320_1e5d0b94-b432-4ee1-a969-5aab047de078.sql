-- Fix security issue: Strengthen contact_requests table RLS policies
-- Remove existing policies and recreate with explicit admin-only access

-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admin can view all contact requests" ON public.contact_requests;

-- Create new comprehensive policies

-- Allow public submissions (contact form)
CREATE POLICY "Public can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
TO public
WITH CHECK (true);

-- Only authenticated admin users can view contact requests
CREATE POLICY "Admins can view contact requests" 
ON public.contact_requests 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

-- Only authenticated admin users can update contact request status
CREATE POLICY "Admins can update contact requests" 
ON public.contact_requests 
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Only authenticated admin users can delete contact requests
CREATE POLICY "Admins can delete contact requests" 
ON public.contact_requests 
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));

-- Ensure table has RLS enabled (should already be enabled)
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;