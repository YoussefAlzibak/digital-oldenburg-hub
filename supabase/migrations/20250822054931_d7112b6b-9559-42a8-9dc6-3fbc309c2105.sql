-- Synchronize all existing email_subscribers with the default email list
-- First, clear any orphaned connections
DELETE FROM public.email_list_subscribers 
WHERE subscriber_id NOT IN (SELECT id FROM public.email_subscribers WHERE status = 'active');

-- Insert any missing active subscribers into the default list
INSERT INTO public.email_list_subscribers (list_id, subscriber_id)
SELECT 
  (SELECT id FROM public.email_lists WHERE name = 'Alle Newsletter-Abonnenten' LIMIT 1) as list_id,
  es.id as subscriber_id
FROM public.email_subscribers es
WHERE es.status = 'active' 
AND es.id NOT IN (
  SELECT subscriber_id 
  FROM public.email_list_subscribers 
  WHERE list_id = (SELECT id FROM public.email_lists WHERE name = 'Alle Newsletter-Abonnenten' LIMIT 1)
);

-- Update list subscriber counts in the email_lists table by adding a computed column or trigger
-- For now, we'll handle this in the application level