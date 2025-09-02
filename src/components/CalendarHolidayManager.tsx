import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Plus, Trash2, AlertTriangle, Info } from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'holiday' | 'vacation' | 'blocked';
  isRecurring: boolean;
  description?: string;
}

const HOLIDAY_TYPES = [
  { value: 'holiday', label: 'Feiertag', color: 'bg-red-100 text-red-800' },
  { value: 'vacation', label: 'Urlaub', color: 'bg-blue-100 text-blue-800' },
  { value: 'blocked', label: 'Gesperrt', color: 'bg-gray-100 text-gray-800' },
];

const GERMAN_HOLIDAYS_2024 = [
  { name: 'Neujahr', date: '2024-01-01', isRecurring: true },
  { name: 'Karfreitag', date: '2024-03-29', isRecurring: false },
  { name: 'Ostermontag', date: '2024-04-01', isRecurring: false },
  { name: 'Tag der Arbeit', date: '2024-05-01', isRecurring: true },
  { name: 'Christi Himmelfahrt', date: '2024-05-09', isRecurring: false },
  { name: 'Pfingstmontag', date: '2024-05-20', isRecurring: false },
  { name: 'Tag der Deutschen Einheit', date: '2024-10-03', isRecurring: true },
  { name: 'Weihnachtstag', date: '2024-12-25', isRecurring: true },
  { name: 'Zweiter Weihnachtstag', date: '2024-12-26', isRecurring: true },
];

export default function CalendarHolidayManager() {
  const [holidays, setHolidays] = useState<Holiday[]>(
    GERMAN_HOLIDAYS_2024.map((h, i) => ({
      id: `holiday-${i}`,
      name: h.name,
      date: parseISO(h.date),
      type: 'holiday' as const,
      isRecurring: h.isRecurring,
    }))
  );

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    type: 'blocked' as Holiday['type'],
    isRecurring: false,
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const addHoliday = () => {
    if (!selectedDate || !newHoliday.name) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie ein Datum und geben Sie einen Namen ein.",
        variant: "destructive",
      });
      return;
    }

    const holiday: Holiday = {
      id: `custom-${Date.now()}`,
      name: newHoliday.name,
      date: selectedDate,
      type: newHoliday.type,
      isRecurring: newHoliday.isRecurring,
      description: newHoliday.description,
    };

    setHolidays(prev => [...prev, holiday]);
    setNewHoliday({ name: '', type: 'blocked', isRecurring: false, description: '' });
    setSelectedDate(undefined);
    setShowAddForm(false);

    toast({
      title: "Termin hinzugefügt",
      description: `${holiday.name} wurde für ${format(holiday.date, 'dd.MM.yyyy', { locale: de })} gesperrt.`,
    });
  };

  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
    toast({
      title: "Termin entfernt",
      description: "Der gesperrte Termin wurde erfolgreich entfernt.",
    });
  };

  const getHolidayTypeInfo = (type: Holiday['type']) => {
    return HOLIDAY_TYPES.find(t => t.value === type);
  };

  const getUpcomingHolidays = () => {
    const today = new Date();
    return holidays
      .filter(h => h.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const isHolidayDate = (date: Date) => {
    return holidays.some(h => 
      h.date.toDateString() === date.toDateString()
    );
  };

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
                    checked={newHoliday.isRecurring}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, isRecurring: e.target.checked }))}
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
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    onClick={addHoliday}
                    className="flex-1"
                    disabled={!selectedDate || !newHoliday.name}
                  >
                    Termin sperren
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
              <div className="space-y-2">
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
                            {holiday.isRecurring && ' (jährlich)'}
                          </p>
                        </div>
                        {!holiday.id.startsWith('holiday-') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeHoliday(holiday.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
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