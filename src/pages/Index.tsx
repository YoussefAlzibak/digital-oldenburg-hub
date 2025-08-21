import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Mail,
  Phone,
  MapPin,
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
  Users2
} from "lucide-react";
import { useState } from "react";

// Import generated images
import heroImage from "@/assets/hero-image.webp";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    service: ""
  });
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
      name: "Markus Hansen",
      role: "Inhaber, Hansen Metallbau Oldenburg",
      initials: "MH",
      text: "Endlich eine moderne Website! Unicum Tec hat verstanden, was unser Handwerksbetrieb braucht. Mehr Anfragen und eine professionelle Online-Präsenz."
    },
    {
      name: "Dr. Sarah Weber",
      role: "Zahnärztin, Praxis Weber Oldenburg",
      initials: "SW", 
      text: "Schnelle Umsetzung und faire Preise. Unsere Praxis-Website ist genau das, was wir uns vorgestellt haben. Patienten finden uns jetzt viel besser online."
    },
    {
      name: "Robert Meyer",
      role: "Marketing Director, Digital Pioneers",
      initials: "RM",
      text: "Die HubSpot-Integration durch Unicum Tec war ein Game-Changer für unser Marketing. Lead-Generierung funktioniert jetzt automatisch und unsere Conversion-Rate hat sich verdreifacht."
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
      name: "Maxim Schulz",
      role: "Geschäftsführer & Lead Developer",
      specialties: ["Full-Stack Development", "CRM Integration", "Project Management"],
      image: teamImage
    },
    {
      name: "Sarah Schmidt",
      role: "UI/UX Designerin",
      specialties: ["User Experience", "Interface Design", "Brand Identity"],
      image: teamImage
    },
    {
      name: "Tom Weber",
      role: "IT-Consultant",
      specialties: ["Smart Home", "Network Security", "System Administration"],
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm fixed top-0 w-full z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-left">
              <div className="h-10 w-10 bg-[hsl(var(--brand-primary))] rounded-lg flex items-center justify-center shadow-lg">
                <div className="h-6 w-6 bg-white rounded-sm"></div>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--brand-secondary))]">Unicum Tec</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8 animate-fade-right">
              <a href="#services" className="text-gray-600 hover:text-[hsl(var(--brand-primary))] transition-colors font-medium">
                Services
              </a>
              <a href="#portfolio" className="text-gray-600 hover:text-[hsl(var(--brand-primary))] transition-colors font-medium">
                Portfolio
              </a>
              <a href="#about" className="text-gray-600 hover:text-[hsl(var(--brand-primary))] transition-colors font-medium">
                Über uns
              </a>
              <a href="#contact" className="text-gray-600 hover:text-[hsl(var(--brand-primary))] transition-colors font-medium">
                Kontakt
              </a>
              <Button className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg">
                Beratung anfragen
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Improved Layout */}
      <section className="relative hero-dark min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 floating-shapes">
          <div className="geometric-shape hexagon shape-1"></div>
          <div className="geometric-shape triangle shape-2"></div>
          <div className="geometric-shape diamond shape-3"></div>
          <div className="geometric-shape rectangle shape-4"></div>
          <div className="geometric-shape hexagon shape-5" style={{background: 'hsl(var(--brand-accent) / 0.6)'}}></div>
          <div className="geometric-shape triangle shape-6" style={{borderBottomColor: 'hsl(var(--brand-primary) / 0.8)'}}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <h1 className="text-hero-primary">
                Digitale Excellence
                <br />
                <span className="text-hero-accent">für Ihren Erfolg</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed animate-fade-up delay-200">
                Unicum Tec - Ihre Full-Service Digitalagentur in Oldenburg. Wir transformieren Geschäftsprozesse durch innovative Webdesign-Lösungen, professionelle CRM-Systeme und modernste IT-Services.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 animate-fade-up delay-400">
                <Button size="lg" className="bg-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))]/90 text-white px-10 py-4 text-lg font-semibold rounded-lg transition-all hover:scale-105 shadow-xl">
                  Portfolio entdecken
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-[hsl(var(--brand-secondary))] font-semibold rounded-lg transition-all hover:scale-105">
                  Kostenlose Beratung
                </Button>
              </div>
            </div>
            <div className="hidden lg:block animate-fade-up delay-600">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Modern digital agency workspace" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-[hsl(var(--brand-primary))] text-white p-6 rounded-xl shadow-xl">
                  <div className="text-3xl font-bold">150+</div>
                  <div className="text-sm">Erfolgreiche Projekte</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Modern Grid Layout */}
      <section id="services" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up uppercase tracking-tight">
              UNSERE SERVICES
            </h2>
            <p className="text-xl text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto font-medium">
              Für euch entwickelt - Maßgeschneiderte Lösungen für Ihre digitale Transformation
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {services.map((service, index) => (
              <Card key={index} className={`group cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-up delay-${index * 100} bg-white border-0 shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden`}>
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="h-16 w-16 bg-[hsl(var(--brand-primary))] rounded-2xl flex items-center justify-center shadow-lg">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <CardTitle className="text-2xl mb-4 text-[hsl(var(--brand-secondary))] font-black uppercase tracking-tight">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed mb-6 font-medium">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-[hsl(var(--brand-primary))] rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-black text-[hsl(var(--brand-secondary))] mb-4 uppercase tracking-tight">
              Unsere Kund:innen
            </h3>
            <div className="w-24 h-1 bg-[hsl(var(--brand-primary))] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-up delay-100">
                <div className="text-4xl font-black text-[hsl(var(--brand-primary))] mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section - Enhanced */}
      <section id="portfolio" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up uppercase tracking-tight">
              ERFOLGREICHE PROJEKTE
            </h2>
            <p className="text-xl text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto font-medium">
              Innovative Lösungen, die begeistern und Ergebnisse liefern
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-up delay-300">
              {["Alle", "E-Commerce", "Corporate", "SaaS", "Mobile", "IoT"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-8 py-3 font-bold uppercase tracking-wide text-sm transition-all duration-300 ${
                    activeTab === tab 
                      ? "bg-[hsl(var(--brand-primary))] text-white shadow-lg scale-105" 
                      : "border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))] hover:text-white hover:scale-105"
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter(project => activeTab === "Alle" || project.category === activeTab)
              .map((project, index) => (
                <Card key={index} className={`group cursor-pointer transition-all duration-500 hover:scale-105 animate-fade-up delay-${index * 100} bg-white border-0 shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden`}>
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[hsl(var(--brand-primary))] text-white font-bold uppercase tracking-wide">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <CardTitle className="text-xl mb-3 text-[hsl(var(--brand-secondary))] group-hover:text-[hsl(var(--brand-primary))] transition-colors font-black uppercase tracking-tight">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed mb-6 font-medium">
                      {project.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-semibold border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] bg-[hsl(var(--brand-primary))]/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-100">
                        {Object.entries(project.metrics).map(([key, value], i) => (
                          <div key={i} className="text-center">
                            <div className="text-lg font-black text-[hsl(var(--brand-primary))]">{value}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up gradient-text">Was unsere Kunden sagen</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up stagger-1 max-w-3xl mx-auto">Echtes Feedback von zufriedenen Kunden aus Oldenburg und Umgebung</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`p-8 hover-lift glass-card relative group animate-fade-in-up stagger-${index + 1}`}>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <CardContent className="pt-8">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.initials}
                    </div>
                    <div className="ml-6">
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic text-lg leading-relaxed mb-6">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[hsl(var(--brand-accent))] text-[hsl(var(--brand-accent))] group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 section-gradient section-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up gradient-text">Unser Blog</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up stagger-1 max-w-3xl mx-auto">Aktuelle Insights, Trends und Best Practices aus der digitalen Welt</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className={`overflow-hidden hover-lift glass-card group animate-fade-in-up stagger-${index + 1}`}>
                <div className="aspect-video bg-gradient-to-br from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] flex items-center justify-center relative overflow-hidden">
                  <Globe className="h-16 w-16 text-[hsl(var(--brand-primary))] group-hover:animate-float transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)]">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl hover:text-[hsl(var(--brand-primary))] transition-colors cursor-pointer group-hover:gradient-text">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost" size="sm" className="hover-scale group/btn">
                      Weiterlesen <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button variant="outline" className="hover-lift px-8 py-3">Alle Artikel anzeigen</Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-heading text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up">Unser Team</h2>
            <p className="text-subheading text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto">
              Experten mit Leidenschaft für digitale Innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <Card key={index} className={`card-clean text-center p-8 group animate-fade-up delay-${index * 100}`}>
                <div className="relative mb-8">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[hsl(var(--brand-primary))] text-white px-4 py-1">
                      {member.role.split(' ')[0]}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl mb-2 text-[hsl(var(--brand-secondary))]">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))]">
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

      {/* Process Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-heading text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up">Unser Prozess</h2>
            <p className="text-subheading text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto">
              Von der ersten Idee bis zum erfolgreichen Launch - so arbeiten wir
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processes.map((process, index) => (
              <Card key={index} className={`card-clean text-center p-8 group animate-fade-up delay-${index * 100} relative`}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-[hsl(var(--brand-primary))] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {process.number}
                  </div>
                </div>
                <CardContent className="pt-8">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-[hsl(var(--brand-primary))] transition-colors duration-300">
                    <process.icon className="h-8 w-8 text-[hsl(var(--brand-primary))] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--brand-secondary))]">{process.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-heading text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up">Transparente Preise</h2>
            <p className="text-subheading text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto">
              Wählen Sie das Paket, das zu Ihren Anforderungen passt
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`${plan.highlight ? 'ring-2 ring-[hsl(var(--brand-primary))] scale-105' : ''} card-clean p-8 group animate-fade-up delay-${index * 100} relative`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[hsl(var(--brand-primary))] text-white px-4 py-2">
                      Beliebteste Wahl
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center p-0 mb-8">
                  <CardTitle className="text-2xl mb-2 text-[hsl(var(--brand-secondary))]">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-[hsl(var(--brand-primary))] mb-2">{plan.price}</div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-[hsl(var(--brand-success))]" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlight ? 'button-primary' : 'border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))] hover:text-white'}`}>
                    {plan.name === 'Enterprise' ? 'Beratung anfragen' : 'Paket wählen'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-heading text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up">Häufige Fragen</h2>
            <p className="text-subheading text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto">
              Alles was Sie über unsere Services wissen müssen
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className={`card-clean mb-4 overflow-hidden animate-fade-up delay-${index * 50}`}>
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[hsl(var(--brand-secondary))]">{faq.question}</h3>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${activeFAQ === index ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {activeFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">Über uns</h2>
              <p className="text-2xl text-muted-foreground mb-8 font-medium">
                Ihr Partner für digitalen Erfolg in Oldenburg
              </p>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Mit über 5 Jahren Erfahrung in der digitalen Welt verbinden wir kreatives Webdesign mit strategischem CRM-Management. Unsere Mission: Ihre Kundenkommunikation zu optimieren und messbare Ergebnisse zu erzielen.
              </p>
              <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className={`text-center hover-scale animate-fade-in-up stagger-${index + 1}`}>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 animate-fade-in-right">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit hover-scale bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] px-4 py-2">Webdesign</Badge>
                <Badge variant="secondary" className="w-fit hover-scale bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] px-4 py-2">CRM-Integration</Badge>
                <Badge variant="secondary" className="w-fit hover-scale bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] px-4 py-2">UI/UX Design</Badge>
              </div>
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit hover-scale bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] px-4 py-2">Marketing Automation</Badge>
                <Badge variant="secondary" className="w-fit hover-scale bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] px-4 py-2">Data Analytics</Badge>
                <Badge variant="secondary" className="w-fit hover-scale bg-gradient-to-r from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-secondary)/0.1)] px-4 py-2">API Development</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-24 section-gradient section-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up gradient-text">Vertrauen durch Qualität</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up stagger-1 max-w-3xl mx-auto">Ihre Sicherheit ist unser Versprechen. Mit Zertifikaten, Garantien und transparenten Prozessen.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className={`text-center p-8 hover-lift glass-card group animate-scale-in stagger-${index + 1}`}>
                <CardContent className="pt-8">
                  <div className="h-16 w-16 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float shadow-lg">
                    <guarantee.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3 text-lg group-hover:text-[hsl(var(--brand-primary))] transition-colors">{guarantee.label}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{guarantee.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up gradient-text">Kontakt</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up stagger-1 max-w-3xl mx-auto">Bereit für Ihr digitales Projekt? Lassen Sie uns sprechen!</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="animate-fade-in-left">
              <h3 className="text-3xl font-bold mb-8 gradient-text">Starten Sie Ihr Projekt</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input placeholder="Vorname" className="h-12 hover-lift" />
                  <Input placeholder="Nachname" className="h-12 hover-lift" />
                </div>
                <Input placeholder="E-Mail-Adresse" type="email" className="h-12 hover-lift" />
                <Input placeholder="Telefon" type="tel" className="h-12 hover-lift" />
                <Textarea placeholder="Beschreiben Sie Ihr Projekt..." className="h-40 hover-lift" />
                <Button className="w-full bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] text-white hover-scale shadow-xl h-12 text-lg font-semibold">
                  Anfrage senden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
            <div className="space-y-12 animate-fade-in-right">
              <div>
                <h3 className="text-3xl font-bold mb-8">Kontaktinformationen</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 hover-scale">
                    <div className="h-12 w-12 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg">Oldenburg, Niedersachsen</span>
                  </div>
                  <div className="flex items-center space-x-4 hover-scale">
                    <div className="h-12 w-12 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg">info@unicumtec.de</span>
                  </div>
                  <div className="flex items-center space-x-4 hover-scale">
                    <div className="h-12 w-12 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg">+49 (0) 441 XXX XXX</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-6">Warum Unicum Tec?</h4>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-4 hover-scale">
                    <CheckCircle className="h-6 w-6 text-[hsl(var(--brand-success))]" />
                    <span className="text-lg">Lokaler Partner in Oldenburg</span>
                  </li>
                  <li className="flex items-center space-x-4 hover-scale">
                    <CheckCircle className="h-6 w-6 text-[hsl(var(--brand-success))]" />
                    <span className="text-lg">5+ Jahre Erfahrung</span>
                  </li>
                  <li className="flex items-center space-x-4 hover-scale">
                    <CheckCircle className="h-6 w-6 text-[hsl(var(--brand-success))]" />
                    <span className="text-lg">98% Kundenzufriedenheit</span>
                  </li>
                  <li className="flex items-center space-x-4 hover-scale">
                    <CheckCircle className="h-6 w-6 text-[hsl(var(--brand-success))]" />
                    <span className="text-lg">30 Tage Geld-zurück-Garantie</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-lg"></div>
                <span className="text-xl font-bold">Unicum Tec</span>
              </div>
              <p className="text-background/70 mb-4">
                Ihre Full-Service Digitalagentur für Webdesign, CRM-Systeme und IT-Services in Oldenburg.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-background/70">
                <li>Webdesign & Development</li>
                <li>CRM & HubSpot Solutions</li>
                <li>IT-Services & Smart Home</li>
                <li>Print Design & Branding</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-background/70">
                <li>Über uns</li>
                <li>Portfolio</li>
                <li>Blog</li>
                <li>Karriere</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-background/70">
                <li>Oldenburg, Niedersachsen</li>
                <li>info@unicumtec.de</li>
                <li>+49 (0) 441 XXX XXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
            <p>&copy; 2024 Unicum Tec. Alle Rechte vorbehalten. | Datenschutz | Impressum | AGB</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
