-- Update SMTP settings from_name from 'Unicum Tech' to 'Unicum Tech'
UPDATE smtp_settings 
SET from_name = 'Unicum Tech', 
    updated_at = now() 
WHERE from_name = 'Unicum Tech';

-- Also update any default values if the setting uses default
UPDATE smtp_settings 
SET from_name = 'Unicum Tech', 
    updated_at = now() 
WHERE from_name IS NULL OR from_name = '';