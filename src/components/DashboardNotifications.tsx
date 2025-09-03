import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_url?: string;
  action_label?: string;
}

interface DashboardStats {
  pendingRequests: number;
  upcomingAppointments: number;
  overdueRenewals: number;
  failedEmails: number;
}

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    pendingRequests: 0,
    upcomingAppointments: 0,
    overdueRenewals: 0,
    failedEmails: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('dashboard-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_requests' }, loadDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, loadDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'renewal_reminders' }, loadDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const [requestsResponse, appointmentsResponse, renewalsResponse, emailsResponse] = await Promise.all([
        // Pending contact requests
        supabase
          .from('contact_requests')
          .select('id')
          .eq('status', 'pending'),
        
        // Upcoming appointments (next 3 days)
        supabase
          .from('appointments')
          .select('id')
          .eq('status', 'confirmed')
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .lte('scheduled_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        
        // Overdue renewal reminders
        supabase
          .from('renewal_reminders')
          .select('id')
          .eq('status', 'pending')
          .lt('reminder_date', new Date().toISOString().split('T')[0]),
        
        // Failed email queue items
        supabase
          .from('email_queue')
          .select('id')
          .eq('status', 'failed')
      ]);

      const newStats: DashboardStats = {
        pendingRequests: requestsResponse.data?.length || 0,
        upcomingAppointments: appointmentsResponse.data?.length || 0,
        overdueRenewals: renewalsResponse.data?.length || 0,
        failedEmails: emailsResponse.data?.length || 0
      };

      setStats(newStats);
      generateNotifications(newStats);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const generateNotifications = (currentStats: DashboardStats) => {
    const newNotifications: Notification[] = [];

    if (currentStats.pendingRequests > 0) {
      newNotifications.push({
        id: 'pending-requests',
        type: 'info',
        title: 'Neue Anfragen',
        message: `Sie haben ${currentStats.pendingRequests} unbearbeitete Kontaktanfragen`,
        created_at: new Date().toISOString(),
        read: false,
        action_url: '/admin/requests',
        action_label: 'Anfragen ansehen'
      });
    }

    if (currentStats.upcomingAppointments > 0) {
      newNotifications.push({
        id: 'upcoming-appointments',
        type: 'warning',
        title: 'Anstehende Termine',
        message: `${currentStats.upcomingAppointments} Termine in den nächsten 3 Tagen`,
        created_at: new Date().toISOString(),
        read: false,
        action_url: '/admin/appointments',
        action_label: 'Termine ansehen'
      });
    }

    if (currentStats.overdueRenewals > 0) {
      newNotifications.push({
        id: 'overdue-renewals',
        type: 'error',
        title: 'Überfällige Verlängerungen',
        message: `${currentStats.overdueRenewals} Verlängerungserinnerungen sind überfällig`,
        created_at: new Date().toISOString(),
        read: false,
        action_url: '/admin/renewals',
        action_label: 'Verlängerungen bearbeiten'
      });
    }

    if (currentStats.failedEmails > 0) {
      newNotifications.push({
        id: 'failed-emails',
        type: 'error',
        title: 'E-Mail Fehler',
        message: `${currentStats.failedEmails} E-Mails konnten nicht versendet werden`,
        created_at: new Date().toISOString(),
        read: false,
        action_url: '/admin/email-marketing',
        action_label: 'E-Mail Queue prüfen'
      });
    }

    setNotifications(newNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUrgentNotifications = notifications.some(n => n.type === 'error' && !n.read);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className={cn("h-4 w-4", hasUrgentNotifications && "text-red-500")} />
        {unreadCount > 0 && (
          <Badge 
            variant={hasUrgentNotifications ? "destructive" : "default"} 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg border">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Benachrichtigungen</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Keine Benachrichtigungen
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-l-4 hover:bg-gray-50 cursor-pointer",
                      getNotificationColor(notification.type),
                      !notification.read && "font-medium"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </div>
                        {notification.action_label && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto mt-2 text-xs"
                            onClick={() => {
                              if (notification.action_url) {
                                window.location.href = notification.action_url;
                              }
                            }}
                          >
                            {notification.action_label}
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(notification.created_at).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setNotifications(notifications.map(n => ({ ...n, read: true })));
                    toast({
                      title: "Benachrichtigungen markiert",
                      description: "Alle Benachrichtigungen wurden als gelesen markiert."
                    });
                  }}
                >
                  Alle als gelesen markieren
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}