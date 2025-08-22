import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Analytics() {
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [requestsResponse, appointmentsResponse] = await Promise.all([
        supabase.from('contact_requests').select('*'),
        supabase.from('appointments').select('*')
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

  if (loading) {
    return <div className="flex justify-center p-8">Lade Analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Detaillierte Statistiken und Auswertungen Ihrer Geschäftsdaten
        </p>
      </div>

      {/* Analytics Cards */}
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
            <CardTitle className="text-lg">Service-Typen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(contactRequests.map(r => r.service_type))).map((serviceType) => {
                const count = contactRequests.filter(r => r.service_type === serviceType).length;
                const percentage = contactRequests.length > 0 ? (count / contactRequests.length) * 100 : 0;
                
                return (
                  <div key={serviceType} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{serviceType}</span>
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
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates</CardTitle>
          <CardDescription>Wie viele Anfragen werden zu Terminen?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{contactRequests.length}</div>
              <div className="text-sm text-muted-foreground">Anfragen gesamt</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{appointments.length}</div>
              <div className="text-sm text-muted-foreground">Termine gebucht</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {contactRequests.length > 0 
                  ? Math.round((appointments.length / contactRequests.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}