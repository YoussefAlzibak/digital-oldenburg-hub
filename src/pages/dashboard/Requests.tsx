import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, Eye, CheckCircle, Trash2, CalendarCheck, Link as LinkIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Appointment {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  meeting_type: string;
}

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
  appointments?: Appointment[];
}

export default function Requests() {
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    // Set up real-time subscription
    const channel = supabase
      .channel('contact-requests-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_requests'
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
      
      // Load contact requests with linked appointments
      const { data, error } = await supabase
        .from('contact_requests')
        .select(`
          *,
          appointments (
            id,
            scheduled_date,
            scheduled_time,
            status,
            meeting_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactRequests(data || []);
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

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadData();
      toast({
        title: "Anfrage gelöscht",
        description: "Die Kontaktanfrage wurde erfolgreich gelöscht.",
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
      cancelled: "destructive"
    };

    const labels: { [key: string]: string } = {
      pending: "Ausstehend",
      in_progress: "In Bearbeitung",
      completed: "Abgeschlossen",
      cancelled: "Abgebrochen"
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
    return <div className="flex justify-center p-8">Lade Anfragen...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Kontaktanfragen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle eingehenden Kontaktanfragen ({contactRequests.length} gesamt)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'in_progress', 'completed', 'cancelled'].map((status) => {
          const count = contactRequests.filter(r => r.status === status).length;
          const labels: { [key: string]: string } = {
            pending: 'Ausstehend',
            in_progress: 'In Bearbeitung',
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

      {/* Requests List */}
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
                    Wunschtermin: {formatDate(request.preferred_date)} {request.preferred_time}
                  </div>
                )}
                {request.appointments && request.appointments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    <span className="text-primary font-medium">
                      Termin: {formatDate(request.appointments[0].scheduled_date)} {request.appointments[0].scheduled_time}
                    </span>
                    <Badge variant="outline" className="ml-1">
                      {request.appointments[0].status === 'scheduled' ? 'Bestätigt' : 
                       request.appointments[0].status === 'pending' ? 'Ausstehend' : 
                       request.appointments[0].status}
                    </Badge>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Löschen
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Anfrage löschen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Die Kontaktanfrage von {request.name} wird dauerhaft gelöscht.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteRequest(request.id)}>
                        Löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}