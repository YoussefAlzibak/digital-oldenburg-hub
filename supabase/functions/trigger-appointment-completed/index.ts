import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppointmentCompletedTrigger {
  appointmentId: string;
  contactEmail?: string;
  contactName?: string;
  rating?: number;
  feedback?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const completedData: AppointmentCompletedTrigger = await req.json();
    
    console.log('Appointment completed automation triggered:', completedData);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get appointment details with contact request
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
      .eq('id', completedData.appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error('Appointment not found:', appointmentError);
      return new Response(
        JSON.stringify({ error: 'Appointment not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const contactRequest = appointment.contact_requests;
    const email = contactRequest?.email || completedData.contactEmail;
    const name = contactRequest?.name || completedData.contactName;

    if (!email) {
      throw new Error('No email found for appointment completed automation');
    }

    // Parse name into first and last name
    const nameParts = (name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update appointment status to completed
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', completedData.appointmentId);

    if (updateError) {
      console.error('Error updating appointment status:', updateError);
    }

    // Trigger workflow actions processing
    const { error: workflowError } = await supabase.functions.invoke('process-workflow-actions', {
      body: {
        triggerType: 'appointment_completed',
        subscriberEmail: email,
        triggerData: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: contactRequest?.company || '',
          phone: contactRequest?.phone || '',
          service_type: contactRequest?.service_type || '',
          appointment_date: appointment.scheduled_date,
          appointment_time: appointment.scheduled_time,
          meeting_type: appointment.meeting_type,
          meeting_link: appointment.meeting_link || '',
          completed_date: new Date().toISOString().split('T')[0],
          rating: completedData.rating,
          feedback: completedData.feedback || '',
          company_name: 'Unicum Tech'
        }
      }
    });

    if (workflowError) {
      console.error('Workflow actions error:', workflowError);
    }

    // Also trigger legacy automation processing for backwards compatibility
    const { error: automationError } = await supabase.functions.invoke('process-automations', {
      body: {
        triggerType: 'appointment_completed',
        subscriberEmail: email,
        appointmentId: completedData.appointmentId,
        triggerData: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: contactRequest?.company || '',
          phone: contactRequest?.phone || '',
          service_type: contactRequest?.service_type || '',
          appointment_date: appointment.scheduled_date,
          appointment_time: appointment.scheduled_time,
          meeting_type: appointment.meeting_type,
          completed_date: new Date().toISOString().split('T')[0],
          rating: completedData.rating,
          feedback: completedData.feedback || '',
          company_name: 'Unicum Tech'
        }
      }
    });

    if (automationError) {
      console.error('Automation processing error:', automationError);
    }

    console.log('Appointment completed automation finished successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Appointment completed automation triggered successfully',
        appointmentId: completedData.appointmentId,
        email: email
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in appointment completed trigger:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
