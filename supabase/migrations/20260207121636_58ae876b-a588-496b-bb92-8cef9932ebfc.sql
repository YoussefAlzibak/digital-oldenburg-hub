-- Insert Service-Templates für die Template-Verwaltung
-- Diese werden aus QuickCampaignTemplates in die Datenbank migriert

INSERT INTO public.email_templates (name, subject, html_content, template_type, is_active)
VALUES
-- 50% Rabatt auf alle Dienstleistungen
('50% Rabatt auf alle Dienstleistungen', 
 '🔥 50% RABATT auf alle Dienstleistungen - Nur für kurze Zeit!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Exklusives Angebot</p>
    <h1 style="color: white; font-size: 42px; margin: 10px 0; font-weight: 800;">50% RABATT</h1>
    <p style="color: white; font-size: 18px; margin: 0;">auf ALLE unsere Dienstleistungen!</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>wir haben ein <strong>einmaliges Angebot</strong> für Sie! Für kurze Zeit erhalten Sie <strong style="color: #dc2626;">50% Rabatt</strong> auf alle unsere professionellen Dienstleistungen.</p>
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px dashed #f59e0b; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #92400e; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr Gutscheincode:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">SERVICES50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 30px 0 20px 0; text-align: center;">🚀 Unsere Dienstleistungen:</h3>
    <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #4ecdc4;">
      <h4 style="color: #1e3a5f; margin: 0 0 8px 0;">🌐 Webdesign & Development</h4>
      <p style="color: #dc2626; font-weight: 600; margin: 0;"><s style="color: #999;">ab 2.000€</s> → <strong>ab 1.000€</strong></p>
    </div>
    <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #667eea;">
      <h4 style="color: #1e3a5f; margin: 0 0 8px 0;">👥 CRM & HubSpot Solutions</h4>
      <p style="color: #dc2626; font-weight: 600; margin: 0;"><s style="color: #999;">ab 1.500€</s> → <strong>ab 750€</strong></p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">🎁 Jetzt 50% sichern!</a>
    </div>
  </div>
</div>',
 'promotion', true),

-- Webdesign Sonderaktion
('Webdesign Sonderaktion',
 '🌐 50% Rabatt auf Ihr neues Webdesign-Projekt!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Webdesign Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">🌐 WEBDESIGN</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>Sie planen eine neue Website? Jetzt ist der perfekte Zeitpunkt! Wir bieten Ihnen <strong style="color: #0ea5e9;">50% Rabatt</strong> auf alle Webdesign-Projekte.</p>
    <div style="background: linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%); border: 3px dashed #0ea5e9; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #0369a1; margin: 0; text-transform: uppercase;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0;">WEBDESIGN50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">✨ Was Sie erhalten:</h3>
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>🎨 Individuelles, modernes Design</li>
      <li>📱 100% responsive für alle Geräte</li>
      <li>⚡ Optimierte Ladezeiten</li>
      <li>🔍 SEO-Grundoptimierung inklusive</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">🌐 Jetzt Beratung anfragen</a>
    </div>
  </div>
</div>',
 'promotion', true),

-- Branding Sonderaktion
('Branding Sonderaktion',
 '🎨 50% auf Ihr Corporate Design & Branding!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #ef4444 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Branding Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">🎨 BRANDING</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>Ihre Marke verdient einen starken Auftritt! Sichern Sie sich jetzt <strong style="color: #ec4899;">50% Rabatt</strong> auf unser komplettes Branding-Paket.</p>
    <div style="background: linear-gradient(135deg, #fce7f3 0%, #fecdd3 100%); border: 3px dashed #ec4899; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #9d174d; margin: 0; text-transform: uppercase;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0;">BRANDING50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">🎯 Unser Branding-Paket:</h3>
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>✏️ Logo-Design mit Varianten</li>
      <li>🎨 Farbpalette & Typografie</li>
      <li>📋 Brand Guidelines</li>
      <li>📄 Geschäftsausstattung</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">🎨 Branding-Beratung anfragen</a>
    </div>
  </div>
</div>',
 'promotion', true),

