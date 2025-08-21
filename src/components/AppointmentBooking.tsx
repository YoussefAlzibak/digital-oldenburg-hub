import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Video, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'online' | 'phone' | 'office' | 'client'>('online');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
  ];

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    try {
      const { data: bookedSlots } = await supabase
        .from('appointments')
        .select('scheduled_time')
        .eq('scheduled_date', selectedDate)
        .eq('status', 'confirmed');

      const bookedTimes = bookedSlots?.map(slot => 
        new Date(slot.scheduled_time).toLocaleTimeString('de-DE', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      ) || [];

      const updatedSlots = timeSlots.map(slot => ({
        ...slot,
        available: !bookedTimes.includes(slot.time)
      }));

      setAvailableSlots(updatedSlots);
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableSlots(timeSlots);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie Datum und Uhrzeit aus.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);

    try {
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      
      const { error } = await supabase
        .from('appointments')
        .insert([{
          scheduled_date: selectedDate,
          scheduled_time: appointmentDateTime.toISOString(),
          meeting_type: appointmentType,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Termin vorgemerkt!",
        description: "Ihr Terminwunsch wurde erfolgreich übermittelt. Wir bestätigen den Termin in Kürze.",
      });

      setSelectedDate('');
      setSelectedTime('');
      checkAvailability();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Der Termin konnte nicht gebucht werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'office': return <Building className="h-4 w-4" />;
      case 'client': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'online': return 'Online Video-Call';
      case 'phone': return 'Telefonberatung';
      case 'office': return 'Vor Ort (Büro)';
      case 'client': return 'Vor Ort (Kunde)';
      default: return type;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Termin buchen
        </CardTitle>
        <CardDescription>
          Buchen Sie direkt einen verfügbaren Termin für Ihre kostenlose Beratung
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Beratungsart auswählen */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Beratungsart</label>
          <div className="grid grid-cols-2 gap-2">
            {(['online', 'phone', 'office', 'client'] as const).map((type) => (
              <Button
                key={type}
                variant={appointmentType === type ? "default" : "outline"}
                onClick={() => setAppointmentType(type)}
                className="justify-start"
              >
                {getTypeIcon(type)}
                {getTypeLabel(type)}
              </Button>
            ))}
          </div>
        </div>

        {/* Datum auswählen */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Datum wählen</label>
          <input
            type="date"
            min={getMinDate()}
            max={getMaxDate()}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          />
        </div>

        {/* Verfügbare Zeiten */}
        {selectedDate && (
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Verfügbare Zeiten
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className="relative"
                >
                  {slot.time}
                  {!slot.available && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs px-1">
                      Belegt
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Termin bestätigen */}
        {selectedDate && selectedTime && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
            <h4 className="font-medium">Ihr gewählter Termin:</h4>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(selectedDate).toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {selectedTime} Uhr
            </div>
            <div className="flex items-center gap-2 text-sm">
              {getTypeIcon(appointmentType)}
              {getTypeLabel(appointmentType)}
            </div>
          </div>
        )}

        <Button 
          onClick={handleBookAppointment}
          disabled={!selectedDate || !selectedTime || isBooking}
          className="w-full"
        >
          {isBooking ? 'Wird gebucht...' : 'Termin verbindlich buchen'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Nach der Buchung erhalten Sie eine Bestätigung und weitere Details zum Termin.
        </p>
      </CardContent>
    </Card>
  );
}