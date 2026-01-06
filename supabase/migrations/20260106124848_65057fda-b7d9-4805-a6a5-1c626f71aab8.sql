-- Drop the existing foreign key constraint
ALTER TABLE email_events 
DROP CONSTRAINT IF EXISTS email_events_subscriber_id_fkey;

-- Re-add with CASCADE DELETE
ALTER TABLE email_events 
ADD CONSTRAINT email_events_subscriber_id_fkey 
FOREIGN KEY (subscriber_id) 
REFERENCES email_subscribers(id) 
ON DELETE CASCADE;

-- Also add CASCADE to email_queue if it exists
ALTER TABLE email_queue 
DROP CONSTRAINT IF EXISTS email_queue_subscriber_id_fkey;

ALTER TABLE email_queue 
ADD CONSTRAINT email_queue_subscriber_id_fkey 
FOREIGN KEY (subscriber_id) 
REFERENCES email_subscribers(id) 
ON DELETE CASCADE;