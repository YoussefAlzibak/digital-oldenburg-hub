-- Insert missing email templates (Newsletter Willkommen, Kontaktanfrage Bestätigung, Newsletter Abmeldung Bestätigung)
INSERT INTO public.email_templates (name, subject, html_content, text_content, template_type, is_active)
VALUES 
(
  'Newsletter Willkommen',
  'Willkommen bei Unicum Tech! 🎉',
  '<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
<tr><td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;"><h1 style="color: #ffffff; margin: 0; font-size: 28px;">Willkommen bei Unicum Tech!</h1></td></tr>
<tr><td style="padding: 40px;">
<p style="color: #4a5568; line-height: 1.7;">Hallo {{first_name}},</p>
<p style="color: #4a5568; line-height: 1.7;">vielen Dank für Ihre Anmeldung zu unserem Newsletter! 🎉</p>
<p style="color: #4a5568; line-height: 1.7;">Ab sofort erhalten Sie regelmäßig:</p>
<ul style="color: #4a5568; line-height: 2;"><li>Aktuelle Tipps zur Digitalisierung</li><li>Neuigkeiten aus der Web-Entwicklung</li><li>Exklusive Angebote und Insights</li></ul>
<p style="color: #1e3a5f; margin-top: 30px;">Mit freundlichen Grüßen,<br><strong>Das Unicum Tech Team</strong></p>
</td></tr>
<tr><td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
<p style="margin: 0 0 10px 0; font-size: 14px; color: #a0c4e8;"><a href="{{website_url}}" style="color: #a0c4e8; text-decoration: none;">Website</a> | <a href="tel:+4917066668089" style="color: #a0c4e8; text-decoration: none;">0170 6666809</a></p>
<p style="margin: 0; font-size: 11px; color: #6b8eb8;">© {{current_year}} Unicum Tech. Alle Rechte vorbehalten.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>',
  'Hallo {{first_name}}, vielen Dank für Ihre Anmeldung zu unserem Newsletter! Mit freundlichen Grüßen, Das Unicum Tech Team',
  'transactional',
  true
),
(
  'Kontaktanfrage Bestätigung',
  'Ihre Anfrage bei Unicum Tech - {{service_type}}',
  '<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
<tr><td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;"><h1 style="color: #ffffff; margin: 0; font-size: 28px;">Vielen Dank für Ihre Anfrage!</h1></td></tr>
<tr><td style="padding: 40px;">
<p style="color: #4a5568; line-height: 1.7;">Hallo {{name}},</p>
<p style="color: #4a5568; line-height: 1.7;">vielen Dank für Ihre Kontaktanfrage bei Unicum Tech. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
<div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
<h3 style="color: #1e3a5f; margin: 0 0 15px 0;">Ihre Anfrage:</h3>
<p style="color: #4a5568; margin: 5px 0;"><strong>Service:</strong> {{service_type}}</p>
<p style="color: #4a5568; margin: 5px 0;"><strong>E-Mail:</strong> {{email}}</p>
<p style="color: #4a5568; margin: 5px 0;"><strong>Nachricht:</strong> {{message}}</p>
</div>
<p style="color: #1e3a5f; margin-top: 30px;">Mit freundlichen Grüßen,<br><strong>Das Unicum Tech Team</strong></p>
</td></tr>
<tr><td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
<p style="margin: 0 0 10px 0; font-size: 14px; color: #a0c4e8;"><a href="{{website_url}}" style="color: #a0c4e8; text-decoration: none;">Website</a> | <a href="tel:+4917066668089" style="color: #a0c4e8; text-decoration: none;">0170 6666809</a></p>
<p style="margin: 0; font-size: 11px; color: #6b8eb8;">© {{current_year}} Unicum Tech. Alle Rechte vorbehalten.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>',
  'Hallo {{name}}, vielen Dank für Ihre Kontaktanfrage. Service: {{service_type}}. Wir melden uns schnellstmöglich. Das Unicum Tech Team',
  'transactional',
  true
),
(
  'Newsletter Abmeldung Bestätigung',
  'Schade, dass Sie gehen - Newsletter Abmeldung bestätigt',
  '<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
<tr><td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px; text-align: center;"><h1 style="color: #ffffff; margin: 0; font-size: 28px;">Newsletter Abmeldung</h1></td></tr>
<tr><td style="padding: 40px;">
<p style="color: #4a5568; line-height: 1.7;">Hallo {{first_name}},</p>
<p style="color: #4a5568; line-height: 1.7;">Sie wurden erfolgreich von unserem Newsletter abgemeldet. Es tut uns leid, Sie gehen zu sehen.</p>
<p style="color: #4a5568; line-height: 1.7;">Falls Sie Ihre Meinung ändern, können Sie sich jederzeit wieder anmelden.</p>
<p style="color: #1e3a5f; margin-top: 30px;">Alles Gute,<br><strong>Das Unicum Tech Team</strong></p>
</td></tr>
<tr><td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
<p style="margin: 0 0 10px 0; font-size: 14px; color: #a0c4e8;"><a href="{{website_url}}" style="color: #a0c4e8; text-decoration: none;">Website</a> | <a href="tel:+4917066668089" style="color: #a0c4e8; text-decoration: none;">0170 6666809</a></p>
<p style="margin: 0; font-size: 11px; color: #6b8eb8;">© {{current_year}} Unicum Tech. Alle Rechte vorbehalten.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>',
  'Hallo {{first_name}}, Sie wurden erfolgreich von unserem Newsletter abgemeldet. Alles Gute, Das Unicum Tech Team',
  'transactional',
  true
);