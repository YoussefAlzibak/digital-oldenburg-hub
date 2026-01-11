import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Bell,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface ReminderTime {
  minutes_before: number;
  label: string;
  enabled: boolean;
}

interface AppointmentReminderConfigProps {
  triggerConfig: {
    send_confirmation?: boolean;
    send_reminder?: boolean;
    reminder_times?: ReminderTime[];
  };
  onChange: (config: any) => void;
}

const defaultReminderOptions = [
  { value: 15, label: '15 Minuten vorher' },
  { value: 30, label: '30 Minuten vorher' },
  { value: 60, label: '1 Stunde vorher' },
  { value: 120, label: '2 Stunden vorher' },
  { value: 240, label: '4 Stunden vorher' },
  { value: 480, label: '8 Stunden vorher' },
  { value: 720, label: '12 Stunden vorher' },
  { value: 1440, label: '1 Tag vorher' },
  { value: 2880, label: '2 Tage vorher' },
  { value: 4320, label: '3 Tage vorher' },
  { value: 10080, label: '1 Woche vorher' },
];

export default function AppointmentReminderConfig({ triggerConfig, onChange }: AppointmentReminderConfigProps) {
  const [sendConfirmation, setSendConfirmation] = useState(triggerConfig.send_confirmation ?? true);
  const [sendReminder, setSendReminder] = useState(triggerConfig.send_reminder ?? true);
  const [reminderTimes, setReminderTimes] = useState<ReminderTime[]>(
    triggerConfig.reminder_times || [
      { minutes_before: 1440, label: '1 Tag vorher', enabled: true }
    ]
  );
  const [newReminderValue, setNewReminderValue] = useState('1440');

  useEffect(() => {
    onChange({
      send_confirmation: sendConfirmation,
      send_reminder: sendReminder,
      reminder_times: reminderTimes
    });
  }, [sendConfirmation, sendReminder, reminderTimes]);

  const addReminderTime = () => {
    const minutes = parseInt(newReminderValue);
    const existingReminder = reminderTimes.find(r => r.minutes_before === minutes);
    
    if (existingReminder) {
      return; // Already exists
    }

    const option = defaultReminderOptions.find(o => o.value === minutes);
    const newReminder: ReminderTime = {
      minutes_before: minutes,
      label: option?.label || `${minutes} Minuten vorher`,
      enabled: true
    };

    setReminderTimes([...reminderTimes, newReminder].sort((a, b) => b.minutes_before - a.minutes_before));
  };

  const removeReminderTime = (index: number) => {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  };

  const toggleReminderEnabled = (index: number) => {
    const updated = [...reminderTimes];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setReminderTimes(updated);
  };

  const getTimeIcon = (minutes: number) => {
    if (minutes <= 60) return '⚡';
    if (minutes <= 480) return '🕐';
    if (minutes <= 1440) return '📅';
    return '📆';
  };

  const getTimeBadgeColor = (minutes: number) => {
    if (minutes <= 60) return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (minutes <= 480) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    if (minutes <= 1440) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    return 'bg-green-500/10 text-green-600 border-green-500/20';
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          ⏰ Erinnerungs-Einstellungen
        </CardTitle>
        <CardDescription>
          Konfigurieren Sie, wann Ihre Kunden Termin-Erinnerungen erhalten sollen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Confirmation Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <Label className="text-base font-medium">Terminbestätigung senden</Label>
              <p className="text-sm text-muted-foreground">
                Sofortige Bestätigung nach Terminbuchung
              </p>
            </div>
          </div>
          <Switch
            checked={sendConfirmation}
            onCheckedChange={setSendConfirmation}
          />
        </div>

        {/* Reminder Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <Label className="text-base font-medium">Erinnerungen aktivieren</Label>
              <p className="text-sm text-muted-foreground">
                Automatische Erinnerungen vor dem Termin
              </p>
            </div>
          </div>
          <Switch
            checked={sendReminder}
            onCheckedChange={setSendReminder}
          />
        </div>

        {/* Reminder Times Configuration */}
        {sendReminder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Erinnerungszeiten</Label>
              <Badge variant="outline">{reminderTimes.filter(r => r.enabled).length} aktiv</Badge>
            </div>

            {/* Add new reminder */}
            <div className="flex gap-2">
              <Select value={newReminderValue} onValueChange={setNewReminderValue}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Zeitpunkt auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {defaultReminderOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value.toString()}
                      disabled={reminderTimes.some(r => r.minutes_before === option.value)}
                    >
                      {option.label}
                      {reminderTimes.some(r => r.minutes_before === option.value) && ' ✓'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addReminderTime} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Hinzufügen
              </Button>
            </div>

            {/* Custom time input */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Oder eigene Zeit (in Minuten):</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    min="5"
                    max="20160"
                    placeholder="z.B. 90 für 1,5 Stunden"
                    onChange={(e) => setNewReminderValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addReminderTime}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reminder list */}
            <div className="space-y-2">
              {reminderTimes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Keine Erinnerungszeiten konfiguriert</p>
                  <p className="text-sm">Fügen Sie oben Zeitpunkte hinzu</p>
                </div>
              ) : (
                reminderTimes.map((reminder, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                      reminder.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getTimeIcon(reminder.minutes_before)}</span>
                      <div>
                        <Badge variant="outline" className={getTimeBadgeColor(reminder.minutes_before)}>
                          {reminder.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {reminder.minutes_before >= 1440 
                            ? `${Math.round(reminder.minutes_before / 1440)} Tag(e) vor dem Termin`
                            : reminder.minutes_before >= 60
                            ? `${Math.round(reminder.minutes_before / 60)} Stunde(n) vor dem Termin`
                            : `${reminder.minutes_before} Minuten vor dem Termin`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminderEnabled(index)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReminderTime(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Info box */}
            {reminderTimes.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-600">Tipp für optimale Erinnerungen</p>
                  <p className="text-muted-foreground mt-1">
                    Empfohlene Kombination: 1 Tag vorher + 1-2 Stunden vorher. 
                    Zu viele Erinnerungen können als störend empfunden werden.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
