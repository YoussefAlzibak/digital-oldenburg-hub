-- Update SMTP settings from_name from 'Digital Masters' to 'Unicum Tech'
UPDATE smtp_settings 
SET from_name = 'Unicum Tech', 
    updated_at = now() 
WHERE from_name = 'Digital Masters';

-- Also update any default values if the setting uses default
UPDATE smtp_settings 
SET from_name = 'Unicum Tech', 
    updated_at = now() 
WHERE from_name IS NULL OR from_name = '';