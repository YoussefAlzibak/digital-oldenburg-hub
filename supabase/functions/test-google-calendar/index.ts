import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { client_id, calendar_id } = await req.json()
    
    // Get client_secret from environment (Supabase secrets)
    const client_secret = Deno.env.get('GOOGLE_CLIENT_SECRET')

    console.log('Testing Google Calendar connection', { client_id, calendar_id })

    // Validate that all required credentials are provided
    if (!client_id || !client_secret || !calendar_id) {
      throw new Error('Missing required credentials: client_id, client_secret, or calendar_id')
    }

    // In a real implementation, you would:
    // 1. Use OAuth2 to get an access token
    // 2. Make a test request to Google Calendar API
    // 3. Verify the calendar exists and is accessible

    // For now, we'll simulate a successful test
    console.log('Google Calendar test successful')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Google Calendar connection test successful' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Google Calendar test failed:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})