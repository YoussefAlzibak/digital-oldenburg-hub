import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, ChevronLeft, ChevronRight, Filter, Users, Phone, Video, MapPin, Ban, Settings, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';

interface Appointment {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  status: string;
  created_at: string;
  name?: string;
  email?: string;
}

interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'holiday' | 'vacation' | 'blocked';
  isRecurring: boolean;
}

interface AvailabilityTemplate {
  id: string;
  name: string;
  description: string;
  schedule: {
    [key: string]: { start: string; end: string; active: boolean };
  };
  isActive: boolean;
}

interface CalendarDay {
  date: Date;
  appointments: Appointment[];
  holidays: Holiday[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isAvailable: boolean;
  availableHours?: { start: string; end: string };
}

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Mock data for holidays and availability (in real app, this would come from database)
const MOCK_HOLIDAYS: Holiday[] = [
  { id: '1', name: 'Weihnachtstag', date: new Date(2024, 11, 25), type: 'holiday', isRecurring: true },
  { id: '2', name: 'Neujahr', date: new Date(2024, 0, 1), type: 'holiday', isRecurring: true },
];

const MOCK_AVAILABILITY: AvailabilityTemplate = {
  id: '1',
  name: 'Standard Bürozeiten',
  description: 'Montag bis Freitag, 9:00 - 17:00 Uhr',
  schedule: {
    monday: { start: '09:00', end: '17:00', active: true },
    tuesday: { start: '09:00', end: '17:00', active: true },
    wednesday: { start: '09:00', end: '17:00', active: true },
    thursday: { start: '09:00', end: '17:00', active: true },
    friday: { start: '09:00', end: '17:00', active: true },
    saturday: { start: '09:00', end: '17:00', active: false },
    sunday: { start: '09:00', end: '17:00', active: false },
  },
  isActive: true,
};

export default function IntegratedCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [loading, setLoading] = useState(true);
  const [holidays] = useState<Holiday[]>(MOCK_HOLIDAYS);
  const [availability] = useState<AvailabilityTemplate>(MOCK_AVAILABILITY);

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Get date range based on view mode
      let startDate: Date, endDate: Date;
      
      if (viewMode === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else if (viewMode === 'week') {
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
      } else {
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('scheduled_date', startDate.toISOString().split('T')[0])
        .lte('scheduled_date', endDate.toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      } else if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      } else {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  const isAvailable = (date: Date): { available: boolean; hours?: { start: string; end: string } } => {
    const dayKey = DAY_KEYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
    const daySchedule = availability.schedule[dayKey];
    
    // Check if it's a holiday
    const isHoliday = holidays.some(h => isSameDay(h.date, date));
    
    if (isHoliday || !daySchedule?.active) {
      return { available: false };
    }
    
    return { 
      available: true, 
      hours: { start: daySchedule.start, end: daySchedule.end }
    };
  };

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Start from Monday
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dayAppointments = appointments.filter(apt => 
        new Date(apt.scheduled_date).toDateString() === currentDay.toDateString() &&
        (selectedFilter === 'all' || apt.status === selectedFilter)
      );
      
      const dayHolidays = holidays.filter(h => isSameDay(h.date, currentDay));
      const availabilityInfo = isAvailable(currentDay);
      
      days.push({
        date: currentDay,
        appointments: dayAppointments,
        holidays: dayHolidays,
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === today.toDateString(),
        isAvailable: availabilityInfo.available,
        availableHours: availabilityInfo.hours,
      });
    }
    
    return days;
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive"
    };

    const labels: { [key: string]: string } = {
      pending: "Ausstehend",
      confirmed: "Bestätigt", 
      completed: "Abgeschlossen",
      cancelled: "Abgesagt"
    };

    return (
      <Badge variant={variants[status] || "outline"} className="text-xs">
        {labels[status] || status}
      </Badge>
    );
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-3 w-3" />;
      case 'phone': return <Phone className="h-3 w-3" />;
      case 'office': 
      case 'client': return <MapPin className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const getHolidayBadge = (holiday: Holiday) => {
    const colors: { [key: string]: string } = {
      holiday: "bg-red-100 text-red-800",
      vacation: "bg-blue-100 text-blue-800",
      blocked: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={`text-xs ${colors[holiday.type]}`}>
        {holiday.name}
      </Badge>
    );
  };

