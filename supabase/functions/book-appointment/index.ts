import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const appointmentSchema = z.object({
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD required)'),
  appointment_time: z.string().max(20, 'Invalid time format'),
  appointment_type: z.string().max(50, 'Invalid appointment type'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  phone: z.string().max(30, 'Phone number too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  message: z.string().max(2000, 'Message too long').optional(),
});

const DAYS_MAP: Record<string, number> = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
};

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const parts = timeStr.split(':');
  return {
    hours: parseInt(parts[0], 10),
    minutes: parseInt(parts[1] || '0', 10),
  };
}

function isTimeWithinWorkingHours(
  appointmentTime: string,
  workingStart: string,
  workingEnd: string
): boolean {
  const appt = parseTime(appointmentTime);
  const start = parseTime(workingStart);
  const end = parseTime(workingEnd);
  
  const apptMinutes = appt.hours * 60 + appt.minutes;
  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;
  
  return apptMinutes >= startMinutes && apptMinutes < endMinutes;
}

function isWorkingDay(dateStr: string, workingDays: string[]): boolean {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  
  // Find the day name for this number
  for (const [dayName, dayNum] of Object.entries(DAYS_MAP)) {
    if (dayNum === dayOfWeek && workingDays.includes(dayName)) {
      return true;
    }
  }
  return false;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rawData = await req.json();
    
    // Validate input data
    const bookingData = appointmentSchema.parse(rawData);
    
    console.log('Received appointment booking:', bookingData);

    // Get calendar settings for working hours validation
    const { data: calendarSettings } = await supabase
      .from('google_calendar_settings')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Check working days if settings exist
    if (calendarSettings && calendarSettings.working_days) {
      if (!isWorkingDay(bookingData.appointment_date, calendarSettings.working_days)) {
        const dayNames: Record<string, string> = {
          'monday': 'Montag',
          'tuesday': 'Dienstag',
          'wednesday': 'Mittwoch',
          'thursday': 'Donnerstag',
          'friday': 'Freitag',
          'saturday': 'Samstag',
          'sunday': 'Sonntag',
        };
        const workingDaysList = calendarSettings.working_days.map((d: string) => dayNames[d] || d).join(', ');
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Termine sind nur an folgenden Tagen verfügbar: ${workingDaysList}` 
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    // Check working hours if settings exist
    if (calendarSettings && calendarSettings.working_hours_start && calendarSettings.working_hours_end) {
      if (!isTimeWithinWorkingHours(
        bookingData.appointment_time,
        calendarSettings.working_hours_start,
        calendarSettings.working_hours_end
      )) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Termine sind nur zwischen ${calendarSettings.working_hours_start} und ${calendarSettings.working_hours_end} möglich.` 
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    // Check blocked dates
    const { data: blockedDates } = await supabase
      .from('calendar_blocked_dates')
      .select('*')
      .or(`date.eq.${bookingData.appointment_date},is_recurring.eq.true`);

    if (blockedDates && blockedDates.length > 0) {
      for (const blocked of blockedDates) {
        if (blocked.date === bookingData.appointment_date) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Dieser Tag ist nicht verfügbar: ${blocked.name}` 
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }
        // Check recurring dates (same month-day)
        if (blocked.is_recurring) {
          const blockedMonthDay = blocked.date.substring(5); // MM-DD
          const appointmentMonthDay = bookingData.appointment_date.substring(5);
          if (blockedMonthDay === appointmentMonthDay) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Dieser Tag ist nicht verfügbar: ${blocked.name}` 
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              }
            );
          }
        }
      }
    }

    // Check if the time slot is still available
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('id')
      .eq('scheduled_date', bookingData.appointment_date)
      .eq('scheduled_time', bookingData.appointment_time)
      .in('status', ['confirmed', 'pending', 'scheduled']);

    if (existingAppointments && existingAppointments.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Dieser Termin ist bereits vergeben. Bitte wählen Sie eine andere Zeit.' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Check buffer time with existing appointments
    if (calendarSettings && calendarSettings.buffer_minutes > 0) {
      const { data: nearbyAppointments } = await supabase
        .from('appointments')
        .select('scheduled_time, duration_minutes')
        .eq('scheduled_date', bookingData.appointment_date)
        .in('status', ['confirmed', 'pending', 'scheduled']);

      if (nearbyAppointments) {
        const requestedTime = parseTime(bookingData.appointment_time);
        const requestedMinutes = requestedTime.hours * 60 + requestedTime.minutes;
        
        for (const appt of nearbyAppointments) {
          const existingTime = parseTime(appt.scheduled_time);
          const existingMinutes = existingTime.hours * 60 + existingTime.minutes;
          const duration = appt.duration_minutes || 60;
          
          // Check if requested time conflicts with existing appointment + buffer
          const existingEnd = existingMinutes + duration + calendarSettings.buffer_minutes;
          const existingStart = existingMinutes - calendarSettings.buffer_minutes;
          
          if (requestedMinutes > existingStart && requestedMinutes < existingEnd) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Dieser Zeitraum ist wegen eines anderen Termins nicht verfügbar. Bitte wählen Sie eine andere Zeit.' 
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              }
            );
          }
        }
      }
    }

    // Create the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert([{
        scheduled_date: bookingData.appointment_date,
        scheduled_time: bookingData.appointment_time,
        meeting_type: bookingData.appointment_type,
        status: 'scheduled'
      }])
      .select()
      .single();

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      throw appointmentError;
    }

    // Create contact request with appointment data
    const { data: contactData, error: contactError } = await supabase
      .from('contact_requests')
      .insert([{
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone || null,
        company: bookingData.company || null,
        message: bookingData.message || null,
        preferred_date: bookingData.appointment_date,
        preferred_time: bookingData.appointment_time,
        service_type: 'consultation',
        status: 'pending'
      }])
      .select('id')
      .single();

    if (contactError) {
      console.error('Error creating contact request:', contactError);
    } else if (contactData) {
      // Update appointment with contact request ID
      await supabase
        .from('appointments')
        .update({ contact_request_id: contactData.id })
        .eq('id', appointment.id);
    }

    // Trigger appointment automation
    try {
      await supabase.functions.invoke('trigger-appointment-automation', {
        body: {
          appointmentId: appointment.id,
          contactEmail: bookingData.email,
          contactName: bookingData.name,
          appointmentDate: bookingData.appointment_date,
          appointmentTime: bookingData.appointment_time,
          serviceType: 'consultation'
        }
      });
      console.log('Appointment automation triggered successfully');
    } catch (automationError) {
      console.error('Appointment automation error:', automationError);
    }

    // Auto-sync to Google Calendar if connected
    try {
      if (calendarSettings?.auto_sync) {
        const { data: tokenData } = await supabase
          .from('google_oauth_tokens')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (tokenData) {
          console.log('Auto-syncing appointment to Google Calendar...');
          await supabase.functions.invoke('sync-appointment-to-google', {
            body: {
              appointment_id: appointment.id,
              action: 'create'
            }
          });
          console.log('Google Calendar sync completed');
        }
      }
    } catch (syncError) {
      console.error('Google Calendar auto-sync error:', syncError);
    }

    console.log('Successfully created appointment:', appointment);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Termin erfolgreich gebucht',
        appointment: appointment
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: unknown) {
    console.error('Error in book-appointment function:', error);
    
    const isZodError = error instanceof Error && error.name === 'ZodError';
    const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: isZodError ? 'Ungültige Eingabedaten' : errorMessage,
      }),
      {
        status: isZodError ? 400 : 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
