import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterSubscriptionTrigger {
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const subscriptionData: NewsletterSubscriptionTrigger = await req.json();
    
    console.log('Newsletter subscription automation triggered:', subscriptionData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get subscriber ID
    const { data: subscriber, error: subscriberError } = await supabase
      .from('email_subscribers')
      .select('id')
      .eq('email', subscriptionData.email)
      .single();

    if (subscriberError || !subscriber) {
      console.error('Subscriber not found:', subscriberError);
      return new Response(
        JSON.stringify({ error: 'Subscriber not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Trigger automation processing
    const { error: automationError } = await supabase.functions.invoke('process-automations', {
      body: {
        triggerType: 'subscription',
        subscriberEmail: subscriptionData.email,
        subscriberId: subscriber.id,
        triggerData: {
          ...subscriptionData,
          company_name: 'Digital Masters'
        }
      }
    });

    if (automationError) {
      console.error('Automation processing error:', automationError);
      throw automationError;
    }

    console.log('Newsletter subscription automation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Newsletter subscription automation triggered successfully',
        subscriberId: subscriber.id
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
    console.error('Error in newsletter automation trigger:', error);
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