-- Drop restrictive INSERT policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Public can submit contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Public can book appointments" ON public.appointments;

-- Create PERMISSIVE policies for public form submissions
CREATE POLICY "Public can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can book appointments" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);