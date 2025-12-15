import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Server, 
  Shield, 
  Save, 
  TestTube, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SMTPSettingsData {
  id?: string;
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
  from_email: string;
  from_name: string;
  is_active: boolean;
}

type ConnectionStatus = 'untested' | 'testing' | 'success' | 'failed';

export default function SMTPSettings() {
  const [settings, setSettings] = useState<SMTPSettingsData>({
    host: '',
    port: 587,
    username: '',
    password: '',
    secure: true,
    from_email: '',
    from_name: 'Unicum Tech',
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('untested');
  const [showPassword, setShowPassword] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('smtp_settings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Fehler beim Laden der SMTP-Einstellungen:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setConnectionStatus('untested');
      }
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateSettings = (): string[] => {
    const errors: string[] = [];
    if (!settings.host.trim()) errors.push('SMTP Host ist erforderlich');
    if (!settings.username.trim()) errors.push('Benutzername ist erforderlich');
    if (!settings.password.trim()) errors.push('Passwort ist erforderlich');
    if (!settings.from_email.trim()) errors.push('Absender E-Mail ist erforderlich');
    if (settings.from_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.from_email)) {
      errors.push('Ungültiges E-Mail-Format');
    }
    if (settings.port < 1 || settings.port > 65535) errors.push('Ungültiger Port');
    return errors;
  };

  const saveSettings = async () => {
    const errors = validateSettings();
    if (errors.length > 0) {
      toast({
        title: "Validierungsfehler",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Deactivate old settings first
      await supabase
        .from('smtp_settings')
        .update({ is_active: false })
        .eq('is_active', true);

      const settingsToSave = { ...settings, is_active: true };
      delete settingsToSave.id;

      const { data, error } = await supabase
        .from('smtp_settings')
        .insert(settingsToSave)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      toast({
        title: "Erfolgreich gespeichert",
        description: "SMTP-Einstellungen wurden aktualisiert.",
      });
    } catch (error: any) {
      console.error('Fehler beim Speichern:', error);
      toast({
        title: "Fehler",
        description: "SMTP-Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    const errors = validateSettings();
    if (errors.length > 0) {
      toast({
        title: "Validierungsfehler",
        description: "Bitte füllen Sie alle Pflichtfelder korrekt aus.",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus('testing');
    setLastError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-smtp-connection', {
        body: { ...settings, test_recipient: settings.from_email }
      });

      if (error) throw error;

      if (data.success) {
        setConnectionStatus('success');
        toast({
          title: "Verbindung erfolgreich",
          description: "SMTP-Server erreichbar, Authentifizierung erfolgreich.",
        });
      } else {
        setConnectionStatus('failed');
        setLastError(data.error || 'Unbekannter Fehler');
        toast({
          title: "Verbindung fehlgeschlagen",
          description: data.error || "Verbindung zum SMTP-Server fehlgeschlagen.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Fehler beim Testen:', error);
      setConnectionStatus('failed');
      setLastError(error.message || 'Verbindungsfehler');
      toast({
        title: "Test fehlgeschlagen",
        description: error.message || "Verbindung konnte nicht getestet werden.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Verbunden</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-destructive/10"><XCircle className="h-3 w-3 mr-1" /> Fehlgeschlagen</Badge>;
      case 'testing':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Teste...</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" /> Nicht getestet</Badge>;
    }
  };

  const getPortPreset = (port: number) => {
    switch (port) {
      case 25: return { secure: false, label: 'SMTP (unverschlüsselt)' };
      case 465: return { secure: true, label: 'SMTPS (SSL/TLS)' };
      case 587: return { secure: true, label: 'Submission (STARTTLS)' };
      case 2525: return { secure: true, label: 'Alternative' };
      default: return { secure: settings.secure, label: 'Benutzerdefiniert' };
    }
  };

  if (loading) {
    return (
      <Card className="max-w-3xl">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const isValid = validateSettings().length === 0;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">E-Mail-Server Status</CardTitle>
                <CardDescription>Aktueller Verbindungsstatus</CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        {lastError && connectionStatus === 'failed' && (
          <CardContent className="pt-0">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{lastError}</AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Main Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>SMTP-Konfiguration</CardTitle>
              <CardDescription>
                Konfigurieren Sie Ihren E-Mail-Server für den Versand von Benachrichtigungen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Server Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Server-Einstellungen</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="host">SMTP Host *</Label>
                <Input
                  id="host"
                  placeholder="smtp.example.com"
                  value={settings.host}
                  onChange={(e) => {
                    setSettings({ ...settings, host: e.target.value });
                    setConnectionStatus('untested');
                  }}
                />
              </div>
              <div>
                <Label htmlFor="port">Port *</Label>
                <Input
                  id="port"
                  type="number"
                  value={settings.port}
                  onChange={(e) => {
                    const port = parseInt(e.target.value) || 587;
                    const preset = getPortPreset(port);
                    setSettings({ 
                      ...settings, 
                      port,
                      secure: preset.secure
                    });
                    setConnectionStatus('untested');
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {getPortPreset(settings.port).label}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="secure" className="cursor-pointer">SSL/TLS Verschlüsselung</Label>
                  <p className="text-xs text-muted-foreground">
                    {settings.port === 465 ? 'Implizites SSL (empfohlen für Port 465)' : 'STARTTLS wird verwendet'}
                  </p>
                </div>
              </div>
              <Switch
                id="secure"
                checked={settings.secure}
                onCheckedChange={(checked) => {
                  setSettings({ ...settings, secure: checked });
                  setConnectionStatus('untested');
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Authentication */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Authentifizierung</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Benutzername / E-Mail *</Label>
                <Input
                  id="username"
                  placeholder="user@example.com"
                  value={settings.username}
                  onChange={(e) => {
                    setSettings({ ...settings, username: e.target.value });
                    setConnectionStatus('untested');
                  }}
                />
              </div>
              <div>
                <Label htmlFor="password">Passwort *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={settings.password}
                    onChange={(e) => {
                      setSettings({ ...settings, password: e.target.value });
                      setConnectionStatus('untested');
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Gmail/Google:</strong> Verwenden Sie ein App-Passwort statt Ihres normalen Passworts. 
                Erstellen Sie eines unter <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Account → App-Passwörter</a>
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Sender Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Absender-Informationen</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_email">Absender E-Mail *</Label>
                <Input
                  id="from_email"
                  type="email"
                  placeholder="noreply@example.com"
                  value={settings.from_email}
                  onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Muss meist mit dem Benutzernamen übereinstimmen
                </p>
              </div>
              <div>
                <Label htmlFor="from_name">Absender Name</Label>
                <Input
                  id="from_name"
                  placeholder="Unicum Tech"
                  value={settings.from_name}
                  onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={testConnection}
              disabled={connectionStatus === 'testing' || !isValid}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {connectionStatus === 'testing' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Verbindung testen
            </Button>
            
            <Button
              onClick={saveSettings}
              disabled={saving || !isValid}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Einstellungen speichern
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Hilfe & Tipps</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <div>
            <p className="font-medium text-foreground mb-1">Häufige SMTP-Server:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Gmail:</strong> smtp.gmail.com, Port 587</li>
              <li><strong>Outlook/Office 365:</strong> smtp.office365.com, Port 587</li>
              <li><strong>IONOS:</strong> smtp.ionos.de, Port 587</li>
              <li><strong>Strato:</strong> smtp.strato.de, Port 465</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Port-Übersicht:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Port 587:</strong> STARTTLS (empfohlen)</li>
              <li><strong>Port 465:</strong> Implizites SSL/TLS</li>
              <li><strong>Port 25:</strong> Unverschlüsselt (nicht empfohlen)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
