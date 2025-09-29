import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Users, Send, TrendingUp, RotateCcw, Settings, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  total_recipients: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
  scheduled_at?: string;
  sent_at?: string;
}

interface Subscriber {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

export default function EmailMarketing() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeCampaigns: 0,
    totalSent: 0,
    averageOpenRate: 0
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [campaignsResponse, subscribersResponse] = await Promise.all([
        supabase
          .from('email_campaigns')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('email_subscribers')
          .select('*')
          .eq('status', 'active')
      ]);

      if (campaignsResponse.error) throw campaignsResponse.error;
      if (subscribersResponse.error) throw subscribersResponse.error;

      const campaignData = campaignsResponse.data || [];
      const subscriberData = subscribersResponse.data || [];
      
      setCampaigns(campaignData);
      setSubscribers(subscriberData);

      // Calculate stats
      const totalSent = campaignData.reduce((sum, c) => sum + (c.delivered_count || 0), 0);
      const totalOpened = campaignData.reduce((sum, c) => sum + (c.opened_count || 0), 0);
      const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

      setStats({
        totalSubscribers: subscriberData.length,
        activeCampaigns: campaignData.filter(c => c.status === 'sending' || c.status === 'scheduled').length,
        totalSent,
        averageOpenRate: avgOpenRate
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
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      draft: "outline",
      scheduled: "secondary", 
      sending: "default",
      sent: "default",
      failed: "destructive"
    };

    const labels: { [key: string]: string } = {
      draft: "Entwurf",
      scheduled: "Geplant",
      sending: "Wird gesendet",
      sent: "Gesendet",
      failed: "Fehlgeschlagen"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade E-Mail Marketing Daten...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">E-Mail Marketing</h1>
          <p className="text-muted-foreground">
            Erstellen und verwalten Sie E-Mail-Kampagnen, Templates und Automatisierungen
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/email-settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Einstellungen
          </Button>
          <Button onClick={() => navigate('/admin/subscribers')}>
            <Plus className="h-4 w-4 mr-2" />
            Neue Kampagne
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/subscribers')}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSubscribers}</div>
            <div className="text-sm text-muted-foreground">Abonnenten</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</div>
            <div className="text-sm text-muted-foreground">Aktive Kampagnen</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalSent}</div>
            <div className="text-sm text-muted-foreground">E-Mails gesendet</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.averageOpenRate}%</div>
            <div className="text-sm text-muted-foreground">Öffnungsrate</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Letzte Kampagnen</CardTitle>
            <CardDescription>Übersicht über Ihre neuesten E-Mail-Kampagnen</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Alle anzeigen
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {campaign.total_recipients} Empfänger • 
                    {campaign.delivered_count} zugestellt • 
                    {campaign.opened_count} geöffnet • 
                    {campaign.clicked_count} geklickt
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Erstellt: {formatDateTime(campaign.created_at)}
                    {campaign.sent_at && (
                      <span className="ml-4">Gesendet: {formatDateTime(campaign.sent_at)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(campaign.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine Kampagnen erstellt</p>
              <p className="text-sm">Erstellen Sie Ihre erste E-Mail-Kampagne</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/subscribers')}>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Abonnenten verwalten</h3>
            <p className="text-sm text-muted-foreground">E-Mail-Listen verwalten und Abonnenten hinzufügen</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/renewals')}>
          <CardContent className="p-6 text-center">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Automatisierungen</h3>
            <p className="text-sm text-muted-foreground">Verlängerungs-E-Mails und Automatisierungen</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/email-settings')}>
          <CardContent className="p-6 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">SMTP Einstellungen</h3>
            <p className="text-sm text-muted-foreground">E-Mail-Server und Absender konfigurieren</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}