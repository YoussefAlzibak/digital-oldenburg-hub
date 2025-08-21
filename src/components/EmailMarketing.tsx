import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Mail, 
  Users, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Target, 
  TrendingUp,
  List,
  FileText, // For templates
  Zap,
  Play,
  Pause,
  Copy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailList {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  subscriber_count?: number;
}

interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  status: string;
  tags?: string[];
  source?: string;
  created_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  template_type: string;
  is_active: boolean;
  created_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  total_recipients: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
}

interface EmailAutomation {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
}

export default function EmailMarketingSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lists, setLists] = useState<EmailList[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [automations, setAutomations] = useState<EmailAutomation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeCampaigns: 0,
    totalSent: 0,
    avgOpenRate: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      setLoading(true);
      
      const [listsResponse, subscribersResponse, templatesResponse, campaignsResponse, automationsResponse] = await Promise.all([
        supabase.from('email_lists').select('*').order('created_at', { ascending: false }),
        supabase.from('email_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('email_templates').select('*').order('created_at', { ascending: false }),
        supabase.from('email_campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('email_automations').select('*').order('created_at', { ascending: false })
      ]);

      if (listsResponse.error) throw listsResponse.error;
      if (subscribersResponse.error) throw subscribersResponse.error;
      if (templatesResponse.error) throw templatesResponse.error;
      if (campaignsResponse.error) throw campaignsResponse.error;
      if (automationsResponse.error) throw automationsResponse.error;

      setLists(listsResponse.data || []);
      setSubscribers(subscribersResponse.data || []);
      setTemplates(templatesResponse.data || []);
      setCampaigns(campaignsResponse.data || []);
      setAutomations(automationsResponse.data || []);

      // Calculate stats
      const activeSubscribers = subscribersResponse.data?.filter(s => s.status === 'active').length || 0;
      const activeCampaigns = campaignsResponse.data?.filter(c => c.status === 'sending').length || 0;
      const totalSent = campaignsResponse.data?.reduce((sum, c) => sum + (c.delivered_count || 0), 0) || 0;
      const totalOpened = campaignsResponse.data?.reduce((sum, c) => sum + (c.opened_count || 0), 0) || 0;
      const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;

      setStats({
        totalSubscribers: activeSubscribers,
        activeCampaigns,
        totalSent,
        avgOpenRate
      });

    } catch (error: any) {
      console.error('Error loading email data:', error);
      toast({
        title: "Fehler",
        description: "E-Mail Daten konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, type: 'subscriber' | 'campaign' | 'automation' = 'subscriber') => {
    const statusColors = {
      subscriber: {
        active: 'bg-green-100 text-green-800',
        unsubscribed: 'bg-gray-100 text-gray-800',
        bounced: 'bg-red-100 text-red-800'
      },
      campaign: {
        draft: 'bg-gray-100 text-gray-800',
        scheduled: 'bg-blue-100 text-blue-800',
        sending: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      automation: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800'
      }
    };

    const colorClass = statusColors[type][status as keyof typeof statusColors[typeof type]] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={`${colorClass} border-none`}>
        {status === 'active' ? 'Aktiv' :
         status === 'inactive' ? 'Inaktiv' :
         status === 'unsubscribed' ? 'Abgemeldet' :
         status === 'bounced' ? 'Bounced' :
         status === 'draft' ? 'Entwurf' :
         status === 'scheduled' ? 'Geplant' :
         status === 'sending' ? 'Wird versendet' :
         status === 'sent' ? 'Versendet' :
         status === 'cancelled' ? 'Abgebrochen' : status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Lade E-Mail Marketing Daten...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">E-Mail Marketing</h2>
          <p className="text-muted-foreground">Verwalten Sie Ihre E-Mail-Kampagnen und Automatisierungen</p>
        </div>
        <Button className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Neue Kampagne
        </Button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Abonnenten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--brand-primary))]">{stats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              +{subscribers.filter(s => s.created_at > new Date(Date.now() - 30*24*60*60*1000).toISOString()).length} in den letzten 30 Tagen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kampagnen</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--brand-primary))]">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'scheduled').length} geplant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-Mails versendet</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--brand-primary))]">{stats.totalSent}</div>
            <p className="text-xs text-muted-foreground">
              Alle Kampagnen zusammen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Öffnungsrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--brand-primary))]">{stats.avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Durchschnittlich über alle Kampagnen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">
            <Target className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="h-4 w-4 mr-2" />
            Abonnenten
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Send className="h-4 w-4 mr-2" />
            Kampagnen
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="automations">
            <Zap className="h-4 w-4 mr-2" />
            Automation
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Neueste Kampagnen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(campaign.status, 'campaign')}
                        <p className="text-xs text-muted-foreground mt-1">
                          {campaign.delivered_count} versendet
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aktive Automatisierungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {automations.filter(a => a.is_active).slice(0, 5).map((automation) => (
                    <div key={automation.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{automation.name}</p>
                        <p className="text-sm text-muted-foreground">{automation.description}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(automation.is_active ? 'active' : 'inactive', 'automation')}
                        <p className="text-xs text-muted-foreground mt-1">
                          {automation.trigger_type === 'subscription' ? 'Bei Anmeldung' :
                           automation.trigger_type === 'appointment_booked' ? 'Termin gebucht' :
                           automation.trigger_type === 'contact_form' ? 'Kontaktformular' : 
                           automation.trigger_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">E-Mail Abonnenten</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Abonnent hinzufügen
              </Button>
              <Button variant="outline">
                Import CSV
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Unternehmen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quelle</TableHead>
                    <TableHead>Registriert</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.slice(0, 10).map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        {subscriber.first_name || subscriber.last_name 
                          ? `${subscriber.first_name || ''} ${subscriber.last_name || ''}`.trim()
                          : '-'}
                      </TableCell>
                      <TableCell>{subscriber.company || '-'}</TableCell>
                      <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                      <TableCell>{subscriber.source || '-'}</TableCell>
                      <TableCell>{new Date(subscriber.created_at).toLocaleDateString('de-DE')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">E-Mail Kampagnen</h3>
            <Button className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90">
              <Plus className="h-4 w-4 mr-2" />
              Neue Kampagne erstellen
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kampagne</TableHead>
                    <TableHead>Betreff</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Empfänger</TableHead>
                    <TableHead>Versendet</TableHead>
                    <TableHead>Geöffnet</TableHead>
                    <TableHead>Geklickt</TableHead>
                    <TableHead>Erstellt</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.subject}</TableCell>
                      <TableCell>{getStatusBadge(campaign.status, 'campaign')}</TableCell>
                      <TableCell>{campaign.total_recipients}</TableCell>
                      <TableCell>{campaign.delivered_count}</TableCell>
                      <TableCell>{campaign.opened_count}</TableCell>
                      <TableCell>{campaign.clicked_count}</TableCell>
                      <TableCell>{new Date(campaign.created_at).toLocaleDateString('de-DE')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">E-Mail Templates</h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Neues Template erstellen
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant={template.template_type === 'marketing' ? 'default' : 'secondary'}>
                      {template.template_type === 'marketing' ? 'Marketing' :
                       template.template_type === 'transactional' ? 'Transaktion' :
                       template.template_type === 'automation' ? 'Automation' : template.template_type}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automations Tab */}
        <TabsContent value="automations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">E-Mail Automatisierung</h3>
            <Button className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90">
              <Plus className="h-4 w-4 mr-2" />
              Neue Automatisierung
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automations.map((automation) => (
              <Card key={automation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{automation.name}</CardTitle>
                      <CardDescription>{automation.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(automation.is_active ? 'active' : 'inactive', 'automation')}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Toggle automation status
                        }}
                      >
                        {automation.is_active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trigger:</span>
                      <span>
                        {automation.trigger_type === 'subscription' ? 'Bei Anmeldung' :
                         automation.trigger_type === 'appointment_booked' ? 'Termin gebucht' :
                         automation.trigger_type === 'contact_form' ? 'Kontaktformular' :
                         automation.trigger_type === 'date_based' ? 'Datumsbasiert' : automation.trigger_type}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Erstellt:</span>
                      <span>{new Date(automation.created_at).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Bearbeiten
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Ansehen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}