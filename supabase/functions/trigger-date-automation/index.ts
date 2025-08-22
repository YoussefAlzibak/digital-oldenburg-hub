import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DateBasedTrigger {
  triggerDate?: string;
  subscriberIds?: string[];
  automationId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const triggerData: DateBasedTrigger = await req.json();
    
    console.log('Date-based automation triggered:', triggerData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // If no specific subscribers provided, get all active subscribers
    let subscriberIds = triggerData.subscriberIds || [];
    
    if (subscriberIds.length === 0) {
      const { data: activeSubscribers, error: subscribersError } = await supabase
        .from('email_subscribers')
        .select('id, email, first_name')
        .eq('status', 'active');

      if (subscribersError) {
        console.error('Error getting active subscribers:', subscribersError);
        throw subscribersError;
      }

      subscriberIds = activeSubscribers?.map(sub => sub.id) || [];
    }

    if (subscriberIds.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No active subscribers found for date-based automation' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Process automation for each subscriber
    let totalProcessed = 0;
    let errors = [];

    for (const subscriberId of subscriberIds) {
      try {
        // Get subscriber details
        const { data: subscriber, error: subError } = await supabase
          .from('email_subscribers')
          .select('*')
          .eq('id', subscriberId)
          .single();

        if (subError || !subscriber) {
          console.error(`Subscriber ${subscriberId} not found:`, subError);
          errors.push(`Subscriber ${subscriberId} not found`);
          continue;
        }

        // Trigger automation for this subscriber
        const { error: automationError } = await supabase.functions.invoke('process-automations', {
          body: {
            triggerType: 'date_based',
            subscriberEmail: subscriber.email,
            subscriberId: subscriber.id,
            triggerData: {
              first_name: subscriber.first_name,
              last_name: subscriber.last_name,
              email: subscriber.email,
              company: subscriber.company,
              phone: subscriber.phone,
              trigger_date: triggerData.triggerDate || new Date().toISOString(),
              automation_id: triggerData.automationId,
              company_name: 'Digital Masters'
            }
          }
        });

        if (automationError) {
          console.error(`Automation error for subscriber ${subscriberId}:`, automationError);
          errors.push(`Automation failed for ${subscriber.email}: ${automationError.message}`);
        } else {
          totalProcessed++;
          console.log(`Date-based automation processed for subscriber: ${subscriber.email}`);
        }

      } catch (error: any) {
        console.error(`Error processing subscriber ${subscriberId}:`, error);
        errors.push(`Error processing subscriber ${subscriberId}: ${error.message}`);
      }
    }

    console.log(`Date-based automation completed: ${totalProcessed} processed, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Date-based automation completed for ${totalProcessed} subscribers`,
        totalProcessed,
        totalSubscribers: subscriberIds.length,
        errors: errors.length > 0 ? errors : null
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in date-based automation trigger:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);