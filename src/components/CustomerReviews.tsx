import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CustomerReviewForm } from "./CustomerReviewForm";

interface Review {
  id: string;
  customer_name: string;
  company?: string;
  service_type: string;
  rating: number;
  review_text: string;
  review_date: string;
  is_featured: boolean;
}

export const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("customer_reviews")
        .select("*")
        .eq("is_approved", true)
        .eq("is_public", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up gradient-text">
              Was unsere Kunden sagen
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--brand-primary))]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long"
    });
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up gradient-text">
            Was unsere Kunden sagen
          </h2>
          <p className="text-xl text-muted-foreground animate-fade-in-up stagger-1 max-w-3xl mx-auto mb-8">
            Echtes Feedback von zufriedenen Kunden aus Oldenburg und Umgebung
          </p>
          
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="hover-lift mb-12">
                <MessageSquare className="mr-2 h-4 w-4" />
                Bewertung abgeben
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <CustomerReviewForm onClose={() => setShowForm(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Noch keine Bewertungen verfügbar. Seien Sie der Erste!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card 
                key={review.id} 
                className={`p-8 hover-lift glass-card relative group animate-fade-in-up stagger-${index + 1} ${
                  review.is_featured ? "ring-2 ring-[hsl(var(--brand-primary))] ring-opacity-20" : ""
                }`}
              >
                {review.is_featured && (
                  <Badge 
                    className="absolute -top-3 -right-3 bg-[hsl(var(--brand-primary))] text-white"
                  >
                    Featured
                  </Badge>
                )}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                
                <CardContent className="pt-8">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {getInitials(review.customer_name)}
                    </div>
                    <div className="ml-6">
                      <h4 className="font-semibold text-lg">{review.customer_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {review.company ? `${review.company} • ` : ""}{review.service_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.review_date)}
                      </p>
                    </div>
                  </div>
                  
                  <blockquote className="text-muted-foreground italic text-lg leading-relaxed mb-6">
                    "{review.review_text}"
                  </blockquote>
                  
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "fill-[hsl(var(--brand-accent))] text-[hsl(var(--brand-accent))]"
                            : "text-gray-300"
                        } group-hover:scale-110 transition-transform duration-300`}
                        style={{transitionDelay: `${i * 50}ms`}} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Haben Sie bereits mit uns gearbeitet?
          </p>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover-lift">
                Ihre Bewertung hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <CustomerReviewForm onClose={() => setShowForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};