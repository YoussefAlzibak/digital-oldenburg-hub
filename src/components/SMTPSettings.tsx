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
        setSetupStep('test'); // Jump to test step if settings exist
        
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
        title: "Bitte alle Felder ausfüllen",
        description: errors[0],
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
      setHasExistingSettings(true);
      toast({
        title: "✅ Einstellungen gespeichert",
        description: "SMTP-Konfiguration wurde erfolgreich aktualisiert.",
      });
      
      if (connectionStatus === 'success') {
        setSetupStep('complete');
      }
    } catch (error: any) {
      console.error('Fehler beim Speichern:', error);
      toast({
        title: "Fehler beim Speichern",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getErrorHelp = (errorMsg: string): { title: string; solution: string } | null => {
    for (const [key, value] of Object.entries(COMMON_ERRORS)) {
      if (errorMsg.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return null;
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
      console.error('Fehler beim Testen:', error);
      setConnectionStatus('failed');
      const errMsg = error.message || 'Verbindungsfehler';
      setLastError(errMsg);
      toast({
        title: "Verbindungstest fehlgeschlagen",
        description: errMsg,
        variant: "destructive"
      });
    }
  };

  const sendTestEmail = async () => {
    const emailToUse = testEmailAddress || settings.from_email;
    if (!emailToUse || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
      toast({
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
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
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px;">✅ Test erfolgreich!</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Ihre SMTP-Konfiguration funktioniert einwandfrei.</p>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #1e293b;">📧 Server-Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr><td style="padding: 8px 0; color: #64748b;">Host:</td><td style="padding: 8px 0; font-weight: 500;">${settings.host}</td></tr>
                      <tr><td style="padding: 8px 0; color: #64748b;">Port:</td><td style="padding: 8px 0; font-weight: 500;">${settings.port}</td></tr>
                      <tr><td style="padding: 8px 0; color: #64748b;">Verschlüsselung:</td><td style="padding: 8px 0; font-weight: 500;">${settings.secure ? 'SSL/TLS ✓' : 'Keine'}</td></tr>
                      <tr><td style="padding: 8px 0; color: #64748b;">Absender:</td><td style="padding: 8px 0; font-weight: 500;">${settings.from_name}</td></tr>
                    </table>
                  </div>
                  <p style="color: #64748b; font-size: 13px; margin: 0; text-align: center;">
                    Gesendet am ${new Date().toLocaleString('de-DE')}
                  </p>
                </div>
              </div>
            `
          },
          smtpSettings: settings
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "📧 Test-E-Mail gesendet!",
          description: `E-Mail wurde an ${emailToUse} gesendet.`,
        });
        setSetupStep('complete');
      } else {
        throw new Error(data?.error || 'E-Mail konnte nicht gesendet werden');
      }
    } catch (error: any) {
      console.error('Fehler beim Senden der Test-E-Mail:', error);
      toast({
        title: "Senden fehlgeschlagen",
        description: error.message || "Bitte prüfen Sie die SMTP-Einstellungen.",
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
    toast({ title: "Kopiert!", description: text });
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Verbunden
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="bg-destructive/10 px-3 py-1">
            <XCircle className="h-3.5 w-3.5 mr-1.5" /> Fehler
          </Badge>
        );
      case 'testing':
        return (
          <Badge variant="secondary" className="px-3 py-1">
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Prüfe...
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="px-3 py-1">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5" /> Nicht getestet
          </Badge>
        );
    }
  };

  const getStepProgress = () => {
    switch (setupStep) {
      case 'provider': return 25;
      case 'credentials': return 50;
      case 'test': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Einstellungen werden geladen...</p>
        </CardContent>
      </Card>
    );
  }

  const isValid = validateSettings().length === 0;
  const currentPreset = PROVIDER_PRESETS[selectedProvider];
  const errorHelp = lastError ? getErrorHelp(lastError) : null;

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
            <p className="font-mono text-sm bg-destructive/10 p-2 rounded">{lastError}</p>
            {errorHelp && (
              <p className="text-sm">
                <strong>Lösung:</strong> {errorHelp.solution}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>E-Mail-Server Konfiguration</CardTitle>
              <CardDescription>
                Konfigurieren Sie den SMTP-Server für den E-Mail-Versand
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <Label className="font-medium">E-Mail-Provider auswählen</Label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(PROVIDER_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handleProviderChange(key)}
                  className={`p-3 rounded-lg border-2 text-left transition-all hover:border-primary/50 ${
                    selectedProvider === key 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{preset.icon}</span>
                    <span className="text-sm font-medium truncate">{preset.name.split('/')[0].trim()}</span>
                  </div>
                </button>
              ))}
            </div>
            {currentPreset && currentPreset.helpText && (
              <Alert className="bg-blue-500/5 border-blue-500/20">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  {currentPreset.helpText}
                  {currentPreset.helpUrl && (
                    <a 
                      href={currentPreset.helpUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 underline hover:no-underline"
                    >
                      Anleitung öffnen →
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
              {selectedProvider !== 'custom' && (
                <Badge variant="secondary" className="text-xs">Automatisch ausgefüllt</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="host">SMTP Host</Label>
                <div className="relative">
                  <Input
                    id="host"
                    placeholder="smtp.example.com"
                    value={settings.host}
                    onChange={(e) => {
                      setSettings({ ...settings, host: e.target.value });
                      setConnectionStatus('untested');
                      setSelectedProvider('custom');
                    }}
                    className="pr-10"
                  />
                  {settings.host && (
                    <button
                      onClick={() => copyToClipboard(settings.host)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Select 
                  value={settings.port.toString()} 
                  onValueChange={(val) => {
                    const port = parseInt(val);
                    setSettings({ ...settings, port, secure: port === 465 || port === 587 });
                    setConnectionStatus('untested');
                  }}
                >
                  <SelectTrigger id="port">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="465">465 (SSL)</SelectItem>
                    <SelectItem value="587">587 (TLS)</SelectItem>
                    <SelectItem value="25">25 (Unsicher)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 w-full h-10">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">SSL/TLS</span>
                  </div>
                  <Switch
                    checked={settings.secure}
                    onCheckedChange={(checked) => {
                      setSettings({ ...settings, secure: checked });
                      setConnectionStatus('untested');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Authentication */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Anmeldedaten</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Benutzername (E-Mail-Adresse)</Label>
                <Input
                  id="username"
                  placeholder="ihre-email@domain.de"
                  value={settings.username}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSettings({ ...settings, username: val });
                    setConnectionStatus('untested');
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Meist die vollständige E-Mail-Adresse
                </p>
              </div>
              <div>
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={settings.password}
                    onChange={(e) => {
                      setSettings({ ...settings, password: e.target.value });
                      setConnectionStatus('untested');
                    }}
                    className="pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {selectedProvider === 'gmail' && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Bei Gmail: App-Passwort ohne Leerzeichen eingeben!
                  </p>
                )}
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
                <Label htmlFor="from_email">Absender E-Mail</Label>
                <Input
                  id="from_email"
                  type="email"
                  placeholder="kontakt@unicum-tech.de"
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
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={testConnection}
                disabled={connectionStatus === 'testing' || !isValid}
                variant={connectionStatus === 'success' ? 'outline' : 'default'}
                className="flex-1 sm:flex-none"
              >
                {connectionStatus === 'testing' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : connectionStatus === 'success' ? (
                  <RefreshCw className="h-4 w-4 mr-2" />
                ) : (
                  <TestTube className="h-4 w-4 mr-2" />
                )}
                {connectionStatus === 'success' ? 'Erneut testen' : 'Verbindung testen'}
              </Button>
              
              <Button
                onClick={saveSettings}
                disabled={saving || !isValid}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Speichern
              </Button>
            </div>

            {/* Test Email Section */}
            {connectionStatus === 'success' && (
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Test-E-Mail senden</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder={settings.from_email || "test@example.com"}
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    className="flex-1 bg-background"
                  />
                  <Button
                    onClick={sendTestEmail}
                    disabled={sendingTestEmail}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {sendingTestEmail ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Test senden
                  </Button>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Leer lassen = Test an {settings.from_email || 'Absender-E-Mail'} senden
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <Alert className="bg-muted/50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Diese SMTP-Einstellungen werden für <strong>alle E-Mails</strong> verwendet: Kontaktformular, Newsletter, Terminbestätigungen und Marketing-Kampagnen.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
