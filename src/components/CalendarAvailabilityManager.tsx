import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Plus, Trash2, Edit3, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface DaySchedule {
  start: string;
  end: string;
  active: boolean;
}

interface AvailabilityTemplate {
  id: string;
  name: string;
  description: string;
  schedule: {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
  };
  is_active: boolean;
}

const DAYS = [
  { key: 'monday', label: 'Montag' },
  { key: 'tuesday', label: 'Dienstag' },
  { key: 'wednesday', label: 'Mittwoch' },
  { key: 'thursday', label: 'Donnerstag' },
  { key: 'friday', label: 'Freitag' },
  { key: 'saturday', label: 'Samstag' },
  { key: 'sunday', label: 'Sonntag' },
];

const DEFAULT_SCHEDULE = {
  monday: { start: '09:00', end: '17:00', active: true },
  tuesday: { start: '09:00', end: '17:00', active: true },
  wednesday: { start: '09:00', end: '17:00', active: true },
  thursday: { start: '09:00', end: '17:00', active: true },
  friday: { start: '09:00', end: '17:00', active: true },
  saturday: { start: '09:00', end: '17:00', active: false },
  sunday: { start: '09:00', end: '17:00', active: false },
};

export default function CalendarAvailabilityManager() {
  const [templates, setTemplates] = useState<AvailabilityTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    schedule: { ...DEFAULT_SCHEDULE },
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('availability_templates')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedTemplates = (data || []).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        schedule: t.schedule as AvailabilityTemplate['schedule'],
        is_active: t.is_active,
      }));

      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Fehler",
        description: "Vorlagen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async () => {
    if (!newTemplate.name) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen ein",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('availability_templates')
        .insert({
          name: newTemplate.name,
          description: newTemplate.description,
          schedule: newTemplate.schedule,
          is_active: false,
        });

      if (error) throw error;

      toast({
        title: "Vorlage erstellt",
        description: "Die neue Verfügbarkeits-Vorlage wurde gespeichert.",
      });

      setNewTemplate({ name: '', description: '', schedule: { ...DEFAULT_SCHEDULE } });
      setShowCreateForm(false);
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Fehler",
        description: "Vorlage konnte nicht erstellt werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const activateTemplate = async (templateId: string) => {
    setSaving(true);
    try {
      // Deactivate all templates
      await supabase
        .from('availability_templates')
        .update({ is_active: false })
        .neq('id', templateId);

      // Activate the selected template
      const { error } = await supabase
        .from('availability_templates')
        .update({ is_active: true })
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Vorlage aktiviert",
        description: "Die neue Vorlage ist jetzt aktiv und wird für die Terminplanung verwendet.",
      });

      loadTemplates();
    } catch (error) {
      console.error('Error activating template:', error);
      toast({
        title: "Fehler",
        description: "Vorlage konnte nicht aktiviert werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.is_active) {
      toast({
        title: "Fehler",
        description: "Die aktive Vorlage kann nicht gelöscht werden. Aktivieren Sie zuerst eine andere Vorlage.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('availability_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Vorlage gelöscht",
        description: "Die Verfügbarkeits-Vorlage wurde erfolgreich entfernt.",
      });

      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Fehler",
        description: "Vorlage konnte nicht gelöscht werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNewSchedule = (dayKey: string, field: string, value: string | boolean) => {
    setNewTemplate(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayKey]: {
          ...prev.schedule[dayKey as keyof typeof prev.schedule],
          [field]: value,
        },
      },
    }));
  };

  const getActiveHours = (schedule: AvailabilityTemplate['schedule']) => {
    return Object.entries(schedule).filter(([_, day]) => day?.active).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Verfügbarkeits-Vorlagen werden geladen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Verfügbarkeits-Vorlagen</h2>
          <p className="text-muted-foreground">
            Verwalten Sie verschiedene Zeitpläne für unterschiedliche Situationen
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
          disabled={saving}
        >
          <Plus className="h-4 w-4" />
          Neue Vorlage erstellen
        </Button>
      </div>

      {showCreateForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Neue Verfügbarkeits-Vorlage erstellen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Vorlagen-Name</Label>
                <Input
                  id="template-name"
                  placeholder="z.B. Sommerstunden"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Beschreibung</Label>
                <Input
                  id="template-description"
                  placeholder="z.B. Reduzierte Stunden im Sommer"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Wochenzeitplan definieren</Label>
              {DAYS.map(day => {
                const daySchedule = newTemplate.schedule[day.key as keyof typeof newTemplate.schedule];
                return (
                  <div key={day.key} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-24">
                      <Badge variant="outline">{day.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        className="w-28"
                        value={daySchedule?.start || '09:00'}
                        onChange={(e) => updateNewSchedule(day.key, 'start', e.target.value)}
                      />
                      <span className="text-muted-foreground">bis</span>
                      <Input
                        type="time"
                        className="w-28"
                        value={daySchedule?.end || '17:00'}
                        onChange={(e) => updateNewSchedule(day.key, 'end', e.target.value)}
                      />
                    </div>
                    <Button 
                      variant={daySchedule?.active ? "default" : "outline"} 
                      size="sm"
                      onClick={() => updateNewSchedule(day.key, 'active', !daySchedule?.active)}
                    >
                      {daySchedule?.active ? 'Aktiv' : 'Inaktiv'}
                    </Button>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="flex-1"
                disabled={saving}
              >
                Abbrechen
              </Button>
              <Button 
                onClick={createTemplate}
                className="flex-1"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  'Vorlage speichern'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Keine Vorlagen vorhanden</h3>
            <p className="text-muted-foreground mb-4">
              Erstellen Sie Ihre erste Verfügbarkeits-Vorlage, um die Terminplanung zu starten.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Erste Vorlage erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(template => (
            <Card key={template.id} className={`glass-card ${template.is_active ? 'border-primary ring-2 ring-primary/20' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {template.name}
                      {template.is_active && (
                        <Badge className="bg-primary text-primary-foreground">Aktiv</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {!template.is_active && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {DAYS.map(day => {
                    const daySchedule = template.schedule[day.key as keyof typeof template.schedule];
                    return (
                      <div key={day.key} className="flex items-center justify-between text-sm">
                        <span className="w-24">{day.label}</span>
                        {daySchedule?.active ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Clock className="h-3 w-3" />
                            <span>{daySchedule.start} - {daySchedule.end}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Nicht verfügbar</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {getActiveHours(template.schedule)} aktive Tage pro Woche
                  </AlertDescription>
                </Alert>

                {!template.is_active && (
                  <Button 
                    onClick={() => activateTemplate(template.id)}
                    variant="outline"
                    className="w-full"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Aktiviere...
                      </>
                    ) : (
                      'Diese Vorlage aktivieren'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
