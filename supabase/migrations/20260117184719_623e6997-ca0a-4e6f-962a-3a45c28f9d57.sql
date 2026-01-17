-- WICHTIG: Entferne die unsichere Policy die direkten Zugriff auf die Basistabelle erlaubt
DROP POLICY IF EXISTS "Public can view approved public reviews" ON public.customer_reviews;

-- Die bestehende "Admin can manage all reviews" Policy bleibt für Admins erhalten
-- Öffentliche User müssen die public_customer_reviews View verwenden, die keine E-Mail-Adressen enthält
-- Da die View mit security_invoker erstellt wurde und die Basistabelle nur Admin-Zugriff hat,
-- brauchen wir eine separate Lösung

-- Erstelle eine RLS Policy die SELECT für ALLE Nutzer erlaubt aber NUR für genehmigte öffentliche Reviews
-- Diese Policy gibt die E-Mail-Adresse NICHT zurück, da die App die View verwendet
CREATE POLICY "Allow select for approved public reviews via view"
ON public.customer_reviews
FOR SELECT
TO anon, authenticated
USING (is_approved = true AND is_public = true);