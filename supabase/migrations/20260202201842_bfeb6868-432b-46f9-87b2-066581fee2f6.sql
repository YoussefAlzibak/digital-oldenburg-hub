-- Workflow-Aktionen für Bewertungsanfrage nach Termin
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('ad6a2790-b4f6-461a-996d-59b02e953d8b', 1, 'delay', 1440, NULL, NULL, true),
('ad6a2790-b4f6-461a-996d-59b02e953d8b', 2, 'send_email', 0, 
  'Wie war Ihr Termin bei Unicum Tech?',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Hallo {{first_name}}!</h1>
  <p>Wir hoffen, Ihr Termin am {{appointment_date}} war erfolgreich und hat Ihren Erwartungen entsprochen.</p>
  <p><strong>Ihre Meinung ist uns wichtig!</strong> Wir würden uns freuen, wenn Sie sich 2 Minuten Zeit nehmen, um uns zu bewerten:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{review_url}}" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">⭐ Jetzt bewerten</a>
  </div>
  <p>Ihr Feedback hilft uns, unseren Service kontinuierlich zu verbessern.</p>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>', 
  true),
('ad6a2790-b4f6-461a-996d-59b02e953d8b', 3, 'add_tag', 0, NULL, NULL, true);

UPDATE public.workflow_actions 
SET action_config = '{"tag": "review-requested"}'::jsonb 
WHERE automation_id = 'ad6a2790-b4f6-461a-996d-59b02e953d8b' AND step_number = 3;

-- Workflow-Aktionen für VIP-Kunden Willkommen
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('4444cd9b-9bc2-488a-bfcf-30dd71870261', 1, 'send_email', 0,
  '🎉 Willkommen im VIP-Club von Unicum Tech!',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea20, #764ba220);">
  <h1 style="color: #667eea;">Herzlich Willkommen, {{first_name}}! 🌟</h1>
  <p>Sie wurden als <strong>VIP-Kunde</strong> eingestuft – vielen Dank für Ihr Vertrauen!</p>
  <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>Ihre exklusiven VIP-Vorteile:</h3>
    <ul>
      <li>✨ Prioritärer Support mit garantierter Reaktion innerhalb von 4 Stunden</li>
      <li>🎁 Exklusive Rabatte auf alle Services</li>
      <li>📞 Direkter Draht zu unseren Senior-Entwicklern</li>
      <li>🚀 Early Access zu neuen Features und Services</li>
    </ul>
  </div>
  <p>Bei Fragen steht Ihnen Ihr persönlicher Ansprechpartner jederzeit zur Verfügung.</p>
  <p>Mit besten Grüßen,<br><strong>Ihr Unicum Tech VIP-Team</strong></p>
  </body></html>',
  true);

-- Workflow-Aktionen für Reaktivierung inaktiver Kontakte
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('d9737200-1eb7-4030-9ee2-ba99c9bbdd9f', 1, 'send_email', 0,
  'Wir vermissen Sie! 👋',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Hallo {{first_name}}!</h1>
  <p>Es ist eine Weile her, seit wir voneinander gehört haben. Wir hoffen, es geht Ihnen gut!</p>
  <p>Bei Unicum Tech gibt es viel Neues:</p>
  <ul>
    <li>🚀 Neue Webdesign-Trends 2026</li>
    <li>📱 Verbesserte Mobile-First Lösungen</li>
    <li>🔧 Erweiterte CRM-Integrationen</li>
  </ul>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://id-preview--106d7df2-0ee4-473f-8d9a-e02157575ed1.lovable.app/contact" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Kostenloses Beratungsgespräch</a>
  </div>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true);

-- Workflow-Aktionen für Termin-Erinnerung
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('00cfd7ae-0f3b-4dbc-b2df-76abef7c9902', 1, 'send_email', 0,
  '⏰ Erinnerung: Ihr Termin morgen bei Unicum Tech',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Terminerinnerung</h1>
  <p>Hallo {{first_name}},</p>
  <p>Wir möchten Sie an Ihren bevorstehenden Termin erinnern:</p>
  <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
    <p><strong>📅 Datum:</strong> {{appointment_date}}</p>
    <p><strong>🕐 Uhrzeit:</strong> {{appointment_time}} Uhr</p>
    <p><strong>📍 Art:</strong> {{meeting_type}}</p>
  </div>
  <p>Falls Sie den Termin verschieben müssen, kontaktieren Sie uns bitte rechtzeitig.</p>
  <p>Wir freuen uns auf das Gespräch mit Ihnen!</p>
  <p>Mit freundlichen Grüßen,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true);

-- Workflow-Aktionen für Lead Nurturing Serie
INSERT INTO public.workflow_actions (automation_id, step_number, action_type, delay_minutes, subject, html_content, is_active)
VALUES 
('29cca72a-5fef-4838-86f7-bd64506c3301', 1, 'send_email', 0,
  'Willkommen! Entdecken Sie unsere Services',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Willkommen bei Unicum Tech! 👋</h1>
  <p>Hallo {{first_name}},</p>
  <p>Schön, dass Sie sich für Unicum Tech interessieren! Wir sind eine Full-Service Digitalagentur aus Oldenburg.</p>
  <h3>Unsere Expertise:</h3>
  <ul>
    <li>🌐 <strong>Webdesign & Development</strong> – Moderne, responsive Websites</li>
    <li>🔗 <strong>CRM-Integration</strong> – Effiziente Kundenverwaltung</li>
    <li>🏠 <strong>Smart Home</strong> – Intelligente Automatisierung</li>
    <li>🎨 <strong>Print & Grafik</strong> – Professionelles Branding</li>
  </ul>
  <p>In den nächsten Tagen erhalten Sie weitere hilfreiche Informationen von uns.</p>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true),
('29cca72a-5fef-4838-86f7-bd64506c3301', 2, 'delay', 4320, NULL, NULL, true),
('29cca72a-5fef-4838-86f7-bd64506c3301', 3, 'send_email', 0,
  '💡 5 Tipps für eine erfolgreiche Website',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">5 Tipps für Ihre perfekte Website</h1>
  <p>Hallo {{first_name}},</p>
  <p>Hier sind unsere Top-Tipps für eine erfolgreiche Website:</p>
  <ol>
    <li><strong>Mobile First</strong> – Über 60% der Besucher nutzen Smartphones</li>
    <li><strong>Schnelle Ladezeiten</strong> – Jede Sekunde zählt</li>
    <li><strong>Klare Call-to-Actions</strong> – Führen Sie Besucher zum Ziel</li>
    <li><strong>SEO-Optimierung</strong> – Werden Sie gefunden</li>
    <li><strong>Vertrauenssignale</strong> – Kundenbewertungen & Zertifikate</li>
  </ol>
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://id-preview--106d7df2-0ee4-473f-8d9a-e02157575ed1.lovable.app/services" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Unsere Services entdecken</a>
  </div>
  <p>Herzliche Grüße,<br><strong>Ihr Unicum Tech Team</strong></p>
  </body></html>',
  true);