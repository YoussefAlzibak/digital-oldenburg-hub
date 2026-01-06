-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule email queue processing every 5 minutes
SELECT cron.schedule(
  'process-email-queue-job',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://kgwanyretbrxwtwduljg.supabase.co/functions/v1/process-email-queue',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2FueXJldGJyeHd0d2R1bGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODkwNDQsImV4cCI6MjA3MTM2NTA0NH0.1epHsTsOfI74BcSVn-RL8H9ZmpJQoyg75HlCZozG53Y"}'::jsonb,
        body:='{"batchSize": 50}'::jsonb
    ) as request_id;
  $$
);

-- Add comment
COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';
COMMENT ON EXTENSION pg_net IS 'Async HTTP client for PostgreSQL';
