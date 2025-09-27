import { WebsiteLayout } from "@/components/WebsiteLayout";
import AppointmentBooking from "@/components/AppointmentBooking";

export default function BookAppointment() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Kostenlosen Beratungstermin buchen</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vereinbaren Sie ein unverbindliches Beratungsgespräch und erfahren Sie, 
              wie wir Ihr Unternehmen digital voranbringen können.
            </p>
          </div>
          <AppointmentBooking />
        </div>
      </div>
    </WebsiteLayout>
  );
}