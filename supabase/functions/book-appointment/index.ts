import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppointmentBooking {
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
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

    const bookingData: AppointmentBooking = await req.json();
    
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
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Ein Fehler ist beim Buchen des Termins aufgetreten' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);