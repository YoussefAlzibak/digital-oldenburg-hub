-- Create sample email automations with steps

-- 1. Newsletter Welcome Automation
INSERT INTO email_automations (name, description, trigger_type, is_active, trigger_config) VALUES 
(
  'Newsletter Willkommens-Serie',
  'Automatische Willkommens-E-Mails für neue Newsletter-Abonnenten',
  'subscription',
  true,
  '{"delay_between_emails": "24h", "max_emails": 3}'
);

-- Get the automation ID for newsletter welcome
DO $$
DECLARE
    newsletter_automation_id UUID;
BEGIN
    SELECT id INTO newsletter_automation_id FROM email_automations WHERE name = 'Newsletter Willkommens-Serie';
    
    -- Insert automation steps
    INSERT INTO email_automation_steps (automation_id, step_number, subject, html_content, text_content, delay_minutes, is_active) VALUES
    (
        newsletter_automation_id,
        1,
        'Herzlich willkommen bei {{company_name}}! 🎉',
        '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
        .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Willkommen, {{first_name}}!</h1>
            <p>Schön, dass Sie bei uns sind</p>
        </div>
        <div class="content">
            <p>Liebe/r {{first_name}},</p>
            <p>herzlich willkommen bei Digital Masters! Wir freuen uns sehr, Sie in unserem Newsletter begrüßen zu dürfen.</p>
            <p>In den kommenden Tagen erhalten Sie wertvolle Tipps und Insights zur digitalen Transformation Ihres Unternehmens.</p>
            <p style="margin: 30px 0;">
                <a href="#" class="btn">Jetzt entdecken</a>
            </p>
        </div>
        <div class="footer">
            <p><strong>Digital Masters Team</strong></p>
            <p><a href="#" style="color: #3b82f6;">Abmelden</a></p>
        </div>
    </div>
</body>
</html>',
        'Willkommen bei Digital Masters!

Liebe/r {{first_name}},

herzlich willkommen bei Digital Masters! Wir freuen uns sehr, Sie in unserem Newsletter begrüßen zu dürfen.

In den kommenden Tagen erhalten Sie wertvolle Tipps und Insights zur digitalen Transformation.

Mit freundlichen Grüßen
Digital Masters Team',
        0,
        true
    ),
    (
        newsletter_automation_id,
        2,
        'Ihre ersten Schritte zur digitalen Transformation',
        '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .tip-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💡 Digitale Transformation leicht gemacht</h1>
        </div>
        <div class="content">
            <p>Hallo {{first_name}},</p>
            <p>hier sind Ihre ersten 3 Schritte für eine erfolgreiche digitale Transformation:</p>
            
            <div class="tip-box">
                <h3>1. Website-Analyse</h3>
                <p>Überprüfen Sie Ihre aktuelle Online-Präsenz und identifizieren Sie Verbesserungspotentiale.</p>
            </div>
            
            <div class="tip-box">
                <h3>2. CRM-System einführen</h3>
                <p>Zentralisieren Sie Ihre Kundendaten für bessere Beziehungen und mehr Umsatz.</p>
            </div>
            
            <div class="tip-box">
                <h3>3. Marketing automatisieren</h3>
                <p>Sparen Sie Zeit durch intelligente Marketing-Automation.</p>
            </div>
            
            <p>Benötigen Sie Unterstützung? Buchen Sie ein kostenloses Beratungsgespräch!</p>
        </div>
    </div>
</body>
</html>',
        'Digitale Transformation - Ihre ersten Schritte

Hallo {{first_name}},

hier sind Ihre ersten 3 Schritte:

1. Website-Analyse
2. CRM-System einführen  
3. Marketing automatisieren

Benötigen Sie Unterstützung? Buchen Sie ein kostenloses Beratungsgespräch!

Digital Masters Team',
        1440, -- 24 Stunden später
        true
    ),
    (
        newsletter_automation_id,
        3,
        'Exklusives Angebot für Newsletter-Abonnenten',
        '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
        .offer-box { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; text-align: center; padding: 30px; margin: 20px; border-radius: 12px; }
        .discount { font-size: 48px; font-weight: bold; }
        .btn { display: inline-block; background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Exklusiv für Sie!</h1>
        </div>
        <div class="offer-box">
            <div class="discount">15%</div>
            <div>Rabatt auf Ihre erste Projektanfrage</div>
        </div>
        <div style="padding: 30px;">
            <p>Hallo {{first_name}},</p>
            <p>als Dankeschön für Ihr Vertrauen erhalten Sie 15% Rabatt auf Ihr erstes Projekt mit uns!</p>
            <p>Gültig für alle Services:</p>
            <ul>
                <li>Webdesign & Development</li>
                <li>CRM-Integration</li>
                <li>IT-Services</li>
                <li>Print & Branding</li>
            </ul>
            <p style="text-align: center; margin: 30px 0;">
                <a href="#" class="btn">Jetzt 15% sparen</a>
            </p>
            <p><small>Angebot gültig bis Ende des Monats. Nicht mit anderen Aktionen kombinierbar.</small></p>
        </div>
    </div>
</body>
</html>',
        'Exklusives Angebot für Sie!

Hallo {{first_name}},

als Newsletter-Abonnent erhalten Sie 15% Rabatt auf Ihr erstes Projekt!

Gültig für:
- Webdesign & Development
- CRM-Integration
- IT-Services
- Print & Branding

Jetzt sparen: [Link]

Digital Masters Team',
        4320, -- 72 Stunden später (3 Tage)
        true
    );
END $$;

-- 2. Appointment Confirmation Automation
INSERT INTO email_automations (name, description, trigger_type, is_active, trigger_config) VALUES 
(
  'Termin-Bestätigungen',
  'Automatische Bestätigungs- und Erinnerungs-E-Mails für Termine',
  'appointment_booked',
  true,
  '{"send_confirmation": true, "send_reminder": true}'
);

-- Get the automation ID for appointment confirmation
DO $$
DECLARE
    appointment_automation_id UUID;
BEGIN
    SELECT id INTO appointment_automation_id FROM email_automations WHERE name = 'Termin-Bestätigungen';
    
    -- Insert automation steps
    INSERT INTO email_automation_steps (automation_id, step_number, subject, html_content, text_content, delay_minutes, is_active) VALUES
    (
        appointment_automation_id,
        1,
        'Terminbestätigung - {{appointment_date}} um {{appointment_time}}',
        '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; }
        .appointment-box { background: #f0f9ff; border: 2px solid #3b82f6; padding: 25px; margin: 20px; border-radius: 12px; text-align: center; }
        .date-time { font-size: 24px; font-weight: bold; color: #1e40af; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Termin bestätigt!</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hallo {{first_name}},</p>
            <p>vielen Dank für Ihre Terminanfrage! Wir freuen uns auf unser Gespräch.</p>
            
            <div class="appointment-box">
                <h3>Ihr Beratungstermin</h3>
                <div class="date-time">📅 {{appointment_date}}</div>
                <div class="date-time">🕐 {{appointment_time}} Uhr</div>
                <p><strong>Service:</strong> {{service_type}}</p>
            </div>
            
            <p>📋 <strong>Was Sie erwartet:</strong></p>
            <ul>
                <li>Kostenlose Erstberatung (30-45 Min.)</li>
                <li>Analyse Ihrer aktuellen Situation</li>
                <li>Unverbindliches Lösungskonzept</li>
                <li>Transparente Kostenübersicht</li>
            </ul>
            
            <p>Falls Sie Fragen haben oder den Termin verschieben müssen, melden Sie sich gerne bei uns.</p>
            
            <p>Mit freundlichen Grüßen<br>
            Ihr Digital Masters Team</p>
        </div>
    </div>
</body>
</html>',
        'Terminbestätigung - {{appointment_date}} um {{appointment_time}}

Hallo {{first_name}},

vielen Dank für Ihre Terminanfrage! Hier die Details:

TERMIN:
📅 {{appointment_date}}
🕐 {{appointment_time}} Uhr
Service: {{service_type}}

WAS SIE ERWARTET:
- Kostenlose Erstberatung (30-45 Min.)
- Analyse Ihrer Situation
- Unverbindliches Lösungskonzept
- Transparente Kostenübersicht

Bei Fragen melden Sie sich gerne.

Digital Masters Team',
        0,
        true
    ),
    (
        appointment_automation_id,
        2,
        'Erinnerung: Ihr Termin morgen um {{appointment_time}}',
        '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
        .reminder-box { background: #fef3c7; border: 2px dashed #f59e0b; padding: 20px; margin: 20px; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Terminerinnerung</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hallo {{first_name}},</p>
            <p>eine kurze Erinnerung an Ihren morgigen Beratungstermin:</p>
            
            <div class="reminder-box">
                <h3>📅 Morgen um {{appointment_time}} Uhr</h3>
                <p>Service: {{service_type}}</p>
            </div>
            
            <p>Wir freuen uns auf unser Gespräch! Haben Sie noch Fragen oder möchten etwas Spezifisches besprechen? Lassen Sie es uns gerne vorab wissen.</p>
            
            <p>Bis morgen!<br>
            Ihr Digital Masters Team</p>
        </div>
    </div>
</body>
</html>',
        'Terminerinnerung - Morgen um {{appointment_time}}

Hallo {{first_name}},

eine kurze Erinnerung an Ihren morgigen Beratungstermin:

📅 Morgen um {{appointment_time}} Uhr
Service: {{service_type}}

Wir freuen uns auf unser Gespräch!

Digital Masters Team',
        1320, -- 22 Stunden später (am Tag vor dem Termin)
        true
    );
END $$;

-- 3. Contact Form Follow-up Automation
INSERT INTO email_automations (name, description, trigger_type, is_active, trigger_config) VALUES 
(
  'Kontaktformular Nachfass-Serie',
  'Follow-up E-Mails für Kontaktanfragen ohne Terminbuchung',
  'contact_form',
  true,
  '{"follow_up_days": [1, 3, 7], "max_follow_ups": 3}'
);

-- Get the automation ID for contact form follow-up
DO $$
DECLARE
    contact_automation_id UUID;
BEGIN
    SELECT id INTO contact_automation_id FROM email_automations WHERE name = 'Kontaktformular Nachfass-Serie';
    
    -- Insert automation steps
    INSERT INTO email_automation_steps (automation_id, step_number, subject, html_content, text_content, delay_minutes, is_active) VALUES
    (
        contact_automation_id,
        1,
        'Vielen Dank für Ihre Anfrage, {{first_name}}!',
        '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 Danke für Ihre Nachricht!</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hallo {{first_name}},</p>
            <p>vielen Dank für Ihre Anfrage bezüglich <strong>{{service_type}}</strong>!</p>
            <p>Wir haben Ihre Nachricht erhalten und melden uns innerhalb der nächsten 24 Stunden bei Ihnen zurück.</p>
            
            <p>Um Ihnen noch schneller helfen zu können, können Sie auch direkt einen kostenlosen Beratungstermin buchen:</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="#" class="btn">Termin buchen</a>
            </p>
            
            <p>Ihre Anfrage im Überblick:</p>
            <ul>
                <li><strong>Service:</strong> {{service_type}}</li>
                <li><strong>Nachricht:</strong> {{message}}</li>
            </ul>
            
            <p>Mit freundlichen Grüßen<br>
            Ihr Digital Masters Team</p>
        </div>
    </div>
</body>
</html>',
        'Danke für Ihre Anfrage!

Hallo {{first_name}},

vielen Dank für Ihre Anfrage bezüglich {{service_type}}!

Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.

Für noch schnellere Hilfe können Sie auch direkt einen Beratungstermin buchen.

Mit freundlichen Grüßen
Digital Masters Team',
        30, -- 30 Minuten später
        true
    );
END $$;