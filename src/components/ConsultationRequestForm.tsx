import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Mail, Phone, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ConsultationRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    preferred_date: '',
    preferred_time: '',
    consultation_type: 'online'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string; hasAppointment: boolean } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use edge function for better cross-browser compatibility
      const { data, error } = await supabase.functions.invoke('submit-consultation', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          service: formData.service || undefined,
          message: formData.message || undefined,
          preferred_date: formData.preferred_date || undefined,
          preferred_time: formData.preferred_time || undefined,
          consultation_type: formData.consultation_type
        }
      });

      if (error) throw error;

      // Save submitted data for success message
      const hasAppointment = !!(formData.preferred_date && formData.preferred_time);
      setSubmittedData({
        name: formData.name,
        email: formData.email,
        hasAppointment
      });
      setIsSuccess(true);

      // Trigger contact form automation
      try {
        await supabase.functions.invoke('trigger-contact-automation', {
          body: {
            contactRequestId: data?.id,
            email: formData.email,
            name: formData.name,
            serviceType: formData.service
          }
        });
      } catch (automationError) {
        // Don't show error to user as the main request was successful
      }

      // Send confirmation email to customer
      try {
        await supabase.functions.invoke('send-contact-confirmation', {
          body: {
            contactRequest: {
              id: data?.id,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company,
              service_type: formData.service,
              message: formData.message,
              preferred_date: formData.preferred_date,
              preferred_time: formData.preferred_time
            }
          }
        });
      } catch (emailError) {
        // Don't show error to user as the main request was successful
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        preferred_date: '',
        preferred_time: '',
        consultation_type: 'online'
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmittedData(null);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const today = new Date().toISOString().split('T')[0];

  // Success state - show beautiful confirmation
  if (isSuccess && submittedData) {
    return (
      <Card className="w-full max-w-2xl mx-auto overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-in zoom-in duration-300">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Vielen Dank, {submittedData.name.split(' ')[0]}!
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Ihre Beratungsanfrage wurde erfolgreich übermittelt.
          </p>
          
          <div className="bg-card rounded-xl p-6 mb-6 text-left space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Bestätigung gesendet</p>
                <p className="text-sm text-muted-foreground">
                  Eine E-Mail wurde an <span className="font-medium">{submittedData.email}</span> gesendet
                </p>
              </div>
            </div>
            
            {submittedData.hasAppointment && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Terminwunsch erhalten</p>
                  <p className="text-sm text-muted-foreground">
                    Wir bestätigen Ihren Wunschtermin innerhalb von 24 Stunden
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Schnelle Antwort garantiert</p>
                <p className="text-sm text-muted-foreground">
                  Wir melden uns innerhalb von 24 Stunden bei Ihnen
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Neue Anfrage stellen
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Kostenlose Beratung anfragen
        </CardTitle>
        <CardDescription>
          Vereinbaren Sie einen unverbindlichen Beratungstermin mit unseren Experten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Unternehmen</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service-Bereich</Label>
            <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie einen Service-Bereich" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webdesign">Webdesign & Development</SelectItem>
                <SelectItem value="it-services">IT-Services & Support</SelectItem>
                <SelectItem value="crm">CRM-Systeme</SelectItem>
                <SelectItem value="print">Print & Grafikdesign</SelectItem>
                <SelectItem value="consulting">IT-Beratung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_date">Wunschtermin</Label>
              <Input
                id="preferred_date"
                type="date"
                min={today}
                value={formData.preferred_date}
                onChange={(e) => handleChange('preferred_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Uhrzeit
              </Label>
              <Select value={formData.preferred_time} onValueChange={(value) => handleChange('preferred_time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie eine Uhrzeit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 Uhr</SelectItem>
                  <SelectItem value="10:00">10:00 Uhr</SelectItem>
                  <SelectItem value="11:00">11:00 Uhr</SelectItem>
                  <SelectItem value="14:00">14:00 Uhr</SelectItem>
                  <SelectItem value="15:00">15:00 Uhr</SelectItem>
                  <SelectItem value="16:00">16:00 Uhr</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultation_type">Beratungsart</Label>
            <Select value={formData.consultation_type} onValueChange={(value) => handleChange('consultation_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online (Video-Call)</SelectItem>
                <SelectItem value="phone">Telefonisch</SelectItem>
                <SelectItem value="office">Vor Ort in unserem Büro</SelectItem>
                <SelectItem value="client">Vor Ort beim Kunden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Beschreiben Sie kurz Ihr Anliegen oder Ihre Anforderungen..."
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Wird gesendet...' : 'Beratungstermin anfragen'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}