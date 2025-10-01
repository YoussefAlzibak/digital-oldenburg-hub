import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createTransport } from "npm:nodemailer@6.9.7";

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

    // Create transporter with nodemailer
    const transporter = createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${smtp.from_name}" <${smtp.from_email}>`,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text || stripHtml(emailData.html),
      html: emailData.html,
    });

    console.log('Email sent successfully:', info.messageId);

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: info.messageId 
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

// Helper function to strip HTML tags
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
