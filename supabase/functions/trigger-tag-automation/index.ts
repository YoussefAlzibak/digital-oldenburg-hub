import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TagTrigger {
  subscriberId: string;
  subscriberEmail: string;
  tagName: string;
  action: 'added' | 'removed';
  allTags?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const tagData: TagTrigger = await req.json();
    
    console.log('Tag automation triggered:', tagData);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Determine trigger type based on action
    const triggerType = tagData.action === 'added' ? 'tag_added' : 'tag_removed';

    // Get subscriber details
    const { data: subscriber, error: subError } = await supabase
      .from('email_subscribers')
      .select('*')
      .eq('id', tagData.subscriberId)
      .single();

    if (subError || !subscriber) {
      console.error('Subscriber not found:', subError);
      return new Response(
        JSON.stringify({ error: 'Subscriber not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get automations that match this trigger type and optionally the specific tag
    const { data: automations, error: automationsError } = await supabase
      .from('email_automations')
      .select('id, name, trigger_config')
      .eq('trigger_type', triggerType)
      .eq('is_active', true);

    if (automationsError) throw automationsError;

    if (!automations || automations.length === 0) {
      console.log(`No active automations for trigger: ${triggerType}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `No active automations for ${triggerType}`,
          triggered: 0
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    let triggeredCount = 0;
    let errors: string[] = [];

    for (const automation of automations) {
      // Check if automation is configured for a specific tag
      const triggerConfig = automation.trigger_config as Record<string, any> | null;
      
      if (triggerConfig?.tag_name) {
        // Only trigger if the changed tag matches the configured tag
        if (triggerConfig.tag_name !== tagData.tagName) {
          console.log(`Skipping automation ${automation.name}: tag ${tagData.tagName} doesn't match ${triggerConfig.tag_name}`);
          continue;
        }
      }

      console.log(`Triggering automation: ${automation.name} for tag ${tagData.action}: ${tagData.tagName}`);

      try {
        const { error: workflowError } = await supabase.functions.invoke('process-workflow-actions', {
          body: {
            triggerType: triggerType,
            subscriberEmail: subscriber.email,
            subscriberId: subscriber.id,
            triggerData: {
              first_name: subscriber.first_name || '',
              last_name: subscriber.last_name || '',
              email: subscriber.email,
              company: subscriber.company || '',
              phone: subscriber.phone || '',
              tag_name: tagData.tagName,
              tag_action: tagData.action,
              all_tags: tagData.allTags || subscriber.tags || [],
              company_name: 'Unicum Tech'
            }
          }
        });

        if (workflowError) {
          console.error(`Workflow error for automation ${automation.name}:`, workflowError);
          errors.push(`Failed automation ${automation.name}: ${workflowError.message}`);
        } else {
          triggeredCount++;
        }
      } catch (error: any) {
        console.error(`Error triggering automation ${automation.name}:`, error);
        errors.push(`Error in ${automation.name}: ${error.message}`);
      }
    }

    // Log event
    await supabase.from('email_events').insert({
      subscriber_id: subscriber.id,
      event_type: `tag_${tagData.action}`,
      event_data: {
        tag_name: tagData.tagName,
        automations_triggered: triggeredCount
      }
    });

    console.log(`Tag automation complete: ${triggeredCount} automations triggered`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Tag ${tagData.action} triggered ${triggeredCount} automations`,
        triggeredCount,
        tagName: tagData.tagName,
        errors: errors.length > 0 ? errors : null
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in tag automation trigger:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
