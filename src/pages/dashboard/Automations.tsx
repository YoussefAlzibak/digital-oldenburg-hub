import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RotateCcw, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Mail, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AutomationScheduler from '@/components/AutomationScheduler';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface EmailAutomation {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  trigger_config: any;
}

interface AutomationStats {
  totalAutomations: number;
  activeAutomations: number;
  totalEmailsQueued: number;
  totalEmailsSent: number;
  pendingEmails: number;
}

interface AutomationStepCount {
  automation_id: string;
  step_count: number;
}

export default function Automations() {
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [stepCounts, setStepCounts] = useState<Map<string, number>>(new Map());
  const [stats, setStats] = useState<AutomationStats>({
    totalAutomations: 0,
    activeAutomations: 0,
    totalEmailsQueued: 0,
    totalEmailsSent: 0,
    pendingEmails: 0
  });
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<EmailAutomation | null>(null);
  const { toast } = useToast();

  const loadAutomations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load automations
      const { data: automationsData, error: automationsError } = await supabase
        .from('email_automations')
        .select('*')
        .order('created_at', { ascending: false });

      if (automationsError) throw automationsError;
      
      const automationsList = automationsData || [];
      setAutomations(automationsList);

      // Load step counts for each automation
      if (automationsList.length > 0) {
        const { data: stepsData, error: stepsError } = await supabase
          .from('email_automation_steps')
          .select('automation_id');

        if (!stepsError && stepsData) {
          const counts = new Map<string, number>();
          stepsData.forEach(step => {
            const current = counts.get(step.automation_id) || 0;
            counts.set(step.automation_id, current + 1);
          });
          setStepCounts(counts);
        }
      }

      // Load email queue stats
      const { data: queueStats, error: queueError } = await supabase
        .from('email_queue')
        .select('status, automation_id');

      if (!queueError && queueStats) {
        const pendingEmails = queueStats.filter(e => e.status === 'pending').length;
        const sentEmails = queueStats.filter(e => e.status === 'sent').length;
        
        setStats({
          totalAutomations: automationsList.length,
          activeAutomations: automationsList.filter(a => a.is_active).length,
          totalEmailsQueued: queueStats.length,
          totalEmailsSent: sentEmails,
          pendingEmails: pendingEmails
        });
      } else {
        setStats({
          totalAutomations: automationsList.length,
          activeAutomations: automationsList.filter(a => a.is_active).length,
          totalEmailsQueued: 0,
          totalEmailsSent: 0,
          pendingEmails: 0
        });
      }
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAutomations();
  }, [loadAutomations]);

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
    if (!confirm('Möchten Sie diese Automatisierung wirklich löschen? Alle zugehörigen Schritte werden ebenfalls gelöscht.')) return;

    try {
      // First delete automation steps
      await supabase
        .from('email_automation_steps')
        .delete()
        .eq('automation_id', id);

      // Then delete the automation
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

  const handleEditAutomation = (automation: EmailAutomation) => {
    setEditingAutomation(automation);
    setShowScheduler(true);
  };

  const handleCloseScheduler = () => {
    setShowScheduler(false);
    setEditingAutomation(null);
    loadAutomations();
  };

  const getTriggerInfo = (triggerType: string) => {
    const triggers: { [key: string]: { label: string; icon: any; color: string } } = {
      'newsletter_signup': { 
        label: 'Newsletter-Anmeldung', 
        icon: Mail, 
        color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
      },
      'contact_form': { 
        label: 'Kontaktformular', 
        icon: Users, 
        color: 'bg-green-500/10 text-green-600 border-green-500/20' 
      },
      'appointment_booked': { 
        label: 'Termin gebucht', 
        icon: Calendar, 
        color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' 
      },
      'date_based': { 
        label: 'Zeitgesteuert', 
        icon: Clock, 
        color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' 
      },
      'user_action': { 
        label: 'Nutzer-Aktion', 
        icon: Zap, 
        color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' 
      }
    };
    return triggers[triggerType] || { 
      label: triggerType, 
      icon: RotateCcw, 
      color: 'bg-muted text-muted-foreground' 
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 animate-spin" />
          <span>Lade Automatisierungen...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AutomationScheduler 
        isOpen={showScheduler} 
        automation={editingAutomation}
        onClose={handleCloseScheduler}
        onSave={handleCloseScheduler}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Zap className="h-8 w-8 text-primary" />
              E-Mail Automatisierungen
            </h1>
            <p className="text-muted-foreground">
              Erstellen Sie intelligente E-Mail-Sequenzen, die automatisch auf Kundenaktionen reagieren
            </p>
          </div>
          <Button onClick={() => setShowScheduler(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Neue Automatisierung
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt</p>
                  <p className="text-2xl font-bold">{stats.totalAutomations}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktiv</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeAutomations}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              {stats.totalAutomations > 0 && (
                <Progress 
                  value={(stats.activeAutomations / stats.totalAutomations) * 100} 
                  className="mt-2 h-1"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">E-Mails gesendet</p>
                  <p className="text-2xl font-bold">{stats.totalEmailsSent}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ausstehend</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingEmails}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automations List */}
        {automations.length > 0 ? (
          <div className="grid gap-4">
            {automations.map((automation) => {
              const triggerInfo = getTriggerInfo(automation.trigger_type);
              const TriggerIcon = triggerInfo.icon;
              const stepCount = stepCounts.get(automation.id) || 0;

              return (
                <Card key={automation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <CardTitle className="text-lg">{automation.name}</CardTitle>
                          <Badge variant={automation.is_active ? "default" : "secondary"}>
                            {automation.is_active ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Aktiv</>
                            ) : (
                              <><AlertCircle className="h-3 w-3 mr-1" /> Inaktiv</>
                            )}
                          </Badge>
                        </div>
                        {automation.description && (
                          <CardDescription className="line-clamp-2">
                            {automation.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAutomation(automation)}
                          title="Bearbeiten"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAutomation(automation.id, automation.is_active)}
                          title={automation.is_active ? 'Deaktivieren' : 'Aktivieren'}
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
                          className="text-destructive hover:text-destructive"
                          title="Löschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <Badge variant="outline" className={triggerInfo.color}>
                        <TriggerIcon className="h-3 w-3 mr-1" />
                        {triggerInfo.label}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{stepCount} {stepCount === 1 ? 'Schritt' : 'Schritte'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Erstellt: {format(new Date(automation.created_at), 'dd. MMM yyyy', { locale: de })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Keine Automatisierungen vorhanden</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Erstellen Sie Ihre erste Automatisierung, um E-Mails automatisch basierend auf 
                Kundenaktionen zu versenden.
              </p>
              <Button onClick={() => setShowScheduler(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Erste Automatisierung erstellen
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tipps für effektive Automatisierungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Willkommens-Serie</p>
                  <p className="text-xs text-muted-foreground">
                    Begrüßen Sie neue Newsletter-Abonnenten mit einer mehrstufigen Serie
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Kontakt-Nachfassung</p>
                  <p className="text-xs text-muted-foreground">
                    Automatische Follow-ups nach Kontaktanfragen
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Termin-Erinnerungen</p>
                  <p className="text-xs text-muted-foreground">
                    Senden Sie automatische Erinnerungen vor Terminen
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}