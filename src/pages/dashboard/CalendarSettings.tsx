import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleCalendarSettings from '@/components/GoogleCalendarSettings';
import CalendarAvailabilityManager from '@/components/CalendarAvailabilityManager';
import CalendarHolidayManager from '@/components/CalendarHolidayManager';
import { Calendar, Clock, Ban, Settings } from 'lucide-react';

export default function CalendarSettings() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Kalender-Management</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Umfassende Kontrolle über Ihre Terminplanung, Verfügbarkeit und Kalender-Integration
        </p>
      </div>

      <Tabs defaultValue="integration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Integration
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Verfügbarkeit
          </TabsTrigger>
          <TabsTrigger value="holidays" className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Gesperrte Termine
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Kalender-Ansicht
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integration" className="space-y-6">
          <GoogleCalendarSettings />
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <CalendarAvailabilityManager />
        </TabsContent>

        <TabsContent value="holidays" className="space-y-6">
          <CalendarHolidayManager />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Kalender-Ansicht</h3>
            <p className="text-muted-foreground">
              Hier wird bald eine interaktive Kalender-Ansicht verfügbar sein
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}