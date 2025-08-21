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
  MapPin
} from "lucide-react";
import { useState } from "react";

// Import generated images
import heroImage from "@/assets/hero-image.webp";
import webdesignService from "@/assets/webdesign-service.webp";
import crmService from "@/assets/crm-service.webp";
import itService from "@/assets/it-service.webp";
import printService from "@/assets/print-service.webp";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Alle");

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
      description: "Vollständige CRM-Integration für Online-Shop mit automatisierten Workflows und Analytics.",
      category: "E-Commerce",
      tags: ["React", "Node.js", "CRM"],
      image: "/placeholder.svg"
    },
    {
      title: "Corporate Website",
      description: "Moderne Corporate Website mit integriertem Lead-Management-System.",
      category: "Corporate", 
      tags: ["HTML5", "CSS3", "JavaScript"],
      image: "/placeholder.svg"
    },
    {
      title: "SaaS Platform",
      description: "Benutzerfreundliches Dashboard für SaaS-Anwendung mit erweiterten CRM-Features.",
      category: "SaaS",
      tags: ["Vue.js", "API", "Analytics"],
      image: "/placeholder.svg"
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm fixed top-0 w-full z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-left">
              <div className="h-10 w-10 bg-[hsl(var(--brand-primary))] rounded-lg flex items-center justify-center">
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
              <Button className="button-primary px-6 py-2.5">
                Beratung anfragen
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-gray-50 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Modern digital agency workspace" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-white/80"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-display text-[hsl(var(--brand-secondary))] animate-fade-up">
              Digitale Excellence
              <br />
              <span className="text-[hsl(var(--brand-primary))]">für Ihren Erfolg</span>
            </h1>
            <p className="text-xl text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto leading-relaxed">
              Unicum Tec - Ihre Full-Service Digitalagentur in Oldenburg. Wir transformieren Geschäftsprozesse durch innovative Webdesign-Lösungen, professionelle CRM-Systeme und modernste IT-Services.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up delay-400">
              <Button size="lg" className="button-primary px-10 py-4 text-lg">
                Portfolio entdecken
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))] hover:text-white">
                Kostenlose Beratung
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-heading text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up">Premium Services</h2>
            <p className="text-subheading text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto">
              Maßgeschneiderte Lösungen für Ihre digitale Transformation
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <Card key={index} className={`card-clean p-8 group animate-fade-up delay-${index * 100}`}>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-2/3">
                    <CardHeader className="p-0 mb-6">
                      <div className="h-16 w-16 bg-[hsl(var(--brand-primary))] rounded-lg flex items-center justify-center mb-6">
                        <service.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-4 text-[hsl(var(--brand-secondary))]">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-3">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-[hsl(var(--brand-success))]" />
                            <span className="text-sm font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>
                  <div className="lg:w-1/3">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-heading text-[hsl(var(--brand-secondary))] mb-6 animate-fade-up">Erfolgreiche Projekte</h2>
            <p className="text-subheading text-gray-600 animate-fade-up delay-200 max-w-3xl mx-auto">
              Innovative Lösungen, die begeistern und Ergebnisse liefern
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-up delay-300">
              {["Alle", "E-Commerce", "Corporate", "SaaS"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-6 py-2 font-medium transition-all duration-300 ${
                    activeTab === tab 
                      ? "button-primary" 
                      : "border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--brand-primary))] hover:text-white"
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
                <Card key={index} className={`card-clean group animate-fade-up delay-${index * 100} overflow-hidden`}>
                  <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <Monitor className="h-16 w-16 text-[hsl(var(--brand-primary))] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <CardTitle className="text-lg text-[hsl(var(--brand-secondary))] group-hover:text-[hsl(var(--brand-primary))] transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">
                        {project.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-medium border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))]">
                          {tag}
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
