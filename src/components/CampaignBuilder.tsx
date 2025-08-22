import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { 
  Send, 
  Calendar as CalendarIcon, 
  Eye, 
  Save, 
  Users, 
  Settings,
  Zap,
  Target,
  BarChart3,
  Copy,
  Play,
  Pause,
  TestTube,
  Code,
  Filter,
  Mail,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  template_type: string;
}

interface EmailList {
  id: string;
  name: string;
  description?: string;
  subscriber_count?: number;
}

interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  tags?: string[];
}

interface CampaignBuilderProps {
  campaign?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const formulaVariables = [
  { key: '{{first_name}}', label: 'Vorname', description: 'Vorname des Empfängers' },
  { key: '{{last_name}}', label: 'Nachname', description: 'Nachname des Empfängers' },
  { key: '{{email}}', label: 'E-Mail', description: 'E-Mail-Adresse' },
  { key: '{{company}}', label: 'Unternehmen', description: 'Firmenname' },
  { key: '{{company_name}}', label: 'Unser Unternehmen', description: 'Ihr Firmenname' },
  { key: '{{website_url}}', label: 'Website URL', description: 'Ihre Website-Adresse' },
  { key: '{{current_date}}', label: 'Aktuelles Datum', description: 'Heutiges Datum' },
  { key: '{{current_month}}', label: 'Aktueller Monat', description: 'Name des aktuellen Monats' },
  { key: '{{current_year}}', label: 'Aktuelles Jahr', description: 'Aktuelles Jahr' },
];

const advancedFormulas = [
  { 
    key: '{{#if company}}Sehr geehrte Damen und Herren von {{company}}{{else}}Hallo {{first_name}}{{/if}}', 
    label: 'Bedingte Anrede',
    description: 'Personalisierte Anrede je nach verfügbaren Daten'
  },
  { 
    key: '{{#each tags}}#{{this}} {{/each}}', 
    label: 'Tag-Liste',
    description: 'Alle Tags des Abonnenten anzeigen'
  },
  { 
    key: '{{#gt tags.length 0}}Sie interessieren sich für: {{#each tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/gt}}', 
    label: 'Interesse-Anzeige',
    description: 'Tags als Interessen anzeigen, falls vorhanden'
  }
];

export default function CampaignBuilder({ campaign, isOpen, onClose, onSave }: CampaignBuilderProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html_content: '',
    text_content: '',
    template_id: '',
    list_id: '',
    scheduled_at: '',
    template_type: 'campaign'
  });
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [lists, setLists] = useState<EmailList[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isScheduled, setIsScheduled] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormulaHelper, setShowFormulaHelper] = useState(false);
  const [recipientMode, setRecipientMode] = useState<'all' | 'list' | 'segment' | 'custom'>('all');
  const [segmentFilters, setSegmentFilters] = useState({
    tags: [] as string[],
    company: '',
    source: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTemplatesAndLists();
      if (campaign) {
        loadCampaignData();
      } else {
        resetForm();
      }
    }
  }, [campaign, isOpen]);

  const loadTemplatesAndLists = async () => {
    try {
      const [templatesResponse, listsResponse, subscribersResponse] = await Promise.all([
        supabase.from('email_templates').select('*').eq('is_active', true).order('name'),
        supabase.from('email_lists').select('*').eq('is_active', true).order('name'),
        supabase.from('email_subscribers').select('*').eq('status', 'active').limit(100)
      ]);

      if (templatesResponse.error) throw templatesResponse.error;
      if (listsResponse.error) throw listsResponse.error;
      if (subscribersResponse.error) throw subscribersResponse.error;

      setTemplates(templatesResponse.data || []);
      setLists(listsResponse.data || []);
      setSubscribers(subscribersResponse.data || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht geladen werden.",
        variant: "destructive"
      });
    }
  };

  const loadCampaignData = () => {
    if (!campaign) return;
    
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      html_content: campaign.html_content,
      text_content: campaign.text_content || '',
      template_id: campaign.template_id || '',
      list_id: campaign.list_id || '',
      scheduled_at: campaign.scheduled_at || '',
      template_type: 'campaign'
    });

    if (campaign.scheduled_at) {
      setIsScheduled(true);
      const scheduledDate = new Date(campaign.scheduled_at);
      setSelectedDate(scheduledDate);
      setSelectedTime(format(scheduledDate, 'HH:mm'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      html_content: '',
      text_content: '',
      template_id: '',
      list_id: '',
      scheduled_at: '',
      template_type: 'campaign'
    });
    setSelectedDate(undefined);
    setSelectedTime('09:00');
    setIsScheduled(false);
  };

  const loadTemplate = async (templateId: string) => {
    if (!templateId) return;

    try {
      const { data: template, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;
      if (template) {
        setFormData({
          ...formData,
          template_id: templateId,
          subject: template.subject,
          html_content: template.html_content,
          text_content: template.text_content || ''
        });
      }
    } catch (error: any) {
      console.error('Error loading template:', error);
      toast({
        title: "Fehler",
        description: "Template konnte nicht geladen werden.",
        variant: "destructive"
      });
    }
  };

  const insertFormula = (formula: string) => {
    const textarea = document.getElementById('html-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.html_content;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      
      setFormData({
        ...formData,
        html_content: before + formula + after
      });

      // Set cursor position after the inserted formula
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + formula.length;
        textarea.focus();
      }, 0);
    }
  };

  const previewContent = () => {
    const sampleSubscriber = subscribers[0] || {
      first_name: 'Max',
      last_name: 'Mustermann',
      email: 'max@example.com',
      company: 'Beispiel GmbH',
      tags: ['webdesign', 'marketing']
    };

    let preview = formData.html_content
      .replace(/\{\{first_name\}\}/g, sampleSubscriber.first_name || 'Kunde')
      .replace(/\{\{last_name\}\}/g, sampleSubscriber.last_name || '')
      .replace(/\{\{email\}\}/g, sampleSubscriber.email || '')
      .replace(/\{\{company\}\}/g, sampleSubscriber.company || '')
      .replace(/\{\{company_name\}\}/g, 'Digital Masters')
      .replace(/\{\{website_url\}\}/g, 'https://digital-masters.de')
      .replace(/\{\{current_date\}\}/g, format(new Date(), 'PPP', { locale: de }))
      .replace(/\{\{current_month\}\}/g, format(new Date(), 'MMMM', { locale: de }))
      .replace(/\{\{current_year\}\}/g, format(new Date(), 'yyyy'));

    return preview;
  };

  const handleSave = async () => {
    if (!formData.name || !formData.subject) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      let scheduledAt = null;
      if (isScheduled && selectedDate) {
        const [hours, minutes] = selectedTime.split(':');
        const scheduledDateTime = new Date(selectedDate);
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        scheduledAt = scheduledDateTime.toISOString();
      }

      const campaignData = {
        ...formData,
        scheduled_at: scheduledAt,
        status: scheduledAt ? 'scheduled' : 'draft'
      };

      if (campaign) {
        // Update existing campaign
        const { error } = await supabase
          .from('email_campaigns')
          .update(campaignData)
          .eq('id', campaign.id);

        if (error) throw error;
      } else {
        // Create new campaign
        const { error } = await supabase
          .from('email_campaigns')
          .insert([campaignData]);

        if (error) throw error;
      }

      toast({
        title: "Erfolg",
        description: `Kampagne wurde ${campaign ? 'aktualisiert' : 'erstellt'}.`,
      });

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendTestEmail = async () => {
    if (!formData.subject || !formData.html_content) {
      toast({
        title: "Fehler",
        description: "Betreff und Inhalt sind erforderlich für den Test.",
        variant: "destructive"
      });
      return;
    }

    // For now, show a success message
    toast({
      title: "Test-E-Mail",
      description: "Test-E-Mail Funktion wird implementiert...",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {campaign ? 'Kampagne bearbeiten' : 'Neue Kampagne erstellen'}
          </DialogTitle>
          <DialogDescription>
            Erstellen Sie professionelle E-Mail-Kampagnen mit erweiterten Formeln und Personalisierung
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Inhalt</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
            <TabsTrigger value="preview">Vorschau</TabsTrigger>
            <TabsTrigger value="formulas">Formeln</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign-name">Kampagnenname *</Label>
                    <Input
                      id="campaign-name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="z.B. Newsletter Oktober 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-select">Template auswählen</Label>
                    <Select 
                      value={formData.template_id} 
                      onValueChange={(value) => loadTemplate(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Template auswählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div>{template.name}</div>
                              <div className="text-xs text-muted-foreground">{template.template_type}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="campaign-subject">E-Mail Betreff *</Label>
                  <Input
                    id="campaign-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="z.B. Willkommen {{first_name}}, entdecken Sie unsere Angebote!"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="html-content">HTML Inhalt *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFormulaHelper(!showFormulaHelper)}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Formeln
                    </Button>
                  </div>
                  <Textarea
                    id="html-content"
                    value={formData.html_content}
                    onChange={(e) => setFormData({...formData, html_content: e.target.value})}
                    placeholder="HTML E-Mail Inhalt mit Variablen wie {{first_name}}"
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>

                {showFormulaHelper && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Verfügbare Formeln</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {formulaVariables.map(variable => (
                          <Button
                            key={variable.key}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto p-2"
                            onClick={() => insertFormula(variable.key)}
                          >
                            <div>
                              <div className="font-mono text-xs">{variable.key}</div>
                              <div className="text-xs text-muted-foreground">{variable.label}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Label className="text-sm font-medium">Erweiterte Formeln</Label>
                        <div className="space-y-2 mt-2">
                          {advancedFormulas.map((formula, index) => (
                            <div key={index} className="p-2 border rounded">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{formula.label}</div>
                                  <div className="text-xs text-muted-foreground">{formula.description}</div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => insertFormula(formula.key)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mt-2 p-2 bg-muted rounded font-mono text-xs break-all">
                                {formula.key}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Schnellaktionen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={sendTestEmail}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test senden
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(formData.html_content);
                        toast({ title: "Kopiert", description: "Inhalt wurde kopiert" });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Inhalt kopieren
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Statistiken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Zeichen (Betreff):</span>
                        <span className={formData.subject.length > 50 ? 'text-orange-500' : 'text-green-600'}>
                          {formData.subject.length}/50
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wörter (Inhalt):</span>
                        <span>{formData.html_content.split(' ').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Formeln verwendet:</span>
                        <span>{(formData.html_content.match(/\{\{[^}]+\}\}/g) || []).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Empfänger auswählen
                  </CardTitle>
                  <CardDescription>
                    Definieren Sie Ihre Zielgruppe für diese Kampagne
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Empfänger-Typ</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant={recipientMode === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRecipientMode('all')}
                        className="justify-start"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Alle Abonnenten
                      </Button>
                      <Button
                        variant={recipientMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRecipientMode('list')}
                        className="justify-start"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        E-Mail Liste
                      </Button>
                      <Button
                        variant={recipientMode === 'segment' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRecipientMode('segment')}
                        className="justify-start"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Segment
                      </Button>
                      <Button
                        variant={recipientMode === 'custom' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRecipientMode('custom')}
                        className="justify-start"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Auswahl
                      </Button>
                    </div>
                  </div>

                  {recipientMode === 'list' && (
                    <div className="space-y-3">
                      <Label>E-Mail Liste auswählen</Label>
                      {lists.length === 0 ? (
                        <div className="text-center p-6 border rounded-lg border-dashed">
                          <Mail className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Keine E-Mail Listen gefunden</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Alle aktiven Abonnenten ({subscribers.length}) werden verwendet
                          </p>
                        </div>
                      ) : (
                        <Select 
                          value={formData.list_id} 
                          onValueChange={(value) => setFormData({...formData, list_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Liste auswählen..." />
                          </SelectTrigger>
                          <SelectContent>
                            {lists.map(list => (
                              <SelectItem key={list.id} value={list.id}>
                                <div>
                                  <div>{list.name}</div>
                                  {list.description && (
                                    <div className="text-xs text-muted-foreground">
                                      {list.description}
                                    </div>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}

                  {recipientMode === 'segment' && (
                    <div className="space-y-3">
                      <div>
                        <Label>Firma Filter</Label>
                        <Input
                          value={segmentFilters.company}
                          onChange={(e) => setSegmentFilters({...segmentFilters, company: e.target.value})}
                          placeholder="Firma enthält..."
                        />
                      </div>
                      <div>
                        <Label>Tags Filter</Label>
                        <Input
                          value={segmentFilters.tags.join(', ')}
                          onChange={(e) => setSegmentFilters({...segmentFilters, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
                          placeholder="Tags (durch Komma getrennt)"
                        />
                      </div>
                      <div>
                        <Label>Quelle</Label>
                        <Select 
                          value={segmentFilters.source}
                          onValueChange={(value) => setSegmentFilters({...segmentFilters, source: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Quelle auswählen..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Alle Quellen</SelectItem>
                            <SelectItem value="website_newsletter">Website Newsletter</SelectItem>
                            <SelectItem value="contact_form">Kontaktformular</SelectItem>
                            <SelectItem value="manual">Manuell hinzugefügt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {recipientMode === 'custom' && (
                    <div>
                      <Label>Empfänger auswählen ({selectedSubscribers.length} ausgewählt)</Label>
                      {subscribers.length === 0 ? (
                        <div className="text-center p-6 border rounded-lg border-dashed">
                          <UserCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Keine Abonnenten gefunden</p>
                        </div>
                      ) : (
                        <>
                          <div className="border rounded-md max-h-48 overflow-y-auto mt-2">
                            {subscribers.map(subscriber => (
                              <div 
                                key={subscriber.id} 
                                className="flex items-center p-2 hover:bg-muted/50 cursor-pointer"
                                onClick={() => {
                                  const isSelected = selectedSubscribers.includes(subscriber.id);
                                  if (isSelected) {
                                    setSelectedSubscribers(prev => prev.filter(id => id !== subscriber.id));
                                  } else {
                                    setSelectedSubscribers(prev => [...prev, subscriber.id]);
                                  }
                                }}
                              >
                                <div className={cn(
                                  "w-4 h-4 border rounded mr-3 flex items-center justify-center",
                                  selectedSubscribers.includes(subscriber.id) && "bg-primary border-primary"
                                )}>
                                  {selectedSubscribers.includes(subscriber.id) && (
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {subscriber.first_name} {subscriber.last_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {subscriber.email}
                                  </div>
                                  {subscriber.company && (
                                    <div className="text-xs text-muted-foreground">
                                      {subscriber.company}
                                    </div>
                                  )}
                                </div>
                                {subscriber.tags && subscriber.tags.length > 0 && (
                                  <div className="flex gap-1">
                                    {subscriber.tags.slice(0, 2).map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {subscriber.tags.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{subscriber.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubscribers(subscribers.map(s => s.id))}
                            >
                              Alle auswählen
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubscribers([])}
                            >
                              Auswahl aufheben
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Geschätzte Empfänger:
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {(() => {
                        if (recipientMode === 'all') return subscribers.length;
                        if (recipientMode === 'list') {
                          if (!formData.list_id || lists.length === 0) return subscribers.length;
                          return lists.find(l => l.id === formData.list_id)?.subscriber_count || 0;
                        }
                        if (recipientMode === 'segment') {
                          return subscribers.filter(s => 
                            (!segmentFilters.company || s.company?.toLowerCase().includes(segmentFilters.company.toLowerCase())) &&
                            (segmentFilters.tags.length === 0 || segmentFilters.tags.some(tag => s.tags?.includes(tag)))
                          ).length;
                        }
                        if (recipientMode === 'custom') return selectedSubscribers.length;
                        return 0;
                      })()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Versandplanung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-scheduled"
                      checked={isScheduled}
                      onCheckedChange={setIsScheduled}
                    />
                    <Label htmlFor="is-scheduled">Geplanter Versand</Label>
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Datum</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'PPP', { locale: de }) : 'Datum auswählen'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="scheduled-time">Uhrzeit</Label>
                        <Input
                          id="scheduled-time"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">E-Mail Vorschau</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  Desktop
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  Mobile
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-white">
              <div className="mb-4 p-3 bg-gray-50 border-b">
                <div className="text-sm font-medium">Betreff: {formData.subject}</div>
                <div className="text-xs text-muted-foreground">Von: Digital Masters &lt;info@digital-masters.de&gt;</div>
              </div>
              
              <div 
                className={cn(
                  "mx-auto bg-white",
                  previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
                )}
                style={{ 
                  fontSize: previewMode === 'mobile' ? '14px' : '16px',
                  lineHeight: 1.6
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: previewContent() }} />
              </div>
            </div>
          </TabsContent>

          {/* Formulas Tab */}
          <TabsContent value="formulas" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Basis-Variablen</CardTitle>
                  <CardDescription>
                    Grundlegende Personalisierungsoptionen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {formulaVariables.map(variable => (
                    <div key={variable.key} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-mono text-sm">{variable.key}</div>
                        <div className="text-xs text-muted-foreground">{variable.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(variable.key);
                          toast({ title: "Kopiert", description: `${variable.key} wurde kopiert` });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Erweiterte Formeln</CardTitle>
                  <CardDescription>
                    Bedingte Logik und erweiterte Personalisierung
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {advancedFormulas.map((formula, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{formula.label}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(formula.key);
                            toast({ title: "Kopiert", description: "Formel wurde kopiert" });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {formula.description}
                      </div>
                      <div className="p-2 bg-muted rounded font-mono text-xs break-all">
                        {formula.key}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Formel-Syntax</CardTitle>
                <CardDescription>
                  Verstehen Sie die Syntax für erweiterte Formeln
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium mb-1">Bedingte Anzeige:</div>
                    <div className="p-2 bg-muted rounded font-mono text-xs">
                      {`{{#if variable}}Text wenn vorhanden{{else}}Alternative{{/if}}`}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-1">Listen durchlaufen:</div>
                    <div className="p-2 bg-muted rounded font-mono text-xs">
                      {`{{#each tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}`}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-1">Vergleiche:</div>
                    <div className="p-2 bg-muted rounded font-mono text-xs">
                      {`{{#gt tags.length 0}}Text bei mehr als 0 Tags{{/gt}}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Speichere...' : (campaign ? 'Aktualisieren' : 'Erstellen')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}