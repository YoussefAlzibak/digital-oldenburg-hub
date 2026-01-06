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
  AlertCircle,
  Phone,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showImportDialog, setShowImportDialog] = useState(false);
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
  const isMobile = useIsMobile();

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

      const { error } = await supabase
        .from('email_subscribers')
        .insert([subscriberData]);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Abonnent wurde hinzugefügt.",
      });

      resetForm();
      setShowAddDialog(false);
      loadData();
    } catch (error: any) {
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

      const { error } = await supabase
        .from('email_subscribers')
        .update(updateData)
        .eq('id', editingSubscriber.id);

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
      const { error } = await supabase
        .from('email_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Abonnent wurde gelöscht.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message || 'Unbekannter Fehler beim Löschen des Abonnenten',
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (subscriber: EmailSubscriber) => {
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
      if (action === 'delete') {
        const { error } = await supabase
          .from('email_subscribers')
          .delete()
          .in('id', selectedSubscribers);

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: `${selectedSubscribers.length} Abonnenten wurden gelöscht.`,
        });
      } else if (action === 'activate' || action === 'deactivate') {
        const newStatus = action === 'activate' ? 'active' : 'inactive';
        
        const { error } = await supabase
          .from('email_subscribers')
          .update({ status: newStatus })
          .in('id', selectedSubscribers);

        if (error) throw error;

        toast({
          title: "Erfolg",
          description: `${selectedSubscribers.length} Abonnenten wurden ${action === 'activate' ? 'aktiviert' : 'deaktiviert'}.`,
        });
      }

      setSelectedSubscribers([]);
      loadData();
    } catch (error: any) {
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
      const header = lines[0].toLowerCase().split(',');
      
      const emailIndex = header.findIndex(h => h.includes('email') || h.includes('e-mail'));
      if (emailIndex === -1) {
        throw new Error('E-Mail-Spalte nicht gefunden');
      }

      const subscribersToImport = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const email = values[emailIndex]?.trim();
        
        if (email) {
          subscribersToImport.push({
            email,
            first_name: values[header.findIndex(h => h.includes('first') || h.includes('vorname'))]?.trim() || null,
            last_name: values[header.findIndex(h => h.includes('last') || h.includes('nachname'))]?.trim() || null,
            company: values[header.findIndex(h => h.includes('company') || h.includes('firma'))]?.trim() || null,
            phone: values[header.findIndex(h => h.includes('phone') || h.includes('telefon'))]?.trim() || null,
            status: 'active',
            source: 'import'
          });
        }
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
        title: "Fehler beim Import",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleExportSubscribers = () => {
    const csv = [
      'E-Mail,Vorname,Nachname,Firma,Telefon,Status,Quelle,Angemeldet',
      ...filteredSubscribers.map(s => [
        s.email,
        s.first_name || '',
        s.last_name || '',
        s.company || '',
        s.phone || '',
        s.status,
        s.source || '',
        format(new Date(s.created_at), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abonnenten-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      active: "default",
      inactive: "secondary",
      bounced: "destructive",
      unsubscribed: "outline"
    };

    const labels: { [key: string]: string } = {
      active: "Aktiv",
      inactive: "Inaktiv",
      bounced: "Bounced",
      unsubscribed: "Abgemeldet"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getSubscriberLists = (subscriberId: string) => {
    const listIds = subscriberListAssignments
      .filter(a => a.subscriber_id === subscriberId)
      .map(a => a.list_id);
    
    return emailLists.filter(list => listIds.includes(list.id));
  };

  const MobileSubscriberCard = ({ subscriber }: { subscriber: EmailSubscriber }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
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
              className="rounded"
            />
            {getStatusBadge(subscriber.status)}
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openEditDialog(subscriber)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteSubscriber(subscriber.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="font-medium text-sm">
              {subscriber.first_name} {subscriber.last_name}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {subscriber.email}
            </div>
          </div>
          
          {subscriber.company && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-3 w-3" />
              {subscriber.company}
            </div>
          )}
          
          {subscriber.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {subscriber.phone}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(subscriber.created_at), 'PPP', { locale: de })}
          </div>

          {subscriber.tags && subscriber.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {subscriber.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {subscriber.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{subscriber.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {getSubscriberLists(subscriber.id).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {getSubscriberLists(subscriber.id).map(list => (
                <Badge key={list.id} variant="secondary" className="text-xs">
                  {list.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center p-8">Lade Abonnenten...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Abonnenten verwalten</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Verwalten Sie Ihre E-Mail-Abonnenten und Listen ({filteredSubscribers.length} von {subscribers.length} angezeigt)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowImportDialog(true)} variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Importieren</span>
            <span className="sm:hidden">Import</span>
          </Button>
          <Button onClick={handleExportSubscribers} variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exportieren</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button onClick={() => setShowAddDialog(true)} size="sm" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Hinzufügen</span>
            <span className="sm:hidden">Neu</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscribers" className="text-xs sm:text-sm">Abonnenten</TabsTrigger>
          <TabsTrigger value="lists" className="text-xs sm:text-sm">Listen</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen nach E-Mail, Name, oder Firma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="unsubscribed">Abgemeldet</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Quelle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Quellen</SelectItem>
                  <SelectItem value="manual">Manuell</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>

              <Select value={listFilter} onValueChange={setListFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Liste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Listen</SelectItem>
                  <SelectItem value="none">Keine Liste</SelectItem>
                  {emailLists.map(list => (
                    <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedSubscribers.length > 0 && (
            <Card className="p-3 md:p-4 bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm font-medium">
                  {selectedSubscribers.length} Abonnenten ausgewählt
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2">
                    <Select value={selectedList} onValueChange={setSelectedList}>
                      <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Liste wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailLists.filter(list => list.is_active).map(list => (
                          <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleAddToList}
                      disabled={!selectedList}
                      className="flex-shrink-0"
                    >
                      <UserPlus className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Zu Liste hinzufügen</span>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleBulkAction('activate')}
                      className="flex-1 sm:flex-none"
                    >
                      <CheckCircle2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Aktivieren</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleBulkAction('deactivate')}
                      className="flex-1 sm:flex-none"
                    >
                      <UserMinus className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Deaktivieren</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleBulkAction('delete')}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Löschen</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Subscribers List */}
          {isMobile ? (
            // Mobile Card View
            <div className="space-y-3">
              {filteredSubscribers.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    Keine Abonnenten gefunden
                  </div>
                </Card>
              ) : (
                filteredSubscribers.map(subscriber => (
                  <MobileSubscriberCard key={subscriber.id} subscriber={subscriber} />
                ))
              )}
            </div>
          ) : (
            // Desktop Table View
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
                    {filteredSubscribers.length === 0 ? (
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
                            {getStatusBadge(subscriber.status)}
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
                                <Badge key={list.id} variant="outline" className="text-xs">
                                  {list.name}
                                </Badge>
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
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditDialog(subscriber)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteSubscriber(subscriber.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Listen</CardTitle>
              <CardDescription>Verwalten Sie Ihre Abonnenten-Listen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Listen-Verwaltung wird bald verfügbar sein
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Abonnenten-Statistiken und Berichte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Analytics werden bald verfügbar sein
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Subscriber Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                placeholder="Musterfirma GmbH"
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
              <Label htmlFor="add-tags">Tags (kommagetrennt)</Label>
              <Input
                id="add-tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="interessent, newsletter"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="add-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
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
                <Label htmlFor="add-source">Quelle</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuell</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button onClick={handleAddSubscriber} className="flex-1">
                Hinzufügen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subscriber Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Abonnent bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Informationen des Abonnenten
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
                placeholder="beispiel@firma.de"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-first-name">Vorname</Label>
                <Input
                  id="edit-first-name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  placeholder="Max"
                />
              </div>
              <div>
                <Label htmlFor="edit-last-name">Nachname</Label>
                <Input
                  id="edit-last-name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-company">Firma</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Musterfirma GmbH"
              />
            </div>

            <div>
              <Label htmlFor="edit-phone">Telefon</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+49 123 456789"
              />
            </div>

            <div>
              <Label htmlFor="edit-tags">Tags (kommagetrennt)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="interessent, newsletter"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
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
                <Label htmlFor="edit-source">Quelle</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manuell</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingSubscriber(null);
                  resetForm();
                }} 
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button onClick={handleEditSubscriber} className="flex-1">
                Speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Abonnenten importieren</DialogTitle>
            <DialogDescription>
              Fügen Sie CSV-Daten ein (erste Zeile muss Header enthalten)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>CSV-Daten</Label>
              <textarea
                className="w-full h-32 p-2 text-sm border rounded-md"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="email,first_name,last_name,company&#10;max@example.com,Max,Mustermann,Firma GmbH&#10;..."
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Unterstützte Spalten: email (erforderlich), first_name, last_name, company, phone
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowImportDialog(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button onClick={handleImportSubscribers} className="flex-1">
                Importieren
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}