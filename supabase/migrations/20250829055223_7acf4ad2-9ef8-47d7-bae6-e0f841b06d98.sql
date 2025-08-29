-- Create customer reviews table
CREATE TABLE public.customer_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  company TEXT,
  service_type TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Public can view approved and public reviews
CREATE POLICY "Public can view approved reviews" 
ON public.customer_reviews 
FOR SELECT 
USING (is_approved = true AND is_public = true);

-- Anyone can submit reviews (but they need approval)
CREATE POLICY "Anyone can submit reviews" 
ON public.customer_reviews 
FOR INSERT 
WITH CHECK (true);

-- Admin can manage all reviews
CREATE POLICY "Admin can manage all reviews" 
ON public.customer_reviews 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_customer_reviews_updated_at
BEFORE UPDATE ON public.customer_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_customer_reviews_approved ON public.customer_reviews(is_approved, is_public, created_at DESC);
CREATE INDEX idx_customer_reviews_featured ON public.customer_reviews(is_featured, is_approved, is_public);