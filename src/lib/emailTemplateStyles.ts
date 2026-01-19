// Einheitliches E-Mail Template Design System für Unicum Tech
// Alle Templates verwenden diese konsistenten Styles

export const emailColors = {
  // Primary Brand Colors
  primaryDark: '#1e3a5f',      // Header/Footer Hintergrund
  primaryMid: '#2d5a87',       // Gradient Mitte
  accent: '#4ecdc4',           // Akzent (Buttons, Links, Highlights)
  accentHover: '#44a08d',      // Button Hover
  
  // Text Colors
  textDark: '#1e3a5f',         // Überschriften
  textBody: '#4a5568',         // Fließtext
  textLight: '#64748b',        // Muted Text
  textFooter: '#6b8eb8',       // Footer Links
  textSubtitle: '#8ec5fc',     // Subtitles im Header
  
  // Background Colors
  bgPage: '#f4f4f7',           // Seiten-Hintergrund
  bgCard: '#ffffff',           // Karten-Hintergrund
  bgHighlight: '#f0f9ff',      // Highlight-Boxen
  bgHighlightEnd: '#e0f2fe',   // Highlight-Gradient Ende
  bgSuccess: '#ecfdf5',        // Erfolg-Hintergrund
  bgWarning: '#fef3c7',        // Warnung/Tipp-Hintergrund
  
  // Status Colors
  successGreen: '#10b981',
  successGreenDark: '#059669',
  warningYellow: '#fef3c7',
} as const;

export const emailFonts = {
  primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
} as const;

// Einheitlicher E-Mail Header
export const getEmailHeader = (subtitle?: string): string => `
<!-- Header -->
<tr>
  <td style="background: linear-gradient(135deg, ${emailColors.primaryDark} 0%, ${emailColors.primaryMid} 50%, ${emailColors.primaryDark} 100%); padding: 40px; text-align: center;">
    <h1 style="margin: 0; font-size: 32px; font-weight: 800;">
      <span style="color: ${emailColors.accent};">Unicum</span><span style="color: #ffffff;">Tech</span>
    </h1>
    ${subtitle ? `<p style="margin: 15px 0 0 0; font-size: 14px; color: ${emailColors.textSubtitle}; text-transform: uppercase; letter-spacing: 2px;">${subtitle}</p>` : ''}
  </td>
</tr>`;

// Einheitlicher E-Mail Footer mit Abmelde-Link
export const getEmailFooter = (includeUnsubscribe: boolean = true): string => `
<!-- Footer -->
<tr>
  <td style="background-color: ${emailColors.primaryDark}; padding: 30px 40px; text-align: center;">
    <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
      <span style="color: ${emailColors.accent};">Unicum</span><span style="color: #ffffff;">Tech</span>
    </p>
    <p style="margin: 0 0 15px 0; font-size: 13px; color: ${emailColors.textSubtitle};">Digital Solutions by Melyou</p>
    <p style="margin: 0 0 10px 0; font-size: 12px; color: ${emailColors.textFooter};">
      Web-Entwicklung • Mobile Apps • Branding • IT-Lösungen
    </p>
    <p style="margin: 0; font-size: 12px; color: ${emailColors.textFooter};">
      <a href="{{website_url}}" style="color: ${emailColors.accent}; text-decoration: none;">Website</a> | 
      <a href="{{website_url}}/contact" style="color: ${emailColors.accent}; text-decoration: none;">Kontakt</a>${includeUnsubscribe ? ` | 
      <a href="{{unsubscribe_url}}" style="color: ${emailColors.accent}; text-decoration: none;">Abmelden</a>` : ''}
    </p>
    <p style="margin: 15px 0 0 0; font-size: 11px; color: ${emailColors.textFooter};">
      © {{current_year}} {{company_name}}. Alle Rechte vorbehalten.
    </p>
  </td>
</tr>`;

// Einheitlicher Button-Style
export const getEmailButton = (text: string, url: string): string => `
<a href="${url}" style="display: inline-block; background: linear-gradient(135deg, ${emailColors.accent} 0%, ${emailColors.accentHover} 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${text}</a>`;

