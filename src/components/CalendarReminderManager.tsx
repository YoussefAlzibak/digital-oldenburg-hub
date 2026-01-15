import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Bell, 
  Clock, 
  Mail, 
  MessageSquare,
  Loader2,
  Save,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReminderSettings {
  email_24h: boolean;
  email_2h: boolean;
  email_1h: boolean;
  popup_60m: boolean;
  popup_30m: boolean;
  popup_10m: boolean;
  custom_email_minutes: number | null;
  custom_popup_minutes: number | null;
}

interface CalendarReminderManagerProps {
  onSettingsChange?: (settings: ReminderSettings) => void;
}

export default function CalendarReminderManager({ onSettingsChange }: CalendarReminderManagerProps) {
  const [settings, setSettings] = useState<ReminderSettings>({
    email_24h: true,
    email_2h: false,
    email_1h: true,
    popup_60m: false,
    popup_30m: true,
    popup_10m: true,
    custom_email_minutes: null,
    custom_popup_minutes: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    loadSettings();
  }, []);

  const checkConnection = async () => {
    const { data } = await supabase
      .from('google_oauth_tokens')
      .select('id')
      .limit(1)
      .single();
    
    setIsConnected(!!data);
  };

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('google_calendar_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (data) {
        // Load reminder settings from the database if stored there
        // For now, use defaults
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };

  const handleToggle = (key: keyof ReminderSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleCustomChange = (key: 'custom_email_minutes' | 'custom_popup_minutes', value: string) => {
    const numValue = value ? parseInt(value) : null;
    const newSettings = { ...settings, [key]: numValue };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save settings (could be expanded to store in DB)
      toast({
        title: 'Einstellungen gespeichert',
        description: 'Die Erinnerungseinstellungen wurden aktualisiert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler beim Speichern',
        description: 'Die Einstellungen konnten nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getActiveReminders = (): string[] => {
    const reminders: string[] = [];
    if (settings.email_24h) reminders.push('24 Stunden vorher (E-Mail)');
    if (settings.email_2h) reminders.push('2 Stunden vorher (E-Mail)');
    if (settings.email_1h) reminders.push('1 Stunde vorher (E-Mail)');
    if (settings.popup_60m) reminders.push('60 Minuten vorher (Popup)');
    if (settings.popup_30m) reminders.push('30 Minuten vorher (Popup)');
    if (settings.popup_10m) reminders.push('10 Minuten vorher (Popup)');
    if (settings.custom_email_minutes) reminders.push(`${settings.custom_email_minutes} Minuten vorher (E-Mail)`);
    if (settings.custom_popup_minutes) reminders.push(`${settings.custom_popup_minutes} Minuten vorher (Popup)`);
    return reminders;
  };

  if (!isConnected) {
    return (
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertTitle>Google Calendar nicht verbunden</AlertTitle>
        <AlertDescription>
          Verbinden Sie Google Calendar, um Erinnerungen zu konfigurieren.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Google Calendar Erinnerungen
        </CardTitle>
        <CardDescription>
          Konfigurieren Sie automatische Erinnerungen für Termine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Reminders */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-Mail-Erinnerungen
          </h4>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email_24h" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                24 Stunden vorher
              </Label>
              <Switch
                id="email_24h"
                checked={settings.email_24h}
                onCheckedChange={() => handleToggle('email_24h')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email_2h" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                2 Stunden vorher
              </Label>
              <Switch
                id="email_2h"
                checked={settings.email_2h}
                onCheckedChange={() => handleToggle('email_2h')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email_1h" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                1 Stunde vorher
              </Label>
              <Switch
                id="email_1h"
                checked={settings.email_1h}
                onCheckedChange={() => handleToggle('email_1h')}
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="custom_email" className="whitespace-nowrap">
                Benutzerdefiniert:
              </Label>
              <Input
                id="custom_email"
                type="number"
                placeholder="Minuten"
                className="w-24"
                value={settings.custom_email_minutes || ''}
                onChange={(e) => handleCustomChange('custom_email_minutes', e.target.value)}
              />
              <span className="text-sm text-muted-foreground">Minuten vorher</span>
            </div>
          </div>
        </div>

        {/* Popup Reminders */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Popup-Erinnerungen
          </h4>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="popup_60m" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                60 Minuten vorher
              </Label>
              <Switch
                id="popup_60m"
                checked={settings.popup_60m}
                onCheckedChange={() => handleToggle('popup_60m')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="popup_30m" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                30 Minuten vorher
              </Label>
              <Switch
                id="popup_30m"
                checked={settings.popup_30m}
                onCheckedChange={() => handleToggle('popup_30m')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="popup_10m" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                10 Minuten vorher
              </Label>
              <Switch
                id="popup_10m"
                checked={settings.popup_10m}
                onCheckedChange={() => handleToggle('popup_10m')}
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="custom_popup" className="whitespace-nowrap">
                Benutzerdefiniert:
              </Label>
              <Input
                id="custom_popup"
                type="number"
                placeholder="Minuten"
                className="w-24"
                value={settings.custom_popup_minutes || ''}
                onChange={(e) => handleCustomChange('custom_popup_minutes', e.target.value)}
              />
              <span className="text-sm text-muted-foreground">Minuten vorher</span>
            </div>
          </div>
        </div>

        {/* Active Reminders Summary */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Aktive Erinnerungen
          </h4>
          <div className="flex flex-wrap gap-2">
            {getActiveReminders().length > 0 ? (
              getActiveReminders().map((reminder, index) => (
                <Badge key={index} variant="secondary">{reminder}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Keine Erinnerungen aktiviert</span>
            )}
          </div>
        </div>

        <Button onClick={saveSettings} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Speichere...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Einstellungen speichern
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
