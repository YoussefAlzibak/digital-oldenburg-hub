import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
  from_email: string;
  from_name: string;
}

const marketingEmailSchema = z.object({
  campaignId: z.string().uuid('Invalid campaign ID').optional(),
  automationId: z.string().uuid('Invalid automation ID').optional(),
  listId: z.string().uuid('Invalid list ID').optional(),
  templateId: z.string().uuid('Invalid template ID').optional(),
  subject: z.string().min(1, 'Subject is required').max(500, 'Subject too long'),
  htmlContent: z.string().min(1, 'HTML content is required').max(100000, 'Content too large'),
  textContent: z.string().max(50000, 'Text content too large').optional(),
  recipientEmails: z.array(z.string().email('Invalid email in recipients list')).max(1000, 'Too many recipients').optional(),
  scheduledAt: z.string().optional(),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input data
    const emailRequest = marketingEmailSchema.parse(rawData);

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

    // Fetch active SMTP settings
    const { data: smtpSettings, error: smtpError } = await supabase
      .from('smtp_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (smtpError || !smtpSettings) {
      throw new Error('Keine aktiven SMTP-Einstellungen gefunden');
    }

    if (!smtpSettings.password) {
      throw new Error('SMTP-Passwort nicht konfiguriert');
    }

    const smtp: SMTPSettings = {
      host: smtpSettings.host,
      port: smtpSettings.port,
      username: smtpSettings.username,
      password: smtpSettings.password,
      secure: smtpSettings.secure,
      from_email: smtpSettings.from_email,
      from_name: smtpSettings.from_name,
    };

    // Send emails directly via SMTP
    let successCount = 0;
    let failedCount = 0;

    for (const email of recipients) {
      try {
        await sendSMTPEmail(
          smtp,
          email,
          createEmailMessage(
            smtp.from_email,
            smtp.from_name,
            email,
            emailRequest.subject,
            emailRequest.htmlContent,
            emailRequest.textContent || stripHtml(emailRequest.htmlContent)
          )
        );
        console.log(`E-Mail erfolgreich gesendet an ${email}`);
        successCount++;
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
    
    // Handle validation errors with more specific status code
    const isValidationError = error.name === 'ZodError';
    
    return new Response(
      JSON.stringify({ 
        error: isValidationError ? 'Invalid input data' : error.message,
        details: isValidationError ? error.errors : undefined
      }),
      {
        status: isValidationError ? 400 : 500,
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

async function sendSMTPEmail(smtp: SMTPSettings, to: string, message: string): Promise<void> {
  let conn: Deno.Conn | null = null;
  
  try {
    console.log(`Verbinde mit SMTP-Server ${smtp.host}:${smtp.port}`);

    const useImplicitTLS = smtp.port === 465 || smtp.secure === true;
    let connLocal: Deno.Conn;

    if (useImplicitTLS) {
      connLocal = await (Deno as any).connectTls({ hostname: smtp.host, port: smtp.port });
    } else {
      connLocal = await Deno.connect({ hostname: smtp.host, port: smtp.port });
    }

    conn = connLocal;

    // Read greeting
    await readResponse(conn);

    // EHLO with sender domain
    const heloDomain = smtp.from_email && smtp.from_email.includes('@') ? smtp.from_email.split('@')[1] : 'localhost';
    await sendCommand(conn, `EHLO ${heloDomain}\r\n`);
    let ehloResponse = await readResponse(conn);

    // Upgrade with STARTTLS when on 587 or server advertises it and we didn't use implicit TLS
    if (!useImplicitTLS && (smtp.port === 587 || ehloResponse.includes('STARTTLS'))) {
      await sendCommand(conn, 'STARTTLS\r\n');
      const tlsResponse = await readResponse(conn);
      if (!tlsResponse.startsWith('220')) {
        throw new Error(`STARTTLS fehlgeschlagen: ${tlsResponse}`);
      }
      const tlsConn = await Deno.startTls(conn, { hostname: smtp.host });
      conn = tlsConn;
      await sendCommand(conn, `EHLO ${heloDomain}\r\n`);
      ehloResponse = await readResponse(conn);
    }

    // Authenticate
    await sendCommand(conn, 'AUTH LOGIN\r\n');
    await readResponse(conn);
    
    await sendCommand(conn, `${btoa(smtp.username)}\r\n`);
    await readResponse(conn);
    
    await sendCommand(conn, `${btoa(smtp.password)}\r\n`);
    const authResponse = await readResponse(conn);
    
    if (!authResponse.startsWith('235')) {
      throw new Error(`Authentifizierung fehlgeschlagen: ${authResponse}`);
    }

    // Send email
    await sendCommand(conn, `MAIL FROM:<${smtp.from_email}>\r\n`);
    await readResponse(conn);

    await sendCommand(conn, `RCPT TO:<${to}>\r\n`);
    await readResponse(conn);

    await sendCommand(conn, 'DATA\r\n');
    await readResponse(conn);

    await sendCommand(conn, message + '\r\n.\r\n');
    await readResponse(conn);

    // Quit
    await sendCommand(conn, 'QUIT\r\n');
    
  } finally {
    if (conn) {
      try {
        conn.close();
      } catch (e) {
        console.error('Fehler beim Schließen der Verbindung:', e);
      }
    }
  }
}

function createEmailMessage(
  fromEmail: string,
  fromName: string,
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string
): string {
  const boundary = `----=_Part_${Date.now()}`;
  const date = new Date().toUTCString();
  const messageId = `<${Date.now()}.${Math.random().toString(36).substring(7)}@${fromEmail.split('@')[1]}>`;

  return [
    `From: "${fromName}" <${fromEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Date: ${date}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `X-Mailer: Digital Masters Marketing Platform`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textContent,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlContent,
    ``,
    `--${boundary}--`,
  ].join('\r\n');
}

async function readResponse(conn: Deno.Conn): Promise<string> {
  const buffer = new Uint8Array(4096);
  const bytesRead = await conn.read(buffer);
  if (!bytesRead) throw new Error('Verbindung geschlossen');
  
  const response = new TextDecoder().decode(buffer.subarray(0, bytesRead));
  return response.trim();
}

async function sendCommand(conn: Deno.Conn, command: string): Promise<void> {
  const encoder = new TextEncoder();
  await conn.write(encoder.encode(command));
}

serve(handler);