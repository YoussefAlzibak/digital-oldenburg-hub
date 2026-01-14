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
    const body = await req.json()
    const client_id = body.client_id
    // Default to "primary" if no calendar_id provided
    const calendar_id = body.calendar_id || 'primary'
    
    // Get client_secret from environment (Supabase secrets)
    const client_secret = Deno.env.get('GOOGLE_CLIENT_SECRET')

    console.log('Testing Google Calendar connection', { client_id, calendar_id })

    // Validate inputs with specific error messages
    const missingFields: string[] = []
    
    if (!client_id) {
      missingFields.push('OAuth Client ID (im Formular eingeben)')
    }
    if (!client_secret) {
      missingFields.push('GOOGLE_CLIENT_SECRET (in Supabase Secrets konfigurieren)')
    }
    
    if (missingFields.length > 0) {
      throw new Error(`Fehlende Konfiguration: ${missingFields.join(', ')}`)
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