import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { appointment_id, action = 'create' } = await req.json()

    if (!appointment_id) {
      throw new Error('appointment_id is required')
    }

    console.log(`Syncing appointment ${appointment_id} to Google Calendar (${action})`)

    // Get appointment data with contact request info
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .select(`
        *,
        contact_requests (
          name,
          email,
          company,
          service_type,
          message
        )
      `)
      .eq('id', appointment_id)
      .single()

    if (aptError || !appointment) {
      throw new Error('Appointment not found')
    }

    // Get OAuth token (using service key for admin operations)
    const { data: tokenData, error: tokenError } = await supabase
      .from('google_oauth_tokens')
      .select('*')
      .limit(1)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Google Calendar not connected. Please connect first.')
    }

    // Check if token is expired and refresh if needed
    const expiresAt = new Date(tokenData.expires_at)
    let accessToken = tokenData.access_token

    if (expiresAt <= new Date()) {
      console.log('Token expired, refreshing...')
      const refreshResult = await refreshToken(tokenData.refresh_token)
      accessToken = refreshResult.access_token
      
      // Update token in DB
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
      .select('calendar_id, buffer_minutes')
      .eq('is_active', true)
      .single()

    const calendarId = settings?.calendar_id || 'primary'
    const contactRequest = appointment.contact_requests

    // Build Google Calendar event
    const startDateTime = new Date(`${appointment.scheduled_date}T${appointment.scheduled_time}`)
    const endDateTime = new Date(startDateTime.getTime() + appointment.duration_minutes * 60000)

    const event = {
      summary: `Termin: ${contactRequest?.name || 'Kunde'}`,
      description: `
Service: ${contactRequest?.service_type || 'Beratung'}
Firma: ${contactRequest?.company || 'N/A'}
Typ: ${getMeetingTypeLabel(appointment.meeting_type)}
${contactRequest?.message ? `\nNachricht: ${contactRequest.message}` : ''}
${appointment.meeting_link ? `\nMeeting-Link: ${appointment.meeting_link}` : ''}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Berlin',
      },
      attendees: contactRequest?.email ? [{ email: contactRequest.email }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }

    let googleEventId = appointment.google_event_id
    let response

    if (action === 'delete' && googleEventId) {
      // Delete event
      response = await fetch(
        `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${googleEventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      
      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to delete event from Google Calendar')
      }

      // Update appointment
      await supabase
        .from('appointments')
        .update({
          google_event_id: null,
          google_calendar_synced: false,
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', appointment_id)

    } else if (action === 'update' && googleEventId) {
      // Update existing event
      response = await fetch(
        `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${googleEventId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to update event')
      }

    } else {
      // Create new event
      response = await fetch(
        `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to create event')
      }

      const eventData = await response.json()
      googleEventId = eventData.id

      // Update appointment with Google Event ID
      await supabase
        .from('appointments')
        .update({
          google_event_id: googleEventId,
          google_calendar_synced: true,
          last_synced_at: new Date().toISOString(),
          sync_error: null,
        })
        .eq('id', appointment_id)
    }

    // Log sync
    await supabase
      .from('google_calendar_sync_log')
      .insert({
        appointment_id,
        sync_type: 'push',
        status: 'success',
        google_event_id: googleEventId,
        sync_data: { action },
      })

    console.log(`Appointment ${action}d successfully in Google Calendar`)

    return new Response(
      JSON.stringify({
        success: true,
        google_event_id: googleEventId,
        action,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Sync error:', error)

    // Log error
    const body = await req.json().catch(() => ({}))
    if (body.appointment_id) {
      await supabase
        .from('google_calendar_sync_log')
        .insert({
          appointment_id: body.appointment_id,
          sync_type: 'push',
          status: 'error',
          error_message: error instanceof Error ? error.message : String(error),
        })

      await supabase
        .from('appointments')
        .update({
          sync_error: error instanceof Error ? error.message : String(error),
        })
        .eq('id', body.appointment_id)
    }

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

async function refreshToken(refreshToken: string) {
  const client_id = Deno.env.get('GOOGLE_CLIENT_ID')
  const client_secret = Deno.env.get('GOOGLE_CLIENT_SECRET')

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: client_id!,
      client_secret: client_secret!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error_description || data.error)
  return data
}

function getMeetingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    online: 'Video-Call',
    phone: 'Telefon',
    office: 'Vor Ort (Büro)',
    client: 'Vor Ort (Kunde)',
  }
  return labels[type] || type
}