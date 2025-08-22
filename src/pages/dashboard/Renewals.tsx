import AppointmentRenewal from '@/components/AppointmentRenewal';

export default function Renewals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Termin-Verlängerungen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie wiederkehrende Termine und Verlängerungen
        </p>
      </div>

      <AppointmentRenewal />
    </div>
  );
}