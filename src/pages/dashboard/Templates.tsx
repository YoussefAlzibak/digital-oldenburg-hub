import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  StarOff,
  Check,
  Mail,
  Zap,
  ShoppingBag,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TemplateEditor from '@/components/TemplateEditor';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const templateCategories = [
  { value: 'all', label: 'Alle Templates', icon: LayoutGrid },
  { value: 'marketing', label: 'Marketing', icon: Mail },
  { value: 'transactional', label: 'Transaktional', icon: Check },
  { value: 'automation', label: 'Automation', icon: Zap },
  { value: 'newsletter', label: 'Newsletter', icon: MessageSquare },
  { value: 'promotion', label: 'Promotion', icon: ShoppingBag },
];

const prebuiltTemplates = [
  {
    id: 'welcome',
    name: 'Willkommens-E-Mail',
    description: 'Begrüßen Sie neue Abonnenten herzlich',
    category: 'automation',
    icon: '👋'
  },
  {
    id: 'newsletter',
    name: 'Newsletter Standard',
    description: 'Klassisches Newsletter-Layout',
    category: 'newsletter',
    icon: '📬'
  },
  {
    id: 'promotion',
    name: 'Aktionsangebot',
    description: 'Bewerben Sie Sonderangebote',
    category: 'promotion',
    icon: '🎁'
  },
  {
    id: 'appointment-reminder',
    name: 'Termin-Erinnerung',
    description: 'Erinnern Sie Kunden an Termine',
    category: 'transactional',
    icon: '📅'
  },
  {
    id: 'thank-you',
    name: 'Dankes-E-Mail',
    description: 'Bedanken Sie sich bei Kunden',
    category: 'transactional',
    icon: '🙏'
  },
  {
    id: 'feedback-request',
    name: 'Feedback-Anfrage',
    description: 'Bitten Sie um Kundenbewertungen',
    category: 'marketing',
    icon: '⭐'
  },
];

