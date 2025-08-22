import GoogleCalendarSettings from '@/components/GoogleCalendarSettings';

export default function CalendarSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Kalender Einstellungen</h1>
        <p className="text-muted-foreground">
          Konfigurieren Sie Google Calendar Integration und Terminpuffer
        </p>
      </div>

      <GoogleCalendarSettings />
    </div>
  );
}