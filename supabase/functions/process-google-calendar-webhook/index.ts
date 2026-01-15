import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-goog-channel-id, x-goog-channel-token, x-goog-resource-id, x-goog-resource-state, x-goog-resource-uri, x-goog-message-number',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Extract Google push notification headers
    const channelId = req.headers.get('x-goog-channel-id')
    const resourceState = req.headers.get('x-goog-resource-state')
    const resourceId = req.headers.get('x-goog-resource-id')
    const messageNumber = req.headers.get('x-goog-message-number')
    const channelToken = req.headers.get('x-goog-channel-token')

    console.log(`Received Google Calendar webhook: state=${resourceState}, channel=${channelId}, message=${messageNumber}`)

    // Validate channel token (if we set one during watch creation)
    if (channelToken) {
      const expectedToken = Deno.env.get('GOOGLE_WEBHOOK_SECRET')
      if (expectedToken && channelToken !== expectedToken) {
        console.error('Invalid channel token')
        return new Response('Unauthorized', { status: 401, headers: corsHeaders })
      }
    }

    // Handle sync message (initial setup confirmation)
    if (resourceState === 'sync') {
      console.log('Webhook sync confirmation received')
      
      await supabase
        .from('google_calendar_sync_log')
        .insert({
          sync_type: 'webhook',
          status: 'success',
          sync_data: {
            event: 'sync_confirmation',
            channel_id: channelId,
            resource_id: resourceId,
          },
        })

      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    // Handle exists (changes detected) or change events
    if (resourceState === 'exists' || resourceState === 'change') {
      console.log('Changes detected, triggering sync...')

      // Trigger a pull sync to get the latest changes
      try {
        await supabase.functions.invoke('sync-google-to-appointments', {
          body: { triggered_by: 'webhook' },
        })
      } catch (syncError) {
        console.error('Sync invocation error:', syncError)
      }

      await supabase
        .from('google_calendar_sync_log')
        .insert({
          sync_type: 'webhook',
          status: 'success',
          sync_data: {
            event: resourceState,
            channel_id: channelId,
            resource_id: resourceId,
            message_number: messageNumber,
          },
        })

      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    // Handle delete (watch channel deleted)
    if (resourceState === 'not_exists') {
      console.log('Resource no longer exists')
      
      await supabase
        .from('google_calendar_sync_log')
        .insert({
          sync_type: 'webhook',
          status: 'info',
          sync_data: {
            event: 'resource_deleted',
            channel_id: channelId,
            resource_id: resourceId,
          },
        })

      return new Response('OK', { status: 200, headers: corsHeaders })
    }

    // Unknown state
    console.log(`Unknown resource state: ${resourceState}`)
    return new Response('OK', { status: 200, headers: corsHeaders })

  } catch (error) {
    console.error('Webhook processing error:', error)

    await supabase
      .from('google_calendar_sync_log')
      .insert({
        sync_type: 'webhook',
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error),
      })

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
