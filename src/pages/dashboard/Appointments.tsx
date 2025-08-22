import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  contact_request_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  status: string;
  created_at: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    // Set up real-time subscription
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
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
    </div>
  );
}