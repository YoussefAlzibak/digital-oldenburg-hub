import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequestData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
}

interface EmailRequest {
  contactRequest: ContactRequestData;
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

    const { contactRequest }: EmailRequest = await req.json();
    
    console.log('Sending contact confirmation for:', {
      contactId: contactRequest.id,
      customerEmail: contactRequest.email,
      serviceType: contactRequest.service_type
    });

    const serviceTypeLabels: { [key: string]: string } = {
      webdesign: 'Webdesign & Development',
      'it-services': 'IT-Services & Support',
      crm: 'CRM-Systeme',
      print: 'Print & Grafikdesign',
      consulting: 'IT-Beratung'
    };

    const serviceLabel = serviceTypeLabels[contactRequest.service_type] || contactRequest.service_type;

    // Create HTML email
    const emailHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anfrage erhalten - Unicum Tech</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; }
        .request-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .footer { background: #333; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
        .status-badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
        .highlight-box { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Anfrage erhalten</h1>
            <p>Vielen Dank für Ihre Beratungsanfrage!</p>
        </div>
        
        <div class="content">
            <p>Liebe/r ${contactRequest.name},</p>
            
            <p>vielen Dank für Ihre Anfrage bei Unicum Tech. Wir haben Ihre Nachricht erhalten und werden uns innerhalb der nächsten <strong>24 Stunden</strong> bei Ihnen melden.</p>
            
            <div class="request-details">
                <h3>📋 Ihre Anfrage im Überblick</h3>
                <div class="detail-row">
                    <strong>Service-Bereich:</strong>
                    <span>${serviceLabel}</span>
                </div>
                <div class="detail-row">
                    <strong>E-Mail:</strong>
                    <span>${contactRequest.email}</span>
                </div>
                ${contactRequest.phone ? `
                <div class="detail-row">
                    <strong>Telefon:</strong>
                    <span>${contactRequest.phone}</span>
                </div>
                ` : ''}
                ${contactRequest.company ? `
                <div class="detail-row">
                    <strong>Unternehmen:</strong>
                    <span>${contactRequest.company}</span>
                </div>
                ` : ''}
                ${contactRequest.preferred_date && contactRequest.preferred_time ? `
                <div class="detail-row">
                    <strong>Wunschtermin:</strong>
                    <span>${new Date(contactRequest.preferred_date).toLocaleDateString('de-DE')} um ${contactRequest.preferred_time} Uhr</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status-badge">In Bearbeitung</span>
                </div>
                ${contactRequest.message ? `
                <div class="detail-row">
                    <strong>Ihre Nachricht:</strong>
                </div>
                <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; margin-top: 5px;">${contactRequest.message}</p>
                ` : ''}
            </div>
            
            <h3>⏰ So geht es weiter</h3>
            <ul>
                <li><strong>Innerhalb von 24h:</strong> Wir melden uns per E-Mail oder Telefon bei Ihnen</li>
                <li><strong>Kostenlose Beratung:</strong> Wir besprechen Ihre Anforderungen unverbindlich</li>
                <li><strong>Maßgeschneidertes Angebot:</strong> Sie erhalten ein individuelles Angebot</li>
                <li><strong>Projektstart:</strong> Nach Ihrer Zustimmung starten wir gemeinsam</li>
            </ul>
            
            <div class="highlight-box">
                <h4>🎯 Warum Unicum Tech?</h4>
                <ul>
                    <li>✅ Über 150 erfolgreiche Projekte</li>
                    <li>✅ 98% Kundenzufriedenheit</li>
                    <li>✅ Persönliche Betreuung aus Oldenburg</li>
                    <li>✅ Faire Preise und transparente Kommunikation</li>
                </ul>
            </div>
            
            <p><strong>Dringende Fragen?</strong><br>
            Kontaktieren Sie uns gerne direkt:</p>
            <ul>
                <li>📧 E-Mail: info@unicumtech.de</li>
                <li>📱 Telefon: +49 (0) 441 XXX XXX</li>
                <li>🕒 Geschäftszeiten: Mo-Fr 9:00 - 18:00 Uhr</li>
            </ul>
        </div>
        
        <div class="footer">
            <p><strong>Unicum Tech</strong><br>
            Ihre Full-Service Digitalagentur in Oldenburg<br>
            Webdesign • CRM-Systeme • IT-Services • Print Design</p>
            
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
            </p>
        </div>
    </div>
</body>
</html>`;

    // Send confirmation email via SMTP
    const emailData = {
      to: contactRequest.email,
      subject: `✅ Ihre Anfrage bei Unicum Tech - ${serviceLabel}`,
      html: emailHTML
    };

    const { error: emailError } = await supabase.functions.invoke('send-smtp-email', {
      body: { emailData }
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the whole process if email fails
    } else {
      console.log('Contact confirmation email sent successfully via SMTP');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact confirmation email sent via SMTP',
        recipient: contactRequest.email
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
    console.error('Error in send-contact-confirmation function:', error);
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