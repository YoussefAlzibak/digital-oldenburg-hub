import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Eye, EyeOff, Award, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Review {
  id: string;
  customer_name: string;
  customer_email: string | null;
  company: string | null;
  service_type: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  is_featured: boolean;
  is_public: boolean;
  review_date: string;
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Bewertungen:', error);
      toast({
        title: "Fehler",
        description: "Bewertungen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();

    const channel = supabase
      .channel('reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customer_reviews' }, () => {
        loadReviews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: `Bewertung wurde ${!currentStatus ? 'genehmigt' : 'abgelehnt'}.`
      });
      loadReviews();
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: `Bewertung wurde ${!currentStatus ? 'hervorgehoben' : 'nicht mehr hervorgehoben'}.`
      });
      loadReviews();
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const togglePublic = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .update({ is_public: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: `Bewertung ist jetzt ${!currentStatus ? 'öffentlich' : 'privat'}.`
      });
      loadReviews();
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const deleteReview = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('customer_reviews')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Bewertung wurde gelöscht."
      });
      setDeleteId(null);
      loadReviews();
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      toast({
        title: "Fehler",
        description: "Bewertung konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (review: Review) => {
    if (!review.is_approved) {
      return <Badge variant="destructive">Ausstehend</Badge>;
    }
    if (review.is_featured) {
      return <Badge variant="default">Hervorgehoben</Badge>;
    }
    if (review.is_public) {
      return <Badge variant="secondary">Öffentlich</Badge>;
    }
    return <Badge variant="outline">Privat</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-muted-foreground">Laden...</div>
      </div>
    );
  }

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => !r.is_approved).length,
    approved: reviews.filter(r => r.is_approved).length,
    featured: reviews.filter(r => r.is_featured).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Kundenbewertungen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Kundenbewertungen und Feedback
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genehmigt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hervorgehoben</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{review.customer_name}</CardTitle>
                    {getStatusBadge(review)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {review.company && <span>{review.company}</span>}
                    {review.company && <span>•</span>}
                    <span>{review.service_type}</span>
                    <span>•</span>
                    <span>{new Date(review.review_date).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{review.review_text}</p>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={review.is_approved ? "outline" : "default"}
                  onClick={() => toggleApproval(review.id, review.is_approved)}
                >
                  {review.is_approved ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Ablehnen
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Genehmigen
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant={review.is_featured ? "default" : "outline"}
                  onClick={() => toggleFeatured(review.id, review.is_featured)}
                  disabled={!review.is_approved}
                >
                  <Award className="h-4 w-4 mr-2" />
                  {review.is_featured ? "Hervorhebung entfernen" : "Hervorheben"}
                </Button>

                <Button
                  size="sm"
                  variant={review.is_public ? "outline" : "secondary"}
                  onClick={() => togglePublic(review.id, review.is_public)}
                  disabled={!review.is_approved}
                >
                  {review.is_public ? "Privat machen" : "Öffentlich machen"}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteId(review.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Keine Bewertungen vorhanden</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bewertung löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Bewertung wird dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={deleteReview}>Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
