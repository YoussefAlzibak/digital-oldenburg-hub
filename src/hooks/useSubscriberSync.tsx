import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriberSyncResult {
  synced: number;
  errors: string[];
}

export function useSubscriberSync() {
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const syncNewSubscribers = async (): Promise<SubscriberSyncResult> => {
    setSyncing(true);
    const result: SubscriberSyncResult = { synced: 0, errors: [] };

    try {
      // Get the default email list
      const { data: defaultList, error: listError } = await supabase
        .from('email_lists')
        .select('id')
        .eq('name', 'Alle Newsletter-Abonnenten')
        .single();

      if (listError || !defaultList) {
        result.errors.push('Standard E-Mail-Liste nicht gefunden');
        return result;
      }

      // Get all active subscribers not in any list
      const { data: unlinkedSubscribers, error: subscriberError } = await supabase
        .from('email_subscribers')
        .select('id, email, first_name')
        .eq('status', 'active')
        .not('id', 'in', `(
          SELECT subscriber_id 
          FROM email_list_subscribers 
          WHERE list_id = '${defaultList.id}'
        )`);

      if (subscriberError) {
        result.errors.push(`Fehler beim Laden der Abonnenten: ${subscriberError.message}`);
        return result;
      }

      if (!unlinkedSubscribers || unlinkedSubscribers.length === 0) {
        return result; // No new subscribers to sync
      }

      // Add new subscribers to default list
      const listSubscriptions = unlinkedSubscribers.map(subscriber => ({
        list_id: defaultList.id,
        subscriber_id: subscriber.id
      }));

      const { error: insertError } = await supabase
        .from('email_list_subscribers')
        .insert(listSubscriptions);

      if (insertError) {
        result.errors.push(`Fehler beim Hinzufügen zur Liste: ${insertError.message}`);
        return result;
      }

      result.synced = unlinkedSubscribers.length;

      if (result.synced > 0) {
        toast({
          title: "Abonnenten synchronisiert",
          description: `${result.synced} neue Abonnenten zur Marketing-Liste hinzugefügt.`,
        });
      }

    } catch (error: any) {
      result.errors.push(`Unerwarteter Fehler: ${error.message}`);
    } finally {
      setSyncing(false);
    }

    return result;
  };

  // Auto-sync when component mounts and periodically
  useEffect(() => {
    const performAutoSync = async () => {
      const result = await syncNewSubscribers();
      if (result.errors.length > 0) {
        console.error('Auto-sync errors:', result.errors);
      }
    };

    // Sync immediately
    performAutoSync();

    // Set up periodic sync every 5 minutes
    const interval = setInterval(performAutoSync, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    syncing,
    syncNewSubscribers
  };
}