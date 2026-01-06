import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormTrigger {
  contactRequestId: string;
  email?: string;
  name?: string;
  serviceType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contactData: ContactFormTrigger = await req.json();
    
    console.log('Contact form automation triggered:', contactData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get contact request details
    const { data: contactRequest, error: contactError } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('id', contactData.contactRequestId)
      .single();

    if (contactError || !contactRequest) {
      console.error('Contact request not found:', contactError);
      return new Response(
        JSON.stringify({ error: 'Contact request not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const email = contactRequest.email || contactData.email;
    const name = contactRequest.name || contactData.name;

    if (!email) {
      throw new Error('No email found for contact form automation');
    }

    // Parse name into first and last name
    const nameParts = (name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Trigger automation processing
    const { error: automationError } = await supabase.functions.invoke('process-automations', {
      body: {
        triggerType: 'contact_form',
        subscriberEmail: email,
        contactRequestId: contactData.contactRequestId,
        triggerData: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          company: contactRequest.company || '',
          phone: contactRequest.phone || '',
          service_type: contactRequest.service_type || contactData.serviceType || '',
          budget_range: contactRequest.budget_range || '',
          message: contactRequest.message || '',
          preferred_date: contactRequest.preferred_date || '',
          preferred_time: contactRequest.preferred_time || '',
          company_name: 'Unicum Tech'
        }
      }
    });

    if (automationError) {
      console.error('Automation processing error:', automationError);
      throw automationError;
    }

    console.log('Contact form automation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Contact form automation triggered successfully',
        contactRequestId: contactData.contactRequestId,
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
    console.error('Error in contact form automation trigger:', error);
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