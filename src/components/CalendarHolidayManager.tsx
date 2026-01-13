import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Plus, Trash2, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'holiday' | 'vacation' | 'blocked';
  is_recurring: boolean;
  description?: string;
}

const HOLIDAY_TYPES = [
  { value: 'holiday', label: 'Feiertag', color: 'bg-red-100 text-red-800' },
  { value: 'vacation', label: 'Urlaub', color: 'bg-blue-100 text-blue-800' },
  { value: 'blocked', label: 'Gesperrt', color: 'bg-gray-100 text-gray-800' },
];

export default function CalendarHolidayManager() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    type: 'blocked' as Holiday['type'],
    is_recurring: false,
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_blocked_dates')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedHolidays = (data || []).map(h => ({
        id: h.id,
        name: h.name,
        date: parseISO(h.date),
        type: h.type as Holiday['type'],
        is_recurring: h.is_recurring,
        description: h.description || undefined,
      }));

      setHolidays(formattedHolidays);
    } catch (error) {
      console.error('Error loading holidays:', error);
      toast({
        title: "Fehler",
        description: "Feiertage konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHoliday = async () => {
    if (!selectedDate || !newHoliday.name) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie ein Datum und geben Sie einen Namen ein.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('calendar_blocked_dates')
        .insert({
          name: newHoliday.name,
          date: format(selectedDate, 'yyyy-MM-dd'),
          type: newHoliday.type,
          is_recurring: newHoliday.is_recurring,
          description: newHoliday.description || null,
        });

      if (error) throw error;

      toast({
        title: "Termin hinzugefügt",
        description: `${newHoliday.name} wurde für ${format(selectedDate, 'dd.MM.yyyy', { locale: de })} gesperrt.`,
      });

      setNewHoliday({ name: '', type: 'blocked', is_recurring: false, description: '' });
      setSelectedDate(undefined);
      setShowAddForm(false);
      loadHolidays();
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast({
        title: "Fehler",
        description: "Termin konnte nicht gesperrt werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const removeHoliday = async (id: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('calendar_blocked_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Termin entfernt",
        description: "Der gesperrte Termin wurde erfolgreich entfernt.",
      });

      loadHolidays();
    } catch (error) {
      console.error('Error removing holiday:', error);
      toast({
        title: "Fehler",
        description: "Termin konnte nicht entfernt werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getHolidayTypeInfo = (type: Holiday['type']) => {
    return HOLIDAY_TYPES.find(t => t.value === type);
  };

  const getUpcomingHolidays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return holidays
      .filter(h => h.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 10);
  };

  const isHolidayDate = (date: Date) => {
    return holidays.some(h => 
      h.date.toDateString() === date.toDateString()
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Feiertage werden geladen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gesperrte Termine & Feiertage</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Tage, an denen keine Termine gebucht werden können
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
          disabled={saving}
        >
          <Plus className="h-4 w-4" />
          Termin sperren
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kalender */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Kalender-Übersicht
            </CardTitle>
            <CardDescription>
              Gesperrte Termine sind rot markiert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={de}
              className="rounded-md border"
              modifiers={{
                holiday: (date) => isHolidayDate(date)
              }}
              modifiersStyles={{
                holiday: { 
                  backgroundColor: 'hsl(var(--destructive))', 
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            
            {selectedDate && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Ausgewähltes Datum: <strong>{format(selectedDate, 'dd.MM.yyyy', { locale: de })}</strong>
                  {isHolidayDate(selectedDate) && (
                    <span className="text-destructive"> - Bereits gesperrt</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Formular / Liste */}
        <div className="space-y-4">
          {showAddForm && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Neuen Termin sperren
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="holiday-name">Bezeichnung</Label>
                  <Input
                    id="holiday-name"
                    placeholder="z.B. Betriebsurlaub, Messe, etc."
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holiday-type">Typ</Label>
                  <select 
                    id="holiday-type"
                    className="w-full p-2 border border-input bg-background rounded-md"
                    value={newHoliday.type}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, type: e.target.value as Holiday['type'] }))}
                  >
                    {HOLIDAY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holiday-description">Beschreibung (optional)</Label>
                  <Input
                    id="holiday-description"
                    placeholder="Zusätzliche Informationen"
                    value={newHoliday.description}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newHoliday.is_recurring}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, is_recurring: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="recurring" className="text-sm">
                    Jährlich wiederholen
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={saving}
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    onClick={addHoliday}
                    className="flex-1"
                    disabled={!selectedDate || !newHoliday.name || saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      'Termin sperren'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Kommende gesperrte Termine */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Kommende gesperrte Termine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {getUpcomingHolidays().length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Keine kommenden gesperrten Termine
                  </p>
                ) : (
                  getUpcomingHolidays().map(holiday => {
                    const typeInfo = getHolidayTypeInfo(holiday.type);
                    return (
                      <div key={holiday.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{holiday.name}</span>
                            <Badge className={`text-xs ${typeInfo?.color}`}>
                              {typeInfo?.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(holiday.date, 'dd.MM.yyyy', { locale: de })}
                            {holiday.is_recurring && ' (jährlich)'}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeHoliday(holiday.id)}
                          disabled={saving}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {holidays.filter(h => h.type === 'holiday').length}
              </div>
              <p className="text-sm text-muted-foreground">Feiertage</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {holidays.filter(h => h.type === 'vacation').length}
              </div>
              <p className="text-sm text-muted-foreground">Urlaubstage</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {holidays.filter(h => h.type === 'blocked').length}
              </div>
              <p className="text-sm text-muted-foreground">Gesperrte Tage</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
