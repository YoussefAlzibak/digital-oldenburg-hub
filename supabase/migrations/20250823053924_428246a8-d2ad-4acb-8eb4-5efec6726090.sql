-- Create function to get Google Calendar settings
CREATE OR REPLACE FUNCTION public.get_google_calendar_settings()
RETURNS TABLE (
  id UUID,
  client_id TEXT,
  client_secret TEXT,
  calendar_id TEXT,
  buffer_minutes INTEGER,
  auto_sync BOOLEAN,
  working_hours_start TIME,
  working_hours_end TIME,
  working_days TEXT[],
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql SECURITY DEFINER
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

-- Create function to save Google Calendar settings
CREATE OR REPLACE FUNCTION public.save_google_calendar_settings(
  p_client_id TEXT,
  p_client_secret TEXT,
  p_calendar_id TEXT,
  p_buffer_minutes INTEGER,
  p_auto_sync BOOLEAN,
  p_working_hours_start TIME,
  p_working_hours_end TIME,
  p_working_days TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
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