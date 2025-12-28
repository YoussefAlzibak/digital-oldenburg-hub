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

    const { email, firstName, lastName }: NewsletterWelcomeRequest = await req.json();
    
    console.log('Sending newsletter welcome email to:', email);

    const displayName = firstName || 'Kunde';

    // Create HTML welcome email
    const emailHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen beim Unicum Tech Newsletter!</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .welcome-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .benefit-item { display: flex; align-items: center; margin: 10px 0; }
        .footer { background: #333; color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; }
        .emoji { font-size: 24px; margin-right: 10px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Herzlich Willkommen!</h1>
            <p>Schön, dass Sie Teil der Unicum Tech Community sind!</p>
        </div>
        
        <div class="content">
            <div class="welcome-box">
                <h2>Hallo ${displayName}!</h2>
                <p style="font-size: 18px; margin: 20px 0;">
                    Vielen Dank für Ihre Anmeldung zu unserem Newsletter. 
                    Sie sind jetzt Teil unserer exklusiven Community und erhalten regelmäßig:
                </p>
            </div>
            
            <div class="benefits">
                <h3>🎯 Das erwartet Sie:</h3>
                <div class="benefit-item">
                    <span class="emoji">💡</span>
                    <div>
                        <strong>Digitale Trends & Insights</strong><br>
                        Neueste Entwicklungen in Webdesign, CRM und IT
                    </div>
                </div>
                <div class="benefit-item">
                    <span class="emoji">🛠️</span>
                    <div>
                        <strong>Praktische Tipps & Tutorials</strong><br>
                        Konkrete Hilfestellungen für Ihren digitalen Erfolg
                    </div>
                </div>
                <div class="benefit-item">
                    <span class="emoji">🎁</span>
                    <div>
                        <strong>Exklusive Angebote</strong><br>
                        Besondere Konditionen nur für Newsletter-Abonnenten
                    </div>
                </div>
                <div class="benefit-item">
                    <span class="emoji">📈</span>
                    <div>
                        <strong>Case Studies & Erfolgsgeschichten</strong><br>
                        Echte Projekte und deren Erfolgsfaktoren
                    </div>
                </div>
                <div class="benefit-item">
                    <span class="emoji">📅</span>
                    <div>
                        <strong>Event-Einladungen</strong><br>
                        Webinare, Workshops und Networking-Events
                    </div>
                </div>
            </div>
            
            <div class="highlight">
                <h4>🚀 Bereit für den digitalen Durchbruch?</h4>
                <p>
                    Falls Sie bereits konkrete Pläne für ein digitales Projekt haben, 
                    vereinbaren Sie gerne einen kostenlosen Beratungstermin mit uns. 
                    Als Newsletter-Abonnent erhalten Sie <strong>10% Rabatt</strong> 
                    auf alle unsere Services!
                </p>
                <p style="text-align: center; margin-top: 20px;">
                    <a href="https://unicumtech.de/contact" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        🎯 Kostenlose Beratung anfragen
                    </a>
                </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>📞 Haben Sie Fragen?</h4>
                <p>Unser Team steht Ihnen gerne zur Verfügung:</p>
                <ul style="margin: 10px 0;">
                    <li>📧 E-Mail: info@unicumtech.de</li>
                    <li>📱 Telefon: +49 (0) 441 XXX XXX</li>
                    <li>🕒 Geschäftszeiten: Mo-Fr 9:00 - 18:00 Uhr</li>
                </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
                Freuen Sie sich auf spannende Inhalte!<br>
                <strong>Ihr Unicum Tech Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Unicum Tech</strong><br>
            Ihre Full-Service Digitalagentur in Oldenburg<br>
            Webdesign • CRM-Systeme • IT-Services • Print Design</p>
            
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Sie können sich jederzeit <a href="#" style="color: #87CEEB;">hier abmelden</a>.
            </p>
        </div>
    </div>
</body>
</html>`;

    // Send welcome email via SMTP
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