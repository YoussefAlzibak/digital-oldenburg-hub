import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  RotateCcw, 
  Plus, 
  Send, 
  Eye, 
  Edit, 
  Trash2,
  Bell,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths, isBefore, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  status: string;
  created_at: string;
  contact_request_id?: string;
  contact_requests?: {
    name: string;
    email: string;
    company?: string;
    service_type: string;
  };
}

interface RenewalSettings {
  id?: string;
  appointment_id: string;
  renewal_type: string;
  frequency: string;
  advance_notice_days: number;
  max_renewals: number;
  is_active: boolean;
  next_renewal_date?: string;
  renewals_count: number;
  created_at?: string;
}

interface RenewalReminder {
  id: string;
  appointment_id: string;
  reminder_date: string;
  sent_at?: string;
  status: string;
  created_at: string;
}

export default function AppointmentRenewal() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [renewalSettings, setRenewalSettings] = useState<RenewalSettings[]>([]);
  const [reminders, setReminders] = useState<RenewalReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState<Partial<RenewalSettings>>({
    renewal_type: 'reminder',
    frequency: 'monthly',
    advance_notice_days: 7,
    max_renewals: 12,
    is_active: true,
    renewals_count: 0
  });

  const getAppointmentById = (appointmentId: string) => {
    return appointments.find(a => a.id === appointmentId);
  };

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [appointmentsResponse, renewalSettingsResponse, remindersResponse] = await Promise.all([
        // Load completed appointments
        supabase
          .from('appointments')
          .select(`
            *,
            contact_requests (
              name,
              email,
              company,
              service_type
            )
          `)
          .eq('status', 'completed')
          .order('scheduled_date', { ascending: false }),
        
        // Load renewal settings
        supabase
          .from('renewal_settings')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // Load reminders separately and join data manually
        supabase
          .from('renewal_reminders')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (appointmentsResponse.error) throw appointmentsResponse.error;
      if (renewalSettingsResponse.error) throw renewalSettingsResponse.error;
      if (remindersResponse.error) throw remindersResponse.error;

      setAppointments(appointmentsResponse.data || []);
      setRenewalSettings((renewalSettingsResponse.data || []) as RenewalSettings[]);
      setReminders((remindersResponse.data || []) as RenewalReminder[]);

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRenewal = async () => {
    if (!selectedAppointment || !formData.renewal_type) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie einen Termin und alle erforderlichen Einstellungen.",
        variant: "destructive"
      });
      return;
    }

    try {
      const appointmentDate = new Date(selectedAppointment.scheduled_date);
      let nextRenewalDate: Date;

      // Calculate next renewal date based on frequency
      switch (formData.frequency) {
        case 'weekly':
          nextRenewalDate = addWeeks(appointmentDate, 1);
          break;
        case 'monthly':
          nextRenewalDate = addMonths(appointmentDate, 1);
          break;
        case 'quarterly':
          nextRenewalDate = addMonths(appointmentDate, 3);
          break;
        case 'yearly':
          nextRenewalDate = addMonths(appointmentDate, 12);
          break;
        default:
          nextRenewalDate = addMonths(appointmentDate, 1);
      }

      // If automatic renewal, create the appointment immediately
      if (formData.renewal_type === 'automatic') {
        await createAutomaticRenewal(selectedAppointment, nextRenewalDate);
      } else {
        // Create reminder
        await createRenewalReminder(selectedAppointment, nextRenewalDate);
      }

      toast({
        title: "Erfolg",
        description: `${formData.renewal_type === 'automatic' ? 'Automatische Verlängerung' : 'Erinnerung'} wurde erstellt.`,
      });

      setShowRenewalDialog(false);
      setSelectedAppointment(null);
      setFormData({
        renewal_type: 'reminder',
        frequency: 'monthly',
        advance_notice_days: 7,
        max_renewals: 12,
        is_active: true,
        renewals_count: 0
      });
      loadData();

    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createAutomaticRenewal = async (appointment: Appointment, renewalDate: Date) => {
    // Validate contact information exists
    if (!appointment.contact_requests?.email) {
      toast({
        title: "Fehler",
        description: "Keine Kontaktdaten für automatische Verlängerung gefunden.",
        variant: "destructive"
      });
      throw new Error("Missing contact information for renewal");
    }

    try {
      // Create new appointment
      const { data: newAppointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          scheduled_date: format(renewalDate, 'yyyy-MM-dd'),
          scheduled_time: appointment.scheduled_time,
          meeting_type: appointment.meeting_type,
          status: 'scheduled',
          contact_request_id: appointment.contact_request_id
        }])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('trigger-appointment-automation', {
        body: {
          appointmentId: newAppointment.id,
          contactEmail: appointment.contact_requests.email,
          contactName: appointment.contact_requests.name,
          appointmentDate: format(renewalDate, 'dd.MM.yyyy'),
          appointmentTime: appointment.scheduled_time,
          serviceType: appointment.contact_requests.service_type || 'Beratung'
        }
      });

      if (emailError) {
        console.error('Email confirmation error:', emailError);
        toast({
          title: "Warnung",
          description: "Termin erstellt, aber Bestätigung konnte nicht versendet werden.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Failed to create automatic renewal:', error);
      throw error;
    }
  };

  const createRenewalReminder = async (appointment: Appointment, renewalDate: Date) => {
    const reminderDate = addDays(renewalDate, -(formData.advance_notice_days || 7));

    // Validate that we have contact information
    if (!appointment.contact_requests?.email) {
      toast({
        title: "Fehler",
        description: "Keine Kontaktdaten für diesen Termin gefunden.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create renewal setting in database
      const { data: renewalSetting, error: renewalError } = await supabase
        .from('renewal_settings')
        .insert([{
          appointment_id: appointment.id,
          renewal_type: formData.renewal_type!,
          frequency: formData.frequency!,
          advance_notice_days: formData.advance_notice_days!,
          max_renewals: formData.max_renewals!,
          renewals_count: 0,
          next_renewal_date: format(renewalDate, 'yyyy-MM-dd'),
          is_active: true
        }])
        .select()
        .single();

      if (renewalError) throw renewalError;

      // Create initial reminder entry
      const { error: reminderError } = await supabase
        .from('renewal_reminders')
        .insert([{
          appointment_id: appointment.id,
          renewal_setting_id: renewalSetting.id,
          reminder_date: format(reminderDate, 'yyyy-MM-dd'),
          status: 'pending'
        }]);

      if (reminderError) throw reminderError;

    } catch (error: any) {
      console.error('Failed to create renewal reminder:', error);
      toast({
        title: "Fehler", 
        description: "Erinnerung konnte nicht erstellt werden: " + error.message,
        variant: "destructive"
      });
    }
  };

  const sendManualReminder = async (appointment: Appointment) => {
    if (!appointment.contact_requests?.email) {
      toast({
        title: "Fehler",
        description: "Keine E-Mail-Adresse für diesen Termin gefunden.",
        variant: "destructive"
      });
      return;
    }

    try {
      await supabase.functions.invoke('process-automations', {
        body: {
          triggerType: 'manual_renewal_reminder',
          subscriberEmail: appointment.contact_requests.email,
          triggerData: {
            first_name: appointment.contact_requests.name.split(' ')[0],
            email: appointment.contact_requests.email,
            company: appointment.contact_requests.company || '',
            service_type: appointment.contact_requests.service_type,
            last_appointment_date: format(new Date(appointment.scheduled_date), 'dd.MM.yyyy'),
            company_name: 'Unicum Tech'
          }
        }
      });

      toast({
        title: "Erfolg",
        description: "Erinnerung wurde versendet.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      pending: "outline",
      sent: "default",
      failed: "destructive"
    };

    const labels: { [key: string]: string } = {
      pending: "Ausstehend",
      sent: "Versendet",
      failed: "Fehlgeschlagen"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: { [key: string]: string } = {
      weekly: 'Wöchentlich',
      monthly: 'Monatlich',
      quarterly: 'Vierteljährlich',
      yearly: 'Jährlich'
    };
    return labels[frequency] || frequency;
  };

  const isRenewalDue = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.scheduled_date);
    const thirtyDaysAgo = addDays(new Date(), -30);
    return isBefore(appointmentDate, thirtyDaysAgo);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Daten...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Terminverlängerung</h2>
          <p className="text-muted-foreground">Automatische Verlängerungen und Erinnerungen für abgeschlossene Termine</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Erinnerungen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Erinnerungsübersicht</DialogTitle>
                <DialogDescription>
                  Übersicht aller geplanten und gesendeten Erinnerungen
                </DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Termin</TableHead>
                    <TableHead>Erinnerungsdatum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Versendet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Keine Erinnerungen vorhanden
                      </TableCell>
                    </TableRow>
                  ) : (
                     reminders.map((reminder) => {
                       const appointment = getAppointmentById(reminder.appointment_id);
                       return (
                       <TableRow key={reminder.id}>
                         <TableCell>
                           <div>
                             <div className="font-medium">
                               {appointment?.contact_requests?.name || 'Unbekannt'}
                             </div>
                             <div className="text-xs text-muted-foreground">
                               {appointment ? format(new Date(appointment.scheduled_date), 'PPP', { locale: de }) : 'Unbekannt'}
                             </div>
                           </div>
                         </TableCell>
                         <TableCell>
                           {format(new Date(reminder.reminder_date), 'PPP', { locale: de })}
                         </TableCell>
                         <TableCell>
                           {getStatusBadge(reminder.status)}
                         </TableCell>
                         <TableCell>
                           {reminder.sent_at ? format(new Date(reminder.sent_at), 'PPp', { locale: de }) : '-'}
                         </TableCell>
                       </TableRow>
                       );
                     })
                  )}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>

          <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Verlängerung einrichten
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Terminverlängerung einrichten</DialogTitle>
                <DialogDescription>
                  Automatische Verlängerungen oder Erinnerungen für Termine konfigurieren
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Termin auswählen</Label>
                  <Select 
                    value={selectedAppointment?.id || ''} 
                    onValueChange={(value) => {
                      const appointment = appointments.find(a => a.id === value);
                      setSelectedAppointment(appointment || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Termin auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {appointments
                        .filter(appointment => appointment.contact_requests?.email) // Only show appointments with contact data
                        .map(appointment => (
                        <SelectItem key={appointment.id} value={appointment.id}>
                          <div>
                            <div className="font-medium">
                              {appointment.contact_requests?.name} - {appointment.contact_requests?.service_type || 'Unbekannt'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(appointment.scheduled_date), 'PPP', { locale: de })} um {appointment.scheduled_time}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Verlängerungstyp</Label>
                    <Select 
                      value={formData.renewal_type || 'reminder'} 
                      onValueChange={(value: 'automatic' | 'reminder') => 
                        setFormData({...formData, renewal_type: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">
                          <div>
                            <div>Erinnerung senden</div>
                            <div className="text-xs text-muted-foreground">E-Mail Erinnerung an Kunde</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="automatic">
                          <div>
                            <div>Automatisch verlängern</div>
                            <div className="text-xs text-muted-foreground">Neuen Termin automatisch erstellen</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Häufigkeit</Label>
                    <Select 
                      value={formData.frequency || 'monthly'} 
                      onValueChange={(value: 'weekly' | 'monthly' | 'quarterly' | 'yearly') => 
                        setFormData({...formData, frequency: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Wöchentlich</SelectItem>
                        <SelectItem value="monthly">Monatlich</SelectItem>
                        <SelectItem value="quarterly">Vierteljährlich</SelectItem>
                        <SelectItem value="yearly">Jährlich</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="advance-notice">Vorlaufzeit (Tage)</Label>
                    <Input
                      id="advance-notice"
                      type="number"
                      min="1"
                      max="30"
                      value={formData.advance_notice_days || 7}
                      onChange={(e) => setFormData({...formData, advance_notice_days: parseInt(e.target.value)})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="max-renewals">Max. Verlängerungen</Label>
                    <Input
                      id="max-renewals"
                      type="number"
                      min="1"
                      max="50"
                      value={formData.max_renewals || 12}
                      onChange={(e) => setFormData({...formData, max_renewals: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-active"
                    checked={formData.is_active !== false}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is-active">Aktiviert</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRenewalDialog(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleCreateRenewal}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Verlängerung einrichten
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{appointments.length}</div>
            <div className="text-sm text-muted-foreground">Abgeschlossene Termine</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {appointments.filter(a => isRenewalDue(a)).length}
            </div>
            <div className="text-sm text-muted-foreground">Verlängerung fällig</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{renewalSettings.length}</div>
            <div className="text-sm text-muted-foreground">Aktive Verlängerungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{reminders.length}</div>
            <div className="text-sm text-muted-foreground">Geplante Erinnerungen</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Abgeschlossene Termine
          </CardTitle>
          <CardDescription>
            Übersicht aller abgeschlossenen Termine und deren Verlängerungsstatus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kunde</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Letzter Termin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                  <div>
                    <div className="font-medium">
                      {appointment.contact_requests?.name || 'Unbekannt'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.contact_requests?.email || 'Keine E-Mail'}
                    </div>
                    {appointment.contact_requests?.company && (
                      <div className="text-xs text-muted-foreground">
                        {appointment.contact_requests.company}
                      </div>
                    )}
                  </div>
                  </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {appointment.contact_requests?.service_type || 'Unbekannt'}
                  </Badge>
                </TableCell>
                  <TableCell>
                    <div>
                      <div>{format(new Date(appointment.scheduled_date), 'PPP', { locale: de })}</div>
                      <div className="text-sm text-muted-foreground">{appointment.scheduled_time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isRenewalDue(appointment) ? (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Verlängerung fällig</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Aktuell</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendManualReminder(appointment)}
                        disabled={!appointment.contact_requests?.email}
                        title={!appointment.contact_requests?.email ? "Keine E-Mail verfügbar" : "Manuelle Erinnerung senden"}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowRenewalDialog(true);
                        }}
                        disabled={!appointment.contact_requests?.email}
                        title={!appointment.contact_requests?.email ? "Keine Kontaktdaten verfügbar" : "Verlängerung einrichten"}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
              {appointments.filter(appointment => appointment.contact_requests?.email).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Keine Termine mit Kontaktdaten gefunden. 
                  <br />
                  Nur Termine mit verknüpften Kontaktanfragen können verlängert werden.
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}