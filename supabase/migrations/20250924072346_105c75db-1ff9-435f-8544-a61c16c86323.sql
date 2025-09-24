-- Harden function security by pinning search_path and keeping email privacy model intact

-- 1) Recreate functions with SET search_path = public to satisfy linter 0011
CREATE OR REPLACE FUNCTION public.get_google_calendar_settings()
RETURNS TABLE(
  id uuid,
  client_id text,
  client_secret text,
  calendar_id text,
  buffer_minutes integer,
  auto_sync boolean,
  working_hours_start time without time zone,
  working_hours_end time without time zone,
  working_days text[],
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.client_id,
    s.client_secret,
    s.calendar_id,
    s.buffer_minutes,
    s.auto_sync,
    s.working_hours_start,
    s.working_hours_end,
    s.working_days,
    s.is_active,
    s.created_at,
    s.updated_at
  FROM public.google_calendar_settings s
  WHERE s.is_active = true
  ORDER BY s.updated_at DESC
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.save_google_calendar_settings(
  p_client_id text,
  p_client_secret text,
  p_calendar_id text,
  p_buffer_minutes integer,
  p_auto_sync boolean,
  p_working_hours_start time without time zone,
  p_working_hours_end time without time zone,
  p_working_days text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Deactivate all existing settings
  UPDATE public.google_calendar_settings 
  SET is_active = false, updated_at = now()
  WHERE is_active = true;
  
  -- Insert new active settings
  INSERT INTO public.google_calendar_settings (
    client_id,
    client_secret,
    calendar_id,
    buffer_minutes,
    auto_sync,
    working_hours_start,
    working_hours_end,
    working_days,
    is_active
  ) VALUES (
    p_client_id,
    p_client_secret,
    p_calendar_id,
    p_buffer_minutes,
    p_auto_sync,
    p_working_hours_start,
    p_working_hours_end,
    p_working_days,
    true
  );
END;
$$;

-- 2) Ensure the public view remains available and safe (idempotent no-op if already set)
ALTER VIEW IF EXISTS public.public_customer_reviews SET (security_invoker = true);
GRANT SELECT ON TABLE public.public_customer_reviews TO anon;
GRANT SELECT ON TABLE public.public_customer_reviews TO authenticated;
