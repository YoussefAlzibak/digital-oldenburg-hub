import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !firstName) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Check if email already exists
      const { data: existingSubscriber } = await supabase
        .from('email_subscribers')
        .select('id')
        .eq('email', email)
        .single();

      if (existingSubscriber) {
        toast({
          title: "Bereits angemeldet",
          description: "Diese E-Mail-Adresse ist bereits für unseren Newsletter registriert.",
          variant: "destructive"
        });
        return;
      }

      // Insert new subscriber
      const { error } = await supabase
        .from('email_subscribers')
        .insert([{
          email: email,
          first_name: firstName,
          source: 'website_newsletter',
          status: 'active'
        }]);

      if (error) throw error;

      setIsSuccess(true);
      setEmail('');
      setFirstName('');
      
      toast({
        title: "Erfolgreich angemeldet!",
        description: "Vielen Dank für Ihre Anmeldung zu unserem Newsletter.",
      });

      // Trigger newsletter automation
      try {
        await supabase.functions.invoke('trigger-newsletter-automation', {
          body: {
            email: email,
            first_name: firstName,
            source: 'website_newsletter'
          }
        });
        // Automation triggered successfully
      } catch {
        // Silently handle - main signup was successful
      }

      // Send welcome email immediately  
      try {
        await supabase.functions.invoke('send-newsletter-welcome', {
          body: {
            email: email,
            firstName: firstName
          }
        });
        // Welcome email sent successfully
      } catch {
        // Silently handle - main signup was successful
      }

    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Fehler",
        description: "Es gab einen Fehler bei der Anmeldung. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Willkommen im Newsletter!
          </h3>
          <p className="text-green-600">
            Sie erhalten in Kürze eine Bestätigungs-E-Mail. Vielen Dank für Ihr Interesse!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[hsl(var(--brand-primary))]/5 to-[hsl(var(--brand-accent))]/5 border-[hsl(var(--brand-primary))]/20">
      <CardHeader className="text-center">
        <div className="mb-4">
          <Mail className="h-12 w-12 text-[hsl(var(--brand-primary))] mx-auto" />
        </div>
        <CardTitle className="text-2xl font-bold text-[hsl(var(--brand-secondary))]">
          Newsletter abonnieren
        </CardTitle>
        <p className="text-muted-foreground">
          Bleiben Sie auf dem Laufenden mit den neuesten Tipps, Trends und Updates aus der digitalen Welt.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Ihr Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Ihre E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird angemeldet...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Jetzt anmelden
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Mit der Anmeldung erklären Sie sich mit unserer Datenschutzerklärung einverstanden. 
            Sie können sich jederzeit wieder abmelden.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}