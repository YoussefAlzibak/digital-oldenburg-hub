import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Settings } from 'lucide-react';

interface GoogleCalendarConfig {
  id?: string;
  client_id: string;
  client_secret: string;
  calendar_id: string;
  buffer_minutes: number;
  auto_sync: boolean;
  working_hours_start: string;
  working_hours_end: string;
  working_days: string[];
  is_active: boolean;
}

const WORKING_DAYS = [
  { value: 'monday', label: 'Montag' },
  { value: 'tuesday', label: 'Dienstag' },
  { value: 'wednesday', label: 'Mittwoch' },
  { value: 'thursday', label: 'Donnerstag' },
  { value: 'friday', label: 'Freitag' },
  { value: 'saturday', label: 'Samstag' },
  { value: 'sunday', label: 'Sonntag' },
];

export default function GoogleCalendarSettings() {
  const [config, setConfig] = useState<GoogleCalendarConfig>({
    client_id: '',
    client_secret: '',
    calendar_id: '',
    buffer_minutes: 15,
    auto_sync: true,
    working_hours_start: '09:00',
    working_hours_end: '17:00',
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    is_active: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('google_calendar_settings')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.length > 0) {
        const settings = data[0];
        setConfig({
          id: settings.id,
          client_id: settings.client_id,
          client_secret: settings.client_secret,
          calendar_id: settings.calendar_id,
          buffer_minutes: settings.buffer_minutes,
          auto_sync: settings.auto_sync,
          working_hours_start: settings.working_hours_start,
          working_hours_end: settings.working_hours_end,
          working_days: settings.working_days,
          is_active: settings.is_active,
        });
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Fehler", 
        description: "Einstellungen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Deactivate all existing settings
      await supabase
        .from('google_calendar_settings')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('is_active', true);

      // Insert new active settings
      const { error } = await supabase
        .from('google_calendar_settings')
        .insert({
          client_id: config.client_id,
          client_secret: config.client_secret,
          calendar_id: config.calendar_id,
          buffer_minutes: config.buffer_minutes,
          auto_sync: config.auto_sync,
          working_hours_start: config.working_hours_start,
          working_hours_end: config.working_hours_end,
          working_days: config.working_days,
          is_active: true,
        });

      if (error) throw error;

      setIsConnected(true);
      toast({
        title: "Erfolgreich",
        description: "Google Calendar Einstellungen wurden gespeichert",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-google-calendar', {
        body: {
          client_id: config.client_id,
          client_secret: config.client_secret,
          calendar_id: config.calendar_id,
        }
      });

      if (error) throw error;

      toast({
        title: "Erfolgreich",
        description: "Google Calendar Verbindung erfolgreich getestet",
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "Fehler",
        description: "Google Calendar Verbindung fehlgeschlagen",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleWorkingDayToggle = (day: string) => {
    setConfig(prev => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter(d => d !== day)
        : [...prev.working_days, day]
    }));
  };

  if (loading) {
    return <div>Einstellungen werden geladen...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Google Calendar Verbindung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar Verbindung
          </CardTitle>
          <CardDescription>
            Verbinden Sie Ihr Google Calendar für automatische Terminplanung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client ID</Label>
              <Input
                id="client_id"
                type="text"
                placeholder="Google OAuth Client ID"
                value={config.client_id}
                onChange={(e) => setConfig(prev => ({ ...prev, client_id: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_secret">Client Secret</Label>
              <Input
                id="client_secret"
                type="password"
                placeholder="Google OAuth Client Secret"
                value={config.client_secret}
                onChange={(e) => setConfig(prev => ({ ...prev, client_secret: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="calendar_id">Kalender ID</Label>
            <Input
              id="calendar_id"
              type="text"
              placeholder="primary oder spezifische Kalender ID"
              value={config.calendar_id}
              onChange={(e) => setConfig(prev => ({ ...prev, calendar_id: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Verwenden Sie "primary" für Ihren Hauptkalender oder die spezifische Kalender-ID
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto_sync"
              checked={config.auto_sync}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, auto_sync: checked }))}
            />
            <Label htmlFor="auto_sync">Automatische Synchronisation</Label>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={testConnection} disabled={testing} variant="outline">
            {testing ? 'Teste...' : 'Verbindung testen'}
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? 'Speichere...' : 'Einstellungen speichern'}
          </Button>
        </CardFooter>
      </Card>

      {/* Terminpuffer Einstellungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Terminpuffer Einstellungen
          </CardTitle>
          <CardDescription>
            Konfigurieren Sie Pufferzeiten zwischen Terminen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buffer_minutes">Pufferzeit (Minuten)</Label>
            <Select 
              value={config.buffer_minutes.toString()} 
              onValueChange={(value) => setConfig(prev => ({ ...prev, buffer_minutes: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Keine Pufferzeit</SelectItem>
                <SelectItem value="5">5 Minuten</SelectItem>
                <SelectItem value="10">10 Minuten</SelectItem>
                <SelectItem value="15">15 Minuten</SelectItem>
                <SelectItem value="30">30 Minuten</SelectItem>
                <SelectItem value="60">60 Minuten</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Arbeitszeiten */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Arbeitszeiten
          </CardTitle>
          <CardDescription>
            Definieren Sie Ihre verfügbaren Zeiten für Termine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="working_hours_start">Arbeitsbeginn</Label>
              <Input
                id="working_hours_start"
                type="time"
                value={config.working_hours_start}
                onChange={(e) => setConfig(prev => ({ ...prev, working_hours_start: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="working_hours_end">Arbeitsende</Label>
              <Input
                id="working_hours_end"
                type="time"
                value={config.working_hours_end}
                onChange={(e) => setConfig(prev => ({ ...prev, working_hours_end: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Arbeitstage</Label>
            <div className="flex flex-wrap gap-2">
              {WORKING_DAYS.map((day) => (
                <Button
                  key={day.value}
                  variant={config.working_days.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleWorkingDayToggle(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">
              Google Calendar ist erfolgreich verbunden
            </span>
          </div>
        </div>
      )}
    </div>
  );
}