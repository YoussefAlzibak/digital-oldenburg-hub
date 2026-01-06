import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Processing renewal tasks...')

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    )

    // Call the database function to process renewals
    const { data, error } = await supabaseAdmin.rpc('process_renewal_tasks')
    
    if (error) {
      console.error('Error processing renewal tasks:', error)
      throw error
    }

    console.log(`Processed ${data} renewal tasks`)

    // Process pending renewal reminders
    const { data: pendingReminders, error: remindersError } = await supabaseAdmin
      .from('renewal_reminders')
      .select(`
        *,
        appointments!inner(
          id,
          scheduled_date,
          scheduled_time,
          contact_requests(name, email, company, service_type)
        )
      `)
      .eq('status', 'pending')
      .lte('reminder_date', new Date().toISOString().split('T')[0])

    if (remindersError) {
      console.error('Error loading pending reminders:', remindersError)
    } else if (pendingReminders && pendingReminders.length > 0) {
      console.log(`Processing ${pendingReminders.length} pending reminders`)

      for (const reminder of pendingReminders) {
        try {
          const appointment = reminder.appointments
          if (!appointment?.contact_requests?.email) {
            console.warn(`No contact email for reminder ${reminder.id}`)
            continue
          }

          // Trigger renewal reminder email automation
          const { error: emailError } = await supabaseAdmin.functions.invoke('process-automations', {
            body: {
              triggerType: 'appointment_renewal_reminder',
              subscriberEmail: appointment.contact_requests.email,
              triggerData: {
                first_name: appointment.contact_requests.name?.split(' ')[0] || 'Kunde',
                email: appointment.contact_requests.email,
                company: appointment.contact_requests.company || '',
                service_type: appointment.contact_requests.service_type || 'Beratung',
                last_appointment_date: new Date(appointment.scheduled_date).toLocaleDateString('de-DE'),
                company_name: 'Unicum Tech'
              }
            }
          })

          if (emailError) {
            console.error(`Email error for reminder ${reminder.id}:`, emailError)
            // Mark as failed
            await supabaseAdmin
              .from('renewal_reminders')
              .update({ 
                status: 'failed', 
                error_message: emailError.message,
                sent_at: new Date().toISOString()
              })
              .eq('id', reminder.id)
          } else {
            // Mark as sent
            await supabaseAdmin
              .from('renewal_reminders')
              .update({ 
                status: 'sent',
                sent_at: new Date().toISOString()
              })
              .eq('id', reminder.id)
          }

        } catch (reminderError: any) {
          console.error(`Error processing reminder ${reminder.id}:`, reminderError)
          await supabaseAdmin
            .from('renewal_reminders')
            .update({ 
              status: 'failed', 
              error_message: reminderError.message,
              sent_at: new Date().toISOString()
            })
            .eq('id', reminder.id)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: data,
        reminders_processed: pendingReminders?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error('Renewal processing failed:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})