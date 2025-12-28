import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
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
  Zap,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Copy,
  Check,
  Send
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
type SetupStep = 'provider' | 'credentials' | 'test' | 'complete';

interface ProviderPreset {
  name: string;
  host: string;
  port: number;
  secure: boolean;
  helpText: string;
  helpUrl?: string;
  icon?: string;
}

const PROVIDER_PRESETS: Record<string, ProviderPreset> = {
  udag: {
    name: 'UDAG / united-domains',
    host: 'smtps.udag.de',
    port: 465,
    secure: true,
    helpText: 'Verwenden Sie Ihre E-Mail-Adresse als Benutzername und das Postfach-Passwort.',
    icon: '🌐'
  },
  gmail: {
    name: 'Gmail / Google Workspace',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie ein App-Passwort (16 Zeichen ohne Leerzeichen), nicht Ihr normales Passwort.',
    helpUrl: 'https://myaccount.google.com/apppasswords',
    icon: '📧'
  },
  outlook: {
    name: 'Outlook / Microsoft 365',
    host: 'smtp.office365.com',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre vollständige E-Mail-Adresse als Benutzername.',
    icon: '📬'
  },
  ionos: {
    name: 'IONOS (1&1)',
    host: 'smtp.ionos.de',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre IONOS E-Mail-Zugangsdaten.',
    icon: '🔷'
  },
  strato: {
    name: 'Strato',
    host: 'smtp.strato.de',
    port: 465,
    secure: true,
    helpText: 'Port 465 mit SSL wird empfohlen.',
    icon: '🔵'
  },
  hosteurope: {
    name: 'Host Europe',
    host: 'smtp.hosteurope.de',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre Postfach-Zugangsdaten.',
    icon: '🟠'
  },
  allinkl: {
    name: 'All-Inkl',
    host: 'smtp.all-inkl.com',
    port: 587,
    secure: true,
    helpText: 'Verwenden Sie Ihre KAS-Postfach-Zugangsdaten.',
    icon: '🟢'
  },
  custom: {
    name: 'Benutzerdefiniert',
    host: '',
    port: 587,
    secure: true,
    helpText: 'Geben Sie die SMTP-Daten Ihres Providers manuell ein.',
    icon: '⚙️'
  }
};

