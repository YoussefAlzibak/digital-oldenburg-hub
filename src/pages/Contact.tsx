import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, Mail, Phone, MapPin, Clock, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import { WebsiteLayout } from "@/components/WebsiteLayout";
import heroContact from "@/assets/hero-contact.webp";

const Contact = () => {

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "E-Mail",
      content: "info@unicum-tech.com",
      description: "Wir antworten innerhalb von 24 Stunden"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefon",
      content: "0441 18160647",
      description: "Mo-Fr: 9:00 - 18:00 Uhr"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Adresse",
      content: "Hirschberger Straße 30, 26135 Oldenburg",
      description: "Besuchen Sie uns gerne vor Ort"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Geschäftszeiten",
      content: "Mo-Fr: 9:00 - 18:00",
      description: "Notfall-Support: 24/7 verfügbar"
    }
  ];


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

      {/* Contact Information Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Kontaktinformationen</h2>
                <p className="text-muted-foreground">So erreichen Sie uns</p>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                  <Card className="glass-card p-4 group hover:scale-105 transition-all h-full">
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

            {/* Quick Actions */}
            <ScrollReveal animation="fade-up" delay={200}>
              <Card className="glass-card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">Schnelle Kontaktaufnahme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                      <Link to="/book-appointment">
                        <Calendar className="h-5 w-5 mr-3" />
                        Kostenlosen Termin buchen
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                      <a href="tel:+4944118160647">
                        <Phone className="h-5 w-5 mr-3" />
                        Sofort anrufen
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                      <a href="mailto:info@unicum-tech.com">
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
      
      {/* Mobile bottom padding for navigation */}
      <div className="h-24 sm:hidden"></div>
    </WebsiteLayout>
  );
};

export default Contact;