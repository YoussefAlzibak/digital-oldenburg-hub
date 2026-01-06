-- Insert 3 professional email templates

INSERT INTO email_templates (name, subject, html_content, text_content, template_type, is_active) VALUES 
(
  'Professional Newsletter Template',
  'Ihr monatlicher Newsletter - Neuigkeiten und Updates',
  '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .article { margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #eee; }
        .article:last-child { border-bottom: none; }
        .article h2 { color: #333; font-size: 20px; margin-bottom: 15px; }
        .article p { color: #666; line-height: 1.6; margin-bottom: 15px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .social-links { margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{company_name}}</h1>
            <p>Ihr monatlicher Newsletter mit den neuesten Updates</p>
        </div>
        
        <div class="content">
            <div class="article">
                <h2>Willkommen zu unserem Newsletter</h2>
                <p>Liebe {{first_name}},</p>
                <p>wir freuen uns, Ihnen unseren monatlichen Newsletter zu präsentieren. Hier finden Sie die wichtigsten Neuigkeiten und Updates aus unserem Unternehmen.</p>
            </div>
            
            <div class="article">
                <h2>Neue Dienstleistungen</h2>
                <p>Entdecken Sie unsere erweiterten Serviceangebote, die speziell für Ihre Bedürfnisse entwickelt wurden. Von Web-Design bis hin zu digitalen Marketinglösungen.</p>
                <a href="#" class="btn">Mehr erfahren</a>
            </div>
            
            <div class="article">
                <h2>Erfolgsgeschichten</h2>
                <p>Lesen Sie, wie wir unseren Kunden zu digitalem Erfolg verhelfen konnten. Neue Case Studies und Referenzen warten auf Sie.</p>
                <a href="#" class="btn">Case Studies ansehen</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="#">LinkedIn</a>
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
            </div>
            <p>Unicum Tech | Ihr Partner für digitale Transformation</p>
            <p><a href="#" style="color: #667eea;">Abmelden</a> | <a href="#" style="color: #667eea;">Newsletter-Einstellungen</a></p>
        </div>
    </div>
</body>
</html>',
  'Newsletter von {{company_name}}

Liebe {{first_name}},

wir freuen uns, Ihnen unseren monatlichen Newsletter zu präsentieren.

NEUE DIENSTLEISTUNGEN
Entdecken Sie unsere erweiterten Serviceangebote für Ihre digitalen Bedürfnisse.

ERFOLGSGESCHICHTEN  
Lesen Sie unsere neuesten Case Studies und Referenzen.

Mit freundlichen Grüßen
Unicum Tech Team

Abmelden: [Link]',
  'marketing',
  true
),
(
  'Welcome Email Template',
  'Herzlich willkommen bei {{company_name}}!',
  '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 50px 30px; text-align: center; position: relative; }
        .header::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); opacity: 0.3; }
        .header h1 { font-size: 32px; margin-bottom: 10px; position: relative; z-index: 1; }
        .header p { font-size: 18px; opacity: 0.9; position: relative; z-index: 1; }
        .content { padding: 50px 40px; }
        .welcome-message { text-align: center; margin-bottom: 40px; }
        .welcome-message h2 { color: #1e293b; font-size: 24px; margin-bottom: 15px; }
        .welcome-message p { color: #64748b; font-size: 16px; line-height: 1.6; }
        .features { display: flex; flex-wrap: wrap; gap: 20px; margin: 40px 0; }
        .feature { flex: 1; min-width: 200px; padding: 25px; background: #f8fafc; border-radius: 8px; text-align: center; }
        .feature h3 { color: #1e293b; margin-bottom: 10px; }
        .feature p { color: #64748b; font-size: 14px; }
        .cta { text-align: center; margin: 40px 0; }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: transform 0.2s; }
        .cta-btn:hover { transform: translateY(-2px); }
        .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Willkommen!</h1>
            <p>Schön, dass Sie bei uns sind</p>
        </div>
        
        <div class="content">
            <div class="welcome-message">
                <h2>Hallo {{first_name}}!</h2>
                <p>Herzlich willkommen bei Unicum Tech! Wir freuen uns sehr, Sie in unserem Team begrüßen zu dürfen. Sie haben den ersten Schritt zu einer erfolgreichen digitalen Transformation gemacht.</p>
            </div>
            
            <div class="features">
                <div class="feature">
                    <h3>🚀 Schneller Start</h3>
                    <p>Legen Sie sofort los mit unseren bewährten Lösungen</p>
                </div>
                <div class="feature">
                    <h3>💡 Expertise</h3>
                    <p>Profitieren Sie von unserer langjährigen Erfahrung</p>
                </div>
                <div class="feature">
                    <h3>🤝 Support</h3>
                    <p>Unser Team steht Ihnen jederzeit zur Verfügung</p>
                </div>
            </div>
            
            <div class="cta">
                <a href="#" class="cta-btn">Jetzt loslegen</a>
            </div>
            
            <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #0891b2; margin-bottom: 10px;">💡 Tipp</h3>
                <p style="color: #164e63; margin: 0;">Besuchen Sie unser Kundenportal für exklusive Ressourcen und Updates zu Ihren Projekten.</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Unicum Tech</strong></p>
            <p>Ihr Partner für digitale Innovation</p>
            <p style="margin-top: 15px; font-size: 12px;">
                <a href="#" style="color: #3b82f6;">Kontakt</a> | 
                <a href="#" style="color: #3b82f6;">Website</a> | 
                <a href="#" style="color: #3b82f6;">Abmelden</a>
            </p>
        </div>
    </div>
</body>
</html>',
  'Herzlich willkommen bei Unicum Tech!

Hallo {{first_name}}!

Wir freuen uns sehr, Sie begrüßen zu dürfen. Sie haben den ersten Schritt zu einer erfolgreichen digitalen Transformation gemacht.

IHRE VORTEILE:
- Schneller Start mit bewährten Lösungen
- Expertise aus langjähriger Erfahrung  
- Persönlicher Support jederzeit

Jetzt loslegen: [Link]

Mit freundlichen Grüßen
Unicum Tech Team',
  'transactional',
  true
),
(
  'Promotional Campaign Template',
  '🎯 Exklusives Angebot: {{offer_title}}',
  '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exklusives Angebot</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f3f4f6; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center; position: relative; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { font-size: 16px; opacity: 0.9; }
        .offer-box { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; text-align: center; padding: 30px; margin: -10px 20px 30px; border-radius: 12px; box-shadow: 0 8px 25px rgba(220,38,38,0.3); }
        .discount { font-size: 48px; font-weight: bold; margin-bottom: 10px; }
        .offer-text { font-size: 18px; margin-bottom: 15px; }
        .validity { font-size: 14px; opacity: 0.9; }
        .content { padding: 0 30px 30px; }
        .benefits { margin: 30px 0; }
        .benefit { display: flex; align-items: center; margin-bottom: 15px; }
        .benefit-icon { width: 20px; height: 20px; background: #10b981; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; }
        .cta { text-align: center; margin: 40px 0; }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 25px rgba(220,38,38,0.3); transition: all 0.3s; }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(220,38,38,0.4); }
        .urgency { background: #fef3c7; border: 2px dashed #f59e0b; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .urgency h3 { color: #d97706; margin-bottom: 10px; }
        .urgency p { color: #92400e; font-weight: bold; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">🔥 LIMITIERTES ANGEBOT</div>
            <h1>Exklusiv für Sie!</h1>
            <p>Nur für kurze Zeit verfügbar</p>
        </div>
        
        <div class="offer-box">
            <div class="discount">50%</div>
            <div class="offer-text">Rabatt auf alle Premium-Services</div>
            <div class="validity">Gültig bis {{expiry_date}}</div>
        </div>
        
        <div class="content">
            <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">Hallo {{first_name}}!</h2>
            <p style="color: #4b5563; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                Wir haben ein exklusives Angebot speziell für Sie! Nutzen Sie jetzt die Chance und sparen Sie 50% auf unsere Premium-Dienstleistungen.
            </p>
            
            <div class="benefits">
                <h3 style="color: #1f2937; margin-bottom: 20px;">Das erhalten Sie:</h3>
                <div class="benefit">
                    <div class="benefit-icon">✓</div>
                    <div>
                        <strong>Premium Web-Design</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Professionelle Websites mit modernem Design</span>
                    </div>
                </div>
                <div class="benefit">
                    <div class="benefit-icon">✓</div>
                    <div>
                        <strong>SEO-Optimierung</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Bessere Sichtbarkeit in Suchmaschinen</span>
                    </div>
                </div>
                <div class="benefit">
                    <div class="benefit-icon">✓</div>
                    <div>
                        <strong>Digital Marketing</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Effektive Online-Marketing-Strategien</span>
                    </div>
                </div>
                <div class="benefit">
                    <div class="benefit-icon">✓</div>
                    <div>
                        <strong>Persönlicher Support</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">Direkter Zugang zu unseren Experten</span>
                    </div>
                </div>
            </div>
            
            <div class="cta">
                <a href="#" class="cta-btn">Jetzt 50% sparen</a>
            </div>
            
            <div class="urgency">
                <h3>⏰ Nur noch wenige Stunden!</h3>
                <p>Dieses Angebot läuft in Kürze ab. Sichern Sie sich jetzt Ihren Rabatt!</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Unicum Tech</strong></p>
            <p>Ihr Partner für digitale Excellence</p>
            <p style="margin-top: 15px; font-size: 12px;">
                <a href="#" style="color: #f59e0b;">Angebot ansehen</a> | 
                <a href="#" style="color: #f59e0b;">Kontakt</a> | 
                <a href="#" style="color: #6b7280;">Abmelden</a>
            </p>
        </div>
    </div>
</body>
</html>',
  'EXKLUSIVES ANGEBOT: 50% Rabatt!

Hallo {{first_name}}!

Limitiertes Angebot nur für Sie - 50% Rabatt auf alle Premium-Services!

IHRE VORTEILE:
✓ Premium Web-Design
✓ SEO-Optimierung  
✓ Digital Marketing
✓ Persönlicher Support

Gültig bis: {{expiry_date}}

Jetzt 50% sparen: [Link]

⏰ Nur noch wenige Stunden verfügbar!

Unicum Tech Team',
  'marketing',
  true
);