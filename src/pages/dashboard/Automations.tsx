import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Plus, Play, Pause, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AutomationScheduler from '@/components/AutomationScheduler';

interface EmailAutomation {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
  trigger_config: any;
}

export default function Automations() {
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_automations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_automations')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Erfolgreich aktualisiert",
        description: `Automatisierung ${!currentStatus ? 'aktiviert' : 'deaktiviert'}`,
      });

      loadAutomations();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteAutomation = async (id: string) => {
    if (!confirm('Möchten Sie diese Automatisierung wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('email_automations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Gelöscht",
        description: "Automatisierung wurde erfolgreich gelöscht",
      });

      loadAutomations();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getTriggerLabel = (triggerType: string) => {
    const labels: { [key: string]: string } = {
      'newsletter_signup': 'Newsletter-Anmeldung',
      'contact_form': 'Kontaktformular',
      'appointment_booked': 'Termin gebucht',
      'date_based': 'Datumsbasiert'
    };
    return labels[triggerType] || triggerType;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Automatisierungen...</div>;
  }

  return (
    <>
      <AutomationScheduler 
        isOpen={showScheduler} 
        onClose={() => {
          setShowScheduler(false);
          loadAutomations();
        }}
        onSave={() => {
          setShowScheduler(false);
          loadAutomations();
        }}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">E-Mail Automatisierungen</h1>
            <p className="text-muted-foreground">
              Verwalten Sie automatisierte E-Mail-Sequenzen und Trigger
            </p>
          </div>
          <Button onClick={() => setShowScheduler(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Neue Automatisierung
          </Button>
        </div>

      {automations.length > 0 ? (
        <div className="grid gap-4">
          {automations.map((automation) => (
            <Card key={automation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{automation.name}</CardTitle>
                      <Badge variant={automation.is_active ? "default" : "secondary"}>
                        {automation.is_active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <CardDescription>{automation.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAutomation(automation.id, automation.is_active)}
                    >
                      {automation.is_active ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAutomation(automation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <RotateCcw className="h-4 w-4" />
                    <span>Trigger: {getTriggerLabel(automation.trigger_type)}</span>
                  </div>
                  <span>•</span>
                  <span>Erstellt: {new Date(automation.created_at).toLocaleDateString('de-DE')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              Noch keine Automatisierungen erstellt
            </p>
            <Button onClick={() => setShowScheduler(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Erste Automatisierung erstellen
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}
