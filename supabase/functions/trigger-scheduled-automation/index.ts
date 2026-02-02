import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduledTrigger {
  automationId?: string;
  subscriberIds?: string[];
  filterTags?: string[];
  filterSource?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const triggerData: ScheduledTrigger = await req.json();
    
    console.log('Scheduled automation triggered:', triggerData);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get active automations with trigger_type 'scheduled'
    let automationsQuery = supabase
      .from('email_automations')
      .select('id, name, trigger_config')
      .eq('trigger_type', 'scheduled')
      .eq('is_active', true);

    if (triggerData.automationId) {
      automationsQuery = automationsQuery.eq('id', triggerData.automationId);
    }

    const { data: automations, error: automationsError } = await automationsQuery;

    if (automationsError) throw automationsError;

    if (!automations || automations.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No scheduled automations found or all are inactive',
          processed: 0
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    let totalProcessed = 0;
    let errors: string[] = [];

    for (const automation of automations) {
      // Build subscriber query based on filters
      let subscribersQuery = supabase
        .from('email_subscribers')
        .select('id, email, first_name, last_name, company, phone, tags, source')
        .eq('status', 'active');

      // Apply specific subscriber filter if provided
      if (triggerData.subscriberIds && triggerData.subscriberIds.length > 0) {
        subscribersQuery = subscribersQuery.in('id', triggerData.subscriberIds);
      }

      // Apply tag filter if provided
      if (triggerData.filterTags && triggerData.filterTags.length > 0) {
        subscribersQuery = subscribersQuery.overlaps('tags', triggerData.filterTags);
      }

      // Apply source filter if provided
      if (triggerData.filterSource) {
        subscribersQuery = subscribersQuery.eq('source', triggerData.filterSource);
      }

      // Check automation trigger_config for additional filters
      const triggerConfig = automation.trigger_config as Record<string, any> | null;
      if (triggerConfig) {
        if (triggerConfig.filter_tags && Array.isArray(triggerConfig.filter_tags)) {
          subscribersQuery = subscribersQuery.overlaps('tags', triggerConfig.filter_tags);
        }
        if (triggerConfig.filter_source) {
          subscribersQuery = subscribersQuery.eq('source', triggerConfig.filter_source);
        }
      }

      const { data: subscribers, error: subscribersError } = await subscribersQuery;

      if (subscribersError) {
        console.error(`Error getting subscribers for ${automation.name}:`, subscribersError);
        errors.push(`Failed to get subscribers for ${automation.name}`);
        continue;
      }

      if (!subscribers || subscribers.length === 0) {
        console.log(`No matching subscribers for automation: ${automation.name}`);
        continue;
      }

      console.log(`Processing ${subscribers.length} subscribers for automation: ${automation.name}`);

      // Process each subscriber
      for (const subscriber of subscribers) {
        try {
          const { error: workflowError } = await supabase.functions.invoke('process-workflow-actions', {
            body: {
              triggerType: 'scheduled',
              subscriberEmail: subscriber.email,
              subscriberId: subscriber.id,
              triggerData: {
                first_name: subscriber.first_name || '',
                last_name: subscriber.last_name || '',
                email: subscriber.email,
                company: subscriber.company || '',
                phone: subscriber.phone || '',
                scheduled_date: new Date().toISOString(),
                automation_name: automation.name,
                company_name: 'Unicum Tech'
              }
            }
          });

          if (workflowError) {
            console.error(`Workflow error for ${subscriber.email}:`, workflowError);
            errors.push(`Failed for ${subscriber.email}: ${workflowError.message}`);
          } else {
            totalProcessed++;
          }
        } catch (error: any) {
          console.error(`Error processing ${subscriber.email}:`, error);
          errors.push(`Error for ${subscriber.email}: ${error.message}`);
        }
      }
    }

    console.log(`Scheduled automation complete: ${totalProcessed} processed, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Scheduled automation processed ${totalProcessed} subscribers`,
        totalProcessed,
        automationsTriggered: automations.length,
        errors: errors.length > 0 ? errors : null
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in scheduled automation trigger:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
