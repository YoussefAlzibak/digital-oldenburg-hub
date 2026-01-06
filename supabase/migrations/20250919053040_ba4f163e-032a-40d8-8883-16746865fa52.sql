-- Fix critical security vulnerability: Remove public access to email_subscribers table
-- and implement proper admin-only access with limited public subscription capability

-- First, drop all existing public policies on email_subscribers
DROP POLICY IF EXISTS "Public can read email subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Public can insert email subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Public can update email subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Public can delete email subscribers" ON public.email_subscribers;

-- Create secure admin-only policies for subscriber management
CREATE POLICY "Admins can view all subscribers" 
ON public.email_subscribers 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert subscribers" 
ON public.email_subscribers 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update subscribers" 
ON public.email_subscribers 
FOR UPDATE 
USING (is_admin(auth.uid())) 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete subscribers" 
ON public.email_subscribers 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Allow public newsletter subscriptions (insert only, no read access to existing data)
CREATE POLICY "Public can subscribe to newsletter" 
ON public.email_subscribers 
FOR INSERT 
WITH CHECK (
  -- Only allow basic subscription data, no admin fields
  status = 'active' 
  AND source IS NOT NULL
  AND email IS NOT NULL
);