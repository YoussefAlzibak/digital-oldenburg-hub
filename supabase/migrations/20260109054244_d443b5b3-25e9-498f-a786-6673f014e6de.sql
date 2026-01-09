-- Insert missing email reminder templates
INSERT INTO public.email_templates (name, subject, html_content, text_content, template_type, is_active)
VALUES 
-- Appointment Reminder Template
('Termin-Erinnerung', 
'Erinnerung: Ihr Termin bei Unicum Tech am {{appointment_date}}',
'<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termin-Erinnerung</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #8ec5fc; text-transform: uppercase; letter-spacing: 2px;">Termin-Erinnerung</p>
            </td>
          </tr>
          
          <!-- Reminder Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">⏰ Ihr Termin steht bevor!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 22px;">Hallo {{first_name}},</h2>
              
              <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                Wir möchten Sie an Ihren bevorstehenden Beratungstermin bei {{company_name}} erinnern.
              </p>
              
              <!-- Appointment Details Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="background: #f59e0b; padding: 15px 20px;">
                    <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 700;">📅 Termindetails</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #92400e; font-size: 14px; width: 120px;">Datum:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">{{appointment_date}}</td>
                      </tr>
                      <tr>
                        <td style="color: #92400e; font-size: 14px;">Uhrzeit:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">{{appointment_time}}</td>
                      </tr>
                      <tr>
                        <td style="color: #92400e; font-size: 14px;">Meeting-Art:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">{{meeting_type}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{meeting_link}}" style="display: inline-block; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Zum Meeting →</a>
              </p>
              
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das {{company_name}} Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                © {{current_year}} {{company_name}}. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
'Hallo {{first_name}},

Wir möchten Sie an Ihren bevorstehenden Beratungstermin erinnern.

TERMINDETAILS:
--------------
Datum: {{appointment_date}}
Uhrzeit: {{appointment_time}}
Meeting-Art: {{meeting_type}}

Meeting-Link: {{meeting_link}}

Mit freundlichen Grüßen,
Das {{company_name}} Team',
'automation', true),

-- Appointment Confirmation Template
('Terminbestätigung',
'Ihr Termin bei Unicum Tech - {{appointment_date}} um {{appointment_time}}',
'<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminbestätigung</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
            </td>
          </tr>
          
          <!-- Success Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">✓ Termin erfolgreich bestätigt</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 22px;">Hallo {{first_name}},</h2>
              
              <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                Ihr Beratungstermin wurde erfolgreich bestätigt!
              </p>
              
              <!-- Appointment Details Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 2px solid #4ecdc4; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="background: #4ecdc4; padding: 15px 20px;">
                    <p style="margin: 0; color: #1e3a5f; font-size: 16px; font-weight: 700;">📅 Ihre Termindetails</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 14px; width: 120px;">Datum:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">{{appointment_date}}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Uhrzeit:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">{{appointment_time}}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Meeting-Art:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">{{meeting_type}}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Service:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">{{service_type}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{meeting_link}}" style="display: inline-block; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Zum Meeting →</a>
              </p>
              
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Wir freuen uns auf Sie!<br>
                <strong>Das {{company_name}} Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                © {{current_year}} {{company_name}}. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
'Hallo {{first_name}},

Ihr Beratungstermin wurde erfolgreich bestätigt!

TERMINDETAILS:
--------------
Datum: {{appointment_date}}
Uhrzeit: {{appointment_time}}
Meeting-Art: {{meeting_type}}
Service: {{service_type}}

Meeting-Link: {{meeting_link}}

Wir freuen uns auf Sie!
Das {{company_name}} Team',
'transactional', true),

-- Follow-Up Template
('Follow-Up E-Mail',
'Danke für Ihre Anfrage, {{first_name}} - Unicum Tech',
'<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Follow-Up</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 22px;">Vielen Dank für Ihr Interesse!</h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                Hallo {{first_name}},<br><br>
                vielen Dank für Ihre Anfrage bezüglich <strong>{{service_type}}</strong>. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.
              </p>
              
              <!-- Request Summary -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border-left: 4px solid #4ecdc4; margin: 25px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="margin: 0 0 15px 0; color: #1e3a5f; font-size: 16px; font-weight: 700;">📋 Ihre Anfrage im Überblick</p>
                    <table role="presentation" width="100%" cellpadding="6" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 14px; width: 120px;">Service:</td>
                        <td style="color: #1e3a5f; font-size: 15px;">{{service_type}}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Unternehmen:</td>
                        <td style="color: #1e3a5f; font-size: 15px;">{{company}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #ecfdf5; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0; color: #059669; font-size: 15px;">
                      ⏱️ <strong>Wir melden uns innerhalb von 24 Stunden bei Ihnen!</strong>
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="{{website_url}}/services" style="display: inline-block; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Unsere Services entdecken →</a>
              </p>
              
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das {{company_name}} Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                © {{current_year}} {{company_name}}. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
'Hallo {{first_name}},

Vielen Dank für Ihre Anfrage bezüglich {{service_type}}.

IHRE ANFRAGE:
-------------
Service: {{service_type}}
Unternehmen: {{company}}

Wir melden uns innerhalb von 24 Stunden bei Ihnen!

Mit freundlichen Grüßen,
Das {{company_name}} Team',
'automation', true),

-- Newsletter Unsubscribe Confirmation
('Newsletter Abmeldung',
'Ihre Abmeldung wurde bestätigt - {{company_name}}',
'<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abmeldung bestätigt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px; text-align: center;">
              <p style="font-size: 48px; margin: 0 0 20px 0;">👋</p>
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f;">Schade, dass Sie gehen!</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7;">
                Ihre E-Mail-Adresse wurde erfolgreich von unserem Newsletter abgemeldet.<br>
                Sie werden keine weiteren E-Mails von uns erhalten.
              </p>
              <p style="margin: 30px 0; color: #4a5568; font-size: 14px;">
                Haben Sie es sich anders überlegt?
              </p>
              <a href="{{website_url}}" style="display: inline-block; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">Erneut anmelden</a>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                © {{current_year}} {{company_name}}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
'Ihre E-Mail-Adresse wurde erfolgreich von unserem Newsletter abgemeldet.

Sie werden keine weiteren E-Mails von uns erhalten.

Haben Sie es sich anders überlegt? Besuchen Sie {{website_url}} um sich erneut anzumelden.

{{company_name}}',
'transactional', true),

-- Contact Form Auto-Reply
('Kontaktformular Bestätigung',
'Wir haben Ihre Nachricht erhalten - {{company_name}}',
'<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nachricht erhalten</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="background: #10b981; padding: 15px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">✓ Nachricht erfolgreich gesendet</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f;">Hallo {{first_name}},</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7;">
                Vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.
              </p>
              <p style="margin: 25px 0; padding: 20px; background: #f0f9ff; border-left: 4px solid #4ecdc4; border-radius: 0 8px 8px 0; color: #1e3a5f;">
                <strong>Durchschnittliche Antwortzeit:</strong> 1-2 Werktage
              </p>
              <p style="color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das {{company_name}} Team</strong>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                © {{current_year}} {{company_name}}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
'Hallo {{first_name}},

Vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.

Durchschnittliche Antwortzeit: 1-2 Werktage

Mit freundlichen Grüßen,
Das {{company_name}} Team',
'transactional', true);