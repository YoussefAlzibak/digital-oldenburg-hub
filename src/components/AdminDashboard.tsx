import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Mail, Phone, MapPin, CheckCircle, XCircle, Eye } from 'lucide-react';
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
  contact_request_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [requestsResponse, appointmentsResponse] = await Promise.all([
        supabase
          .from('contact_requests')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('appointments')
          .select('*')
          .order('scheduled_date', { ascending: true })
      ]);

      if (requestsResponse.error) throw requestsResponse.error;
      if (appointmentsResponse.error) throw appointmentsResponse.error;

      setContactRequests(requestsResponse.data || []);
      setAppointments(appointmentsResponse.data || []);
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

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      await loadData();
      toast({
        title: "Status aktualisiert",
        description: `Anfrage wurde als ${status} markiert.`,
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
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

  if (loading) {
    return <div className="flex justify-center p-8">Lade Daten...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Verwaltung von Anfragen und Terminen</p>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">
            Beratungsanfragen ({contactRequests.length})
          </TabsTrigger>
          <TabsTrigger value="appointments">
            Termine ({appointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid gap-4">
            {contactRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.name}</CardTitle>
                      <CardDescription>
                        {request.company} • {request.service_type}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {request.email}
                    </div>
                    {request.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {request.phone}
                      </div>
                    )}
                    {request.preferred_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(request.preferred_date)} {request.preferred_time}
                      </div>
                    )}
                    <div className="text-muted-foreground">
                      Eingegangen: {formatDateTime(request.created_at)}
                    </div>
                  </div>
                  
                  {request.message && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{request.message}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    {request.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateRequestStatus(request.id, 'in_progress')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        In Bearbeitung
                      </Button>
                    )}
                    {request.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateRequestStatus(request.id, 'completed')}
                      >
                        Abschließen
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {formatDate(appointment.scheduled_date)} um {appointment.scheduled_time}
                      </div>
                    </CardTitle>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {appointment.meeting_type === 'online' ? 'Online Video-Call' :
                       appointment.meeting_type === 'phone' ? 'Telefonisch' :
                       appointment.meeting_type === 'office' ? 'Vor Ort (Büro)' :
                       'Vor Ort (Kunde)'}
                    </div>
                    <div className="text-muted-foreground">
                      Erstellt: {formatDateTime(appointment.created_at)}
                    </div>
                  </div>

                  <div className="flex gap-2">
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
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      >
                        Abschließen
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Anfrage Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedRequest(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Name:</label>
                  <p>{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="font-medium">E-Mail:</label>
                  <p>{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="font-medium">Telefon:</label>
                  <p>{selectedRequest.phone || 'Nicht angegeben'}</p>
                </div>
                <div>
                  <label className="font-medium">Unternehmen:</label>
                  <p>{selectedRequest.company || 'Nicht angegeben'}</p>
                </div>
                <div>
                  <label className="font-medium">Service:</label>
                  <p>{selectedRequest.service_type}</p>
                </div>
                <div>
                  <label className="font-medium">Status:</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>
              
              {selectedRequest.message && (
                <div>
                  <label className="font-medium">Nachricht:</label>
                  <p className="mt-1 p-3 bg-muted rounded">{selectedRequest.message}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) => {
                    updateRequestStatus(selectedRequest.id, value);
                    setSelectedRequest({ ...selectedRequest, status: value });
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                    <SelectItem value="cancelled">Abgebrochen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}