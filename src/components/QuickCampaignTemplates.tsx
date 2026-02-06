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