export default function Templates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [showStarterDialog, setShowStarterDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Templates konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Möchten Sie das Template "${name}" wirklich löschen?`)) return;

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Gelöscht",
        description: "Template wurde erfolgreich gelöscht.",
      });
      loadTemplates();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert([{
          name: `${template.name} (Kopie)`,
          subject: template.subject,
          html_content: template.html_content,
          text_content: template.text_content,
          template_type: template.template_type,
          is_active: false
        }]);

      if (error) throw error;

      toast({
        title: "Dupliziert",
        description: "Template wurde erfolgreich kopiert.",
      });
      loadTemplates();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Aktualisiert",
        description: `Template ${!currentStatus ? 'aktiviert' : 'deaktiviert'}.`,
      });
      loadTemplates();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateFromStarter = (starterId: string) => {
    setShowStarterDialog(false);
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.template_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'marketing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'transactional': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'automation': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'newsletter': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'promotion': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'marketing': return 'Marketing';
      case 'transactional': return 'Transaktion';
      case 'automation': return 'Automation';
      case 'newsletter': return 'Newsletter';
      case 'promotion': return 'Promotion';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 animate-spin" />
          <span>Lade Templates...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <TemplateEditor
        template={editingTemplate}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingTemplate(null);
        }}
        onSave={() => {
          loadTemplates();
          setShowEditor(false);
          setEditingTemplate(null);
        }}
      />

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {previewTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              <span className="font-medium">Betreff:</span> {previewTemplate?.subject}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="html" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="html">HTML-Ansicht</TabsTrigger>
              <TabsTrigger value="text">Text-Ansicht</TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <div className="border rounded-lg bg-white overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{ __html: previewTemplate?.html_content || '' }}
                  className="prose max-w-none"
                />
              </div>
            </TabsContent>
            <TabsContent value="text">
              <div className="border rounded-lg p-4 bg-muted/30 whitespace-pre-wrap font-mono text-sm">
                {previewTemplate?.text_content || 'Keine Text-Version verfügbar'}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              E-Mail Templates
            </h1>
            <p className="text-muted-foreground">
              Erstellen und verwalten Sie professionelle E-Mail-Vorlagen
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showStarterDialog} onOpenChange={setShowStarterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Starter-Vorlagen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Starter-Vorlagen</DialogTitle>
                  <DialogDescription>
                    Wählen Sie eine vorgefertigte Vorlage als Ausgangspunkt
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                  {prebuiltTemplates.map((starter) => (
                    <Card 
                      key={starter.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleCreateFromStarter(starter.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-3">{starter.icon}</div>
                        <h3 className="font-semibold text-sm mb-1">{starter.name}</h3>
                        <p className="text-xs text-muted-foreground">{starter.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {getTypeLabel(starter.category)}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => {
              setEditingTemplate(null);
              setShowEditor(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Neues Template
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktiv</p>
                  <p className="text-2xl font-bold text-green-600">
                    {templates.filter(t => t.is_active).length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Marketing</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {templates.filter(t => t.template_type === 'marketing').length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-blue-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Automation</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {templates.filter(t => t.template_type === 'automation').length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Templates durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="h-10 flex-wrap">
                    {templateCategories.map((cat) => (
                      <TabsTrigger key={cat.value} value={cat.value} className="text-xs px-3">
                        {cat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Keine Templates gefunden</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Versuchen Sie eine andere Suche oder Kategorie'
                  : 'Erstellen Sie Ihr erstes E-Mail-Template'
                }
              </p>
              <Button onClick={() => {
                setEditingTemplate(null);
                setShowEditor(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Erstes Template erstellen
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {template.subject}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={template.is_active ? 'text-yellow-500' : 'text-muted-foreground'}
                      onClick={() => handleToggleActive(template.id, template.is_active)}
                    >
                      {template.is_active ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className={getTypeColor(template.template_type)}>
                      {getTypeLabel(template.template_type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(template.created_at), 'dd. MMM yyyy', { locale: de })}
                    </span>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingTemplate(template);
                        setShowEditor(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Bearbeiten
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewTemplate(template);
                        setShowPreview(true);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(template.id, template.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={template.is_active ? 'text-yellow-500' : 'text-muted-foreground'}
                        onClick={() => handleToggleActive(template.id, template.is_active)}
                      >
                        {template.is_active ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{template.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{template.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getTypeColor(template.template_type)}>
                        {getTypeLabel(template.template_type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground hidden sm:inline">
                        {format(new Date(template.created_at), 'dd.MM.yyyy', { locale: de })}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTemplate(template);
                            setShowEditor(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPreviewTemplate(template);
                            setShowPreview(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(template.id, template.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Template-Variablen
            </CardTitle>
            <CardDescription>
              Verwenden Sie diese Platzhalter für personalisierte E-Mails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[
                { var: '{{first_name}}', desc: 'Vorname' },
                { var: '{{last_name}}', desc: 'Nachname' },
                { var: '{{email}}', desc: 'E-Mail' },
                { var: '{{company}}', desc: 'Unternehmen' },
                { var: '{{company_name}}', desc: 'Firmenname' },
                { var: '{{phone}}', desc: 'Telefon' },
                { var: '{{appointment_date}}', desc: 'Termindatum' },
                { var: '{{appointment_time}}', desc: 'Terminzeit' },
                { var: '{{service_type}}', desc: 'Service-Art' },
                { var: '{{meeting_type}}', desc: 'Meeting-Art' },
                { var: '{{meeting_link}}', desc: 'Meeting-Link' },
                { var: '{{website_url}}', desc: 'Website URL' },
                { var: '{{current_month}}', desc: 'Monat' },
                { var: '{{current_year}}', desc: 'Jahr' },
              ].map((item) => (
                <div 
                  key={item.var} 
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(item.var);
                    toast({
                      title: "Kopiert!",
                      description: `${item.var} wurde in die Zwischenablage kopiert.`,
                    });
                  }}
                >
                  <code className="bg-primary/10 px-2 py-1 rounded text-xs font-mono">
                    {item.var}
                  </code>
                  <span className="text-muted-foreground text-xs">{item.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
