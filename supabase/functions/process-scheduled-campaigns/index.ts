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
          .select('id, subscriber_id')
          .eq('campaign_id', campaign.id)
          .eq('status', 'pending');

        if (queueError) {
          console.error(`Error checking queue for campaign ${campaign.id}:`, queueError);
          throw queueError;
        }

        // If emails are already queued, process them directly
        if (queuedEmails && queuedEmails.length > 0) {
          console.log(`Found ${queuedEmails.length} queued emails for campaign ${campaign.id}`);
          
          // Invoke send-marketing-email function to send the campaign
          const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-marketing-email', {
            body: {
              campaignId: campaign.id,
              listId: campaign.list_id,
              subject: campaign.subject,
              htmlContent: campaign.html_content,
              textContent: campaign.text_content
            }
          });

          if (sendError) {
            console.error(`Error sending campaign ${campaign.id}:`, sendError);
            
            await supabase
              .from('email_campaigns')
              .update({ 
                status: 'failed',
                sent_at: new Date().toISOString()
              })
              .eq('id', campaign.id);
            
            errorCount++;
          } else {
            console.log(`Campaign ${campaign.id} sent successfully:`, sendResult);
            
            // Mark queued emails as sent
            await supabase
              .from('email_queue')
              .update({ 
                status: 'sent',
                sent_at: new Date().toISOString()
              })
              .eq('campaign_id', campaign.id)
              .eq('status', 'pending');
            
            processedCount++;
          }
        } else {
          // No emails queued - try to send directly using list_id
          console.log(`No queued emails found for campaign ${campaign.id}, sending directly...`);
          
          if (campaign.list_id) {
            const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-marketing-email', {
              body: {
                campaignId: campaign.id,
                listId: campaign.list_id,
                subject: campaign.subject,
                htmlContent: campaign.html_content,
                textContent: campaign.text_content
              }
            });

            if (sendError) {
              console.error(`Error sending campaign ${campaign.id}:`, sendError);
              
              await supabase
                .from('email_campaigns')
                .update({ 
                  status: 'failed',
                  sent_at: new Date().toISOString()
                })
                .eq('id', campaign.id);
              
              errorCount++;
            } else {
              console.log(`Campaign ${campaign.id} sent successfully:`, sendResult);
              processedCount++;
            }
          } else {
            // No list_id and no queued emails - send to all active subscribers
            const { data: allSubs } = await supabase
              .from('email_subscribers')
              .select('email')
              .eq('status', 'active');

            if (allSubs && allSubs.length > 0) {
              const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-marketing-email', {
                body: {
                  campaignId: campaign.id,
                  recipientEmails: allSubs.map(s => s.email),
                  subject: campaign.subject,
                  htmlContent: campaign.html_content,
                  textContent: campaign.text_content
                }
              });

              if (sendError) {
                console.error(`Error sending campaign ${campaign.id}:`, sendError);
                
                await supabase
                  .from('email_campaigns')
                  .update({ 
                    status: 'failed',
                    sent_at: new Date().toISOString()
                  })
                  .eq('id', campaign.id);
                
                errorCount++;
              } else {
                console.log(`Campaign ${campaign.id} sent successfully:`, sendResult);
                processedCount++;
              }
            } else {
              console.warn(`Campaign ${campaign.id} has no recipients - marking as failed`);
              
              await supabase
                .from('email_campaigns')
                .update({ 
                  status: 'failed',
                  sent_at: new Date().toISOString()
                })
                .eq('id', campaign.id);
              
              errorCount++;
            }
          }
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
