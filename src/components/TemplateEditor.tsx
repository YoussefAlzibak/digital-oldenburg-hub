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
    name: "Newsletter Template",
    subject: "{{company_name}} Newsletter - {{month}} {{year}}",
    html_content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{company_name}} Newsletter</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .btn { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{company_name}}</h1>
      <p>Newsletter {{month}} {{year}}</p>
    </div>
    
    <div class="content">
      <h2>Hallo {{first_name}},</h2>
      
      <p>Willkommen zu unserem Newsletter! Hier sind die neuesten Updates und Nachrichten.</p>
      
      <h3>Was gibt es Neues?</h3>
      <p>Entdecken Sie unsere neuesten Services und Entwicklungen in der digitalen Welt.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn">Mehr erfahren</a>
      </p>
      
      <p>Vielen Dank für Ihr Interesse an {{company_name}}!</p>
      
      <p>Mit freundlichen Grüßen,<br>
      Das {{company_name}} Team</p>
    </div>
    
    <div class="footer">
      <p>{{company_name}} | <a href="#">Abmelden</a></p>
    </div>
  </div>
</body>
</html>`,
    text_content: `
Hallo {{first_name}},

willkommen zu unserem Newsletter für {{month}} {{year}}!

Was gibt es Neues?
Entdecken Sie unsere neuesten Services und Entwicklungen in der digitalen Welt.

Vielen Dank für Ihr Interesse an {{company_name}}!

Mit freundlichen Grüßen,
Das {{company_name}} Team

{{company_name}} | Abmelden: [Link]
`
  },
  appointment_confirmation: {
    name: "Terminbestätigung Template",
    subject: "Terminbestätigung - {{appointment_date}} um {{appointment_time}}",
    html_content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminbestätigung</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .appointment-box { background: white; border: 2px solid #2ecc71; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .btn { background: #2ecc71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Termin bestätigt</h1>
    </div>
    
    <div class="content">
      <h2>Hallo {{first_name}},</h2>
      
      <p>Ihr Beratungstermin wurde erfolgreich bestätigt!</p>
      
      <div class="appointment-box">
        <h3>Termindetails</h3>
        <p><strong>Datum:</strong> {{appointment_date}}</p>
        <p><strong>Uhrzeit:</strong> {{appointment_time}}</p>
        <p><strong>Art:</strong> {{meeting_type}}</p>
        <p><strong>Service:</strong> {{service_type}}</p>
        {{#if meeting_link}}
        <p><strong>Meeting-Link:</strong> <a href="{{meeting_link}}">{{meeting_link}}</a></p>
        {{/if}}
      </div>
      
      <p>Wir freuen uns auf unser Gespräch! Falls Sie Fragen haben oder den Termin ändern müssen, kontaktieren Sie uns gerne.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{meeting_link}}" class="btn">Zum Meeting</a>
      </p>
      
      <p>Mit freundlichen Grüßen,<br>
      Das {{company_name}} Team</p>
    </div>
    
    <div class="footer">
      <p>{{company_name}} | Termin ändern: [Link]</p>
    </div>
  </div>
</body>
</html>`,
    text_content: `
Hallo {{first_name}},

Ihr Beratungstermin wurde erfolgreich bestätigt!

TERMINDETAILS:
Datum: {{appointment_date}}
Uhrzeit: {{appointment_time}}
Art: {{meeting_type}}
Service: {{service_type}}

{{#if meeting_link}}
Meeting-Link: {{meeting_link}}
{{/if}}

Wir freuen uns auf unser Gespräch!

Mit freundlichen Grüßen,
Das {{company_name}} Team

{{company_name}} | Termin ändern: [Link]
`
  },
  follow_up: {
    name: "Follow-Up Template",
    subject: "Danke für Ihr Interesse - {{first_name}}",
    html_content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Follow-Up</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .btn { background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .highlight { background: #e8f4fd; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Vielen Dank für Ihr Interesse!</h1>
    </div>
    
    <div class="content">
      <h2>Hallo {{first_name}},</h2>
      
      <p>vielen Dank für Ihre Anfrage bezüglich {{service_type}}. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
      
      <div class="highlight">
        <h3>Ihre Anfrage im Überblick:</h3>
        <p><strong>Service:</strong> {{service_type}}</p>
        <p><strong>Unternehmen:</strong> {{company}}</p>
        {{#if phone}}<p><strong>Telefon:</strong> {{phone}}</p>{{/if}}
      </div>
      
      <p>In der Zwischenzeit können Sie gerne unsere Website erkunden und sich über unsere Services informieren.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn">Unsere Services</a>
      </p>
      
      <p>Wir werden uns innerhalb der nächsten 24 Stunden bei Ihnen melden.</p>
      
      <p>Mit freundlichen Grüßen,<br>
      Das {{company_name}} Team</p>
    </div>
    
    <div class="footer">
      <p>{{company_name}} | <a href="#">Kontakt</a></p>
    </div>
  </div>
</body>
</html>`,
    text_content: `
Hallo {{first_name}},

vielen Dank für Ihre Anfrage bezüglich {{service_type}}.

IHRE ANFRAGE IM ÜBERBLICK:
Service: {{service_type}}
Unternehmen: {{company}}
{{#if phone}}Telefon: {{phone}}{{/if}}

Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.

Wir werden uns innerhalb der nächsten 24 Stunden bei Ihnen melden.

Mit freundlichen Grüßen,
Das {{company_name}} Team

{{company_name}} | Kontakt: [Link]
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