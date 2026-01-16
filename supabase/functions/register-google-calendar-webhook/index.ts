import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { action = 'register' } = await req.json().catch(() => ({}))

    console.log(`Google Calendar webhook: ${action}`)

    // Get OAuth token
    const { data: tokenData, error: tokenError } = await supabase
      .from('google_oauth_tokens')
      .select('*')
      .limit(1)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Google Calendar not connected')
    }

    // Check and refresh token if needed
    let accessToken = tokenData.access_token
    const expiresAt = new Date(tokenData.expires_at)

    if (expiresAt <= new Date()) {
      const refreshResult = await refreshToken(tokenData.refresh_token)
      accessToken = refreshResult.access_token

      await supabase
        .from('google_oauth_tokens')
        .update({
          access_token: refreshResult.access_token,
          expires_at: new Date(Date.now() + refreshResult.expires_in * 1000).toISOString(),
        })
        .eq('id', tokenData.id)
    }

    // Get calendar settings
    const { data: settings } = await supabase
      .from('google_calendar_settings')
      .select('calendar_id')
      .eq('is_active', true)
      .single()

    const calendarId = settings?.calendar_id || 'primary'

    if (action === 'stop') {
      // Stop existing watch
      const channelId = req.headers.get('x-channel-id')
      const resourceId = req.headers.get('x-resource-id')

      if (channelId && resourceId) {
        const stopResponse = await fetch(
          `${GOOGLE_CALENDAR_API}/channels/stop`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: channelId,
              resourceId: resourceId,
            }),
          }
        )

        if (!stopResponse.ok) {
          console.error('Failed to stop watch:', await stopResponse.text())
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Watch stopped' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Register new watch
    const channelId = crypto.randomUUID()
    const webhookUrl = `${supabaseUrl}/functions/v1/process-google-calendar-webhook`
    const webhookSecret = Deno.env.get('GOOGLE_WEBHOOK_SECRET') || crypto.randomUUID()

    // Watch expires after 7 days (max allowed by Google)
    const expiration = Date.now() + 7 * 24 * 60 * 60 * 1000

    const watchResponse = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/watch`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: channelId,
          type: 'web_hook',
          address: webhookUrl,
          token: webhookSecret,
          expiration: expiration.toString(),
        }),
      }
    )

    if (!watchResponse.ok) {
      const error = await watchResponse.json()
      throw new Error(error.error?.message || 'Failed to register webhook')
    }

    const watchData = await watchResponse.json()

    console.log('Webhook registered successfully:', watchData)

    // Log registration
    await supabase
      .from('google_calendar_sync_log')
      .insert({
        sync_type: 'webhook',
        status: 'success',
        sync_data: {
          event: 'webhook_registered',
          channel_id: watchData.id,
          resource_id: watchData.resourceId,
          expiration: new Date(parseInt(watchData.expiration)).toISOString(),
        },
      })

    return new Response(
      JSON.stringify({
        success: true,
        channel_id: watchData.id,
        resource_id: watchData.resourceId,
        expiration: new Date(parseInt(watchData.expiration)).toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook registration error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function refreshToken(refreshTokenValue: string) {
  const client_id = Deno.env.get('GOOGLE_CLIENT_ID')
  const client_secret = Deno.env.get('GOOGLE_CLIENT_SECRET')

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: client_id!,
      client_secret: client_secret!,
      refresh_token: refreshTokenValue,
      grant_type: 'refresh_token',
    }),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error_description || data.error)
  return data
}
