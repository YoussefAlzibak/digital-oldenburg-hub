-- Secure customer emails while preserving public review submissions
BEGIN;

-- 1) Allow customer_reviews.customer_email to be nulled by trigger
ALTER TABLE public.customer_reviews 
  ALTER COLUMN customer_email DROP NOT NULL;

-- 2) Private table to store customer emails separate from public-writable table
CREATE TABLE IF NOT EXISTS public.customer_review_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES public.customer_reviews(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Enable RLS and restrict to admins only
ALTER TABLE public.customer_review_emails ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'customer_review_emails' AND policyname = 'Admin can manage review emails'
  ) THEN
    CREATE POLICY "Admin can manage review emails"
    ON public.customer_review_emails
    FOR ALL
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));
  END IF;
END $$;

-- 4) SECURITY DEFINER function to move email out of public table and redact it
CREATE OR REPLACE FUNCTION public.move_review_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.customer_email IS NOT NULL THEN
    -- Save email privately
    INSERT INTO public.customer_review_emails (review_id, customer_email)
    VALUES (NEW.id, NEW.customer_email);

    -- Redact email from the public-writable table
    UPDATE public.customer_reviews
    SET customer_email = NULL
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- 5) Trigger after insert
DROP TRIGGER IF EXISTS trg_move_review_email ON public.customer_reviews;
CREATE TRIGGER trg_move_review_email
AFTER INSERT ON public.customer_reviews
FOR EACH ROW
EXECUTE FUNCTION public.move_review_email();

-- 6) One-time backfill: move existing emails then redact
INSERT INTO public.customer_review_emails (review_id, customer_email)
SELECT id, customer_email
FROM public.customer_reviews
WHERE customer_email IS NOT NULL;

UPDATE public.customer_reviews
SET customer_email = NULL
WHERE customer_email IS NOT NULL;

COMMIT;