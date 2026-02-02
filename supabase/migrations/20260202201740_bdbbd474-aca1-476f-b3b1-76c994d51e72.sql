-- Erstelle Bewertungsanfrage-Automation nach Termin-Abschluss
INSERT INTO public.email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'Bewertungsanfrage nach Termin',
  'Sendet automatisch eine Bewertungsanfrage 24h nach Termin-Abschluss',
  'appointment_completed',
  '{"delay_hours": 24}'::jsonb,
  true
);

-- Erstelle Tag-basierte Willkommens-Automation  
INSERT INTO public.email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'VIP-Kunden Willkommen',
  'Begrüßung für neue VIP-Kunden',
  'tag_added',
  '{"tag_name": "vip"}'::jsonb,
  true
);

-- Erstelle Reaktivierungs-Automation für inaktive Kontakte
INSERT INTO public.email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'Reaktivierung inaktiver Kontakte',
  'Zeitgesteuerte E-Mail an inaktive Subscriber',
  'scheduled',
  '{"filter_tags": ["inactive"], "schedule_time": "09:00"}'::jsonb,
  true
);

-- Erstelle Termin-Erinnerung Automation
INSERT INTO public.email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'Termin-Erinnerung 1 Tag vorher',
  'Automatische Erinnerung 24h vor dem Termin',
  'appointment_reminder',
  '{"reminder_hours": 24}'::jsonb,
  true
);

-- Erstelle Lead-Nurturing Automation
INSERT INTO public.email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'Lead Nurturing Serie',
  'Automatische Pflegeserie für neue Leads',
  'tag_added',
  '{"tag_name": "lead"}'::jsonb,
  true
);