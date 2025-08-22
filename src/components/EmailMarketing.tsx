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
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Mail, 
  Users, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar as CalendarIcon, 
  Target, 
  TrendingUp,
  List,
  FileText,
  Zap,
  Play,
  Pause,
  Copy,
  Save,
  X,
  Clock,
  Settings,
  RotateCcw,
  TestTube,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TemplateEditor from './TemplateEditor';
import AutomationScheduler from './AutomationScheduler';
import AppointmentRenewal from './AppointmentRenewal';
import CampaignBuilder from './CampaignBuilder';

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
  html_content: string;
  text_content?: string;
  list_id?: string;
  template_id?: string;
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
  
  // Dialog states
  const [showSubscriberDialog, setShowSubscriberDialog] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showAutomationScheduler, setShowAutomationScheduler] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  
  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

      // Check for errors with better error handling
      if (listsResponse.error) {
        console.error('Error loading lists:', listsResponse.error);
        throw new Error(`Listen-Fehler: ${listsResponse.error.message}`);
      }
      if (subscribersResponse.error) {
        console.error('Error loading subscribers:', subscribersResponse.error);
        throw new Error(`Abonnenten-Fehler: ${subscribersResponse.error.message}`);
      }
      if (templatesResponse.error) {
        console.error('Error loading templates:', templatesResponse.error);
        throw new Error(`Template-Fehler: ${templatesResponse.error.message}`);
      }
      if (campaignsResponse.error) {
        console.error('Error loading campaigns:', campaignsResponse.error);
        throw new Error(`Kampagnen-Fehler: ${campaignsResponse.error.message}`);
      }
      if (automationsResponse.error) {
        console.error('Error loading automations:', automationsResponse.error);
        throw new Error(`Automatisierung-Fehler: ${automationsResponse.error.message}`);
      }

      setLists(listsResponse.data || []);
      setSubscribers(subscribersResponse.data || []);
      setTemplates(templatesResponse.data || []);
      setCampaigns(campaignsResponse.data || []);
      setAutomations(automationsResponse.data || []);

      // Calculate stats with null safety
      const activeSubscribers = subscribersResponse.data?.filter(s => s.status === 'active').length || 0;
      const activeCampaigns = campaignsResponse.data?.filter(c => c.status === 'sending').length || 0;
      const totalSent = campaignsResponse.data?.reduce((sum, c) => sum + (c.delivered_count || 0), 0) || 0;
      const totalOpened = campaignsResponse.data?.reduce((sum, c) => sum + (c.opened_count || 0), 0) || 0;
      const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100 * 100) / 100 : 0;

      setStats({
        totalSubscribers: activeSubscribers,
        activeCampaigns,
        totalSent,
        avgOpenRate
      });

    } catch (error: any) {
      console.error('Error loading email data:', error);
      toast({
        title: "Fehler beim Laden",
        description: error.message || "E-Mail Daten konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Functions
  const handleCreateSubscriber = async (data: any) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('email_subscribers')
        .insert([{
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          company: data.company,
          phone: data.phone,
          source: data.source || 'manual',
          tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : []
        }]);

      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Abonnent wurde hinzugefügt.",
      });
      
      setShowSubscriberDialog(false);
      setFormData({});
      loadEmailData();
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

  const handleCreateList = async (data: any) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('email_lists')
        .insert([{
          name: data.name,
          description: data.description
        }]);

      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Liste wurde erstellt.",
      });
      
      setShowListDialog(false);
      setFormData({});
      loadEmailData();
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

  const handleSendCampaign = async (campaignId: string) => {
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) {
        toast({
          title: "Fehler",
          description: "Kampagne nicht gefunden.",
          variant: "destructive"
        });
        return;
      }

      setIsSubmitting(true);
      
      const { data, error } = await supabase.functions.invoke('send-marketing-email', {
        body: {
          campaignId: campaignId,
          listId: campaign.list_id || null,
          subject: campaign.subject,
          htmlContent: campaign.html_content,
          textContent: campaign.text_content || '',
          templateType: 'campaign'
        }
      });

      if (error) {
        console.error('Campaign send error:', error);
        throw new Error(error.message || 'Fehler beim Versenden der Kampagne');
      }
      
      toast({
        title: "Erfolg",
        description: `Kampagne wird versendet: ${data?.queuedCount || 0} E-Mails in der Warteschlange.`,
      });
      
      loadEmailData();
    } catch (error: any) {
      console.error('Send campaign error:', error);
      toast({
        title: "Fehler",
        description: error.message || "Unbekannter Fehler beim Versenden",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAutomation = async (automationId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_automations')
        .update({ is_active: !currentStatus })
        .eq('id', automationId);

      if (error) {
        console.error('Toggle automation error:', error);
        throw new Error(error.message || 'Fehler beim Ändern der Automatisierung');
      }
      
      toast({
        title: "Erfolg",
        description: `Automatisierung wurde ${!currentStatus ? 'aktiviert' : 'deaktiviert'}.`,
      });
      
      loadEmailData();
    } catch (error: any) {
      console.error('Toggle automation error:', error);
      toast({
        title: "Fehler",
        description: error.message || "Unbekannter Fehler",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (tableName: 'email_subscribers' | 'email_campaigns' | 'email_templates' | 'email_automations' | 'email_lists', id: string, name: string) => {
    if (!confirm(`Sind Sie sicher, dass Sie "${name}" löschen möchten?`)) return;
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Element wurde gelöscht.",
      });
      
      loadEmailData();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditingItem(null);
              setShowTemplateEditor(true);
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Neues Template
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEditingItem(null);
              setShowAutomationScheduler(true);
            }}
          >
            <Zap className="h-4 w-4 mr-2" />
            Neue Automatisierung
          </Button>
          <Button
            onClick={() => {
              setEditingItem(null);
              setShowCampaignBuilder(true);
            }}
            className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Neue Kampagne
          </Button>
        </div>
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
              <Dialog open={showSubscriberDialog} onOpenChange={setShowSubscriberDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Abonnent hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuen Abonnenten hinzufügen</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">E-Mail Adresse *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="beispiel@email.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">Vorname</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name || ''}
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                          placeholder="Max"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Nachname</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name || ''}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                          placeholder="Mustermann"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Unternehmen</Label>
                      <Input
                        id="company"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Firma GmbH"
                      />
                    </div>
                    <div>
                      <Label htmlFor="source">Quelle</Label>
                      <Input
                        id="source"
                        value={formData.source || ''}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        placeholder="Website, Event, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (kommagetrennt)</Label>
                      <Input
                        id="tags"
                        value={formData.tags || ''}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowSubscriberDialog(false)} disabled={isSubmitting}>
                        Abbrechen
                      </Button>
                      <Button 
                        onClick={() => handleCreateSubscriber(formData)}
                        disabled={isSubmitting || !formData.email}
                      >
                        {isSubmitting ? 'Wird hinzugefügt...' : 'Hinzufügen'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <List className="h-4 w-4 mr-2" />
                    Liste erstellen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neue E-Mail Liste erstellen</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="list-name">Listenname</Label>
                      <Input
                        id="list-name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="z.B. Newsletter Abonnenten"
                      />
                    </div>
                    <div>
                      <Label htmlFor="list-description">Beschreibung</Label>
                      <Textarea
                        id="list-description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Beschreibung der Liste..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowListDialog(false)} disabled={isSubmitting}>
                        Abbrechen
                      </Button>
                      <Button 
                        onClick={() => handleCreateList(formData)}
                        disabled={isSubmitting || !formData.name}
                      >
                        {isSubmitting ? 'Wird erstellt...' : 'Liste erstellen'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                          <Button variant="ghost" size="sm" title="Bearbeiten">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Löschen"
                            onClick={() => handleDelete('email_subscribers', subscriber.id, subscriber.email)}
                          >
                            <Trash2 className="h-3 w-3" />
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
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowCampaignBuilder(true);
              }}
              className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Neue Kampagne
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
                      <TableCell>{campaign.total_recipients || 0}</TableCell>
                      <TableCell>{campaign.delivered_count || 0}</TableCell>
                      <TableCell>{campaign.opened_count || 0}</TableCell>
                      <TableCell>{campaign.clicked_count || 0}</TableCell>
                      <TableCell>{new Date(campaign.created_at).toLocaleDateString('de-DE')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Bearbeiten"
                            onClick={() => {
                              setEditingItem(campaign);
                              setShowCampaignBuilder(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Duplizieren"
                            onClick={() => {
                              setEditingItem({
                                ...campaign,
                                id: null,
                                name: `${campaign.name} (Kopie)`,
                                status: 'draft'
                              });
                              setShowCampaignBuilder(true);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Senden"
                            onClick={() => handleSendCampaign(campaign.id)}
                            disabled={isSubmitting || campaign.status === 'sending'}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Test senden"
                          >
                            <TestTube className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Statistiken"
                          >
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Löschen"
                            onClick={() => handleDelete('email_campaigns', campaign.id, campaign.name)}
                          >
                            <Trash2 className="h-3 w-3" />
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
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowTemplateEditor(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Neues Template
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
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         title="Bearbeiten"
                         onClick={() => {
                           setEditingItem(template);
                           setShowTemplateEditor(true);
                         }}
                       >
                         <Edit className="h-3 w-3" />
                       </Button>
                       <Button variant="ghost" size="sm" title="Vorschau">
                         <Eye className="h-3 w-3" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         title="Löschen"
                         onClick={() => handleDelete('email_templates', template.id, template.name)}
                       >
                         <Trash2 className="h-3 w-3" />
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
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowAutomationScheduler(true);
              }}
            >
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
                        onClick={() => handleToggleAutomation(automation.id, automation.is_active)}
                        title={automation.is_active ? 'Deaktivieren' : 'Aktivieren'}
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
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => {
                         setEditingItem(automation);
                         setShowAutomationScheduler(true);
                       }}
                     >
                       <Edit className="h-3 w-3 mr-1" />
                       Bearbeiten
                     </Button>
                     <Button variant="outline" size="sm">
                       <Eye className="h-3 w-3 mr-1" />
                       Ansehen
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => handleDelete('email_automations', automation.id, automation.name)}
                     >
                       <Trash2 className="h-3 w-3 mr-1" />
                       Löschen
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Editor Dialog */}
      <TemplateEditor
        template={editingItem}
        isOpen={showTemplateEditor}
        onClose={() => {
          setShowTemplateEditor(false);
          setEditingItem(null);
        }}
        onSave={() => {
          loadEmailData();
        }}
      />

      {/* Automation Scheduler Dialog */}
      <AutomationScheduler
        automation={editingItem}
        isOpen={showAutomationScheduler}
        onClose={() => {
          setShowAutomationScheduler(false);
          setEditingItem(null);
        }}
        onSave={() => {
          loadEmailData();
        }}
      />

      {/* Campaign Builder Dialog */}
      <CampaignBuilder
        campaign={editingItem}
        isOpen={showCampaignBuilder}
        onClose={() => {
          setShowCampaignBuilder(false);
          setEditingItem(null);
        }}
        onSave={() => {
          loadEmailData();
        }}
      />
    </div>
  );
}