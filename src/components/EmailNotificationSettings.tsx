import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  Users, 
  Star,
  Mail,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationConfig {
  contactFormConfirmation: boolean;
  contactFormAdmin: boolean;
  appointmentConfirmation: boolean;
  appointmentReminder: boolean;
  appointmentCancellation: boolean;
  newsletterWelcome: boolean;
  newsletterUnsubscribe: boolean;
  reviewSubmitted: boolean;
  reviewApproved: boolean;
}

const DEFAULT_CONFIG: NotificationConfig = {
  contactFormConfirmation: true,
  contactFormAdmin: true,
  appointmentConfirmation: true,
  appointmentReminder: true,
  appointmentCancellation: true,
  newsletterWelcome: true,
  newsletterUnsubscribe: false,
  reviewSubmitted: true,
  reviewApproved: false,
};

export default function EmailNotificationSettings() {
  const [config, setConfig] = useState<NotificationConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('emailNotificationSettings');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Fehler beim Laden der Einstellungen:', e);
      }
    }
  }, []);

  const updateConfig = (key: keyof NotificationConfig, value: boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      localStorage.setItem('emailNotificationSettings', JSON.stringify(config));
      setHasChanges(false);
      toast({
        title: "Gespeichert",
        description: "Benachrichtigungseinstellungen wurden aktualisiert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const NotificationItem = ({ 
    icon: Icon, 
    label, 
    description, 
    checked, 
    onChange 
  }: { 
    icon: any; 
    label: string; 
    description: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <Label className="font-medium cursor-pointer">{label}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>E-Mail-Benachrichtigungen</CardTitle>
              <CardDescription>
                Konfigurieren Sie automatische E-Mail-Benachrichtigungen
              </CardDescription>
            </div>
          </div>
          {hasChanges && <Badge variant="secondary">Ungespeichert</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Contact Form */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Kontaktformular</h3>
          </div>
          <div className="space-y-2">
            <NotificationItem
              icon={Mail}
              label="Bestätigung an Absender"
              description="Automatische Bestätigungsmail an den Anfragenden"
              checked={config.contactFormConfirmation}
              onChange={(v) => updateConfig('contactFormConfirmation', v)}
            />
            <NotificationItem
              icon={Bell}
              label="Admin-Benachrichtigung"
              description="Benachrichtigung bei neuen Kontaktanfragen"
              checked={config.contactFormAdmin}
              onChange={(v) => updateConfig('contactFormAdmin', v)}
            />
          </div>
        </div>

        {/* Appointments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Termine</h3>
          </div>
          <div className="space-y-2">
            <NotificationItem
              icon={CheckCircle2}
              label="Terminbestätigung"
              description="Bestätigung bei Terminbuchung"
              checked={config.appointmentConfirmation}
              onChange={(v) => updateConfig('appointmentConfirmation', v)}
            />
            <NotificationItem
              icon={Bell}
              label="Terminerinnerung"
              description="Erinnerung vor dem Termin (24h vorher)"
              checked={config.appointmentReminder}
              onChange={(v) => updateConfig('appointmentReminder', v)}
            />
            <NotificationItem
              icon={Mail}
              label="Stornierungsbenachrichtigung"
              description="E-Mail bei Terminabsage"
              checked={config.appointmentCancellation}
              onChange={(v) => updateConfig('appointmentCancellation', v)}
            />
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Newsletter</h3>
          </div>
          <div className="space-y-2">
            <NotificationItem
              icon={Mail}
              label="Willkommens-E-Mail"
              description="Begrüßungsmail bei Newsletter-Anmeldung"
              checked={config.newsletterWelcome}
              onChange={(v) => updateConfig('newsletterWelcome', v)}
            />
            <NotificationItem
              icon={Bell}
              label="Abmeldebestätigung"
              description="Bestätigung bei Newsletter-Abmeldung"
              checked={config.newsletterUnsubscribe}
              onChange={(v) => updateConfig('newsletterUnsubscribe', v)}
            />
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Bewertungen</h3>
          </div>
          <div className="space-y-2">
            <NotificationItem
              icon={Bell}
              label="Neue Bewertung"
              description="Admin-Benachrichtigung bei neuer Bewertung"
              checked={config.reviewSubmitted}
              onChange={(v) => updateConfig('reviewSubmitted', v)}
            />
            <NotificationItem
              icon={CheckCircle2}
              label="Bewertung freigeschaltet"
              description="Bestätigung an Kunden nach Freischaltung"
              checked={config.reviewApproved}
              onChange={(v) => updateConfig('reviewApproved', v)}
            />
          </div>
        </div>

        <Button
          onClick={saveConfig}
          disabled={saving || !hasChanges}
          className="w-full sm:w-auto"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Einstellungen speichern
        </Button>
      </CardContent>
    </Card>
  );
}
