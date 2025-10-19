import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Users, 
  Settings, 
  Printer, 
  ArrowRight, 
  Shield,
  Zap,
  MessageCircle,
  Rocket,
  Users2,
  Sparkles,
  TrendingUp,
  Award,
  Monitor
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WebsiteLayout } from "@/components/WebsiteLayout";

// Import generated images
import webdesignService from "@/assets/webdesign-service.webp";
import crmService from "@/assets/crm-service.webp";
import itService from "@/assets/it-service.webp";
import printService from "@/assets/print-service.webp";
import portfolioCorporate from "@/assets/portfolio-corporate.webp";
import portfolioEcommerce from "@/assets/portfolio-ecommerce.webp";
import portfolioSaas from "@/assets/portfolio-saas.webp";
import heroImage from "@/assets/hero-image.webp";

const Index = () => {
  
  const services = [
    {
      icon: Globe,
      title: "Webdesign & Development",
      description: "Moderne, responsive Websites mit fokussiertem UX/UI Design.",
      image: webdesignService,
      link: "/services"
    },
    {
      icon: Users,
      title: "CRM & HubSpot Solutions",
      description: "Professionelle CRM-Systeme und HubSpot-Integration für optimierte Kundenverwaltung.",
      image: crmService,
      link: "/services"
    },
    {
      icon: Settings,
      title: "IT-Services & Smart Home",
      description: "Umfassende IT-Betreuung und moderne Smart Home Lösungen.",
      image: itService,
      link: "/services"
    },
    {
      icon: Printer,
      title: "Print Design & Branding",
      description: "Professionelle Print-Materialien und Corporate Identity Design.",
      image: printService,
      link: "/services"
    }
  ];

  const projects = [
    {
      title: "Corporate Website",
      category: "Webdesign",
      image: portfolioCorporate,
      tags: ["React", "TypeScript", "CMS"]
    },
    {
      title: "E-Commerce Platform",
      category: "E-Commerce", 
      image: portfolioEcommerce,
      tags: ["Next.js", "Stripe", "Database"]
    },
    {
      title: "SaaS Dashboard",
      category: "Web App",
      image: portfolioSaas,
      tags: ["React", "Charts", "API"]
    }
  ];

  const stats = [
    { number: "150+", label: "Erfolgreiche Projekte", icon: Rocket },
    { number: "98%", label: "Kundenzufriedenheit", icon: Award },
    { number: "5+", label: "Jahre Erfahrung", icon: TrendingUp }
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
      icon: Users2,
      title: "Persönlicher Support",
      description: "Direkter Ansprechpartner während des gesamten Projekts"
    },
    {
      icon: Award,
      title: "Beste Qualität",
      description: "Höchste Qualitätsstandards in jedem Detail"
    }
  ];

  return (
    <WebsiteLayout>
      {/* Hero Section with Video and Glass Effect */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden w-full">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-900/90 to-indigo-900/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoNHYtNGgtNHptMCA4djRoNHYtNGgtNHptLTQgOHY0aDR2LTRoLTR6bS04IDB2NGg0di00aC00em0tOC04djRoNHYtNGgtNHptMC00djRoNHYtNGgtNHptOC04djRoNHYtNGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 z-0"></div>
          
          {/* Animated orbs */}
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-4 sm:-bottom-8 left-20 sm:left-40 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full max-w-7xl">
          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center w-full">
              {/* Left Content */}
              <div className="space-y-6 sm:space-y-8">
                <ScrollReveal animation="fade-right" delay={0}>
                  <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white text-sm sm:text-base px-4 sm:px-6 py-1.5 sm:py-2">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2 inline" />
                    Ihr Partner für digitale Excellence
                  </Badge>
                </ScrollReveal>
                
                <div className="space-y-2 sm:space-y-3 max-w-full">
                  <ScrollReveal animation="fade-left" delay={150}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight break-words">
                      Digitale
                    </h1>
                  </ScrollReveal>
                  <ScrollReveal animation="fade-right" delay={300}>
                    <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 bg-clip-text text-transparent break-words">
                      Transformation
                    </span>
                  </ScrollReveal>
                  <ScrollReveal animation="fade-left" delay={450}>
                    <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white/90 break-words">neu definiert</span>
                  </ScrollReveal>
                </div>
                
                <ScrollReveal animation="fade-right" delay={600}>
                  <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-full lg:max-w-2xl break-words">
                    Wir verwandeln Ihre Visionen in leistungsstarke digitale Lösungen. 
                    Von modernen Websites über CRM-Systeme bis hin zu Smart Home Automation.
                  </p>
                </ScrollReveal>
                
                {/* Stats with Glass Effect */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {stats.map((stat, index) => (
                    <ScrollReveal key={index} animation="scale-in" delay={750 + (index * 100)}>
                      <div className="glass-card p-3 sm:p-4 text-center">
                        <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mx-auto mb-1 sm:mb-2" />
                        <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">{stat.number}</div>
                        <div className="text-[10px] sm:text-sm text-white/70">{stat.label}</div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
                
                <ScrollReveal animation="fade-left" delay={1100}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto bg-white text-violet-900 hover:bg-white/90 shadow-xl text-sm sm:text-base touch-manipulation">
                      <Link to="/contact">
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span className="hidden sm:inline">Kostenloses Beratungsgespräch</span>
                        <span className="sm:hidden">Beratung</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-sm sm:text-base touch-manipulation">
                      <Link to="/portfolio">
                        <Monitor className="h-5 w-5 mr-2" />
                        Portfolio ansehen
                      </Link>
                    </Button>
                  </div>
                </ScrollReveal>
              </div>
              
              {/* Right Visual */}
              <ScrollReveal animation="scale-in" delay={200}>
                <div className="relative hidden lg:block">
                  <div className="glass-card p-2 rounded-3xl">
                    <img 
                      src={heroImage}
                      alt="Digital Solutions" 
                      className="w-full h-auto rounded-2xl"
                    />
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-16 sm:w-24 h-16 sm:h-24 bg-cyan-500 rounded-2xl blur-2xl opacity-50 animate-float"></div>
                  <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-16 sm:w-24 h-16 sm:h-24 bg-violet-500 rounded-2xl blur-2xl opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 relative w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20">
                Unsere Services
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={100}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Was wir für Sie <span className="text-primary">tun können</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={200}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Von Webdesign bis Smart Home - wir bieten umfassende digitale Lösungen
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <Card className="glass-card h-full group hover:scale-105 transition-all duration-300 overflow-hidden touch-manipulation">
                  <div className="relative overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-36 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <service.icon className="absolute top-3 sm:top-4 left-3 sm:left-4 h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" />
                  </div>
                  
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      {service.description}
                    </p>
                    
                    <Button size="sm" variant="ghost" className="w-full text-primary hover:bg-primary/10 text-xs sm:text-sm touch-manipulation" asChild>
                      <Link to={service.link}>
                        Mehr erfahren
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 relative w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20">
                Ihre Vorteile
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={100}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Warum <span className="text-primary">Unicum Tech</span>?
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={200}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
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

      {/* Featured Projects Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20">
                Unsere Projekte
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={100}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Erfolgreiche <span className="text-primary">Umsetzungen</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={200}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Entdecken Sie eine Auswahl unserer besten Projekte
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {projects.map((project, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                <Card className="glass-card group hover:scale-105 transition-all duration-300 overflow-hidden touch-manipulation">
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-36 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-primary/90 text-primary-foreground text-[10px] sm:text-xs px-2 py-0.5">
                      {project.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <Button size="lg" asChild className="touch-manipulation">
                <Link to="/portfolio">
                  Alle Projekte ansehen
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal animation="scale-in">
            <div className="text-center max-w-3xl mx-auto">
              <Rocket className="h-12 w-12 sm:h-16 sm:w-16 text-white mx-auto mb-4 sm:mb-6 animate-float" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Bereit für Ihr nächstes Projekt?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 px-4">
                Lassen Sie uns gemeinsam Ihre digitale Vision verwirklichen. 
                Vereinbaren Sie jetzt ein kostenloses Beratungsgespräch!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-white text-violet-900 hover:bg-white/90 shadow-xl text-sm sm:text-base touch-manipulation">
                  <Link to="/contact">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">Jetzt Kontakt aufnehmen</span>
                    <span className="sm:hidden">Kontakt</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-sm sm:text-base touch-manipulation">
                  <Link to="/services">Services entdecken</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default Index;
