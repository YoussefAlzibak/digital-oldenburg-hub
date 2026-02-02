-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table (security best practice)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Contact requests table
CREATE TABLE public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    service_type TEXT,
    message TEXT,
    budget TEXT,
    timeline TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_request_id UUID REFERENCES public.contact_requests(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    google_event_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Google Calendar Settings
CREATE TABLE public.google_calendar_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id TEXT DEFAULT 'primary',
    working_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
    working_hours_start TIME DEFAULT '09:00',
    working_hours_end TIME DEFAULT '17:00',
    slot_duration_minutes INTEGER DEFAULT 60,
    buffer_minutes INTEGER DEFAULT 15,
    sync_enabled BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.google_calendar_settings ENABLE ROW LEVEL SECURITY;

-- Google OAuth Tokens
CREATE TABLE public.google_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ NOT NULL,
    scope TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.google_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Google Calendar Sync Log
CREATE TABLE public.google_calendar_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_type TEXT NOT NULL,
    status TEXT NOT NULL,
    sync_data JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.google_calendar_sync_log ENABLE ROW LEVEL SECURITY;

-- Availability Templates
CREATE TABLE public.availability_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    schedule JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.availability_templates ENABLE ROW LEVEL SECURITY;

-- Calendar Blocked Dates
CREATE TABLE public.calendar_blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL,
    reason TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.calendar_blocked_dates ENABLE ROW LEVEL SECURITY;

-- Renewal Settings
CREATE TABLE public.renewal_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    renewal_type TEXT NOT NULL,
    frequency TEXT NOT NULL,
    advance_notice_days INTEGER DEFAULT 14,
    max_renewals INTEGER DEFAULT 12,
    renewals_count INTEGER DEFAULT 0,
    next_renewal_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.renewal_settings ENABLE ROW LEVEL SECURITY;

-- Renewal Reminders
CREATE TABLE public.renewal_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    renewal_setting_id UUID REFERENCES public.renewal_settings(id) ON DELETE CASCADE,
    reminder_date DATE NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.renewal_reminders ENABLE ROW LEVEL SECURITY;

-- Email Templates
CREATE TABLE public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    template_type TEXT DEFAULT 'general',
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Email Automations
CREATE TABLE public.email_automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;

-- Email Automation Steps
CREATE TABLE public.email_automation_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES public.email_automations(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    step_number INTEGER NOT NULL,
    delay_minutes INTEGER DEFAULT 0,
    subject TEXT,
    html_content TEXT,
    text_content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_automation_steps ENABLE ROW LEVEL SECURITY;

-- Newsletter Subscribers
CREATE TABLE public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    status TEXT DEFAULT 'active',
    source TEXT DEFAULT 'website',
    tags TEXT[] DEFAULT '{}',
    subscribed_at TIMESTAMPTZ DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Customer Reviews
CREATE TABLE public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    service_type TEXT,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- SMTP Settings
CREATE TABLE public.smtp_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host TEXT NOT NULL,
    port INTEGER DEFAULT 587,
    username TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT DEFAULT 'Unicum Tech',
    encryption TEXT DEFAULT 'tls',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Email Campaigns
CREATE TABLE public.email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    target_tags TEXT[] DEFAULT '{}',
    recipient_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- Campaign Analytics
CREATE TABLE public.campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID REFERENCES public.newsletter_subscribers(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Email Queue
CREATE TABLE public.email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email TEXT NOT NULL,
    to_name TEXT,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    status TEXT DEFAULT 'pending',
    priority INTEGER DEFAULT 5,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_error TEXT,
    scheduled_for TIMESTAMPTZ DEFAULT now(),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User roles: only admins can manage
CREATE POLICY "Admins can manage user roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Contact requests: public insert, admin read/update
CREATE POLICY "Anyone can submit contact requests" ON public.contact_requests
FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact requests" ON public.contact_requests
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact requests" ON public.contact_requests
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact requests" ON public.contact_requests
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Appointments: public insert, admin manage
CREATE POLICY "Anyone can book appointments" ON public.appointments
FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view appointments" ON public.appointments
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update appointments" ON public.appointments
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete appointments" ON public.appointments
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Google Calendar Settings: admin only
CREATE POLICY "Admins can manage calendar settings" ON public.google_calendar_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can read active calendar settings" ON public.google_calendar_settings
FOR SELECT USING (is_active = true);

-- Google OAuth Tokens: admin only
CREATE POLICY "Admins can manage oauth tokens" ON public.google_oauth_tokens
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Sync Log: admin only
CREATE POLICY "Admins can view sync logs" ON public.google_calendar_sync_log
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Availability Templates: public read, admin manage
CREATE POLICY "Public can read active templates" ON public.availability_templates
FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage templates" ON public.availability_templates
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Calendar Blocked Dates: public read, admin manage
CREATE POLICY "Public can read blocked dates" ON public.calendar_blocked_dates
FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked dates" ON public.calendar_blocked_dates
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Renewal Settings: admin only
CREATE POLICY "Admins can manage renewal settings" ON public.renewal_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Renewal Reminders: admin only
CREATE POLICY "Admins can manage renewal reminders" ON public.renewal_reminders
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Email Templates: admin only
CREATE POLICY "Admins can manage email templates" ON public.email_templates
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Email Automations: admin only
CREATE POLICY "Admins can manage automations" ON public.email_automations
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Email Automation Steps: admin only
CREATE POLICY "Admins can manage automation steps" ON public.email_automation_steps
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter Subscribers: public insert, admin manage
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update subscribers" ON public.newsletter_subscribers
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Customer Reviews: public insert, public read approved, admin manage
CREATE POLICY "Anyone can submit reviews" ON public.customer_reviews
FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read approved reviews" ON public.customer_reviews
FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can manage reviews" ON public.customer_reviews
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- SMTP Settings: admin only
CREATE POLICY "Admins can manage smtp settings" ON public.smtp_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Email Campaigns: admin only
CREATE POLICY "Admins can manage campaigns" ON public.email_campaigns
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Campaign Analytics: admin only
CREATE POLICY "Admins can view analytics" ON public.campaign_analytics
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Email Queue: admin only
CREATE POLICY "Admins can manage email queue" ON public.email_queue
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_contact_requests_updated_at BEFORE UPDATE ON public.contact_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_google_calendar_settings_updated_at BEFORE UPDATE ON public.google_calendar_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_google_oauth_tokens_updated_at BEFORE UPDATE ON public.google_oauth_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_availability_templates_updated_at BEFORE UPDATE ON public.availability_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_renewal_settings_updated_at BEFORE UPDATE ON public.renewal_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_automations_updated_at BEFORE UPDATE ON public.email_automations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_smtp_settings_updated_at BEFORE UPDATE ON public.smtp_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Process renewal tasks function
CREATE OR REPLACE FUNCTION public.process_renewal_tasks()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    processed_count INTEGER := 0;
BEGIN
    -- Update renewal settings where next_renewal_date has passed
    UPDATE public.renewal_settings
    SET renewals_count = renewals_count + 1,
        next_renewal_date = CASE 
            WHEN frequency = 'weekly' THEN next_renewal_date + INTERVAL '1 week'
            WHEN frequency = 'biweekly' THEN next_renewal_date + INTERVAL '2 weeks'
            WHEN frequency = 'monthly' THEN next_renewal_date + INTERVAL '1 month'
            WHEN frequency = 'quarterly' THEN next_renewal_date + INTERVAL '3 months'
            WHEN frequency = 'yearly' THEN next_renewal_date + INTERVAL '1 year'
            ELSE next_renewal_date + INTERVAL '1 month'
        END,
        updated_at = now()
    WHERE is_active = true 
      AND next_renewal_date <= CURRENT_DATE
      AND (max_renewals IS NULL OR renewals_count < max_renewals);
    
    GET DIAGNOSTICS processed_count = ROW_COUNT;
    RETURN processed_count;
END;
$$;