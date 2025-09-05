import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle, Users, CalendarDays, Mail, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  service_type: string;
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

export default function Overview() {
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalAppointments: 0,
    pendingRequests: 0,
    confirmedAppointments: 0,
    totalSubscribers: 0,
    activeCampaigns: 0
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [requestsResponse, appointmentsResponse, subscribersResponse, campaignsResponse] = await Promise.all([
        supabase
          .from('contact_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('appointments')
          .select('*')
          .order('scheduled_date', { ascending: true })
          .limit(5),
        supabase
          .from('email_subscribers')
          .select('id')
          .eq('status', 'active'),
        supabase
          .from('email_campaigns')
          .select('id, status')
          .in('status', ['sending', 'scheduled'])
      ]);

      if (requestsResponse.error) throw requestsResponse.error;
      if (appointmentsResponse.error) throw appointmentsResponse.error;

      const requests = requestsResponse.data || [];
      const appointments = appointmentsResponse.data || [];
      
      setContactRequests(requests);
      setAppointments(appointments);

      // Calculate stats
      const [allRequestsResponse, allAppointmentsResponse] = await Promise.all([
        supabase.from('contact_requests').select('id, status'),
        supabase.from('appointments').select('id, status')
      ]);

      const allRequests = allRequestsResponse.data || [];
      const allAppointments = allAppointmentsResponse.data || [];
      
      setStats({
        totalRequests: allRequests.length,
        totalAppointments: allAppointments.length,
        pendingRequests: allRequests.filter(r => r.status === 'pending').length,
        confirmedAppointments: allAppointments.filter(a => a.status === 'confirmed').length,
        totalSubscribers: subscribersResponse.data?.length || 0,
        activeCampaigns: campaignsResponse.data?.length || 0
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
    return <div className="flex justify-center p-8">Lade Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Übersicht</h1>
        <p className="text-muted-foreground">Willkommen im Admin Panel - hier ist ein Überblick über Ihre wichtigsten Daten</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/requests')}>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-primary">{stats.totalRequests}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Anfragen gesamt</div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/requests')}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
            <div className="text-sm text-muted-foreground">Ausstehend</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/appointments')}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</div>
            <div className="text-sm text-muted-foreground">Termine gesamt</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/appointments')}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedAppointments}</div>
            <div className="text-sm text-muted-foreground">Bestätigt</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/subscribers')}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalSubscribers}</div>
            <div className="text-sm text-muted-foreground">Abonnenten</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/email-marketing')}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-600">{stats.activeCampaigns}</div>
            <div className="text-sm text-muted-foreground">Aktive Kampagnen</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Neueste Anfragen</CardTitle>
              <CardDescription>Die letzten 5 Kontaktanfragen</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/requests')}>
              Alle anzeigen
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{request.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {request.company} • {request.service_type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDateTime(request.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(request.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Anstehende Termine</CardTitle>
              <CardDescription>Die nächsten 5 Termine</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/appointments')}>
              Alle anzeigen
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">
                    {formatDate(appointment.scheduled_date)} um {appointment.scheduled_time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {appointment.meeting_type === 'online' ? 'Online Video-Call' :
                     appointment.meeting_type === 'phone' ? 'Telefonisch' :
                     appointment.meeting_type === 'office' ? 'Vor Ort (Büro)' :
                     'Vor Ort (Kunde)'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Erstellt: {formatDateTime(appointment.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}