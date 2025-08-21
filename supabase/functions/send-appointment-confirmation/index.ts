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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { appointment, customer, appointmentType }: EmailRequest = await req.json();
    
    console.log('Sending appointment confirmation for:', {
      appointmentId: appointment.id,
      customerEmail: customer.email,
      date: appointment.scheduled_date,
      time: appointment.scheduled_time
    });

    // Format date and time for German locale
    const appointmentDate = new Date(appointment.scheduled_date);
    const formattedDate = appointmentDate.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const meetingTypeLabels: { [key: string]: string } = {
      online: 'Online Video-Call',
      phone: 'Telefonberatung',
      office: 'Vor Ort in unserem Büro',
      client: 'Vor Ort beim Kunden'
    };

    const meetingTypeLabel = meetingTypeLabels[appointmentType] || appointmentType;

    // Create a simple HTML email
    const emailHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terminbestätigung - Unicum Tec</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .footer { background: #333; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
        .status-badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
        .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Terminbestätigung</h1>
            <p>Ihre Beratungsanfrage wurde erfolgreich eingegangen!</p>
        </div>
        
        <div class="content">
            <p>Liebe/r ${customer.name},</p>
            
            <p>vielen Dank für Ihre Terminanfrage bei Unicum Tec. Wir haben Ihren Terminwunsch erhalten und werden ihn in Kürze prüfen und bestätigen.</p>
            
            <div class="appointment-details">
                <h3>📅 Ihre Termindetails</h3>
                <div class="detail-row">
                    <strong>Datum:</strong>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <strong>Uhrzeit:</strong>
                    <span>${appointment.scheduled_time} Uhr</span>
                </div>
                <div class="detail-row">
                    <strong>Art der Beratung:</strong>
                    <span>${meetingTypeLabel}</span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status-badge">Wird geprüft</span>
                </div>
                ${customer.company ? `
                <div class="detail-row">
                    <strong>Unternehmen:</strong>
                    <span>${customer.company}</span>
                </div>
                ` : ''}
                ${customer.message ? `
                <div class="detail-row">
                    <strong>Ihre Nachricht:</strong>
                </div>
                <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; margin-top: 5px;">${customer.message}</p>
                ` : ''}
            </div>
            
            <h3>📞 Nächste Schritte</h3>
            <ul>
                <li><strong>Terminprüfung:</strong> Wir prüfen die Verfügbarkeit und melden uns innerhalb von 24 Stunden</li>
                <li><strong>Bestätigung:</strong> Sie erhalten eine finale Bestätigung per E-Mail oder Telefon</li>
                <li><strong>Zugangsdaten:</strong> Bei Online-Terminen senden wir Ihnen rechtzeitig die Zugangsdaten</li>
                <li><strong>Vorbereitung:</strong> Bereiten Sie gerne Fragen zu Ihrem Projekt vor</li>
            </ul>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4>💡 Kostenlose Beratung</h4>
                <p>Diese Beratung ist für Sie völlig kostenlos und unverbindlich. Wir nehmen uns gerne Zeit für Ihre Fragen und zeigen Ihnen Lösungsmöglichkeiten auf.</p>
            </div>
            
            <p><strong>Haben Sie noch Fragen?</strong><br>
            Kontaktieren Sie uns gerne unter:</p>
            <ul>
                <li>📧 E-Mail: info@unicumtec.de</li>
                <li>📱 Telefon: +49 (0) 441 XXX XXX</li>
                <li>🕒 Geschäftszeiten: Mo-Fr 9:00 - 18:00 Uhr</li>
            </ul>
        </div>
        
        <div class="footer">
            <p><strong>Unicum Tec</strong><br>
            Ihre Full-Service Digitalagentur in Oldenburg<br>
            Webdesign • CRM-Systeme • IT-Services • Print Design</p>
            
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
            </p>
        </div>
    </div>
</body>
</html>`;

    // For now, we'll just log the email content
    // In a real implementation, you would integrate with a service like Resend, SendGrid, or similar
    console.log('Email HTML generated successfully');
    console.log('Would send email to:', customer.email);
    console.log('Email content length:', emailHTML.length);

    // Simulate email sending success
    // TODO: Integrate with actual email service
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Appointment confirmation email prepared',
        emailPreview: emailHTML.substring(0, 200) + '...',
        recipient: customer.email
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
    console.error('Error in send-appointment-confirmation function:', error);
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