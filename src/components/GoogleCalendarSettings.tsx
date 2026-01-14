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
import { 
  Calendar, Clock, Settings, Globe, Users, AlertTriangle, CheckCircle, 
  XCircle, Info, Loader2, ExternalLink, RefreshCw, Unlink 
} from 'lucide-react';

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

interface OAuthStatus {
  connected: boolean;
  expires_at?: string;
  scope?: string;
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

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ');

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
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus>({ connected: false });
  const [refreshingToken, setRefreshingToken] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    checkOAuthStatus();
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

  const checkOAuthStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('google_oauth_tokens')
        .select('expires_at, scope')
        .limit(1)
        .maybeSingle();

      if (data) {
        const expiresAt = new Date(data.expires_at);
        const isExpired = expiresAt <= new Date();
        
        setOauthStatus({
          connected: !isExpired,
          expires_at: data.expires_at,
          scope: data.scope,
        });
      } else {
        setOauthStatus({ connected: false });
      }
    } catch (error) {
      console.error('Error checking OAuth status:', error);
      setOauthStatus({ connected: false });
    }
  };

  const initiateOAuth = () => {
    if (!config.client_id) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie zuerst die OAuth Client ID ein",
        variant: "destructive",
      });
      return;
    }

    const redirectUri = `${window.location.origin}/admin/calendar-settings`;
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', config.client_id);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', GOOGLE_SCOPES);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', 'google_calendar_connect');

    window.location.href = authUrl.toString();
  };

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state === 'google_calendar_connect') {
      handleOAuthCallback(code);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-oauth-callback', {
        body: {
          code,
          redirect_uri: `${window.location.origin}/admin/calendar-settings`,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Erfolgreich verbunden!",
        description: "Google Calendar wurde erfolgreich verbunden.",
      });

      setOauthStatus({
        connected: true,
        expires_at: data.expires_at,
      });

    } catch (error) {
      console.error('OAuth callback error:', error);
      toast({
        title: "Verbindung fehlgeschlagen",
        description: error instanceof Error ? error.message : "OAuth-Verbindung konnte nicht hergestellt werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshOAuthToken = async () => {
    setRefreshingToken(true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-google-token');

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Token aktualisiert",
        description: "Das Access Token wurde erfolgreich erneuert.",
      });

      setOauthStatus(prev => ({
        ...prev,
        connected: true,
        expires_at: data.expires_at,
      }));

    } catch (error) {
      console.error('Token refresh error:', error);
      toast({
        title: "Fehler",
        description: "Token konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    } finally {
      setRefreshingToken(false);
    }
  };

  const disconnectGoogle = async () => {
    try {
      const { error } = await supabase
        .from('google_oauth_tokens')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      toast({
        title: "Verbindung getrennt",
        description: "Google Calendar wurde getrennt.",
      });

      setOauthStatus({ connected: false });

    } catch (error) {
      console.error('Disconnect error:', error);
      toast({
        title: "Fehler",
        description: "Verbindung konnte nicht getrennt werden",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc('save_google_calendar_settings', {
        p_client_id: config.client_id,
        p_calendar_id: config.calendar_id || 'primary',
        p_buffer_minutes: config.buffer_minutes,
        p_auto_sync: config.auto_sync,
        p_working_hours_start: config.working_hours_start,
        p_working_hours_end: config.working_hours_end,
        p_working_days: config.working_days,
      });

      if (error) throw error;

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
          calendar_id: config.calendar_id || 'primary',
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast({
        title: "Erfolgreich",
        description: "Google Calendar Verbindung erfolgreich getestet",
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Google Calendar Verbindung fehlgeschlagen",
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

  const getTokenExpiryInfo = () => {
    if (!oauthStatus.expires_at) return null;
    const expiresAt = new Date(oauthStatus.expires_at);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 0) return { text: 'Abgelaufen', color: 'text-red-600' };
    if (minutes < 10) return { text: `Läuft in ${minutes} Min ab`, color: 'text-amber-600' };
    return { text: `Gültig für ${minutes} Min`, color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Kalender-Einstellungen werden geladen...</span>
      </div>
    );
  }

  const tokenInfo = getTokenExpiryInfo();

  return (
    <div className="space-y-6">
      {/* OAuth Status Banner */}
      {oauthStatus.connected ? (
        <Alert className="border-green-200 bg-green-50/50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Google Calendar verbunden</strong>
                {tokenInfo && (
                  <span className={`ml-2 text-sm ${tokenInfo.color}`}>
                    ({tokenInfo.text})
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={refreshOAuthToken}
                  disabled={refreshingToken}
                >
                  {refreshingToken ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-1">Token erneuern</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={disconnectGoogle}
                  className="text-red-600 hover:text-red-700"
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Trennen
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-amber-200 bg-amber-50/50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Google Calendar nicht verbunden</strong> - Konfigurieren Sie die OAuth-Verbindung für automatische Terminplanung
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
                Google Calendar OAuth-Konfiguration
              </CardTitle>
              <CardDescription>
                Verbinden Sie Ihr Google Calendar für automatische Terminplanung und Synchronisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Setup-Anleitung:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1 text-sm">
                    <li>Erstellen Sie ein Google Cloud Projekt unter <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">console.cloud.google.com</a></li>
                    <li>Aktivieren Sie die Google Calendar API</li>
                    <li>Erstellen Sie OAuth 2.0 Credentials (Web Application)</li>
                    <li>Fügen Sie <code className="bg-muted px-1 rounded">{window.location.origin}/admin/calendar-settings</code> als Redirect URI hinzu</li>
                    <li>Speichern Sie den Client Secret als <code className="bg-muted px-1 rounded">GOOGLE_CLIENT_SECRET</code> und <code className="bg-muted px-1 rounded">GOOGLE_CLIENT_ID</code> in Supabase Secrets</li>
                  </ol>
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
                    placeholder="1234567890-abcdef.apps.googleusercontent.com"
                    value={config.client_id}
                    onChange={(e) => setConfig(prev => ({ ...prev, client_id: e.target.value }))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calendar_id" className="flex items-center gap-2">
                    Kalender ID
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </Label>
                  <Input
                    id="calendar_id"
                    type="text"
                    placeholder="primary"
                    value={config.calendar_id}
                    onChange={(e) => setConfig(prev => ({ ...prev, calendar_id: e.target.value }))}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leer lassen für Hauptkalender ("primary")
                  </p>
                </div>
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

              {/* OAuth Connection Button */}
              {!oauthStatus.connected && (
                <div className="p-4 border-2 border-dashed rounded-lg text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Klicken Sie auf den Button, um sich mit Google zu verbinden
                  </p>
                  <Button 
                    onClick={initiateOAuth}
                    disabled={!config.client_id}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Mit Google verbinden
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={testConnection} disabled={testing} variant="outline" className="flex-1">
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
            </CardHeader>
            <CardContent className="space-y-6">
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