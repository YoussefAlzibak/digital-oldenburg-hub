
-- Fix 1: Update automation to use correct trigger type (contact_form is what the code expects)
UPDATE email_automations 
SET trigger_type = 'contact_form' 
WHERE name = 'Bewertungsanfrage nach Kontakt' AND trigger_type = 'contact_request';

-- Fix 2: Normalize send_email action type to just 'email' for consistency
UPDATE workflow_actions 
SET action_type = 'email' 
WHERE action_type = 'send_email';
