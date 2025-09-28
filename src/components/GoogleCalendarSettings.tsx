import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Settings, Globe, Users, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface GoogleCalendarConfig {
  id?: string;
  client_id: string;
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
      // Use the database function to save settings (client_secret is now stored securely in Supabase secrets)
      const { error } = await supabase.rpc('save_google_calendar_settings', {
        p_client_id: config.client_id,
        p_calendar_id: config.calendar_id,
        p_buffer_minutes: config.buffer_minutes,
        p_auto_sync: config.auto_sync,
        p_working_hours_start: config.working_hours_start,
        p_working_hours_end: config.working_hours_end,
        p_working_days: config.working_days,
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
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Kalender-Einstellungen werden geladen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {isConnected ? (
        <Alert className="border-green-200 bg-green-50/50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Google Calendar erfolgreich verbunden</strong> - Ihre Termine werden automatisch synchronisiert
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-amber-200 bg-amber-50/50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Kalender-Integration nicht konfiguriert</strong> - Konfigurieren Sie Ihre Google Calendar-Verbindung für automatische Terminplanung
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Verbindung
          </TabsTrigger>
          <TabsTrigger value="buffer" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pufferzeiten
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Verfügbarkeit
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Erweitert
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Google Calendar API-Konfiguration
              </CardTitle>
              <CardDescription>
                Verbinden Sie Ihr Google Calendar für automatische Terminplanung und Synchronisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Benötigen Sie Hilfe? Folgen Sie unserer <a href="#" className="text-primary underline">Schritt-für-Schritt Anleitung</a> zur Google Calendar API-Einrichtung.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id" className="flex items-center gap-2">
                    OAuth Client ID
                    <Badge variant="secondary" className="text-xs">Erforderlich</Badge>
                  </Label>
                  <Input
                    id="client_id"
                    type="text"
                    placeholder="1234567890-abcdef..."
                    value={config.client_id}
                    onChange={(e) => setConfig(prev => ({ ...prev, client_id: e.target.value }))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_secret" className="flex items-center gap-2">
                    OAuth Client Secret
                    <Badge variant="secondary" className="text-xs">Sicher gespeichert</Badge>
                  </Label>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      🔒 <strong>Sicherheitsschutz aktiv:</strong> Der Client Secret wird sicher in den Supabase Secrets gespeichert und nicht in der Datenbank.
                      <br />
                      Konfigurieren Sie den GOOGLE_CLIENT_SECRET über die Supabase Admin-Oberfläche.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calendar_id" className="flex items-center gap-2">
                  Kalender ID
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </Label>
                <Input
                  id="calendar_id"
                  type="text"
                  placeholder="primary (für Hauptkalender) oder spezifische ID"
                  value={config.calendar_id}
                  onChange={(e) => setConfig(prev => ({ ...prev, calendar_id: e.target.value }))}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Lassen Sie dieses Feld leer oder verwenden Sie "primary" für Ihren Hauptkalender
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto_sync"
                    checked={config.auto_sync}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, auto_sync: checked }))}
                  />
                  <Label htmlFor="auto_sync" className="font-medium">Automatische Synchronisation</Label>
                </div>
                <Badge variant={config.auto_sync ? "default" : "secondary"}>
                  {config.auto_sync ? "Aktiviert" : "Deaktiviert"}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={testConnection} disabled={testing} variant="outline" className="flex-1">
                {testing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Teste Verbindung...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Verbindung testen
                  </>
                )}
              </Button>
              <Button onClick={saveSettings} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Speichere...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Einstellungen speichern
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="buffer" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Terminpuffer-Konfiguration
              </CardTitle>
              <CardDescription>
                Definieren Sie Pufferzeiten zwischen Terminen für optimale Zeitplanung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="buffer_minutes">Pufferzeit zwischen Terminen</Label>
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
                      <SelectItem value="15">15 Minuten (Empfohlen)</SelectItem>
                      <SelectItem value="30">30 Minuten</SelectItem>
                      <SelectItem value="60">60 Minuten</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Zeit zwischen Terminen für Vorbereitung und Nachbereitung
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Aktuelle Einstellung</Label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {config.buffer_minutes === 0 ? 'Keine Pufferzeit' : `${config.buffer_minutes} Minuten Puffer`}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.buffer_minutes > 0 
                        ? `Zwischen jedem Termin wird automatisch ${config.buffer_minutes} Minuten Pufferzeit eingeplant`
                        : 'Termine können direkt aufeinander folgen'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Arbeitszeiten & Verfügbarkeit
              </CardTitle>
              <CardDescription>
                Konfigurieren Sie Ihre verfügbaren Zeiten für Kundentermine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="working_hours_start">Täglicher Arbeitsbeginn</Label>
                    <Input
                      id="working_hours_start"
                      type="time"
                      value={config.working_hours_start}
                      onChange={(e) => setConfig(prev => ({ ...prev, working_hours_start: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="working_hours_end">Tägliches Arbeitsende</Label>
                    <Input
                      id="working_hours_end"
                      type="time"
                      value={config.working_hours_end}
                      onChange={(e) => setConfig(prev => ({ ...prev, working_hours_end: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Verfügbare Wochentage</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {WORKING_DAYS.map((day) => (
                      <div key={day.value} className="flex items-center justify-between p-2 rounded-lg border">
                        <span className="font-medium">{day.label}</span>
                        <Button
                          variant={config.working_days.includes(day.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleWorkingDayToggle(day.value)}
                          className="w-20"
                        >
                          {config.working_days.includes(day.value) ? 'Aktiv' : 'Inaktiv'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Aktuelle Verfügbarkeit:</strong> {config.working_days.length > 0 
                    ? `${config.working_days.length} Tage pro Woche, täglich von ${config.working_hours_start} bis ${config.working_hours_end} Uhr`
                    : 'Keine Arbeitstage definiert'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Erweiterte Einstellungen
              </CardTitle>
              <CardDescription>
                Zusätzliche Konfigurationsoptionen für die Kalender-Integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Diese erweiterten Einstellungen ermöglichen eine feinere Kontrolle über die Kalender-Integration. 
                  Ändern Sie diese nur, wenn Sie die Auswirkungen verstehen.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium">Synchronisations-Einstellungen</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Bidirektionale Synchronisation</Label>
                      <p className="text-xs text-muted-foreground">Termine in beide Richtungen synchronisieren</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Konflikterkennung</Label>
                      <p className="text-xs text-muted-foreground">Automatisch nach Terminkonflikten suchen</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium">Benachrichtigungs-Einstellungen</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">E-Mail-Erinnerungen</Label>
                      <p className="text-xs text-muted-foreground">Automatische E-Mail-Erinnerungen senden</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving} className="w-full">
                {saving ? 'Speichere erweiterte Einstellungen...' : 'Alle Einstellungen speichern'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}