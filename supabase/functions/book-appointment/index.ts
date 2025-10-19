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
  name: z.string().min(1).max(100, 'Name too long').optional(),
  email: z.string().email('Invalid email format').max(255, 'Email too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
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
      .eq('appointment_date', bookingData.appointment_date)
      .eq('appointment_time', bookingData.appointment_time)
      .in('status', ['confirmed', 'pending']);

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

    // If contact information is provided, also create a contact request
    if (bookingData.name && bookingData.email) {
      const { data: contactData, error: contactError } = await supabase
        .from('contact_requests')
        .insert([{
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          message: bookingData.message,
          preferred_date: bookingData.appointment_date,
          preferred_time: bookingData.appointment_time.split('T')[1]?.substring(0, 5) || bookingData.appointment_time,
          service_type: 'consultation',
          status: 'pending'
        }])
        .select('id')
        .single();

      if (contactError) {
        console.error('Error creating contact request:', contactError);
      } else {
        contactRequestId = contactData?.id;
        
        // Update appointment with contact request ID
        await supabase
          .from('appointments')
          .update({ contact_request_id: contactRequestId })
          .eq('id', appointment.id);
      }
    }

    // Trigger appointment automation if we have contact information
    if (bookingData.name && bookingData.email) {
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