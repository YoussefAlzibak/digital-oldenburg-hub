import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Info,
  Zap
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

interface ProviderPreset {
  name: string;
  host: string;
  port: number;
  secure: boolean;
  helpText: string;
  helpUrl?: string;
}

const PROVIDER_PRESETS: Record<string, ProviderPreset> = {
  gmail: {
    name: 'Gmail / Google Workspace',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie ein App-Passwort, nicht Ihr normales Passwort.',
    helpUrl: 'https://myaccount.google.com/apppasswords'
  },
  outlook: {
    name: 'Outlook / Microsoft 365',
    host: 'smtp.office365.com',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre vollständige E-Mail-Adresse als Benutzername.',
  },
  ionos: {
    name: 'IONOS (1&1)',
    host: 'smtp.ionos.de',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre IONOS E-Mail-Zugangsdaten.',
  },
  strato: {
    name: 'Strato',
    host: 'smtp.strato.de',
    port: 465,
    secure: true,
    helpText: 'Port 465 mit SSL wird empfohlen.',
  },
  hosteurope: {
    name: 'Host Europe',
    host: 'smtp.hosteurope.de',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre Postfach-Zugangsdaten.',
  },
  allinkl: {
    name: 'All-Inkl',
    host: 'smtp.all-inkl.com',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre KAS-Postfach-Zugangsdaten.',
  },
  custom: {
    name: 'Benutzerdefiniert',
    host: '',
    port: 587,
    secure: true,
    helpText: 'Geben Sie die SMTP-Daten Ihres Providers manuell ein.',
  }
};

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
  const [selectedProvider, setSelectedProvider] = useState<string>('custom');
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Auto-detect provider based on host
    if (settings.host) {
      const detected = Object.entries(PROVIDER_PRESETS).find(
        ([key, preset]) => key !== 'custom' && settings.host.includes(preset.host.split('.')[1])
      );
      if (detected) {
        setSelectedProvider(detected[0]);
      }
    }
  }, [settings.host]);

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

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    const preset = PROVIDER_PRESETS[provider];
    if (preset && provider !== 'custom') {
      setSettings(prev => ({
        ...prev,
        host: preset.host,
        port: preset.port,
        secure: preset.secure
      }));
      setConnectionStatus('untested');
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const isValid = validateSettings().length === 0;
  const currentPreset = PROVIDER_PRESETS[selectedProvider];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>SMTP-Konfiguration</CardTitle>
              <CardDescription>
                E-Mail-Server für den Versand konfigurieren
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {lastError && connectionStatus === 'failed' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{lastError}</AlertDescription>
          </Alert>
        )}

        {/* Provider Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <Label>E-Mail-Provider</Label>
          </div>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Provider auswählen" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROVIDER_PRESETS).map(([key, preset]) => (
                <SelectItem key={key} value={key}>{preset.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentPreset && currentPreset.helpText && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {currentPreset.helpText}
                {currentPreset.helpUrl && (
                  <a 
                    href={currentPreset.helpUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 text-primary underline"
                  >
                    Mehr erfahren →
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

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
                  setSelectedProvider('custom');
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
                  setSettings({ 
                    ...settings, 
                    port,
                    secure: port === 465 || port === 587
                  });
                  setConnectionStatus('untested');
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="secure" className="cursor-pointer">SSL/TLS Verschlüsselung</Label>
                <p className="text-xs text-muted-foreground">
                  {settings.port === 465 ? 'Implizites SSL' : 'STARTTLS'}
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
                Sollte mit dem Benutzernamen übereinstimmen
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
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={testConnection}
            disabled={connectionStatus === 'testing' || !isValid}
            variant="outline"
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
            className="bg-primary hover:bg-primary/90"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
