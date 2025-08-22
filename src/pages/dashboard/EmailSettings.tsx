import SMTPSettings from '@/components/SMTPSettings';

export default function EmailSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">E-Mail Einstellungen</h1>
        <p className="text-muted-foreground">
          Konfigurieren Sie SMTP-Einstellungen für den E-Mail-Versand
        </p>
      </div>

      <SMTPSettings />
    </div>
  );
}