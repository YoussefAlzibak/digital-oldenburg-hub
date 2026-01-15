import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  ArrowRightLeft,
  Loader2,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface SyncLogEntry {
  id: string;
  appointment_id: string | null;
  sync_type: string;
  status: string;
  google_event_id: string | null;
  error_message: string | null;
  sync_data: unknown;
  created_at: string;
}

interface ConflictingAppointment {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  sync_conflict: boolean;
  sync_error: string | null;
  contact_requests: {
    name: string;
    email: string;
  } | null;
}

export default function GoogleCalendarSyncStatus() {
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [conflicts, setConflicts] = useState<ConflictingAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSyncData();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const { data } = await supabase
      .from('google_oauth_tokens')
      .select('id, expires_at')
      .limit(1)
      .single();
    
    setIsConnected(!!data);
  };

  const loadSyncData = async () => {
    setIsLoading(true);
    try {
      // Load recent sync logs
      const { data: logs, error: logsError } = await supabase
        .from('google_calendar_sync_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (logsError) throw logsError;
      setSyncLogs(logs || []);

      // Load conflicting appointments
      const { data: conflictData, error: conflictError } = await supabase
        .from('appointments')
        .select(`
          id,
          scheduled_date,
          scheduled_time,
          meeting_type,
          sync_conflict,
          sync_error,
          contact_requests (
            name,
            email
          )
        `)
        .eq('sync_conflict', true)
        .order('scheduled_date', { ascending: true });

      if (conflictError) throw conflictError;
      setConflicts(conflictData || []);

    } catch (error) {
      console.error('Error loading sync data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-google-to-appointments', {
        body: { full_sync: false }
      });

      if (error) throw error;

      toast({
        title: 'Synchronisation erfolgreich',
        description: `${data.events_processed || 0} Events verarbeitet, ${data.created || 0} erstellt, ${data.updated || 0} aktualisiert`,
      });

      await loadSyncData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      toast({
        title: 'Synchronisation fehlgeschlagen',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const resolveConflict = async (appointmentId: string, resolution: 'keep_local' | 'keep_google') => {
    try {
      if (resolution === 'keep_local') {
        // Push local changes to Google
        await supabase.functions.invoke('sync-appointment-to-google', {
          body: { appointment_id: appointmentId, action: 'update' }
        });
      }

      // Clear conflict flag
      await supabase
        .from('appointments')
        .update({ sync_conflict: false, sync_error: null })
        .eq('id', appointmentId);

      toast({
        title: 'Konflikt gelöst',
        description: resolution === 'keep_local' 
          ? 'Lokale Änderungen wurden übernommen' 
          : 'Google Calendar Änderungen wurden übernommen',
      });

      await loadSyncData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      toast({
        title: 'Fehler beim Lösen des Konflikts',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Erfolgreich</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Fehler</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="bg-yellow-500 text-white"><AlertTriangle className="h-3 w-3 mr-1" /> Teilweise</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSyncTypeBadge = (type: string) => {
    switch (type) {
      case 'push':
        return <Badge variant="outline"><ArrowRightLeft className="h-3 w-3 mr-1" /> Push</Badge>;
      case 'pull':
        return <Badge variant="outline"><ArrowRightLeft className="h-3 w-3 mr-1" /> Pull</Badge>;
      case 'webhook':
        return <Badge variant="outline"><RefreshCw className="h-3 w-3 mr-1" /> Webhook</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (!isConnected) {
    return (
      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertTitle>Google Calendar nicht verbunden</AlertTitle>
        <AlertDescription>
          Verbinden Sie Google Calendar in den Einstellungen, um Synchronisation zu aktivieren.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Synchronisationskonflikte ({conflicts.length})</AlertTitle>
          <AlertDescription>
            Es gibt Termine mit Konflikten zwischen lokalem System und Google Calendar.
          </AlertDescription>
        </Alert>
      )}

      {/* Sync Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Synchronisation
              </CardTitle>
              <CardDescription>
                Bidirektionale Synchronisation mit Google Calendar
              </CardDescription>
            </div>
            <Button 
              onClick={triggerManualSync} 
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Synchronisiere...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Jetzt synchronisieren
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Konflikte lösen
            </CardTitle>
            <CardDescription>
              Diese Termine haben widersprüchliche Änderungen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {conflict.contact_requests?.name || 'Unbekannter Kunde'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(conflict.scheduled_date), 'EEEE, dd. MMMM yyyy', { locale: de })} um {conflict.scheduled_time}
                    </p>
                    {conflict.sync_error && (
                      <p className="text-sm text-destructive mt-1">{conflict.sync_error}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => resolveConflict(conflict.id, 'keep_google')}
                    >
                      Google behalten
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => resolveConflict(conflict.id, 'keep_local')}
                    >
                      Lokal behalten
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sync-Protokoll
          </CardTitle>
          <CardDescription>
            Letzte Synchronisationsvorgänge
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : syncLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keine Synchronisationsvorgänge vorhanden
            </p>
          ) : (
            <div className="space-y-2">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getSyncTypeBadge(log.sync_type)}
                    {getStatusBadge(log.status)}
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(log.created_at), 'dd.MM.yyyy HH:mm:ss', { locale: de })}
                    </span>
                  </div>
                  {log.error_message && (
                    <span className="text-sm text-destructive max-w-xs truncate">
                      {log.error_message}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
