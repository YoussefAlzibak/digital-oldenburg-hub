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
  recipientEmails?: string[];
  scheduledAt?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: MarketingEmailRequest = await req.json();

    console.log('Direkter E-Mail-Versand:', {
      campaignId: emailRequest.campaignId,
      automationId: emailRequest.automationId,
      listId: emailRequest.listId
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    let recipients: string[] = [];

    // Get recipients based on request type
    if (emailRequest.recipientEmails) {
      const { data: subscribers, error: subError } = await supabase
        .from('email_subscribers')
        .select('id, email')
        .in('email', emailRequest.recipientEmails)
        .eq('status', 'active');

      if (subError) throw subError;
      recipients = subscribers?.map(s => s.email) || [];
    } else if (emailRequest.listId) {
      const { data: listSubscribers, error: listError } = await supabase
        .from('email_list_subscribers')
        .select(`
          subscriber_id,
          email_subscribers (
            id,
            email,
            status
          )
        `)
        .eq('list_id', emailRequest.listId);

      if (listError) throw listError;

      const activeSubscribers = listSubscribers
        ?.filter((ls: any) => ls.email_subscribers && ls.email_subscribers.status === 'active')
        ?.map((ls: any) => ls.email_subscribers) || [];

      recipients = activeSubscribers.map((sub: any) => sub.email);
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

    console.log(`Sende an ${recipients.length} Empfänger`);

    // Update campaign status to sending
    if (emailRequest.campaignId) {
      await supabase
        .from('email_campaigns')
        .update({
          total_recipients: recipients.length,
          status: 'sending',
          sent_at: new Date().toISOString()
        })
        .eq('id', emailRequest.campaignId);
    }

    // Send emails directly via SMTP
    let successCount = 0;
    let failedCount = 0;

    for (const email of recipients) {
      try {
        const { error: sendError } = await supabase.functions.invoke('send-smtp-email', {
          body: {
            emailData: {
              to: email,
              subject: emailRequest.subject,
              html: emailRequest.htmlContent,
              text: emailRequest.textContent || stripHtml(emailRequest.htmlContent)
            }
          }
        });

        if (sendError) {
          console.error(`Fehler beim Senden an ${email}:`, sendError);
          failedCount++;
        } else {
          console.log(`E-Mail erfolgreich gesendet an ${email}`);
          successCount++;
        }
      } catch (error) {
        console.error(`Fehler beim Senden an ${email}:`, error);
        failedCount++;
      }
    }

    // Update campaign stats
    if (emailRequest.campaignId) {
      await supabase
        .from('email_campaigns')
        .update({
          delivered_count: successCount,
          bounced_count: failedCount,
          status: 'sent'
        })
        .eq('id', emailRequest.campaignId);
    }

    console.log(`Versand abgeschlossen: ${successCount} erfolgreich, ${failedCount} fehlgeschlagen`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${successCount} E-Mails erfolgreich versendet${failedCount > 0 ? `, ${failedCount} fehlgeschlagen` : ''}`,
        successCount,
        failedCount,
        totalRecipients: recipients.length
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
    console.error('Fehler beim E-Mail-Versand:', error);
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