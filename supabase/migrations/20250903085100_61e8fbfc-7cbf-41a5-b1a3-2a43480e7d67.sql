-- Fix security warnings by setting proper search_path for functions

-- Update the process_renewal_tasks function with secure search_path
CREATE OR REPLACE FUNCTION public.process_renewal_tasks()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  processed_count INTEGER := 0;
  renewal_record RECORD;
BEGIN
  -- Process due renewal reminders
  FOR renewal_record IN 
    SELECT rs.*, a.*, cr.email, cr.name, cr.company, cr.service_type
    FROM public.renewal_settings rs
    JOIN public.appointments a ON rs.appointment_id = a.id
    LEFT JOIN public.contact_requests cr ON a.contact_request_id = cr.id
    WHERE rs.is_active = true
    AND rs.next_renewal_date <= CURRENT_DATE
    AND rs.renewals_count < rs.max_renewals
  LOOP
    -- Create reminder entry
    INSERT INTO public.renewal_reminders (
      appointment_id,
      renewal_setting_id,
      reminder_date,
      status
    ) VALUES (
      renewal_record.appointment_id,
      renewal_record.id,
      CURRENT_DATE,
      'pending'
    );
    
    -- Update renewal settings
    UPDATE public.renewal_settings 
    SET 
      renewals_count = renewals_count + 1,
      next_renewal_date = CASE 
        WHEN frequency = 'weekly' THEN next_renewal_date + INTERVAL '1 week'
        WHEN frequency = 'monthly' THEN next_renewal_date + INTERVAL '1 month'
        WHEN frequency = 'quarterly' THEN next_renewal_date + INTERVAL '3 months'
        WHEN frequency = 'yearly' THEN next_renewal_date + INTERVAL '1 year'
        ELSE next_renewal_date + INTERVAL '1 month'
      END,
      is_active = CASE WHEN renewals_count + 1 >= max_renewals THEN false ELSE is_active END
    WHERE id = renewal_record.id;
    
    processed_count := processed_count + 1;
  END LOOP;
  
  RETURN processed_count;
END;
$$;