-- Fix RLS policy for contact_requests - change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Public can submit contact requests" ON public.contact_requests;

CREATE POLICY "Public can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
TO public
WITH CHECK (true);

-- Also fix the appointments table for public booking
DROP POLICY IF EXISTS "Public can book appointments" ON public.appointments;

CREATE POLICY "Public can book appointments"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);