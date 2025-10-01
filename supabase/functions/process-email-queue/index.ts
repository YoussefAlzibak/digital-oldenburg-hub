import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QueueProcessRequest {
  immediate?: boolean;
  batchSize?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { immediate = false, batchSize = 100 }: QueueProcessRequest = await req.json().catch(() => ({}));

    console.log('Processing email queue...', { immediate, batchSize });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get pending emails from queue
    const { data: queuedEmails, error: queueError } = await supabase
      .from('email_queue')
      .select(`
        *,
        email_subscribers!email_queue_subscriber_id_fkey (
          email,
          first_name,
          last_name,
          status
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(batchSize);

    if (queueError) throw queueError;

    if (!queuedEmails || queuedEmails.length === 0) {
      console.log('No pending emails to process');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Keine ausstehenden E-Mails in der Warteschlange',
          processedCount: 0
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    console.log(`Processing ${queuedEmails.length} queued emails`);

    let successCount = 0;
    let errorCount = 0;

    // Process each email
    for (const queuedEmail of queuedEmails) {
      try {
        // Get subscriber email
        let recipientEmail = '';
        if (queuedEmail.email_subscribers?.email) {
          recipientEmail = queuedEmail.email_subscribers.email;
          
          // Check if subscriber is still active
          if (queuedEmail.email_subscribers.status !== 'active') {
            console.log(`Skipping email to inactive subscriber: ${recipientEmail}`);
            await updateEmailStatus(supabase, queuedEmail.id, 'cancelled', 'Subscriber inactive');
            continue;
          }
        } else {
          // Try to find subscriber by email in content or other method
          console.error('No recipient email found for queue item:', queuedEmail.id);
          await updateEmailStatus(supabase, queuedEmail.id, 'failed', 'No recipient email found');
          errorCount++;
          continue;
        }

        // Personalize email content
        const personalizedContent = personalizeContent(
          queuedEmail.html_content,
          queuedEmail.email_subscribers
        );

        // Send email via SMTP function
        const { data: sendResult, error: sendError } = await supabase.functions.invoke('send-smtp-email', {
          body: {
            emailData: {
              to: recipientEmail,
              subject: queuedEmail.subject,
              html: personalizedContent,
              text: queuedEmail.text_content
            }
          }
        });

        if (sendError) throw sendError;

        // Update email status to sent
        await updateEmailStatus(supabase, queuedEmail.id, 'sent');

        // Log delivery event
        if (queuedEmail.subscriber_id) {
          await logEmailEvent(supabase, {
            subscriber_id: queuedEmail.subscriber_id,
            campaign_id: queuedEmail.campaign_id,
            automation_id: queuedEmail.automation_id,
            event_type: 'delivered'
          });
        }

        // Update campaign stats if applicable
        if (queuedEmail.campaign_id) {
          await updateCampaignStats(supabase, queuedEmail.campaign_id, 'delivered');
        }

        successCount++;
        console.log(`Successfully sent email to: ${recipientEmail}`);

      } catch (emailError: any) {
        console.error(`Failed to send email (queue ID: ${queuedEmail.id}):`, emailError);
        
        // Update retry count and status
        const retryCount = (queuedEmail.retry_count || 0) + 1;
        const maxRetries = 3;
        
        if (retryCount >= maxRetries) {
          await updateEmailStatus(supabase, queuedEmail.id, 'failed', emailError.message);
        } else {
          // Schedule retry (exponential backoff)
          const retryDelay = Math.pow(2, retryCount) * 60; // minutes
          const retryAt = new Date(Date.now() + retryDelay * 60 * 1000);
          
          const { error: retryError } = await supabase
            .from('email_queue')
            .update({
              retry_count: retryCount,
              scheduled_at: retryAt.toISOString(),
              error_message: emailError.message
            })
            .eq('id', queuedEmail.id);
            
          if (retryError) console.error('Failed to schedule retry:', retryError);
        }
        
        errorCount++;
      }
    }

    console.log(`Email processing complete. Success: ${successCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${successCount} E-Mails erfolgreich versendet, ${errorCount} Fehler`,
        processedCount: successCount + errorCount,
        successCount,
        errorCount
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
    console.error('Error in process-email-queue function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function updateEmailStatus(supabase: any, queueId: string, status: string, errorMessage?: string) {
  const updates: any = {
    status,
    sent_at: status === 'sent' ? new Date().toISOString() : null
  };
  
  if (errorMessage) {
    updates.error_message = errorMessage;
  }
  
  const { error } = await supabase
    .from('email_queue')
    .update(updates)
    .eq('id', queueId);
    
  if (error) console.error('Failed to update email status:', error);
}

async function logEmailEvent(supabase: any, event: {
  subscriber_id: string;
  campaign_id?: string;
  automation_id?: string;
  event_type: string;
  event_data?: any;
}) {
  const { error } = await supabase
    .from('email_events')
    .insert({
      ...event,
      created_at: new Date().toISOString()
    });
    
  if (error) console.error('Failed to log email event:', error);
}

async function updateCampaignStats(supabase: any, campaignId: string, statType: 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed') {
  const columnMap = {
    delivered: 'delivered_count',
    opened: 'opened_count',
    clicked: 'clicked_count',
    bounced: 'bounced_count',
    unsubscribed: 'unsubscribed_count'
  };
  
  const column = columnMap[statType];
  
  // Get current campaign data
  const { data: campaign, error: fetchError } = await supabase
    .from('email_campaigns')
    .select(column)
    .eq('id', campaignId)
    .single();
    
  if (fetchError) {
    console.error('Failed to fetch campaign:', fetchError);
    return;
  }
  
  // Increment the counter
  const { error } = await supabase
    .from('email_campaigns')
    .update({
      [column]: (campaign[column] || 0) + 1,
      status: statType === 'delivered' ? 'sent' : undefined
    })
    .eq('id', campaignId);
    
  if (error) console.error('Failed to update campaign stats:', error);
}

function personalizeContent(htmlContent: string, subscriber: any): string {
  if (!subscriber) return htmlContent;
  
  let personalized = htmlContent;
  
  // Replace common placeholders
  const replacements = {
    '{{first_name}}': subscriber.first_name || '',
    '{{last_name}}': subscriber.last_name || '',
    '{{full_name}}': `${subscriber.first_name || ''} ${subscriber.last_name || ''}`.trim() || 'Kunde',
    '{{email}}': subscriber.email || ''
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    personalized = personalized.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return personalized;
}

serve(handler);