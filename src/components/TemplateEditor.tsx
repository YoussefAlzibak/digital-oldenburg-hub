import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Save, 
  Eye, 
  Copy, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  Mail,
  User,
  Building,
  Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_type: string;
  is_active: boolean;
  created_at: string;
}

interface TemplateEditorProps {
  template?: EmailTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const defaultTemplates = {
  newsletter: {
    name: "Unicum Tech Newsletter",
    subject: "Unicum Tech Newsletter - {{current_month}} {{current_year}}",
    html_content: `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Unicum Tech Newsletter</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: 1px;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #8ec5fc; text-transform: uppercase; letter-spacing: 3px;">Newsletter {{current_month}} {{current_year}}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 24px;">Hallo {{first_name}},</h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                Willkommen zu unserem aktuellen Newsletter! Hier finden Sie die neuesten Updates und Entwicklungen aus der Welt der digitalen Lösungen.
              </p>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 25px; border-left: 4px solid #4ecdc4;">
                    <h3 style="margin: 0 0 10px 0; color: #1e3a5f; font-size: 18px;">✨ Was gibt es Neues?</h3>
                    <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                      Entdecken Sie unsere neuesten Services und innovativen Lösungen für Ihr Unternehmen.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://unicumtech.de/services" style="display: inline-block; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Mehr erfahren →</a>
              </p>
              
              <p style="margin: 25px 0 0 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                Vielen Dank für Ihr Vertrauen in Unicum Tech!
              </p>
              
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0 0 15px 0; font-size: 13px; color: #8ec5fc;">Digital Solutions by Melyou</p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                <a href="https://unicumtech.de" style="color: #4ecdc4; text-decoration: none;">Website</a> | 
                <a href="https://unicumtech.de/kontakt" style="color: #4ecdc4; text-decoration: none;">Kontakt</a> | 
                <a href="#" style="color: #4ecdc4; text-decoration: none;">Abmelden</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    text_content: `Hallo {{first_name}},

Willkommen zu unserem Newsletter für {{current_month}} {{current_year}}!

WAS GIBT ES NEUES?
Entdecken Sie unsere neuesten Services und innovativen Lösungen für Ihr Unternehmen.

Mehr erfahren: https://unicumtech.de/services

Vielen Dank für Ihr Vertrauen in Unicum Tech!

Mit freundlichen Grüßen,
Das Unicum Tech Team

---
Unicum Tech by Melyou
Website: https://unicumtech.de
Abmelden: [Link]
`
  },
  appointment_confirmation: {
    name: "Unicum Tech Terminbestätigung",
    subject: "Ihr Termin bei Unicum Tech - {{appointment_date}} um {{appointment_time}}",
    html_content: `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Terminbestätigung - Unicum Tech</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
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
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #8ec5fc; text-transform: uppercase; letter-spacing: 2px;">Digital Solutions by Melyou</p>
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
                Ihr Beratungstermin bei Unicum Tech wurde erfolgreich bestätigt. Wir freuen uns auf das Gespräch mit Ihnen!
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
              
              <p style="margin: 25px 0; color: #4a5568; font-size: 15px; line-height: 1.7; text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px;">
                💡 <strong>Tipp:</strong> Fügen Sie den Termin zu Ihrem Kalender hinzu, damit Sie ihn nicht vergessen!
              </p>
              
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0 0 15px 0; font-size: 13px; color: #8ec5fc;">Ihre Digitalagentur für maßgeschneiderte Lösungen</p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                <a href="https://unicumtech.de" style="color: #4ecdc4; text-decoration: none;">Website</a> | 
                <a href="https://unicumtech.de/kontakt" style="color: #4ecdc4; text-decoration: none;">Kontakt</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    text_content: `Hallo {{first_name}},

Ihr Beratungstermin bei Unicum Tech wurde erfolgreich bestätigt!

TERMINDETAILS:
--------------
Datum: {{appointment_date}}
Uhrzeit: {{appointment_time}}
Meeting-Art: {{meeting_type}}
Service: {{service_type}}

Meeting-Link: {{meeting_link}}

Wir freuen uns auf das Gespräch mit Ihnen!

Mit freundlichen Grüßen,
Das Unicum Tech Team

---
Unicum Tech by Melyou
Website: https://unicumtech.de
`
  },
  follow_up: {
    name: "Unicum Tech Follow-Up",
    subject: "Danke für Ihre Anfrage, {{first_name}} - Unicum Tech",
    html_content: `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Anfrage erhalten - Unicum Tech</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
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
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #8ec5fc; text-transform: uppercase; letter-spacing: 2px;">Digital Solutions by Melyou</p>
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
                <a href="https://unicumtech.de/services" style="display: inline-block; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Unsere Services entdecken →</a>
              </p>
              
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0 0 15px 0; font-size: 13px; color: #8ec5fc;">Ihre Digitalagentur für maßgeschneiderte Lösungen</p>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b8eb8;">
                Web-Entwicklung • Mobile Apps • Branding • IT-Lösungen
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                <a href="https://unicumtech.de" style="color: #4ecdc4; text-decoration: none;">Website</a> | 
                <a href="https://unicumtech.de/kontakt" style="color: #4ecdc4; text-decoration: none;">Kontakt</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    text_content: `Vielen Dank für Ihr Interesse!

Hallo {{first_name}},

vielen Dank für Ihre Anfrage bezüglich {{service_type}}.

IHRE ANFRAGE IM ÜBERBLICK:
--------------------------
Service: {{service_type}}
Unternehmen: {{company}}

Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.

Wir melden uns innerhalb von 24 Stunden bei Ihnen!

Unsere Services: https://unicumtech.de/services

Mit freundlichen Grüßen,
Das Unicum Tech Team

---
Unicum Tech by Melyou
Web-Entwicklung • Mobile Apps • Branding • IT-Lösungen
Website: https://unicumtech.de
`
  }
};

export default function TemplateEditor({ template, isOpen, onClose, onSave }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html_content: '',
    text_content: '',
    template_type: 'marketing'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html');
  const { toast } = useToast();

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        html_content: template.html_content,
        text_content: template.text_content || '',
        template_type: template.template_type
      });
    } else {
      // Reset form for new template
      setFormData({
        name: '',
        subject: '',
        html_content: '',
        text_content: '',
        template_type: 'marketing'
      });
    }
  }, [template, isOpen]);

  const handleLoadDefaultTemplate = (templateKey: keyof typeof defaultTemplates) => {
    const defaultTemplate = defaultTemplates[templateKey];
    setFormData({
      ...formData,
      name: defaultTemplate.name,
      subject: defaultTemplate.subject,
      html_content: defaultTemplate.html_content,
      text_content: defaultTemplate.text_content,
      template_type: templateKey === 'newsletter' ? 'marketing' : 'transactional'
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.subject || !formData.html_content) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (template) {
        // Update existing template
        const { error } = await supabase
          .from('email_templates')
          .update({
            name: formData.name,
            subject: formData.subject,
            html_content: formData.html_content,
            text_content: formData.text_content,
            template_type: formData.template_type
          })
          .eq('id', template.id);

        if (error) throw error;
      } else {
        // Create new template
        const { error } = await supabase
          .from('email_templates')
          .insert([{
            name: formData.name,
            subject: formData.subject,
            html_content: formData.html_content,
            text_content: formData.text_content,
            template_type: formData.template_type
          }]);

        if (error) throw error;
      }

      toast({
        title: "Erfolg",
        description: `Template wurde ${template ? 'aktualisiert' : 'erstellt'}.`,
      });

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableVariables = [
    { key: '{{first_name}}', label: 'Vorname', icon: User },
    { key: '{{last_name}}', label: 'Nachname', icon: User },
    { key: '{{email}}', label: 'E-Mail', icon: Mail },
    { key: '{{company}}', label: 'Unternehmen', icon: Building },
    { key: '{{phone}}', label: 'Telefon', icon: Phone },
    { key: '{{company_name}}', label: 'Firmenname', icon: Building },
    { key: '{{appointment_date}}', label: 'Termin Datum', icon: Calendar },
    { key: '{{appointment_time}}', label: 'Termin Zeit', icon: Calendar },
    { key: '{{service_type}}', label: 'Service-Typ', icon: FileText },
    { key: '{{meeting_type}}', label: 'Meeting-Typ', icon: Calendar },
    { key: '{{meeting_link}}', label: 'Meeting-Link', icon: Mail }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {template ? 'Template bearbeiten' : 'Neues Template erstellen'}
          </DialogTitle>
          <DialogDescription>
            Erstellen oder bearbeiten Sie E-Mail Templates mit Personalisierung
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Default Templates */}
            {!template && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Standard Templates laden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadDefaultTemplate('newsletter')}
                    >
                      Newsletter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadDefaultTemplate('appointment_confirmation')}
                    >
                      Terminbestätigung
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadDefaultTemplate('follow_up')}
                    >
                      Follow-Up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Basic Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="z.B. Newsletter Template"
                />
              </div>
              <div>
                <Label htmlFor="template-type">Template Typ</Label>
                <Select value={formData.template_type} onValueChange={(value) => setFormData({...formData, template_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="transactional">Transaktional</SelectItem>
                    <SelectItem value="automation">Automatisierung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="template-subject">E-Mail Betreff *</Label>
              <Input
                id="template-subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="z.B. Willkommen bei {{company_name}}, {{first_name}}!"
              />
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="html" className="w-full">
              <TabsList>
                <TabsTrigger value="html">HTML Inhalt</TabsTrigger>
                <TabsTrigger value="text">Text Inhalt</TabsTrigger>
                <TabsTrigger value="preview">Vorschau</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-2">
                <Label htmlFor="html-content">HTML Inhalt *</Label>
                <Textarea
                  id="html-content"
                  value={formData.html_content}
                  onChange={(e) => setFormData({...formData, html_content: e.target.value})}
                  placeholder="HTML E-Mail Inhalt mit Variablen wie {{first_name}}"
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>

              <TabsContent value="text" className="space-y-2">
                <Label htmlFor="text-content">Text Inhalt (optional)</Label>
                <Textarea
                  id="text-content"
                  value={formData.text_content}
                  onChange={(e) => setFormData({...formData, text_content: e.target.value})}
                  placeholder="Plain Text Alternative"
                  className="min-h-[400px]"
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    type="button"
                    variant={previewMode === 'html' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('html')}
                  >
                    HTML
                  </Button>
                  <Button
                    type="button"
                    variant={previewMode === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('text')}
                  >
                    Text
                  </Button>
                </div>
                
                {previewMode === 'html' ? (
                  <div 
                    className="border rounded-md p-4 min-h-[400px] bg-white"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.html_content
                        .replace(/\{\{first_name\}\}/g, 'Max')
                        .replace(/\{\{last_name\}\}/g, 'Mustermann')
                        .replace(/\{\{email\}\}/g, 'max@example.com')
                        .replace(/\{\{company\}\}/g, 'Beispiel GmbH')
                        .replace(/\{\{company_name\}\}/g, 'Digital Masters')
                        .replace(/\{\{appointment_date\}\}/g, '15. Januar 2024')
                        .replace(/\{\{appointment_time\}\}/g, '14:00')
                        .replace(/\{\{service_type\}\}/g, 'Webdesign')
                        .replace(/\{\{meeting_type\}\}/g, 'Online Video-Call')
                        .replace(/\{\{phone\}\}/g, '+49 123 456789')
                    }}
                  />
                ) : (
                  <div className="border rounded-md p-4 min-h-[400px] bg-gray-50 whitespace-pre-wrap font-mono text-sm">
                    {formData.text_content
                      .replace(/\{\{first_name\}\}/g, 'Max')
                      .replace(/\{\{last_name\}\}/g, 'Mustermann')
                      .replace(/\{\{email\}\}/g, 'max@example.com')
                      .replace(/\{\{company\}\}/g, 'Beispiel GmbH')
                      .replace(/\{\{company_name\}\}/g, 'Digital Masters')
                      .replace(/\{\{appointment_date\}\}/g, '15. Januar 2024')
                      .replace(/\{\{appointment_time\}\}/g, '14:00')
                      .replace(/\{\{service_type\}\}/g, 'Webdesign')
                      .replace(/\{\{meeting_type\}\}/g, 'Online Video-Call')
                      .replace(/\{\{phone\}\}/g, '+49 123 456789')
                    }
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Variables */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Verfügbare Variablen</CardTitle>
                <CardDescription>
                  Klicken Sie auf eine Variable, um sie zu kopieren
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableVariables.map((variable) => {
                  const Icon = variable.icon;
                  return (
                    <Button
                      key={variable.key}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-auto p-2"
                      onClick={() => {
                        navigator.clipboard.writeText(variable.key);
                        toast({
                          title: "Kopiert",
                          description: `${variable.key} wurde kopiert`,
                        });
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-mono text-xs">{variable.key}</div>
                        <div className="text-xs text-muted-foreground">{variable.label}</div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSave} 
                disabled={isSubmitting}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Speichere...' : (template ? 'Aktualisieren' : 'Erstellen')}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}