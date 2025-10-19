import { WebsiteLayout } from "@/components/WebsiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Code2, 
  Palette, 
  Search, 
  Database, 
  Smartphone, 
  Mail, 
  Calendar,
  Shield,
  Printer,
  Award,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Moderne, responsive Websites & Web-Anwendungen, die Ihre Marke perfekt präsentieren.",
    features: ["Custom Website Design", "Progressive Web Apps", "E-Commerce Lösungen", "API Integration"],
    color: "from-violet-500 to-purple-600",
    iconColor: "text-violet-500"
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Benutzerzentriertes Design, das begeistert und konvertiert.",
    features: ["User Interface Design", "User Experience Optimization", "Prototyping", "Design Systems"],
    color: "from-cyan-500 to-blue-600",
    iconColor: "text-cyan-500"
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Maximale Sichtbarkeit in Suchmaschinen für mehr organischen Traffic.",
    features: ["On-Page SEO", "Technical SEO", "Content Strategy", "Analytics & Reporting"],
    color: "from-orange-500 to-red-600",
    iconColor: "text-orange-500"
  },
  {
    icon: Database,
    title: "CRM Systems",
    description: "Intelligente Kundenverwaltung für stärkere Kundenbeziehungen.",
    features: ["Customer Management", "Sales Pipeline", "Automation", "Contact History"],
    color: "from-emerald-500 to-green-600",
    iconColor: "text-emerald-500"
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Professionelle E-Mail-Kampagnen, die Ihre Zielgruppe erreichen.",
    features: ["Campaign Builder", "Newsletter Management", "Automation", "Analytics"],
    color: "from-pink-500 to-rose-600",
    iconColor: "text-pink-500"
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Automatisches Terminmanagement für mehr Effizienz.",
    features: ["Online Booking", "Calendar Sync", "Reminders", "Team Management"],
    color: "from-amber-500 to-yellow-600",
    iconColor: "text-amber-500"
  },
  {
    icon: Smartphone,
    title: "Mobile Solutions",
    description: "Native und responsive mobile Anwendungen für iOS und Android.",
    features: ["Responsive Design", "Mobile-First Approach", "App Development", "Cross-Platform"],
    color: "from-indigo-500 to-purple-600",
    iconColor: "text-indigo-500"
  },
  {
    icon: Printer,
    title: "Branding & Print",
    description: "Professionelles Corporate Design für einen einheitlichen Markenauftritt.",
    features: ["Logo Design", "Business Cards", "Flyers & Brochures", "Brand Identity"],
    color: "from-teal-500 to-cyan-600",
    iconColor: "text-teal-500"
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
        {/* Hero Section with Glass Effect */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="container relative z-10 px-4 py-20 text-center">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white text-lg px-6 py-2">
                Unsere Services
              </Badge>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Digitale Lösungen
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 bg-clip-text text-transparent">
                  für Ihren Erfolg
                </span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10">
                Von moderner Web-Entwicklung über SEO bis hin zu intelligenten CRM-Systemen – 
                alles aus einer Hand für maximalen Erfolg.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-violet-900 hover:bg-white/90 shadow-xl">
                  <Link to="/book-appointment">
                    Kostenlose Beratung <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
                  <Link to="/portfolio">Portfolio ansehen</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 relative">
          <div className="container px-4">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Was wir <span className="text-primary">anbieten</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Umfassende digitale Services für Ihr Business
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                  <Card className="glass-card p-6 group hover:scale-105 transition-all duration-300">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle2 className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${service.iconColor}`} />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-muted/30 relative overflow-hidden">
          <div className="container px-4 relative z-10">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Unser <span className="text-primary">Prozess</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  In 4 einfachen Schritten zu Ihrer digitalen Lösung
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                  <div className="relative group">
                    <div className="glass-card p-8 text-center h-full">
                      <div className="text-6xl font-bold text-primary/20 mb-4 group-hover:text-primary/40 transition-colors">
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                        <ArrowRight className="h-8 w-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 relative">
          <div className="container px-4">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Warum <span className="text-primary">Unicum Tech</span>?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Ihre Vorteile bei der Zusammenarbeit mit uns
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} animation="scale-in" delay={index * 100}>
                  <Card className="glass-card p-6 text-center group hover:scale-105 transition-all">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-4 mb-4 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
          </div>

          <div className="container px-4 relative z-10 text-center">
            <ScrollReveal animation="scale-in">
              <Rocket className="h-16 w-16 text-white mx-auto mb-6 animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Bereit für Ihr nächstes Projekt?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
                Lassen Sie uns gemeinsam Ihre digitale Vision verwirklichen. 
                Vereinbaren Sie jetzt ein kostenloses Beratungsgespräch!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-violet-900 hover:bg-white/90 shadow-xl">
                  <Link to="/book-appointment">
                    Termin vereinbaren <Calendar className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
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
