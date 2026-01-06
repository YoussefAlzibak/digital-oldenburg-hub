-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- Update existing admin policies to use the new admin check
DROP POLICY IF EXISTS "Admin can manage appointments" ON public.appointments;
CREATE POLICY "Admin can manage appointments"
ON public.appointments
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can view all contact requests" ON public.contact_requests;
CREATE POLICY "Admin can view all contact requests"
ON public.contact_requests
FOR SELECT
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage automation steps" ON public.email_automation_steps;
CREATE POLICY "Admin can manage automation steps"
ON public.email_automation_steps
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage email automations" ON public.email_automations;
CREATE POLICY "Admin can manage email automations"
ON public.email_automations
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage email campaigns" ON public.email_campaigns;
CREATE POLICY "Admin can manage email campaigns"
ON public.email_campaigns
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can view email events" ON public.email_events;
CREATE POLICY "Admin can view email events"
ON public.email_events
FOR SELECT
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage list subscribers" ON public.email_list_subscribers;
CREATE POLICY "Admin can manage list subscribers"
ON public.email_list_subscribers
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage email lists" ON public.email_lists;
CREATE POLICY "Admin can manage email lists"
ON public.email_lists
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage email queue" ON public.email_queue;
CREATE POLICY "Admin can manage email queue"
ON public.email_queue
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage email templates" ON public.email_templates;
CREATE POLICY "Admin can manage email templates"
ON public.email_templates
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage Google Calendar settings" ON public.google_calendar_settings;
CREATE POLICY "Admin can manage Google Calendar settings"
ON public.google_calendar_settings
FOR ALL
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage SMTP settings" ON public.smtp_settings;
CREATE POLICY "Admin can manage SMTP settings"
ON public.smtp_settings
FOR ALL
USING (public.is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();