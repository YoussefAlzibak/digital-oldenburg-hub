import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Mail, 
  Calendar,
  Tag,
  Download,
  Upload,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  status: 'active' | 'inactive' | 'bounced' | 'unsubscribed';
  source?: string;
  created_at: string;
  updated_at: string;
}

interface EmailList {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  subscriber_count?: number;
}

interface SubscriberListAssignment {
  id: string;
  list_id: string;
  subscriber_id: string;
  subscribed_at: string;
}

interface SubscriberActivity {
  id: string;
  subscriber_id: string;
  activity_type: 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'subscribed';
  campaign_id?: string;
  created_at: string;
  metadata?: any;
}

export default function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [subscriberListAssignments, setSubscriberListAssignments] = useState<SubscriberListAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [listFilter, setListFilter] = useState<string>('all');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<EmailSubscriber | null>(null);
  const [importData, setImportData] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company: '',
    phone: '',
    tags: '',
    status: 'active' as 'active' | 'inactive' | 'bounced' | 'unsubscribed',
    source: 'manual'
  });

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subscribersResponse, listsResponse, assignmentsResponse] = await Promise.all([
        supabase
          .from('email_subscribers')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('email_lists')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('email_list_subscribers')
          .select('*')
      ]);

      if (subscribersResponse.error) throw subscribersResponse.error;
      if (listsResponse.error) throw listsResponse.error;
      if (assignmentsResponse.error) throw assignmentsResponse.error;

      setSubscribers((subscribersResponse.data || []) as EmailSubscriber[]);
      
      // Calculate subscriber count for each list
      const assignmentsData = assignmentsResponse.data || [];
      const listsWithCounts = (listsResponse.data || []).map(list => ({
        ...list,
        subscriber_count: assignmentsData.filter(a => a.list_id === list.id).length
      }));
      
      setEmailLists(listsWithCounts);
      setSubscriberListAssignments(assignmentsData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = !searchTerm || 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || subscriber.source === sourceFilter;
    
    let matchesList = true;
    if (listFilter !== 'all') {
      if (listFilter === 'none') {
        matchesList = !subscriberListAssignments.some(a => a.subscriber_id === subscriber.id);
      } else {
        matchesList = subscriberListAssignments.some(a => 
          a.subscriber_id === subscriber.id && a.list_id === listFilter
        );
      }
    }
    
    return matchesSearch && matchesStatus && matchesSource && matchesList;
  });

  const resetForm = () => {
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      company: '',
      phone: '',
      tags: '',
      status: 'active' as 'active' | 'inactive' | 'bounced' | 'unsubscribed',
      source: 'manual'
    });
  };

  const handleAddSubscriber = async () => {
    if (!formData.email) {
      toast({
        title: "Fehler",
        description: "E-Mail-Adresse ist erforderlich.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Attempting to add subscriber:', formData);

      const subscriberData = {
        email: formData.email,
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        company: formData.company || null,
        phone: formData.phone || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
        status: formData.status,
        source: formData.source
      };

      console.log('Subscriber data:', subscriberData);

      const { data, error } = await supabase
        .from('email_subscribers')
        .insert([subscriberData])
        .select();

      console.log('Insert response:', { data, error });

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Abonnent wurde hinzugefügt.",
      });

      resetForm();
      setShowAddDialog(false);
      loadData();
    } catch (error: any) {
      console.error('Error adding subscriber:', error);
      toast({
        title: "Fehler beim Hinzufügen",
        description: error.message || 'Unbekannter Fehler beim Hinzufügen des Abonnenten',
        variant: "destructive"
      });
    }
  };

  const handleEditSubscriber = async () => {
    if (!editingSubscriber || !formData.email) return;

    try {
      console.log('Attempting to update subscriber:', editingSubscriber.id, formData);
      
      const updateData = {
        email: formData.email,
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        company: formData.company || null,
        phone: formData.phone || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
        status: formData.status,
        source: formData.source
      };

      console.log('Update data:', updateData);

      const { data, error } = await supabase
        .from('email_subscribers')
        .update(updateData)
        .eq('id', editingSubscriber.id)
        .select();

      console.log('Update response:', { data, error });

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Abonnent wurde aktualisiert.",
      });

      setShowEditDialog(false);
      setEditingSubscriber(null);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error updating subscriber:', error);
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message || 'Unbekannter Fehler beim Aktualisieren des Abonnenten',
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Abonnenten löschen möchten?')) {
      return;
    }

    try {
      console.log('Attempting to delete subscriber:', id);

      const { data, error } = await supabase
        .from('email_subscribers')
        .delete()
        .eq('id', id)
        .select();

      console.log('Delete response:', { data, error });

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Abonnent wurde gelöscht.",
      });

      loadData();
    } catch (error: any) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: "Fehler beim Löschen",
        description: error.message || 'Unbekannter Fehler beim Löschen des Abonnenten',
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (subscriber: EmailSubscriber) => {
    console.log('openEditDialog called with subscriber:', subscriber);
    try {
      setEditingSubscriber(subscriber);
      setFormData({
        email: subscriber.email,
        first_name: subscriber.first_name || '',
        last_name: subscriber.last_name || '',
        company: subscriber.company || '',
        phone: subscriber.phone || '',
        tags: subscriber.tags?.join(', ') || '',
        status: subscriber.status as 'active' | 'inactive' | 'bounced' | 'unsubscribed',
        source: subscriber.source || 'manual'
      });
      setShowEditDialog(true);
      console.log('Edit dialog should be open now');
    } catch (error) {
      console.error('Error in openEditDialog:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedSubscribers.length === 0) {
      toast({
        title: "Fehler", 
        description: "Bitte wählen Sie mindestens einen Abonnenten aus.",
        variant: "destructive"
      });
      return;
    }

    const confirmMessage = 
      action === 'delete' 
        ? `Sind Sie sicher, dass Sie ${selectedSubscribers.length} Abonnenten löschen möchten?`
        : `Sind Sie sicher, dass Sie ${selectedSubscribers.length} Abonnenten ${action === 'activate' ? 'aktivieren' : 'deaktivieren'} möchten?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      console.log('Attempting bulk action:', action, 'on subscribers:', selectedSubscribers);

      if (action === 'delete') {
        const { data, error } = await supabase
          .from('email_subscribers')
          .delete()
          .in('id', selectedSubscribers)
          .select();

        console.log('Bulk delete response:', { data, error });

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: `${selectedSubscribers.length} Abonnenten wurden gelöscht.`,
        });
      } else if (action === 'activate' || action === 'deactivate') {
        const newStatus = action === 'activate' ? 'active' : 'inactive';
        
        const { data, error } = await supabase
          .from('email_subscribers')
          .update({ status: newStatus })
          .in('id', selectedSubscribers)
          .select();

        console.log('Bulk status update response:', { data, error });

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: `${selectedSubscribers.length} Abonnenten wurden ${action === 'activate' ? 'aktiviert' : 'deaktiviert'}.`,
        });
      }

      setSelectedSubscribers([]);
      loadData();
    } catch (error: any) {
      console.error('Error in bulk action:', error);
      toast({
        title: "Fehler bei Bulk-Aktion",
        description: error.message || `Unbekannter Fehler bei der ${action}-Aktion`,
        variant: "destructive"
      });
    }
  };

  const handleAddToList = async () => {
    if (!selectedList || selectedSubscribers.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Liste und mindestens einen Abonnenten aus.",
        variant: "destructive"
      });
      return;
    }

    try {
      const assignments = selectedSubscribers.map(subscriberId => ({
        list_id: selectedList,
        subscriber_id: subscriberId
      }));

      // Check for existing assignments to avoid duplicates
      const existingAssignments = subscriberListAssignments.filter(a => 
        a.list_id === selectedList && selectedSubscribers.includes(a.subscriber_id)
      );

      const newAssignments = assignments.filter(a => 
        !existingAssignments.some(ea => ea.subscriber_id === a.subscriber_id)
      );

      if (newAssignments.length === 0) {
        toast({
          title: "Info",
          description: "Alle ausgewählten Abonnenten sind bereits in dieser Liste.",
        });
        return;
      }

      const { error } = await supabase
        .from('email_list_subscribers')
        .insert(newAssignments);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: `${newAssignments.length} Abonnenten wurden zur Liste hinzugefügt.`,
      });

      setSelectedSubscribers([]);
      setSelectedList('');
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromList = async (subscriberId: string, listId: string) => {
    try {
      const { error } = await supabase
        .from('email_list_subscribers')
        .delete()
        .eq('subscriber_id', subscriberId)
        .eq('list_id', listId);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Abonnent wurde aus der Liste entfernt.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleImportSubscribers = async () => {
    if (!importData.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie CSV-Daten ein.",
        variant: "destructive"
      });
      return;
    }

    try {
      const lines = importData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      if (!headers.includes('email')) {
        toast({
          title: "Fehler",
          description: "CSV muss eine 'email' Spalte enthalten.",
          variant: "destructive"
        });
        return;
      }

      const subscribersToImport = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const subscriber: any = { source: 'import', status: 'active' };
        
        headers.forEach((header, index) => {
          if (values[index]) {
            if (header === 'tags') {
              subscriber[header] = values[index].split(';').map(t => t.trim());
            } else {
              subscriber[header] = values[index];
            }
          }
        });

        if (subscriber.email) {
          subscribersToImport.push(subscriber);
        }
      }

      if (subscribersToImport.length === 0) {
        toast({
          title: "Fehler",
          description: "Keine gültigen Abonnenten gefunden.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('email_subscribers')
        .insert(subscribersToImport);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: `${subscribersToImport.length} Abonnenten wurden importiert.`,
      });

      setImportData('');
      setShowImportDialog(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleExportSubscribers = () => {
    const csv = [
      ['email', 'first_name', 'last_name', 'company', 'phone', 'status', 'source', 'tags', 'created_at'].join(','),
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.first_name || '',
        sub.last_name || '',
        sub.company || '',
        sub.phone || '',
        sub.status,
        sub.source || '',
        (sub.tags || []).join(';'),
        sub.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSubscriberLists = (subscriberId: string) => {
    return subscriberListAssignments
      .filter(a => a.subscriber_id === subscriberId)
      .map(a => emailLists.find(l => l.id === a.list_id))
      .filter(Boolean);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'bounced':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'unsubscribed':
        return <UserMinus className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'bounced':
        return 'destructive';
      case 'unsubscribed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Abonnenten-Verwaltung</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre E-Mail-Abonnenten und Newsletter-Listen
          </p>
        </div>
        <Button onClick={() => {
          console.log('Add subscriber dialog opened');
          setShowAddDialog(true);
        }}>
          <UserPlus className="h-4 w-4 mr-2" />
          Abonnent hinzufügen
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gesamt</p>
                <p className="text-2xl font-bold">{subscribers.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktiv</p>
                <p className="text-2xl font-bold text-green-600">
                  {subscribers.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Abgemeldet</p>
                <p className="text-2xl font-bold text-orange-600">
                  {subscribers.filter(s => s.status === 'unsubscribed').length}
                </p>
              </div>
              <UserMinus className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Listen</p>
                <p className="text-2xl font-bold">{emailLists.length}</p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Suchen</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nach E-Mail, Name oder Firma suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="unsubscribed">Abgemeldet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Liste</Label>
              <Select value={listFilter} onValueChange={setListFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Listen</SelectItem>
                  <SelectItem value="none">Keine Liste</SelectItem>
                  {emailLists.map(list => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name} ({list.subscriber_count || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quelle</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Quellen</SelectItem>
                  <SelectItem value="website_newsletter">Website</SelectItem>
                  <SelectItem value="manual">Manuell</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedSubscribers.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('activate')}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aktivieren ({selectedSubscribers.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deaktivieren ({selectedSubscribers.length})
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen ({selectedSubscribers.length})
              </Button>
            </div>
          )}

          {/* Import/Export Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importieren
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleExportSubscribers}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
          </div>

          {/* List Assignment */}
          {selectedSubscribers.length > 0 && (
            <div className="flex gap-2 items-end">
              <div>
                <Label>Zu Liste hinzufügen</Label>
                <Select value={selectedList} onValueChange={setSelectedList}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Liste wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailLists.map(list => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleAddToList}
                disabled={!selectedList}
              >
                <Plus className="h-4 w-4 mr-2" />
                Hinzufügen
              </Button>
            </div>
           )}
        </CardContent>
      </Card>

      {/* Add Test Button for Debugging */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2 items-center">
            <Badge variant="outline">Debug Panel</Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('🧪 Test Edit Dialog - Current subscribers:', subscribers);
                if (subscribers.length > 0) {
                  console.log('🧪 Opening edit dialog for first subscriber');
                  openEditDialog(subscribers[0]);
                } else {
                  console.log('🧪 No subscribers available for testing');
                }
              }}
            >
              Test Edit Dialog
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('🧪 Current state:', {
                  showEditDialog,
                  editingSubscriber,
                  formData,
                  subscribers: subscribers.length
                });
              }}
            >
              Log State
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscribers(filteredSubscribers.map(s => s.id));
                      } else {
                        setSelectedSubscribers([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>Listen</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Quelle</TableHead>
                <TableHead>Angemeldet</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Lade Abonnenten...
                  </TableCell>
                </TableRow>
              ) : filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Keine Abonnenten gefunden
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map(subscriber => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers(prev => [...prev, subscriber.id]);
                          } else {
                            setSelectedSubscribers(prev => prev.filter(id => id !== subscriber.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(subscriber.status)}
                        <Badge variant={getStatusColor(subscriber.status) as any}>
                          {subscriber.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {subscriber.first_name} {subscriber.last_name}
                        </div>
                        {subscriber.phone && (
                          <div className="text-xs text-muted-foreground">
                            {subscriber.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{subscriber.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{subscriber.company || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getSubscriberLists(subscriber.id).map((list: any) => (
                          <div key={list.id} className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {list.name}
                            </Badge>
                            <button
                              onClick={() => handleRemoveFromList(subscriber.id, list.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Aus Liste entfernen"
                            >
                              <XCircle className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {getSubscriberLists(subscriber.id).length === 0 && (
                          <span className="text-muted-foreground text-sm">Keine Listen</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {subscriber.tags && subscriber.tags.length > 0 ? (
                          subscriber.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                        {subscriber.tags && subscriber.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{subscriber.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {subscriber.source || 'unbekannt'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(subscriber.created_at), 'PPP', { locale: de })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('🔄 Edit button clicked for subscriber:', subscriber.email, subscriber.id);
                            openEditDialog(subscriber);
                          }}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                          title="Bearbeiten"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('🗑️ Delete button clicked for subscriber:', subscriber.email, subscriber.id);
                            handleDeleteSubscriber(subscriber.id);
                          }}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-red-50 hover:text-red-700 h-8 w-8 text-red-600"
                          title="Löschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Subscriber Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Abonnent hinzufügen</DialogTitle>
            <DialogDescription>
              Fügen Sie einen neuen E-Mail-Abonnenten hinzu
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-email">E-Mail-Adresse *</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="beispiel@firma.de"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="add-first-name">Vorname</Label>
                <Input
                  id="add-first-name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  placeholder="Max"
                />
              </div>
              <div>
                <Label htmlFor="add-last-name">Nachname</Label>
                <Input
                  id="add-last-name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  placeholder="Mustermann"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-company">Firma</Label>
              <Input
                id="add-company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Beispiel GmbH"
              />
            </div>
            
            <div>
              <Label htmlFor="add-phone">Telefon</Label>
              <Input
                id="add-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+49 123 456789"
              />
            </div>
            
            <div>
              <Label htmlFor="add-tags">Tags (durch Komma getrennt)</Label>
              <Input
                id="add-tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="webdesign, marketing, premium"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: any) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quelle</Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => setFormData({...formData, source: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuell</SelectItem>
                    <SelectItem value="website_newsletter">Website</SelectItem>
                    <SelectItem value="contact_form">Kontaktformular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Add subscriber button clicked');
                  handleAddSubscriber();
                }} 
                className="flex-1"
                disabled={!formData.email}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Hinzufügen
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Cancel add button clicked');
                  setShowAddDialog(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subscriber Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        console.log('Edit dialog open state changed:', open);
        setShowEditDialog(open);
        if (!open) {
          setEditingSubscriber(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Abonnent bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Daten von: {editingSubscriber?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-email">E-Mail-Adresse *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-first-name">Vorname</Label>
                <Input
                  id="edit-first-name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-last-name">Nachname</Label>
                <Input
                  id="edit-last-name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-company">Firma</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Telefon</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-tags">Tags (durch Komma getrennt)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: any) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                    <SelectItem value="unsubscribed">Abgemeldet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quelle</Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => setFormData({...formData, source: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuell</SelectItem>
                    <SelectItem value="website_newsletter">Website</SelectItem>
                    <SelectItem value="contact_form">Kontaktformular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Save edit button clicked');
                  handleEditSubscriber();
                }}
                className="flex-1"
                disabled={!formData.email}
              >
                <Edit className="h-4 w-4 mr-2" />
                Speichern
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Cancel edit button clicked');
                  setShowEditDialog(false);
                  setEditingSubscriber(null);
                  resetForm();
                }}
                className="flex-1"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Subscribers Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Abonnenten importieren</DialogTitle>
            <DialogDescription>
              Importieren Sie Abonnenten im CSV-Format. Die erste Zeile sollte die Spaltenüberschriften enthalten.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>CSV-Format Beispiel:</Label>
              <div className="bg-muted p-3 rounded text-sm font-mono">
                email,first_name,last_name,company,phone,tags<br/>
                max@example.com,Max,Mustermann,Beispiel GmbH,+49123456789,premium;webdesign<br/>
                anna@firma.de,Anna,Schmidt,Test AG,,marketing
              </div>
            </div>
            
            <div>
              <Label htmlFor="import-data">CSV-Daten einfügen:</Label>
              <textarea
                id="import-data"
                className="w-full h-48 p-3 border rounded-md font-mono text-sm"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="email,first_name,last_name,company,phone,tags
max@example.com,Max,Mustermann,Beispiel GmbH,+49123456789,premium;webdesign
anna@firma.de,Anna,Schmidt,Test AG,,marketing"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleImportSubscribers}
                disabled={!importData.trim()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importieren
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowImportDialog(false);
                  setImportData('');
                }}
                className="flex-1"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}