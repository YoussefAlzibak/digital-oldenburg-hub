import { WebsiteLayout } from "@/components/WebsiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Shield,
  Award,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

// Import service images
import serviceWebdev from "@/assets/service-webdev.webp";
import serviceUiux from "@/assets/service-uiux.webp";
import serviceSeo from "@/assets/service-seo.webp";
import serviceCrm from "@/assets/crm-service.webp";
import serviceEmail from "@/assets/service-email.webp";
import serviceBooking from "@/assets/service-booking.webp";
import serviceMobile from "@/assets/service-mobile.webp";
import serviceBranding from "@/assets/service-branding.webp";
import heroServices from "@/assets/hero-services.webp";

const services = [
  {
    title: "Web Development",
    description: "Moderne, responsive Websites & Web-Anwendungen, die Ihre Marke perfekt präsentieren.",
    features: ["Custom Website Design", "Progressive Web Apps", "E-Commerce Lösungen", "API Integration"],
    image: serviceWebdev
  },
  {
    title: "UI/UX Design",
    description: "Benutzerzentriertes Design, das begeistert und konvertiert.",
    features: ["User Interface Design", "User Experience Optimization", "Prototyping", "Design Systems"],
    image: serviceUiux
  },
  {
    title: "SEO Optimization",
    description: "Maximale Sichtbarkeit in Suchmaschinen für mehr organischen Traffic.",
    features: ["On-Page SEO", "Technical SEO", "Content Strategy", "Analytics & Reporting"],
    image: serviceSeo
  },
  {
    title: "CRM Systems",
    description: "Intelligente Kundenverwaltung für stärkere Kundenbeziehungen.",
    features: ["Customer Management", "Sales Pipeline", "Automation", "Contact History"],
    image: serviceCrm
  },
  {
    title: "Email Marketing",
    description: "Professionelle E-Mail-Kampagnen, die Ihre Zielgruppe erreichen.",
    features: ["Campaign Builder", "Newsletter Management", "Automation", "Analytics"],
    image: serviceEmail
  },
  {
    title: "Appointment Booking",
    description: "Automatisches Terminmanagement für mehr Effizienz.",
    features: ["Online Booking", "Calendar Sync", "Reminders", "Team Management"],
    image: serviceBooking
  },
  {
    title: "Mobile Solutions",
    description: "Native und responsive mobile Anwendungen für iOS und Android.",
    features: ["Responsive Design", "Mobile-First Approach", "App Development", "Cross-Platform"],
    image: serviceMobile
  },
  {
    title: "Branding & Print",
    description: "Professionelles Corporate Design für einen einheitlichen Markenauftritt.",
    features: ["Logo Design", "Business Cards", "Flyers & Brochures", "Brand Identity"],
    image: serviceBranding
  }
];

const benefits = [
  {
    icon: Zap,
    title: "Schnelle Umsetzung",
    description: "Effiziente Prozesse für schnelle Projektumsetzung"
  },
  {
    icon: Shield,
    title: "Höchste Sicherheit",
    description: "Modernste Sicherheitsstandards für Ihre Daten"
  },
  {
    icon: Users,
    title: "Persönlicher Support",
    description: "Direkter Ansprechpartner während des gesamten Projekts"
  },
  {
    icon: Award,
    title: "Beste Qualität",
    description: "Höchste Qualitätsstandards in jedem Detail"
  }
];

const process = [
  {
    number: "01",
    title: "Beratung",
    description: "Kostenlose Erstberatung zur Analyse Ihrer Anforderungen"
  },
  {
    number: "02",
    title: "Konzept",
    description: "Detaillierte Planung und Strategie für Ihr Projekt"
  },
  {
    number: "03",
    title: "Entwicklung",
    description: "Professionelle Umsetzung mit modernsten Technologien"
  },
  {
    number: "04",
    title: "Launch & Support",
    description: "Erfolgreicher Launch mit kontinuierlichem Support"
  }
];

export default function Services() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Image Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroServices} 
              alt="Digital Services" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          </div>

          <div className="container relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-4 sm:mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 py-1.5 sm:py-2">
                Unsere Services
              </Badge>
            </ScrollReveal>
            
            <div className="space-y-3 sm:space-y-4">
              <ScrollReveal animation="fade-left" delay={100}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white">
                  Digitale Lösungen
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-right" delay={250}>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 bg-clip-text text-transparent">
                  für Ihren Erfolg
                </span>
              </ScrollReveal>
            </div>
            
            <ScrollReveal animation="fade-left" delay={400}>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-6 sm:mb-10 mt-4 sm:mt-6 px-4">
                Von moderner Web-Entwicklung über SEO bis hin zu intelligenten CRM-Systemen – 
                alles aus einer Hand für maximalen Erfolg.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-white text-violet-900 hover:bg-white/90 shadow-xl text-sm sm:text-base touch-manipulation">
                  <Link to="/book-appointment">
                    <span className="hidden sm:inline">Kostenlose Beratung</span>
                    <span className="sm:hidden">Beratung</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-sm sm:text-base touch-manipulation">
                  <Link to="/portfolio">Portfolio ansehen</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 sm:py-16 md:py-20 relative">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <ScrollReveal animation="fade-right">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                  Was wir <span className="text-primary">anbieten</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={150}>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                  Umfassende digitale Services für Ihr Business
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {services.map((service, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                  <Card className="glass-card group hover:scale-105 transition-all duration-300 overflow-hidden touch-manipulation">
                    <div className="relative overflow-hidden h-36 sm:h-48">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-foreground">{service.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{service.description}</p>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-xs sm:text-sm">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-muted/30 relative overflow-hidden">
          <div className="container px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <ScrollReveal animation="fade-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                  Unser <span className="text-primary">Prozess</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-right" delay={150}>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                  In 4 einfachen Schritten zu Ihrer digitalen Lösung
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {process.map((step, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                  <div className="relative group">
                    <div className="glass-card p-6 sm:p-8 text-center h-full">
                      <div className="text-5xl sm:text-6xl font-bold text-primary/20 mb-3 sm:mb-4 group-hover:text-primary/40 transition-colors">
                        {step.number}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                        <ArrowRight className="h-6 w-6 md:h-8 md:w-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 relative">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <ScrollReveal animation="fade-right">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                  Warum <span className="text-primary">Unicum Tech</span>?
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={150}>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                  Ihre Vorteile bei der Zusammenarbeit mit uns
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} animation="scale-in" delay={index * 100}>
                  <Card className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all touch-manipulation">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-3 sm:p-4 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">{benefit.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0">
            <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
          </div>

          <div className="container px-4 sm:px-6 relative z-10 text-center">
            <ScrollReveal animation="scale-in">
              <Rocket className="h-12 w-12 sm:h-16 sm:w-16 text-white mx-auto mb-4 sm:mb-6 animate-float" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
                Bereit für Ihr nächstes Projekt?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6 sm:mb-10 px-4">
                Lassen Sie uns gemeinsam Ihre digitale Vision verwirklichen. 
                Vereinbaren Sie jetzt ein kostenloses Beratungsgespräch!
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-white text-violet-900 hover:bg-white/90 shadow-xl text-sm sm:text-base touch-manipulation">
                  <Link to="/book-appointment">
                    <span className="hidden sm:inline">Termin vereinbaren</span>
                    <span className="sm:hidden">Termin</span>
                    <Calendar className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-sm sm:text-base touch-manipulation">
                  <Link to="/contact">Kontakt aufnehmen</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
}
