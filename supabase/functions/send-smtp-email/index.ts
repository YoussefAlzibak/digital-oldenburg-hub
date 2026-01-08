import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailRequest {
  emailData: EmailData;
  smtpSettings?: SMTPSettings;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailData, smtpSettings }: EmailRequest = await req.json();
    console.log('Sending email to:', emailData.to);

    let smtp: SMTPSettings;

    if (smtpSettings) {
      smtp = smtpSettings;
    } else {
      // Fetch active SMTP settings from database
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { data: settings, error } = await supabase
        .from('smtp_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error || !settings) {
        throw new Error('No active SMTP settings found');
      }

      if (!settings.password) {
        throw new Error('SMTP password not configured');
      }

      smtp = {
        host: settings.host,
        port: settings.port,
        username: settings.username,
        password: settings.password,
        secure: settings.secure,
        from_email: settings.from_email,
        from_name: settings.from_name,
      };
    }

    // Send email via SMTP
    await sendSMTPEmail(
      smtp,
      emailData.to,
      createEmailMessage(
        smtp.from_email,
        smtp.from_name,
        emailData.to,
        emailData.subject,
        emailData.html,
        emailData.text || stripHtml(emailData.html)
      )
    );

    console.log('Email sent successfully to:', emailData.to);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Email sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to send email'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
};

async function sendSMTPEmail(smtp: SMTPSettings, to: string, message: string): Promise<void> {
  let conn: Deno.Conn | null = null;
  
  try {
    console.log(`Connecting to SMTP server ${smtp.host}:${smtp.port}`);

    // IMPORTANT: Port 465 = Implicit TLS (connect with TLS directly)
    // Port 587 = STARTTLS (connect plain, then upgrade)
    // Port 25 = Plain (no encryption)
    const useImplicitTLS = smtp.port === 465;
    
    let connLocal: Deno.Conn;

    if (useImplicitTLS) {
      console.log('Using implicit TLS (port 465)');
      connLocal = await (Deno as any).connectTls({ hostname: smtp.host, port: smtp.port });
    } else {
      console.log('Using plain connection (will upgrade with STARTTLS if available)');
      connLocal = await Deno.connect({ hostname: smtp.host, port: smtp.port });
    }

    conn = connLocal;

    // Read greeting
    const greeting = await readResponse(conn);
    console.log('Server greeting:', greeting);
    if (!greeting.startsWith('220')) {
      throw new Error(`Unexpected greeting: ${greeting}`);
    }

    // EHLO with sender domain
    const heloDomain = smtp.from_email && smtp.from_email.includes('@') ? smtp.from_email.split('@')[1] : 'localhost';
    await sendCommand(conn, `EHLO ${heloDomain}\r\n`);
    let ehloResponse = await readResponse(conn);
    console.log('EHLO response received');

    // Upgrade with STARTTLS when on port 587 or server advertises it (and we didn't use implicit TLS)
    if (!useImplicitTLS && (smtp.port === 587 || ehloResponse.includes('STARTTLS'))) {
      console.log('Initiating STARTTLS upgrade...');
      await sendCommand(conn, 'STARTTLS\r\n');
      const tlsResponse = await readResponse(conn);
      if (!tlsResponse.startsWith('220')) {
        throw new Error(`STARTTLS failed: ${tlsResponse}`);
      }
      console.log('Upgrading connection to TLS...');
      const tlsConn = await Deno.startTls(conn, { hostname: smtp.host });
      conn = tlsConn;
      console.log('TLS upgrade successful, sending EHLO again');
      await sendCommand(conn, `EHLO ${heloDomain}\r\n`);
      ehloResponse = await readResponse(conn);
      console.log('Post-STARTTLS EHLO successful');
    }

    // Authenticate
    console.log('Starting authentication...');
    await sendCommand(conn, 'AUTH LOGIN\r\n');
    await readResponse(conn);
    
    await sendCommand(conn, `${btoa(smtp.username)}\r\n`);
    await readResponse(conn);
    
    await sendCommand(conn, `${btoa(smtp.password)}\r\n`);
    const authResponse = await readResponse(conn);
    
    if (!authResponse.startsWith('235')) {
      throw new Error(`Authentication failed: ${authResponse}`);
    }
    console.log('Authentication successful');

    // Send email
    console.log('Sending email envelope...');
    await sendCommand(conn, `MAIL FROM:<${smtp.from_email}>\r\n`);
    const mailFromResp = await readResponse(conn);
    if (!mailFromResp.startsWith('250')) {
      throw new Error(`MAIL FROM rejected: ${mailFromResp}`);
    }

    await sendCommand(conn, `RCPT TO:<${to}>\r\n`);
    const rcptToResp = await readResponse(conn);
    if (!rcptToResp.startsWith('250') && !rcptToResp.startsWith('251')) {
      throw new Error(`RCPT TO rejected: ${rcptToResp}`);
    }

    await sendCommand(conn, 'DATA\r\n');
    const dataResp = await readResponse(conn);
    if (!dataResp.startsWith('354')) {
      throw new Error(`DATA rejected: ${dataResp}`);
    }

    await sendCommand(conn, message + '\r\n.\r\n');
    const sendResp = await readResponse(conn);
    if (!sendResp.startsWith('250')) {
      throw new Error(`Message rejected: ${sendResp}`);
    }
    console.log('Email sent successfully');

    // Quit
    await sendCommand(conn, 'QUIT\r\n');
    
  } finally {
    if (conn) {
      try {
        conn.close();
      } catch (e) {
        console.error('Error closing connection:', e);
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
  const messageId = `<${Date.now()}.${Math.random().toString(36).substring(7)}@unicum-tech.com>`;

  return [
    `From: "${fromName}" <${fromEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Date: ${date}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `X-Mailer: Unicum Tech Marketing Platform`,
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

async function readResponse(conn: Deno.Conn): Promise<string> {
  const buffer = new Uint8Array(4096);
  const bytesRead = await conn.read(buffer);
  if (!bytesRead) throw new Error('Connection closed');
  
  const response = new TextDecoder().decode(buffer.subarray(0, bytesRead));
  return response.trim();
}

async function sendCommand(conn: Deno.Conn, command: string): Promise<void> {
  const encoder = new TextEncoder();
  await conn.write(encoder.encode(command));
}

serve(handler);
