-- Add indexes for better email queue performance
CREATE INDEX IF NOT EXISTS idx_email_queue_status_scheduled 
ON email_queue(status, scheduled_at) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_email_queue_subscriber 
ON email_queue(subscriber_id);

CREATE INDEX IF NOT EXISTS idx_email_queue_campaign 
ON email_queue(campaign_id) 
WHERE campaign_id IS NOT NULL;

-- Add index for faster subscriber lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status 
ON email_subscribers(status) 
WHERE status = 'active';

-- Add index for campaign stats
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status 
ON email_campaigns(status, created_at DESC);

-- Add comments
COMMENT ON INDEX idx_email_queue_status_scheduled IS 'Optimizes email queue processing for pending emails';
COMMENT ON INDEX idx_email_subscribers_status IS 'Speeds up active subscriber queries for bulk sending';
