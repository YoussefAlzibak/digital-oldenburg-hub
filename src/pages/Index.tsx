import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Users, 
  Settings, 
  Printer, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Shield,
  Clock,
  Monitor,
  Zap,
  MessageCircle,
  Target,
  Code,
  Rocket,
  Calendar,
  Users2,
  Palette,
  ExternalLink,
  Github
} from "lucide-react";
import { WebsiteMobileNav } from "@/components/WebsiteMobileNav";

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
    { number: "150+", label: "Erfolgreiche Projekte" },
    { number: "98%", label: "Kundenzufriedenheit" },
    { number: "5+", label: "Jahre Erfahrung" }
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
                <span className="text-2xl md:text-3xl font-light text-[hsl(var(--brand-primary))] tracking-tight">Tec</span>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Digital Excellence</div>
              </div>
            </div>
            
            <nav className="hidden md:flex lg:hidden items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-primary">
                Home
              </Link>
              <Link to="/services" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/portfolio" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Portfolio
              </Link>
              <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Über uns
              </Link>
              <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Kontakt
              </Link>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-foreground to-secondary pt-32 pb-20">
        <div className="hero-geometric-bg">
          <div className="hero-particle" style={{top: '10%', left: '15%', animationDelay: '0s'}}></div>
          <div className="hero-particle" style={{top: '70%', left: '80%', animationDelay: '1s'}}></div>
          <div className="hero-particle" style={{top: '30%', left: '70%', animationDelay: '0.5s'}}></div>
          <div className="hero-glow hero-glow-1" style={{animationDelay: '0s'}}></div>
          <div className="hero-glow hero-glow-2" style={{animationDelay: '2s'}}></div>
          <div className="hero-glow hero-glow-3" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="hero-content">
                <div className="hero-badge bg-accent/20 text-accent border border-accent/30 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Ihr Partner für digitale Excellence
                </div>
                
                <h1 className="hero-title text-4xl md:text-6xl font-black mb-6 leading-tight">
                  <span className="text-white block">Digitale</span>
                  <span className="hero-gradient-text bg-gradient-to-r from-accent via-accent-foreground to-primary-foreground bg-clip-text text-transparent block">Transformation</span>
                  <span className="text-white/90 block">neu definiert</span>
                </h1>
                
                <p className="hero-subtitle text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
                  Wir verwandeln Ihre Visionen in leistungsstarke digitale Lösungen. Von modernen Websites über CRM-Systeme bis hin zu Smart Home Automation - Ihr Erfolg ist unser Antrieb.
                </p>
                
                <div className="hero-stats grid grid-cols-3 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl md:text-3xl font-black text-accent">{stat.number}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="hero-actions flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact" 
                    className="hero-cta-primary group bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-4 rounded-full inline-flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    Kostenloses Beratungsgespräch
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/portfolio" 
                    className="hero-cta-secondary group bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-full inline-flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
                  >
                    <Monitor className="h-5 w-5 mr-2" />
                    Portfolio ansehen
                  </Link>
                </div>
              </div>
              
              <div className="hero-visual relative">
                <img 
                  src={heroImage} 
                  alt="Digital Solutions" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Unsere Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Was wir für Sie tun können
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Von Webdesign bis Smart Home - wir bieten umfassende digitale Lösungen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
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
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
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
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Unsere Projekte
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Erfolgreiche Umsetzungen
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entdecken Sie eine Auswahl unserer besten Projekte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
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
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
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
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/portfolio">
                Alle Projekte ansehen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit für Ihr nächstes Projekt?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Lassen Sie uns gemeinsam Ihre digitale Vision verwirklichen. Kontaktieren Sie uns für ein kostenloses Beratungsgespräch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Jetzt Kontakt aufnehmen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">Services entdecken</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <WebsiteMobileNav />
    </div>
  );
};

export default Index;