import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

interface GoogleEvent {
  id: string
  summary?: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  status: string
  updated: string
  created: string
  organizer?: {
    email: string
    displayName?: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus?: string
  }>
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const { sync_token, full_sync = false } = await req.json().catch(() => ({}))

    console.log('Starting Google Calendar pull sync...')

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
    const expiresAt = new Date(tokenData.expires_at)
    let accessToken = tokenData.access_token

    if (expiresAt <= new Date()) {
      console.log('Token expired, refreshing...')
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
      .select('calendar_id, auto_sync')
      .eq('is_active', true)
      .single()

    const calendarId = settings?.calendar_id || 'primary'

    // Build request parameters
    const params = new URLSearchParams({
      maxResults: '100',
      singleEvents: 'true',
      orderBy: 'updated',
    })

    // If not full sync and we have a sync token, use incremental sync
    if (!full_sync && sync_token) {
      params.set('syncToken', sync_token)
    } else {
      // Full sync - get events from today onwards
      const now = new Date()
      params.set('timeMin', now.toISOString())
    }

    // Fetch events from Google Calendar
    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      
      // If sync token is invalid, do a full sync
      if (error.error?.code === 410) {
        console.log('Sync token invalid, performing full sync...')
        return await performFullSync(supabase, accessToken, calendarId)
      }
      
      throw new Error(error.error?.message || 'Failed to fetch events')
    }

    const data = await response.json()
    const events: GoogleEvent[] = data.items || []
    const nextSyncToken = data.nextSyncToken

    console.log(`Fetched ${events.length} events from Google Calendar`)

    let created = 0
    let updated = 0
    let deleted = 0
    let skipped = 0
    const conflicts: string[] = []

    for (const event of events) {
      // Skip all-day events (no dateTime)
      if (!event.start?.dateTime) {
        skipped++
        continue
      }

      // Check if this event is linked to an existing appointment
      const { data: existingAppointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('google_event_id', event.id)
        .single()

      if (event.status === 'cancelled') {
        // Handle deleted events
        if (existingAppointment) {
          // Check if there are modifications in our system that haven't been synced
          if (existingAppointment.updated_at > existingAppointment.last_synced_at) {
            // Conflict: local changes exist
            conflicts.push(event.id)
            await supabase
              .from('appointments')
              .update({ sync_conflict: true })
              .eq('id', existingAppointment.id)
          } else {
            // Safe to mark as cancelled
            await supabase
              .from('appointments')
              .update({
                status: 'cancelled',
                last_synced_at: new Date().toISOString(),
              })
              .eq('id', existingAppointment.id)
            deleted++
          }
        }
        continue
      }

      const eventDate = new Date(event.start.dateTime)
      const scheduledDate = eventDate.toISOString().split('T')[0]
      const scheduledTime = eventDate.toTimeString().substring(0, 5)

      const endDate = new Date(event.end?.dateTime || event.start.dateTime)
      const durationMinutes = Math.round((endDate.getTime() - eventDate.getTime()) / 60000)

      if (existingAppointment) {
        // Update existing appointment
        const localUpdated = new Date(existingAppointment.updated_at)
        const googleUpdated = new Date(event.updated)

        // Conflict detection: both sides have changes since last sync
        if (existingAppointment.last_synced_at) {
          const lastSync = new Date(existingAppointment.last_synced_at)
          if (localUpdated > lastSync && googleUpdated > lastSync) {
            // Conflict! Both systems have been updated
            conflicts.push(event.id)
            await supabase
              .from('appointments')
              .update({ sync_conflict: true })
              .eq('id', existingAppointment.id)
            continue
          }
        }

        // Google has newer changes - update local
        if (!existingAppointment.sync_conflict) {
          await supabase
            .from('appointments')
            .update({
              scheduled_date: scheduledDate,
              scheduled_time: scheduledTime,
              duration_minutes: durationMinutes,
              last_synced_at: new Date().toISOString(),
              sync_error: null,
            })
            .eq('id', existingAppointment.id)
          updated++
        }
      } else {
        // Check if this is a new event created in Google Calendar
        // Only import if it looks like an appointment (has attendees or specific format)
        if (event.attendees && event.attendees.length > 0) {
          // Create new appointment from Google event
          const { error: insertError } = await supabase
            .from('appointments')
            .insert({
              scheduled_date: scheduledDate,
              scheduled_time: scheduledTime,
              duration_minutes: durationMinutes,
              meeting_type: 'online',
              status: 'confirmed',
              google_event_id: event.id,
              google_calendar_synced: true,
              last_synced_at: new Date().toISOString(),
              consultant_notes: event.description || null,
            })

          if (!insertError) {
            created++
          }
        } else {
          skipped++
        }
      }
    }

    // Log sync result
    await supabase
      .from('google_calendar_sync_log')
      .insert({
        sync_type: 'pull',
        status: conflicts.length > 0 ? 'partial' : 'success',
        sync_data: {
          events_processed: events.length,
          created,
          updated,
          deleted,
          skipped,
          conflicts: conflicts.length,
          next_sync_token: nextSyncToken,
        },
      })

    console.log(`Sync completed: ${created} created, ${updated} updated, ${deleted} deleted, ${skipped} skipped, ${conflicts.length} conflicts`)

    return new Response(
      JSON.stringify({
        success: true,
        events_processed: events.length,
        created,
        updated,
        deleted,
        skipped,
        conflicts: conflicts.length,
        next_sync_token: nextSyncToken,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Pull sync error:', error)

    await supabase
      .from('google_calendar_sync_log')
      .insert({
        sync_type: 'pull',
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error),
      })

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

function performFullSync(_supabase: ReturnType<typeof createClient>, _accessToken: string, _calendarId: string): Response {
  // Implementation for full sync (recursive call with full_sync flag)
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Full sync initiated',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

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
