import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CustomerReviewFormProps {
  onClose?: () => void;
}

export const CustomerReviewForm = ({ onClose }: CustomerReviewFormProps) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    company: "",
    service_type: "",
    rating: 0,
    review_text: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const services = [
    "Webdesign",
    "CRM-Integration", 
    "Smart Home",
    "IT-Beratung",
    "Printdesign",
    "Sonstiges"
  ];

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: "Bewertung erforderlich",
        description: "Bitte wählen Sie eine Sterne-Bewertung aus.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("customer_reviews")
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Bewertung eingereicht!",
        description: "Vielen Dank für Ihr Feedback. Ihre Bewertung wird vor der Veröffentlichung geprüft.",
      });

      setFormData({
        customer_name: "",
        customer_email: "",
        company: "",
        service_type: "",
        rating: 0,
        review_text: ""
      });

      onClose?.();
    } catch (error) {
      console.error("Fehler beim Einreichen der Bewertung:", error);
      toast({
        title: "Fehler",
        description: "Beim Einreichen der Bewertung ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Bewertung abgeben</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email">E-Mail *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Unternehmen</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_type">Service *</Label>
            <Select value={formData.service_type} onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie einen Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bewertung *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= formData.rating
                      ? "fill-[hsl(var(--brand-accent))] text-[hsl(var(--brand-accent))]"
                      : "text-gray-300 hover:text-[hsl(var(--brand-accent))]"
                  }`}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review_text">Ihr Feedback *</Label>
            <Textarea
              id="review_text"
              rows={4}
              value={formData.review_text}
              onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
              placeholder="Teilen Sie Ihre Erfahrungen mit uns..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Abbrechen
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Wird eingereicht..." : "Bewertung abgeben"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};