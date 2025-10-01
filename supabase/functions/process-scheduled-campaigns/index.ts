import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing scheduled campaigns...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get campaigns that should be sent now
    const now = new Date().toISOString();
    const { data: campaigns, error: campaignsError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now);

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      throw campaignsError;
    }

    if (!campaigns || campaigns.length === 0) {
      console.log('No scheduled campaigns to process');
      return new Response(
        JSON.stringify({ success: true, message: 'No scheduled campaigns to process', processed: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Found ${campaigns.length} campaigns to process`);

    let processedCount = 0;
    let errorCount = 0;

    // Process each campaign
    for (const campaign of campaigns) {
      try {
        console.log(`Processing campaign: ${campaign.name} (${campaign.id})`);

        // Update campaign status to sending
        await supabase
          .from('email_campaigns')
          .update({ status: 'sending' })
          .eq('id', campaign.id);

        // Get queued emails for this campaign
        const { data: queuedEmails, error: queueError } = await supabase
          .from('email_queue')
          .select('id')
          .eq('campaign_id', campaign.id)
          .eq('status', 'pending');

        if (queueError) {
          console.error(`Error checking queue for campaign ${campaign.id}:`, queueError);
          throw queueError;
        }

        // If emails are already queued, update their scheduled time to now
        if (queuedEmails && queuedEmails.length > 0) {
          console.log(`Updating ${queuedEmails.length} queued emails to send now`);
          
          const { error: updateError } = await supabase
            .from('email_queue')
            .update({ scheduled_at: new Date().toISOString() })
            .eq('campaign_id', campaign.id)
            .eq('status', 'pending');

          if (updateError) {
            console.error(`Error updating queue for campaign ${campaign.id}:`, updateError);
            throw updateError;
          }

          // Trigger immediate processing
          const { error: processError } = await supabase.functions.invoke('process-email-queue', {
            body: { immediate: true, batchSize: 100 }
          });

          if (processError) {
            console.error(`Error invoking queue processor:`, processError);
          }
        } else {
          // No emails queued - this shouldn't happen for properly created campaigns
          console.warn(`Campaign ${campaign.id} has no queued emails - marking as failed`);
          
          await supabase
            .from('email_campaigns')
            .update({ 
              status: 'failed',
              sent_at: new Date().toISOString()
            })
            .eq('id', campaign.id);
          
          continue; // Skip to next campaign
        }

        const sendError = null; // No error if we got here

        if (sendError) {
          console.error(`Error sending campaign ${campaign.id}:`, sendError);
          
          // Update campaign status to failed
          await supabase
            .from('email_campaigns')
            .update({ 
              status: 'failed',
              sent_at: new Date().toISOString()
            })
            .eq('id', campaign.id);
          
          errorCount++;
        } else {
          console.log(`Successfully queued campaign ${campaign.id} for sending`);
          processedCount++;
        }
      } catch (error: any) {
        console.error(`Error processing campaign ${campaign.id}:`, error);
        errorCount++;
        
        // Update campaign status to failed
        await supabase
          .from('email_campaigns')
          .update({ 
            status: 'failed',
            sent_at: new Date().toISOString()
          })
          .eq('id', campaign.id);
      }
    }

    console.log(`Processed ${processedCount} campaigns, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${processedCount} campaigns`,
        processed: processedCount,
        errors: errorCount
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
    console.error('Error in process-scheduled-campaigns function:', error);
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
