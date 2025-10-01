import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const settings: SMTPSettings = await req.json();
    console.log('Testing SMTP connection for host:', settings.host);

    const result = await testSMTPConnection(settings);

    if (result.success) {
      console.log('SMTP connection test successful');
      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } else {
      console.error('SMTP connection test failed:', result.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.error || 'Connection failed'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
  } catch (error: any) {
    console.error('SMTP connection test failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Connection failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
};

async function testSMTPConnection(settings: SMTPSettings): Promise<{ success: boolean; error?: string }> {
  let conn: Deno.Conn | null = null;
  
  try {
    // Connect to SMTP server
    console.log(`Connecting to ${settings.host}:${settings.port}`);
    conn = await Deno.connect({
      hostname: settings.host,
      port: settings.port,
    });

    // Read initial greeting
    const greeting = await readResponse(conn);
    console.log('Server greeting:', greeting);
    
    if (!greeting.startsWith('220')) {
      throw new Error(`Unexpected greeting: ${greeting}`);
    }

    // Send EHLO
    await sendCommand(conn, `EHLO localhost\r\n`);
    const ehloResponse = await readResponse(conn);
    console.log('EHLO response:', ehloResponse);

    // Check for STARTTLS support if not using secure connection
    if (!settings.secure && settings.port !== 465) {
      if (ehloResponse.includes('STARTTLS')) {
        await sendCommand(conn, 'STARTTLS\r\n');
        const tlsResponse = await readResponse(conn);
        console.log('STARTTLS response:', tlsResponse);
        
        if (tlsResponse.startsWith('220')) {
          // Upgrade to TLS
          const tlsConn = await Deno.startTls(conn, {
            hostname: settings.host,
          });
          conn = tlsConn;
          
          // Send EHLO again after TLS
          await sendCommand(conn, `EHLO localhost\r\n`);
          await readResponse(conn);
        }
      }
    }

    // Authenticate
    await sendCommand(conn, 'AUTH LOGIN\r\n');
    await readResponse(conn);

    // Send username (base64 encoded)
    const usernameB64 = btoa(settings.username);
    await sendCommand(conn, `${usernameB64}\r\n`);
    await readResponse(conn);

    // Send password (base64 encoded)
    const passwordB64 = btoa(settings.password);
    await sendCommand(conn, `${passwordB64}\r\n`);
    const authResponse = await readResponse(conn);
    
    if (!authResponse.startsWith('235')) {
      throw new Error(`Authentication failed: ${authResponse}`);
    }

    console.log('Authentication successful');

    // Send QUIT
    await sendCommand(conn, 'QUIT\r\n');
    await readResponse(conn);

    return { success: true };
    
  } catch (error: any) {
    console.error('SMTP test error:', error);
    return { 
      success: false, 
      error: error.message || 'Connection test failed' 
    };
  } finally {
    if (conn) {
      try {
        conn.close();
      } catch (e) {
        console.error('Error closing connection:', e);
      }
    }
  }
}

async function readResponse(conn: Deno.Conn): Promise<string> {
  const buffer = new Uint8Array(4096);
  const bytesRead = await conn.read(buffer);
  if (!bytesRead) throw new Error('Connection closed');
  
  const response = new TextDecoder().decode(buffer.subarray(0, bytesRead));
  return response.trim();
}

async function sendCommand(conn: Deno.Conn, command: string): Promise<void> {
  const encoder = new TextEncoder();
  await conn.write(encoder.encode(command));
}

serve(handler);
