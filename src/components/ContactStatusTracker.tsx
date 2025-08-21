import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Clock, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  status: string;
  created_at: string;
}

interface Appointment {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  status: string;
  created_at: string;
}

export default function ContactStatusTracker() {
  const [searchEmail, setSearchEmail] = useState('');
  const [contactRequest, setContactRequest] = useState<ContactRequest | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchEmail) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const { data: requests, error: requestError } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('email', searchEmail)
        .order('created_at', { ascending: false });

      if (requestError) throw requestError;

      if (requests && requests.length > 0) {
        setContactRequest(requests[0]); // Most recent request

        // Find appointments for this request
        const { data: appointmentData, error: appointmentError } = await supabase
          .from('appointments')
          .select('*')
          .eq('contact_request_id', requests[0].id)
          .order('scheduled_date', { ascending: true });

        if (appointmentError) throw appointmentError;
        setAppointments(appointmentData || []);
      } else {
        setContactRequest(null);
        setAppointments([]);
      }
    } catch (error: any) {
      toast({
        title: "Fehler beim Suchen",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      pending: "outline",
      in_progress: "secondary",
      completed: "default",
      cancelled: "destructive",
      confirmed: "default",
      scheduled: "outline"
    };

    const labels: { [key: string]: string } = {
      pending: "Ausstehend",
      in_progress: "In Bearbeitung", 
      completed: "Abgeschlossen",
      cancelled: "Abgebrochen",
      confirmed: "Bestätigt",
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
      client: 'Vor Ort (Kunde)'
    };
    return labels[type] || type;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Status Ihrer Anfrage
          </CardTitle>
          <CardDescription>
            Verfolgen Sie den Status Ihrer Beratungsanfrage und Termine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ihre E-Mail-Adresse eingeben..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Suche...' : 'Suchen'}
            </Button>
          </div>

          {searched && !contactRequest && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Anfrage mit dieser E-Mail-Adresse gefunden.</p>
              <p className="text-sm">Überprüfen Sie die E-Mail-Adresse oder erstellen Sie eine neue Anfrage.</p>
            </div>
          )}

          {contactRequest && (
            <div className="space-y-4 animate-fade-in">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Ihre Beratungsanfrage</CardTitle>
                      <CardDescription>
                        Eingegangen am {formatDateTime(contactRequest.created_at)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(contactRequest.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {contactRequest.email}
                    </div>
                    {contactRequest.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {contactRequest.phone}
                      </div>
                    )}
                    <div>
                      <strong>Service:</strong> {contactRequest.service_type}
                    </div>
                    {contactRequest.company && (
                      <div>
                        <strong>Unternehmen:</strong> {contactRequest.company}
                      </div>
                    )}
                  </div>

                  {contactRequest.preferred_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <strong>Wunschtermin:</strong> {formatDate(contactRequest.preferred_date)}
                      {contactRequest.preferred_time && ` um ${contactRequest.preferred_time}`}
                    </div>
                  )}

                  {contactRequest.message && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm"><strong>Ihre Nachricht:</strong></p>
                      <p className="text-sm mt-1">{contactRequest.message}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="text-sm">
                      <strong>Status-Update:</strong>
                      <div className="mt-1">
                        {contactRequest.status === 'pending' && (
                          <p className="text-orange-600">
                            Ihre Anfrage wurde empfangen und wird bearbeitet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                          </p>
                        )}
                        {contactRequest.status === 'in_progress' && (
                          <p className="text-blue-600">
                            Ihre Anfrage wird derzeit bearbeitet. Sie erhalten in Kürze eine Rückmeldung von unserem Team.
                          </p>
                        )}
                        {contactRequest.status === 'completed' && (
                          <p className="text-green-600">
                            Ihre Anfrage wurde erfolgreich bearbeitet. Vielen Dank für Ihr Vertrauen!
                          </p>
                        )}
                        {contactRequest.status === 'cancelled' && (
                          <p className="text-red-600">
                            Diese Anfrage wurde storniert. Bei Fragen kontaktieren Sie uns gerne.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {appointments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ihre Termine</CardTitle>
                    <CardDescription>
                      Übersicht Ihrer gebuchten Beratungstermine
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <strong>
                              {formatDate(appointment.scheduled_date)} um {appointment.scheduled_time}
                            </strong>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{getMeetingTypeLabel(appointment.meeting_type)}</p>
                          <p>Erstellt: {formatDateTime(appointment.created_at)}</p>
                        </div>
                        
                        <div className="mt-2 text-sm">
                          {appointment.status === 'pending' && (
                            <p className="text-orange-600">
                              Ihr Terminwunsch wird geprüft. Sie erhalten eine Bestätigung per E-Mail.
                            </p>
                          )}
                          {appointment.status === 'confirmed' && (
                            <p className="text-green-600">
                              Ihr Termin ist bestätigt! Sie erhalten rechtzeitig die Zugangsdaten.
                            </p>
                          )}
                          {appointment.status === 'completed' && (
                            <p className="text-blue-600">
                              Dieser Termin wurde erfolgreich durchgeführt.
                            </p>
                          )}
                          {appointment.status === 'cancelled' && (
                            <p className="text-red-600">
                              Dieser Termin wurde abgesagt. Buchen Sie gerne einen neuen Termin.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}