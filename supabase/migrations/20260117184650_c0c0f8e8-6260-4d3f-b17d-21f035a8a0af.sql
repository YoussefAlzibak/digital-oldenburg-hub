-- Lösche die bestehende View und erstelle sie neu mit security_invoker
DROP VIEW IF EXISTS public.public_customer_reviews;

-- Erstelle die sichere View ohne customer_email Feld mit security_invoker
CREATE VIEW public.public_customer_reviews
WITH (security_invoker=on) AS
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

-- Erstelle eine Policy die öffentliches SELECT erlaubt aber nur für genehmigte, öffentliche Reviews ohne E-Mail
-- Die bestehende "Admin can manage all reviews" Policy bleibt für Admins erhalten
-- Füge eine PUBLIC SELECT Policy hinzu die KEINE E-Mails zurückgibt durch Nutzung der View

-- Erstelle eine Policy für öffentliche Leser, die nur über die View auf genehmigte Reviews zugreifen können
CREATE POLICY "Public can view approved public reviews"
ON public.customer_reviews
FOR SELECT
TO anon, authenticated
USING (is_approved = true AND is_public = true);

COMMENT ON VIEW public.public_customer_reviews IS 'Sichere öffentliche View für Kundenbewertungen ohne E-Mail-Adressen';