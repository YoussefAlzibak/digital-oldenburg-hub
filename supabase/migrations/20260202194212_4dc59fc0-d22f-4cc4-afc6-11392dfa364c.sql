-- Add tags column to email_subscribers if not exists (for tag management)
ALTER TABLE public.email_subscribers 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create workflow_actions table for extended action types (if/else, tags, etc.)
CREATE TABLE IF NOT EXISTS public.workflow_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.email_automations(id) ON DELETE CASCADE,
  parent_action_id UUID REFERENCES public.workflow_actions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL DEFAULT 1,
  action_type TEXT NOT NULL DEFAULT 'email', -- email, condition, add_tag, remove_tag, delay, update_contact
  action_config JSONB DEFAULT '{}',
  -- For conditions (if/else)
  condition_field TEXT, -- e.g., 'tags', 'email_opened', 'subscriber_source'
  condition_operator TEXT, -- 'equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty'
  condition_value TEXT,
  branch_type TEXT, -- 'if', 'else', null for regular actions
  -- For email actions
  subject TEXT,
  html_content TEXT,
  text_content TEXT,
  delay_minutes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_workflow_actions_automation ON public.workflow_actions(automation_id);
CREATE INDEX IF NOT EXISTS idx_workflow_actions_parent ON public.workflow_actions(parent_action_id);

-- Enable RLS
ALTER TABLE public.workflow_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflow_actions (admin only)
CREATE POLICY "Admins can manage workflow actions" ON public.workflow_actions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Create available_tags table for predefined tags
CREATE TABLE IF NOT EXISTS public.available_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3b82f6',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.available_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for available_tags
CREATE POLICY "Anyone can view tags" ON public.available_tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON public.available_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Insert some default tags
INSERT INTO public.available_tags (name, color, description) VALUES
  ('newsletter', '#3b82f6', 'Newsletter-Abonnent'),
  ('lead', '#22c55e', 'Potentieller Kunde'),
  ('customer', '#8b5cf6', 'Bestehender Kunde'),
  ('vip', '#f59e0b', 'VIP-Kunde'),
  ('inactive', '#6b7280', 'Inaktiver Kontakt'),
  ('interested-webdesign', '#06b6d4', 'Interesse an Webdesign'),
  ('interested-seo', '#ec4899', 'Interesse an SEO'),
  ('interested-marketing', '#14b8a6', 'Interesse an Marketing')
ON CONFLICT (name) DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_workflow_actions_updated_at
  BEFORE UPDATE ON public.workflow_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();