import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit, 
  Mail, 
  Clock,
  User,
  Phone,
  Building,
  Send,
  Bell,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  contact_request_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  meeting_link?: string;
  consultant_notes?: string;
  status: string;
  created_at: string;
  duration_minutes: number;
}

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: string;
  message?: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contactRequests, setContactRequests] = useState<Map<string, ContactRequest>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [editData, setEditData] = useState({
    meeting_link: '',
    consultant_notes: '',
    duration_minutes: 60
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel('appointments-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [appointmentsRes, contactsRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('*')
          .order('scheduled_date', { ascending: true }),
        supabase
          .from('contact_requests')
          .select('*')
      ]);

      if (appointmentsRes.error) throw appointmentsRes.error;
      if (contactsRes.error) throw contactsRes.error;

      setAppointments(appointmentsRes.data || []);
      
      const contactMap = new Map<string, ContactRequest>();
      (contactsRes.data || []).forEach((contact: ContactRequest) => {
        contactMap.set(contact.id, contact);
      });
      setContactRequests(contactMap);
    } catch (error: any) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      await loadData();
      toast({
        title: "Termin aktualisiert",
        description: `Termin wurde als ${status} markiert.`,
      });

      // Send email notification if confirmed
      if (status === 'confirmed') {
        const appointment = appointments.find(a => a.id === id);
        if (appointment?.contact_request_id) {
          const contact = contactRequests.get(appointment.contact_request_id);
          if (contact) {
            await sendStatusEmail(appointment, contact, status);
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
      await loadData();
      
      toast({
        title: "Termin gelöscht",
        description: "Der Termin wurde erfolgreich gelöscht.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateAppointmentDetails = async () => {
    if (!selectedAppointment) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          meeting_link: editData.meeting_link,
          consultant_notes: editData.consultant_notes,
          duration_minutes: editData.duration_minutes
        })
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      setEditDialogOpen(false);
      setSelectedAppointment(null);
      await loadData();
      
      toast({
        title: "Termin aktualisiert",
        description: "Die Termindetails wurden gespeichert.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendStatusEmail = async (appointment: Appointment, contact: ContactRequest, status: string) => {
    try {
      const formattedDate = new Date(appointment.scheduled_date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const meetingTypeLabels: { [key: string]: string } = {
        online: 'Online Video-Call',
        phone: 'Telefonberatung',
        office: 'Vor Ort in unserem Büro',
        client: 'Vor Ort beim Kunden',
        video_call: 'Online Video-Call'
      };

      const statusLabels: { [key: string]: string } = {
        confirmed: 'bestätigt',
        cancelled: 'abgesagt',
        completed: 'abgeschlossen'
      };

      const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termin ${statusLabels[status] || status}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #8ec5fc; text-transform: uppercase; letter-spacing: 2px;">Terminaktualisierung</p>
            </td>
          </tr>
          
          <!-- Status Banner -->
          <tr>
            <td style="background: ${status === 'confirmed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : status === 'cancelled' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}; padding: 25px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">
                ${status === 'confirmed' ? '✓ Termin bestätigt' : status === 'cancelled' ? '✗ Termin abgesagt' : '✓ Termin abgeschlossen'}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 22px;">Hallo ${contact.name},</h2>
              
              <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                ${status === 'confirmed' 
                  ? 'Ihr Beratungstermin bei Unicum Tech wurde bestätigt. Wir freuen uns auf das Gespräch mit Ihnen!' 
                  : status === 'cancelled'
                  ? 'Leider mussten wir Ihren Termin absagen. Bitte kontaktieren Sie uns für einen neuen Termin.'
                  : 'Vielen Dank für das Gespräch! Wir hoffen, wir konnten Ihnen weiterhelfen.'}
              </p>
              
              <!-- Appointment Details Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 2px solid #4ecdc4; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="background: #4ecdc4; padding: 15px 20px;">
                    <p style="margin: 0; color: #1e3a5f; font-size: 16px; font-weight: 700;">📅 Termindetails</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 14px; width: 120px;">Datum:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Uhrzeit:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">${appointment.scheduled_time} Uhr</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Meeting-Art:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">${meetingTypeLabels[appointment.meeting_type] || appointment.meeting_type}</td>
                      </tr>
                      ${appointment.meeting_link ? `
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Meeting-Link:</td>
                        <td style="color: #1e3a5f; font-size: 15px;"><a href="${appointment.meeting_link}" style="color: #4ecdc4;">${appointment.meeting_link}</a></td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                <a href="https://unicumtech.de" style="color: #4ecdc4; text-decoration: none;">Website</a> | 
                <a href="https://unicumtech.de/kontakt" style="color: #4ecdc4; text-decoration: none;">Kontakt</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await supabase.functions.invoke('send-smtp-email', {
        body: {
          emailData: {
            to: contact.email,
            subject: `Termin ${statusLabels[status]} - ${formattedDate} um ${appointment.scheduled_time} Uhr`,
            html: htmlContent
          }
        }
      });

      toast({
        title: "E-Mail gesendet",
        description: `Statusmeldung wurde an ${contact.email} gesendet.`,
      });
    } catch (error: any) {
      console.error('Email error:', error);
      toast({
        title: "E-Mail-Versand fehlgeschlagen",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendReminderEmail = async () => {
    if (!selectedAppointment) return;

    setIsSending(true);
    try {
      let contact: ContactRequest | undefined;
      
      if (selectedAppointment.contact_request_id) {
        contact = contactRequests.get(selectedAppointment.contact_request_id);
      }

      if (!contact) {
        toast({
          title: "Fehler",
          description: "Keine Kontaktdaten für diesen Termin gefunden.",
          variant: "destructive"
        });
        return;
      }

      const formattedDate = new Date(selectedAppointment.scheduled_date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const meetingTypeLabels: { [key: string]: string } = {
        online: 'Online Video-Call',
        phone: 'Telefonberatung',
        office: 'Vor Ort in unserem Büro',
        client: 'Vor Ort beim Kunden',
        video_call: 'Online Video-Call'
      };

      const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminerinnerung - Unicum Tech</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #8ec5fc; text-transform: uppercase; letter-spacing: 2px;">Terminerinnerung</p>
            </td>
          </tr>
          
          <!-- Reminder Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 25px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">⏰ Erinnerung: Ihr Termin steht bevor!</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 22px;">Hallo ${contact.name},</h2>
              
              <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                Dies ist eine freundliche Erinnerung an Ihren bevorstehenden Beratungstermin bei Unicum Tech. Wir freuen uns auf das Gespräch mit Ihnen!
              </p>
              
              <!-- Appointment Details Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 2px solid #4ecdc4; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="background: #4ecdc4; padding: 15px 20px;">
                    <p style="margin: 0; color: #1e3a5f; font-size: 16px; font-weight: 700;">📅 Termindetails</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #64748b; font-size: 14px; width: 120px;">Datum:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Uhrzeit:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">${selectedAppointment.scheduled_time} Uhr</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Meeting-Art:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">${meetingTypeLabels[selectedAppointment.meeting_type] || selectedAppointment.meeting_type}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Dauer:</td>
                        <td style="color: #1e3a5f; font-size: 15px; font-weight: 600;">${selectedAppointment.duration_minutes} Minuten</td>
                      </tr>
                      ${selectedAppointment.meeting_link ? `
                      <tr>
                        <td style="color: #64748b; font-size: 14px;">Meeting-Link:</td>
                        <td style="color: #1e3a5f; font-size: 15px;"><a href="${selectedAppointment.meeting_link}" style="color: #4ecdc4;">${selectedAppointment.meeting_link}</a></td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              ${selectedAppointment.meeting_link ? `
              <p style="text-align: center; margin: 30px 0;">
                <a href="${selectedAppointment.meeting_link}" style="display: inline-block; background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Zum Meeting →</a>
              </p>
              ` : ''}
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #fef3c7; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0; color: #92400e; font-size: 15px;">
                      💡 <strong>Tipp:</strong> Bereiten Sie gerne Fragen zu Ihrem Projekt vor, damit wir das Beste aus unserem Gespräch herausholen können!
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                <a href="https://unicumtech.de" style="color: #4ecdc4; text-decoration: none;">Website</a> | 
                <a href="https://unicumtech.de/kontakt" style="color: #4ecdc4; text-decoration: none;">Kontakt</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await supabase.functions.invoke('send-smtp-email', {
        body: {
          emailData: {
            to: contact.email,
            subject: `⏰ Terminerinnerung: ${formattedDate} um ${selectedAppointment.scheduled_time} Uhr`,
            html: htmlContent
          }
        }
      });

      setReminderDialogOpen(false);
      setSelectedAppointment(null);
      
      toast({
        title: "Erinnerung gesendet",
        description: `Terminerinnerung wurde an ${contact.email} gesendet.`,
      });
    } catch (error: any) {
      console.error('Reminder email error:', error);
      toast({
        title: "Fehler beim Senden",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
      scheduled: "outline"
    };

    const labels: { [key: string]: string } = {
      pending: "Ausstehend",
      confirmed: "Bestätigt",
      completed: "Abgeschlossen",
      cancelled: "Abgebrochen",
      scheduled: "Geplant"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE');
  };

  const getMeetingTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      online: 'Online Video-Call',
      phone: 'Telefonisch',
      office: 'Vor Ort (Büro)',
      client: 'Vor Ort (Kunde)',
      video_call: 'Online Video-Call'
    };
    return labels[type] || type;
  };

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditData({
      meeting_link: appointment.meeting_link || '',
      consultant_notes: appointment.consultant_notes || '',
      duration_minutes: appointment.duration_minutes || 60
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const openDetailsDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  const openReminderDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReminderDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Lade Termine...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Termine</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle Termine und Beratungsgespräche ({appointments.length} gesamt)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
          const count = appointments.filter(a => a.status === status).length;
          const labels: { [key: string]: string } = {
            pending: 'Ausstehend',
            confirmed: 'Bestätigt',
            completed: 'Abgeschlossen',
            cancelled: 'Abgebrochen'
          };
          
          return (
            <Card key={status}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">{labels[status]}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Keine Termine vorhanden
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => {
            const contact = appointment.contact_request_id 
              ? contactRequests.get(appointment.contact_request_id) 
              : undefined;

            return (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {formatDate(appointment.scheduled_date)} um {appointment.scheduled_time}
                      </div>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                  {contact && (
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {contact.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </span>
                      )}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {getMeetingTypeLabel(appointment.meeting_type)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {appointment.duration_minutes} Minuten
                    </div>
                    {contact?.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {contact.company}
                      </div>
                    )}
                  </div>

                  {appointment.meeting_link && (
                    <div className="text-sm">
                      <span className="font-medium">Meeting-Link: </span>
                      <a href={appointment.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {appointment.meeting_link}
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {/* Status Actions */}
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Bestätigen
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Absagen
                        </Button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Abschließen
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReminderDialog(appointment)}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Erinnerung senden
                        </Button>
                      </>
                    )}

                    {/* Common Actions */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetailsDialog(appointment)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(appointment)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteDialog(appointment)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Termin bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Details dieses Termins
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_link">Meeting-Link</Label>
              <Input
                id="meeting_link"
                value={editData.meeting_link}
                onChange={(e) => setEditData({...editData, meeting_link: e.target.value})}
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Dauer (Minuten)</Label>
              <Input
                id="duration"
                type="number"
                value={editData.duration_minutes}
                onChange={(e) => setEditData({...editData, duration_minutes: parseInt(e.target.value) || 60})}
                min={15}
                step={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Interne Notizen</Label>
              <Textarea
                id="notes"
                value={editData.consultant_notes}
                onChange={(e) => setEditData({...editData, consultant_notes: e.target.value})}
                placeholder="Notizen zum Termin..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={updateAppointmentDetails}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Termindetails</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Datum:</span>
                  <p>{formatDate(selectedAppointment.scheduled_date)}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Uhrzeit:</span>
                  <p>{selectedAppointment.scheduled_time} Uhr</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Meeting-Art:</span>
                  <p>{getMeetingTypeLabel(selectedAppointment.meeting_type)}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Dauer:</span>
                  <p>{selectedAppointment.duration_minutes} Minuten</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <p>{getStatusBadge(selectedAppointment.status)}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Erstellt:</span>
                  <p>{formatDateTime(selectedAppointment.created_at)}</p>
                </div>
              </div>
              
              {selectedAppointment.meeting_link && (
                <div>
                  <span className="font-medium text-muted-foreground">Meeting-Link:</span>
                  <p className="break-all">
                    <a href={selectedAppointment.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {selectedAppointment.meeting_link}
                    </a>
                  </p>
                </div>
              )}
              
              {selectedAppointment.consultant_notes && (
                <div>
                  <span className="font-medium text-muted-foreground">Interne Notizen:</span>
                  <p className="mt-1 p-3 bg-muted rounded-md">{selectedAppointment.consultant_notes}</p>
                </div>
              )}

              {selectedAppointment.contact_request_id && contactRequests.get(selectedAppointment.contact_request_id) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Kontaktdaten</h4>
                  {(() => {
                    const contact = contactRequests.get(selectedAppointment.contact_request_id!);
                    return contact ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p>{contact.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">E-Mail:</span>
                          <p>{contact.email}</p>
                        </div>
                        {contact.phone && (
                          <div>
                            <span className="text-muted-foreground">Telefon:</span>
                            <p>{contact.phone}</p>
                          </div>
                        )}
                        {contact.company && (
                          <div>
                            <span className="text-muted-foreground">Firma:</span>
                            <p>{contact.company}</p>
                          </div>
                        )}
                        {contact.service_type && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Service:</span>
                            <p>{contact.service_type}</p>
                          </div>
                        )}
                        {contact.message && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Nachricht:</span>
                            <p className="mt-1 p-2 bg-muted rounded">{contact.message}</p>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Termin löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Termin wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              {selectedAppointment && (
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                  <strong>Termin:</strong> {formatDate(selectedAppointment.scheduled_date)} um {selectedAppointment.scheduled_time}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAppointment} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminerinnerung senden</DialogTitle>
            <DialogDescription>
              Senden Sie eine Erinnerungs-E-Mail an den Kunden
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">
                    {formatDate(selectedAppointment.scheduled_date)} um {selectedAppointment.scheduled_time}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getMeetingTypeLabel(selectedAppointment.meeting_type)}
                </div>
              </div>
              
              {selectedAppointment.contact_request_id && contactRequests.get(selectedAppointment.contact_request_id) && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>An: {contactRequests.get(selectedAppointment.contact_request_id)?.email}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={sendReminderEmail} disabled={isSending}>
              <Send className="h-4 w-4 mr-2" />
              {isSending ? 'Wird gesendet...' : 'Erinnerung senden'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
