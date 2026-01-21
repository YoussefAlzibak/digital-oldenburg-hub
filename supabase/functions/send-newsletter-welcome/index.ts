import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterWelcomeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

// Einheitliche Farben
const colors = {
  primaryDark: '#1e3a5f',
  primaryMid: '#2d5a87',
  accent: '#4ecdc4',
  accentHover: '#44a08d',
  textDark: '#1e3a5f',
  textBody: '#4a5568',
  textSubtitle: '#8ec5fc',
  textFooter: '#6b8eb8',
  bgPage: '#f4f4f7',
  bgCard: '#ffffff',
  bgHighlight: '#f0f9ff',
  bgHighlightEnd: '#e0f2fe',
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

    const { email, firstName, lastName }: NewsletterWelcomeRequest = await req.json();
    
    console.log('Sending newsletter welcome email to:', email);

    const displayName = firstName || 'Kunde';
    const currentYear = new Date().getFullYear();
    const websiteUrl = 'https://digital-oldenburg-hub.onrender.com';
    
    // Generiere Abmelde-Link mit Base64-kodierter E-Mail
    const unsubscribeToken = btoa(email);
    const unsubscribeUrl = `${websiteUrl}/unsubscribe?email=${unsubscribeToken}`;
    const deleteDataUrl = `${websiteUrl}/unsubscribe?email=${unsubscribeToken}&action=delete`;

    // Einheitliches Template Design
    const emailHTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Willkommen bei Unicum Tech!</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.bgPage}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${colors.bgPage};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: ${colors.bgCard}; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMid} 50%, ${colors.primaryDark} 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
                <span style="color: ${colors.accent};">Unicum</span><span style="color: #ffffff;">Tech</span>
              </h1>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: ${colors.textSubtitle}; text-transform: uppercase; letter-spacing: 2px;">Willkommen in der Community</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: ${colors.textDark}; font-size: 24px;">🎉 Hallo ${displayName}!</h2>
              
              <p style="margin: 0 0 20px 0; color: ${colors.textBody}; font-size: 16px; line-height: 1.7;">
                Vielen Dank für Ihre Anmeldung zu unserem Newsletter! Sie sind jetzt Teil unserer exklusiven Community und erhalten regelmäßig Updates zu:
              </p>
              
              <!-- Benefits Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, ${colors.bgHighlight} 0%, ${colors.bgHighlightEnd} 100%); border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 25px; border-left: 4px solid ${colors.accent};">
                    <h3 style="margin: 0 0 15px 0; color: ${colors.textDark}; font-size: 18px;">🎯 Das erwartet Sie:</h3>
                    <p style="margin: 0; color: ${colors.textBody}; font-size: 15px; line-height: 1.8;">
                      • <strong>Digitale Trends & Insights</strong> – Neueste Entwicklungen<br>
                      • <strong>Praktische Tipps & Tutorials</strong> – Für Ihren Erfolg<br>
                      • <strong>Exklusive Angebote</strong> – Nur für Newsletter-Abonnenten<br>
                      • <strong>Case Studies</strong> – Echte Erfolgsgeschichten
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${websiteUrl}/services" style="display: inline-block; background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentHover} 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Unsere Services entdecken →</a>
              </p>
              
              <p style="margin: 25px 0 0 0; color: ${colors.textBody}; font-size: 16px; line-height: 1.7;">
                Freuen Sie sich auf spannende Inhalte!
              </p>
              
              <p style="margin: 20px 0 0 0; color: ${colors.textDark}; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: ${colors.primaryDark}; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                <span style="color: ${colors.accent};">Unicum</span><span style="color: #ffffff;">Tech</span>
              </p>
              <p style="margin: 0 0 15px 0; font-size: 13px; color: ${colors.textSubtitle};">Digital Solutions by Melyou</p>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: ${colors.textFooter};">
                Web-Entwicklung • Mobile Apps • Branding • IT-Lösungen
              </p>
              <p style="margin: 0; font-size: 12px; color: ${colors.textFooter};">
                <a href="${websiteUrl}" style="color: ${colors.accent}; text-decoration: none;">Website</a> | 
                <a href="${websiteUrl}/contact" style="color: ${colors.accent}; text-decoration: none;">Kontakt</a> | 
                <a href="${unsubscribeUrl}" style="color: ${colors.accent}; text-decoration: none;">Abmelden</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 11px; color: ${colors.textFooter};">
                © ${currentYear} Unicum Tech. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailData = {
      to: email,
      subject: `🎉 Willkommen bei Unicum Tech, ${displayName}!`,
      html: emailHTML
    };

    const { error: emailError } = await supabase.functions.invoke('send-smtp-email', {
      body: { emailData }
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      throw emailError;
    }

    console.log('Newsletter welcome email sent successfully via SMTP');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Newsletter welcome email sent via SMTP',
        recipient: email
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
    console.error('Error in send-newsletter-welcome function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Fehler beim Senden der Willkommensmail' 
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
