import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppointmentTrigger {
  appointmentId: string;
  contactEmail: string;
  contactName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  serviceType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const appointmentData: AppointmentTrigger = await req.json();
    
    console.log('Appointment automation triggered:', appointmentData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        *,
        contact_requests (
          name,
          email,
          company,
          phone,
          service_type
        )
      `)
      .eq('id', appointmentData.appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error('Appointment not found:', appointmentError);
      return new Response(
        JSON.stringify({ error: 'Appointment not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const contactRequest = appointment.contact_requests;
    const email = contactRequest?.email || appointmentData.contactEmail;
    const name = contactRequest?.name || appointmentData.contactName;

    if (!email) {
      throw new Error('No email found for appointment automation');
    }

    // Parse name into first and last name
    const nameParts = (name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Trigger automation processing
    const { error: automationError } = await supabase.functions.invoke('process-automations', {
      body: {
        triggerType: 'appointment_booked',
        subscriberEmail: email,
        appointmentId: appointmentData.appointmentId,
        triggerData: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: contactRequest?.company || '',
          phone: contactRequest?.phone || '',
          service_type: contactRequest?.service_type || appointmentData.serviceType || '',
          appointment_date: appointment.scheduled_date,
          appointment_time: appointment.scheduled_time,
          meeting_type: appointment.meeting_type,
          meeting_link: appointment.meeting_link || '',
          company_name: 'Unicum Tech'
        }
      }
    });

    if (automationError) {
      console.error('Automation processing error:', automationError);
      throw automationError;
    }

    console.log('Appointment automation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Appointment automation triggered successfully',
        appointmentId: appointmentData.appointmentId,
        email: email
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
    console.error('Error in appointment automation trigger:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);