import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Globe, Mail, Phone, MapPin, Clock, MessageCircle, Send, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: ""
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Hier würde die Form-Übermittlung implementiert werden
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Digital Solutions
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
              <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
              <Link to="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">Portfolio</Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">Über uns</Link>
              <Link to="/contact" className="text-sm font-medium text-primary">Kontakt</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Kontakt
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Lassen Sie uns
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> sprechen</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Haben Sie ein Projekt im Kopf? Wir sind hier, um Ihnen zu helfen. Kontaktieren Sie uns für eine kostenlose Beratung.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
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
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ihr vollständiger Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail *</Label>
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

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-5 w-5 mr-2" />
                    Anfrage senden
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Kontaktinformationen</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="bg-card/30 backdrop-blur-sm border-border/50 p-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-primary bg-primary/10 p-3 rounded-lg">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{info.title}</h3>
                          <p className="text-foreground font-medium">{info.content}</p>
                          <p className="text-muted-foreground text-sm">{info.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Schnelle Kontaktaufnahme</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <Calendar className="h-5 w-5 mr-3" />
                      Kostenlosen Termin buchen
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <Phone className="h-5 w-5 mr-3" />
                      Sofort anrufen
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <Mail className="h-5 w-5 mr-3" />
                      E-Mail schreiben
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Teaser */}
              <Card className="bg-card/30 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Häufige Fragen</h3>
                  <p className="text-muted-foreground mb-4">
                    Haben Sie Fragen zu unseren Services, Preisen oder dem Ablauf? 
                    Schauen Sie in unsere FAQ oder kontaktieren Sie uns direkt.
                  </p>
                  <Button variant="outline" size="sm">
                    FAQ ansehen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Promise */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Unser Versprechen</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <p className="text-muted-foreground">Antwortzeit per E-Mail</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Kostenloses Erstgespräch</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">0€</div>
                <p className="text-muted-foreground">Für die Beratung</p>
              </div>
            </div>
          </div>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;