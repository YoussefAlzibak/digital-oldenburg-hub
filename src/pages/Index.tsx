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
  CheckCircle,
  Shield,
  Monitor,
  Zap,
  MessageCircle,
  Code,
  Rocket,
  Calendar,
  Users2,
  Palette,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";
import { WebsiteMobileNav } from "@/components/WebsiteMobileNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useTheme } from "@/components/ThemeProvider";

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
  const { resolvedTheme } = useTheme();
  
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
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      {/* Enhanced Header with Geometric Figures */}
      <header className="header-enhanced fixed top-0 w-full z-50">
        <div className="header-geometric-bg">
          <div className="header-shape header-hexagon-1"></div>
          <div className="header-shape header-triangle-1"></div>
          <div className="header-shape header-diamond-1"></div>
          <div className="header-shape header-circle-1"></div>
          <div className="header-shape header-square-1"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4 animate-fade-left">
              <div className="logo-container group">
                <div className="logo-geometric">
                  <div className="logo-primary-shape"></div>
                  <div className="logo-accent-shape"></div>
                  <div className="logo-inner-detail"></div>
                </div>
              </div>
              <div className="logo-text">
                <span className="text-2xl md:text-3xl font-black text-[hsl(var(--brand-secondary))] tracking-tight">Unicum</span>
                <span className="text-2xl md:text-3xl font-light text-[hsl(var(--brand-primary))] tracking-tight">Tech</span>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Digital Excellence</div>
              </div>
            </div>
            
            <nav className="hidden md:flex lg:hidden items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-primary">Home</Link>
              <Link to="/services" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Services</Link>
              <Link to="/portfolio" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Portfolio</Link>
              <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Über uns</Link>
              <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Kontakt</Link>
              <Button size="sm" className="ml-4" asChild>
                <Link to="/contact">
                  <Calendar className="h-4 w-4 mr-2" />
                  Termin
                </Link>
              </Button>
            </nav>
            
            <nav className="hidden lg:flex items-center space-x-10 animate-fade-right">
              <Link to="/" className="nav-link text-primary">
                <Globe className="nav-icon" />
                <span>Home</span>
              </Link>
              <Link to="/services" className="nav-link">
                <Palette className="nav-icon" />
                <span>Services</span>
              </Link>
              <Link to="/portfolio" className="nav-link">
                <Monitor className="nav-icon" />
                <span>Portfolio</span>
              </Link>
              <Link to="/about" className="nav-link">
                <Users2 className="nav-icon" />
                <span>Über uns</span>
              </Link>
              <Link to="/contact" className="nav-link">
                <MessageCircle className="nav-icon" />
                <span>Kontakt</span>
              </Link>
              <Link to="/auth" className="nav-link text-xs opacity-60 hover:opacity-100">
                <Shield className="nav-icon h-3 w-3" />
                <span>Admin</span>
              </Link>
              <Button className="cta-button group" asChild>
                <Link to="/contact">
                  <Calendar className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  <span>Beratung anfragen</span>
                  <div className="cta-glow"></div>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Video and Glass Effect */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-900/90 to-indigo-900/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoNHYtNGgtNHptMCA4djRoNHYtNGgtNHptLTQgOHY0aDR2LTRoLTR6bS04IDB2NGg0di00aC00em0tOC04djRoNHYtNGgtNHptMC00djRoNHYtNGgtNHptOC04djRoNHYtNGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 z-0"></div>
          
          {/* Animated orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <ScrollReveal animation="fade-right" delay={0}>
                  <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white text-base px-6 py-2">
                    <Sparkles className="h-4 w-4 mr-2 inline" />
                    Ihr Partner für digitale Excellence
                  </Badge>
                </ScrollReveal>
                
                <div className="space-y-3">
                  <ScrollReveal animation="fade-left" delay={150}>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                      Digitale
                    </h1>
                  </ScrollReveal>
                  <ScrollReveal animation="fade-right" delay={300}>
                    <span className="block text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 bg-clip-text text-transparent">
                      Transformation
                    </span>
                  </ScrollReveal>
                  <ScrollReveal animation="fade-left" delay={450}>
                    <span className="block text-5xl md:text-7xl font-black text-white/90">neu definiert</span>
                  </ScrollReveal>
                </div>
                
                <ScrollReveal animation="fade-right" delay={600}>
                  <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-2xl">
                    Wir verwandeln Ihre Visionen in leistungsstarke digitale Lösungen. 
                    Von modernen Websites über CRM-Systeme bis hin zu Smart Home Automation.
                  </p>
                </ScrollReveal>
                
                {/* Stats with Glass Effect */}
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <ScrollReveal key={index} animation="scale-in" delay={750 + (index * 100)}>
                      <div className="glass-card p-4 text-center">
                        <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl md:text-3xl font-black text-white">{stat.number}</div>
                        <div className="text-sm text-white/70">{stat.label}</div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
                
                <ScrollReveal animation="fade-left" delay={1100}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-white text-violet-900 hover:bg-white/90 shadow-xl">
                      <Link to="/contact">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Kostenloses Beratungsgespräch
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
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
                <div className="relative">
                  <div className="glass-card p-2 rounded-3xl">
                    <img 
                      src={heroImage}
                      alt="Digital Solutions" 
                      className="w-full h-auto rounded-2xl"
                    />
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500 rounded-2xl blur-2xl opacity-50 animate-float"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-violet-500 rounded-2xl blur-2xl opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Unsere Services
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Was wir für Sie <span className="text-primary">tun können</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={200}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Von Webdesign bis Smart Home - wir bieten umfassende digitale Lösungen
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <Card className="glass-card h-full group hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <service.icon className="absolute top-4 left-4 h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    
                    <Button size="sm" variant="ghost" className="w-full text-primary hover:bg-primary/10" asChild>
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
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Ihre Vorteile
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Warum <span className="text-primary">Unicum Tech</span>?
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={200}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ihre Vorteile bei der Zusammenarbeit mit uns
              </p>
            </ScrollReveal>
          </div>

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

      {/* Featured Projects Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Unsere Projekte
              </Badge>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Erfolgreiche <span className="text-primary">Umsetzungen</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={200}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Entdecken Sie eine Auswahl unserer besten Projekte
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                <Card className="glass-card group hover:scale-105 transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
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
              <Button size="lg" asChild>
                <Link to="/portfolio">
                  Alle Projekte ansehen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal animation="scale-in">
            <div className="text-center max-w-3xl mx-auto">
              <Rocket className="h-16 w-16 text-white mx-auto mb-6 animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Bereit für Ihr nächstes Projekt?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Lassen Sie uns gemeinsam Ihre digitale Vision verwirklichen. 
                Vereinbaren Sie jetzt ein kostenloses Beratungsgespräch!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-violet-900 hover:bg-white/90 shadow-xl">
                  <Link to="/contact">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Jetzt Kontakt aufnehmen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">
                  <Link to="/services">Services entdecken</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      
      <WebsiteMobileNav />
    </div>
  );
};

export default Index;
