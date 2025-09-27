import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  secure: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const smtpSettings: SMTPSettings = await req.json();

    console.log('Testing SMTP connection to:', smtpSettings.host + ':' + smtpSettings.port);

    // Get password from secure secrets
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    if (!smtpPassword) {
      throw new Error('SMTP password not configured in secrets');
    }

    const fullSmtpSettings = {
      ...smtpSettings,
      password: smtpPassword
    };

    const result = await testSMTPConnection(fullSmtpSettings);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in test-smtp-connection function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function testSMTPConnection(smtp: SMTPSettings & { password: string }): Promise<{success: boolean; error?: string}> {
  try {
    console.log(`Testing connection to ${smtp.host}:${smtp.port}`);
    
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
      console.log('Test Command:', command.replace(/AUTH PLAIN .+/, 'AUTH PLAIN [HIDDEN]'));
      await conn.write(encoder.encode(command + '\r\n'));
      const response = await readResponse();
      console.log('Test Response:', response.trim());
      
      // Check for error codes
      if (response.startsWith('4') || response.startsWith('5')) {
        throw new Error(`SMTP Error: ${response.trim()}`);
      }
      
      return response;
    };

    try {
      // Read welcome message
      let response = await readResponse();
      console.log('Welcome:', response.trim());
      
      if (response.startsWith('4') || response.startsWith('5')) {
        throw new Error(`Server nicht bereit: ${response.trim()}`);
      }

      // EHLO
      await sendCommand(`EHLO ${smtp.host}`);

      // STARTTLS if secure and not on port 465
      if (smtp.secure && smtp.port !== 465) {
        await sendCommand('STARTTLS');
      }

      // Test authentication if credentials provided
      if (smtp.username && smtp.password) {
        await sendCommand('AUTH LOGIN');
        await sendCommand(btoa(smtp.username));
        await sendCommand(btoa(smtp.password));
      }

      // Gracefully disconnect
      await sendCommand('QUIT');
      
      conn.close();
      
      console.log('SMTP connection test successful');
      return { success: true };
      
    } catch (error) {
      conn.close();
      throw error;
    }
    
  } catch (error: any) {
    console.error('SMTP Connection Test Failed:', error);
    
    let errorMessage = 'Verbindungsfehler';
    
    if (error.message.includes('connection refused')) {
      errorMessage = 'Verbindung verweigert - Server nicht erreichbar';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Zeitüberschreitung - Server antwortet nicht';
    } else if (error.message.includes('authentication')) {
      errorMessage = 'Authentifizierung fehlgeschlagen - Benutzername/Passwort prüfen';
    } else if (error.message.includes('hostname')) {
      errorMessage = 'Hostname nicht gefunden';
    } else {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

serve(handler);