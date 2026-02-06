import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Newspaper, 
  Calendar, 
  Megaphone, 
  Heart,
  Sparkles,
  Star,
  Zap,
  Globe,
  Palette,
  Monitor,
  Smartphone,
  Search,
  Mail,
  Users
} from 'lucide-react';

interface QuickTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  subject: string;
  htmlContent: string;
}

interface QuickCampaignTemplatesProps {
  onSelectTemplate: (template: QuickTemplate) => void;
}

const quickTemplates: QuickTemplate[] = [
  {
    id: 'welcome',
    name: 'Willkommens-Newsletter',
    description: 'Begrüßen Sie neue Abonnenten herzlich',
    icon: Heart,
    category: 'Onboarding',
    subject: '🎉 Willkommen bei {{company_name}}!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #1e3a5f; font-size: 28px;">Willkommen, {{first_name}}! 🎉</h1>
  
  <p style="font-size: 16px; line-height: 1.6; color: #333;">
    Wir freuen uns sehr, dass Sie Teil unserer Community geworden sind. Bei <strong>{{company_name}}</strong> 
    sind wir leidenschaftlich daran interessiert, Ihnen die besten digitalen Lösungen zu bieten.
  </p>
  
  <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
    <h3 style="color: #1e3a5f; margin-top: 0;">🎁 Was Sie erwartet:</h3>
    <ul style="color: #444; line-height: 1.8;">
      <li>Exklusive Einblicke in aktuelle Web-Trends</li>
      <li>Tipps zur Optimierung Ihrer Online-Präsenz</li>
      <li>Besondere Angebote nur für Newsletter-Abonnenten</li>
      <li>Neuigkeiten aus unserer Digitalagentur</li>
    </ul>
  </div>
  
  <p style="font-size: 16px; line-height: 1.6; color: #333;">
    Haben Sie Fragen oder möchten Sie ein Projekt mit uns starten? 
    Wir sind nur eine Nachricht entfernt!
  </p>
  
  <a href="{{website_url}}/kontakt" style="display: inline-block; background: #4ecdc4; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0;">
    Jetzt Kontakt aufnehmen →
  </a>
  
  <p style="color: #666; font-size: 14px; margin-top: 30px;">
    Herzliche Grüße,<br>
    <strong>Ihr {{company_name}} Team</strong>
  </p>
</div>`
  },
  {
    id: 'newsletter',
    name: 'Monatlicher Newsletter',
    description: 'Regelmäßige Updates und News',
    icon: Newspaper,
    category: 'Newsletter',
    subject: '📬 Ihre {{current_month}}-News von {{company_name}}',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #1e3a5f; font-size: 26px;">Newsletter {{current_month}} {{current_year}} 📰</h1>
  
  <p style="font-size: 16px; line-height: 1.6; color: #333;">
    Hallo {{first_name}},<br><br>
    hier sind die neuesten Updates aus der digitalen Welt!
  </p>
  
  <div style="border-left: 4px solid #4ecdc4; padding-left: 20px; margin: 25px 0;">
    <h2 style="color: #1e3a5f; font-size: 20px; margin-bottom: 10px;">🚀 Highlight des Monats</h2>
    <p style="color: #444; line-height: 1.6;">
      [Hier Ihren Hauptinhalt einfügen - z.B. ein neues Projekt, eine Erfolgsgeschichte oder einen wichtigen Trend]
    </p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0;">
    <h3 style="color: #1e3a5f; margin-top: 0;">💡 Tipps & Tricks</h3>
    <ul style="color: #444; line-height: 1.8; padding-left: 20px;">
      <li>Tipp 1: [Ihr hilfreicher Tipp]</li>
      <li>Tipp 2: [Weiterer nützlicher Hinweis]</li>
      <li>Tipp 3: [Bonus-Empfehlung]</li>
    </ul>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{website_url}}" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
      Mehr auf unserer Website →
    </a>
  </div>
  
  <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
    Mit freundlichen Grüßen,<br>
    <strong>Ihr {{company_name}} Team</strong>
  </p>
</div>`
  },
  {
    id: 'promotion',
    name: 'Sonderangebot',
    description: 'Bewerben Sie spezielle Aktionen',
    icon: Gift,
    category: 'Marketing',
    subject: '🔥 Exklusives Angebot nur für Sie, {{first_name}}!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; font-size: 32px; margin: 0;">🎁 EXKLUSIVES ANGEBOT</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 10px 0 0 0;">Nur für Newsletter-Abonnenten!</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      als Dankeschön für Ihre Treue haben wir ein besonderes Angebot für Sie!
    </p>
    
    <div style="background: #fef3c7; border: 2px dashed #f59e0b; padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0;">
      <p style="font-size: 14px; color: #92400e; margin: 0;">GUTSCHEINCODE:</p>
      <p style="font-size: 28px; font-weight: bold; color: #1e3a5f; margin: 10px 0; letter-spacing: 2px;">SPAREN20</p>
      <p style="font-size: 24px; color: #dc2626; font-weight: bold; margin: 0;">20% RABATT</p>
      <p style="font-size: 12px; color: #666; margin: 10px 0 0 0;">Gültig bis: [Datum einfügen]</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px;">
        Jetzt Angebot sichern! →
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; text-align: center;">
      <em>* Dieses Angebot ist exklusiv und nicht übertragbar.</em>
    </p>
  </div>
</div>`
  },
  {
    id: 'event',
    name: 'Event-Einladung',
    description: 'Laden Sie zu Veranstaltungen ein',
    icon: Calendar,
    category: 'Events',
    subject: '📅 Einladung: [Event-Name] am [Datum]',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1e3a5f; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="font-size: 14px; margin: 0; opacity: 0.8;">SIE SIND EINGELADEN!</p>
    <h1 style="font-size: 28px; margin: 10px 0;">[Event-Name]</h1>
    <p style="font-size: 16px; margin: 0; color: #4ecdc4;">[Datum] • [Uhrzeit]</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Liebe/r {{first_name}},<br><br>
      wir freuen uns, Sie zu unserem exklusiven Event einzuladen!
    </p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <h3 style="color: #1e3a5f; margin-top: 0;">📍 Event-Details</h3>
      <table style="width: 100%; color: #444;">
        <tr>
          <td style="padding: 8px 0;"><strong>📅 Datum:</strong></td>
          <td>[Datum einfügen]</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🕐 Uhrzeit:</strong></td>
          <td>[Uhrzeit einfügen]</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>📍 Ort:</strong></td>
          <td>[Veranstaltungsort]</td>
        </tr>
      </table>
    </div>
    
    <h3 style="color: #1e3a5f;">Was Sie erwartet:</h3>
    <ul style="color: #444; line-height: 1.8;">
      <li>[Highlight 1]</li>
      <li>[Highlight 2]</li>
      <li>[Highlight 3]</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: #4ecdc4; color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        ✓ Teilnahme bestätigen
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; text-align: center;">
      Wir freuen uns auf Sie!<br>
      <strong>Ihr {{company_name}} Team</strong>
    </p>
  </div>
</div>`
  },
  {
    id: 'announcement',
    name: 'Wichtige Ankündigung',
    description: 'Teilen Sie wichtige Neuigkeiten',
    icon: Megaphone,
    category: 'News',
    subject: '📢 Wichtige Neuigkeit von {{company_name}}',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; text-align: center;">
    <h1 style="font-size: 26px; margin: 0;">📢 Wichtige Ankündigung</h1>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Liebe/r {{first_name}},<br><br>
      wir haben aufregende Neuigkeiten für Sie!
    </p>
    
    <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 20px; margin: 25px 0;">
      <h3 style="color: #0c4a6e; margin: 0 0 10px 0;">[Überschrift der Ankündigung]</h3>
      <p style="color: #0369a1; margin: 0; line-height: 1.6;">
        [Beschreiben Sie hier Ihre wichtige Neuigkeit. Was hat sich geändert? 
        Was bedeutet das für Ihre Kunden? Welche Vorteile bringt es?]
      </p>
    </div>
    
    <h3 style="color: #1e3a5f;">Was das für Sie bedeutet:</h3>
    <ul style="color: #444; line-height: 1.8;">
      <li>✓ [Vorteil 1]</li>
      <li>✓ [Vorteil 2]</li>
      <li>✓ [Vorteil 3]</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Mehr erfahren →
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      Bei Fragen stehen wir Ihnen gerne zur Verfügung.<br><br>
      Herzliche Grüße,<br>
      <strong>Ihr {{company_name}} Team</strong>
    </p>
  </div>
</div>`
  },
  {
    id: 'services-discount',
    name: '50% Rabatt auf alle Dienstleistungen',
    description: 'Bewerben Sie alle Services mit Sonderrabatt',
    icon: Zap,
    category: 'Marketing',
    subject: '🔥 50% RABATT auf alle Dienstleistungen - Nur für kurze Zeit!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Exklusives Angebot</p>
    <h1 style="color: white; font-size: 42px; margin: 10px 0; font-weight: 800;">50% RABATT</h1>
    <p style="color: white; font-size: 18px; margin: 0;">auf ALLE unsere Dienstleistungen!</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      wir haben ein <strong>einmaliges Angebot</strong> für Sie! Für kurze Zeit erhalten Sie <strong style="color: #dc2626;">50% Rabatt</strong> auf alle unsere professionellen Dienstleistungen.
    </p>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px dashed #f59e0b; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #92400e; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr Gutscheincode:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">SERVICES50</p>
      <p style="font-size: 14px; color: #666; margin: 0;">Gültig bis: [Datum einfügen]</p>
    </div>

    <h3 style="color: #1e3a5f; margin: 30px 0 20px 0; text-align: center;">🚀 Unsere Dienstleistungen im Überblick:</h3>
    
    <div style="display: table; width: 100%;">
      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #4ecdc4;">
        <h4 style="color: #1e3a5f; margin: 0 0 8px 0;">🌐 Webdesign & Development</h4>
        <p style="color: #666; margin: 0; font-size: 14px;">Moderne, responsive Websites mit fokussiertem UX/UI Design</p>
        <p style="color: #dc2626; font-weight: 600; margin: 8px 0 0 0;"><s style="color: #999;">ab 2.000€</s> → <strong>ab 1.000€</strong></p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #667eea;">
        <h4 style="color: #1e3a5f; margin: 0 0 8px 0;">👥 CRM & HubSpot Solutions</h4>
        <p style="color: #666; margin: 0; font-size: 14px;">Professionelle CRM-Systeme für optimierte Kundenverwaltung</p>
        <p style="color: #dc2626; font-weight: 600; margin: 8px 0 0 0;"><s style="color: #999;">ab 1.500€</s> → <strong>ab 750€</strong></p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
        <h4 style="color: #1e3a5f; margin: 0 0 8px 0;">⚙️ IT-Services & Smart Home</h4>
        <p style="color: #666; margin: 0; font-size: 14px;">Umfassende IT-Betreuung und moderne Smart Home Lösungen</p>
        <p style="color: #dc2626; font-weight: 600; margin: 8px 0 0 0;"><s style="color: #999;">ab 800€</s> → <strong>ab 400€</strong></p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #ec4899;">
        <h4 style="color: #1e3a5f; margin: 0 0 8px 0;">🎨 Print Design & Branding</h4>
        <p style="color: #666; margin: 0; font-size: 14px;">Professionelle Print-Materialien und Corporate Identity</p>
        <p style="color: #dc2626; font-weight: 600; margin: 8px 0 0 0;"><s style="color: #999;">ab 600€</s> → <strong>ab 300€</strong></p>
      </div>
    </div>

    <div style="background: #dcfce7; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="color: #166534; margin: 0; font-size: 16px;">
        ✅ <strong>Warum jetzt handeln?</strong><br>
        <span style="font-size: 14px;">Dieses Angebot ist zeitlich begrenzt und gilt nur für Neuprojekte!</span>
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);">
        🎁 Jetzt 50% sichern!
      </a>
    </div>
    
    <p style="color: #666; font-size: 13px; text-align: center; margin-top: 25px;">
      <em>* Angebot gültig für Neuprojekte. Nicht kombinierbar mit anderen Rabatten.</em>
    </p>
    
    <div style="border-top: 1px solid #eee; margin-top: 25px; padding-top: 20px;">
      <p style="color: #666; font-size: 14px; margin: 0;">
        Haben Sie Fragen? Wir sind für Sie da!<br><br>
        Herzliche Grüße,<br>
        <strong>Ihr {{company_name}} Team</strong>
      </p>
    </div>
  </div>
</div>`
  },
  {
    id: 'webdesign-action',
    name: 'Webdesign Sonderaktion',
    description: '50% Rabatt auf Webdesign-Projekte',
    icon: Globe,
    category: 'Services',
    subject: '🌐 50% Rabatt auf Ihr neues Webdesign-Projekt!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Webdesign Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">🌐 WEBDESIGN</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      Sie planen eine neue Website oder möchten Ihre bestehende modernisieren? Jetzt ist der perfekte Zeitpunkt! 
      Wir bieten Ihnen <strong style="color: #0ea5e9;">50% Rabatt</strong> auf alle Webdesign-Projekte.
    </p>
    
    <div style="background: linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%); border: 3px dashed #0ea5e9; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #0369a1; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">WEBDESIGN50</p>
    </div>

    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">✨ Was Sie erhalten:</h3>
    
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>🎨 Individuelles, modernes Design nach Ihren Wünschen</li>
      <li>📱 100% responsive für alle Geräte</li>
      <li>⚡ Optimierte Ladezeiten & Performance</li>
      <li>🔍 SEO-Grundoptimierung inklusive</li>
      <li>🛠️ CMS für einfache Selbstverwaltung</li>
      <li>🔒 SSL-Zertifikat & Sicherheit</li>
    </ul>

    <div style="background: #f0fdf4; border-radius: 10px; padding: 20px; margin: 25px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="color: #166534;"><strong>Normale Preise:</strong></td>
          <td style="text-align: right; color: #999; text-decoration: line-through;">ab 2.000€</td>
        </tr>
        <tr>
          <td style="color: #166534; font-size: 18px;"><strong>Mit Rabatt:</strong></td>
          <td style="text-align: right; color: #16a34a; font-size: 24px; font-weight: 800;">ab 1.000€</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);">
        🚀 Jetzt Projekt starten
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px; text-align: center;">
      Ihr {{company_name}} Team
    </p>
  </div>
</div>`
  },
  {
    id: 'branding-action',
    name: 'Branding & Corporate Design',
    description: 'Rabattaktion für Markenentwicklung',
    icon: Palette,
    category: 'Services',
    subject: '🎨 Ihre neue Markenidentität - Jetzt 50% günstiger!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Branding Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">🎨 BRANDING</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      Eine starke Marke ist der Schlüssel zum Erfolg! Entwickeln Sie mit uns Ihre einzigartige Corporate Identity 
      – jetzt mit <strong style="color: #8b5cf6;">50% Rabatt</strong>.
    </p>
    
    <div style="background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%); border: 3px dashed #a855f7; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #7c3aed; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">BRANDING50</p>
    </div>

    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">🎯 Unser Branding-Paket:</h3>
    
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>🖌️ Professionelles Logo-Design (3 Entwürfe)</li>
      <li>🎨 Komplette Farbpalette & Typografie</li>
      <li>📄 Visitenkarten & Briefpapier Design</li>
      <li>📘 Brand Guidelines Dokument</li>
      <li>📱 Social Media Vorlagen</li>
      <li>📁 Alle Dateien in verschiedenen Formaten</li>
    </ul>

    <div style="background: #faf5ff; border-radius: 10px; padding: 20px; margin: 25px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="color: #7c3aed;"><strong>Normalpreis:</strong></td>
          <td style="text-align: right; color: #999; text-decoration: line-through;">ab 1.200€</td>
        </tr>
        <tr>
          <td style="color: #7c3aed; font-size: 18px;"><strong>Mit Rabatt:</strong></td>
          <td style="text-align: right; color: #a855f7; font-size: 24px; font-weight: 800;">ab 600€</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
        ✨ Marke entwickeln
      </a>
    </div>
  </div>
</div>`
  },
  {
    id: 'it-service-action',
    name: 'IT-Service Sonderaktion',
    description: '50% auf IT-Support & Smart Home',
    icon: Monitor,
    category: 'Services',
    subject: '⚙️ 50% Rabatt auf IT-Services & Smart Home!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #334155 50%, #475569 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">IT-Service Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">⚙️ IT-SERVICES</h1>
    <p style="color: #4ecdc4; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      Optimieren Sie Ihre IT-Infrastruktur oder verwandeln Sie Ihr Zuhause in ein Smart Home 
      – jetzt mit <strong style="color: #1e3a5f;">50% Rabatt</strong> auf alle IT-Dienstleistungen!
    </p>
    
    <div style="background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); border: 3px dashed #1e3a5f; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #0369a1; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">ITSERVICE50</p>
    </div>

    <div style="display: table; width: 100%;">
      <div style="background: #f8fafc; border-radius: 10px; padding: 15px; margin-bottom: 12px; border-left: 4px solid #4ecdc4;">
        <h4 style="color: #1e3a5f; margin: 0 0 5px 0;">💻 PC & Laptop Service</h4>
        <p style="color: #666; margin: 0; font-size: 13px;">Reparatur, Wartung, Optimierung</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 10px; padding: 15px; margin-bottom: 12px; border-left: 4px solid #667eea;">
        <h4 style="color: #1e3a5f; margin: 0 0 5px 0;">🏠 Smart Home Installation</h4>
        <p style="color: #666; margin: 0; font-size: 13px;">Beleuchtung, Heizung, Sicherheit</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 10px; padding: 15px; margin-bottom: 12px; border-left: 4px solid #f59e0b;">
        <h4 style="color: #1e3a5f; margin: 0 0 5px 0;">🔧 Netzwerk & Server</h4>
        <p style="color: #666; margin: 0; font-size: 13px;">Einrichtung, Wartung, Sicherheit</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 10px; padding: 15px; border-left: 4px solid #ec4899;">
        <h4 style="color: #1e3a5f; margin: 0 0 5px 0;">☁️ Cloud & Backup</h4>
        <p style="color: #666; margin: 0; font-size: 13px;">Datensicherung, Cloud-Lösungen</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #334155 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(30, 58, 95, 0.4);">
        🔧 IT-Service anfragen
      </a>
    </div>
  </div>
</div>`
  },
  {
    id: 'mobile-app-action',
    name: 'Mobile App Entwicklung',
    description: 'Rabatt auf App-Entwicklung',
    icon: Smartphone,
    category: 'Services',
    subject: '📱 Ihre eigene App - 50% Rabatt auf Entwicklung!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">App Entwicklung</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">📱 MOBILE APPS</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      Bringen Sie Ihr Business aufs Smartphone! Wir entwickeln Ihre individuelle App 
      – jetzt mit <strong style="color: #10b981;">50% Rabatt</strong>.
    </p>
    
    <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 3px dashed #10b981; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #047857; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">MOBILEAPP50</p>
    </div>

    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">📲 Was wir bieten:</h3>
    
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>📱 Native iOS & Android Apps</li>
      <li>⚡ Cross-Platform Entwicklung</li>
      <li>🎨 Individuelles UI/UX Design</li>
      <li>🔗 Backend & API Integration</li>
      <li>📊 Analytics & Monitoring</li>
      <li>🛠️ Wartung & Support</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
        📱 App-Projekt starten
      </a>
    </div>
  </div>
</div>`
  },
  {
    id: 'seo-action',
    name: 'SEO Optimierung',
    description: 'Rabatt auf Suchmaschinenoptimierung',
    icon: Search,
    category: 'Services',
    subject: '🔍 50% auf SEO - Werden Sie bei Google gefunden!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">SEO Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">🔍 SEO</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      Werden Sie bei Google gefunden! Mit professioneller SEO-Optimierung steigern wir Ihre Sichtbarkeit 
      – jetzt mit <strong style="color: #f59e0b;">50% Rabatt</strong>.
    </p>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px dashed #f59e0b; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #92400e; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">SEO50</p>
    </div>

    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">📈 Unsere SEO-Leistungen:</h3>
    
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>🔍 Keyword-Analyse & Strategie</li>
      <li>📝 OnPage-Optimierung</li>
      <li>🔗 Technisches SEO</li>
      <li>📊 Monatliche Reports</li>
      <li>🏆 Local SEO für regionale Sichtbarkeit</li>
      <li>⚡ Core Web Vitals Optimierung</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">
        📈 SEO-Beratung anfragen
      </a>
    </div>
  </div>
</div>`
  },
  {
    id: 'email-marketing-action',
    name: 'E-Mail Marketing Setup',
    description: 'Rabatt auf E-Mail Marketing',
    icon: Mail,
    category: 'Services',
    subject: '📧 50% auf E-Mail Marketing - Mehr Umsatz generieren!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">E-Mail Marketing</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">📧 EMAIL</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      E-Mail Marketing ist der Umsatzbringer Nr. 1! Wir richten Ihr komplettes E-Mail Marketing System ein 
      – jetzt mit <strong style="color: #ec4899;">50% Rabatt</strong>.
    </p>
    
    <div style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border: 3px dashed #ec4899; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #be185d; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">EMAIL50</p>
    </div>

    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">💌 Was Sie erhalten:</h3>
    
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>📧 Newsletter-System Einrichtung</li>
      <li>🎨 Professionelle E-Mail Templates</li>
      <li>🤖 Automatisierte E-Mail Sequenzen</li>
      <li>📊 Analytics & A/B Testing</li>
      <li>👥 Subscriber Management</li>
      <li>📱 Mobil-optimierte Designs</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);">
        📧 E-Mail Marketing starten
      </a>
    </div>
  </div>
</div>`
  },
  {
    id: 'crm-action',
    name: 'CRM System Setup',
    description: 'Rabatt auf CRM-Einrichtung',
    icon: Users,
    category: 'Services',
    subject: '👥 50% auf CRM-System - Kunden besser verwalten!',
    htmlContent: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">CRM Aktion</p>
    <h1 style="color: white; font-size: 38px; margin: 10px 0; font-weight: 800;">👥 CRM SYSTEM</h1>
    <p style="color: white; font-size: 24px; margin: 0; font-weight: 700;">50% RABATT</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hallo {{first_name}},<br><br>
      Verwalten Sie Ihre Kundenbeziehungen professionell! Wir richten Ihr maßgeschneidertes CRM-System ein 
      – jetzt mit <strong style="color: #6366f1;">50% Rabatt</strong>.
    </p>
    
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border: 3px dashed #6366f1; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
      <p style="font-size: 12px; color: #4338ca; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Ihr exklusiver Code:</p>
      <p style="font-size: 32px; font-weight: 800; color: #1e3a5f; margin: 10px 0; letter-spacing: 3px;">CRM50</p>
    </div>

    <h3 style="color: #1e3a5f; margin: 25px 0 15px 0;">💼 CRM-Paket beinhaltet:</h3>
    
    <ul style="color: #444; line-height: 2; padding-left: 20px;">
      <li>👥 Kundendatenbank Einrichtung</li>
      <li>📊 Sales Pipeline Management</li>
      <li>📧 E-Mail Integration</li>
      <li>📅 Termin- & Aufgabenverwaltung</li>
      <li>📈 Reports & Dashboards</li>
      <li>🔄 Automatisierungen & Workflows</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{website_url}}/kontakt" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);">
        👥 CRM-Beratung anfragen
      </a>
    </div>
  </div>
</div>`
  }
];

export default function QuickCampaignTemplates({ onSelectTemplate }: QuickCampaignTemplatesProps) {
  const categories = [...new Set(quickTemplates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">🚀 Schnellstart-Templates</h3>
        <p className="text-sm text-muted-foreground">
          Wählen Sie ein professionelles Template und passen Sie es an Ihre Bedürfnisse an
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card 
              key={template.id}
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all group"
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{template.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 inline mr-1" />
        Alle Templates sind vollständig anpassbar und mobil-optimiert
      </div>
    </div>
  );
}
