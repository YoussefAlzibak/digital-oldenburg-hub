import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Palette, Smartphone, Globe, ShoppingCart, Zap, CheckCircle, Monitor, Users2, MessageCircle, Shield, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import webdesignImage from "@/assets/webdesign-service.webp";
import itImage from "@/assets/it-service.webp";
import printImage from "@/assets/print-service.webp";
import crmImage from "@/assets/crm-service.webp";
import { WebsiteMobileNav } from "@/components/WebsiteMobileNav";

const Services = () => {
  const services = [
    {
      id: "webdesign",
      title: "Webdesign & Development",
      description: "Moderne, responsive Websites die Ihre Kunden begeistern",
      image: webdesignImage,
      features: ["Responsive Design", "SEO-optimiert", "Performance-fokussiert", "Mobile-first"],
      icon: <Palette className="h-8 w-8" />,
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "it-solutions",
      title: "IT-Lösungen",
      description: "Maßgeschneiderte Software-Lösungen für Ihr Unternehmen",
      image: itImage,
      features: ["Custom Software", "Cloud-Integration", "Automatisierung", "Support"],
      icon: <Code className="h-8 w-8" />,
      color: "from-green-500 to-blue-600"
    },
    {
      id: "ecommerce",
      title: "E-Commerce",
      description: "Online-Shops die verkaufen und konvertieren",
      image: crmImage,
      features: ["Shop-Systeme", "Payment-Integration", "Inventory Management", "Analytics"],
      icon: <ShoppingCart className="h-8 w-8" />,
      color: "from-orange-500 to-red-600"
    },
    {
      id: "mobile-apps",
      title: "Mobile Apps",
      description: "Native und Cross-Platform App-Entwicklung",
      image: printImage,
      features: ["iOS & Android", "Cross-Platform", "UI/UX Design", "App Store Optimierung"],
      icon: <Smartphone className="h-8 w-8" />,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const processes = [
    { step: "01", title: "Beratung", description: "Analyse Ihrer Anforderungen und Ziele" },
    { step: "02", title: "Konzeption", description: "Strategische Planung und Design-Konzept" },
    { step: "03", title: "Entwicklung", description: "Agile Umsetzung mit regelmäßigen Updates" },
    { step: "04", title: "Launch & Support", description: "Go-Live und kontinuierliche Betreuung" }
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
              <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/services" className="text-sm font-medium text-primary">
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
              <Link to="/" className="nav-link">
                <Globe className="nav-icon" />
                <span>Home</span>
              </Link>
              <Link to="/services" className="nav-link text-primary">
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
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              Unsere Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Digitale Lösungen die
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> begeistern</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Von modernem Webdesign bis hin zu komplexen IT-Lösungen - wir bringen Ihre digitalen Projekte zum Erfolg
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 p-3 bg-background/90 backdrop-blur-sm rounded-lg">
                    <div className={`text-primary`}>
                      {service.icon}
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    Mehr erfahren
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unser Prozess</h2>
            <p className="text-xl text-muted-foreground">Von der Idee bis zur Realisierung</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processes.map((process, index) => (
              <div key={process.step} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl font-bold text-primary">{process.step}</span>
                  </div>
                  {index < processes.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-20 w-full h-0.5 bg-border" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{process.title}</h3>
                <p className="text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-12">
            <Zap className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für Ihr nächstes Projekt?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam Ihre digitale Vision verwirklichen. Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  Projekt starten
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
      
      <WebsiteMobileNav />
    </div>
  );
};

export default Services;