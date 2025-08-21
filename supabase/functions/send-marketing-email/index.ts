import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketingEmailRequest {
  campaignId?: string;
  automationId?: string;
  listId?: string;
  templateId?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  recipientEmails?: string[]; // For manual sends
  scheduledAt?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: MarketingEmailRequest = await req.json();

    console.log('Processing marketing email request:', {
      campaignId: emailRequest.campaignId,
      automationId: emailRequest.automationId,
      listId: emailRequest.listId
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    let recipients: string[] = [];

    // Get recipients based on request type
    if (emailRequest.recipientEmails) {
      // Manual recipient list
      recipients = emailRequest.recipientEmails;
    } else if (emailRequest.listId) {
      // Get subscribers from email list
      const { data: listSubscribers, error: listError } = await supabase
        .from('email_list_subscribers')
        .select(`
          email_subscribers (
            email,
            status
          )
        `)
        .eq('list_id', emailRequest.listId);

      if (listError) throw listError;

      recipients = listSubscribers
        ?.map(ls => ls.email_subscribers)
        ?.filter(sub => sub && sub.status === 'active')
        ?.map(sub => sub.email) || [];
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Keine aktiven Empfänger gefunden' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`Found ${recipients.length} recipients`);

    // Get SMTP settings
    const { data: smtpSettings, error: smtpError } = await supabase
      .from('smtp_settings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (smtpError || !smtpSettings) {
      throw new Error('Keine aktiven SMTP-Einstellungen gefunden');
    }

    // Queue emails for sending
    const emailQueue = recipients.map(email => ({
      subscriber_id: null, // Will be populated by trigger
      campaign_id: emailRequest.campaignId || null,
      automation_id: emailRequest.automationId || null,
      subject: emailRequest.subject,
      html_content: emailRequest.htmlContent,
      text_content: emailRequest.textContent || stripHtml(emailRequest.htmlContent),
      scheduled_at: emailRequest.scheduledAt || new Date().toISOString(),
      recipient_email: email
    }));

    // Insert emails into queue
    const { error: queueError } = await supabase
      .from('email_queue')
      .insert(emailQueue.map(({ recipient_email, ...rest }) => rest));

    if (queueError) throw queueError;

    // Update campaign stats if campaignId provided
    if (emailRequest.campaignId) {
      const { error: campaignError } = await supabase
        .from('email_campaigns')
        .update({
          total_recipients: recipients.length,
          status: emailRequest.scheduledAt ? 'scheduled' : 'sending'
        })
        .eq('id', emailRequest.campaignId);

      if (campaignError) console.error('Campaign update error:', campaignError);
    }

    // Process email queue immediately if not scheduled
    if (!emailRequest.scheduledAt) {
      console.log('Processing email queue immediately...');
      
      // Call email queue processor
      const { error: processorError } = await supabase.functions.invoke('process-email-queue', {
        body: { immediate: true }
      });

      if (processorError) {
        console.error('Queue processor error:', processorError);
      }
    }

    console.log(`Queued ${recipients.length} emails for sending`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${recipients.length} E-Mails wurden zur Warteschlange hinzugefügt`,
        queuedCount: recipients.length,
        scheduled: !!emailRequest.scheduledAt
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
    console.error('Error in send-marketing-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

serve(handler);