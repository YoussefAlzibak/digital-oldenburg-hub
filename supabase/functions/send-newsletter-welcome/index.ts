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

// Fallback-Template nur wenn keins in DB gefunden wird
const getFallbackTemplate = (displayName: string, websiteUrl: string, unsubscribeUrl: string, currentYear: number): string => {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Willkommen bei Unicum Tech!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 24px;">Hallo ${displayName}!</h2>
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                Vielen Dank für Ihre Anmeldung zu unserem Newsletter!
              </p>
              <p style="margin: 20px 0 0 0; color: #1e3a5f; font-size: 16px;">
                Mit freundlichen Grüßen,<br>
                <strong>Das Unicum Tech Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1e3a5f; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6b8eb8;">
                <a href="${unsubscribeUrl}" style="color: #4ecdc4; text-decoration: none;">Abmelden</a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #6b8eb8;">
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
};

// Personalisiere Template-Inhalt mit Platzhaltern
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

    const { email, firstName, lastName }: NewsletterWelcomeRequest = await req.json();

    const displayName = firstName || 'Kunde';
    const currentYear = new Date().getFullYear();
    const websiteUrl = 'https://digital-oldenburg-hub.onrender.com';
    
    const unsubscribeToken = btoa(email);
    const unsubscribeUrl = `${websiteUrl}/unsubscribe?email=${unsubscribeToken}`;

    // Template aus Datenbank laden
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'Newsletter Willkommen')
      .eq('is_active', true)
      .single();

    let emailHTML: string;
    let subject: string;

    if (template && !templateError) {
      // Template aus DB verwenden
      const placeholders = {
        first_name: displayName,
        last_name: lastName || '',
        email: email,
        company_name: 'Unicum Tech',
        website_url: websiteUrl,
        unsubscribe_url: unsubscribeUrl,
        current_year: currentYear.toString(),
      };

      emailHTML = personalizeContent(template.html_content, placeholders);
      subject = personalizeContent(template.subject, placeholders);
    } else {
      // Fallback-Template verwenden
      emailHTML = getFallbackTemplate(displayName, websiteUrl, unsubscribeUrl, currentYear);
      subject = `🎉 Willkommen bei Unicum Tech, ${displayName}!`;
    }

    const emailData = {
      to: email,
      subject: subject,
      html: emailHTML
    };

    const { error: emailError } = await supabase.functions.invoke('send-smtp-email', {
      body: { emailData }
    });

    if (emailError) {
      throw emailError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Newsletter welcome email sent',
        recipient: email,
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
