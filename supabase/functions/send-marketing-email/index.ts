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
    const errors: string[] = [];

    for (const email of recipients) {
      try {
        await sendSMTPEmail(
          smtp,
          email,
          emailRequest.subject,
          emailRequest.htmlContent,
          emailRequest.textContent || stripHtml(emailRequest.htmlContent)
        );
        console.log(`E-Mail erfolgreich gesendet an ${email}`);
        successCount++;
      } catch (error: any) {
        console.error(`Fehler beim Senden an ${email}:`, error.message || error);
        errors.push(`${email}: ${error.message || 'Unbekannter Fehler'}`);
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
          status: successCount > 0 ? 'sent' : 'failed'
        })
        .eq('id', emailRequest.campaignId);
    }

    console.log(`Versand abgeschlossen: ${successCount} erfolgreich, ${failedCount} fehlgeschlagen`);

    return new Response(
      JSON.stringify({ 
        success: successCount > 0, 
        message: `${successCount} E-Mails erfolgreich versendet${failedCount > 0 ? `, ${failedCount} fehlgeschlagen` : ''}`,
        successCount,
        failedCount,
        totalRecipients: recipients.length,
        errors: errors.length > 0 ? errors : undefined
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

async function sendSMTPEmail(
  smtp: SMTPSettings, 
  to: string, 
  subject: string,
  htmlContent: string,
  textContent: string
): Promise<void> {
  let conn: Deno.Conn | null = null;
  
  try {
    console.log(`Verbinde mit SMTP-Server ${smtp.host}:${smtp.port}`);

    // Determine connection type based on port
    const useImplicitTLS = smtp.port === 465;
    
    if (useImplicitTLS) {
      // Port 465: Direct TLS connection
      conn = await Deno.connectTls({ hostname: smtp.host, port: smtp.port });
    } else {
      // Port 587 or 25: Plain connection first, then STARTTLS
      conn = await Deno.connect({ hostname: smtp.host, port: smtp.port });
    }

    // Read greeting
    const greeting = await readResponse(conn);
    console.log('Server greeting:', greeting.substring(0, 50));
    
    if (!greeting.startsWith('220')) {
      throw new Error(`Unerwartete Server-Antwort: ${greeting}`);
    }

    // EHLO with sender domain
    const heloDomain = smtp.from_email?.includes('@') ? smtp.from_email.split('@')[1] : 'localhost';
    await sendCommand(conn, `EHLO ${heloDomain}\r\n`);
    let ehloResponse = await readResponse(conn);
    console.log('EHLO response received');

    // Upgrade with STARTTLS for port 587
    if (!useImplicitTLS && smtp.port === 587) {
      console.log('Initiating STARTTLS...');
      await sendCommand(conn, 'STARTTLS\r\n');
      const starttlsResponse = await readResponse(conn);
      
      if (!starttlsResponse.startsWith('220')) {
        throw new Error(`STARTTLS fehlgeschlagen: ${starttlsResponse}`);
      }
      
      console.log('STARTTLS accepted, upgrading connection...');
      
      // Upgrade to TLS
      conn = await Deno.startTls(conn, { hostname: smtp.host });
      console.log('TLS connection established');
      
      // Send EHLO again after TLS upgrade
      await sendCommand(conn, `EHLO ${heloDomain}\r\n`);
      ehloResponse = await readResponse(conn);
      console.log('Post-TLS EHLO response received');
    }

    // Authenticate using AUTH LOGIN
    console.log('Starting authentication...');
    await sendCommand(conn, 'AUTH LOGIN\r\n');
    const authResponse = await readResponse(conn);
    
    if (!authResponse.startsWith('334')) {
      throw new Error(`AUTH LOGIN nicht unterstützt: ${authResponse}`);
    }
    
    // Send username (base64 encoded)
    await sendCommand(conn, `${btoa(smtp.username)}\r\n`);
    const userResponse = await readResponse(conn);
    
    if (!userResponse.startsWith('334')) {
      throw new Error(`Benutzername abgelehnt: ${userResponse}`);
    }
    
    // Send password (base64 encoded)
    await sendCommand(conn, `${btoa(smtp.password)}\r\n`);
    const passResponse = await readResponse(conn);
    
    if (!passResponse.startsWith('235')) {
      throw new Error(`Authentifizierung fehlgeschlagen: ${passResponse}`);
    }
    
    console.log('Authentication successful');

    // Send MAIL FROM
    await sendCommand(conn, `MAIL FROM:<${smtp.from_email}>\r\n`);
    const mailFromResponse = await readResponse(conn);
    
    if (!mailFromResponse.startsWith('250')) {
      throw new Error(`MAIL FROM abgelehnt: ${mailFromResponse}`);
    }

    // Send RCPT TO
    await sendCommand(conn, `RCPT TO:<${to}>\r\n`);
    const rcptToResponse = await readResponse(conn);
    
    if (!rcptToResponse.startsWith('250')) {
      throw new Error(`RCPT TO abgelehnt: ${rcptToResponse}`);
    }

    // Send DATA
    await sendCommand(conn, 'DATA\r\n');
    const dataResponse = await readResponse(conn);
    
    if (!dataResponse.startsWith('354')) {
      throw new Error(`DATA abgelehnt: ${dataResponse}`);
    }

    // Create and send email message
    const message = createEmailMessage(
      smtp.from_email,
      smtp.from_name,
      to,
      subject,
      htmlContent,
      textContent
    );
    
    await sendCommand(conn, message + '\r\n.\r\n');
    const sendResponse = await readResponse(conn);
    
    if (!sendResponse.startsWith('250')) {
      throw new Error(`E-Mail abgelehnt: ${sendResponse}`);
    }

    console.log('Email sent successfully');

    // Quit
    await sendCommand(conn, 'QUIT\r\n');
    
  } catch (error) {
    console.error('SMTP Error:', error);
    throw error;
  } finally {
    if (conn) {
      try {
        conn.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

// Professional Email Template Wrapper with Unicum Tech Branding
function wrapInBrandedTemplate(htmlContent: string): string {
  // Check if content already has a complete HTML structure
  if (htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html')) {
    // Already has full HTML structure, add inline styles to existing structure
    return htmlContent;
  }

  // Wrap simple content in branded template with inline CSS
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Unicum Tech</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Email Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%); padding: 30px 40px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Logo Text -->
                    <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">
                      <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #8ec5fc; text-transform: uppercase; letter-spacing: 2px;">Digital Solutions by Melyou</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              ${htmlContent}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; color: #ffffff;">
                      <span style="color: #4ecdc4;">Unicum</span><span style="color: #ffffff;">Tech</span>
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #8ec5fc;">
                      Ihre Digitalagentur für maßgeschneiderte Lösungen
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 12px; color: #6b8eb8;">
                      Web-Entwicklung • Mobile Apps • Branding • IT-Lösungen
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 10px;">
                          <a href="https://unicumtech.de" style="color: #4ecdc4; font-size: 13px; text-decoration: none;">Website</a>
                        </td>
                        <td style="color: #6b8eb8;">|</td>
                        <td style="padding: 0 10px;">
                          <a href="https://unicumtech.de/kontakt" style="color: #4ecdc4; font-size: 13px; text-decoration: none;">Kontakt</a>
                        </td>
                        <td style="color: #6b8eb8;">|</td>
                        <td style="padding: 0 10px;">
                          <a href="https://unicumtech.de/impressum" style="color: #4ecdc4; font-size: 13px; text-decoration: none;">Impressum</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Legal Footer -->
          <tr>
            <td style="background-color: #0f2439; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #6b8eb8; line-height: 1.6;">
                © ${new Date().getFullYear()} Unicum Tech by Melyou. Alle Rechte vorbehalten.<br>
                <a href="#" style="color: #4ecdc4; text-decoration: none;">Abmelden</a> | 
                <a href="https://unicumtech.de/datenschutz" style="color: #4ecdc4; text-decoration: none;">Datenschutz</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function createEmailMessage(
  fromEmail: string,
  fromName: string,
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string
): string {
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const date = new Date().toUTCString();
  const messageId = `<${Date.now()}.${Math.random().toString(36).substring(7)}@${fromEmail.split('@')[1]}>`;

  // Encode subject for UTF-8
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;

  // Wrap HTML content in branded template
  const brandedHtml = wrapInBrandedTemplate(htmlContent);

  return [
    `From: "${fromName}" <${fromEmail}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `Date: ${date}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `X-Mailer: Unicum Tech Marketing Platform`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    textContent,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    brandedHtml,
    ``,
    `--${boundary}--`,
  ].join('\r\n');
}

async function readResponse(conn: Deno.Conn): Promise<string> {
  const buffer = new Uint8Array(4096);
  let fullResponse = '';
  
  // Read until we get a complete response (line not starting with digit followed by dash)
  while (true) {
    const bytesRead = await conn.read(buffer);
    if (!bytesRead) throw new Error('Verbindung geschlossen');
    
    const chunk = new TextDecoder().decode(buffer.subarray(0, bytesRead));
    fullResponse += chunk;
    
    // Check if this is the last line of a multi-line response
    const lines = fullResponse.split('\r\n');
    const lastNonEmptyLine = lines.filter(l => l.length > 0).pop();
    
    if (lastNonEmptyLine && /^\d{3} /.test(lastNonEmptyLine)) {
      break;
    }
    
    // Also break if we have a simple single-line response
    if (lastNonEmptyLine && /^\d{3}/.test(lastNonEmptyLine) && !/-/.test(lastNonEmptyLine.substring(0, 4))) {
      break;
    }
  }
  
  return fullResponse.trim();
}

async function sendCommand(conn: Deno.Conn, command: string): Promise<void> {
  const encoder = new TextEncoder();
  await conn.write(encoder.encode(command));
}

serve(handler);
