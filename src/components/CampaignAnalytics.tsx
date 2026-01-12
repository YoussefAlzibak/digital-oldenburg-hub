import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Mail, 
  MousePointer,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CampaignAnalyticsProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface CampaignStats {
  totalRecipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

interface EmailEvent {
  id: string;
  event_type: string;
  created_at: string;
  event_data: any;
  subscriber_email?: string;
}

export default function CampaignAnalytics({ campaignId, isOpen, onClose }: CampaignAnalyticsProps) {
  const [campaign, setCampaign] = useState<any>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [events, setEvents] = useState<EmailEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && campaignId) {
      loadCampaignAnalytics();
    }
  }, [isOpen, campaignId]);

  const loadCampaignAnalytics = async () => {
    try {
      setLoading(true);

      // Load campaign data
      const { data: campaignData, error: campaignError } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError) throw campaignError;
      setCampaign(campaignData);

      // Calculate stats
      const calcStats: CampaignStats = {
        totalRecipients: campaignData.total_recipients || 0,
        delivered: campaignData.delivered_count || 0,
        opened: campaignData.opened_count || 0,
        clicked: campaignData.clicked_count || 0,
        bounced: campaignData.bounced_count || 0,
        unsubscribed: campaignData.unsubscribed_count || 0,
        deliveryRate: campaignData.total_recipients > 0 
          ? Math.round((campaignData.delivered_count / campaignData.total_recipients) * 100) 
          : 0,
        openRate: campaignData.delivered_count > 0 
          ? Math.round((campaignData.opened_count / campaignData.delivered_count) * 100) 
          : 0,
        clickRate: campaignData.delivered_count > 0 
          ? Math.round((campaignData.clicked_count / campaignData.delivered_count) * 100) 
          : 0,
        bounceRate: campaignData.total_recipients > 0 
          ? Math.round((campaignData.bounced_count / campaignData.total_recipients) * 100) 
          : 0
      };
      setStats(calcStats);

      // Load email events for this campaign
      const { data: eventsData, error: eventsError } = await supabase
        .from('email_events')
        .select(`
          id,
          event_type,
          created_at,
          event_data,
          email_subscribers (
            email
          )
        `)
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!eventsError && eventsData) {
        setEvents(eventsData.map((e: any) => ({
          ...e,
          subscriber_email: e.email_subscribers?.email
        })));
      }

    } catch (error: any) {
      console.error('Error loading campaign analytics:', error);
      toast({
        title: "Fehler",
        description: "Analytics konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'opened': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'clicked': return <MousePointer className="h-4 w-4 text-purple-500" />;
      case 'bounced': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'unsubscribed': return <Users className="h-4 w-4 text-orange-500" />;
      default: return <Mail className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'delivered': return 'Zugestellt';
      case 'opened': return 'Geöffnet';
      case 'clicked': return 'Geklickt';
      case 'bounced': return 'Fehlgeschlagen';
      case 'unsubscribed': return 'Abgemeldet';
      default: return eventType;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            📊 Kampagnen-Analytics
          </DialogTitle>
          <DialogDescription>
            {campaign?.name} - Detaillierte Statistiken und Ereignisse
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats?.totalRecipients}</div>
                  <div className="text-sm text-muted-foreground">Empfänger</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-2xl font-bold text-green-600">{stats?.deliveryRate}%</div>
                    {(stats?.deliveryRate || 0) >= 95 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Zustellrate</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-2xl font-bold text-blue-600">{stats?.openRate}%</div>
                    {(stats?.openRate || 0) >= 20 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Öffnungsrate</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-2xl font-bold text-purple-600">{stats?.clickRate}%</div>
                    {(stats?.clickRate || 0) >= 3 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Klickrate</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📈 Detaillierte Statistiken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{stats?.delivered}</div>
                      <div className="text-sm text-muted-foreground">Zugestellt</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{stats?.opened}</div>
                      <div className="text-sm text-muted-foreground">Geöffnet</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <MousePointer className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{stats?.clicked}</div>
                      <div className="text-sm text-muted-foreground">Geklickt</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{stats?.bounced}</div>
                      <div className="text-sm text-muted-foreground">Bounces</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{stats?.unsubscribed}</div>
                      <div className="text-sm text-muted-foreground">Abmeldungen</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {campaign?.sent_at 
                          ? format(new Date(campaign.sent_at), 'PPP HH:mm', { locale: de })
                          : 'Nicht gesendet'}
                      </div>
                      <div className="text-sm text-muted-foreground">Gesendet am</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benchmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Branchenvergleich</CardTitle>
                <CardDescription>
                  Ihre Kampagne im Vergleich zu Branchendurchschnitten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Öffnungsrate ({stats?.openRate}%)</span>
                      <span className="text-muted-foreground">Branche: 20-25%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${(stats?.openRate || 0) >= 20 ? 'bg-green-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.min(stats?.openRate || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Klickrate ({stats?.clickRate}%)</span>
                      <span className="text-muted-foreground">Branche: 2-5%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${(stats?.clickRate || 0) >= 3 ? 'bg-green-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.min((stats?.clickRate || 0) * 10, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Zustellrate ({stats?.deliveryRate}%)</span>
                      <span className="text-muted-foreground">Ziel: 95%+</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${(stats?.deliveryRate || 0) >= 95 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${stats?.deliveryRate || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📋 Ereignis-Verlauf</CardTitle>
                <CardDescription>
                  Letzte 100 Ereignisse für diese Kampagne
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {events.map((event) => (
                      <div 
                        key={event.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        {getEventIcon(event.event_type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {getEventLabel(event.event_type)}
                            </span>
                            {event.subscriber_email && (
                              <span className="text-xs text-muted-foreground">
                                {event.subscriber_email}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(event.created_at), 'dd.MM. HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Keine Ereignisse aufgezeichnet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => loadCampaignAnalytics()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Aktualisieren
              </Button>
              <Button onClick={onClose}>
                Schließen
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
