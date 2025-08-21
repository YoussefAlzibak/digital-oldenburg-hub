import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Mail, Phone, MapPin, CheckCircle, XCircle, Eye, BarChart3, Users, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AppointmentCalendar from './AppointmentCalendar';
import SMTPSettings from './SMTPSettings';

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
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalAppointments: 0,
    pendingRequests: 0,
    confirmedAppointments: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    // Set up real-time subscription
    const channel = supabase
      .channel('admin-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_requests'
        },
        () => {
          console.log('Contact request updated, reloading data...');
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'appointments'
        },
        () => {
          console.log('Appointment updated, reloading data...');
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

      // Calculate stats
      const requests = requestsResponse.data || [];
      const appointments = appointmentsResponse.data || [];
      
      setStats({
        totalRequests: requests.length,
        totalAppointments: appointments.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length
      });
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
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalRequests}</div>
              <div className="text-sm text-muted-foreground">Anfragen gesamt</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
              <div className="text-sm text-muted-foreground">Ausstehend</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</div>
              <div className="text-sm text-muted-foreground">Termine gesamt</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.confirmedAppointments}</div>
              <div className="text-sm text-muted-foreground">Bestätigt</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="requests">
            <Users className="h-4 w-4 mr-2" />
            Anfragen ({contactRequests.length})
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Termine ({appointments.length})
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Kalender
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="email-settings">
            <Settings className="h-4 w-4 mr-2" />
            E-Mail
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

        <TabsContent value="calendar" className="space-y-4">
          <AppointmentCalendar />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anfragen nach Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['pending', 'in_progress', 'completed', 'cancelled'].map((status) => {
                    const count = contactRequests.filter(r => r.status === status).length;
                    const percentage = contactRequests.length > 0 ? (count / contactRequests.length) * 100 : 0;
                    const labels: { [key: string]: string } = {
                      pending: 'Ausstehend',
                      in_progress: 'In Bearbeitung',
                      completed: 'Abgeschlossen',
                      cancelled: 'Abgebrochen'
                    };
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm">{labels[status]}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Termine nach Typ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['online', 'phone', 'office', 'client'].map((type) => {
                    const count = appointments.filter(a => a.meeting_type === type).length;
                    const percentage = appointments.length > 0 ? (count / appointments.length) * 100 : 0;
                    const labels: { [key: string]: string } = {
                      online: 'Online',
                      phone: 'Telefon',
                      office: 'Büro',
                      client: 'Kunde'
                    };
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{labels[type]}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service-Anfragen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    const services = contactRequests.reduce((acc: { [key: string]: number }, req) => {
                      acc[req.service_type] = (acc[req.service_type] || 0) + 1;
                      return acc;
                    }, {});
                    
                    return Object.entries(services).map(([service, count]) => {
                      const percentage = contactRequests.length > 0 ? (count / contactRequests.length) * 100 : 0;
                      
                      return (
                        <div key={service} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{service}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email-settings" className="space-y-4">
          <SMTPSettings />
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