-- Add password field to smtp_settings table
ALTER TABLE public.smtp_settings 
ADD COLUMN IF NOT EXISTS password text;

-- Add comment explaining encryption should be handled at application level
COMMENT ON COLUMN public.smtp_settings.password IS 'SMTP password - should be encrypted at application level before storage';