  const calendarDays = getCalendarDays();
  const monthYear = currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const availableDays = calendarDays.filter(d => d.isAvailable && d.isCurrentMonth).length;
  const blockedDays = calendarDays.filter(d => !d.isAvailable && d.isCurrentMonth).length;

  if (loading) {
    return <div className="flex justify-center p-8">Lade integrierte Kalender-Ansicht...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalAppointments}</div>
            <div className="text-sm text-muted-foreground">Termine gesamt</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{confirmedAppointments}</div>
            <div className="text-sm text-muted-foreground">Bestätigt</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingAppointments}</div>
            <div className="text-sm text-muted-foreground">Ausstehend</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{availableDays}</div>
            <div className="text-sm text-muted-foreground">Verfügbare Tage</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{blockedDays}</div>
            <div className="text-sm text-muted-foreground">Gesperrte Tage</div>
          </CardContent>
        </Card>
      </div>

      {/* Integrated Calendar */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Integrierte Kalender-Ansicht
              </CardTitle>
              <CardDescription>
                Vollständige Übersicht: Termine, Verfügbarkeit & gesperrte Zeiten für {monthYear}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monat</SelectItem>
                  <SelectItem value="week">Woche</SelectItem>
                  <SelectItem value="day">Tag</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Termine</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="confirmed">Bestätigt</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                  <SelectItem value="cancelled">Abgesagt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold capitalize">{monthYear}</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Availability Template */}
          <Alert className="border-blue-200 bg-blue-50/50">
            <Settings className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Aktive Verfügbarkeit:</strong> {availability.name} - {availability.description}
            </AlertDescription>
          </Alert>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
            {DAYS.map(day => (
              <div key={day} className="p-2">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-[120px] p-2 border rounded-md relative
                  ${day.isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                  ${day.isToday ? 'ring-2 ring-primary' : ''}
                  ${!day.isAvailable ? 'bg-red-50 border-red-200' : ''}
                  ${day.isAvailable && day.isCurrentMonth ? 'bg-green-50/30 border-green-200' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium mb-1 flex items-center justify-between
                  ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                  ${day.isToday ? 'text-primary font-bold' : ''}
                `}>
                  <span>{day.date.getDate()}</span>
                  {!day.isAvailable && <Ban className="h-3 w-3 text-red-500" />}
                </div>
                
                {/* Availability Hours */}
                {day.isAvailable && day.availableHours && (
                  <div className="text-xs text-green-600 mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{day.availableHours.start}-{day.availableHours.end}</span>
                  </div>
                )}
                
                {/* Holidays */}
                {day.holidays.map((holiday, idx) => (
                  <div key={idx} className="mb-1">
                    {getHolidayBadge(holiday)}
                  </div>
                ))}
                
                {/* Appointments */}
                <div className="space-y-1">
                  {day.appointments.slice(0, 2).map((appointment, idx) => (
                    <div 
                      key={idx}
                      className="text-xs p-1 rounded bg-primary/10 border border-primary/20"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {getMeetingIcon(appointment.meeting_type)}
                        <span>{appointment.scheduled_time}</span>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  ))}
                  
                  {day.appointments.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{day.appointments.length - 2} weitere
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-xs">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Termintypen</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Video className="h-3 w-3" />
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>Telefon</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>Vor Ort</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Verfügbarkeit</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                  <span>Verfügbar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                  <span>Gesperrt</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Status</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-1 py-0">Ausstehend</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs px-1 py-0">Bestätigt</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Feiertage</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 text-xs px-1 py-0">Feiertag</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0">Urlaub</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Plus className="h-5 w-5" />
          <span>Neuen Termin erstellen</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Ban className="h-5 w-5" />
          <span>Tag sperren</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Settings className="h-5 w-5" />
          <span>Verfügbarkeit anpassen</span>
        </Button>
      </div>
    </div>
  );
}