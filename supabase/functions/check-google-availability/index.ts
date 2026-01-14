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

  try {
    const { date, duration_minutes = 60 } = await req.json()

    if (!date) {
      throw new Error('date is required (YYYY-MM-DD format)')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Checking availability for ${date}`)

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

    // Get blocked dates
    const { data: blockedDates } = await supabase
      .from('calendar_blocked_dates')
      .select('*')
      .eq('date', date)

    // Check if date is blocked
    if (blockedDates && blockedDates.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          available: false,
          reason: 'Date is blocked',
          blocked_by: blockedDates[0].name,
          slots: [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check day of week availability
    const dateObj = new Date(date)
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
          slots: [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate time slots
    const slots: { time: string; available: boolean }[] = []
    const startHour = parseInt(daySchedule.start.split(':')[0])
    const endHour = parseInt(daySchedule.end.split(':')[0])
    const bufferMinutes = settings?.buffer_minutes || 15

    // Get existing appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('scheduled_time, duration_minutes')
      .eq('scheduled_date', date)
      .in('status', ['confirmed', 'pending'])

    const bookedSlots = new Set(appointments?.map(a => a.scheduled_time) || [])

    // If Google Calendar is connected, also check Google events
    let googleBusyTimes: { start: string; end: string }[] = []
    
    if (tokenData?.access_token) {
      try {
        const timeMin = new Date(`${date}T${daySchedule.start}:00+01:00`).toISOString()
        const timeMax = new Date(`${date}T${daySchedule.end}:00+01:00`).toISOString()

        const calendarId = settings?.calendar_id || 'primary'
        
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
        }
      } catch (error) {
        console.error('Error fetching Google Calendar busy times:', error)
      }
    }

    // Generate slots
    for (let hour = startHour; hour < endHour; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`
      
      // Check if slot is booked in our system
      let isAvailable = !bookedSlots.has(timeStr)

      // Check if slot conflicts with Google Calendar
      if (isAvailable && googleBusyTimes.length > 0) {
        const slotStart = new Date(`${date}T${timeStr}:00+01:00`)
        const slotEnd = new Date(slotStart.getTime() + duration_minutes * 60000)

        for (const busy of googleBusyTimes) {
          const busyStart = new Date(busy.start)
          const busyEnd = new Date(busy.end)

          if (slotStart < busyEnd && slotEnd > busyStart) {
            isAvailable = false
            break
          }
        }
      }

      slots.push({ time: timeStr, available: isAvailable })
    }

    const availableSlots = slots.filter(s => s.available)

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
        slots,
        google_connected: !!tokenData?.access_token,
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