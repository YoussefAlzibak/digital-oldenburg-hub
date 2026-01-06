-- Drop existing policy and create better ones
DROP POLICY IF EXISTS "Admin can manage email subscribers" ON public.email_subscribers;

-- Create comprehensive policies for email subscribers
CREATE POLICY "Public can read email subscribers" 
ON public.email_subscribers 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert email subscribers" 
ON public.email_subscribers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update email subscribers" 
ON public.email_subscribers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete email subscribers" 
ON public.email_subscribers 
FOR DELETE 
USING (true);

-- Also ensure the table has the correct RLS setting
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;