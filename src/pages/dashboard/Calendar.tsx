import AppointmentCalendar from '@/components/AppointmentCalendar';

export default function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Terminkalender</h1>
        <p className="text-muted-foreground">
          Übersichtliche Darstellung aller Termine im Kalender
        </p>
      </div>

      <AppointmentCalendar />
    </div>
  );
}