import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  RotateCcw, 
  Plus, 
  Send, 
  Edit, 
  Trash2,
  Bell,
  Users,
  CheckCircle,
  AlertCircle,
  Settings,
  RefreshCw
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths, isBefore } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
  id: string;
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<RenewalSettings | null>(null);
  const [formData, setFormData] = useState({
    renewal_type: 'reminder',
    frequency: 'monthly',
    advance_notice_days: 7,
    max_renewals: 12,
    is_active: true
  });
  const [processing, setProcessing] = useState(false);

  const { toast } = useToast();

  const getAppointmentById = (appointmentId: string) => {
    return appointments.find(a => a.id === appointmentId);
  };

  useEffect(() => {
    loadData();
    
    // Real-time subscription for updates
    const channel = supabase
      .channel('renewal-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'renewal_settings' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'renewal_reminders' }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [appointmentsResponse, renewalSettingsResponse, remindersResponse] = await Promise.all([
        supabase
          .from('appointments')
          .select(`*, contact_requests (name, email, company, service_type)`)
          .eq('status', 'completed')
          .order('scheduled_date', { ascending: false }),
        
        supabase
          .from('renewal_settings')
          .select('*')
          .order('created_at', { ascending: false }),
        
        supabase
          .from('renewal_reminders')
          .select('*')
          .order('reminder_date', { ascending: true })
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
    if (!selectedAppointment) {
      toast({ title: "Fehler", description: "Bitte wählen Sie einen Termin.", variant: "destructive" });
      return;
    }

    try {
      const appointmentDate = new Date(selectedAppointment.scheduled_date);
      let nextRenewalDate: Date;

      switch (formData.frequency) {
        case 'weekly': nextRenewalDate = addWeeks(appointmentDate, 1); break;
        case 'monthly': nextRenewalDate = addMonths(appointmentDate, 1); break;
        case 'quarterly': nextRenewalDate = addMonths(appointmentDate, 3); break;
        case 'yearly': nextRenewalDate = addMonths(appointmentDate, 12); break;
        default: nextRenewalDate = addMonths(appointmentDate, 1);
      }

      const reminderDate = addDays(nextRenewalDate, -formData.advance_notice_days);

      // Create renewal setting
      const { data: renewalSetting, error: renewalError } = await supabase
        .from('renewal_settings')
        .insert([{
          appointment_id: selectedAppointment.id,
          renewal_type: formData.renewal_type,
          frequency: formData.frequency,
          advance_notice_days: formData.advance_notice_days,
          max_renewals: formData.max_renewals,
          renewals_count: 0,
          next_renewal_date: format(nextRenewalDate, 'yyyy-MM-dd'),
          is_active: formData.is_active
        }])
        .select()
        .single();

      if (renewalError) throw renewalError;

      // Create initial reminder
      await supabase.from('renewal_reminders').insert([{
        appointment_id: selectedAppointment.id,
        renewal_setting_id: renewalSetting.id,
        reminder_date: format(reminderDate, 'yyyy-MM-dd'),
        status: 'pending'
      }]);

      toast({ title: "Erfolg", description: "Verlängerung wurde eingerichtet." });
      setShowRenewalDialog(false);
      setSelectedAppointment(null);
      resetForm();
      loadData();

    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateRenewal = async () => {
    if (!selectedSetting) return;

    try {
      const { error } = await supabase
        .from('renewal_settings')
        .update({
          renewal_type: formData.renewal_type,
          frequency: formData.frequency,
          advance_notice_days: formData.advance_notice_days,
          max_renewals: formData.max_renewals,
          is_active: formData.is_active
        })
        .eq('id', selectedSetting.id);

      if (error) throw error;

      toast({ title: "Erfolg", description: "Einstellungen wurden aktualisiert." });
      setShowEditDialog(false);
      setSelectedSetting(null);
      loadData();

    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteRenewal = async (settingId: string) => {
    try {
      // Delete related reminders first
      await supabase.from('renewal_reminders').delete().eq('renewal_setting_id', settingId);
      
      const { error } = await supabase.from('renewal_settings').delete().eq('id', settingId);
      if (error) throw error;

      toast({ title: "Erfolg", description: "Verlängerung wurde gelöscht." });
      loadData();

    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    }
  };

  const processRenewals = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-renewal-tasks');
      if (error) throw error;

      toast({
        title: "Erfolg",
        description: `${data.processed || 0} Aufgaben und ${data.reminders_processed || 0} Erinnerungen verarbeitet.`
      });
      loadData();

    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const sendManualReminder = async (appointment: Appointment) => {
    if (!appointment.contact_requests?.email) {
      toast({ title: "Fehler", description: "Keine E-Mail-Adresse gefunden.", variant: "destructive" });
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

      toast({ title: "Erfolg", description: "Erinnerung wurde versendet." });
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      renewal_type: 'reminder',
      frequency: 'monthly',
      advance_notice_days: 7,
      max_renewals: 12,
      is_active: true
    });
  };

  const openEditDialog = (setting: RenewalSettings) => {
    setSelectedSetting(setting);
    setFormData({
      renewal_type: setting.renewal_type,
      frequency: setting.frequency,
      advance_notice_days: setting.advance_notice_days,
      max_renewals: setting.max_renewals,
      is_active: setting.is_active
    });
    setShowEditDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "outline", label: "Ausstehend" },
      sent: { variant: "default", label: "Versendet" },
      failed: { variant: "destructive", label: "Fehlgeschlagen" }
    };
    const { variant, label } = config[status] || { variant: "outline", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
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

  const appointmentsWithoutRenewal = appointments.filter(
    a => a.contact_requests?.email && !renewalSettings.some(r => r.appointment_id === a.id)
  );

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const sentReminders = reminders.filter(r => r.status === 'sent');

  if (loading) {
    return <div className="flex justify-center p-8">Lade Daten...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Terminverlängerung</h2>
          <p className="text-muted-foreground">Automatische Verlängerungen und Erinnerungen verwalten</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={processRenewals} disabled={processing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${processing ? 'animate-spin' : ''}`} />
            Verarbeiten
          </Button>
          <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Neue Verlängerung
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verlängerung einrichten</DialogTitle>
                <DialogDescription>
                  Automatische Erinnerungen oder Verlängerungen konfigurieren
                </DialogDescription>
              </DialogHeader>
              <RenewalForm
                appointments={appointmentsWithoutRenewal}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateRenewal}
                onCancel={() => { setShowRenewalDialog(false); resetForm(); }}
                submitLabel="Einrichten"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{renewalSettings.filter(r => r.is_active).length}</div>
            <div className="text-sm text-muted-foreground">Aktive Verlängerungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingReminders.length}</div>
            <div className="text-sm text-muted-foreground">Ausstehende Erinnerungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{sentReminders.length}</div>
            <div className="text-sm text-muted-foreground">Versendete Erinnerungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{appointmentsWithoutRenewal.length}</div>
            <div className="text-sm text-muted-foreground">Termine ohne Verlängerung</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Aktive Verlängerungen ({renewalSettings.length})
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Erinnerungen ({reminders.length})
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Abgeschlossene Termine ({appointments.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Renewals Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Aktive Verlängerungseinstellungen</CardTitle>
              <CardDescription>Verwalten Sie Ihre automatischen Verlängerungen</CardDescription>
            </CardHeader>
            <CardContent>
              {renewalSettings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Keine aktiven Verlängerungen vorhanden.
                  <br />
                  <Button variant="link" onClick={() => setShowRenewalDialog(true)}>
                    Jetzt erste Verlängerung einrichten
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Häufigkeit</TableHead>
                      <TableHead>Nächster Termin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renewalSettings.map((setting) => {
                      const appointment = getAppointmentById(setting.appointment_id);
                      return (
                        <TableRow key={setting.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment?.contact_requests?.name || 'Unbekannt'}</div>
                              <div className="text-xs text-muted-foreground">{appointment?.contact_requests?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={setting.renewal_type === 'automatic' ? 'default' : 'secondary'}>
                              {setting.renewal_type === 'automatic' ? 'Automatisch' : 'Erinnerung'}
                            </Badge>
                          </TableCell>
                          <TableCell>{getFrequencyLabel(setting.frequency)}</TableCell>
                          <TableCell>
                            {setting.next_renewal_date 
                              ? format(new Date(setting.next_renewal_date), 'PPP', { locale: de })
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={setting.is_active ? 'default' : 'outline'}>
                              {setting.is_active ? 'Aktiv' : 'Inaktiv'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditDialog(setting)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Verlängerung löschen?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Diese Aktion kann nicht rückgängig gemacht werden. Alle zugehörigen Erinnerungen werden ebenfalls gelöscht.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRenewal(setting.id)}>
                                      Löschen
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Erinnerungsübersicht</CardTitle>
              <CardDescription>Alle geplanten und gesendeten Erinnerungen</CardDescription>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Keine Erinnerungen vorhanden.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Erinnerungsdatum</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Versendet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reminders.map((reminder) => {
                      const appointment = getAppointmentById(reminder.appointment_id);
                      return (
                        <TableRow key={reminder.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment?.contact_requests?.name || 'Unbekannt'}</div>
                              <div className="text-xs text-muted-foreground">
                                Termin: {appointment ? format(new Date(appointment.scheduled_date), 'PPP', { locale: de }) : '-'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(reminder.reminder_date), 'PPP', { locale: de })}</TableCell>
                          <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                          <TableCell>
                            {reminder.sent_at ? format(new Date(reminder.sent_at), 'PPp', { locale: de }) : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Abgeschlossene Termine</span>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/appointments">Zur Terminübersicht</Link>
                </Button>
              </CardTitle>
              <CardDescription>Übersicht aller abgeschlossenen Termine</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Keine abgeschlossenen Termine vorhanden.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Termin</TableHead>
                      <TableHead>Verlängerung</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => {
                      const hasRenewal = renewalSettings.some(r => r.appointment_id === appointment.id);
                      const isDue = isRenewalDue(appointment);
                      return (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment.contact_requests?.name || 'Unbekannt'}</div>
                              <div className="text-xs text-muted-foreground">{appointment.contact_requests?.email || '-'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{appointment.contact_requests?.service_type || 'Unbekannt'}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{format(new Date(appointment.scheduled_date), 'PPP', { locale: de })}</div>
                              <div className="text-xs text-muted-foreground">{appointment.scheduled_time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {hasRenewal ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">Eingerichtet</span>
                              </div>
                            ) : isDue ? (
                              <div className="flex items-center gap-1 text-orange-600">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">Fällig</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendManualReminder(appointment)}
                                disabled={!appointment.contact_requests?.email}
                                title="Erinnerung senden"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              {!hasRenewal && appointment.contact_requests?.email && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setShowRenewalDialog(true);
                                  }}
                                  title="Verlängerung einrichten"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verlängerung bearbeiten</DialogTitle>
            <DialogDescription>Einstellungen für diese Verlängerung ändern</DialogDescription>
          </DialogHeader>
          <RenewalForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateRenewal}
            onCancel={() => { setShowEditDialog(false); setSelectedSetting(null); }}
            submitLabel="Speichern"
            hideAppointmentSelect
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate form component for reusability
interface RenewalFormProps {
  appointments?: Appointment[];
  selectedAppointment?: Appointment | null;
  setSelectedAppointment?: (a: Appointment | null) => void;
  formData: {
    renewal_type: string;
    frequency: string;
    advance_notice_days: number;
    max_renewals: number;
    is_active: boolean;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  hideAppointmentSelect?: boolean;
}

function RenewalForm({
  appointments,
  selectedAppointment,
  setSelectedAppointment,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel,
  hideAppointmentSelect
}: RenewalFormProps) {
  return (
    <div className="space-y-4">
      {!hideAppointmentSelect && appointments && setSelectedAppointment && (
        <div>
          <Label>Termin auswählen</Label>
          <Select
            value={selectedAppointment?.id || ''}
            onValueChange={(value) => {
              const apt = appointments.find(a => a.id === value);
              setSelectedAppointment(apt || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Termin auswählen..." />
            </SelectTrigger>
            <SelectContent>
              {appointments.map(apt => (
                <SelectItem key={apt.id} value={apt.id}>
                  <div>
                    <span className="font-medium">{apt.contact_requests?.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {format(new Date(apt.scheduled_date), 'dd.MM.yyyy', { locale: de })}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Typ</Label>
          <Select
            value={formData.renewal_type}
            onValueChange={(value) => setFormData({ ...formData, renewal_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reminder">Erinnerung</SelectItem>
              <SelectItem value="automatic">Automatisch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Häufigkeit</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
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
          <Label>Vorlaufzeit (Tage)</Label>
          <Input
            type="number"
            min="1"
            max="30"
            value={formData.advance_notice_days}
            onChange={(e) => setFormData({ ...formData, advance_notice_days: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <Label>Max. Verlängerungen</Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={formData.max_renewals}
            onChange={(e) => setFormData({ ...formData, max_renewals: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label>Aktiviert</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        <Button onClick={onSubmit}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
