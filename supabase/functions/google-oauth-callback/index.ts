import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirect_uri } = await req.json();
    
    const client_id = Deno.env.get('GOOGLE_CLIENT_ID');
    const client_secret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (!client_id || !client_secret) {
      console.error('Missing Google OAuth credentials');
      throw new Error('Google OAuth credentials not configured in Supabase Secrets');
    }

    if (!code) {
      throw new Error('Authorization code is required');
    }

    console.log('Exchanging authorization code for tokens...');
    console.log('Using redirect_uri:', redirect_uri);

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData);
      throw new Error(tokenData.error_description || tokenData.error);
    }

    console.log('Token exchange successful, storing tokens...');

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

    // Store tokens in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header if available
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // First, delete any existing tokens to avoid conflicts
    await supabase
      .from('google_oauth_tokens')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new token
    const { error: dbError } = await supabase
      .from('google_oauth_tokens')
      .insert({
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type || 'Bearer',
        expires_at: expiresAt.toISOString(),
        scope: tokenData.scope,
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store OAuth tokens: ' + dbError.message);
    }

    console.log('Tokens stored successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Google Calendar erfolgreich verbunden',
        expires_at: expiresAt.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
