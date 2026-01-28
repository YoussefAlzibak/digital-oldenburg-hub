-- Fix RLS policies: Change from RESTRICTIVE to PERMISSIVE

-- Drop existing RESTRICTIVE policies on contact_requests
DROP POLICY IF EXISTS "Admins can delete contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can update contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can view contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Public can submit contact requests" ON public.contact_requests;

-- Create PERMISSIVE policies for contact_requests
CREATE POLICY "Admins can delete contact requests" 
ON public.contact_requests 
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update contact requests" 
ON public.contact_requests 
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can view contact requests" 
ON public.contact_requests 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Public can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Drop existing RESTRICTIVE policies on appointments
DROP POLICY IF EXISTS "Admin can manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public can book appointments" ON public.appointments;

-- Create PERMISSIVE policies for appointments
CREATE POLICY "Admin can view appointments" 
ON public.appointments 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admin can update appointments" 
ON public.appointments 
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete appointments" 
ON public.appointments 
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Public can book appointments" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);