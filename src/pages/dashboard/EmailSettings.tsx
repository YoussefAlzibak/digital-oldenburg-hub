import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Bell, FileText } from 'lucide-react';
import SMTPSettings from '@/components/SMTPSettings';
import EmailNotificationSettings from '@/components/EmailNotificationSettings';
import FormEmailSettings from '@/components/FormEmailSettings';

export default function EmailSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">E-Mail Einstellungen</h1>
        <p className="text-muted-foreground">
          Konfigurieren Sie SMTP, Benachrichtigungen und E-Mail-Vorlagen
        </p>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="smtp" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">SMTP-Server</span>
            <span className="sm:hidden">SMTP</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Benachrichtigungen</span>
            <span className="sm:hidden">Notify</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Vorlagen</span>
            <span className="sm:hidden">Vorlagen</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smtp">
          <SMTPSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <EmailNotificationSettings />
        </TabsContent>

        <TabsContent value="templates">
          <FormEmailSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
