-- Create availability_templates table
CREATE TABLE public.availability_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  schedule JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calendar_blocked_dates table for holidays and blocked dates
CREATE TABLE public.calendar_blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL DEFAULT 'blocked' CHECK (type IN ('holiday', 'vacation', 'blocked')),
  description TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.availability_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_blocked_dates ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can manage availability templates" 
ON public.availability_templates 
FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage blocked dates" 
ON public.calendar_blocked_dates 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Create policies for public read access (for appointment booking)
CREATE POLICY "Anyone can view active availability templates" 
ON public.availability_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view blocked dates" 
ON public.calendar_blocked_dates 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_availability_templates_updated_at
BEFORE UPDATE ON public.availability_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default availability template
INSERT INTO public.availability_templates (name, description, schedule, is_active)
VALUES (
  'Standard Bürozeiten',
  'Montag bis Freitag, 9:00 - 17:00 Uhr',
  '{
    "monday": {"start": "09:00", "end": "17:00", "active": true},
    "tuesday": {"start": "09:00", "end": "17:00", "active": true},
    "wednesday": {"start": "09:00", "end": "17:00", "active": true},
    "thursday": {"start": "09:00", "end": "17:00", "active": true},
    "friday": {"start": "09:00", "end": "17:00", "active": true},
    "saturday": {"start": "09:00", "end": "17:00", "active": false},
    "sunday": {"start": "09:00", "end": "17:00", "active": false}
  }',
  true
);

-- Insert German holidays for 2025
INSERT INTO public.calendar_blocked_dates (name, date, type, is_recurring) VALUES
('Neujahr', '2025-01-01', 'holiday', true),
('Karfreitag', '2025-04-18', 'holiday', false),
('Ostermontag', '2025-04-21', 'holiday', false),
('Tag der Arbeit', '2025-05-01', 'holiday', true),
('Christi Himmelfahrt', '2025-05-29', 'holiday', false),
('Pfingstmontag', '2025-06-09', 'holiday', false),
('Tag der Deutschen Einheit', '2025-10-03', 'holiday', true),
('Weihnachtstag', '2025-12-25', 'holiday', true),
('Zweiter Weihnachtstag', '2025-12-26', 'holiday', true);