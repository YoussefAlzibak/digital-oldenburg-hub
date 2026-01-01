import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Play,
  Pause,
  Copy,
  Calendar,
  Users,
  Mail,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle2,
  Server,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CampaignBuilder from '@/components/CampaignBuilder';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  list_id?: string;
  template_id?: string;
  status: string;
  total_recipients: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
}

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  scheduledCampaigns: number;
  totalSent: number;
  totalDelivered: number;
  avgOpenRate: number;
  avgClickRate: number;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CampaignStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    scheduledCampaigns: 0,
    totalSent: 0,
    totalDelivered: 0,
    avgOpenRate: 0,
    avgClickRate: 0
  });
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);
  const [emailLists, setEmailLists] = useState<{ id: string; name: string }[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
    checkSmtpConfig();
    loadQueueCount();
    loadEmailLists();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, activeTab]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const campaignData = data || [];
      setCampaigns(campaignData);

      // Calculate stats
      const stats: CampaignStats = {
        totalCampaigns: campaignData.length,
        activeCampaigns: campaignData.filter(c => c.status === 'sending' || c.status === 'scheduled').length,
        scheduledCampaigns: campaignData.filter(c => c.status === 'scheduled').length,
        totalSent: campaignData.reduce((sum, c) => sum + (c.total_recipients || 0), 0),
        totalDelivered: campaignData.reduce((sum, c) => sum + (c.delivered_count || 0), 0),
        avgOpenRate: calculateAvgRate(campaignData, 'opened_count'),
        avgClickRate: calculateAvgRate(campaignData, 'clicked_count')
      };
      
      setStats(stats);
    } catch (error: any) {
      console.error('Fehler beim Laden der Kampagnen:', error);
      toast({
        title: "Fehler",
        description: "Kampagnen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSmtpConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('smtp_settings')
        .select('id, host, password')
        .eq('is_active', true)
        .single();

      if (!error && data && data.host && data.password) {
        setSmtpConfigured(true);
      }
    } catch (error) {
      console.error('SMTP check error:', error);
    }
  };

  const loadQueueCount = async () => {
    try {
      const { count, error } = await supabase
        .from('email_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (!error && count !== null) {
        setQueueCount(count);
      }
    } catch (error) {
      console.error('Queue count error:', error);
    }
  };

  const calculateAvgRate = (campaigns: EmailCampaign[], field: 'opened_count' | 'clicked_count'): number => {
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0);
    if (totalDelivered === 0) return 0;
    
    const totalEvents = campaigns.reduce((sum, c) => sum + (c[field] || 0), 0);
    return Math.round((totalEvents / totalDelivered) * 100 * 100) / 100;
  };

  const filterCampaigns = () => {
    if (activeTab === 'all') {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter(c => c.status === activeTab));
    }
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setShowCampaignBuilder(true);
  };

  const handleDuplicateCampaign = async (campaign: EmailCampaign) => {
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .insert([{
          name: `${campaign.name} (Kopie)`,
          subject: campaign.subject,
          html_content: campaign.html_content,
          text_content: campaign.text_content,
          list_id: campaign.list_id,
          template_id: campaign.template_id,
          status: 'draft'
        }]);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Kampagne wurde dupliziert.",
      });

      loadCampaigns();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCampaign = async (campaign: EmailCampaign) => {
    if (!confirm(`Möchten Sie die Kampagne "${campaign.name}" wirklich löschen?`)) return;

    try {
      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', campaign.id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Kampagne wurde gelöscht.",
      });

      loadCampaigns();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadEmailLists = async () => {
    try {
      const { data, error } = await supabase
        .from('email_lists')
        .select('id, name')
        .eq('is_active', true);

      if (!error && data) {
        setEmailLists(data);
      }
    } catch (error) {
      console.error('Error loading email lists:', error);
    }
  };

  const getListName = (listId: string | undefined) => {
    if (!listId) return 'Alle Abonnenten';
    const list = emailLists.find(l => l.id === listId);
    return list?.name || 'Unbekannte Liste';
  };
  const handleSendCampaign = async (campaign: EmailCampaign) => {
    if (!smtpConfigured) {
      toast({
        title: "SMTP nicht konfiguriert",
        description: "Bitte konfigurieren Sie zuerst die SMTP-Einstellungen unter E-Mail Einstellungen.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Möchten Sie die Kampagne "${campaign.name}" jetzt versenden?`)) return;

    setSendingCampaignId(campaign.id);

    try {
      // Fallback: Wenn keine Liste hinterlegt ist, alle aktiven Abonnenten verwenden
      let recipientEmails: string[] | undefined = undefined;
      let recipientCount = 0;

      if (!campaign.list_id) {
        const { data: subs, error: subError } = await supabase
          .from('email_subscribers')
          .select('email')
          .eq('status', 'active');

        if (subError) throw subError;

        recipientEmails = (subs || []).map((s: any) => s.email).filter(Boolean);
        recipientCount = recipientEmails.length;

        if (recipientCount === 0) {
          toast({
            title: "Keine Empfänger",
            description: "Keine aktiven Abonnenten gefunden. Bitte fügen Sie zuerst Abonnenten hinzu.",
            variant: "destructive"
          });
          setSendingCampaignId(null);
          return;
        }
      } else {
        // Count list subscribers
        const { count } = await supabase
          .from('email_list_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('list_id', campaign.list_id);
        recipientCount = count || 0;
      }

      toast({
        title: "Kampagne wird gesendet",
        description: `Sende an ${recipientCount} Empfänger...`,
      });

      const { data, error } = await supabase.functions.invoke('send-marketing-email', {
        body: {
          campaignId: campaign.id,
          listId: campaign.list_id || undefined,
          recipientEmails,
          subject: campaign.subject,
          htmlContent: campaign.html_content,
          textContent: campaign.text_content
        }
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw new Error(error.message || 'Fehler beim Versenden der Kampagne');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Kampagne versendet",
        description: data?.message || `${data?.successCount || recipientCount} E-Mails erfolgreich versendet.`,
      });

      loadCampaigns();
    } catch (error: any) {
      console.error('Campaign send error:', error);
      toast({
        title: "Versand fehlgeschlagen",
        description: error.message || 'Ein unbekannter Fehler ist aufgetreten.',
        variant: "destructive"
      });
    } finally {
      setSendingCampaignId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { className: 'bg-muted text-muted-foreground', label: 'Entwurf', icon: Edit },
      scheduled: { className: 'bg-primary/10 text-primary', label: 'Geplant', icon: Clock },
      sending: { className: 'bg-warning/10 text-warning', label: 'Wird versendet', icon: Send },
      sent: { className: 'bg-success/10 text-success', label: 'Versendet', icon: CheckCircle2 },
      failed: { className: 'bg-destructive/10 text-destructive', label: 'Fehlgeschlagen', icon: Trash2 }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const calculateMetrics = (campaign: EmailCampaign) => {
    const openRate = campaign.delivered_count > 0 
      ? Math.round((campaign.opened_count / campaign.delivered_count) * 100 * 100) / 100
      : 0;
    const clickRate = campaign.delivered_count > 0
      ? Math.round((campaign.clicked_count / campaign.delivered_count) * 100 * 100) / 100
      : 0;
    
    return { openRate, clickRate };
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Kampagnen...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">E-Mail Kampagnen</h1>
          <p className="text-muted-foreground">
            Erstellen und verwalten Sie E-Mail-Kampagnen für Ihre Zielgruppe
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!smtpConfigured && (
            <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-md text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>SMTP nicht konfiguriert</span>
            </div>
          )}
          {smtpConfigured && queueCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-md text-sm">
              <Server className="h-4 w-4" />
              <span>{queueCount} E-Mails in Warteschlange</span>
            </div>
          )}
          <Button onClick={() => {
            setEditingCampaign(null);
            setShowCampaignBuilder(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Neue Kampagne
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{stats.totalCampaigns}</div>
            <div className="text-sm text-muted-foreground">Kampagnen gesamt</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.totalDelivered}</div>
            <div className="text-sm text-muted-foreground">E-Mails zugestellt</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.avgOpenRate}%</div>
            <div className="text-sm text-muted-foreground">Ø Öffnungsrate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.avgClickRate}%</div>
            <div className="text-sm text-muted-foreground">Ø Klickrate</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Alle ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Entwürfe ({campaigns.filter(c => c.status === 'draft').length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Geplant ({campaigns.filter(c => c.status === 'scheduled').length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Versendet ({campaigns.filter(c => c.status === 'sent').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredCampaigns.length > 0 ? (
            <div className="grid gap-4">
              {filteredCampaigns.map((campaign) => {
                const { openRate, clickRate } = calculateMetrics(campaign);
                
                return (
                  <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            {getStatusBadge(campaign.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {campaign.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {getListName(campaign.list_id)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Empfänger</div>
                              <div className="text-sm font-medium flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {campaign.total_recipients}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Zugestellt</div>
                              <div className="text-sm font-medium text-green-600">
                                {campaign.delivered_count}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Geöffnet</div>
                              <div className="text-sm font-medium text-blue-600">
                                {campaign.opened_count} ({openRate}%)
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Geklickt</div>
                              <div className="text-sm font-medium text-purple-600">
                                {campaign.clicked_count} ({clickRate}%)
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Erstellt: {format(new Date(campaign.created_at), 'PPP', { locale: de })}
                            </span>
                            {campaign.scheduled_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Geplant: {format(new Date(campaign.scheduled_at), 'PPP HH:mm', { locale: de })}
                              </span>
                            )}
                            {campaign.sent_at && (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Gesendet: {format(new Date(campaign.sent_at), 'PPP HH:mm', { locale: de })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          {campaign.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleSendCampaign(campaign)}
                              disabled={sendingCampaignId === campaign.id || !smtpConfigured}
                            >
                              {sendingCampaignId === campaign.id ? (
                                <>
                                  <span className="animate-spin mr-1">⏳</span>
                                  Sendet...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-1" />
                                  Senden
                                </>
                              )}
                            </Button>
                          )}

                          {campaign.status === 'sending' && (
                            <Badge className="bg-warning/10 text-warning animate-pulse">
                              <Send className="h-3 w-3 mr-1" />
                              Wird versendet...
                            </Badge>
                          )}

                          {campaign.status !== 'sending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCampaign(campaign)}
                                title="Bearbeiten"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDuplicateCampaign(campaign)}
                                title="Duplizieren"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDeleteCampaign(campaign)}
                                title="Löschen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-lg font-semibold mb-2">Keine Kampagnen gefunden</h3>
                <p className="text-muted-foreground mb-6">
                  Erstellen Sie Ihre erste E-Mail-Kampagne, um loszulegen.
                </p>
                <Button onClick={() => {
                  setEditingCampaign(null);
                  setShowCampaignBuilder(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Erste Kampagne erstellen
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Campaign Builder Dialog */}
      {showCampaignBuilder && (
        <CampaignBuilder
          campaign={editingCampaign}
          isOpen={showCampaignBuilder}
          onClose={() => {
            setShowCampaignBuilder(false);
            setEditingCampaign(null);
          }}
          onSave={() => {
            loadCampaigns();
          }}
        />
      )}
    </div>
  );
}
