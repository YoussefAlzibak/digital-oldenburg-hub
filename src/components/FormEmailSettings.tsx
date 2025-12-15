import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Save, 
  Loader2,
  MessageSquare,
  Calendar,
  Users,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormTemplate {
  subject: string;
  greeting: string;
  message: string;
  signature: string;
}

interface FormTemplates {
  contact: FormTemplate;
  appointment: FormTemplate;
  newsletter: FormTemplate;
}

const DEFAULT_TEMPLATES: FormTemplates = {
  contact: {
    subject: 'Vielen Dank für Ihre Anfrage - {{company}}',
    greeting: 'Hallo {{name}},',
    message: 'vielen Dank für Ihre Kontaktanfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.\n\nIhre Anfrage:\n{{message}}',
    signature: 'Mit freundlichen Grüßen\nIhr Unicum Tech Team'
  },
  appointment: {
    subject: 'Terminbestätigung: {{service}} am {{date}}',
    greeting: 'Hallo {{name}},',
    message: 'Ihr Termin wurde erfolgreich gebucht.\n\n📅 Datum: {{date}}\n⏰ Uhrzeit: {{time}}\n📍 Art: {{type}}\n\nBitte erscheinen Sie pünktlich oder informieren Sie uns rechtzeitig bei Verhinderung.',
    signature: 'Mit freundlichen Grüßen\nIhr Unicum Tech Team'
  },
  newsletter: {
    subject: 'Willkommen bei unserem Newsletter!',
    greeting: 'Hallo {{name}},',
    message: 'vielen Dank für Ihre Anmeldung zu unserem Newsletter!\n\nSie erhalten ab sofort regelmäßig Updates zu:\n• Neuigkeiten und Trends\n• Exklusive Angebote\n• Tipps und Best Practices',
    signature: 'Mit freundlichen Grüßen\nIhr Unicum Tech Team'
  }
};

export default function FormEmailSettings() {
  const [templates, setTemplates] = useState<FormTemplates>(DEFAULT_TEMPLATES);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const { toast } = useToast();

  const updateTemplate = (form: keyof FormTemplates, field: keyof FormTemplate, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [form]: { ...prev[form], [field]: value }
    }));
  };

  const resetTemplate = (form: keyof FormTemplates) => {
    setTemplates(prev => ({
      ...prev,
      [form]: DEFAULT_TEMPLATES[form]
    }));
    toast({
      title: "Zurückgesetzt",
      description: "Vorlage wurde auf Standard zurückgesetzt.",
    });
  };

  const saveTemplates = async () => {
    setSaving(true);
    try {
      localStorage.setItem('formEmailTemplates', JSON.stringify(templates));
      toast({
        title: "Gespeichert",
        description: "E-Mail-Vorlagen wurden aktualisiert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Vorlagen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderTemplateForm = (formKey: keyof FormTemplates) => {
    const template = templates[formKey];
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${formKey}-subject`}>Betreff</Label>
          <Input
            id={`${formKey}-subject`}
            value={template.subject}
            onChange={(e) => updateTemplate(formKey, 'subject', e.target.value)}
            placeholder="E-Mail-Betreff"
          />
        </div>
        <div>
          <Label htmlFor={`${formKey}-greeting`}>Anrede</Label>
          <Input
            id={`${formKey}-greeting`}
            value={template.greeting}
            onChange={(e) => updateTemplate(formKey, 'greeting', e.target.value)}
            placeholder="Hallo {{name}},"
          />
        </div>
        <div>
          <Label htmlFor={`${formKey}-message`}>Nachricht</Label>
          <Textarea
            id={`${formKey}-message`}
            value={template.message}
            onChange={(e) => updateTemplate(formKey, 'message', e.target.value)}
            placeholder="E-Mail-Text..."
            rows={6}
          />
        </div>
        <div>
          <Label htmlFor={`${formKey}-signature`}>Signatur</Label>
          <Textarea
            id={`${formKey}-signature`}
            value={template.signature}
            onChange={(e) => updateTemplate(formKey, 'signature', e.target.value)}
            placeholder="Mit freundlichen Grüßen..."
            rows={3}
          />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resetTemplate(formKey)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Standard wiederherstellen
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Verfügbare Variablen: <Badge variant="outline" className="ml-1">{'{{name}}'}</Badge>
            <Badge variant="outline" className="ml-1">{'{{email}}'}</Badge>
            <Badge variant="outline" className="ml-1">{'{{company}}'}</Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Formular-E-Mail-Vorlagen</CardTitle>
            <CardDescription>
              Anpassen der automatischen Antwort-E-Mails
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Kontakt</span>
            </TabsTrigger>
            <TabsTrigger value="appointment" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Termin</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Newsletter</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact" className="mt-4">
            {renderTemplateForm('contact')}
          </TabsContent>
          
          <TabsContent value="appointment" className="mt-4">
            {renderTemplateForm('appointment')}
          </TabsContent>
          
          <TabsContent value="newsletter" className="mt-4">
            {renderTemplateForm('newsletter')}
          </TabsContent>
        </Tabs>

        <Button onClick={saveTemplates} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Alle Vorlagen speichern
        </Button>
      </CardContent>
    </Card>
  );
}
