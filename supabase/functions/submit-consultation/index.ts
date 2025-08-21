import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConsultationRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  consultation_type?: string;
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

    const requestData: ConsultationRequest = await req.json();
    
    console.log('Received consultation request:', requestData);

    // Insert into contact_requests table
    const { data: contactRequest, error: contactError } = await supabase
      .from('contact_requests')
      .insert([{
        name: requestData.name,
        email: requestData.email,
        phone: requestData.phone,
        company: requestData.company,
        service: requestData.service,
        message: requestData.message,
        preferred_date: requestData.preferred_date,
        preferred_time: requestData.preferred_time,
        consultation_type: requestData.consultation_type,
        request_type: 'consultation'
      }])
      .select()
      .single();

    if (contactError) {
      console.error('Error inserting contact request:', contactError);
      throw contactError;
    }

    // If preferred date and time are provided, also create an appointment
    if (requestData.preferred_date && requestData.preferred_time) {
      const appointmentDateTime = new Date(`${requestData.preferred_date}T${requestData.preferred_time}:00`);
      
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          contact_request_id: contactRequest.id,
          appointment_date: requestData.preferred_date,
          appointment_time: appointmentDateTime.toISOString(),
          appointment_type: requestData.consultation_type || 'online',
          status: 'pending'
        }])
        .select()
        .single();

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        // Don't throw here, as contact request was successful
      }

      console.log('Created appointment:', appointment);
    }

    console.log('Successfully processed consultation request');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Beratungsanfrage erfolgreich übermittelt',
        id: contactRequest.id 
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
    console.error('Error in submit-consultation function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Ein Fehler ist aufgetreten' 
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