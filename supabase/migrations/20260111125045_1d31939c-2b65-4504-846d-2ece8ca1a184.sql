-- Neue Automatisierung: Newsletter Abmeldung
INSERT INTO email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'Newsletter-Abmeldung Bestätigung',
  'Automatische Bestätigung nach Newsletter-Abmeldung mit Feedback-Anfrage',
  'user_action',
  '{"action": "newsletter_unsubscribe"}',
  true
);

-- Neue Automatisierung: Monatlicher Newsletter
INSERT INTO email_automations (name, description, trigger_type, trigger_config, is_active)
VALUES (
  'Monatlicher Newsletter',
  'Regelmäßiger Newsletter mit Updates und Neuigkeiten',
  'date_based',
  '{"frequency": "monthly", "day_of_month": 1}',
  true
);

-- Füge Schritte für Newsletter-Abmeldung hinzu
INSERT INTO email_automation_steps (automation_id, step_number, template_id, delay_minutes, subject, html_content, is_active)
SELECT 
  (SELECT id FROM email_automations WHERE name = 'Newsletter-Abmeldung Bestätigung' LIMIT 1),
  1,
  'ea691262-1fc6-4078-8c6a-8325ee053925',
  0,
  'Schade, dass Sie gehen - Abmeldung bestätigt',
  (SELECT html_content FROM email_templates WHERE id = 'ea691262-1fc6-4078-8c6a-8325ee053925'),
  true;

-- Füge Schritte für Monatlichen Newsletter hinzu  
INSERT INTO email_automation_steps (automation_id, step_number, template_id, delay_minutes, subject, html_content, is_active)
SELECT 
  (SELECT id FROM email_automations WHERE name = 'Monatlicher Newsletter' LIMIT 1),
  1,
  'a0b0b23a-4e1d-4c32-89a2-e3bcc77a671f',
  0,
  'Ihr monatlicher Newsletter - Neuigkeiten und Updates',
  (SELECT html_content FROM email_templates WHERE id = 'a0b0b23a-4e1d-4c32-89a2-e3bcc77a671f'),
  true;