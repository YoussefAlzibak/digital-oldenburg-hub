-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Add trigger_config column to email_automations if it doesn't exist (it should exist)
-- This is for storing filter_tags and schedule configuration

-- Create a table to store cron job configurations for tracking
CREATE TABLE IF NOT EXISTS public.automation_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.email_automations(id) ON DELETE CASCADE,
  cron_expression TEXT NOT NULL DEFAULT '0 9 * * *', -- Default: daily at 9 AM
  timezone TEXT NOT NULL DEFAULT 'Europe/Berlin',
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(automation_id)
);

-- Enable RLS
ALTER TABLE public.automation_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin can manage automation schedules"
  ON public.automation_schedules
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_automation_schedules_updated_at
  BEFORE UPDATE ON public.automation_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();