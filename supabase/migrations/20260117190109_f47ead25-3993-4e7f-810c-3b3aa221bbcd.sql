-- Rate Limiting Tabelle für Spam-Schutz
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Index für schnelle Lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON public.rate_limits(key);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);

-- RLS aktivieren - nur System kann lesen/schreiben
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Service Role kann alles (für Edge Functions)
CREATE POLICY "Service role full access" ON public.rate_limits
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Alte Einträge automatisch löschen (Cleanup Funktion)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - interval '1 hour';
END;
$$;

-- Funktion zum Prüfen des Rate Limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_max_requests integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_window_start timestamp with time zone;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Zähle Anfragen im Zeitfenster
  SELECT COALESCE(SUM(count), 0) INTO v_count
  FROM public.rate_limits
  WHERE key = p_key AND window_start > v_window_start;
  
  -- Wenn Limit überschritten, false zurückgeben
  IF v_count >= p_max_requests THEN
    RETURN false;
  END IF;
  
  -- Neue Anfrage einfügen
  INSERT INTO public.rate_limits (key, count, window_start)
  VALUES (p_key, 1, now());
  
  RETURN true;
END;
$$;