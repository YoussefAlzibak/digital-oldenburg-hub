-- Create contact_requests table for consultation requests
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  message TEXT,
  preferred_date DATE,
  preferred_time TIME,
  budget_range TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table for scheduled consultations
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_request_id UUID REFERENCES public.contact_requests(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  meeting_type TEXT NOT NULL DEFAULT 'video_call',
  meeting_link TEXT,
  consultant_notes TEXT,
  client_confirmed BOOLEAN DEFAULT false,
  consultant_confirmed BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for contact requests (public can insert, admin can view all)
CREATE POLICY "Anyone can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can view all contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (true); -- You can restrict this later with admin role

-- Create policies for appointments (similar access pattern)
CREATE POLICY "Admin can manage appointments" 
ON public.appointments 
FOR ALL 
USING (true); -- You can restrict this later with admin role

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_contact_requests_email ON public.contact_requests(email);
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON public.contact_requests(created_at);
CREATE INDEX idx_appointments_scheduled_date ON public.appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);