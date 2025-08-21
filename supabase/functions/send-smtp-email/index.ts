import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailData, smtpSettings }: EmailRequest = await req.json();

    console.log('Sending email via SMTP to:', emailData.to);
    console.log('SMTP Host:', smtpSettings?.host);

    // Get SMTP settings from request or database
    let smtp = smtpSettings;
    
    if (!smtp) {
      // Fetch SMTP settings from Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      
      const response = await fetch(`${supabaseUrl}/rest/v1/smtp_settings?is_active=eq.true&order=created_at.desc&limit=1`, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        }
      });
      
      const smtpData = await response.json();
      if (!smtpData || smtpData.length === 0) {
        throw new Error('Keine aktiven SMTP-Einstellungen gefunden');
      }
      
      smtp = smtpData[0];
    }

    if (!smtp) {
      throw new Error('SMTP-Konfiguration fehlt');
    }

    // Create email message
    const boundary = `boundary_${Date.now()}`;
    const messageBody = createEmailMessage({
      from: `${smtp.from_name} <${smtp.from_email}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || stripHtml(emailData.html),
      boundary
    });

    // Send email via SMTP
    await sendSMTPEmail(smtp, emailData.to, messageBody);

    console.log('Email sent successfully via SMTP');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-smtp-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function sendSMTPEmail(smtp: SMTPSettings, to: string, message: string) {
  console.log(`Connecting to SMTP server: ${smtp.host}:${smtp.port}`);
  
  try {
    const conn = await Deno.connect({
      hostname: smtp.host,
      port: smtp.port,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Helper function to read SMTP response
    const readResponse = async (): Promise<string> => {
      const buffer = new Uint8Array(1024);
      const bytesRead = await conn.read(buffer);
      if (bytesRead) {
        return decoder.decode(buffer.subarray(0, bytesRead));
      }
      return '';
    };

    // Helper function to send SMTP command
    const sendCommand = async (command: string): Promise<string> => {
      console.log('SMTP Command:', command.replace(/AUTH PLAIN .+/, 'AUTH PLAIN [HIDDEN]'));
      await conn.write(encoder.encode(command + '\r\n'));
      const response = await readResponse();
      console.log('SMTP Response:', response.trim());
      return response;
    };

    // SMTP Conversation
    let response = await readResponse(); // Welcome message
    console.log('SMTP Welcome:', response.trim());

    // EHLO
    await sendCommand(`EHLO ${smtp.host}`);

    // STARTTLS if secure and port is not 465
    if (smtp.secure && smtp.port !== 465) {
      await sendCommand('STARTTLS');
      // Note: For production, you'd need to implement TLS upgrade here
    }

    // Authentication
    if (smtp.username && smtp.password) {
      await sendCommand('AUTH LOGIN');
      await sendCommand(btoa(smtp.username));
      await sendCommand(btoa(smtp.password));
    }

    // Send email
    await sendCommand(`MAIL FROM:<${smtp.from_email}>`);
    await sendCommand(`RCPT TO:<${to}>`);
    await sendCommand('DATA');
    await sendCommand(message + '\r\n.');
    await sendCommand('QUIT');

    conn.close();
    console.log('SMTP connection closed successfully');
  } catch (error) {
    console.error('SMTP Error:', error);
    throw new Error(`SMTP Fehler: ${error.message}`);
  }
}

function createEmailMessage(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  boundary: string;
}): string {
  const { from, to, subject, html, text, boundary } = params;
  
  return `From: ${from}
To: ${to}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

${text}

--${boundary}
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

${html}

--${boundary}--`;
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

serve(handler);