import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageCircle, Send, Video, User, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WebsiteLayout } from "@/components/WebsiteLayout";
import heroContact from "@/assets/hero-contact.webp";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
    preferred_date: "",
    preferred_time: "",
    consultation_type: "online"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "E-Mail",
      content: "hello@digitalsolutions.de",
      description: "Wir antworten innerhalb von 24 Stunden"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefon",
      content: "+49 (0) 123 456 789",
      description: "Mo-Fr: 9:00 - 18:00 Uhr"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Adresse",
      content: "Musterstraße 123, 12345 München",
      description: "Besuchen Sie uns gerne vor Ort"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Geschäftszeiten",
      content: "Mo-Fr: 9:00 - 18:00",
      description: "Notfall-Support: 24/7 verfügbar"
    }
  ];

  const services = [
    "Webdesign & Development",
    "E-Commerce Lösungen",
    "Mobile App Development",
    "IT-Beratung",
    "Cloud-Services",
    "Digital Marketing",
    "SEO & Analytics",
    "Wartung & Support"
  ];

  const budgetRanges = [
    "Unter 5.000€",
    "5.000€ - 15.000€",
    "15.000€ - 30.000€",
    "30.000€ - 50.000€",
    "Über 50.000€"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          service_type: formData.service,
          message: formData.message || null,
          preferred_date: formData.preferred_date || null,
          preferred_time: formData.preferred_time || null
        }])
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Kontaktanfrage gesendet!",
        description: "Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.",
      });

      // Trigger contact form automation and dashboard notification
      try {
        await supabase.functions.invoke('trigger-contact-automation', {
          body: {
            contactRequestId: data.id,
            email: formData.email,
            name: formData.name,
            serviceType: formData.service
          }
        });
      } catch (automationError) {
        console.error('Contact form automation error:', automationError);
      }

      // Send confirmation email to customer
      try {
        await supabase.functions.invoke('send-contact-confirmation', {
          body: {
            contactRequest: {
              id: data.id,
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
        console.error('Contact confirmation email error:', emailError);
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        budget: "",
        message: "",
        preferred_date: "",
        preferred_time: "",
        consultation_type: "online"
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroContact} 
            alt="Contact Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Kontakt
              </Badge>
            </ScrollReveal>
            <div className="space-y-3">
              <ScrollReveal animation="fade-right" delay={100}>
                <h1 className="text-4xl md:text-6xl font-bold">
                  Lassen Sie uns
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={250}>
                <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  sprechen
                </span>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade-up" delay={400}>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed mt-6">
                Haben Sie ein Projekt im Kopf? Wir sind hier, um Ihnen zu helfen. Kontaktieren Sie uns für eine kostenlose Beratung.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <ScrollReveal animation="fade-right">
              <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <MessageCircle className="h-6 w-6 mr-3 text-primary" />
                  Projekt-Anfrage
                </CardTitle>
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
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ihr vollständiger Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        E-Mail *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="ihre@email.de"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+49 (0) 123 456 789"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultation_type">Beratungsart</Label>
                      <Select onValueChange={(value) => handleInputChange("consultation_type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Art der Beratung" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Online (Video-Call)
                            </div>
                          </SelectItem>
                          <SelectItem value="phone">Telefonisch</SelectItem>
                          <SelectItem value="office">Vor Ort in unserem Büro</SelectItem>
                          <SelectItem value="client">Vor Ort beim Kunden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Unternehmen</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Ihr Unternehmen (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service *</Label>
                      <Select onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie einen Service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map(service => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Budget</Label>
                      <Select onValueChange={(value) => handleInputChange("budget", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Budget-Bereich" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map(range => (
                            <SelectItem key={range} value={range}>{range}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferred_date">Wunschtermin</Label>
                      <Input
                        id="preferred_date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferred_date}
                        onChange={(e) => handleInputChange("preferred_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred_time" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Uhrzeit
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("preferred_time", value)}>
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
                    <Label htmlFor="message">Projektbeschreibung *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Beschreiben Sie Ihr Projekt, Ihre Ziele und Anforderungen..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Wird gesendet...' : 'Kontaktanfrage senden'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            </ScrollReveal>

            {/* Contact Information */}
            <ScrollReveal animation="fade-left" delay={150}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Kontaktinformationen</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <ScrollReveal key={index} animation="fade-left" delay={300 + (index * 100)}>
                        <Card className="glass-card p-4 group hover:scale-105 transition-all">
                          <div className="flex items-start space-x-4">
                            <div className="text-primary bg-primary/10 p-3 rounded-lg group-hover:scale-110 transition-transform">
                              {info.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{info.title}</h3>
                              <p className="text-foreground font-medium">{info.content}</p>
                              <p className="text-muted-foreground text-sm">{info.description}</p>
                            </div>
                          </div>
                        </Card>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <Card className="glass-card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Schnelle Kontaktaufnahme</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                      <Link to="/book-appointment">
                        <Calendar className="h-5 w-5 mr-3" />
                        Kostenlosen Termin buchen
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                      <a href="tel:+491234567890">
                        <Phone className="h-5 w-5 mr-3" />
                        Sofort anrufen
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                      <a href="mailto:hello@digitalsolutions.de">
                        <Mail className="h-5 w-5 mr-3" />
                        E-Mail schreiben
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                      <Link to="/auth">
                        <Shield className="h-5 w-5 mr-3" />
                        Dashboard Login
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Teaser */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Häufige Fragen</h3>
                  <p className="text-muted-foreground mb-4">
                    Haben Sie Fragen zu unseren Services, Preisen oder dem Ablauf? 
                    Schauen Sie in unsere FAQ oder kontaktieren Sie uns direkt.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="#consultation">
                      FAQ ansehen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Response Time Promise */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Unser Versprechen</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { value: "24h", label: "Antwortzeit per E-Mail" },
              { value: "100%", label: "Kostenloses Erstgespräch" },
              { value: "0€", label: "Für die Beratung" }
            ].map((promise, index) => (
              <ScrollReveal key={index} animation="scale-in" delay={150 + (index * 100)}>
                <div className="glass-card p-6 text-center group hover:scale-105 transition-all">
                  <div className="text-3xl font-bold text-primary mb-2">{promise.value}</div>
                  <p className="text-muted-foreground">{promise.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Consultation Form Section */}
      <section id="consultation" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Video-Beratung verfügbar
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kostenlose Beratung anfragen
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vereinbaren Sie einen unverbindlichen Beratungstermin mit unseren Experten. 
              Online per Video-Call, telefonisch oder vor Ort.
            </p>
          </div>
          <ConsultationRequestForm />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für Ihr Projekt?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam Ihre digitale Vision verwirklichen. 
              Der erste Schritt ist nur einen Klick entfernt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/services">
                  Services entdecken
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/portfolio">Portfolio ansehen</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth">
                  <Shield className="h-4 w-4 mr-2" />
                  Dashboard zugreifen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Contact;