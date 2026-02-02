-- Newsletter-Abmeldung Bestätigung Workflow
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('69dec2c7-e371-41bd-a919-d82e065d0b91', 1, 'send_email', 0,
  'Ihre Abmeldung wurde bestätigt',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Schade, dass Sie gehen! 😢</h1>
  <p>Hallo {{first_name}},</p>
  <p>Ihre Abmeldung vom Newsletter wurde erfolgreich durchgeführt. Sie erhalten ab sofort keine weiteren E-Mails von uns.</p>
  <p>Falls Sie es sich anders überlegen, können Sie sich jederzeit erneut anmelden.</p>
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p><strong>War es etwas, das wir falsch gemacht haben?</strong></p>
    <p>Wir würden uns über Feedback freuen: <a href="mailto:info@unicumtech.de">info@unicumtech.de</a></p>
  </div>
  <p>Alles Gute,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true),
('69dec2c7-e371-41bd-a919-d82e065d0b91', 2, 'remove_tag', 0, NULL, NULL, true),
('69dec2c7-e371-41bd-a919-d82e065d0b91', 3, 'add_tag', 0, NULL, NULL, true),
('69dec2c7-e371-41bd-a919-d82e065d0b91', 4, 'change_status', 0, NULL, NULL, true);

UPDATE public.workflow_actions SET action_config = '{"tag": "newsletter"}'::jsonb WHERE automation_id = '69dec2c7-e371-41bd-a919-d82e065d0b91' AND step_number = 2;
UPDATE public.workflow_actions SET action_config = '{"tag": "unsubscribed"}'::jsonb WHERE automation_id = '69dec2c7-e371-41bd-a919-d82e065d0b91' AND step_number = 3;
UPDATE public.workflow_actions SET action_config = '{"status": "unsubscribed"}'::jsonb WHERE automation_id = '69dec2c7-e371-41bd-a919-d82e065d0b91' AND step_number = 4;

-- Monatlicher Newsletter Workflow (zeitgesteuert)
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('63988ffa-089e-43e5-8a42-1366c66d8d47', 1, 'send_email', 0,
  '📰 Ihr monatliches Update von Unicum Tech',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Monatliches Update 📬</h1>
  <p>Hallo {{first_name}},</p>
  <p>Hier sind die Neuigkeiten des Monats:</p>
  <div style="background: linear-gradient(135deg, #667eea20, #764ba220); padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>🚀 Neue Projekte</h3>
    <p>Wir haben diesen Monat wieder spannende Projekte umgesetzt.</p>
    <h3>💡 Tech-Tipps</h3>
    <p>Optimieren Sie Ihre Website-Performance mit unseren neuesten Empfehlungen.</p>
    <h3>🎉 Angebote</h3>
    <p>Exklusive Rabatte für Newsletter-Abonnenten!</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://id-preview--106d7df2-0ee4-473f-8d9a-e02157575ed1.lovable.app/services" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Mehr erfahren</a>
  </div>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true);

-- Update trigger_config für scheduled
UPDATE public.email_automations 
SET trigger_config = '{"filter_tags": ["newsletter"], "schedule_time": "10:00"}'::jsonb,
    trigger_type = 'scheduled'
WHERE id = '63988ffa-089e-43e5-8a42-1366c66d8d47';

-- Newsletter Willkommens-Serie Workflow
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('78276918-138f-4634-b0ab-b2ffde004ac1', 1, 'send_email', 0,
  '🎉 Willkommen bei Unicum Tech!',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Willkommen an Bord! 🚀</h1>
  <p>Hallo {{first_name}},</p>
  <p>Vielen Dank für Ihre Newsletter-Anmeldung! Ab jetzt erhalten Sie regelmäßig:</p>
  <ul>
    <li>✨ Exklusive Tipps zu Webdesign & IT</li>
    <li>🎁 Sonderangebote nur für Abonnenten</li>
    <li>📊 Branchentrends und Best Practices</li>
  </ul>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true),
('78276918-138f-4634-b0ab-b2ffde004ac1', 2, 'add_tag', 0, NULL, NULL, true),
('78276918-138f-4634-b0ab-b2ffde004ac1', 3, 'delay', 1440, NULL, NULL, true),
('78276918-138f-4634-b0ab-b2ffde004ac1', 4, 'send_email', 0,
  '💡 3 Geheimnisse erfolgreicher Websites',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">3 Geheimnisse erfolgreicher Websites</h1>
  <p>Hallo {{first_name}},</p>
  <p>Hier sind unsere Top 3 Geheimnisse:</p>
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
    <h3>1. User Experience first</h3>
    <p>Die beste Technik nützt nichts, wenn Nutzer sie nicht verstehen.</p>
  </div>
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #764ba2;">
    <h3>2. Geschwindigkeit zählt</h3>
    <p>53% der Nutzer verlassen Seiten, die länger als 3 Sekunden laden.</p>
  </div>
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
    <h3>3. Content is King</h3>
    <p>Relevanter Content bindet Besucher und verbessert SEO.</p>
  </div>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true),
