-- Remove password field from smtp_settings table for security
-- The password will now be stored securely in Supabase secrets

ALTER TABLE public.smtp_settings DROP COLUMN IF EXISTS password;

-- Add a comment to document the security improvement
COMMENT ON TABLE public.smtp_settings IS 'SMTP configuration settings. Passwords are stored securely in Supabase secrets for enhanced security.';