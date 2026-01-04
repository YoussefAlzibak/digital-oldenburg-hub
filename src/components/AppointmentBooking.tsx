import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Video, Phone, Building, User, Mail, MessageCircle } from 'lucide-react';
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
  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
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
        .in('status', ['confirmed', 'pending']);

      const bookedTimes = bookedSlots?.map(slot => slot.scheduled_time) || [];

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

    if (!customerData.name || !customerData.email) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);

    try {
      // Use edge function to book appointment (bypasses RLS)
      const { data, error } = await supabase.functions.invoke('book-appointment', {
        body: {
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          appointment_type: appointmentType,
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone || undefined,
          company: customerData.company || undefined,
          message: customerData.message || undefined
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Buchung fehlgeschlagen');

      // Send confirmation email via edge function
      try {
        await supabase.functions.invoke('send-appointment-confirmation', {
          body: {
            appointment: data.appointment,
            customer: customerData,
            appointmentType
          }
        });
      } catch (emailError) {
        console.error('Confirmation email error:', emailError);
        // Don't fail the booking if email fails
      }

      toast({
        title: "Termin erfolgreich gebucht!",
        description: "Sie erhalten eine Bestätigungsmail mit allen Details. Wir melden uns in Kürze bei Ihnen.",
      });

      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setStep(1);
      setCustomerData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
      checkAvailability();
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Fehler beim Buchen",
        description: "Der Termin konnte nicht gebucht werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
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
          {step === 2 && <Badge variant="outline">Schritt 2 von 2</Badge>}
        </CardTitle>
        <CardDescription>
          {step === 1 
            ? "Wählen Sie Ihren Wunschtermin für eine kostenlose Beratung"
            : "Vervollständigen Sie Ihre Buchung mit Ihren Kontaktdaten"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 ? (
          <>
            {/* Beratungsart auswählen */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Art der Beratung</label>
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

            {/* Termin-Zusammenfassung */}
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
              onClick={() => setStep(2)}
              disabled={!selectedDate || !selectedTime}
              className="w-full"
            >
              Weiter zu Ihren Daten
            </Button>
          </>
        ) : (
          <>
            {/* Kundendaten Schritt */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({...prev, name: e.target.value}))}
                    placeholder="Ihr vollständiger Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-Mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
                    placeholder="ihre.email@beispiel.de"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
                    placeholder="+49 (0) 123 456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Unternehmen</Label>
                  <Input
                    id="company"
                    value={customerData.company}
                    onChange={(e) => setCustomerData(prev => ({...prev, company: e.target.value}))}
                    placeholder="Ihr Unternehmen"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Nachricht (optional)
                </Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder="Beschreiben Sie kurz Ihr Anliegen oder besondere Wünsche für den Termin..."
                  value={customerData.message}
                  onChange={(e) => setCustomerData(prev => ({...prev, message: e.target.value}))}
                />
              </div>
            </div>

            {/* Termin-Bestätigung */}
            <div className="p-4 border rounded-lg bg-primary/5 space-y-3">
              <h4 className="font-semibold text-primary">Termin-Bestätigung</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Datum & Zeit:</p>
                  <p>{new Date(selectedDate).toLocaleDateString('de-DE')} um {selectedTime} Uhr</p>
                </div>
                <div>
                  <p className="font-medium">Art der Beratung:</p>
                  <p>{getTypeLabel(appointmentType)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Nach der Buchung erhalten Sie eine Bestätigungsmail mit allen Details und weiteren Informationen.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Zurück
              </Button>
              <Button 
                onClick={handleBookAppointment}
                disabled={!customerData.name || !customerData.email || isBooking}
                className="flex-1"
              >
                {isBooking ? 'Wird gebucht...' : 'Termin verbindlich buchen'}
              </Button>
            </div>
          </>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Kostenlose Beratung • Keine Verpflichtungen • Terminbestätigung per E-Mail
        </p>
      </CardContent>
    </Card>
  );
}