import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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

    // EHLO
    await sendCommand(conn, `EHLO localhost\r\n`);
    let ehloResponse = await readResponse(conn);

    // Upgrade with STARTTLS when on 587 or server advertises it and we didn't use implicit TLS
    if (!useImplicitTLS && (smtp.port === 587 || ehloResponse.includes('STARTTLS'))) {
      await sendCommand(conn, 'STARTTLS\r\n');
      const tlsResponse = await readResponse(conn);
      if (!tlsResponse.startsWith('220')) {
        throw new Error(`STARTTLS failed: ${tlsResponse}`);
      }
      const tlsConn = await Deno.startTls(conn, { hostname: smtp.host });
      conn = tlsConn;
      await sendCommand(conn, `EHLO localhost\r\n`);
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
      throw new Error(`Authentication failed: ${authResponse}`);
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
    `X-Mailer: Digital Masters Marketing Platform`,
    `List-Unsubscribe: <https://kgwanyretbrxwtwduljg.supabase.co/unsubscribe>`,
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
