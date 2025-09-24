import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CustomerReviews } from "@/components/CustomerReviews";
import NewsletterSignup from "@/components/NewsletterSignup";
import { WebsiteLayout } from "@/components/WebsiteLayout";
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
  Smartphone,
  Zap,
  Award,
  MessageCircle,
  Target,
  Lightbulb,
  Rocket,
  Code,
  Palette,
  BarChart,
  Euro,
  ChevronDown,
  Calendar,
  FileText,
  Users2,
  Cookie,
  Home
} from "lucide-react";
import { useState } from "react";

// Import generated images
import webdesignService from "@/assets/webdesign-service.webp";
import crmService from "@/assets/crm-service.webp";
import itService from "@/assets/it-service.webp";
import printService from "@/assets/print-service.webp";
import portfolioEcommerce from "@/assets/portfolio-ecommerce.webp";
import portfolioCorporate from "@/assets/portfolio-corporate.webp";
import portfolioSaas from "@/assets/portfolio-saas.webp";
import portfolioMobile from "@/assets/portfolio-mobile.webp";
import portfolioSmarthome from "@/assets/portfolio-smarthome.webp";
import teamImage from "@/assets/team-image.webp";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Alle");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const services = [
    {
      icon: Globe,
      title: "Webdesign & Development",
      description: "Moderne, responsive Websites mit fokussiertem UX/UI Design. Von der Konzeption bis zur Umsetzung - wir schaffen digitale Erlebnisse, die begeistern.",
      features: [
        "Responsive & Mobile-First Design",
        "Performance & SEO-Optimierung", 
        "E-Commerce & Content Management"
      ],
      image: webdesignService
    },
    {
      icon: Users,
      title: "CRM & HubSpot Solutions",
      description: "Professionelle CRM-Systeme und HubSpot-Integration für optimierte Kundenverwaltung, Marketing-Automatisierung und datengetriebene Geschäftsentscheidungen.",
      features: [
        "HubSpot Setup & Customization",
        "Marketing Automation & Lead-Nurturing",
        "Sales Pipeline & Analytics"
      ],
      image: crmService
    },
    {
      icon: Settings,
      title: "IT-Services & Smart Home",
      description: "Umfassende IT-Betreuung und moderne Smart Home Lösungen. Von Netzwerk-Setup bis hin zu intelligenten Automatisierungssystemen für Ihr Zuhause oder Büro.",
      features: [
        "IT-Support & Systemadministration",
        "Smart Home Automation",
        "Sicherheitssysteme & Monitoring"
      ],
      image: itService
    },
    {
      icon: Printer,
      title: "Print Design & Branding",
      description: "Professionelle Print-Materialien und Corporate Identity Design für einen einheitlichen und professionellen Markenauftritt.",
      features: [
        "Logo & Corporate Design",
        "Visitenkarten & Briefpapier",
        "Broschüren & Marketing-Materialien"
      ],
      image: printService
    }
  ];

  const projects = [
    {
      title: "E-Commerce Dashboard",
      description: "Vollständige CRM-Integration für Online-Shop mit automatisierten Workflows und Analytics. Über 300% Umsatzsteigerung durch optimierte Conversion-Funnel.",
      category: "E-Commerce",
      tags: ["React", "Node.js", "HubSpot CRM", "Analytics"],
      image: portfolioEcommerce,
      metrics: { conversion: "+300%", users: "50k+", revenue: "€2.5M+" }
    },
    {
      title: "Corporate Website Redesign",
      description: "Moderne Corporate Website mit integriertem Lead-Management-System. Vollständig responsive und SEO-optimiert.",
      category: "Corporate", 
      tags: ["HTML5", "CSS3", "JavaScript", "SEO"],
      image: portfolioCorporate,
      metrics: { performance: "98/100", leads: "+250%", bounce: "-45%" }
    },
    {
      title: "SaaS Platform UI/UX",
      description: "Benutzerfreundliches Dashboard für SaaS-Anwendung mit erweiterten CRM-Features und Echtzeit-Analytics.",
      category: "SaaS",
      tags: ["Vue.js", "API", "Analytics", "UX Design"],
      image: portfolioSaas,
      metrics: { retention: "+85%", satisfaction: "4.9/5", efficiency: "+60%" }
    },
    {
      title: "Mobile App Development",
      description: "Native Mobile App mit innovativer Benutzerführung und nahtloser Backend-Integration.",
      category: "Mobile",
      tags: ["React Native", "API", "Push Notifications"],
      image: portfolioMobile,
      metrics: { downloads: "100k+", rating: "4.8/5", retention: "78%" }
    },
    {
      title: "Smart Home Dashboard",
      description: "Intelligente Hausautomation mit IoT-Integration und benutzerfreundlicher Steuerung aller Geräte.",
      category: "IoT",
      tags: ["IoT", "Smart Home", "Automation", "Security"],
      image: portfolioSmarthome,
      metrics: { devices: "500+", efficiency: "+40%", security: "99.9%" }
    }
  ];

  const testimonials = [
    {
      name: "Marcel Schmidt",
      role: "Geschäftsführer, Schmidt Automobile Oldenburg",
      initials: "MS",
      text: "Unicum Tec hat unsere komplette IT-Infrastruktur modernisiert. Seit dem Update läuft alles reibungslos und unsere Kunden sind begeistert von unserem neuen Online-Auftritt."
    },
    {
      name: "Anna Hoffmann",
      role: "Inhaberin, Café Hoffmann Oldenburg",
      initials: "AH", 
      text: "Das neue Online-Bestellsystem hat unseren Umsatz um 60% gesteigert. Kunden können jetzt einfach vorbestellen und wir haben deutlich weniger Wartezeiten."
    },
    {
      name: "Thomas Lindner",
      role: "Geschäftsführer, Lindner Elektrotechnik",
      initials: "TL",
      text: "Von der ersten Beratung bis zur finalen Umsetzung - alles perfekt. Unser CRM-System läuft seit Monaten ohne Probleme und unsere Kundenbetreuung ist viel effizienter geworden."
    }
  ];

  const blogPosts = [
    {
      category: "Webdesign",
      date: "15. Januar 2024",
      title: "Die Zukunft des Webdesigns: Trends 2024",
      excerpt: "Entdecken Sie die neuesten Webdesign-Trends für 2024: Von Glasmorphismus bis hin zu KI-gestützten Designprozessen.",
      readTime: "5 Min. Lesezeit"
    },
    {
      category: "CRM",
      date: "10. Januar 2024", 
      title: "HubSpot Automatisierung: Effizienz steigern",
      excerpt: "Wie Sie mit intelligenten HubSpot-Workflows Ihre Marketing- und Sales-Prozesse automatisieren.",
      readTime: "7 Min. Lesezeit"
    },
    {
      category: "Smart Home",
      date: "5. Januar 2024",
      title: "Smart Home 2024: Intelligente Automation", 
      excerpt: "Die neuesten Smart Home Trends: Von sprachgesteuerter Beleuchtung bis zur KI-basierten Sicherheit.",
      readTime: "6 Min. Lesezeit"
    }
  ];

  const stats = [
    { number: "150+", label: "Erfolgreiche Projekte" },
    { number: "98%", label: "Kundenzufriedenheit" },
    { number: "5+", label: "Jahre Erfahrung" }
  ];

  const guarantees = [
    { icon: Shield, label: "ISO 27001", description: "Zertifizierte Informationssicherheit" },
    { icon: CheckCircle, label: "DSGVO", description: "100% Datenschutz-konform" },
    { icon: Clock, label: "24/7 Support", description: "Rund um die Uhr für Sie da" },
    { icon: Award, label: "Geld-zurück", description: "30 Tage Garantie" }
  ];

  const processes = [
    { 
      icon: MessageCircle, 
      title: "Beratung", 
      description: "Kostenloses Erstgespräch zur Analyse Ihrer Anforderungen",
      number: "01"
    },
    { 
      icon: Target, 
      title: "Konzept", 
      description: "Maßgeschneidertes Lösungskonzept mit klaren Zielen",
      number: "02"
    },
    { 
      icon: Code, 
      title: "Entwicklung", 
      description: "Agile Entwicklung mit regelmäßigen Updates",
      number: "03"
    },
    { 
      icon: Rocket, 
      title: "Launch", 
      description: "Erfolgreicher Go-Live mit umfassendem Support",
      number: "04"
    }
  ];

  const team = [
    {
      name: "Nouh Abdullah",
      role: "Geschäftsführer",
      specialties: ["Business Development", "Strategy", "Client Relations"],
      image: teamImage
    },
    {
      name: "Youssef Alzibak",
      role: "Programmierer",
      specialties: ["Full-Stack Development", "API Integration", "Database Design"],
      image: teamImage
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "ab 899€",
      description: "Perfekt für kleine Unternehmen",
      features: [
        "Responsive Website (bis 5 Seiten)",
        "SEO-Grundoptimierung",
        "Kontaktformular",
        "1 Monat Support",
        "Mobile-optimiert"
      ],
      highlight: false
    },
    {
      name: "Professional",
      price: "ab 2.499€",
      description: "Für wachsende Unternehmen",
      features: [
        "CRM-Integration (HubSpot)",
        "E-Commerce Funktionen",
        "Analytics & Tracking",
        "3 Monate Support",
        "Lead-Management",
        "Marketing Automation"
      ],
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Individuell",
      description: "Maßgeschneiderte Lösungen",
      features: [
        "Vollumfängliche Digitalisierung",
        "API-Entwicklung",
        "Smart Home Integration",
        "24/7 Premium Support",
        "Dedizierter Account Manager",
        "Unbegrenzte Anpassungen"
      ],
      highlight: false
    }
  ];

  const faqs = [
    {
      question: "Wie lange dauert die Entwicklung einer Website?",
      answer: "Die Entwicklungszeit variiert je nach Projektumfang. Eine einfache Website (Starter-Paket) ist in 2-3 Wochen fertig, während komplexere CRM-Integrationen 6-8 Wochen benötigen."
    },
    {
      question: "Bieten Sie auch Wartung und Support an?",
      answer: "Ja, wir bieten umfassende Wartung und Support-Pakete. Je nach gewähltem Paket ist Support von 1 Monat bis zu 24/7 Premium Support enthalten."
    },
    {
      question: "Können Sie bestehende Systeme integrieren?",
      answer: "Absolut! Wir sind Experten in der Integration von CRM-Systemen wie HubSpot, E-Commerce-Plattformen und anderen Geschäftssystemen."
    },
    {
      question: "Was kostet eine CRM-Integration?",
      answer: "CRM-Integrationen sind ab dem Professional-Paket (2.499€) enthalten. Individuelle Lösungen werden nach Aufwand berechnet."
    },
    {
      question: "Arbeiten Sie nur in Oldenburg?",
      answer: "Nein, wir arbeiten deutschlandweit remote. Unser Hauptsitz ist in Oldenburg, aber wir betreuen Kunden in ganz Deutschland."
    },
    {
      question: "Gibt es eine Geld-zurück-Garantie?",
      answer: "Ja, wir bieten eine 30-Tage Geld-zurück-Garantie. Sollten Sie nicht zufrieden sein, erstatten wir Ihnen den vollen Betrag."
    }
  ];

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="hero-section-enhanced relative overflow-hidden bg-gradient-to-br from-primary via-primary-foreground to-secondary">
        <div className="hero-geometric-bg">
          <div className="hero-particle" style={{top: '10%', left: '15%', animationDelay: '0s'}}></div>
          <div className="hero-particle" style={{top: '70%', left: '80%', animationDelay: '1s'}}></div>
          <div className="hero-particle" style={{top: '30%', left: '70%', animationDelay: '0.5s'}}></div>
          <div className="hero-glow hero-glow-1" style={{animationDelay: '0s'}}></div>
          <div className="hero-glow hero-glow-2" style={{animationDelay: '2s'}}></div>
          <div className="hero-glow hero-glow-3" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="hero-content animate-fade-right">
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
              
              <div className="hero-visual relative animate-fade-left">
                <div className="hero-image-container relative">
                  <div className="hero-floating-card bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-sm ml-auto mb-6 animate-float">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                        <BarChart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Performance Boost</div>
                        <div className="text-sm text-muted-foreground">Website Optimierung</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ladezeit</span>
                        <span className="font-medium text-green-600">-67%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Conversion</span>
                        <span className="font-medium text-green-600">+240%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">SEO Score</span>
                        <span className="font-medium text-green-600">98/100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hero-floating-card bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-sm animate-float" style={{animationDelay: '1s'}}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">CRM Integration</div>
                        <div className="text-sm text-muted-foreground">HubSpot Automation</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Leads erfasst</span>
                        <span className="font-medium text-primary">2.547</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Conversion Rate</span>
                        <span className="font-medium text-primary">18.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="services-overview py-20 md:py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Unsere Services
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Digitale Lösungen, die <span className="text-gradient">begeistern</span>
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Von der ersten Idee bis zur erfolgreichen Implementation - wir begleiten Sie auf jedem Schritt Ihrer digitalen Transformation.
            </p>
          </div>

          <div className="services-grid grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="service-card group overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border-primary/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="service-icon w-16 h-16 bg-gradient-to-br from-primary to-primary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="service-title text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="service-description text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <div className="service-features space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="service-image relative overflow-hidden rounded-xl mb-6">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <Link 
                    to="/services" 
                    className="service-cta group/cta w-full bg-primary/5 hover:bg-primary text-muted-foreground hover:text-white font-medium py-3 px-6 rounded-xl inline-flex items-center justify-center transition-all duration-300 border border-primary/10 hover:border-primary hover:shadow-lg"
                  >
                    Mehr erfahren
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/cta:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="portfolio-preview py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <Monitor className="h-4 w-4 mr-2" />
              Portfolio
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Erfolgsgeschichten unserer <span className="text-gradient">Kunden</span>
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Entdecken Sie unsere neuesten Projekte und lassen Sie sich von den Ergebnissen inspirieren.
            </p>
          </div>

          <div className="portfolio-tabs flex flex-wrap justify-center gap-2 mb-12">
            {["Alle", "E-Commerce", "Corporate", "SaaS", "Mobile", "IoT"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`portfolio-tab transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                    : "hover:bg-primary/10 hover:border-primary/20"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="portfolio-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects
              .filter(project => activeTab === "Alle" || project.category === activeTab)
              .map((project, index) => (
              <Card key={index} className="portfolio-card group overflow-hidden bg-card border-primary/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
                <div className="portfolio-image relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      {project.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="bg-white/20 border-white/30 text-white text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="portfolio-title text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="portfolio-description text-muted-foreground leading-relaxed text-sm">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <div className="portfolio-metrics grid grid-cols-3 gap-4 mb-4 p-4 bg-primary/5 rounded-lg">
                    {Object.entries(project.metrics).map(([key, value], idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-sm font-semibold text-primary">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    to="/portfolio" 
                    className="portfolio-cta group/cta w-full bg-primary/5 hover:bg-primary text-muted-foreground hover:text-white font-medium py-2 px-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 border border-primary/10 hover:border-primary text-sm"
                  >
                    Details ansehen
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/cta:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/portfolio" 
              className="btn-enhanced group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full inline-flex items-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
            >
              <Monitor className="h-5 w-5 mr-2" />
              Alle Projekte ansehen
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section py-20 md:py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <Target className="h-4 w-4 mr-2" />
              Unser Prozess
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Von der <span className="text-gradient">Idee</span> zum Erfolg
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Unser bewährter 4-Schritte-Prozess garantiert Ihnen transparente Zusammenarbeit und exzellente Ergebnisse.
            </p>
          </div>

          <div className="process-timeline grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {processes.map((process, index) => (
              <Card key={index} className="process-card group text-center bg-card border-primary/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] relative">
                <div className="process-number absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {process.number}
                </div>
                
                <CardContent className="p-8 pt-12">
                  <div className="process-icon w-16 h-16 bg-gradient-to-br from-primary to-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <process.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="process-title text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {process.title}
                    </CardTitle>
                    <CardDescription className="process-description text-muted-foreground leading-relaxed">
                      {process.description}
                    </CardDescription>
                  </CardHeader>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <Users2 className="h-4 w-4 mr-2" />
              Unser Team
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Die <span className="text-gradient">Experten</span> hinter Ihrem Erfolg
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Lernen Sie unser erfahrenes Team kennen, das mit Leidenschaft und Expertise Ihre digitalen Projekte zum Leben erweckt.
            </p>
          </div>

          <div className="team-grid grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="team-card group text-center bg-card border-primary/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="team-image relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-2xl">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="team-name text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="team-role text-primary font-medium text-lg">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  
                  <div className="team-specialties space-y-2">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="mr-2 mb-2 border-primary/20 text-muted-foreground hover:bg-primary/10">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-20 md:py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <Star className="h-4 w-4 mr-2" />
              Kundenstimmen
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Was unsere <span className="text-gradient">Kunden</span> sagen
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Lesen Sie die Erfahrungen unserer zufriedenen Kunden und lassen Sie sich von den Erfolgsgeschichten inspirieren.
            </p>
          </div>

          <div className="testimonials-grid grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card group bg-card border-primary/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="testimonial-rating flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="testimonial-text text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="testimonial-author flex items-center">
                    <div className="author-avatar w-12 h-12 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="author-name font-semibold text-foreground">{testimonial.name}</div>
                      <div className="author-role text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <Euro className="h-4 w-4 mr-2" />
              Transparente Preise
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Investieren Sie in Ihren <span className="text-gradient">digitalen Erfolg</span>
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Wählen Sie das passende Paket für Ihre Bedürfnisse. Alle Preise sind transparent und ohne versteckte Kosten.
            </p>
          </div>

          <div className="pricing-grid grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`pricing-card group transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
                plan.highlight 
                  ? "bg-gradient-to-br from-primary via-primary to-primary-foreground text-white border-2 border-accent scale-105" 
                  : "bg-card border-primary/10 hover:border-primary/20"
              }`}>
                {plan.highlight && (
                  <div className="pricing-badge absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-sm font-medium">
                    Beliebteste Wahl
                  </div>
                )}
                
                <CardContent className="p-8 relative">
                  <CardHeader className="p-0 mb-6 text-center">
                    <CardTitle className={`pricing-name text-2xl font-bold mb-2 ${
                      plan.highlight ? "text-white" : "text-foreground"
                    }`}>
                      {plan.name}
                    </CardTitle>
                    <div className={`pricing-price text-4xl font-black mb-2 ${
                      plan.highlight ? "text-white" : "text-primary"
                    }`}>
                      {plan.price}
                    </div>
                    <CardDescription className={`pricing-description ${
                      plan.highlight ? "text-white/80" : "text-muted-foreground"
                    }`}>
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <div className="pricing-features space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className={`flex items-center text-sm ${
                        plan.highlight ? "text-white/90" : "text-muted-foreground"
                      }`}>
                        <CheckCircle className={`h-4 w-4 mr-3 flex-shrink-0 ${
                          plan.highlight ? "text-accent" : "text-primary"
                        }`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    to="/contact" 
                    className={`pricing-cta group/cta w-full font-medium py-3 px-6 rounded-xl inline-flex items-center justify-center transition-all duration-300 ${
                      plan.highlight 
                        ? "bg-accent hover:bg-accent/90 text-primary hover:shadow-lg" 
                        : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg"
                    }`}
                  >
                    Jetzt anfragen
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/cta:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="guarantees-section py-20 md:py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Unsere Garantien
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Ihre <span className="text-gradient">Sicherheit</span> ist unser Versprechen
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Mit unseren Garantien gehen Sie keinerlei Risiko ein. Ihre Zufriedenheit und Sicherheit stehen an erster Stelle.
            </p>
          </div>

          <div className="guarantees-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="guarantee-card group text-center bg-card border-primary/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
                <CardContent className="p-8">
                  <div className="guarantee-icon w-16 h-16 bg-gradient-to-br from-primary to-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <guarantee.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardHeader className="p-0">
                    <CardTitle className="guarantee-title text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                      {guarantee.label}
                    </CardTitle>
                    <CardDescription className="guarantee-description text-muted-foreground text-sm">
                      {guarantee.description}
                    </CardDescription>
                  </CardHeader>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="blog-preview py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <FileText className="h-4 w-4 mr-2" />
              Aktuelles & Insights
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Bleiben Sie auf dem <span className="text-gradient">neuesten Stand</span>
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Entdecken Sie die neuesten Trends, Tipps und Insights aus der Welt der digitalen Transformation.
            </p>
          </div>

          <div className="blog-grid grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <Card key={index} className="blog-card group overflow-hidden bg-card border-primary/10 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="blog-meta flex items-center gap-4 mb-4">
                    <Badge variant="secondary" className="blog-category bg-primary/10 text-primary border-0">
                      {post.category}
                    </Badge>
                    <span className="blog-date text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="blog-title text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="blog-excerpt text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <div className="blog-footer flex items-center justify-between text-sm text-muted-foreground">
                    <span className="blog-read-time">{post.readTime}</span>
                    <Button variant="ghost" size="sm" className="blog-read-more group/read p-0 h-auto font-medium text-primary hover:text-primary hover:bg-transparent">
                      Weiterlesen
                      <ArrowRight className="h-4 w-4 ml-1 group-hover/read:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-20 md:py-32 bg-gradient-subtle">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-header text-center mb-16">
            <Badge variant="outline" className="badge-enhanced mb-4">
              <MessageCircle className="h-4 w-4 mr-2" />
              Häufige Fragen
            </Badge>
            <h2 className="section-title text-3xl md:text-5xl font-black mb-6">
              Haben Sie noch <span className="text-gradient">Fragen?</span>
            </h2>
            <p className="section-subtitle text-lg text-muted-foreground max-w-3xl mx-auto">
              Hier finden Sie Antworten auf die am häufigsten gestellten Fragen. Sollten Sie weitere Fragen haben, kontaktieren Sie uns gerne.
            </p>
          </div>

          <div className="faq-list max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="faq-item bg-card border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-0">
                  <button
                    className="faq-question w-full text-left p-6 flex items-center justify-between hover:bg-primary/5 transition-colors duration-300"
                    onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  >
                    <span className="faq-question-text font-semibold text-foreground pr-4">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-primary transition-transform duration-300 flex-shrink-0 ${
                      activeFAQ === index ? "rotate-180" : ""
                    }`} />
                  </button>
                  
                  {activeFAQ === index && (
                    <div className="faq-answer p-6 pt-0 border-t border-primary/10">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/contact" 
              className="btn-enhanced group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full inline-flex items-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Weitere Fragen? Kontaktieren Sie uns
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <CustomerReviews />

      {/* Newsletter Section */}
      <NewsletterSignup />
    </WebsiteLayout>
  );
};

export default Index;