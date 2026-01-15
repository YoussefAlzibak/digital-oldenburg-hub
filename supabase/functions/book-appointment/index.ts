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
          headers: { 
            'Content-Type': 'application/json', 
            ...corsHeaders 
          },
        }
      );
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

    let contactRequestId = null;

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
    } else {
      const contactRequestId = contactData?.id;
      
      // Update appointment with contact request ID
      await supabase
        .from('appointments')
        .update({ contact_request_id: contactRequestId })
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
      // Don't fail the booking if automation fails
    }

    // Auto-sync to Google Calendar if connected
    try {
      const { data: calendarSettings } = await supabase
        .from('google_calendar_settings')
        .select('auto_sync, is_active')
        .eq('is_active', true)
        .single();

      if (calendarSettings?.auto_sync) {
        const { data: tokenData } = await supabase
          .from('google_oauth_tokens')
          .select('id')
          .limit(1)
          .single();

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
      // Don't fail the booking if sync fails
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
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in book-appointment function:', error);
    
    // Handle validation errors with more specific status code
    const isValidationError = error.name === 'ZodError';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: isValidationError ? 'Invalid input data' : (error.message || 'Ein Fehler ist beim Buchen des Termins aufgetreten'),
        details: isValidationError ? error.errors : undefined
      }),
      {
        status: isValidationError ? 400 : 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);