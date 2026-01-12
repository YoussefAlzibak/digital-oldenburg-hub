import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutomationTriggerRequest {
  triggerType: 'subscription' | 'appointment_booked' | 'contact_form' | 'date_based' | 'newsletter_signup';
  subscriberEmail?: string;
  subscriberId?: string;
  appointmentId?: string;
  contactRequestId?: string;
  triggerData?: any;
}

interface ReminderTime {
  minutes_before: number;
  label: string;
  enabled: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const triggerRequest: AutomationTriggerRequest = await req.json();
    
    console.log('Processing automation trigger:', {
      triggerType: triggerRequest.triggerType,
      subscriberEmail: triggerRequest.subscriberEmail,
      appointmentId: triggerRequest.appointmentId
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get active automations for this trigger type
    const { data: automations, error: automationsError } = await supabase
      .from('email_automations')
      .select(`
        *,
        email_automation_steps (
          id,
          step_number,
          subject,
          html_content,
          text_content,
          delay_minutes,
          is_active
        )
      `)
      .eq('trigger_type', triggerRequest.triggerType)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (automationsError) throw automationsError;

    if (!automations || automations.length === 0) {
      console.log(`No active automations found for trigger: ${triggerRequest.triggerType}`);
      return new Response(
        JSON.stringify({ message: 'No active automations found for this trigger' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    let subscriberId = triggerRequest.subscriberId;
    
    // If we have an email but no subscriber ID, find or create subscriber
    if (triggerRequest.subscriberEmail && !subscriberId) {
      const { data: existingSubscriber } = await supabase
        .from('email_subscribers')
        .select('id')
        .eq('email', triggerRequest.subscriberEmail)
        .maybeSingle();

      if (existingSubscriber) {
        subscriberId = existingSubscriber.id;
      } else {
        // Create new subscriber from trigger data
        const { data: newSubscriber, error: subscriberError } = await supabase
          .from('email_subscribers')
          .insert([{
            email: triggerRequest.subscriberEmail,
            first_name: triggerRequest.triggerData?.first_name || null,
            last_name: triggerRequest.triggerData?.last_name || null,
            company: triggerRequest.triggerData?.company || null,
            phone: triggerRequest.triggerData?.phone || null,
            source: getTriggerSource(triggerRequest.triggerType),
            status: 'active'
          }])
          .select('id')
          .single();

        if (subscriberError) throw subscriberError;
        subscriberId = newSubscriber.id;
      }
    }

    if (!subscriberId) {
      throw new Error('No subscriber ID available for automation');
    }

    // Process each automation
    let totalEmailsQueued = 0;
    
    for (const automation of automations) {
      console.log(`Processing automation: ${automation.name}`);
      
      // Special handling for appointment_booked trigger
      if (triggerRequest.triggerType === 'appointment_booked') {
        const triggerConfig = automation.trigger_config || {};
        const sendConfirmation = triggerConfig.send_confirmation !== false;
        const sendReminder = triggerConfig.send_reminder !== false;
        const reminderTimes: ReminderTime[] = triggerConfig.reminder_times || [];
        
        console.log('Appointment automation config:', { sendConfirmation, sendReminder, reminderTimes });
        
        // Calculate appointment datetime
        const appointmentDate = triggerRequest.triggerData?.appointment_date;
        const appointmentTime = triggerRequest.triggerData?.appointment_time;
        
        if (!appointmentDate || !appointmentTime) {
          console.error('Missing appointment date or time for appointment automation');
          continue;
        }
        
        // Parse appointment datetime
        const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
        console.log('Appointment datetime:', appointmentDateTime.toISOString());
        
        if (!automation.email_automation_steps || automation.email_automation_steps.length === 0) {
          console.log(`No steps found for automation: ${automation.name}`);
          continue;
        }

        // Sort steps by step_number
        const steps = automation.email_automation_steps
          .filter((step: any) => step.is_active)
          .sort((a: any, b: any) => a.step_number - b.step_number);
        
        // Step 1: Send confirmation immediately (if enabled)
        if (sendConfirmation && steps.length > 0) {
          const confirmationStep = steps[0]; // First step is the confirmation
          const now = new Date();
          
          const { error: queueError } = await supabase
            .from('email_queue')
            .insert([{
              subscriber_id: subscriberId,
              automation_id: automation.id,
              automation_step_id: confirmationStep.id,
              subject: personalizeContent(confirmationStep.subject, triggerRequest.triggerData),
              html_content: personalizeContent(confirmationStep.html_content, triggerRequest.triggerData),
              text_content: personalizeContent(confirmationStep.text_content || '', triggerRequest.triggerData),
              scheduled_at: now.toISOString(),
              status: 'pending'
            }]);

          if (queueError) {
            console.error('Error queuing confirmation email:', queueError);
          } else {
            totalEmailsQueued++;
            console.log('Queued confirmation email for immediate sending');
          }
        }
        
        // Step 2: Schedule reminder emails based on configured reminder times (relative to appointment)
        if (sendReminder && reminderTimes.length > 0) {
          // Find reminder template (step 2 or later)
          const reminderTemplate = steps.length > 1 ? steps[1] : steps[0];
          
          for (const reminder of reminderTimes) {
            if (!reminder.enabled) continue;
            
            // Calculate reminder time: appointment time MINUS minutes_before
            const reminderDateTime = new Date(appointmentDateTime.getTime() - (reminder.minutes_before * 60 * 1000));
            const now = new Date();
            
            // Only schedule if the reminder time is in the future
            if (reminderDateTime <= now) {
              console.log(`Skipping reminder ${reminder.label} - time has already passed`);
              continue;
            }
            
            // Customize subject based on reminder time
            let reminderSubject = reminderTemplate.subject;
            if (reminder.minutes_before <= 60) {
              reminderSubject = `⏰ In ${reminder.minutes_before} Minuten: Ihr Termin bei Unicum Tech`;
            } else if (reminder.minutes_before <= 120) {
              reminderSubject = `⏰ In ${Math.round(reminder.minutes_before / 60)} Stunde(n): Ihr Termin bei Unicum Tech`;
            } else if (reminder.minutes_before <= 1440) {
              reminderSubject = `📅 Morgen: Ihr Termin bei Unicum Tech um ${appointmentTime} Uhr`;
            } else {
              const days = Math.round(reminder.minutes_before / 1440);
              reminderSubject = `📅 In ${days} Tag(en): Ihr Termin bei Unicum Tech`;
            }
            
            const { error: queueError } = await supabase
              .from('email_queue')
              .insert([{
                subscriber_id: subscriberId,
                automation_id: automation.id,
                automation_step_id: reminderTemplate.id,
                subject: personalizeContent(reminderSubject, triggerRequest.triggerData),
                html_content: personalizeContent(reminderTemplate.html_content, triggerRequest.triggerData),
                text_content: personalizeContent(reminderTemplate.text_content || '', triggerRequest.triggerData),
                scheduled_at: reminderDateTime.toISOString(),
                status: 'pending'
              }]);

            if (queueError) {
              console.error(`Error queuing reminder email (${reminder.label}):`, queueError);
            } else {
              totalEmailsQueued++;
              console.log(`Queued reminder email "${reminder.label}" scheduled for: ${reminderDateTime.toISOString()}`);
            }
          }
        }
        
      } else {
        // Standard automation processing for other trigger types
        if (!automation.email_automation_steps || automation.email_automation_steps.length === 0) {
          console.log(`No steps found for automation: ${automation.name}`);
          continue;
        }

        // Sort steps by step_number
        const steps = automation.email_automation_steps
          .filter((step: any) => step.is_active)
          .sort((a: any, b: any) => a.step_number - b.step_number);

        // Queue emails for each step with appropriate delays (from current time)
        let cumulativeDelay = 0;
        for (const step of steps) {
          cumulativeDelay += (step.delay_minutes || 0);
          const scheduledAt = new Date();
          scheduledAt.setMinutes(scheduledAt.getMinutes() + cumulativeDelay);

          const { error: queueError } = await supabase
            .from('email_queue')
            .insert([{
              subscriber_id: subscriberId,
              automation_id: automation.id,
              automation_step_id: step.id,
              subject: personalizeContent(step.subject, triggerRequest.triggerData),
              html_content: personalizeContent(step.html_content, triggerRequest.triggerData),
              text_content: personalizeContent(step.text_content || '', triggerRequest.triggerData),
              scheduled_at: scheduledAt.toISOString(),
              status: 'pending'
            }]);

          if (queueError) {
            console.error(`Error queuing email for step ${step.step_number}:`, queueError);
          } else {
            totalEmailsQueued++;
            console.log(`Queued email for step ${step.step_number}, scheduled for: ${scheduledAt.toISOString()}`);
          }
        }
      }
    }

    // Log automation event
    await logAutomationEvent(supabase, {
      triggerType: triggerRequest.triggerType,
      subscriberId,
      automationCount: automations.length,
      emailsQueued: totalEmailsQueued,
      triggerData: triggerRequest.triggerData
    });

    console.log(`Processed ${automations.length} automations, queued ${totalEmailsQueued} emails`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${automations.length} automations`,
        emailsQueued: totalEmailsQueued,
        automations: automations.map(a => ({
          id: a.id,
          name: a.name,
          stepsQueued: a.email_automation_steps?.filter((s: any) => s.is_active).length || 0
        }))
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
    console.error('Error in process-automations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

function getTriggerSource(triggerType: string): string {
  switch (triggerType) {
    case 'subscription':
    case 'newsletter_signup':
      return 'automation_subscription';
    case 'appointment_booked':
      return 'automation_appointment';
    case 'contact_form':
      return 'automation_contact';
    case 'date_based':
      return 'automation_date';
    default:
      return 'automation_unknown';
  }
}

function personalizeContent(content: string, data: any): string {
  if (!content || !data) return content;
  
  let personalizedContent = content;
  
  // Replace common placeholders
  personalizedContent = personalizedContent.replace(/\{\{first_name\}\}/g, data.first_name || 'Liebe/r Interessent/in');
  personalizedContent = personalizedContent.replace(/\{\{last_name\}\}/g, data.last_name || '');
  personalizedContent = personalizedContent.replace(/\{\{company_name\}\}/g, data.company_name || 'Unicum Tech');
  personalizedContent = personalizedContent.replace(/\{\{email\}\}/g, data.email || '');
  personalizedContent = personalizedContent.replace(/\{\{company\}\}/g, data.company || '');
  personalizedContent = personalizedContent.replace(/\{\{phone\}\}/g, data.phone || '');
  personalizedContent = personalizedContent.replace(/\{\{service_type\}\}/g, data.service_type || '');
  personalizedContent = personalizedContent.replace(/\{\{appointment_date\}\}/g, data.appointment_date || '');
  personalizedContent = personalizedContent.replace(/\{\{appointment_time\}\}/g, data.appointment_time || '');
  personalizedContent = personalizedContent.replace(/\{\{meeting_type\}\}/g, data.meeting_type || '');
  personalizedContent = personalizedContent.replace(/\{\{meeting_link\}\}/g, data.meeting_link || '');
  
  return personalizedContent;
}

async function logAutomationEvent(supabase: any, eventData: any) {
  try {
    await supabase
      .from('email_events')
      .insert([{
        subscriber_id: eventData.subscriberId,
        event_type: 'automation_triggered',
        event_data: {
          trigger_type: eventData.triggerType,
          automation_count: eventData.automationCount,
          emails_queued: eventData.emailsQueued,
          trigger_data: eventData.triggerData
        }
      }]);
  } catch (error) {
    console.error('Error logging automation event:', error);
  }
}

serve(handler);
