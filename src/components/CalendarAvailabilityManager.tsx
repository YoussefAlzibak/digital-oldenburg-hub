import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, Trash2, Edit3, Clock, AlertCircle } from 'lucide-react';

interface AvailabilityTemplate {
  id: string;
  name: string;
  description: string;
  schedule: {
    monday?: { start: string; end: string; active: boolean };
    tuesday?: { start: string; end: string; active: boolean };
    wednesday?: { start: string; end: string; active: boolean };
    thursday?: { start: string; end: string; active: boolean };
    friday?: { start: string; end: string; active: boolean };
    saturday?: { start: string; end: string; active: boolean };
    sunday?: { start: string; end: string; active: boolean };
  };
  isActive: boolean;
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

export default function CalendarAvailabilityManager() {
  const [templates, setTemplates] = useState<AvailabilityTemplate[]>([
    {
      id: '1',
      name: 'Standard Bürozeiten',
      description: 'Montag bis Freitag, 9:00 - 17:00 Uhr',
      schedule: {
        monday: { start: '09:00', end: '17:00', active: true },
        tuesday: { start: '09:00', end: '17:00', active: true },
        wednesday: { start: '09:00', end: '17:00', active: true },
        thursday: { start: '09:00', end: '17:00', active: true },
        friday: { start: '09:00', end: '17:00', active: true },
        saturday: { start: '09:00', end: '17:00', active: false },
        sunday: { start: '09:00', end: '17:00', active: false },
      },
      isActive: true,
    },
    {
      id: '2',
      name: 'Erweiterte Zeiten',
      description: 'Montag bis Samstag, flexiblere Zeiten',
      schedule: {
        monday: { start: '08:00', end: '18:00', active: true },
        tuesday: { start: '08:00', end: '18:00', active: true },
        wednesday: { start: '08:00', end: '18:00', active: true },
        thursday: { start: '08:00', end: '18:00', active: true },
        friday: { start: '08:00', end: '18:00', active: true },
        saturday: { start: '10:00', end: '14:00', active: true },
        sunday: { start: '08:00', end: '18:00', active: false },
      },
      isActive: false,
    },
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<AvailabilityTemplate>>({
    name: '',
    description: '',
    schedule: {},
  });
  const { toast } = useToast();

  const activateTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template => ({
      ...template,
      isActive: template.id === templateId
    })));
    
    toast({
      title: "Verfügbarkeits-Vorlage aktiviert",
      description: "Die neue Vorlage ist jetzt aktiv und wird für die Terminplanung verwendet.",
    });
  };

  const deleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isActive) {
      toast({
        title: "Fehler",
        description: "Die aktive Vorlage kann nicht gelöscht werden. Aktivieren Sie zuerst eine andere Vorlage.",
        variant: "destructive",
      });
      return;
    }

    setTemplates(prev => prev.filter(template => template.id !== templateId));
    toast({
      title: "Vorlage gelöscht",
      description: "Die Verfügbarkeits-Vorlage wurde erfolgreich entfernt.",
    });
  };

  const getActiveHours = (schedule: AvailabilityTemplate['schedule']) => {
    const activeDays = Object.entries(schedule).filter(([_, day]) => day?.active).length;
    return activeDays;
  };

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
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Beschreibung</Label>
                <Input
                  id="template-description"
                  placeholder="z.B. Reduzierte Stunden im Sommer"
                  value={newTemplate.description || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Wochenzeitplan definieren</Label>
              {DAYS.map(day => (
                <div key={day.key} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-20">
                    <Badge variant="outline">{day.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      className="w-24"
                      defaultValue="09:00"
                    />
                    <span className="text-muted-foreground">bis</span>
                    <Input
                      type="time"
                      className="w-24"
                      defaultValue="17:00"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Aktiv
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button className="flex-1">
                Vorlage speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <Card key={template.id} className={`glass-card ${template.isActive ? 'border-primary ring-2 ring-primary/20' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {template.name}
                    {template.isActive && (
                      <Badge className="bg-primary text-primary-foreground">Aktiv</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  {!template.isActive && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
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
                      <span className="w-20">{day.label}</span>
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

              {!template.isActive && (
                <Button 
                  onClick={() => activateTemplate(template.id)}
                  variant="outline"
                  className="w-full"
                >
                  Diese Vorlage aktivieren
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}