-- Create daily cron job for scheduled automations at 9 AM
SELECT cron.schedule(
  'trigger-scheduled-automations-daily',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://kgwanyretbrxwtwduljg.supabase.co/functions/v1/trigger-scheduled-automation',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2FueXJldGJyeHd0d2R1bGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODkwNDQsImV4cCI6MjA3MTM2NTA0NH0.1epHsTsOfI74BcSVn-RL8H9ZmpJQoyg75HlCZozG53Y"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);