-- IT-Services Sonderaktion
('IT-Services Sonderaktion',
 '⚙️ 50% auf IT-Services & Smart Home Lösungen!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">IT-Services Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">⚙️ IT-SERVICES</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>Optimieren Sie Ihre IT-Infrastruktur! <strong style="color: #f59e0b;">50% Rabatt</strong> auf alle IT-Services und Smart Home Lösungen.</p>
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px dashed #f59e0b; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #92400e; margin: 0; text-transform: uppercase;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0;">ITSERVICE50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">🔧 Unsere IT-Services:</h3>
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>🖥️ IT-Beratung & Support</li>
      <li>🏠 Smart Home Einrichtung</li>
      <li>🔒 Netzwerk-Sicherheit</li>
      <li>☁️ Cloud-Lösungen</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">⚙️ IT-Beratung anfragen</a>
    </div>
  </div>
</div>',
 'promotion', true),

-- SEO Sonderaktion
('SEO Sonderaktion',
 '🔍 50% auf SEO-Optimierung - Mehr Sichtbarkeit!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">SEO Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">🔍 SEO</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>Werden Sie bei Google gefunden! <strong style="color: #10b981;">50% Rabatt</strong> auf unsere SEO-Optimierung.</p>
    <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 3px dashed #10b981; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #065f46; margin: 0; text-transform: uppercase;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0;">SEO50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">📈 SEO-Leistungen:</h3>
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>🔍 Keyword-Analyse</li>
      <li>📝 Content-Optimierung</li>
      <li>🔗 Backlink-Aufbau</li>
      <li>📊 Monatliche Reports</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">🔍 SEO-Analyse anfragen</a>
    </div>
  </div>
</div>',
 'promotion', true),

-- Mobile App Sonderaktion
('Mobile App Sonderaktion',
 '📱 50% auf Ihre Mobile App Entwicklung!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Mobile App Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">📱 MOBILE APPS</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>Ihre App-Idee verdient es, Realität zu werden! <strong style="color: #8b5cf6;">50% Rabatt</strong> auf Mobile App Entwicklung.</p>
    <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border: 3px dashed #8b5cf6; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #5b21b6; margin: 0; text-transform: uppercase;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0;">MOBILEAPP50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">📲 App-Entwicklung:</h3>
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>📱 iOS & Android Apps</li>
      <li>🎨 UI/UX Design</li>
      <li>🔄 API-Integration</li>
      <li>🚀 App Store Veröffentlichung</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">📱 App-Beratung anfragen</a>
    </div>
  </div>
</div>',
 'promotion', true),

-- E-Mail Marketing Sonderaktion
('E-Mail Marketing Sonderaktion',
 '📧 50% auf E-Mail Marketing Setup!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">E-Mail Marketing Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">📧 E-MAIL MARKETING</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>Automatisieren Sie Ihre Kundenkommunikation! <strong style="color: #06b6d4;">50% Rabatt</strong> auf E-Mail Marketing Setup.</p>
    <div style="background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%); border: 3px dashed #06b6d4; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #155e75; margin: 0; text-transform: uppercase;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0;">EMAIL50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">📬 E-Mail Marketing:</h3>
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>📋 Newsletter-Templates</li>
      <li>🔄 Automatisierte Sequenzen</li>
      <li>📊 Performance-Tracking</li>
      <li>🎯 Segmentierung</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">📧 E-Mail Marketing anfragen</a>
    </div>
  </div>
</div>',
 'promotion', true),

-- CRM Setup Sonderaktion
('CRM Setup Sonderaktion',
 '👥 50% auf CRM & HubSpot Setup!',
 '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">CRM Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">👥 CRM SETUP</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">Hallo {{first_name}},<br><br>Optimieren Sie Ihre Kundenbeziehungen! <strong style="color: #6366f1;">50% Rabatt</strong> auf CRM & HubSpot Setup.</p>
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border: 3px dashed #6366f1; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #3730a3; margin: 0; text-transform: uppercase;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0;">CRM50</p>
    </div>
    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">🎯 CRM-Leistungen:</h3>
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>📊 HubSpot Einrichtung</li>
      <li>🔄 Daten-Migration</li>
      <li>📅 Termin- & Aufgabenverwaltung</li>
      <li>📈 Reports & Dashboards</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px;">👥 CRM-Beratung anfragen</a>
    </div>
  </div>
</div>',
 'promotion', true);