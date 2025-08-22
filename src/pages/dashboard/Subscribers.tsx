import ErrorBoundary from '@/components/ErrorBoundary';
import SubscriberManagement from '@/components/SubscriberManagement';

export default function Subscribers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Abonnenten-Verwaltung</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle E-Mail-Abonnenten und Newsletter-Listen
        </p>
      </div>

      <ErrorBoundary>
        <SubscriberManagement />
      </ErrorBoundary>
    </div>
  );
}