// Einheitliche Highlight-Box
export const getHighlightBox = (title: string, content: string): string => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, ${emailColors.bgHighlight} 0%, ${emailColors.bgHighlightEnd} 100%); border-radius: 8px; margin: 25px 0;">
  <tr>
    <td style="padding: 25px; border-left: 4px solid ${emailColors.accent};">
      <h3 style="margin: 0 0 10px 0; color: ${emailColors.textDark}; font-size: 18px;">${title}</h3>
      <p style="margin: 0; color: ${emailColors.textBody}; font-size: 15px; line-height: 1.6;">
        ${content}
      </p>
    </td>
  </tr>
</table>`;

// Komplettes E-Mail Template Wrapper
export const getEmailWrapper = (content: string): string => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{company_name}}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${emailColors.bgPage}; font-family: ${emailFonts.primary};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${emailColors.bgPage};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: ${emailColors.bgCard}; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// Vordefinierte einheitliche Templates
export const unifiedTemplates = {
  newsletterWelcome: {
    name: "Newsletter Willkommen",
    subject: "🎉 Willkommen bei {{company_name}}, {{first_name}}!",
    template_type: "automation",
    html_content: getEmailWrapper(`
      ${getEmailHeader('Willkommen in der Community')}
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px;">
          <h2 style="margin: 0 0 20px 0; color: ${emailColors.textDark}; font-size: 24px;">Hallo {{first_name}},</h2>
          
          <p style="margin: 0 0 20px 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Vielen Dank für Ihre Anmeldung zu unserem Newsletter! Sie sind jetzt Teil unserer exklusiven Community und erhalten regelmäßig Updates zu:
          </p>
          
          ${getHighlightBox('🎯 Das erwartet Sie:', `
            • <strong>Digitale Trends & Insights</strong> – Neueste Entwicklungen<br>
            • <strong>Praktische Tipps & Tutorials</strong> – Für Ihren Erfolg<br>
            • <strong>Exklusive Angebote</strong> – Nur für Newsletter-Abonnenten<br>
            • <strong>Case Studies</strong> – Echte Erfolgsgeschichten
          `)}
          
          <p style="text-align: center; margin: 30px 0;">
            ${getEmailButton('Unsere Services entdecken →', '{{website_url}}/services')}
          </p>
          
          <p style="margin: 25px 0 0 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Freuen Sie sich auf spannende Inhalte!
          </p>
          
          <p style="margin: 20px 0 0 0; color: ${emailColors.textDark}; font-size: 16px;">
            Mit freundlichen Grüßen,<br>
            <strong>Das {{company_name}} Team</strong>
          </p>
        </td>
      </tr>
      
      ${getEmailFooter(true)}
    `),
    text_content: `Hallo {{first_name}},

Vielen Dank für Ihre Anmeldung zu unserem Newsletter!

Sie sind jetzt Teil unserer exklusiven Community und erhalten regelmäßig Updates zu:
• Digitale Trends & Insights
• Praktische Tipps & Tutorials
• Exklusive Angebote
• Case Studies & Erfolgsgeschichten

Unsere Services: {{website_url}}/services

Freuen Sie sich auf spannende Inhalte!

Mit freundlichen Grüßen,
Das {{company_name}} Team

---
Abmelden: {{unsubscribe_url}}`
  },

  newsletterUnsubscribe: {
    name: "Newsletter Abmeldung Bestätigung",
    subject: "Schade, dass Sie gehen - Abmeldung bestätigt",
    template_type: "transactional",
    html_content: getEmailWrapper(`
      ${getEmailHeader('Abmeldung bestätigt')}
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px;">
          <h2 style="margin: 0 0 20px 0; color: ${emailColors.textDark}; font-size: 24px;">Hallo {{first_name}},</h2>
          
          <p style="margin: 0 0 20px 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Ihre Abmeldung von unserem Newsletter wurde erfolgreich verarbeitet. Sie werden keine weiteren Marketing-E-Mails von uns erhalten.
          </p>
          
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${emailColors.bgWarning}; border-radius: 8px; margin: 25px 0;">
            <tr>
              <td style="padding: 20px; text-align: center;">
                <p style="margin: 0; color: ${emailColors.textDark}; font-size: 15px;">
                  💭 <strong>Wir würden gerne wissen:</strong><br>
                  Was könnten wir besser machen?
                </p>
              </td>
            </tr>
          </table>
          
          <p style="margin: 0 0 20px 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Falls Sie Ihre Meinung ändern, können Sie sich jederzeit wieder anmelden. Wir freuen uns, Sie wiederzusehen!
          </p>
          
          <p style="text-align: center; margin: 30px 0;">
            ${getEmailButton('Wieder anmelden →', '{{website_url}}')}
          </p>
          
          <p style="margin: 20px 0 0 0; color: ${emailColors.textDark}; font-size: 16px;">
            Mit freundlichen Grüßen,<br>
            <strong>Das {{company_name}} Team</strong>
          </p>
        </td>
      </tr>
      
      ${getEmailFooter(false)}
    `),
    text_content: `Hallo {{first_name}},