('78276918-138f-4634-b0ab-b2ffde004ac1', 5, 'delay', 2880, NULL, NULL, true),
('78276918-138f-4634-b0ab-b2ffde004ac1', 6, 'send_email', 0,
  '🎯 Ihr persönliches Angebot',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Exklusiv für Sie! 🎁</h1>
  <p>Hallo {{first_name}},</p>
  <p>Als Dankeschön für Ihre Treue: <strong>10% Rabatt</strong> auf Ihr erstes Projekt mit uns!</p>
  <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0;">
    <h2 style="margin: 0;">WILLKOMMEN10</h2>
    <p style="margin: 10px 0 0;">Ihr persönlicher Rabattcode</p>
  </div>
  <div style="text-align: center;">
    <a href="https://id-preview--106d7df2-0ee4-473f-8d9a-e02157575ed1.lovable.app/contact" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Jetzt Beratung anfragen</a>
  </div>
  <p style="margin-top: 30px;">Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true);

UPDATE public.workflow_actions SET action_config = '{"tag": "newsletter"}'::jsonb WHERE automation_id = '78276918-138f-4634-b0ab-b2ffde004ac1' AND step_number = 2;

-- Kontaktformular Nachfass-Serie Workflow
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('3992aebc-51f0-415c-a454-bda26b235777', 1, 'send_email', 0,
  '✅ Ihre Anfrage ist eingegangen',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Anfrage erhalten! ✅</h1>
  <p>Hallo {{first_name}},</p>
  <p>Vielen Dank für Ihre Anfrage! Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Ihre Anfrage:</strong></p>
    <p>Service: {{service_type}}</p>
  </div>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true),
('3992aebc-51f0-415c-a454-bda26b235777', 2, 'add_tag', 0, NULL, NULL, true),
('3992aebc-51f0-415c-a454-bda26b235777', 3, 'delay', 4320, NULL, NULL, true),
('3992aebc-51f0-415c-a454-bda26b235777', 4, 'condition', 0, NULL, NULL, true),
('3992aebc-51f0-415c-a454-bda26b235777', 5, 'send_email', 0,
  '📞 Haben Sie noch Fragen?',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Noch Fragen? 🤔</h1>
  <p>Hallo {{first_name}},</p>
  <p>Wir wollten kurz nachfragen, ob Sie noch Fragen zu Ihrer Anfrage haben.</p>
  <p>Gerne können Sie uns jederzeit kontaktieren:</p>
  <ul>
    <li>📧 E-Mail: info@unicumtech.de</li>
    <li>📱 Telefon: +49 441 XXX XXX</li>
  </ul>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://id-preview--106d7df2-0ee4-473f-8d9a-e02157575ed1.lovable.app/book-appointment" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Termin vereinbaren</a>
  </div>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true);

UPDATE public.workflow_actions SET action_config = '{"tag": "lead"}'::jsonb WHERE automation_id = '3992aebc-51f0-415c-a454-bda26b235777' AND step_number = 2;
UPDATE public.workflow_actions SET condition_field = 'status', condition_operator = 'not_equals', condition_value = 'customer' WHERE automation_id = '3992aebc-51f0-415c-a454-bda26b235777' AND step_number = 4;

-- Termin-Bestätigungen Workflow
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('b408dbcf-cbc8-48db-b581-9d181819d482', 1, 'send_email', 0,
  '✅ Terminbestätigung - Unicum Tech',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Termin bestätigt! ✅</h1>
  <p>Hallo {{first_name}},</p>
  <p>Ihr Termin wurde erfolgreich gebucht!</p>
  <div style="background: linear-gradient(135deg, #667eea10, #764ba210); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #667eea40;">
    <p><strong>📅 Datum:</strong> {{appointment_date}}</p>
    <p><strong>🕐 Uhrzeit:</strong> {{appointment_time}} Uhr</p>
    <p><strong>📍 Art:</strong> {{meeting_type}}</p>
    <p><strong>🔗 Meeting-Link:</strong> <a href="{{meeting_link}}">{{meeting_link}}</a></p>
  </div>
  <p>Bitte fügen Sie den Termin zu Ihrem Kalender hinzu. Falls Sie den Termin absagen oder verschieben müssen, kontaktieren Sie uns bitte rechtzeitig.</p>
  <p>Wir freuen uns auf das Gespräch mit Ihnen!</p>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true),
('b408dbcf-cbc8-48db-b581-9d181819d482', 2, 'add_tag', 0, NULL, NULL, true),
('b408dbcf-cbc8-48db-b581-9d181819d482', 3, 'webhook', 0, NULL, NULL, true);

UPDATE public.workflow_actions SET action_config = '{"tag": "appointment-booked"}'::jsonb WHERE automation_id = 'b408dbcf-cbc8-48db-b581-9d181819d482' AND step_number = 2;
UPDATE public.workflow_actions SET action_config = '{"url": "https://kgwanyretbrxwtwduljg.supabase.co/functions/v1/sync-appointment-to-google", "method": "POST"}'::jsonb WHERE automation_id = 'b408dbcf-cbc8-48db-b581-9d181819d482' AND step_number = 3;