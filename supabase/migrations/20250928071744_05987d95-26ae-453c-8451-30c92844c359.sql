-- Remove client_secret column from google_calendar_settings table for security
ALTER TABLE public.google_calendar_settings DROP COLUMN IF EXISTS client_secret;

-- Update the get_google_calendar_settings function to exclude client_secret
DROP FUNCTION IF EXISTS public.get_google_calendar_settings();
CREATE OR REPLACE FUNCTION public.get_google_calendar_settings()
 RETURNS TABLE(
   id uuid, 
   client_id text, 
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
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.client_id,
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
$function$;

-- Update the save_google_calendar_settings function to exclude client_secret
DROP FUNCTION IF EXISTS public.save_google_calendar_settings(text, text, text, integer, boolean, time without time zone, time without time zone, text[]);
CREATE OR REPLACE FUNCTION public.save_google_calendar_settings(
  p_client_id text, 
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
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Deactivate all existing settings
  UPDATE public.google_calendar_settings 
  SET is_active = false, updated_at = now()
  WHERE is_active = true;
  
  -- Insert new active settings (without client_secret)
  INSERT INTO public.google_calendar_settings (
    client_id,
    calendar_id,
    buffer_minutes,
    auto_sync,
    working_hours_start,
    working_hours_end,
    working_days,
    is_active
  ) VALUES (
    p_client_id,
    p_calendar_id,
    p_buffer_minutes,
    p_auto_sync,
    p_working_hours_start,
    p_working_hours_end,
    p_working_days,
    true
  );
END;
$function$;