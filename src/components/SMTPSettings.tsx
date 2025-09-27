import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Mail, Server, Shield, Save, TestTube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SMTPSettings {
  id?: string;
  host: string;
  port: number;
  username: string;
  secure: boolean;
  from_email: string;
  from_name: string;
  is_active: boolean;
}

export default function SMTPSettings() {
  const [settings, setSettings] = useState<SMTPSettings>({
    host: '',
    port: 587,
    username: '',
    secure: true,
    from_email: '',
    from_name: 'Digital Masters',
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
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
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Fehler beim Laden der SMTP-Einstellungen:', error);
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Deactivate old settings first
      if (settings.id) {
        await supabase
          .from('smtp_settings')
          .update({ is_active: false })
          .neq('id', settings.id);
      }

      const { data, error } = settings.id
        ? await supabase
            .from('smtp_settings')
            .update(settings)
            .eq('id', settings.id)
            .select()
            .single()
        : await supabase
            .from('smtp_settings')
            .insert(settings)
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
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-smtp-connection', {
        body: settings
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Verbindung erfolgreich",
          description: "SMTP-Server ist erreichbar und Authentifizierung funktioniert.",
        });
      } else {
        toast({
          title: "Verbindungsfehler",
          description: data.error || "Verbindung zum SMTP-Server fehlgeschlagen.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Fehler beim Testen:', error);
      toast({
        title: "Test fehlgeschlagen",
        description: error.message || "Verbindung konnte nicht getestet werden.",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Lade SMTP-Einstellungen...</div>;
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
          <CardTitle>SMTP Email-Konfiguration</CardTitle>
        </div>
        <CardDescription>
          Konfigurieren Sie Ihren selbst gehosteten Email-Server für den Versand von Benachrichtigungen
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Server-Konfiguration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Server className="h-4 w-4" />
            <h3 className="text-sm font-medium">Server-Konfiguration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="host">SMTP Host</Label>
              <Input
                id="host"
                placeholder="mail.ihre-domain.de"
                value={settings.host}
                onChange={(e) => setSettings({ ...settings, host: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={settings.port}
                onChange={(e) => setSettings({ ...settings, port: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="secure"
              checked={settings.secure}
              onCheckedChange={(checked) => setSettings({ ...settings, secure: checked })}
            />
            <div>
              <Label htmlFor="secure">SSL/TLS Verschlüsselung</Label>
              <p className="text-xs text-muted-foreground">
                Empfohlen für Port 465 (SSL) oder 587 (STARTTLS)
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Authentifizierung */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4" />
            <h3 className="text-sm font-medium">Authentifizierung</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                placeholder="ihr-email@ihre-domain.de"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <div className="bg-muted/50 p-3 rounded-md border">
                <p className="text-sm text-muted-foreground">
                  🔒 <strong>Sicher gespeichert</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  SMTP-Passwort wird sicher in Supabase Secrets verwaltet. 
                  Kontaktieren Sie den Administrator zum Aktualisieren.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Absender-Informationen */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4" />
            <h3 className="text-sm font-medium">Absender-Informationen</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_email">Absender E-Mail</Label>
              <Input
                id="from_email"
                placeholder="noreply@ihre-domain.de"
                value={settings.from_email}
                onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="from_name">Absender Name</Label>
              <Input
                id="from_name"
                placeholder="Digital Masters"
                value={settings.from_name}
                onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Aktionen */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={testConnection}
            disabled={testing || !settings.host || !settings.username}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {testing ? 'Teste...' : 'Verbindung testen'}
          </Button>
          
          <Button
            onClick={saveSettings}
            disabled={saving || !settings.host || !settings.username || !settings.from_email}
            className="flex items-center gap-2 bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Speichere...' : 'Einstellungen speichern'}
          </Button>
        </div>

        {/* Hilfe-Text */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p><strong>Häufige Ports:</strong></p>
          <p>• Port 25: Unverschlüsselt (nicht empfohlen)</p>
          <p>• Port 587: STARTTLS (empfohlen)</p>
          <p>• Port 465: SSL (legacy, aber funktional)</p>
        </div>
      </CardContent>
    </Card>
  );
}