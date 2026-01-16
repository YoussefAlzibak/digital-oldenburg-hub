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

    // Create Supabase client to access stored OAuth tokens
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get stored OAuth tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('google_oauth_tokens')
      .select('access_token, refresh_token, expires_at')
      .limit(1)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Keine OAuth-Verbindung gefunden. Bitte verbinden Sie zuerst Google Calendar über "Mit Google verbinden".')
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at)
    const now = new Date()
    let accessToken = tokenData.access_token

    if (expiresAt <= now) {
      // Token is expired, try to refresh
      if (!tokenData.refresh_token) {
        throw new Error('Access Token ist abgelaufen und kein Refresh Token vorhanden. Bitte verbinden Sie Google Calendar erneut.')
      }

      console.log('Access token expired, refreshing...')
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: client_id,
          client_secret: client_secret,
          refresh_token: tokenData.refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      const refreshData = await tokenResponse.json()

      if (!tokenResponse.ok || refreshData.error) {
        throw new Error(`Token-Aktualisierung fehlgeschlagen: ${refreshData.error_description || refreshData.error}`)
      }

      accessToken = refreshData.access_token

      // Update the stored token
      const newExpiresAt = new Date(Date.now() + (refreshData.expires_in || 3600) * 1000)
      await supabase
        .from('google_oauth_tokens')
        .update({
          access_token: accessToken,
          expires_at: newExpiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', tokenData.id || undefined)
    }

    // Make a real test request to Google Calendar API
    console.log('Making test request to Google Calendar API...')
    
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    const calendarData = await calendarResponse.json()

    if (!calendarResponse.ok) {
      if (calendarResponse.status === 401) {
        throw new Error('Authentifizierung fehlgeschlagen. Bitte verbinden Sie Google Calendar erneut.')
      } else if (calendarResponse.status === 404) {
        throw new Error(`Kalender "${calendar_id}" nicht gefunden. Überprüfen Sie die Kalender-ID.`)
      } else {
        throw new Error(`Google Calendar API Fehler: ${calendarData.error?.message || 'Unbekannter Fehler'}`)
      }
    }

    console.log('Google Calendar test successful:', calendarData.summary)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Google Calendar Verbindung erfolgreich getestet',
        calendar_name: calendarData.summary,
        calendar_timezone: calendarData.timeZone,
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