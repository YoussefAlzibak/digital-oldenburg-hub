-- Create SMTP configuration table for self-hosted email
CREATE TABLE public.smtp_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host text NOT NULL,
  port integer NOT NULL DEFAULT 587,
  username text NOT NULL,
  password text NOT NULL,
  secure boolean NOT NULL DEFAULT true,
  from_email text NOT NULL,
  from_name text NOT NULL DEFAULT 'Unicum Tech',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Admin can manage SMTP settings
CREATE POLICY "Admin can manage SMTP settings" 
ON public.smtp_settings 
FOR ALL 
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_smtp_settings_updated_at
BEFORE UPDATE ON public.smtp_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();