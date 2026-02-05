import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  template_type: string;
  is_active: boolean;
}

export default function FormEmailSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name, subject, template_type, is_active')
        .in('name', [
          'Newsletter Willkommen',
          'Kontaktanfrage Bestätigung',
          'Terminbestätigung',
          'Newsletter Abmeldung Bestätigung'
        ])
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Templates konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const expectedTemplates = [
    { name: 'Newsletter Willkommen', description: 'Automatische Willkommensmail bei Newsletter-Anmeldung' },
    { name: 'Kontaktanfrage Bestätigung', description: 'Bestätigung nach Kontaktformular-Anfrage' },
    { name: 'Terminbestätigung', description: 'Bestätigung nach Terminbuchung' },
    { name: 'Newsletter Abmeldung Bestätigung', description: 'Bestätigung bei Newsletter-Abmeldung' },
  ];

  const getTemplateStatus = (name: string) => {
    const template = templates.find(t => t.name === name);
    if (!template) return { exists: false, active: false };
    return { exists: true, active: template.is_active, id: template.id };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Formular-E-Mail-Vorlagen</CardTitle>
              <CardDescription>
                Automatische E-Mails für Formulare (aus Vorlagen-Datenbank)
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadTemplates} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Diese Templates werden automatisch bei Formular-Aktionen verwendet. 
          Bearbeiten Sie die Templates im <Link to="/dashboard/templates" className="text-primary hover:underline">Vorlagen-Bereich</Link>.
        </p>

        <div className="space-y-3">
          {expectedTemplates.map((expected) => {
            const status = getTemplateStatus(expected.name);
            return (
              <div 
                key={expected.name} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{expected.name}</span>
                    {status.exists ? (
                      status.active ? (
                        <Badge variant="default">Aktiv</Badge>
                      ) : (
                        <Badge variant="secondary">Inaktiv</Badge>
                      )
                    ) : (
                      <Badge variant="destructive">Fehlt</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{expected.description}</p>
                </div>
                
                {status.exists ? (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/templates">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/templates">
                      Erstellen
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tipp:</strong> Alle automatischen E-Mails verwenden jetzt die Templates aus der Datenbank. 
            Falls ein Template fehlt, wird ein einfaches Fallback-Template verwendet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
