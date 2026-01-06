-- Create renewal settings table for appointment renewals
CREATE TABLE public.renewal_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL,
  renewal_type TEXT NOT NULL CHECK (renewal_type IN ('automatic', 'reminder')),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  advance_notice_days INTEGER NOT NULL DEFAULT 7,
  max_renewals INTEGER NOT NULL DEFAULT 12,
  renewals_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  next_renewal_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create renewal reminders table
CREATE TABLE public.renewal_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL,
  renewal_setting_id UUID REFERENCES public.renewal_settings(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automated tasks table for background processing
CREATE TABLE public.automated_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL,
  task_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.renewal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewal_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin can manage renewal settings" ON public.renewal_settings FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin can manage renewal reminders" ON public.renewal_reminders FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin can manage automated tasks" ON public.automated_tasks FOR ALL USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_renewal_settings_appointment ON public.renewal_settings(appointment_id);
CREATE INDEX idx_renewal_reminders_appointment ON public.renewal_reminders(appointment_id);
CREATE INDEX idx_renewal_reminders_status ON public.renewal_reminders(status);
CREATE INDEX idx_automated_tasks_status ON public.automated_tasks(status);
CREATE INDEX idx_automated_tasks_scheduled ON public.automated_tasks(scheduled_for);

-- Create triggers for updated_at
CREATE TRIGGER update_renewal_settings_updated_at
  BEFORE UPDATE ON public.renewal_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to process renewals
CREATE OR REPLACE FUNCTION public.process_renewal_tasks()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
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