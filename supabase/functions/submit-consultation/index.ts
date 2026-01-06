import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const consultationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  phone: z.string().max(20, 'Phone number too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  service: z.string().max(100, 'Service name too long').optional(),
  message: z.string().max(2000, 'Message too long').optional(),
  preferred_date: z.string().max(10, 'Invalid date').optional(),
  preferred_time: z.string().max(8, 'Invalid time').optional(),
  consultation_type: z.string().max(50, 'Invalid consultation type').optional(),
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
    const requestData = consultationSchema.parse(rawData);
    
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
    
    // Handle validation errors with more specific status code
    const isValidationError = error.name === 'ZodError';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: isValidationError ? 'Invalid input data' : (error.message || 'Ein Fehler ist aufgetreten'),
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