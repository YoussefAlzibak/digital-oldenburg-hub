-- Email Marketing System Tables
-- Email Lists für Organisation der Kontakte
CREATE TABLE public.email_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Email Subscribers (getrennt von contact_requests für Marketing)
CREATE TABLE public.email_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  company text,
  phone text,
  tags text[],
  status text NOT NULL DEFAULT 'active', -- active, unsubscribed, bounced
  source text, -- contact_form, manual, import
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Verknüpfung zwischen Subscribers und Listen
CREATE TABLE public.email_list_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id uuid NOT NULL REFERENCES email_lists(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL REFERENCES email_subscribers(id) ON DELETE CASCADE,
  subscribed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(list_id, subscriber_id)
);

-- Email Templates
CREATE TABLE public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  template_type text NOT NULL DEFAULT 'marketing', -- marketing, transactional, automation
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Email Kampagnen
CREATE TABLE public.email_campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  template_id uuid REFERENCES email_templates(id),
  html_content text NOT NULL,
  text_content text,
  list_id uuid REFERENCES email_lists(id),
  status text NOT NULL DEFAULT 'draft', -- draft, scheduled, sending, sent, cancelled
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  total_recipients integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  bounced_count integer DEFAULT 0,
  unsubscribed_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Email Automation Workflows
CREATE TABLE public.email_automations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL, -- subscription, appointment_booked, contact_form, date_based
  trigger_config jsonb, -- Konfiguration für den Trigger
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Automation Steps/Emails
CREATE TABLE public.email_automation_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id uuid NOT NULL REFERENCES email_automations(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  template_id uuid REFERENCES email_templates(id),
  delay_minutes integer DEFAULT 0, -- Verzögerung nach dem vorherigen Step
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(automation_id, step_number)
);

-- Email Sending Queue
CREATE TABLE public.email_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id uuid NOT NULL REFERENCES email_subscribers(id),
  campaign_id uuid REFERENCES email_campaigns(id),
  automation_id uuid REFERENCES email_automations(id),
  automation_step_id uuid REFERENCES email_automation_steps(id),
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  status text NOT NULL DEFAULT 'pending', -- pending, sent, failed, cancelled
  scheduled_at timestamp with time zone NOT NULL DEFAULT now(),
  sent_at timestamp with time zone,
  error_message text,
  retry_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Email Analytics/Tracking
CREATE TABLE public.email_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id uuid NOT NULL REFERENCES email_subscribers(id),
  campaign_id uuid REFERENCES email_campaigns(id),
  automation_id uuid REFERENCES email_automations(id),
  event_type text NOT NULL, -- delivered, opened, clicked, bounced, unsubscribed
  event_data jsonb, -- zusätzliche Daten wie Click-URLs
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_list_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- Admin policies for all tables
CREATE POLICY "Admin can manage email lists" ON public.email_lists FOR ALL USING (true);
CREATE POLICY "Admin can manage email subscribers" ON public.email_subscribers FOR ALL USING (true);
CREATE POLICY "Admin can manage list subscribers" ON public.email_list_subscribers FOR ALL USING (true);
CREATE POLICY "Admin can manage email templates" ON public.email_templates FOR ALL USING (true);
CREATE POLICY "Admin can manage email campaigns" ON public.email_campaigns FOR ALL USING (true);
CREATE POLICY "Admin can manage email automations" ON public.email_automations FOR ALL USING (true);
CREATE POLICY "Admin can manage automation steps" ON public.email_automation_steps FOR ALL USING (true);
CREATE POLICY "Admin can manage email queue" ON public.email_queue FOR ALL USING (true);
CREATE POLICY "Admin can view email events" ON public.email_events FOR SELECT USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_email_lists_updated_at BEFORE UPDATE ON public.email_lists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_subscribers_updated_at BEFORE UPDATE ON public.email_subscribers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_automations_updated_at BEFORE UPDATE ON public.email_automations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes für Performance
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON public.email_subscribers(status);
CREATE INDEX idx_email_queue_status ON public.email_queue(status);
CREATE INDEX idx_email_queue_scheduled ON public.email_queue(scheduled_at);
CREATE INDEX idx_email_events_type ON public.email_events(event_type);
CREATE INDEX idx_email_events_created ON public.email_events(created_at);