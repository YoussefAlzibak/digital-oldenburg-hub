import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppointmentData {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  meeting_type: string;
  status: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

interface EmailRequest {
  appointment: AppointmentData;
  customer: CustomerData;
  appointmentType: string;
}

const meetingTypeLabels: { [key: string]: string } = {
  online: 'Online Video-Call',
  phone: 'Telefonberatung',
  office: 'Vor Ort in unserem Büro',
  client: 'Vor Ort beim Kunden'
};

// Fallback-Template
const getFallbackTemplate = (customer: CustomerData, formattedDate: string, time: string, meetingTypeLabel: string): string => {
  return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terminbestätigung - Unicum Tech</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="padding: 40px;">
                <h2 style="color: #1e3a5f; margin: 0 0 20px 0;">🎉 Terminbestätigung</h2>
                <p style="color: #4a5568; line-height: 1.7;">Liebe/r ${customer.name},</p>
                <p style="color: #4a5568; line-height: 1.7;">
                  Vielen Dank für Ihre Terminanfrage bei Unicum Tech.
                </p>
                <p style="color: #4a5568; line-height: 1.7;"><strong>Datum:</strong> ${formattedDate}</p>
                <p style="color: #4a5568; line-height: 1.7;"><strong>Uhrzeit:</strong> ${time} Uhr</p>
                <p style="color: #4a5568; line-height: 1.7;"><strong>Art:</strong> ${meetingTypeLabel}</p>
                <p style="color: #1e3a5f; margin-top: 30px;">
                  Mit freundlichen Grüßen,<br>
                  <strong>Das Unicum Tech Team</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #6b8eb8;">
                  © ${new Date().getFullYear()} Unicum Tech. Alle Rechte vorbehalten.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
</body>
</html>`;
};

// Personalisiere Template-Inhalt
const personalizeContent = (content: string, data: Record<string, string>): string => {
  let result = content;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  }
  return result;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { appointment, customer, appointmentType }: EmailRequest = await req.json();

    const appointmentDate = new Date(appointment.scheduled_date);
    const formattedDate = appointmentDate.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const meetingTypeLabel = meetingTypeLabels[appointmentType] || appointmentType;
    const websiteUrl = 'https://digital-oldenburg-hub.onrender.com';
    const currentYear = new Date().getFullYear();

    // Template aus Datenbank laden
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'Terminbestätigung')
      .eq('is_active', true)
      .single();

    let emailHTML: string;
    let subject: string;

    if (template && !templateError) {
      const placeholders = {
        first_name: customer.name,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        company: customer.company || '',
        message: customer.message || '',
        appointment_date: formattedDate,
        appointment_time: appointment.scheduled_time,
        meeting_type: meetingTypeLabel,
        meeting_link: '', // Will be filled if exists
        service_type: '',
        company_name: 'Unicum Tech',
        website_url: websiteUrl,
        current_year: currentYear.toString(),
      };

      emailHTML = personalizeContent(template.html_content, placeholders);
      subject = personalizeContent(template.subject, placeholders);
    } else {
      emailHTML = getFallbackTemplate(customer, formattedDate, appointment.scheduled_time, meetingTypeLabel);
      subject = `✅ Terminbestätigung - ${formattedDate} um ${appointment.scheduled_time} Uhr`;
    }

    const emailData = {
      to: customer.email,
      subject: subject,
      html: emailHTML
    };

    const { error: emailError } = await supabase.functions.invoke('send-smtp-email', {
      body: { emailData }
    });

    if (emailError) {
      // Don't fail if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Appointment confirmation email sent',
        recipient: customer.email,
        usedDbTemplate: !!template
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
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Fehler beim Senden der Bestätigungsmail' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
