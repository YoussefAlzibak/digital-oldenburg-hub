-- Fix RLS policies: Explicitly set as PERMISSIVE

-- Drop and recreate contact_requests policies as PERMISSIVE
DROP POLICY IF EXISTS "Admins can delete contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can update contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can view contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Public can submit contact requests" ON public.contact_requests;

CREATE POLICY "Admins can delete contact requests" 
ON public.contact_requests AS PERMISSIVE
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update contact requests" 
ON public.contact_requests AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can view contact requests" 
ON public.contact_requests AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Public can submit contact requests" 
ON public.contact_requests AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Drop and recreate appointments policies as PERMISSIVE
DROP POLICY IF EXISTS "Admin can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin can delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public can book appointments" ON public.appointments;

CREATE POLICY "Admin can view appointments" 
ON public.appointments AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admin can update appointments" 
ON public.appointments AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete appointments" 
ON public.appointments AS PERMISSIVE
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Public can book appointments" 
ON public.appointments AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);