const COMMON_ERRORS: Record<string, { title: string; solution: string }> = {
  'Authentication failed': {
    title: 'Anmeldung fehlgeschlagen',
    solution: 'Das Passwort ist falsch. Bei Gmail: App-Passwort verwenden (ohne Leerzeichen). Bei anderen Anbietern: Postfach-Passwort prüfen.'
  },
  'Login failed': {
    title: 'Login fehlgeschlagen', 
    solution: 'Benutzername oder Passwort ist falsch. Prüfen Sie, ob die E-Mail-Adresse vollständig eingegeben wurde.'
  },
  'Connection refused': {
    title: 'Verbindung abgelehnt',
    solution: 'Der Server ist nicht erreichbar. Prüfen Sie Host und Port.'
  },
  'timeout': {
    title: 'Zeitüberschreitung',
    solution: 'Server antwortet nicht. Versuchen Sie Port 465 statt 587.'
  },
  'certificate': {
    title: 'SSL-Zertifikatfehler',
    solution: 'SSL-Einstellungen prüfen oder anderen Port versuchen.'
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
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [setupStep, setSetupStep] = useState<SetupStep>('provider');
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Auto-detect provider based on host
    if (settings.host && !hasExistingSettings) {
      const detected = Object.entries(PROVIDER_PRESETS).find(
        ([key, preset]) => key !== 'custom' && preset.host && settings.host.toLowerCase().includes(preset.host.split('.')[1]?.toLowerCase() || '')
      );
      if (detected) {
        setSelectedProvider(detected[0]);
      }
    }
  }, [settings.host, hasExistingSettings]);

  // Auto-fill from_email when username changes
  useEffect(() => {
    if (settings.username && settings.username.includes('@') && !settings.from_email) {
      setSettings(prev => ({ ...prev, from_email: prev.username }));
    }
  }, [settings.username]);

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
        setHasExistingSettings(true);
        setSetupStep('test');
        
        // Auto-detect provider
        const detected = Object.entries(PROVIDER_PRESETS).find(
          ([key, preset]) => key !== 'custom' && preset.host === data.host
        );
        if (detected) {
          setSelectedProvider(detected[0]);
        }
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
    return errors;
  };

  const saveSettings = async () => {
    const errors = validateSettings();
    if (errors.length > 0) {
      toast({
        title: "Fehlende Angaben",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Deactivate all existing settings
      await supabase
        .from('smtp_settings')
        .update({ is_active: false })
        .neq('id', settings.id || '');

      if (settings.id) {
        // Update existing
        const { error } = await supabase
          .from('smtp_settings')
          .update({
            host: settings.host,
            port: settings.port,
            username: settings.username,
            password: settings.password,
            secure: settings.secure,
            from_email: settings.from_email,
            from_name: settings.from_name,
            is_active: true
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('smtp_settings')
          .insert({
            host: settings.host,
            port: settings.port,
            username: settings.username,
            password: settings.password,
            secure: settings.secure,
            from_email: settings.from_email,
            from_name: settings.from_name,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSettings(prev => ({ ...prev, id: data.id }));
          setHasExistingSettings(true);
        }
      }

      toast({
        title: "Gespeichert",
        description: "SMTP-Einstellungen wurden gespeichert.",
      });
    } catch (error: any) {
      console.error('Fehler beim Speichern:', error);
      toast({
        title: "Fehler",
        description: error.message || "Einstellungen konnten nicht gespeichert werden.",
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
        title: "Fehlende Angaben",
        description: errors[0],
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
          title: "✅ Verbindung erfolgreich!",
          description: "SMTP-Server ist erreichbar und Anmeldung funktioniert.",
        });
      } else {
        setConnectionStatus('failed');
        setLastError(data.error || 'Unbekannter Fehler');
        toast({
          title: "Verbindung fehlgeschlagen",
          description: "Prüfen Sie die Einstellungen unten.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setConnectionStatus('failed');
      setLastError(error.message || 'Verbindungsfehler');
      toast({
        title: "Fehler",
        description: error.message || "Verbindungstest fehlgeschlagen",
        variant: "destructive"
      });
    }
  };

  const sendTestEmail = async () => {
    const emailToUse = testEmailAddress || settings.from_email;
    if (!emailToUse) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    setSendingTestEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-smtp-email', {
        body: {
          emailData: {
            to: emailToUse,
            subject: '✅ SMTP Test erfolgreich - ' + new Date().toLocaleString('de-DE'),
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #10b981;">🎉 SMTP funktioniert!</h1>
                <p>Diese Test-E-Mail wurde erfolgreich über Ihren SMTP-Server versendet.</p>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <strong>Server:</strong> ${settings.host}<br>
                  <strong>Port:</strong> ${settings.port}<br>
                  <strong>Von:</strong> ${settings.from_email}
                </div>
                <p style="color: #6b7280; font-size: 14px;">Gesendet am ${new Date().toLocaleString('de-DE')}</p>
              </div>
            `
          },
          smtpSettings: settings
        }
      });

      if (error) throw error;

      if (data.success) {
        setSetupStep('complete');
        toast({
          title: "✅ Test-E-Mail gesendet!",
          description: `E-Mail wurde an ${emailToUse} gesendet.`,
        });
      } else {
        throw new Error(data.error || 'E-Mail konnte nicht gesendet werden');
      }
    } catch (error: any) {
      toast({
        title: "Fehler beim Senden",
        description: error.message || "Test-E-Mail konnte nicht gesendet werden.",
        variant: "destructive"
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getErrorHelp = (error: string | null) => {
    if (!error) return null;
    const errorKey = Object.keys(COMMON_ERRORS).find(key => 
      error.toLowerCase().includes(key.toLowerCase())
    );
    return errorKey ? COMMON_ERRORS[errorKey] : null;
  };

  const errorHelp = getErrorHelp(lastError);

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verbunden</Badge>;
      case 'failed':
        return <Badge variant="destructive">Fehler</Badge>;
      case 'testing':
        return <Badge variant="secondary">Teste...</Badge>;
      default:
        return <Badge variant="outline">Nicht getestet</Badge>;
    }
  };

  const getStepProgress = () => {
    switch (setupStep) {
      case 'provider': return 25;
      case 'credentials': return 50;
      case 'test': return 75;
      case 'complete': return 100;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-medium">SMTP-Einrichtung</span>
            </div>
            {getStatusBadge()}
          </div>
          <Progress value={getStepProgress()} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className={setupStep === 'provider' ? 'text-primary font-medium' : ''}>1. Provider</span>
            <span className={setupStep === 'credentials' ? 'text-primary font-medium' : ''}>2. Zugangsdaten</span>
            <span className={setupStep === 'test' ? 'text-primary font-medium' : ''}>3. Test</span>
            <span className={setupStep === 'complete' ? 'text-primary font-medium' : ''}>4. Fertig</span>
          </div>
        </CardContent>
      </Card>

      {/* Success State */}
      {setupStep === 'complete' && connectionStatus === 'success' && (
        <Alert className="border-emerald-500/30 bg-emerald-500/5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="text-emerald-700">SMTP ist eingerichtet!</AlertTitle>
          <AlertDescription className="text-emerald-600">
            Alle E-Mails (Kontaktformular, Newsletter, Termine, Marketing) werden jetzt über {settings.host} versendet.
          </AlertDescription>
        </Alert>
      )}

      {/* Error State with Help */}
      {lastError && connectionStatus === 'failed' && (
        <Alert variant="destructive">
          <XCircle className="h-5 w-5" />
          <AlertTitle>{errorHelp?.title || 'Verbindungsfehler'}</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>{lastError}</p>
            {errorHelp && (
              <p className="text-sm font-medium">{errorHelp.solution}</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            E-Mail Provider
          </CardTitle>
          <CardDescription>
            Wählen Sie Ihren E-Mail-Provider für automatische Konfiguration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(PROVIDER_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant={selectedProvider === key ? "default" : "outline"}
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => {
                  handleProviderChange(key);
                  setSetupStep('credentials');
                }}
              >
                <span className="text-xl">{preset.icon}</span>
                <span className="text-xs text-center">{preset.name}</span>
              </Button>
            ))}
          </div>
          
          {selectedProvider && PROVIDER_PRESETS[selectedProvider]?.helpText && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {PROVIDER_PRESETS[selectedProvider].helpText}
                {PROVIDER_PRESETS[selectedProvider].helpUrl && (
                  <a 
                    href={PROVIDER_PRESETS[selectedProvider].helpUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 underline text-primary"
                  >
                    Mehr erfahren
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Server Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Server-Einstellungen
          </CardTitle>
          <CardDescription>
            SMTP-Verbindungsdetails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">SMTP Host</Label>
              <div className="flex gap-2">
                <Input
                  id="host"
                  value={settings.host}
                  onChange={(e) => setSettings(prev => ({ ...prev, host: e.target.value }))}
                  placeholder="smtp.example.com"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(settings.host)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Select
                value={settings.port.toString()}
                onValueChange={(value) => setSettings(prev => ({ ...prev, port: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="587">587 (STARTTLS)</SelectItem>
                  <SelectItem value="465">465 (SSL/TLS)</SelectItem>
                  <SelectItem value="25">25 (Unverschlüsselt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="secure"
              checked={settings.secure}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, secure: checked }))}
            />
            <Label htmlFor="secure">SSL/TLS Verschlüsselung</Label>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                value={settings.username}
                onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={settings.password}
                  onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_email">Absender E-Mail</Label>
              <Input
                id="from_email"
                type="email"
                value={settings.from_email}
                onChange={(e) => setSettings(prev => ({ ...prev, from_email: e.target.value }))}
                placeholder="noreply@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="from_name">Absender Name</Label>
              <Input
                id="from_name"
                value={settings.from_name}
                onChange={(e) => setSettings(prev => ({ ...prev, from_name: e.target.value }))}
                placeholder="Unicum Tech"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                testConnection();
                setSetupStep('test');
              }}
              disabled={connectionStatus === 'testing'}
            >
              {connectionStatus === 'testing' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Teste Verbindung...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Verbindung testen
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Email Section */}
      {connectionStatus === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test-E-Mail senden
            </CardTitle>
            <CardDescription>
              Senden Sie eine Test-E-Mail um die Konfiguration zu verifizieren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder={settings.from_email || "test@example.com"}
              />
              <Button onClick={sendTestEmail} disabled={sendingTestEmail}>
                {sendingTestEmail ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sende...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Senden
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Lassen Sie das Feld leer, um an {settings.from_email || 'die Absender-Adresse'} zu senden.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
