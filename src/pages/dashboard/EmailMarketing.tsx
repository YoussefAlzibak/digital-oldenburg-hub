import EmailMarketingSystem from '@/components/EmailMarketing';

export default function EmailMarketing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">E-Mail Marketing</h1>
        <p className="text-muted-foreground">
          Erstellen und verwalten Sie E-Mail-Kampagnen, Templates und Automatisierungen
        </p>
      </div>

      <EmailMarketingSystem />
    </div>
  );
}