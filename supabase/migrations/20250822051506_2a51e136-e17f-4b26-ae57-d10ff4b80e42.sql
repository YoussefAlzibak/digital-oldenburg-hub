-- Create default email list for all subscribers
INSERT INTO public.email_lists (name, description, is_active) 
VALUES ('Alle Newsletter-Abonnenten', 'Standard-Liste für alle Newsletter-Abonnenten', true);

-- Get the ID of the newly created list
INSERT INTO public.email_list_subscribers (list_id, subscriber_id)
SELECT 
  (SELECT id FROM public.email_lists WHERE name = 'Alle Newsletter-Abonnenten' LIMIT 1) as list_id,
  id as subscriber_id
FROM public.email_subscribers 
WHERE status = 'active';