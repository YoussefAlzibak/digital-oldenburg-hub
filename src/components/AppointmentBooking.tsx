import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Video, Phone, Building, User, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { parseISO, isSameDay } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  start: string;
  end: string;
  active: boolean;
}

interface AvailabilityTemplate {
  schedule: {
    [key: string]: DaySchedule;
  };
}

interface BlockedDate {
  date: Date;
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'online' | 'phone' | 'office' | 'client'>('online');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [availability, setAvailability] = useState<AvailabilityTemplate | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAvailabilitySettings();
  }, []);

  useEffect(() => {
    if (selectedDate && availability) {
      checkAvailability();
    }
  }, [selectedDate, availability]);

  const loadAvailabilitySettings = async () => {
    try {
      // First check google_calendar_settings for working hours
      const { data: calendarSettings, error: calendarError } = await supabase
        .from('google_calendar_settings')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!calendarError && calendarSettings && calendarSettings.length > 0) {
        const settings = calendarSettings[0];
        // Convert google_calendar_settings to availability format
        const schedule: AvailabilityTemplate['schedule'] = {};
        const workingDays = settings.working_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        
        DAY_KEYS.forEach(day => {
          schedule[day] = {
            start: settings.working_hours_start?.substring(0, 5) || '09:00',
            end: settings.working_hours_end?.substring(0, 5) || '18:00',
            active: workingDays.includes(day)
          };
        });
        
        setAvailability({ schedule });
      } else {
        // Fallback to availability_templates
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('availability_templates')
          .select('schedule')
          .eq('is_active', true)
          .limit(1);

        if (availabilityError) throw availabilityError;
        
        if (availabilityData && availabilityData.length > 0) {
          setAvailability({
            schedule: availabilityData[0].schedule as unknown as AvailabilityTemplate['schedule']
          });
        }
      }

      // Fetch blocked dates
      const { data: blockedData, error: blockedError } = await supabase
        .from('calendar_blocked_dates')
        .select('date');

      if (blockedError) throw blockedError;
      
      const blocked = (blockedData || []).map(b => ({
        date: parseISO(b.date)
      }));
      setBlockedDates(blocked);
    } catch (error) {
      console.error('Error loading availability settings:', error);
    }
  };

  const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    const [startHour] = start.split(':').map(Number);
    const [endHour] = end.split(':').map(Number);
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  };

  const checkAvailability = async () => {
    if (!selectedDate) return;
    
    setLoadingSlots(true);
    try {
      const selectedDateObj = new Date(selectedDate);
      const dayOfWeek = selectedDateObj.getDay();
      const dayKey = DAY_KEYS[dayOfWeek];
      
      // Check if it's a blocked date
      const isBlocked = blockedDates.some(b => isSameDay(b.date, selectedDateObj));
      
      if (isBlocked) {
        setAvailableSlots([]);
        toast({
          title: "Dieser Tag ist nicht verfügbar",
          description: "Bitte wählen Sie einen anderen Tag.",
          variant: "destructive"
        });
        setLoadingSlots(false);
        return;
      }
      
      // Get schedule for the selected day
      const daySchedule = availability?.schedule?.[dayKey];
      
      if (!daySchedule?.active) {
        setAvailableSlots([]);
        toast({
          title: "Keine Termine an diesem Tag",
          description: "An diesem Wochentag sind keine Termine verfügbar.",
          variant: "destructive"
        });
        setLoadingSlots(false);
        return;
      }
      
      // Generate time slots based on availability
      const timeSlots = generateTimeSlots(daySchedule.start, daySchedule.end);
      
      // Check which slots are already booked
      const { data: bookedSlots } = await supabase
        .from('appointments')
        .select('scheduled_time')
        .eq('scheduled_date', selectedDate)
        .in('status', ['confirmed', 'pending']);

      const bookedTimes = bookedSlots?.map(slot => slot.scheduled_time) || [];

      const updatedSlots = timeSlots.map(time => ({
        time,
        available: !bookedTimes.includes(time)
      }));

      setAvailableSlots(updatedSlots);
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const isDateBlocked = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const dayKey = DAY_KEYS[dayOfWeek];
    
    // Check if it's a blocked date
    const isBlocked = blockedDates.some(b => isSameDay(b.date, date));
    if (isBlocked) return true;
    
    // Check if this weekday is available
    const daySchedule = availability?.schedule?.[dayKey];
    return !daySchedule?.active;
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
      setAvailableSlots([]);
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
    maxDate.setDate(maxDate.getDate() + 60);
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
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              {selectedDate && isDateBlocked(selectedDate) && (
                <p className="text-sm text-destructive">
                  An diesem Tag sind keine Termine verfügbar. Bitte wählen Sie einen anderen Tag.
                </p>
              )}
            </div>

            {/* Verfügbare Zeiten */}
            {selectedDate && !isDateBlocked(selectedDate) && (
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Verfügbare Zeiten
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Verfügbarkeit wird geprüft...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Keine Termine an diesem Tag verfügbar.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className="relative"
                        size="sm"
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
                )}
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
                {isBooking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird gebucht...
                  </>
                ) : (
                  'Termin verbindlich buchen'
                )}
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
