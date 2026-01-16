import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

interface TimeSlot {
  time: string
  available: boolean
  reason?: string
}

interface ReminderConfig {
  email_24h: boolean
  email_1h: boolean
  popup_30m: boolean
  popup_10m: boolean
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      date, 
      duration_minutes = 60,
      include_buffer = true,
      check_google = true 
    } = await req.json()

    if (!date) {
      throw new Error('date is required (YYYY-MM-DD format)')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Checking availability for ${date} (duration: ${duration_minutes}min, buffer: ${include_buffer}, google: ${check_google})`)

    // Get OAuth token
    const { data: tokenData } = await supabase
      .from('google_oauth_tokens')
      .select('*')
      .limit(1)
      .single()

    // Get calendar settings
    const { data: settings } = await supabase
      .from('google_calendar_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    // Get availability template
    const { data: availabilityTemplate } = await supabase
      .from('availability_templates')
      .select('*')
      .eq('is_active', true)
      .single()

    // Get blocked dates (including recurring holidays)
    const dateObj = new Date(date)
    const monthDay = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`
    
    const { data: blockedDates } = await supabase
      .from('calendar_blocked_dates')
      .select('*')
      .or(`date.eq.${date},and(is_recurring.eq.true,date.ilike.%-${monthDay})`)

    // Check if date is blocked
    if (blockedDates && blockedDates.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          available: false,
          reason: 'Date is blocked',
          blocked_by: blockedDates[0].name,
          blocked_type: blockedDates[0].type,
          slots: [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check day of week availability
    const dayOfWeek = dateObj.getDay()
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayKey = dayKeys[dayOfWeek]

    const schedule = availabilityTemplate?.schedule as Record<string, { start: string; end: string; active: boolean }> | null
    const daySchedule = schedule?.[dayKey]

    if (!daySchedule?.active) {
      return new Response(
        JSON.stringify({
          success: true,
          available: false,
          reason: 'Day not available according to schedule',
          day: dayKey,
          slots: [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Settings
    const bufferMinutes = include_buffer ? (settings?.buffer_minutes || 15) : 0
    const calendarId = settings?.calendar_id || 'primary'

    // Generate time slots with buffer consideration
    const slots: TimeSlot[] = []
    const startHour = parseInt(daySchedule.start.split(':')[0])
    const startMin = parseInt(daySchedule.start.split(':')[1] || '0')
    const endHour = parseInt(daySchedule.end.split(':')[0])
    const endMin = parseInt(daySchedule.end.split(':')[1] || '0')

    // Get existing appointments with their durations
    const { data: appointments } = await supabase
      .from('appointments')
      .select('scheduled_time, duration_minutes, status')
      .eq('scheduled_date', date)
      .in('status', ['confirmed', 'pending', 'scheduled'])

    // Create a map of booked time ranges (including buffer)
    const bookedRanges: { start: number; end: number }[] = []
    
    if (appointments) {
      for (const apt of appointments) {
        const [h, m] = apt.scheduled_time.split(':').map(Number)
        const startMins = h * 60 + m
        const endMins = startMins + (apt.duration_minutes || 60) + bufferMinutes
        bookedRanges.push({ start: startMins - bufferMinutes, end: endMins })
      }
    }

    // If Google Calendar is connected, also check Google events
    let googleBusyTimes: { start: string; end: string }[] = []
    
    if (check_google && tokenData?.access_token) {
      try {
        // Build time range for the day
        const timeMin = new Date(`${date}T${daySchedule.start}:00`).toISOString()
        const timeMax = new Date(`${date}T${daySchedule.end}:00`).toISOString()

        const freeBusyResponse = await fetch(
          `${GOOGLE_CALENDAR_API}/freeBusy`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              timeMin,
              timeMax,
              items: [{ id: calendarId }],
            }),
          }
        )

        if (freeBusyResponse.ok) {
          const freeBusyData = await freeBusyResponse.json()
          googleBusyTimes = freeBusyData.calendars?.[calendarId]?.busy || []
          
          // Add Google busy times to booked ranges
          for (const busy of googleBusyTimes) {
            const busyStart = new Date(busy.start)
            const busyEnd = new Date(busy.end)
            
            if (busyStart.toISOString().startsWith(date)) {
              const startMins = busyStart.getHours() * 60 + busyStart.getMinutes()
              const endMins = busyEnd.getHours() * 60 + busyEnd.getMinutes()
              bookedRanges.push({ 
                start: startMins - bufferMinutes, 
                end: endMins + bufferMinutes 
              })
            }
          }
        } else if (freeBusyResponse.status === 401) {
          console.log('Google token expired, availability check will use local data only')
        }
      } catch (error) {
        console.error('Error fetching Google Calendar busy times:', error)
      }
    }

    // Generate slots with 30-minute intervals
    const workStartMins = startHour * 60 + startMin
    const workEndMins = endHour * 60 + endMin

    for (let mins = workStartMins; mins + duration_minutes <= workEndMins; mins += 30) {
      const hours = Math.floor(mins / 60)
      const minutes = mins % 60
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      const slotEnd = mins + duration_minutes

      // Check if this slot conflicts with any booked range
      let isAvailable = true
      let conflictReason: string | undefined

      for (const range of bookedRanges) {
        if (mins < range.end && slotEnd > range.start) {
          isAvailable = false
          conflictReason = 'Time slot conflicts with existing appointment'
          break
        }
      }

      slots.push({ 
        time: timeStr, 
        available: isAvailable,
        reason: conflictReason
      })
    }

    const availableSlots = slots.filter(s => s.available)

    // Calculate next available slot
    const nextAvailable = availableSlots.length > 0 ? availableSlots[0].time : null

    // Build reminder configuration based on settings
    const reminderConfig: ReminderConfig = {
      email_24h: true,
      email_1h: false,
      popup_30m: true,
      popup_10m: true,
    }

    return new Response(
      JSON.stringify({
        success: true,
        available: availableSlots.length > 0,
        date,
        working_hours: {
          start: daySchedule.start,
          end: daySchedule.end,
        },
        buffer_minutes: bufferMinutes,
        duration_minutes,
        slots,
        available_count: availableSlots.length,
        next_available: nextAvailable,
        google_connected: !!tokenData?.access_token,
        google_events_checked: googleBusyTimes.length,
        reminder_config: reminderConfig,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Availability check error:', error)
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