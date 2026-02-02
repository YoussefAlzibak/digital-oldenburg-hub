import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowTriggerRequest {
  triggerType: 'newsletter_signup' | 'contact_form' | 'appointment_booked' | 'appointment_completed' | 'tag_added' | 'tag_removed' | 'scheduled' | 'manual';
  subscriberEmail: string;
  subscriberId?: string;
  triggerData?: Record<string, any>;
}

interface WorkflowAction {
  id: string;
  automation_id: string;
  action_type: string;
  step_number: number;
  parent_action_id: string | null;
  branch_type: string | null;
  condition_field: string | null;
  condition_operator: string | null;
  condition_value: string | null;
  subject: string | null;
  html_content: string | null;
  text_content: string | null;
  delay_minutes: number | null;
  action_config: any;
  is_active: boolean | null;
}

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  tags: string[] | null;
  source: string | null;
  status: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: WorkflowTriggerRequest = await req.json();
    
    console.log('Processing workflow actions:', {
      triggerType: request.triggerType,
      subscriberEmail: request.subscriberEmail
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Map trigger types
    const triggerTypeMapping: Record<string, string> = {
      'newsletter_signup': 'newsletter_signup',
      'contact_form': 'contact_form',
      'appointment_booked': 'appointment_booked',
      'appointment_completed': 'appointment_completed',
      'tag_added': 'tag_added',
      'tag_removed': 'tag_removed',
      'scheduled': 'scheduled',
      'manual': 'manual'
    };

    const dbTriggerType = triggerTypeMapping[request.triggerType] || request.triggerType;

    // Get active automations for this trigger type
    const { data: automations, error: automationsError } = await supabase
      .from('email_automations')
      .select('id, name, trigger_type, trigger_config')
      .eq('trigger_type', dbTriggerType)
      .eq('is_active', true);

    if (automationsError) throw automationsError;

    if (!automations || automations.length === 0) {
      console.log(`No active automations for trigger: ${dbTriggerType}`);
      return new Response(
        JSON.stringify({ message: 'No active automations found', emailsQueued: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get or create subscriber
    let subscriber: Subscriber | null = null;
    
    if (request.subscriberId) {
      const { data } = await supabase
        .from('email_subscribers')
        .select('*')
        .eq('id', request.subscriberId)
        .single();
      subscriber = data;
    } else if (request.subscriberEmail) {
      const { data: existing } = await supabase
        .from('email_subscribers')
        .select('*')
        .eq('email', request.subscriberEmail)
        .maybeSingle();
      
      if (existing) {
        subscriber = existing;
      } else {
        const { data: newSub, error: subError } = await supabase
          .from('email_subscribers')
          .insert({
            email: request.subscriberEmail,
            first_name: request.triggerData?.first_name || null,
            last_name: request.triggerData?.last_name || null,
            company: request.triggerData?.company || null,
            phone: request.triggerData?.phone || null,
            source: `automation_${request.triggerType}`,
            status: 'active',
            tags: []
          })
          .select()
          .single();
        
        if (subError) throw subError;
        subscriber = newSub;
      }
    }

    if (!subscriber) {
      throw new Error('No subscriber found or created');
    }

    let totalEmailsQueued = 0;
    let totalTagsModified = 0;
    let totalDelaysScheduled = 0;

    // Process each automation
    for (const automation of automations) {
      console.log(`Processing automation: ${automation.name}`);

      // Get all workflow actions for this automation
      const { data: workflowActions, error: actionsError } = await supabase
        .from('workflow_actions')
        .select('*')
        .eq('automation_id', automation.id)
        .eq('is_active', true)
        .order('step_number');

      if (actionsError) {
        console.error('Error loading workflow actions:', actionsError);
        continue;
      }

      if (!workflowActions || workflowActions.length === 0) {
        console.log(`No workflow actions for automation: ${automation.name}`);
        continue;
      }

      // Build action tree (parent -> children)
      const rootActions = workflowActions.filter(a => !a.parent_action_id);
      const childrenMap = new Map<string, WorkflowAction[]>();
      
      workflowActions.forEach(action => {
        if (action.parent_action_id) {
          const children = childrenMap.get(action.parent_action_id) || [];
          children.push(action);
          childrenMap.set(action.parent_action_id, children);
        }
      });

      // Process actions recursively with delay accumulation
      const result = await processActionsRecursive(
        supabase,
        rootActions,
        childrenMap,
        subscriber,
        automation.id,
        request.triggerData || {},
        0 // Initial cumulative delay
      );

      totalEmailsQueued += result.emailsQueued;
      totalTagsModified += result.tagsModified;
      totalDelaysScheduled += result.delaysScheduled;
    }

    // Log automation event
    await supabase.from('email_events').insert({
      subscriber_id: subscriber.id,
      event_type: 'workflow_triggered',
      event_data: {
        trigger_type: request.triggerType,
        automations_processed: automations.length,
        emails_queued: totalEmailsQueued,
        tags_modified: totalTagsModified,
        delays_scheduled: totalDelaysScheduled
      }
    });

    console.log(`Workflow processing complete: ${totalEmailsQueued} emails, ${totalTagsModified} tag ops, ${totalDelaysScheduled} delays`);

    return new Response(
      JSON.stringify({
        success: true,
        emailsQueued: totalEmailsQueued,
        tagsModified: totalTagsModified,
        delaysScheduled: totalDelaysScheduled,
        automationsProcessed: automations.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in process-workflow-actions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

async function processActionsRecursive(
  supabase: any,
  actions: WorkflowAction[],
  childrenMap: Map<string, WorkflowAction[]>,
  subscriber: Subscriber,
  automationId: string,
  triggerData: Record<string, any>,
  cumulativeDelayMinutes: number
): Promise<{ emailsQueued: number; tagsModified: number; delaysScheduled: number }> {
  
  let emailsQueued = 0;
  let tagsModified = 0;
  let delaysScheduled = 0;
  let currentDelay = cumulativeDelayMinutes;

  for (const action of actions) {
    // Add this action's delay to cumulative
    const actionDelay = action.delay_minutes || 0;
    currentDelay += actionDelay;
    
    if (actionDelay > 0) {
      delaysScheduled++;
    }

    switch (action.action_type) {
      case 'email':
        const emailResult = await processEmailAction(supabase, action, subscriber, automationId, triggerData, currentDelay);
        emailsQueued += emailResult ? 1 : 0;
        break;

      case 'add_tag':
        const addResult = await processAddTagAction(supabase, action, subscriber);
        tagsModified += addResult ? 1 : 0;
        break;

      case 'remove_tag':
        const removeResult = await processRemoveTagAction(supabase, action, subscriber);
        tagsModified += removeResult ? 1 : 0;
        break;

      case 'delay':
        // Delay is already handled by adding to currentDelay
        console.log(`Delay action: +${actionDelay} minutes (total: ${currentDelay})`);
        break;

      case 'condition':
        const conditionMet = evaluateCondition(action, subscriber, triggerData);
        console.log(`Condition "${action.condition_field} ${action.condition_operator} ${action.condition_value}": ${conditionMet}`);

        // Get child actions grouped by branch type
        const children = childrenMap.get(action.id) || [];
        const ifActions = children.filter(c => c.branch_type === 'if');
        const elseActions = children.filter(c => c.branch_type === 'else');

        // Execute the appropriate branch
        const branchActions = conditionMet ? ifActions : elseActions;
        if (branchActions.length > 0) {
          const branchResult = await processActionsRecursive(
            supabase,
            branchActions,
            childrenMap,
            subscriber,
            automationId,
            triggerData,
            currentDelay
          );
          emailsQueued += branchResult.emailsQueued;
          tagsModified += branchResult.tagsModified;
          delaysScheduled += branchResult.delaysScheduled;
        }
        break;
    }
  }

  return { emailsQueued, tagsModified, delaysScheduled };
}

async function processEmailAction(
  supabase: any,
  action: WorkflowAction,
  subscriber: Subscriber,
  automationId: string,
  triggerData: Record<string, any>,
  delayMinutes: number
): Promise<boolean> {
  if (!action.subject || !action.html_content) {
    console.warn('Email action missing subject or content');
    return false;
  }

  const scheduledAt = new Date();
  scheduledAt.setMinutes(scheduledAt.getMinutes() + delayMinutes);

  const personalizedSubject = personalizeContent(action.subject, subscriber, triggerData);
  const personalizedHtml = personalizeContent(action.html_content, subscriber, triggerData);
  const personalizedText = action.text_content 
    ? personalizeContent(action.text_content, subscriber, triggerData) 
    : null;

  const { error } = await supabase.from('email_queue').insert({
    subscriber_id: subscriber.id,
    automation_id: automationId,
    subject: personalizedSubject,
    html_content: personalizedHtml,
    text_content: personalizedText,
    scheduled_at: scheduledAt.toISOString(),
    status: 'pending'
  });

  if (error) {
    console.error('Error queuing email:', error);
    return false;
  }

  console.log(`Email queued: "${personalizedSubject}" scheduled for ${scheduledAt.toISOString()}`);
  return true;
}

async function processAddTagAction(
  supabase: any,
  action: WorkflowAction,
  subscriber: Subscriber
): Promise<boolean> {
  const tagsToAdd = action.action_config?.tags || 
                    (action.action_config?.tag_name ? [action.action_config.tag_name] : []);
  
  if (tagsToAdd.length === 0) {
    console.warn('Add tag action has no tags configured');
    return false;
  }

  const currentTags = subscriber.tags || [];
  const newTags = [...new Set([...currentTags, ...tagsToAdd])];

  const { error } = await supabase
    .from('email_subscribers')
    .update({ tags: newTags, updated_at: new Date().toISOString() })
    .eq('id', subscriber.id);

  if (error) {
    console.error('Error adding tags:', error);
    return false;
  }

  // Update local subscriber object
  subscriber.tags = newTags;
  console.log(`Tags added: ${tagsToAdd.join(', ')} to subscriber ${subscriber.email}`);
  return true;
}

async function processRemoveTagAction(
  supabase: any,
  action: WorkflowAction,
  subscriber: Subscriber
): Promise<boolean> {
  const tagsToRemove = action.action_config?.tags || 
                       (action.action_config?.tag_name ? [action.action_config.tag_name] : []);
  
  if (tagsToRemove.length === 0) {
    console.warn('Remove tag action has no tags configured');
    return false;
  }

  const currentTags = subscriber.tags || [];
  const newTags = currentTags.filter(t => !tagsToRemove.includes(t));

  const { error } = await supabase
    .from('email_subscribers')
    .update({ tags: newTags, updated_at: new Date().toISOString() })
    .eq('id', subscriber.id);

  if (error) {
    console.error('Error removing tags:', error);
    return false;
  }

  // Update local subscriber object
  subscriber.tags = newTags;
  console.log(`Tags removed: ${tagsToRemove.join(', ')} from subscriber ${subscriber.email}`);
  return true;
}

function evaluateCondition(
  action: WorkflowAction,
  subscriber: Subscriber,
  triggerData: Record<string, any>
): boolean {
  const field = action.condition_field;
  const operator = action.condition_operator;
  const value = action.condition_value;

  if (!field || !operator) {
    console.warn('Condition missing field or operator');
    return false;
  }

  // Get the field value
  let fieldValue: any;
  
  switch (field) {
    case 'tags':
      fieldValue = subscriber.tags || [];
      break;
    case 'source':
      fieldValue = subscriber.source || '';
      break;
    case 'email_domain':
      fieldValue = subscriber.email.split('@')[1] || '';
      break;
    case 'company':
      fieldValue = subscriber.company || '';
      break;
    case 'first_name':
      fieldValue = subscriber.first_name || '';
      break;
    case 'last_name':
      fieldValue = subscriber.last_name || '';
      break;
    default:
      // Check trigger data
      fieldValue = triggerData[field] || '';
  }

  // Evaluate based on operator
  switch (operator) {
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    
    case 'not_contains':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(value);
      }
      return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    
    case 'equals':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      return String(fieldValue).toLowerCase() === String(value).toLowerCase();
    
    case 'not_equals':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(value);
      }
      return String(fieldValue).toLowerCase() !== String(value).toLowerCase();
    
    case 'is_empty':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length === 0;
      }
      return !fieldValue || String(fieldValue).trim() === '';
    
    case 'is_not_empty':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length > 0;
      }
      return !!fieldValue && String(fieldValue).trim() !== '';
    
    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
}

function personalizeContent(
  content: string,
  subscriber: Subscriber,
  triggerData: Record<string, any>
): string {
  let result = content;

  // Subscriber placeholders
  result = result.replace(/\{\{first_name\}\}/g, subscriber.first_name || 'Liebe/r Interessent/in');
  result = result.replace(/\{\{last_name\}\}/g, subscriber.last_name || '');
  result = result.replace(/\{\{email\}\}/g, subscriber.email);
  result = result.replace(/\{\{company\}\}/g, subscriber.company || '');
  result = result.replace(/\{\{phone\}\}/g, subscriber.phone || '');

  // Trigger data placeholders
  result = result.replace(/\{\{company_name\}\}/g, triggerData.company_name || 'Unicum Tech');
  result = result.replace(/\{\{service_type\}\}/g, triggerData.service_type || '');
  result = result.replace(/\{\{appointment_date\}\}/g, triggerData.appointment_date || '');
  result = result.replace(/\{\{appointment_time\}\}/g, triggerData.appointment_time || '');
  result = result.replace(/\{\{meeting_type\}\}/g, triggerData.meeting_type || '');
  result = result.replace(/\{\{meeting_link\}\}/g, triggerData.meeting_link || '');
  result = result.replace(/\{\{message\}\}/g, triggerData.message || '');

  // Generic placeholder replacement for any remaining
  Object.entries(triggerData).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, String(value || ''));
  });

  return result;
}

serve(handler);
