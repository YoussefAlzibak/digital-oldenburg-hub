-- 1. Insert Review Request Email Template
INSERT INTO public.email_templates (name, subject, html_content, text_content, template_type, is_active)
VALUES (
  'Bewertungsanfrage',
  'Wie war Ihre Erfahrung mit Unicum Tech? ⭐',
  '<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
<tr><td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;">
<h1 style="color: #ffffff; margin: 0; font-size: 28px;">⭐ Ihre Meinung zählt!</h1>
</td></tr>
<tr><td style="padding: 40px;">
<p style="color: #4a5568; line-height: 1.7; font-size: 16px;">Hallo {{name}},</p>
<p style="color: #4a5568; line-height: 1.7; font-size: 16px;">
vielen Dank, dass Sie sich an uns gewandt haben! Wir hoffen, dass wir Ihnen weiterhelfen konnten.
</p>
<p style="color: #4a5568; line-height: 1.7; font-size: 16px;">
Ihre Meinung ist uns sehr wichtig. Würden Sie sich einen Moment Zeit nehmen, um uns Ihre Erfahrung mitzuteilen?
</p>
<div style="text-align: center; margin: 30px 0;">
<a href="{{review_url}}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">⭐ Jetzt bewerten</a>
</div>
<p style="color: #4a5568; line-height: 1.7; font-size: 16px;">
Ihre Bewertung hilft uns, unseren Service kontinuierlich zu verbessern und anderen Kunden bei ihrer Entscheidung.
</p>
<p style="color: #1e3a5f; margin-top: 30px; font-size: 16px;">
Herzlichen Dank!<br>
<strong>Das Unicum Tech Team</strong>
</p>
</td></tr>
<tr><td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
<p style="margin: 0 0 10px 0; font-size: 14px; color: #a0c4e8;">
<a href="{{website_url}}" style="color: #a0c4e8; text-decoration: none;">Website</a> | 
<a href="tel:+4917066668089" style="color: #a0c4e8; text-decoration: none;">0170 6666809</a>
</p>
<p style="margin: 0; font-size: 11px; color: #6b8eb8;">© {{current_year}} Unicum Tech. Alle Rechte vorbehalten.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>',
  'Hallo {{name}}, vielen Dank für Ihre Anfrage bei Unicum Tech! Wir würden uns freuen, wenn Sie uns eine kurze Bewertung hinterlassen: {{review_url}} - Herzlichen Dank, Das Unicum Tech Team',
  'automation',
  true
);

-- 2. Create Automation for Review Request after Contact (3 days delay)
INSERT INTO public.email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'Bewertungsanfrage nach Kontakt',
  'Sendet 3 Tage nach Kontaktanfrage eine E-Mail mit Bitte um Bewertung',
  'contact_request',
  '{"delay_days": 3}'::jsonb,
  true
)
RETURNING id;

-- 3. Create the workflow action with 3-day delay and email
-- First get the automation id and template id
DO $$
DECLARE
  v_automation_id uuid;
  v_template_id uuid;
BEGIN
  -- Get the automation we just created
  SELECT id INTO v_automation_id FROM public.email_automations 
  WHERE name = 'Bewertungsanfrage nach Kontakt' 
  ORDER BY created_at DESC LIMIT 1;
  
  -- Get the review template
  SELECT id INTO v_template_id FROM public.email_templates 
  WHERE name = 'Bewertungsanfrage' LIMIT 1;
  
  -- Create delay action (3 days = 4320 minutes)
  INSERT INTO public.workflow_actions (
    automation_id, 
    step_number, 
    action_type, 
    delay_minutes,
    action_config,
    is_active
  ) VALUES (
    v_automation_id,
    1,
    'delay',
    4320,
    '{"delay_days": 3, "description": "3 Tage warten nach Kontaktanfrage"}'::jsonb,
    true
  );
  
  -- Create email action
  INSERT INTO public.workflow_actions (
    automation_id, 
    step_number, 
    action_type, 
    subject,
    html_content,
    action_config,
    is_active
  ) VALUES (
    v_automation_id,
    2,
    'email',
    'Wie war Ihre Erfahrung mit Unicum Tech? ⭐',
    (SELECT html_content FROM public.email_templates WHERE id = v_template_id),
    json_build_object('template_id', v_template_id, 'include_review_url', true)::jsonb,
    true
  );
END $$;