Ihre Abmeldung von unserem Newsletter wurde erfolgreich verarbeitet.
Sie werden keine weiteren Marketing-E-Mails von uns erhalten.

Falls Sie Ihre Meinung ändern, können Sie sich jederzeit wieder anmelden:
{{website_url}}

Wir würden gerne wissen: Was könnten wir besser machen?

Mit freundlichen Grüßen,
Das {{company_name}} Team`
  },

  appointmentConfirmation: {
    name: "Terminbestätigung",
    subject: "✓ Ihr Termin bei {{company_name}} - {{appointment_date}} um {{appointment_time}}",
    template_type: "transactional",
    html_content: getEmailWrapper(`
      ${getEmailHeader('Terminbestätigung')}
      
      <!-- Success Banner -->
      <tr>
        <td style="background: linear-gradient(135deg, ${emailColors.successGreen} 0%, ${emailColors.successGreenDark} 100%); padding: 20px; text-align: center;">
          <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">✓ Termin erfolgreich bestätigt</p>
        </td>
      </tr>
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px;">
          <h2 style="margin: 0 0 20px 0; color: ${emailColors.textDark}; font-size: 22px;">Hallo {{first_name}},</h2>
          
          <p style="margin: 0 0 25px 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Ihr Beratungstermin bei {{company_name}} wurde erfolgreich bestätigt. Wir freuen uns auf das Gespräch mit Ihnen!
          </p>
          
          <!-- Appointment Details Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 2px solid ${emailColors.accent}; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="background: ${emailColors.accent}; padding: 15px 20px;">
                <p style="margin: 0; color: ${emailColors.textDark}; font-size: 16px; font-weight: 700;">📅 Ihre Termindetails</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: ${emailColors.textLight}; font-size: 14px; width: 120px;">Datum:</td>
                    <td style="color: ${emailColors.textDark}; font-size: 15px; font-weight: 600;">{{appointment_date}}</td>
                  </tr>
                  <tr>
                    <td style="color: ${emailColors.textLight}; font-size: 14px;">Uhrzeit:</td>
                    <td style="color: ${emailColors.textDark}; font-size: 15px; font-weight: 600;">{{appointment_time}}</td>
                  </tr>
                  <tr>
                    <td style="color: ${emailColors.textLight}; font-size: 14px;">Meeting-Art:</td>
                    <td style="color: ${emailColors.textDark}; font-size: 15px; font-weight: 600;">{{meeting_type}}</td>
                  </tr>
                  <tr>
                    <td style="color: ${emailColors.textLight}; font-size: 14px;">Service:</td>
                    <td style="color: ${emailColors.textDark}; font-size: 15px; font-weight: 600;">{{service_type}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <p style="text-align: center; margin: 30px 0;">
            ${getEmailButton('Zum Meeting →', '{{meeting_link}}')}
          </p>
          
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${emailColors.bgWarning}; border-radius: 8px; margin: 25px 0;">
            <tr>
              <td style="padding: 15px 20px; text-align: center;">
                <p style="margin: 0; color: ${emailColors.textDark}; font-size: 14px;">
                  💡 <strong>Tipp:</strong> Fügen Sie den Termin zu Ihrem Kalender hinzu!
                </p>
              </td>
            </tr>
          </table>
          
          <p style="margin: 20px 0 0 0; color: ${emailColors.textDark}; font-size: 16px;">
            Mit freundlichen Grüßen,<br>
            <strong>Das {{company_name}} Team</strong>
          </p>
        </td>
      </tr>
      
      ${getEmailFooter(false)}
    `),
    text_content: `Hallo {{first_name}},

Ihr Beratungstermin bei {{company_name}} wurde erfolgreich bestätigt!

TERMINDETAILS:
--------------
Datum: {{appointment_date}}
Uhrzeit: {{appointment_time}}
Meeting-Art: {{meeting_type}}
Service: {{service_type}}

Meeting-Link: {{meeting_link}}

Tipp: Fügen Sie den Termin zu Ihrem Kalender hinzu!

Mit freundlichen Grüßen,
Das {{company_name}} Team`
  },

  contactFollowUp: {
    name: "Kontaktanfrage Bestätigung",
    subject: "Danke für Ihre Anfrage, {{first_name}} - {{company_name}}",
    template_type: "transactional",
    html_content: getEmailWrapper(`
      ${getEmailHeader('Anfrage erhalten')}
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px;">
          <h2 style="margin: 0 0 20px 0; color: ${emailColors.textDark}; font-size: 22px;">Vielen Dank für Ihr Interesse!</h2>
          
          <p style="margin: 0 0 20px 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Hallo {{first_name}},<br><br>
            vielen Dank für Ihre Anfrage bezüglich <strong>{{service_type}}</strong>. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.
          </p>
          
          <!-- Request Summary -->
          ${getHighlightBox('📋 Ihre Anfrage im Überblick', `
            <strong>Service:</strong> {{service_type}}<br>
            <strong>Unternehmen:</strong> {{company}}
          `)}
          
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${emailColors.bgSuccess}; border-radius: 8px; margin: 25px 0;">
            <tr>
              <td style="padding: 20px; text-align: center;">
                <p style="margin: 0; color: ${emailColors.successGreenDark}; font-size: 15px;">
                  ⏱️ <strong>Wir melden uns innerhalb von 24 Stunden bei Ihnen!</strong>
                </p>
              </td>
            </tr>
          </table>
          
          <p style="text-align: center; margin: 30px 0;">
            ${getEmailButton('Unsere Services entdecken →', '{{website_url}}/services')}
          </p>
          
          <p style="margin: 20px 0 0 0; color: ${emailColors.textDark}; font-size: 16px;">
            Mit freundlichen Grüßen,<br>
            <strong>Das {{company_name}} Team</strong>
          </p>
        </td>
      </tr>
      
      ${getEmailFooter(false)}
    `),
    text_content: `Vielen Dank für Ihr Interesse!

Hallo {{first_name}},

vielen Dank für Ihre Anfrage bezüglich {{service_type}}.

IHRE ANFRAGE IM ÜBERBLICK:
--------------------------
Service: {{service_type}}
Unternehmen: {{company}}

Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.
Wir melden uns innerhalb von 24 Stunden bei Ihnen!

Unsere Services: {{website_url}}/services

Mit freundlichen Grüßen,
Das {{company_name}} Team`
  },

  newsletterStandard: {
    name: "Newsletter Standard",
    subject: "{{company_name}} Newsletter - {{current_month}} {{current_year}}",
    template_type: "newsletter",
    html_content: getEmailWrapper(`
      ${getEmailHeader('Newsletter {{current_month}} {{current_year}}')}
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px;">
          <h2 style="margin: 0 0 20px 0; color: ${emailColors.textDark}; font-size: 24px;">Hallo {{first_name}},</h2>
          
          <p style="margin: 0 0 20px 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Willkommen zu unserem aktuellen Newsletter! Hier finden Sie die neuesten Updates und Entwicklungen aus der Welt der digitalen Lösungen bei {{company_name}}.
          </p>
          
          ${getHighlightBox('✨ Was gibt es Neues?', 'Entdecken Sie unsere neuesten Services und innovativen Lösungen für Ihr Unternehmen.')}
          
          <p style="text-align: center; margin: 30px 0;">
            ${getEmailButton('Mehr erfahren →', '{{website_url}}/services')}
          </p>
          
          <p style="margin: 25px 0 0 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Vielen Dank für Ihr Vertrauen in {{company_name}}!
          </p>
          
          <p style="margin: 20px 0 0 0; color: ${emailColors.textDark}; font-size: 16px;">
            Mit freundlichen Grüßen,<br>
            <strong>Das {{company_name}} Team</strong>
          </p>
        </td>
      </tr>
      
      ${getEmailFooter(true)}
    `),
    text_content: `Hallo {{first_name}},

Willkommen zu unserem Newsletter für {{current_month}} {{current_year}}!

WAS GIBT ES NEUES?
Entdecken Sie unsere neuesten Services und innovativen Lösungen für Ihr Unternehmen.

Mehr erfahren: {{website_url}}/services

Vielen Dank für Ihr Vertrauen in {{company_name}}!

Mit freundlichen Grüßen,
Das {{company_name}} Team

---
Abmelden: {{unsubscribe_url}}`
  },

  appointmentReminder: {
    name: "Termin-Erinnerung",
    subject: "⏰ Erinnerung: Ihr Termin morgen bei {{company_name}}",
    template_type: "transactional",
    html_content: getEmailWrapper(`
      ${getEmailHeader('Termin-Erinnerung')}
      
      <!-- Reminder Banner -->
      <tr>
        <td style="background: ${emailColors.bgWarning}; padding: 20px; text-align: center;">
          <p style="margin: 0; color: ${emailColors.textDark}; font-size: 18px; font-weight: 600;">⏰ Erinnerung an Ihren bevorstehenden Termin</p>
        </td>
      </tr>
      
      <!-- Content -->
      <tr>
        <td style="padding: 40px;">
          <h2 style="margin: 0 0 20px 0; color: ${emailColors.textDark}; font-size: 22px;">Hallo {{first_name}},</h2>
          
          <p style="margin: 0 0 25px 0; color: ${emailColors.textBody}; font-size: 16px; line-height: 1.7;">
            Dies ist eine freundliche Erinnerung an Ihren bevorstehenden Termin bei {{company_name}}.
          </p>
          
          <!-- Appointment Details -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 2px solid ${emailColors.accent}; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="background: ${emailColors.accent}; padding: 15px 20px;">
                <p style="margin: 0; color: ${emailColors.textDark}; font-size: 16px; font-weight: 700;">📅 Ihre Termindetails</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: ${emailColors.textLight}; font-size: 14px; width: 120px;">Datum:</td>
                    <td style="color: ${emailColors.textDark}; font-size: 15px; font-weight: 600;">{{appointment_date}}</td>
                  </tr>
                  <tr>
                    <td style="color: ${emailColors.textLight}; font-size: 14px;">Uhrzeit:</td>
                    <td style="color: ${emailColors.textDark}; font-size: 15px; font-weight: 600;">{{appointment_time}}</td>
                  </tr>
                  <tr>
                    <td style="color: ${emailColors.textLight}; font-size: 14px;">Meeting-Art:</td>
                    <td style="color: ${emailColors.textDark}; font-size: 15px; font-weight: 600;">{{meeting_type}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <p style="text-align: center; margin: 30px 0;">
            ${getEmailButton('Zum Meeting →', '{{meeting_link}}')}
          </p>
          
          <p style="margin: 20px 0 0 0; color: ${emailColors.textDark}; font-size: 16px;">
            Mit freundlichen Grüßen,<br>
            <strong>Das {{company_name}} Team</strong>
          </p>
        </td>
      </tr>
      
      ${getEmailFooter(false)}
    `),
    text_content: `Hallo {{first_name}},

Dies ist eine freundliche Erinnerung an Ihren bevorstehenden Termin bei {{company_name}}.

TERMINDETAILS:
--------------
Datum: {{appointment_date}}
Uhrzeit: {{appointment_time}}
Meeting-Art: {{meeting_type}}

Meeting-Link: {{meeting_link}}

Wir freuen uns auf Sie!

Mit freundlichen Grüßen,
Das {{company_name}} Team`
  }
};
