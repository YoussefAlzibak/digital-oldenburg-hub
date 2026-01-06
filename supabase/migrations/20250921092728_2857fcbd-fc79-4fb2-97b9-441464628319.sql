-- Fix security vulnerability: Remove customer email addresses from public view
-- Create a secure view for public access to reviews without sensitive information

-- Create a view for public review access that excludes email addresses
CREATE OR REPLACE VIEW public.public_customer_reviews AS
SELECT 
  id,
  customer_name,
  company,
  service_type,
  rating,
  review_text,
  review_date,
  is_featured,
  is_approved,
  is_public,
  created_at,
  updated_at
FROM public.customer_reviews
WHERE is_approved = true AND is_public = true;

-- Enable RLS on the view
ALTER VIEW public.public_customer_reviews SET (security_invoker = true);

-- Grant public access to the view
GRANT SELECT ON public.public_customer_reviews TO anon;
GRANT SELECT ON public.public_customer_reviews TO authenticated;

-- Update the existing public policy to be more restrictive - remove public SELECT entirely
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.customer_reviews;

-- Keep admin access and public insert (for form submissions) 
-- But remove public SELECT access to the main table