import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Calendar,
  Eye,
  ChevronRight,
  Send,
  BarChart3,
  ArrowUpRight,
  Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AutomationScheduler from '@/components/AutomationScheduler';
import TagManager from '@/components/TagManager';
import { format, formatDistanceToNow } from 'date-fns';
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

interface AutomationStep {
  id: string;
  automation_id: string;
  step_number: number;
  subject: string;
  delay_minutes: number;
  is_active: boolean;
  html_content: string;
  text_content?: string;
}

interface EmailQueueItem {
  id: string;
  status: string;
  scheduled_at: string;
  sent_at: string | null;
  subject: string;
  error_message: string | null;
  subscriber_email?: string;
  automation_name?: string;
}

interface AutomationStats {
  totalAutomations: number;
  activeAutomations: number;
  totalEmailsQueued: number;
  totalEmailsSent: number;
  pendingEmails: number;
  failedEmails: number;
}

interface AutomationDetail {
  automation: EmailAutomation;
  steps: AutomationStep[];
  emailsSent: number;
  emailsPending: number;
  emailsFailed: number;
  lastSentAt: string | null;
}

export default function Automations() {
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [automationDetails, setAutomationDetails] = useState<Map<string, AutomationDetail>>(new Map());
  const [emailQueue, setEmailQueue] = useState<EmailQueueItem[]>([]);
  const [stats, setStats] = useState<AutomationStats>({
    totalAutomations: 0,
    activeAutomations: 0,
    totalEmailsQueued: 0,
    totalEmailsSent: 0,
    pendingEmails: 0,
    failedEmails: 0
  });
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<EmailAutomation | null>(null);
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationDetail | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
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

      // Load all steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('email_automation_steps')
        .select('*')
        .order('step_number');

      // Load email queue with subscriber info
      const { data: queueData, error: queueError } = await supabase
        .from('email_queue')
        .select(`
          id, status, scheduled_at, sent_at, subject, error_message, automation_id,
          email_subscribers(email)
        `)
        .order('created_at', { ascending: false });

      // Build automation details map
      const detailsMap = new Map<string, AutomationDetail>();
      
      automationsList.forEach(automation => {
        const automationSteps = (stepsData || []).filter(s => s.automation_id === automation.id);
        const automationEmails = (queueData || []).filter(e => e.automation_id === automation.id);
        
        const sentEmails = automationEmails.filter(e => e.status === 'sent');
        const pendingEmails = automationEmails.filter(e => e.status === 'pending');
        const failedEmails = automationEmails.filter(e => e.status === 'failed');
        
        const lastSent = sentEmails.length > 0 
          ? sentEmails.sort((a, b) => new Date(b.sent_at || 0).getTime() - new Date(a.sent_at || 0).getTime())[0].sent_at
          : null;

        detailsMap.set(automation.id, {
          automation,
          steps: automationSteps,
          emailsSent: sentEmails.length,
          emailsPending: pendingEmails.length,
          emailsFailed: failedEmails.length,
          lastSentAt: lastSent
        });
      });

      setAutomationDetails(detailsMap);

      // Transform queue data for display
      const queueItems: EmailQueueItem[] = (queueData || []).map(item => ({
        id: item.id,
        status: item.status,
        scheduled_at: item.scheduled_at,
        sent_at: item.sent_at,
        subject: item.subject,
        error_message: item.error_message,
        subscriber_email: (item.email_subscribers as any)?.email,
        automation_name: automationsList.find(a => a.id === item.automation_id)?.name
      }));

      setEmailQueue(queueItems);

      // Calculate stats
      const allEmails = queueData || [];
      setStats({
        totalAutomations: automationsList.length,
        activeAutomations: automationsList.filter(a => a.is_active).length,
        totalEmailsQueued: allEmails.length,
        totalEmailsSent: allEmails.filter(e => e.status === 'sent').length,
        pendingEmails: allEmails.filter(e => e.status === 'pending').length,
        failedEmails: allEmails.filter(e => e.status === 'failed').length
      });

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
      await supabase.from('email_automation_steps').delete().eq('automation_id', id);
      const { error } = await supabase.from('email_automations').delete().eq('id', id);

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

  const openAutomationDetail = (automationId: string) => {
    const detail = automationDetails.get(automationId);
    if (detail) {
      setSelectedAutomation(detail);
      setShowDetailDialog(true);
    }
  };

  const getTriggerInfo = (triggerType: string) => {
    const triggers: { [key: string]: { label: string; icon: any; color: string } } = {
      'newsletter_signup': { label: 'Newsletter-Anmeldung', icon: Mail, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
      'subscription': { label: 'Newsletter-Anmeldung', icon: Mail, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
      'contact_form': { label: 'Kontaktformular', icon: Users, color: 'bg-green-500/10 text-green-600 border-green-500/20' },
      'appointment_booked': { label: 'Termin gebucht', icon: Calendar, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
      'date_based': { label: 'Zeitgesteuert', icon: Clock, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
      'user_action': { label: 'Nutzer-Aktion', icon: Zap, color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' }
    };
    return triggers[triggerType] || { label: triggerType, icon: RotateCcw, color: 'bg-muted text-muted-foreground' };
  };

  const getDelayLabel = (minutes: number): string => {
    if (minutes === 0) return 'Sofort';
    if (minutes < 60) return `${minutes} Min.`;
    if (minutes < 1440) return `${Math.round(minutes / 60)} Std.`;
    return `${Math.round(minutes / 1440)} Tag(e)`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Gesendet</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Ausstehend</Badge>;
      case 'failed':
        return <Badge variant="destructive">Fehlgeschlagen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

      {/* Automation Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Automatisierung: {selectedAutomation?.automation.name}
            </DialogTitle>
            <DialogDescription>
              Detaillierte Übersicht aller Schritte und gesendeten E-Mails
            </DialogDescription>
          </DialogHeader>

          {selectedAutomation && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedAutomation.emailsSent}</div>
                      <div className="text-xs text-muted-foreground">Gesendet</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedAutomation.emailsPending}</div>
                      <div className="text-xs text-muted-foreground">Ausstehend</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{selectedAutomation.emailsFailed}</div>
                      <div className="text-xs text-muted-foreground">Fehlgeschlagen</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{selectedAutomation.steps.length}</div>
                      <div className="text-xs text-muted-foreground">Schritte</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">E-Mail-Sequenz</CardTitle>
                    <CardDescription>Alle Schritte dieser Automatisierung</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedAutomation.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {step.step_number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{step.subject}</span>
                              <Badge variant={step.is_active ? "default" : "secondary"} className="text-xs">
                                {step.is_active ? "Aktiv" : "Inaktiv"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Verzögerung: {getDelayLabel(step.delay_minutes)}
                              </span>
                            </div>
                          </div>
                          {index < selectedAutomation.steps.length - 1 && (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Emails for this automation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Letzte E-Mails</CardTitle>
                    <CardDescription>Die letzten 10 gesendeten E-Mails dieser Automatisierung</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Empfänger</TableHead>
                          <TableHead>Betreff</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Gesendet</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emailQueue
                          .filter(e => e.automation_name === selectedAutomation.automation.name)
                          .slice(0, 10)
                          .map((email) => (
                            <TableRow key={email.id}>
                              <TableCell className="font-mono text-sm">
                                {email.subscriber_email || '-'}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {email.subject}
                              </TableCell>
                              <TableCell>{getStatusBadge(email.status)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {email.sent_at 
                                  ? format(new Date(email.sent_at), 'dd.MM.yy HH:mm', { locale: de })
                                  : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Zap className="h-8 w-8 text-primary" />
              E-Mail Automatisierungen
            </h1>
            <p className="text-muted-foreground">
              Analysieren und verwalten Sie Ihre automatisierten E-Mail-Sequenzen
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAutomations}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
            <Button onClick={() => setShowScheduler(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Neue Automatisierung
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Gesamt</p>
                  <p className="text-2xl font-bold">{stats.totalAutomations}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Aktiv</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeAutomations}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">E-Mails gesamt</p>
                  <p className="text-2xl font-bold">{stats.totalEmailsQueued}</p>
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
                  <p className="text-xs text-muted-foreground">Gesendet</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalEmailsSent}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Ausstehend</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingEmails}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Fehlgeschlagen</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failedEmails}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="automations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="automations" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automatisierungen ({automations.length})
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-Mail-Verlauf ({emailQueue.length})
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyse
            </TabsTrigger>
          </TabsList>

          {/* Automations Tab */}
          <TabsContent value="automations" className="space-y-4">
            {automations.length > 0 ? (
              <div className="grid gap-4">
                {automations.map((automation) => {
                  const triggerInfo = getTriggerInfo(automation.trigger_type);
                  const TriggerIcon = triggerInfo.icon;
                  const detail = automationDetails.get(automation.id);

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
                              onClick={() => openAutomationDetail(automation.id)}
                              title="Details anzeigen"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
                              {automation.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
                            <span>{detail?.steps.length || 0} Schritte</span>
                          </div>

                          <div className="flex items-center gap-1 text-green-600">
                            <Send className="h-4 w-4" />
                            <span>{detail?.emailsSent || 0} gesendet</span>
                          </div>

                          {(detail?.emailsPending || 0) > 0 && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Clock className="h-4 w-4" />
                              <span>{detail?.emailsPending} ausstehend</span>
                            </div>
                          )}
                          
                          {detail?.lastSentAt && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Zuletzt: {formatDistanceToNow(new Date(detail.lastSentAt), { addSuffix: true, locale: de })}
                              </span>
                            </div>
                          )}
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
                    Erstellen Sie Ihre erste Automatisierung, um E-Mails automatisch zu versenden.
                  </p>
                  <Button onClick={() => setShowScheduler(true)} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Erste Automatisierung erstellen
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Email Queue Tab */}
          <TabsContent value="queue">
            <Card>
              <CardHeader>
                <CardTitle>E-Mail-Verlauf</CardTitle>
                <CardDescription>Alle E-Mails aus Automatisierungen</CardDescription>
              </CardHeader>
              <CardContent>
                {emailQueue.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Automatisierung</TableHead>
                        <TableHead>Empfänger</TableHead>
                        <TableHead>Betreff</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Geplant</TableHead>
                        <TableHead>Gesendet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailQueue.slice(0, 50).map((email) => (
                        <TableRow key={email.id}>
                          <TableCell>
                            <Badge variant="outline">{email.automation_name || '-'}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {email.subscriber_email || '-'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {email.subject}
                          </TableCell>
                          <TableCell>{getStatusBadge(email.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(email.scheduled_at), 'dd.MM.yy HH:mm', { locale: de })}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {email.sent_at 
                              ? format(new Date(email.sent_at), 'dd.MM.yy HH:mm', { locale: de })
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Keine E-Mails in der Warteschlange
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Per Automation Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Leistung pro Automatisierung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(automationDetails.values()).map((detail) => {
                      const total = detail.emailsSent + detail.emailsPending + detail.emailsFailed;
                      const successRate = total > 0 ? (detail.emailsSent / total) * 100 : 0;
                      
                      return (
                        <div key={detail.automation.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{detail.automation.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {detail.emailsSent}/{total} ({successRate.toFixed(0)}%)
                            </span>
                          </div>
                          <Progress value={successRate} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Trigger Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Auslöser-Verteilung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      automations.reduce((acc, a) => {
                        acc[a.trigger_type] = (acc[a.trigger_type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([trigger, count]) => {
                      const info = getTriggerInfo(trigger);
                      const TriggerIcon = info.icon;
                      
                      return (
                        <div key={trigger} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${info.color}`}>
                              <TriggerIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{info.label}</span>
                          </div>
                          <Badge variant="secondary">{count} Automatisierung(en)</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="md:col-span-2 bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Optimierungsvorschläge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Mehrstufige Sequenzen</p>
                        <p className="text-xs text-muted-foreground">
                          Erweitern Sie Ihre Automatisierungen mit Follow-up-E-Mails
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Personalisierung</p>
                        <p className="text-xs text-muted-foreground">
                          Nutzen Sie Variablen für personalisierte Inhalte
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <ArrowUpRight className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">A/B-Tests</p>
                        <p className="text-xs text-muted-foreground">
                          Testen Sie verschiedene Betreffzeilen und Inhalte
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tags Tab */}
          <TabsContent value="tags" className="space-y-4">
            <TagManager />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
