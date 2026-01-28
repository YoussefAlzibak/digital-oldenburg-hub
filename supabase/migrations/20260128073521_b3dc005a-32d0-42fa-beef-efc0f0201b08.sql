-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Public can submit contact requests" ON public.contact_requests;

-- Create a new PERMISSIVE INSERT policy for public access
CREATE POLICY "Public can submit contact requests"
ON public.contact_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);