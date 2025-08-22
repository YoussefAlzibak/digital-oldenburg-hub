-- Create table for Google Calendar settings
CREATE TABLE public.google_calendar_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  calendar_id TEXT NOT NULL DEFAULT 'primary',
  buffer_minutes INTEGER NOT NULL DEFAULT 15,
  auto_sync BOOLEAN NOT NULL DEFAULT true,
  working_hours_start TIME NOT NULL DEFAULT '09:00',
  working_hours_end TIME NOT NULL DEFAULT '17:00',
  working_days TEXT[] NOT NULL DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.google_calendar_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can manage Google Calendar settings" 
ON public.google_calendar_settings 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_google_calendar_settings_updated_at
BEFORE UPDATE ON public.google_calendar_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();